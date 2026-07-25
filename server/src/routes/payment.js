import { Router } from 'express';
import db from '../db.js';
import { availableMethods, gatewayFor, isLive, PAYMENTS_MODE } from '../payments/index.js';

const router = Router();

// Remember where to send the customer back after a real gateway round-trip.
const returnOrigins = new Map();

const appUrl = (req) => process.env.APP_URL || `${req.protocol}://${req.get('host')}`;
const getOrder = (number) => db.prepare('SELECT * FROM orders WHERE order_number = ?').get(number);
function markPaid(number, paid) {
  db.prepare('UPDATE orders SET payment_status = ? WHERE order_number = ?').run(
    paid ? 'paid' : 'failed',
    number
  );
}

// GET /api/payment/config — which methods to show at checkout.
router.get('/config', (req, res) => {
  res.json({
    mode: PAYMENTS_MODE,
    currency: process.env.CURRENCY || 'PKR',
    methods: availableMethods(),
  });
});

// POST /api/payment/initiate — { order_number, method, return_origin }
// Returns instructions for the frontend to redirect to the gateway (or mock).
router.post('/initiate', (req, res) => {
  const { order_number, method, return_origin } = req.body || {};
  const order = getOrder(order_number);
  if (!order) return res.status(404).json({ error: 'Order not found' });
  if (method === 'cod') return res.json({ type: 'none' });

  const origin = return_origin || process.env.CLIENT_URL || 'http://localhost:5173';
  const returnUrl = `${appUrl(req)}/api/payment/return/${method}`;

  if (isLive(method)) {
    const gateway = gatewayFor(method);
    returnOrigins.set(order.order_number, origin);
    const form = gateway.buildForm(order, returnUrl);
    return res.json({ type: 'form', action: form.action, method: form.method, fields: form.fields });
  }

  // Sandbox: send the customer to our built-in mock gateway page.
  const url =
    `${appUrl(req)}/api/payment/mock?order=${encodeURIComponent(order.order_number)}` +
    `&method=${encodeURIComponent(method)}&return=${encodeURIComponent(origin)}`;
  res.json({ type: 'redirect', url });
});

// GET /api/payment/mock — a fake gateway page so the full flow is demoable
// without real merchant credentials. Replace with the real gateway in live mode.
router.get('/mock', (req, res) => {
  const { order: number, method, return: ret } = req.query;
  const order = getOrder(number);
  if (!order) return res.status(404).send('Order not found');
  const labels = { card: 'Debit / Credit Card', jazzcash: 'JazzCash', easypaisa: 'Easypaisa' };
  const complete = (status) =>
    `/api/payment/mock/complete?order=${encodeURIComponent(number)}&return=${encodeURIComponent(ret)}&status=${status}`;
  res.set('Content-Type', 'text/html').send(`<!doctype html>
<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Secure Payment — ${labels[method] || method}</title>
<style>
  body{margin:0;font-family:system-ui,-apple-system,sans-serif;background:#42301F;color:#2A241D;
    display:grid;place-items:center;min-height:100vh;padding:20px}
  .card{background:#FAF6EF;border-radius:24px;max-width:420px;width:100%;padding:32px;
    box-shadow:0 24px 60px -20px rgba(0,0,0,.4)}
  .badge{display:inline-block;background:#B8924F;color:#fff;font-size:12px;font-weight:600;
    padding:6px 12px;border-radius:999px;letter-spacing:.05em}
  h1{font-size:22px;margin:16px 0 4px}.muted{color:#6B6157;font-size:14px;margin:0}
  .row{display:flex;justify-content:space-between;padding:12px 0;border-bottom:1px solid #E8DDC9}
  .total{font-size:24px;font-weight:700;color:#42301F}
  button{width:100%;border:0;border-radius:999px;padding:14px;font-size:15px;font-weight:600;
    cursor:pointer;margin-top:10px}
  .pay{background:#B8924F;color:#fff}.cancel{background:transparent;color:#6B6157}
  .note{font-size:12px;color:#A88E6E;text-align:center;margin-top:16px}
</style></head>
<body><div class="card">
  <span class="badge">SANDBOX · TEST MODE</span>
  <h1>${labels[method] || method} Payment</h1>
  <p class="muted">Sami Jee Decor</p>
  <div style="margin:20px 0">
    <div class="row"><span class="muted">Order</span><strong>${order.order_number}</strong></div>
    <div class="row"><span class="muted">Amount</span><span class="total">Rs ${order.total.toLocaleString()}</span></div>
  </div>
  <a href="${complete('paid')}"><button class="pay">Pay Rs ${order.total.toLocaleString()}</button></a>
  <a href="${complete('failed')}"><button class="cancel">Cancel payment</button></a>
  <p class="note">This is a test gateway. No real money is charged.<br>
     Add live JazzCash / Easypaisa keys + set PAYMENTS_MODE=live to go live.</p>
</div></body></html>`);
});

// GET /api/payment/mock/complete — finishes the simulated payment.
router.get('/mock/complete', (req, res) => {
  const { order: number, return: ret, status } = req.query;
  const paid = status === 'paid';
  markPaid(number, paid);
  const origin = ret || process.env.CLIENT_URL || 'http://localhost:5173';
  res.redirect(`${origin}/order/${number}?paid=${paid ? 1 : 0}`);
});

// GET/POST /api/payment/return/:method — real gateway callback (live mode).
function handleReturn(req, res) {
  const method = req.params.method;
  const gateway = gatewayFor(method);
  const params = { ...req.query, ...req.body };
  if (!gateway) return res.status(400).send('Unknown payment method');

  // For JazzCash, verify the secure hash before trusting the result.
  if (gateway.verifyReturn && !gateway.verifyReturn(params)) {
    return res.status(400).send('Invalid payment signature');
  }
  const number = gateway.orderNumberFrom(params);
  const paid = gateway.isSuccess(params);
  if (number) markPaid(number, paid);

  const origin = returnOrigins.get(number) || process.env.CLIENT_URL || 'http://localhost:5173';
  returnOrigins.delete(number);
  res.redirect(`${origin}/order/${number}?paid=${paid ? 1 : 0}`);
}
router.get('/return/:method', handleReturn);
router.post('/return/:method', handleReturn);

export default router;

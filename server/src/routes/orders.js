import { Router } from 'express';
import { customAlphabet } from 'nanoid';
import db from '../db.js';
import { requireAuth, requireAdmin, optionalCustomerId } from '../middleware/auth.js';

const router = Router();
const orderId = customAlphabet('0123456789ABCDEFGHJKLMNPQRSTUVWXYZ', 8);

function hydrate(row) {
  if (!row) return row;
  return { ...row, items: JSON.parse(row.items || '[]') };
}

// Recompute totals on the server from the cart so the client cannot tamper with prices.
function priceCart(items) {
  let subtotal = 0;
  const lineItems = items.map((it) => {
    const p = db.prepare('SELECT id, name, price, sale_price, unit, images FROM products WHERE id = ?').get(it.id);
    if (!p) throw Object.assign(new Error(`Product ${it.id} not found`), { status: 400 });
    const unitPrice = p.sale_price ?? p.price;
    const qty = Math.max(1, Number(it.qty) || 1);
    const lineTotal = unitPrice * qty;
    subtotal += lineTotal;
    let image = '';
    try { image = JSON.parse(p.images || '[]')[0] || ''; } catch {}
    return { id: p.id, name: p.name, unit: p.unit, unitPrice, qty, lineTotal, image };
  });
  return { lineItems, subtotal };
}

// POST /api/orders  — create an order (guest checkout)
router.post('/', (req, res, next) => {
  try {
    const b = req.body || {};
    const { customer_name, phone } = b;
    if (!customer_name || !phone)
      return res.status(400).json({ error: 'Name and phone are required' });
    if (!Array.isArray(b.items) || b.items.length === 0)
      return res.status(400).json({ error: 'Cart is empty' });

    const { lineItems, subtotal } = priceCart(b.items);
    const shipping = subtotal >= 20000 ? 0 : 500; // free shipping over PKR 20,000
    const total = subtotal + shipping;
    const number = `SJD-${orderId()}`;
    const allowedMethods = ['cod', 'card', 'jazzcash', 'easypaisa'];
    const method = allowedMethods.includes(b.payment_method) ? b.payment_method : 'cod';

    const info = db
      .prepare(
        `INSERT INTO orders
          (order_number, customer_id, customer_name, email, phone, address, city, items, subtotal, shipping, total, payment_method, payment_status, status, notes)
         VALUES
          (@order_number, @customer_id, @customer_name, @email, @phone, @address, @city, @items, @subtotal, @shipping, @total, @payment_method, 'pending', 'pending', @notes)`
      )
      .run({
        order_number: number,
        customer_id: optionalCustomerId(req),
        customer_name,
        email: b.email || '',
        phone,
        address: b.address || '',
        city: b.city || '',
        items: JSON.stringify(lineItems),
        subtotal,
        shipping,
        total,
        payment_method: method,
        notes: b.notes || '',
      });

    res.status(201).json(hydrate(db.prepare('SELECT * FROM orders WHERE id = ?').get(info.lastInsertRowid)));
  } catch (e) {
    next(e);
  }
});

// GET /api/orders/track/:number  — public order tracking
router.get('/track/:number', (req, res) => {
  const row = db.prepare('SELECT * FROM orders WHERE order_number = ?').get(req.params.number);
  if (!row) return res.status(404).json({ error: 'Order not found' });
  res.json(hydrate(row));
});

// GET /api/orders  (admin) — list with optional status filter
router.get('/', requireAuth, requireAdmin, (req, res) => {
  const { status } = req.query;
  const rows = status
    ? db.prepare('SELECT * FROM orders WHERE status = ? ORDER BY created_at DESC').all(status)
    : db.prepare('SELECT * FROM orders ORDER BY created_at DESC').all();
  res.json(rows.map(hydrate));
});

// GET /api/orders/:id (admin)
router.get('/:id', requireAuth, requireAdmin, (req, res) => {
  const row = db.prepare('SELECT * FROM orders WHERE id = ?').get(req.params.id);
  if (!row) return res.status(404).json({ error: 'Order not found' });
  res.json(hydrate(row));
});

// PUT /api/orders/:id (admin) — update status / payment_status
router.put('/:id', requireAuth, requireAdmin, (req, res) => {
  const existing = db.prepare('SELECT * FROM orders WHERE id = ?').get(req.params.id);
  if (!existing) return res.status(404).json({ error: 'Order not found' });
  const { status, payment_status } = req.body || {};
  db.prepare('UPDATE orders SET status = ?, payment_status = ? WHERE id = ?').run(
    status ?? existing.status,
    payment_status ?? existing.payment_status,
    req.params.id
  );
  res.json(hydrate(db.prepare('SELECT * FROM orders WHERE id = ?').get(req.params.id)));
});

export default router;

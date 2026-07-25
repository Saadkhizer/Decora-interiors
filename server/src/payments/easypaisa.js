// Easypaisa (Easypay) hosted-checkout integration (AES-128-ECB hashed request).
// Docs: Easypaisa Merchant Portal > Easypay Integration Guide
//
// Set these in server/.env to go live:
//   EASYPAISA_STORE_ID, EASYPAISA_HASH_KEY (16-char AES key)
//   EASYPAISA_POST_URL (sandbox or production Easypay URL)
import crypto from 'crypto';

const SANDBOX_URL = 'https://easypaystg.easypaisa.com.pk/easypay/Index.jsf';

function pad(n) {
  return String(n).padStart(2, '0');
}
function expiry() {
  const d = new Date(Date.now() + 60 * 60 * 1000);
  return (
    d.getFullYear() +
    pad(d.getMonth() + 1) +
    pad(d.getDate()) +
    ' ' +
    pad(d.getHours()) +
    pad(d.getMinutes()) +
    pad(d.getSeconds())
  );
}

// Easypaisa hashed request: sorted "key=value&key=value" of non-empty params,
// AES-128-ECB encrypted with the 16-char hash key, base64 encoded.
function hashedRequest(params, key) {
  const sorted = Object.keys(params)
    .filter((k) => params[k] !== '' && params[k] != null)
    .sort()
    .map((k) => `${k}=${params[k]}`)
    .join('&');
  const cipher = crypto.createCipheriv('aes-128-ecb', Buffer.from(key, 'utf8'), null);
  let enc = cipher.update(sorted, 'utf8', 'base64');
  enc += cipher.final('base64');
  return enc;
}

export const easypaisa = {
  id: 'easypaisa',
  label: 'Easypaisa',
  enabled() {
    return Boolean(process.env.EASYPAISA_STORE_ID && process.env.EASYPAISA_HASH_KEY);
  },
  buildForm(order, returnUrl) {
    const base = {
      amount: order.total.toFixed(1),
      autoRedirect: '1',
      expiryDate: expiry(),
      orderRefNum: order.order_number,
      paymentMethod: 'MA_PAYMENT_METHOD', // Mobile Account; gateway also offers card
      postBackURL: returnUrl,
      storeId: process.env.EASYPAISA_STORE_ID,
    };
    const merchantHashedReq = hashedRequest(base, process.env.EASYPAISA_HASH_KEY);
    return {
      action: process.env.EASYPAISA_POST_URL || SANDBOX_URL,
      method: 'POST',
      fields: { ...base, merchantHashedReq },
    };
  },
  // Easypaisa posts back a status to the postBackURL.
  isSuccess(params) {
    const code = params.status || params.responseCode || params.paymentStatus;
    return code === '0000' || code === '0' || String(code).toUpperCase() === 'PAID';
  },
  orderNumberFrom(params) {
    return params.orderRefNum || params.orderRefNumber;
  },
};

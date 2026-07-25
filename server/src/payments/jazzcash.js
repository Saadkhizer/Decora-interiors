// JazzCash "Page Redirection" integration (HMAC-SHA256 secure hash).
// Docs: https://sandbox.jazzcash.com.pk  (Merchant > Integration)
//
// Set these in server/.env to go live:
//   JAZZCASH_MERCHANT_ID, JAZZCASH_PASSWORD, JAZZCASH_INTEGRITY_SALT
//   JAZZCASH_POST_URL (sandbox or production merchant form URL)
import crypto from 'crypto';

const SANDBOX_URL =
  'https://sandbox.jazzcash.com.pk/CustomerPortal/transactionmanagement/merchantform/';

function pad(n) {
  return String(n).padStart(2, '0');
}
function stamp(d) {
  return (
    d.getFullYear() +
    pad(d.getMonth() + 1) +
    pad(d.getDate()) +
    pad(d.getHours()) +
    pad(d.getMinutes()) +
    pad(d.getSeconds())
  );
}

// JazzCash hash: sorted non-empty VALUES joined by '&', prefixed with the salt,
// HMAC-SHA256 keyed by the salt, hex uppercase.
function secureHash(fields, salt) {
  const sortedKeys = Object.keys(fields)
    .filter((k) => k !== 'pp_SecureHash' && fields[k] !== '' && fields[k] != null)
    .sort();
  const message = salt + '&' + sortedKeys.map((k) => fields[k]).join('&');
  return crypto.createHmac('sha256', salt).update(message).digest('hex').toUpperCase();
}

export const jazzcash = {
  id: 'jazzcash',
  label: 'JazzCash',
  enabled() {
    return Boolean(
      process.env.JAZZCASH_MERCHANT_ID &&
        process.env.JAZZCASH_PASSWORD &&
        process.env.JAZZCASH_INTEGRITY_SALT
    );
  },
  buildForm(order, returnUrl) {
    const salt = process.env.JAZZCASH_INTEGRITY_SALT;
    const now = new Date();
    const expiry = new Date(now.getTime() + 60 * 60 * 1000);
    const fields = {
      pp_Version: '1.1',
      pp_TxnType: '',
      pp_Language: 'EN',
      pp_MerchantID: process.env.JAZZCASH_MERCHANT_ID,
      pp_SubMerchantID: '',
      pp_Password: process.env.JAZZCASH_PASSWORD,
      pp_BankID: '',
      pp_ProductID: '',
      pp_TxnRefNo: 'T' + stamp(now),
      pp_Amount: String(Math.round(order.total * 100)), // amount in paisa
      pp_TxnCurrency: 'PKR',
      pp_TxnDateTime: stamp(now),
      pp_BillReference: order.order_number,
      pp_Description: 'Order ' + order.order_number,
      pp_TxnExpiryDateTime: stamp(expiry),
      pp_ReturnURL: returnUrl,
      ppmpf_1: order.order_number,
    };
    fields.pp_SecureHash = secureHash(fields, salt);
    return { action: process.env.JAZZCASH_POST_URL || SANDBOX_URL, method: 'POST', fields };
  },
  // Validate the data JazzCash POSTs back to the return URL.
  verifyReturn(params) {
    const salt = process.env.JAZZCASH_INTEGRITY_SALT;
    const received = params.pp_SecureHash;
    const calculated = secureHash(params, salt);
    return Boolean(received) && received.toUpperCase() === calculated.toUpperCase();
  },
  isSuccess(params) {
    return params.pp_ResponseCode === '000';
  },
  orderNumberFrom(params) {
    return params.pp_BillReference || params.ppmpf_1;
  },
};

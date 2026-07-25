// Payment provider registry.
// Add a new gateway by creating a module with the same shape and registering it here.
import { jazzcash } from './jazzcash.js';
import { easypaisa } from './easypaisa.js';

// "card" is handled by routing through whichever gateway is live (both JazzCash and
// Easypaisa accept cards on their hosted page). In sandbox mode it's simulated.
export const providers = { jazzcash, easypaisa };

export const PAYMENTS_MODE = process.env.PAYMENTS_MODE || 'sandbox'; // 'sandbox' | 'live'

// Methods offered at checkout. COD always available.
export function availableMethods() {
  return [
    { id: 'cod', label: 'Cash on Delivery', live: true },
    { id: 'card', label: 'Debit / Credit Card', live: jazzcash.enabled() || easypaisa.enabled() },
    { id: 'jazzcash', label: 'JazzCash', live: jazzcash.enabled() },
    { id: 'easypaisa', label: 'Easypaisa', live: easypaisa.enabled() },
  ];
}

// Resolve the gateway used for a chosen method.
export function gatewayFor(method) {
  if (method === 'jazzcash') return jazzcash;
  if (method === 'easypaisa') return easypaisa;
  if (method === 'card') return jazzcash.enabled() ? jazzcash : easypaisa.enabled() ? easypaisa : null;
  return null;
}

// Live only when explicitly set AND the chosen gateway has credentials.
export function isLive(method) {
  if (PAYMENTS_MODE !== 'live') return false;
  const g = gatewayFor(method);
  return Boolean(g && g.enabled());
}

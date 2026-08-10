import jwt from 'jsonwebtoken';

const SECRET = process.env.JWT_SECRET;

// 'dev-secret' used to be the fallback here. Because this repo is public, anyone
// could read it and forge an admin token. In production we now refuse to boot
// without a real secret rather than silently using a guessable one.
if (!SECRET) {
  if (process.env.NODE_ENV === 'production') {
    throw new Error(
      'JWT_SECRET is not set. Add it in the Render dashboard (Environment tab) before deploying.'
    );
  }
  console.warn('⚠️  JWT_SECRET not set — using an insecure development-only secret.');
}

const ACTIVE_SECRET = SECRET || 'insecure-dev-only-secret';

export function signToken(user) {
  return jwt.sign({ id: user.id, email: user.email, role: user.role }, ACTIVE_SECRET, {
    expiresIn: '7d',
  });
}

// Verifies a Bearer token and attaches req.user. Use to protect admin routes.
export function requireAuth(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) return res.status(401).json({ error: 'Authentication required' });
  try {
    const decoded = jwt.verify(token, ACTIVE_SECRET);
    // Storefront customer tokens are signed with the same secret. Without this
    // check a customer token passes requireAuth, and /api/auth/me then looks up
    // the users table by the customer's id — so customer #1 would be shown
    // admin #1's record.
    if (decoded.type === 'customer') {
      return res.status(403).json({ error: 'Admin access required' });
    }
    req.user = decoded;
    next();
  } catch {
    res.status(401).json({ error: 'Invalid or expired session' });
  }
}

export function requireAdmin(req, res, next) {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }
  next();
}

// --- Storefront customer auth (separate token "type") --------------------
export function signCustomerToken(customer) {
  return jwt.sign({ id: customer.id, email: customer.email, type: 'customer' }, ACTIVE_SECRET, {
    expiresIn: '30d',
  });
}

// Protect customer-only routes (account, my orders).
export function requireCustomer(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) return res.status(401).json({ error: 'Please sign in' });
  try {
    const decoded = jwt.verify(token, ACTIVE_SECRET);
    if (decoded.type !== 'customer') throw new Error('wrong token');
    req.customer = decoded;
    next();
  } catch {
    res.status(401).json({ error: 'Invalid or expired session' });
  }
}

// Returns the customer id if a valid customer token is present, else null.
export function optionalCustomerId(req) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) return null;
  try {
    const decoded = jwt.verify(token, ACTIVE_SECRET);
    return decoded.type === 'customer' ? decoded.id : null;
  } catch {
    return null;
  }
}

import jwt from 'jsonwebtoken';

const SECRET = process.env.JWT_SECRET || 'dev-secret';

export function signToken(user) {
  return jwt.sign({ id: user.id, email: user.email, role: user.role }, SECRET, {
    expiresIn: '7d',
  });
}

// Verifies a Bearer token and attaches req.user. Use to protect admin routes.
export function requireAuth(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) return res.status(401).json({ error: 'Authentication required' });
  try {
    req.user = jwt.verify(token, SECRET);
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
  return jwt.sign({ id: customer.id, email: customer.email, type: 'customer' }, SECRET, {
    expiresIn: '30d',
  });
}

// Protect customer-only routes (account, my orders).
export function requireCustomer(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) return res.status(401).json({ error: 'Please sign in' });
  try {
    const decoded = jwt.verify(token, SECRET);
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
    const decoded = jwt.verify(token, SECRET);
    return decoded.type === 'customer' ? decoded.id : null;
  } catch {
    return null;
  }
}

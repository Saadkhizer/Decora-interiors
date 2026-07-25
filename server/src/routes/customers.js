import { Router } from 'express';
import bcrypt from 'bcryptjs';
import db from '../db.js';
import { signCustomerToken, requireCustomer } from '../middleware/auth.js';

const router = Router();

const publicCustomer = (c) => ({
  id: c.id,
  name: c.name,
  email: c.email,
  phone: c.phone,
  address: c.address,
  city: c.city,
});

// POST /api/customers/register
router.post('/register', (req, res) => {
  const { name, email, password, phone } = req.body || {};
  if (!name || !email || !password)
    return res.status(400).json({ error: 'Name, email and password are required' });
  if (password.length < 6)
    return res.status(400).json({ error: 'Password must be at least 6 characters' });

  const exists = db.prepare('SELECT id FROM customers WHERE email = ?').get(email.toLowerCase().trim());
  if (exists) return res.status(409).json({ error: 'An account with this email already exists' });

  const info = db
    .prepare('INSERT INTO customers (name, email, phone, password_hash) VALUES (?, ?, ?, ?)')
    .run(name, email.toLowerCase().trim(), phone || '', bcrypt.hashSync(password, 10));
  const customer = db.prepare('SELECT * FROM customers WHERE id = ?').get(info.lastInsertRowid);
  res.status(201).json({ token: signCustomerToken(customer), customer: publicCustomer(customer) });
});

// POST /api/customers/login
router.post('/login', (req, res) => {
  const { email, password } = req.body || {};
  const customer = db.prepare('SELECT * FROM customers WHERE email = ?').get((email || '').toLowerCase().trim());
  if (!customer || !bcrypt.compareSync(password || '', customer.password_hash))
    return res.status(401).json({ error: 'Invalid email or password' });
  res.json({ token: signCustomerToken(customer), customer: publicCustomer(customer) });
});

// GET /api/customers/me
router.get('/me', requireCustomer, (req, res) => {
  const customer = db.prepare('SELECT * FROM customers WHERE id = ?').get(req.customer.id);
  if (!customer) return res.status(404).json({ error: 'Account not found' });
  res.json({ customer: publicCustomer(customer) });
});

// PUT /api/customers/me — update profile
router.put('/me', requireCustomer, (req, res) => {
  const existing = db.prepare('SELECT * FROM customers WHERE id = ?').get(req.customer.id);
  if (!existing) return res.status(404).json({ error: 'Account not found' });
  const { name, phone, address, city } = req.body || {};
  db.prepare('UPDATE customers SET name = ?, phone = ?, address = ?, city = ? WHERE id = ?').run(
    name ?? existing.name,
    phone ?? existing.phone,
    address ?? existing.address,
    city ?? existing.city,
    req.customer.id
  );
  res.json({ customer: publicCustomer(db.prepare('SELECT * FROM customers WHERE id = ?').get(req.customer.id)) });
});

// GET /api/customers/orders — the logged-in customer's order history
router.get('/orders', requireCustomer, (req, res) => {
  const rows = db
    .prepare('SELECT * FROM orders WHERE customer_id = ? ORDER BY created_at DESC')
    .all(req.customer.id);
  res.json(rows.map((o) => ({ ...o, items: JSON.parse(o.items || '[]') })));
});

export default router;

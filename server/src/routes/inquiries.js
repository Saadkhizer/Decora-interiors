import { Router } from 'express';
import db from '../db.js';
import { requireAuth, requireAdmin } from '../middleware/auth.js';
import { formLimiter } from '../middleware/rateLimit.js';

const router = Router();

// POST /api/inquiries  — contact form or "request a quote" (public)
router.post('/', formLimiter, (req, res) => {
  const b = req.body || {};

  // Honeypot: a hidden field real users never fill in. Bots fill everything.
  // Return 201 so the bot believes it succeeded and does not retry.
  if (b.website) return res.status(201).json({ ok: true });

  if (!b.name || !b.message)
    return res.status(400).json({ error: 'Name and message are required' });

  // Cap field lengths — express.json allows 5mb, which is far more than any
  // legitimate contact form needs and makes the table easy to flood.
  const cap = (v, n) => String(v ?? '').slice(0, n).trim();
  if (String(b.message).length > 5000)
    return res.status(400).json({ error: 'Message is too long' });
  const info = db
    .prepare(
      `INSERT INTO inquiries (name, email, phone, subject, message, product_id, type, status)
       VALUES (@name, @email, @phone, @subject, @message, @product_id, @type, 'new')`
    )
    .run({
      name: cap(b.name, 120),
      email: cap(b.email, 200),
      phone: cap(b.phone, 40),
      subject: cap(b.subject, 200) || (b.type === 'quote' ? 'Quote request' : 'Contact enquiry'),
      message: cap(b.message, 5000),
      product_id: b.product_id || null,
      type: b.type === 'quote' ? 'quote' : 'contact',
    });
  res.status(201).json(db.prepare('SELECT * FROM inquiries WHERE id = ?').get(info.lastInsertRowid));
});

// GET /api/inquiries (admin)
router.get('/', requireAuth, requireAdmin, (req, res) => {
  const rows = db
    .prepare(
      `SELECT i.*, p.name AS product_name FROM inquiries i
       LEFT JOIN products p ON p.id = i.product_id ORDER BY i.created_at DESC`
    )
    .all();
  res.json(rows);
});

// PUT /api/inquiries/:id (admin) — update status
router.put('/:id', requireAuth, requireAdmin, (req, res) => {
  const existing = db.prepare('SELECT * FROM inquiries WHERE id = ?').get(req.params.id);
  if (!existing) return res.status(404).json({ error: 'Inquiry not found' });
  db.prepare('UPDATE inquiries SET status = ? WHERE id = ?').run(
    req.body?.status ?? existing.status,
    req.params.id
  );
  res.json(db.prepare('SELECT * FROM inquiries WHERE id = ?').get(req.params.id));
});

// DELETE /api/inquiries/:id (admin)
router.delete('/:id', requireAuth, requireAdmin, (req, res) => {
  db.prepare('DELETE FROM inquiries WHERE id = ?').run(req.params.id);
  res.json({ ok: true });
});

export default router;

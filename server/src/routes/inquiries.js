import { Router } from 'express';
import db from '../db.js';
import { requireAuth, requireAdmin } from '../middleware/auth.js';

const router = Router();

// POST /api/inquiries  — contact form or "request a quote" (public)
router.post('/', (req, res) => {
  const b = req.body || {};
  if (!b.name || !b.message)
    return res.status(400).json({ error: 'Name and message are required' });
  const info = db
    .prepare(
      `INSERT INTO inquiries (name, email, phone, subject, message, product_id, type, status)
       VALUES (@name, @email, @phone, @subject, @message, @product_id, @type, 'new')`
    )
    .run({
      name: b.name,
      email: b.email || '',
      phone: b.phone || '',
      subject: b.subject || (b.type === 'quote' ? 'Quote request' : 'Contact enquiry'),
      message: b.message,
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

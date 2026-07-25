import { Router } from 'express';
import db from '../db.js';
import { requireAuth, requireAdmin } from '../middleware/auth.js';

const router = Router();

// GET /api/gallery — project gallery images
router.get('/', (req, res) => {
  res.json(db.prepare('SELECT * FROM gallery ORDER BY sort_order, created_at DESC').all());
});

// POST /api/gallery (admin)
router.post('/', requireAuth, requireAdmin, (req, res) => {
  const { title, category, image, sort_order } = req.body || {};
  if (!image) return res.status(400).json({ error: 'Image is required' });
  const info = db
    .prepare('INSERT INTO gallery (title, category, image, sort_order) VALUES (?, ?, ?, ?)')
    .run(title || '', category || '', image, sort_order || 0);
  res.status(201).json(db.prepare('SELECT * FROM gallery WHERE id = ?').get(info.lastInsertRowid));
});

// DELETE /api/gallery/:id (admin)
router.delete('/:id', requireAuth, requireAdmin, (req, res) => {
  db.prepare('DELETE FROM gallery WHERE id = ?').run(req.params.id);
  res.json({ ok: true });
});

export default router;

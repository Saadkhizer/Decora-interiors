import { Router } from 'express';
import db from '../db.js';
import { requireAuth, requireAdmin } from '../middleware/auth.js';

const router = Router();

const slugify = (s) =>
  s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

// GET /api/categories  — list with product counts
router.get('/', (req, res) => {
  const rows = db
    .prepare(
      `SELECT c.*, (SELECT COUNT(*) FROM products p WHERE p.category_id = c.id) AS product_count
       FROM categories c ORDER BY c.sort_order, c.name`
    )
    .all();
  res.json(rows);
});

// GET /api/categories/:slug
router.get('/:slug', (req, res) => {
  const cat = db.prepare('SELECT * FROM categories WHERE slug = ?').get(req.params.slug);
  if (!cat) return res.status(404).json({ error: 'Category not found' });
  res.json(cat);
});

// POST /api/categories (admin)
router.post('/', requireAuth, requireAdmin, (req, res) => {
  const { name, tagline, description, image, sort_order } = req.body || {};
  if (!name) return res.status(400).json({ error: 'Name is required' });
  const slug = slugify(name);
  try {
    const info = db
      .prepare(
        `INSERT INTO categories (name, slug, tagline, description, image, sort_order)
         VALUES (?, ?, ?, ?, ?, ?)`
      )
      .run(name, slug, tagline || '', description || '', image || '', sort_order || 0);
    res.status(201).json(db.prepare('SELECT * FROM categories WHERE id = ?').get(info.lastInsertRowid));
  } catch (e) {
    res.status(400).json({ error: 'Category already exists or invalid data' });
  }
});

// PUT /api/categories/:id (admin)
router.put('/:id', requireAuth, requireAdmin, (req, res) => {
  const existing = db.prepare('SELECT * FROM categories WHERE id = ?').get(req.params.id);
  if (!existing) return res.status(404).json({ error: 'Category not found' });
  const { name, tagline, description, image, sort_order } = req.body || {};
  db.prepare(
    `UPDATE categories SET name=?, slug=?, tagline=?, description=?, image=?, sort_order=? WHERE id=?`
  ).run(
    name ?? existing.name,
    name ? slugify(name) : existing.slug,
    tagline ?? existing.tagline,
    description ?? existing.description,
    image ?? existing.image,
    sort_order ?? existing.sort_order,
    req.params.id
  );
  res.json(db.prepare('SELECT * FROM categories WHERE id = ?').get(req.params.id));
});

// DELETE /api/categories/:id (admin)
router.delete('/:id', requireAuth, requireAdmin, (req, res) => {
  db.prepare('DELETE FROM categories WHERE id = ?').run(req.params.id);
  res.json({ ok: true });
});

export default router;

import { Router } from 'express';
import db from '../db.js';
import { requireAuth, requireAdmin } from '../middleware/auth.js';

const router = Router();
const slugify = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

// GET /api/blog — published posts (admins can pass ?all=true)
router.get('/', (req, res) => {
  const all = req.query.all === 'true';
  const rows = all
    ? db.prepare('SELECT * FROM posts ORDER BY created_at DESC').all()
    : db.prepare('SELECT * FROM posts WHERE published = 1 ORDER BY created_at DESC').all();
  res.json(rows);
});

// GET /api/blog/:slug
router.get('/:slug', (req, res) => {
  const post = db.prepare('SELECT * FROM posts WHERE slug = ?').get(req.params.slug);
  if (!post) return res.status(404).json({ error: 'Post not found' });
  res.json(post);
});

// POST /api/blog (admin)
router.post('/', requireAuth, requireAdmin, (req, res) => {
  const b = req.body || {};
  if (!b.title) return res.status(400).json({ error: 'Title is required' });
  try {
    const info = db
      .prepare(
        `INSERT INTO posts (title, slug, excerpt, body, cover, author, tag, published)
         VALUES (@title, @slug, @excerpt, @body, @cover, @author, @tag, @published)`
      )
      .run({
        title: b.title,
        slug: slugify(b.title),
        excerpt: b.excerpt || '',
        body: b.body || '',
        cover: b.cover || '',
        author: b.author || 'Sami Jee Decor',
        tag: b.tag || '',
        published: b.published === false ? 0 : 1,
      });
    res.status(201).json(db.prepare('SELECT * FROM posts WHERE id = ?').get(info.lastInsertRowid));
  } catch {
    res.status(400).json({ error: 'Could not create post (duplicate title?)' });
  }
});

// PUT /api/blog/:id (admin)
router.put('/:id', requireAuth, requireAdmin, (req, res) => {
  const existing = db.prepare('SELECT * FROM posts WHERE id = ?').get(req.params.id);
  if (!existing) return res.status(404).json({ error: 'Post not found' });
  const b = req.body || {};
  db.prepare(
    `UPDATE posts SET title=@title, slug=@slug, excerpt=@excerpt, body=@body, cover=@cover, tag=@tag, published=@published WHERE id=@id`
  ).run({
    id: req.params.id,
    title: b.title ?? existing.title,
    slug: b.title ? slugify(b.title) : existing.slug,
    excerpt: b.excerpt ?? existing.excerpt,
    body: b.body ?? existing.body,
    cover: b.cover ?? existing.cover,
    tag: b.tag ?? existing.tag,
    published: b.published === undefined ? existing.published : b.published ? 1 : 0,
  });
  res.json(db.prepare('SELECT * FROM posts WHERE id = ?').get(req.params.id));
});

// DELETE /api/blog/:id (admin)
router.delete('/:id', requireAuth, requireAdmin, (req, res) => {
  db.prepare('DELETE FROM posts WHERE id = ?').run(req.params.id);
  res.json({ ok: true });
});

export default router;

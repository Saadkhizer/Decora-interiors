import { Router } from 'express';
import db from '../db.js';
import { requireAuth, requireAdmin } from '../middleware/auth.js';

const router = Router();

const slugify = (s) =>
  s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

// Parse JSON columns and attach category info for API responses.
function hydrate(row) {
  if (!row) return row;
  return {
    ...row,
    images: safeParse(row.images, []),
    specs: safeParse(row.specs, {}),
    in_stock: !!row.in_stock,
    featured: !!row.featured,
    is_new: !!row.is_new,
  };
}
function safeParse(v, fallback) {
  try {
    return JSON.parse(v);
  } catch {
    return fallback;
  }
}

// GET /api/products
// Query: category(slug), search, featured, isNew, sort, page, limit, minPrice, maxPrice
router.get('/', (req, res) => {
  const {
    category,
    search,
    featured,
    isNew,
    sort = 'newest',
    page = 1,
    limit = 12,
    minPrice,
    maxPrice,
  } = req.query;

  const where = [];
  const params = {};

  if (category) {
    where.push('cat.slug = @category');
    params.category = category;
  }
  if (search) {
    where.push('(p.name LIKE @q OR p.short_desc LIKE @q OR cat.name LIKE @q)');
    params.q = `%${search}%`;
  }
  if (featured === 'true') where.push('p.featured = 1');
  if (isNew === 'true') where.push('p.is_new = 1');
  if (minPrice) {
    where.push('COALESCE(p.sale_price, p.price) >= @minPrice');
    params.minPrice = Number(minPrice);
  }
  if (maxPrice) {
    where.push('COALESCE(p.sale_price, p.price) <= @maxPrice');
    params.maxPrice = Number(maxPrice);
  }

  const whereSql = where.length ? `WHERE ${where.join(' AND ')}` : '';

  const sortMap = {
    newest: 'p.created_at DESC',
    'price-asc': 'COALESCE(p.sale_price, p.price) ASC',
    'price-desc': 'COALESCE(p.sale_price, p.price) DESC',
    rating: 'p.rating DESC',
    name: 'p.name ASC',
  };
  const orderSql = sortMap[sort] || sortMap.newest;

  const lim = Math.min(Number(limit) || 12, 100);
  const off = (Math.max(Number(page) || 1, 1) - 1) * lim;

  const base = `FROM products p JOIN categories cat ON cat.id = p.category_id ${whereSql}`;
  const total = db.prepare(`SELECT COUNT(*) AS c ${base}`).get(params).c;
  const rows = db
    .prepare(
      `SELECT p.*, cat.name AS category_name, cat.slug AS category_slug
       ${base} ORDER BY ${orderSql} LIMIT @lim OFFSET @off`
    )
    .all({ ...params, lim, off });

  res.json({
    products: rows.map(hydrate),
    total,
    page: Number(page),
    pages: Math.ceil(total / lim),
  });
});

// GET /api/products/:slug  (also returns related products)
router.get('/:slug', (req, res) => {
  const row = db
    .prepare(
      `SELECT p.*, cat.name AS category_name, cat.slug AS category_slug
       FROM products p JOIN categories cat ON cat.id = p.category_id WHERE p.slug = ?`
    )
    .get(req.params.slug);
  if (!row) return res.status(404).json({ error: 'Product not found' });

  const related = db
    .prepare(
      `SELECT p.*, cat.name AS category_name, cat.slug AS category_slug
       FROM products p JOIN categories cat ON cat.id = p.category_id
       WHERE p.category_id = ? AND p.id != ? ORDER BY RANDOM() LIMIT 4`
    )
    .all(row.category_id, row.id);

  res.json({ product: hydrate(row), related: related.map(hydrate) });
});

// POST /api/products (admin)
router.post('/', requireAuth, requireAdmin, (req, res) => {
  const b = req.body || {};
  if (!b.name || !b.category_id || b.price == null)
    return res.status(400).json({ error: 'name, category_id and price are required' });
  try {
    const info = db
      .prepare(
        `INSERT INTO products
          (name, slug, category_id, price, sale_price, unit, short_desc, description, images, specs, in_stock, featured, is_new, sku)
         VALUES
          (@name, @slug, @category_id, @price, @sale_price, @unit, @short_desc, @description, @images, @specs, @in_stock, @featured, @is_new, @sku)`
      )
      .run({
        name: b.name,
        slug: slugify(b.name),
        category_id: b.category_id,
        price: b.price,
        sale_price: b.sale_price || null,
        unit: b.unit || 'piece',
        short_desc: b.short_desc || '',
        description: b.description || '',
        images: JSON.stringify(b.images || []),
        specs: JSON.stringify(b.specs || {}),
        in_stock: b.in_stock === false ? 0 : 1,
        featured: b.featured ? 1 : 0,
        is_new: b.is_new ? 1 : 0,
        sku: b.sku || null,
      });
    res.status(201).json(hydrate(db.prepare('SELECT * FROM products WHERE id = ?').get(info.lastInsertRowid)));
  } catch (e) {
    res.status(400).json({ error: 'Could not create product (duplicate name?)' });
  }
});

// PUT /api/products/:id (admin)
router.put('/:id', requireAuth, requireAdmin, (req, res) => {
  const existing = db.prepare('SELECT * FROM products WHERE id = ?').get(req.params.id);
  if (!existing) return res.status(404).json({ error: 'Product not found' });
  const b = req.body || {};
  db.prepare(
    `UPDATE products SET
      name=@name, slug=@slug, category_id=@category_id, price=@price, sale_price=@sale_price,
      unit=@unit, short_desc=@short_desc, description=@description, images=@images, specs=@specs,
      in_stock=@in_stock, featured=@featured, is_new=@is_new, sku=@sku
     WHERE id=@id`
  ).run({
    id: req.params.id,
    name: b.name ?? existing.name,
    slug: b.name ? slugify(b.name) : existing.slug,
    category_id: b.category_id ?? existing.category_id,
    price: b.price ?? existing.price,
    sale_price: b.sale_price !== undefined ? b.sale_price : existing.sale_price,
    unit: b.unit ?? existing.unit,
    short_desc: b.short_desc ?? existing.short_desc,
    description: b.description ?? existing.description,
    images: b.images ? JSON.stringify(b.images) : existing.images,
    specs: b.specs ? JSON.stringify(b.specs) : existing.specs,
    in_stock: b.in_stock === undefined ? existing.in_stock : b.in_stock ? 1 : 0,
    featured: b.featured === undefined ? existing.featured : b.featured ? 1 : 0,
    is_new: b.is_new === undefined ? existing.is_new : b.is_new ? 1 : 0,
    sku: b.sku ?? existing.sku,
  });
  res.json(hydrate(db.prepare('SELECT * FROM products WHERE id = ?').get(req.params.id)));
});

// DELETE /api/products/:id (admin)
router.delete('/:id', requireAuth, requireAdmin, (req, res) => {
  db.prepare('DELETE FROM products WHERE id = ?').run(req.params.id);
  res.json({ ok: true });
});

export default router;

// SQLite database connection + schema.
// Uses better-sqlite3 (synchronous, zero-config, file-based).
// The database file lives at server/data/decora.db and is created automatically.
import Database from 'better-sqlite3';
import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dataDir = path.join(__dirname, '..', 'data');
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });

const db = new Database(path.join(dataDir, 'decora.db'));
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

// --- Schema --------------------------------------------------------------
db.exec(`
  CREATE TABLE IF NOT EXISTS categories (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    name        TEXT NOT NULL,
    slug        TEXT NOT NULL UNIQUE,
    tagline     TEXT,
    description TEXT,
    image       TEXT,
    sort_order  INTEGER DEFAULT 0
  );

  CREATE TABLE IF NOT EXISTS products (
    id            INTEGER PRIMARY KEY AUTOINCREMENT,
    name          TEXT NOT NULL,
    slug          TEXT NOT NULL UNIQUE,
    category_id   INTEGER NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
    price         REAL NOT NULL,
    sale_price    REAL,
    unit          TEXT DEFAULT 'piece',          -- e.g. 'roll', 'sq ft', 'piece'
    short_desc    TEXT,
    description   TEXT,
    images        TEXT DEFAULT '[]',             -- JSON array of image URLs
    specs         TEXT DEFAULT '{}',             -- JSON object of spec key/values
    rating        REAL DEFAULT 4.7,
    review_count  INTEGER DEFAULT 0,
    in_stock      INTEGER DEFAULT 1,
    featured      INTEGER DEFAULT 0,
    is_new        INTEGER DEFAULT 0,
    sku           TEXT,
    created_at    TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS orders (
    id              INTEGER PRIMARY KEY AUTOINCREMENT,
    order_number    TEXT NOT NULL UNIQUE,
    customer_name   TEXT NOT NULL,
    email           TEXT,
    phone           TEXT NOT NULL,
    address         TEXT,
    city            TEXT,
    items           TEXT NOT NULL,               -- JSON array of line items
    subtotal        REAL NOT NULL,
    shipping        REAL DEFAULT 0,
    total           REAL NOT NULL,
    payment_method  TEXT DEFAULT 'cod',          -- 'cod' | 'card'
    payment_status  TEXT DEFAULT 'pending',      -- 'pending' | 'paid' | 'failed'
    status          TEXT DEFAULT 'pending',      -- pending|confirmed|processing|shipped|delivered|cancelled
    notes           TEXT,
    created_at      TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS inquiries (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    name        TEXT NOT NULL,
    email       TEXT,
    phone       TEXT,
    subject     TEXT,
    message     TEXT NOT NULL,
    product_id  INTEGER REFERENCES products(id) ON DELETE SET NULL,
    type        TEXT DEFAULT 'contact',          -- 'contact' | 'quote'
    status      TEXT DEFAULT 'new',              -- 'new' | 'read' | 'responded'
    created_at  TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS users (
    id            INTEGER PRIMARY KEY AUTOINCREMENT,
    name          TEXT,
    email         TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    role          TEXT DEFAULT 'admin',
    created_at    TEXT DEFAULT (datetime('now'))
  );

  -- Storefront customer accounts (separate from admin users)
  CREATE TABLE IF NOT EXISTS customers (
    id            INTEGER PRIMARY KEY AUTOINCREMENT,
    name          TEXT NOT NULL,
    email         TEXT NOT NULL UNIQUE,
    phone         TEXT,
    password_hash TEXT NOT NULL,
    address       TEXT,
    city          TEXT,
    created_at    TEXT DEFAULT (datetime('now'))
  );

  -- Blog / journal posts
  CREATE TABLE IF NOT EXISTS posts (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    title       TEXT NOT NULL,
    slug        TEXT NOT NULL UNIQUE,
    excerpt     TEXT,
    body        TEXT,
    cover       TEXT,
    author      TEXT DEFAULT 'Sami Jee Decor',
    tag         TEXT,
    published   INTEGER DEFAULT 1,
    created_at  TEXT DEFAULT (datetime('now'))
  );

  -- Project gallery (completed work)
  CREATE TABLE IF NOT EXISTS gallery (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    title       TEXT,
    category    TEXT,
    image       TEXT NOT NULL,
    sort_order  INTEGER DEFAULT 0,
    created_at  TEXT DEFAULT (datetime('now'))
  );
`);

// --- Lightweight migrations (safe to run repeatedly) ---------------------
function addColumn(table, column, def) {
  const cols = db.prepare(`PRAGMA table_info(${table})`).all();
  if (!cols.some((c) => c.name === column)) {
    db.exec(`ALTER TABLE ${table} ADD COLUMN ${column} ${def}`);
  }
}
addColumn('orders', 'customer_id', 'INTEGER');

export default db;

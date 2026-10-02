// Sync the admin account in the existing database with ADMIN_EMAIL / ADMIN_PASSWORD
// from server/.env. Does NOT touch products, orders, customers or anything else.
// Usage (from the server folder):  node src/reset-admin.js
import 'dotenv/config';
import bcrypt from 'bcryptjs';
import db from './db.js';

const email = (process.env.ADMIN_EMAIL || '').toLowerCase().trim();
const password = process.env.ADMIN_PASSWORD || '';

if (!email || !password) {
  console.error('ADMIN_EMAIL and ADMIN_PASSWORD must both be set in server/.env');
  process.exit(1);
}

const hash = bcrypt.hashSync(password, 10);
const byEmail = db.prepare('SELECT id FROM users WHERE lower(email) = ?').get(email);
const anyAdmin = db.prepare("SELECT id FROM users WHERE role = 'admin' ORDER BY id LIMIT 1").get();
const target = byEmail || anyAdmin;

if (target) {
  db.prepare("UPDATE users SET email = ?, password_hash = ?, role = 'admin' WHERE id = ?").run(email, hash, target.id);
  console.log(`Updated admin #${target.id} -> ${email}`);
} else {
  db.prepare("INSERT INTO users (name, email, password_hash, role) VALUES ('Store Admin', ?, ?, 'admin')").run(email, hash);
  console.log(`Created admin -> ${email}`);
}
console.log('Done. Log in at /admin/login with the values from server/.env');

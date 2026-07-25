// ============================================================================
//  DEMO API — a client-side stand-in for the backend so the whole site works
//  on a static host (Netlify) with NO server. Active when there is no
//  VITE_API_URL in a production build (or when forced via localStorage 'sjd_demo').
// ============================================================================
import {
  categories,
  products,
  posts,
  gallery,
  seedInquiries,
  demoCustomer,
  demoAdmin,
} from './demoData.js';

export const isDemo =
  import.meta.env.VITE_DEMO === 'true' ||
  (import.meta.env.PROD && !import.meta.env.VITE_API_URL) ||
  (typeof window !== 'undefined' && window.localStorage.getItem('sjd_demo') === '1');

const LS = { orders: 'sjd_demo_orders', inquiries: 'sjd_demo_inquiries', customers: 'sjd_demo_customers' };
const load = (k, fb) => { try { return JSON.parse(localStorage.getItem(k)) ?? fb; } catch { return fb; } };
const save = (k, v) => localStorage.setItem(k, JSON.stringify(v));
const delay = (v) => new Promise((res) => setTimeout(() => res(v), 120));
const fail = (message, status = 400) => Promise.reject(Object.assign(new Error(message), { status }));
const eff = (p) => p.sale_price ?? p.price;

function parse(raw) {
  const [path, qs] = raw.split('?');
  return { path, q: Object.fromEntries(new URLSearchParams(qs || '')) };
}
function customerIdFromToken() {
  const t = localStorage.getItem('sjd_customer_token') || '';
  return t.startsWith('demo-cust-') ? Number(t.slice(10)) : null;
}
function allCustomers() {
  return [demoCustomer, ...load(LS.customers, [])];
}
const publicCustomer = (c) => ({ id: c.id, name: c.name, email: c.email, phone: c.phone, address: c.address, city: c.city });

export async function demoRequest(raw, { method = 'GET', body } = {}) {
  const { path, q } = parse(raw);
  const m = (re) => path.match(re);

  // ---- Categories ----
  if (path === '/categories') return delay(categories);
  if (m(/^\/categories\/(.+)$/)) {
    const c = categories.find((x) => x.slug === m(/^\/categories\/(.+)$/)[1]);
    return c ? delay(c) : fail('Category not found', 404);
  }

  // ---- Products ----
  if (path === '/products' && method === 'GET') {
    let list = products.slice();
    if (q.category) list = list.filter((p) => p.category_slug === q.category);
    if (q.search) {
      const s = q.search.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(s) ||
          (p.short_desc || '').toLowerCase().includes(s) ||
          p.category_name.toLowerCase().includes(s)
      );
    }
    if (q.featured === 'true') list = list.filter((p) => p.featured);
    if (q.isNew === 'true') list = list.filter((p) => p.is_new);
    if (q.minPrice) list = list.filter((p) => eff(p) >= +q.minPrice);
    if (q.maxPrice) list = list.filter((p) => eff(p) <= +q.maxPrice);
    const sort = q.sort || 'newest';
    if (sort === 'price-asc') list.sort((a, b) => eff(a) - eff(b));
    else if (sort === 'price-desc') list.sort((a, b) => eff(b) - eff(a));
    else if (sort === 'rating') list.sort((a, b) => b.rating - a.rating);
    else if (sort === 'name') list.sort((a, b) => a.name.localeCompare(b.name));
    else list.sort((a, b) => b.id - a.id);
    const limit = Math.min(+q.limit || 12, 100);
    const page = Math.max(+q.page || 1, 1);
    const total = list.length;
    const paged = list.slice((page - 1) * limit, (page - 1) * limit + limit);
    return delay({ products: paged, total, page, pages: Math.max(1, Math.ceil(total / limit)) });
  }
  if (m(/^\/products\/(.+)$/) && method === 'GET') {
    const slug = m(/^\/products\/(.+)$/)[1];
    const p = products.find((x) => x.slug === slug);
    if (!p) return fail('Product not found', 404);
    const related = products.filter((x) => x.category_id === p.category_id && x.id !== p.id).slice(0, 4);
    return delay({ product: p, related });
  }
  // Admin product mutations (simulated — not persisted)
  if (path === '/products' && method === 'POST') return delay({ ...body, id: Date.now() });
  if (m(/^\/products\/\d+$/)) return delay({ ok: true });

  // ---- Blog ----
  if (path === '/blog') return delay(posts);
  if (m(/^\/blog\/(.+)$/) && method === 'GET') {
    const post = posts.find((x) => x.slug === m(/^\/blog\/(.+)$/)[1]);
    return post ? delay(post) : fail('Post not found', 404);
  }
  if (path === '/blog' && method === 'POST') return delay({ ...body, id: Date.now(), slug: 'demo', created_at: new Date().toISOString() });
  if (m(/^\/blog\/\d+$/)) return delay({ ok: true });

  // ---- Gallery ----
  if (path === '/gallery' && method === 'GET') return delay(gallery);
  if (path === '/gallery' && method === 'POST') return delay({ ...body, id: Date.now() });
  if (m(/^\/gallery\/\d+$/)) return delay({ ok: true });

  // ---- Payments ----
  if (path === '/payment/config') {
    return delay({
      mode: 'sandbox',
      currency: 'PKR',
      methods: [
        { id: 'cod', label: 'Cash on Delivery', live: true },
        { id: 'card', label: 'Debit / Credit Card', live: true },
        { id: 'jazzcash', label: 'JazzCash', live: true },
        { id: 'easypaisa', label: 'Easypaisa', live: true },
      ],
    });
  }
  if (path === '/payment/initiate' && method === 'POST') {
    const orders = load(LS.orders, []);
    const o = orders.find((x) => x.order_number === body.order_number);
    if (o && body.method !== 'cod') {
      o.payment_status = 'paid';
      save(LS.orders, orders);
    }
    return delay({ type: 'none' }); // checkout proceeds straight to the confirmation
  }

  // ---- Orders ----
  if (path === '/orders' && method === 'POST') {
    let subtotal = 0;
    const items = (body.items || []).map((it) => {
      const p = products.find((x) => x.id === it.id);
      if (!p) throw Object.assign(new Error('Product not found'), { status: 400 });
      const unitPrice = eff(p);
      const qty = Math.max(1, +it.qty || 1);
      const lineTotal = unitPrice * qty;
      subtotal += lineTotal;
      return { id: p.id, name: p.name, unit: p.unit, unitPrice, qty, lineTotal, image: p.images[0] };
    });
    const shipping = subtotal >= 20000 ? 0 : 500;
    const allowed = ['cod', 'card', 'jazzcash', 'easypaisa'];
    const order = {
      id: Date.now(),
      order_number: 'SJD-' + Math.random().toString(36).slice(2, 10).toUpperCase(),
      customer_id: customerIdFromToken(),
      customer_name: body.customer_name,
      email: body.email || '',
      phone: body.phone,
      address: body.address || '',
      city: body.city || '',
      items,
      subtotal,
      shipping,
      total: subtotal + shipping,
      payment_method: allowed.includes(body.payment_method) ? body.payment_method : 'cod',
      payment_status: 'pending',
      status: 'pending',
      notes: body.notes || '',
      created_at: new Date().toISOString(),
    };
    const orders = load(LS.orders, []);
    orders.unshift(order);
    save(LS.orders, orders);
    return delay(order);
  }
  if (m(/^\/orders\/track\/(.+)$/)) {
    const num = m(/^\/orders\/track\/(.+)$/)[1];
    const o = load(LS.orders, []).find((x) => x.order_number === num);
    return o ? delay(o) : fail('Order not found', 404);
  }
  if (path === '/orders' && method === 'GET') return delay(load(LS.orders, []));
  if (m(/^\/orders\/\d+$/) && method === 'PUT') {
    const orders = load(LS.orders, []);
    const o = orders.find((x) => String(x.id) === path.split('/')[2]);
    if (o) Object.assign(o, body);
    save(LS.orders, orders);
    return delay(o || { ok: true });
  }

  // ---- Inquiries ----
  if (path === '/inquiries' && method === 'POST') {
    const list = load(LS.inquiries, []);
    const inq = { ...body, id: Date.now(), status: 'new', created_at: new Date().toISOString() };
    list.unshift(inq);
    save(LS.inquiries, list);
    return delay(inq);
  }
  if (path === '/inquiries' && method === 'GET') return delay([...load(LS.inquiries, []), ...seedInquiries]);
  if (m(/^\/inquiries\/\d+$/)) return delay({ ok: true });

  // ---- Admin auth ----
  if (path === '/auth/login' && method === 'POST') {
    if (body.email === demoAdmin.email && body.password === demoAdmin.password) {
      const { password, ...user } = demoAdmin;
      return delay({ token: 'demo-admin', user });
    }
    return fail('Invalid email or password', 401);
  }
  if (path === '/auth/me') {
    const { password, ...user } = demoAdmin;
    return delay({ user });
  }

  // ---- Customer auth ----
  if (path === '/customers/login' && method === 'POST') {
    const c = allCustomers().find((x) => x.email === (body.email || '').toLowerCase().trim());
    if (!c || c.password !== body.password) return fail('Invalid email or password', 401);
    return delay({ token: `demo-cust-${c.id}`, customer: publicCustomer(c) });
  }
  if (path === '/customers/register' && method === 'POST') {
    if (!body.name || !body.email || !body.password) return fail('Name, email and password are required');
    const existing = allCustomers().find((x) => x.email === body.email.toLowerCase().trim());
    if (existing) return fail('An account with this email already exists', 409);
    const stored = load(LS.customers, []);
    const c = { id: 1000 + stored.length, name: body.name, email: body.email.toLowerCase().trim(), phone: body.phone || '', address: '', city: '', password: body.password };
    stored.push(c);
    save(LS.customers, stored);
    return delay({ token: `demo-cust-${c.id}`, customer: publicCustomer(c) });
  }
  if (path === '/customers/me') {
    const id = customerIdFromToken();
    const c = allCustomers().find((x) => x.id === id);
    return c ? delay({ customer: publicCustomer(c) }) : fail('Account not found', 404);
  }
  if (path === '/customers/me' && method === 'PUT') {
    return delay({ customer: { ...publicCustomer(demoCustomer), ...body } });
  }
  if (path === '/customers/orders') {
    const id = customerIdFromToken();
    return delay(load(LS.orders, []).filter((o) => o.customer_id === id));
  }

  // Fallback: empty success so the UI never hard-crashes in demo mode.
  return delay(method === 'GET' ? [] : { ok: true });
}

// FileReader-based "upload" so the admin image picker works offline.
export function demoUpload(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve({ url: reader.result });
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

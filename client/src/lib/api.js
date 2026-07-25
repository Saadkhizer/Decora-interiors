// Tiny fetch wrapper around the backend API.
// In dev, requests go through the Vite proxy (relative /api). In prod set VITE_API_URL.
// When no backend is configured (static Netlify deploy), requests are served by a
// bundled client-side demo API so the whole site still works. See lib/demoApi.js.
import { isDemo, demoRequest, demoUpload } from './demoApi.js';

const BASE = import.meta.env.VITE_API_URL || '';

function getToken() {
  return localStorage.getItem('decora_token'); // admin token
}
function getCustomerToken() {
  return localStorage.getItem('sjd_customer_token');
}

async function request(path, { method = 'GET', body, auth = false, customerAuth = false, headers = {} } = {}) {
  // Static/no-backend deploy → serve from the bundled demo API.
  if (isDemo) return demoRequest(path, { method, body });

  const opts = { method, headers: { ...headers } };
  if (body !== undefined) {
    opts.headers['Content-Type'] = 'application/json';
    opts.body = JSON.stringify(body);
  }
  if (auth) {
    const token = getToken();
    if (token) opts.headers['Authorization'] = `Bearer ${token}`;
  }
  if (customerAuth) {
    const token = getCustomerToken();
    if (token) opts.headers['Authorization'] = `Bearer ${token}`;
  }
  const res = await fetch(`${BASE}/api${path}`, opts);
  const isJson = res.headers.get('content-type')?.includes('application/json');
  const data = isJson ? await res.json() : await res.text();
  if (!res.ok) {
    throw new Error((data && data.error) || `Request failed (${res.status})`);
  }
  return data;
}

export const api = {
  get: (p, opts) => request(p, opts),
  post: (p, body, opts) => request(p, { method: 'POST', body, ...opts }),
  put: (p, body, opts) => request(p, { method: 'PUT', body, ...opts }),
  del: (p, opts) => request(p, { method: 'DELETE', ...opts }),

  // Multipart upload (admin image upload)
  async upload(file) {
    if (isDemo) return demoUpload(file);
    const fd = new FormData();
    fd.append('image', file);
    const res = await fetch(`${BASE}/api/upload`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${getToken()}` },
      body: fd,
    });
    if (!res.ok) throw new Error('Upload failed');
    return res.json();
  },
};

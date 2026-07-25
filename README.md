# Sami Jee Decor — Full-Stack E-commerce

A complete, responsive online store for an interior-finishing business selling
**wallpaper, window blinds, wooden & vinyl flooring, glass paper, artificial grass,
folding doors and wall panels** — with a customer storefront, customer accounts,
online payments (JazzCash / Easypaisa / Card / COD), a blog, a project gallery,
**and** a full admin panel.

Built with a clean, well-commented codebase so it's easy to edit and rebrand.

---

## ✨ Features

**Storefront**
- Warm interior-design look (beige / cream / wood / sage / brass), fully responsive
- Home, Shop (category + price filters, sort, search, pagination), product detail with gallery & specs
- **Cart** + slide-in drawer, **checkout**, order confirmation, **order tracking**
- **Customer accounts** — register / login, profile, order history
- **Online payments** — JazzCash, Easypaisa, Debit/Credit Card, Cash on Delivery
- **Journal / Blog** and a **Project Gallery** (with lightbox)
- Contact + "Request a quote" forms, WhatsApp integration, showrooms & map
- Accessible (focus states, alt text, keyboard nav, reduced-motion)

**Admin panel** (`/admin`)
- Secure login + dashboard (revenue, orders, products, inquiries)
- Manage **products** (image upload, specs, flags), **orders** (status & payment),
  **inquiries**, **blog posts**, and the **project gallery**

**Backend**
- REST API (Express) + SQLite (zero config — just a file)
- JWT auth (admin + customers), server-side price validation, image upload
- Pluggable **payment gateways** with a built-in **sandbox** for testing

---

## 🧱 Tech stack

| Layer    | Tech |
|----------|------|
| Frontend | React 18, Vite, React Router, Tailwind CSS, Framer Motion, Lucide icons |
| Backend  | Node.js, Express, better-sqlite3, JWT, bcrypt, Multer |
| Payments | JazzCash + Easypaisa + Card + Cash on Delivery (sandbox & live) |

---

## 🚀 Quick start

**Prerequisites:** Node.js 18+ (tested on Node 22).

```bash
# From the decora-interiors folder
npm run install:all                       # installs root + server + client
copy server\.env.example server\.env      # (macOS/Linux: cp server/.env.example server/.env)
npm run seed                              # sample data + admin & demo customer
npm run dev                               # runs API + frontend together
```

Open:
- **Storefront:** http://localhost:5173
- **Admin:** http://localhost:5173/admin  →  `admin@samijeedecor.com` / `admin123`
- **Customer demo:** http://localhost:5173/account/login → `customer@example.com` / `customer123`
- **API:** http://localhost:4100/api/health

---

## 💳 Payments

The checkout supports **Cash on Delivery, JazzCash, Easypaisa and Card**.

**Sandbox mode (default):** With `PAYMENTS_MODE=sandbox` (and no gateway keys), online
payments go through a **built-in mock gateway** so you can demo the full
checkout → pay → confirmation flow without any merchant account. No real money moves.

**Going live:** Add your client's merchant credentials in `server/.env` and set
`PAYMENTS_MODE=live`:

```
PAYMENTS_MODE=live

# JazzCash (from the JazzCash merchant portal)
JAZZCASH_MERCHANT_ID=...
JAZZCASH_PASSWORD=...
JAZZCASH_INTEGRITY_SALT=...
JAZZCASH_POST_URL=https://payments.jazzcash.com.pk/CustomerPortal/transactionmanagement/merchantform/

# Easypaisa (from the Easypaisa merchant portal)
EASYPAISA_STORE_ID=...
EASYPAISA_HASH_KEY=...
EASYPAISA_POST_URL=https://easypay.easypaisa.com.pk/easypay/Index.jsf
```

Also set `APP_URL` (this API's public URL) and `CLIENT_URL` (the storefront URL) so the
gateways can redirect customers back correctly.

- **JazzCash** uses HMAC-SHA256 "secure hash" page redirection — implemented in
  `server/src/payments/jazzcash.js`. JazzCash's hosted page accepts wallet **and** card.
- **Easypaisa** uses the AES-hashed Easypay redirect — `server/src/payments/easypaisa.js`.
- **Card** routes through whichever gateway is enabled.
- Add another gateway (e.g. Safepay) by dropping a module into `server/src/payments/`
  and registering it in `server/src/payments/index.js`.

> Final end-to-end testing of live payments must be done with the gateway's own
> sandbox/live credentials in their test environment.

---

## 🎨 Customise it for your client

1. **Brand, phone, WhatsApp, address, socials, showrooms** → edit
   [`client/src/config/site.js`](client/src/config/site.js). One file rebrands the site.
2. **Colours & fonts** → [`client/tailwind.config.js`](client/tailwind.config.js).
3. **Products, blog posts, gallery** → manage in **/admin**, or edit
   [`server/src/seed.js`](server/src/seed.js) and re-run `npm run seed` (clears data).
4. **Logo** → the "SJ" monogram comes from `site.mark`; also update
   `client/public/favicon.svg`.
5. **Images** → seed uses Unsplash placeholders; replace with real photos via the admin
   image upload, or paste image URLs.

---

## 📁 Project structure

```
decora-interiors/
├── client/                      # React frontend (Vite)
│   ├── src/
│   │   ├── config/site.js       # ← brand & contact details (EDIT THIS)
│   │   ├── components/           # navbar, footer, product, home sections…
│   │   ├── context/              # cart, admin auth, customer auth, toast
│   │   ├── pages/                # storefront + account/ + admin/
│   │   └── lib/                  # api client, formatting
│   ├── tailwind.config.js        # ← colours & fonts
│   └── vercel.json               # SPA deploy config
├── server/                       # Express API
│   ├── src/
│   │   ├── routes/               # products, orders, customers, blog, gallery, payment…
│   │   ├── payments/             # jazzcash.js, easypaisa.js, registry
│   │   ├── db.js  seed.js  index.js
│   ├── data/                     # SQLite db (auto-created)
│   └── uploads/                  # uploaded images
└── render.yaml                   # backend deploy config (Render.com)
```

---

## 📦 Deployment

**Frontend → Vercel**
- Import the repo, set **Root Directory** to `client` (Vercel auto-detects Vite; `vercel.json` is included).
- Set env `VITE_API_URL` to your deployed API URL (e.g. `https://your-api.onrender.com`).

**Backend → Render** (`render.yaml` included)
- New + → **Blueprint** → pick the repo. It provisions the API with a **persistent disk**
  for the SQLite database.
- Set `CLIENT_ORIGIN`, `CLIENT_URL` and `APP_URL` to your real URLs, plus a strong
  `JWT_SECRET` and (for live payments) the gateway keys with `PAYMENTS_MODE=live`.
- Note: uploaded images live on the service disk; for many images, prefer pasting hosted
  image URLs or add object storage (S3/Cloudinary).

You can also serve the built frontend from the Express server (`npm run build` then
`npm start`) for a single-service deployment.

---

## 🔌 API reference (summary)

| Method | Endpoint | Notes |
|--------|----------|-------|
| GET | `/api/products` | filters: category, search, featured, sort, page, min/maxPrice |
| GET | `/api/categories` · `/api/blog` · `/api/gallery` | public listings |
| POST | `/api/orders` | create order (server-validated prices) |
| GET | `/api/orders/track/:number` | public order tracking |
| POST | `/api/payment/initiate` | start an online payment |
| POST | `/api/customers/register` · `/login` | customer accounts |
| GET | `/api/customers/orders` | logged-in customer's orders |
| POST | `/api/auth/login` | admin login → JWT |
| CRUD | `/api/products` `/orders` `/inquiries` `/blog` `/gallery` | admin (Bearer token) |

---

Made for easy editing — every file is small, commented and self-explanatory. 🏡

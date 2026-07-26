import "dotenv/config";
import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

import authRoutes from "./routes/auth.js";
import categoryRoutes from "./routes/categories.js";
import productRoutes from "./routes/products.js";
import orderRoutes from "./routes/orders.js";
import inquiryRoutes from "./routes/inquiries.js";
import paymentRoutes from "./routes/payment.js";
import uploadRoutes from "./routes/upload.js";
import customerRoutes from "./routes/customers.js";
import blogRoutes from "./routes/blog.js";
import galleryRoutes from "./routes/gallery.js";

// Auto-seed on fresh deployment if database is empty
import db from "./db.js";
const userCount = db.prepare("SELECT COUNT(*) c FROM users").get().c;
if (userCount === 0) {
  console.log("🌱 Empty database detected — running seed...");
  const { default: seed } = await import("./seed.js");
}

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 4000;

// CORS — allow the configured frontend origins.
const origins = (process.env.CLIENT_ORIGIN || "http://localhost:5173")
  .split(",")
  .map((s) => s.trim());
app.use(cors({ origin: origins, credentials: true }));

app.use(express.json({ limit: "5mb" }));
// Parse x-www-form-urlencoded bodies (payment gateways post back in this format).
app.use(express.urlencoded({ extended: true }));

// Serve uploaded images.
app.use("/uploads", express.static(path.join(__dirname, "..", "uploads")));

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/inquiries", inquiryRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/customers", customerRoutes);
app.use("/api/blog", blogRoutes);
app.use("/api/gallery", galleryRoutes);

app.get("/api/health", (req, res) =>
  res.json({
    ok: true,
    name: "Decora Interiors API",
    time: new Date().toISOString(),
  }),
);

// Optionally serve the built frontend (production) if client/dist exists.
const clientDist = path.join(__dirname, "..", "..", "client", "dist");
app.use(express.static(clientDist));
app.get(/^(?!\/api).*/, (req, res, next) => {
  res.sendFile(path.join(clientDist, "index.html"), (err) => {
    if (err) next();
  });
});

// Central error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ error: err.message || "Server error" });
});

// Auto-seed if database is empty
import("./seed.js").then((m) => m.default?.()).catch(() => {});

app.listen(PORT, () => {
  console.log(`🚀 Decora API running on http://localhost:${PORT}`);
});

import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import { requireAuth, requireAdmin } from '../middleware/auth.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const router = Router();

const storage = multer.diskStorage({
  destination: path.join(__dirname, '..', '..', 'uploads'),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const safe = `${Date.now()}-${Math.round(Math.random() * 1e6)}${ext}`;
    cb(null, safe);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 6 * 1024 * 1024 }, // 6MB
  fileFilter: (req, file, cb) => {
    const ok = /image\/(png|jpe?g|webp|gif|avif)/.test(file.mimetype);
    cb(ok ? null : new Error('Only image files are allowed'), ok);
  },
});

// POST /api/upload (admin) — form field name: "image"
// Returns a public URL the admin form stores in a product's images array.
router.post('/', requireAuth, requireAdmin, upload.single('image'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
  const base = `${req.protocol}://${req.get('host')}`;
  res.status(201).json({ url: `${base}/uploads/${req.file.filename}` });
});

export default router;

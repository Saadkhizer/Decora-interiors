// Tiny in-memory rate limiter — no extra npm dependency required.
// Good enough for a single-instance deployment (Render starter plan).
// If you ever scale to multiple instances, swap this for express-rate-limit
// backed by Redis.

const buckets = new Map();

// Drop expired buckets every 10 minutes so the map cannot grow forever.
setInterval(
  () => {
    const now = Date.now();
    for (const [key, entry] of buckets) {
      if (entry.resetAt <= now) buckets.delete(key);
    }
  },
  10 * 60 * 1000,
).unref?.();

/**
 * @param {object} opts
 * @param {number} opts.windowMs  Time window in milliseconds.
 * @param {number} opts.max       Max requests allowed per IP in that window.
 * @param {string} opts.name      Namespace, so different routes get separate buckets.
 */
export function rateLimit({ windowMs = 15 * 60 * 1000, max = 10, name = 'default' } = {}) {
  return (req, res, next) => {
    // Render / Vercel sit behind a proxy, so prefer the forwarded IP.
    const forwarded = (req.headers['x-forwarded-for'] || '').split(',')[0].trim();
    const ip = forwarded || req.ip || req.socket?.remoteAddress || 'unknown';
    const key = `${name}:${ip}`;
    const now = Date.now();

    let entry = buckets.get(key);
    if (!entry || entry.resetAt <= now) {
      entry = { count: 0, resetAt: now + windowMs };
      buckets.set(key, entry);
    }

    entry.count += 1;

    const remaining = Math.max(0, max - entry.count);
    res.setHeader('RateLimit-Limit', max);
    res.setHeader('RateLimit-Remaining', remaining);
    res.setHeader('RateLimit-Reset', Math.ceil((entry.resetAt - now) / 1000));

    if (entry.count > max) {
      const retryAfter = Math.ceil((entry.resetAt - now) / 1000);
      res.setHeader('Retry-After', retryAfter);
      return res.status(429).json({
        error: `Too many attempts. Please try again in ${Math.ceil(retryAfter / 60)} minute(s).`,
      });
    }

    next();
  };
}

// Strict limiter for credential endpoints (login / register).
export const authLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 8, name: 'auth' });

// Looser limiter for public write endpoints (contact / quote forms).
export const formLimiter = rateLimit({ windowMs: 60 * 60 * 1000, max: 20, name: 'form' });

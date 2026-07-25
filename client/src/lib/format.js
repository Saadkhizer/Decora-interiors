import { site } from '../config/site.js';

// Format a number as PKR currency, e.g. 4200 -> "Rs 4,200"
export function money(value) {
  const n = Number(value) || 0;
  return `${site.currency} ${n.toLocaleString('en-PK', { maximumFractionDigits: 0 })}`;
}

// Effective unit price (sale price wins).
export function effectivePrice(p) {
  return p?.sale_price ?? p?.price ?? 0;
}

export function discountPct(p) {
  if (!p?.sale_price || !p?.price) return 0;
  return Math.round(((p.price - p.sale_price) / p.price) * 100);
}

// Fallback placeholder used when a product image is missing or fails to load.
export const PLACEHOLDER_IMG =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' width='600' height='480'>
      <rect width='100%' height='100%' fill='#E8DDC9'/>
      <text x='50%' y='50%' fill='#A88E6E' font-family='Georgia, serif' font-size='28'
        text-anchor='middle' dominant-baseline='middle'>Decora</text>
    </svg>`
  );

export function onImgError(e) {
  if (e.currentTarget.src !== PLACEHOLDER_IMG) e.currentTarget.src = PLACEHOLDER_IMG;
}

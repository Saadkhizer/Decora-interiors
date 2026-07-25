import { Star } from 'lucide-react';

// Star rating display. `value` 0–5, optional review count.
export default function Rating({ value = 0, count, size = 16, className = '' }) {
  const full = Math.round(value);
  return (
    <div className={`flex items-center gap-1 ${className}`}>
      <div className="flex" aria-label={`Rated ${value} out of 5`}>
        {[1, 2, 3, 4, 5].map((n) => (
          <Star
            key={n}
            width={size}
            height={size}
            className={n <= full ? 'fill-brass text-brass' : 'fill-linen text-linen'}
          />
        ))}
      </div>
      {count != null && <span className="text-xs text-stone">({count})</span>}
    </div>
  );
}

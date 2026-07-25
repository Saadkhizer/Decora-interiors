import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

// items: [{ label, to? }]  — last item is the current page (no link).
export default function Breadcrumbs({ items = [] }) {
  return (
    <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1 text-sm text-stone">
      <Link to="/" className="hover:text-brass-dark">
        Home
      </Link>
      {items.map((it, i) => (
        <span key={i} className="flex items-center gap-1">
          <ChevronRight className="h-4 w-4 text-taupe" />
          {it.to && i < items.length - 1 ? (
            <Link to={it.to} className="hover:text-brass-dark">
              {it.label}
            </Link>
          ) : (
            <span className="font-medium text-ink">{it.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}

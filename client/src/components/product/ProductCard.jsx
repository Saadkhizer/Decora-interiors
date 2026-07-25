import { Link } from 'react-router-dom';
import { ShoppingBag, Eye } from 'lucide-react';
import Badge from '../ui/Badge.jsx';
import Rating from '../ui/Rating.jsx';
import { money, effectivePrice, discountPct, onImgError } from '../../lib/format.js';
import { useCart } from '../../context/CartContext.jsx';
import { useToast } from '../../context/ToastContext.jsx';

export default function ProductCard({ product }) {
  const { add } = useCart();
  const toast = useToast();
  const pct = discountPct(product);

  function quickAdd(e) {
    e.preventDefault();
    add(product, 1);
    toast.success(`${product.name} added to cart`);
  }

  return (
    <Link
      to={`/product/${product.slug}`}
      className="card group flex flex-col overflow-hidden transition-shadow duration-300 hover:shadow-lift"
    >
      <div className="relative aspect-[4/5] overflow-hidden bg-linen">
        <img
          src={product.images?.[0]}
          onError={onImgError}
          alt={product.name}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {/* Badges */}
        <div className="absolute left-3 top-3 flex flex-col gap-1.5">
          {pct > 0 && <Badge variant="sale">-{pct}%</Badge>}
          {product.is_new && <Badge variant="new">New</Badge>}
          {!product.in_stock && <Badge variant="out">Sold out</Badge>}
        </div>
        {/* Quick actions */}
        <div className="absolute inset-x-3 bottom-3 flex translate-y-3 gap-2 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
          <button
            onClick={quickAdd}
            disabled={!product.in_stock}
            className="btn-gold btn-sm flex-1 shadow-card"
          >
            <ShoppingBag className="h-4 w-4" /> Add
          </button>
          <span className="grid h-10 w-10 place-items-center rounded-full bg-white text-walnut shadow-card">
            <Eye className="h-4 w-4" />
          </span>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-4">
        <span className="text-[11px] font-semibold uppercase tracking-wide text-brass-dark">
          {product.category_name}
        </span>
        <h3 className="mt-1 line-clamp-2 flex-1 text-[15px] font-medium leading-snug text-ink transition-colors group-hover:text-brass-dark">
          {product.name}
        </h3>
        <div className="mt-2">
          <Rating value={product.rating} count={product.review_count} />
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-lg font-semibold text-walnut-dark">
            {money(effectivePrice(product))}
          </span>
          {product.sale_price && (
            <span className="text-sm text-stone line-through">{money(product.price)}</span>
          )}
          <span className="ml-auto text-xs text-stone">/ {product.unit}</span>
        </div>
      </div>
    </Link>
  );
}

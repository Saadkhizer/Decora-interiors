import { Link } from 'react-router-dom';
import { X, Plus, Minus, Trash2, ShoppingBag } from 'lucide-react';
import { useCart } from '../../context/CartContext.jsx';
import { money } from '../../lib/format.js';
import { onImgError } from '../../lib/format.js';

export default function CartDrawer({ open, onClose }) {
  const { items, subtotal, setQty, remove, count } = useCart();

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        className={`fixed inset-0 z-50 bg-walnut-dark/40 backdrop-blur-sm transition-opacity duration-300 ${
          open ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
        aria-hidden={!open}
      />
      {/* Panel */}
      <aside
        className={`fixed right-0 top-0 z-50 flex h-full w-[min(92vw,420px)] flex-col bg-cream shadow-lift transition-transform duration-300 ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
        role="dialog"
        aria-label="Shopping cart"
      >
        <div className="flex items-center justify-between border-b border-linen px-5 py-4">
          <h2 className="flex items-center gap-2 text-xl">
            <ShoppingBag className="h-5 w-5 text-brass" />
            Your Cart <span className="text-base text-stone">({count})</span>
          </h2>
          <button onClick={onClose} aria-label="Close cart" className="btn-ghost p-2">
            <X className="h-5 w-5" />
          </button>
        </div>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
            <ShoppingBag className="h-12 w-12 text-taupe" />
            <p className="text-stone">Your cart is empty.</p>
            <Link to="/shop" onClick={onClose} className="btn-primary btn-sm">
              Browse products
            </Link>
          </div>
        ) : (
          <>
            <div className="flex-1 space-y-4 overflow-y-auto px-5 py-4">
              {items.map((item) => (
                <div key={item.id} className="flex gap-3">
                  <img
                    src={item.image}
                    onError={onImgError}
                    alt={item.name}
                    className="h-20 w-20 shrink-0 rounded-xl object-cover ring-1 ring-linen"
                  />
                  <div className="flex flex-1 flex-col">
                    <Link
                      to={`/product/${item.slug}`}
                      onClick={onClose}
                      className="line-clamp-2 text-sm font-medium text-ink hover:text-brass-dark"
                    >
                      {item.name}
                    </Link>
                    <span className="mt-0.5 text-xs text-stone">
                      {money(item.price)} / {item.unit}
                    </span>
                    <div className="mt-auto flex items-center justify-between">
                      <div className="flex items-center rounded-full border border-linen">
                        <button
                          onClick={() => setQty(item.id, item.qty - 1)}
                          className="grid h-8 w-8 place-items-center text-stone hover:text-ink"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="h-3.5 w-3.5" />
                        </button>
                        <span className="w-7 text-center text-sm">{item.qty}</span>
                        <button
                          onClick={() => setQty(item.id, item.qty + 1)}
                          className="grid h-8 w-8 place-items-center text-stone hover:text-ink"
                          aria-label="Increase quantity"
                        >
                          <Plus className="h-3.5 w-3.5" />
                        </button>
                      </div>
                      <button
                        onClick={() => remove(item.id)}
                        className="text-stone hover:text-red-500"
                        aria-label="Remove item"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  <span className="text-sm font-semibold text-walnut-dark">
                    {money(item.price * item.qty)}
                  </span>
                </div>
              ))}
            </div>

            <div className="border-t border-linen px-5 py-4">
              <div className="mb-3 flex items-center justify-between text-sm">
                <span className="text-stone">Subtotal</span>
                <span className="text-lg font-semibold text-walnut-dark">{money(subtotal)}</span>
              </div>
              <p className="mb-3 text-xs text-stone">Shipping & taxes calculated at checkout.</p>
              <div className="grid grid-cols-2 gap-3">
                <Link to="/cart" onClick={onClose} className="btn-outline btn-sm">
                  View cart
                </Link>
                <Link to="/checkout" onClick={onClose} className="btn-gold btn-sm">
                  Checkout
                </Link>
              </div>
            </div>
          </>
        )}
      </aside>
    </>
  );
}

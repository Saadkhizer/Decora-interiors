import { Link } from 'react-router-dom';
import { Plus, Minus, Trash2, ShoppingBag, ArrowRight, ArrowLeft } from 'lucide-react';
import { useCart } from '../context/CartContext.jsx';
import { money, onImgError } from '../lib/format.js';
import { site } from '../config/site.js';
import Breadcrumbs from '../components/ui/Breadcrumbs.jsx';

export default function Cart() {
  const { items, subtotal, setQty, remove } = useCart();
  const shipping = subtotal === 0 || subtotal >= site.freeShippingThreshold ? 0 : 500;
  const total = subtotal + shipping;
  const remaining = site.freeShippingThreshold - subtotal;

  if (items.length === 0) {
    return (
      <div className="container-page flex min-h-[60vh] flex-col items-center justify-center gap-5 text-center">
        <span className="grid h-20 w-20 place-items-center rounded-full bg-sand">
          <ShoppingBag className="h-9 w-9 text-taupe-dark" />
        </span>
        <h1 className="text-3xl font-semibold">Your cart is empty</h1>
        <p className="max-w-sm text-stone">
          Looks like you haven’t added anything yet. Let’s find something beautiful for your space.
        </p>
        <Link to="/shop" className="btn-gold">
          Start shopping <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="container-page py-8 lg:py-10">
      <Breadcrumbs items={[{ label: 'Cart' }]} />
      <h1 className="mt-4 text-3xl font-semibold sm:text-4xl">Shopping Cart</h1>

      <div className="mt-8 grid gap-8 lg:grid-cols-3">
        {/* Items */}
        <div className="lg:col-span-2">
          {subtotal < site.freeShippingThreshold && (
            <div className="mb-5 rounded-xl bg-sand px-4 py-3 text-sm text-walnut-dark">
              Add <strong>{money(remaining)}</strong> more to qualify for{' '}
              <strong>free delivery</strong> 🚚
            </div>
          )}
          <div className="divide-y divide-linen rounded-2xl bg-white shadow-card ring-1 ring-linen">
            {items.map((item) => (
              <div key={item.id} className="flex gap-4 p-4 sm:p-5">
                <Link to={`/product/${item.slug}`} className="shrink-0">
                  <img
                    src={item.image}
                    onError={onImgError}
                    alt={item.name}
                    className="h-24 w-24 rounded-xl object-cover ring-1 ring-linen sm:h-28 sm:w-28"
                  />
                </Link>
                <div className="flex flex-1 flex-col">
                  <div className="flex items-start justify-between gap-3">
                    <Link
                      to={`/product/${item.slug}`}
                      className="font-medium text-ink hover:text-brass-dark"
                    >
                      {item.name}
                    </Link>
                    <button
                      onClick={() => remove(item.id)}
                      aria-label="Remove item"
                      className="text-stone hover:text-red-500"
                    >
                      <Trash2 className="h-4.5 w-4.5" />
                    </button>
                  </div>
                  <span className="mt-1 text-sm text-stone">
                    {money(item.price)} / {item.unit}
                  </span>
                  <div className="mt-auto flex items-center justify-between pt-3">
                    <div className="flex items-center rounded-full border border-linen">
                      <button
                        onClick={() => setQty(item.id, item.qty - 1)}
                        className="grid h-9 w-9 place-items-center text-stone hover:text-ink"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <span className="w-8 text-center text-sm font-medium">{item.qty}</span>
                      <button
                        onClick={() => setQty(item.id, item.qty + 1)}
                        className="grid h-9 w-9 place-items-center text-stone hover:text-ink"
                        aria-label="Increase quantity"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                    <span className="text-lg font-semibold text-walnut-dark">
                      {money(item.price * item.qty)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <Link to="/shop" className="btn-ghost mt-5 inline-flex">
            <ArrowLeft className="h-4 w-4" /> Continue shopping
          </Link>
        </div>

        {/* Summary */}
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="card p-6">
            <h2 className="text-xl font-semibold">Order summary</h2>
            <dl className="mt-5 space-y-3 text-sm">
              <div className="flex justify-between">
                <dt className="text-stone">Subtotal</dt>
                <dd className="font-medium">{money(subtotal)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-stone">Shipping</dt>
                <dd className="font-medium">{shipping === 0 ? 'Free' : money(shipping)}</dd>
              </div>
              <div className="my-2 border-t border-linen" />
              <div className="flex justify-between text-base">
                <dt className="font-semibold">Total</dt>
                <dd className="font-display text-2xl font-semibold text-walnut-dark">
                  {money(total)}
                </dd>
              </div>
            </dl>
            <Link to="/checkout" className="btn-gold mt-6 w-full">
              Proceed to checkout <ArrowRight className="h-4 w-4" />
            </Link>
            <p className="mt-3 text-center text-xs text-stone">
              Secure checkout · Cash on delivery available
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}

import { useState } from 'react';
import { Search, Package } from 'lucide-react';
import { api } from '../lib/api.js';
import { money } from '../lib/format.js';
import Breadcrumbs from '../components/ui/Breadcrumbs.jsx';

const steps = ['pending', 'confirmed', 'processing', 'shipped', 'delivered'];
const stepLabels = {
  pending: 'Order placed',
  confirmed: 'Confirmed',
  processing: 'Processing',
  shipped: 'Shipped',
  delivered: 'Delivered',
};

export default function TrackOrder() {
  const [number, setNumber] = useState('');
  const [order, setOrder] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function track(e) {
    e.preventDefault();
    setError('');
    setOrder(null);
    if (!number.trim()) return;
    setLoading(true);
    try {
      const data = await api.get(`/orders/track/${number.trim().toUpperCase()}`);
      setOrder(data);
    } catch {
      setError('No order found with that number. Please check and try again.');
    } finally {
      setLoading(false);
    }
  }

  const activeStep = order ? Math.max(0, steps.indexOf(order.status)) : 0;
  const cancelled = order?.status === 'cancelled';

  return (
    <div className="container-page max-w-2xl py-8 lg:py-12">
      <Breadcrumbs items={[{ label: 'Track Order' }]} />
      <h1 className="mt-4 text-3xl font-semibold sm:text-4xl">Track your order</h1>
      <p className="mt-2 text-stone">Enter the order number from your confirmation (e.g. DEC-XXXXXXXX).</p>

      <form onSubmit={track} className="mt-6 flex gap-2">
        <input
          value={number}
          onChange={(e) => setNumber(e.target.value)}
          placeholder="DEC-XXXXXXXX"
          className="input flex-1"
          aria-label="Order number"
        />
        <button type="submit" disabled={loading} className="btn-gold">
          <Search className="h-4 w-4" /> {loading ? 'Searching…' : 'Track'}
        </button>
      </form>

      {error && <p className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">{error}</p>}

      {order && (
        <div className="card mt-8 p-6">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-2 font-semibold">
              <Package className="h-5 w-5 text-brass" /> {order.order_number}
            </span>
            <span className="text-sm text-stone">{money(order.total)}</span>
          </div>

          {cancelled ? (
            <p className="mt-6 rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
              This order has been cancelled. Please contact us if this is unexpected.
            </p>
          ) : (
            <ol className="mt-8 space-y-0">
              {steps.map((s, i) => {
                const done = i <= activeStep;
                return (
                  <li key={s} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <span
                        className={`grid h-9 w-9 shrink-0 place-items-center rounded-full text-sm font-semibold ${
                          done ? 'bg-sage-dark text-white' : 'bg-linen text-stone'
                        }`}
                      >
                        {i + 1}
                      </span>
                      {i < steps.length - 1 && (
                        <span className={`my-1 h-8 w-0.5 ${i < activeStep ? 'bg-sage-dark' : 'bg-linen'}`} />
                      )}
                    </div>
                    <div className="pb-2 pt-1.5">
                      <p className={`font-medium ${done ? 'text-ink' : 'text-stone'}`}>
                        {stepLabels[s]}
                      </p>
                    </div>
                  </li>
                );
              })}
            </ol>
          )}
        </div>
      )}
    </div>
  );
}

import { useEffect, useState } from 'react';
import { Eye, X, Phone, MapPin } from 'lucide-react';
import { api } from '../../lib/api.js';
import { money, onImgError } from '../../lib/format.js';
import { useToast } from '../../context/ToastContext.jsx';
import Spinner from '../../components/ui/Spinner.jsx';

const statuses = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];
const statusColors = {
  pending: 'bg-amber-100 text-amber-700',
  confirmed: 'bg-blue-100 text-blue-700',
  processing: 'bg-indigo-100 text-indigo-700',
  shipped: 'bg-purple-100 text-purple-700',
  delivered: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
};

export default function AdminOrders() {
  const toast = useToast();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');
  const [active, setActive] = useState(null);

  function load() {
    setLoading(true);
    api
      .get('/orders', { auth: true })
      .then(setOrders)
      .catch(() => {})
      .finally(() => setLoading(false));
  }
  useEffect(load, []);

  async function updateStatus(order, status) {
    try {
      const updated = await api.put(`/orders/${order.id}`, { status }, { auth: true });
      setOrders((list) => list.map((o) => (o.id === order.id ? updated : o)));
      if (active?.id === order.id) setActive(updated);
      toast.success(`Order ${order.order_number} → ${status}`);
    } catch (err) {
      toast.error(err.message || 'Update failed');
    }
  }
  async function updatePayment(order, payment_status) {
    try {
      const updated = await api.put(`/orders/${order.id}`, { payment_status }, { auth: true });
      setOrders((list) => list.map((o) => (o.id === order.id ? updated : o)));
      if (active?.id === order.id) setActive(updated);
    } catch (err) {
      toast.error(err.message || 'Update failed');
    }
  }

  const filtered = filter ? orders.filter((o) => o.status === filter) : orders;

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold sm:text-3xl">Orders</h1>
          <p className="mt-1 text-stone">{orders.length} total orders.</p>
        </div>
        <select value={filter} onChange={(e) => setFilter(e.target.value)} className="input w-auto cursor-pointer py-2.5 text-sm">
          <option value="">All statuses</option>
          {statuses.map((s) => (
            <option key={s} value={s}>{s[0].toUpperCase() + s.slice(1)}</option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="flex min-h-[40vh] items-center justify-center"><Spinner /></div>
      ) : (
        <div className="mt-6 overflow-hidden rounded-2xl bg-white shadow-card ring-1 ring-linen">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-sand text-xs uppercase tracking-wide text-stone">
                <tr>
                  <th className="px-4 py-3 font-semibold">Order</th>
                  <th className="px-4 py-3 font-semibold">Customer</th>
                  <th className="px-4 py-3 font-semibold">Total</th>
                  <th className="px-4 py-3 font-semibold">Payment</th>
                  <th className="px-4 py-3 font-semibold">Status</th>
                  <th className="px-4 py-3 text-right font-semibold">View</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-linen">
                {filtered.map((o) => (
                  <tr key={o.id} className="hover:bg-cream/60">
                    <td className="px-4 py-3">
                      <p className="font-medium text-ink">{o.order_number}</p>
                      <p className="text-xs text-stone">{new Date(o.created_at).toLocaleDateString()}</p>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-ink">{o.customer_name}</p>
                      <p className="text-xs text-stone">{o.phone}</p>
                    </td>
                    <td className="px-4 py-3 font-medium">{money(o.total)}</td>
                    <td className="px-4 py-3">
                      <span className="text-xs uppercase text-stone">{o.payment_method}</span>
                      <span className={`ml-2 rounded-full px-2 py-0.5 text-xs ${o.payment_status === 'paid' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                        {o.payment_status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <select
                        value={o.status}
                        onChange={(e) => updateStatus(o, e.target.value)}
                        className={`cursor-pointer rounded-full border-0 px-3 py-1 text-xs font-medium ${statusColors[o.status]}`}
                      >
                        {statuses.map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => setActive(o)}
                        className="grid h-9 w-9 place-items-center rounded-lg text-stone hover:bg-sand hover:text-brass-dark"
                        aria-label="View order"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filtered.length === 0 && <p className="px-4 py-10 text-center text-sm text-stone">No orders found.</p>}
        </div>
      )}

      {/* Detail modal */}
      {active && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div onClick={() => setActive(null)} className="absolute inset-0 bg-walnut-dark/50 backdrop-blur-sm" />
          <div className="relative max-h-[88vh] w-full max-w-lg overflow-y-auto rounded-3xl bg-cream p-6 shadow-lift">
            <button onClick={() => setActive(null)} className="btn-ghost absolute right-3 top-3 p-2" aria-label="Close">
              <X className="h-5 w-5" />
            </button>
            <h2 className="text-xl font-semibold">{active.order_number}</h2>
            <p className="text-sm text-stone">{new Date(active.created_at).toLocaleString()}</p>

            <div className="mt-4 rounded-xl bg-white p-4 text-sm ring-1 ring-linen">
              <p className="font-medium text-ink">{active.customer_name}</p>
              <p className="mt-1 flex items-center gap-2 text-stone"><Phone className="h-4 w-4" /> {active.phone}</p>
              {active.email && <p className="mt-1 text-stone">{active.email}</p>}
              <p className="mt-1 flex items-start gap-2 text-stone"><MapPin className="mt-0.5 h-4 w-4 shrink-0" /> {active.address}{active.city ? `, ${active.city}` : ''}</p>
              {active.notes && <p className="mt-2 rounded-lg bg-sand px-3 py-2 text-stone">“{active.notes}”</p>}
            </div>

            <div className="mt-4 space-y-3">
              {active.items.map((i) => (
                <div key={i.id} className="flex items-center gap-3">
                  <img src={i.image} onError={onImgError} alt="" className="h-12 w-12 rounded-lg object-cover ring-1 ring-linen" />
                  <span className="flex-1 text-sm">{i.name} <span className="text-stone">× {i.qty}</span></span>
                  <span className="text-sm font-medium">{money(i.lineTotal)}</span>
                </div>
              ))}
            </div>

            <dl className="mt-4 space-y-1.5 border-t border-linen pt-4 text-sm">
              <div className="flex justify-between"><dt className="text-stone">Subtotal</dt><dd>{money(active.subtotal)}</dd></div>
              <div className="flex justify-between"><dt className="text-stone">Shipping</dt><dd>{active.shipping === 0 ? 'Free' : money(active.shipping)}</dd></div>
              <div className="flex justify-between text-base font-semibold"><dt>Total</dt><dd className="text-walnut-dark">{money(active.total)}</dd></div>
            </dl>

            <div className="mt-5 grid grid-cols-2 gap-3">
              <div>
                <label className="label">Order status</label>
                <select value={active.status} onChange={(e) => updateStatus(active, e.target.value)} className="input cursor-pointer">
                  {statuses.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="label">Payment</label>
                <select value={active.payment_status} onChange={(e) => updatePayment(active, e.target.value)} className="input cursor-pointer">
                  {['pending', 'paid', 'failed'].map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

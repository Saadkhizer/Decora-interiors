import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Package, ShoppingCart, MessageSquare, TrendingUp, ArrowRight } from 'lucide-react';
import { api } from '../../lib/api.js';
import { money } from '../../lib/format.js';
import Spinner from '../../components/ui/Spinner.jsx';

const statusColors = {
  pending: 'bg-amber-100 text-amber-700',
  confirmed: 'bg-blue-100 text-blue-700',
  processing: 'bg-indigo-100 text-indigo-700',
  shipped: 'bg-purple-100 text-purple-700',
  delivered: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
};

export default function Dashboard() {
  const [data, setData] = useState(null);

  useEffect(() => {
    Promise.all([
      api.get('/orders', { auth: true }),
      api.get('/inquiries', { auth: true }),
      api.get('/products?limit=1'),
    ])
      .then(([orders, inquiries, products]) => setData({ orders, inquiries, productTotal: products.total }))
      .catch(() => setData({ orders: [], inquiries: [], productTotal: 0 }));
  }, []);

  if (!data) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Spinner />
      </div>
    );
  }

  const revenue = data.orders
    .filter((o) => o.status !== 'cancelled')
    .reduce((sum, o) => sum + o.total, 0);
  const newInquiries = data.inquiries.filter((i) => i.status === 'new').length;
  const pendingOrders = data.orders.filter((o) => o.status === 'pending').length;

  const stats = [
    { label: 'Total revenue', value: money(revenue), icon: TrendingUp, to: '/admin/orders' },
    { label: 'Orders', value: data.orders.length, icon: ShoppingCart, to: '/admin/orders', badge: pendingOrders ? `${pendingOrders} pending` : null },
    { label: 'Products', value: data.productTotal, icon: Package, to: '/admin/products' },
    { label: 'Inquiries', value: data.inquiries.length, icon: MessageSquare, to: '/admin/inquiries', badge: newInquiries ? `${newInquiries} new` : null },
  ];

  return (
    <div>
      <h1 className="text-2xl font-semibold sm:text-3xl">Dashboard</h1>
      <p className="mt-1 text-stone">Welcome back — here’s what’s happening in your store.</p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map(({ label, value, icon: Icon, to, badge }) => (
          <Link key={label} to={to} className="card group p-5 transition-shadow hover:shadow-lift">
            <div className="flex items-center justify-between">
              <span className="grid h-11 w-11 place-items-center rounded-xl bg-sand text-brass-dark">
                <Icon className="h-5 w-5" />
              </span>
              {badge && (
                <span className="rounded-full bg-brass/10 px-2.5 py-1 text-xs font-medium text-brass-dark">
                  {badge}
                </span>
              )}
            </div>
            <p className="mt-4 font-display text-3xl font-semibold text-walnut-dark">{value}</p>
            <p className="text-sm text-stone">{label}</p>
          </Link>
        ))}
      </div>

      {/* Recent orders */}
      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="card p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Recent orders</h2>
            <Link to="/admin/orders" className="text-sm text-brass-dark hover:underline">
              View all
            </Link>
          </div>
          <div className="mt-4 space-y-3">
            {data.orders.slice(0, 5).map((o) => (
              <div key={o.id} className="flex items-center justify-between gap-3 border-b border-linen pb-3 last:border-0">
                <div>
                  <p className="text-sm font-medium">{o.order_number}</p>
                  <p className="text-xs text-stone">{o.customer_name}</p>
                </div>
                <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${statusColors[o.status]}`}>
                  {o.status}
                </span>
                <span className="text-sm font-semibold text-walnut-dark">{money(o.total)}</span>
              </div>
            ))}
            {data.orders.length === 0 && <p className="text-sm text-stone">No orders yet.</p>}
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Latest inquiries</h2>
            <Link to="/admin/inquiries" className="text-sm text-brass-dark hover:underline">
              View all
            </Link>
          </div>
          <div className="mt-4 space-y-3">
            {data.inquiries.slice(0, 5).map((i) => (
              <div key={i.id} className="flex items-center justify-between gap-3 border-b border-linen pb-3 last:border-0">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{i.name}</p>
                  <p className="truncate text-xs text-stone">{i.subject}</p>
                </div>
                <span className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-medium ${
                  i.type === 'quote' ? 'bg-brass/10 text-brass-dark' : 'bg-sage-light/30 text-sage-dark'
                }`}>
                  {i.type}
                </span>
              </div>
            ))}
            {data.inquiries.length === 0 && <p className="text-sm text-stone">No inquiries yet.</p>}
          </div>
        </div>
      </div>

      <Link to="/admin/products/new" className="btn-gold mt-8 inline-flex">
        Add new product <ArrowRight className="h-4 w-4" />
      </Link>
    </div>
  );
}

import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogOut, Package, User, MapPin } from 'lucide-react';
import { api } from '../../lib/api.js';
import { money } from '../../lib/format.js';
import { useCustomerAuth } from '../../context/CustomerAuthContext.jsx';
import { useToast } from '../../context/ToastContext.jsx';
import Breadcrumbs from '../../components/ui/Breadcrumbs.jsx';
import Spinner from '../../components/ui/Spinner.jsx';

const statusColors = {
  pending: 'bg-amber-100 text-amber-700',
  confirmed: 'bg-blue-100 text-blue-700',
  processing: 'bg-indigo-100 text-indigo-700',
  shipped: 'bg-purple-100 text-purple-700',
  delivered: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
};

export default function Account() {
  const { customer, logout, updateProfile } = useCustomerAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState({ name: '', phone: '', address: '', city: '' });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (customer) {
      setProfile({
        name: customer.name || '',
        phone: customer.phone || '',
        address: customer.address || '',
        city: customer.city || '',
      });
    }
  }, [customer]);

  useEffect(() => {
    api
      .get('/customers/orders', { customerAuth: true })
      .then(setOrders)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  function signOut() {
    logout();
    toast.success('Signed out');
    navigate('/');
  }
  const set = (k) => (e) => setProfile((p) => ({ ...p, [k]: e.target.value }));
  async function save(e) {
    e.preventDefault();
    setSaving(true);
    try {
      await updateProfile(profile);
      toast.success('Profile updated');
    } catch (err) {
      toast.error(err.message || 'Update failed');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="container-page py-8 lg:py-10">
      <Breadcrumbs items={[{ label: 'My Account' }]} />
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-semibold sm:text-4xl">Hello, {customer?.name?.split(' ')[0]} 👋</h1>
          <p className="mt-1 text-stone">Manage your profile and view your orders.</p>
        </div>
        <button onClick={signOut} className="btn-outline btn-sm">
          <LogOut className="h-4 w-4" /> Sign out
        </button>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-3">
        {/* Profile */}
        <div className="lg:col-span-1">
          <form onSubmit={save} className="card p-6">
            <h2 className="flex items-center gap-2 text-xl font-semibold">
              <User className="h-5 w-5 text-brass" /> Profile
            </h2>
            <div className="mt-4 space-y-3">
              <div>
                <label className="label" htmlFor="p-name">Name</label>
                <input id="p-name" value={profile.name} onChange={set('name')} className="input" />
              </div>
              <div>
                <label className="label" htmlFor="p-phone">Phone</label>
                <input id="p-phone" value={profile.phone} onChange={set('phone')} className="input" />
              </div>
              <div>
                <label className="label" htmlFor="p-address">Address</label>
                <input id="p-address" value={profile.address} onChange={set('address')} className="input" />
              </div>
              <div>
                <label className="label" htmlFor="p-city">City</label>
                <input id="p-city" value={profile.city} onChange={set('city')} className="input" />
              </div>
            </div>
            <p className="mt-3 text-xs text-stone">Email: {customer?.email}</p>
            <button type="submit" disabled={saving} className="btn-primary mt-4 w-full">
              {saving ? 'Saving…' : 'Save changes'}
            </button>
          </form>
        </div>

        {/* Orders */}
        <div className="lg:col-span-2">
          <h2 className="flex items-center gap-2 text-xl font-semibold">
            <Package className="h-5 w-5 text-brass" /> Order history
          </h2>
          {loading ? (
            <div className="flex min-h-[20vh] items-center justify-center"><Spinner /></div>
          ) : orders.length === 0 ? (
            <div className="card mt-4 flex flex-col items-center gap-3 px-6 py-12 text-center">
              <p className="text-stone">You haven’t placed any orders yet.</p>
              <Link to="/shop" className="btn-gold btn-sm">Start shopping</Link>
            </div>
          ) : (
            <div className="mt-4 space-y-4">
              {orders.map((o) => (
                <div key={o.id} className="card p-5">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <p className="font-semibold text-ink">{o.order_number}</p>
                      <p className="text-xs text-stone">{new Date(o.created_at).toLocaleDateString()}</p>
                    </div>
                    <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${statusColors[o.status]}`}>
                      {o.status}
                    </span>
                    <span className="font-semibold text-walnut-dark">{money(o.total)}</span>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2 border-t border-linen pt-3 text-sm text-stone">
                    {o.items.slice(0, 3).map((it) => (
                      <span key={it.id} className="rounded-full bg-sand px-3 py-1">{it.name} × {it.qty}</span>
                    ))}
                    {o.items.length > 3 && <span className="px-2 py-1">+{o.items.length - 3} more</span>}
                    <Link to={`/track`} className="ml-auto flex items-center gap-1 text-brass-dark hover:underline">
                      <MapPin className="h-4 w-4" /> Track
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

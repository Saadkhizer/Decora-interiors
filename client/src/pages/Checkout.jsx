import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CreditCard, Banknote, Wallet, Lock, ArrowLeft, ShieldCheck } from 'lucide-react';
import { api } from '../lib/api.js';
import { useCart } from '../context/CartContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import { useCustomerAuth } from '../context/CustomerAuthContext.jsx';
import { money, onImgError } from '../lib/format.js';
import { site } from '../config/site.js';
import Breadcrumbs from '../components/ui/Breadcrumbs.jsx';

const cities = ['Islamabad', 'Rawalpindi', 'Lahore', 'Karachi', 'Faisalabad', 'Multan', 'Peshawar', 'Other'];

const methodMeta = {
  cod: { label: 'Cash on Delivery', icon: Banknote, hint: 'Pay in cash when your order arrives.' },
  card: { label: 'Debit / Credit Card', icon: CreditCard, hint: 'Visa / Mastercard via our secure gateway.' },
  jazzcash: { label: 'JazzCash', icon: Wallet, hint: 'Pay with your JazzCash mobile wallet or card.', dot: '#E2001A' },
  easypaisa: { label: 'Easypaisa', icon: Wallet, hint: 'Pay with your Easypaisa mobile account.', dot: '#28a745' },
};

// Builds and submits a hidden form to redirect the browser to a payment gateway.
function postToGateway(action, method, fields) {
  const form = document.createElement('form');
  form.method = method || 'POST';
  form.action = action;
  Object.entries(fields).forEach(([k, v]) => {
    const input = document.createElement('input');
    input.type = 'hidden';
    input.name = k;
    input.value = v;
    form.appendChild(input);
  });
  document.body.appendChild(form);
  form.submit();
}

export default function Checkout() {
  const { items, subtotal, clear } = useCart();
  const { customer } = useCustomerAuth();
  const navigate = useNavigate();
  const toast = useToast();

  const [form, setForm] = useState({
    customer_name: '',
    phone: '',
    email: '',
    address: '',
    city: 'Islamabad',
    notes: '',
  });
  const [method, setMethod] = useState('cod');
  const [methods, setMethods] = useState([{ id: 'cod' }]);
  const [submitting, setSubmitting] = useState(false);

  const shipping = subtotal >= site.freeShippingThreshold ? 0 : 500;
  const total = subtotal + shipping;

  useEffect(() => {
    api.get('/payment/config').then((c) => setMethods(c.methods || [])).catch(() => {});
  }, []);

  // Prefill from the logged-in customer's profile.
  useEffect(() => {
    if (customer) {
      setForm((f) => ({
        ...f,
        customer_name: f.customer_name || customer.name || '',
        phone: f.phone || customer.phone || '',
        email: f.email || customer.email || '',
        address: f.address || customer.address || '',
        city: customer.city || f.city,
      }));
    }
  }, [customer]);

  useEffect(() => {
    if (items.length === 0) navigate('/cart', { replace: true });
  }, [items.length, navigate]);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  async function placeOrder(e) {
    e.preventDefault();
    if (!form.customer_name || !form.phone || !form.address) {
      toast.error('Please fill in your name, phone and address.');
      return;
    }
    setSubmitting(true);
    try {
      const order = await api.post(
        '/orders',
        { ...form, items: items.map((i) => ({ id: i.id, qty: i.qty })), payment_method: method },
        { customerAuth: true }
      );
      clear();

      if (method === 'cod') {
        toast.success('Order placed successfully!');
        navigate(`/order/${order.order_number}`, { state: { order } });
        return;
      }

      // Online payment → ask the backend how to proceed (gateway or sandbox mock).
      const init = await api.post('/payment/initiate', {
        order_number: order.order_number,
        method,
        return_origin: window.location.origin,
      });
      if (init.type === 'redirect') {
        window.location.href = init.url;
      } else if (init.type === 'form') {
        postToGateway(init.action, init.method, init.fields);
      } else {
        navigate(`/order/${order.order_number}`, { state: { order } });
      }
    } catch (err) {
      toast.error(err.message || 'Could not place order');
      setSubmitting(false);
    }
  }

  if (items.length === 0) return null;

  return (
    <div className="container-page py-8 lg:py-10">
      <Breadcrumbs items={[{ label: 'Cart', to: '/cart' }, { label: 'Checkout' }]} />
      <h1 className="mt-4 text-3xl font-semibold sm:text-4xl">Checkout</h1>
      {!customer && (
        <p className="mt-2 text-sm text-stone">
          Checking out as guest.{' '}
          <Link to="/account/login" className="font-medium text-brass-dark hover:underline">
            Sign in
          </Link>{' '}
          to save your details and track orders.
        </p>
      )}

      <form onSubmit={placeOrder} className="mt-8 grid gap-8 lg:grid-cols-3">
        <div className="space-y-8 lg:col-span-2">
          {/* Contact + shipping */}
          <section className="card p-6">
            <h2 className="text-xl font-semibold">Delivery details</h2>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="label" htmlFor="name">Full name *</label>
                <input id="name" required value={form.customer_name} onChange={set('customer_name')} className="input" />
              </div>
              <div>
                <label className="label" htmlFor="phone">Phone *</label>
                <input id="phone" required value={form.phone} onChange={set('phone')} placeholder="+92 3xx xxxxxxx" className="input" />
              </div>
              <div>
                <label className="label" htmlFor="email">Email</label>
                <input id="email" type="email" value={form.email} onChange={set('email')} className="input" />
              </div>
              <div className="sm:col-span-2">
                <label className="label" htmlFor="address">Address *</label>
                <input id="address" required value={form.address} onChange={set('address')} placeholder="House #, street, area" className="input" />
              </div>
              <div>
                <label className="label" htmlFor="city">City</label>
                <select id="city" value={form.city} onChange={set('city')} className="input cursor-pointer">
                  {cities.map((c) => (<option key={c}>{c}</option>))}
                </select>
              </div>
              <div className="sm:col-span-2">
                <label className="label" htmlFor="notes">Order notes (optional)</label>
                <textarea id="notes" rows={2} value={form.notes} onChange={set('notes')} placeholder="Delivery instructions, preferred time…" className="input resize-none" />
              </div>
            </div>
          </section>

          {/* Payment */}
          <section className="card p-6">
            <h2 className="text-xl font-semibold">Payment method</h2>
            <div className="mt-5 space-y-3">
              {methods.map((m) => {
                const meta = methodMeta[m.id];
                if (!meta) return null;
                const Icon = meta.icon;
                return (
                  <label
                    key={m.id}
                    className={`flex cursor-pointer items-start gap-3 rounded-2xl border p-4 transition ${
                      method === m.id ? 'border-brass bg-sand' : 'border-linen hover:border-taupe'
                    }`}
                  >
                    <input type="radio" name="method" checked={method === m.id} onChange={() => setMethod(m.id)} className="mt-1 accent-brass" />
                    {meta.dot ? (
                      <span className="mt-0.5 grid h-6 w-6 place-items-center rounded-full" style={{ background: meta.dot }}>
                        <Wallet className="h-3.5 w-3.5 text-white" />
                      </span>
                    ) : (
                      <Icon className="h-6 w-6 text-brass-dark" />
                    )}
                    <span>
                      <span className="block font-medium text-ink">{meta.label}</span>
                      <span className="block text-sm text-stone">{meta.hint}</span>
                    </span>
                  </label>
                );
              })}
            </div>
            <p className="mt-4 flex items-center gap-2 text-xs text-stone">
              <Lock className="h-3.5 w-3.5" /> Payments are processed securely. Your details stay private.
            </p>
          </section>
        </div>

        {/* Summary */}
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="card p-6">
            <h2 className="text-xl font-semibold">Your order</h2>
            <div className="mt-4 max-h-64 space-y-3 overflow-y-auto pr-1">
              {items.map((i) => (
                <div key={i.id} className="flex items-center gap-3">
                  <div className="relative">
                    <img src={i.image} onError={onImgError} alt={i.name} className="h-14 w-14 rounded-lg object-cover ring-1 ring-linen" />
                    <span className="absolute -right-2 -top-2 grid h-5 min-w-[20px] place-items-center rounded-full bg-walnut px-1 text-[11px] font-bold text-cream">
                      {i.qty}
                    </span>
                  </div>
                  <span className="line-clamp-2 flex-1 text-sm text-ink">{i.name}</span>
                  <span className="text-sm font-medium">{money(i.price * i.qty)}</span>
                </div>
              ))}
            </div>
            <dl className="mt-5 space-y-3 border-t border-linen pt-5 text-sm">
              <div className="flex justify-between"><dt className="text-stone">Subtotal</dt><dd className="font-medium">{money(subtotal)}</dd></div>
              <div className="flex justify-between"><dt className="text-stone">Shipping</dt><dd className="font-medium">{shipping === 0 ? 'Free' : money(shipping)}</dd></div>
              <div className="flex justify-between border-t border-linen pt-3 text-base">
                <dt className="font-semibold">Total</dt>
                <dd className="font-display text-2xl font-semibold text-walnut-dark">{money(total)}</dd>
              </div>
            </dl>
            <button type="submit" disabled={submitting} className="btn-gold mt-6 w-full">
              {submitting ? 'Processing…' : method === 'cod' ? `Place order · ${money(total)}` : `Pay ${money(total)}`}
            </button>
            <p className="mt-3 flex items-center justify-center gap-1.5 text-center text-xs text-stone">
              <ShieldCheck className="h-3.5 w-3.5" /> 100% quality guarantee
            </p>
            <Link to="/cart" className="btn-ghost mt-2 w-full">
              <ArrowLeft className="h-4 w-4" /> Back to cart
            </Link>
          </div>
        </aside>
      </form>
    </div>
  );
}

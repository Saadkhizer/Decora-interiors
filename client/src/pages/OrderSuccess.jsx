import { useEffect, useState } from 'react';
import { useParams, useLocation, useSearchParams, Link } from 'react-router-dom';
import { CheckCircle2, Package, ArrowRight, AlertCircle, Clock } from 'lucide-react';
import { api } from '../lib/api.js';
import { money, onImgError } from '../lib/format.js';
import { site, whatsappLink } from '../config/site.js';
import Spinner from '../components/ui/Spinner.jsx';

const methodLabel = { cod: 'Cash on Delivery', card: 'Card / Online payment' };

export default function OrderSuccess() {
  const { number } = useParams();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const paidParam = searchParams.get('paid'); // '1' | '0' | null
  const [order, setOrder] = useState(location.state?.order || null);
  const [loading, setLoading] = useState(!order);

  useEffect(() => {
    if (order) return;
    api
      .get(`/orders/track/${number}`)
      .then(setOrder)
      .catch(() => setOrder(null))
      .finally(() => setLoading(false));
  }, [number, order]);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Spinner />
      </div>
    );
  }
  if (!order) {
    return (
      <div className="container-page flex min-h-[60vh] flex-col items-center justify-center gap-4 text-center">
        <p className="text-2xl font-semibold">Order not found</p>
        <Link to="/" className="btn-primary">
          Back home
        </Link>
      </div>
    );
  }

  return (
    <div className="container-page max-w-3xl py-12">
      <div className="flex flex-col items-center text-center">
        <span className="grid h-20 w-20 place-items-center rounded-full bg-sage-light/40">
          <CheckCircle2 className="h-11 w-11 text-sage-dark" />
        </span>
        <h1 className="mt-5 text-3xl font-semibold sm:text-4xl">Thank you for your order!</h1>
        <p className="mt-2 text-stone">
          We’ve received your order and our team will call you shortly to confirm details and
          delivery.
        </p>
        <p className="mt-4 rounded-full bg-sand px-5 py-2 text-sm">
          Order number: <strong className="text-walnut-dark">{order.order_number}</strong>
        </p>

        {order.payment_method !== 'cod' &&
          (order.payment_status === 'paid' ? (
            <p className="mt-3 flex items-center gap-2 rounded-xl bg-green-50 px-4 py-2.5 text-sm font-medium text-green-700">
              <CheckCircle2 className="h-4 w-4" /> Payment received — thank you!
            </p>
          ) : paidParam === '0' ? (
            <p className="mt-3 flex items-center gap-2 rounded-xl bg-red-50 px-4 py-2.5 text-sm font-medium text-red-600">
              <AlertCircle className="h-4 w-4" /> Payment wasn’t completed. Your order is saved — you can retry or pay on delivery.
            </p>
          ) : (
            <p className="mt-3 flex items-center gap-2 rounded-xl bg-amber-50 px-4 py-2.5 text-sm font-medium text-amber-700">
              <Clock className="h-4 w-4" /> Payment pending confirmation.
            </p>
          ))}
      </div>

      <div className="card mt-8 p-6">
        <div className="flex items-center gap-2 text-lg font-semibold">
          <Package className="h-5 w-5 text-brass" /> Order summary
        </div>
        <div className="mt-5 space-y-3">
          {order.items.map((i) => (
            <div key={i.id} className="flex items-center gap-3">
              <img src={i.image} onError={onImgError} alt={i.name} className="h-14 w-14 rounded-lg object-cover ring-1 ring-linen" />
              <span className="flex-1 text-sm">
                {i.name} <span className="text-stone">× {i.qty}</span>
              </span>
              <span className="text-sm font-medium">{money(i.lineTotal)}</span>
            </div>
          ))}
        </div>
        <dl className="mt-5 space-y-2 border-t border-linen pt-5 text-sm">
          <div className="flex justify-between">
            <dt className="text-stone">Subtotal</dt>
            <dd>{money(order.subtotal)}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-stone">Shipping</dt>
            <dd>{order.shipping === 0 ? 'Free' : money(order.shipping)}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-stone">Payment</dt>
            <dd>{methodLabel[order.payment_method] || order.payment_method}</dd>
          </div>
          <div className="flex justify-between border-t border-linen pt-2 text-base font-semibold">
            <dt>Total</dt>
            <dd className="text-walnut-dark">{money(order.total)}</dd>
          </div>
        </dl>
        <div className="mt-5 rounded-xl bg-sand p-4 text-sm text-stone">
          <p><strong className="text-ink">Deliver to:</strong> {order.customer_name}, {order.phone}</p>
          <p className="mt-1">{order.address}{order.city ? `, ${order.city}` : ''}</p>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <Link to="/shop" className="btn-primary">
          Continue shopping <ArrowRight className="h-4 w-4" />
        </Link>
        <a
          href={whatsappLink(`Hi! I just placed order ${order.order_number}.`)}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-outline"
        >
          Confirm on WhatsApp
        </a>
      </div>
      <p className="mt-4 text-center text-xs text-stone">
        Need help? Call us at {site.phone}
      </p>
    </div>
  );
}

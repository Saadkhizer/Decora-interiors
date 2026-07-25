import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ShoppingBag,
  MessageCircle,
  Truck,
  Ruler,
  ShieldCheck,
  Check,
  ArrowLeft,
} from 'lucide-react';
import { api } from '../lib/api.js';
import { useCart } from '../context/CartContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import { money, effectivePrice, discountPct, onImgError } from '../lib/format.js';
import Rating from '../components/ui/Rating.jsx';
import Badge from '../components/ui/Badge.jsx';
import Breadcrumbs from '../components/ui/Breadcrumbs.jsx';
import QuantitySelector from '../components/product/QuantitySelector.jsx';
import ProductGrid from '../components/product/ProductGrid.jsx';
import Spinner from '../components/ui/Spinner.jsx';
import { whatsappLink } from '../config/site.js';
import QuoteModal from '../components/product/QuoteModal.jsx';

export default function ProductDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { add } = useCart();
  const toast = useToast();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImg, setActiveImg] = useState(0);
  const [qty, setQty] = useState(1);
  const [quoteOpen, setQuoteOpen] = useState(false);

  useEffect(() => {
    setLoading(true);
    setActiveImg(0);
    setQty(1);
    api
      .get(`/products/${slug}`)
      .then(setData)
      .catch(() => setData(null))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Spinner />
      </div>
    );
  }
  if (!data?.product) {
    return (
      <div className="container-page flex min-h-[60vh] flex-col items-center justify-center gap-4 text-center">
        <p className="text-2xl font-semibold">Product not found</p>
        <Link to="/shop" className="btn-primary">
          <ArrowLeft className="h-4 w-4" /> Back to shop
        </Link>
      </div>
    );
  }

  const p = data.product;
  const pct = discountPct(p);
  const specs = Object.entries(p.specs || {});

  function addToCart() {
    add(p, qty);
    toast.success(`${qty} × ${p.name} added to cart`);
  }
  function buyNow() {
    add(p, qty);
    navigate('/checkout');
  }

  return (
    <div className="container-page py-8 lg:py-10">
      <Breadcrumbs
        items={[
          { label: 'Shop', to: '/shop' },
          { label: p.category_name, to: `/category/${p.category_slug}` },
          { label: p.name },
        ]}
      />

      <div className="mt-6 grid gap-10 lg:grid-cols-2">
        {/* Gallery */}
        <div className="flex flex-col gap-4">
          <div className="relative overflow-hidden rounded-3xl bg-linen shadow-card ring-1 ring-linen">
            <img
              src={p.images?.[activeImg]}
              onError={onImgError}
              alt={p.name}
              className="aspect-square w-full object-cover"
            />
            <div className="absolute left-4 top-4 flex flex-col gap-1.5">
              {pct > 0 && <Badge variant="sale">-{pct}%</Badge>}
              {p.is_new && <Badge variant="new">New</Badge>}
            </div>
          </div>
          {p.images?.length > 1 && (
            <div className="flex gap-3">
              {p.images.map((src, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImg(i)}
                  className={`overflow-hidden rounded-xl ring-2 transition ${
                    activeImg === i ? 'ring-brass' : 'ring-transparent hover:ring-linen'
                  }`}
                >
                  <img
                    src={src}
                    onError={onImgError}
                    alt={`${p.name} view ${i + 1}`}
                    className="h-20 w-20 object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div>
          <Link
            to={`/category/${p.category_slug}`}
            className="text-sm font-semibold uppercase tracking-wide text-brass-dark hover:underline"
          >
            {p.category_name}
          </Link>
          <h1 className="mt-2 text-3xl font-semibold leading-tight sm:text-4xl">{p.name}</h1>
          <div className="mt-3 flex items-center gap-3">
            <Rating value={p.rating} />
            <span className="text-sm text-stone">
              {p.rating} · {p.review_count} reviews
            </span>
            {p.sku && <span className="text-sm text-taupe-dark">SKU: {p.sku}</span>}
          </div>

          <div className="mt-5 flex items-baseline gap-3">
            <span className="font-display text-4xl font-semibold text-walnut-dark">
              {money(effectivePrice(p))}
            </span>
            {p.sale_price && (
              <span className="text-xl text-stone line-through">{money(p.price)}</span>
            )}
            <span className="text-sm text-stone">/ {p.unit}</span>
          </div>

          <p className="mt-5 leading-relaxed text-stone">{p.short_desc}</p>

          <div className="mt-4 flex items-center gap-2 text-sm">
            {p.in_stock ? (
              <span className="inline-flex items-center gap-1.5 font-medium text-sage-dark">
                <Check className="h-4 w-4" /> In stock — ready to ship
              </span>
            ) : (
              <span className="font-medium text-red-500">Currently out of stock</span>
            )}
          </div>

          {/* Actions */}
          <div className="mt-7 flex flex-wrap items-center gap-3">
            <QuantitySelector value={qty} onChange={setQty} />
            <button onClick={addToCart} disabled={!p.in_stock} className="btn-primary flex-1 sm:flex-none">
              <ShoppingBag className="h-4 w-4" /> Add to cart
            </button>
            <button onClick={buyNow} disabled={!p.in_stock} className="btn-gold">
              Buy now
            </button>
          </div>
          <div className="mt-3 flex flex-wrap gap-3">
            <button onClick={() => setQuoteOpen(true)} className="btn-outline btn-sm">
              <Ruler className="h-4 w-4" /> Request a quote
            </button>
            <a
              href={whatsappLink(`Hi! I'm interested in "${p.name}". Please share details.`)}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-outline btn-sm"
            >
              <MessageCircle className="h-4 w-4" /> Ask on WhatsApp
            </a>
          </div>

          {/* Trust strip */}
          <div className="mt-7 grid grid-cols-3 gap-3 rounded-2xl bg-sand p-4 text-center text-xs text-stone">
            <span className="flex flex-col items-center gap-1.5">
              <Ruler className="h-5 w-5 text-brass-dark" /> Free measurement
            </span>
            <span className="flex flex-col items-center gap-1.5">
              <Truck className="h-5 w-5 text-brass-dark" /> Fast delivery
            </span>
            <span className="flex flex-col items-center gap-1.5">
              <ShieldCheck className="h-5 w-5 text-brass-dark" /> Quality assured
            </span>
          </div>
        </div>
      </div>

      {/* Description + specs */}
      <div className="mt-14 grid gap-10 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <h2 className="text-2xl font-semibold">Description</h2>
          <p className="mt-4 leading-relaxed text-stone">{p.description}</p>
        </div>
        {specs.length > 0 && (
          <div>
            <h2 className="text-2xl font-semibold">Specifications</h2>
            <dl className="mt-4 overflow-hidden rounded-2xl ring-1 ring-linen">
              {specs.map(([k, v], i) => (
                <div
                  key={k}
                  className={`flex justify-between gap-4 px-4 py-3 text-sm ${
                    i % 2 ? 'bg-white' : 'bg-sand'
                  }`}
                >
                  <dt className="text-stone">{k}</dt>
                  <dd className="font-medium text-ink">{v}</dd>
                </div>
              ))}
            </dl>
          </div>
        )}
      </div>

      {/* Related */}
      {data.related?.length > 0 && (
        <section className="mt-16">
          <h2 className="mb-6 text-2xl font-semibold sm:text-3xl">You may also like</h2>
          <ProductGrid products={data.related} />
        </section>
      )}

      <QuoteModal open={quoteOpen} onClose={() => setQuoteOpen(false)} product={p} />
    </div>
  );
}

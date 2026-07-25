import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { api } from '../../lib/api.js';
import { onImgError } from '../../lib/format.js';
import SectionHeading from '../ui/SectionHeading.jsx';
import { Skeleton } from '../ui/Skeleton.jsx';

export default function CategoryStrip() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get('/categories')
      .then(setCategories)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="container-page py-16 lg:py-20">
      <div className="mb-9 flex flex-wrap items-end justify-between gap-4">
        <SectionHeading
          kicker="Shop by category"
          title="Everything for a flawless finish"
          subtitle="From statement wallpapers to hard-wearing floors — explore our full range."
        />
        <Link to="/shop" className="btn-ghost hidden sm:inline-flex">
          View all <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:gap-5 md:grid-cols-3 lg:grid-cols-4">
        {loading
          ? Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className="aspect-[4/3] w-full rounded-2xl" />
            ))
          : categories.map((c) => (
              <Link
                key={c.id}
                to={`/category/${c.slug}`}
                className="group relative overflow-hidden rounded-2xl shadow-card ring-1 ring-linen"
              >
                <img
                  src={c.image}
                  onError={onImgError}
                  alt={c.name}
                  loading="lazy"
                  className="aspect-[4/3] w-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-walnut-dark/85 via-walnut-dark/15 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-4">
                  <h3 className="font-display text-xl font-semibold text-cream">{c.name}</h3>
                  <p className="mt-0.5 flex items-center gap-1 text-xs text-cream/80">
                    {c.product_count} products
                    <ArrowRight className="h-3.5 w-3.5 -translate-x-1 opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100" />
                  </p>
                </div>
              </Link>
            ))}
      </div>
    </section>
  );
}

import { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { SlidersHorizontal, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { api } from '../lib/api.js';
import ProductGrid from '../components/product/ProductGrid.jsx';
import Breadcrumbs from '../components/ui/Breadcrumbs.jsx';

const sortOptions = [
  ['newest', 'Newest'],
  ['price-asc', 'Price: Low to High'],
  ['price-desc', 'Price: High to Low'],
  ['rating', 'Top rated'],
  ['name', 'Name A–Z'],
];
const priceBands = [
  ['', 'Any price'],
  ['0-500', 'Under Rs 500'],
  ['500-2000', 'Rs 500 – 2,000'],
  ['2000-5000', 'Rs 2,000 – 5,000'],
  ['5000-', 'Rs 5,000+'],
];

export default function Shop() {
  const { slug } = useParams();
  const [params, setParams] = useSearchParams();
  const [categories, setCategories] = useState([]);
  const [data, setData] = useState({ products: [], total: 0, pages: 1, page: 1 });
  const [loading, setLoading] = useState(true);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const search = params.get('search') || '';
  const sort = params.get('sort') || 'newest';
  const band = params.get('price') || '';
  const page = Number(params.get('page') || 1);
  const activeCategory = slug || params.get('category') || '';

  useEffect(() => {
    api.get('/categories').then(setCategories).catch(() => {});
  }, []);

  useEffect(() => {
    setLoading(true);
    const q = new URLSearchParams();
    if (activeCategory) q.set('category', activeCategory);
    if (search) q.set('search', search);
    if (sort) q.set('sort', sort);
    q.set('page', page);
    q.set('limit', 12);
    if (band) {
      const [min, max] = band.split('-');
      if (min) q.set('minPrice', min);
      if (max) q.set('maxPrice', max);
    }
    api
      .get(`/products?${q.toString()}`)
      .then(setData)
      .catch(() => {})
      .finally(() => setLoading(false));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activeCategory, search, sort, band, page]);

  function update(key, value) {
    const next = new URLSearchParams(params);
    if (value) next.set(key, value);
    else next.delete(key);
    if (key !== 'page') next.delete('page'); // reset paging when filters change
    setParams(next);
  }

  const currentCat = categories.find((c) => c.slug === activeCategory);
  const heading = currentCat ? currentCat.name : search ? `Results for "${search}"` : 'All Products';

  const Filters = (
    <div className="space-y-8">
      <div>
        <h3 className="mb-3 text-sm font-semibold uppercase tracking-widest2 text-stone">
          Categories
        </h3>
        <ul className="space-y-1">
          <li>
            <button
              onClick={() => {
                update('category', '');
                setFiltersOpen(false);
              }}
              className={`w-full rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                !activeCategory ? 'bg-linen font-medium text-walnut-dark' : 'text-stone hover:bg-cream'
              }`}
            >
              All products
            </button>
          </li>
          {categories.map((c) => (
            <li key={c.id}>
              <a
                href={`/category/${c.slug}`}
                className={`flex items-center justify-between rounded-lg px-3 py-2 text-sm transition-colors ${
                  activeCategory === c.slug
                    ? 'bg-linen font-medium text-walnut-dark'
                    : 'text-stone hover:bg-cream'
                }`}
              >
                {c.name}
                <span className="text-xs text-taupe-dark">{c.product_count}</span>
              </a>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h3 className="mb-3 text-sm font-semibold uppercase tracking-widest2 text-stone">Price</h3>
        <ul className="space-y-1">
          {priceBands.map(([value, label]) => (
            <li key={value}>
              <label className="flex cursor-pointer items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-stone hover:bg-cream">
                <input
                  type="radio"
                  name="price"
                  checked={band === value}
                  onChange={() => update('price', value)}
                  className="accent-brass"
                />
                {label}
              </label>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );

  return (
    <div className="container-page py-8 lg:py-10">
      <Breadcrumbs
        items={[{ label: 'Shop', to: '/shop' }, ...(currentCat ? [{ label: currentCat.name }] : [])]}
      />

      <div className="mt-4 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-3xl font-semibold sm:text-4xl">{heading}</h1>
          <p className="mt-1 text-sm text-stone">
            {loading ? 'Loading…' : `${data.total} product${data.total === 1 ? '' : 's'}`}
            {currentCat?.tagline && ` · ${currentCat.tagline}`}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setFiltersOpen(true)}
            className="btn-outline btn-sm lg:hidden"
          >
            <SlidersHorizontal className="h-4 w-4" /> Filters
          </button>
          <select
            value={sort}
            onChange={(e) => update('sort', e.target.value)}
            aria-label="Sort products"
            className="input w-auto cursor-pointer py-2.5 text-sm"
          >
            {sortOptions.map(([v, l]) => (
              <option key={v} value={v}>
                {l}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-8 flex gap-8">
        {/* Sidebar (desktop) */}
        <aside className="hidden w-60 shrink-0 lg:block">{Filters}</aside>

        {/* Grid */}
        <div className="min-w-0 flex-1">
          {!loading && data.products.length === 0 ? (
            <div className="card flex flex-col items-center gap-3 px-6 py-20 text-center">
              <p className="text-lg font-medium">No products found</p>
              <p className="text-sm text-stone">Try a different category or clear your filters.</p>
              <button onClick={() => setParams({})} className="btn-primary btn-sm mt-2">
                Clear filters
              </button>
            </div>
          ) : (
            <ProductGrid products={data.products} loading={loading} skeletonCount={9} />
          )}

          {/* Pagination */}
          {data.pages > 1 && (
            <div className="mt-10 flex items-center justify-center gap-1.5">
              <button
                disabled={page <= 1}
                onClick={() => update('page', String(page - 1))}
                className="grid h-10 w-10 place-items-center rounded-full ring-1 ring-linen disabled:opacity-40 hover:bg-linen"
                aria-label="Previous page"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              {Array.from({ length: data.pages }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => update('page', String(i + 1))}
                  className={`h-10 w-10 rounded-full text-sm font-medium transition-colors ${
                    page === i + 1
                      ? 'bg-walnut text-cream'
                      : 'ring-1 ring-linen text-stone hover:bg-linen'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
              <button
                disabled={page >= data.pages}
                onClick={() => update('page', String(page + 1))}
                className="grid h-10 w-10 place-items-center rounded-full ring-1 ring-linen disabled:opacity-40 hover:bg-linen"
                aria-label="Next page"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile filter drawer */}
      <div className={`fixed inset-0 z-50 lg:hidden ${filtersOpen ? '' : 'pointer-events-none'}`}>
        <div
          onClick={() => setFiltersOpen(false)}
          className={`absolute inset-0 bg-walnut-dark/40 backdrop-blur-sm transition-opacity ${
            filtersOpen ? 'opacity-100' : 'opacity-0'
          }`}
        />
        <aside
          className={`absolute left-0 top-0 h-full w-[min(86vw,320px)] overflow-y-auto bg-cream p-5 shadow-lift transition-transform duration-300 ${
            filtersOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <div className="mb-6 flex items-center justify-between">
            <span className="font-display text-2xl font-semibold text-walnut-dark">Filters</span>
            <button onClick={() => setFiltersOpen(false)} aria-label="Close filters" className="btn-ghost p-2">
              <X className="h-5 w-5" />
            </button>
          </div>
          {Filters}
        </aside>
      </div>
    </div>
  );
}

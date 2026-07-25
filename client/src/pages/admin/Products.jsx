import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Pencil, Trash2, Search } from 'lucide-react';
import { api } from '../../lib/api.js';
import { money, effectivePrice, onImgError } from '../../lib/format.js';
import { useToast } from '../../context/ToastContext.jsx';
import Spinner from '../../components/ui/Spinner.jsx';

export default function AdminProducts() {
  const toast = useToast();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  function load() {
    setLoading(true);
    api
      .get('/products?limit=100&sort=name')
      .then((d) => setProducts(d.products))
      .catch(() => {})
      .finally(() => setLoading(false));
  }
  useEffect(load, []);

  async function remove(p) {
    if (!confirm(`Delete "${p.name}"? This cannot be undone.`)) return;
    try {
      await api.del(`/products/${p.id}`, { auth: true });
      setProducts((list) => list.filter((x) => x.id !== p.id));
      toast.success('Product deleted');
    } catch (err) {
      toast.error(err.message || 'Delete failed');
    }
  }

  const filtered = products.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.category_name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold sm:text-3xl">Products</h1>
          <p className="mt-1 text-stone">{products.length} products in your catalogue.</p>
        </div>
        <Link to="/admin/products/new" className="btn-gold">
          <Plus className="h-4 w-4" /> Add product
        </Link>
      </div>

      <div className="relative mt-6 max-w-sm">
        <Search className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-stone" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search products…"
          className="input pl-11"
        />
      </div>

      {loading ? (
        <div className="flex min-h-[40vh] items-center justify-center">
          <Spinner />
        </div>
      ) : (
        <div className="mt-6 overflow-hidden rounded-2xl bg-white shadow-card ring-1 ring-linen">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-sand text-xs uppercase tracking-wide text-stone">
                <tr>
                  <th className="px-4 py-3 font-semibold">Product</th>
                  <th className="px-4 py-3 font-semibold">Category</th>
                  <th className="px-4 py-3 font-semibold">Price</th>
                  <th className="px-4 py-3 font-semibold">Status</th>
                  <th className="px-4 py-3 text-right font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-linen">
                {filtered.map((p) => (
                  <tr key={p.id} className="hover:bg-cream/60">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={p.images?.[0]}
                          onError={onImgError}
                          alt=""
                          className="h-12 w-12 rounded-lg object-cover ring-1 ring-linen"
                        />
                        <span className="font-medium text-ink">{p.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-stone">{p.category_name}</td>
                    <td className="px-4 py-3 font-medium">{money(effectivePrice(p))}</td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1">
                        {p.featured ? (
                          <span className="rounded-full bg-brass/10 px-2 py-0.5 text-xs text-brass-dark">Featured</span>
                        ) : null}
                        <span
                          className={`rounded-full px-2 py-0.5 text-xs ${
                            p.in_stock ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                          }`}
                        >
                          {p.in_stock ? 'In stock' : 'Out'}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-1">
                        <Link
                          to={`/admin/products/${p.id}/edit`}
                          className="grid h-9 w-9 place-items-center rounded-lg text-stone hover:bg-sand hover:text-brass-dark"
                          aria-label="Edit"
                        >
                          <Pencil className="h-4 w-4" />
                        </Link>
                        <button
                          onClick={() => remove(p)}
                          className="grid h-9 w-9 place-items-center rounded-lg text-stone hover:bg-red-50 hover:text-red-500"
                          aria-label="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filtered.length === 0 && (
            <p className="px-4 py-10 text-center text-sm text-stone">No products match your search.</p>
          )}
        </div>
      )}
    </div>
  );
}

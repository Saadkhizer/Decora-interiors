import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Plus, X, Upload, Image as ImageIcon } from 'lucide-react';
import { api } from '../../lib/api.js';
import { onImgError } from '../../lib/format.js';
import { useToast } from '../../context/ToastContext.jsx';
import Spinner from '../../components/ui/Spinner.jsx';

const units = ['piece', 'roll', 'sq ft', 'sq m', 'set', 'meter'];

const empty = {
  name: '',
  category_id: '',
  price: '',
  sale_price: '',
  unit: 'piece',
  short_desc: '',
  description: '',
  images: [],
  specs: {},
  sku: '',
  in_stock: true,
  featured: false,
  is_new: false,
};

export default function ProductForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const toast = useToast();

  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState(empty);
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [specKey, setSpecKey] = useState('');
  const [specVal, setSpecVal] = useState('');

  useEffect(() => {
    api.get('/categories').then(setCategories).catch(() => {});
  }, []);

  useEffect(() => {
    if (!isEdit) return;
    // Find product by id via the admin list (products endpoint is slug-based).
    api
      .get('/products?limit=100')
      .then((d) => {
        const p = d.products.find((x) => String(x.id) === String(id));
        if (!p) throw new Error('not found');
        setForm({
          name: p.name,
          category_id: p.category_id,
          price: p.price,
          sale_price: p.sale_price ?? '',
          unit: p.unit,
          short_desc: p.short_desc || '',
          description: p.description || '',
          images: p.images || [],
          specs: p.specs || {},
          sku: p.sku || '',
          in_stock: !!p.in_stock,
          featured: !!p.featured,
          is_new: !!p.is_new,
        });
      })
      .catch(() => toast.error('Product not found'))
      .finally(() => setLoading(false));
  }, [id, isEdit]);

  const set = (k) => (e) =>
    setForm((f) => ({ ...f, [k]: e.target.type === 'checkbox' ? e.target.checked : e.target.value }));

  function addImageUrl() {
    if (!imageUrl.trim()) return;
    setForm((f) => ({ ...f, images: [...f.images, imageUrl.trim()] }));
    setImageUrl('');
  }
  function removeImage(i) {
    setForm((f) => ({ ...f, images: f.images.filter((_, idx) => idx !== i) }));
  }
  async function onUpload(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const { url } = await api.upload(file);
      setForm((f) => ({ ...f, images: [...f.images, url] }));
      toast.success('Image uploaded');
    } catch (err) {
      toast.error(err.message || 'Upload failed');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  }
  function addSpec() {
    if (!specKey.trim()) return;
    setForm((f) => ({ ...f, specs: { ...f.specs, [specKey.trim()]: specVal.trim() } }));
    setSpecKey('');
    setSpecVal('');
  }
  function removeSpec(k) {
    setForm((f) => {
      const next = { ...f.specs };
      delete next[k];
      return { ...f, specs: next };
    });
  }

  async function submit(e) {
    e.preventDefault();
    if (!form.name || !form.category_id || form.price === '') {
      toast.error('Name, category and price are required.');
      return;
    }
    setSaving(true);
    const payload = {
      ...form,
      price: Number(form.price),
      sale_price: form.sale_price === '' ? null : Number(form.sale_price),
      category_id: Number(form.category_id),
    };
    try {
      if (isEdit) await api.put(`/products/${id}`, payload, { auth: true });
      else await api.post('/products', payload, { auth: true });
      toast.success(`Product ${isEdit ? 'updated' : 'created'}`);
      navigate('/admin/products');
    } catch (err) {
      toast.error(err.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="max-w-4xl">
      <Link to="/admin/products" className="btn-ghost mb-4 inline-flex">
        <ArrowLeft className="h-4 w-4" /> Back to products
      </Link>
      <h1 className="text-2xl font-semibold sm:text-3xl">{isEdit ? 'Edit product' : 'New product'}</h1>

      <form onSubmit={submit} className="mt-6 space-y-6">
        <section className="card space-y-4 p-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="label" htmlFor="name">Product name *</label>
              <input id="name" required value={form.name} onChange={set('name')} className="input" />
            </div>
            <div>
              <label className="label" htmlFor="category">Category *</label>
              <select id="category" required value={form.category_id} onChange={set('category_id')} className="input cursor-pointer">
                <option value="">Select category…</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="label" htmlFor="unit">Unit</label>
              <select id="unit" value={form.unit} onChange={set('unit')} className="input cursor-pointer">
                {units.map((u) => (
                  <option key={u}>{u}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="label" htmlFor="price">Price (Rs) *</label>
              <input id="price" type="number" min="0" step="0.01" required value={form.price} onChange={set('price')} className="input" />
            </div>
            <div>
              <label className="label" htmlFor="sale">Sale price (Rs)</label>
              <input id="sale" type="number" min="0" step="0.01" value={form.sale_price} onChange={set('sale_price')} placeholder="Optional" className="input" />
            </div>
            <div>
              <label className="label" htmlFor="sku">SKU</label>
              <input id="sku" value={form.sku} onChange={set('sku')} className="input" />
            </div>
          </div>
          <div>
            <label className="label" htmlFor="short">Short description</label>
            <input id="short" value={form.short_desc} onChange={set('short_desc')} className="input" />
          </div>
          <div>
            <label className="label" htmlFor="desc">Full description</label>
            <textarea id="desc" rows={4} value={form.description} onChange={set('description')} className="input resize-none" />
          </div>
        </section>

        {/* Images */}
        <section className="card p-6">
          <h2 className="text-lg font-semibold">Images</h2>
          <div className="mt-4 flex flex-wrap gap-3">
            {form.images.map((src, i) => (
              <div key={i} className="group relative h-24 w-24 overflow-hidden rounded-xl ring-1 ring-linen">
                <img src={src} onError={onImgError} alt="" className="h-full w-full object-cover" />
                <button
                  type="button"
                  onClick={() => removeImage(i)}
                  className="absolute right-1 top-1 grid h-6 w-6 place-items-center rounded-full bg-white/90 text-stone opacity-0 transition-opacity group-hover:opacity-100 hover:text-red-500"
                  aria-label="Remove image"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
            <label className="grid h-24 w-24 cursor-pointer place-items-center rounded-xl border-2 border-dashed border-taupe text-stone hover:border-brass hover:text-brass-dark">
              {uploading ? <Spinner className="h-6 w-6" /> : <Upload className="h-6 w-6" />}
              <input type="file" accept="image/*" onChange={onUpload} className="hidden" />
            </label>
          </div>
          <div className="mt-4 flex gap-2">
            <div className="relative flex-1">
              <ImageIcon className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-stone" />
              <input
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="…or paste an image URL"
                className="input pl-11"
              />
            </div>
            <button type="button" onClick={addImageUrl} className="btn-outline btn-sm">
              <Plus className="h-4 w-4" /> Add
            </button>
          </div>
        </section>

        {/* Specs */}
        <section className="card p-6">
          <h2 className="text-lg font-semibold">Specifications</h2>
          {Object.keys(form.specs).length > 0 && (
            <div className="mt-4 space-y-2">
              {Object.entries(form.specs).map(([k, v]) => (
                <div key={k} className="flex items-center gap-3 rounded-xl bg-sand px-4 py-2 text-sm">
                  <span className="font-medium text-ink">{k}</span>
                  <span className="text-stone">{v}</span>
                  <button
                    type="button"
                    onClick={() => removeSpec(k)}
                    className="ml-auto text-stone hover:text-red-500"
                    aria-label="Remove spec"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
          <div className="mt-4 flex flex-wrap gap-2">
            <input value={specKey} onChange={(e) => setSpecKey(e.target.value)} placeholder="Name (e.g. Material)" className="input flex-1" />
            <input value={specVal} onChange={(e) => setSpecVal(e.target.value)} placeholder="Value (e.g. Vinyl)" className="input flex-1" />
            <button type="button" onClick={addSpec} className="btn-outline btn-sm">
              <Plus className="h-4 w-4" /> Add
            </button>
          </div>
        </section>

        {/* Flags */}
        <section className="card flex flex-wrap gap-6 p-6">
          {[
            ['in_stock', 'In stock'],
            ['featured', 'Featured on homepage'],
            ['is_new', 'Mark as new'],
          ].map(([key, label]) => (
            <label key={key} className="flex cursor-pointer items-center gap-2.5 text-sm font-medium">
              <input type="checkbox" checked={form[key]} onChange={set(key)} className="h-4.5 w-4.5 accent-brass" />
              {label}
            </label>
          ))}
        </section>

        <div className="flex gap-3">
          <button type="submit" disabled={saving} className="btn-gold">
            {saving ? 'Saving…' : isEdit ? 'Save changes' : 'Create product'}
          </button>
          <Link to="/admin/products" className="btn-outline">Cancel</Link>
        </div>
      </form>
    </div>
  );
}

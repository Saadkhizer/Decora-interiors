import { useEffect, useState } from 'react';
import { Plus, Trash2, Upload } from 'lucide-react';
import { api } from '../../lib/api.js';
import { onImgError } from '../../lib/format.js';
import { useToast } from '../../context/ToastContext.jsx';
import Spinner from '../../components/ui/Spinner.jsx';

export default function AdminGallery() {
  const toast = useToast();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ title: '', category: '', image: '' });
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  function load() {
    setLoading(true);
    api.get('/gallery').then(setItems).catch(() => {}).finally(() => setLoading(false));
  }
  useEffect(load, []);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  async function onUpload(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const { url } = await api.upload(file);
      setForm((f) => ({ ...f, image: url }));
      toast.success('Image uploaded — now click Add');
    } catch (err) {
      toast.error(err.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  }

  async function add(e) {
    e.preventDefault();
    if (!form.image) return toast.error('Add an image (upload or URL)');
    setSaving(true);
    try {
      await api.post('/gallery', form, { auth: true });
      setForm({ title: '', category: '', image: '' });
      toast.success('Added to gallery');
      load();
    } catch (err) {
      toast.error(err.message || 'Could not add');
    } finally {
      setSaving(false);
    }
  }
  async function remove(g) {
    if (!confirm('Remove this image?')) return;
    try {
      await api.del(`/gallery/${g.id}`, { auth: true });
      setItems((list) => list.filter((x) => x.id !== g.id));
      toast.success('Removed');
    } catch (err) {
      toast.error(err.message || 'Delete failed');
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold sm:text-3xl">Project gallery</h1>
      <p className="mt-1 text-stone">Showcase completed work on the storefront gallery page.</p>

      {/* Add form */}
      <form onSubmit={add} className="card mt-6 grid gap-3 p-5 sm:grid-cols-[1fr_1fr_auto]">
        <input value={form.title} onChange={set('title')} placeholder="Title (optional)" className="input" />
        <input value={form.category} onChange={set('category')} placeholder="Category (e.g. Wallpaper)" className="input" />
        <div className="flex gap-2">
          <input value={form.image} onChange={set('image')} placeholder="Image URL" className="input flex-1" />
          <label className="btn-outline btn-sm cursor-pointer whitespace-nowrap">
            {uploading ? <Spinner className="h-4 w-4" /> : <Upload className="h-4 w-4" />}
            <input type="file" accept="image/*" onChange={onUpload} className="hidden" />
          </label>
          <button type="submit" disabled={saving} className="btn-gold btn-sm">
            <Plus className="h-4 w-4" /> Add
          </button>
        </div>
      </form>

      {form.image && (
        <img src={form.image} onError={onImgError} alt="preview" className="mt-3 h-24 w-24 rounded-xl object-cover ring-1 ring-linen" />
      )}

      {loading ? (
        <div className="flex min-h-[30vh] items-center justify-center"><Spinner /></div>
      ) : (
        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {items.map((g) => (
            <div key={g.id} className="group relative overflow-hidden rounded-2xl ring-1 ring-linen">
              <img src={g.image} onError={onImgError} alt={g.title} className="aspect-square w-full object-cover" />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-walnut-dark/80 to-transparent p-3">
                <p className="text-xs font-medium text-cream">{g.title}</p>
                <p className="text-[11px] text-cream/70">{g.category}</p>
              </div>
              <button
                onClick={() => remove(g)}
                className="absolute right-2 top-2 grid h-8 w-8 place-items-center rounded-full bg-white/90 text-stone opacity-0 transition-opacity group-hover:opacity-100 hover:text-red-500"
                aria-label="Remove"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}
      {!loading && items.length === 0 && (
        <p className="card mt-6 px-6 py-12 text-center text-stone">No gallery images yet.</p>
      )}
    </div>
  );
}

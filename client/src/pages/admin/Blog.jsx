import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, X, Upload } from 'lucide-react';
import { api } from '../../lib/api.js';
import { onImgError } from '../../lib/format.js';
import { useToast } from '../../context/ToastContext.jsx';
import Spinner from '../../components/ui/Spinner.jsx';

const empty = { title: '', tag: '', excerpt: '', body: '', cover: '', published: true };

export default function AdminBlog() {
  const toast = useToast();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null); // post object or null
  const [form, setForm] = useState(empty);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  function load() {
    setLoading(true);
    api.get('/blog?all=true').then(setPosts).catch(() => {}).finally(() => setLoading(false));
  }
  useEffect(load, []);

  function openNew() {
    setForm(empty);
    setEditing({ id: null });
  }
  function openEdit(p) {
    setForm({ title: p.title, tag: p.tag || '', excerpt: p.excerpt || '', body: p.body || '', cover: p.cover || '', published: !!p.published });
    setEditing(p);
  }
  const set = (k) => (e) =>
    setForm((f) => ({ ...f, [k]: e.target.type === 'checkbox' ? e.target.checked : e.target.value }));

  async function onUpload(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const { url } = await api.upload(file);
      setForm((f) => ({ ...f, cover: url }));
    } catch (err) {
      toast.error(err.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  }

  async function save(e) {
    e.preventDefault();
    if (!form.title) return toast.error('Title is required');
    setSaving(true);
    try {
      if (editing.id) await api.put(`/blog/${editing.id}`, form, { auth: true });
      else await api.post('/blog', form, { auth: true });
      toast.success(`Post ${editing.id ? 'updated' : 'created'}`);
      setEditing(null);
      load();
    } catch (err) {
      toast.error(err.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  }
  async function remove(p) {
    if (!confirm(`Delete "${p.title}"?`)) return;
    try {
      await api.del(`/blog/${p.id}`, { auth: true });
      setPosts((list) => list.filter((x) => x.id !== p.id));
      toast.success('Post deleted');
    } catch (err) {
      toast.error(err.message || 'Delete failed');
    }
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold sm:text-3xl">Journal / Blog</h1>
          <p className="mt-1 text-stone">{posts.length} posts.</p>
        </div>
        <button onClick={openNew} className="btn-gold">
          <Plus className="h-4 w-4" /> New post
        </button>
      </div>

      {loading ? (
        <div className="flex min-h-[40vh] items-center justify-center"><Spinner /></div>
      ) : (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((p) => (
            <div key={p.id} className="card overflow-hidden">
              <img src={p.cover} onError={onImgError} alt="" className="aspect-[16/10] w-full object-cover" />
              <div className="p-4">
                <div className="flex items-center gap-2 text-xs">
                  {p.tag && <span className="rounded-full bg-sand px-2 py-0.5 text-brass-dark">{p.tag}</span>}
                  <span className={`rounded-full px-2 py-0.5 ${p.published ? 'bg-green-100 text-green-700' : 'bg-stone/15 text-stone'}`}>
                    {p.published ? 'Published' : 'Draft'}
                  </span>
                </div>
                <h3 className="mt-2 line-clamp-2 font-medium">{p.title}</h3>
                <div className="mt-3 flex gap-1">
                  <button onClick={() => openEdit(p)} className="btn-outline btn-sm flex-1">
                    <Pencil className="h-4 w-4" /> Edit
                  </button>
                  <button onClick={() => remove(p)} className="grid h-9 w-9 place-items-center rounded-lg text-stone hover:bg-red-50 hover:text-red-500" aria-label="Delete">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Editor modal */}
      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div onClick={() => setEditing(null)} className="absolute inset-0 bg-walnut-dark/50 backdrop-blur-sm" />
          <form onSubmit={save} className="relative max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-3xl bg-cream p-6 shadow-lift">
            <button type="button" onClick={() => setEditing(null)} className="btn-ghost absolute right-3 top-3 p-2" aria-label="Close">
              <X className="h-5 w-5" />
            </button>
            <h2 className="text-xl font-semibold">{editing.id ? 'Edit post' : 'New post'}</h2>
            <div className="mt-4 space-y-3">
              <div>
                <label className="label">Title *</label>
                <input required value={form.title} onChange={set('title')} className="input" />
              </div>
              <div>
                <label className="label">Tag</label>
                <input value={form.tag} onChange={set('tag')} placeholder="Wallpaper, Flooring…" className="input" />
              </div>
              <div>
                <label className="label">Cover image</label>
                <div className="flex gap-2">
                  <input value={form.cover} onChange={set('cover')} placeholder="Image URL" className="input flex-1" />
                  <label className="btn-outline btn-sm cursor-pointer">
                    {uploading ? <Spinner className="h-4 w-4" /> : <Upload className="h-4 w-4" />}
                    <input type="file" accept="image/*" onChange={onUpload} className="hidden" />
                  </label>
                </div>
              </div>
              <div>
                <label className="label">Excerpt</label>
                <textarea rows={2} value={form.excerpt} onChange={set('excerpt')} className="input resize-none" />
              </div>
              <div>
                <label className="label">Body</label>
                <textarea rows={6} value={form.body} onChange={set('body')} className="input resize-none" />
              </div>
              <label className="flex cursor-pointer items-center gap-2 text-sm font-medium">
                <input type="checkbox" checked={form.published} onChange={set('published')} className="h-4 w-4 accent-brass" />
                Published
              </label>
            </div>
            <button type="submit" disabled={saving} className="btn-gold mt-5 w-full">
              {saving ? 'Saving…' : editing.id ? 'Save changes' : 'Create post'}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

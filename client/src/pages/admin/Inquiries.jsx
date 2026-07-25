import { useEffect, useState } from 'react';
import { Mail, Phone, Trash2, Package } from 'lucide-react';
import { api } from '../../lib/api.js';
import { useToast } from '../../context/ToastContext.jsx';
import Spinner from '../../components/ui/Spinner.jsx';

const statusColors = {
  new: 'bg-brass/15 text-brass-dark',
  read: 'bg-blue-100 text-blue-700',
  responded: 'bg-green-100 text-green-700',
};

export default function AdminInquiries() {
  const toast = useToast();
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');

  function load() {
    setLoading(true);
    api.get('/inquiries', { auth: true }).then(setInquiries).catch(() => {}).finally(() => setLoading(false));
  }
  useEffect(load, []);

  async function setStatus(inq, status) {
    try {
      const updated = await api.put(`/inquiries/${inq.id}`, { status }, { auth: true });
      setInquiries((list) => list.map((i) => (i.id === inq.id ? { ...i, ...updated } : i)));
    } catch (err) {
      toast.error(err.message || 'Update failed');
    }
  }
  async function remove(inq) {
    if (!confirm('Delete this inquiry?')) return;
    try {
      await api.del(`/inquiries/${inq.id}`, { auth: true });
      setInquiries((list) => list.filter((i) => i.id !== inq.id));
      toast.success('Inquiry deleted');
    } catch (err) {
      toast.error(err.message || 'Delete failed');
    }
  }

  const filtered = filter ? inquiries.filter((i) => i.type === filter) : inquiries;

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold sm:text-3xl">Inquiries</h1>
          <p className="mt-1 text-stone">Contact messages and quote requests from customers.</p>
        </div>
        <select value={filter} onChange={(e) => setFilter(e.target.value)} className="input w-auto cursor-pointer py-2.5 text-sm">
          <option value="">All types</option>
          <option value="quote">Quote requests</option>
          <option value="contact">Contact messages</option>
        </select>
      </div>

      {loading ? (
        <div className="flex min-h-[40vh] items-center justify-center"><Spinner /></div>
      ) : filtered.length === 0 ? (
        <p className="card mt-6 px-4 py-16 text-center text-sm text-stone">No inquiries yet.</p>
      ) : (
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {filtered.map((i) => (
            <div key={i.id} className="card p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-semibold text-ink">{i.name}</p>
                  <p className="text-xs text-stone">{new Date(i.created_at).toLocaleString()}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${i.type === 'quote' ? 'bg-brass/10 text-brass-dark' : 'bg-sage-light/30 text-sage-dark'}`}>
                    {i.type}
                  </span>
                  <button onClick={() => remove(i)} className="text-stone hover:text-red-500" aria-label="Delete">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {i.subject && <p className="mt-3 text-sm font-medium text-ink">{i.subject}</p>}
              {i.product_name && (
                <p className="mt-1 flex items-center gap-1.5 text-xs text-brass-dark">
                  <Package className="h-3.5 w-3.5" /> {i.product_name}
                </p>
              )}
              <p className="mt-2 text-sm leading-relaxed text-stone">{i.message}</p>

              <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-linen pt-4 text-sm">
                {i.phone && (
                  <a href={`tel:${i.phone}`} className="flex items-center gap-1.5 text-stone hover:text-brass-dark">
                    <Phone className="h-4 w-4" /> {i.phone}
                  </a>
                )}
                {i.email && (
                  <a href={`mailto:${i.email}`} className="flex items-center gap-1.5 text-stone hover:text-brass-dark">
                    <Mail className="h-4 w-4" /> {i.email}
                  </a>
                )}
                <select
                  value={i.status}
                  onChange={(e) => setStatus(i, e.target.value)}
                  className={`ml-auto cursor-pointer rounded-full border-0 px-3 py-1 text-xs font-medium ${statusColors[i.status]}`}
                >
                  {['new', 'read', 'responded'].map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

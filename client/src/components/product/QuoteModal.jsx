import { useState } from 'react';
import { X } from 'lucide-react';
import { api } from '../../lib/api.js';
import { useToast } from '../../context/ToastContext.jsx';

export default function QuoteModal({ open, onClose, product }) {
  const toast = useToast();
  const [form, setForm] = useState({ name: '', phone: '', email: '', message: '' });
  const [submitting, setSubmitting] = useState(false);

  if (!open) return null;

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  async function submit(e) {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post('/inquiries', {
        ...form,
        type: 'quote',
        subject: `Quote request: ${product?.name || ''}`,
        product_id: product?.id || null,
        message:
          form.message || `Please send me a quote for "${product?.name}" including installation.`,
      });
      toast.success('Quote request sent! We will contact you shortly.');
      setForm({ name: '', phone: '', email: '', message: '' });
      onClose();
    } catch (err) {
      toast.error(err.message || 'Could not send request');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div onClick={onClose} className="absolute inset-0 bg-walnut-dark/50 backdrop-blur-sm" />
      <div className="relative w-full max-w-md rounded-3xl bg-cream p-6 shadow-lift animate-fade-up sm:p-8">
        <button onClick={onClose} aria-label="Close" className="btn-ghost absolute right-3 top-3 p-2">
          <X className="h-5 w-5" />
        </button>
        <h2 className="text-2xl font-semibold">Request a quote</h2>
        <p className="mt-1 text-sm text-stone">
          {product ? `For: ${product.name}` : 'Tell us what you need and we’ll get back fast.'}
        </p>
        <form onSubmit={submit} className="mt-5 space-y-4">
          <div>
            <label className="label" htmlFor="q-name">
              Full name *
            </label>
            <input id="q-name" required value={form.name} onChange={set('name')} className="input" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label" htmlFor="q-phone">
                Phone *
              </label>
              <input id="q-phone" required value={form.phone} onChange={set('phone')} className="input" />
            </div>
            <div>
              <label className="label" htmlFor="q-email">
                Email
              </label>
              <input id="q-email" type="email" value={form.email} onChange={set('email')} className="input" />
            </div>
          </div>
          <div>
            <label className="label" htmlFor="q-msg">
              Message
            </label>
            <textarea
              id="q-msg"
              rows={3}
              value={form.message}
              onChange={set('message')}
              placeholder="Area size, location, any requirements…"
              className="input resize-none"
            />
          </div>
          <button type="submit" disabled={submitting} className="btn-gold w-full">
            {submitting ? 'Sending…' : 'Send request'}
          </button>
        </form>
      </div>
    </div>
  );
}

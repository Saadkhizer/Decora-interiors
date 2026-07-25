import { useState } from 'react';
import { MapPin, Phone, Mail, Clock, Send, MessageCircle } from 'lucide-react';
import { api } from '../lib/api.js';
import { useToast } from '../context/ToastContext.jsx';
import { site, whatsappLink } from '../config/site.js';
import Breadcrumbs from '../components/ui/Breadcrumbs.jsx';

export default function Contact() {
  const toast = useToast();
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [submitting, setSubmitting] = useState(false);
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  async function submit(e) {
    e.preventDefault();
    if (!form.name || !form.message) {
      toast.error('Please add your name and a message.');
      return;
    }
    setSubmitting(true);
    try {
      await api.post('/inquiries', { ...form, type: 'contact' });
      toast.success('Message sent! We’ll get back to you soon.');
      setForm({ name: '', email: '', phone: '', subject: '', message: '' });
    } catch (err) {
      toast.error(err.message || 'Could not send message');
    } finally {
      setSubmitting(false);
    }
  }

  const contactItems = [
    { icon: Phone, label: 'Call us', value: site.phone, href: site.phoneHref },
    { icon: Mail, label: 'Email', value: site.email, href: `mailto:${site.email}` },
    { icon: MapPin, label: 'Head office', value: site.address },
    { icon: Clock, label: 'Hours', value: site.hours },
  ];

  return (
    <div className="container-page py-8 lg:py-12">
      <Breadcrumbs items={[{ label: 'Contact' }]} />
      <div className="mt-4 max-w-2xl">
        <span className="kicker">Get in touch</span>
        <h1 className="mt-3 text-4xl font-semibold sm:text-5xl">Let’s talk about your space</h1>
        <p className="mt-3 text-stone">
          Questions, quotes or a free measurement — we’re here to help. Reach out and our team will
          respond quickly.
        </p>
      </div>

      <div className="mt-10 grid gap-8 lg:grid-cols-5">
        {/* Form */}
        <div className="card p-6 lg:col-span-3 lg:p-8">
          <h2 className="text-2xl font-semibold">Send us a message</h2>
          <form onSubmit={submit} className="mt-6 grid gap-4 sm:grid-cols-2">
            <div>
              <label className="label" htmlFor="c-name">Name *</label>
              <input id="c-name" required value={form.name} onChange={set('name')} className="input" />
            </div>
            <div>
              <label className="label" htmlFor="c-phone">Phone</label>
              <input id="c-phone" value={form.phone} onChange={set('phone')} className="input" />
            </div>
            <div>
              <label className="label" htmlFor="c-email">Email</label>
              <input id="c-email" type="email" value={form.email} onChange={set('email')} className="input" />
            </div>
            <div>
              <label className="label" htmlFor="c-subject">Subject</label>
              <input id="c-subject" value={form.subject} onChange={set('subject')} className="input" />
            </div>
            <div className="sm:col-span-2">
              <label className="label" htmlFor="c-message">Message *</label>
              <textarea id="c-message" rows={5} required value={form.message} onChange={set('message')} className="input resize-none" />
            </div>
            <div className="sm:col-span-2 flex flex-wrap gap-3">
              <button type="submit" disabled={submitting} className="btn-gold">
                <Send className="h-4 w-4" /> {submitting ? 'Sending…' : 'Send message'}
              </button>
              <a
                href={whatsappLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-outline"
              >
                <MessageCircle className="h-4 w-4" /> WhatsApp instead
              </a>
            </div>
          </form>
        </div>

        {/* Info */}
        <div className="space-y-4 lg:col-span-2">
          <div className="card p-6">
            <h2 className="text-xl font-semibold">Contact details</h2>
            <ul className="mt-5 space-y-4">
              {contactItems.map(({ icon: Icon, label, value, href }) => (
                <li key={label} className="flex gap-3">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-sand text-brass-dark">
                    <Icon className="h-5 w-5" />
                  </span>
                  <span>
                    <span className="block text-xs uppercase tracking-wide text-stone">{label}</span>
                    {href ? (
                      <a href={href} className="font-medium text-ink hover:text-brass-dark">
                        {value}
                      </a>
                    ) : (
                      <span className="font-medium text-ink">{value}</span>
                    )}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className="card p-6">
            <h2 className="text-xl font-semibold">Our showrooms</h2>
            <ul className="mt-4 space-y-3">
              {site.branches.map((b) => (
                <li key={b.city} className="rounded-xl bg-sand px-4 py-3 text-sm">
                  <span className="font-medium text-ink">{b.city}</span>
                  <span className="block text-stone">{b.address}</span>
                  <a href={`tel:${b.phone.replace(/\s/g, '')}`} className="text-brass-dark">
                    {b.phone}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Map */}
      <div className="mt-8 overflow-hidden rounded-[2rem] shadow-card ring-1 ring-linen">
        <iframe
          title="Store location map"
          src={site.mapEmbed}
          className="h-80 w-full border-0"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>
    </div>
  );
}

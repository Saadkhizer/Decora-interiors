import { useState } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Clock, Facebook, Instagram, Youtube, Send } from 'lucide-react';
import { site } from '../../config/site.js';
import { useToast } from '../../context/ToastContext.jsx';

const shopLinks = [
  ['Wallpaper', '/category/wallpaper'],
  ['Window Blinds', '/category/window-blinds'],
  ['Wooden Flooring', '/category/wooden-flooring'],
  ['Vinyl Flooring', '/category/vinyl-flooring'],
  ['Artificial Grass', '/category/artificial-grass'],
  ['Folding Doors', '/category/folding-doors'],
];
const companyLinks = [
  ['About Us', '/about'],
  ['Our Services', '/services'],
  ['Our Work', '/gallery'],
  ['Journal', '/blog'],
  ['Contact', '/contact'],
  ['Track Order', '/track'],
  ['My Account', '/account'],
];

export default function Footer() {
  const [email, setEmail] = useState('');
  const toast = useToast();

  function subscribe(e) {
    e.preventDefault();
    if (!email) return;
    toast.success('Thanks for subscribing! We will keep you posted.');
    setEmail('');
  }

  return (
    <footer className="mt-20 bg-bark-dark text-cream/75">
      {/* Newsletter strip */}
      <div className="border-b border-cream/10">
        <div className="container-page flex flex-col items-center gap-6 py-10 text-center md:flex-row md:justify-between md:text-left">
          <div>
            <h3 className="font-display text-3xl text-cream">Design ideas in your inbox</h3>
            <p className="mt-1 text-sm text-cream/70">
              New arrivals, seasonal offers and styling tips. No spam.
            </p>
          </div>
          <form onSubmit={subscribe} className="flex w-full max-w-md gap-2">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email address"
              aria-label="Email address"
              className="flex-1 rounded-full border border-cream/20 bg-cream/5 px-5 py-3 text-cream placeholder:text-cream/50 focus:border-brass focus:outline-none"
            />
            <button type="submit" className="btn-gold shrink-0">
              <Send className="h-4 w-4" /> Subscribe
            </button>
          </form>
        </div>
      </div>

      {/* Main footer */}
      <div className="container-page grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-brass font-display text-lg font-bold text-white">
              {site.mark}
            </span>
            <span className="font-display text-2xl font-semibold text-cream">{site.fullName}</span>
          </div>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-cream/70">{site.description}</p>
          <div className="mt-5 flex gap-3">
            {[
              [Facebook, site.socials.facebook, 'Facebook'],
              [Instagram, site.socials.instagram, 'Instagram'],
              [Youtube, site.socials.youtube, 'YouTube'],
            ].map(([Icon, href, label]) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="grid h-10 w-10 place-items-center rounded-full bg-cream/10 transition-colors hover:bg-brass hover:text-white"
              >
                <Icon className="h-4.5 w-4.5" />
              </a>
            ))}
          </div>
        </div>

        <div>
          <h4 className="mb-4 text-sm font-semibold uppercase tracking-widest2 text-cream">Shop</h4>
          <ul className="space-y-2.5 text-sm">
            {shopLinks.map(([label, to]) => (
              <li key={to}>
                <Link to={to} className="link-underline text-cream/70 hover:text-cream">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="mb-4 text-sm font-semibold uppercase tracking-widest2 text-cream">Company</h4>
          <ul className="space-y-2.5 text-sm">
            {companyLinks.map(([label, to]) => (
              <li key={to}>
                <Link to={to} className="link-underline text-cream/70 hover:text-cream">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="mb-4 text-sm font-semibold uppercase tracking-widest2 text-cream">Get in touch</h4>
          <ul className="space-y-3 text-sm">
            <li className="flex gap-3">
              <MapPin className="h-5 w-5 shrink-0 text-brass-light" />
              <span className="text-cream/70">{site.address}</span>
            </li>
            <li className="flex gap-3">
              <Phone className="h-5 w-5 shrink-0 text-brass-light" />
              <a href={site.phoneHref} className="text-cream/70 hover:text-cream">
                {site.phone}
              </a>
            </li>
            <li className="flex gap-3">
              <Mail className="h-5 w-5 shrink-0 text-brass-light" />
              <a href={`mailto:${site.email}`} className="text-cream/70 hover:text-cream">
                {site.email}
              </a>
            </li>
            <li className="flex gap-3">
              <Clock className="h-5 w-5 shrink-0 text-brass-light" />
              <span className="text-cream/70">{site.hours}</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-cream/10">
        <div className="container-page flex flex-col items-center justify-between gap-2 py-5 text-xs text-cream/50 sm:flex-row">
          <p>
            © {new Date().getFullYear()} {site.fullName}. All rights reserved.
          </p>
          <p>
            Free measurement · Expert installation · Nationwide delivery
          </p>
        </div>
      </div>
    </footer>
  );
}

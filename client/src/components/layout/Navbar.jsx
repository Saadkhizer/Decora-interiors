import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Menu, X, Search, ShoppingBag, ChevronDown, Phone, User, Package, LogOut } from 'lucide-react';
import { site } from '../../config/site.js';
import { api } from '../../lib/api.js';
import { useCart } from '../../context/CartContext.jsx';
import { useCustomerAuth } from '../../context/CustomerAuthContext.jsx';
import CartDrawer from './CartDrawer.jsx';

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/shop', label: 'Shop' },
  { to: '/gallery', label: 'Gallery' },
  { to: '/services', label: 'Services' },
  { to: '/blog', label: 'Journal' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [categories, setCategories] = useState([]);
  const { count } = useCart();
  const { customer, logout } = useCustomerAuth();
  const navigate = useNavigate();
  const accountRef = useRef(null);

  // Close the account dropdown when clicking outside it.
  useEffect(() => {
    if (!accountOpen) return;
    const handler = (e) => {
      if (accountRef.current && !accountRef.current.contains(e.target)) setAccountOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [accountOpen]);

  function handleSignOut() {
    logout();
    setAccountOpen(false);
    navigate('/');
  }

  useEffect(() => {
    api.get('/categories').then(setCategories).catch(() => {});
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => (document.body.style.overflow = '');
  }, [mobileOpen]);

  function submitSearch(e) {
    e.preventDefault();
    if (!query.trim()) return;
    navigate(`/shop?search=${encodeURIComponent(query.trim())}`);
    setSearchOpen(false);
    setMobileOpen(false);
    setQuery('');
  }

  return (
    <>
      <header
        className={`sticky top-0 z-40 border-b transition-all duration-300 ${
          scrolled
            ? 'border-linen bg-cream/85 shadow-soft backdrop-blur-md'
            : 'border-linen/50 bg-cream/70 backdrop-blur-md'
        }`}
      >
        <nav className="container-page flex h-[68px] items-center justify-between gap-4">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5" aria-label={`${site.fullName} home`}>
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-walnut font-display text-lg font-bold text-cream">
              {site.mark}
            </span>
            <span className="leading-tight">
              <span className="block font-display text-2xl font-semibold text-walnut-dark">
                {site.name}
              </span>
              <span className="-mt-1 block text-[10px] uppercase tracking-widest2 text-brass-dark">
                {site.subtitle}
              </span>
            </span>
          </Link>

          {/* Desktop nav */}
          <ul className="hidden items-center gap-1 lg:flex">
            {navLinks.map((l) =>
              l.label === 'Shop' ? (
                <li
                  key={l.to}
                  className="relative"
                  onMouseEnter={() => setMegaOpen(true)}
                  onMouseLeave={() => setMegaOpen(false)}
                >
                  <NavLink
                    to={l.to}
                    className={({ isActive }) =>
                      `flex items-center gap-1 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                        isActive ? 'text-brass-dark' : 'text-ink hover:text-brass-dark'
                      }`
                    }
                  >
                    {l.label}
                    <ChevronDown className="h-4 w-4" />
                  </NavLink>
                  {/* Mega menu */}
                  <div
                    className={`absolute left-1/2 top-full w-[640px] -translate-x-1/2 pt-3 transition-all duration-200 ${
                      megaOpen ? 'visible opacity-100' : 'invisible opacity-0'
                    }`}
                  >
                    <div className="grid grid-cols-2 gap-1 rounded-2xl bg-white p-3 shadow-lift ring-1 ring-linen">
                      {categories.map((c) => (
                        <Link
                          key={c.id}
                          to={`/category/${c.slug}`}
                          className="group flex items-center gap-3 rounded-xl p-2.5 transition-colors hover:bg-cream"
                        >
                          <img
                            src={c.image}
                            alt=""
                            className="h-12 w-12 rounded-lg object-cover ring-1 ring-linen"
                          />
                          <span>
                            <span className="block text-sm font-medium text-ink group-hover:text-brass-dark">
                              {c.name}
                            </span>
                            <span className="block text-xs text-stone">
                              {c.product_count} products
                            </span>
                          </span>
                        </Link>
                      ))}
                    </div>
                  </div>
                </li>
              ) : (
                <li key={l.to}>
                  <NavLink
                    to={l.to}
                    end={l.to === '/'}
                    className={({ isActive }) =>
                      `rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                        isActive ? 'text-brass-dark' : 'text-ink hover:text-brass-dark'
                      }`
                    }
                  >
                    {l.label}
                  </NavLink>
                </li>
              )
            )}
          </ul>

          {/* Actions */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => setSearchOpen((s) => !s)}
              className="grid h-10 w-10 place-items-center rounded-full text-ink transition-colors hover:bg-linen"
              aria-label="Search products"
            >
              <Search className="h-5 w-5" />
            </button>
            {customer ? (
              <div ref={accountRef} className="relative hidden md:block">
                <button
                  onClick={() => setAccountOpen((o) => !o)}
                  className="flex items-center gap-2 rounded-full py-1 pl-1 pr-2.5 text-ink transition-colors hover:bg-linen"
                  aria-label="Account menu"
                  aria-expanded={accountOpen}
                >
                  <span className="grid h-8 w-8 place-items-center rounded-full bg-walnut text-sm font-semibold text-cream">
                    {(customer.name || customer.email || 'U')[0].toUpperCase()}
                  </span>
                  <span className="max-w-[90px] truncate text-sm font-medium">
                    {customer.name?.split(' ')[0] || 'Account'}
                  </span>
                  <ChevronDown
                    className={`h-4 w-4 text-stone transition-transform ${accountOpen ? 'rotate-180' : ''}`}
                  />
                </button>
                {accountOpen && (
                  <div className="absolute right-0 top-full z-50 mt-2 w-64 overflow-hidden rounded-2xl bg-white shadow-lift ring-1 ring-linen">
                    <div className="flex items-center gap-3 border-b border-linen bg-sand px-4 py-3">
                      <span className="grid h-10 w-10 place-items-center rounded-full bg-walnut text-base font-semibold text-cream">
                        {(customer.name || customer.email || 'U')[0].toUpperCase()}
                      </span>
                      <span className="min-w-0">
                        <span className="block truncate text-sm font-semibold text-ink">
                          {customer.name}
                        </span>
                        <span className="block truncate text-xs text-stone">{customer.email}</span>
                      </span>
                    </div>
                    <div className="p-1.5">
                      <Link
                        to="/account"
                        onClick={() => setAccountOpen(false)}
                        className="flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm text-ink transition-colors hover:bg-cream"
                      >
                        <User className="h-4 w-4 text-stone" /> My account
                      </Link>
                      <Link
                        to="/track"
                        onClick={() => setAccountOpen(false)}
                        className="flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm text-ink transition-colors hover:bg-cream"
                      >
                        <Package className="h-4 w-4 text-stone" /> Track order
                      </Link>
                      <button
                        onClick={handleSignOut}
                        className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm text-red-600 transition-colors hover:bg-red-50"
                      >
                        <LogOut className="h-4 w-4" /> Sign out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/account/login"
                className="hidden h-10 w-10 place-items-center rounded-full text-ink transition-colors hover:bg-linen md:grid"
                aria-label="Sign in"
              >
                <User className="h-5 w-5" />
              </Link>
            )}
            <button
              onClick={() => setCartOpen(true)}
              className="relative grid h-10 w-10 place-items-center rounded-full text-ink transition-colors hover:bg-linen"
              aria-label={`Open cart, ${count} items`}
            >
              <ShoppingBag className="h-5 w-5" />
              {count > 0 && (
                <span className="absolute -right-0.5 -top-0.5 grid h-5 min-w-[20px] place-items-center rounded-full bg-brass px-1 text-[11px] font-bold text-white">
                  {count}
                </span>
              )}
            </button>
            <button
              onClick={() => setMobileOpen(true)}
              className="grid h-10 w-10 place-items-center rounded-full text-ink transition-colors hover:bg-linen lg:hidden"
              aria-label="Open menu"
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </nav>

        {/* Search bar */}
        <div
          className={`overflow-hidden border-t border-linen bg-cream transition-all duration-300 ${
            searchOpen ? 'max-h-20' : 'max-h-0'
          }`}
        >
          <form onSubmit={submitSearch} className="container-page flex items-center gap-2 py-3">
            <Search className="h-5 w-5 text-stone" />
            <input
              autoFocus={searchOpen}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search wallpaper, blinds, flooring…"
              className="flex-1 bg-transparent text-ink placeholder:text-stone/60 focus:outline-none"
              aria-label="Search"
            />
            <button type="submit" className="btn-primary btn-sm">
              Search
            </button>
          </form>
        </div>
      </header>

      {/* Mobile drawer */}
      <div
        className={`fixed inset-0 z-50 lg:hidden ${mobileOpen ? '' : 'pointer-events-none'}`}
        aria-hidden={!mobileOpen}
      >
        <div
          onClick={() => setMobileOpen(false)}
          className={`absolute inset-0 bg-walnut-dark/40 backdrop-blur-sm transition-opacity ${
            mobileOpen ? 'opacity-100' : 'opacity-0'
          }`}
        />
        <aside
          className={`absolute right-0 top-0 flex h-full w-[min(86vw,360px)] flex-col bg-cream shadow-lift transition-transform duration-300 ${
            mobileOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <div className="flex items-center justify-between border-b border-linen px-5 py-4">
            <span className="font-display text-2xl font-semibold text-walnut-dark">Menu</span>
            <button onClick={() => setMobileOpen(false)} aria-label="Close menu" className="btn-ghost p-2">
              <X className="h-5 w-5" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto px-3 py-3">
            {navLinks.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.to === '/'}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  `block rounded-xl px-4 py-3 text-base font-medium ${
                    isActive ? 'bg-linen text-brass-dark' : 'text-ink hover:bg-linen'
                  }`
                }
              >
                {l.label}
              </NavLink>
            ))}
            <p className="px-4 pb-1 pt-4 text-xs font-semibold uppercase tracking-widest2 text-stone">
              Categories
            </p>
            {categories.map((c) => (
              <Link
                key={c.id}
                to={`/category/${c.slug}`}
                onClick={() => setMobileOpen(false)}
                className="block rounded-xl px-4 py-2.5 text-sm text-stone hover:bg-linen hover:text-ink"
              >
                {c.name}
              </Link>
            ))}
          </div>
          <div className="space-y-2 border-t border-linen p-4">
            {customer && (
              <div className="mb-1 flex items-center gap-3 rounded-xl bg-sand px-3 py-2.5">
                <span className="grid h-9 w-9 place-items-center rounded-full bg-walnut text-sm font-semibold text-cream">
                  {(customer.name || customer.email || 'U')[0].toUpperCase()}
                </span>
                <span className="min-w-0">
                  <span className="block truncate text-sm font-semibold text-ink">{customer.name}</span>
                  <span className="block truncate text-xs text-stone">{customer.email}</span>
                </span>
              </div>
            )}
            <Link
              to={customer ? '/account' : '/account/login'}
              onClick={() => setMobileOpen(false)}
              className="btn-outline w-full"
            >
              <User className="h-4 w-4" /> {customer ? 'My account' : 'Sign in / Register'}
            </Link>
            {customer && (
              <button
                onClick={() => {
                  handleSignOut();
                  setMobileOpen(false);
                }}
                className="btn-ghost w-full text-red-600 hover:bg-red-50"
              >
                <LogOut className="h-4 w-4" /> Sign out
              </button>
            )}
            <a href={site.phoneHref} className="btn-primary w-full">
              <Phone className="h-4 w-4" /> {site.phone}
            </a>
          </div>
        </aside>
      </div>

      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
}

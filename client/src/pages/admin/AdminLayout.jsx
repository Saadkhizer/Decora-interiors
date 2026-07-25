import { useState } from 'react';
import { NavLink, Outlet, Link, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  MessageSquare,
  Newspaper,
  Images,
  LogOut,
  Menu,
  X,
  ExternalLink,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';
import { site } from '../../config/site.js';

const links = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/admin/products', label: 'Products', icon: Package },
  { to: '/admin/orders', label: 'Orders', icon: ShoppingCart },
  { to: '/admin/inquiries', label: 'Inquiries', icon: MessageSquare },
  { to: '/admin/blog', label: 'Journal', icon: Newspaper },
  { to: '/admin/gallery', label: 'Gallery', icon: Images },
];

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  function signOut() {
    logout();
    navigate('/admin/login');
  }

  const Sidebar = (
    <div className="flex h-full flex-col">
      <Link to="/admin" className="flex items-center gap-2.5 px-6 py-5">
        <span className="grid h-10 w-10 place-items-center rounded-xl bg-brass font-display text-lg font-bold text-white">
          {site.mark}
        </span>
        <span className="leading-tight">
          <span className="block font-display text-xl font-semibold text-cream">{site.name}</span>
          <span className="text-[10px] uppercase tracking-widest2 text-cream/50">Admin Panel</span>
        </span>
      </Link>
      <nav className="flex-1 space-y-1 px-3 py-4">
        {links.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            onClick={() => setOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium transition-colors ${
                isActive ? 'bg-brass text-white' : 'text-cream/70 hover:bg-cream/10 hover:text-cream'
              }`
            }
          >
            <Icon className="h-5 w-5" /> {label}
          </NavLink>
        ))}
      </nav>
      <div className="border-t border-cream/10 p-3">
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm text-cream/70 hover:bg-cream/10 hover:text-cream"
        >
          <ExternalLink className="h-5 w-5" /> View store
        </a>
        <button
          onClick={signOut}
          className="flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-sm text-cream/70 hover:bg-cream/10 hover:text-cream"
        >
          <LogOut className="h-5 w-5" /> Sign out
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-sand">
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 hidden w-64 bg-walnut-dark lg:block">{Sidebar}</aside>

      {/* Mobile sidebar */}
      <div className={`fixed inset-0 z-50 lg:hidden ${open ? '' : 'pointer-events-none'}`}>
        <div
          onClick={() => setOpen(false)}
          className={`absolute inset-0 bg-black/40 transition-opacity ${open ? 'opacity-100' : 'opacity-0'}`}
        />
        <aside
          className={`absolute inset-y-0 left-0 w-64 bg-walnut-dark transition-transform ${
            open ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          {Sidebar}
        </aside>
      </div>

      {/* Main */}
      <div className="lg:pl-64">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-linen bg-cream/90 px-4 backdrop-blur sm:px-6">
          <button onClick={() => setOpen(true)} className="btn-ghost p-2 lg:hidden" aria-label="Open menu">
            <Menu className="h-6 w-6" />
          </button>
          <div className="ml-auto flex items-center gap-3 text-sm">
            <span className="text-stone">
              Signed in as <strong className="text-ink">{user?.name || user?.email}</strong>
            </span>
            <span className="grid h-9 w-9 place-items-center rounded-full bg-walnut text-sm font-semibold text-cream">
              {(user?.name || user?.email || 'A')[0].toUpperCase()}
            </span>
          </div>
        </header>
        <main className="p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

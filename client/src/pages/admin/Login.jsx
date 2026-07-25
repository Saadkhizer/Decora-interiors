import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Lock, Mail, ArrowRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';
import { site } from '../../config/site.js';

export default function AdminLogin() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate(location.state?.from?.pathname || '/admin', { replace: true });
    } catch (err) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-walnut-dark bg-grid p-4">
      <div className="w-full max-w-md rounded-3xl bg-cream p-8 shadow-lift">
        <Link to="/" className="flex items-center justify-center gap-2.5">
          <span className="grid h-11 w-11 place-items-center rounded-xl bg-walnut font-display text-lg font-bold text-cream">
            {site.mark}
          </span>
          <span className="font-display text-2xl font-semibold text-walnut-dark">{site.fullName}</span>
        </Link>
        <h1 className="mt-6 text-center text-2xl font-semibold">Admin sign in</h1>
        <p className="mt-1 text-center text-sm text-stone">Manage products, orders and inquiries.</p>

        {error && (
          <p className="mt-5 rounded-xl bg-red-50 px-4 py-3 text-center text-sm text-red-600">{error}</p>
        )}

        <form onSubmit={submit} className="mt-6 space-y-4">
          <div>
            <label className="label" htmlFor="email">Email</label>
            <div className="relative">
              <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-stone" />
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input pl-11"
                placeholder="admin@samijeedecor.com"
              />
            </div>
          </div>
          <div>
            <label className="label" htmlFor="password">Password</label>
            <div className="relative">
              <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-stone" />
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input pl-11"
                placeholder="••••••••"
              />
            </div>
          </div>
          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? 'Signing in…' : 'Sign in'} <ArrowRight className="h-4 w-4" />
          </button>
        </form>

        <p className="mt-5 rounded-xl bg-sand px-4 py-3 text-center text-xs text-stone">
          Demo login → <strong>admin@samijeedecor.com</strong> / <strong>admin123</strong>
        </p>
      </div>
    </div>
  );
}

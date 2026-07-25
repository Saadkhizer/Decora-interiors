import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Mail, Lock, ArrowRight } from 'lucide-react';
import { useCustomerAuth } from '../../context/CustomerAuthContext.jsx';
import { useToast } from '../../context/ToastContext.jsx';
import Breadcrumbs from '../../components/ui/Breadcrumbs.jsx';

export default function CustomerLogin() {
  const { login } = useCustomerAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      toast.success('Welcome back!');
      navigate(location.state?.from?.pathname || '/account', { replace: true });
    } catch (err) {
      toast.error(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container-page max-w-md py-10">
      <Breadcrumbs items={[{ label: 'Sign in' }]} />
      <div className="card mt-6 p-8">
        <h1 className="text-center text-3xl font-semibold">Welcome back</h1>
        <p className="mt-1 text-center text-sm text-stone">Sign in to your account to continue.</p>
        <form onSubmit={submit} className="mt-6 space-y-4">
          <div>
            <label className="label" htmlFor="email">Email</label>
            <div className="relative">
              <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-stone" />
              <input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="input pl-11" />
            </div>
          </div>
          <div>
            <label className="label" htmlFor="password">Password</label>
            <div className="relative">
              <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-stone" />
              <input id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="input pl-11" />
            </div>
          </div>
          <button type="submit" disabled={loading} className="btn-gold w-full">
            {loading ? 'Signing in…' : 'Sign in'} <ArrowRight className="h-4 w-4" />
          </button>
        </form>
        <p className="mt-5 text-center text-sm text-stone">
          New here?{' '}
          <Link to="/account/register" className="font-medium text-brass-dark hover:underline">
            Create an account
          </Link>
        </p>
        <p className="mt-3 rounded-xl bg-sand px-4 py-3 text-center text-xs text-stone">
          Demo login → <strong>customer@example.com</strong> / <strong>customer123</strong>
        </p>
      </div>
    </div>
  );
}

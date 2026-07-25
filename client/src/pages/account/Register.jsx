import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useCustomerAuth } from '../../context/CustomerAuthContext.jsx';
import { useToast } from '../../context/ToastContext.jsx';
import Breadcrumbs from '../../components/ui/Breadcrumbs.jsx';

export default function CustomerRegister() {
  const { register } = useCustomerAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '' });
  const [loading, setLoading] = useState(false);
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  async function submit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      await register(form);
      toast.success('Account created — welcome!');
      navigate('/account', { replace: true });
    } catch (err) {
      toast.error(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container-page max-w-md py-10">
      <Breadcrumbs items={[{ label: 'Create account' }]} />
      <div className="card mt-6 p-8">
        <h1 className="text-center text-3xl font-semibold">Create your account</h1>
        <p className="mt-1 text-center text-sm text-stone">Save your details and track your orders.</p>
        <form onSubmit={submit} className="mt-6 space-y-4">
          <div>
            <label className="label" htmlFor="name">Full name *</label>
            <input id="name" required value={form.name} onChange={set('name')} className="input" />
          </div>
          <div>
            <label className="label" htmlFor="email">Email *</label>
            <input id="email" type="email" required value={form.email} onChange={set('email')} className="input" />
          </div>
          <div>
            <label className="label" htmlFor="phone">Phone</label>
            <input id="phone" value={form.phone} onChange={set('phone')} placeholder="+92 3xx xxxxxxx" className="input" />
          </div>
          <div>
            <label className="label" htmlFor="password">Password *</label>
            <input id="password" type="password" required minLength={6} value={form.password} onChange={set('password')} placeholder="At least 6 characters" className="input" />
          </div>
          <button type="submit" disabled={loading} className="btn-gold w-full">
            {loading ? 'Creating…' : 'Create account'} <ArrowRight className="h-4 w-4" />
          </button>
        </form>
        <p className="mt-5 text-center text-sm text-stone">
          Already have an account?{' '}
          <Link to="/account/login" className="font-medium text-brass-dark hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}

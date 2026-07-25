import { createContext, useContext, useEffect, useState } from 'react';
import { api } from '../lib/api.js';

const CustomerAuthContext = createContext(null);
const TOKEN_KEY = 'sjd_customer_token';

export function CustomerAuthProvider({ children }) {
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) {
      setLoading(false);
      return;
    }
    api
      .get('/customers/me', { customerAuth: true })
      .then((d) => setCustomer(d.customer))
      .catch(() => localStorage.removeItem(TOKEN_KEY))
      .finally(() => setLoading(false));
  }, []);

  async function register(payload) {
    const data = await api.post('/customers/register', payload);
    localStorage.setItem(TOKEN_KEY, data.token);
    setCustomer(data.customer);
    return data.customer;
  }
  async function login(email, password) {
    const data = await api.post('/customers/login', { email, password });
    localStorage.setItem(TOKEN_KEY, data.token);
    setCustomer(data.customer);
    return data.customer;
  }
  async function updateProfile(payload) {
    const data = await api.put('/customers/me', payload, { customerAuth: true });
    setCustomer(data.customer);
    return data.customer;
  }
  function logout() {
    localStorage.removeItem(TOKEN_KEY);
    setCustomer(null);
  }

  return (
    <CustomerAuthContext.Provider value={{ customer, loading, register, login, logout, updateProfile }}>
      {children}
    </CustomerAuthContext.Provider>
  );
}

export const useCustomerAuth = () => {
  const ctx = useContext(CustomerAuthContext);
  if (!ctx) throw new Error('useCustomerAuth must be used within CustomerAuthProvider');
  return ctx;
};

import { Navigate, useLocation } from 'react-router-dom';
import { useCustomerAuth } from '../context/CustomerAuthContext.jsx';
import Spinner from '../components/ui/Spinner.jsx';

// Guards customer-only pages (account dashboard). Redirects to login when signed out.
export default function CustomerRoute({ children }) {
  const { customer, loading } = useCustomerAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Spinner />
      </div>
    );
  }
  if (!customer) {
    return <Navigate to="/account/login" state={{ from: location }} replace />;
  }
  return children;
}

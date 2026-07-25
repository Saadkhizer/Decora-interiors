import { Link } from 'react-router-dom';
import { Home, Search } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="container-page flex min-h-[70vh] flex-col items-center justify-center text-center">
      <p className="font-display text-[7rem] font-semibold leading-none text-linen">404</p>
      <h1 className="mt-2 text-3xl font-semibold">Page not found</h1>
      <p className="mt-2 max-w-sm text-stone">
        The page you’re looking for doesn’t exist or has moved. Let’s get you back on track.
      </p>
      <div className="mt-7 flex flex-wrap justify-center gap-3">
        <Link to="/" className="btn-primary">
          <Home className="h-4 w-4" /> Home
        </Link>
        <Link to="/shop" className="btn-outline">
          <Search className="h-4 w-4" /> Browse products
        </Link>
      </div>
    </div>
  );
}

import { Routes, Route } from 'react-router-dom';
import { lazy, Suspense } from 'react';

import Layout from './components/layout/Layout.jsx';
import ScrollToTop from './components/layout/ScrollToTop.jsx';
import Spinner from './components/ui/Spinner.jsx';
import ProtectedRoute from './routes/ProtectedRoute.jsx';
import CustomerRoute from './routes/CustomerRoute.jsx';

import Home from './pages/Home.jsx';
import Shop from './pages/Shop.jsx';
import ProductDetail from './pages/ProductDetail.jsx';
import Cart from './pages/Cart.jsx';

// Code-split the heavier / less-frequent routes.
const Checkout = lazy(() => import('./pages/Checkout.jsx'));
const OrderSuccess = lazy(() => import('./pages/OrderSuccess.jsx'));
const TrackOrder = lazy(() => import('./pages/TrackOrder.jsx'));
const About = lazy(() => import('./pages/About.jsx'));
const Services = lazy(() => import('./pages/Services.jsx'));
const Contact = lazy(() => import('./pages/Contact.jsx'));
const Blog = lazy(() => import('./pages/Blog.jsx'));
const BlogPost = lazy(() => import('./pages/BlogPost.jsx'));
const Gallery = lazy(() => import('./pages/Gallery.jsx'));
const NotFound = lazy(() => import('./pages/NotFound.jsx'));

const CustomerLogin = lazy(() => import('./pages/account/Login.jsx'));
const CustomerRegister = lazy(() => import('./pages/account/Register.jsx'));
const Account = lazy(() => import('./pages/account/Account.jsx'));

const AdminLogin = lazy(() => import('./pages/admin/Login.jsx'));
const AdminLayout = lazy(() => import('./pages/admin/AdminLayout.jsx'));
const Dashboard = lazy(() => import('./pages/admin/Dashboard.jsx'));
const AdminProducts = lazy(() => import('./pages/admin/Products.jsx'));
const ProductForm = lazy(() => import('./pages/admin/ProductForm.jsx'));
const AdminOrders = lazy(() => import('./pages/admin/Orders.jsx'));
const AdminInquiries = lazy(() => import('./pages/admin/Inquiries.jsx'));
const AdminBlog = lazy(() => import('./pages/admin/Blog.jsx'));
const AdminGallery = lazy(() => import('./pages/admin/Gallery.jsx'));

const Fallback = () => (
  <div className="flex min-h-[60vh] items-center justify-center">
    <Spinner />
  </div>
);

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Suspense fallback={<Fallback />}>
        <Routes>
          {/* Storefront */}
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/category/:slug" element={<Shop />} />
            <Route path="/product/:slug" element={<ProductDetail />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/order/:number" element={<OrderSuccess />} />
            <Route path="/track" element={<TrackOrder />} />
            <Route path="/about" element={<About />} />
            <Route path="/services" element={<Services />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:slug" element={<BlogPost />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/account/login" element={<CustomerLogin />} />
            <Route path="/account/register" element={<CustomerRegister />} />
            <Route
              path="/account"
              element={
                <CustomerRoute>
                  <Account />
                </CustomerRoute>
              }
            />
            <Route path="*" element={<NotFound />} />
          </Route>

          {/* Admin */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="products" element={<AdminProducts />} />
            <Route path="products/new" element={<ProductForm />} />
            <Route path="products/:id/edit" element={<ProductForm />} />
            <Route path="orders" element={<AdminOrders />} />
            <Route path="inquiries" element={<AdminInquiries />} />
            <Route path="blog" element={<AdminBlog />} />
            <Route path="gallery" element={<AdminGallery />} />
          </Route>
        </Routes>
      </Suspense>
    </>
  );
}

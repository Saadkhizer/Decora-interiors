import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { api } from '../../lib/api.js';
import SectionHeading from '../ui/SectionHeading.jsx';
import ProductGrid from '../product/ProductGrid.jsx';

export default function FeaturedProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get('/products?featured=true&limit=8')
      .then((d) => setProducts(d.products))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="container-page py-16 lg:py-20">
      <div className="mb-9 flex flex-wrap items-end justify-between gap-4">
        <SectionHeading
          kicker="Bestsellers"
          title="Featured this season"
          subtitle="Hand-picked favourites our customers keep coming back for."
        />
        <Link to="/shop" className="btn-ghost hidden sm:inline-flex">
          Shop all <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
      <ProductGrid products={products} loading={loading} />
    </section>
  );
}

import { Link } from 'react-router-dom';
import { ArrowRight, MessageCircle } from 'lucide-react';
import { whatsappLink } from '../../config/site.js';

export default function CTASection() {
  return (
    <section className="container-page py-16 lg:py-20">
      <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-walnut to-walnut-dark px-6 py-14 text-center shadow-lift sm:px-12">
        <div className="bg-grid absolute inset-0 opacity-30" />
        <div className="relative mx-auto max-w-2xl">
          <h2 className="text-balance text-3xl font-semibold text-cream sm:text-4xl">
            Ready to transform your space?
          </h2>
          <p className="mt-3 text-cream/80">
            Book a free measurement today and get a no-obligation quote for products and
            installation.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link to="/contact" className="btn-gold">
              Get a free quote <ArrowRight className="h-4 w-4" />
            </Link>
            <a
              href={whatsappLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-outline border-cream/30 text-cream hover:bg-cream hover:text-walnut-dark"
            >
              <MessageCircle className="h-4 w-4" /> WhatsApp us
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

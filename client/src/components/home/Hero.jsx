import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Star, Ruler, Truck } from 'lucide-react';
import { site } from '../../config/site.js';

const heroImg =
  'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=80';

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-cream">
      <div className="container-page grid items-center gap-10 py-14 lg:grid-cols-2 lg:py-20">
        {/* Copy */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span className="kicker">
            <span className="h-px w-8 bg-brass" /> {site.tagline}
          </span>
          <h1 className="mt-4 text-balance text-4xl font-semibold leading-[1.05] sm:text-5xl lg:text-6xl">
            Beautiful walls &amp; floors,{' '}
            <span className="italic text-brass-dark">expertly finished</span>
          </h1>
          <p className="mt-5 max-w-md text-lg leading-relaxed text-stone">
            Wallpaper, blinds, wooden &amp; vinyl flooring, artificial grass, glass paper and folding
            doors — supplied and fitted by craftsmen who care.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link to="/shop" className="btn-gold">
              Explore products <ArrowRight className="h-4 w-4" />
            </Link>
            <Link to="/contact" className="btn-outline">
              Book free measurement
            </Link>
          </div>
          <div className="mt-9 flex flex-wrap items-center gap-x-8 gap-y-3 text-sm text-stone">
            <span className="flex items-center gap-2">
              <Star className="h-4 w-4 fill-brass text-brass" /> 4.9/5 from 1,200+ homes
            </span>
            <span className="flex items-center gap-2">
              <Ruler className="h-4 w-4 text-sage-dark" /> Free site visit
            </span>
            <span className="flex items-center gap-2">
              <Truck className="h-4 w-4 text-sage-dark" /> Nationwide delivery
            </span>
          </div>
        </motion.div>

        {/* Image collage */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="relative"
        >
          <div className="relative overflow-hidden rounded-[2rem] shadow-lift ring-1 ring-linen">
            <img
              src={heroImg}
              alt="Modern living room with feature wall and wood flooring"
              className="aspect-[4/5] w-full object-cover"
            />
          </div>
          {/* Floating stat card */}
          <div className="absolute -bottom-5 -left-3 hidden rounded-2xl bg-white/95 px-5 py-4 shadow-lift ring-1 ring-linen backdrop-blur sm:block">
            <p className="font-display text-3xl font-semibold text-walnut-dark">15+ yrs</p>
            <p className="text-xs text-stone">of finishing expertise</p>
          </div>
          <div className="absolute -right-3 top-8 hidden rounded-2xl bg-walnut px-5 py-4 text-cream shadow-lift sm:block">
            <p className="font-display text-3xl font-semibold">8</p>
            <p className="text-xs text-cream/80">product categories</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

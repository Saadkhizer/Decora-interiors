import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Star, Ruler, Truck } from 'lucide-react';
import { site } from '../../config/site.js';

// Full-bleed living-room photograph (Unsplash licence), stored locally in
// /public/hero so the page never depends on a third-party host at runtime.
const heroImg = '/hero/living-room.jpg';

const categories = [
  { label: 'Wallpaper', to: '/category/wallpaper' },
  { label: 'Window blinds', to: '/category/window-blinds' },
  { label: 'Wooden flooring', to: '/category/wooden-flooring' },
  { label: 'Wall panels', to: '/category/wall-panels' },
  { label: 'Artificial grass', to: '/category/artificial-grass' },
];

export default function Hero() {
  return (
    <section className="relative isolate flex min-h-[640px] items-center overflow-hidden bg-walnut-dark lg:min-h-[calc(100vh-6.5rem)] lg:max-h-[860px]">
      {/* Photograph, edge to edge */}
      <img
        src={heroImg}
        alt="Bright living room with a marble fireplace, large windows and warm timber floors"
        className="absolute inset-0 -z-20 h-full w-full object-cover object-[65%_center]"
        fetchpriority="high"
      />
      {/* Scrim: dark on the copy side so text stays readable, clear on the right */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-walnut-dark/90 via-walnut-dark/55 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 -z-10 h-40 bg-gradient-to-t from-walnut-dark/70 to-transparent" />

      <div className="container-page w-full pb-28 pt-20 lg:pb-32 lg:pt-24">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl"
        >
          <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest2 text-brass-light">
            <span className="h-px w-8 bg-brass-light" /> {site.tagline}
          </span>
          <h1 className="mt-4 text-balance font-display text-5xl font-semibold leading-[1.02] text-cream sm:text-6xl lg:text-7xl">
            Beautiful walls &amp; floors,{' '}
            <span className="italic text-brass-light">expertly finished</span>
          </h1>
          <p className="mt-6 max-w-lg text-lg leading-relaxed text-cream/85">
            Wallpaper, blinds, wooden &amp; vinyl flooring, artificial grass, glass paper and folding
            doors — supplied and fitted by craftsmen who care.
          </p>
          <div className="mt-9 flex flex-wrap items-center gap-3">
            <Link to="/shop" className="btn-gold">
              Explore products <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center justify-center rounded-full border border-cream/60 px-7 py-3 text-sm font-medium text-cream transition hover:bg-cream hover:text-walnut-dark"
            >
              Book free measurement
            </Link>
          </div>
          <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-3 text-sm text-cream/85">
            <span className="flex items-center gap-2">
              <Star className="h-4 w-4 fill-brass text-brass" /> 4.9/5 from 1,200+ homes
            </span>
            <span className="flex items-center gap-2">
              <Ruler className="h-4 w-4 text-brass-light" /> Free site visit
            </span>
            <span className="flex items-center gap-2">
              <Truck className="h-4 w-4 text-brass-light" /> Nationwide delivery
            </span>
          </div>
        </motion.div>
      </div>

      {/* Category quick links, pinned to the bottom edge of the hero */}
      <motion.nav
        aria-label="Shop by category"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.25 }}
        className="absolute inset-x-0 bottom-0 hidden border-t border-cream/20 bg-walnut-dark/55 backdrop-blur-sm md:block"
      >
        <ul className="container-page flex items-center justify-between gap-6 py-4 text-sm text-cream/90">
          {categories.map((c) => (
            <li key={c.label}>
              <Link to={c.to} className="transition hover:text-brass-light">
                {c.label}
              </Link>
            </li>
          ))}
        </ul>
      </motion.nav>
    </section>
  );
}

import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Award, Users, Sparkles, Heart, ArrowRight } from 'lucide-react';
import SectionHeading from '../components/ui/SectionHeading.jsx';
import { site } from '../config/site.js';

const stats = [
  { value: '15+', label: 'Years of experience' },
  { value: '1,200+', label: 'Happy customers' },
  { value: '8', label: 'Product categories' },
  { value: '3', label: 'Showrooms' },
];
const values = [
  { icon: Award, title: 'Quality first', text: 'We source premium materials and never cut corners on finish or durability.' },
  { icon: Users, title: 'Customer obsessed', text: 'From the first measurement to the final clean-up, we make it effortless for you.' },
  { icon: Sparkles, title: 'Craftsmanship', text: 'Our trained fitters treat every project like it’s their own home.' },
  { icon: Heart, title: 'Honest pricing', text: 'Transparent quotes with no hidden charges — products plus installation, upfront.' },
];

export default function About() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-sand">
        <div className="container-page grid items-center gap-10 py-14 lg:grid-cols-2 lg:py-20">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span className="kicker">About {site.name}</span>
            <h1 className="mt-3 text-balance text-4xl font-semibold leading-tight sm:text-5xl">
              Finishing beautiful homes since day one
            </h1>
            <p className="mt-5 max-w-md leading-relaxed text-stone">
              {site.fullName} is a complete interior finishing house. We supply and install
              wallpaper, blinds, wooden &amp; vinyl flooring, glass paper, artificial grass and
              folding doors — bringing showroom quality to homes and offices across Pakistan.
            </p>
            <Link to="/contact" className="btn-gold mt-7">
              Work with us <ArrowRight className="h-4 w-4" />
            </Link>
          </motion.div>
          <motion.img
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7 }}
            src="https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1100&q=80"
            alt="Beautifully finished interior"
            className="aspect-[4/3] w-full rounded-[2rem] object-cover shadow-lift ring-1 ring-linen"
          />
        </div>
      </section>

      {/* Stats */}
      <section className="container-page py-14">
        <div className="grid grid-cols-2 gap-6 rounded-[2rem] bg-walnut-dark px-6 py-10 text-center text-cream sm:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label}>
              <p className="font-display text-4xl font-semibold sm:text-5xl">{s.value}</p>
              <p className="mt-1 text-sm text-cream/70">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Values */}
      <section className="container-page pb-16 lg:pb-20">
        <SectionHeading
          center
          kicker="Why choose us"
          title="Values that shape every project"
          subtitle="We’re not just selling products — we’re finishing spaces you’ll love for years."
        />
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {values.map(({ icon: Icon, title, text }) => (
            <div key={title} className="card p-6">
              <span className="grid h-12 w-12 place-items-center rounded-2xl bg-sand text-brass-dark">
                <Icon className="h-6 w-6" />
              </span>
              <h3 className="mt-4 text-xl font-semibold">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-stone">{text}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

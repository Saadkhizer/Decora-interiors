import { Link } from 'react-router-dom';
import { Ruler, Hammer, Lightbulb, Wrench, ArrowRight, Check } from 'lucide-react';
import SectionHeading from '../components/ui/SectionHeading.jsx';
import ProcessSteps from '../components/home/ProcessSteps.jsx';
import { whatsappLink } from '../config/site.js';

const services = [
  {
    icon: Ruler,
    title: 'Free measurement & site visit',
    text: 'Our team visits your home or office, takes precise measurements and recommends the right materials for your space and budget.',
    points: ['Same-week appointments', 'Expert material advice', 'No-obligation quote'],
  },
  {
    icon: Hammer,
    title: 'Professional installation',
    text: 'Trained fitters install flooring, wallpaper, blinds, panels and doors with a clean, durable, showroom-quality finish.',
    points: ['Experienced craftsmen', 'Tidy, on-time work', 'Post-install clean-up'],
  },
  {
    icon: Lightbulb,
    title: 'Interior design consultation',
    text: 'Not sure where to start? Our consultants help you choose colours, textures and finishes that work together beautifully.',
    points: ['Mood boards & samples', 'Colour matching', 'Project planning'],
  },
  {
    icon: Wrench,
    title: 'Maintenance & after-care',
    text: 'We stand behind our work with genuine warranties and friendly after-sales support whenever you need it.',
    points: ['Warranty-backed', 'Repairs & touch-ups', 'Care guidance'],
  },
];

export default function Services() {
  return (
    <div>
      <section className="bg-sand">
        <div className="container-page py-14 text-center lg:py-20">
          <SectionHeading
            center
            kicker="Our services"
            title="More than products — a complete service"
            subtitle="From the first idea to the final finish, we handle everything so you don’t have to."
          />
        </div>
      </section>

      <section className="container-page py-16 lg:py-20">
        <div className="grid gap-6 md:grid-cols-2">
          {services.map(({ icon: Icon, title, text, points }) => (
            <div key={title} className="card flex flex-col p-7">
              <span className="grid h-14 w-14 place-items-center rounded-2xl bg-sand text-brass-dark">
                <Icon className="h-7 w-7" />
              </span>
              <h3 className="mt-5 text-2xl font-semibold">{title}</h3>
              <p className="mt-2 leading-relaxed text-stone">{text}</p>
              <ul className="mt-4 space-y-2">
                {points.map((pt) => (
                  <li key={pt} className="flex items-center gap-2 text-sm text-ink">
                    <Check className="h-4 w-4 text-sage-dark" /> {pt}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <ProcessSteps />

      <section className="container-page pb-20">
        <div className="rounded-[2rem] bg-gradient-to-br from-walnut to-walnut-dark px-6 py-12 text-center text-cream sm:px-12">
          <h2 className="text-balance text-3xl font-semibold sm:text-4xl">
            Book your free measurement today
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-cream/80">
            Tell us about your project and we’ll arrange a visit at a time that suits you.
          </p>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <Link to="/contact" className="btn-gold">
              Get started <ArrowRight className="h-4 w-4" />
            </Link>
            <a
              href={whatsappLink('Hi! I’d like to book a free measurement.')}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-outline border-cream/30 text-cream hover:bg-cream hover:text-walnut-dark"
            >
              WhatsApp us
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}

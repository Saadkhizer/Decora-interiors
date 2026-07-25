import { Quote } from 'lucide-react';
import Rating from '../ui/Rating.jsx';
import SectionHeading from '../ui/SectionHeading.jsx';

const testimonials = [
  {
    name: 'Hira Khan',
    role: 'Homeowner, Lahore',
    text: 'The wallpaper transformed our lounge completely. The team measured, suggested designs and installed everything in a day. Spotless work.',
  },
  {
    name: 'Bilal Ahmed',
    role: 'Office, Islamabad',
    text: 'We did vinyl flooring and zebra blinds for our whole office. Great quality at a fair price, and the finish is genuinely premium.',
  },
  {
    name: 'Ayesha Siddiqui',
    role: 'Homeowner, Rawalpindi',
    text: 'Loved the artificial grass for our rooftop. Looks real, feels soft and needs zero maintenance. Highly recommend Decora.',
  },
];

export default function Testimonials() {
  return (
    <section className="bg-bark-dark text-cream">
      <div className="container-page py-16 lg:py-20">
        <SectionHeading
          center
          kicker="Loved by 1,200+ clients"
          title="Spaces our customers adore"
          className="[&_h2]:text-cream [&_p]:text-cream/70"
        />
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {testimonials.map((t) => (
            <figure
              key={t.name}
              className="flex flex-col rounded-2xl bg-cream/5 p-7 ring-1 ring-cream/10"
            >
              <Quote className="h-8 w-8 text-brass-light" />
              <blockquote className="mt-4 flex-1 leading-relaxed text-cream/90">"{t.text}"</blockquote>
              <Rating value={5} className="mt-5" />
              <figcaption className="mt-3">
                <span className="block font-semibold text-cream">{t.name}</span>
                <span className="block text-sm text-cream/60">{t.role}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

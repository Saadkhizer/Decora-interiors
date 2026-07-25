import { Ruler, Hammer, ShieldCheck, Truck } from 'lucide-react';

const features = [
  {
    icon: Ruler,
    title: 'Free measurement',
    text: 'Book a site visit and our team measures everything precisely — at no cost.',
  },
  {
    icon: Hammer,
    title: 'Expert installation',
    text: 'Trained fitters install your floors, blinds and panels with a clean finish.',
  },
  {
    icon: ShieldCheck,
    title: 'Quality guaranteed',
    text: 'Premium imported and local materials, backed by genuine warranties.',
  },
  {
    icon: Truck,
    title: 'Nationwide delivery',
    text: 'Fast, careful delivery across Pakistan — free on orders over Rs 20,000.',
  },
];

export default function WhyUs() {
  return (
    <section className="border-y border-linen bg-cream">
      <div className="container-page py-16 lg:py-20">
        {/* Heading */}
        <div className="mx-auto max-w-2xl text-center">
          <span className="kicker justify-center">Why choose us</span>
          <h2 className="mt-3 text-3xl font-semibold sm:text-4xl">
            Crafted finishes, handled end to end
          </h2>
          <span className="mx-auto mt-4 block h-px w-16 bg-brass" />
          <p className="mt-4 text-stone">
            From the first measurement to the final clean-up, we make beautiful interiors
            effortless.
          </p>
        </div>

        {/* Feature columns with delicate hairline dividers */}
        <div className="mt-12 grid grid-cols-1 gap-px bg-linen sm:grid-cols-2 lg:grid-cols-4">
          {features.map(({ icon: Icon, title, text }) => (
            <div
              key={title}
              className="group flex flex-col items-center gap-4 bg-cream px-6 py-10 text-center transition-colors duration-300 hover:bg-sand"
            >
              <span className="grid h-14 w-14 place-items-center rounded-full ring-1 ring-linen transition-colors duration-300 group-hover:ring-brass">
                <Icon className="h-6 w-6 text-brass-dark" strokeWidth={1.5} />
              </span>
              <h3 className="text-lg font-semibold">{title}</h3>
              <p className="text-sm leading-relaxed text-stone">{text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

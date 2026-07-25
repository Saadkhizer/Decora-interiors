import SectionHeading from '../ui/SectionHeading.jsx';

const steps = [
  { n: '01', title: 'Browse & choose', text: 'Explore the catalogue and shortlist the styles you love.' },
  { n: '02', title: 'Free measurement', text: 'We visit your space, measure up and advise on materials.' },
  { n: '03', title: 'Get a quote', text: 'Receive transparent pricing for products plus installation.' },
  { n: '04', title: 'We install', text: 'Our fitters deliver a flawless finish — on schedule.' },
];

export default function ProcessSteps() {
  return (
    <section className="container-page py-16 lg:py-20">
      <SectionHeading
        center
        kicker="How it works"
        title="From inspiration to installation"
        subtitle="A simple, stress-free process that takes you from idea to a finished space."
      />
      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {steps.map((s, i) => (
          <div key={s.n} className="relative">
            <div className="card h-full p-6">
              <span className="font-display text-5xl font-semibold text-linen">{s.n}</span>
              <h3 className="mt-3 text-xl font-semibold">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-stone">{s.text}</p>
            </div>
            {i < steps.length - 1 && (
              <div className="absolute -right-3 top-1/2 hidden h-px w-6 bg-taupe lg:block" />
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

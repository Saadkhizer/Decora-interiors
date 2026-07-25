export default function SectionHeading({ kicker, title, subtitle, center = false, className = '' }) {
  return (
    <div className={`${center ? 'mx-auto max-w-2xl text-center' : 'max-w-2xl'} ${className}`}>
      {kicker && <span className="kicker">{kicker}</span>}
      <h2 className="mt-3 text-balance text-3xl font-semibold leading-tight sm:text-4xl md:text-[2.6rem]">
        {title}
      </h2>
      {subtitle && <p className="mt-3 text-base leading-relaxed text-stone">{subtitle}</p>}
    </div>
  );
}

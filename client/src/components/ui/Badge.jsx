const styles = {
  sale: 'bg-brass text-white',
  new: 'bg-sage-dark text-white',
  out: 'bg-stone/80 text-white',
  soft: 'bg-linen text-walnut-dark',
};

export default function Badge({ children, variant = 'soft', className = '' }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide ${styles[variant]} ${className}`}
    >
      {children}
    </span>
  );
}

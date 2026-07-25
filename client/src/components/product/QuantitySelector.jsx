import { Plus, Minus } from 'lucide-react';

export default function QuantitySelector({ value, onChange, min = 1, max = 999 }) {
  return (
    <div className="inline-flex items-center rounded-full border border-linen">
      <button
        onClick={() => onChange(Math.max(min, value - 1))}
        className="grid h-11 w-11 place-items-center text-stone hover:text-ink"
        aria-label="Decrease quantity"
      >
        <Minus className="h-4 w-4" />
      </button>
      <input
        type="number"
        value={value}
        min={min}
        max={max}
        onChange={(e) => onChange(Math.min(max, Math.max(min, Number(e.target.value) || min)))}
        className="w-12 border-0 bg-transparent text-center text-base font-medium focus:outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none"
        aria-label="Quantity"
      />
      <button
        onClick={() => onChange(Math.min(max, value + 1))}
        className="grid h-11 w-11 place-items-center text-stone hover:text-ink"
        aria-label="Increase quantity"
      >
        <Plus className="h-4 w-4" />
      </button>
    </div>
  );
}

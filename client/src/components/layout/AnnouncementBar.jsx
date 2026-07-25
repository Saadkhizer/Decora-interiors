import { Truck, Ruler, Phone } from 'lucide-react';
import { site } from '../../config/site.js';

const items = [
  { icon: Ruler, text: 'Free measurement & site visit' },
  { icon: Truck, text: `Free delivery over ${site.currency} 20,000` },
  { icon: Phone, text: `Call us: ${site.phone}` },
];

export default function AnnouncementBar() {
  return (
    <div className="bg-bark-dark text-cream/85">
      <div className="container-page flex h-9 items-center justify-center gap-8 overflow-hidden text-[12.5px]">
        {items.map(({ icon: Icon, text }, i) => (
          <span
            key={text}
            className={`flex items-center gap-2 whitespace-nowrap ${i > 0 ? 'hidden sm:flex' : ''}`}
          >
            <Icon className="h-3.5 w-3.5 text-brass-light" />
            {text}
          </span>
        ))}
      </div>
    </div>
  );
}

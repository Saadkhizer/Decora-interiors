import { useEffect, useMemo, useState } from 'react';
import { X } from 'lucide-react';
import { api } from '../lib/api.js';
import { onImgError } from '../lib/format.js';
import SectionHeading from '../components/ui/SectionHeading.jsx';
import { Skeleton } from '../components/ui/Skeleton.jsx';
import Breadcrumbs from '../components/ui/Breadcrumbs.jsx';

export default function Gallery() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');
  const [lightbox, setLightbox] = useState(null);

  useEffect(() => {
    api.get('/gallery').then(setItems).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const categories = useMemo(
    () => ['All', ...Array.from(new Set(items.map((i) => i.category).filter(Boolean)))],
    [items]
  );
  const filtered = filter === 'All' ? items : items.filter((i) => i.category === filter);

  return (
    <div className="container-page py-8 lg:py-12">
      <Breadcrumbs items={[{ label: 'Our Work' }]} />
      <div className="mt-4">
        <SectionHeading
          kicker="Project gallery"
          title="Spaces we’ve transformed"
          subtitle="A look at real installations — wallpaper, flooring, blinds, panelling and more."
        />
      </div>

      {/* Filters */}
      {categories.length > 1 && (
        <div className="mt-8 flex flex-wrap gap-2">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setFilter(c)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                filter === c ? 'bg-walnut text-cream' : 'bg-sand text-stone hover:bg-linen'
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      )}

      {/* Masonry-ish grid */}
      <div className="mt-8 columns-2 gap-4 md:columns-3 lg:columns-4 [&>*]:mb-4">
        {loading
          ? Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className={`w-full rounded-2xl ${i % 2 ? 'aspect-square' : 'aspect-[3/4]'}`} />
            ))
          : filtered.map((g) => (
              <button
                key={g.id}
                onClick={() => setLightbox(g)}
                className="group block w-full overflow-hidden rounded-2xl shadow-card ring-1 ring-linen"
              >
                <div className="relative">
                  <img src={g.image} onError={onImgError} alt={g.title || 'Project'} loading="lazy" className="w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  <div className="absolute inset-0 flex items-end bg-gradient-to-t from-walnut-dark/70 to-transparent p-4 opacity-0 transition-opacity group-hover:opacity-100">
                    <span className="text-left text-cream">
                      <span className="block text-sm font-medium">{g.title}</span>
                      <span className="block text-xs text-cream/80">{g.category}</span>
                    </span>
                  </div>
                </div>
              </button>
            ))}
      </div>

      {!loading && filtered.length === 0 && (
        <p className="card mt-6 px-6 py-16 text-center text-stone">No images yet.</p>
      )}

      {/* Lightbox */}
      {lightbox && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-walnut-dark/80 p-4" onClick={() => setLightbox(null)}>
          <button className="absolute right-5 top-5 text-cream/80 hover:text-cream" aria-label="Close">
            <X className="h-7 w-7" />
          </button>
          <figure className="max-h-[90vh] max-w-4xl" onClick={(e) => e.stopPropagation()}>
            <img src={lightbox.image} onError={onImgError} alt={lightbox.title || 'Project'} className="max-h-[80vh] w-full rounded-2xl object-contain" />
            {lightbox.title && (
              <figcaption className="mt-3 text-center text-cream">
                {lightbox.title} {lightbox.category && <span className="text-cream/60">· {lightbox.category}</span>}
              </figcaption>
            )}
          </figure>
        </div>
      )}
    </div>
  );
}

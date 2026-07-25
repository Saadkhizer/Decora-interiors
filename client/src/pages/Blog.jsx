import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Calendar } from 'lucide-react';
import { api } from '../lib/api.js';
import { onImgError } from '../lib/format.js';
import SectionHeading from '../components/ui/SectionHeading.jsx';
import { Skeleton } from '../components/ui/Skeleton.jsx';
import Breadcrumbs from '../components/ui/Breadcrumbs.jsx';

export default function Blog() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/blog').then(setPosts).catch(() => {}).finally(() => setLoading(false));
  }, []);

  return (
    <div className="container-page py-8 lg:py-12">
      <Breadcrumbs items={[{ label: 'Journal' }]} />
      <div className="mt-4">
        <SectionHeading
          kicker="Journal"
          title="Ideas, guides & inspiration"
          subtitle="Tips on choosing and caring for wallpaper, flooring, blinds and more."
        />
      </div>

      <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {loading
          ? Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="card overflow-hidden">
                <Skeleton className="aspect-[16/10] w-full rounded-none" />
                <div className="space-y-3 p-5">
                  <Skeleton className="h-3 w-20" />
                  <Skeleton className="h-5 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                </div>
              </div>
            ))
          : posts.map((p) => (
              <Link key={p.id} to={`/blog/${p.slug}`} className="card group flex flex-col overflow-hidden transition-shadow hover:shadow-lift">
                <div className="aspect-[16/10] overflow-hidden bg-linen">
                  <img src={p.cover} onError={onImgError} alt={p.title} loading="lazy" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <div className="flex items-center gap-3 text-xs text-stone">
                    {p.tag && <span className="rounded-full bg-sand px-2.5 py-1 font-medium text-brass-dark">{p.tag}</span>}
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5" /> {new Date(p.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <h2 className="mt-3 text-xl font-semibold leading-snug transition-colors group-hover:text-brass-dark">
                    {p.title}
                  </h2>
                  <p className="mt-2 line-clamp-2 flex-1 text-sm leading-relaxed text-stone">{p.excerpt}</p>
                  <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-brass-dark">
                    Read more <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </span>
                </div>
              </Link>
            ))}
      </div>

      {!loading && posts.length === 0 && (
        <p className="card mt-8 px-6 py-16 text-center text-stone">No posts yet. Check back soon!</p>
      )}
    </div>
  );
}

import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Calendar, User, ArrowLeft } from 'lucide-react';
import { api } from '../lib/api.js';
import { onImgError } from '../lib/format.js';
import Breadcrumbs from '../components/ui/Breadcrumbs.jsx';
import Spinner from '../components/ui/Spinner.jsx';
import CTASection from '../components/home/CTASection.jsx';

export default function BlogPost() {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api.get(`/blog/${slug}`).then(setPost).catch(() => setPost(null)).finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return <div className="flex min-h-[50vh] items-center justify-center"><Spinner /></div>;
  }
  if (!post) {
    return (
      <div className="container-page flex min-h-[50vh] flex-col items-center justify-center gap-4 text-center">
        <p className="text-2xl font-semibold">Post not found</p>
        <Link to="/blog" className="btn-primary"><ArrowLeft className="h-4 w-4" /> Back to journal</Link>
      </div>
    );
  }

  return (
    <article>
      <div className="container-page max-w-3xl py-8 lg:py-10">
        <Breadcrumbs items={[{ label: 'Journal', to: '/blog' }, { label: post.title }]} />
        <div className="mt-5 flex items-center gap-3 text-sm text-stone">
          {post.tag && <span className="rounded-full bg-sand px-3 py-1 font-medium text-brass-dark">{post.tag}</span>}
          <span className="flex items-center gap-1"><Calendar className="h-4 w-4" /> {new Date(post.created_at).toLocaleDateString()}</span>
          <span className="flex items-center gap-1"><User className="h-4 w-4" /> {post.author}</span>
        </div>
        <h1 className="mt-4 text-balance text-4xl font-semibold leading-tight sm:text-5xl">{post.title}</h1>
      </div>

      {post.cover && (
        <div className="container-page max-w-4xl">
          <img src={post.cover} onError={onImgError} alt={post.title} className="aspect-[16/9] w-full rounded-[2rem] object-cover shadow-card ring-1 ring-linen" />
        </div>
      )}

      <div className="container-page max-w-3xl py-10">
        <div className="whitespace-pre-line text-lg leading-relaxed text-stone">{post.body}</div>
        <Link to="/blog" className="btn-ghost mt-8 inline-flex">
          <ArrowLeft className="h-4 w-4" /> Back to all posts
        </Link>
      </div>

      <CTASection />
    </article>
  );
}

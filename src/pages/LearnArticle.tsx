import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Clock } from 'lucide-react';
import { guideBySlug, GUIDES } from '../data/learn';
import Icon from '../components/Icon';
import { useDocumentTitle } from '../lib/useDocumentTitle';

export default function LearnArticle() {
  const { slug } = useParams();
  const guide = slug ? guideBySlug(slug) : undefined;
  useDocumentTitle(guide?.title ?? 'Guide');

  if (!guide) {
    return (
      <div className="container-app py-20 text-center">
        <p className="text-ink-500">Guide not found.</p>
        <Link to="/learn" className="btn-primary mt-4">Back to hub</Link>
      </div>
    );
  }

  const more = GUIDES.filter((g) => g.slug !== guide.slug).slice(0, 3);

  return (
    <div className="container-app py-10">
      <Link to="/learn" className="mb-6 inline-flex items-center gap-1 text-sm text-ink-500 hover:text-brand-700 dark:text-ink-400">
        <ArrowLeft className="h-4 w-4" /> All guides
      </Link>

      <article className="mx-auto max-w-2xl">
        <span className="grid h-14 w-14 place-items-center rounded-2xl bg-brand-50 text-brand-700 dark:bg-ink-800 dark:text-brand-400">
          <Icon name={guide.icon} className="h-7 w-7" />
        </span>
        <div className="mt-4 flex items-center gap-2 text-xs text-ink-400">
          <span className="chip bg-ink-50 text-ink-600 dark:bg-ink-800 dark:text-ink-300">{guide.category}</span>
          <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {guide.minutes} min read</span>
        </div>
        <h1 className="mt-3 font-display text-3xl font-bold text-ink-900 sm:text-4xl dark:text-white">{guide.title}</h1>

        <div className="mt-6 space-y-5">
          {guide.body.map((block, i) => (
            <div key={i}>
              {block.heading && <h2 className="mb-1.5 text-lg font-semibold text-ink-900 dark:text-white">{block.heading}</h2>}
              <p className="leading-relaxed text-ink-600 dark:text-ink-300">{block.text}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 rounded-2xl bg-brand-50 p-5 dark:bg-ink-800">
          <p className="text-sm text-ink-600 dark:text-ink-300">
            Ready to put this into practice?{' '}
            <Link to="/marketplace" className="font-semibold text-brand-700 underline dark:text-brand-400">Compare products</Link>{' '}
            or{' '}
            <Link to="/advisor" className="font-semibold text-brand-700 underline dark:text-brand-400">get an AI recommendation</Link>.
          </p>
        </div>
      </article>

      <div className="mx-auto mt-12 max-w-4xl">
        <h3 className="section-title mb-4 !text-xl">Keep reading</h3>
        <div className="grid gap-4 sm:grid-cols-3">
          {more.map((g) => (
            <Link key={g.slug} to={`/learn/${g.slug}`} className="card p-4 hover:shadow-glow">
              <p className="text-xs text-ink-400">{g.category}</p>
              <p className="mt-1 text-sm font-semibold text-ink-900 dark:text-white">{g.title}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

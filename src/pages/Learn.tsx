import { Link } from 'react-router-dom';
import { Clock, ArrowRight } from 'lucide-react';
import { GUIDES } from '../data/learn';
import Icon from '../components/Icon';
import { useDocumentTitle } from '../lib/useDocumentTitle';

export default function Learn() {
  useDocumentTitle('Financial Education Hub');

  return (
    <div>
      <section className="bg-gradient-to-b from-brand-50 to-ink-50 dark:from-ink-900 dark:to-ink-900">
        <div className="container-app py-16 text-center">
          <span className="chip mx-auto mb-4 bg-white text-brand-700 shadow-card dark:bg-ink-800 dark:text-brand-400">Financial Education Hub</span>
          <h1 className="mx-auto max-w-2xl font-display text-4xl font-bold text-ink-900 sm:text-5xl dark:text-white">
            Learn before you borrow, save or invest
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-ink-500 dark:text-ink-300">
            Plain-English guides to help you make confident money decisions — no jargon, no sales pitch.
          </p>
        </div>
      </section>

      <section className="container-app py-12">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {GUIDES.map((g) => (
            <Link key={g.slug} to={`/learn/${g.slug}`} className="card group flex flex-col p-6 hover:-translate-y-0.5 hover:shadow-glow">
              <span className="grid h-12 w-12 place-items-center rounded-xl bg-brand-50 text-brand-700 dark:bg-ink-900 dark:text-brand-400">
                <Icon name={g.icon} className="h-6 w-6" />
              </span>
              <div className="mt-4 flex items-center gap-2 text-xs text-ink-400">
                <span className="chip bg-ink-50 text-ink-600 dark:bg-ink-900 dark:text-ink-300">{g.category}</span>
                <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {g.minutes} min</span>
              </div>
              <h3 className="mt-3 font-semibold text-ink-900 group-hover:text-brand-700 dark:text-white dark:group-hover:text-brand-400">{g.title}</h3>
              <p className="mt-1 flex-1 text-sm text-ink-500 dark:text-ink-400">{g.excerpt}</p>
              <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-brand-700 dark:text-brand-400">
                Read guide <ArrowRight className="h-4 w-4" />
              </span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}

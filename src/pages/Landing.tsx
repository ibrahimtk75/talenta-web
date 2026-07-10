import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Search, Sparkles, ShieldCheck, Scale, Globe2, ArrowRight, Star } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { CATEGORIES } from '../data/categories';
import { PRODUCTS } from '../data/products';
import Icon from '../components/Icon';
import ProductCard from '../components/ProductCard';
import { useDocumentTitle } from '../lib/useDocumentTitle';

export default function Landing() {
  const { t } = useApp();
  const navigate = useNavigate();
  const [q, setQ] = useState('');
  useDocumentTitle();

  const featured = PRODUCTS.filter((p) => p.featured).slice(0, 6);

  const stats = [
    { label: 'Product categories', value: '10' },
    { label: 'Verified providers', value: '2.4K+' },
    { label: 'Countries served', value: '40+' },
    { label: 'Compared monthly', value: '$1.2B' },
  ];

  const steps = [
    { icon: 'Search', title: 'Search & compare', text: 'Filter thousands of products by rate, amount, term and trust score.' },
    { icon: 'Sparkles', title: 'Get AI guidance', text: 'An explainable advisor estimates your fit — never a hidden decision.' },
    { icon: 'FileCheck', title: 'Apply & track', text: 'Apply with verified providers and track status in real time.' },
  ];

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-b from-brand-50 to-ink-50 dark:from-ink-900 dark:to-ink-900">
        <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-brand-400/20 blur-3xl" />
        <div className="container-app relative py-16 sm:py-24">
          <div className="mx-auto max-w-3xl text-center">
            <span className="chip mx-auto mb-5 bg-white text-brand-700 shadow-card dark:bg-ink-800 dark:text-brand-400">
              <Globe2 className="h-3.5 w-3.5" /> The global financial marketplace
            </span>
            <h1 className="font-display text-4xl font-bold tracking-tight text-ink-900 sm:text-6xl dark:text-white">
              {t('hero.title')}
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-lg text-ink-500 dark:text-ink-300">
              {t('hero.subtitle')}
            </p>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                navigate(`/marketplace?q=${encodeURIComponent(q)}`);
              }}
              className="mx-auto mt-8 flex max-w-xl items-center gap-2 rounded-2xl border border-ink-100 bg-white p-2 shadow-card dark:border-ink-700 dark:bg-ink-800"
            >
              <Search className="ml-2 h-5 w-5 shrink-0 text-ink-400" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder={t('search.placeholder')}
                className="w-full bg-transparent px-1 py-2 text-sm outline-none placeholder:text-ink-400"
              />
              <button type="submit" className="btn-primary shrink-0">
                {t('hero.cta')}
              </button>
            </form>

            <div className="mt-4 flex items-center justify-center gap-2 text-sm text-ink-500 dark:text-ink-400">
              <Star className="h-4 w-4 fill-gold text-gold" /> Impartial & commission-transparent
              <span className="mx-1">·</span>
              <button onClick={() => navigate('/advisor')} className="font-semibold text-brand-700 hover:underline dark:text-brand-400">
                {t('hero.cta2')} <ArrowRight className="inline h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          <div className="mx-auto mt-14 grid max-w-4xl grid-cols-2 gap-4 sm:grid-cols-4">
            {stats.map((s) => (
              <div key={s.label} className="rounded-2xl border border-ink-100 bg-white/70 p-4 text-center backdrop-blur dark:border-ink-700 dark:bg-ink-800/60">
                <p className="font-display text-2xl font-bold text-brand-700 dark:text-brand-400">{s.value}</p>
                <p className="text-xs text-ink-500 dark:text-ink-400">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="container-app py-16">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <h2 className="section-title">Explore every category</h2>
            <p className="mt-1 text-ink-500 dark:text-ink-400">Ten financial verticals, one trusted marketplace.</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {CATEGORIES.map((c) => (
            <button
              key={c.id}
              onClick={() => navigate(`/marketplace?cat=${c.id}`)}
              className="card group flex flex-col items-start p-5 text-left hover:-translate-y-0.5 hover:shadow-glow"
            >
              <span className="mb-3 grid h-11 w-11 place-items-center rounded-xl bg-brand-50 text-brand-700 transition group-hover:bg-brand-600 group-hover:text-white dark:bg-ink-900 dark:text-brand-400">
                <Icon name={c.icon} className="h-5 w-5" />
              </span>
              <p className="font-semibold text-ink-900 dark:text-white">{c.name}</p>
              <p className="text-xs text-ink-400">{c.tagline}</p>
            </button>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="border-y border-ink-100 bg-white py-16 dark:border-ink-800 dark:bg-ink-900">
        <div className="container-app">
          <h2 className="section-title text-center">How GlobalFundConnect works</h2>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {steps.map((s, i) => (
              <div key={s.title} className="relative rounded-2xl border border-ink-100 p-6 dark:border-ink-800">
                <span className="absolute right-5 top-5 font-display text-4xl font-bold text-ink-100 dark:text-ink-800">
                  {i + 1}
                </span>
                <span className="grid h-12 w-12 place-items-center rounded-xl bg-brand-50 text-brand-700 dark:bg-ink-800 dark:text-brand-400">
                  <Icon name={s.icon} className="h-6 w-6" />
                </span>
                <h3 className="mt-4 text-lg font-semibold text-ink-900 dark:text-white">{s.title}</h3>
                <p className="mt-1 text-sm text-ink-500 dark:text-ink-400">{s.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured */}
      <section className="container-app py-16">
        <div className="mb-8 flex items-end justify-between">
          <h2 className="section-title">Featured this week</h2>
          <button onClick={() => navigate('/marketplace')} className="btn-ghost">
            View all <ArrowRight className="h-4 w-4" />
          </button>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      {/* Trust band */}
      <section className="container-app pb-16">
        <div className="grid gap-4 rounded-2xl bg-ink-900 p-8 text-white sm:grid-cols-3 dark:bg-ink-800">
          {[
            { icon: ShieldCheck, title: 'Provider verification', text: 'KYB checks, regulatory status and a transparent trust score on every provider.' },
            { icon: Scale, title: 'Impartial comparison', text: 'We show all matching options and disclose how we earn — sponsored is always labelled.' },
            { icon: Sparkles, title: 'AI you can question', text: 'Every recommendation and eligibility estimate comes with plain-English reasons.' },
          ].map((f) => (
            <div key={f.title}>
              <f.icon className="h-7 w-7 text-brand-400" />
              <h3 className="mt-3 font-semibold">{f.title}</h3>
              <p className="mt-1 text-sm text-ink-300">{f.text}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

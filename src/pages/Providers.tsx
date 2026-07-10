import { Link } from 'react-router-dom';
import { Check, TrendingUp, Users, BarChart3, Megaphone } from 'lucide-react';
import { useDocumentTitle } from '../lib/useDocumentTitle';

export default function Providers() {
  useDocumentTitle('For Providers');
  const benefits = [
    { icon: Users, title: 'Reach qualified demand', text: 'Get in front of intent-rich users actively comparing products in your category.' },
    { icon: BarChart3, title: 'Analytics that convert', text: 'Impression-to-approval funnels, cohort insights and downloadable reports.' },
    { icon: Megaphone, title: 'Featured & sponsored', text: 'Boost visibility with clearly-labelled premium placements.' },
    { icon: TrendingUp, title: 'Trust that ranks', text: 'Complete verification to lift your trust score — and your position.' },
  ];

  const plans = [
    { name: 'Starter', price: '$0', period: 'free', features: ['Up to 3 listings', 'Basic analytics', 'Standard placement'], cta: 'Start free' },
    { name: 'Growth', price: '$499', period: '/mo', features: ['Unlimited listings', '2 sponsored placements', 'Advanced analytics', 'API access'], cta: 'Choose Growth', featured: true },
    { name: 'Enterprise', price: 'Custom', period: '', features: ['Dedicated success manager', 'Custom integrations', 'SLA & priority support', 'Multi-market rollout'], cta: 'Talk to sales' },
  ];

  return (
    <div>
      <section className="bg-gradient-to-b from-brand-50 to-ink-50 dark:from-ink-900 dark:to-ink-900">
        <div className="container-app py-16 text-center sm:py-20">
          <span className="chip mx-auto mb-4 bg-white text-brand-700 shadow-card dark:bg-ink-800 dark:text-brand-400">For financial providers</span>
          <h1 className="mx-auto max-w-3xl font-display text-4xl font-bold text-ink-900 sm:text-5xl dark:text-white">
            List your products where the world compares
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-ink-500 dark:text-ink-300">
            Join a transparent marketplace that sends you high-intent applicants — banks, insurers, fintechs, funds and foundations welcome.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link to="/login" className="btn-primary">Become a provider</Link>
            <Link to="/provider" className="btn-ghost">View portal demo</Link>
          </div>
        </div>
      </section>

      <section className="container-app py-16">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {benefits.map((b) => (
            <div key={b.title} className="card p-6">
              <span className="grid h-12 w-12 place-items-center rounded-xl bg-brand-50 text-brand-700 dark:bg-ink-900 dark:text-brand-400">
                <b.icon className="h-6 w-6" />
              </span>
              <h3 className="mt-4 font-semibold text-ink-900 dark:text-white">{b.title}</h3>
              <p className="mt-1 text-sm text-ink-500 dark:text-ink-400">{b.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-y border-ink-100 bg-white py-16 dark:border-ink-800 dark:bg-ink-900">
        <div className="container-app">
          <h2 className="section-title text-center">Simple, transparent pricing</h2>
          <div className="mx-auto mt-10 grid max-w-5xl gap-6 lg:grid-cols-3">
            {plans.map((p) => (
              <div key={p.name} className={`card p-6 ${p.featured ? 'ring-2 ring-brand-500' : ''}`}>
                {p.featured && <span className="chip mb-3 bg-brand-600 text-white">Most popular</span>}
                <h3 className="font-semibold text-ink-900 dark:text-white">{p.name}</h3>
                <p className="mt-2 font-display text-3xl font-bold text-ink-900 dark:text-white">
                  {p.price}<span className="text-sm font-medium text-ink-400">{p.period}</span>
                </p>
                <ul className="mt-4 space-y-2">
                  {p.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm text-ink-600 dark:text-ink-300">
                      <Check className="h-4 w-4 text-brand-600" /> {f}
                    </li>
                  ))}
                </ul>
                <Link to="/login" className={`mt-6 w-full ${p.featured ? 'btn-primary' : 'btn-outline'}`}>{p.cta}</Link>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

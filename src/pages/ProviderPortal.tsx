import { Navigate } from 'react-router-dom';
import { Plus, TrendingUp, Eye, MousePointerClick } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { PRODUCTS } from '../data/products';
import { formatRate } from '../lib/format';
import StatCard from '../components/StatCard';

export default function ProviderPortal() {
  const { user } = useApp();
  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== 'provider') return <Navigate to="/dashboard" replace />;

  // Pretend this provider owns Atlas listings.
  const listings = PRODUCTS.filter((p) => p.providerId === 'p-atlas');

  const funnel = [
    { label: 'Impressions', value: 128400, icon: 'Eye' },
    { label: 'Clicks', value: 9120, icon: 'MousePointerClick' },
    { label: 'Applications', value: 742, icon: 'FileText' },
    { label: 'Approved', value: 318, icon: 'CheckCircle2' },
  ];

  return (
    <div className="container-app py-10">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="chip mb-2 bg-info/10 text-info">Provider Portal</span>
          <h1 className="font-display text-3xl font-bold text-ink-900 dark:text-white">Atlas Global Bank</h1>
          <p className="mt-1 text-ink-500 dark:text-ink-400">Manage listings, track performance, grow your reach.</p>
        </div>
        <button className="btn-primary"><Plus className="h-4 w-4" /> New listing</button>
      </div>

      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon="Eye" label="Impressions (30d)" value="128.4K" hint="+12%" />
        <StatCard icon="MousePointerClick" label="Click-through rate" value="7.1%" hint="+0.4%" />
        <StatCard icon="FileText" label="Applications" value="742" hint="+58" />
        <StatCard icon="Star" label="Avg. product rating" value="4.6" />
      </div>

      <div className="grid gap-8 lg:grid-cols-[1.5fr_1fr]">
        <div>
          <h2 className="mb-4 text-lg font-semibold text-ink-900 dark:text-white">Your listings</h2>
          <div className="card divide-y divide-ink-100 dark:divide-ink-700">
            {listings.map((p) => (
              <div key={p.id} className="flex items-center justify-between gap-3 p-4">
                <div>
                  <p className="font-semibold text-ink-900 dark:text-white">{p.name}</p>
                  <p className="text-xs text-ink-400">{formatRate(p.rate, p.rateLabel)} · {p.reviews.toLocaleString()} reviews</p>
                </div>
                <div className="flex items-center gap-2">
                  {p.sponsored && <span className="chip bg-gold/15 text-gold">Sponsored</span>}
                  <span className="chip bg-brand-50 text-brand-700 dark:bg-brand-900/40 dark:text-brand-300">Live</span>
                </div>
              </div>
            ))}
          </div>

          <div className="card mt-6 p-5">
            <h3 className="mb-3 flex items-center gap-2 font-semibold text-ink-900 dark:text-white">
              <TrendingUp className="h-5 w-5 text-brand-600" /> Conversion funnel (30d)
            </h3>
            <div className="space-y-3">
              {funnel.map((f, i) => {
                const pct = (f.value / funnel[0].value) * 100;
                return (
                  <div key={f.label}>
                    <div className="mb-1 flex justify-between text-sm">
                      <span className="text-ink-600 dark:text-ink-300">{f.label}</span>
                      <span className="font-semibold text-ink-900 dark:text-white">{f.value.toLocaleString()}</span>
                    </div>
                    <div className="h-2.5 w-full overflow-hidden rounded-full bg-ink-100 dark:bg-ink-700">
                      <div className="h-full rounded-full bg-brand-500" style={{ width: `${pct}%`, opacity: 1 - i * 0.15 }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="card p-5">
            <h3 className="font-semibold text-ink-900 dark:text-white">Subscription</h3>
            <p className="mt-2 text-sm text-ink-500 dark:text-ink-400">Growth plan · renews 1 Aug 2026</p>
            <div className="mt-3 rounded-xl bg-brand-50 p-4 dark:bg-ink-900">
              <p className="font-display text-2xl font-bold text-brand-700 dark:text-brand-400">$499<span className="text-sm font-medium text-ink-400">/mo</span></p>
              <ul className="mt-2 space-y-1 text-xs text-ink-500 dark:text-ink-400">
                <li>• Unlimited listings</li>
                <li>• 2 sponsored placements</li>
                <li>• Analytics & API access</li>
              </ul>
            </div>
            <button className="btn-outline mt-4 w-full">Manage plan</button>
          </div>

          <div className="card p-5">
            <h3 className="mb-2 flex items-center gap-2 font-semibold text-ink-900 dark:text-white">
              <Eye className="h-5 w-5 text-brand-600" /> Verification
            </h3>
            <p className="text-sm text-ink-500 dark:text-ink-400">KYB verified · Regulated · Trust score <strong className="text-brand-700 dark:text-brand-400">94/100</strong></p>
            <div className="mt-3 flex items-center gap-2 text-xs text-ink-400">
              <MousePointerClick className="h-4 w-4" /> Higher trust scores rank higher in comparison.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

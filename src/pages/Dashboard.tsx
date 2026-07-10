import { Link, Navigate } from 'react-router-dom';
import { Bookmark, Bell, FileText } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { productById } from '../data/products';
import { providerById } from '../data/providers';
import { formatRate } from '../lib/format';
import type { Application, ApplicationStatus } from '../lib/types';
import StatCard from '../components/StatCard';
import ProductCard from '../components/ProductCard';
import StarRating from '../components/StarRating';

const DEMO_APPS: Application[] = [
  { id: 'a1', productId: 'ln-atlas-personal', status: 'in-review', submittedAt: '2026-07-02', amount: 12000 },
  { id: 'a2', productId: 'cc-meridian-cashback', status: 'approved', submittedAt: '2026-06-20', amount: 0 },
  { id: 'a3', productId: 'sv-atlas-hys', status: 'submitted', submittedAt: '2026-07-08', amount: 5000 },
];

const STATUS_STYLE: Record<ApplicationStatus, string> = {
  draft: 'bg-ink-100 text-ink-600 dark:bg-ink-800 dark:text-ink-300',
  submitted: 'bg-info/10 text-info',
  'in-review': 'bg-gold/15 text-gold',
  approved: 'bg-brand-50 text-brand-700 dark:bg-brand-900/40 dark:text-brand-300',
  declined: 'bg-danger/10 text-danger',
};

export default function Dashboard() {
  const { user, saved } = useApp();
  if (!user) return <Navigate to="/login" replace />;
  if (user.role === 'provider') return <Navigate to="/provider" replace />;
  if (user.role === 'admin') return <Navigate to="/admin" replace />;

  const savedProducts = saved.map((id) => productById(id)).filter(Boolean);

  return (
    <div className="container-app py-10">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-ink-900 dark:text-white">Hi, {user.name} 👋</h1>
        <p className="mt-1 text-ink-500 dark:text-ink-400">Here's what's happening with your money.</p>
      </div>

      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon="FileText" label="Active applications" value="3" hint="+1 this week" />
        <StatCard icon="Bookmark" label="Saved products" value={String(saved.length)} />
        <StatCard icon="TrendingUp" label="Best saved yield" value="4.6%" />
        <StatCard icon="ShieldCheck" label="Avg. provider trust" value="91/100" />
      </div>

      <div className="grid gap-8 lg:grid-cols-[1.6fr_1fr]">
        {/* Applications */}
        <div>
          <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-ink-900 dark:text-white">
            <FileText className="h-5 w-5 text-brand-600" /> Application tracking
          </h2>
          <div className="card divide-y divide-ink-100 dark:divide-ink-700">
            {DEMO_APPS.map((app) => {
              const p = productById(app.productId);
              const provider = p ? providerById(p.providerId) : undefined;
              return (
                <div key={app.id} className="flex items-center justify-between gap-3 p-4">
                  <div className="min-w-0">
                    <Link to={`/product/${app.productId}`} className="font-semibold text-ink-900 hover:text-brand-700 dark:text-white">
                      {p?.name}
                    </Link>
                    <p className="text-xs text-ink-400">{provider?.name} · submitted {app.submittedAt}</p>
                  </div>
                  <span className={`chip capitalize ${STATUS_STYLE[app.status]}`}>{app.status.replace('-', ' ')}</span>
                </div>
              );
            })}
          </div>

          <h2 className="mb-4 mt-8 flex items-center gap-2 text-lg font-semibold text-ink-900 dark:text-white">
            <Bookmark className="h-5 w-5 text-brand-600" /> Saved products
          </h2>
          {savedProducts.length === 0 ? (
            <div className="card p-8 text-center text-sm text-ink-500 dark:text-ink-400">
              You haven't saved anything yet. <Link to="/marketplace" className="font-semibold text-brand-700 underline">Browse the marketplace</Link>.
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {savedProducts.map((p) => <ProductCard key={p!.id} product={p!} />)}
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div>
            <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-ink-900 dark:text-white">
              <Bell className="h-5 w-5 text-brand-600" /> Notifications
            </h2>
            <div className="card divide-y divide-ink-100 p-0 dark:divide-ink-700">
              {[
                { t: 'Your Atlas Personal Loan moved to review.', time: '2h ago' },
                { t: 'Rate drop: Meridian 1-Year Fixed now 5.1%.', time: '1d ago' },
                { t: 'New scholarship matches your profile.', time: '3d ago' },
              ].map((n, i) => (
                <div key={i} className="p-4">
                  <p className="text-sm text-ink-700 dark:text-ink-200">{n.t}</p>
                  <p className="text-xs text-ink-400">{n.time}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="card p-5">
            <h3 className="font-semibold text-ink-900 dark:text-white">Recommended for you</h3>
            <div className="mt-3 space-y-3">
              {['sv-meridian-fd', 'iv-cedar-etf'].map((id) => {
                const p = productById(id)!;
                return (
                  <Link key={id} to={`/product/${id}`} className="block rounded-xl border border-ink-100 p-3 hover:border-brand-300 dark:border-ink-700">
                    <p className="text-sm font-semibold text-ink-900 dark:text-white">{p.name}</p>
                    <p className="text-xs text-ink-400">{formatRate(p.rate, p.rateLabel)}</p>
                    <div className="mt-1"><StarRating value={p.rating} /></div>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

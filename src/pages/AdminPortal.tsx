import { Navigate } from 'react-router-dom';
import { AlertTriangle, Check, X, ShieldCheck } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { PRODUCTS } from '../data/products';
import { PROVIDERS } from '../data/providers';
import { providerById } from '../data/providers';
import StatCard from '../components/StatCard';
import TrustBadge from '../components/TrustBadge';
import { useDocumentTitle } from '../lib/useDocumentTitle';

export default function AdminPortal() {
  const { user } = useApp();
  useDocumentTitle('Admin Portal');
  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== 'admin') return <Navigate to="/dashboard" replace />;

  const flagged = PRODUCTS.filter((p) => p.flagged);
  const pendingProviders = PROVIDERS.filter((p) => !p.verified);

  return (
    <div className="container-app py-10">
      <div className="mb-8">
        <span className="chip mb-2 bg-danger/10 text-danger">Admin Portal</span>
        <h1 className="font-display text-3xl font-bold text-ink-900 dark:text-white">Platform control</h1>
        <p className="mt-1 text-ink-500 dark:text-ink-400">Moderate listings, verify providers, monitor fraud signals.</p>
      </div>

      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon="Users" label="Total users" value="48.2K" hint="+3.1%" />
        <StatCard icon="Building2" label="Providers" value={String(PROVIDERS.length)} />
        <StatCard icon="Package" label="Live products" value={String(PRODUCTS.length)} />
        <StatCard icon="AlertTriangle" label="Fraud flags" value={String(flagged.length)} />
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <div>
          <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-ink-900 dark:text-white">
            <AlertTriangle className="h-5 w-5 text-danger" /> Fraud review queue
          </h2>
          <div className="card divide-y divide-ink-100 dark:divide-ink-700">
            {flagged.length === 0 && <p className="p-6 text-sm text-ink-500">Queue is clear 🎉</p>}
            {flagged.map((p) => (
              <div key={p.id} className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold text-ink-900 dark:text-white">{p.name}</p>
                    <p className="text-xs text-ink-400">{providerById(p.providerId)?.name} · {p.rate}% {p.rateLabel}</p>
                  </div>
                  <div className="flex gap-2">
                    <button className="btn-ghost !px-2 !py-1 text-danger" aria-label="Remove"><X className="h-4 w-4" /></button>
                    <button className="btn-ghost !px-2 !py-1 text-brand-600" aria-label="Approve"><Check className="h-4 w-4" /></button>
                  </div>
                </div>
                <p className="mt-2 rounded-lg bg-danger/5 p-2 text-xs text-danger">
                  Signals: extreme APR, upfront-fee request, unverified provider.
                </p>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-ink-900 dark:text-white">
            <ShieldCheck className="h-5 w-5 text-brand-600" /> Provider verification
          </h2>
          <div className="card divide-y divide-ink-100 dark:divide-ink-700">
            {pendingProviders.length === 0 && <p className="p-6 text-sm text-ink-500">No pending verifications.</p>}
            {pendingProviders.map((p) => (
              <div key={p.id} className="flex items-center justify-between gap-3 p-4">
                <div>
                  <p className="font-semibold text-ink-900 dark:text-white">{p.name}</p>
                  <p className="text-xs text-ink-400">{p.country}</p>
                </div>
                <div className="flex items-center gap-2">
                  <TrustBadge score={p.trustScore} />
                  <button className="btn-primary !px-3 !py-1.5 text-xs">Verify</button>
                </div>
              </div>
            ))}
          </div>

          <h2 className="mb-4 mt-8 text-lg font-semibold text-ink-900 dark:text-white">All providers</h2>
          <div className="card divide-y divide-ink-100 dark:divide-ink-700">
            {PROVIDERS.filter((p) => p.verified).map((p) => (
              <div key={p.id} className="flex items-center justify-between gap-3 p-4">
                <span className="text-sm font-medium text-ink-800 dark:text-ink-100">{p.name}</span>
                <TrustBadge score={p.trustScore} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Bookmark, BadgeCheck, AlertTriangle, Check, ShieldCheck } from 'lucide-react';
import { productById, PRODUCTS } from '../data/products';
import { providerById } from '../data/providers';
import { categoryById } from '../data/categories';
import { formatMoney, formatRate } from '../lib/format';
import { estimateEligibility, type EligibilityInput } from '../lib/eligibility';
import { useApp } from '../context/AppContext';
import StarRating from '../components/StarRating';
import TrustBadge from '../components/TrustBadge';
import ProductCard from '../components/ProductCard';
import Icon from '../components/Icon';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isSaved, toggleSaved, user } = useApp();
  const product = id ? productById(id) : undefined;

  const [form, setForm] = useState<EligibilityInput>({ annualIncome: 40000, creditScore: 700, employed: true });
  const [applied, setApplied] = useState(false);

  if (!product) {
    return (
      <div className="container-app py-20 text-center">
        <p className="text-ink-500">Product not found.</p>
        <Link to="/marketplace" className="btn-primary mt-4">Back to marketplace</Link>
      </div>
    );
  }

  const provider = providerById(product.providerId);
  const category = categoryById(product.category);
  const saved = isSaved(product.id);
  const est = estimateEligibility(product, form);
  const similar = PRODUCTS.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 3);

  const bandColor = { strong: 'text-brand-600', moderate: 'text-gold', weak: 'text-danger' }[est.band];

  return (
    <div className="container-app py-8">
      <button onClick={() => navigate(-1)} className="mb-4 inline-flex items-center gap-1 text-sm text-ink-500 hover:text-brand-700 dark:text-ink-400">
        <ArrowLeft className="h-4 w-4" /> Back
      </button>

      {product.flagged && (
        <div className="mb-6 flex items-start gap-3 rounded-xl border border-danger/30 bg-danger/10 p-4 text-sm text-danger">
          <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0" />
          <div>
            <strong>Caution flag.</strong> This listing shows warning signs (very high cost or upfront-fee requests).
            Never pay a fee to "guarantee" a loan. Review terms independently before proceeding.
          </div>
        </div>
      )}

      <div className="grid gap-8 lg:grid-cols-[1.6fr_1fr]">
        {/* Main */}
        <div>
          <div className="flex items-start gap-4">
            <span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-brand-50 text-brand-700 dark:bg-ink-800 dark:text-brand-400">
              <Icon name={category?.icon ?? 'Circle'} className="h-7 w-7" />
            </span>
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="font-display text-2xl font-bold text-ink-900 sm:text-3xl dark:text-white">{product.name}</h1>
                {provider?.verified && (
                  <span className="chip bg-brand-50 text-brand-700 dark:bg-brand-900/40 dark:text-brand-300">
                    <BadgeCheck className="h-3.5 w-3.5" /> Verified
                  </span>
                )}
              </div>
              <p className="mt-1 text-ink-500 dark:text-ink-400">
                {provider?.name} · {product.country} · {category?.name}
              </p>
              <div className="mt-2"><StarRating value={product.rating} reviews={product.reviews} /></div>
            </div>
            <button onClick={() => toggleSaved(product.id)} className="btn-ghost !px-2.5" aria-label="Save">
              <Bookmark className={`h-5 w-5 ${saved ? 'fill-brand-600 text-brand-600' : ''}`} />
            </button>
          </div>

          <p className="mt-6 text-ink-600 dark:text-ink-300">{product.summary}</p>

          <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {[
              { k: product.rateLabel, v: formatRate(product.rate, product.rateLabel) },
              { k: 'Min amount', v: product.minAmount != null ? formatMoney(product.minAmount, product.currency) : '—' },
              { k: 'Max amount', v: product.maxAmount != null ? formatMoney(product.maxAmount, product.currency) : '—' },
              { k: 'Term', v: product.termLabel },
            ].map((s) => (
              <div key={s.k} className="rounded-xl border border-ink-100 p-3 dark:border-ink-800">
                <p className="text-xs uppercase tracking-wide text-ink-400">{s.k}</p>
                <p className="mt-1 font-semibold text-ink-900 dark:text-white">{s.v}</p>
              </div>
            ))}
          </div>

          <div className="mt-6">
            <h3 className="mb-2 font-semibold text-ink-900 dark:text-white">Highlights</h3>
            <div className="flex flex-wrap gap-2">
              {product.tags.map((tag) => (
                <span key={tag} className="chip bg-ink-50 text-ink-700 dark:bg-ink-800 dark:text-ink-200">
                  <Check className="h-3.5 w-3.5 text-brand-600" /> {tag}
                </span>
              ))}
            </div>
          </div>

          {provider && (
            <div className="mt-8 rounded-2xl border border-ink-100 p-5 dark:border-ink-800">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="grid h-11 w-11 place-items-center rounded-xl bg-ink-900 font-bold text-white dark:bg-ink-700">
                    {provider.logoText}
                  </span>
                  <div>
                    <p className="font-semibold text-ink-900 dark:text-white">{provider.name}</p>
                    <p className="text-xs text-ink-400">{provider.country} · {provider.regulated ? 'Regulated' : 'Not regulated'}</p>
                  </div>
                </div>
                <TrustBadge score={provider.trustScore} />
              </div>
              <p className="mt-3 flex items-center gap-1.5 text-xs text-ink-500 dark:text-ink-400">
                <ShieldCheck className="h-4 w-4 text-brand-600" />
                Trust score reflects verification status, regulatory standing, review volume and complaint history.
              </p>
            </div>
          )}

          {similar.length > 0 && (
            <div className="mt-10">
              <h3 className="section-title mb-4 !text-xl">Similar {category?.name.toLowerCase()}</h3>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {similar.map((p) => <ProductCard key={p.id} product={p} />)}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar — eligibility + apply */}
        <div className="space-y-5">
          <div className="card sticky top-20 p-5">
            <h3 className="font-display text-lg font-bold text-ink-900 dark:text-white">AI eligibility estimate</h3>
            <p className="mt-1 text-xs text-ink-400">An estimate to guide you — not a lending decision.</p>

            <div className="mt-4 space-y-3">
              <div>
                <label className="label">Annual income</label>
                <input
                  type="number"
                  value={form.annualIncome}
                  onChange={(e) => setForm({ ...form, annualIncome: Number(e.target.value) })}
                  className="input"
                />
              </div>
              <div>
                <label className="label">Credit score: <span className="font-bold text-brand-700 dark:text-brand-400">{form.creditScore}</span></label>
                <input
                  type="range" min={300} max={850}
                  value={form.creditScore}
                  onChange={(e) => setForm({ ...form, creditScore: Number(e.target.value) })}
                  className="w-full accent-brand-600"
                />
              </div>
              <label className="flex items-center gap-2 text-sm text-ink-700 dark:text-ink-200">
                <input type="checkbox" checked={form.employed} onChange={(e) => setForm({ ...form, employed: e.target.checked })} className="accent-brand-600" />
                Currently employed
              </label>
            </div>

            <div className="mt-5 rounded-xl bg-ink-50 p-4 dark:bg-ink-900">
              <div className="flex items-end justify-between">
                <span className="text-sm text-ink-500 dark:text-ink-400">Estimated fit</span>
                <span className={`font-display text-3xl font-bold ${bandColor}`}>{est.score}</span>
              </div>
              <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-ink-200 dark:bg-ink-700">
                <div className="h-full rounded-full bg-brand-500" style={{ width: `${est.score}%` }} />
              </div>
              <ul className="mt-3 space-y-1.5">
                {est.reasons.map((r, i) => (
                  <li key={i} className="text-xs text-ink-500 dark:text-ink-400">• {r}</li>
                ))}
              </ul>
            </div>

            {applied ? (
              <div className="mt-4 rounded-xl border border-brand-200 bg-brand-50 p-4 text-center text-sm text-brand-700 dark:border-brand-800 dark:bg-brand-900/30 dark:text-brand-300">
                <Check className="mx-auto mb-1 h-6 w-6" />
                Application started! Track it in your dashboard.
                <Link to="/dashboard" className="mt-2 block font-semibold underline">Go to dashboard</Link>
              </div>
            ) : (
              <button
                onClick={() => {
                  if (!user) { navigate('/login'); return; }
                  setApplied(true);
                }}
                className="btn-primary mt-4 w-full"
              >
                {user ? 'Apply now' : 'Sign in to apply'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

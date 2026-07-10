import { Link } from 'react-router-dom';
import { Bookmark, BadgeCheck, AlertTriangle, Sparkles } from 'lucide-react';
import type { FinancialProduct } from '../lib/types';
import { providerById } from '../data/providers';
import { categoryById } from '../data/categories';
import { formatMoney, formatRate } from '../lib/format';
import { useApp } from '../context/AppContext';
import StarRating from './StarRating';
import TrustBadge from './TrustBadge';
import Icon from './Icon';

export default function ProductCard({ product }: { product: FinancialProduct }) {
  const { isSaved, toggleSaved } = useApp();
  const provider = providerById(product.providerId);
  const category = categoryById(product.category);
  const saved = isSaved(product.id);

  return (
    <div className="card group flex flex-col p-5 hover:-translate-y-0.5 hover:shadow-glow">
      <div className="mb-3 flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-brand-50 text-brand-700 dark:bg-ink-900 dark:text-brand-400">
            <Icon name={category?.icon ?? 'Circle'} className="h-5 w-5" />
          </span>
          <div className="min-w-0">
            <Link
              to={`/product/${product.id}`}
              className="block truncate font-semibold text-ink-900 hover:text-brand-700 dark:text-white dark:hover:text-brand-400"
            >
              {product.name}
            </Link>
            <p className="truncate text-xs text-ink-400">
              {provider?.name} · {product.country}
            </p>
          </div>
        </div>
        <button
          onClick={() => toggleSaved(product.id)}
          aria-label={saved ? 'Remove from saved' : 'Save product'}
          className="rounded-lg p-1.5 text-ink-300 transition hover:bg-ink-50 hover:text-brand-600 dark:hover:bg-ink-700"
        >
          <Bookmark className={`h-5 w-5 ${saved ? 'fill-brand-600 text-brand-600' : ''}`} />
        </button>
      </div>

      <p className="mb-3 line-clamp-2 text-sm text-ink-500 dark:text-ink-300">{product.summary}</p>

      <div className="mb-4 flex flex-wrap gap-1.5">
        {product.sponsored && (
          <span className="chip bg-gold/15 text-gold">
            <Sparkles className="h-3 w-3" /> Sponsored
          </span>
        )}
        {provider?.verified && (
          <span className="chip bg-brand-50 text-brand-700 dark:bg-brand-900/40 dark:text-brand-300">
            <BadgeCheck className="h-3 w-3" /> Verified
          </span>
        )}
        {product.flagged && (
          <span className="chip bg-danger/10 text-danger">
            <AlertTriangle className="h-3 w-3" /> Caution
          </span>
        )}
      </div>

      <div className="mt-auto flex items-end justify-between gap-3 border-t border-ink-100 pt-4 dark:border-ink-700">
        <div>
          <p className="font-display text-xl font-bold text-ink-900 dark:text-white">
            {formatRate(product.rate, product.rateLabel)}
          </p>
          {product.minAmount != null && (
            <p className="text-xs text-ink-400">
              from {formatMoney(product.minAmount, product.currency)}
              {product.maxAmount != null && ` · up to ${formatMoney(product.maxAmount, product.currency)}`}
            </p>
          )}
          <div className="mt-1.5">
            <StarRating value={product.rating} reviews={product.reviews} />
          </div>
        </div>
        {provider && <TrustBadge score={provider.trustScore} showScore={false} />}
      </div>

      <Link to={`/product/${product.id}`} className="btn-outline mt-4 w-full">
        View details
      </Link>
    </div>
  );
}

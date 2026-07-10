import { useState } from 'react';
import { X, GitCompare } from 'lucide-react';
import { productById } from '../data/products';
import { providerById } from '../data/providers';
import { formatMoney, formatRate } from '../lib/format';

export default function CompareTray({
  ids,
  onClear,
  onRemove,
}: {
  ids: string[];
  onClear: () => void;
  onRemove: (id: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const products = ids.map((id) => productById(id)).filter(Boolean);
  if (products.length === 0) return null;

  const rows: { label: string; get: (id: string) => string }[] = [
    { label: 'Provider', get: (id) => providerById(productById(id)!.providerId)?.name ?? '—' },
    { label: 'Country', get: (id) => productById(id)!.country },
    { label: 'Rate', get: (id) => formatRate(productById(id)!.rate, productById(id)!.rateLabel) },
    {
      label: 'Amount',
      get: (id) => {
        const p = productById(id)!;
        return p.minAmount != null ? `${formatMoney(p.minAmount, p.currency)} – ${p.maxAmount != null ? formatMoney(p.maxAmount, p.currency) : '∞'}` : '—';
      },
    },
    { label: 'Term', get: (id) => productById(id)!.termLabel },
    { label: 'Rating', get: (id) => `${productById(id)!.rating.toFixed(1)} ★` },
    { label: 'Trust score', get: (id) => `${providerById(productById(id)!.providerId)?.trustScore ?? '—'}/100` },
  ];

  return (
    <>
      <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-ink-100 bg-white/95 p-3 backdrop-blur dark:border-ink-700 dark:bg-ink-900/95">
        <div className="container-app flex items-center gap-3">
          <span className="flex items-center gap-2 text-sm font-semibold text-ink-800 dark:text-ink-100">
            <GitCompare className="h-4 w-4 text-brand-600" /> {products.length} selected
          </span>
          <div className="flex flex-1 flex-wrap gap-2">
            {products.map((p) => (
              <span key={p!.id} className="chip bg-ink-50 text-ink-700 dark:bg-ink-800 dark:text-ink-200">
                {p!.name}
                <button onClick={() => onRemove(p!.id)} aria-label="Remove"><X className="h-3 w-3" /></button>
              </span>
            ))}
          </div>
          <button onClick={onClear} className="btn-ghost">Clear</button>
          <button onClick={() => setOpen(true)} disabled={products.length < 2} className="btn-primary">
            Compare
          </button>
        </div>
      </div>

      {open && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-ink-900/60 p-4" onClick={() => setOpen(false)}>
          <div className="w-full max-w-3xl overflow-hidden rounded-2xl bg-white dark:bg-ink-800" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between border-b border-ink-100 p-4 dark:border-ink-700">
              <h3 className="font-display text-lg font-bold text-ink-900 dark:text-white">Side-by-side comparison</h3>
              <button onClick={() => setOpen(false)} className="btn-ghost !px-2"><X className="h-4 w-4" /></button>
            </div>
            <div className="overflow-x-auto p-4">
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr>
                    <th className="p-2 text-left text-ink-400"></th>
                    {products.map((p) => (
                      <th key={p!.id} className="p-2 text-left font-semibold text-ink-900 dark:text-white">{p!.name}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {rows.map((r) => (
                    <tr key={r.label} className="border-t border-ink-100 dark:border-ink-700">
                      <td className="p-2 font-medium text-ink-500 dark:text-ink-400">{r.label}</td>
                      {products.map((p) => (
                        <td key={p!.id} className="p-2 text-ink-800 dark:text-ink-100">{r.get(p!.id)}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

import { BadgeCheck } from 'lucide-react';
import { reviewsFor } from '../data/reviews';
import StarRating from './StarRating';

export default function Reviews({ productId, overall, count }: { productId: string; overall: number; count: number }) {
  const reviews = reviewsFor(productId, overall);

  // Rough star distribution derived from the overall score.
  const dist = [5, 4, 3, 2, 1].map((star) => {
    const closeness = Math.max(0, 1 - Math.abs(star - overall) / 2.2);
    return { star, pct: Math.round(closeness * 100) };
  });
  const maxPct = Math.max(...dist.map((d) => d.pct), 1);

  return (
    <div className="mt-10">
      <h3 className="section-title mb-4 !text-xl">Reviews & ratings</h3>
      <div className="grid gap-6 sm:grid-cols-[auto_1fr]">
        <div className="rounded-2xl border border-ink-100 p-6 text-center dark:border-ink-800">
          <p className="font-display text-5xl font-bold text-ink-900 dark:text-white">{overall.toFixed(1)}</p>
          <div className="mt-2 flex justify-center"><StarRating value={overall} /></div>
          <p className="mt-1 text-xs text-ink-400">{count.toLocaleString()} reviews</p>
        </div>
        <div className="flex flex-col justify-center gap-1.5">
          {dist.map((d) => (
            <div key={d.star} className="flex items-center gap-2 text-xs">
              <span className="w-3 text-ink-500 dark:text-ink-400">{d.star}</span>
              <div className="h-2 flex-1 overflow-hidden rounded-full bg-ink-100 dark:bg-ink-700">
                <div className="h-full rounded-full bg-gold" style={{ width: `${(d.pct / maxPct) * 100}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 space-y-4">
        {reviews.map((r, i) => (
          <div key={i} className="rounded-2xl border border-ink-100 p-5 dark:border-ink-800">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="grid h-10 w-10 place-items-center rounded-full bg-brand-50 font-semibold text-brand-700 dark:bg-ink-900 dark:text-brand-400">
                  {r.author.charAt(0)}
                </span>
                <div>
                  <p className="flex items-center gap-1.5 text-sm font-semibold text-ink-900 dark:text-white">
                    {r.author}
                    {r.verified && <BadgeCheck className="h-4 w-4 text-brand-600" aria-label="Verified purchase" />}
                  </p>
                  <p className="text-xs text-ink-400">{r.country} · {r.date}</p>
                </div>
              </div>
              <StarRating value={r.rating} />
            </div>
            <p className="mt-3 font-semibold text-ink-800 dark:text-ink-100">{r.title}</p>
            <p className="mt-1 text-sm text-ink-500 dark:text-ink-400">{r.body}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

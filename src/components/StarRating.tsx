import { Star } from 'lucide-react';

export default function StarRating({ value, reviews }: { value: number; reviews?: number }) {
  return (
    <div className="flex items-center gap-1.5">
      <div className="flex">
        {[0, 1, 2, 3, 4].map((i) => (
          <Star
            key={i}
            className={`h-3.5 w-3.5 ${
              i < Math.round(value)
                ? 'fill-gold text-gold'
                : 'text-ink-200 dark:text-ink-600'
            }`}
          />
        ))}
      </div>
      <span className="text-xs font-semibold text-ink-700 dark:text-ink-200">{value.toFixed(1)}</span>
      {reviews != null && (
        <span className="text-xs text-ink-400">({reviews.toLocaleString()})</span>
      )}
    </div>
  );
}

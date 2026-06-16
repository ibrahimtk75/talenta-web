import { useState } from 'react';
import { Star } from 'lucide-react';

export function Stars({ value, size = 14 }: { value: number; size?: number }) {
  const r = Math.round(value);
  return (
    <span className="inline-flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star key={i} size={size} className={i <= r ? 'text-amber' : 'text-white/20'} fill={i <= r ? '#FFB23C' : 'none'} />
      ))}
    </span>
  );
}

export function RateStars({ onRate }: { onRate?: (n: number) => void }) {
  const [hover, setHover] = useState(0);
  const [val, setVal] = useState(0);
  const show = hover || val;
  return (
    <span className="inline-flex items-center gap-1" onMouseLeave={() => setHover(0)}>
      {[1, 2, 3, 4, 5].map((i) => (
        <button key={i} type="button" onMouseEnter={() => setHover(i)} onClick={() => { setVal(i); onRate?.(i); }} className="transition-transform hover:scale-110">
          <Star size={22} className={i <= show ? 'text-amber' : 'text-white/25'} fill={i <= show ? '#FFB23C' : 'none'} />
        </button>
      ))}
    </span>
  );
}

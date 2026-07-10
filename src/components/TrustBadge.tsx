import { ShieldCheck, ShieldAlert, ShieldQuestion } from 'lucide-react';
import { trustBand } from '../lib/format';

export default function TrustBadge({ score, showScore = true }: { score: number; showScore?: boolean }) {
  const { label, tone } = trustBand(score);
  const map = {
    good: { cls: 'bg-brand-50 text-brand-700 dark:bg-brand-900/40 dark:text-brand-300', Icon: ShieldCheck },
    ok: { cls: 'bg-info/10 text-info dark:text-info', Icon: ShieldQuestion },
    bad: { cls: 'bg-danger/10 text-danger', Icon: ShieldAlert },
  }[tone];
  const { Icon } = map;
  return (
    <span className={`chip ${map.cls}`} title={`Provider trust score: ${score}/100`}>
      <Icon className="h-3.5 w-3.5" />
      {label}
      {showScore && <span className="opacity-70">· {score}</span>}
    </span>
  );
}

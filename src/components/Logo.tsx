import { Link } from 'react-router-dom';
import { Globe2 } from 'lucide-react';

export default function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <Link to="/" className="flex items-center gap-2 font-display font-bold text-ink-900 dark:text-white">
      <span className="grid h-9 w-9 place-items-center rounded-xl bg-brand-600 text-white shadow-glow">
        <Globe2 className="h-5 w-5" />
      </span>
      {!compact && (
        <span className="text-lg tracking-tight">
          Global<span className="text-brand-600 dark:text-brand-400">Fund</span>Connect
        </span>
      )}
    </Link>
  );
}

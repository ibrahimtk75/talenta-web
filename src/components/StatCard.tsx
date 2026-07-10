import Icon from './Icon';

export default function StatCard({
  icon,
  label,
  value,
  hint,
}: {
  icon: string;
  label: string;
  value: string;
  hint?: string;
}) {
  return (
    <div className="card p-5">
      <div className="flex items-center justify-between">
        <span className="grid h-10 w-10 place-items-center rounded-xl bg-brand-50 text-brand-700 dark:bg-ink-900 dark:text-brand-400">
          <Icon name={icon} className="h-5 w-5" />
        </span>
        {hint && <span className="text-xs font-semibold text-brand-600">{hint}</span>}
      </div>
      <p className="mt-4 font-display text-2xl font-bold text-ink-900 dark:text-white">{value}</p>
      <p className="text-sm text-ink-500 dark:text-ink-400">{label}</p>
    </div>
  );
}

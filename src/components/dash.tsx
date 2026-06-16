import { ReactNode } from 'react';
import { type LucideIcon } from 'lucide-react';

export function Kpi({ icon: Icon, n, l, trend }: { icon: LucideIcon; n: string; l: string; trend?: string }) {
  return (
    <div className="card p-5">
      <div className="flex items-center justify-between">
        <span className="grid h-9 w-9 place-items-center rounded-lg bg-primary/15 text-primary"><Icon size={17} /></span>
        {trend && <span className="text-[11px] font-bold text-emerald-400">{trend}</span>}
      </div>
      <div className="mt-3 font-display text-2xl font-bold">{n}</div>
      <div className="text-xs text-mute">{l}</div>
    </div>
  );
}

export function Panel({ title, action, children, className = '' }: { title: string; action?: ReactNode; children: ReactNode; className?: string }) {
  return (
    <div className={`card p-5 ${className}`}>
      <div className="mb-4 flex items-center justify-between gap-3">
        <h3 className="font-display text-base font-bold">{title}</h3>
        {action}
      </div>
      {children}
    </div>
  );
}

export function DashHeader({ title, subtitle, badge, children }: { title: string; subtitle: string; badge?: ReactNode; children?: ReactNode }) {
  return (
    <div className="card mb-6 flex flex-wrap items-center gap-4 p-6">
      <div className="min-w-[220px] flex-1">
        <h1 className="flex flex-wrap items-center gap-2 font-display text-2xl font-bold">{title} {badge}</h1>
        <p className="mt-1 text-sm text-mute">{subtitle}</p>
      </div>
      {children && <div className="flex flex-wrap gap-2">{children}</div>}
    </div>
  );
}

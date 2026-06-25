import { useEffect, useState } from 'react';
import { Plus, Trash2, Lock, ShieldCheck } from 'lucide-react';
import { apiEnabled, apiCreateLog, apiMyLogs, apiDeleteLog, type PlayerLog, type LogCategory } from '../api';
import { useSession } from '../session';

export const LOG_CATS: { key: LogCategory; label: string; emoji: string }[] = [
  { key: 'TRAINING', label: 'Training', emoji: '⚽' },
  { key: 'ROUTINE', label: 'Daily routine', emoji: '📅' },
  { key: 'GROWTH', label: 'Growth', emoji: '📈' },
  { key: 'FITNESS', label: 'Fitness', emoji: '💪' },
  { key: 'MILESTONE', label: 'Milestone', emoji: '🏆' },
  { key: 'HEALTH', label: 'Health', emoji: '❤️' },
];
const catOf = (k: string) => LOG_CATS.find((c) => c.key === k);
const fmtDate = (iso: string) => { try { return new Date(iso).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' }); } catch { return iso.slice(0, 10); } };

/** Read-only timeline — used on the player profile (club view) and the hub. */
export function JourneyTimeline({ logs, onDelete }: { logs: PlayerLog[]; onDelete?: (id: string) => void }) {
  if (!logs.length) return <p className="rounded-lg border border-dashed border-white/15 p-4 text-center text-[13px] text-mute">No journey entries yet.</p>;
  return (
    <div className="relative space-y-4 pl-6 before:absolute before:bottom-2 before:left-[7px] before:top-2 before:w-0.5 before:bg-white/12">
      {logs.map((l) => {
        const c = catOf(l.category);
        return (
          <div key={l.id} className="relative">
            <span className="absolute -left-[18px] top-1 grid h-4 w-4 place-items-center rounded-full bg-gradient-to-br from-primary to-primary-2 text-[8px]">{c?.emoji}</span>
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-semibold">{l.title}</span>
                  <span className="rounded-full border border-white/10 bg-white/[0.05] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-mute">{c?.label}</span>
                  {l.isPrivate && <span className="inline-flex items-center gap-1 text-[10px] text-mute"><Lock size={10} /> private</span>}
                </div>
                <div className="text-[12px] text-mute">{fmtDate(l.date)}</div>
                {l.note && <p className="mt-1 text-[13px] leading-relaxed text-slate-300">{l.note}</p>}
                {l.metrics && Object.keys(l.metrics).length > 0 && (
                  <div className="mt-1.5 flex flex-wrap gap-1.5">
                    {Object.entries(l.metrics).map(([k, v]) => (
                      <span key={k} className="rounded-md bg-white/[0.05] px-2 py-0.5 text-[11px] text-slate-300">{k}: <b>{v}</b></span>
                    ))}
                  </div>
                )}
              </div>
              {onDelete && <button onClick={() => onDelete(l.id)} aria-label="Delete entry" className="flex-shrink-0 text-mute hover:text-accent"><Trash2 size={14} /></button>}
            </div>
          </div>
        );
      })}
    </div>
  );
}

/** Player-side editor: add entries + view/delete own timeline. Used in the Hub. */
export function MyJourney() {
  const { token, toast } = useSession();
  const [logs, setLogs] = useState<PlayerLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);

  const [category, setCategory] = useState<LogCategory>('TRAINING');
  const [title, setTitle] = useState('');
  const [note, setNote] = useState('');
  const [date, setDate] = useState('');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [consent, setConsent] = useState(false);
  const [busy, setBusy] = useState(false);

  const load = () => {
    if (!apiEnabled || !token) { setLoading(false); return; }
    apiMyLogs(token).then(setLogs).catch(() => {}).finally(() => setLoading(false));
  };
  useEffect(load, [token]); // eslint-disable-line

  const isHealth = category === 'HEALTH';
  const showMetrics = category === 'GROWTH' || category === 'FITNESS';

  const add = async () => {
    if (!title.trim()) { toast('Add a short title'); return; }
    if (isHealth && !consent) { toast('Please confirm health-data consent'); return; }
    if (!apiEnabled || !token) { toast('Sign in to save your journey'); return; }
    const metrics: Record<string, number> = {};
    if (height.trim()) metrics['Height (cm)'] = Number(height) || 0;
    if (weight.trim()) metrics['Weight (kg)'] = Number(weight) || 0;
    setBusy(true);
    try {
      await apiCreateLog(token, {
        category, title: title.trim(), note: note.trim() || undefined,
        date: date ? new Date(date).toISOString() : undefined,
        metrics: Object.keys(metrics).length ? metrics : undefined,
        ...(isHealth ? { healthConsent: true } : {}),
      });
      setTitle(''); setNote(''); setDate(''); setHeight(''); setWeight(''); setConsent(false); setOpen(false);
      toast('Added to your journey ✅');
      setLoading(true); load();
    } catch (e) { toast((e as Error).message || 'Could not save'); }
    finally { setBusy(false); }
  };

  const del = async (id: string) => {
    if (!token) return;
    setLogs((a) => a.filter((l) => l.id !== id));
    try { await apiDeleteLog(token, id); } catch { load(); }
  };

  return (
    <div className="card p-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-lg font-bold">My journey</h2>
          <p className="text-[12.5px] text-mute">Your lifetime log — training, growth, milestones & more.</p>
        </div>
        <button onClick={() => setOpen((o) => !o)} className="btn-primary !px-3 !py-1.5 text-[12px]"><Plus size={13} /> Add</button>
      </div>

      {open && (
        <div className="mt-4 space-y-3 rounded-xl border border-white/10 bg-white/[0.02] p-4">
          <div className="flex flex-wrap gap-1.5">
            {LOG_CATS.map((c) => (
              <button key={c.key} onClick={() => setCategory(c.key)} className={`chip !py-1 !text-[12px] ${category === c.key ? 'chip-active' : ''}`}>{c.emoji} {c.label}</button>
            ))}
          </div>
          <input value={title} onChange={(e) => setTitle(e.target.value)} className="field-input" placeholder="Title — e.g. 90 min finishing session" maxLength={120} />
          <textarea value={note} onChange={(e) => setNote(e.target.value)} className="field-input" rows={2} placeholder="Notes (optional)" maxLength={2000} />
          <div className="grid gap-3 sm:grid-cols-2">
            <div><label className="field-label">Date</label><input value={date} onChange={(e) => setDate(e.target.value)} type="date" className="field-input" /></div>
            {showMetrics && (
              <div className="grid grid-cols-2 gap-3">
                <div><label className="field-label">Height (cm)</label><input value={height} onChange={(e) => setHeight(e.target.value)} type="number" className="field-input" placeholder="175" /></div>
                <div><label className="field-label">Weight (kg)</label><input value={weight} onChange={(e) => setWeight(e.target.value)} type="number" className="field-input" placeholder="68" /></div>
              </div>
            )}
          </div>
          {isHealth && (
            <div className="rounded-lg border border-accent/30 bg-accent/[0.06] p-3">
              <div className="flex items-center gap-1.5 text-[12px] font-semibold text-accent"><ShieldCheck size={14} /> Health data — kept private</div>
              <p className="mt-1 text-[12px] leading-relaxed text-mute">Health entries are stored privately (only you see them) and shared with a club only if you choose. Players under 18 need a parent/guardian's consent.</p>
              <label className="mt-2 flex items-start gap-2 text-[12.5px] text-slate-300">
                <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} className="mt-0.5 accent-primary" />
                I confirm I (or my parent/guardian, if under 18) consent to storing this health information.
              </label>
            </div>
          )}
          <div className="flex justify-end">
            <button onClick={add} disabled={busy} className="btn-primary text-[13px] disabled:opacity-60">{busy ? 'Saving…' : 'Save entry'}</button>
          </div>
        </div>
      )}

      <div className="mt-5">
        {loading ? <p className="text-[13px] text-mute">Loading…</p> : <JourneyTimeline logs={logs} onDelete={del} />}
      </div>
    </div>
  );
}

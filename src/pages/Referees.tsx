import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Flag, BadgeCheck } from 'lucide-react';
import { FLAG, initials } from '../data';
import { apiEnabled, fetchReferees, type Referee } from '../api';

const SPORT_LABEL: Record<string, string> = {
  FOOTBALL: 'Football', CRICKET: 'Cricket', BASKETBALL: 'Basketball',
  HOCKEY_FIELD: 'Hockey', HOCKEY_ICE: 'Ice Hockey', TENNIS: 'Tennis',
};

export default function Referees() {
  const [refs, setRefs] = useState<Referee[]>([]);
  const [loading, setLoading] = useState(apiEnabled);

  useEffect(() => {
    if (!apiEnabled) { setLoading(false); return; }
    let alive = true;
    fetchReferees().then((list) => { if (alive) { setRefs(list); setLoading(false); } }).catch(() => { if (alive) setLoading(false); });
    return () => { alive = false; };
  }, []);

  return (
    <div className="mx-auto max-w-5xl px-5 py-12">
      <div className="text-center">
        <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/[0.08] px-4 py-1.5 text-[12.5px] font-semibold text-primary"><Flag size={15} /> Referees</span>
        <h1 className="mt-4 font-display text-3xl font-bold md:text-4xl">Find a <span className="grad-text">referee</span></h1>
        <p className="mx-auto mt-2 max-w-xl text-mute">Qualified match officials for tournaments, leagues and academies. Connect for fixtures.</p>
      </div>

      {loading ? (
        <div className="mt-9 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{Array.from({ length: 6 }).map((_, i) => <div key={i} className="h-44 animate-pulse rounded-xl2 border border-white/10 bg-white/[0.03]" />)}</div>
      ) : refs.length === 0 ? (
        <div className="mt-10 rounded-xl2 border border-dashed border-white/15 p-10 text-center text-mute">
          No referees yet — be the first. <Link to="/signup" className="font-semibold text-primary">Register as a referee</Link> and get found by tournaments and clubs.
        </div>
      ) : (
        <div className="mt-9 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {refs.map((r) => (
            <div key={r.id} className="card p-6">
              <div className="flex items-center gap-3.5">
                <span className="grid h-12 w-12 flex-shrink-0 place-items-center rounded-xl bg-gradient-to-br from-primary to-primary-2 font-display font-bold text-white">{initials(r.name)}</span>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5 font-semibold"><span className="truncate">{r.name}</span> <span>{FLAG[r.country]}</span> {r.verified && <BadgeCheck size={14} className="text-sky" />}</div>
                  <div className="text-[12.5px] text-mute">{r.level ? `${r.level} level` : 'Referee'}{r.experienceYrs ? ` · ${r.experienceYrs} yrs` : ''}</div>
                </div>
              </div>
              {r.sports.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {r.sports.map((s) => <span key={s} className="rounded-full border border-white/10 bg-white/[0.05] px-2.5 py-0.5 text-[11px] text-mute">{SPORT_LABEL[s] || s}</span>)}
                </div>
              )}
              <div className="mt-4 flex items-center justify-between">
                <span className={`text-[12px] font-semibold ${r.available ? 'text-emerald-400' : 'text-mute'}`}>{r.available ? '● Available' : 'Unavailable'}</span>
                <a href="https://wa.me/919526137000" target="_blank" rel="noopener noreferrer" className="btn-ghost !px-3 !py-1.5 text-[12px]">Connect</a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

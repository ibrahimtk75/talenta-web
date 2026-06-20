import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Dumbbell, BadgeCheck } from 'lucide-react';
import { FLAG, initials } from '../data';
import { apiEnabled, fetchCoaches, type Coach } from '../api';

const SPORT_LABEL: Record<string, string> = {
  FOOTBALL: 'Football', CRICKET: 'Cricket', BASKETBALL: 'Basketball',
  HOCKEY_FIELD: 'Hockey', HOCKEY_ICE: 'Ice Hockey', TENNIS: 'Tennis',
};

export default function Coaches() {
  const [coaches, setCoaches] = useState<Coach[]>([]);
  const [loading, setLoading] = useState(apiEnabled);

  useEffect(() => {
    if (!apiEnabled) { setLoading(false); return; }
    let alive = true;
    fetchCoaches().then((list) => { if (alive) { setCoaches(list); setLoading(false); } }).catch(() => { if (alive) setLoading(false); });
    return () => { alive = false; };
  }, []);

  return (
    <div className="mx-auto max-w-5xl px-5 py-12">
      <div className="text-center">
        <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/[0.08] px-4 py-1.5 text-[12.5px] font-semibold text-primary"><Dumbbell size={15} /> Coaches</span>
        <h1 className="mt-4 font-display text-3xl font-bold md:text-4xl">Find a <span className="grad-text">coach</span></h1>
        <p className="mx-auto mt-2 max-w-xl text-mute">Certified coaches building the next generation of talent. Connect for training and guidance.</p>
      </div>

      {loading ? (
        <div className="mt-9 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{Array.from({ length: 6 }).map((_, i) => <div key={i} className="h-52 animate-pulse rounded-xl2 border border-white/10 bg-white/[0.03]" />)}</div>
      ) : coaches.length === 0 ? (
        <div className="mt-10 rounded-xl2 border border-dashed border-white/15 p-10 text-center text-mute">
          No coaches yet — be the first. <Link to="/signup" className="font-semibold text-primary">Register as a coach</Link> and get discovered by players and clubs.
        </div>
      ) : (
        <div className="mt-9 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {coaches.map((c) => (
            <div key={c.id} className="card p-6">
              <div className="flex items-center gap-3.5">
                <span className="grid h-12 w-12 flex-shrink-0 place-items-center rounded-xl bg-gradient-to-br from-primary to-primary-2 font-display font-bold text-white">{initials(c.name)}</span>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5 font-semibold"><span className="truncate">{c.name}</span> <span>{FLAG[c.country]}</span> {c.verified && <BadgeCheck size={14} className="text-sky" />}</div>
                  <div className="text-[12.5px] text-mute">{c.experienceYrs ? `${c.experienceYrs} yrs experience` : 'Coach'}</div>
                </div>
              </div>
              {c.sports.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {c.sports.map((s) => <span key={s} className="rounded-full border border-white/10 bg-white/[0.05] px-2.5 py-0.5 text-[11px] text-mute">{SPORT_LABEL[s] || s}</span>)}
                </div>
              )}
              {c.certifications && <div className="mt-3 text-[12.5px] text-slate-300">📜 {c.certifications}</div>}
              {c.bio && <p className="mt-2 line-clamp-3 text-[13px] leading-relaxed text-mute">{c.bio}</p>}
              <div className="mt-4 flex items-center justify-between">
                {c.hourlyRate ? <span className="font-display font-bold grad-text">₹{c.hourlyRate}<span className="text-[11px] text-mute">/hr</span></span> : <span />}
                <a href="https://wa.me/919526137000" target="_blank" rel="noopener noreferrer" className="btn-ghost !px-3 !py-1.5 text-[12px]">Connect</a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

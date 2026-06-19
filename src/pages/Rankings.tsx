import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Trophy, BadgeCheck } from 'lucide-react';
import { FLAG, initials } from '../data';
import { usePlayers } from '../usePlayers';

const TABS = ['players', 'clubs', 'academies', 'schools', 'universities'] as const;
const LABEL: Record<string, string> = {
  players: 'Players', clubs: 'Clubs', academies: 'Academies', schools: 'Schools', universities: 'Universities',
};
const ORG_CRITERIA: Record<string, string> = {
  clubs: 'Clubs are ranked by players signed and talent developed.',
  academies: 'Academies are ranked by athletes showcased and players placed.',
  schools: 'Schools are ranked by players developed and trials secured.',
  universities: 'Universities are ranked by athletes recruited and scholarships offered.',
};

function RankBadge({ n }: { n: number }) {
  const medal = ['from-amber-300 to-yellow-500 text-black', 'from-slate-200 to-slate-400 text-black', 'from-orange-400 to-amber-700 text-white'];
  if (n <= 3) return <span className={`grid h-9 w-9 flex-shrink-0 place-items-center rounded-full bg-gradient-to-br ${medal[n - 1]} font-display text-sm font-extrabold shadow`}>{n}</span>;
  return <span className="grid h-9 w-9 flex-shrink-0 place-items-center rounded-full border border-white/15 font-display text-sm font-bold text-mute">{n}</span>;
}

export default function Rankings() {
  const [tab, setTab] = useState<string>('players');
  const { players, loading } = usePlayers();
  const ranked = [...players].sort((a, b) => b.match - a.match);

  return (
    <div className="mx-auto max-w-4xl px-5 py-12">
      <div className="text-center">
        <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/[0.08] px-4 py-1.5 text-[12.5px] font-semibold text-primary"><Trophy size={15} /> Talenta Rankings</span>
        <h1 className="mt-4 font-display text-3xl font-bold md:text-4xl">The best on <span className="grad-text">Talenta</span></h1>
        <p className="mx-auto mt-2 max-w-xl text-mute">Ranked by Talent Score — built from career stats, verification and activity. The board updates as talent grows.</p>
      </div>

      {/* tabs */}
      <div className="mt-7 flex flex-wrap justify-center gap-2">
        {TABS.map((t) => <button key={t} onClick={() => setTab(t)} className={`chip ${tab === t ? 'chip-active' : ''}`}>{LABEL[t]}</button>)}
      </div>

      {tab === 'players' ? (
        loading ? (
          <div className="mt-7 space-y-2.5">{Array.from({ length: 6 }).map((_, i) => <div key={i} className="h-[68px] animate-pulse rounded-xl border border-white/10 bg-white/[0.03]" />)}</div>
        ) : ranked.length === 0 ? (
          <div className="mt-8 rounded-xl2 border border-dashed border-white/15 p-10 text-center text-mute">
            <Trophy size={28} className="mx-auto mb-3 text-primary/60" />
            No players ranked yet. Be the first to join and top the leaderboard.
            <div className="mt-5"><Link to="/signup" className="btn-primary text-[13px]">Join Free as Player</Link></div>
          </div>
        ) : (
          <ol className="mt-7 space-y-2.5">
            {ranked.map((p, i) => (
              <li key={p.id}>
                <Link to={`/player/${p.id}`} className={`flex items-center gap-3.5 rounded-xl border p-3.5 transition hover:border-primary/50 ${i < 3 ? 'border-primary/40 bg-primary/[0.05]' : 'border-white/10 bg-white/[0.02]'}`}>
                  <RankBadge n={i + 1} />
                  <span className="grid h-11 w-11 flex-shrink-0 place-items-center rounded-xl bg-gradient-to-br from-primary to-primary-2 font-display font-bold text-white">{initials(p.name)}</span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5 font-semibold">
                      <span className="truncate">{p.name}</span> <span>{FLAG[p.country]}</span>
                      {p.verified && <BadgeCheck size={14} className="text-sky" />}
                      {p.pro && <span className="rounded bg-gradient-to-r from-primary to-primary-2 px-1.5 py-0.5 text-[9px] font-extrabold text-white">PRO</span>}
                    </div>
                    <div className="truncate text-[12.5px] text-mute">{p.pos}{p.headline ? ` · ${p.headline}` : ''}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-display text-xl font-bold grad-text">{p.match}</div>
                    <div className="text-[10px] uppercase tracking-wide text-mute">Score</div>
                  </div>
                </Link>
              </li>
            ))}
          </ol>
        )
      ) : (
        <div className="mt-8 rounded-xl2 border border-dashed border-white/15 p-10 text-center text-mute">
          <Trophy size={28} className="mx-auto mb-3 text-primary/60" />
          <p className="mx-auto max-w-md">
            <b className="text-slate-200">{LABEL[tab]} rankings open soon.</b><br />
            {ORG_CRITERIA[tab]} As {LABEL[tab].toLowerCase()} join Talenta and start signing talent, the leaderboard goes live — be the first to climb it.
          </p>
          <div className="mt-5"><Link to="/signup" className="btn-primary text-[13px]">Register your {LABEL[tab].toLowerCase().replace(/s$/, '')}</Link></div>
        </div>
      )}
    </div>
  );
}

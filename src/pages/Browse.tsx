import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, X } from 'lucide-react';
import { POSITIONS, COUNTRY_NAME, SKILL_LEVELS } from '../data';
import { PlayerGridCard } from '../components/PlayerCard';
import { usePlayers } from '../usePlayers';
import { useSEO } from '../useSEO';

const CATS: [string, string][] = [
  ['players', 'Players'], ['clubs', 'Clubs'], ['academies', 'Academies'], ['universities', 'Universities'], ['schools', 'Schools'],
];

export default function Browse() {
  const [sp, setSp] = useSearchParams();
  const cat = CATS.some(([k]) => k === sp.get('cat')) ? sp.get('cat')! : 'players';
  const [pos, setPos] = useState('All Positions');
  const [q, setQ] = useState('');
  const [country, setCountry] = useState('All');
  const [skill, setSkill] = useState('All');

  useSEO({
    title: 'Discover football talent — players, clubs & academies | Talenta',
    description: 'Browse and search verified footballers, clubs, academies, schools and universities on Talenta. Filter by position, country and skill level.',
  });

  const { players: all, loading } = usePlayers();
  const isPlayers = cat === 'players';
  const countryCodes = Array.from(new Set(all.map((p) => p.country))).sort();
  const ql = q.trim().toLowerCase();

  let players = all;
  if (pos !== 'All Positions') players = players.filter((p) => p.pos === pos);
  if (country !== 'All') players = players.filter((p) => p.country === country);
  if (skill !== 'All') players = players.filter((p) => p.skillLevel === skill);
  if (ql) players = players.filter((p) => p.name.toLowerCase().includes(ql) || p.pos.toLowerCase().includes(ql));

  const count = isPlayers ? players.length : 0;
  const label = CATS.find(([k]) => k === cat)![1];
  const switchCat = (k: string) => { setSp(k === 'players' ? {} : { cat: k }); setQ(''); setCountry('All'); setPos('All Positions'); setSkill('All'); };

  return (
    <div className="mx-auto max-w-6xl px-5 py-12">
      <h1 className="font-display text-2xl font-bold md:text-3xl">Discover {label.toLowerCase()}</h1>
      <p className="mt-1 text-sm text-mute">
        {isPlayers ? (loading ? 'Loading players…' : `${count} ${count === 1 ? 'result' : 'results'} on Talenta`) : 'Organisations directory'}
      </p>

      {/* category tabs */}
      <div className="mt-5 flex flex-wrap gap-2.5">
        {CATS.map(([k, lab]) => <button key={k} onClick={() => switchCat(k)} className={`chip ${cat === k ? 'chip-active' : ''}`}>{lab}</button>)}
      </div>

      {isPlayers ? (
        <>
          {/* search + country */}
          <div className="mt-4 flex flex-wrap gap-3">
            <div className="relative min-w-[240px] flex-1">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-mute" />
              <input value={q} onChange={(e) => setQ(e.target.value)} className="field-input !pl-10 !pr-9"
                placeholder="Search players by name or position…" />
              {q && <button onClick={() => setQ('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-mute hover:text-white"><X size={15} /></button>}
            </div>
            <select value={country} onChange={(e) => setCountry(e.target.value)} className="field-input w-auto min-w-[180px]">
              <option value="All">🌍 All countries</option>
              {countryCodes.map((c) => <option key={c} value={c}>{COUNTRY_NAME[c] || c}</option>)}
            </select>
            <select value={skill} onChange={(e) => setSkill(e.target.value)} className="field-input w-auto min-w-[160px]">
              <option value="All">⭐ All skill levels</option>
              {SKILL_LEVELS.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          {/* position chips */}
          <div className="mt-3 flex flex-wrap gap-2">
            {POSITIONS.map((p) => <button key={p} onClick={() => setPos(p)} className={`chip !py-1.5 !text-[12px] ${pos === p ? 'chip-active' : ''}`}>{p}</button>)}
          </div>

          {/* results */}
          {loading ? (
            <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => <div key={i} className="h-64 animate-pulse rounded-xl2 border border-white/10 bg-white/[0.03]" />)}
            </div>
          ) : count === 0 ? (
            <div className="mt-10 rounded-xl2 border border-dashed border-white/15 p-10 text-center text-mute">
              {all.length === 0
                ? 'No players have joined yet. Be the first — create your free profile and get discovered.'
                : 'No players match your filters. Try clearing the search, country or skill level.'}
            </div>
          ) : (
            <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{players.map((p) => <PlayerGridCard key={p.id} player={p} />)}</div>
          )}
        </>
      ) : (
        <div className="mt-10 rounded-xl2 border border-dashed border-white/15 p-10 text-center text-mute">
          We're onboarding {label.toLowerCase()} now. Public {label.toLowerCase()} listings are coming soon — meanwhile, discover players or join Talenta to register your organisation.
        </div>
      )}
    </div>
  );
}

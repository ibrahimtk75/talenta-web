import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, X } from 'lucide-react';
import { PLAYERS, POSITIONS, ORGS, COUNTRY_NAME } from '../data';
import { PlayerGridCard } from '../components/PlayerCard';
import OrgCard from '../components/OrgCard';

const CATS: [string, string][] = [
  ['players', 'Players'], ['clubs', 'Clubs'], ['academies', 'Academies'], ['universities', 'Universities'], ['schools', 'Schools'],
];
const ORG_TYPE: Record<string, string> = { clubs: 'Club', academies: 'Academy', universities: 'University', schools: 'School' };

export default function Browse() {
  const [sp, setSp] = useSearchParams();
  const cat = CATS.some(([k]) => k === sp.get('cat')) ? sp.get('cat')! : 'players';
  const [pos, setPos] = useState('All Positions');
  const [q, setQ] = useState('');
  const [country, setCountry] = useState('All');

  const isPlayers = cat === 'players';
  const countryCodes = Array.from(new Set([...PLAYERS.map((p) => p.country), ...ORGS.map((o) => o.country)])).sort();
  const ql = q.trim().toLowerCase();

  let players = PLAYERS;
  if (pos !== 'All Positions') players = players.filter((p) => p.pos === pos);
  if (country !== 'All') players = players.filter((p) => p.country === country);
  if (ql) players = players.filter((p) => p.name.toLowerCase().includes(ql) || p.pos.toLowerCase().includes(ql));

  let orgs = isPlayers ? [] : ORGS.filter((o) => o.type.includes(ORG_TYPE[cat]));
  if (country !== 'All') orgs = orgs.filter((o) => o.country === country);
  if (ql) orgs = orgs.filter((o) => o.name.toLowerCase().includes(ql));

  const count = isPlayers ? players.length : orgs.length;
  const label = CATS.find(([k]) => k === cat)![1];
  const switchCat = (k: string) => { setSp(k === 'players' ? {} : { cat: k }); setQ(''); setCountry('All'); setPos('All Positions'); };

  return (
    <div className="mx-auto max-w-6xl px-5 py-12">
      <h1 className="font-display text-2xl font-bold md:text-3xl">Discover {label.toLowerCase()}</h1>
      <p className="mt-1 text-sm text-mute">{count} {count === 1 ? 'result' : 'results'} on Talenta</p>

      {/* category tabs */}
      <div className="mt-5 flex flex-wrap gap-2.5">
        {CATS.map(([k, lab]) => <button key={k} onClick={() => switchCat(k)} className={`chip ${cat === k ? 'chip-active' : ''}`}>{lab}</button>)}
      </div>

      {/* search + country */}
      <div className="mt-4 flex flex-wrap gap-3">
        <div className="relative min-w-[240px] flex-1">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-mute" />
          <input value={q} onChange={(e) => setQ(e.target.value)} className="field-input !pl-10 !pr-9"
            placeholder={isPlayers ? 'Search players by name or position…' : `Search ${label.toLowerCase()} by name…`} />
          {q && <button onClick={() => setQ('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-mute hover:text-white"><X size={15} /></button>}
        </div>
        <select value={country} onChange={(e) => setCountry(e.target.value)} className="field-input w-auto min-w-[180px]">
          <option value="All">🌍 All countries</option>
          {countryCodes.map((c) => <option key={c} value={c}>{COUNTRY_NAME[c] || c}</option>)}
        </select>
      </div>

      {/* position chips (players) */}
      {isPlayers && (
        <div className="mt-3 flex flex-wrap gap-2">
          {POSITIONS.map((p) => <button key={p} onClick={() => setPos(p)} className={`chip !py-1.5 !text-[12px] ${pos === p ? 'chip-active' : ''}`}>{p}</button>)}
        </div>
      )}

      {/* results */}
      {count === 0 ? (
        <div className="mt-10 rounded-xl2 border border-dashed border-white/15 p-10 text-center text-mute">
          No {label.toLowerCase()} match your filters. Try clearing the search or country.
        </div>
      ) : isPlayers ? (
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{players.map((p) => <PlayerGridCard key={p.id} player={p} />)}</div>
      ) : (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{orgs.map((o) => <OrgCard key={o.name} o={o} />)}</div>
      )}
    </div>
  );
}

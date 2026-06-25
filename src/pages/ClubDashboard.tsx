import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MessageSquare, Eye, Bookmark, Handshake, Send } from 'lucide-react';
import { PLAYERS, POSITIONS, initials, COUNTRY_NAME } from '../data';
import { PlayerRow } from '../components/PlayerCard';
import { Kpi, Panel, DashHeader } from '../components/dash';
import { useSession } from '../session';

export default function ClubDashboard() {
  const [filter, setFilter] = useState('All Positions');
  const [q, setQ] = useState('');
  const [country, setCountry] = useState('Any');
  const nav = useNavigate();
  const { role, profile } = useSession();
  const orgName = profile.name || (role === 'academy' ? 'Your Academy' : 'Your Club');
  const orgMeta = [profile.type || (role === 'academy' ? 'Academy' : 'Club'), profile.country].filter(Boolean).join(' · ');
  const codes = Array.from(new Set(PLAYERS.map((p) => p.country))).sort();
  const ql = q.trim().toLowerCase();
  let list = PLAYERS.slice();
  if (filter !== 'All Positions') list = list.filter((p) => p.pos === filter);
  if (country !== 'Any') list = list.filter((p) => p.country === country);
  if (ql) list = list.filter((p) => p.name.toLowerCase().includes(ql) || p.pos.toLowerCase().includes(ql));
  list = list.sort((a, b) => b.match - a.match);

  const pipeline: [string, typeof PLAYERS][] = [
    ['Contacted', []],
    ['On trial', []],
    ['Signed', []],
  ];

  return (
    <div className="mx-auto max-w-6xl px-5 py-10">
      <DashHeader title={orgName} subtitle={orgMeta}
        badge={<span className="rounded-full border border-white/10 bg-white/[0.05] px-2.5 py-0.5 text-[11px] font-semibold text-slate-200">Club · Pro</span>}>
        <button className="btn-ghost text-[13px]" onClick={() => nav('/messages')}><MessageSquare size={15} /> Messages</button>
        <button className="btn-primary text-[13px]" onClick={() => nav('/browse')}><Search size={15} /> Search talent</button>
      </DashHeader>

      {/* KPIs */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <Kpi icon={Eye} n="0" l="Players viewed" />
        <Kpi icon={Bookmark} n="0" l="Shortlisted" />
        <Kpi icon={Send} n="0" l="Contacted" />
        <Kpi icon={Handshake} n="0" l="Deals closed" />
      </div>

      {/* AI suggestions + shortlist */}
      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_300px]">
        <div>
          <div className="mb-3.5 flex items-center gap-2"><Search size={18} className="text-primary" /><b className="font-display">Browse players</b></div>
          <div className="mb-4 flex flex-wrap gap-2">
            {POSITIONS.map((p) => <button key={p} onClick={() => setFilter(p)} className={`chip !py-1.5 !text-[12px] ${filter === p ? 'chip-active' : ''}`}>{p}</button>)}
          </div>
          {list.length ? (
            <div className="grid gap-4 sm:grid-cols-2">{list.map((p) => <PlayerRow key={p.id} player={p} />)}</div>
          ) : (
            <div className="rounded-xl2 border border-dashed border-white/15 p-8 text-center text-mute">No players match your search & filters.</div>
          )}
        </div>

        <div className="space-y-6">
          <Panel title="Search filters">
            <div className="space-y-3.5">
              <div><label className="field-label">Search</label><div className="relative"><Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-mute" /><input value={q} onChange={(e) => setQ(e.target.value)} className="field-input !pl-9" placeholder="Name, position..." /></div></div>
              <div><label className="field-label">Age range</label><select className="field-input"><option>Any</option><option>16–18</option><option>18–21</option><option>21–24</option></select></div>
              <div><label className="field-label">Country</label><select value={country} onChange={(e) => setCountry(e.target.value)} className="field-input"><option value="Any">Any</option>{codes.map((c) => <option key={c} value={c}>{COUNTRY_NAME[c] || c}</option>)}</select></div>
              <div><label className="field-label">Verified only</label><select className="field-input"><option>No</option><option>Yes</option></select></div>
            </div>
          </Panel>
          <Panel title="Shortlist" action={<Bookmark size={16} className="text-primary" />}>
            <p className="rounded-lg border border-dashed border-white/15 p-4 text-center text-[12.5px] text-mute">No players shortlisted yet. Save players from search to build your shortlist.</p>
          </Panel>
        </div>
      </div>

      {/* Deals pipeline */}
      <h2 className="mb-1 mt-12 flex items-center gap-2 font-display text-xl font-bold"><Handshake size={18} className="text-primary" /> Deals pipeline</h2>
      <p className="mb-5 text-sm text-mute">Track players from first contact to signed · 3% commission on signings</p>
      <div className="grid gap-4 md:grid-cols-3">
        {pipeline.map(([stage, players]) => (
          <div key={stage} className="card p-4">
            <div className="mb-3 flex items-center justify-between"><span className="text-[13px] font-bold uppercase tracking-wide text-mute">{stage}</span><span className="rounded-full bg-white/[0.06] px-2 py-0.5 text-[11px] font-bold">{players.length}</span></div>
            <div className="space-y-2.5">
              {players.map((p) => (
                <button key={p.id} onClick={() => nav(`/player/${p.id}`)} className="flex w-full items-center gap-2.5 rounded-lg border border-white/10 bg-white/[0.03] p-2.5 text-left hover:border-primary/50">
                  <span className="grid h-8 w-8 flex-shrink-0 place-items-center rounded-lg bg-gradient-to-br from-primary to-primary-2 text-[12px] font-bold text-white">{initials(p.name)}</span>
                  <span className="min-w-0"><span className="block truncate text-[13px] font-semibold">{p.name}</span><span className="block text-[11px] text-mute">{p.pos}</span></span>
                </button>
              ))}
              <button onClick={() => nav('/browse')} className="w-full rounded-lg border border-dashed border-white/15 py-2 text-[12px] text-mute hover:border-primary hover:text-white">+ Find players</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Search, MessageSquare, Users, Eye, Bookmark, Handshake, Send } from 'lucide-react';
import { PLAYERS, POSITIONS, ORGS, FLAG, initials, COUNTRY_NAME } from '../data';
import { PlayerRow } from '../components/PlayerCard';
import OrgCard from '../components/OrgCard';
import { Kpi, Panel, DashHeader } from '../components/dash';
import { useSession } from '../session';

export default function ClubDashboard() {
  const [filter, setFilter] = useState('All Positions');
  const [q, setQ] = useState('');
  const [country, setCountry] = useState('Any');
  const nav = useNavigate();
  const { role, profile, toast } = useSession();
  const orgName = profile.name || (role === 'academy' ? 'Demo Academy' : 'Demo FC');
  const orgMeta = [profile.type || 'Professional Club', profile.country].filter(Boolean).join(' · ') || 'Professional Club · United Kingdom 🇬🇧';
  const codes = Array.from(new Set(PLAYERS.map((p) => p.country))).sort();
  const ql = q.trim().toLowerCase();
  let list = PLAYERS.slice();
  if (filter !== 'All Positions') list = list.filter((p) => p.pos === filter);
  if (country !== 'Any') list = list.filter((p) => p.country === country);
  if (ql) list = list.filter((p) => p.name.toLowerCase().includes(ql) || p.pos.toLowerCase().includes(ql));
  list = list.sort((a, b) => b.match - a.match);

  const shortlist = PLAYERS.slice(0, 3);
  const pipeline: [string, typeof PLAYERS][] = [
    ['Contacted', PLAYERS.slice(0, 2)],
    ['On trial', PLAYERS.slice(2, 3)],
    ['Signed', PLAYERS.slice(3, 4)],
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
        <Kpi icon={Eye} n="312" l="Players viewed" trend="+24" />
        <Kpi icon={Bookmark} n="18" l="Shortlisted" />
        <Kpi icon={Send} n="9" l="Contacted" trend="+3" />
        <Kpi icon={Handshake} n="2" l="Deals closed" />
      </div>

      {/* AI suggestions + shortlist */}
      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_300px]">
        <div>
          <div className="mb-3.5 flex items-center gap-2"><Sparkles size={18} className="text-primary" /><b className="font-display">AI suggestions for you</b></div>
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
            <div className="space-y-2.5">
              {shortlist.map((p) => (
                <button key={p.id} onClick={() => nav(`/player/${p.id}`)} className="flex w-full items-center gap-2.5 rounded-lg border border-white/10 bg-white/[0.03] p-2.5 text-left hover:border-primary/50">
                  <span className="grid h-8 w-8 flex-shrink-0 place-items-center rounded-lg bg-gradient-to-br from-primary to-primary-2 text-[12px] font-bold text-white">{initials(p.name)}</span>
                  <span className="min-w-0 flex-1"><span className="block truncate text-[13px] font-semibold">{p.name} {FLAG[p.country]}</span><span className="block text-[11px] text-mute">{p.pos} · {p.match}% match</span></span>
                </button>
              ))}
            </div>
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
              <button onClick={() => toast('Add player to pipeline')} className="w-full rounded-lg border border-dashed border-white/15 py-2 text-[12px] text-mute hover:border-primary hover:text-white">+ Add</button>
            </div>
          </div>
        ))}
      </div>

      {/* Registered clubs */}
      <h2 className="mb-1 mt-12 flex items-center gap-2 font-display text-xl font-bold"><Users size={18} className="text-primary" /> Registered clubs & academies</h2>
      <p className="mb-5 text-sm text-mute">{ORGS.length} organisations on Talenta · connect & network</p>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{ORGS.map((o) => <OrgCard key={o.name} o={o} />)}</div>
    </div>
  );
}

import { useNavigate } from 'react-router-dom';
import { Users, GraduationCap, Eye, Trophy, Plus, Search, UserPlus, BadgeCheck, Sparkles } from 'lucide-react';
import { PLAYERS, ORGS, FLAG, initials } from '../data';
import { Kpi, Panel, DashHeader } from '../components/dash';
import OrgCard from '../components/OrgCard';
import { useSession } from '../session';

export default function AcademyDashboard() {
  const nav = useNavigate();
  const { profile, toast } = useSession();
  const orgName = profile.name || 'City Football Academy';
  const orgMeta = [profile.type || 'Academy', profile.country].filter(Boolean).join(' · ') || 'Academy · United Kingdom 🇬🇧';
  const roster = PLAYERS; // our showcased athletes
  const applications = [
    ['Yusuf Khan', 'Midfielder · 17', 'Wants to join'],
    ['Marco Rossi', 'Winger · 16', 'Wants to join'],
    ['Ade Bello', 'Striker · 18', 'Wants to join'],
  ];

  return (
    <div className="mx-auto max-w-6xl px-5 py-10">
      <DashHeader title={orgName} subtitle={orgMeta}
        badge={<span className="rounded-full border border-white/10 bg-white/[0.05] px-2.5 py-0.5 text-[11px] font-semibold text-slate-200">Academy · Verified ✔</span>}>
        <button className="btn-primary text-[13px]" onClick={() => toast('Add athlete')}><UserPlus size={15} /> Add athlete</button>
        <button className="btn-ghost text-[13px]" onClick={() => nav('/browse')}><Search size={15} /> Discover talent</button>
      </DashHeader>

      {/* KPIs */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <Kpi icon={Users} n="120" l="Our athletes" />
        <Kpi icon={GraduationCap} n="86" l="Showcased" trend="+12" />
        <Kpi icon={Eye} n="4,210" l="Profile views" trend="+31%" />
        <Kpi icon={Trophy} n="14" l="Placements" trend="+2" />
      </div>

      {/* roster + applications */}
      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_300px]">
        <div>
          <div className="mb-3.5 flex items-center justify-between">
            <div className="flex items-center gap-2"><Users size={18} className="text-primary" /><b className="font-display">Our athletes</b></div>
            <button className="text-[12.5px] font-semibold text-primary" onClick={() => toast('Manage roster')}>Manage</button>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {roster.map((p) => (
              <button key={p.id} onClick={() => nav(`/player/${p.id}`)} className="card group p-4 text-left transition hover:-translate-y-1 hover:border-primary/50">
                <div className="flex items-center gap-3">
                  <span className="grid h-11 w-11 flex-shrink-0 place-items-center rounded-xl bg-gradient-to-br from-primary to-primary-2 font-display font-bold text-white">{initials(p.name)}</span>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1 font-semibold leading-tight"><span className="truncate">{p.name}</span> {p.verified && <BadgeCheck size={13} className="text-sky" />}</div>
                    <div className="text-[12px] text-mute">{p.pos} · Age {p.age} {FLAG[p.country]}</div>
                  </div>
                </div>
                <div className="mt-3 grad-text text-[13px] font-bold">{p.headline}</div>
              </button>
            ))}
            <button onClick={() => toast('Add athlete')} className="flex flex-col items-center justify-center gap-1.5 rounded-xl2 border border-dashed border-white/15 bg-white/[0.03] p-6 text-mute transition hover:border-primary hover:text-white">
              <Plus size={24} /> <span className="text-[12.5px] font-semibold">Add athlete</span>
            </button>
          </div>
        </div>

        <div className="space-y-6">
          <Panel title="Join requests" action={<span className="rounded-full bg-primary/15 px-2 py-0.5 text-[11px] font-bold text-primary">{applications.length}</span>}>
            <div className="space-y-2.5">
              {applications.map((a, i) => (
                <div key={i} className="rounded-lg border border-white/10 bg-white/[0.03] p-3">
                  <div className="text-[13px] font-semibold">{a[0]}</div>
                  <div className="text-[11.5px] text-mute">{a[1]}</div>
                  <div className="mt-2 flex gap-2">
                    <button className="btn-primary !px-2.5 !py-1 text-[11px]" onClick={() => toast(`Accepted ${a[0]} ✅`)}>Accept</button>
                    <button className="btn-ghost !px-2.5 !py-1 text-[11px]" onClick={() => toast('Declined')}>Decline</button>
                  </div>
                </div>
              ))}
            </div>
          </Panel>
          <Panel title="Recommended for you" action={<Sparkles size={16} className="text-primary" />}>
            <div className="space-y-2.5">
              {PLAYERS.slice(0, 3).map((p) => (
                <button key={p.id} onClick={() => nav(`/player/${p.id}`)} className="flex w-full items-center gap-2.5 rounded-lg border border-white/10 bg-white/[0.03] p-2.5 text-left hover:border-primary/50">
                  <span className="grid h-8 w-8 flex-shrink-0 place-items-center rounded-lg bg-gradient-to-br from-primary to-primary-2 text-[12px] font-bold text-white">{initials(p.name)}</span>
                  <span className="min-w-0 flex-1"><span className="block truncate text-[13px] font-semibold">{p.name}</span><span className="block text-[11px] text-mute">{p.pos} · {p.match}% match</span></span>
                </button>
              ))}
            </div>
          </Panel>
        </div>
      </div>

      {/* network */}
      <h2 className="mb-1 mt-12 flex items-center gap-2 font-display text-xl font-bold"><Users size={18} className="text-primary" /> Clubs & academies network</h2>
      <p className="mb-5 text-sm text-mute">{ORGS.length} organisations on Talenta · connect & collaborate</p>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{ORGS.map((o) => <OrgCard key={o.name} o={o} />)}</div>
    </div>
  );
}

import { useNavigate } from 'react-router-dom';
import { Users, GraduationCap, Eye, Trophy, Plus, Search, UserPlus } from 'lucide-react';
import { Kpi, Panel, DashHeader } from '../components/dash';
import { useSession } from '../session';

export default function AcademyDashboard() {
  const nav = useNavigate();
  const { profile, toast } = useSession();
  const orgName = profile.name || 'Your Academy';
  const orgMeta = [profile.type || 'Academy', profile.country].filter(Boolean).join(' · ');

  return (
    <div className="mx-auto max-w-6xl px-5 py-10">
      <DashHeader title={orgName} subtitle={orgMeta}
        badge={<span className="rounded-full border border-white/10 bg-white/[0.05] px-2.5 py-0.5 text-[11px] font-semibold text-slate-200">Academy</span>}>
        <button className="btn-primary text-[13px]" onClick={() => toast('Add athlete')}><UserPlus size={15} /> Add athlete</button>
        <button className="btn-ghost text-[13px]" onClick={() => nav('/browse')}><Search size={15} /> Discover talent</button>
      </DashHeader>

      {/* KPIs */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <Kpi icon={Users} n="0" l="Our athletes" />
        <Kpi icon={GraduationCap} n="0" l="Showcased" />
        <Kpi icon={Eye} n="0" l="Profile views" />
        <Kpi icon={Trophy} n="0" l="Placements" />
      </div>

      {/* roster + applications */}
      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_300px]">
        <div>
          <div className="mb-3.5 flex items-center justify-between">
            <div className="flex items-center gap-2"><Users size={18} className="text-primary" /><b className="font-display">Our athletes</b></div>
            <button className="text-[12.5px] font-semibold text-primary" onClick={() => toast('Manage roster')}>Manage</button>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <button onClick={() => toast('Add athlete')} className="flex flex-col items-center justify-center gap-1.5 rounded-xl2 border border-dashed border-white/15 bg-white/[0.03] p-6 text-mute transition hover:border-primary hover:text-white">
              <Plus size={24} /> <span className="text-[12.5px] font-semibold">Add your first athlete</span>
            </button>
          </div>
          <p className="mt-3 text-[12.5px] text-mute">You haven't added any athletes yet. Add your players to showcase your academy's talent to clubs and scouts worldwide.</p>
        </div>

        <div className="space-y-6">
          <Panel title="Join requests">
            <p className="rounded-lg border border-dashed border-white/15 p-4 text-center text-[12.5px] text-mute">No join requests yet. Players who apply to join your academy will appear here.</p>
          </Panel>
          <Panel title="Discover talent">
            <p className="text-[12.5px] text-mute">Browse footballers looking for an academy and invite them to join yours.</p>
            <button onClick={() => nav('/browse')} className="btn-primary mt-3 w-full !py-2 text-[12.5px]"><Search size={14} /> Browse players</button>
          </Panel>
        </div>
      </div>
    </div>
  );
}

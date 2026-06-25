import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Rocket, BadgeCheck, Eye, Video, Plus, Upload, Pencil, Play,
  Heart, TrendingUp, Star, CalendarCheck, X,
} from 'lucide-react';
import { useSession } from '../session';
import { POSITIONS, COUNTRIES } from '../data';
import { payLink } from '../payments';
import { Kpi, Panel, DashHeader } from '../components/dash';
import ShareMenu from '../components/ShareMenu';
import { MyJourney } from '../components/LifetimeLog';

export default function Hub() {
  const { pro, setPro, profile, setProfile, toast } = useSession();
  const nav = useNavigate();

  const playerName = profile.name || 'Leo Martins';
  const playerMeta = `Football · ${profile.position || 'Striker'} · ${profile.country || 'Brazil'}`;

  // Edit profile + add video (functional, client-side).
  const [editOpen, setEditOpen] = useState(false);
  const [vidOpen, setVidOpen] = useState(false);
  const [myVideos, setMyVideos] = useState<string[]>([]);
  const [eName, setEName] = useState(profile.name || '');
  const [ePos, setEPos] = useState(profile.position || 'Striker');
  const [eCountry, setECountry] = useState(profile.country || 'Brazil');
  const [vidUrl, setVidUrl] = useState('');

  const openEdit = () => {
    setEName(profile.name || ''); setEPos(profile.position || 'Striker'); setECountry(profile.country || 'Brazil');
    setEditOpen(true);
  };
  const saveProfile = () => {
    if (!eName.trim()) { toast('Please enter your name'); return; }
    setProfile({ ...profile, name: eName.trim(), position: ePos, country: eCountry });
    setEditOpen(false);
    toast('Profile updated ✅');
  };
  const parseYt = (s: string) => {
    const v = s.trim();
    const m = v.match(/(?:youtu\.be\/|v=|embed\/|shorts\/)([A-Za-z0-9_-]{11})/) || v.match(/^([A-Za-z0-9_-]{11})$/);
    return m ? m[1] : null;
  };
  const addVideo = () => {
    const id = parseYt(vidUrl);
    if (!id) { toast('Paste a valid YouTube link or 11-char video ID'); return; }
    setMyVideos((v) => [id, ...v]);
    setVidUrl('');
    setVidOpen(false);
    toast('Video added ✅');
  };

  const goPro = () => {
    const url = payLink('proplayer', 'world', true);
    if (!url) { toast('Checkout is being set up — please try again soon'); return; }
    window.open(url, '_blank', 'noopener');
    setPro(true);
    toast('Secure checkout opened in a new tab 💳');
  };

  return (
    <div className="mx-auto max-w-6xl px-5 py-10">
      <DashHeader
        title={playerName}
        subtitle={playerMeta}
        badge={<>
          <span className={`rounded px-2 py-0.5 text-[10px] font-extrabold ${pro ? 'bg-gradient-to-r from-primary to-primary-2 text-white' : 'border border-white/10 text-mute'}`}>{pro ? 'PRO' : 'FREE'}</span>
          {pro && <BadgeCheck size={20} className="text-sky" />}
        </>}
      >
        <button className="btn-primary text-[13px]" onClick={() => setVidOpen(true)}><Upload size={15} /> Upload video</button>
        <ShareMenu url={typeof window !== 'undefined' ? window.location.href.replace(/#.*/, '') + '#/' : ''} text={`Check out ${playerName} on Talenta ⚽ — football talent, discovered.`} label="Share profile" />
        <button className="btn-ghost text-[13px]" onClick={openEdit}><Pencil size={15} /> Edit profile</button>
      </DashHeader>

      {!pro && (
        <div className="card mb-6 flex flex-wrap items-center gap-4 border-primary/40 bg-primary/[0.06] p-5">
          <Rocket size={24} className="text-primary" />
          <div className="min-w-[200px] flex-1"><b>You're on the Free plan.</b> <span className="text-mute">Go Pro for unlimited videos, daily practice, ✔ verified badge & boosted visibility.</span></div>
          <button className="btn-primary text-[13px]" onClick={goPro}>Upgrade — $10/mo</button>
        </div>
      )}

      {/* KPIs */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
        <Kpi icon={Eye} n="0" l="Profile views" />
        <Kpi icon={Heart} n="0" l="Club interests" />
        <Kpi icon={Video} n={String(myVideos.length)} l="Videos" />
        <Kpi icon={Star} n="—" l="Avg rating" />
        <Kpi icon={TrendingUp} n="New" l="Search rank" />
      </div>

      {/* interested + profile strength */}
      <div className="mt-6 grid gap-6 lg:grid-cols-[1.6fr_1fr]">
        <Panel title="Clubs interested in you">
          <div className="rounded-xl border border-dashed border-white/15 bg-white/[0.02] p-6 text-center text-[13px] text-mute">
            No clubs have viewed your profile yet.<br />
            Add a highlight video & share your profile to start getting discovered by clubs, academies and scouts.
          </div>
        </Panel>

        <Panel title="Profile strength">
          <div className="font-display text-3xl font-bold">{pro ? '92' : '68'}%</div>
          <div className="mt-2.5 h-2 overflow-hidden rounded-full bg-white/10"><div className="h-full rounded-full bg-gradient-to-r from-primary to-primary-2" style={{ width: pro ? '92%' : '68%' }} /></div>
          <ul className="mt-4 space-y-2 text-[13px]">
            <Tip done label="Profile photo & stats" />
            <Tip done={pro} label="Verified badge" />
            <Tip done={pro} label="Highlight reel uploaded" />
            <Tip done={false} label="Add 2 more skill videos" />
          </ul>
        </Panel>
      </div>

      {/* Offers received */}
      <Panel title="Offers received" className="mt-6">
        <div className="rounded-xl border border-dashed border-white/15 bg-white/[0.02] p-6 text-center text-[13px] text-mute">
          No offers yet. When a club or academy makes an offer on your profile, it'll appear here — you'll be able to accept, decline or counter.
        </div>
      </Panel>

      {/* My videos */}
      <Panel title="My videos" className="mt-6" action={<span className="text-[12.5px] text-mute">{pro ? 'Unlimited' : `${myVideos.length} of 1 used (Free)`}</span>}>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {myVideos.map((id, i) => (
            <a key={`my${i}`} href={`https://www.youtube.com/watch?v=${id}`} target="_blank" rel="noopener noreferrer" className="group relative aspect-video overflow-hidden rounded-xl border border-primary/50 bg-black">
              <img src={`https://img.youtube.com/vi/${id}/hqdefault.jpg`} alt="" className="h-full w-full object-cover" />
              <span className="absolute inset-0 grid place-items-center"><span className="grid h-10 w-10 place-items-center rounded-full border border-white/70 bg-black/55 text-white"><Play size={14} fill="white" className="ml-0.5" /></span></span>
              <span className="absolute left-1.5 top-1.5 rounded bg-primary px-1.5 py-0.5 text-[9px] font-bold text-white">YOURS</span>
            </a>
          ))}
          <button onClick={() => setVidOpen(true)}
            className="flex aspect-video flex-col items-center justify-center gap-1.5 rounded-xl border border-dashed border-white/15 bg-white/[0.03] text-mute transition hover:border-primary hover:text-white">
            <Plus size={22} /> <span className="text-[12.5px] font-semibold">Add video</span>
          </button>
        </div>
      </Panel>

      {/* Lifetime journey log */}
      <div className="mt-6"><MyJourney /></div>

      {/* practice + messages + trials */}
      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <Panel title="Daily practice" action={<button className="btn-primary !px-3 !py-1.5 text-[12px]" onClick={() => { if (!pro) goPro(); else toast('Logged ✅'); }}><Plus size={13} /> Log</button>}>
          {pro ? (
            <p className="rounded-lg border border-dashed border-white/15 p-4 text-center text-[13px] text-mute">No sessions logged yet. Tap <b className="text-slate-200">Log</b> to record your first practice.</p>
          ) : <p className="text-[13px] text-mute">🔒 Pro feature. <button onClick={goPro} className="text-primary">Upgrade</button> to log every session.</p>}
        </Panel>

        <Panel title="Messages" action={<button className="text-[12.5px] font-semibold text-primary" onClick={() => nav('/messages')}>Open</button>}>
          <p className="rounded-lg border border-dashed border-white/15 p-4 text-center text-[13px] text-mute">No messages yet. When a club or academy contacts you, the conversation appears here.</p>
        </Panel>

        <Panel title="Upcoming trials" action={<CalendarCheck size={16} className="text-primary" />}>
          <p className="rounded-lg border border-dashed border-white/15 p-4 text-center text-[13px] text-mute">No trials scheduled yet. Invitations from clubs will show up here.</p>
        </Panel>
      </div>

      {/* Edit profile modal */}
      {editOpen && (
        <div className="fixed inset-0 z-[200] grid place-items-center bg-black/60 p-4 backdrop-blur-sm" onClick={() => setEditOpen(false)}>
          <div role="dialog" aria-modal="true" aria-label="Edit profile" className="card w-full max-w-md p-6" onClick={(e) => e.stopPropagation()}>
            <div className="mb-4 flex items-center justify-between"><h2 className="font-display text-lg font-bold">Edit profile</h2><button onClick={() => setEditOpen(false)} aria-label="Close" className="text-mute hover:text-white"><X size={18} /></button></div>
            <div className="space-y-4">
              <div><label className="field-label">Full name</label><input value={eName} onChange={(e) => setEName(e.target.value)} className="field-input" placeholder="Your name" /></div>
              <div><label className="field-label">Main position</label><select value={ePos} onChange={(e) => setEPos(e.target.value)} className="field-input">{POSITIONS.slice(1).map((p) => <option key={p}>{p}</option>)}</select></div>
              <div><label className="field-label">Country</label><select value={eCountry} onChange={(e) => setECountry(e.target.value)} className="field-input">{COUNTRIES.map((c) => <option key={c}>{c}</option>)}</select></div>
            </div>
            <div className="mt-6 flex justify-end gap-2">
              <button onClick={() => setEditOpen(false)} className="btn-ghost text-[13px]">Cancel</button>
              <button onClick={saveProfile} className="btn-primary text-[13px]">Save changes</button>
            </div>
          </div>
        </div>
      )}

      {/* Add video modal */}
      {vidOpen && (
        <div className="fixed inset-0 z-[200] grid place-items-center bg-black/60 p-4 backdrop-blur-sm" onClick={() => setVidOpen(false)}>
          <div role="dialog" aria-modal="true" aria-label="Add a video" className="card w-full max-w-md p-6" onClick={(e) => e.stopPropagation()}>
            <div className="mb-4 flex items-center justify-between"><h2 className="font-display text-lg font-bold">Add a video</h2><button onClick={() => setVidOpen(false)} aria-label="Close" className="text-mute hover:text-white"><X size={18} /></button></div>
            <p className="mb-3 text-[13px] text-mute">Paste a YouTube link to your highlight reel or skill video — it appears on your profile instantly.</p>
            <input value={vidUrl} onChange={(e) => setVidUrl(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') addVideo(); }} className="field-input" placeholder="https://youtube.com/watch?v=..." autoFocus />
            <div className="mt-6 flex justify-end gap-2">
              <button onClick={() => setVidOpen(false)} className="btn-ghost text-[13px]">Cancel</button>
              <button onClick={addVideo} className="btn-primary text-[13px]"><Upload size={15} /> Add video</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Tip({ done, label }: { done: boolean; label: string }) {
  return (
    <li className="flex items-center gap-2">
      <span className={`grid h-4 w-4 place-items-center rounded-full text-[9px] ${done ? 'bg-emerald-500 text-white' : 'border border-white/20 text-transparent'}`}>✓</span>
      <span className={done ? 'text-slate-300' : 'text-mute'}>{label}</span>
    </li>
  );
}

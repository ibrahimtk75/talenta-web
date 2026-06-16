import { useNavigate } from 'react-router-dom';
import {
  Rocket, BadgeCheck, Eye, MessageSquare, Video, Plus, Upload, Pencil, Play,
  Heart, TrendingUp, Star, CalendarCheck, ChevronRight,
} from 'lucide-react';
import { useSession } from '../session';
import { PLAYERS, ORGS, valuationOf, fmtMoney } from '../data';
import { payLink } from '../payments';
import { Kpi, Panel, DashHeader } from '../components/dash';
import OrgLogo from '../components/OrgLogo';
import ShareMenu from '../components/ShareMenu';

export default function Hub() {
  const { pro, setPro, profile, toast } = useSession();
  const nav = useNavigate();

  const playerName = profile.name || 'Leo Martins';
  const playerMeta = `Football · ${profile.position || 'Striker'} · ${profile.country || 'Brazil'}`;

  const goPro = () => {
    const url = payLink('proplayer', 'world', true);
    if (!url) { toast('Checkout is being set up — please try again soon'); return; }
    window.open(url, '_blank', 'noopener');
    setPro(true);
    toast('Secure checkout opened in a new tab 💳');
  };

  const interested = ORGS.slice(0, 4);
  const messages = [
    ['Santos FC', 'Can we set up a trial next week?', '2h'],
    ['River Plate', 'Loved your last reel 🔥', '1d'],
    ['Lyon Academy', "What's your availability?", '3d'],
  ];
  const trials = [
    ['Santos FC', 'Trial · training ground', 'Mon, 24 Jun'],
    ['Bayern Youth', 'Video call · scouting', 'Thu, 27 Jun'],
  ];

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
        <button className="btn-primary text-[13px]" onClick={() => toast('Video upload — opens picker')}><Upload size={15} /> Upload video</button>
        <ShareMenu url={typeof window !== 'undefined' ? window.location.href.replace(/#.*/, '') + '#/player/1' : ''} text="Check out my football profile on Talenta ⚽" label="Share profile" />
        <button className="btn-ghost text-[13px]" onClick={() => toast('Edit profile')}><Pencil size={15} /> Edit profile</button>
        <button className="btn-ghost text-[13px]" onClick={() => nav('/player/1')}>View public</button>
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
        <Kpi icon={Eye} n="1,284" l="Profile views" trend="+18%" />
        <Kpi icon={Heart} n="23" l="Club interests" trend="+5" />
        <Kpi icon={Video} n={pro ? '12' : '1'} l="Videos" />
        <Kpi icon={Star} n={pro ? '4.8' : '4.2'} l="Avg rating" />
        <Kpi icon={TrendingUp} n="#7" l="Search rank" trend="↑3" />
      </div>

      {/* interested + profile strength */}
      <div className="mt-6 grid gap-6 lg:grid-cols-[1.6fr_1fr]">
        <Panel title="Clubs interested in you" action={<button className="text-[12.5px] font-semibold text-primary" onClick={() => nav('/messages')}>View all</button>}>
          <div className="space-y-3">
            {interested.map((o) => (
              <div key={o.name} className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.03] p-3">
                <OrgLogo name={o.name} size={38} />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1 font-semibold">{o.name} {o.verified && <BadgeCheck size={13} className="text-sky" />}</div>
                  <div className="text-[12px] text-mute">{o.type} · viewed your profile</div>
                </div>
                <button className="btn-ghost !px-3 !py-1.5 text-[12px]" onClick={() => { nav('/messages'); }}>Reply</button>
              </div>
            ))}
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
      <Panel title="Offers received" className="mt-6" action={<span className="text-[12.5px] text-mute">Your asking price: <b className="grad-text">{fmtMoney(valuationOf(PLAYERS[0]))}</b></span>}>
        <div className="space-y-2.5">
          {ORGS.slice(0, 3).map((o, i) => {
            const amount = Math.round((valuationOf(PLAYERS[0]) * (0.78 + i * 0.07)) / 5) * 5;
            return (
              <div key={o.name} className="flex flex-wrap items-center gap-3 rounded-xl border border-white/10 bg-white/[0.03] p-3">
                <OrgLogo name={o.name} size={36} />
                <div className="min-w-0 flex-1"><div className="font-semibold">{o.name}</div><div className="text-[12px] text-mute">{i === 0 ? '🏆 Highest bid' : 'Offer · negotiable'}</div></div>
                <div className="font-display text-lg font-bold grad-text">{fmtMoney(amount)}</div>
                <div className="flex gap-2">
                  <button className="btn-primary !px-3 !py-1.5 text-[12px]" onClick={() => toast(`Accepted ${o.name}'s offer 🤝`)}>Accept</button>
                  <button className="btn-ghost !px-3 !py-1.5 text-[12px]" onClick={() => toast('Counter-offer sent')}>Counter</button>
                </div>
              </div>
            );
          })}
        </div>
      </Panel>

      {/* My videos */}
      <Panel title="My videos" className="mt-6" action={<span className="text-[12.5px] text-mute">{pro ? 'Unlimited' : '1 of 1 used (Free)'}</span>}>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {(pro ? PLAYERS.slice(0, 4) : PLAYERS.slice(0, 1)).map((v, i) => (
            <div key={i} className="group relative aspect-video overflow-hidden rounded-xl border border-white/10 bg-black">
              <img src={`https://img.youtube.com/vi/${v.yt}/hqdefault.jpg`} alt="" className="h-full w-full object-cover" />
              <span className="absolute inset-0 grid place-items-center"><span className="grid h-10 w-10 place-items-center rounded-full border border-white/70 bg-black/55 text-white"><Play size={14} fill="white" className="ml-0.5" /></span></span>
            </div>
          ))}
          <button onClick={() => { if (!pro) goPro(); else toast('Video upload (demo)'); }}
            className="flex aspect-video flex-col items-center justify-center gap-1.5 rounded-xl border border-dashed border-white/15 bg-white/[0.03] text-mute transition hover:border-primary hover:text-white">
            <Plus size={22} /> <span className="text-[12.5px] font-semibold">Upload video</span>
          </button>
        </div>
      </Panel>

      {/* practice + messages + trials */}
      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <Panel title="Daily practice" action={<button className="btn-primary !px-3 !py-1.5 text-[12px]" onClick={() => { if (!pro) goPro(); else toast('Logged ✅'); }}><Plus size={13} /> Log</button>}>
          {pro ? (
            <div className="space-y-2.5 text-[13px]">
              {[['Today', '200 finishing shots, both feet 🎯'], ['Yesterday', '3.2km tempo + core'], ['2d', '1v1 dribbling vs U-19 keeper']].map((p, i) => (
                <div key={i} className="rounded-lg border border-white/10 bg-white/[0.03] p-3"><b className="text-mute">{p[0]}</b> · {p[1]}</div>
              ))}
            </div>
          ) : <p className="text-[13px] text-mute">🔒 Pro feature. <button onClick={goPro} className="text-primary">Upgrade</button> to log every session.</p>}
        </Panel>

        <Panel title="Messages" action={<button className="text-[12.5px] font-semibold text-primary" onClick={() => nav('/messages')}>Open</button>}>
          <div className="space-y-2.5">
            {messages.map((m, i) => (
              <button key={i} onClick={() => nav('/messages')} className="flex w-full items-center gap-2.5 rounded-lg border border-white/10 bg-white/[0.03] p-2.5 text-left hover:border-primary/50">
                <span className="grid h-8 w-8 flex-shrink-0 place-items-center rounded-lg bg-gradient-to-br from-primary to-primary-2 text-[13px] font-bold text-white">{m[0][0]}</span>
                <span className="min-w-0 flex-1"><span className="block text-[13px] font-semibold">{m[0]}</span><span className="block truncate text-[12px] text-mute">{m[1]}</span></span>
                <span className="text-[11px] text-mute">{m[2]}</span>
              </button>
            ))}
          </div>
        </Panel>

        <Panel title="Upcoming trials" action={<CalendarCheck size={16} className="text-primary" />}>
          <div className="space-y-2.5">
            {trials.map((t, i) => (
              <div key={i} className="rounded-lg border border-white/10 bg-white/[0.03] p-3">
                <div className="flex items-center justify-between"><b className="text-[13px]">{t[0]}</b><span className="text-[11px] text-primary">{t[2]}</span></div>
                <div className="mt-0.5 text-[12px] text-mute">{t[1]}</div>
              </div>
            ))}
            <button onClick={() => toast('Opening calendar')} className="flex w-full items-center justify-center gap-1 rounded-lg border border-dashed border-white/15 py-2.5 text-[12.5px] text-mute hover:border-primary hover:text-white">View calendar <ChevronRight size={14} /></button>
          </div>
        </Panel>
      </div>
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

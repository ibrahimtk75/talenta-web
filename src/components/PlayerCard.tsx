import { useNavigate } from 'react-router-dom';
import { BadgeCheck, Play } from 'lucide-react';
import { Player, FLAG, COUNTRY_NAME, initials, ratingOf, ratingCountOf } from '../data';
import { Stars } from './Stars';

export function PlayerRow({ player }: { player: Player }) {
  const nav = useNavigate();
  return (
    <button
      onClick={() => nav(`/player/${player.id}`)}
      className="card group flex w-full items-center gap-4 p-4 text-left transition-all hover:-translate-y-1 hover:border-primary/60"
    >
      <div className="grid h-14 w-14 flex-shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-primary to-primary-2 font-display text-lg font-bold text-white">
        {initials(player.name)}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1.5 font-bold">
          <span className="truncate">{player.name}</span> <span>{FLAG[player.country]}</span>
          {player.verified && <BadgeCheck size={16} className="text-sky" />}
        </div>
        <div className="mt-0.5 text-[12.5px] text-mute">{player.pos} · Age {player.age} · {player.foot} foot</div>
        <div className="mt-1.5 flex items-center gap-2">
          <Stars value={ratingOf(player)} size={13} />
          <span className="text-[12px] text-mute">{ratingOf(player)} ({ratingCountOf(player)})</span>
        </div>
      </div>
      <div className="text-center">
        <div className="font-display text-lg font-bold text-primary">{player.match}%</div>
        <div className="text-[10px] text-mute">MATCH</div>
      </div>
    </button>
  );
}

export function PlayerGridCard({ player }: { player: Player }) {
  const nav = useNavigate();
  // Prefer a real profile photo; fall back to a YouTube thumbnail, then to a
  // clean initials avatar — so cards stay a tidy photo grid either way.
  const photo = player.photo || (player.yt ? `https://img.youtube.com/vi/${player.yt}/hqdefault.jpg` : '');
  const hasReel = !!(player.yt || player.igUrl);
  return (
    <button
      onClick={() => nav(`/player/${player.id}`)}
      className="card group overflow-hidden text-left transition-all hover:-translate-y-1.5 hover:border-primary/60"
    >
      {/* portrait photo (Google-grid style) */}
      <div className="relative aspect-[4/5] overflow-hidden bg-gradient-to-br from-primary/25 via-ink to-ink">
        {photo ? (
          <img src={photo} alt={player.name} loading="lazy"
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
        ) : (
          <div className="grid h-full w-full place-items-center">
            <span className="font-display text-5xl font-bold text-white/80">{initials(player.name)}</span>
          </div>
        )}
        <span className="absolute left-3 top-3 rounded-lg border border-white/10 bg-black/65 px-2.5 py-1 text-[11px] font-bold backdrop-blur">{player.pos}</span>
        {player.verified && (
          <span className="absolute right-3 top-3 grid h-7 w-7 place-items-center rounded-full bg-black/65 backdrop-blur"><BadgeCheck size={15} className="text-sky" /></span>
        )}
        {hasReel && (
          <span className="absolute bottom-3 right-3 grid h-9 w-9 place-items-center rounded-full bg-primary/90 text-white shadow-glow"><Play size={15} fill="white" className="ml-0.5" /></span>
        )}
      </div>
      {/* name · position · country (clean, like a scouting grid) */}
      <div className="p-3.5">
        <div className="truncate text-[15px] font-bold leading-tight">{player.name}</div>
        <div className="mt-1 text-[13px] text-mute">{player.pos}{player.skillLevel ? ` · ${player.skillLevel}` : ''}</div>
        <div className="mt-1.5 flex items-center gap-1.5 text-[13px]">
          <span>{FLAG[player.country] || '🌍'}</span>
          <span className="text-slate-300">{COUNTRY_NAME[player.country] || player.country}</span>
        </div>
      </div>
    </button>
  );
}

import { useNavigate } from 'react-router-dom';
import { BadgeCheck, Play } from 'lucide-react';
import { Player, FLAG, initials, ratingOf, ratingCountOf } from '../data';
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
  return (
    <button
      onClick={() => nav(`/player/${player.id}`)}
      className="card group overflow-hidden text-left transition-all hover:-translate-y-1.5 hover:border-primary/60"
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-black">
        <img src={`https://img.youtube.com/vi/${player.yt}/hqdefault.jpg`} alt={player.name}
          className="h-full w-full object-cover opacity-90 transition group-hover:scale-105" />
        <span className="absolute left-3 top-3 rounded-lg border border-white/10 bg-black/65 px-2.5 py-1 text-[11px] font-bold backdrop-blur">{player.pos}</span>
        <span className="absolute inset-0 grid place-items-center">
          <span className="grid h-11 w-11 place-items-center rounded-full border-[1.5px] border-white/70 bg-black/50 text-white backdrop-blur">
            <Play size={16} fill="white" className="ml-0.5" />
          </span>
        </span>
      </div>
      <div className="p-4">
        <div className="flex items-center gap-1.5 font-bold">
          {player.name} <span>{FLAG[player.country]}</span>
          {player.verified && <BadgeCheck size={15} className="text-sky" />}
        </div>
        <div className="mt-0.5 text-[12.5px] text-mute">Age {player.age} · {player.foot} foot</div>
        <div className="mt-2 flex items-center justify-between">
          <span className="text-[13px] font-bold grad-text">{player.headline}</span>
          <span className="flex items-center gap-1"><Stars value={ratingOf(player)} size={12} /><span className="text-[11px] text-mute">{ratingOf(player)}</span></span>
        </div>
      </div>
    </button>
  );
}

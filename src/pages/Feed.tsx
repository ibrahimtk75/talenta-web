import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, Send, User } from 'lucide-react';
import { PLAYERS, FLAG, Player } from '../data';
import { useSession } from '../session';

function Reel({ player }: { player: Player }) {
  const [playing, setPlaying] = useState(false);
  const nav = useNavigate();
  const { role, toast } = useSession();

  const contact = () => {
    if (role !== 'club' && role !== 'academy') { toast('Contacting players is for clubs. Sign in as a club.'); return; }
    toast(`Request sent to ${player.name}`);
  };

  return (
    <div className="relative h-full w-full shrink-0 snap-start overflow-hidden rounded-xl2 border border-white/10 bg-black">
      {playing ? (
        <iframe className="absolute inset-0 h-full w-full"
          src={`https://www.youtube.com/embed/${player.yt}?autoplay=1&rel=0&modestbranding=1&playsinline=1`}
          allow="autoplay; encrypted-media" allowFullScreen title={player.name} />
      ) : (
        <button onClick={() => setPlaying(true)} className="absolute inset-0">
          <img src={`https://img.youtube.com/vi/${player.yt}/hqdefault.jpg`} alt="" className="h-full w-full object-cover" />
          <span className="absolute inset-0 grid place-items-center">
            <span className="grid h-[70px] w-[70px] place-items-center rounded-full border-2 border-white/85 bg-black/55 text-white backdrop-blur">
              <Play size={26} fill="white" className="ml-1" />
            </span>
          </span>
        </button>
      )}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 to-transparent p-6 pt-16">
        <div className="font-display text-xl font-bold">{player.name} <span>{FLAG[player.country]}</span></div>
        <div className="mt-1 text-sm text-slate-300">{player.pos} · {player.headline}</div>
        <div className="pointer-events-auto mt-3.5 flex gap-2.5">
          <button onClick={contact} className="btn-primary !py-2 text-[13px]"><Send size={15} /> Contact</button>
          <button onClick={() => nav(`/player/${player.id}`)} className="btn-ghost !py-2 text-[13px]"><User size={15} /> Profile</button>
        </div>
      </div>
    </div>
  );
}

export default function Feed() {
  return (
    <div className="mx-auto max-w-[440px] px-5 py-5">
      <div className="h-[calc(100vh-150px)] snap-y snap-mandatory space-y-4 overflow-y-auto" style={{ scrollbarWidth: 'none' }}>
        {PLAYERS.map((p) => (
          <div key={p.id} className="h-full">
            <Reel player={p} />
          </div>
        ))}
      </div>
    </div>
  );
}

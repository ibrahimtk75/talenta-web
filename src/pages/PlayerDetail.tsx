import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, BadgeCheck, Send, Play, Gavel, TrendingUp } from 'lucide-react';
import { FLAG, initials, valuationOf, fmtMoney } from '../data';
import { RateStars } from '../components/Stars';
import ShareMenu from '../components/ShareMenu';
import { usePlayer } from '../usePlayers';
import { useSession } from '../session';

export default function PlayerDetail() {
  const { id } = useParams();
  const nav = useNavigate();
  const { role, toast } = useSession();
  const [playing, setPlaying] = useState(false);
  const [offer, setOffer] = useState('');
  const [ratings, setRatings] = useState<Record<string, number>>({});
  const [review, setReview] = useState('');
  const { player: p, loading } = usePlayer(id);

  if (loading) return <div className="mx-auto max-w-3xl px-5 py-12 text-mute">Loading…</div>;
  if (!p) return <div className="mx-auto max-w-3xl px-5 py-12">Player not found.</div>;

  const isClub = role === 'club' || role === 'academy';

  const submitReview = () => {
    if (!Object.values(ratings).some(Boolean)) { toast('Please rate at least one category'); return; }
    toast(`Review submitted for ${p.name} ⭐`);
    setRatings({}); setReview('');
  };

  const contact = () => {
    if (!isClub) { toast('Contacting players is for clubs. Sign in as a club.'); return; }
    toast(`Request sent to ${p.name}`);
  };
  const sendOffer = () => {
    const v = Number(offer);
    if (!v || v <= 0) { toast('Enter a valid offer amount'); return; }
    toast(`Offer of $${v}K sent to ${p.name}`);
    setOffer('');
  };

  return (
    <div className="mx-auto max-w-3xl px-5 py-12">
      <button onClick={() => nav(-1)} className="mb-5 inline-flex items-center gap-1.5 text-sm font-semibold text-mute hover:text-primary">
        <ArrowLeft size={15} /> Back
      </button>

      <div className="card flex flex-wrap items-center gap-5 p-6">
        <div className="grid h-20 w-20 place-items-center rounded-2xl bg-gradient-to-br from-primary to-primary-2 font-display text-3xl font-bold text-white">{initials(p.name)}</div>
        <div className="min-w-[200px] flex-1">
          <h1 className="flex items-center gap-2 font-display text-2xl font-bold">
            {p.name} <span className="text-xl">{FLAG[p.country]}</span>
            {p.pro && <span className="rounded bg-gradient-to-r from-primary to-primary-2 px-2 py-0.5 text-[10px] font-extrabold text-white">PRO</span>}
            {p.verified && <BadgeCheck size={20} className="text-sky" />}
          </h1>
          <div className="mt-1 text-mute">Football · {p.pos}{p.age ? ` · Age ${p.age}` : ''}{p.foot && p.foot !== '—' ? ` · ${p.foot} foot` : ''}</div>
          <div className="mt-2 text-[13px] text-mute">No club reviews yet</div>
        </div>
        <div className="flex flex-wrap gap-2">
          <ShareMenu text={`${p.name} — ${p.pos} on Talenta ⚽`} />
          <button onClick={contact} className="btn-primary"><Send size={16} /> Contact Player</button>
        </div>
      </div>

      {/* Estimated value & offers */}
      <div className="card mt-6 p-6">
        <div>
          <div className="flex items-center gap-1.5 text-[13px] text-mute"><TrendingUp size={14} className="text-primary" /> Estimated value</div>
          <div className="font-display text-4xl font-bold grad-text">{fmtMoney(valuationOf(p))}</div>
          <div className="mt-1 text-[12.5px] text-mute">Automated estimate from career stats · negotiable, open to offers</div>
        </div>
        {isClub ? (
          <div className="mt-5 border-t border-white/10 pt-5">
            <div className="text-[13px] font-semibold">Make an offer</div>
            <div className="mt-2.5 flex flex-wrap items-center gap-2.5">
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-mute">$</span>
                <input value={offer} onChange={(e) => setOffer(e.target.value)} type="number" placeholder="Amount" className="field-input w-36 !pl-7 !pr-8" />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[12px] text-mute">K</span>
              </div>
              <button onClick={sendOffer} className="btn-primary"><Gavel size={15} /> Send offer</button>
            </div>
            <p className="mt-2.5 text-[12px] text-mute">The player can accept, decline or counter your offer.</p>
          </div>
        ) : (
          <div className="mt-5 border-t border-white/10 pt-5 text-[13px] text-mute">Sign in as a club or academy to make an offer.</div>
        )}
      </div>

      {isClub && (
        <div className="card mt-6 p-6">
          <h2 className="font-display text-lg font-bold">Rate this player</h2>
          <p className="mt-1 text-[13px] text-mute">Your review helps other clubs & builds trust. Visible after a verified interaction.</p>
          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            {['Skill', 'Attitude', 'Reliability'].map((cat) => (
              <div key={cat} className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
                <div className="mb-2 text-[13px] font-semibold text-slate-200">{cat}</div>
                <RateStars onRate={(v) => setRatings((r) => ({ ...r, [cat]: v }))} />
              </div>
            ))}
          </div>
          <textarea value={review} onChange={(e) => setReview(e.target.value)} className="field-input mt-4" rows={2} placeholder={`Write a short review of ${p.name}...`} />
          <button onClick={submitReview} className="btn-primary mt-3">Submit review</button>
        </div>
      )}

      <h2 className="mb-4 mt-9 font-display text-lg font-bold">Career timeline</h2>
      {p.career.length ? (
        <div className="relative space-y-4 pl-6 before:absolute before:bottom-1.5 before:left-1.5 before:top-1.5 before:w-0.5 before:bg-white/15">
          {p.career.map((c, i) => (
            <div key={i} className="relative">
              <span className="absolute -left-[18px] top-1.5 h-2.5 w-2.5 rounded-full bg-gradient-to-br from-primary to-primary-2" />
              <div className="font-semibold">{c[1]}</div>
              <div className="text-[12.5px] text-mute">{c[0]}</div>
            </div>
          ))}
        </div>
      ) : <p className="text-[13px] text-mute">No career history added yet.</p>}

      <h2 className="mb-4 mt-9 font-display text-lg font-bold">Career stats</h2>
      {Object.keys(p.stats).length ? (
        <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-4">
          {Object.entries(p.stats).map(([k, v]) => (
            <div key={k} className="card p-4">
              <div className="font-display text-2xl font-bold">{v}</div>
              <div className="mt-0.5 text-[11px] uppercase tracking-wide text-mute">{k}</div>
            </div>
          ))}
        </div>
      ) : <p className="text-[13px] text-mute">No stats added yet.</p>}

      <h2 className="mb-4 mt-9 font-display text-lg font-bold">Highlight reel</h2>
      {p.yt ? (
        <div className="relative h-[460px] w-[280px] overflow-hidden rounded-xl2 border border-white/10 bg-black">
          {playing ? (
            <iframe className="absolute inset-0 h-full w-full" src={`https://www.youtube.com/embed/${p.yt}?autoplay=1&rel=0&modestbranding=1`} allow="autoplay; encrypted-media" allowFullScreen title={p.name} />
          ) : (
            <button onClick={() => setPlaying(true)} className="absolute inset-0">
              <img src={`https://img.youtube.com/vi/${p.yt}/hqdefault.jpg`} alt="" className="h-full w-full object-cover" />
              <span className="absolute inset-0 grid place-items-center">
                <span className="grid h-[70px] w-[70px] place-items-center rounded-full border-2 border-white/85 bg-black/55 text-white"><Play size={26} fill="white" className="ml-1" /></span>
              </span>
            </button>
          )}
        </div>
      ) : <p className="text-[13px] text-mute">No highlight video uploaded yet.</p>}
    </div>
  );
}

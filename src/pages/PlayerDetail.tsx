import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, BadgeCheck, Send, Play, Gavel, TrendingUp, Heart, Sparkles, Lock } from 'lucide-react';
import { FLAG, COUNTRY_NAME, initials, valuationOf, fmtMoney } from '../data';
import { useSEO } from '../useSEO';
import ShareMenu from '../components/ShareMenu';
import TalentaCard from '../components/TalentaCard';
import { usePlayer } from '../usePlayers';
import { useSession } from '../session';
import { apiEnabled, apiSendMessage, apiPlayerLogs, type PlayerLog } from '../api';
import { JourneyTimeline } from '../components/LifetimeLog';

export default function PlayerDetail() {
  const { id } = useParams();
  const nav = useNavigate();
  const { role, token, toast } = useSession();
  const [playing, setPlaying] = useState(false);
  const [showCard, setShowCard] = useState(false);
  const [offer, setOffer] = useState('');
  const [logs, setLogs] = useState<PlayerLog[]>([]);
  const { player: p, loading } = usePlayer(id);

  // Clubs & academies can see the player's lifetime journey (non-private entries).
  const clubView = role === 'club' || role === 'academy';
  useEffect(() => {
    if (!apiEnabled || !p || !clubView) { setLogs([]); return; }
    apiPlayerLogs(p.id, token || undefined).then(setLogs).catch(() => setLogs([]));
  }, [p?.id, clubView, token]); // eslint-disable-line

  // Per-player SEO: unique title, description and Person/VideoObject schema so
  // search engines can index each footballer as a rich result.
  const countryName = p ? (COUNTRY_NAME[p.country] || p.country) : '';
  useSEO({
    title: p ? `${p.name} — ${p.pos} | Talenta` : 'Player | Talenta',
    description: p
      ? `${p.name}, ${p.pos}${p.age ? `, age ${p.age}` : ''} from ${countryName}. Watch the highlight reel and full football profile on Talenta.`
      : undefined,
    jsonLd: p
      ? {
          '@context': 'https://schema.org',
          '@type': 'Person',
          name: p.name,
          jobTitle: `Footballer — ${p.pos}`,
          nationality: countryName,
          ...(p.photo ? { image: p.photo } : {}),
          memberOf: { '@type': 'Organization', name: 'Talenta' },
          ...(p.yt
            ? {
                subjectOf: {
                  '@type': 'VideoObject',
                  name: `${p.name} — highlight reel`,
                  description: `Football skill reel of ${p.name} on Talenta`,
                  thumbnailUrl: `https://img.youtube.com/vi/${p.yt}/hqdefault.jpg`,
                  contentUrl: `https://www.youtube.com/watch?v=${p.yt}`,
                  uploadDate: '2024-01-01',
                },
              }
            : {}),
        }
      : null,
  });

  if (loading) return <div className="mx-auto max-w-3xl px-5 py-12 text-mute">Loading…</div>;
  if (!p) return <div className="mx-auto max-w-3xl px-5 py-12">Player not found.</div>;

  const isClub = role === 'club' || role === 'academy';

  const contact = async () => {
    if (!isClub) { toast('Contacting players is for clubs & academies.'); return; }
    if (apiEnabled && token) {
      try {
        await apiSendMessage(token, p.id, `Hi ${p.name}, we'd like to connect with you on Talenta.`);
        toast('Message sent ✅');
        nav('/messages', { state: { peerId: p.id, peerName: p.name } });
      } catch { toast('Could not send message — try again'); }
    } else {
      toast('Sign in as a club to contact players.');
    }
  };
  // A real offer = a message to the player with the amount (uses live messaging).
  const sendOffer = async () => {
    const v = Number(offer);
    if (!v || v <= 0) { toast('Enter a valid offer amount'); return; }
    if (apiEnabled && token) {
      try {
        await apiSendMessage(token, p.id, `Offer via Talenta: $${v}K for ${p.name}. We'd love to discuss — are you open to it?`);
        toast('Offer sent ✅'); setOffer('');
        nav('/messages', { state: { peerId: p.id, peerName: p.name } });
      } catch { toast('Could not send offer — try again'); }
    } else {
      toast('Sign in as a club to make an offer.');
    }
  };

  return (
    <div className="mx-auto max-w-3xl px-5 py-12">
      <button onClick={() => nav(-1)} className="mb-5 inline-flex items-center gap-1.5 text-sm font-semibold text-mute hover:text-primary">
        <ArrowLeft size={15} /> Back
      </button>

      <div className="card flex flex-wrap items-center gap-5 p-6">
        {p.photo ? (
          <img src={p.photo} alt={p.name} className="h-20 w-20 flex-shrink-0 rounded-2xl object-cover ring-1 ring-white/15" />
        ) : (
          <div className="grid h-20 w-20 flex-shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-primary to-primary-2 font-display text-3xl font-bold text-white">{initials(p.name)}</div>
        )}
        <div className="min-w-[200px] flex-1">
          <h1 className="flex items-center gap-2 font-display text-2xl font-bold">
            {p.name} {p.country && p.country.length === 2
              ? <img src={`https://flagcdn.com/h24/${p.country.toLowerCase()}.png`} alt={p.country} className="h-4 w-auto rounded-[2px] ring-1 ring-white/10" />
              : <span className="text-xl">{FLAG[p.country]}</span>}
            {p.pro && <span className="rounded bg-gradient-to-r from-primary to-primary-2 px-2 py-0.5 text-[10px] font-extrabold text-white">PRO</span>}
            {p.verified && <BadgeCheck size={20} className="text-sky" />}
          </h1>
          <div className="mt-1 text-mute">Football · {p.pos}{p.age ? ` · Age ${p.age}` : ''}{p.foot && p.foot !== '—' ? ` · ${p.foot} foot` : ''}</div>
          {p.skillLevel && (
            <div className="mt-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/[0.08] px-3 py-1 text-[12px] font-semibold text-primary">
                <Sparkles size={12} /> {p.skillLevel} level
              </span>
            </div>
          )}
          <div className="mt-2 text-[13px] text-mute">No club reviews yet</div>
        </div>
        <div className="flex flex-wrap gap-2">
          <button onClick={() => setShowCard(true)} className="btn-ghost"><Sparkles size={15} /> Talenta Card</button>
          <ShareMenu text={`${p.name} — ${p.pos} on Talenta ⚽`} />
          <button onClick={contact} className="btn-primary"><Send size={16} /> Contact Player</button>
        </div>
      </div>

      {/* Brand sponsors — shown publicly (a badge of credibility for the player) */}
      {p.sponsors && p.sponsors.length > 0 && (
        <div className="card mt-6 flex flex-wrap items-center gap-x-5 gap-y-3 p-5">
          <span className="text-[11px] font-bold uppercase tracking-wider text-mute">Sponsored by</span>
          {p.sponsors.map((s, i) => {
            const chip = (
              <span className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white px-3 py-2">
                <img src={s.logo} alt={s.name} className="h-6 w-6 object-contain" loading="lazy" />
                <span className="text-[13px] font-semibold text-ink">{s.name}</span>
              </span>
            );
            return s.url
              ? <a key={i} href={s.url} target="_blank" rel="noopener noreferrer" className="transition hover:-translate-y-0.5">{chip}</a>
              : <span key={i}>{chip}</span>;
          })}
        </div>
      )}

      {/* Access notice — full data is gated to clubs, academies & scouts */}
      {!isClub && (
        <div className="card mt-6 flex flex-wrap items-center justify-between gap-3 border-primary/30 bg-primary/[0.05] p-4">
          <div className="flex items-center gap-2.5 text-[13px]">
            <span className="grid h-9 w-9 flex-shrink-0 place-items-center rounded-lg bg-primary/15 text-primary"><Lock size={16} /></span>
            <span className="text-mute">You're viewing a <b className="text-slate-200">public preview</b> — profile + one video. Full stats, value, history & all photos are for clubs & scouts.</span>
          </div>
          <Link to="/signup" className="btn-primary flex-shrink-0">Unlock as Club / Scout</Link>
        </div>
      )}

      {/* Photo gallery — face, full-body (kit/ground), action shots */}
      {(() => {
        const all = (p.photos && p.photos.length ? p.photos : (p.photo ? [p.photo] : [])).slice(0, 3);
        if (!all.length) return null;
        const labels = ['Face', 'Full body', 'Action'];
        const gallery = isClub ? all : all.slice(0, 1); // public sees the face photo only
        const lockedCount = all.length - gallery.length;
        return (
          <div className="mt-6">
            <h2 className="mb-3 font-display text-lg font-bold">Photos</h2>
            <div className="grid grid-cols-3 gap-3">
              {gallery.map((src, i) => (
                <a key={i} href={src} target="_blank" rel="noopener noreferrer" className="group relative block overflow-hidden rounded-xl2 border border-white/10 bg-ink">
                  <img src={src} alt={`${p.name} ${labels[i] || ''}`} loading="lazy" className="aspect-[3/4] w-full object-cover transition group-hover:scale-105" />
                  <span className="absolute bottom-2 left-2 rounded-md bg-black/65 px-2 py-0.5 text-[10.5px] font-semibold backdrop-blur">{labels[i] || `Photo ${i + 1}`}</span>
                </a>
              ))}
              {lockedCount > 0 && (
                <Link to="/signup" className="grid aspect-[3/4] place-items-center rounded-xl2 border border-dashed border-white/15 bg-white/[0.03] text-center text-mute transition hover:border-primary">
                  <span><Lock size={18} className="mx-auto" /><span className="mt-1.5 block text-[12px] font-semibold">+{lockedCount} photo{lockedCount > 1 ? 's' : ''}</span><span className="text-[10.5px]">clubs only</span></span>
                </Link>
              )}
            </div>
          </div>
        );
      })()}

      {/* Sponsor / support a player */}
      <div className="card mt-6 overflow-hidden border-accent/30 bg-gradient-to-br from-accent/[0.09] to-transparent p-6">
        <div className="flex items-center gap-2 text-accent"><Heart size={16} fill="currentColor" /> <span className="text-[11.5px] font-bold uppercase tracking-wider">Support a dream</span></div>
        <h2 className="mt-2 font-display text-xl font-bold">Sponsor {p.name}'s journey</h2>
        <p className="mt-2 max-w-2xl text-[13.5px] leading-relaxed text-mute">
          Many talented young footballers can't afford boots, travel to trials, or quality coaching. Become a sponsor and
          help {p.name} chase their dream — every contribution goes toward their football journey.
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <a
            href={`https://wa.me/919526137000?text=${encodeURIComponent(`Hi Talenta, I'd like to sponsor ${p.name}'s football journey. Please share the details.`)}`}
            target="_blank" rel="noopener noreferrer" className="btn-primary">
            <Heart size={16} fill="white" /> Become a sponsor
          </a>
          <ShareMenu text={`Help ${p.name} reach their football dream on Talenta ⚽💚`} label="Share & spread the word" />
        </div>
        <p className="mt-3 text-[11.5px] text-mute">Talenta connects sponsors directly with players — transparent and fee-free.</p>
      </div>

      {/* Estimated value & offers — clubs & academies only */}
      {isClub ? (
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
        ) : null}
      </div>
      ) : <LockedNotice title="Estimated value & offers" />}

      {isClub && (
        <div className="card mt-6 p-6">
          <h2 className="font-display text-lg font-bold">Rate this player</h2>
          <p className="mt-1 text-[13px] text-mute">Reviews keep Talenta trustworthy — you'll be able to rate {p.name} after a verified trial or signing with them on the platform.</p>
          <div className="mt-4 flex items-center gap-2.5 rounded-xl border border-dashed border-white/15 bg-white/[0.03] p-4 text-[13px] text-mute">
            <Lock size={16} className="flex-shrink-0 text-primary" />
            Rating unlocks after a verified interaction with this player — this stops fake reviews.
          </div>
        </div>
      )}

      <h2 className="mb-4 mt-9 font-display text-lg font-bold">Career timeline</h2>
      {!isClub ? <LockedNotice title="Career history" /> : p.career.length ? (
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
      {!isClub ? <LockedNotice title="Full career stats" /> : Object.keys(p.stats).length ? (
        <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-4">
          {Object.entries(p.stats).map(([k, v]) => (
            <div key={k} className="card p-4">
              <div className="font-display text-2xl font-bold">{v}</div>
              <div className="mt-0.5 text-[11px] uppercase tracking-wide text-mute">{k}</div>
            </div>
          ))}
        </div>
      ) : <p className="text-[13px] text-mute">No stats added yet.</p>}

      {/* Lifetime journey — clubs only, when the player has shared entries */}
      {isClub && logs.length > 0 && (
        <>
          <h2 className="mb-4 mt-9 font-display text-lg font-bold">Journey &amp; development</h2>
          <div className="card p-6"><JourneyTimeline logs={logs} /></div>
        </>
      )}

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
      ) : p.igUrl ? (
        <div className="w-full max-w-[360px] overflow-hidden rounded-xl2 border border-white/10 bg-white">
          <iframe className="h-[560px] w-full" src={`${p.igUrl}embed`} title={p.name} allowFullScreen scrolling="no" />
        </div>
      ) : <p className="text-[13px] text-mute">No highlight video uploaded yet.</p>}

      {showCard && <TalentaCard player={p} onClose={() => setShowCard(false)} />}
    </div>
  );
}

// Placeholder shown to public viewers in place of premium data (full stats,
// value, history, extra photos). Clubs/academies/scouts see the real content.
function LockedNotice({ title }: { title: string }) {
  return (
    <div className="card flex flex-col items-center gap-2 border-dashed border-white/15 p-7 text-center">
      <span className="grid h-11 w-11 place-items-center rounded-full bg-primary/15 text-primary"><Lock size={18} /></span>
      <div className="font-semibold">{title} — for clubs &amp; scouts</div>
      <p className="max-w-sm text-[13px] leading-relaxed text-mute">
        Full data is unlocked for verified clubs, academies & scouts — complete stats, estimated value, career history and all photos.
      </p>
      <Link to="/signup" className="btn-primary mt-1">Unlock as Club / Scout</Link>
    </div>
  );
}

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Play, ChevronRight, BadgeCheck, Sparkles, ShieldCheck,
  Youtube, Percent, UserPlus, Eye, Trophy, Search,
  Building2, GraduationCap, School, Landmark, Bot, Video, Target, type LucideIcon,
} from 'lucide-react';
import { COUNTRIES, SPORTS, type Player } from '../data';
import { PlayerGridCard } from '../components/PlayerCard';
import Reveal from '../components/Reveal';
import { usePlayers } from '../usePlayers';
import { apiEnabled, fetchInstitutions, type Institution } from '../api';

// Honest, founding-phase metrics — punchy numbers, no inflated claims.
const stats = [
  { icon: Sparkles, n: 'Free', l: 'For players' },
  { icon: Trophy, n: 'Football', l: 'Live now' },
  { icon: BadgeCheck, n: `${COUNTRIES.length}+`, l: 'Countries' },
  { icon: Percent, n: '3%', l: 'Only on deals' },
];

// Short benefit lines — 5–6 words, scannable, no paragraphs.
const benefits = [
  { icon: Sparkles, h: 'AI talent matching', p: 'Clubs get ranked suggestions — no endless scrolling.' },
  { icon: ShieldCheck, h: 'Verified profiles', p: 'ID, age & history checks build trust.' },
  { icon: Youtube, h: 'Free video reels', p: '60-second skill reels, hosted free.' },
  { icon: Percent, h: 'Direct deals', p: 'No agents. Just 3% on signings.' },
];

// "Powered by AI" — what's live today vs the AI roadmap we're building next.
const aiFeatures: { icon: LucideIcon; h: string; p: string; live: boolean }[] = [
  { icon: Sparkles, h: 'AI Talent Score', p: 'A clear, data-driven score per player.', live: true },
  { icon: Bot, h: 'AI Assistant', p: 'Instant answers, in plain language.', live: true },
  { icon: Video, h: 'AI Video Analysis', p: 'Auto-extract pace, technique & position.', live: false },
  { icon: Target, h: 'Smart Club Matching', p: 'Match each player to the right clubs.', live: false },
];

const steps = [
  { icon: UserPlus, h: 'Create your profile', p: 'Build a verified profile + a 60-second reel — free.' },
  { icon: Eye, h: 'Get discovered', p: 'Appear in the AI feed. Clubs & academies find you.' },
  { icon: Trophy, h: 'Get signed', p: 'Clubs contact you on-platform and sign you.' },
];

// Football nations — ISO codes; rendered as real flag images (flagcdn) so they
// display correctly on every device (Windows/Edge don't render flag emoji).
const FLAGS = ['br','ar','fr','de','es','pt','gb-eng','it','nl','be','ng','gh','cm','sn','eg','ma','ci','jp','kr','sa','qa','ae','in','au','us','mx','co','uy','cl','hr','dk','se','no','pl','ch','gb-sct','gb-wls','ie','tr'];


export default function Landing() {
  const { players, loading: playersLoading } = usePlayers();
  const gridPlayers = players.slice(0, 8);
  return (
    <div>
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-[1]">
          <iframe
            className="pointer-events-none absolute left-1/2 top-1/2 h-[100vh] w-[177.78vh] min-h-[56.25vw] min-w-full -translate-x-1/2 -translate-y-1/2"
            src="https://www.youtube.com/embed/5nTsWZODuqY?autoplay=1&mute=1&loop=1&playlist=5nTsWZODuqY&controls=0&modestbranding=1&playsinline=1&rel=0&start=3"
            allow="autoplay; encrypted-media" title="background" />
          <div className="absolute inset-0 bg-gradient-to-b from-ink/60 via-ink/75 to-ink/95" />
        </div>
        <div className="mx-auto max-w-6xl px-5 py-24 text-center md:py-32">
          <div className="mx-auto mb-7 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.05] px-4 py-2 text-[13px] text-mute">
            <span className="h-2 w-2 rounded-full bg-accent shadow-[0_0_8px_#FF2A4D]" />
            Early access · Football · {COUNTRIES.length}+ countries
          </div>
          <h1 className="font-display text-5xl font-bold leading-[1.05] md:text-7xl">
            Connect your talent<br />to your <span className="grad-text">dream club</span>.
          </h1>
          {/* Two clear paths — player vs scout/club. No long paragraph. */}
          <div className="mt-9 flex flex-wrap justify-center gap-3">
            <Link to="/signup" className="btn-primary text-base"><Play size={18} fill="white" /> Join Free as Player</Link>
            <Link to="/signup" className="btn-ghost text-base"><Search size={17} /> Find Talent — Scouts &amp; Clubs</Link>
          </div>
          <p className="mt-4 text-[13px] text-mute">Free for players · No agent fees · Verified profiles</p>
        </div>
      </section>

      {/* GLOBAL FLAGS STRIP */}
      <section className="relative overflow-hidden border-y border-white/10 bg-ink/50 py-6">
        <p className="mb-4 text-center text-[12px] font-semibold uppercase tracking-[0.25em] text-mute">
          Talent from every corner of the world 🌍
        </p>
        <div className="relative">
          <div className="flags-track flex w-max items-center gap-6">
            {[...FLAGS, ...FLAGS].map((c, i) => (
              <img key={i} src={`https://flagcdn.com/h40/${c}.png`} alt="" loading="lazy"
                className="h-7 w-auto select-none rounded shadow-sm shadow-black/40 ring-1 ring-white/10 transition-transform duration-200 hover:scale-125" />
            ))}
          </div>
          <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-ink to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-ink to-transparent" />
        </div>
        <style>{`.flags-track{animation:flagscroll 45s linear infinite}.flags-track:hover{animation-play-state:paused}@keyframes flagscroll{from{transform:translateX(0)}to{transform:translateX(-50%)}}`}</style>
      </section>

      <div className="mx-auto max-w-7xl px-5">
        {/* STATS */}
        <Reveal>
          <div className="mt-12 grid grid-cols-2 gap-4 md:grid-cols-4">
            {stats.map((s) => (
              <div key={s.l} className="card p-5 text-center">
                <s.icon size={20} className="mx-auto mb-2 text-primary" />
                <div className="font-display text-3xl font-bold grad-text">{s.n}</div>
                <div className="mt-1 text-[11.5px] uppercase tracking-wide text-mute">{s.l}</div>
              </div>
            ))}
          </div>
        </Reveal>

        {/* PLAYER GRID — photo-forward cards, like a scouting board */}
        <Heading title="Watch real talent in action" sub="Tap any player to see their reel, stats & full profile" center />
        {playersLoading ? (
          <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => <div key={i} className="aspect-[4/5] animate-pulse rounded-xl2 border border-white/10 bg-white/[0.03]" />)}
          </div>
        ) : gridPlayers.length ? (
          <>
            <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
              {gridPlayers.map((p) => <PlayerGridCard key={p.id} player={p} />)}
            </div>
            <div className="mt-7 text-center">
              <Link to="/browse" className="btn-ghost">Browse all players <ChevronRight size={15} /></Link>
            </div>
          </>
        ) : (
          <div className="rounded-xl2 border border-dashed border-white/15 p-10 text-center text-mute">
            No players yet — be the very first to upload a reel and get discovered. ⚽
          </div>
        )}

        {/* INSTITUTIONS DIRECTORY — clubs, academies, schools, universities */}
        <Heading title="Clubs, academies & institutions" sub="Discovering talent on Talenta" center />
        <InstitutionsDirectory />

        {/* LEGENDS / CALLIGRAPHY ART BAND */}
        <Reveal>
          <div className="relative mt-20 overflow-hidden rounded-xl2 border border-primary/25 bg-gradient-to-br from-primary/[0.12] via-ink to-ink p-8 md:p-14">
            <svg viewBox="0 0 400 400" className="pointer-events-none absolute -right-12 -top-16 h-[150%] w-auto opacity-[0.16]" fill="none" stroke="url(#ball)" strokeWidth="2.5">
              <defs>
                <linearGradient id="ball" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0" stopColor="#FF5A2C" /><stop offset="1" stopColor="#FFB23C" />
                </linearGradient>
              </defs>
              <circle cx="200" cy="200" r="118" />
              <circle cx="200" cy="200" r="150" strokeDasharray="4 12" />
              <polygon points="200,150 236,177 222,219 178,219 164,177" fill="url(#ball)" opacity="0.55" stroke="none" />
              <path d="M82 200a118 118 0 0 1 236 0" />
              <path d="M150 95l28 48M250 95l-28 48M120 300l34-44M280 300l-34-44" />
            </svg>
            <div className="relative z-10 max-w-2xl">
              <span className="text-[12px] font-semibold uppercase tracking-[0.25em] text-primary">The next great footballer</span>
              <h2 className="mt-2 leading-[1.05] grad-text" style={{ fontFamily: "'Dancing Script', cursive", fontSize: 'clamp(2.6rem, 6vw, 4.5rem)', fontWeight: 700 }}>
                Every legend started as<br />a kid with a ball.
              </h2>
              <Link to="/signup" className="btn-primary mt-7 inline-flex"><Play size={18} fill="white" /> Start your journey</Link>
            </div>

            {/* upcoming sports — small scrolling strip (replaces the old big "coming soon" grid) */}
            <div className="relative z-10 mt-9 overflow-hidden border-t border-white/10 pt-4">
              <span className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.2em] text-mute">One platform · every sport</span>
              <div className="relative overflow-hidden">
                <div className="sports-marquee flex w-max items-center gap-7 whitespace-nowrap text-[13px]">
                  {[...SPORTS, ...SPORTS].map((s, i) => (
                    <span key={i} className="inline-flex items-center gap-2 text-mute">
                      <span className="text-base">{s[1]}</span>
                      <b className="text-slate-200">{s[0]}</b>
                      <span className={`rounded-full px-2 py-0.5 text-[9px] font-extrabold ${s[2] ? 'bg-accent text-white' : 'border border-white/15 text-mute'}`}>{s[2] ? 'LIVE' : 'SOON'}</span>
                    </span>
                  ))}
                </div>
                <div className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-ink to-transparent" />
              </div>
              <style>{`.sports-marquee{animation:sportscroll 28s linear infinite}.sports-marquee:hover{animation-play-state:paused}@keyframes sportscroll{from{transform:translateX(0)}to{transform:translateX(-50%)}}`}</style>
            </div>
          </div>
        </Reveal>

        {/* WHY TALENTA — compact horizontal rows (not big boxes) */}
        <Heading title="Why Talenta" sub="Built to get talent seen — and signed" center />
        <div className="grid gap-4 sm:grid-cols-2">
          {benefits.map((b, i) => (
            <Reveal key={b.h} delay={i * 70}>
              <div className="card flex items-center gap-4 p-5">
                <span className="grid h-12 w-12 flex-shrink-0 place-items-center rounded-xl bg-primary/15 text-primary"><b.icon size={22} /></span>
                <div className="min-w-0">
                  <h3 className="font-bold">{b.h}</h3>
                  <p className="text-[13px] text-mute">{b.p}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        {/* POWERED BY AI — heat-map visual + compact feature list (no repeated boxes) */}
        <Heading title="Powered by AI" sub="Smart technology so talent rises on merit — live today, with a bold roadmap ahead" center />
        <Reveal>
          <div className="grid items-stretch gap-6 lg:grid-cols-2">
            <HeatMapViz />
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
              {aiFeatures.map((a) => (
                <div key={a.h} className="card flex items-start gap-3.5 p-5">
                  <span className="grid h-10 w-10 flex-shrink-0 place-items-center rounded-xl bg-primary/15 text-primary"><a.icon size={19} /></span>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold">{a.h}</h3>
                      <span className={`rounded-full px-2 py-0.5 text-[9px] font-extrabold ${a.live ? 'bg-accent text-white' : 'border border-white/10 bg-white/[0.06] text-mute'}`}>{a.live ? '● LIVE' : 'SOON'}</span>
                    </div>
                    <p className="mt-1 text-[12.5px] leading-relaxed text-mute">{a.p}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Reveal>

        {/* HOW IT WORKS */}
        <Heading title="How it works" sub="From unknown to signed — in three steps" center />
        <div className="grid gap-5 md:grid-cols-3">
          {steps.map((s, i) => (
            <Reveal key={s.h} delay={i * 100}>
              <div className="card relative h-full p-7">
                <span className="absolute right-5 top-5 font-display text-5xl font-bold text-white/[0.06]">{i + 1}</span>
                <div className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-primary to-primary-2 text-white"><s.icon size={22} /></div>
                <h3 className="mt-4 text-lg font-bold">{s.h}</h3>
                <p className="mt-2 text-sm leading-relaxed text-mute">{s.p}</p>
              </div>
            </Reveal>
          ))}
        </div>

        {/* SPONSORSHIP & PARTNERSHIPS — logo-free, honest CTA (no third-party trademarks) */}
        <Heading title="Sponsorship & partnerships" sub="Standout players attract brands. Talenta helps rising talent earn sponsorships — and welcomes partners who want to back the next generation." center />
        <Reveal>
          <div className="card overflow-hidden border-primary/25 bg-gradient-to-br from-primary/[0.10] via-ink to-ink p-8 text-center md:p-10">
            <span className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-primary/15 text-primary"><Sparkles size={22} /></span>
            <h3 className="mt-3 font-display text-xl font-bold md:text-2xl">Back the next generation of talent</h3>
            <p className="mx-auto mt-2 max-w-xl text-[14px] leading-relaxed text-mute">
              Brands, sponsors and partners can support rising players, academies and tournaments on Talenta —
              and reach a young, football-obsessed audience worldwide.
            </p>
            <div className="mt-5 flex flex-wrap justify-center gap-3">
              <a href="mailto:sportstalenta@gmail.com?subject=Sponsorship%20%26%20Partnership%20with%20Talenta" className="btn-primary"><Sparkles size={16} /> Become a sponsor / partner</a>
              <Link to="/signup" className="btn-ghost">Sponsor a rising star</Link>
            </div>
          </div>
        </Reveal>

        {/* FOUNDING MEMBERS — FREE OFFER (single closing CTA) */}
        <Reveal>
          <div className="card relative mt-20 overflow-hidden border-primary/40 bg-gradient-to-br from-primary/[0.12] via-ink to-ink p-8 text-center md:p-12">
            <span className="inline-flex items-center gap-2 rounded-full border border-accent/40 bg-accent/[0.12] px-4 py-1.5 text-[12.5px] font-semibold text-accent">
              🎉 Limited founding offer
            </span>
            <h2 className="mt-4 font-display text-3xl font-bold leading-tight md:text-5xl">
              Free for our first<br /><span className="grad-text">1,000 players</span> &amp; <span className="grad-text">100 institutions</span>
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-mute">
              Be a founding member — the first <b className="text-slate-200">1,000 footballers</b> get Talenta Pro free,
              and the first <b className="text-slate-200">100 clubs, academies & schools</b> join completely free.
            </p>
            <div className="mx-auto mt-7 flex max-w-lg flex-wrap justify-center gap-4">
              <div className="min-w-[150px] flex-1 rounded-xl border border-primary/30 bg-primary/[0.06] p-4">
                <div className="font-display text-3xl font-bold grad-text">1,000</div>
                <div className="mt-1 text-[12px] uppercase tracking-wide text-mute">Players · Pro FREE</div>
              </div>
              <div className="min-w-[150px] flex-1 rounded-xl border border-primary/30 bg-primary/[0.06] p-4">
                <div className="font-display text-3xl font-bold grad-text">100</div>
                <div className="mt-1 text-[12px] uppercase tracking-wide text-mute">Clubs · Schools · Universities FREE</div>
              </div>
            </div>
            <div className="mt-7 flex flex-wrap justify-center gap-3">
              <Link to="/signup" className="btn-primary text-base"><Play size={18} fill="white" /> Claim your free spot</Link>
              <Link to="/faq" className="btn-ghost">How it works</Link>
            </div>
          </div>
        </Reveal>
      </div>
    </div>
  );
}

function Heading({ title, sub, center }: { title: string; sub: string; center?: boolean }) {
  return (
    <div className={`mb-7 mt-20 ${center ? 'text-center' : ''}`}>
      <h2 className="font-display text-2xl font-bold md:text-3xl">{title}</h2>
      <p className="mt-1.5 text-sm text-mute">{sub}</p>
    </div>
  );
}

// Original football "performance heat-map" visual — illustrates AI/GPS data
// without a single line of paragraph text. Pure SVG, no copyrighted assets.
function HeatMapViz() {
  // activity blobs on a pitch — x%, y%, radius, intensity colour
  const blobs = [
    { x: 30, y: 50, r: 95, c: '#FF2A4D', o: 0.55 },
    { x: 55, y: 38, r: 70, c: '#FF5A2C', o: 0.5 },
    { x: 70, y: 62, r: 60, c: '#FFB23C', o: 0.45 },
    { x: 82, y: 48, r: 48, c: '#FFD23C', o: 0.4 },
    { x: 42, y: 70, r: 50, c: '#FF5A2C', o: 0.38 },
  ];
  return (
    <div className="card relative overflow-hidden p-5">
      <div className="mb-3 flex items-center justify-between">
        <span className="text-[12px] font-semibold uppercase tracking-wider text-mute">AI movement heat-map</span>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-accent/15 px-2.5 py-1 text-[10px] font-bold text-accent"><span className="h-1.5 w-1.5 rounded-full bg-accent" /> SAMPLE</span>
      </div>
      <svg viewBox="0 0 400 250" className="w-full rounded-xl" style={{ background: 'linear-gradient(160deg,#0c1f12,#0a1a2e)' }}>
        <defs>
          {blobs.map((b, i) => (
            <radialGradient key={i} id={`hm${i}`}>
              <stop offset="0%" stopColor={b.c} stopOpacity={b.o} />
              <stop offset="100%" stopColor={b.c} stopOpacity="0" />
            </radialGradient>
          ))}
        </defs>
        {/* pitch markings */}
        <g stroke="#ffffff" strokeOpacity="0.25" fill="none" strokeWidth="1.5">
          <rect x="12" y="12" width="376" height="226" rx="4" />
          <line x1="200" y1="12" x2="200" y2="238" />
          <circle cx="200" cy="125" r="34" />
          <rect x="12" y="70" width="46" height="110" />
          <rect x="342" y="70" width="46" height="110" />
        </g>
        {/* heat blobs */}
        {blobs.map((b, i) => (
          <ellipse key={i} cx={b.x / 100 * 400} cy={b.y / 100 * 250} rx={b.r} ry={b.r * 0.7} fill={`url(#hm${i})`} />
        ))}
      </svg>
      <div className="mt-3 grid grid-cols-3 gap-3 text-center">
        {[['Top speed', '32.4 km/h'], ['Distance', '11.2 km'], ['Sprints', '24']].map(([l, v]) => (
          <div key={l} className="rounded-lg border border-white/10 bg-white/[0.03] py-2">
            <div className="font-display text-base font-bold grad-text">{v}</div>
            <div className="text-[10px] uppercase tracking-wide text-mute">{l}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Directory of registered clubs, academies, schools & universities, grouped by category.
const INSTITUTION_CATEGORIES: { key: string; label: string; icon: LucideIcon; match: (i: Institution) => boolean }[] = [
  { key: 'clubs', label: 'Clubs & Scouts', icon: Building2, match: (i) => i.role === 'CLUB' },
  { key: 'academies', label: 'Academies', icon: GraduationCap, match: (i) => i.role === 'ACADEMY' && (!i.orgType || i.orgType === 'Academy') },
  { key: 'schools', label: 'Schools & Colleges', icon: School, match: (i) => i.orgType === 'School' },
  { key: 'universities', label: 'Universities', icon: Landmark, match: (i) => i.orgType === 'University' },
];

function InstitutionsDirectory() {
  const [items, setItems] = useState<Institution[]>([]);
  const [loading, setLoading] = useState(apiEnabled);

  useEffect(() => {
    if (!apiEnabled) { setLoading(false); return; }
    let alive = true;
    fetchInstitutions()
      .then((list) => { if (alive) { setItems(Array.isArray(list) ? list : []); setLoading(false); } })
      .catch(() => { if (alive) setLoading(false); });
    return () => { alive = false; };
  }, []);

  if (loading) {
    return (
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-40 animate-pulse rounded-xl2 border border-white/10 bg-white/[0.03]" />)}
      </div>
    );
  }

  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {INSTITUTION_CATEGORIES.map((cat) => {
        const list = items.filter(cat.match);
        return (
          <div key={cat.key} className="card flex flex-col p-6">
            <div className="flex items-center gap-2.5">
              <span className="grid h-10 w-10 flex-shrink-0 place-items-center rounded-xl bg-primary/15 text-primary"><cat.icon size={19} /></span>
              <div className="min-w-0">
                <div className="font-bold leading-tight">{cat.label}</div>
                <div className="text-[12px] text-mute">{list.length} joined</div>
              </div>
            </div>
            <div className="mt-4 flex-1 space-y-2">
              {list.length ? list.slice(0, 5).map((it) => (
                <div key={it.id} className="flex items-center gap-2 text-[13px]">
                  {it.logo ? (
                    <img src={it.logo} alt="" loading="lazy" className="h-5 w-5 flex-shrink-0 rounded-md object-cover ring-1 ring-white/10" />
                  ) : (
                    <span className="grid h-5 w-5 flex-shrink-0 place-items-center rounded-md bg-primary/15 text-[9px] font-bold text-primary">{it.name.slice(0, 2).toUpperCase()}</span>
                  )}
                  <span className="truncate">{it.name}</span>
                  {it.verified && <BadgeCheck size={13} className="flex-shrink-0 text-sky" />}
                </div>
              )) : (
                <p className="text-[12.5px] leading-relaxed text-mute">
                  No {cat.label.toLowerCase()} yet — <Link to="/signup" className="font-semibold text-primary">be the first to join</Link>.
                </p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

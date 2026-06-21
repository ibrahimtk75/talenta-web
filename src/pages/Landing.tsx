import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Play, Users, ChevronRight, BadgeCheck, Sparkles, ShieldCheck,
  Youtube, Percent, UserPlus, Eye, Trophy, ChevronDown,
  Building2, GraduationCap, School, Landmark, type LucideIcon,
} from 'lucide-react';
import { SPORTS, COUNTRIES, FLAG, type Player } from '../data';
import Reveal from '../components/Reveal';
import { usePlayers } from '../usePlayers';
import { apiEnabled, fetchInstitutions, type Institution } from '../api';

const stats = [
  { icon: Sparkles, n: 'Free', l: 'For players' },
  { icon: Trophy, n: 'Football', l: 'Live now' },
  { icon: BadgeCheck, n: `${COUNTRIES.length}+`, l: 'Countries' },
  { icon: Percent, n: '3%', l: 'Only on deals' },
];

const benefits = [
  { icon: Sparkles, h: 'AI talent matching', p: 'Clubs get player suggestions ranked by position, age, stats & activity — not endless scrolling.' },
  { icon: ShieldCheck, h: 'Verified profiles', p: 'ID, age & club-history verification + two-way ratings build trust on both sides.' },
  { icon: Youtube, h: 'Zero-cost video', p: '60-second skill reels & full matches hosted free on YouTube — no hosting bills.' },
  { icon: Percent, h: 'On-platform deals', p: 'Contracts and signings happen on Talenta. We take just 3% on successful deals.' },
];

const steps = [
  { icon: UserPlus, h: 'Create your profile', p: 'Players build a verified career profile and upload a 60-second skill reel — free to start.' },
  { icon: Eye, h: 'Get discovered', p: 'Your profile appears in the AI feed. Clubs, academies & schools search and find you.' },
  { icon: Trophy, h: 'Get signed', p: 'Clubs contact you on-platform, set up trials, and sign you. Reputation grows with ratings.' },
];

const audiences = [
  { icon: Trophy, h: 'For Players', p: 'Build a free profile, post 60-second skill reels and set your asking price. Get discovered by clubs & academies worldwide — and signed.', cta: 'Join as Player' },
  { icon: Building2, h: 'For Clubs & Scouts', p: 'Search players or get AI-matched by position, age & stats. Watch reels, contact, negotiate and sign — all on one dashboard.', cta: 'Join as Club' },
  { icon: GraduationCap, h: 'For Academies & Schools', p: 'Showcase your players, build your institution profile, and discover talent across the whole network.', cta: 'Join as Academy' },
];

const faqs = [
  ['Is it really free for players?', 'Yes. Players join free, build a profile and post one reel at no cost. The optional Pro plan adds unlimited videos, daily practice, a verified badge and boosted visibility.'],
  ['Who can register?', 'Players, professional clubs, scouts, academies, schools and universities — worldwide. Each gets a tailored profile and tools.'],
  ['How does Talenta make money?', 'Club & academy subscriptions, an optional player Pro plan, and a 3% commission only on successful deals signed through the platform.'],
  ['Are young players protected?', 'Yes. Under-18 players require guardian consent, and clubs contact them only through the platform with guardians notified — safeguarding is built in.'],
  ['Which sports are supported?', 'We launch with Football. Cricket, Basketball, Hockey and Tennis are coming next on the same platform.'],
];

// Football nations — ISO codes; rendered as real flag images (flagcdn) so they
// display correctly on every device (Windows/Edge don't render flag emoji).
const FLAGS = ['br','ar','fr','de','es','pt','gb-eng','it','nl','be','ng','gh','cm','sn','eg','ma','ci','jp','kr','sa','qa','ae','in','au','us','mx','co','uy','cl','hr','dk','se','no','pl','ch','gb-sct','gb-wls','ie','tr'];

export default function Landing() {
  const { players, loading: playersLoading } = usePlayers();
  const videoPlayers = players.filter((p) => p.yt).slice(0, 6);
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
            Now in early access · Football · {COUNTRIES.length}+ countries
          </div>
          <h1 className="font-display text-5xl font-bold leading-[1.05] md:text-7xl">
            Connect your talent<br />to your <span className="grad-text">dream club</span>.
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-mute">
            <b className="text-slate-200">Get discovered. Get signed.</b> Footballers build a verified video
            profile for free — clubs, academies & scouts discover talent and connect directly, worldwide.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link to="/signup" className="btn-primary text-base"><Play size={18} fill="white" /> Join Free as Player</Link>
            <Link to="/signup" className="btn-ghost">For Clubs</Link>
            <Link to="/signup" className="btn-ghost">🎓 Academies & Schools</Link>
          </div>
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
          {/* edge fades */}
          <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-ink to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-ink to-transparent" />
        </div>
        <style>{`.flags-track{animation:flagscroll 45s linear infinite}.flags-track:hover{animation-play-state:paused}@keyframes flagscroll{from{transform:translateX(0)}to{transform:translateX(-50%)}}`}</style>
      </section>

      <div className="mx-auto max-w-6xl px-5">
        {/* STATS */}
        <Reveal>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {stats.map((s) => (
              <div key={s.l} className="card p-5 text-center">
                <s.icon size={20} className="mx-auto mb-2 text-primary" />
                <div className="font-display text-3xl font-bold grad-text">{s.n}</div>
                <div className="mt-1 text-[11.5px] uppercase tracking-wide text-mute">{s.l}</div>
              </div>
            ))}
          </div>
        </Reveal>

        {/* LEGENDS / CALLIGRAPHY ART BAND */}
        <Reveal>
          <div className="relative mt-20 overflow-hidden rounded-xl2 border border-primary/25 bg-gradient-to-br from-primary/[0.12] via-ink to-ink p-8 md:p-14">
            {/* decorative football + pitch arcs (original art) */}
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
              <p className="mt-5 max-w-lg leading-relaxed text-mute">
                From a dusty village ground to the world's biggest stadiums — greatness can come from anywhere.
                Talenta makes sure the world finally sees them.
              </p>
              <Link to="/signup" className="btn-primary mt-7 inline-flex"><Play size={18} fill="white" /> Start your journey</Link>
            </div>
          </div>
        </Reveal>

        {/* WHO'S IT FOR */}
        <Heading title="Who's it for?" sub="Whatever your role in football — here's how Talenta works for you" center />
        <div className="grid gap-5 md:grid-cols-3">
          {audiences.map((a, i) => (
            <Reveal key={a.h} delay={i * 90}>
              <div className="card flex h-full flex-col p-7">
                <div className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-primary to-primary-2 text-white"><a.icon size={22} /></div>
                <h3 className="mt-4 text-lg font-bold">{a.h}</h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-mute">{a.p}</p>
                <Link to="/signup" className="btn-ghost mt-5 w-fit text-[13px]">{a.cta} <ChevronRight size={15} /></Link>
              </div>
            </Reveal>
          ))}
        </div>

        {/* WHY TALENTA */}
        <Heading title="Why Talenta" sub="Built to get talent seen — and signed" center />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {benefits.map((b, i) => (
            <Reveal key={b.h} delay={i * 80}>
              <div className="card h-full p-6">
                <div className="grid h-11 w-11 place-items-center rounded-xl bg-primary/15 text-primary"><b.icon size={20} /></div>
                <h3 className="mt-4 font-bold">{b.h}</h3>
                <p className="mt-2 text-[13.5px] leading-relaxed text-mute">{b.p}</p>
              </div>
            </Reveal>
          ))}
        </div>

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

        {/* WHO IT'S FOR */}
        <Heading title="Built for clubs, academies & schools" sub="Every level, every region — from grassroots academies to professional clubs" />
        <Reveal>
          <div className="flex flex-wrap gap-2.5">
            {['Professional clubs', 'Football academies', 'Schools & colleges', 'Universities', 'Scouts & agents', 'Grassroots clubs'].map((c) => (
              <div key={c} className="chip !py-2 !text-slate-100">{c}</div>
            ))}
          </div>
        </Reveal>

        {/* SIGNING MODEL */}
        <Heading title="Fair by design — no agent fees" sub="Contact, trial and sign all in one place. We charge just 3% — and only when a signing actually happens." />
        <div className="grid gap-4 sm:grid-cols-3">
          {[
            ['Free to join', 'Players build a profile and upload highlights for free. Going Pro is optional.'],
            ['Direct contact', 'Clubs and scouts message players directly — no middlemen, no gatekeepers.'],
            ['3% on success', 'No upfront cost to clubs for a deal. We only earn when a player actually gets signed.'],
          ].map(([h, p], i) => (
            <Reveal key={h} delay={i * 60}>
              <div className="card h-full p-5">
                <div className="font-bold">{h}</div>
                <p className="mt-1.5 text-[13px] leading-relaxed text-mute">{p}</p>
              </div>
            </Reveal>
          ))}
        </div>

        {/* PLAYER VIDEO SHOWCASE */}
        <Heading title="Watch real talent in action" sub="60-second skill reels from footballers on Talenta — tap to watch their full profile" center />
        {playersLoading ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => <div key={i} className="aspect-video animate-pulse rounded-xl2 border border-white/10 bg-white/[0.03]" />)}
          </div>
        ) : videoPlayers.length ? (
          <>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {videoPlayers.map((p) => <PlayerVideoCard key={p.id} player={p} />)}
            </div>
            <div className="mt-7 text-center">
              <Link to="/browse" className="btn-ghost">Browse all players <ChevronRight size={15} /></Link>
            </div>
          </>
        ) : (
          <div className="rounded-xl2 border border-dashed border-white/15 p-10 text-center text-mute">
            No player videos yet — be the very first to upload a reel and get discovered. ⚽
          </div>
        )}

        {/* INSTITUTIONS DIRECTORY — clubs, academies, schools, universities */}
        <Heading title="Clubs, academies & institutions" sub="The clubs, academies, schools & universities discovering talent on Talenta" center />
        <InstitutionsDirectory />

        {/* FOUNDING MEMBERS — FREE OFFER */}
        <Reveal>
          <div className="card relative mt-20 overflow-hidden border-primary/40 bg-gradient-to-br from-primary/[0.12] via-ink to-ink p-8 text-center md:p-12">
            <span className="inline-flex items-center gap-2 rounded-full border border-accent/40 bg-accent/[0.12] px-4 py-1.5 text-[12.5px] font-semibold text-accent">
              🎉 Limited founding offer
            </span>
            <h2 className="mt-4 font-display text-3xl font-bold leading-tight md:text-5xl">
              Free for our first<br /><span className="grad-text">1,000 players</span> &amp; <span className="grad-text">100 institutions</span>
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-mute">
              Be a founding member. The first <b className="text-slate-200">1,000 footballers</b> get Talenta Pro free,
              and the first <b className="text-slate-200">100 clubs, academies, schools &amp; universities</b> join completely free — just for being early.
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
            <div className="mt-6 flex flex-wrap justify-center gap-2 opacity-90">
              {FLAGS.slice(0, 20).map((c, i) => <img key={i} src={`https://flagcdn.com/h24/${c}.png`} alt="" loading="lazy" className="h-5 w-auto rounded-sm ring-1 ring-white/10" />)}
            </div>
            <div className="mt-7 flex flex-wrap justify-center gap-3">
              <Link to="/signup" className="btn-primary text-base"><Play size={18} fill="white" /> Claim your free spot</Link>
              <Link to="/signup" className="btn-ghost">For Clubs &amp; Academies</Link>
            </div>
          </div>
        </Reveal>

        {/* COMING SOON */}
        <Heading title="More sports — coming soon" sub="Talenta is built for 5 sports. Football is live now." />
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {SPORTS.map((s) => (
            <div key={s[0]} className={`card p-5 text-center ${s[2] ? 'border-primary/60 shadow-glow' : ''}`}>
              <div className="text-3xl">{s[1]}</div>
              <div className="mt-2.5 font-bold">{s[0]}</div>
              <span className={`mt-2 inline-block rounded-full px-3 py-1 text-[10.5px] font-extrabold ${s[2] ? 'bg-accent text-white' : 'border border-white/10 bg-white/[0.06] text-mute'}`}>{s[2] ? '● LIVE' : 'COMING SOON'}</span>
            </div>
          ))}
        </div>

        {/* FAQ */}
        <Heading title="Frequently asked questions" sub="Everything you need to know" center />
        <div className="mx-auto max-w-3xl space-y-3">
          {faqs.map(([q, a]) => <Faq key={q} q={q} a={a} />)}
        </div>

        {/* CTA */}
        <Reveal>
          <div className="card mt-16 overflow-hidden p-10 text-center md:p-14">
            <h2 className="font-display text-3xl font-bold md:text-4xl">Ready to get discovered?</h2>
            <p className="mx-auto mt-3 max-w-md text-mute">Be among the first footballers on Talenta. Free to start — get discovered worldwide.</p>
            <Link to="/signup" className="btn-primary mx-auto mt-6 w-fit text-base">Get started <ChevronRight size={18} /></Link>
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

// A player's video reel as a tappable thumbnail (links to the full profile).
function PlayerVideoCard({ player }: { player: Player }) {
  return (
    <Link to={`/player/${player.id}`} className="card group overflow-hidden">
      <div className="relative aspect-video overflow-hidden bg-ink">
        <img src={`https://img.youtube.com/vi/${player.yt}/hqdefault.jpg`} alt={`${player.name} skill reel`} loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/10 to-transparent" />
        <div className="absolute inset-0 grid place-items-center">
          <span className="grid h-14 w-14 place-items-center rounded-full bg-primary/90 text-white shadow-glow transition-transform group-hover:scale-110">
            <Play size={22} fill="white" />
          </span>
        </div>
        {player.verified && (
          <span className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full bg-ink/80 px-2 py-1 text-[11px] font-semibold text-sky backdrop-blur">
            <BadgeCheck size={12} /> Verified
          </span>
        )}
      </div>
      <div className="flex items-center justify-between p-4">
        <div className="min-w-0">
          <div className="flex items-center gap-1.5 font-semibold"><span className="truncate">{player.name}</span> <span>{FLAG[player.country] || '🌍'}</span></div>
          <div className="text-[12.5px] text-mute">{player.pos}{player.age ? ` · ${player.age}` : ''}</div>
        </div>
        {!!player.match && <span className="flex-shrink-0 rounded-lg bg-primary/15 px-2 py-1 text-[12px] font-bold text-primary">{player.match}</span>}
      </div>
    </Link>
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
                  <span>{FLAG[it.country] || '🌍'}</span>
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

function Faq({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="card overflow-hidden">
      <button onClick={() => setOpen((o) => !o)} className="flex w-full items-center justify-between gap-4 p-5 text-left font-semibold">
        {q}
        <ChevronDown size={18} className={`flex-shrink-0 text-mute transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      <div className={`grid transition-all duration-300 ${open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
        <div className="overflow-hidden">
          <p className="px-5 pb-5 text-[13.5px] leading-relaxed text-mute">{a}</p>
        </div>
      </div>
    </div>
  );
}

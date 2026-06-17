import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Play, Users, ChevronRight, BadgeCheck, Sparkles, ShieldCheck,
  Youtube, Percent, UserPlus, Eye, Trophy, ChevronDown,
  Building2, GraduationCap,
} from 'lucide-react';
import { CLUBS, DEALS, SPORTS, COUNTRIES, PLAYERS, initials } from '../data';
import Reveal from '../components/Reveal';
import OrgLogo from '../components/OrgLogo';

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

export default function Landing() {
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
            Where <span className="grad-text">footballers</span><br />get discovered & signed.
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-mute">
            Players build a verified career profile and post skill reels — free to start.
            Clubs, academies & schools discover talent with AI and sign through the platform.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link to="/signup" className="btn-primary text-base"><Play size={18} fill="white" /> Join Free as Player</Link>
            <Link to="/signup" className="btn-ghost">For Clubs</Link>
            <Link to="/signup" className="btn-ghost">🎓 Academies & Schools</Link>
          </div>
        </div>
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

        {/* CLUBS */}
        <Heading title="Built for clubs, academies & schools" sub="Every level, every region — from grassroots academies to professional clubs" />
        <Reveal>
          <div className="flex flex-wrap gap-2.5">{CLUBS.map((c) => <div key={c} className="chip !py-1.5 !pl-1.5 !text-slate-100"><OrgLogo name={c} size={24} /> {c}</div>)}</div>
        </Reveal>

        {/* DEALS */}
        <Heading title="How signings happen" sub="Contact → trial → deal, all on Talenta. We take 3% only on a successful signing." />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {DEALS.map((d, i) => (
            <Reveal key={i} delay={i * 60}>
              <div className="card flex items-center gap-3.5 p-4">
                <div className="grid h-11 w-11 flex-shrink-0 place-items-center rounded-xl bg-gradient-to-br from-primary to-primary-2 font-display font-bold text-white">{initials(d[0])}</div>
                <div><div className="font-bold">{d[0]}</div><div className="text-[12.5px] text-mute">→ {d[1]}</div></div>
                <span className="ml-auto whitespace-nowrap rounded-md bg-primary/15 px-2.5 py-1 text-[10.5px] font-extrabold text-primary">{d[2]}</span>
              </div>
            </Reveal>
          ))}
        </div>

        {/* EARLY ACCESS */}
        <Reveal>
          <div className="card mt-20 border-primary/30 bg-primary/[0.05] p-8 text-center md:p-12">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-4 py-1.5 text-[12.5px] text-mute">
              <span className="h-2 w-2 rounded-full bg-accent shadow-[0_0_8px_#FF2A4D]" /> Now in early access
            </span>
            <h2 className="mt-4 font-display text-2xl font-bold md:text-3xl">Be a founding member</h2>
            <p className="mx-auto mt-3 max-w-xl text-mute">Talenta is brand new. Join now and be among the very first footballers, clubs and academies on the platform — and help shape what we build next.</p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Link to="/signup" className="btn-primary text-base"><Play size={18} fill="white" /> Join Free as Player</Link>
              <Link to="/signup" className="btn-ghost">For Clubs & Academies</Link>
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

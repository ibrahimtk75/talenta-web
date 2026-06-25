import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, ChevronRight, Play } from 'lucide-react';
import { useSEO } from '../useSEO';

// Full FAQ — moved off the home page to keep it clean & visual-first.
const faqs: [string, string][] = [
  ['Is it really free for players?', 'Yes. Players join free, build a profile and post one reel at no cost. The optional Pro plan adds unlimited videos, daily practice, a verified badge and boosted visibility.'],
  ['Who can register?', 'Players, professional clubs, scouts, academies, schools and universities — worldwide. Each gets a tailored profile and tools.'],
  ['How does Talenta make money?', 'Club & academy subscriptions, an optional player Pro plan, and a 3% commission only on successful deals signed through the platform.'],
  ['Are young players protected?', 'Yes. Under-18 players require guardian consent, and clubs contact them only through the platform with guardians notified — safeguarding is built in.'],
  ['How do clubs find players?', 'Clubs search and filter by position, age, country and skill level, and get AI-ranked suggestions. Every player has a video reel and a clear data-driven Talent Score.'],
  ['Do I need an agent?', 'No. Talenta connects you directly to clubs, academies and scouts — no agent and no middleman fees. You keep control of your own profile.'],
  ['Which sports are supported?', 'We launch with Football. Cricket, Basketball, Hockey and Tennis are coming next on the same platform.'],
];

export default function Faq() {
  useSEO({
    title: 'FAQ — How Talenta works | Talenta',
    description: 'Answers about Talenta: is it free for players, who can register, how clubs find talent, safeguarding for minors, and the 3% commission on deals.',
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faqs.map(([q, a]) => ({
        '@type': 'Question', name: q,
        acceptedAnswer: { '@type': 'Answer', text: a },
      })),
    },
  });
  return (
    <div className="mx-auto max-w-3xl px-5 py-16">
      <div className="text-center">
        <span className="text-[12px] font-semibold uppercase tracking-[0.25em] text-primary">Help centre</span>
        <h1 className="mt-2 font-display text-3xl font-bold md:text-4xl">Frequently asked questions</h1>
        <p className="mt-2 text-mute">Everything you need to know about Talenta.</p>
      </div>

      <div className="mt-10 space-y-3">
        {faqs.map(([q, a]) => <FaqItem key={q} q={q} a={a} />)}
      </div>

      <div className="card mt-12 p-8 text-center">
        <h2 className="font-display text-xl font-bold">Still have a question?</h2>
        <p className="mx-auto mt-2 max-w-md text-sm text-mute">Reach us any time — we usually reply within a day.</p>
        <div className="mt-5 flex flex-wrap justify-center gap-3">
          <a href="mailto:sportstalenta@gmail.com" className="btn-ghost">Email us</a>
          <Link to="/signup" className="btn-primary"><Play size={17} fill="white" /> Join Free</Link>
        </div>
      </div>

      <div className="mt-8 text-center">
        <Link to="/" className="inline-flex items-center gap-1.5 text-sm font-semibold text-mute hover:text-primary">
          Back to home <ChevronRight size={15} />
        </Link>
      </div>
    </div>
  );
}

function FaqItem({ q, a }: { q: string; a: string }) {
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

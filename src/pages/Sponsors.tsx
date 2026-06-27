import { Link } from 'react-router-dom';
import { Sparkles, Heart, Handshake, Megaphone, Trophy, Building2, ChevronRight } from 'lucide-react';
import { useSEO } from '../useSEO';

const MAIL = 'mailto:sportstalenta@gmail.com?subject=Sponsorship%20%26%20Partnership%20with%20Talenta';

const ways = [
  { icon: Megaphone, h: 'Brand partnership', p: 'Reach a young, football-obsessed audience across India & beyond — featured placement, campaigns & co-marketing.' },
  { icon: Trophy, h: 'Sponsor a tournament', p: 'Power a Talenta talent showcase or tournament and put your brand at the heart of grassroots football.' },
  { icon: Heart, h: 'Sponsor a rising star', p: 'Help a talented young player with boots, travel and coaching — directly back a dream, transparently.' },
  { icon: Building2, h: 'Academy & club partners', p: 'Schools, academies & clubs can partner with Talenta to showcase players and grow their programme.' },
];

export default function Sponsors() {
  useSEO({
    title: 'Sponsorship & Partnerships — Back the next generation | Talenta',
    description: 'Partner with Talenta to back rising football talent. Brand partnerships, tournament sponsorships, and sponsor-a-player — reach a young football audience worldwide.',
  });

  return (
    <div className="mx-auto max-w-5xl px-5 py-14">
      {/* Hero */}
      <div className="text-center">
        <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/[0.08] px-4 py-1.5 text-[12.5px] font-semibold text-primary">
          <Sparkles size={15} /> Sponsorship &amp; Partnerships
        </span>
        <h1 className="mt-4 font-display text-3xl font-bold md:text-5xl">Back the next generation<br /><span className="grad-text">of football talent.</span></h1>
        <p className="mx-auto mt-4 max-w-2xl text-mute">
          Standout players attract brands. Talenta helps rising talent earn sponsorships — and connects partners, brands and sponsors
          with a young, passionate football audience across India and the world.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <a href={MAIL} className="btn-primary text-base"><Handshake size={18} /> Become a sponsor / partner</a>
          <Link to="/signup" className="btn-ghost text-base"><Heart size={17} /> Sponsor a rising star</Link>
        </div>
      </div>

      {/* Ways to partner */}
      <h2 className="mb-6 mt-16 text-center font-display text-2xl font-bold">Ways to partner with Talenta</h2>
      <div className="grid gap-5 sm:grid-cols-2">
        {ways.map((w) => (
          <div key={w.h} className="card h-full p-6">
            <span className="grid h-11 w-11 place-items-center rounded-xl bg-primary/15 text-primary"><w.icon size={20} /></span>
            <h3 className="mt-4 font-bold">{w.h}</h3>
            <p className="mt-2 text-[13.5px] leading-relaxed text-mute">{w.p}</p>
          </div>
        ))}
      </div>

      {/* Why sponsor */}
      <div className="mt-12 grid gap-5 sm:grid-cols-3">
        {[['🌍', 'Global, young audience', 'Football is the world’s #1 sport — and Talenta’s players & fans are exactly the audience brands want.'],
          ['📈', 'Grow with the platform', 'Get in early as a founding partner while Talenta scales from Kerala to the world.'],
          ['🤝', 'Real impact', 'Your support directly helps talented young players get discovered and signed.']].map(([e, h, p]) => (
          <div key={h} className="rounded-xl2 border border-white/10 bg-white/[0.03] p-5 text-center">
            <div className="text-2xl">{e}</div>
            <div className="mt-2 font-bold">{h}</div>
            <p className="mt-1.5 text-[12.5px] leading-relaxed text-mute">{p}</p>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div className="card relative mt-14 overflow-hidden border-primary/40 bg-gradient-to-br from-primary/[0.12] via-ink to-ink p-8 text-center md:p-12">
        <h2 className="font-display text-2xl font-bold md:text-3xl">Let&rsquo;s build the future of sports talent — together.</h2>
        <p className="mx-auto mt-3 max-w-xl text-mute">
          Whether you&rsquo;re a global brand, a local business, or a fan who believes in a player — there&rsquo;s a place for you on Talenta.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <a href={MAIL} className="btn-primary text-base">Talk to us <ChevronRight size={18} /></a>
          <a href="https://wa.me/919526137000?text=Hi%20Talenta%2C%20I%27d%20like%20to%20explore%20sponsorship%20%2F%20partnership." target="_blank" rel="noopener noreferrer" className="btn-ghost">WhatsApp us</a>
        </div>
        <p className="mt-4 text-[12px] text-mute">Or email sportstalenta@gmail.com</p>
      </div>
    </div>
  );
}

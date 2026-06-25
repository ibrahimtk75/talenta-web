import { Link } from 'react-router-dom';
import { Facebook, Instagram, Twitter, Youtube, Linkedin, Play, Mail } from 'lucide-react';

const CONTACT_EMAIL = 'sportstalenta@gmail.com';

const socials = [
  { Icon: Instagram, href: 'https://instagram.com/talenta', label: 'Instagram' },
  { Icon: Facebook, href: 'https://facebook.com/talenta', label: 'Facebook' },
  { Icon: Twitter, href: 'https://twitter.com/talenta', label: 'X (Twitter)' },
  { Icon: Youtube, href: 'https://youtube.com/@talenta', label: 'YouTube' },
  { Icon: Linkedin, href: 'https://linkedin.com/company/talenta', label: 'LinkedIn' },
];

type Item = { l: string; to?: string; href?: string };
const cols: { h: string; items: Item[] }[] = [
  { h: 'Explore', items: [
    { l: 'Talent Feed', to: '/feed' }, { l: 'Discover', to: '/browse' },
    { l: 'Rankings', to: '/rankings' }, { l: 'Blog', href: '/blog/' }, { l: 'Pricing', to: '/pricing' },
  ] },
  { h: 'Company', items: [
    { l: 'FAQs', to: '/faq' }, { l: 'How it works', to: '/faq' },
    { l: 'Pricing', to: '/pricing' }, { l: 'Contact', href: 'mailto:sportstalenta@gmail.com' },
  ] },
  { h: 'Join', items: [
    { l: 'As a Player', to: '/signup' }, { l: 'For Clubs & Scouts', to: '/signup' },
    { l: 'Academies & Schools', to: '/signup' }, { l: 'Log in', to: '/login' },
  ] },
  { h: 'Legal', items: [
    { l: 'Terms of Service', to: '/terms' }, { l: 'Privacy Policy', to: '/privacy' },
    { l: "Players' Safety", to: '/terms' },
  ] },
];

export default function Footer() {
  return (
    <footer className="relative mt-24 overflow-hidden border-t border-white/10 bg-ink/70">
      {/* top glow accent */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/70 to-transparent" />

      {/* CTA band */}
      <div className="border-b border-white/10 bg-primary/[0.04]">
        <div className="mx-auto flex max-w-7xl flex-col items-center gap-5 px-5 py-9 text-center md:flex-row md:justify-between md:text-left">
          <div>
            <h3 className="font-display text-xl font-bold md:text-2xl">Ready to get discovered?</h3>
            <p className="mt-1 text-sm text-mute">Join free as a founding member — be one of the first 1,000 players.</p>
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            <Link to="/signup" className="btn-primary"><Play size={17} fill="white" /> Join Free</Link>
            <Link to="/rankings" className="btn-ghost">View Rankings</Link>
          </div>
        </div>
      </div>

      {/* main */}
      <div className="mx-auto max-w-7xl px-5 py-14">
        <div className="grid gap-10 md:grid-cols-[1.6fr_1fr_1fr_1fr_1fr]">
          <div>
            <Link to="/" className="inline-flex items-center">
              <img src="/logo-clear.png" alt="Talenta" className="h-10 w-auto" />
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-mute">
              Where footballers get discovered & signed — connecting talent with clubs, academies,
              scouts & schools worldwide. Built from Kerala, for the world.
            </p>
            <div className="mt-5 text-sm">
              <a href={`mailto:${CONTACT_EMAIL}`} className="inline-flex items-center gap-2.5 text-mute transition-colors hover:text-white">
                <Mail size={15} className="text-primary" /> {CONTACT_EMAIL}
              </a>
            </div>
            <div className="mt-5 flex gap-2.5 text-mute">
              {socials.map(({ Icon, href, label }) => (
                <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label}
                  className="grid h-9 w-9 place-items-center rounded-lg border border-white/10 transition-all hover:-translate-y-0.5 hover:border-primary hover:text-white">
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>
          {cols.map((c) => (
            <div key={c.h}>
              <h4 className="mb-4 text-[13px] font-bold uppercase tracking-wider text-white/80">{c.h}</h4>
              <ul className="space-y-2.5">
                {c.items.map((it) => (
                  <li key={it.l}>
                    {it.to
                      ? <Link to={it.to} className="text-sm text-mute transition-colors hover:text-primary">{it.l}</Link>
                      : <a href={it.href} className="text-sm text-mute transition-colors hover:text-primary">{it.l}</a>}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-white/10 pt-6 text-xs text-mute sm:flex-row">
          <span>© 2026 Talenta. All rights reserved.</span>
          <span className="flex items-center gap-1.5">
            Built with <span className="text-primary">⚽</span> in Kerala,
            <img src="https://flagcdn.com/h20/in.png" alt="India" className="h-3 w-auto rounded-[2px] ring-1 ring-white/10" /> India
          </span>
        </div>
      </div>
    </footer>
  );
}

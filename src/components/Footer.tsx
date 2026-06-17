import { Link } from 'react-router-dom';
import { Facebook, Instagram, Twitter, Youtube, Linkedin } from 'lucide-react';
import { SALES_EMAIL } from '../payments';

const socials = [
  { Icon: Facebook, href: 'https://facebook.com/talenta', label: 'Facebook' },
  { Icon: Instagram, href: 'https://instagram.com/talenta', label: 'Instagram' },
  { Icon: Twitter, href: 'https://twitter.com/talenta', label: 'X (Twitter)' },
  { Icon: Youtube, href: 'https://youtube.com/@talenta', label: 'YouTube' },
  { Icon: Linkedin, href: 'https://linkedin.com/company/talenta', label: 'LinkedIn' },
];

type Item = { l: string; to?: string; href?: string };
const cols: { h: string; items: Item[] }[] = [
  { h: 'Product', items: [{ l: 'Talent Feed', to: '/feed' }, { l: 'Discover', to: '/browse' }, { l: 'Pricing', to: '/pricing' }, { l: 'Join Free', to: '/signup' }] },
  { h: 'Company', items: [{ l: 'For Clubs', to: '/signup' }, { l: 'Contact', href: `mailto:${SALES_EMAIL}` }] },
  { h: 'Legal', items: [{ l: 'Terms', to: '/terms' }, { l: 'Privacy', to: '/privacy' }, { l: "Players' safety", to: '/terms' }] },
];

export default function Footer() {
  return (
    <footer className="mt-24 border-t border-white/10 bg-ink/60">
      <div className="mx-auto max-w-6xl px-5 py-14">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <Link to="/" className="inline-flex items-center">
              <img src="/logo.png" alt="Talenta" className="h-10 w-auto" />
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-mute">
              Where footballers get discovered & signed. Connecting players with clubs, academies & schools worldwide.
            </p>
            <div className="mt-5 flex gap-3 text-mute">
              {socials.map(({ Icon, href, label }) => (
                <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label}
                  className="grid h-9 w-9 place-items-center rounded-lg border border-white/10 transition-colors hover:border-primary hover:text-white">
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>
          {cols.map((c) => (
            <div key={c.h}>
              <h4 className="mb-4 text-[13px] font-bold uppercase tracking-wide text-white/80">{c.h}</h4>
              <ul className="space-y-2.5">
                {c.items.map((it) => (
                  <li key={it.l}>
                    {it.to
                      ? <Link to={it.to} className="text-sm text-mute transition-colors hover:text-white">{it.l}</Link>
                      : <a href={it.href} className="text-sm text-mute transition-colors hover:text-white">{it.l}</a>}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-white/10 pt-6 text-xs text-mute sm:flex-row">
          <span>© 2026 Talenta. All rights reserved.</span>
          <span>Made for football talent worldwide ⚽</span>
        </div>
      </div>
    </footer>
  );
}

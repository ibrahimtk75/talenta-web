import { Link } from 'react-router-dom';
import { ShieldCheck, Lock, Scale } from 'lucide-react';
import Logo from './Logo';

const groups = [
  {
    title: 'Marketplace',
    links: [
      { to: '/marketplace?cat=loans', label: 'Loans' },
      { to: '/marketplace?cat=credit-cards', label: 'Credit Cards' },
      { to: '/marketplace?cat=insurance', label: 'Insurance' },
      { to: '/marketplace?cat=investments', label: 'Investments' },
    ],
  },
  {
    title: 'Company',
    links: [
      { to: '/about', label: 'How it works' },
      { to: '/providers', label: 'For providers' },
      { to: '/advisor', label: 'AI Advisor' },
      { to: '/learn', label: 'Education hub' },
    ],
  },
  {
    title: 'Trust & Legal',
    links: [
      { to: '/about', label: 'Provider verification' },
      { to: '/about', label: 'GDPR & CCPA' },
      { to: '/about', label: 'Responsible lending' },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="mt-20 border-t border-ink-100 bg-white dark:border-ink-800 dark:bg-ink-900">
      <div className="container-app grid gap-10 py-12 md:grid-cols-[1.4fr_repeat(3,1fr)]">
        <div>
          <Logo />
          <p className="mt-3 max-w-xs text-sm text-ink-500 dark:text-ink-400">
            A global financial marketplace connecting people with verified loans, cards, insurance,
            savings, investments and funding — transparently.
          </p>
          <div className="mt-4 flex flex-wrap gap-3 text-xs text-ink-500 dark:text-ink-400">
            <span className="flex items-center gap-1"><ShieldCheck className="h-4 w-4 text-brand-600" /> Verified providers</span>
            <span className="flex items-center gap-1"><Lock className="h-4 w-4 text-brand-600" /> Bank-grade security</span>
            <span className="flex items-center gap-1"><Scale className="h-4 w-4 text-brand-600" /> Impartial comparison</span>
          </div>
        </div>
        {groups.map((g) => (
          <div key={g.title}>
            <h4 className="mb-3 text-sm font-semibold text-ink-900 dark:text-white">{g.title}</h4>
            <ul className="space-y-2">
              {g.links.map((l) => (
                <li key={l.label}>
                  <Link to={l.to} className="text-sm text-ink-500 hover:text-brand-700 dark:text-ink-400 dark:hover:text-brand-400">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-ink-100 py-6 dark:border-ink-800">
        <div className="container-app flex flex-col items-center justify-between gap-3 text-xs text-ink-400 sm:flex-row">
          <p>© {new Date().getFullYear()} GlobalFundConnect. Demo build — figures are illustrative, not financial advice.</p>
          <p>Made with a trust-first design system.</p>
        </div>
      </div>
    </footer>
  );
}

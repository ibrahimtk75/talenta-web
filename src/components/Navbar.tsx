import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Moon, Sun, Menu, X, User, LayoutDashboard, LogOut, Bookmark } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { CURRENCIES } from '../lib/format';
import { LANGS } from '../lib/i18n';
import type { CurrencyCode } from '../lib/types';
import type { Lang } from '../lib/i18n';
import Logo from './Logo';

export default function Navbar() {
  const { theme, toggleTheme, currency, setCurrency, lang, setLang, t, user, logout, saved } = useApp();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const links = [
    { to: '/marketplace', label: t('nav.marketplace') },
    { to: '/advisor', label: t('nav.recommend') },
    { to: '/learn', label: t('nav.learn') },
    { to: '/providers', label: t('nav.providers') },
    { to: '/about', label: t('nav.about') },
  ];

  const dashHref = user
    ? user.role === 'admin'
      ? '/admin'
      : user.role === 'provider'
        ? '/provider'
        : '/dashboard'
    : '/login';

  return (
    <header className="sticky top-0 z-40 border-b border-ink-100 bg-white/80 backdrop-blur dark:border-ink-800 dark:bg-ink-900/80">
      <div className="container-app flex h-16 items-center justify-between gap-4">
        <div className="flex items-center gap-5">
          <Logo />
          <nav className="hidden items-center gap-0.5 xl:flex">
            {links.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                className={({ isActive }) =>
                  `whitespace-nowrap rounded-lg px-2.5 py-2 text-sm font-medium transition ${
                    isActive
                      ? 'bg-brand-50 text-brand-700 dark:bg-ink-800 dark:text-brand-400'
                      : 'text-ink-600 hover:bg-ink-50 dark:text-ink-300 dark:hover:bg-ink-800'
                  }`
                }
              >
                {l.label}
              </NavLink>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-2">
          <select
            aria-label="Currency"
            value={currency}
            onChange={(e) => setCurrency(e.target.value as CurrencyCode)}
            className="hidden rounded-lg border border-ink-200 bg-white px-2 py-1.5 text-xs font-semibold text-ink-700 sm:block dark:border-ink-700 dark:bg-ink-800 dark:text-ink-200"
          >
            {Object.keys(CURRENCIES).map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          <select
            aria-label="Language"
            value={lang}
            onChange={(e) => setLang(e.target.value as Lang)}
            className="hidden rounded-lg border border-ink-200 bg-white px-2 py-1.5 text-xs font-semibold text-ink-700 sm:block dark:border-ink-700 dark:bg-ink-800 dark:text-ink-200"
          >
            {LANGS.map((l) => (
              <option key={l.code} value={l.code}>
                {l.label}
              </option>
            ))}
          </select>

          <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="btn-ghost !px-2.5"
          >
            {theme === 'light' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
          </button>

          {user ? (
            <div className="hidden items-center gap-2 xl:flex">
              <Link to="/dashboard" className="btn-ghost !px-2.5" aria-label="Saved">
                <Bookmark className="h-4 w-4" />
                {saved.length > 0 && <span className="text-xs">{saved.length}</span>}
              </Link>
              <Link to={dashHref} className="btn-ghost">
                <LayoutDashboard className="h-4 w-4" /> {user.name}
              </Link>
              <button onClick={() => { logout(); navigate('/'); }} className="btn-ghost !px-2.5" aria-label="Log out">
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <div className="hidden items-center gap-2 xl:flex">
              <Link to="/login" className="btn-ghost">
                <User className="h-4 w-4" /> {t('nav.signin')}
              </Link>
              <Link to="/signup" className="btn-primary">
                {t('nav.getstarted')}
              </Link>
            </div>
          )}

          <button className="btn-ghost !px-2.5 xl:hidden" onClick={() => setOpen((o) => !o)} aria-label="Menu">
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-ink-100 bg-white px-4 py-3 xl:hidden dark:border-ink-800 dark:bg-ink-900">
          <nav className="flex flex-col gap-1">
            {links.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-2.5 text-sm font-medium text-ink-700 hover:bg-ink-50 dark:text-ink-200 dark:hover:bg-ink-800"
              >
                {l.label}
              </Link>
            ))}
            <div className="mt-2 flex gap-2 sm:hidden">
              <select
                aria-label="Currency"
                value={currency}
                onChange={(e) => setCurrency(e.target.value as CurrencyCode)}
                className="input !py-2"
              >
                {Object.keys(CURRENCIES).map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
              <select
                aria-label="Language"
                value={lang}
                onChange={(e) => setLang(e.target.value as Lang)}
                className="input !py-2"
              >
                {LANGS.map((l) => (
                  <option key={l.code} value={l.code}>{l.label}</option>
                ))}
              </select>
            </div>
            <div className="mt-2 flex gap-2">
              {user ? (
                <Link to={dashHref} onClick={() => setOpen(false)} className="btn-primary flex-1">
                  Dashboard
                </Link>
              ) : (
                <>
                  <Link to="/login" onClick={() => setOpen(false)} className="btn-ghost flex-1">
                    {t('nav.signin')}
                  </Link>
                  <Link to="/signup" onClick={() => setOpen(false)} className="btn-primary flex-1">
                    {t('nav.getstarted')}
                  </Link>
                </>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}

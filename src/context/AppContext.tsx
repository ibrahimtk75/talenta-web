import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import type { CurrencyCode, SessionUser, UserRole } from '../lib/types';
import { LANGS, translator, type Lang } from '../lib/i18n';

type Theme = 'light' | 'dark';

interface AppState {
  // preferences
  theme: Theme;
  toggleTheme: () => void;
  currency: CurrencyCode;
  setCurrency: (c: CurrencyCode) => void;
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: string) => string;

  // session (mock auth)
  user: SessionUser | null;
  login: (email: string, role?: UserRole) => void;
  logout: () => void;

  // saved products
  saved: string[];
  toggleSaved: (id: string) => void;
  isSaved: (id: string) => boolean;
}

const AppContext = createContext<AppState | null>(null);

function usePersistedState<T>(key: string, initial: T): [T, (v: T) => void] {
  const [value, setValue] = useState<T>(() => {
    try {
      const raw = localStorage.getItem(key);
      return raw ? (JSON.parse(raw) as T) : initial;
    } catch {
      return initial;
    }
  });
  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      /* ignore */
    }
  }, [key, value]);
  return [value, setValue];
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = usePersistedState<Theme>('gfc.theme', 'light');
  const [currency, setCurrency] = usePersistedState<CurrencyCode>('gfc.currency', 'USD');
  const [lang, setLang] = usePersistedState<Lang>('gfc.lang', 'en');
  const [user, setUser] = usePersistedState<SessionUser | null>('gfc.user', null);
  const [saved, setSaved] = usePersistedState<string[]>('gfc.saved', []);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle('dark', theme === 'dark');
    const dir = LANGS.find((l) => l.code === lang)?.dir ?? 'ltr';
    root.setAttribute('dir', dir);
    root.setAttribute('lang', lang);
  }, [theme, lang]);

  const value = useMemo<AppState>(() => {
    const t = translator(lang);
    return {
      theme,
      toggleTheme: () => setTheme(theme === 'light' ? 'dark' : 'light'),
      currency,
      setCurrency,
      lang,
      setLang,
      t,
      user,
      login: (email, role = 'client') =>
        setUser({
          id: 'u-' + email.split('@')[0],
          name: email.split('@')[0].replace(/\b\w/g, (m) => m.toUpperCase()),
          email,
          role,
        }),
      logout: () => setUser(null),
      saved,
      toggleSaved: (id) =>
        setSaved(saved.includes(id) ? saved.filter((s) => s !== id) : [...saved, id]),
      isSaved: (id) => saved.includes(id),
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [theme, currency, lang, user, saved]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useApp(): AppState {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}

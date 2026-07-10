import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Chrome, Apple, Phone } from 'lucide-react';
import { useApp } from '../context/AppContext';
import type { UserRole } from '../lib/types';
import Logo from '../components/Logo';
import { useDocumentTitle } from '../lib/useDocumentTitle';

export default function Login({ mode = 'login' }: { mode?: 'login' | 'signup' }) {
  const { login } = useApp();
  useDocumentTitle(mode === 'signup' ? 'Create account' : 'Sign in');
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<UserRole>('client');
  const isSignup = mode === 'signup';

  const dest = role === 'admin' ? '/admin' : role === 'provider' ? '/provider' : '/dashboard';

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    login(email || `${role}@demo.gfc`, role);
    navigate(dest);
  };

  const social = [
    { icon: Chrome, label: 'Google' },
    { icon: Apple, label: 'Apple' },
    { icon: Phone, label: 'Phone OTP' },
  ];

  return (
    <div className="container-app grid min-h-[calc(100vh-4rem)] place-items-center py-10">
      <div className="w-full max-w-md">
        <div className="mb-6 text-center">
          <div className="mb-4 flex justify-center"><Logo /></div>
          <h1 className="font-display text-2xl font-bold text-ink-900 dark:text-white">
            {isSignup ? 'Create your account' : 'Welcome back'}
          </h1>
          <p className="mt-1 text-sm text-ink-500 dark:text-ink-400">
            {isSignup ? 'Join the global financial marketplace.' : 'Sign in to your dashboard.'}
          </p>
        </div>

        <div className="card p-6">
          {/* Role selector */}
          <div className="mb-5">
            <label className="label">I am a…</label>
            <div className="grid grid-cols-3 gap-2">
              {(['client', 'provider', 'admin'] as UserRole[]).map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setRole(r)}
                  className={`rounded-xl border px-2 py-2 text-xs font-semibold capitalize transition ${
                    role === r
                      ? 'border-brand-500 bg-brand-50 text-brand-700 dark:bg-ink-900 dark:text-brand-400'
                      : 'border-ink-200 text-ink-500 hover:border-brand-300 dark:border-ink-700 dark:text-ink-400'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={submit} className="space-y-4">
            <div>
              <label className="label">Email</label>
              <div className="flex items-center gap-2 rounded-xl border border-ink-200 px-3 dark:border-ink-700">
                <Mail className="h-4 w-4 text-ink-400" />
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" className="w-full bg-transparent py-2.5 text-sm outline-none" />
              </div>
            </div>
            <div>
              <label className="label">Password</label>
              <div className="flex items-center gap-2 rounded-xl border border-ink-200 px-3 dark:border-ink-700">
                <Lock className="h-4 w-4 text-ink-400" />
                <input type="password" placeholder="••••••••" className="w-full bg-transparent py-2.5 text-sm outline-none" />
              </div>
            </div>
            <button type="submit" className="btn-primary w-full">
              {isSignup ? 'Create account' : 'Sign in'}
            </button>
          </form>

          <div className="my-5 flex items-center gap-3 text-xs text-ink-400">
            <span className="h-px flex-1 bg-ink-100 dark:bg-ink-700" /> or continue with <span className="h-px flex-1 bg-ink-100 dark:bg-ink-700" />
          </div>
          <div className="grid grid-cols-3 gap-2">
            {social.map((s) => (
              <button key={s.label} onClick={() => submit(new Event('submit') as unknown as React.FormEvent)} className="btn-ghost flex-col !py-3 text-xs">
                <s.icon className="h-5 w-5" /> {s.label}
              </button>
            ))}
          </div>

          <p className="mt-5 text-center text-xs text-ink-400">🔒 Secured with MFA, JWT & OAuth · GDPR/CCPA compliant</p>
        </div>

        <p className="mt-4 text-center text-sm text-ink-500 dark:text-ink-400">
          {isSignup ? 'Already have an account?' : "Don't have an account?"}{' '}
          <Link to={isSignup ? '/login' : '/signup'} className="font-semibold text-brand-700 hover:underline dark:text-brand-400">
            {isSignup ? 'Sign in' : 'Create one'}
          </Link>
        </p>
      </div>
    </div>
  );
}

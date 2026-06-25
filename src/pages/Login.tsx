import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, LogIn } from 'lucide-react';
import { useSession } from '../session';
import { apiEnabled, apiLogin } from '../api';

export default function Login() {
  const nav = useNavigate();
  const { signIn, toast } = useSession();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async () => {
    if (!email.trim() || !password) { toast('Enter your email and password'); return; }
    if (!apiEnabled) { toast('Login activates once the backend is connected — use Join Free for the demo'); return; }
    setBusy(true);
    try {
      const resp = await apiLogin({ email: email.trim(), password });
      // Map the backend role (+ orgType) back to the UI sub-role so each account
      // lands on its own dashboard (academies register as CLUB + an orgType).
      const r = resp.user.role;
      const academyTypes = ['Academy', 'School', 'University'];
      const uiRole =
        r === 'PLAYER' ? 'player'
        : r === 'COACH' ? 'coach'
        : r === 'REFEREE' ? 'referee'
        : academyTypes.includes(resp.user.orgType || '') ? 'academy'
        : 'club';
      signIn(resp, uiRole);
      toast('Welcome back 👋');
      const dest = uiRole === 'player' ? '/hub'
        : uiRole === 'academy' ? '/academy'
        : uiRole === 'club' ? '/club'
        : uiRole === 'coach' ? '/coaches'
        : uiRole === 'referee' ? '/referees' : '/';
      nav(dest);
    } catch (e) {
      const msg = (e as Error).message;
      toast(msg === 'INVALID_CREDENTIALS' ? 'Wrong email or password' : msg);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="mx-auto max-w-md px-5 py-16">
      <button onClick={() => nav('/')} className="mb-5 inline-flex items-center gap-1.5 text-sm font-semibold text-mute hover:text-primary">
        <ArrowLeft size={15} /> Home
      </button>
      <div className="card p-7">
        <h1 className="font-display text-2xl font-bold">Welcome back</h1>
        <p className="mt-1 text-sm text-mute">Log in to your Talenta account.</p>

        <div className="mt-6 space-y-4">
          <div>
            <label className="field-label">Email</label>
            <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" className="field-input" placeholder="you@email.com" />
          </div>
          <div>
            <label className="field-label">Password</label>
            <input value={password} onChange={(e) => setPassword(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') submit(); }} type="password" className="field-input" placeholder="••••••••" />
          </div>
          <button onClick={submit} disabled={busy} className="btn-primary w-full justify-center disabled:opacity-60">
            <LogIn size={16} /> {busy ? 'Signing in…' : 'Log in'}
          </button>
        </div>

        <p className="mt-5 text-center text-[13px] text-mute">
          New to Talenta? <Link to="/signup" className="font-semibold text-primary">Create an account</Link>
        </p>
      </div>
    </div>
  );
}

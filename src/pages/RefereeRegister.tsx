import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ChevronRight, Flag } from 'lucide-react';
import { useSession } from '../session';
import { COUNTRIES } from '../data';
import { apiEnabled, apiRegister, apiUpsertRefereeProfile, toBackendRole } from '../api';

const SPORTS: [string, string][] = [
  ['FOOTBALL', 'Football'], ['CRICKET', 'Cricket'], ['BASKETBALL', 'Basketball'],
  ['HOCKEY_FIELD', 'Hockey'], ['TENNIS', 'Tennis'],
];
const LEVELS = ['District', 'State', 'National', 'International'];

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <div><label className="field-label">{label}</label>{children}</div>;
}

export default function RefereeRegister() {
  const nav = useNavigate();
  const { setRole, setProfile, signIn, toast } = useSession();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [country, setCountry] = useState(COUNTRIES[0]);
  const [sports, setSports] = useState<string[]>(['FOOTBALL']);
  const [level, setLevel] = useState(LEVELS[0]);
  const [exp, setExp] = useState('');
  const [available, setAvailable] = useState(true);
  const [busy, setBusy] = useState(false);

  const toggleSport = (s: string) => setSports((cur) => cur.includes(s) ? cur.filter((x) => x !== s) : [...cur, s]);

  const finish = async () => {
    if (busy) return;
    if (!name.trim()) { toast('Please enter your name'); return; }
    if (!/^\S+@\S+\.\S+$/.test(email.trim())) { toast('Please enter a valid email'); return; }
    if (apiEnabled && password.length < 8) { toast('Password must be at least 8 characters'); return; }
    const prof = { name: name.trim(), type: 'Referee', country };
    if (!apiEnabled) { setRole('referee'); setProfile(prof); toast('Referee account created — welcome!'); nav('/referees'); return; }
    setBusy(true);
    try {
      const resp = await apiRegister({ email: email.trim(), password, fullName: name.trim(), country: country.slice(0, 2).toUpperCase(), role: toBackendRole('referee') });
      signIn(resp, 'referee', prof);
      try {
        await apiUpsertRefereeProfile(resp.accessToken, {
          sports, level,
          experienceYrs: exp ? Math.max(0, Math.round(Number(exp) || 0)) : undefined,
          available,
        });
      } catch { toast('Account created — finish your referee details later.'); }
    } catch (e) { toast((e as Error).message || 'Could not create account'); setBusy(false); return; }
    setBusy(false);
    toast('Referee account created — welcome! 🟨');
    nav('/referees');
  };

  return (
    <div className="mx-auto max-w-2xl px-5 py-12">
      <button onClick={() => nav('/signup')} className="mb-5 inline-flex items-center gap-1.5 text-sm font-semibold text-mute hover:text-primary">
        <ArrowLeft size={15} /> Account type
      </button>
      <h1 className="flex items-center gap-2 font-display text-2xl font-bold"><Flag size={22} className="text-primary" /> Referee registration</h1>
      <p className="mt-1 text-sm text-mute">List your level and availability — get found by tournaments and clubs that need officials.</p>

      <div className="card mt-6 space-y-4 p-7">
        <Field label="Full name"><input value={name} onChange={(e) => setName(e.target.value)} className="field-input" placeholder="e.g. Anil Thomas" /></Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Email"><input value={email} onChange={(e) => setEmail(e.target.value)} type="email" className="field-input" placeholder="you@email.com" /></Field>
          <Field label="Password"><input value={password} onChange={(e) => setPassword(e.target.value)} type="password" className="field-input" placeholder="Min 8 characters" /></Field>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Country"><select value={country} onChange={(e) => setCountry(e.target.value)} className="field-input">{COUNTRIES.map((c) => <option key={c}>{c}</option>)}</select></Field>
          <Field label="Level"><select value={level} onChange={(e) => setLevel(e.target.value)} className="field-input">{LEVELS.map((l) => <option key={l}>{l}</option>)}</select></Field>
        </div>

        <div>
          <label className="field-label">Sports you officiate</label>
          <div className="flex flex-wrap gap-2">
            {SPORTS.map(([v, l]) => (
              <button key={v} type="button" onClick={() => toggleSport(v)} className={`chip ${sports.includes(v) ? 'chip-active' : ''}`}>{l}</button>
            ))}
          </div>
        </div>

        <Field label="Years of experience"><input value={exp} onChange={(e) => setExp(e.target.value)} type="number" className="field-input" placeholder="6" /></Field>
        <label className="flex items-center gap-2.5 text-[13px] text-mute">
          <input type="checkbox" checked={available} onChange={(e) => setAvailable(e.target.checked)} className="accent-primary" />
          I'm currently available for matches
        </label>

        <button onClick={finish} disabled={busy} className="btn-primary w-full justify-center disabled:opacity-60">
          {busy ? 'Creating account…' : <>Create referee account <ChevronRight size={16} /></>}
        </button>
      </div>
    </div>
  );
}

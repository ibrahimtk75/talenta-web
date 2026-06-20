import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ChevronRight, Dumbbell } from 'lucide-react';
import { useSession } from '../session';
import { COUNTRIES } from '../data';
import { apiEnabled, apiRegister, apiUpsertCoachProfile, toBackendRole } from '../api';

const SPORTS: [string, string][] = [
  ['FOOTBALL', 'Football'], ['CRICKET', 'Cricket'], ['BASKETBALL', 'Basketball'],
  ['HOCKEY_FIELD', 'Hockey'], ['TENNIS', 'Tennis'],
];

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <div><label className="field-label">{label}</label>{children}</div>;
}

export default function CoachRegister() {
  const nav = useNavigate();
  const { setRole, setProfile, signIn, toast } = useSession();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [country, setCountry] = useState(COUNTRIES[0]);
  const [sports, setSports] = useState<string[]>(['FOOTBALL']);
  const [exp, setExp] = useState('');
  const [certs, setCerts] = useState('');
  const [bio, setBio] = useState('');
  const [rate, setRate] = useState('');
  const [busy, setBusy] = useState(false);

  const toggleSport = (s: string) => setSports((cur) => cur.includes(s) ? cur.filter((x) => x !== s) : [...cur, s]);

  const finish = async () => {
    if (busy) return;
    if (!name.trim()) { toast('Please enter your name'); return; }
    if (!/^\S+@\S+\.\S+$/.test(email.trim())) { toast('Please enter a valid email'); return; }
    if (apiEnabled && password.length < 8) { toast('Password must be at least 8 characters'); return; }
    const prof = { name: name.trim(), type: 'Coach', country };
    if (!apiEnabled) { setRole('coach'); setProfile(prof); toast('Coach account created — welcome!'); nav('/coaches'); return; }
    setBusy(true);
    try {
      const resp = await apiRegister({ email: email.trim(), password, fullName: name.trim(), country: country.slice(0, 2).toUpperCase(), role: toBackendRole('coach') });
      signIn(resp, 'coach', prof);
      try {
        await apiUpsertCoachProfile(resp.accessToken, {
          sports, certifications: certs.trim() || undefined,
          experienceYrs: exp ? Math.max(0, Math.round(Number(exp) || 0)) : undefined,
          bio: bio.trim() || undefined, hourlyRate: rate ? Math.max(0, Math.round(Number(rate) || 0)) : undefined,
        });
      } catch { toast('Account created — finish your coach details later.'); }
    } catch (e) { toast((e as Error).message || 'Could not create account'); setBusy(false); return; }
    setBusy(false);
    toast('Coach account created — welcome! 🧑‍🏫');
    nav('/coaches');
  };

  return (
    <div className="mx-auto max-w-2xl px-5 py-12">
      <button onClick={() => nav('/signup')} className="mb-5 inline-flex items-center gap-1.5 text-sm font-semibold text-mute hover:text-primary">
        <ArrowLeft size={15} /> Account type
      </button>
      <h1 className="flex items-center gap-2 font-display text-2xl font-bold"><Dumbbell size={22} className="text-primary" /> Coach registration</h1>
      <p className="mt-1 text-sm text-mute">List your experience and certifications — get discovered by players and clubs.</p>

      <div className="card mt-6 space-y-4 p-7">
        <Field label="Full name"><input value={name} onChange={(e) => setName(e.target.value)} className="field-input" placeholder="e.g. Rajesh Kumar" /></Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Email"><input value={email} onChange={(e) => setEmail(e.target.value)} type="email" className="field-input" placeholder="you@email.com" /></Field>
          <Field label="Password"><input value={password} onChange={(e) => setPassword(e.target.value)} type="password" className="field-input" placeholder="Min 8 characters" /></Field>
        </div>
        <Field label="Country"><select value={country} onChange={(e) => setCountry(e.target.value)} className="field-input">{COUNTRIES.map((c) => <option key={c}>{c}</option>)}</select></Field>

        <div>
          <label className="field-label">Sports you coach</label>
          <div className="flex flex-wrap gap-2">
            {SPORTS.map(([v, l]) => (
              <button key={v} type="button" onClick={() => toggleSport(v)} className={`chip ${sports.includes(v) ? 'chip-active' : ''}`}>{l}</button>
            ))}
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Years of experience"><input value={exp} onChange={(e) => setExp(e.target.value)} type="number" className="field-input" placeholder="8" /></Field>
          <Field label="Hourly rate (₹, optional)"><input value={rate} onChange={(e) => setRate(e.target.value)} type="number" className="field-input" placeholder="500" /></Field>
        </div>
        <Field label="Certifications / licences"><input value={certs} onChange={(e) => setCerts(e.target.value)} className="field-input" placeholder="e.g. AFC C Licence, AIFF" /></Field>
        <Field label="Short bio"><textarea value={bio} onChange={(e) => setBio(e.target.value)} className="field-input" rows={3} placeholder="Your coaching style, achievements and what you offer..." /></Field>

        <button onClick={finish} disabled={busy} className="btn-primary w-full justify-center disabled:opacity-60">
          {busy ? 'Creating account…' : <>Create coach account <ChevronRight size={16} /></>}
        </button>
      </div>
    </div>
  );
}

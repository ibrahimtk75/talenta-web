import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ChevronRight, Upload } from 'lucide-react';
import { useSession } from '../session';
import { COUNTRIES, POSITIONS, SKILL_LEVELS } from '../data';
import { payLink } from '../payments';
import { apiEnabled, apiRegister, apiUpsertProfile, toBackendRole, type ProfileBody } from '../api';

const STEPS = ['Personal', 'Physical', 'Career', 'Stats', 'Finish'];

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <div><label className="field-label">{label}</label>{children}</div>;
}

export default function PlayerOnboard() {
  const nav = useNavigate();
  const { setRole, setPro, setProfile, signIn, toast } = useSession();
  const [step, setStep] = useState(0);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [country, setCountry] = useState(COUNTRIES[0]);
  const [position, setPosition] = useState(POSITIONS[1]);
  const [skill, setSkill] = useState(SKILL_LEVELS[1]); // default Intermediate
  const [busy, setBusy] = useState(false);
  // Profile detail fields (saved to the backend so the player appears in Browse).
  const [dob, setDob] = useState('');
  const [foot, setFoot] = useState('Right');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [club, setClub] = useState('');
  const [appearances, setAppearances] = useState('');
  const [goals, setGoals] = useState('');
  const [assists, setAssists] = useState('');
  const [passAcc, setPassAcc] = useState('');

  const int = (v: string) => Math.max(0, Math.round(Number(v) || 0));
  const buildProfileBody = (): ProfileBody => ({
    sport: 'FOOTBALL',
    position,
    skillLevel: skill,
    dominantSide: foot,
    dateOfBirth: dob ? new Date(dob).toISOString() : undefined,
    heightCm: int(height) > 0 ? int(height) : undefined,
    weightKg: int(weight) > 0 ? int(weight) : undefined,
    currentClub: club.trim() || undefined,
    stats: {
      appearances: int(appearances),
      goals: int(goals),
      assists: int(assists),
      ...(passAcc ? { passAccuracy: Math.min(100, Math.max(0, Number(passAcc) || 0)) } : {}),
    },
  });

  // Validate the basics needed to create the profile. With a backend connected
  // we also need email + password (real account); in demo mode just the name.
  const requireBasics = () => {
    if (!name.trim()) { toast('Please enter your full name'); setStep(0); return false; }
    if (apiEnabled) {
      if (!/^\S+@\S+\.\S+$/.test(email.trim())) { toast('Please enter a valid email'); setStep(0); return false; }
      if (password.length < 8) { toast('Password must be at least 8 characters'); setStep(0); return false; }
    }
    return true;
  };

  // Creates the account against the backend when configured; falls back to a
  // local demo session otherwise. Returns false if something failed.
  const createAccount = async (): Promise<boolean> => {
    const prof = { name: name.trim(), country, position };
    if (!apiEnabled) {
      setRole('player'); setProfile(prof);
      return true;
    }
    try {
      const resp = await apiRegister({
        email: email.trim(), password, fullName: name.trim(),
        country: country.slice(0, 2).toUpperCase(), role: toBackendRole('player'),
      });
      signIn(resp, 'player', prof);
      // Save the football profile so the player shows up in Browse/search.
      // If this fails, the account still exists — they can finish it from My Hub.
      try {
        await apiUpsertProfile(resp.accessToken, buildProfileBody());
      } catch {
        toast('Account created — finish your profile details from My Hub.');
      }
      return true;
    } catch (e) {
      toast((e as Error).message || 'Could not create account');
      return false;
    }
  };

  const finish = async (pro: boolean) => {
    if (busy || !requireBasics()) return;
    setBusy(true);
    const ok = await createAccount();
    setBusy(false);
    if (!ok) return;
    setPro(pro);
    toast(pro ? 'Welcome to Pro! 🚀' : 'Profile created — welcome!');
    nav('/hub');
  };

  const goPro = async () => {
    if (busy || !requireBasics()) return;
    const region = country === 'India' ? 'india' : 'world';
    const url = payLink('proplayer', region, true);
    if (!url) { toast('Checkout is being set up — please try again soon'); return; }
    // Open the checkout tab synchronously inside the click gesture, BEFORE the async
    // account-creation call — otherwise the browser blocks the popup.
    window.open(url, '_blank', 'noopener');
    setBusy(true);
    const ok = await createAccount();
    setBusy(false);
    if (!ok) return;
    setPro(true);
    toast('Secure checkout opened in a new tab 💳');
    nav('/hub');
  };

  return (
    <div className="mx-auto max-w-2xl px-5 py-12">
      <button onClick={() => nav('/signup')} className="mb-5 inline-flex items-center gap-1.5 text-sm font-semibold text-mute hover:text-primary">
        <ArrowLeft size={15} /> Account type
      </button>

      <div className="mb-7 flex gap-2">
        {STEPS.map((_, i) => (
          <div key={i} className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/10">
            <div className="h-full rounded-full bg-gradient-to-r from-primary to-primary-2 transition-all"
              style={{ width: i < step ? '100%' : i === step ? '50%' : '0%' }} />
          </div>
        ))}
      </div>

      <div className="card p-7">
        <div className="text-[13px] text-mute">Step {step + 1} of 5</div>
        <h2 className="mb-5 mt-1 font-display text-xl font-bold">{['Personal details', 'Physical & position', 'Career timeline', 'Career stats', 'Add your reel & pick a plan'][step]}</h2>

        {step === 0 && (
          <div className="space-y-4">
            <Field label="Full name"><input value={name} onChange={(e) => setName(e.target.value)} className="field-input" placeholder="e.g. Leo Martins" /></Field>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Email"><input value={email} onChange={(e) => setEmail(e.target.value)} type="email" className="field-input" placeholder="you@email.com" /></Field>
              <Field label="Password"><input value={password} onChange={(e) => setPassword(e.target.value)} type="password" className="field-input" placeholder="Min 8 characters" /></Field>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Date of birth"><input value={dob} onChange={(e) => setDob(e.target.value)} type="date" className="field-input" /></Field>
              <Field label="Country"><select value={country} onChange={(e) => setCountry(e.target.value)} className="field-input">{COUNTRIES.map((c) => <option key={c}>{c}</option>)}</select></Field>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Phone / WhatsApp"><input className="field-input" placeholder="+91..." /></Field>
              <Field label="Languages"><input className="field-input" placeholder="English, Portuguese" /></Field>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4 text-[13px] text-mute">
              <b className="text-slate-200">Under 18?</b> Add guardian name + phone + consent (safeguarding).
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                <input className="field-input" placeholder="Guardian name" />
                <input className="field-input" placeholder="Guardian phone" />
              </div>
            </div>
          </div>
        )}
        {step === 1 && (
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Height (cm)"><input value={height} onChange={(e) => setHeight(e.target.value)} type="number" className="field-input" placeholder="178" /></Field>
            <Field label="Weight (kg)"><input value={weight} onChange={(e) => setWeight(e.target.value)} type="number" className="field-input" placeholder="72" /></Field>
            <Field label="Dominant foot"><select value={foot} onChange={(e) => setFoot(e.target.value)} className="field-input"><option>Right</option><option>Left</option><option>Both</option></select></Field>
            <Field label="Main position"><select value={position} onChange={(e) => setPosition(e.target.value)} className="field-input">{POSITIONS.slice(1).map((p) => <option key={p}>{p}</option>)}</select></Field>
            <Field label="Skill level"><select value={skill} onChange={(e) => setSkill(e.target.value)} className="field-input">{SKILL_LEVELS.map((s) => <option key={s}>{s}</option>)}</select></Field>
          </div>
        )}
        {step === 2 && (
          <div className="space-y-4">
            <p className="text-sm text-mute">Add every club/academy from childhood to now.</p>
            <Field label="Current club / academy"><input value={club} onChange={(e) => setClub(e.target.value)} className="field-input" placeholder="e.g. Santos Youth Academy" /></Field>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="From"><input type="number" className="field-input" placeholder="2018" /></Field>
              <Field label="To"><input className="field-input" placeholder="2021 / Present" /></Field>
            </div>
            <button className="btn-ghost text-[13px]" onClick={() => toast('Career entry added')}>+ Add another club</button>
          </div>
        )}
        {step === 3 && (
          <div className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Appearances"><input value={appearances} onChange={(e) => setAppearances(e.target.value)} type="number" className="field-input" placeholder="60" /></Field>
              <Field label="Goals"><input value={goals} onChange={(e) => setGoals(e.target.value)} type="number" className="field-input" placeholder="41" /></Field>
              <Field label="Assists"><input value={assists} onChange={(e) => setAssists(e.target.value)} type="number" className="field-input" placeholder="18" /></Field>
              <Field label="Pass accuracy %"><input value={passAcc} onChange={(e) => setPassAcc(e.target.value)} type="number" className="field-input" placeholder="82" /></Field>
            </div>
            <Field label="Asking price / valuation ($K) — clubs can bid on this">
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-mute">$</span>
                <input type="number" className="field-input !pl-7" placeholder="e.g. 500 (optional — leave blank if open)" />
              </div>
            </Field>
          </div>
        )}
        {step === 4 && (
          <div className="space-y-4">
            <button onClick={() => toast('Video upload — opens picker')}
              className="flex w-full flex-col items-center gap-1 rounded-xl border border-dashed border-white/15 bg-white/[0.03] py-6 text-mute transition hover:border-primary">
              <Upload size={26} /> <span className="font-semibold">Upload a 60-sec skill video</span>
              <span className="text-xs">Free: 1 video · Pro: unlimited</span>
            </button>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="card p-5">
                <div className="text-[11px] font-bold text-mute">FREE</div>
                <div className="my-1.5 font-display text-2xl font-bold">$0</div>
                <div className="text-[13px] text-mute">Basic profile + 1 video</div>
                <button disabled={busy} className="btn-ghost mt-3.5 w-full justify-center disabled:opacity-60" onClick={() => finish(false)}>{busy ? 'Creating…' : 'Start Free'}</button>
              </div>
              <div className="card border-primary/50 bg-primary/[0.06] p-5">
                <div className="inline-block rounded bg-gradient-to-r from-primary to-primary-2 px-2 py-0.5 text-[10px] font-extrabold text-white">PRO PLAYER</div>
                <div className="my-1.5 font-display text-2xl font-bold">$10<span className="text-sm text-mute">/mo</span></div>
                <div className="text-[13px] text-mute">Unlimited videos, daily practice, ✔ verified</div>
                <button disabled={busy} className="btn-primary mt-3.5 w-full justify-center disabled:opacity-60" onClick={goPro}>{busy ? 'Creating…' : 'Go Pro'}</button>
              </div>
            </div>
          </div>
        )}

        {step < 4 && (
          <div className="mt-6 flex gap-3">
            {step > 0 && <button className="btn-ghost" onClick={() => setStep((s) => s - 1)}><ArrowLeft size={16} /> Back</button>}
            <button className="btn-primary ml-auto" onClick={() => setStep((s) => s + 1)}>Continue <ChevronRight size={16} /></button>
          </div>
        )}
      </div>
    </div>
  );
}

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Upload, ChevronRight } from 'lucide-react';
import { useSession } from '../session';
import { COUNTRIES } from '../data';
import { apiEnabled, apiRegister, toBackendRole } from '../api';

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="field-label">{label}</label>
      {children}
    </div>
  );
}

export default function OrgRegister() {
  const nav = useNavigate();
  const { role, setRole, setProfile, signIn, toast } = useSession();
  const academy = role === 'academy';
  const noun = academy ? 'institution' : 'club';
  const types = academy ? ['Academy', 'School', 'University'] : ['Professional Club', 'Semi-pro Club', 'Scout / Agent'];

  const [name, setName] = useState('');
  const [type, setType] = useState(types[0]);
  const [country, setCountry] = useState(COUNTRIES[0]);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [agreed, setAgreed] = useState(false);
  const [busy, setBusy] = useState(false);

  const finish = async () => {
    if (busy) return;
    if (!name.trim()) { toast(`Please enter your ${noun} name`); return; }
    if (!/^\S+@\S+\.\S+$/.test(email.trim())) { toast('Please enter a valid email address'); return; }
    if (apiEnabled && password.length < 8) { toast('Password must be at least 8 characters'); return; }
    if (!agreed) { toast('Please accept the contact agreement to continue'); return; }

    const uiRole = academy ? 'academy' : 'club';
    const prof = { name: name.trim(), type, country };
    if (apiEnabled) {
      setBusy(true);
      try {
        const resp = await apiRegister({
          email: email.trim(), password, fullName: name.trim(),
          country: country.slice(0, 2).toUpperCase(), role: toBackendRole(uiRole), orgType: type,
        });
        signIn(resp, uiRole, prof);
      } catch (e) {
        toast((e as Error).message || 'Could not create account');
        setBusy(false);
        return;
      }
      setBusy(false);
    } else {
      setRole(uiRole);
      setProfile(prof);
    }
    toast(`${academy ? 'Institution' : 'Club'} account created — welcome!`);
    nav(academy ? '/academy' : '/club');
  };

  return (
    <div className="mx-auto max-w-2xl px-5 py-12">
      <button onClick={() => nav('/signup')} className="mb-5 inline-flex items-center gap-1.5 text-sm font-semibold text-mute hover:text-primary">
        <ArrowLeft size={15} /> Account type
      </button>
      <h1 className="font-display text-2xl font-bold">{academy ? 'Academy / School / University registration' : 'Club / Scout registration'}</h1>
      <p className="mt-1 text-sm text-mute">Tell us about your {noun} — this is how players and the Talenta team reach you.</p>

      <div className="card mt-6 space-y-6 p-7">
        <div>
          <h3 className="mb-4 font-display text-lg font-bold">{academy ? 'Institution' : 'Club'} details</h3>
          <div className="space-y-4">
            <Field label={`${academy ? 'Institution' : 'Club'} name`}>
              <input value={name} onChange={(e) => setName(e.target.value)} className="field-input" placeholder={academy ? 'e.g. City Football Academy' : 'e.g. Demo FC'} />
            </Field>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Type"><select value={type} onChange={(e) => setType(e.target.value)} className="field-input">{types.map((t) => <option key={t}>{t}</option>)}</select></Field>
              <Field label="Country"><select value={country} onChange={(e) => setCountry(e.target.value)} className="field-input">{COUNTRIES.map((c) => <option key={c}>{c}</option>)}</select></Field>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="City"><input className="field-input" placeholder="City" /></Field>
              <Field label="Founded year"><input type="number" className="field-input" placeholder="2015" /></Field>
            </div>
            <Field label="Website (optional)"><input className="field-input" placeholder="https://" /></Field>
          </div>
        </div>

        <div>
          <h3 className="mb-4 font-display text-lg font-bold">Contact person</h3>
          <div className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Full name"><input className="field-input" placeholder="Contact name" /></Field>
              <Field label="Role"><input className="field-input" placeholder="e.g. Head Coach, Director" /></Field>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Email"><input value={email} onChange={(e) => setEmail(e.target.value)} type="email" className="field-input" placeholder={`you@${noun}.com`} /></Field>
              <Field label="Phone / WhatsApp"><input className="field-input" placeholder="+91..." /></Field>
              <Field label="Password"><input value={password} onChange={(e) => setPassword(e.target.value)} type="password" className="field-input" placeholder="Min 8 characters" /></Field>
            </div>
          </div>
        </div>

        <div>
          <h3 className="mb-4 font-display text-lg font-bold">Verification & needs</h3>
          <div className="space-y-4">
            <Field label={academy ? 'Affiliation / recognition (AIFF, state association)' : 'Federation / FA affiliation number'}>
              <input className="field-input" placeholder="Registration / affiliation number" />
            </Field>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Looking for (positions)"><input className="field-input" placeholder="e.g. Strikers, Goalkeepers" /></Field>
              <Field label="Age range"><select className="field-input"><option>U-16</option><option>U-18</option><option>U-21</option><option>Senior</option><option>Any</option></select></Field>
            </div>
            <button onClick={() => toast('Logo + document upload')}
              className="flex w-full flex-col items-center gap-1 rounded-xl border border-dashed border-white/15 bg-white/[0.03] py-5 text-mute transition hover:border-primary">
              <Upload size={22} /> <span className="text-[13px]">Upload logo + verification document</span>
            </button>
          </div>
        </div>

        <label className="flex items-start gap-2.5 text-[13px] text-mute">
          <input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} className="mt-0.5 accent-primary" />
          I agree Talenta may contact me about onboarding, verification & opportunities.
        </label>

        <button onClick={finish} disabled={busy} className="btn-primary w-full justify-center disabled:opacity-60">
          {busy ? 'Creating account…' : <>Create {academy ? 'institution' : 'club'} account <ChevronRight size={16} /></>}
        </button>
      </div>
    </div>
  );
}

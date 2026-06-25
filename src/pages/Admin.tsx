import { useEffect, useState } from 'react';
import { ShieldCheck, BadgeCheck, Trash2, Plus, X, Save, LogOut, RefreshCw } from 'lucide-react';
import {
  apiEnabled, adminCheck, adminListUsers, adminUpdateUser, adminDeleteUser,
  BRAND_LOGOS, type AdminUser, type Sponsor,
} from '../api';

const KEY_STORE = 'talenta_admin_key';

export default function Admin() {
  const [key, setKey] = useState<string>(() => localStorage.getItem(KEY_STORE) || '');
  const [authed, setAuthed] = useState(false);
  const [keyInput, setKeyInput] = useState('');
  const [err, setErr] = useState('');

  // Try the stored key once on load.
  useEffect(() => {
    if (!key || !apiEnabled) return;
    adminCheck(key).then(() => setAuthed(true)).catch(() => { setAuthed(false); localStorage.removeItem(KEY_STORE); setKey(''); });
  }, []); // eslint-disable-line

  const unlock = async () => {
    setErr('');
    try {
      await adminCheck(keyInput.trim());
      localStorage.setItem(KEY_STORE, keyInput.trim());
      setKey(keyInput.trim()); setAuthed(true);
    } catch (e) { setErr((e as Error).message); }
  };
  const logout = () => { localStorage.removeItem(KEY_STORE); setKey(''); setAuthed(false); setKeyInput(''); };

  if (!apiEnabled) return <Centered>Admin needs the live backend (this build is in demo mode).</Centered>;

  if (!authed) {
    return (
      <div className="mx-auto max-w-md px-5 py-20">
        <div className="card p-8 text-center">
          <span className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-primary/15 text-primary"><ShieldCheck size={22} /></span>
          <h1 className="mt-4 font-display text-xl font-bold">Talenta Admin</h1>
          <p className="mt-1 text-[13px] text-mute">Enter your admin key to manage players, logos & sponsors.</p>
          <input
            type="password" value={keyInput} onChange={(e) => setKeyInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') unlock(); }}
            className="field-input mt-5" placeholder="Admin key" autoFocus
          />
          {err && <p className="mt-2 text-[12.5px] text-accent">{err}</p>}
          <button onClick={unlock} className="btn-primary mt-4 w-full justify-center">Unlock</button>
          <p className="mt-3 text-[11.5px] text-mute">Set <code className="text-slate-300">ADMIN_KEY</code> on the backend (Render) to enable this.</p>
        </div>
      </div>
    );
  }

  return <AdminBoard adminKey={key} onLogout={logout} />;
}

function AdminBoard({ adminKey, onLogout }: { adminKey: string; onLogout: () => void }) {
  const [group, setGroup] = useState<'players' | 'orgs'>('players');
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = () => {
    setLoading(true); setError('');
    adminListUsers(adminKey, group)
      .then((u) => setUsers(u))
      .catch((e) => setError((e as Error).message))
      .finally(() => setLoading(false));
  };
  useEffect(load, [group]); // eslint-disable-line

  return (
    <div className="mx-auto max-w-5xl px-5 py-10">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h1 className="flex items-center gap-2 font-display text-2xl font-bold"><ShieldCheck size={22} className="text-primary" /> Admin</h1>
        <div className="flex gap-2">
          <button onClick={load} className="btn-ghost text-[13px]"><RefreshCw size={14} /> Refresh</button>
          <button onClick={onLogout} className="btn-ghost text-[13px]"><LogOut size={14} /> Lock</button>
        </div>
      </div>

      <div className="mb-5 flex gap-2">
        <button onClick={() => setGroup('players')} className={`chip ${group === 'players' ? 'chip-active' : ''}`}>Players</button>
        <button onClick={() => setGroup('orgs')} className={`chip ${group === 'orgs' ? 'chip-active' : ''}`}>Clubs & Academies</button>
      </div>

      {error && <div className="card border-accent/40 bg-accent/[0.06] p-4 text-[13px] text-accent">{error}</div>}
      {loading ? (
        <div className="space-y-3">{Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-20 animate-pulse rounded-xl2 border border-white/10 bg-white/[0.03]" />)}</div>
      ) : users.length ? (
        <div className="space-y-3">
          {users.map((u) => <UserRow key={u.id} u={u} adminKey={adminKey} isPlayer={group === 'players'} onChanged={load} />)}
        </div>
      ) : <p className="text-mute">No users in this group yet.</p>}
    </div>
  );
}

function UserRow({ u, adminKey, isPlayer, onChanged }: { u: AdminUser; adminKey: string; isPlayer: boolean; onChanged: () => void }) {
  const [open, setOpen] = useState(false);
  const [verified, setVerified] = useState(u.isVerified);
  const [avatar, setAvatar] = useState(u.avatarUrl || '');
  const [sponsors, setSponsors] = useState<Sponsor[]>(u.sponsors || []);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState('');

  const save = async () => {
    setBusy(true); setMsg('');
    try {
      await adminUpdateUser(adminKey, u.id, { isVerified: verified, avatarUrl: avatar.trim() || null, sponsors });
      setMsg('Saved ✅'); onChanged();
    } catch (e) { setMsg((e as Error).message); }
    finally { setBusy(false); }
  };
  const del = async () => {
    if (!confirm(`Delete ${u.fullName}? This cannot be undone.`)) return;
    setBusy(true);
    try { await adminDeleteUser(adminKey, u.id); onChanged(); }
    catch (e) { setMsg((e as Error).message); setBusy(false); }
  };

  return (
    <div className="card overflow-hidden">
      <div className="flex items-center gap-3 p-4">
        {u.avatarUrl
          ? <img src={u.avatarUrl} alt="" className="h-11 w-11 flex-shrink-0 rounded-xl object-cover ring-1 ring-white/10" />
          : <span className="grid h-11 w-11 flex-shrink-0 place-items-center rounded-xl bg-primary/15 text-[13px] font-bold text-primary">{u.fullName.slice(0, 2).toUpperCase()}</span>}
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5 font-semibold">{u.fullName} {u.isVerified && <BadgeCheck size={15} className="text-sky" />}</div>
          <div className="truncate text-[12px] text-mute">{u.email} · {u.role}{u.orgType ? ` · ${u.orgType}` : ''}</div>
        </div>
        <button onClick={() => setOpen((o) => !o)} className="btn-ghost text-[12.5px]">{open ? 'Close' : 'Manage'}</button>
      </div>

      {open && (
        <div className="space-y-4 border-t border-white/10 p-4">
          <label className="flex items-center gap-2 text-[13px]">
            <input type="checkbox" checked={verified} onChange={(e) => setVerified(e.target.checked)} className="accent-primary" />
            Verified badge
          </label>

          <div>
            <label className="field-label">{isPlayer ? 'Face photo URL' : 'Logo URL'}</label>
            <div className="flex items-center gap-2">
              {avatar.trim() && <img src={avatar.trim()} alt="" className="h-9 w-9 flex-shrink-0 rounded-lg object-cover ring-1 ring-white/10" />}
              <input value={avatar} onChange={(e) => setAvatar(e.target.value)} className="field-input" placeholder="https://…" />
            </div>
          </div>

          {isPlayer && (
            <div>
              <label className="field-label">Sponsors</label>
              <div className="space-y-2">
                {sponsors.map((s, i) => (
                  <div key={i} className="flex items-center gap-2">
                    {s.logo && <img src={s.logo} alt="" className="h-7 w-7 flex-shrink-0 rounded bg-white object-contain p-0.5" />}
                    <input value={s.name} onChange={(e) => setSponsors((a) => a.map((x, j) => j === i ? { ...x, name: e.target.value } : x))} className="field-input !py-1.5 w-28" placeholder="Name" />
                    <input value={s.logo} onChange={(e) => setSponsors((a) => a.map((x, j) => j === i ? { ...x, logo: e.target.value } : x))} className="field-input !py-1.5 flex-1" placeholder="Logo URL" />
                    <button onClick={() => setSponsors((a) => a.filter((_, j) => j !== i))} className="text-mute hover:text-accent"><X size={16} /></button>
                  </div>
                ))}
              </div>
              <div className="mt-2 flex flex-wrap gap-1.5">
                <button onClick={() => setSponsors((a) => [...a, { name: '', logo: '' }])} className="chip !py-1 !text-[11px]"><Plus size={12} /> Custom</button>
                {Object.entries(BRAND_LOGOS).map(([name, logo]) => (
                  <button key={name} onClick={() => setSponsors((a) => a.some((x) => x.name === name) ? a : [...a, { name, logo }])}
                    className="chip !py-1 !text-[11px]">{name}</button>
                ))}
              </div>
            </div>
          )}

          <div className="flex items-center justify-between gap-3 pt-1">
            <button onClick={del} disabled={busy} className="inline-flex items-center gap-1.5 text-[13px] text-accent hover:underline disabled:opacity-50"><Trash2 size={14} /> Delete</button>
            <div className="flex items-center gap-3">
              {msg && <span className="text-[12.5px] text-mute">{msg}</span>}
              <button onClick={save} disabled={busy} className="btn-primary text-[13px] disabled:opacity-60"><Save size={14} /> {busy ? 'Saving…' : 'Save'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Centered({ children }: { children: React.ReactNode }) {
  return <div className="mx-auto max-w-md px-5 py-24 text-center text-mute">{children}</div>;
}

import { createContext, useContext, useState, ReactNode } from 'react';
import type { AuthResp } from './api';

export type Role = 'guest' | 'player' | 'club' | 'academy';

export interface Profile {
  name?: string;
  type?: string;
  country?: string;
  position?: string;
}

interface SessionCtx {
  role: Role;
  setRole: (r: Role) => void;
  pro: boolean;
  setPro: (p: boolean) => void;
  profile: Profile;
  setProfile: (p: Profile) => void;
  token: string | null;
  userId: string | null;
  signIn: (resp: AuthResp, uiRole: Role, profile?: Profile) => void;
  signOut: () => void;
  toast: (msg: string) => void;
  toastMsg: string | null;
}

const Ctx = createContext<SessionCtx>(null!);
export const useSession = () => useContext(Ctx);

const STORE = 'talenta_auth';
type Persisted = { token: string; role: Role; profile: Profile; userId?: string };

function loadAuth(): Persisted | null {
  try {
    const raw = localStorage.getItem(STORE);
    return raw ? (JSON.parse(raw) as Persisted) : null;
  } catch {
    return null;
  }
}

export function SessionProvider({ children }: { children: ReactNode }) {
  const saved = loadAuth();
  const [role, setRole] = useState<Role>(saved?.role ?? 'guest');
  const [pro, setPro] = useState(false);
  const [profile, setProfile] = useState<Profile>(saved?.profile ?? {});
  const [token, setToken] = useState<string | null>(saved?.token ?? null);
  const [userId, setUserId] = useState<string | null>(saved?.userId ?? null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const toast = (msg: string) => {
    setToastMsg(msg);
    window.clearTimeout((toast as any)._t);
    (toast as any)._t = window.setTimeout(() => setToastMsg(null), 2600);
  };

  const signIn = (resp: AuthResp, uiRole: Role, prof: Profile = {}) => {
    const merged: Profile = { name: resp.user.fullName, ...prof };
    setToken(resp.accessToken);
    setUserId(resp.user.id);
    setRole(uiRole);
    setProfile(merged);
    try {
      localStorage.setItem(STORE, JSON.stringify({ token: resp.accessToken, role: uiRole, profile: merged, userId: resp.user.id }));
    } catch { /* storage unavailable */ }
  };

  const signOut = () => {
    setToken(null);
    setUserId(null);
    setRole('guest');
    setPro(false);
    setProfile({});
    try { localStorage.removeItem(STORE); } catch { /* ignore */ }
  };

  return (
    <Ctx.Provider value={{ role, setRole, pro, setPro, profile, setProfile, token, userId, signIn, signOut, toast, toastMsg }}>
      {children}
    </Ctx.Provider>
  );
}

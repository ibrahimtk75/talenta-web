// ─────────────────────────────────────────────────────────────
// Backend API client.
// Set VITE_API_URL (e.g. https://talenta-api.onrender.com) at build time to
// switch the app from demo mode to the real backend. When it is unset the app
// stays fully in demo mode — no network calls — so the static site keeps working.
// ─────────────────────────────────────────────────────────────
const BASE = (((import.meta as any).env?.VITE_API_URL as string) || '').replace(/\/$/, '');

/** True when a backend URL is configured — gates all real auth/data calls. */
export const apiEnabled = !!BASE;

export type AuthUser = { id: string; email: string; role: string; fullName: string };
export type AuthResp = { user: AuthUser; accessToken: string; refreshToken: string };

async function call<T>(path: string, body?: unknown, token?: string): Promise<T> {
  const res = await fetch(BASE + path, {
    method: body ? 'POST' : 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  let data: any = {};
  try { data = await res.json(); } catch { /* empty body */ }
  if (!res.ok) {
    const msg = data?.error || data?.message || `Request failed (${res.status})`;
    throw new Error(typeof msg === 'string' ? msg : 'Request failed');
  }
  return data as T;
}

// Map the app's UI roles to the backend UserRole enum (PLAYER | CLUB | SCOUT).
// Academies/schools/universities are buyer-side orgs → registered as CLUB.
export function toBackendRole(uiRole: 'player' | 'club' | 'academy'): string {
  return uiRole === 'player' ? 'PLAYER' : 'CLUB';
}

export const apiRegister = (b: {
  email: string; password: string; fullName: string; country: string; role: string;
}) => call<AuthResp>('/api/auth/register', b);

export const apiLogin = (b: { email: string; password: string }) =>
  call<AuthResp>('/api/auth/login', b);

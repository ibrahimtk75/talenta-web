// ─────────────────────────────────────────────────────────────
// Backend API client.
// Set VITE_API_URL (e.g. https://talenta-api.onrender.com) at build time to
// switch the app from demo mode to the real backend. When it is unset the app
// stays fully in demo mode — no network calls — so the static site keeps working.
// ─────────────────────────────────────────────────────────────
import type { Player } from './data';

const BASE = (((import.meta as any).env?.VITE_API_URL as string) || '').replace(/\/$/, '');

/** True when a backend URL is configured — gates all real auth/data calls. */
export const apiEnabled = !!BASE;

export type AuthUser = { id: string; email: string; role: string; fullName: string };
export type AuthResp = { user: AuthUser; accessToken: string; refreshToken: string };

async function call<T>(path: string, body?: unknown, token?: string, method?: string): Promise<T> {
  const res = await fetch(BASE + path, {
    method: method || (body ? 'POST' : 'GET'),
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

// Create/update the caller's football profile so they appear in Browse/search.
export type ProfileBody = {
  sport: 'FOOTBALL';
  position?: string;
  heightCm?: number;
  weightKg?: number;
  dominantSide?: string;
  dateOfBirth?: string; // ISO datetime
  currentClub?: string;
  stats: Record<string, number>;
};
export const apiUpsertProfile = (token: string, b: ProfileBody) =>
  call('/api/profiles', b, token, 'PUT');

// ─────────────────────────────────────────────────────────────
// Players (public browse) — GET /api/players returns an array of footballers.
// ─────────────────────────────────────────────────────────────
type BackendPlayer = {
  id: string; name: string; country: string | null; position: string | null;
  age: number | null; foot: string | null; career: [string, string][] | null;
  headline: string | null; stats: Record<string, number> | null;
  youtubeVideoId: string | null; views: number; pro: boolean; verified: boolean;
  match?: number;
};

// Simple, explainable match score (mirrors the backend) so cards have a number.
function computeMatch(b: BackendPlayer): number {
  const s = b.stats || {};
  let score = 60;
  if (b.verified) score += 12;
  if (b.pro) score += 6;
  score += Math.min(12, (Number(s.goals ?? 0) + Number(s.assists ?? 0)) / 6);
  score += Math.min(6, Number((s as any)['Pass %'] ?? s.passAccuracy ?? 0) / 16);
  score += Math.min(4, (b.views || 0) / 500);
  return Math.min(99, Math.round(score));
}

function mapPlayer(b: BackendPlayer): Player {
  return {
    id: String(b.id),
    name: b.name || 'Unnamed player',
    country: b.country || 'Other',
    pos: b.position || 'Player',
    age: b.age ?? 0,
    foot: b.foot || '—',
    yt: b.youtubeVideoId || '',
    pro: !!b.pro,
    verified: !!b.verified,
    match: typeof b.match === 'number' ? b.match : computeMatch(b),
    headline: b.headline || '',
    stats: (b.stats as Record<string, number | string>) || {},
    career: (b.career as [string, string][]) || [],
  };
}

/** Fetch real registered footballers from the backend. */
export async function fetchPlayers(): Promise<Player[]> {
  const data = await call<BackendPlayer[]>('/api/players?limit=50');
  return Array.isArray(data) ? data.map(mapPlayer) : [];
}

// ─────────────────────────────────────────────────────────────
// Messaging — real conversations between players and clubs/academies.
// ─────────────────────────────────────────────────────────────
export type Conversation = { peerId: string; peerName: string; lastMessage: string; at: string };
export type Message = { id: string; senderId: string; receiverId: string; body: string; createdAt: string; readAt: string | null };

export const apiListConversations = (token: string) =>
  call<Conversation[]>('/api/messages', undefined, token);

export const apiGetConversation = (token: string, otherUserId: string) =>
  call<Message[]>(`/api/messages/${otherUserId}`, undefined, token);

export const apiSendMessage = (token: string, receiverId: string, body: string) =>
  call<Message>('/api/messages', { receiverId, body }, token);

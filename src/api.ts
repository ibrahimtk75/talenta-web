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
    // Turn backend codes into friendly, actionable messages for users.
    let msg: string;
    if (res.status === 409) {
      msg = 'This email is already registered. Please log in instead, or use a different email.';
    } else if (res.status === 401) {
      msg = 'Incorrect email or password.';
    } else if (res.status === 400 && Array.isArray(data?.issues) && data.issues[0]?.message) {
      msg = data.issues[0].message;
    } else {
      const raw = data?.message || data?.error;
      msg = (typeof raw === 'string' && raw && raw !== 'CONFLICT' && raw !== 'VALIDATION_ERROR')
        ? raw : `Something went wrong (${res.status}). Please try again.`;
    }
    throw new Error(msg);
  }
  return data as T;
}

// Map the app's UI roles to the backend UserRole enum (PLAYER | CLUB | SCOUT).
// Academies/schools/universities are buyer-side orgs → registered as CLUB.
export function toBackendRole(uiRole: 'player' | 'club' | 'academy' | 'coach' | 'referee'): string {
  if (uiRole === 'player') return 'PLAYER';
  if (uiRole === 'coach') return 'COACH';
  if (uiRole === 'referee') return 'REFEREE';
  return 'CLUB';
}

export const apiRegister = (b: {
  email: string; password: string; fullName: string; country: string; role: string; orgType?: string; avatarUrl?: string;
}) => call<AuthResp>('/api/auth/register', b);

export const apiLogin = (b: { email: string; password: string }) =>
  call<AuthResp>('/api/auth/login', b);

// Create/update the caller's football profile so they appear in Browse/search.
export type ProfileBody = {
  sport: 'FOOTBALL';
  position?: string;
  skillLevel?: string;
  heightCm?: number;
  weightKg?: number;
  dominantSide?: string;
  dateOfBirth?: string; // ISO datetime
  currentClub?: string;
  stats: Record<string, number>;
};
export const apiUpsertProfile = (token: string, b: ProfileBody) =>
  call('/api/profiles', b, token, 'PUT');

// Attach a reel by link — YouTube or Instagram — to the caller's profile.
export const apiAddVideoLink = (token: string, url: string, title?: string) =>
  call<{ id: string; youtubeVideoId: string | null; instagramUrl: string | null }>('/api/videos/link', { url, title }, token);

// ─────────────────────────────────────────────────────────────
// Players (public browse) — GET /api/players returns an array of footballers.
// ─────────────────────────────────────────────────────────────
type BackendPlayer = {
  id: string; name: string; country: string | null; photo?: string | null; position: string | null; skillLevel?: string | null;
  age: number | null; foot: string | null; career: [string, string][] | null;
  headline: string | null; stats: Record<string, number> | null;
  youtubeVideoId: string | null; instagramUrl?: string | null; views: number; pro: boolean; verified: boolean;
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
    photo: b.photo || undefined,
    pos: b.position || 'Player',
    skillLevel: b.skillLevel || undefined,
    age: b.age ?? 0,
    foot: b.foot || '—',
    yt: b.youtubeVideoId || '',
    igUrl: b.instagramUrl || undefined,
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

// ─────────────────────────────────────────────────────────────
// AI support chatbot.
// ─────────────────────────────────────────────────────────────
export type ChatMsg = { role: 'user' | 'assistant'; content: string };
export const apiSupportChat = (message: string, history: ChatMsg[]) =>
  call<{ reply: string; ai?: boolean }>('/api/support-chat', { message, history });

// ─────────────────────────────────────────────────────────────
// Coaches (multi-role sports ecosystem).
// ─────────────────────────────────────────────────────────────
export type Coach = {
  id: string; name: string; country: string; verified: boolean;
  sports: string[]; certifications: string | null; experienceYrs: number | null;
  bio: string | null; hourlyRate: number | null;
};
export type CoachProfileBody = {
  sports?: string[]; certifications?: string; experienceYrs?: number; bio?: string; hourlyRate?: number;
};
export const fetchCoaches = () => call<Coach[]>('/api/coaches');
export const apiUpsertCoachProfile = (token: string, b: CoachProfileBody) =>
  call('/api/coach-profile', b, token, 'PUT');

export type Referee = {
  id: string; name: string; country: string; verified: boolean;
  sports: string[]; level: string | null; experienceYrs: number | null; available: boolean;
};
export type RefereeProfileBody = { sports?: string[]; level?: string; experienceYrs?: number; available?: boolean; };
export const fetchReferees = () => call<Referee[]>('/api/referees');
export const apiUpsertRefereeProfile = (token: string, b: RefereeProfileBody) =>
  call('/api/referee-profile', b, token, 'PUT');

// ─────────────────────────────────────────────────────────────
// Institutions directory — clubs, academies, schools, universities.
// ─────────────────────────────────────────────────────────────
export type Institution = {
  id: string; name: string; country: string;
  role: 'CLUB' | 'ACADEMY'; orgType: string | null; verified: boolean;
};
export const fetchInstitutions = () => call<Institution[]>('/api/institutions');

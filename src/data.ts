export interface Player {
  id: string;
  name: string;
  country: string;
  pos: string;
  skillLevel?: string;
  age: number;
  foot: string;
  yt: string;
  pro: boolean;
  verified: boolean;
  match: number;
  headline: string;
  stats: Record<string, number | string>;
  career: [string, string][];
}

const YT = ['5nTsWZODuqY', 'krpA9bG518M', 'DBVnii3IOPw', '1QfjMjWgnLA', 'ORhUiDLe_7I', 'LAOoEeJ3TUo'];

export const FLAG: Record<string, string> = {
  BR: '🇧🇷', AR: '🇦🇷', NG: '🇳🇬', DE: '🇩🇪', PT: '🇵🇹', FR: '🇫🇷', GB: '🇬🇧', ES: '🇪🇸',
};

export const COUNTRY_NAME: Record<string, string> = {
  BR: 'Brazil', AR: 'Argentina', NG: 'Nigeria', DE: 'Germany', PT: 'Portugal', FR: 'France', GB: 'England', ES: 'Spain',
};

export const PLAYERS: Player[] = [
  { id: '1', name: 'Leo Martins', country: 'BR', pos: 'Striker', age: 19, foot: 'Right', yt: YT[0], pro: true, verified: true, match: 96, headline: '41 goals · 18 assists', stats: { Appearances: 60, Goals: 41, Assists: 18, 'Pass %': 82 }, career: [['2014–2018', 'Santos Youth Academy'], ['2018–2021', 'Santos U-17'], ['2021–now', 'Santos B Team']] },
  { id: '2', name: 'Diego Santos', country: 'AR', pos: 'Left Winger', age: 18, foot: 'Left', yt: YT[1], pro: true, verified: true, match: 91, headline: '28 goals · 22 assists', stats: { Appearances: 44, Goals: 28, Assists: 22, 'Pass %': 79 }, career: [['2016–2020', 'River Plate Academy'], ['2020–now', 'River Plate U-19']] },
  { id: '3', name: 'Samuel Okafor', country: 'NG', pos: 'Central Midfielder', age: 20, foot: 'Right', yt: YT[2], pro: false, verified: false, match: 88, headline: '21 assists · 88% pass', stats: { Appearances: 38, Goals: 9, Assists: 21, 'Pass %': 88 }, career: [['2019–now', 'Enyimba FC Academy']] },
  { id: '4', name: 'Lucas Müller', country: 'DE', pos: 'Centre-Back', age: 21, foot: 'Right', yt: YT[3], pro: true, verified: true, match: 84, headline: '140 tackles · 91% pass', stats: { Appearances: 52, Tackles: 140, 'Aerial %': 74, 'Pass %': 91 }, career: [['2015–2019', 'Bayern Youth'], ['2019–now', 'TSV 1860 U-21']] },
  { id: '5', name: 'João Silva', country: 'PT', pos: 'Goalkeeper', age: 19, foot: 'Right', yt: YT[4], pro: false, verified: false, match: 80, headline: '18 clean sheets', stats: { Appearances: 40, 'Clean Sheets': 18, Saves: 96, 'Save %': 78 }, career: [['2018–now', 'Benfica B']] },
  { id: '6', name: 'Karim Haddad', country: 'FR', pos: 'Centre-Forward', age: 18, foot: 'Left', yt: YT[5], pro: false, verified: false, match: 78, headline: '24 goals', stats: { Appearances: 33, Goals: 24, Assists: 11, 'Pass %': 77 }, career: [['2017–now', 'Lyon Academy']] },
];

export const POSITIONS = [
  'All Positions', 'Goalkeeper', 'Right-Back', 'Centre-Back', 'Left-Back',
  'Defensive Midfielder', 'Central Midfielder', 'Attacking Midfielder',
  'Right Winger', 'Left Winger', 'Striker', 'Centre-Forward',
];

// Self-declared skill level — helps clubs & academies filter by level.
export const SKILL_LEVELS = ['Beginner', 'Intermediate', 'Advanced', 'Semi-Pro', 'Professional'];

export const COUNTRIES = ['Argentina', 'Australia', 'Belgium', 'Brazil', 'Cameroon', 'Canada', 'Colombia', 'Croatia', 'Denmark', 'Egypt', 'England', 'France', 'Germany', 'Ghana', 'India', 'Italy', 'Ivory Coast', 'Japan', 'Mexico', 'Morocco', 'Netherlands', 'Nigeria', 'Norway', 'Pakistan', 'Portugal', 'Qatar', 'Saudi Arabia', 'Scotland', 'Senegal', 'Spain', 'Sweden', 'UAE', 'USA', 'Uruguay', 'Wales', 'Other'];

export const CLUBS = ['Demo FC', 'River Plate Academy', 'Santos Youth', 'Benfica B', 'Lyon Academy', 'Bayern Youth', 'Enyimba FC', 'City Academy'];

export const DEALS: [string, string, string][] = [
  ['Leo Martins', 'Demo FC', 'Signed'],
  ['Diego Santos', 'River Plate', 'Signed'],
  ['Lucas Müller', 'TSV 1860', 'On trial'],
  ['Karim Haddad', 'Lyon Academy', 'Signed'],
];

export const SPORTS: [string, string, boolean][] = [
  ['Football', '⚽', true], ['Cricket', '🏏', false], ['Basketball', '🏀', false], ['Hockey', '🏑', false], ['Tennis', '🎾', false],
];

// Region pricing (all USD)
export function pricing(region: 'world' | 'india', monthly: boolean) {
  const m = monthly;
  const india = region === 'india';
  return {
    player: india ? (m ? '$2' : '$19') : (m ? '$10' : '$99'),
    school: india ? (m ? '$12' : '$120') : (m ? '$49' : '$490'),
    academy: india ? (m ? '$24' : '$240') : (m ? '$99' : '$990'),
    university: india ? (m ? '$36' : '$360') : (m ? '$149' : '$1,490'),
    club: india ? (m ? '$99' : '$999') : (m ? '$199' : '$1,999'),
    per: m ? '/mo' : '/yr',
  };
}

export const initials = (name: string) =>
  name.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase();

// Player valuation (asking price) + live bidding stats — demo, derived from form.
export const valuationOf = (p: Player) => {
  const g = Number(p.stats.Goals ?? p.stats.goals) || 0;
  const a = Number(p.stats.Assists ?? p.stats.assists) || 0;
  return Math.round((80 + (p.match - 78) * 12 + g * 4 + a * 2) / 5) * 5; // in $K
};
export const fmtMoney = (k: number) => (k >= 1000 ? `$${(k / 1000).toFixed(2)}M` : `$${k}K`);
export const bidStatsOf = (p: Player) => ({
  bidders: 2 + (Number(p.id) % 4),
  highest: Math.round((valuationOf(p) * 0.86) / 5) * 5, // current top bid, just under asking
});

// Deterministic hue per name → distinct, brand-like placeholder logos.
export const hueFor = (s: string) => {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) % 360;
  return h;
};

// Stable demo rating derived from match + verification (no extra data needed).
export const ratingOf = (p: Player) =>
  +(3.7 + ((p.match - 78) / 22) * 1.2 + (p.verified ? 0.1 : 0)).toFixed(1);
export const ratingCountOf = (p: Player) => 6 + Number(p.id) * 7;

// Registered clubs, academies, schools & universities on the platform.
export interface Org {
  name: string;
  type: string;
  country: string;
  players: number;
  verified: boolean;
  rating: number;
}
export const ORGS: Org[] = [
  { name: 'Demo FC', type: 'Professional Club', country: 'GB', players: 34, verified: true, rating: 4.7 },
  { name: 'River Plate Academy', type: 'Academy', country: 'AR', players: 86, verified: true, rating: 4.8 },
  { name: 'Santos Youth', type: 'Academy', country: 'BR', players: 72, verified: true, rating: 4.6 },
  { name: 'Lyon Academy', type: 'Academy', country: 'FR', players: 58, verified: true, rating: 4.5 },
  { name: 'Bayern Youth', type: 'Professional Club', country: 'DE', players: 64, verified: true, rating: 4.9 },
  { name: 'Enyimba FC', type: 'Professional Club', country: 'NG', players: 41, verified: false, rating: 4.3 },
  { name: 'City Football School', type: 'School', country: 'GB', players: 120, verified: true, rating: 4.4 },
  { name: 'Lisbon Sports University', type: 'University', country: 'PT', players: 95, verified: true, rating: 4.6 },
];

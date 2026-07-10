export interface Review {
  author: string;
  country: string;
  rating: number;
  date: string;
  title: string;
  body: string;
  verified: boolean;
}

// A small pool of realistic reviews. We pick deterministically per product so
// the UI is stable across renders (no randomness). In production these come
// from the reviews service.
const POOL: Omit<Review, 'rating'>[] = [
  { author: 'Amelia R.', country: 'United Kingdom', date: '2026-06-18', title: 'Smooth from start to finish', body: 'Application was clear and I knew exactly where I stood at each step. Funds arrived when promised.', verified: true },
  { author: 'David K.', country: 'United States', date: '2026-05-30', title: 'Transparent pricing', body: 'No surprise fees — the rate I was quoted is the rate I got. The comparison here saved me hours.', verified: true },
  { author: 'Priya S.', country: 'India', date: '2026-06-02', title: 'Great support', body: 'Customer service answered every question quickly. The eligibility estimate set the right expectations.', verified: true },
  { author: 'Liam O.', country: 'Nigeria', date: '2026-04-21', title: 'Solid, but paperwork', body: 'Good product overall. Verification took a couple of days longer than I hoped, but worth it.', verified: false },
  { author: 'Sofia M.', country: 'Germany', date: '2026-06-11', title: 'Exactly what I needed', body: 'Terms matched the listing precisely. Would recommend to anyone comparing options.', verified: true },
  { author: 'Omar A.', country: 'UAE', date: '2026-05-09', title: 'Fast and fair', body: 'Quick decision and the trust score gave me confidence before I even applied.', verified: true },
];

function hash(str: string): number {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) >>> 0;
  return h;
}

/** Deterministic 3 reviews for a product, tuned around its overall rating. */
export function reviewsFor(productId: string, overall: number): Review[] {
  const seed = hash(productId);
  const picks = [seed % POOL.length, (seed >>> 3) % POOL.length, (seed >>> 6) % POOL.length];
  // ensure distinct indices
  const idx: number[] = [];
  for (const p of picks) {
    let i = p;
    while (idx.includes(i)) i = (i + 1) % POOL.length;
    idx.push(i);
  }
  const offsets = [0.4, -0.3, 0.1];
  return idx.map((i, k) => ({
    ...POOL[i],
    rating: Math.max(1, Math.min(5, Math.round(overall + offsets[k]))),
  }));
}

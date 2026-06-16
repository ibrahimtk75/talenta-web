// ─────────────────────────────────────────────────────────────
// Stripe Payment Links
// Create each link in your Stripe Dashboard → Payment Links,
// then paste the URL (looks like https://buy.stripe.com/xxxxx) below.
// Leave blank ('') for any plan you haven't set up yet — its button
// will show a friendly "coming soon" message instead of breaking.
//
// Key format:  <tier>_<region>_<cycle>
//   tier:   proplayer | school | academy | university | club
//   region: world (USA & Europe)  |  india
//   cycle:  m (monthly)  |  y (yearly)
// ─────────────────────────────────────────────────────────────
export const PAY_LINKS: Record<string, string> = {
  // FOR PLAYERS — Pro Player  (world $10/mo · $99/yr   india $2/mo · $19/yr)
  proplayer_world_m: 'https://buy.stripe.com/cNicMY9ZP9E74hg9EKgEg00',
  proplayer_world_y: 'https://buy.stripe.com/28EaEQdc103xcNM3gmgEg01',
  proplayer_india_m: 'https://buy.stripe.com/dRm5kw4Fv17BeVU9EKgEg02',
  proplayer_india_y: 'https://buy.stripe.com/eVqdR26NDdUn01004agEg03',

  // SCHOOL  (world $49/mo · $490/yr   india $12/mo · $120/yr)
  school_world_m: '',
  school_world_y: '',
  school_india_m: '',
  school_india_y: '',

  // ACADEMY  (world $99/mo · $990/yr   india $24/mo · $240/yr)
  academy_world_m: '',
  academy_world_y: '',
  academy_india_m: '',
  academy_india_y: '',

  // UNIVERSITY  (world $149/mo · $1,490/yr   india $36/mo · $360/yr)
  university_world_m: '',
  university_world_y: '',
  university_india_m: '',
  university_india_y: '',

  // CLUB  (world $199/mo · $1,999/yr   india $99/mo · $999/yr)
  club_world_m: '',
  club_world_y: '',
  club_india_m: '',
  club_india_y: '',
};

/** Resolve a checkout URL for a tier in the current region/cycle. Returns '' if not set up yet. */
export function payLink(tier: string, region: 'world' | 'india', monthly: boolean): string {
  return PAY_LINKS[`${tier}_${region}_${monthly ? 'm' : 'y'}`] || '';
}

// Sales contact — used for org/enterprise tiers that go through our team rather than self-serve.
export const SALES_EMAIL = 'aisolutons@gmail.com';

/** Open the user's email client with a pre-filled enquiry for a given plan. */
export function contactSales(plan: string, price = '') {
  const subject = `Talenta — ${plan} enquiry`;
  const body = `Hi Talenta team,\n\nI'd like to know more about the ${plan} plan${price ? ` (${price})` : ''}.\n\nOrganisation name:\nCountry:\nPhone / WhatsApp:\n\nThanks!`;
  window.location.href = `mailto:${SALES_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

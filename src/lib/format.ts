import type { CurrencyCode } from './types';

export const CURRENCIES: Record<CurrencyCode, { symbol: string; label: string; rate: number }> = {
  // rate = units per 1 USD (illustrative, static)
  USD: { symbol: '$', label: 'US Dollar', rate: 1 },
  EUR: { symbol: '€', label: 'Euro', rate: 0.92 },
  GBP: { symbol: '£', label: 'British Pound', rate: 0.79 },
  INR: { symbol: '₹', label: 'Indian Rupee', rate: 83 },
  AED: { symbol: 'د.إ', label: 'UAE Dirham', rate: 3.67 },
  NGN: { symbol: '₦', label: 'Nigerian Naira', rate: 1550 },
};

export function formatMoney(amount: number, currency: CurrencyCode): string {
  const { symbol } = CURRENCIES[currency];
  const abs = Math.abs(amount);
  let display: string;
  if (abs >= 1_000_000) display = `${(amount / 1_000_000).toFixed(amount % 1_000_000 === 0 ? 0 : 1)}M`;
  else if (abs >= 1_000) display = `${(amount / 1_000).toFixed(amount % 1_000 === 0 ? 0 : 1)}K`;
  else display = amount.toLocaleString();
  return `${symbol}${display}`;
}

export function formatRate(rate: number | null, label: string): string {
  if (rate === null) return label;
  if (label === 'Coverage' || label === 'Non-repayable' || label === 'Full tuition') return label;
  return `${rate}% ${label}`;
}

export function trustBand(score: number): { label: string; tone: 'good' | 'ok' | 'bad' } {
  if (score >= 85) return { label: 'Highly trusted', tone: 'good' };
  if (score >= 65) return { label: 'Trusted', tone: 'ok' };
  return { label: 'Use caution', tone: 'bad' };
}

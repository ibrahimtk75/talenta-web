import { useEffect, useState } from 'react';

// Auto-detect the visitor's country + currency, and the live USD→local rate, so
// prices can be shown in their own currency (₹ in India, £ in the UK, etc.).
// Everything falls back to USD if the lookups fail — display only; billing is in USD.

export type CurrencyInfo = {
  code: string; // ISO currency, e.g. "INR"
  rate: number; // 1 USD = rate * local
  country: string; // ISO-2 country code, e.g. "IN"
  loading: boolean;
};

const USD: CurrencyInfo = { code: 'USD', rate: 1, country: '', loading: false };
let cache: CurrencyInfo | null = null;
let inflight: Promise<CurrencyInfo> | null = null;

async function detect(): Promise<CurrencyInfo> {
  try {
    const geo = await fetch('https://ipapi.co/json/').then((r) => r.json());
    const code = String(geo.currency || 'USD').toUpperCase();
    const country = String(geo.country_code || geo.country || '').toUpperCase();
    if (code === 'USD') return { code, rate: 1, country, loading: false };
    const fx = await fetch('https://open.er-api.com/v6/latest/USD').then((r) => r.json());
    const rate = Number(fx?.rates?.[code]) || 1;
    return { code, rate, country, loading: false };
  } catch {
    return USD;
  }
}

export function useCurrency(): CurrencyInfo {
  const [info, setInfo] = useState<CurrencyInfo>(cache ?? { ...USD, loading: true });
  useEffect(() => {
    if (cache) { setInfo(cache); return; }
    let alive = true;
    inflight = inflight ?? detect();
    inflight.then((res) => { cache = res; if (alive) setInfo(res); }).finally(() => { inflight = null; });
    return () => { alive = false; };
  }, []);
  return info;
}

// Round to a clean, human price (avoid ugly ₹1,577-type numbers).
function niceRound(n: number): number {
  if (n <= 0) return 0;
  if (n < 100) return Math.round(n / 5) * 5;
  if (n < 1000) return Math.round(n / 10) * 10;
  if (n < 10000) return Math.round(n / 50) * 50;
  return Math.round(n / 100) * 100;
}

/** Convert a USD amount to the visitor's currency and format it (no decimals). */
export function fmtLocal(usd: number, cur: CurrencyInfo): string {
  if (usd <= 0) return cur.code === 'USD' ? '$0' : '0';
  const amount = niceRound(usd * cur.rate);
  try {
    return new Intl.NumberFormat(undefined, {
      style: 'currency', currency: cur.code, maximumFractionDigits: 0,
    }).format(amount);
  } catch {
    return '$' + Math.round(usd);
  }
}

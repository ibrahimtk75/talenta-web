import { useEffect, useState } from 'react';
import { Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { pricing } from '../data';
import { payLink, contactSales } from '../payments';
import { useSession } from '../session';
import { useCurrency, fmtLocal, type CurrencyInfo } from '../currency';
import { useSEO } from '../useSEO';

type Tier = { name: string; tag?: string; usd?: number; lit?: string; per?: string; items: string[]; cta: string; feat?: boolean; pkey?: string; free?: boolean };

function TierCard({ t, region, monthly, cur }: { t: Tier; region: 'world' | 'india'; monthly: boolean; cur: CurrencyInfo }) {
  const { toast } = useSession();
  const nav = useNavigate();

  const priceText = t.lit ?? (t.usd != null ? fmtLocal(t.usd, cur) : '');

  const onCta = () => {
    if (t.free) { nav('/signup'); return; }
    if (t.pkey) {
      const url = payLink(t.pkey, region, monthly);
      if (url) { window.open(url, '_blank', 'noopener'); return; }
    }
    // Org/enterprise tiers (and "Learn more") go through our sales team via email.
    contactSales(t.name, `${priceText}${t.per || ''}`);
    toast('Opening email to our team ✉️');
  };

  return (
    <div className={`card relative p-6 ${t.feat ? 'border-primary/50 bg-primary/[0.06] shadow-glow' : ''}`}>
      {t.tag && <div className={`mb-3 inline-block rounded px-2.5 py-1 text-[11px] font-extrabold ${t.tag === 'FREE' ? 'bg-white/10 text-mute' : 'bg-gradient-to-r from-primary to-primary-2 text-white'}`}>{t.tag}</div>}
      <h3 className="text-lg font-bold">{t.name}</h3>
      <div className="my-1 font-display text-3xl font-bold">{t.free ? 'Free' : priceText}<span className="text-sm font-medium text-mute">{t.per}</span></div>
      <ul className="my-5 space-y-2.5">
        {t.items.map((i) => (
          <li key={i} className="flex gap-2 text-[13.5px] text-slate-200"><Check size={16} className="mt-0.5 flex-shrink-0 text-primary" /> {i}</li>
        ))}
      </ul>
      <button onClick={onCta} className={`${t.feat ? 'btn-primary' : 'btn-ghost'} w-full justify-center`}>{t.cta}</button>
    </div>
  );
}

export default function Pricing() {
  useSEO({
    title: 'Pricing — free for players, plans for clubs & academies | Talenta',
    description: 'Talenta is free for players. Clubs, academies, schools and universities get simple plans, plus a 3% commission only on successful deals. India & global pricing.',
  });
  const cur = useCurrency();
  const [region, setRegion] = useState<'world' | 'india'>('world');
  const [monthly, setMonthly] = useState(true);
  const [touched, setTouched] = useState(false);
  const p = pricing(region, monthly);

  // Auto-pick the India tier for visitors detected in India (until the user
  // manually changes the region toggle).
  useEffect(() => {
    if (!touched && cur.country === 'IN') setRegion('india');
  }, [cur.country, touched]);

  const chooseRegion = (r: 'world' | 'india') => { setTouched(true); setRegion(r); };

  const players: Tier[] = [
    { name: 'Free Player', tag: 'FREE', free: true, items: ['Public career profile', '1 highlight video', 'Appear in search'], cta: 'Start Free' },
    { name: 'Pro Player', tag: 'POPULAR', usd: p.player, per: p.per, feat: true, pkey: 'proplayer', items: ['Everything in Free', 'Unlimited videos', 'Daily practice space', '✔ Verified badge', 'Boosted visibility', 'Profile analytics'], cta: 'Go Pro' },
  ];
  // India institutions: explicit, rounded ₹ prices (lower for the Indian market).
  // Shown literally for the India region; world region uses USD→local FX.
  const inr = region === 'india';
  const iInst = monthly
    ? { school: '₹300', academy: '₹600', university: '₹900' }
    : { school: '₹3,000', academy: '₹6,000', university: '₹9,000' };
  const inst: Tier[] = [
    { name: 'School', ...(inr ? { lit: iInst.school } : { usd: p.school }), per: p.per, pkey: 'school', items: ['School sports profile', 'Showcase your students', 'Discover & contact talent', 'Up to 50 athletes'], cta: 'Contact Sales' },
    { name: 'Academy', tag: 'POPULAR', ...(inr ? { lit: iInst.academy } : { usd: p.academy }), per: p.per, feat: true, pkey: 'academy', items: ['Everything in School', 'AI talent suggestions', 'Advanced search & filters', 'Unlimited athletes'], cta: 'Contact Sales' },
    { name: 'University', ...(inr ? { lit: iInst.university } : { usd: p.university }), per: p.per, pkey: 'university', items: ['Everything in Academy', 'Multi-team management', 'Recruitment tools', 'Priority support'], cta: 'Contact Sales' },
  ];
  const club: Tier[] = [
    { name: 'Pro Club', usd: p.club, per: p.per, pkey: 'club', items: ['AI player suggestions', 'Advanced search & filters', 'Contact & sign players', 'Saved shortlists'], cta: 'Contact Sales' },
    { name: 'Deal commission', lit: '3%', per: '/deal', items: ['Only when you sign a player', 'Secure on-platform deal record', 'Contract & verification support'], cta: 'Learn more' },
  ];

  const Seg = ({ opts, val, set }: { opts: [string, string][]; val: string; set: (v: any) => void }) => (
    <div className="inline-flex rounded-xl border border-white/10 bg-white/[0.06] p-1">
      {opts.map(([k, label]) => (
        <button key={k} onClick={() => set(k)}
          className={`rounded-lg px-4 py-2 text-[13px] font-bold transition ${val === k ? 'bg-gradient-to-r from-primary to-primary-2 text-white' : 'text-mute'}`}>{label}</button>
      ))}
    </div>
  );

  return (
    <div className="mx-auto max-w-6xl px-5 py-12">
      <h1 className="font-display text-2xl font-bold md:text-3xl">Pricing</h1>
      <p className="mt-1 text-sm text-mute">
        {cur.loading
          ? 'Loading prices for your region…'
          : cur.code === 'USD'
            ? 'Players start free. Schools, academies, universities & clubs pay to discover & sign. We take just 3% on successful deals.'
            : <>Shown in <b className="text-slate-200">{cur.code}</b> for your region (approx; billed in USD). Players start free — we take just 3% on successful deals.</>}
      </p>

      <div className="mt-5 flex flex-wrap items-center gap-3">
        <Seg opts={[['world', '🌍 USA & Europe'], ['india', '🇮🇳 India']]} val={region} set={chooseRegion} />
        <Seg opts={[['m', 'Monthly'], ['y', 'Yearly']]} val={monthly ? 'm' : 'y'} set={(v) => setMonthly(v === 'm')} />
      </div>

      <Group title="FOR PLAYERS" tiers={players} region={region} monthly={monthly} cur={cur} />
      <Group title="FOR SCHOOLS · ACADEMIES · UNIVERSITIES" tiers={inst} region={region} monthly={monthly} cur={cur} />
      <Group title="FOR PROFESSIONAL CLUBS" tiers={club} region={region} monthly={monthly} cur={cur} />
    </div>
  );
}

function Group({ title, tiers, region, monthly, cur }: { title: string; tiers: Tier[]; region: 'world' | 'india'; monthly: boolean; cur: CurrencyInfo }) {
  return (
    <>
      <h4 className="mb-3.5 mt-9 text-[13px] font-bold uppercase tracking-wide text-mute">{title}</h4>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{tiers.map((t) => <TierCard key={t.name} t={t} region={region} monthly={monthly} cur={cur} />)}</div>
    </>
  );
}

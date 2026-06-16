import { useState } from 'react';
import { Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { pricing } from '../data';
import { payLink, contactSales } from '../payments';
import { useSession } from '../session';

type Tier = { name: string; tag?: string; price: string; per?: string; items: string[]; cta: string; feat?: boolean; pkey?: string; free?: boolean };

function TierCard({ t, region, monthly }: { t: Tier; region: 'world' | 'india'; monthly: boolean }) {
  const { toast } = useSession();
  const nav = useNavigate();

  const onCta = () => {
    if (t.free) { nav('/signup'); return; }
    if (t.pkey) {
      const url = payLink(t.pkey, region, monthly);
      if (url) { window.open(url, '_blank', 'noopener'); return; }
    }
    // Org/enterprise tiers (and "Learn more") go through our sales team via email.
    contactSales(t.name, `${t.price}${t.per || ''}`);
    toast('Opening email to our team ✉️');
  };

  return (
    <div className={`card relative p-6 ${t.feat ? 'border-primary/50 bg-primary/[0.06] shadow-glow' : ''}`}>
      {t.tag && <div className={`mb-3 inline-block rounded px-2.5 py-1 text-[11px] font-extrabold ${t.tag === 'FREE' ? 'bg-white/10 text-mute' : 'bg-gradient-to-r from-primary to-primary-2 text-white'}`}>{t.tag}</div>}
      <h3 className="text-lg font-bold">{t.name}</h3>
      <div className="my-1 font-display text-3xl font-bold">{t.price}<span className="text-sm font-medium text-mute">{t.per}</span></div>
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
  const [region, setRegion] = useState<'world' | 'india'>('world');
  const [monthly, setMonthly] = useState(true);
  const p = pricing(region, monthly);

  const players: Tier[] = [
    { name: 'Free Player', tag: 'FREE', price: '$0', free: true, items: ['Public career profile', '1 highlight video', 'Appear in search'], cta: 'Start Free' },
    { name: 'Pro Player', tag: 'POPULAR', price: p.player, per: p.per, feat: true, pkey: 'proplayer', items: ['Everything in Free', 'Unlimited videos', 'Daily practice space', '✔ Verified badge', 'Boosted visibility', 'Profile analytics'], cta: 'Go Pro' },
  ];
  const inst: Tier[] = [
    { name: 'School', price: p.school, per: p.per, pkey: 'school', items: ['School sports profile', 'Showcase your students', 'Discover & contact talent', 'Up to 50 athletes'], cta: 'Contact Sales' },
    { name: 'Academy', tag: 'POPULAR', price: p.academy, per: p.per, feat: true, pkey: 'academy', items: ['Everything in School', 'AI talent suggestions', 'Advanced search & filters', 'Unlimited athletes'], cta: 'Contact Sales' },
    { name: 'University', price: p.university, per: p.per, pkey: 'university', items: ['Everything in Academy', 'Multi-team management', 'Recruitment tools', 'Priority support'], cta: 'Contact Sales' },
  ];
  const club: Tier[] = [
    { name: 'Pro Club', price: p.club, per: p.per, pkey: 'club', items: ['AI player suggestions', 'Advanced search & filters', 'Contact & sign players', 'Saved shortlists'], cta: 'Contact Sales' },
    { name: 'Deal commission', price: '3%', per: '/deal', items: ['Only when you sign a player', 'Secure on-platform deal record', 'Contract & verification support'], cta: 'Learn more' },
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
      <p className="mt-1 text-sm text-mute">All prices in USD. Players start free. Schools, academies, universities & clubs pay to discover & sign. We take just 3% on successful deals.</p>

      <div className="mt-5 flex flex-wrap items-center gap-3">
        <Seg opts={[['world', '🌍 USA & Europe'], ['india', '🇮🇳 India']]} val={region} set={setRegion} />
        <Seg opts={[['m', 'Monthly'], ['y', 'Yearly']]} val={monthly ? 'm' : 'y'} set={(v) => setMonthly(v === 'm')} />
      </div>

      <Group title="FOR PLAYERS" tiers={players} region={region} monthly={monthly} />
      <Group title="FOR SCHOOLS · ACADEMIES · UNIVERSITIES" tiers={inst} region={region} monthly={monthly} />
      <Group title="FOR PROFESSIONAL CLUBS" tiers={club} region={region} monthly={monthly} />
    </div>
  );
}

function Group({ title, tiers, region, monthly }: { title: string; tiers: Tier[]; region: 'world' | 'india'; monthly: boolean }) {
  return (
    <>
      <h4 className="mb-3.5 mt-9 text-[13px] font-bold uppercase tracking-wide text-mute">{title}</h4>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{tiers.map((t) => <TierCard key={t.name} t={t} region={region} monthly={monthly} />)}</div>
    </>
  );
}

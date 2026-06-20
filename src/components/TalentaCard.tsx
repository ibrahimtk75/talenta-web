import { useRef, useState } from 'react';
import { toPng } from 'html-to-image';
import { Download, Share2, X, BadgeCheck } from 'lucide-react';
import { COUNTRY_NAME, initials, type Player } from '../data';

const POS_ABBR: Record<string, string> = {
  Goalkeeper: 'GK', 'Right-Back': 'RB', 'Centre-Back': 'CB', 'Left-Back': 'LB',
  'Defensive Midfielder': 'CDM', 'Central Midfielder': 'CM', 'Attacking Midfielder': 'CAM',
  'Right Winger': 'RW', 'Left Winger': 'LW', Striker: 'ST', 'Centre-Forward': 'CF',
  Winger: 'W', Midfielder: 'CM', Defender: 'CB',
};

/** FIFA-style shareable "Talenta Card" — players post it to Instagram / WhatsApp. */
export default function TalentaCard({ player: p, onClose }: { player: Player; onClose: () => void }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [busy, setBusy] = useState(false);
  const abbr = POS_ABBR[p.pos] || p.pos.slice(0, 3).toUpperCase();
  const stats = Object.entries(p.stats).slice(0, 6);

  const render = async () => {
    if (!cardRef.current) return null;
    return toPng(cardRef.current, { pixelRatio: 2, cacheBust: true });
  };

  const download = async () => {
    setBusy(true);
    try {
      const url = await render();
      if (url) {
        const a = document.createElement('a');
        a.href = url; a.download = `${p.name.replace(/\s+/g, '-')}-Talenta-Card.png`; a.click();
      }
    } catch { /* ignore */ } finally { setBusy(false); }
  };

  const share = async () => {
    setBusy(true);
    try {
      const url = await render();
      if (url && (navigator as any).share) {
        const blob = await (await fetch(url)).blob();
        const file = new File([blob], 'talenta-card.png', { type: 'image/png' });
        try { await (navigator as any).share({ files: [file], title: 'My Talenta Card', text: `Check out my football card on Talenta ⚽ — talenta-web.onrender.com` }); return; } catch { /* cancelled */ }
      }
      if (url) { const a = document.createElement('a'); a.href = url; a.download = `${p.name}-Talenta-Card.png`; a.click(); }
    } catch { /* ignore */ } finally { setBusy(false); }
  };

  return (
    <div className="fixed inset-0 z-[200] grid place-items-center bg-black/70 p-4 backdrop-blur-sm" onClick={onClose}>
      <div className="w-full max-w-sm" onClick={(e) => e.stopPropagation()}>
        {/* the card */}
        <div ref={cardRef} className="relative mx-auto aspect-[3/4.15] w-[300px] overflow-hidden rounded-3xl bg-gradient-to-b from-[#FFC95A] via-[#FF8A3C] to-[#FF5A2C] p-5 text-[#0B1A38] shadow-2xl">
          <div className="flex items-start justify-between">
            <div className="leading-none">
              <div className="font-display text-[58px] font-extrabold leading-[0.85]">{p.match}</div>
              <div className="mt-1 text-2xl font-extrabold tracking-wide">{abbr}</div>
              <div className="mt-1 text-[12px] font-bold uppercase tracking-wide opacity-80">{COUNTRY_NAME[p.country] || p.country}</div>
            </div>
            <div className="text-right">
              <div className="font-display text-lg font-extrabold">Talen<span className="text-[#0B1A38]">ta</span></div>
              {p.pro && <span className="mt-1 inline-block rounded bg-[#0B1A38] px-1.5 py-0.5 text-[9px] font-extrabold text-white">PRO</span>}
              {p.verified && <BadgeCheck size={18} className="ml-auto mt-1 text-[#0B1A38]" />}
            </div>
          </div>

          <div className="my-3 grid place-items-center">
            <div className="grid h-28 w-28 place-items-center rounded-full bg-[#0B1A38] font-display text-4xl font-extrabold text-white ring-4 ring-[#0B1A38]/20">{initials(p.name)}</div>
          </div>

          <div className="border-t-2 border-[#0B1A38]/25 pt-2 text-center">
            <div className="truncate font-display text-2xl font-extrabold uppercase tracking-wide">{p.name}</div>
            {p.age ? <div className="text-[11px] font-bold uppercase opacity-75">Age {p.age}{p.foot && p.foot !== '—' ? ` · ${p.foot} foot` : ''}</div> : null}
          </div>

          {stats.length > 0 && (
            <div className="mt-2 grid grid-cols-3 gap-1.5">
              {stats.map(([k, v]) => (
                <div key={k} className="rounded-lg bg-[#0B1A38]/10 py-1.5 text-center">
                  <div className="font-display text-base font-extrabold leading-none">{v}</div>
                  <div className="mt-0.5 text-[8px] font-bold uppercase leading-tight opacity-70">{k}</div>
                </div>
              ))}
            </div>
          )}

          <div className="absolute inset-x-0 bottom-2.5 text-center text-[10px] font-bold opacity-80">talenta-web.onrender.com</div>
        </div>

        {/* actions */}
        <div className="mt-4 flex items-center justify-center gap-3">
          <button onClick={share} disabled={busy} className="btn-primary disabled:opacity-60"><Share2 size={16} /> {busy ? 'Preparing…' : 'Share'}</button>
          <button onClick={download} disabled={busy} className="btn-ghost disabled:opacity-60"><Download size={16} /> Download</button>
          <button onClick={onClose} className="grid h-10 w-10 place-items-center rounded-lg border border-white/15 text-white hover:border-primary"><X size={18} /></button>
        </div>
        <p className="mt-3 text-center text-[12px] text-mute">Post your card to Instagram &amp; WhatsApp — tag friends to join Talenta! ⚽</p>
      </div>
    </div>
  );
}

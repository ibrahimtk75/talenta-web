import { BadgeCheck } from 'lucide-react';
import { Org, FLAG } from '../data';
import { Stars } from './Stars';
import OrgLogo from './OrgLogo';

export default function OrgCard({ o }: { o: Org }) {
  return (
    <div className="card p-5">
      <div className="flex items-center gap-3">
        <OrgLogo name={o.name} size={44} />
        <div className="min-w-0">
          <div className="flex items-center gap-1 font-bold leading-tight">
            <span className="truncate">{o.name}</span>
            {o.verified && <BadgeCheck size={14} className="flex-shrink-0 text-sky" />}
          </div>
          <div className="text-[12px] text-mute">{o.type} {FLAG[o.country] || ''}</div>
        </div>
      </div>
      <div className="mt-3.5 flex items-center justify-between border-t border-white/10 pt-3 text-[12.5px] text-mute">
        <span>{o.players} athletes</span>
        <span className="flex items-center gap-1"><Stars value={o.rating} size={12} /> {o.rating}</span>
      </div>
    </div>
  );
}

import { useEffect, useRef, useState } from 'react';
import { MessageCircle, X } from 'lucide-react';

const WA_NUMBER = '919526137000';
const WA_LINK = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent('Hi Talenta, I have a question about the platform.')}`;

// Simple support bot — canned answers to the most common questions, with a
// WhatsApp handoff for anything else.
const FAQ: [string, string][] = [
  ['Is Talenta free?', 'Yes! Players join completely free. Pro is optional (₹199/mo) for unlimited videos, a verified badge and more visibility. Clubs & academies have subscription plans.'],
  ['How do I get discovered?', 'Create a free profile, add your position, stats and a highlight video. Clubs, academies and scouts search and contact you directly. 🚀'],
  ['How do clubs find players?', 'Clubs open Browse, filter by position, age and country, watch a player\'s reel, and tap Contact to message them directly.'],
  ['How do I join?', 'Tap "Join Free" at the top → choose Player, Club or Academy → fill in your details. It takes about 2 minutes! ⚽'],
];

const WhatsAppIcon = ({ size = 16 }: { size?: number }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor" aria-hidden>
    <path d="M.057 24l1.687-6.163a11.867 11.867 0 01-1.587-5.946C.16 5.335 5.495 0 12.05 0a11.817 11.817 0 018.413 3.488 11.824 11.824 0 013.48 8.414c-.003 6.557-5.338 11.892-11.893 11.892a11.9 11.9 0 01-5.688-1.448L.057 24zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884a9.86 9.86 0 001.51 5.26l-.999 3.648 3.748-.983zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
  </svg>
);

export default function SupportWidget() {
  const [open, setOpen] = useState(false);
  const [thread, setThread] = useState<{ from: 'bot' | 'user'; text: string }[]>([
    { from: 'bot', text: "Hi! 👋 I'm Talenta's assistant. How can I help you today?" },
  ]);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [thread, open]);

  const ask = (q: string, a: string) => setThread((t) => [...t, { from: 'user', text: q }, { from: 'bot', text: a }]);

  return (
    <>
      <button onClick={() => setOpen((o) => !o)} aria-label="Support chat"
        className="fixed bottom-5 right-5 z-[150] grid h-14 w-14 place-items-center rounded-full bg-gradient-to-br from-primary to-primary-2 text-white shadow-card transition-transform hover:scale-105">
        {open ? <X size={24} /> : <MessageCircle size={24} />}
        {!open && <span className="absolute right-0 top-0 h-3.5 w-3.5 rounded-full border-2 border-ink bg-emerald-400" />}
      </button>

      {open && (
        <div className="fixed bottom-24 right-5 z-[150] flex h-[470px] w-[min(92vw,360px)] flex-col overflow-hidden rounded-2xl border border-white/10 bg-ink/95 shadow-card backdrop-blur-xl">
          <div className="flex items-center gap-3 border-b border-white/10 bg-gradient-to-r from-primary/25 to-transparent p-4">
            <span className="grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br from-primary to-primary-2 text-base text-white">⚽</span>
            <div>
              <div className="font-bold leading-tight">Talenta Assistant</div>
              <div className="flex items-center gap-1.5 text-[11px] text-emerald-400"><span className="h-1.5 w-1.5 rounded-full bg-emerald-400" /> Online · replies instantly</div>
            </div>
          </div>

          <div className="flex flex-1 flex-col gap-2.5 overflow-y-auto p-4">
            {thread.map((m, i) => (
              <div key={i} className={`max-w-[82%] rounded-2xl px-3.5 py-2 text-[13px] leading-relaxed ${m.from === 'user' ? 'self-end rounded-br-md bg-gradient-to-r from-primary to-primary-2 text-white' : 'self-start rounded-bl-md bg-white/[0.06] text-slate-100'}`}>{m.text}</div>
            ))}
            <div ref={endRef} />
          </div>

          <div className="border-t border-white/10 p-3">
            <div className="mb-2 flex flex-wrap gap-1.5">
              {FAQ.map(([q, a]) => (
                <button key={q} onClick={() => ask(q, a)}
                  className="rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 text-[11.5px] text-mute transition-colors hover:border-primary hover:text-white">{q}</button>
              ))}
            </div>
            <a href={WA_LINK} target="_blank" rel="noopener noreferrer"
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#25D366] px-3 py-2.5 text-[13.5px] font-semibold text-white transition hover:brightness-110">
              <WhatsAppIcon size={17} /> Chat with us on WhatsApp
            </a>
          </div>
        </div>
      )}
    </>
  );
}

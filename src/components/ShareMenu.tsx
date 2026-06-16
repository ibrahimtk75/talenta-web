import { useState } from 'react';
import { Share2, Facebook, Twitter, Linkedin, MessageCircle, Link2, Check, Instagram } from 'lucide-react';
import { useSession } from '../session';

export default function ShareMenu({ url, text, label = 'Share', className }: { url?: string; text?: string; label?: string; className?: string }) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const { toast } = useSession();

  const u = url || (typeof window !== 'undefined' ? window.location.href : 'https://talenta.app');
  const t = text || 'Check out this footballer on Talenta ⚽';
  const enc = encodeURIComponent;

  const links = [
    { Icon: MessageCircle, label: 'WhatsApp', href: `https://wa.me/?text=${enc(t + ' ' + u)}` },
    { Icon: Facebook, label: 'Facebook', href: `https://www.facebook.com/sharer/sharer.php?u=${enc(u)}` },
    { Icon: Twitter, label: 'X (Twitter)', href: `https://twitter.com/intent/tweet?text=${enc(t)}&url=${enc(u)}` },
    { Icon: Linkedin, label: 'LinkedIn', href: `https://www.linkedin.com/sharing/share-offering/?url=${enc(u)}` },
  ];

  const copy = async () => {
    try { await navigator.clipboard.writeText(u); setCopied(true); setTimeout(() => setCopied(false), 1500); }
    catch { toast('Copy failed'); }
  };

  return (
    <div className="relative">
      <button onClick={() => setOpen((o) => !o)} className={className || 'btn-ghost text-[13px]'}><Share2 size={15} /> {label}</button>
      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-full z-50 mt-1 w-48 rounded-xl border border-white/10 bg-ink/95 p-1.5 shadow-card backdrop-blur-xl">
            {links.map(({ Icon, label: l, href }) => (
              <a key={l} href={href} target="_blank" rel="noopener noreferrer" onClick={() => setOpen(false)}
                className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-[13.5px] text-mute transition-colors hover:bg-white/[0.06] hover:text-white"><Icon size={15} /> {l}</a>
            ))}
            <button onClick={() => { toast('Tip: download your reel & post it to Instagram'); }}
              className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-[13.5px] text-mute transition-colors hover:bg-white/[0.06] hover:text-white"><Instagram size={15} /> Instagram</button>
            <div className="my-1 h-px bg-white/10" />
            <button onClick={copy} className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-[13.5px] text-mute transition-colors hover:bg-white/[0.06] hover:text-white">
              {copied ? <Check size={15} className="text-emerald-400" /> : <Link2 size={15} />} {copied ? 'Copied!' : 'Copy link'}
            </button>
          </div>
        </>
      )}
    </div>
  );
}

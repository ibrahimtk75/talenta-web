import { useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Share2, Facebook, Twitter, Linkedin, MessageCircle, Link2, Check, Instagram } from 'lucide-react';
import { useSession } from '../session';

export default function ShareMenu({ url, text, label = 'Share', className }: { url?: string; text?: string; label?: string; className?: string }) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [pos, setPos] = useState<{ top: number; right: number }>({ top: 0, right: 0 });
  const btnRef = useRef<HTMLButtonElement>(null);
  const { toast } = useSession();

  const u = url || (typeof window !== 'undefined' ? window.location.href : 'https://talentasports.com');
  const t = text || 'Check out this footballer on Talenta ⚽';
  const enc = encodeURIComponent;

  const links = [
    { Icon: MessageCircle, label: 'WhatsApp', href: `https://wa.me/?text=${enc(t + ' ' + u)}` },
    { Icon: Facebook, label: 'Facebook', href: `https://www.facebook.com/sharer/sharer.php?u=${enc(u)}` },
    { Icon: Twitter, label: 'X (Twitter)', href: `https://twitter.com/intent/tweet?text=${enc(t)}&url=${enc(u)}` },
    { Icon: Linkedin, label: 'LinkedIn', href: `https://www.linkedin.com/sharing/share-offering/?url=${enc(u)}` },
  ];

  const onShareClick = async () => {
    // On mobile (and modern browsers) use the native share sheet — no popover, no clipping.
    if (typeof navigator !== 'undefined' && (navigator as any).share) {
      try {
        await (navigator as any).share({ title: 'Talenta', text: t, url: u });
        return;
      } catch {
        return; // user cancelled — don't fall back to the popover
      }
    }
    // Desktop fallback: position a portal-rendered menu so it escapes card stacking contexts.
    if (btnRef.current) {
      const r = btnRef.current.getBoundingClientRect();
      setPos({ top: r.bottom + 6, right: Math.max(8, window.innerWidth - r.right) });
    }
    setOpen((o) => !o);
  };

  const copy = async () => {
    try { await navigator.clipboard.writeText(u); setCopied(true); setTimeout(() => setCopied(false), 1500); }
    catch { toast('Copy failed'); }
  };

  const itemCls = 'flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-[13.5px] text-mute transition-colors hover:bg-white/[0.06] hover:text-white';

  return (
    <>
      <button ref={btnRef} onClick={onShareClick} className={className || 'btn-ghost text-[13px]'}><Share2 size={15} /> {label}</button>
      {open && createPortal(
        <>
          <div className="fixed inset-0 z-[200]" onClick={() => setOpen(false)} />
          <div style={{ top: pos.top, right: pos.right }} className="fixed z-[201] w-52 rounded-xl border border-white/10 bg-ink/95 p-1.5 shadow-card backdrop-blur-xl">
            {links.map(({ Icon, label: l, href }) => (
              <a key={l} href={href} target="_blank" rel="noopener noreferrer" onClick={() => setOpen(false)} className={itemCls}><Icon size={15} /> {l}</a>
            ))}
            <button onClick={() => { setOpen(false); toast('Tip: download your reel & post it to Instagram'); }} className={itemCls}><Instagram size={15} /> Instagram</button>
            <div className="my-1 h-px bg-white/10" />
            <button onClick={copy} className={itemCls}>
              {copied ? <Check size={15} className="text-emerald-400" /> : <Link2 size={15} />} {copied ? 'Copied!' : 'Copy link'}
            </button>
          </div>
        </>,
        document.body,
      )}
    </>
  );
}

import { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { Play, Compass, Tag, LayoutDashboard, MessageSquare, Menu, X, ChevronDown, type LucideIcon } from 'lucide-react';
import { useSession } from '../session';

type NavItem = { to: string; label: string; icon: LucideIcon };
const DISCOVER: [string, string][] = [
  ['players', 'Players'], ['clubs', 'Clubs'], ['academies', 'Academies'], ['universities', 'Universities'], ['schools', 'Schools'],
];

export default function Nav() {
  const { role, pro, signOut } = useSession();
  const nav = useNavigate();
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false); // mobile menu
  const [disc, setDisc] = useState(false); // discover dropdown

  // Close the mobile menu whenever the route changes.
  useEffect(() => { setOpen(false); setDisc(false); }, [pathname]);

  // Close the mobile menu when the user scrolls the page.
  useEffect(() => {
    if (!open) return;
    const close = () => setOpen(false);
    window.addEventListener('scroll', close, { passive: true });
    return () => window.removeEventListener('scroll', close);
  }, [open]);

  const roleLinks: NavItem[] = [];
  if (role === 'player') roleLinks.push({ to: '/hub', label: 'My Hub', icon: LayoutDashboard }, { to: '/messages', label: 'Messages', icon: MessageSquare });
  else if (role === 'club') roleLinks.push({ to: '/club', label: 'Dashboard', icon: LayoutDashboard }, { to: '/messages', label: 'Messages', icon: MessageSquare });
  else if (role === 'academy') roleLinks.push({ to: '/academy', label: 'Dashboard', icon: LayoutDashboard }, { to: '/messages', label: 'Messages', icon: MessageSquare });

  const goDisc = (k: string) => { setDisc(false); setOpen(false); nav(k === 'players' ? '/browse' : `/browse?cat=${k}`); };

  const Item = ({ l, mobile = false }: { l: NavItem; mobile?: boolean }) => (
    <NavLink to={l.to} onClick={() => setOpen(false)}
      className={({ isActive }) =>
        `flex items-center gap-2 rounded-lg px-3.5 py-2 text-[13.5px] font-semibold transition-colors ${
          isActive ? 'bg-white/[0.08] text-white' : 'text-mute hover:bg-white/[0.04] hover:text-white'
        } ${mobile ? 'w-full' : ''}`}>
      <l.icon size={16} className={mobile ? '' : 'opacity-80'} /> {l.label}
    </NavLink>
  );

  const roleLabel = role === 'player' ? `Player · ${pro ? 'Pro' : 'Free'}` : role === 'academy' ? 'Academy' : 'Club';

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-ink/70 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center gap-4 px-5 py-3">
        <Link to="/" onClick={() => setOpen(false)} className="flex items-center">
          <img src="/logo-clear.png" alt="Talenta" className="h-9 w-auto sm:h-10" />
        </Link>

        <nav className="ml-2 hidden items-center gap-0.5 md:flex">
          <Item l={{ to: '/feed', label: 'Feed', icon: Play }} />
          <div className="relative">
            <button onClick={() => setDisc((d) => !d)}
              className="flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-[13.5px] font-semibold text-mute transition-colors hover:bg-white/[0.04] hover:text-white">
              <Compass size={16} className="opacity-80" /> Discover <ChevronDown size={14} className={`transition-transform ${disc ? 'rotate-180' : ''}`} />
            </button>
            {disc && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setDisc(false)} />
                <div className="absolute left-0 top-full z-50 mt-1 w-48 overflow-hidden rounded-xl border border-white/10 bg-ink/95 p-1.5 shadow-card backdrop-blur-xl">
                  {DISCOVER.map(([k, lab]) => (
                    <button key={k} onClick={() => goDisc(k)} className="block w-full rounded-lg px-3 py-2 text-left text-[13.5px] text-mute transition-colors hover:bg-white/[0.06] hover:text-white">{lab}</button>
                  ))}
                </div>
              </>
            )}
          </div>
          {roleLinks.map((l) => <Item key={l.to} l={l} />)}
          <Item l={{ to: '/pricing', label: 'Pricing', icon: Tag }} />
        </nav>

        <div className="ml-auto flex items-center gap-2.5">
          {role === 'guest' ? (
            <>
              <button className="hidden btn-ghost !px-3 !py-2 text-[13px] sm:inline-flex" onClick={() => { setOpen(false); nav('/login'); }}>Log in</button>
              <button className="btn-primary !px-4 !py-2 text-[13px]" onClick={() => { setOpen(false); nav('/signup'); }}>Join Free</button>
            </>
          ) : (
            <>
              <span className="hidden rounded-full border border-white/10 bg-white/[0.05] px-3 py-1 text-xs font-semibold text-slate-200 sm:inline">{roleLabel}</span>
              <button className="btn-ghost !px-3 !py-2 text-[13px]" onClick={() => { signOut(); setOpen(false); nav('/'); }}>Exit</button>
            </>
          )}
          <button className="grid h-9 w-9 place-items-center rounded-lg border border-white/10 text-slate-200 hover:border-primary md:hidden" onClick={() => setOpen((o) => !o)} aria-label="Menu">
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-white/10 bg-ink/95 px-4 py-3 backdrop-blur-xl md:hidden">
          <div className="flex flex-col gap-1">
            <Item l={{ to: '/feed', label: 'Feed', icon: Play }} mobile />
            <div className="px-3.5 pb-0.5 pt-2 text-[11px] font-bold uppercase tracking-wide text-mute/70">Discover</div>
            {DISCOVER.map(([k, lab]) => (
              <button key={k} onClick={() => goDisc(k)} className="flex w-full items-center gap-2 rounded-lg px-3.5 py-2 text-[13.5px] font-semibold text-mute hover:bg-white/[0.04] hover:text-white"><Compass size={15} /> {lab}</button>
            ))}
            {roleLinks.map((l) => <Item key={l.to} l={l} mobile />)}
            <Item l={{ to: '/pricing', label: 'Pricing', icon: Tag }} mobile />
          </div>
        </div>
      )}
    </header>
  );
}

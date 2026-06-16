import { useNavigate, Link } from 'react-router-dom';
import { Trophy, Building2, GraduationCap, ArrowLeft, ChevronRight } from 'lucide-react';
import { useSession } from '../session';

export default function Signup() {
  const nav = useNavigate();
  const { setRole } = useSession();

  const choose = (role: 'player' | 'club' | 'academy') => {
    setRole(role);
    nav(role === 'player' ? '/onboard' : '/register');
  };

  const cards = [
    { role: 'player' as const, icon: Trophy, title: "I'm a Player", desc: 'Build your career profile, post practice & reels, get discovered. Free to start.', cta: 'Continue as Player', primary: true },
    { role: 'club' as const, icon: Building2, title: "I'm a Club / Scout", desc: 'Find talent with AI suggestions & search, contact players, and sign them. From $99/mo.', cta: 'Continue as Club', primary: false },
    { role: 'academy' as const, icon: GraduationCap, title: 'Academy / School / University', desc: 'Showcase your players, build your institution profile, and discover talent across the network.', cta: 'Continue as Academy', primary: false },
  ];

  return (
    <div className="mx-auto max-w-5xl px-5 py-12">
      <Link to="/" className="mb-5 inline-flex items-center gap-1.5 text-sm font-semibold text-mute hover:text-primary">
        <ArrowLeft size={15} /> Home
      </Link>
      <h1 className="font-display text-2xl font-bold">Create your account</h1>
      <p className="mt-1 text-sm text-mute">Open to players, clubs, academies & schools worldwide. Choose how you want to join.</p>

      <div className="mt-7 grid gap-5 md:grid-cols-3">
        {cards.map((c) => (
          <button key={c.role} onClick={() => choose(c.role)}
            className="card group p-7 text-center transition-all hover:-translate-y-1.5 hover:border-primary/60">
            <c.icon size={38} className="mx-auto text-primary" />
            <h3 className="mt-3.5 text-lg font-bold">{c.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-mute">{c.desc}</p>
            <span className={`${c.primary ? 'btn-primary' : 'btn-ghost'} mt-5 w-full justify-center`}>
              {c.cta} <ChevronRight size={16} />
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

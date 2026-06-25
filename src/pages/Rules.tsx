import { Link } from 'react-router-dom';
import { ShieldCheck, Scale, Repeat, Percent, AlertTriangle, Baby, FileCheck, ChevronRight } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

// Platform rules / code of conduct — users accept these at sign-up and login.
const sections: { icon: LucideIcon; h: string; points: string[] }[] = [
  {
    icon: Scale, h: 'Fair play & conduct',
    points: [
      'Treat every player, club and official with respect.',
      'No abuse, harassment, discrimination, violence or threats — on or off the platform.',
      'No match-fixing, bribery or any form of cheating.',
    ],
  },
  {
    icon: FileCheck, h: 'Honest data',
    points: [
      'All profile data — name, age, stats, club history — must be true and accurate.',
      'False data, fake identities or impersonation lead to removal.',
      'You keep your data up to date; outdated profiles may be hidden.',
    ],
  },
  {
    icon: Repeat, h: 'Transfers happen on Talenta',
    points: [
      'Clubs contact players and agree trials, signings & transfers through the platform.',
      'Going off-platform to avoid fees or safeguarding is a violation.',
      'Every deal is recorded so both sides have a transparent history.',
    ],
  },
  {
    icon: Percent, h: 'Commission',
    points: [
      'Talenta charges a flat 3% commission only on successful deals signed through the platform.',
      'No agent fees, no hidden charges.',
      'Founding phase: commission is fully waived for early members.',
    ],
  },
  {
    icon: Baby, h: 'Safeguarding minors',
    points: [
      'Players under 18 require a parent/guardian consent.',
      'Clubs may contact minors only through the platform, with guardians notified.',
      'Any unsafe behaviour towards a minor is reported and permanently banned.',
    ],
  },
  {
    icon: AlertTriangle, h: 'Violations & enforcement',
    points: [
      'Breaking these rules leads to warnings, suspension, or permanent removal.',
      'Serious violations (fraud, abuse, safeguarding) mean an immediate ban.',
      'Repeated violations are recorded on the account history.',
    ],
  },
];

export default function Rules() {
  return (
    <div className="mx-auto max-w-3xl px-5 py-16">
      <div className="text-center">
        <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/[0.08] px-4 py-1.5 text-[12.5px] font-semibold text-primary">
          <ShieldCheck size={15} /> Platform rules & code of conduct
        </span>
        <h1 className="mt-4 font-display text-3xl font-bold md:text-4xl">The Talenta agreement</h1>
        <p className="mx-auto mt-2 max-w-xl text-mute">
          Everyone who joins Talenta — players, clubs, academies & scouts — agrees to these rules.
          They keep the platform fair, honest and safe for young talent.
        </p>
      </div>

      <div className="mt-10 space-y-4">
        {sections.map((s, i) => (
          <div key={s.h} className="card p-6">
            <div className="flex items-center gap-3">
              <span className="grid h-11 w-11 flex-shrink-0 place-items-center rounded-xl bg-primary/15 text-primary"><s.icon size={20} /></span>
              <h2 className="font-display text-lg font-bold">{i + 1}. {s.h}</h2>
            </div>
            <ul className="mt-3 space-y-2 pl-1">
              {s.points.map((p) => (
                <li key={p} className="flex gap-2.5 text-[13.5px] leading-relaxed text-mute">
                  <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary/70" /> {p}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="card mt-8 p-6 text-center">
        <p className="text-[13.5px] text-mute">
          By creating an account you accept these rules, our <Link to="/terms" className="font-semibold text-primary">Terms</Link> and{' '}
          <Link to="/privacy" className="font-semibold text-primary">Privacy Policy</Link>, including the transfer & 3% commission policy.
        </p>
        <Link to="/signup" className="btn-primary mx-auto mt-5 w-fit">Agree &amp; join Talenta <ChevronRight size={16} /></Link>
      </div>
    </div>
  );
}

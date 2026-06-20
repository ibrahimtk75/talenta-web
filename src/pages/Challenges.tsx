import { Link } from 'react-router-dom';
import { Flame, Share2, Trophy, Video } from 'lucide-react';

const CHALLENGES: { emoji: string; title: string; desc: string; tag: string }[] = [
  { emoji: '🎯', title: 'Finishing Frenzy', desc: 'Score 5 different finishes — both feet, a header, a volley and a free-kick. Show your range.', tag: 'Weekly' },
  { emoji: '🤹', title: 'Juggle Master', desc: 'Your best keepy-uppy or freestyle combo. Creativity and control count.', tag: 'Weekly' },
  { emoji: '⚡', title: 'Speed Dribble', desc: 'Dribble through cones as fast as you can — tight close control wins.', tag: 'Weekly' },
  { emoji: '🦶', title: 'Weak-Foot Wonder', desc: 'A full skill clip using only your weaker foot. Impress the scouts.', tag: 'Monthly' },
];

export default function Challenges() {
  return (
    <div className="mx-auto max-w-5xl px-5 py-12">
      <div className="text-center">
        <span className="inline-flex items-center gap-2 rounded-full border border-accent/40 bg-accent/[0.1] px-4 py-1.5 text-[12.5px] font-semibold text-accent">
          <Flame size={15} /> Talenta Challenges
        </span>
        <h1 className="mt-4 font-display text-3xl font-bold md:text-4xl">Show your skills. <span className="grad-text">Get noticed.</span></h1>
        <p className="mx-auto mt-2 max-w-xl text-mute">
          Enter a challenge, post your clip, and climb the spotlight. Top entries get featured on the home page and a visibility boost with clubs &amp; scouts.
        </p>
      </div>

      {/* challenges grid */}
      <div className="mt-9 grid gap-5 sm:grid-cols-2">
        {CHALLENGES.map((c) => (
          <div key={c.title} className="card flex flex-col p-6 transition hover:-translate-y-1 hover:border-primary/50">
            <div className="flex items-center justify-between">
              <span className="text-4xl">{c.emoji}</span>
              <span className="rounded-full border border-white/10 bg-white/[0.05] px-2.5 py-1 text-[11px] font-semibold text-mute">{c.tag}</span>
            </div>
            <h3 className="mt-4 font-display text-lg font-bold">{c.title}</h3>
            <p className="mt-1.5 flex-1 text-[13.5px] leading-relaxed text-mute">{c.desc}</p>
            <Link to="/signup" className="btn-primary mt-5 w-fit text-[13px]"><Video size={15} /> Enter challenge</Link>
          </div>
        ))}
      </div>

      {/* how it works */}
      <h2 className="mb-5 mt-14 text-center font-display text-2xl font-bold">How it works</h2>
      <div className="grid gap-5 md:grid-cols-3">
        {[
          { Icon: Video, h: '1. Record your clip', p: 'Film your attempt — a phone is all you need. Keep it short and sharp.' },
          { Icon: Share2, h: '2. Post & tag', p: 'Add it to your Talenta profile and share it with #TalentaChallenge.' },
          { Icon: Trophy, h: '3. Get featured', p: 'Top entries are featured on the home page and boosted to clubs & scouts.' },
        ].map((s) => (
          <div key={s.h} className="card p-6 text-center">
            <div className="mx-auto grid h-11 w-11 place-items-center rounded-xl bg-primary/15 text-primary"><s.Icon size={20} /></div>
            <h3 className="mt-4 font-bold">{s.h}</h3>
            <p className="mt-1.5 text-[13px] leading-relaxed text-mute">{s.p}</p>
          </div>
        ))}
      </div>

      <div className="card mt-10 border-primary/30 bg-primary/[0.05] p-8 text-center md:p-10">
        <h2 className="font-display text-2xl font-bold">Ready to enter?</h2>
        <p className="mx-auto mt-2 max-w-md text-mute">Be one of the first to take on a challenge and get the spotlight.</p>
        <div className="mt-5 flex flex-wrap justify-center gap-3">
          <Link to="/signup" className="btn-primary text-base">Join Free &amp; enter</Link>
          <Link to="/rankings" className="btn-ghost">View Rankings</Link>
        </div>
      </div>
    </div>
  );
}

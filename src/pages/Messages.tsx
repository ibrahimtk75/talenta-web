import { useState } from 'react';
import { Send } from 'lucide-react';

const CONVOS = [
  { id: '1', n: 'Santos FC', m: 'Can we set up a trial next week?' },
  { id: '2', n: 'River Plate', m: 'Loved your last reel 🔥' },
  { id: '3', n: 'Lyon Academy', m: "What's your availability?" },
];
const INITIAL: Record<string, [string, string][]> = {
  '1': [['them', 'Hi! We saw your profile — very impressive stats.'], ['me', "Thank you! I'm open to opportunities."], ['them', 'Can we set up a trial next week?']],
  '2': [['them', 'Loved your last reel 🔥'], ['me', 'Appreciate it 🙏']],
  '3': [['them', "What's your availability?"], ['me', 'Weekends work best for me.']],
};

export default function Messages() {
  const [active, setActive] = useState('1');
  const [draft, setDraft] = useState('');
  const [threads, setThreads] = useState(INITIAL);
  const convo = CONVOS.find((c) => c.id === active)!;

  const send = () => {
    const text = draft.trim();
    if (!text) return;
    setThreads((prev) => ({ ...prev, [active]: [...prev[active], ['me', text]] }));
    setDraft('');
  };

  return (
    <div className="mx-auto max-w-6xl px-5 py-12">
      <h1 className="font-display text-2xl font-bold md:text-3xl">Messages</h1>
      <div className="card mt-5 grid h-[calc(100vh-220px)] grid-cols-1 overflow-hidden md:grid-cols-[280px_1fr]">
        <div className="hidden overflow-y-auto border-r border-white/10 md:block">
          {CONVOS.map((c) => (
            <button key={c.id} onClick={() => setActive(c.id)}
              className={`flex w-full items-center gap-3 border-b border-white/10 p-4 text-left transition ${active === c.id ? 'bg-white/[0.06]' : 'hover:bg-white/[0.04]'}`}>
              <span className="grid h-10 w-10 flex-shrink-0 place-items-center rounded-xl bg-gradient-to-br from-primary to-primary-2 font-bold text-white">{c.n[0]}</span>
              <div className="min-w-0"><div className="font-bold">{c.n}</div><div className="truncate text-[12.5px] text-mute">{c.m}</div></div>
            </button>
          ))}
        </div>
        <div className="flex flex-col">
          <div className="flex items-center gap-2.5 border-b border-white/10 p-4 font-bold">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br from-primary to-primary-2 text-white">{convo.n[0]}</span> {convo.n}
          </div>
          <div className="flex flex-1 flex-col gap-2.5 overflow-y-auto p-5">
            {threads[active].map(([who, txt], i) => (
              <div key={i} className={`max-w-[72%] rounded-2xl px-4 py-2.5 text-sm ${who === 'me' ? 'self-end bg-gradient-to-r from-primary to-primary-2 text-white rounded-br-md' : 'self-start glass rounded-bl-md'}`}>{txt}</div>
            ))}
          </div>
          <div className="flex gap-2.5 border-t border-white/10 p-3.5">
            <input value={draft} onChange={(e) => setDraft(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') send(); }} className="field-input flex-1" placeholder="Type a message..." />
            <button className="btn-primary" onClick={send}><Send size={16} /></button>
          </div>
        </div>
      </div>
    </div>
  );
}

import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { MessageCircle, X, Send, Sparkles } from 'lucide-react';
import { CATEGORIES } from '../data/categories';
import { PRODUCTS } from '../data/products';

interface Msg {
  from: 'ai' | 'user';
  text: string;
  link?: { to: string; label: string };
}

const GREETING: Msg = {
  from: 'ai',
  text: "Hi! I'm your GlobalFundConnect assistant. Ask me about loans, credit cards, insurance, savings, scholarships and more — or tell me your goal.",
};

// Lightweight intent matcher — a stand-in for the production LLM assistant.
function respond(input: string): Msg {
  const q = input.toLowerCase();

  const cat = CATEGORIES.find((c) => q.includes(c.name.toLowerCase()) || q.includes(c.id.replace('-', ' ')));
  if (cat) {
    const count = PRODUCTS.filter((p) => p.category === cat.id).length;
    return {
      from: 'ai',
      text: `We track ${cat.name.toLowerCase()} from verified providers. I found ${count} option${count === 1 ? '' : 's'} you can compare side by side.`,
      link: { to: `/marketplace?cat=${cat.id}`, label: `Compare ${cat.name}` },
    };
  }
  if (q.includes('scam') || q.includes('fraud') || q.includes('safe')) {
    return {
      from: 'ai',
      text: 'Every provider carries a transparent trust score, and risky listings are flagged with a caution badge. Never pay an upfront fee for a "guaranteed" loan.',
      link: { to: '/about', label: 'How we vet providers' },
    };
  }
  if (q.includes('eligib') || q.includes('qualify') || q.includes('approv')) {
    return {
      from: 'ai',
      text: 'Try the AI Advisor — it gives an explainable eligibility estimate (not a decision) based on your income and credit profile.',
      link: { to: '/advisor', label: 'Open AI Advisor' },
    };
  }
  if (q.includes('recommend') || q.includes('best') || q.includes('which')) {
    return {
      from: 'ai',
      text: 'Answer a few quick questions and I’ll rank the best-matched products for your situation.',
      link: { to: '/advisor', label: 'Get recommendations' },
    };
  }
  return {
    from: 'ai',
    text: 'I can help you compare loans, cards, insurance, savings, investments, grants, scholarships, microfinance, fintech apps and government schemes. What are you looking for?',
    link: { to: '/marketplace', label: 'Browse the marketplace' },
  };
}

export default function AIChatWidget() {
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState<Msg[]>([GREETING]);
  const [input, setInput] = useState('');
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [msgs, open]);

  const send = () => {
    const text = input.trim();
    if (!text) return;
    setMsgs((m) => [...m, { from: 'user', text }, respond(text)]);
    setInput('');
  };

  return (
    <>
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label="AI assistant"
        className="fixed bottom-5 right-5 z-50 grid h-14 w-14 place-items-center rounded-full bg-brand-600 text-white shadow-glow transition hover:bg-brand-700"
      >
        {open ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
      </button>

      {open && (
        <div className="fixed bottom-24 right-5 z-50 flex h-[30rem] w-[22rem] max-w-[calc(100vw-2.5rem)] flex-col overflow-hidden rounded-2xl border border-ink-100 bg-white shadow-card dark:border-ink-700 dark:bg-ink-800">
          <div className="flex items-center gap-2 border-b border-ink-100 bg-brand-600 px-4 py-3 text-white dark:border-ink-700">
            <Sparkles className="h-5 w-5" />
            <div>
              <p className="text-sm font-semibold leading-tight">AI Assistant</p>
              <p className="text-[11px] opacity-80">Multi-language · always on</p>
            </div>
          </div>

          <div className="flex-1 space-y-3 overflow-y-auto p-4">
            {msgs.map((m, i) => (
              <div key={i} className={`flex ${m.from === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm ${
                    m.from === 'user'
                      ? 'bg-brand-600 text-white'
                      : 'bg-ink-50 text-ink-800 dark:bg-ink-900 dark:text-ink-100'
                  }`}
                >
                  <p>{m.text}</p>
                  {m.link && (
                    <Link
                      to={m.link.to}
                      onClick={() => setOpen(false)}
                      className="mt-2 inline-block font-semibold text-brand-700 underline dark:text-brand-400"
                    >
                      {m.link.label} →
                    </Link>
                  )}
                </div>
              </div>
            ))}
            <div ref={endRef} />
          </div>

          <div className="flex items-center gap-2 border-t border-ink-100 p-3 dark:border-ink-700">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && send()}
              placeholder="Ask anything…"
              className="input !py-2"
            />
            <button onClick={send} className="btn-primary !px-3" aria-label="Send">
              <Send className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}

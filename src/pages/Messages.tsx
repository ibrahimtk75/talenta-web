import { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Send, MessageSquare, ChevronLeft } from 'lucide-react';
import {
  apiEnabled, apiListConversations, apiGetConversation, apiSendMessage,
  type Conversation, type Message,
} from '../api';
import { useSession } from '../session';

export default function Messages() {
  const { token, userId, toast } = useSession();
  const loc = useLocation();
  const seed = (loc.state as { peerId?: string; peerName?: string } | null) || null;

  const [convos, setConvos] = useState<Conversation[]>([]);
  const [active, setActive] = useState<string | null>(seed?.peerId ?? null);
  const [activeName, setActiveName] = useState<string>(seed?.peerName ?? '');
  const [messages, setMessages] = useState<Message[]>([]);
  const [draft, setDraft] = useState('');
  const [loading, setLoading] = useState(true);
  const endRef = useRef<HTMLDivElement>(null);

  const canMessage = apiEnabled && !!token;

  const loadConvos = async () => {
    if (!token) return;
    try {
      const list = await apiListConversations(token);
      // Keep a freshly-started (deep-linked) conversation visible even before its first message lands.
      let merged = list;
      if (seed?.peerId && !list.some((c) => c.peerId === seed.peerId)) {
        merged = [{ peerId: seed.peerId, peerName: seed.peerName || 'New conversation', lastMessage: '', at: '' }, ...list];
      }
      setConvos(merged);
      setActive((cur) => cur ?? (merged[0]?.peerId ?? null));
      setActiveName((cur) => cur || (merged[0]?.peerName ?? ''));
    } catch { /* ignore */ }
    finally { setLoading(false); }
  };

  const loadMessages = async (peer: string) => {
    if (!token) return;
    try { setMessages(await apiGetConversation(token, peer)); } catch { setMessages([]); }
  };

  useEffect(() => { if (canMessage) loadConvos(); else setLoading(false); }, []);
  useEffect(() => { if (active && token) loadMessages(active); }, [active]);
  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const select = (c: Conversation) => { setActive(c.peerId); setActiveName(c.peerName); };

  const send = async () => {
    const text = draft.trim();
    if (!text || !active || !token) return;
    setDraft('');
    try {
      await apiSendMessage(token, active, text);
      await loadMessages(active);
      loadConvos();
    } catch { toast('Could not send message'); setDraft(text); }
  };

  // Not signed in (or demo build with no backend) → prompt to log in.
  if (!canMessage) {
    return (
      <div className="mx-auto max-w-6xl px-5 py-12">
        <h1 className="font-display text-2xl font-bold md:text-3xl">Messages</h1>
        <div className="card mt-5 grid min-h-[420px] place-items-center p-8 text-center">
          <div className="max-w-md">
            <span className="mx-auto grid h-16 w-16 place-items-center rounded-2xl border border-white/10 bg-white/[0.04] text-primary"><MessageSquare size={28} /></span>
            <h2 className="mt-5 font-display text-xl font-bold">Sign in to message</h2>
            <p className="mt-2 text-[14px] leading-relaxed text-mute">Log in to chat with clubs, academies and players. Clubs reach out to players from their profile — conversations show up here.</p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Link to="/login" className="btn-primary text-[13px]">Log in</Link>
              <Link to="/signup" className="btn-ghost text-[13px]">Join Free</Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const noConvos = !loading && convos.length === 0 && !active;

  return (
    <div className="mx-auto max-w-6xl px-5 py-12">
      <h1 className="font-display text-2xl font-bold md:text-3xl">Messages</h1>
      <div className="card mt-5 grid h-[calc(100vh-220px)] grid-cols-1 overflow-hidden md:grid-cols-[280px_1fr]">
        {/* conversation list — on mobile, shows until a thread is opened */}
        <div className={`overflow-y-auto border-r border-white/10 ${active ? 'hidden md:block' : 'block'}`}>
          {loading ? (
            <div className="p-4 text-[13px] text-mute">Loading…</div>
          ) : convos.length === 0 ? (
            <div className="p-4 text-[13px] text-mute">No conversations yet.</div>
          ) : convos.map((c) => (
            <button key={c.peerId} onClick={() => select(c)}
              className={`flex w-full items-center gap-3 border-b border-white/10 p-4 text-left transition ${active === c.peerId ? 'bg-white/[0.06]' : 'hover:bg-white/[0.04]'}`}>
              <span className="grid h-10 w-10 flex-shrink-0 place-items-center rounded-xl bg-gradient-to-br from-primary to-primary-2 font-bold text-white">{(c.peerName || '?')[0]}</span>
              <div className="min-w-0"><div className="font-bold">{c.peerName}</div><div className="truncate text-[12.5px] text-mute">{c.lastMessage || 'New conversation'}</div></div>
            </button>
          ))}
        </div>

        {/* thread — on mobile, shows only when a conversation is open */}
        <div className={`flex-col ${active ? 'flex' : 'hidden md:flex'}`}>
          {active ? (
            <>
              <div className="flex items-center gap-2 border-b border-white/10 p-4 font-bold">
                <button onClick={() => { setActive(null); setActiveName(''); }} className="-ml-2 grid h-8 w-8 place-items-center rounded-lg text-mute hover:text-white md:hidden" aria-label="Back to conversations"><ChevronLeft size={20} /></button>
                <span className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br from-primary to-primary-2 text-white">{(activeName || '?')[0]}</span> {activeName || 'Conversation'}
              </div>
              <div className="flex flex-1 flex-col gap-2.5 overflow-y-auto p-5">
                {messages.length === 0 && <div className="m-auto text-[13px] text-mute">No messages yet — say hello 👋</div>}
                {messages.map((m) => {
                  const mine = m.senderId === userId;
                  return (
                    <div key={m.id} className={`max-w-[72%] rounded-2xl px-4 py-2.5 text-sm ${mine ? 'self-end bg-gradient-to-r from-primary to-primary-2 text-white rounded-br-md' : 'self-start glass rounded-bl-md'}`}>{m.body}</div>
                  );
                })}
                <div ref={endRef} />
              </div>
              <div className="flex gap-2.5 border-t border-white/10 p-3.5">
                <input value={draft} onChange={(e) => setDraft(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') send(); }} className="field-input flex-1" placeholder="Type a message..." />
                <button className="btn-primary" onClick={send}><Send size={16} /></button>
              </div>
            </>
          ) : (
            <div className="grid flex-1 place-items-center p-8 text-center text-[13px] text-mute">
              {noConvos ? 'No messages yet. Clubs and academies will reach you here once they contact you.' : 'Select a conversation.'}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

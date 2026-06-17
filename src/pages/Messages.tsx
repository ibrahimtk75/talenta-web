import { MessageSquare } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Messages() {
  return (
    <div className="mx-auto max-w-6xl px-5 py-12">
      <h1 className="font-display text-2xl font-bold md:text-3xl">Messages</h1>
      <div className="card mt-5 grid min-h-[420px] place-items-center p-8 text-center">
        <div className="max-w-md">
          <span className="mx-auto grid h-16 w-16 place-items-center rounded-2xl border border-white/10 bg-white/[0.04] text-primary">
            <MessageSquare size={28} />
          </span>
          <h2 className="mt-5 font-display text-xl font-bold">No messages yet</h2>
          <p className="mt-2 text-[14px] leading-relaxed text-mute">
            When a club, academy or scout contacts you — or you reach out to a player —
            your conversations will appear here. Complete your profile and add a highlight
            video to start getting noticed.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link to="/hub" className="btn-primary text-[13px]">Go to my Hub</Link>
            <Link to="/browse" className="btn-ghost text-[13px]">Discover players</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

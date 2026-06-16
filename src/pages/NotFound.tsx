import { Link } from 'react-router-dom';
import { Home, Compass } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-lg flex-col items-center px-5 py-28 text-center">
      <div className="font-display text-7xl font-bold grad-text">404</div>
      <h1 className="mt-4 font-display text-2xl font-bold">Off the pitch.</h1>
      <p className="mt-2 text-mute">The page you're looking for doesn't exist or has moved.</p>
      <div className="mt-7 flex gap-3">
        <Link to="/" className="btn-primary"><Home size={16} /> Back home</Link>
        <Link to="/browse" className="btn-ghost"><Compass size={16} /> Discover talent</Link>
      </div>
    </div>
  );
}

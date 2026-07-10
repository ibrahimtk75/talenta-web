import { Link } from 'react-router-dom';
import { Compass } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="container-app grid min-h-[60vh] place-items-center py-20 text-center">
      <div>
        <Compass className="mx-auto h-14 w-14 text-brand-500" />
        <h1 className="mt-6 font-display text-5xl font-bold text-ink-900 dark:text-white">404</h1>
        <p className="mt-2 text-ink-500 dark:text-ink-400">This page drifted off the map.</p>
        <Link to="/" className="btn-primary mt-6">Back home</Link>
      </div>
    </div>
  );
}

import { useEffect, useState } from 'react';
import { apiEnabled, fetchPlayers } from './api';
import { PLAYERS, type Player } from './data';
import { useSession } from './session';

// Module-level cache, keyed by access scope ('full' for clubs/academies, 'pub'
// otherwise) so the public preview and the full club view never mix, and each
// is fetched once and shared across Browse, Feed, Rankings and PlayerDetail.
const cache: Record<string, Player[]> = {};
const inflight: Record<string, Promise<Player[]> | null> = {};

export function usePlayers() {
  const { token, role } = useSession();
  const full = role === 'club' || role === 'academy';
  // Key the cache by token too, so logging in/out or switching accounts never
  // serves another scope's (or another club's) cached list.
  const scope = full ? `full:${token ?? ''}` : 'pub';

  const [players, setPlayers] = useState<Player[]>(cache[scope] ?? (apiEnabled ? [] : PLAYERS));
  const [loading, setLoading] = useState(cache[scope] === undefined && apiEnabled);
  const [error, setError] = useState(false);

  useEffect(() => {
    // Demo mode (no backend configured): use the static sample players.
    if (!apiEnabled) { setPlayers(PLAYERS); setLoading(false); return; }
    if (cache[scope]) { setPlayers(cache[scope]); setLoading(false); return; }

    let alive = true;
    setLoading(true);
    const req = inflight[scope] ?? fetchPlayers(full ? token ?? undefined : undefined);
    inflight[scope] = req;
    req
      .then((list) => { cache[scope] = list; if (alive) { setPlayers(list); setLoading(false); } })
      .catch(() => { if (alive) { setPlayers(PLAYERS); setError(true); setLoading(false); } }) // resilience only
      .finally(() => { inflight[scope] = null; });

    return () => { alive = false; };
  }, [scope, token, full]);

  return { players, loading, error };
}

/** Find a single player by id from the shared cache (used by PlayerDetail). */
export function usePlayer(id: string | undefined) {
  const { players, loading, error } = usePlayers();
  const player = id ? players.find((p) => p.id === id) : undefined;
  return { player, loading, error };
}

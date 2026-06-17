import { useEffect, useState } from 'react';
import { apiEnabled, fetchPlayers } from './api';
import { PLAYERS, type Player } from './data';

// Module-level cache so the player list is fetched once and shared across
// Browse, Feed and PlayerDetail (no refetch when navigating between them).
let cache: Player[] | null = null;
let inflight: Promise<Player[]> | null = null;

export function usePlayers() {
  const [players, setPlayers] = useState<Player[]>(cache ?? (apiEnabled ? [] : PLAYERS));
  const [loading, setLoading] = useState(cache === null && apiEnabled);
  const [error, setError] = useState(false);

  useEffect(() => {
    // Demo mode (no backend configured): use the static sample players.
    if (!apiEnabled) { setPlayers(PLAYERS); setLoading(false); return; }
    if (cache) { setPlayers(cache); setLoading(false); return; }

    let alive = true;
    inflight = inflight ?? fetchPlayers();
    inflight
      .then((list) => { cache = list; if (alive) { setPlayers(list); setLoading(false); } })
      .catch(() => { if (alive) { setPlayers(PLAYERS); setError(true); setLoading(false); } }) // resilience only
      .finally(() => { inflight = null; });

    return () => { alive = false; };
  }, []);

  return { players, loading, error };
}

/** Find a single player by id from the shared cache (used by PlayerDetail). */
export function usePlayer(id: string | undefined) {
  const { players, loading, error } = usePlayers();
  const player = id ? players.find((p) => p.id === id) : undefined;
  return { player, loading, error };
}

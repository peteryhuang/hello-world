'use client';

import type { Player } from '@/types/game';
import { sortedPlayers } from '@/lib/game';

interface Props {
  players: Player[];
  spotlightPlayerId?: string;
  showClaps?: boolean;
}

export default function PlayerList({ players, spotlightPlayerId, showClaps }: Props) {
  const sorted = sortedPlayers(players);

  return (
    <div className="flex flex-col gap-2 w-full">
      {sorted.map((p) => (
        <div
          key={p.id}
          className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
            spotlightPlayerId === p.id
              ? 'bg-gold/15 ring-1 ring-gold/40'
              : 'bg-surface/60'
          }`}
        >
          {/* Avatar */}
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center text-navy font-bold text-base shrink-0"
            style={{ backgroundColor: p.color }}
          >
            {p.name.charAt(0).toUpperCase()}
          </div>

          <div className="flex-1 min-w-0">
            <p className="text-soft font-medium truncate leading-tight">
              {p.name}
              {p.isHost && <span className="ml-2 text-xs text-muted">(host)</span>}
            </p>
            {spotlightPlayerId === p.id && (
              <p className="text-xs text-gold mt-0.5">In the spotlight</p>
            )}
          </div>

          {showClaps && (
            <div className="flex items-center gap-1 text-gold shrink-0">
              <span className="text-lg">👏</span>
              <span className="font-bold text-soft">{p.totalClaps}</span>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

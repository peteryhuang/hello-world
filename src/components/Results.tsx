'use client';

import type { Player } from '@/types/game';
import { sortedPlayers } from '@/lib/game';

const CLOSING_MESSAGES = [
  "Great stories make great teams. 🌟",
  "Now you really know each other. ✨",
  "The best teams know each other beyond the job. 💛",
  "Thanks for being real tonight. 🙏",
];

interface Props {
  players: Player[];
  onPlayAgain: () => void;
}

export default function Results({ players, onPlayAgain }: Props) {
  const ranked = [...players].sort((a, b) => b.totalClaps - a.totalClaps);
  const maxClaps = ranked[0]?.totalClaps ?? 0;
  const winners = ranked.filter((p) => p.totalClaps === maxClaps && maxClaps > 0);
  const closing = CLOSING_MESSAGES[Math.floor(Math.random() * CLOSING_MESSAGES.length)];

  return (
    <div className="flex flex-col min-h-screen bg-navy px-5 pt-10 pb-10 max-w-md mx-auto">
      {/* Trophy */}
      <div className="text-center mb-8" style={{ animation: 'bounce-in 0.6s cubic-bezier(0.34,1.56,0.64,1) forwards' }}>
        <div className="text-7xl mb-4">🏆</div>
        <h1 className="text-soft text-2xl font-bold mb-1">Results</h1>
        <p className="text-muted text-sm">{closing}</p>
      </div>

      {/* Winner(s) */}
      {winners.length > 0 && (
        <div
          className="bg-gold/10 border border-gold/30 rounded-2xl p-5 mb-6 text-center"
          style={{ animation: 'fade-up 0.4s ease-out 0.2s both' }}
        >
          <p className="text-gold text-xs uppercase tracking-widest mb-3">
            {winners.length === 1 ? 'Most Appreciated' : 'Tied — Most Appreciated'}
          </p>
          <div className="flex justify-center gap-4 flex-wrap">
            {winners.map((w) => (
              <div key={w.id} className="flex flex-col items-center gap-2">
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center text-navy text-2xl font-bold ring-4 ring-gold/40"
                  style={{ backgroundColor: w.color }}
                >
                  {w.name.charAt(0).toUpperCase()}
                </div>
                <p className="text-soft font-semibold">{w.name}</p>
                <p className="text-gold text-sm font-bold">{w.totalClaps} 👏</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Full leaderboard */}
      <div className="flex flex-col gap-2 mb-8" style={{ animation: 'fade-up 0.4s ease-out 0.35s both' }}>
        {ranked.map((p, i) => (
          <div
            key={p.id}
            className="flex items-center gap-3 px-4 py-3 rounded-xl bg-surface/60"
          >
            <span className="text-muted text-sm w-5 text-center font-mono">
              {i === 0 && maxClaps > 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `${i + 1}`}
            </span>
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center text-navy text-sm font-bold shrink-0"
              style={{ backgroundColor: p.color }}
            >
              {p.name.charAt(0).toUpperCase()}
            </div>
            <p className="flex-1 text-soft font-medium truncate">{p.name}</p>
            <div className="flex items-center gap-1.5">
              <div
                className="h-2 rounded-full bg-gold/60 transition-all"
                style={{ width: maxClaps > 0 ? `${(p.totalClaps / maxClaps) * 60}px` : '0' }}
              />
              <span className="text-muted text-sm tabular-nums w-12 text-right">
                {p.totalClaps} 👏
              </span>
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={onPlayAgain}
        className="w-full py-4 rounded-2xl font-bold text-navy text-lg bg-gold hover:bg-gold-light active:scale-95 transition-all mt-auto"
      >
        Play Again
      </button>
    </div>
  );
}

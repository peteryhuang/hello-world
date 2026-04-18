'use client';

import { useEffect, useState } from 'react';
import type { Player } from '@/types/game';

const TIER_LABELS: Record<number, { label: string; color: string }> = {
  1: { label: 'Warm Up', color: 'text-emerald-400' },
  2: { label: 'Getting Personal', color: 'text-gold' },
  3: { label: 'Deep Connection', color: 'text-ember' },
};

interface Props {
  questionText: string;
  tier: 1 | 2 | 3;
  round: number;
  totalRounds: number;
  spotlightPlayer: Player | undefined;
  isSpotlight: boolean;
  isHost: boolean;
  onOpenClaps: () => void;
  onEndGame: () => void;
}

export default function QuestionCard({
  questionText,
  tier,
  round,
  totalRounds,
  spotlightPlayer,
  isSpotlight,
  isHost,
  onOpenClaps,
  onEndGame,
}: Props) {
  const [flipped, setFlipped] = useState(false);

  // Flip in when question changes
  useEffect(() => {
    setFlipped(false);
    const t = setTimeout(() => setFlipped(true), 80);
    return () => clearTimeout(t);
  }, [questionText]);

  const tierInfo = TIER_LABELS[tier] ?? TIER_LABELS[1];

  return (
    <div className="flex flex-col min-h-screen bg-navy px-5 pt-8 pb-8 max-w-md mx-auto">
      {/* Progress */}
      <div className="flex items-center justify-between mb-6">
        <span className="text-muted text-sm">
          Round {round + 1} / {totalRounds}
        </span>
        {isHost && (
          <button
            onClick={onEndGame}
            className="text-muted text-sm underline underline-offset-2 hover:text-soft transition-colors"
          >
            End Game
          </button>
        )}
      </div>

      {/* Progress bar */}
      <div className="w-full h-1 bg-surface rounded-full mb-8 overflow-hidden">
        <div
          className="h-full bg-gold rounded-full transition-all duration-500"
          style={{ width: `${((round + 1) / totalRounds) * 100}%` }}
        />
      </div>

      {/* Card */}
      <div
        className="relative flex-1 flex items-center justify-center mb-8"
        style={{ perspective: '1000px' }}
      >
        <div
          className={`w-full rounded-3xl bg-card border border-surface/80 p-8 shadow-2xl transition-all duration-500 ${
            flipped ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
          }`}
          style={{
            transform: flipped ? 'rotateY(0deg)' : 'rotateY(-12deg)',
            transition: 'transform 0.5s ease, opacity 0.4s ease, scale 0.4s ease',
          }}
        >
          {/* Tier badge */}
          <p className={`text-xs uppercase tracking-widest font-semibold mb-4 ${tierInfo.color}`}>
            {tierInfo.label}
          </p>

          {/* Question */}
          <p className="text-soft text-2xl font-medium leading-snug text-center">
            {questionText}
          </p>
        </div>
      </div>

      {/* Spotlight player */}
      {spotlightPlayer && (
        <div className="flex flex-col items-center mb-8">
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center text-navy text-2xl font-bold mb-2 ring-4 ring-gold/30"
            style={{ backgroundColor: spotlightPlayer.color }}
          >
            {spotlightPlayer.name.charAt(0).toUpperCase()}
          </div>
          <p className="text-soft font-semibold text-lg">{spotlightPlayer.name}</p>
          {isSpotlight ? (
            <p className="text-gold text-sm mt-1">It's your turn to share!</p>
          ) : (
            <p className="text-muted text-sm mt-1">is answering</p>
          )}
        </div>
      )}

      {/* Host controls */}
      {isHost && (
        <button
          onClick={onOpenClaps}
          className="w-full py-4 rounded-2xl font-bold text-navy text-lg bg-gold hover:bg-gold-light active:scale-95 transition-all"
          style={{ animation: 'pulse-glow 1.5s ease-in-out infinite' }}
        >
          Open Clap Window 👏
        </button>
      )}

      {!isHost && !isSpotlight && (
        <div className="text-center text-muted text-sm">
          Listen up · Claps open soon
        </div>
      )}

      {isSpotlight && !isHost && (
        <div className="text-center text-gold/80 text-sm">
          Share your answer with the table
        </div>
      )}
    </div>
  );
}

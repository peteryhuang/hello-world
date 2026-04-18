'use client';

import type { Player } from '@/types/game';

interface Props {
  nextPlayer: Player | undefined;
  nextQuestion: string;
  round: number;
  totalRounds: number;
  isHost: boolean;
  isLastRound: boolean;
  onNext: () => void;
  onEndGame: () => void;
}

export default function Transition({
  nextPlayer,
  nextQuestion,
  round,
  totalRounds,
  isHost,
  isLastRound,
  onNext,
  onEndGame,
}: Props) {
  return (
    <div className="flex flex-col min-h-screen bg-navy px-5 pt-10 pb-8 max-w-md mx-auto items-center">
      {/* Claps are secret — no count shown */}
      <div className="flex-1 flex flex-col items-center justify-center gap-8 w-full">
        <div className="text-6xl" style={{ animation: 'bounce-in 0.5s cubic-bezier(0.34,1.56,0.64,1) forwards' }}>
          🎉
        </div>
        <div className="text-center" style={{ animation: 'fade-up 0.4s ease-out 0.15s both' }}>
          <p className="text-soft text-xl font-semibold mb-1">Round {round + 1} done!</p>
          <p className="text-muted text-sm">Clap results revealed at the end</p>
        </div>

        {!isLastRound && nextPlayer && (
          <div
            className="w-full bg-surface/60 rounded-2xl p-5 text-center"
            style={{ animation: 'fade-up 0.4s ease-out 0.3s both' }}
          >
            <p className="text-muted text-xs uppercase tracking-widest mb-3">Up Next</p>
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center text-navy text-lg font-bold mx-auto mb-2"
              style={{ backgroundColor: nextPlayer.color }}
            >
              {nextPlayer.name.charAt(0).toUpperCase()}
            </div>
            <p className="text-soft font-semibold mb-3">{nextPlayer.name}</p>
            <p className="text-muted text-sm italic leading-relaxed">&ldquo;{nextQuestion}&rdquo;</p>
          </div>
        )}
      </div>

      {isHost && (
        <div className="w-full flex flex-col gap-3 mt-auto">
          {!isLastRound ? (
            <button
              onClick={onNext}
              className="w-full py-4 rounded-2xl font-bold text-navy text-lg bg-gold hover:bg-gold-light active:scale-95 transition-all"
            >
              Next Question →
            </button>
          ) : (
            <button
              onClick={onEndGame}
              className="w-full py-4 rounded-2xl font-bold text-navy text-lg bg-gold hover:bg-gold-light active:scale-95 transition-all"
            >
              See Results 🏆
            </button>
          )}
          {!isLastRound && (
            <button
              onClick={onEndGame}
              className="w-full py-3 rounded-2xl font-medium text-muted text-base bg-surface/40 hover:bg-surface active:scale-95 transition-all"
            >
              End Game Early
            </button>
          )}
        </div>
      )}

      {!isHost && (
        <p className="text-muted text-sm mt-auto">Waiting for host…</p>
      )}
    </div>
  );
}

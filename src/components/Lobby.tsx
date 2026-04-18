'use client';

import { useState } from 'react';
import type { Player } from '@/types/game';
import PlayerList from './PlayerList';

interface Props {
  roomCode: string;
  players: Player[];
  isHost: boolean;
  questionCount: number;
  onQuestionCountChange: (n: number) => void;
  onStart: () => void;
}

const PRESETS = [
  { label: 'Quick', value: 5, desc: '~15 min' },
  { label: 'Standard', value: 10, desc: '~30 min' },
  { label: 'Deep Dive', value: 15, desc: '~45 min' },
];

export default function Lobby({ roomCode, players, isHost, questionCount, onQuestionCountChange, onStart }: Props) {
  const [copied, setCopied] = useState(false);

  const copyCode = async () => {
    await navigator.clipboard.writeText(roomCode).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col min-h-screen bg-navy px-5 pt-10 pb-8 max-w-md mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <p className="text-muted text-sm uppercase tracking-widest mb-2">Room Code</p>
        <button
          onClick={copyCode}
          className="text-5xl font-bold tracking-[0.15em] text-gold font-mono hover:text-gold-light transition-colors"
        >
          {roomCode}
        </button>
        <p className="text-muted text-sm mt-2">
          {copied ? '✓ Copied!' : 'Tap to copy · Share with your table'}
        </p>
      </div>

      {/* Players */}
      <div className="mb-6">
        <p className="text-muted text-xs uppercase tracking-widest mb-3">
          {players.length} {players.length === 1 ? 'player' : 'players'} joined
        </p>
        <PlayerList players={players} />
      </div>

      {isHost && (
        <>
          {/* Game length picker */}
          <div className="mb-8">
            <p className="text-muted text-xs uppercase tracking-widest mb-3">Game length</p>
            <div className="grid grid-cols-3 gap-2">
              {PRESETS.map((p) => (
                <button
                  key={p.value}
                  onClick={() => onQuestionCountChange(p.value)}
                  className={`rounded-xl py-3 px-2 text-center transition-all border ${
                    questionCount === p.value
                      ? 'border-gold bg-gold/15 text-gold'
                      : 'border-surface bg-surface/40 text-muted'
                  }`}
                >
                  <p className="font-semibold text-sm">{p.label}</p>
                  <p className="text-xs mt-0.5 opacity-80">{p.desc}</p>
                </button>
              ))}
            </div>
            <p className="text-center text-muted text-xs mt-2">{questionCount} questions · can end anytime</p>
          </div>

          <button
            onClick={onStart}
            disabled={players.length < 2}
            className="w-full py-4 rounded-2xl font-bold text-navy text-lg bg-gold hover:bg-gold-light active:scale-95 transition-all disabled:opacity-40 disabled:cursor-not-allowed mt-auto"
          >
            {players.length < 2 ? 'Waiting for players…' : 'Start Game'}
          </button>
        </>
      )}

      {!isHost && (
        <div className="mt-auto text-center">
          <div className="inline-flex items-center gap-2 text-muted text-sm">
            <span className="animate-pulse">●</span>
            Waiting for host to start…
          </div>
        </div>
      )}
    </div>
  );
}

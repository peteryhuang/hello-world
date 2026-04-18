'use client';

import { useEffect, useRef, useState } from 'react';
import type { Player, Room } from '@/types/game';
import { recordClap, closeRound } from '@/lib/game';

const RADIUS = 40;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS; // ≈ 251

interface Props {
  room: Room;
  roomCode: string;
  playerId: string;
  spotlightPlayer: Player | undefined;
  isSpotlight: boolean;
}

export default function ClapButton({ room, roomCode, playerId, spotlightPlayer, isSpotlight }: Props) {
  const [hasClapped, setHasClapped] = useState(false);
  const [timeLeft, setTimeLeft] = useState(12);
  const [rippling, setRippling] = useState(false);
  const closedRef = useRef(false);
  const storageKey = `clapped_${roomCode}_${room.currentRound}`;

  // Init from localStorage
  useEffect(() => {
    setHasClapped(!!localStorage.getItem(storageKey));
    setTimeLeft(12);
    closedRef.current = false;
  }, [room.currentRound, storageKey]);

  // Countdown timer driven by server clapWindowEnd
  useEffect(() => {
    if (!room.clapWindowEnd) return;

    const tick = () => {
      const remaining = Math.max(0, Math.ceil((room.clapWindowEnd!.toDate().getTime() - Date.now()) / 1000));
      setTimeLeft(remaining);

      if (remaining <= 0 && !closedRef.current) {
        closedRef.current = true;
        closeRound(roomCode);
      }
    };

    tick();
    const interval = setInterval(tick, 250);
    return () => clearInterval(interval);
  }, [room.clapWindowEnd, roomCode]);

  const handleClap = async () => {
    if (hasClapped || isSpotlight || timeLeft <= 0) return;

    setHasClapped(true);
    setRippling(true);
    localStorage.setItem(storageKey, '1');
    setTimeout(() => setRippling(false), 600);

    await recordClap(roomCode, room.currentRound, room.spotlightPlayerId);
  };

  const progress = CIRCUMFERENCE - (CIRCUMFERENCE * timeLeft) / 12;

  return (
    <div className="flex flex-col min-h-screen bg-navy px-5 pt-8 pb-8 max-w-md mx-auto">
      {/* Spotlight player reminder */}
      {spotlightPlayer && (
        <div className="flex flex-col items-center mb-8 mt-4">
          <div
            className="w-14 h-14 rounded-full flex items-center justify-center text-navy text-xl font-bold mb-2"
            style={{ backgroundColor: spotlightPlayer.color }}
          >
            {spotlightPlayer.name.charAt(0).toUpperCase()}
          </div>
          <p className="text-soft font-semibold">{spotlightPlayer.name} just shared</p>
        </div>
      )}

      {/* Countdown ring */}
      <div className="flex flex-col items-center mb-8">
        <div className="relative w-24 h-24">
          <svg className="w-24 h-24 -rotate-90" viewBox="0 0 96 96">
            <circle cx="48" cy="48" r={RADIUS} fill="none" stroke="#292524" strokeWidth="6" />
            <circle
              cx="48"
              cy="48"
              r={RADIUS}
              fill="none"
              stroke="#f59e0b"
              strokeWidth="6"
              strokeLinecap="round"
              strokeDasharray={CIRCUMFERENCE}
              strokeDashoffset={progress}
              style={{ transition: 'stroke-dashoffset 0.25s linear' }}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-2xl font-bold text-gold">{timeLeft}</span>
          </div>
        </div>
        <p className="text-muted text-sm mt-2">seconds left</p>
      </div>

      {/* Main clap button or spotlight message */}
      {isSpotlight ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center gap-4">
          <p className="text-5xl">🎤</p>
          <p className="text-soft font-semibold text-lg">You just answered!</p>
          <p className="text-muted text-sm">Others are clapping anonymously…</p>
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center gap-6">
          {!hasClapped ? (
            <>
              <p className="text-muted text-sm text-center">Tap to clap for their answer</p>
              <div className="relative">
                {rippling && (
                  <div
                    className="absolute inset-0 rounded-full bg-gold opacity-30"
                    style={{ animation: 'ripple 0.6s ease-out forwards' }}
                  />
                )}
                <button
                  onClick={handleClap}
                  disabled={timeLeft <= 0}
                  className="w-36 h-36 rounded-full bg-gold text-navy text-5xl font-bold flex items-center justify-center active:scale-90 transition-transform disabled:opacity-30 disabled:cursor-not-allowed"
                  style={{
                    touchAction: 'manipulation',
                    animation: timeLeft > 0 ? 'pulse-glow 1.5s ease-in-out infinite' : 'none',
                  }}
                >
                  👏
                </button>
              </div>
              <p className="text-muted text-xs">Anonymous · one clap per round</p>
            </>
          ) : (
            <div className="flex flex-col items-center gap-4">
              <div className="w-36 h-36 rounded-full bg-surface border-2 border-gold/40 flex items-center justify-center">
                <span className="text-5xl">✓</span>
              </div>
              <p className="text-soft font-medium">Clap sent!</p>
              <p className="text-muted text-sm text-center">Your clap is anonymous · reveal at the end</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createRoom, joinRoom } from '@/lib/game';

type Mode = 'home' | 'create' | 'join';

export default function Home() {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>('home');
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCreate = async () => {
    if (!name.trim()) return setError('Enter your name');
    setError('');
    setLoading(true);
    try {
      const { roomCode, playerId } = await createRoom(name.trim(), 10);
      sessionStorage.setItem(`playerId_${roomCode}`, playerId);
      router.push(`/room/${roomCode}`);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong');
      setLoading(false);
    }
  };

  const handleJoin = async () => {
    if (!name.trim()) return setError('Enter your name');
    if (code.length !== 4) return setError('Enter the 4-letter room code');
    setError('');
    setLoading(true);
    try {
      const roomCode = code.toUpperCase();
      const playerId = await joinRoom(roomCode, name.trim());
      sessionStorage.setItem(`playerId_${roomCode}`, playerId);
      router.push(`/room/${roomCode}`);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong');
      setLoading(false);
    }
  };

  if (mode === 'home') {
    return (
      <div className="flex flex-col min-h-screen bg-navy px-6 max-w-md mx-auto">
        <div className="flex-1 flex flex-col items-center justify-center gap-6 text-center">
          <div className="text-6xl mb-2">🃏</div>
          <div>
            <h1 className="text-soft text-4xl font-bold leading-tight mb-2">Know Your People</h1>
            <p className="text-muted text-base leading-relaxed">
              Science-backed questions to bring your team closer — one dinner at a time.
            </p>
          </div>
          <div className="w-full flex flex-col gap-3 mt-4">
            <button
              onClick={() => setMode('create')}
              className="w-full py-4 rounded-2xl font-bold text-navy text-lg bg-gold hover:bg-gold-light active:scale-95 transition-all"
            >
              Create Game
            </button>
            <button
              onClick={() => setMode('join')}
              className="w-full py-4 rounded-2xl font-bold text-soft text-lg bg-surface hover:bg-surface/80 active:scale-95 transition-all"
            >
              Join Game
            </button>
          </div>
        </div>
        <p className="text-center text-muted text-xs pb-8">Based on Aron&apos;s Fast Friends research · 105 questions</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-navy px-6 pt-10 pb-8 max-w-md mx-auto">
      <button
        onClick={() => { setMode('home'); setError(''); setName(''); setCode(''); }}
        className="text-muted text-sm mb-8 self-start hover:text-soft transition-colors"
      >
        ← Back
      </button>

      <div className="flex-1 flex flex-col justify-center gap-6">
        <div className="text-center mb-2">
          <div className="text-4xl mb-3">{mode === 'create' ? '✨' : '🔑'}</div>
          <h2 className="text-soft text-2xl font-bold">
            {mode === 'create' ? 'Create a Room' : 'Join a Room'}
          </h2>
          <p className="text-muted text-sm mt-1">
            {mode === 'create' ? "You'll be the host" : 'Ask the host for the code'}
          </p>
        </div>

        <div className="flex flex-col gap-4">
          {mode === 'join' && (
            <div>
              <label className="text-muted text-xs uppercase tracking-widest block mb-2">Room Code</label>
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase().slice(0, 4))}
                placeholder="ABCD"
                maxLength={4}
                className="w-full bg-surface border border-surface/80 rounded-xl px-4 py-4 text-soft text-2xl font-mono tracking-[0.3em] text-center placeholder:text-muted/40 focus:outline-none focus:ring-2 focus:ring-gold/40"
                style={{ touchAction: 'manipulation' }}
              />
            </div>
          )}

          <div>
            <label className="text-muted text-xs uppercase tracking-widest block mb-2">Your Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="How should we call you?"
              maxLength={30}
              className="w-full bg-surface border border-surface/80 rounded-xl px-4 py-4 text-soft text-base placeholder:text-muted/40 focus:outline-none focus:ring-2 focus:ring-gold/40"
              style={{ touchAction: 'manipulation' }}
              onKeyDown={(e) => e.key === 'Enter' && (mode === 'create' ? handleCreate() : handleJoin())}
            />
          </div>

          {error && <p className="text-red-400 text-sm text-center">{error}</p>}

          <button
            onClick={mode === 'create' ? handleCreate : handleJoin}
            disabled={loading}
            className="w-full py-4 rounded-2xl font-bold text-navy text-lg bg-gold hover:bg-gold-light active:scale-95 transition-all disabled:opacity-50 mt-2"
          >
            {loading ? 'One moment…' : mode === 'create' ? 'Create Room' : 'Join Room'}
          </button>
        </div>
      </div>
    </div>
  );
}

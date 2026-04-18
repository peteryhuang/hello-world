'use client';

import { useEffect, useRef, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  collection,
  doc,
  onSnapshot,
  getDocs,
  query,
  orderBy,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import {
  startGame,
  openClapWindow,
  advanceRound,
  endGame,
  sortedPlayers,
} from '@/lib/game';
import type { Player, Room, Question } from '@/types/game';

import Lobby from '@/components/Lobby';
import QuestionCard from '@/components/QuestionCard';
import ClapButton from '@/components/ClapButton';
import Transition from '@/components/Transition';
import Results from '@/components/Results';

export default function RoomPage() {
  const params = useParams();
  const router = useRouter();
  const roomCode = (params.code as string).toUpperCase();

  const [playerId, setPlayerId] = useState<string | null>(null);
  const [room, setRoom] = useState<Room | null>(null);
  const [players, setPlayers] = useState<Player[]>([]);
  const [questions, setQuestions] = useState<Record<string, Question>>({});
  const [questionCount, setQuestionCount] = useState(10);
  const [notFound, setNotFound] = useState(false);

  // Resolve player identity from sessionStorage
  useEffect(() => {
    const id = sessionStorage.getItem(`playerId_${roomCode}`);
    setPlayerId(id);
  }, [roomCode]);

  // Subscribe to room doc
  useEffect(() => {
    const unsub = onSnapshot(doc(db, 'rooms', roomCode), (snap) => {
      if (!snap.exists()) { setNotFound(true); return; }
      setRoom({ ...(snap.data() as Room) });
    });
    return unsub;
  }, [roomCode]);

  // Subscribe to players sub-collection
  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'rooms', roomCode, 'players'), (snap) => {
      setPlayers(snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Player, 'id'>) })));
    });
    return unsub;
  }, [roomCode]);

  // Load question texts on mount
  useEffect(() => {
    getDocs(query(collection(db, 'questions'), orderBy('tier'))).then((snap) => {
      const map: Record<string, Question> = {};
      snap.docs.forEach((d) => { map[d.id] = { id: d.id, ...(d.data() as Omit<Question, 'id'>) }; });
      setQuestions(map);
    });
  }, []);

  if (notFound) {
    return (
      <div className="flex flex-col min-h-screen bg-navy items-center justify-center px-6 text-center gap-4">
        <p className="text-5xl">🤔</p>
        <p className="text-soft text-xl font-semibold">Room not found</p>
        <p className="text-muted text-sm">Check the code and try again</p>
        <button onClick={() => router.push('/')} className="mt-4 px-6 py-3 rounded-xl bg-gold text-navy font-bold">
          Go Home
        </button>
      </div>
    );
  }

  if (!room || !playerId) {
    // If no playerId in sessionStorage, offer to join
    if (room && !playerId) {
      return (
        <div className="flex flex-col min-h-screen bg-navy items-center justify-center px-6 text-center gap-4">
          <p className="text-5xl">🔑</p>
          <p className="text-soft text-xl font-semibold">Want to join this game?</p>
          <button onClick={() => router.push('/')} className="mt-2 px-6 py-3 rounded-xl bg-gold text-navy font-bold">
            Join from Home
          </button>
        </div>
      );
    }
    return (
      <div className="flex flex-col min-h-screen bg-navy items-center justify-center">
        <div className="w-10 h-10 rounded-full border-4 border-gold border-t-transparent animate-spin" />
      </div>
    );
  }

  const isHost = room.hostId === playerId;
  const isSpotlight = room.spotlightPlayerId === playerId;
  const sorted = sortedPlayers(players);
  const spotlightPlayer = players.find((p) => p.id === room.spotlightPlayerId);
  const currentQuestion = questions[room.currentQuestionId];

  const handleStart = () => {
    startGame(roomCode, players, questionCount);
  };

  const handleOpenClaps = () => {
    openClapWindow(roomCode);
  };

  const handleNext = () => {
    const nextRound = room.currentRound + 1;
    advanceRound(roomCode, nextRound, players, room.selectedQuestionIds);
  };

  const handleEndGame = () => {
    endGame(roomCode);
  };

  const handlePlayAgain = () => {
    router.push('/');
  };

  if (room.status === 'lobby') {
    return (
      <Lobby
        roomCode={roomCode}
        players={players}
        isHost={isHost}
        questionCount={questionCount}
        onQuestionCountChange={setQuestionCount}
        onStart={handleStart}
      />
    );
  }

  if (room.status === 'results') {
    return <Results players={players} onPlayAgain={handlePlayAgain} />;
  }

  if (room.status === 'playing' && currentQuestion) {
    return (
      <QuestionCard
        questionText={currentQuestion.text}
        tier={currentQuestion.tier}
        round={room.currentRound}
        totalRounds={room.totalRounds}
        spotlightPlayer={spotlightPlayer}
        isSpotlight={isSpotlight}
        isHost={isHost}
        onOpenClaps={handleOpenClaps}
        onEndGame={handleEndGame}
      />
    );
  }

  if (room.status === 'clap-window') {
    return (
      <ClapButton
        room={room}
        roomCode={roomCode}
        playerId={playerId}
        spotlightPlayer={spotlightPlayer}
        isSpotlight={isSpotlight}
      />
    );
  }

  if (room.status === 'transitioning') {
    const nextRound = room.currentRound + 1;
    const isLastRound = nextRound >= room.totalRounds;
    const nextPlayerId = isLastRound ? '' : sorted[nextRound % sorted.length]?.id;
    const nextPlayer = players.find((p) => p.id === nextPlayerId);
    const nextQuestionId = isLastRound ? '' : room.selectedQuestionIds[nextRound];
    const nextQuestion = nextQuestionId ? (questions[nextQuestionId]?.text ?? '') : '';

    return (
      <Transition
        nextPlayer={nextPlayer}
        nextQuestion={nextQuestion}
        round={room.currentRound}
        totalRounds={room.totalRounds}
        isHost={isHost}
        isLastRound={isLastRound}
        onNext={handleNext}
        onEndGame={handleEndGame}
      />
    );
  }

  // Fallback loading
  return (
    <div className="flex flex-col min-h-screen bg-navy items-center justify-center">
      <div className="w-10 h-10 rounded-full border-4 border-gold border-t-transparent animate-spin" />
    </div>
  );
}

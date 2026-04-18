import {
  doc,
  setDoc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  collection,
  query,
  where,
  orderBy,
  runTransaction,
  writeBatch,
  increment,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore';
import { db } from './firebase';
import type { Player, Room } from '@/types/game';
import { selectQuestions } from './questions';

const ALPHABET = 'ABCDEFGHJKMNPQRSTUVWXYZ';

function randomCode(): string {
  return Array.from({ length: 4 }, () => ALPHABET[Math.floor(Math.random() * ALPHABET.length)]).join('');
}

export const PLAYER_COLORS = [
  '#f97316', '#8b5cf6', '#06b6d4', '#10b981',
  '#f59e0b', '#ec4899', '#3b82f6', '#84cc16',
];

export function sortedPlayers(players: Player[]): Player[] {
  return [...players].sort((a, b) => a.joinedAt.seconds - b.joinedAt.seconds);
}

export async function createRoom(hostName: string, questionCount: number): Promise<{ roomCode: string; playerId: string }> {
  let roomCode = randomCode();
  // Retry on collision (rare)
  for (let i = 0; i < 5; i++) {
    const snap = await getDoc(doc(db, 'rooms', roomCode));
    if (!snap.exists()) break;
    roomCode = randomCode();
  }

  const playerId = doc(collection(db, '_')).id;

  await setDoc(doc(db, 'rooms', roomCode), {
    hostId: playerId,
    status: 'lobby',
    currentRound: 0,
    spotlightPlayerId: '',
    currentQuestionId: '',
    clapWindowEnd: null,
    selectedQuestionIds: [],
    totalRounds: 0,
    questionCount,
    createdAt: serverTimestamp(),
  } satisfies Omit<Room, 'createdAt'> & { questionCount: number; createdAt: ReturnType<typeof serverTimestamp> });

  await setDoc(doc(db, 'rooms', roomCode, 'players', playerId), {
    name: hostName,
    isHost: true,
    joinedAt: serverTimestamp(),
    totalClaps: 0,
    color: PLAYER_COLORS[0],
  });

  return { roomCode, playerId };
}

export async function joinRoom(roomCode: string, playerName: string): Promise<string> {
  const roomSnap = await getDoc(doc(db, 'rooms', roomCode));
  if (!roomSnap.exists()) throw new Error('Room not found. Check the code and try again.');

  const roomData = roomSnap.data();
  if (roomData.status !== 'lobby') throw new Error('This game has already started.');

  const playersSnap = await getDocs(collection(db, 'rooms', roomCode, 'players'));
  const playerCount = playersSnap.size;
  const color = PLAYER_COLORS[playerCount % PLAYER_COLORS.length];

  const playerId = doc(collection(db, '_')).id;
  await setDoc(doc(db, 'rooms', roomCode, 'players', playerId), {
    name: playerName,
    isHost: false,
    joinedAt: serverTimestamp(),
    totalClaps: 0,
    color,
  });

  return playerId;
}

export async function startGame(roomCode: string, players: Player[], questionCount: number): Promise<void> {
  // Fetch active questions from Firestore
  const qSnap = await getDocs(query(collection(db, 'questions'), where('active', '==', true)));
  const pool = qSnap.docs.map((d) => ({ id: d.id, tier: d.data().tier as 1 | 2 | 3 }));

  const selectedQuestionIds = selectQuestions(questionCount, pool);
  const sorted = sortedPlayers(players);
  const totalRounds = selectedQuestionIds.length;

  const firstPlayer = sorted[0];
  const firstQuestionId = selectedQuestionIds[0];

  await setDoc(doc(db, 'rooms', roomCode, 'rounds', '0'), {
    questionId: firstQuestionId,
    spotlightPlayerId: firstPlayer.id,
    clapCount: 0,
  });

  await updateDoc(doc(db, 'rooms', roomCode), {
    status: 'playing',
    currentRound: 0,
    spotlightPlayerId: firstPlayer.id,
    currentQuestionId: firstQuestionId,
    selectedQuestionIds,
    totalRounds,
    clapWindowEnd: null,
  });
}

export async function openClapWindow(roomCode: string): Promise<void> {
  const end = Timestamp.fromDate(new Date(Date.now() + 12000));
  await updateDoc(doc(db, 'rooms', roomCode), {
    status: 'clap-window',
    clapWindowEnd: end,
  });
}

export async function recordClap(
  roomCode: string,
  roundIndex: number,
  spotlightPlayerId: string,
): Promise<void> {
  const roundRef = doc(db, 'rooms', roomCode, 'rounds', String(roundIndex));
  const playerRef = doc(db, 'rooms', roomCode, 'players', spotlightPlayerId);

  const batch = writeBatch(db);
  batch.update(roundRef, { clapCount: increment(1) });
  batch.update(playerRef, { totalClaps: increment(1) });
  await batch.commit();
}

export async function closeRound(roomCode: string): Promise<void> {
  const roomRef = doc(db, 'rooms', roomCode);
  await runTransaction(db, async (tx) => {
    const snap = await tx.get(roomRef);
    if (snap.data()?.status !== 'clap-window') return;
    tx.update(roomRef, { status: 'transitioning' });
  });
}

export async function advanceRound(
  roomCode: string,
  nextRound: number,
  players: Player[],
  selectedQuestionIds: string[],
): Promise<void> {
  const sorted = sortedPlayers(players);
  const spotlightPlayerId = sorted[nextRound % sorted.length].id;
  const currentQuestionId = selectedQuestionIds[nextRound];

  await setDoc(doc(db, 'rooms', roomCode, 'rounds', String(nextRound)), {
    questionId: currentQuestionId,
    spotlightPlayerId,
    clapCount: 0,
  });

  await updateDoc(doc(db, 'rooms', roomCode), {
    status: 'playing',
    currentRound: nextRound,
    spotlightPlayerId,
    currentQuestionId,
    clapWindowEnd: null,
  });
}

export async function endGame(roomCode: string): Promise<void> {
  await updateDoc(doc(db, 'rooms', roomCode), { status: 'results' });
}

// Question bank helpers used by /admin
export async function seedQuestionsIfEmpty(): Promise<void> {
  const snap = await getDocs(collection(db, 'questions'));
  if (!snap.empty) return;

  const { SEED_QUESTIONS } = await import('./questions');
  const batch = writeBatch(db);
  for (const q of SEED_QUESTIONS) {
    const ref = doc(db, 'questions', q.id);
    batch.set(ref, { text: q.text, tier: q.tier, active: q.active, createdAt: serverTimestamp() });
  }
  await batch.commit();
}

export async function addQuestion(text: string, tier: 1 | 2 | 3): Promise<void> {
  await addDoc(collection(db, 'questions'), { text, tier, active: true, createdAt: serverTimestamp() });
}

export async function updateQuestion(id: string, fields: Partial<{ text: string; tier: 1 | 2 | 3; active: boolean }>): Promise<void> {
  await updateDoc(doc(db, 'questions', id), fields);
}

export async function deleteQuestion(id: string): Promise<void> {
  const { deleteDoc } = await import('firebase/firestore');
  await deleteDoc(doc(db, 'questions', id));
}

export async function fetchAllQuestions() {
  const snap = await getDocs(query(collection(db, 'questions'), orderBy('tier'), orderBy('createdAt')));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

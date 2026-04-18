import type { Timestamp } from 'firebase/firestore';

export type GameStatus =
  | 'lobby'
  | 'playing'
  | 'clap-window'
  | 'transitioning'
  | 'results';

export interface Room {
  hostId: string;
  status: GameStatus;
  currentRound: number;
  spotlightPlayerId: string;
  currentQuestionId: string;
  clapWindowEnd: Timestamp | null;
  selectedQuestionIds: string[];
  totalRounds: number;
  createdAt: Timestamp;
}

export interface Player {
  id: string;
  name: string;
  isHost: boolean;
  joinedAt: Timestamp;
  totalClaps: number;
  color: string;
}

export interface Round {
  questionId: string;
  spotlightPlayerId: string;
  clapCount: number;
}

export interface Question {
  id: string;
  text: string;
  tier: 1 | 2 | 3;
  active: boolean;
  createdAt?: Timestamp;
}

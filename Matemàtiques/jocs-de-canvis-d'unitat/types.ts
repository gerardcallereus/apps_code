// FIX: Removed self-import of 'Game' type which caused a conflict with its own declaration.

export interface Unit {
  name: string;
  symbol: string;
  factor: number;
}

export type Game = 'quiz' | 'fillBlank' | 'comparison' | 'whackAMole' | 'unitMatch' | 'unitLadder' | 'sorting' | 'unitRace' | 'puzzle' | 'lab' | 'tournament2p' | 'tournament1p' | null;

export type UnitCategory = 'Longitud' | 'Massa';

export type AnswerStatus = 'unanswered' | 'correct' | 'incorrect';

export interface BaseQuestion {
  fromUnit: Unit;
  toUnit: Unit;
  fromValue: number;
  correctAnswer: number;
}

export interface QuizQuestion extends BaseQuestion {
  options: number[];
}

export interface ComparisonQuestion {
  valueA: number;
  unitA: Unit;
  valueB: number;
  unitB: Unit;
  correctAnswer: '>' | '<' | '=';
}

export interface FallingQuestion {
  fromUnit: Unit;
  fromValue: number;
  options: { text: string; isCorrect: boolean }[];
}

export interface Card {
    id: number;
    pairId: number;
    text: string;
    status: 'up' | 'down' | 'matched';
}

export interface UnitRaceQuestion {
  items: { value: number; unit: Unit }[];
  targetUnit: Unit;
  correctAnswer: number;
}

export interface SortingItem {
    id: number;
    text: string;
    baseValue: number;
}

export interface LinkedPuzzleStep {
    id: number;
    fromValue: number | 'previous';
    fromUnit: Unit;
    toUnit: Unit;
    correctAnswer: number;
}
export type LinkedPuzzleQuestion = LinkedPuzzleStep[];

export interface LabAlchemyStep {
    id: number;
    instruction: string;
    targetValue: number;
    targetUnit: Unit;
    options: {
        text: string;
        isCorrect: boolean;
    }[];
}
export type LabAlchemyQuestion = LabAlchemyStep[];
export interface GameResult {
  gameName: string;
  score: number;
  maxScore: number;
  mistakes: number;
}

export type TournamentState = 'setup' | 'transition' | 'playing' | 'finished';
export type Player = { name: string; score: number };
export type TournamentGame = { key: Game, name: string };

export interface ScoreFeedbackInfo {
    base: number;
    bonus: number;
    total: number;
    isRoundSummary?: boolean;
}
export interface TurnLog {
  question: any;
  userAnswer?: any;
  correctAnswer: any;
  isCorrect?: boolean;
  score: number;
}
export interface PlayerLog {
  [gameKey: string]: TurnLog[];
}
export interface TournamentContextType {
    gameState: TournamentState;
    players: [Player, Player];
    playerLogs: [PlayerLog, PlayerLog];
    gameIndex: number;
    shuffledGames: TournamentGame[];
    currentPlayerIndex: number;
    challenge: any;
    roundInfo: { current: number; total: number } | undefined;
    scoreFeedback: ScoreFeedbackInfo | null;
    startGame: (p1Name: string, p2Name: string) => void;
    submitAnswer: (result: { scoreDelta: number; userAnswer?: any; isCorrect?: boolean; }) => void;
    requestNewChallenge: () => void;
    onBack: () => void;
    retryGame: () => void;
}
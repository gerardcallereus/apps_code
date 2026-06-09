export enum AppSection {
  THEORY = 'theory',
  EXERCISES = 'exercises'
}

export type CircuitType = 'simple' | 'series' | 'parallel';

export interface ExerciseScenario {
  id: number;
  type: CircuitType;
  title: string;
  question: string;
  switches: { s1: boolean; s2?: boolean }; // true = closed, false = open
  bulbBroken?: number; // 1 or 2 if a bulb is broken
  correctAnswer: boolean; // true = Yes/Cert, false = No/Fals
  explanation: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
}
export enum AppView {
  HOME = 'HOME',
  THEORY = 'THEORY',
  PLAYGROUND = 'PLAYGROUND',
  QUIZ = 'QUIZ'
}

export interface WCAGResult {
  score: number;
  levelAA: boolean; // Normal text
  levelAAA: boolean; // Normal text
  levelAALarge: boolean; // Large text
  levelAAALarge: boolean; // Large text
}

export interface QuizQuestion {
  id: number;
  bg: string;
  fg: string;
  context: string; // e.g., "Botó d'acció", "Text de peu de pàgina"
  isGood: boolean; // Simplified expectation for the quiz
  explanation: string; // Static explanation for educational feedback
}
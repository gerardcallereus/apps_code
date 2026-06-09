export enum TransformationType {
  THERMAL = "D'elèctrica a Tèrmica",
  MECHANICAL = "D'elèctrica a Mecànica",
  LUMINOUS = "D'elèctrica a Lluminosa",
  CHEMICAL = "D'elèctrica a Química",
  SOUND = "D'elèctrica a Sonora",
  MIXED = "D'elèctrica a Mixta (Vàries)"
}

export interface Question {
  id: number;
  objectName: string;
  description: string;
  correctType: string;
  options: string[];
  explanation: string;
}

export interface GameState {
  score: number;
  currentQuestionIndex: number;
  isGameOver: boolean;
  streak: number;
}

export type AppView = 'home' | 'theory' | 'game';
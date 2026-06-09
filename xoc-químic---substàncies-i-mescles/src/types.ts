export type ViewState = 'teoria' | 'simulador' | 'separacio' | 'atomic' | 'activitats' | 'vocabulari';

export interface GlossariItem {
  term: string;
  definition: string;
  example?: string;
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
}


export interface ColorCode {
  name: string;
  value: number | null;
  multiplier: number | null;
  tolerance: number | null;
  colorClass: string;
}

export interface ResistorData {
  bands: ColorCode[];
  resistance: number;
  tolerance: number;
}

export type GameStatus = 'playing' | 'correct' | 'incorrect';

export type MaterialType = 'conductor' | 'aillant';

export interface Material {
  id: string;
  name: string;
  type: MaterialType;
  icon: string; // Emoji or simple representation
}

export interface GameState {
  matches: Record<string, MaterialType>; // materialId -> category matched
  isCircuitComplete: boolean;
}

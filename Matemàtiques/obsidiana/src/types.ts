export interface GameState {
  currentSceneId: string;
  inventory: string[];
  health: number;
  maxHealth: number;
  experience: number;
  visitedScenes: string[];
}

export type ProbabilityType = 'laplace' | 'tree' | 'conditional';

export interface ProbabilityInfo {
  type: ProbabilityType;
  title: string;
  explanation: string;
  formula: string;
  data: any;
}

export interface Choice {
  text: string;
  nextSceneId: string;
  requirement?: {
    item?: string;
    minHealth?: number;
  };
  probability?: {
    successChance: number; // 0 to 1
    info: ProbabilityInfo;
  };
}

export interface Combat {
  enemyName: string;
  enemyHealth: number;
  winSceneId: string;
  lossSceneId: string;
  combatProbability: ProbabilityInfo;
}

export interface Scene {
  id: string;
  title: string;
  text: string;
  imageUrl?: string;
  type: 'story' | 'combat' | 'end';
  choices?: Choice[];
  combat?: Combat;
}

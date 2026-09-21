export interface LevelStat {
  checks: number;
  errors: number;
  solved: boolean;
}

export interface SavedGameData {
  version: number;
  currentLevelIndex: number;
  totalChecks: number;
  totalErrors: number;
  levelStats: Record<number, LevelStat>;
  gameState: 'intro' | 'playing' | 'completed';
  lastUpdated: number;
}

const STORAGE_KEY = 'conway_game_of_life_save_v1';

export function saveGame(
  currentLevelIndex: number,
  totalChecks: number,
  totalErrors: number,
  levelStats: Record<number, LevelStat>,
  gameState: 'intro' | 'playing' | 'completed' = 'playing'
): void {
  try {
    const data: SavedGameData = {
      version: 1,
      currentLevelIndex,
      totalChecks,
      totalErrors,
      levelStats,
      gameState,
      lastUpdated: Date.now(),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.error('Error saving game to localStorage:', e);
  }
}

export function loadGame(): SavedGameData | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw);
    if (typeof data?.currentLevelIndex === 'number' && typeof data?.levelStats === 'object') {
      return data as SavedGameData;
    }
    return null;
  } catch (e) {
    console.error('Error loading game from localStorage:', e);
    return null;
  }
}

export function clearGame(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (e) {
    console.error('Error clearing game from localStorage:', e);
  }
}

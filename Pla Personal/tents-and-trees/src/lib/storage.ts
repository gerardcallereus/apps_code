import { GameStats } from '../App';
import { CellState } from './puzzle';

export interface SavedGameData {
  version: number;
  levelIndex: number;
  stats: GameStats;
  gridState?: CellState[][];
  lastUpdated: number;
}

const STORAGE_KEY = 'tents_and_trees_save_v1';

export function saveGame(levelIndex: number, stats: GameStats, gridState?: CellState[][]): void {
  try {
    const data: SavedGameData = {
      version: 1,
      levelIndex,
      stats,
      gridState,
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
    if (typeof data?.levelIndex === 'number' && typeof data?.stats === 'object') {
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

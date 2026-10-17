import { GameStats } from '../App';
import { CellState } from './puzzle';

export interface SavedGameData {
  version: number;
  levelIndex: number;
  stats: GameStats;
  gridState?: CellState[][];
  tutorialCompleted?: boolean;
  lastUpdated: number;
}

const STORAGE_KEY = 'tents_and_trees_save_v1';
const TUTORIAL_KEY = 'tents_and_trees_tutorial_done_v1';

export function saveGame(levelIndex: number, stats: GameStats, gridState?: CellState[][]): void {
  try {
    const data: SavedGameData = {
      version: 1,
      levelIndex,
      stats,
      gridState,
      tutorialCompleted: isTutorialCompleted(),
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

export function isTutorialCompleted(): boolean {
  try {
    return localStorage.getItem(TUTORIAL_KEY) === 'true';
  } catch {
    return false;
  }
}

export function setTutorialCompleted(): void {
  try {
    localStorage.setItem(TUTORIAL_KEY, 'true');
  } catch (e) {
    console.error('Error setting tutorial completed:', e);
  }
}

export function clearGame(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(TUTORIAL_KEY);
  } catch (e) {
    console.error('Error clearing game from localStorage:', e);
  }
}


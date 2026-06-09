import { GameStats } from '../App';

export function encodeSaveData(levelIndex: number, stats: GameStats): string {
  const minifiedStats: Record<number, number[]> = {};
  for (const key in stats) {
    minifiedStats[key] = [stats[key].checks, stats[key].errors, stats[key].solved ? 1 : 0];
  }
  const data = { l: levelIndex, s: minifiedStats };
  const jsonStr = JSON.stringify(data);
  // Ensured safe for URLs and strictly alphanumeric-looking (base64 with replacements)
  const base64 = btoa(jsonStr);
  return base64.replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
}

export function decodeSaveData(code: string): { levelIndex: number, stats: GameStats } | null {
  try {
    let base64 = code.trim().replace(/-/g, '+').replace(/_/g, '/');
    while (base64.length % 4 !== 0) {
      base64 += '=';
    }
    
    const jsonStr = atob(base64);
    const data = JSON.parse(jsonStr);
    
    if (typeof data.l !== 'number' || typeof data.s !== 'object') {
      return null;
    }
    
    const stats: GameStats = {};
    for (const key in data.s) {
      const arr = data.s[key];
      if (Array.isArray(arr) && arr.length >= 3) {
        stats[key] = {
          checks: arr[0],
          errors: arr[1],
          solved: arr[2] === 1
        };
      }
    }
    return { levelIndex: data.l, stats };
  } catch (e) {
    return null;
  }
}

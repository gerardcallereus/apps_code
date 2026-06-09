export type CellState = 'empty' | 'tent' | 'grass';

export interface Position {
  r: number;
  c: number;
}

export interface Puzzle {
  size: number;
  trees: Position[];
  rowClues: number[];
  colClues: number[];
  solutionTents: Position[];
}

function m32(a: number) {
  return function() {
    var t = a += 0x6D2B79F5;
    t = Math.imul(t ^ t >>> 15, t | 1);
    t ^= t + Math.imul(t ^ t >>> 7, t | 61);
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  }
}

function shuffleArray<T>(array: T[], rand: () => number) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

export function generatePuzzle(size: number, numTents: number, baseSeed: number): Puzzle {
  // Use a deterministic seed and multiple salts to guarantee a valid static level
  for (let salt = 0; salt < 1000; salt++) {
    const rand = m32(baseSeed + salt * 9876543);
    let attempts = 0;
    
    while (attempts < 1000) {
      attempts++;
      const grid = Array.from({ length: size }, () => Array(size).fill('empty'));
      const tents: Position[] = [];
      const trees: Position[] = [];
      
      let success = true;
      for (let i = 0; i < numTents; i++) {
        let placed = false;
        for (let tries = 0; tries < 50; tries++) {
          const r = Math.floor(rand() * size);
          const c = Math.floor(rand() * size);
          
          if (grid[r][c] !== 'empty') continue;
          
          let touches = false;
          for (let dr = -1; dr <= 1; dr++) {
            for (let dc = -1; dc <= 1; dc++) {
              const nr = r + dr, nc = c + dc;
              if (nr >= 0 && nr < size && nc >= 0 && nc < size) {
                if (grid[nr][nc] === 'tent') touches = true;
              }
            }
          }
          if (touches) continue;
          
          grid[r][c] = 'tent';
          tents.push({ r, c });
          placed = true;
          break;
        }
        if (!placed) {
          success = false;
          break;
        }
      }
      
      if (!success) continue;
      
      success = true;
      const shuffledTents = [...tents];
      shuffleArray(shuffledTents, rand);
      
      for (const tent of shuffledTents) {
        const dirs = [[0, 1], [1, 0], [0, -1], [-1, 0]];
        shuffleArray(dirs, rand);
        
        let placedTree = false;
        for (const [dr, dc] of dirs) {
          const nr = tent.r + dr;
          const nc = tent.c + dc;
          if (nr >= 0 && nr < size && nc >= 0 && nc < size && grid[nr][nc] === 'empty') {
            grid[nr][nc] = 'tree';
            trees.push({ r: nr, c: nc });
            placedTree = true;
            break;
          }
        }
        if (!placedTree) {
          success = false;
          break;
        }
      }
      
      if (success) {
        const rowClues = new Array(size).fill(0);
        const colClues = new Array(size).fill(0);
        for (const tent of tents) {
          rowClues[tent.r]++;
          colClues[tent.c]++;
        }
        return { size, trees, rowClues, colClues, solutionTents: tents };
      }
    }
  }
  throw new Error("No s'ha pogut generar el trencaclosques");
}

export function checkSolution(size: number, trees: Position[], playerTents: Position[], rowClues: number[], colClues: number[]): boolean {
  if (playerTents.length !== trees.length) return false;
  
  const rCounts = new Array(size).fill(0);
  const cCounts = new Array(size).fill(0);
  for (const t of playerTents) {
    rCounts[t.r]++;
    cCounts[t.c]++;
  }
  for (let i = 0; i < size; i++) {
    if (rCounts[i] !== rowClues[i]) return false;
    if (cCounts[i] !== colClues[i]) return false;
  }
  
  for (let i = 0; i < playerTents.length; i++) {
    for (let j = i + 1; j < playerTents.length; j++) {
      const dr = Math.abs(playerTents[i].r - playerTents[j].r);
      const dc = Math.abs(playerTents[i].c - playerTents[j].c);
      if (dr <= 1 && dc <= 1) return false;
    }
  }
  
  const adj: number[][] = Array.from({ length: playerTents.length }, () => []);
  for (let i = 0; i < playerTents.length; i++) {
    for (let j = 0; j < trees.length; j++) {
      const dr = Math.abs(playerTents[i].r - trees[j].r);
      const dc = Math.abs(playerTents[i].c - trees[j].c);
      if (dr + dc === 1) {
        adj[i].push(j);
      }
    }
  }
  
  const match = new Array(trees.length).fill(-1);
  const visited = new Array(trees.length).fill(false);
  
  function dfs(u: number): boolean {
    for (const v of adj[u]) {
      if (visited[v]) continue;
      visited[v] = true;
      if (match[v] < 0 || dfs(match[v])) {
        match[v] = u;
        return true;
      }
    }
    return false;
  }
  
  let matches = 0;
  for (let i = 0; i < playerTents.length; i++) {
    visited.fill(false);
    if (dfs(i)) matches++;
  }
  
  return matches === playerTents.length;
}

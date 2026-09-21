import React, { useState, useEffect } from 'react';
import { Play, Check, Info, ArrowRight, RotateCcw, HelpCircle, Trophy, X, BarChart2, Brain, Activity, List, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { saveGame, loadGame, clearGame, LevelStat } from './storage';
import { ScoreSummary } from './components/ScoreSummary';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

type Level = {
  id: number;
  size: number;
  description: string;
  initialState: number[][];
};

const LEVELS: Level[] = [
  {
    id: 1,
    size: 3,
    description: "Nivell 1 - Regla 1: Solitud. Una cèl·lula viva amb menys de dos veïns vius mor per aïllament. Fes clic a la quadrícula per predir què passarà.",
    initialState: [
      [0, 0, 0],
      [0, 1, 0],
      [0, 0, 0],
    ]
  },
  {
    id: 2,
    size: 3,
    description: "Nivell 2 - Regla 2: Reproducció. Una cèl·lula morta amb exactament tres veïns vius reneix a la següent generació.",
    initialState: [
      [1, 1, 0],
      [1, 0, 0],
      [0, 0, 0],
    ]
  },
  {
    id: 3,
    size: 3,
    description: "Nivell 3 - Regla 3: Supervivència. Una cèl·lula viva amb dos o tres veïns vius sobreviu. Compte amb les que en tenen menys!",
    initialState: [
      [0, 1, 0],
      [0, 1, 0],
      [0, 1, 0],
    ]
  },
  {
    id: 4,
    size: 3,
    description: "Nivell 4 - Regla 4: Sobrepoblació. Una cèl·lula viva amb més de tres veïns vius mor per falta de recursos.",
    initialState: [
      [0, 1, 0],
      [1, 1, 1],
      [0, 1, 0],
    ]
  },
  {
    id: 5,
    size: 4,
    description: "Nivell 5 - El Bloc. Augmentem a 4x4. Aplica les regles a cada cèl·lula. Aquest patró es coneix com a 'naturalesa morta' (Still life).",
    initialState: [
      [0, 0, 0, 0],
      [0, 1, 1, 0],
      [0, 1, 1, 0],
      [0, 0, 0, 0],
    ]
  },
  {
    id: 6,
    size: 4,
    description: "Nivell 6 - La Banyera (Tub). Una altra figura estable. Comprova que cap cèl·lula morta tingui 3 veïns i que totes les vives en tinguin 2 o 3.",
    initialState: [
      [0, 0, 0, 0],
      [0, 1, 0, 0],
      [1, 0, 1, 0],
      [0, 1, 0, 0],
    ]
  },
  {
    id: 7,
    size: 5,
    description: "Nivell 7 - El Vaixell (Boat). Mida 5x5. S'assembla a la banyera però té una cèl·lula extra. És estable?",
    initialState: [
      [0, 0, 0, 0, 0],
      [0, 1, 1, 0, 0],
      [0, 1, 0, 1, 0],
      [0, 0, 1, 0, 0],
      [0, 0, 0, 0, 0],
    ]
  },
  {
    id: 8,
    size: 5,
    description: "Nivell 8 - El Rusc (Beehive). Una de les figures estables més comunes al Joc de la Vida.",
    initialState: [
      [0, 0, 0, 0, 0],
      [0, 0, 1, 1, 0],
      [0, 1, 0, 0, 1],
      [0, 0, 1, 1, 0],
      [0, 0, 0, 0, 0],
    ]
  },
  {
    id: 9,
    size: 6,
    description: "Nivell 9 - La Barra de Pa (Loaf). Mida 6x6. Una figura estable una mica més complexa. Revisa bé els veïns de les cèl·lules buides!",
    initialState: [
      [0, 0, 0, 0, 0, 0],
      [0, 0, 1, 1, 0, 0],
      [0, 1, 0, 0, 1, 0],
      [0, 0, 1, 0, 1, 0],
      [0, 0, 0, 1, 0, 0],
      [0, 0, 0, 0, 0, 0],
    ]
  },
  {
    id: 10,
    size: 5,
    description: "Nivell 10 - El Parpelleig (Blinker). Aquest és un oscil·lador de període 2. Què passarà amb aquesta línia horitzontal?",
    initialState: [
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
      [0, 1, 1, 1, 0],
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
    ]
  },
  {
    id: 11,
    size: 6,
    description: "Nivell 11 - El Gripau (Toad). Un altre oscil·lador. Sembla que s'hagi d'expandir, oi? Calcula amb cura.",
    initialState: [
      [0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0],
      [0, 0, 1, 1, 1, 0],
      [0, 1, 1, 1, 0, 0],
      [0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0],
    ]
  },
  {
    id: 12,
    size: 6,
    description: "Nivell 12 - El Far (Beacon). Dos blocs que interactuen diagonalment. Quines cèl·lules naixeran o moriran?",
    initialState: [
      [0, 0, 0, 0, 0, 0],
      [0, 1, 1, 0, 0, 0],
      [0, 1, 1, 0, 0, 0],
      [0, 0, 0, 1, 1, 0],
      [0, 0, 0, 1, 1, 0],
      [0, 0, 0, 0, 0, 0],
    ]
  },
  {
    id: 13,
    size: 6,
    description: "Nivell 13 - El Planador (Glider) Fase 1. Aquesta és la nau espacial més famosa. Es mou per la quadrícula. Cap a on anirà?",
    initialState: [
      [0, 0, 0, 0, 0, 0],
      [0, 0, 1, 0, 0, 0],
      [0, 0, 0, 1, 0, 0],
      [0, 1, 1, 1, 0, 0],
      [0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0],
    ]
  },
  {
    id: 14,
    size: 6,
    description: "Nivell 14 - El Planador Fase 2. Aquesta és la continuació del nivell anterior. Dedueix el següent pas del seu moviment.",
    initialState: [
      [0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0],
      [0, 1, 0, 1, 0, 0],
      [0, 0, 1, 1, 0, 0],
      [0, 0, 1, 0, 0, 0],
      [0, 0, 0, 0, 0, 0],
    ]
  },
  {
    id: 15,
    size: 6,
    description: "Nivell 15 - El Planador Fase 3. Ja gairebé ho tens! Com continua el cicle de moviment?",
    initialState: [
      [0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0],
      [0, 0, 0, 1, 0, 0],
      [0, 1, 0, 1, 0, 0],
      [0, 0, 1, 1, 0, 0],
      [0, 0, 0, 0, 0, 0],
    ]
  },
  {
    id: 16,
    size: 6,
    description: "Nivell 16 - El Planador Fase 4. L'últim pas abans de tornar a la seva forma original però desplaçat. Completa el cicle!",
    initialState: [
      [0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0],
      [0, 0, 1, 0, 0, 0],
      [0, 0, 0, 1, 1, 0],
      [0, 0, 1, 1, 0, 0],
      [0, 0, 0, 0, 0, 0],
    ]
  },
  {
    id: 17,
    size: 7,
    description: "Nivell 17 - Línia de 4. Què passa quan tenim 4 cèl·lules en línia? Compte amb les cèl·lules del mig i els extrems.",
    initialState: [
      [0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0],
      [0, 1, 1, 1, 1, 0, 0],
      [0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0],
    ]
  },
  {
    id: 18,
    size: 7,
    description: "Nivell 18 - Interacció. Un Bloc i un Parpelleig estan molt a prop. La seva proximitat alterarà el seu comportament normal?",
    initialState: [
      [0, 0, 0, 0, 0, 0, 0],
      [0, 1, 1, 0, 0, 0, 0],
      [0, 1, 1, 0, 0, 0, 0],
      [0, 0, 0, 0, 1, 0, 0],
      [0, 0, 0, 0, 1, 0, 0],
      [0, 0, 0, 0, 1, 0, 0],
      [0, 0, 0, 0, 0, 0, 0],
    ]
  },
  {
    id: 19,
    size: 7,
    description: "Nivell 19 - El R-pentòmino. Aquest petit patró genera una reacció caòtica que dura molt de temps. Quina serà la seva primera transformació?",
    initialState: [
      [0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 1, 1, 0, 0],
      [0, 0, 1, 1, 0, 0, 0],
      [0, 0, 0, 1, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0],
    ]
  },
  {
    id: 20,
    size: 8,
    description: "Nivell 20 - Col·lisió Imminent! Un Planador s'acosta perillosament a un Bloc. Calcula amb precisió l'impacte en aquesta quadrícula de 8x8. Sort!",
    initialState: [
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 1, 0, 0, 0, 0, 0],
      [0, 0, 0, 1, 0, 0, 0, 0],
      [0, 1, 1, 1, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 1, 1, 0],
      [0, 0, 0, 0, 0, 1, 1, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
    ]
  }
];

function getNextGeneration(grid: number[][]): number[][] {
  const rows = grid.length;
  const cols = grid[0].length;
  const nextGrid = Array(rows).fill(0).map(() => Array(cols).fill(0));

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      let liveNeighbors = 0;
      for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
          if (i === 0 && j === 0) continue;
          const nr = r + i;
          const nc = c + j;
          if (nr >= 0 && nr < rows && nc >= 0 && nc < cols) {
            liveNeighbors += grid[nr][nc];
          }
        }
      }

      if (grid[r][c] === 1) {
        if (liveNeighbors < 2 || liveNeighbors > 3) {
          nextGrid[r][c] = 0;
        } else {
          nextGrid[r][c] = 1;
        }
      } else {
        if (liveNeighbors === 3) {
          nextGrid[r][c] = 1;
        }
      }
    }
  }
  return nextGrid;
}

export default function App() {
  const [currentLevelIndex, setCurrentLevelIndex] = useState(0);

  const getCellSizeClass = (size: number) => {
    if (size <= 4) return "w-12 h-12 sm:w-16 sm:h-16";
    if (size <= 6) return "w-10 h-10 sm:w-12 sm:h-12";
    return "w-8 h-8 sm:w-10 sm:h-10";
  };
  const [playerGrid, setPlayerGrid] = useState<number[][]>([]);
  const [gameState, setGameState] = useState<'intro' | 'video' | 'playing' | 'checked' | 'completed'>('intro');
  const [showRules, setShowRules] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const [showError, setShowError] = useState(false);
  const [totalChecks, setTotalChecks] = useState(0);
  const [totalErrors, setTotalErrors] = useState(0);
  const [levelStats, setLevelStats] = useState<Record<number, LevelStat>>({});
  const [hasSavedProgress, setHasSavedProgress] = useState(false);
  const [savedLevelNum, setSavedLevelNum] = useState(1);

  const level = LEVELS[currentLevelIndex];
  const expectedGrid = getNextGeneration(level.initialState);

  // Carregar partida de localStorage en iniciar
  useEffect(() => {
    const saved = loadGame();
    if (saved) {
      const savedLevel = Math.min(Math.max(0, saved.currentLevelIndex), LEVELS.length - 1);
      const checks = saved.totalChecks || 0;
      const errors = saved.totalErrors || 0;
      const stats = saved.levelStats || {};
      
      setCurrentLevelIndex(savedLevel);
      setTotalChecks(checks);
      setTotalErrors(errors);
      setLevelStats(stats);
      setHasSavedProgress(true);
      setSavedLevelNum(savedLevel + 1);

      if (saved.gameState === 'completed') {
        setGameState('completed');
      }
    }
  }, []);

  useEffect(() => {
    // Initialize player grid with empty cells
    setPlayerGrid(Array(level.size).fill(0).map(() => Array(level.size).fill(0)));
    setGameState(prev => (prev === 'intro' || prev === 'video') ? prev : 'playing');
  }, [currentLevelIndex, level.size]);

  const handleResetAll = () => {
    clearGame();
    setCurrentLevelIndex(0);
    setTotalChecks(0);
    setTotalErrors(0);
    setLevelStats({});
    setHasSavedProgress(false);
    setSavedLevelNum(1);
    setGameState('intro');
    setShowSummary(false);
  };

  const toggleCell = (r: number, c: number) => {
    if (gameState !== 'playing') return;
    const newGrid = [...playerGrid];
    newGrid[r] = [...newGrid[r]];
    newGrid[r][c] = newGrid[r][c] === 1 ? 0 : 1;
    setPlayerGrid(newGrid);
  };

  const checkAnswer = () => {
    const isCorrect = JSON.stringify(playerGrid) === JSON.stringify(expectedGrid);
    const newTotalChecks = totalChecks + 1;
    const newTotalErrors = totalErrors + (isCorrect ? 0 : 1);
    setTotalChecks(newTotalChecks);
    setTotalErrors(newTotalErrors);
    
    const cur = levelStats[level.id] || { checks: 0, errors: 0, solved: false };
    const updatedStats: Record<number, LevelStat> = {
      ...levelStats,
      [level.id]: {
        checks: cur.checks + 1,
        errors: cur.errors + (isCorrect ? 0 : 1),
        solved: cur.solved || isCorrect,
      }
    };
    setLevelStats(updatedStats);

    // Guardat automàtic immediat
    saveGame(currentLevelIndex, newTotalChecks, newTotalErrors, updatedStats, 'playing');
    setHasSavedProgress(true);
    setSavedLevelNum(currentLevelIndex + 1);

    if (isCorrect) {
      setGameState('checked');
      setShowError(false);
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#10b981', '#3b82f6', '#f59e0b']
      });
    } else {
      setShowError(true);
      setTimeout(() => setShowError(false), 3000);
    }
  };

  const nextLevel = () => {
    if (currentLevelIndex < LEVELS.length - 1) {
      const nextIdx = currentLevelIndex + 1;
      setCurrentLevelIndex(nextIdx);
      setSavedLevelNum(nextIdx + 1);
      saveGame(nextIdx, totalChecks, totalErrors, levelStats, 'playing');
    } else {
      setGameState('completed');
      saveGame(currentLevelIndex, totalChecks, totalErrors, levelStats, 'completed');
      confetti({
        particleCount: 300,
        spread: 100,
        origin: { y: 0.5 },
        colors: ['#10b981', '#3b82f6', '#f59e0b', '#ec4899', '#8b5cf6']
      });
    }
  };

  const resetLevel = () => {
    setPlayerGrid(Array(level.size).fill(0).map(() => Array(level.size).fill(0)));
    setGameState('playing');
  };

  const isCorrect = gameState === 'checked' && JSON.stringify(playerGrid) === JSON.stringify(expectedGrid);

  if (gameState === 'intro') {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 md:p-8 font-sans">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl w-full bg-white rounded-3xl shadow-2xl overflow-hidden"
        >
          <div className="bg-slate-900 p-8 md:p-12 text-center relative overflow-hidden">
            <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(#3b82f6 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>
            <div className="relative z-10">
              <div className="w-20 h-20 bg-blue-600 rounded-2xl mx-auto mb-6 flex items-center justify-center shadow-lg shadow-blue-500/30">
                <Brain className="w-10 h-10 text-white" />
              </div>
              <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4 tracking-tight">Conway's Logic</h1>
              <p className="text-lg md:text-xl text-blue-100 max-w-2xl mx-auto">
                Un viatge interactiu per aprendre algorismia i lògica a través del fascinant Joc de la Vida.
              </p>
            </div>
          </div>

          <div className="p-8 md:p-12">
            <div className="grid md:grid-cols-2 gap-12">
              <div>
                <h2 className="text-2xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                  <Info className="w-6 h-6 text-blue-600" />
                  Objectiu del Joc
                </h2>
                <p className="text-slate-600 leading-relaxed mb-6">
                  A cada nivell se't presentarà un escenari inicial amb cèl·lules vives (verdes) i mortes (buides). 
                  La teva missió és <strong>deduir i dibuixar</strong> quin serà l'estat exacte de la quadrícula a la següent generació, aplicant 4 regles simples.
                </p>
                
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex gap-4 items-start">
                  <Activity className="w-6 h-6 text-amber-600 shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-amber-900 mb-1">Avaluació contínua</h3>
                    <p className="text-amber-800 text-sm">
                      El professorat té accés a un panell de control que registra tots els teus intents i errors per cada nivell. Pensa bé abans de comprovar!
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                  <List className="w-6 h-6 text-blue-600" />
                  Les 4 Regles Bàsiques
                </h2>
                <ul className="space-y-4">
                  <li className="flex gap-3 items-start">
                    <div className="w-6 h-6 rounded bg-red-100 text-red-600 flex items-center justify-center font-bold shrink-0 text-sm mt-0.5">1</div>
                    <p className="text-slate-600 text-sm"><strong className="text-slate-800">Solitud:</strong> Viva amb menys de 2 veïns vius, mor.</p>
                  </li>
                  <li className="flex gap-3 items-start">
                    <div className="w-6 h-6 rounded bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold shrink-0 text-sm mt-0.5">2</div>
                    <p className="text-slate-600 text-sm"><strong className="text-slate-800">Supervivència:</strong> Viva amb 2 o 3 veïns vius, sobreviu.</p>
                  </li>
                  <li className="flex gap-3 items-start">
                    <div className="w-6 h-6 rounded bg-red-100 text-red-600 flex items-center justify-center font-bold shrink-0 text-sm mt-0.5">3</div>
                    <p className="text-slate-600 text-sm"><strong className="text-slate-800">Sobrepoblació:</strong> Viva amb més de 3 veïns vius, mor.</p>
                  </li>
                  <li className="flex gap-3 items-start">
                    <div className="w-6 h-6 rounded bg-blue-100 text-blue-600 flex items-center justify-center font-bold shrink-0 text-sm mt-0.5">4</div>
                    <p className="text-slate-600 text-sm"><strong className="text-slate-800">Reproducció:</strong> Morta amb exactament 3 veïns vius, reneix.</p>
                  </li>
                </ul>
              </div>
            </div>

            <div className="mt-12 text-center">
              {hasSavedProgress && (Object.values(levelStats).length > 0 || currentLevelIndex > 0) ? (
                <div className="max-w-md mx-auto bg-blue-50/80 border border-blue-200 rounded-2xl p-6 text-center shadow-sm">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-semibold mb-3">
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" /> Partida desada trobada
                  </div>
                  <h3 className="text-lg font-bold text-slate-800">Vols continuar des d'on ho vas deixar?</h3>
                  <p className="text-sm text-slate-600 mt-1 mb-5">
                    Nivell actual: <strong>Nivell {savedLevelNum}</strong> de {LEVELS.length} ({(Object.values(levelStats) as LevelStat[]).filter(s => s.solved).length} superats).
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <button
                      onClick={() => setGameState(gameState === 'completed' ? 'completed' : 'playing')}
                      className="py-3 px-6 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Play className="w-4 h-4 fill-current" />
                      Continuar Nivell {savedLevelNum}
                    </button>
                    <button
                      onClick={() => setShowSummary(true)}
                      className="py-3 px-4 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-xl font-medium text-sm transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <BarChart2 className="w-4 h-4 text-blue-600" />
                      Veure Nota i Resum
                    </button>
                  </div>
                  <div className="mt-4 pt-4 border-t border-blue-100">
                    <button
                      onClick={handleResetAll}
                      className="text-xs text-slate-500 hover:text-red-600 font-medium transition-colors cursor-pointer"
                    >
                      Començar una nova partida des de zero
                    </button>
                  </div>
                </div>
              ) : (
                <button 
                  onClick={() => setGameState('video')}
                  className="py-4 px-10 bg-blue-600 hover:bg-blue-700 text-white rounded-full font-bold text-lg shadow-lg shadow-blue-600/30 hover:shadow-blue-600/50 hover:-translate-y-1 transition-all flex items-center gap-2 mx-auto cursor-pointer"
                >
                  <Play className="w-5 h-5 fill-current" />
                  Començar l'Aventura
                </button>
              )}

              <div className="mt-6 flex items-center justify-center gap-2 text-xs text-slate-500">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>El teu progrés i intents es guarden automàticament al teu navegador.</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  if (gameState === 'video') {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 md:p-8 font-sans">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-4xl w-full bg-white rounded-3xl shadow-2xl overflow-hidden p-8 md:p-12"
        >
          <h2 className="text-3xl font-bold text-slate-800 mb-6 text-center">Abans de començar...</h2>
          <p className="text-lg text-slate-600 mb-8 text-center">
            Mira aquest breu vídeo per entendre millor la màgia darrere del Joc de la Vida de Conway.
          </p>
          
          <div className="relative w-full aspect-video rounded-xl overflow-hidden shadow-lg mb-10 bg-slate-900">
            <iframe 
              className="absolute top-0 left-0 w-full h-full"
              src="https://www.youtube.com/embed/OWXD_wJxCKQ" 
              title="YouTube video player" 
              frameBorder="0" 
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
              referrerPolicy="strict-origin-when-cross-origin" 
              allowFullScreen
            ></iframe>
          </div>

          <div className="text-center">
            <button 
              onClick={() => setGameState('playing')}
              className="py-4 px-10 bg-blue-600 hover:bg-blue-700 text-white rounded-full font-bold text-lg shadow-lg shadow-blue-600/30 hover:shadow-blue-600/50 hover:-translate-y-1 transition-all flex items-center gap-2 mx-auto"
            >
              <Play className="w-5 h-5 fill-current" />
              Anar al Nivell 1
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  if (gameState === 'completed') {
    return (
      <div className="min-h-screen bg-slate-50 py-10 px-4 font-sans text-slate-800">
        <div className="max-w-4xl mx-auto">
          {/* Capçalera d'enhorabona */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white p-8 rounded-3xl shadow-xl border border-slate-200 mb-8 text-center"
          >
            <Trophy className="w-16 h-16 sm:w-20 sm:h-20 text-yellow-500 mx-auto mb-4" />
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-2">Enhorabona!</h1>
            <p className="text-slate-600 max-w-2xl mx-auto">
              Has completat tots els nivells i has après les regles del Joc de la Vida de Conway.
              A continuació pots consultar la teva <strong>nota final</strong> i el desglossament d'intents per cada nivell.
            </p>
          </motion.div>

          {/* Resum complet amb la nota i detall */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <ScoreSummary
              totalLevels={LEVELS.length}
              levelStats={levelStats}
              currentLevelIndex={LEVELS.length}
              totalChecks={totalChecks}
              totalErrors={totalErrors}
              isCompleted={true}
              onResetProgress={handleResetAll}
              levelNames={LEVELS.map(l => l.description.split('-')[0].trim() || `Nivell ${l.id}`)}
            />
          </motion.div>

          <div className="mt-8 flex justify-center">
            <button
              onClick={() => {
                setCurrentLevelIndex(0);
                setGameState('playing');
              }}
              className="py-3 px-6 bg-slate-800 hover:bg-slate-900 text-white rounded-xl font-medium transition-colors flex items-center gap-2 cursor-pointer shadow"
            >
              <RotateCcw className="w-5 h-5" />
              Revisar els nivells
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-800">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
            <div className="w-5 h-5 bg-blue-600 rounded-sm grid grid-cols-2 gap-0.5 p-0.5">
              <div className="bg-white rounded-sm"></div>
              <div className="bg-white rounded-sm"></div>
              <div className="bg-white rounded-sm"></div>
              <div className="bg-blue-600 rounded-sm"></div>
            </div>
          </div>
          <div>
            <h1 className="text-xl font-bold leading-tight">Conway's Logic</h1>
            <p className="text-sm text-slate-500 font-medium">Nivell {level.id} de {LEVELS.length}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setShowSummary(true)}
            className="p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
            aria-label="Veure resum"
            title="Resum del professor"
          >
            <BarChart2 className="w-6 h-6" />
          </button>
          <button 
            onClick={() => setShowRules(true)}
            className="p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
            aria-label="Veure regles"
          >
            <HelpCircle className="w-6 h-6" />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-5xl w-full mx-auto p-6 flex flex-col">
        
        {/* Level Description */}
        <div className="bg-blue-50 border border-blue-100 rounded-xl p-5 mb-8 flex gap-4 items-start">
          <Info className="w-6 h-6 text-blue-600 shrink-0 mt-0.5" />
          <p className="text-blue-900 text-lg leading-relaxed">{level.description}</p>
        </div>

        {/* Grids Container */}
        <div className="flex flex-col md:flex-row gap-8 md:gap-12 items-center justify-center flex-1">
          
          {/* Initial State */}
          <div className="flex flex-col items-center">
            <h2 className="text-lg font-semibold text-slate-600 mb-4">Estat Inicial</h2>
            <div 
              className="bg-white p-2 rounded-xl shadow-sm border border-slate-200 grid gap-1"
              style={{ gridTemplateColumns: `repeat(${level.size}, minmax(0, 1fr))` }}
            >
              {level.initialState.map((row, r) => 
                row.map((cell, c) => (
                  <div 
                    key={`initial-${r}-${c}`}
                    className={cn(
                      getCellSizeClass(level.size),
                      "rounded-md transition-colors duration-300",
                      cell === 1 ? "bg-emerald-500 shadow-inner" : "bg-slate-100"
                    )}
                  />
                ))
              )}
            </div>
          </div>

          {/* Arrow */}
          <div className="hidden md:flex items-center justify-center text-slate-300">
            <ArrowRight className="w-10 h-10" />
          </div>
          <div className="md:hidden flex items-center justify-center text-slate-300 transform rotate-90">
            <ArrowRight className="w-10 h-10" />
          </div>

          {/* Player Prediction */}
          <div className="flex flex-col items-center">
            <h2 className="text-lg font-semibold text-slate-600 mb-4">La teva predicció</h2>
            <div 
              className={cn(
                "bg-white p-2 rounded-xl shadow-sm border-2 grid gap-1 transition-colors duration-300",
                gameState === 'playing' ? "border-blue-200" :
                isCorrect ? "border-emerald-400 bg-emerald-50" : "border-red-400 bg-red-50"
              )}
              style={{ gridTemplateColumns: `repeat(${level.size}, minmax(0, 1fr))` }}
            >
              {playerGrid.map((row, r) => 
                row.map((cell, c) => {
                  const isExpectedLive = expectedGrid[r]?.[c] === 1;
                  const isPlayerLive = cell === 1;
                  
                  let cellClass = "bg-slate-100 hover:bg-slate-200 cursor-pointer";
                  
                  if (gameState === 'playing') {
                    if (isPlayerLive) cellClass = "bg-blue-500 shadow-inner hover:bg-blue-600 cursor-pointer";
                  } else {
                    // Checked state
                    if (isPlayerLive && isExpectedLive) cellClass = "bg-emerald-500 shadow-inner"; // Correctly alive
                    else if (!isPlayerLive && !isExpectedLive) cellClass = "bg-slate-100"; // Correctly dead
                    else if (isPlayerLive && !isExpectedLive) cellClass = "bg-red-500 shadow-inner"; // Incorrectly alive
                    else if (!isPlayerLive && isExpectedLive) cellClass = "bg-emerald-200 border-2 border-emerald-500 border-dashed"; // Missed alive
                  }

                  return (
                    <motion.button
                      key={`player-${r}-${c}`}
                      whileTap={gameState === 'playing' ? { scale: 0.9 } : {}}
                      onClick={() => toggleCell(r, c)}
                      disabled={gameState !== 'playing'}
                      className={cn(
                        getCellSizeClass(level.size),
                        "rounded-md transition-colors duration-200 flex items-center justify-center",
                        cellClass
                      )}
                      aria-label={`Toggle cell ${r}, ${c}`}
                    >
                      {gameState === 'checked' && !isPlayerLive && isExpectedLive && (
                        <div className="w-3 h-3 bg-emerald-500 rounded-full opacity-50" />
                      )}
                      {gameState === 'checked' && isPlayerLive && !isExpectedLive && (
                        <X className="w-6 h-6 text-white opacity-80" />
                      )}
                    </motion.button>
                  );
                })
              )}
            </div>
          </div>

        </div>

        {/* Actions */}
        <div className="mt-12 flex flex-col items-center gap-4">
          <AnimatePresence mode="wait">
            {gameState === 'playing' ? (
              <motion.div
                key="playing-actions"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex flex-col items-center gap-4"
              >
                <button
                  onClick={checkAnswer}
                  className="py-3 px-8 bg-blue-600 hover:bg-blue-700 text-white rounded-full font-semibold text-lg shadow-md hover:shadow-lg transition-all flex items-center gap-2"
                >
                  <Check className="w-5 h-5" />
                  Comprovar
                </button>
                
                <AnimatePresence>
                  {showError && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, height: 0 }}
                      animate={{ opacity: 1, y: 0, height: 'auto' }}
                      exit={{ opacity: 0, y: -10, height: 0 }}
                      className="text-red-600 font-medium bg-red-50 px-4 py-2 rounded-lg flex items-center gap-2 border border-red-100"
                    >
                      <X className="w-5 h-5" />
                      Incorrecte. Revisa les regles i torna-ho a intentar!
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ) : (
              <motion.div
                key="result"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex flex-col items-center gap-4"
              >
                <div className="px-6 py-2 rounded-full font-bold text-lg flex items-center gap-2 bg-emerald-100 text-emerald-700">
                  <Check className="w-5 h-5" />
                  Correcte!
                </div>
                
                <div className="flex gap-3">
                  <button
                    onClick={resetLevel}
                    className="py-3 px-6 bg-white border-2 border-slate-200 hover:border-slate-300 text-slate-700 rounded-full font-medium transition-colors flex items-center gap-2"
                  >
                    <RotateCcw className="w-5 h-5" />
                    Reintentar el mateix nivell
                  </button>
                  <button
                    onClick={nextLevel}
                    className="py-3 px-6 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full font-semibold shadow-md hover:shadow-lg transition-all flex items-center gap-2"
                  >
                    Següent Nivell
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </div>

                <div className="mt-6 flex items-center justify-center gap-2 text-xs text-emerald-700 bg-emerald-50 px-4 py-2 rounded-full border border-emerald-200 shadow-sm">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Progrés desat automàticament al teu navegador</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* Rules Modal */}
      <AnimatePresence>
        {showRules && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden"
            >
              <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                  <HelpCircle className="w-5 h-5 text-blue-600" />
                  Regles del Joc de la Vida
                </h2>
                <button 
                  onClick={() => setShowRules(false)}
                  className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-full transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-6 space-y-4 text-slate-600">
                <p>El Joc de la Vida és un autòmat cel·lular dissenyat pel matemàtic John Horton Conway. L'evolució de l'estat inicial està determinada per unes regles simples:</p>
                <ul className="space-y-3 list-none">
                  <li className="flex gap-3">
                    <div className="w-6 h-6 rounded bg-red-100 text-red-600 flex items-center justify-center font-bold shrink-0">1</div>
                    <p><strong>Solitud:</strong> Una cèl·lula viva amb menys de dos veïns vius mor.</p>
                  </li>
                  <li className="flex gap-3">
                    <div className="w-6 h-6 rounded bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold shrink-0">2</div>
                    <p><strong>Supervivència:</strong> Una cèl·lula viva amb dos o tres veïns vius segueix viva a la següent generació.</p>
                  </li>
                  <li className="flex gap-3">
                    <div className="w-6 h-6 rounded bg-red-100 text-red-600 flex items-center justify-center font-bold shrink-0">3</div>
                    <p><strong>Sobrepoblació:</strong> Una cèl·lula viva amb més de tres veïns vius mor.</p>
                  </li>
                  <li className="flex gap-3">
                    <div className="w-6 h-6 rounded bg-blue-100 text-blue-600 flex items-center justify-center font-bold shrink-0">4</div>
                    <p><strong>Reproducció:</strong> Una cèl·lula morta amb exactament tres veïns vius es converteix en una cèl·lula viva.</p>
                  </li>
                </ul>
                <div className="mt-6 p-4 bg-blue-50 rounded-lg text-sm text-blue-800">
                  <strong>Objectiu:</strong> Observa l'estat inicial i aplica aquestes regles mentalment per deduir quines cèl·lules estaran vives a la següent generació. Fes clic a la quadrícula de la dreta per marcar-les.
                </div>
              </div>
              <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end">
                <button 
                  onClick={() => setShowRules(false)}
                  className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
                >
                  Entès
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Summary Modal */}
      <AnimatePresence>
        {showSummary && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden"
            >
              <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50 shrink-0">
                <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                  <BarChart2 className="w-5 h-5 text-blue-600" />
                  Tauler de Resum i Qualificació
                </h2>
                <button 
                  onClick={() => setShowSummary(false)}
                  className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-full transition-colors cursor-pointer"
                  aria-label="Tancar"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="p-6 overflow-y-auto flex-1 bg-slate-50/50">
                <ScoreSummary
                  totalLevels={LEVELS.length}
                  levelStats={levelStats}
                  currentLevelIndex={currentLevelIndex}
                  totalChecks={totalChecks}
                  totalErrors={totalErrors}
                  isCompleted={gameState === 'completed'}
                  onResetProgress={handleResetAll}
                  levelNames={LEVELS.map(l => l.description.split('-')[0].trim() || `Nivell ${l.id}`)}
                />
              </div>
              
              <div className="px-6 py-4 bg-white border-t border-slate-100 flex justify-end shrink-0">
                <button 
                  onClick={() => setShowSummary(false)}
                  className="px-6 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-lg font-medium transition-colors cursor-pointer"
                >
                  Tancar Tauler
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

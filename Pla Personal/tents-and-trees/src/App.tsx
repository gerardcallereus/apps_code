import React, { useState, useEffect, useCallback } from 'react';
import { generatePuzzle, checkSolution, Puzzle, CellState, Position } from './lib/puzzle';
import { Grid } from './components/Grid';
import { IntroScreen } from './components/IntroScreen';
import { SummaryScreen } from './components/SummaryScreen';
import { RulesModal } from './components/RulesModal';
import { Tent, Trophy, ArrowRight, RefreshCw, BarChart3, CheckCircle2, AlertCircle, Info, Copy, Check } from 'lucide-react';
import confetti from 'canvas-confetti';
import { motion, AnimatePresence } from 'motion/react';
import { encodeSaveData } from './lib/saveCode';

const LEVELS = [
  { size: 5, tents: 3 },
  { size: 5, tents: 4 },
  { size: 5, tents: 5 },
  { size: 6, tents: 5 },
  { size: 6, tents: 6 },
  { size: 6, tents: 7 },
  { size: 6, tents: 8 },
  { size: 7, tents: 7 },
  { size: 7, tents: 8 },
  { size: 7, tents: 9 },
  { size: 7, tents: 10 },
  { size: 8, tents: 9 },
  { size: 8, tents: 10 },
  { size: 8, tents: 11 },
  { size: 8, tents: 12 },
  { size: 9, tents: 12 },
  { size: 9, tents: 14 },
  { size: 10, tents: 14 },
  { size: 10, tents: 16 },
  { size: 10, tents: 18 },
];

export interface LevelStats {
  checks: number;
  errors: number;
  solved: boolean;
}

export type GameStats = Record<number, LevelStats>;

export default function App() {
  const [gameState, setGameState] = useState<'intro' | 'playing' | 'summary'>('intro');
  const [levelIndex, setLevelIndex] = useState(0);
  const [loadedLevel, setLoadedLevel] = useState<number | null>(null);
  const [puzzle, setPuzzle] = useState<Puzzle | null>(null);
  const [gridState, setGridState] = useState<CellState[][]>([]);
  const [isSolved, setIsSolved] = useState(false);
  const [stats, setStats] = useState<GameStats>({});
  const [feedback, setFeedback] = useState<'error' | null>(null);
  const [showRules, setShowRules] = useState(false);
  const [copied, setCopied] = useState(false);

  const loadLevel = useCallback((index: number) => {
    const config = LEVELS[index];
    if (!config) return;
    
    try {
      // Create static puzzles using index + 100 as the deterministic seed for generation
      const newPuzzle = generatePuzzle(config.size, config.tents, index + 100);
      setPuzzle(newPuzzle);
      setGridState(Array.from({ length: config.size }, () => Array(config.size).fill('empty')));
      setIsSolved(false);
      setFeedback(null);
      setLoadedLevel(index);
    } catch (e) {
      console.error(e);
      // Retry if generation fails
      setTimeout(() => loadLevel(index), 100);
    }
  }, []);

  useEffect(() => {
    if (loadedLevel !== levelIndex) {
      loadLevel(levelIndex);
    }
  }, [levelIndex, loadedLevel, loadLevel]);

  const handleCheck = () => {
    if (!puzzle || isSolved) return;

    const playerTents: Position[] = [];
    let hasTouchingTents = false;

    for (let r = 0; r < puzzle.size; r++) {
      for (let c = 0; c < puzzle.size; c++) {
        if (gridState[r][c] === 'tent') {
          playerTents.push({ r, c });
        }
      }
    }

    // Check for touching tents
    for (let i = 0; i < playerTents.length; i++) {
      for (let j = i + 1; j < playerTents.length; j++) {
        const dr = Math.abs(playerTents[i].r - playerTents[j].r);
        const dc = Math.abs(playerTents[i].c - playerTents[j].c);
        if (dr <= 1 && dc <= 1) {
          hasTouchingTents = true;
        }
      }
    }

    const solved = !hasTouchingTents && checkSolution(
      puzzle.size,
      puzzle.trees,
      playerTents,
      puzzle.rowClues,
      puzzle.colClues
    );

    setStats(prev => {
      const currentStats = prev[levelIndex] || { checks: 0, errors: 0, solved: false };
      return {
        ...prev,
        [levelIndex]: {
          ...currentStats,
          checks: currentStats.checks + 1,
          errors: currentStats.errors + (solved ? 0 : 1),
          solved: solved || currentStats.solved
        }
      };
    });

    if (solved) {
      setIsSolved(true);
      setFeedback(null);
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    } else {
      setFeedback('error');
      setTimeout(() => setFeedback(null), 4000);
    }
  };

  const handleCellClick = (r: number, c: number) => {
    if (isSolved || !puzzle) return;

    setGridState(prev => {
      const newState = prev.map(row => [...row]);
      const current = newState[r][c];
      
      if (current === 'empty') newState[r][c] = 'tent';
      else if (current === 'tent') newState[r][c] = 'grass';
      else newState[r][c] = 'empty';
      
      return newState;
    });
  };

  const handleCellRightClick = (e: React.MouseEvent, r: number, c: number) => {
    e.preventDefault();
    if (isSolved || !puzzle) return;

    setGridState(prev => {
      const newState = prev.map(row => [...row]);
      const current = newState[r][c];
      
      if (current === 'grass') newState[r][c] = 'empty';
      else newState[r][c] = 'grass';
      
      return newState;
    });
  };

  const handleNextLevel = () => {
    if (levelIndex < LEVELS.length - 1) {
      setLevelIndex(prev => prev + 1);
    }
  };

  const handleRestart = () => {
    loadLevel(levelIndex);
  };

  const handleRestore = (restoredLevel: number, restoredStats: GameStats) => {
    setStats(restoredStats);
    setLevelIndex(restoredLevel);
    setGameState('playing');
  };

  const handleCopyCode = () => {
    const nextLevelIndex = levelIndex < LEVELS.length - 1 ? levelIndex + 1 : levelIndex;
    const saveCode = encodeSaveData(nextLevelIndex, stats);
    navigator.clipboard.writeText(saveCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (gameState === 'intro') {
    return <IntroScreen onStart={() => setGameState('playing')} onRestore={handleRestore} />;
  }

  if (gameState === 'summary') {
    return <SummaryScreen stats={stats} totalLevels={LEVELS.length} onBack={() => setGameState('playing')} />;
  }

  if (!puzzle) {
    return <div className="min-h-screen flex items-center justify-center">Carregant...</div>;
  }

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 font-sans pb-12">
      <RulesModal isOpen={showRules} onClose={() => setShowRules(false)} />
      
      <header className="bg-white shadow-sm border-b border-stone-200 py-4 mb-8">
        <div className="max-w-4xl mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-orange-100 p-2 rounded-lg">
              <Tent className="w-6 h-6 text-orange-600" />
            </div>
            <h1 className="text-2xl font-bold text-stone-800 tracking-tight hidden sm:block">Tents & Trees</h1>
          </div>
          <div className="flex items-center gap-2 sm:gap-4">
            <div className="text-sm font-medium text-stone-500 bg-stone-100 px-3 py-1 rounded-full">
              Nivell {levelIndex + 1} de {LEVELS.length}
            </div>
            <button 
              onClick={() => setShowRules(true)}
              className="p-2 text-blue-500 hover:text-blue-700 hover:bg-blue-50 rounded-full transition-colors"
              title="Veure regles"
            >
              <Info className="w-5 h-5" />
            </button>
            <button 
              onClick={handleRestart}
              className="p-2 text-stone-500 hover:text-stone-800 hover:bg-stone-100 rounded-full transition-colors"
              title="Reiniciar nivell"
            >
              <RefreshCw className="w-5 h-5" />
            </button>
            <button 
              onClick={() => setGameState('summary')}
              className="flex items-center gap-2 bg-purple-100 hover:bg-purple-200 text-purple-800 text-sm font-bold py-1.5 px-3 rounded-xl transition-colors"
              title="Resum per al Professorat"
            >
              <BarChart3 className="w-4 h-4" />
              <span className="hidden sm:inline">Resum Professor</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4">
        <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-stone-200 relative overflow-hidden">
          <Grid 
            size={puzzle.size}
            trees={puzzle.trees}
            gridState={gridState}
            rowClues={puzzle.rowClues}
            colClues={puzzle.colClues}
            onCellClick={handleCellClick}
            onCellRightClick={handleCellRightClick}
          />

          <div className="mt-8 flex flex-col items-center gap-4">
            <button
              onClick={handleCheck}
              disabled={isSolved}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-stone-300 disabled:cursor-not-allowed text-white font-bold py-3 px-8 rounded-xl shadow-md hover:shadow-lg transition-all flex items-center gap-2 text-lg"
            >
              <CheckCircle2 className="w-6 h-6" />
              Comprova si és correcte
            </button>

            <AnimatePresence>
              {feedback === 'error' && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="flex items-center gap-2 text-red-600 bg-red-50 py-2 px-4 rounded-lg font-medium"
                >
                  <AlertCircle className="w-5 h-5" />
                  Hi ha algun error. Revisa les regles i torna-ho a intentar!
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <AnimatePresence>
            {isSolved && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute inset-0 bg-white/90 backdrop-blur-[2px] flex flex-col items-center justify-center z-10 p-4"
              >
                <div className="bg-white px-8 pt-8 pb-6 rounded-2xl shadow-2xl border border-stone-200 text-center w-full max-w-sm mx-auto">
                  <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Trophy className="w-8 h-8" />
                  </div>
                  <h2 className="text-2xl font-bold text-stone-800 mb-2">Molt bé!</h2>
                  <p className="text-stone-600 mb-6">
                    Has resolt el trencaclosques correctament.
                  </p>
                  
                  <div className="bg-stone-50 border border-stone-200 rounded-xl p-3 mb-6 text-left">
                    <p className="text-xs font-bold text-stone-500 uppercase mb-2">Codi de seguretat (Guarda'l!)</p>
                    <div className="flex items-center gap-2">
                      <div className="bg-white border border-stone-200 px-3 py-2 rounded-lg flex-1 overflow-hidden">
                        <code className="text-xs font-mono text-stone-800/80 break-all select-all">
                          {encodeSaveData(levelIndex < LEVELS.length - 1 ? levelIndex + 1 : levelIndex, stats)}
                        </code>
                      </div>
                      <button 
                        onClick={handleCopyCode}
                        title="Copiar codi"
                        className="p-2 bg-stone-200 hover:bg-stone-300 text-stone-700 rounded-lg transition-colors flex-shrink-0 flex items-center justify-center"
                      >
                        {copied ? <Check className="w-5 h-5 text-green-600" /> : <Copy className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  {levelIndex < LEVELS.length - 1 ? (
                    <button 
                      onClick={handleNextLevel}
                      className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-6 rounded-xl transition-colors flex items-center justify-center gap-2"
                    >
                      Següent Nivell
                      <ArrowRight className="w-5 h-5" />
                    </button>
                  ) : (
                    <div className="text-green-600 font-bold text-lg">
                      Has completat tots els 20 nivells!
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}

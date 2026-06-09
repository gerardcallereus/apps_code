import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Dice5, Heart, Shield, Sword, BookOpen, ChevronRight, RotateCcw, AlertCircle } from 'lucide-react';
import { Scene, GameState, Choice, ProbabilityInfo } from './types';
import { STORY_DATA } from './constants';

const INITIAL_STATE: GameState = {
  currentSceneId: 'start',
  inventory: [],
  health: 100,
  maxHealth: 100,
  experience: 0,
  visitedScenes: ['start'],
};

export default function App() {
  const [gameState, setGameState] = useState<GameState>(INITIAL_STATE);
  const [isRolling, setIsRolling] = useState(false);
  const [rollResult, setRollResult] = useState<number | null>(null);
  const [showProbInfo, setShowProbInfo] = useState<ProbabilityInfo | null>(null);
  const [pendingChoice, setPendingChoice] = useState<Choice | null>(null);

  const currentScene = STORY_DATA[gameState.currentSceneId] || STORY_DATA['start'];

  const handleChoice = (choice: Choice) => {
    if (choice.probability) {
      setPendingChoice(choice);
      setShowProbInfo(choice.probability.info);
    } else {
      navigateTo(choice.nextSceneId);
    }
  };

  const navigateTo = (sceneId: string) => {
    setGameState(prev => ({
      ...prev,
      currentSceneId: sceneId,
      visitedScenes: [...new Set([...prev.visitedScenes, sceneId])]
    }));
  };

  const executeRoll = () => {
    if (!pendingChoice) return;
    setIsRolling(true);
    
    setTimeout(() => {
      const roll = Math.random();
      const success = roll <= (pendingChoice.probability?.successChance || 1);
      setRollResult(success ? 1 : 0);
      setIsRolling(false);
      
      setTimeout(() => {
        if (success) {
          navigateTo(pendingChoice.nextSceneId);
        } else {
          if (pendingChoice.probability?.successChance! < 0.5) {
             navigateTo('game_over');
          } else {
             setGameState(prev => ({ ...prev, health: Math.max(0, prev.health - 20) }));
             if (gameState.health - 20 <= 0) {
               navigateTo('game_over');
             } else {
               navigateTo(pendingChoice.nextSceneId);
             }
          }
        }
        setRollResult(null);
        setPendingChoice(null);
        setShowProbInfo(null);
      }, 1500);
    }, 1000);
  };

  const resetGame = () => {
    setGameState(INITIAL_STATE);
    setRollResult(null);
    setPendingChoice(null);
    setShowProbInfo(null);
  };

  return (
    <div className="h-screen w-full flex flex-col bg-base text-gray-200 font-sans selection:bg-purple-500 selection:text-white overflow-hidden">
      {/* Header Navigation */}
      <header className="h-16 flex items-center justify-between px-8 bg-black/40 border-b border-purple-500/30 backdrop-blur-md shrink-0">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center glow-purple">
            <span className="font-bold text-white text-xl uppercase italic">Ω</span>
          </div>
          <h1 className="text-2xl font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-300">
            OBSIDIANA
          </h1>
        </div>
        <div className="flex items-center gap-12">
          <div className="hidden md:flex flex-col items-end">
            <span className="text-[10px] uppercase tracking-tighter text-purple-400 opacity-70">Progreso en la Senda</span>
            <div className="w-48 h-2 bg-gray-800 rounded-full mt-1 border border-white/5">
              <motion.div 
                className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full glow-purple"
                initial={{ width: '0%' }}
                animate={{ width: `${(gameState.visitedScenes.length / Object.keys(STORY_DATA).length) * 100}%` }}
              />
            </div>
          </div>
          <div className="flex gap-4">
            <div className="bg-red-900/20 border border-red-500/40 px-3 py-1 rounded flex items-center gap-2">
              <span className="text-red-400 text-[10px] font-bold uppercase">Vida:</span>
              <span className="font-mono text-sm leading-none">{gameState.health}/100</span>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 flex overflow-hidden p-6 gap-6">
        {/* Sidebar Left: Codex */}
        <aside className="w-64 shrink-0 hidden lg:flex flex-col gap-4 overflow-y-auto">
          <div className="bg-black/60 border border-white/10 rounded-xl p-4 flex-1 backdrop-blur-sm">
            <h3 className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest mb-4">Códice de Laplace</h3>
            <div className="p-3 bg-white/5 rounded-lg mb-4 border border-white/5">
              <p className="text-[11px] leading-relaxed italic opacity-80">
                "La probabilidad de un evento es el cociente entre casos favorables y casos posibles."
              </p>
              <div className="mt-2 pt-2 border-t border-white/10 text-center font-mono text-indigo-300 text-xs">
                P(A) = n(A) / N
              </div>
            </div>
            
            <h3 className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest mb-4">Estructura de Árbol</h3>
            <div className="relative py-4 flex flex-col items-center">
              <div className="w-3 h-3 bg-indigo-500 rounded-full glow-indigo z-10"></div>
              <div className="flex justify-between w-full px-4 mt-4">
                <div className="flex flex-col items-center">
                  <div className="w-px h-6 bg-white/20 -mt-6"></div>
                  <div className="w-2 h-2 bg-green-500/50 rounded-full mt-1"></div>
                  <span className="text-[9px] mt-1 text-white/50">0.5</span>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-px h-6 bg-white/20 -mt-6"></div>
                  <div className="w-2 h-2 bg-red-500/50 rounded-full mt-1"></div>
                  <span className="text-[9px] mt-1 text-white/50">0.5</span>
                </div>
              </div>
              <p className="text-[10px] text-center mt-4 text-white/40 px-2 italic">
                Cada decisión abre nuevas ramas de realidad.
              </p>
            </div>
          </div>

          <div className="bg-black/60 border border-white/10 rounded-xl p-4 h-48">
            <h3 className="text-[10px] font-bold text-amber-400 uppercase tracking-widest mb-3">Inventario</h3>
            <div className="grid grid-cols-3 gap-2">
              {['⚔️', '🛡️', '🎲', '🧪', '📜', '💎'].map((item, i) => (
                <div 
                  key={i} 
                  className={`aspect-square bg-white/5 border border-white/10 rounded-lg flex items-center justify-center text-lg hover:border-amber-500/50 transition-colors cursor-default ${i > 2 ? 'opacity-20' : ''}`}
                >
                  {item}
                </div>
              ))}
            </div>
          </div>
        </aside>

        {/* Central Adventure Content */}
        <section className="flex-1 flex flex-col gap-6 overflow-hidden">
          <div className="flex-1 bg-gradient-to-b from-indigo-950/40 to-black/80 border border-purple-500/20 rounded-2xl p-8 relative overflow-hidden flex flex-col justify-between">
            {/* Atmosphere Effects */}
            <div className="absolute -top-24 -left-24 w-64 h-64 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

            <AnimatePresence mode="wait">
              <motion.div
                key={gameState.currentSceneId}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="h-full flex flex-col"
              >
                <div className="mb-4">
                  <span className="text-xs font-mono text-purple-400 uppercase tracking-[0.3em]">
                    Senda: {currentScene.id.replace('_', ' ')}
                  </span>
                  <h2 className="text-3xl font-serif mt-2 tracking-tight text-white">{currentScene.title}</h2>
                </div>
                
                <div className="flex-1 overflow-y-auto pr-4 scrollbar-thin scrollbar-thumb-white/10">
                  <p className="text-lg font-serif leading-relaxed text-gray-300 first-letter:text-4xl first-letter:text-purple-400 first-letter:mr-2">
                    {currentScene.text}
                  </p>
                </div>

                {currentScene.type !== 'end' && (
                  <div className="mt-8 flex flex-col sm:flex-row gap-6 pt-6 border-t border-white/10 items-center">
                    <div className="w-24 h-24 shrink-0 bg-indigo-900/40 border-2 border-indigo-500/30 rounded-2xl flex flex-col items-center justify-center inner-glow-indigo">
                      <Dice5 size={32} className="text-indigo-300" />
                      <span className="mt-1 font-mono text-[9px] text-indigo-300 font-bold tracking-widest">AZAR</span>
                    </div>
                    
                    <div className="flex-1 w-full flex flex-col justify-center gap-3 bg-white/5 border border-white/10 rounded-2xl p-4">
                      <div className="flex justify-between items-center text-[10px] text-indigo-300 uppercase tracking-widest">
                        <span>Estado de Supervivencia</span>
                        <span>Corazón: {gameState.health}%</span>
                      </div>
                      <div className="w-full h-1 bg-gray-800 rounded-full overflow-hidden">
                        <motion.div 
                          className="h-full bg-indigo-500 glow-indigo"
                          initial={{ width: 0 }}
                          animate={{ width: `${gameState.health}%` }}
                        />
                      </div>
                      <p className="text-[10px] text-gray-500 italic">"Pase lo que pase, el dado sigue girando..."</p>
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Decision Actions */}
          <div className="shrink-0 h-auto grid grid-cols-1 md:grid-cols-2 gap-4">
            {currentScene.choices?.map((choice, i) => (
              <button
                key={i}
                onClick={() => handleChoice(choice)}
                className="group relative bg-black/40 border border-purple-500/40 rounded-xl p-4 flex items-start gap-4 hover:bg-purple-900/20 transition-all text-left overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-transparent translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-500" />
                <div className="w-10 h-10 shrink-0 rounded-full bg-purple-500/20 border border-purple-500/50 flex items-center justify-center font-bold text-purple-400 group-hover:scale-110 transition-transform relative z-10">
                  {String.fromCharCode(65 + i)}
                </div>
                <div className="relative z-10">
                  <h4 className="font-bold text-purple-300 text-sm group-hover:text-white transition-colors">{choice.text}</h4>
                  <p className="text-[10px] text-gray-400 mt-1 line-clamp-2">
                    {choice.probability ? `Probabilidad de éxito: ${choice.probability.info.formula}` : "Avanza hacia la siguiente etapa de tu viaje."}
                  </p>
                </div>
              </button>
            ))}

            {currentScene.type === 'end' && (
              <button
                onClick={resetGame}
                className="col-span-full group bg-indigo-600/30 border border-indigo-400/50 rounded-xl p-6 flex items-center justify-center gap-4 hover:bg-indigo-600/50 transition-all"
              >
                <RotateCcw className="group-hover:rotate-[-180deg] transition-transform duration-700" />
                <span className="font-black tracking-[0.3em] uppercase text-sm">Renovar mi Senda</span>
              </button>
            )}
          </div>
        </section>

        {/* Stats Panel Right */}
        <aside className="w-24 shrink-0 hidden md:flex flex-col gap-4">
          <div className="flex-1 bg-black/60 border border-white/10 rounded-xl flex flex-col items-center py-6 gap-8 backdrop-blur-sm">
            <div className="flex flex-col items-center gap-1 group">
              <span className="text-[9px] uppercase tracking-widest text-indigo-400 opacity-60">Fuerza</span>
              <span className="text-xl font-black group-hover:text-white transition-colors">10</span>
            </div>
            <div className="flex flex-col items-center gap-1 group">
              <span className="text-[9px] uppercase tracking-widest text-blue-400 opacity-60">Suerte</span>
              <span className="text-xl font-black text-blue-300">+0</span>
            </div>
            <div className="flex flex-col items-center gap-1 group">
              <span className="text-[9px] uppercase tracking-widest text-purple-400 opacity-60">Mente</span>
              <span className="text-xl font-black text-purple-300">{gameState.visitedScenes.length}</span>
            </div>
            <div className="mt-auto flex flex-col items-center gap-2 mb-4 px-2">
              <div className="w-12 h-12 rounded-full border-2 border-indigo-500/30 flex items-center justify-center text-xl bg-indigo-500/5 glow-indigo">✨</div>
              <span className="text-[8px] text-center uppercase leading-tight text-white/50">Magia<br />Probabilística</span>
            </div>
          </div>
        </aside>
      </main>

      {/* Footer / Status Bar */}
      <footer className="h-8 bg-indigo-900/10 border-t border-white/5 flex items-center px-8 justify-between text-[10px] font-mono tracking-wider shrink-0">
        <div className="flex gap-6 opacity-40">
          <span>SEED: {(gameState.health * 1234).toString(16).toUpperCase()}</span>
          <span>SALA: {gameState.currentSceneId.toUpperCase()}</span>
        </div>
        <div className="text-indigo-400 uppercase font-bold animate-pulse">
          SISTEMA OPERATIVO OBSIDIANA v1.0.4 - LISTO
        </div>
      </footer>

      {/* Prob Modal */}
      <AnimatePresence>
        {showProbInfo && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-[#0a0510]/95 backdrop-blur-xl"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-[#111] border border-indigo-500/30 rounded-3xl p-8 max-w-lg w-full shadow-2xl relative overflow-hidden"
            >
              <div className="absolute -top-24 -right-24 w-48 h-48 bg-purple-500/10 blur-[80px]" />

              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-purple-500/20 flex items-center justify-center border border-purple-500/30">
                  <BookOpen className="text-purple-400" />
                </div>
                <div>
                  <h3 className="text-xl font-bold tracking-tight text-white">{showProbInfo.title}</h3>
                  <p className="text-xs uppercase tracking-widest text-purple-400/60">Análisis Predictivo</p>
                </div>
              </div>

              <div className="space-y-4 mb-8">
                <p className="text-gray-300 leading-relaxed italic border-l-2 border-purple-500/30 pl-4 py-1">
                  "{showProbInfo.explanation}"
                </p>
                <div className="p-4 bg-black/40 rounded-xl border border-white/5 font-mono text-center shadow-inner">
                  <span className="text-indigo-300 text-lg">{showProbInfo.formula}</span>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                {isRolling ? (
                  <div className="flex flex-col items-center gap-4 py-8">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 0.4, repeat: Infinity, ease: 'linear' }}
                      className="text-indigo-400 drop-shadow-[0_0_10px_rgba(129,140,248,0.8)]"
                    >
                      <Dice5 size={64} />
                    </motion.div>
                    <p className="text-[10px] uppercase tracking-[0.5em] text-indigo-300 animate-pulse">Computando Probabilidades...</p>
                  </div>
                ) : rollResult !== null ? (
                   <div className="flex flex-col items-center gap-4 py-8">
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className={rollResult === 1 ? "text-green-500 glow-indigo" : "text-red-500"}
                      >
                        {rollResult === 1 ? <Shield size={64} /> : <AlertCircle size={64} />}
                      </motion.div>
                      <p className="text-2xl font-black uppercase tracking-[0.2em] italic">
                        {rollResult === 1 ? "¡Éxito!" : "¡Fallo!"}
                      </p>
                      <p className="text-[10px] opacity-40 uppercase">El tejido de la realidad se ha fijado.</p>
                   </div>
                ) : (
                  <button 
                    onClick={executeRoll}
                    className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-black uppercase tracking-[0.2em] text-sm transition-all shadow-lg glow-indigo border border-indigo-400/30"
                  >
                    Colapsar Estado Cuántico
                  </button>
                )}
                
                {!isRolling && rollResult === null && (
                  <button 
                    onClick={() => setShowProbInfo(null)}
                    className="w-full py-4 bg-white/5 hover:bg-white/10 rounded-2xl font-medium text-[10px] uppercase tracking-widest transition-all text-gray-500"
                  >
                    Cancelar Ejecución
                  </button>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

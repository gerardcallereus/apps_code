import React, { useState, useEffect } from 'react';
import { GameCanvas } from './components/GameCanvas';
import { LevelEditor } from './components/LevelEditor';
import { MachineType, LEVELS } from './game/levels';

export type GameLog = {
    question: string;
    correct: boolean;
    attemptNo: number;
    machineId: string;
};

export type PlayerStats = {
    playerName: string;
    corrects: number;
    errors: number;
    attempts: number;
    completedLevels: Set<string>;
    logs: GameLog[];
};

export default function App() {
  const [activeMachine, setActiveMachine] = useState<MachineType | null>(null);
  const [isEditor, setIsEditor] = useState(false);
  
  const [stats, setStats] = useState<PlayerStats>(() => {
      try {
          const saved = localStorage.getItem('playerStats');
          if (saved) {
              const parsed = JSON.parse(saved);
              return { ...parsed, completedLevels: new Set(parsed.completedLevels) };
          }
      } catch (e) {
          console.error(e);
      }
      return {
          playerName: '',
          corrects: 0,
          errors: 0,
          attempts: 0,
          completedLevels: new Set(),
          logs: []
      };
  });

  useEffect(() => {
      localStorage.setItem('playerStats', JSON.stringify({
          ...stats,
          completedLevels: Array.from(stats.completedLevels)
      }));
  }, [stats]);

  const [inputName, setInputName] = useState('');

  const onQuestionAnswered = (question: string, correct: boolean, machineId: string) => {
      setStats(prev => ({
          ...prev,
          corrects: prev.corrects + (correct ? 1 : 0),
          errors: prev.errors + (!correct ? 1 : 0),
          attempts: prev.attempts + 1,
          logs: [{ question, correct, attemptNo: prev.attempts + 1, machineId }, ...prev.logs]
      }));
  };

  const onLevelComplete = (machineId: string) => {
      setStats(prev => {
          const newCompleted = new Set(prev.completedLevels);
          newCompleted.add(machineId);
          return { ...prev, completedLevels: newCompleted };
      });
  };

  if (!stats.playerName) {
      return (
          <div className="w-full min-h-screen bg-slate-900 text-white flex flex-col justify-center items-center p-8 font-sans">
              <h1 className="text-4xl md:text-6xl font-black text-center mb-12 text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">Les Màquines Simples</h1>
              <div className="bg-slate-800 p-8 rounded-2xl shadow-xl w-full max-w-md">
                  <h2 className="text-2xl font-bold mb-6 text-center">Introdueix el teu nom</h2>
                  <input 
                      type="text" 
                      value={inputName} 
                      onChange={e => setInputName(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && inputName.trim() && setStats(p => ({ ...p, playerName: inputName.trim() }))}
                      className="w-full p-4 rounded-xl bg-slate-700 text-white mb-6 border-2 border-slate-600 focus:border-yellow-400 focus:outline-none text-xl"
                      placeholder="El teu nom..."
                      autoFocus
                  />
                  <button 
                      onClick={() => inputName.trim() && setStats(p => ({ ...p, playerName: inputName.trim() }))}
                      disabled={!inputName.trim()}
                      className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 text-white font-bold py-4 rounded-xl text-xl disabled:opacity-50 transition-all hover:scale-[1.02]"
                  >
                      Començar Aventura
                  </button>
              </div>
          </div>
      );
  }

  if (isEditor) {
      return <LevelEditor onBack={() => setIsEditor(false)} />;
  }

  const completionPercentage = Math.round((stats.completedLevels.size / Object.keys(LEVELS).length) * 100);

  if (activeMachine) {
     const machineConfig = (LEVELS as any)[activeMachine];
     return (
        <div className="w-full h-screen bg-slate-950 flex flex-row overflow-hidden">
           {/* Sidebar on the left */}
           <div className="w-80 bg-slate-900 border-r border-slate-700 flex flex-col z-50 text-white shadow-2xl shrink-0">
               <div className="p-5 border-b border-slate-800 bg-slate-950/60 shadow-inner flex flex-col gap-4">
                    <div className="flex justify-between items-center">
                        <h2 className="font-bold text-lg text-slate-200 truncate pr-2">👤 {stats.playerName}</h2>
                        <div className="text-emerald-400 font-black text-sm bg-emerald-900/40 border border-emerald-500/20 px-2 py-1 rounded-md">{completionPercentage}%</div>
                    </div>
                    
                    <div className="flex flex-col gap-2">
                        <div className="font-black text-amber-400 text-xl tracking-tight leading-none mb-1">
                            {machineConfig?.name || "Nivell"}
                        </div>
                        <button onClick={() => setActiveMachine(null)} className="w-full bg-slate-800 hover:bg-slate-700 border border-slate-600 px-3 py-2 rounded-lg shadow font-bold text-sm transition-colors uppercase tracking-wider text-slate-300">
                            ← Sortir al Menú
                        </button>
                    </div>
               </div>
               
               <div className="p-5 border-b border-slate-800 bg-slate-800/10">
                    <div className="text-xs text-slate-500 font-bold uppercase tracking-widest mb-3 text-center">Rendiment Global</div>
                    <div className="grid grid-cols-3 gap-2">
                        <div className="bg-emerald-900/20 border border-emerald-900/50 p-2 rounded-xl text-center shadow-inner">
                            <div className="text-xl font-black text-emerald-400">{stats.corrects}</div>
                            <div className="text-[10px] text-emerald-600/80 font-bold uppercase tracking-wider mt-1">Encerts</div>
                        </div>
                        <div className="bg-rose-900/20 border border-rose-900/50 p-2 rounded-xl text-center shadow-inner">
                            <div className="text-xl font-black text-rose-400">{stats.errors}</div>
                            <div className="text-[10px] text-rose-600/80 font-bold uppercase tracking-wider mt-1">Errors</div>
                        </div>
                        <div className="bg-blue-900/20 border border-blue-900/50 p-2 rounded-xl text-center shadow-inner">
                            <div className="text-xl font-black text-blue-400">{stats.attempts}</div>
                            <div className="text-[10px] text-blue-600/80 font-bold uppercase tracking-wider mt-1">Intents</div>
                        </div>
                    </div>
               </div>

               <div className="flex-1 overflow-y-auto p-5 pb-8 custom-scrollbar">
                    <div className="text-xs text-slate-500 font-bold uppercase tracking-widest mb-4 flex justify-between items-center">
                        <span>Llibre de Registres</span>
                        <span className="bg-slate-800 border border-slate-700 text-slate-300 px-2 rounded-full font-mono text-[10px]">{stats.logs.length}</span>
                    </div>
                    <div className="flex flex-col gap-3">
                        {stats.logs.length === 0 ? (
                            <div className="text-slate-500 text-xs text-center py-8 border border-dashed border-slate-700 rounded-xl bg-slate-800/20 italic">No hi ha cap registre encara.</div>
                        ) : stats.logs.map((log, i) => (
                            <div key={i} className={`p-3 rounded-xl border-l-4 shadow-md text-xs relative overflow-hidden ${log.correct ? 'bg-slate-800/60 border-l-emerald-500' : 'bg-slate-800/60 border-l-rose-500'}`}>
                                <div className="text-slate-300 font-medium mb-2 leading-relaxed opacity-90">{log.question}</div>
                                <div className={`font-black uppercase tracking-wider flex items-center justify-between ${log.correct ? 'text-emerald-400' : 'text-rose-400'}`}>
                                    <span>{log.correct ? '✓ Correcte' : '✗ Incorrecte'}</span>
                                    <span className="text-slate-500 font-mono text-[10px] bg-slate-900/50 px-1.5 py-0.5 rounded">Intent {log.attemptNo}</span>
                                </div>
                            </div>
                        ))}
                    </div>
               </div>
               
               <div className="p-3 bg-slate-950 text-center border-t border-slate-800">
                    <div className="text-[10px] text-slate-500 font-mono">WASD / FLETXES PER MOURE'S</div>
               </div>
           </div>

           {/* Main Game Content */}
           <div className="flex-1 h-full relative">
               <GameCanvas 
                    machineId={activeMachine} 
                    onBack={() => setActiveMachine(null)} 
                    onQuestionAnswered={(q, correct) => onQuestionAnswered(q, correct, activeMachine)}
                    onLevelComplete={() => onLevelComplete(activeMachine)}
               />
           </div>
        </div>
     );
  }

  return (
    <div className="w-full min-h-screen bg-slate-900 text-white p-8 font-sans flex flex-col justify-center">
       <div className="flex justify-between items-center max-w-4xl mx-auto w-full mb-8">
           <div>
               <h2 className="text-xl font-bold text-slate-300">Hola, {stats.playerName}!</h2>
               <div className="text-emerald-400 font-bold text-sm">{completionPercentage}% Completat</div>
           </div>
           <button onClick={() => setStats(p => ({ ...p, playerName: '' }))} className="text-sm text-slate-500 hover:text-slate-300 underline">Canviar perfil</button>
       </div>

       <h1 className="text-4xl md:text-6xl font-black text-center mb-4 text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">Les Màquines Simples</h1>
       <p className="text-center text-xl text-slate-300 mb-12 max-w-2xl mx-auto">Tria un mecanisme per entendre com la física ens ajuda a multiplicar la nostra força i estalviar esforç des dels inicis de la humanitat.</p>
       
       <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
          {(Object.keys(LEVELS) as MachineType[]).map(key => {
             const m = LEVELS[key];
             const isComplete = stats.completedLevels.has(m.id);
             return (
                 <div key={m.id} className="relative group h-full">
                     <button onClick={() => setActiveMachine(m.id)} className={`bg-gradient-to-br w-full ${m.bg} p-1 rounded-2xl hover:scale-105 transition-transform duration-300 shadow-xl text-left h-full flex flex-col relative overflow-hidden`}>
                         {isComplete && (
                             <div className="absolute top-4 right-4 bg-emerald-500 text-white px-3 py-1 rounded-full text-xs font-bold z-10 shadow-lg border-2 border-emerald-300">
                                ✓ SUPERAT
                             </div>
                         )}
                         <div className="bg-slate-900/70 backdrop-blur-sm flex-1 rounded-xl p-6 flex flex-col items-start justify-start w-full">
                             <div className="text-5xl mb-4">{m.emoji}</div>
                             <h2 className="text-2xl font-bold mb-2 group-hover:text-white text-slate-100">{m.name}</h2>
                             <p className="text-slate-200 text-sm">{m.desc}</p>
                         </div>
                     </button>
                     {m.id === 'wheel' && (
                         <button onClick={() => setIsEditor(true)} className="absolute bottom-4 right-4 bg-purple-600 hover:bg-purple-500 text-white font-bold py-1 px-3 rounded-lg text-sm z-10 shadow transition-colors">
                            Editor Nivell
                         </button>
                     )}
                 </div>
             );
          })}
       </div>
    </div>
  );
}

import React, { useEffect, useRef, useState } from 'react';
import { GameEngine } from '../game/Engine';
import { render } from '../game/Renderer';
import { CANVAS_W, CANVAS_H } from '../game/constants';
import { MachineType, LEVELS } from '../game/levels';

export const GameCanvas: React.FC<{ 
    machineId: MachineType, 
    onBack: () => void,
    onQuestionAnswered?: (question: string, isCorrect: boolean) => void,
    onLevelComplete?: () => void
}> = ({ machineId, onBack, onQuestionAnswered, onLevelComplete }) => {
    const levelConfig = LEVELS[machineId];
    const containerRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const engineRef = useRef<GameEngine>(new GameEngine(machineId));
    const keys = useRef(new Set<string>());
    const reqRef = useRef<number>(0);
    const lastTime = useRef<number>(performance.now());
    const [size, setSize] = useState({ w: 1000, h: 800 });

    useEffect(() => {
        const updateSize = () => {
            if (!containerRef.current) return;
            import('../game/constants').then(mod => {
                const w = containerRef.current!.clientWidth;
                const h = containerRef.current!.clientHeight;
                mod.setCanvasSize(w, h);
                setSize({ w, h });
            });
        };
        window.addEventListener('resize', updateSize);
        // Add a small delay to let layout settle, or run immediately if visible
        updateSize();
        // and one right after a tick to catch layout
        setTimeout(updateSize, 0);
        return () => window.removeEventListener('resize', updateSize);
    }, []);

    const [gameState, setGameState] = useState<'playing' | 'gameover' | 'quiz' | 'history'>('playing');
    const [quizIndex, setQuizIndex] = useState(0);
    const [historyIndex, setHistoryIndex] = useState(0);
    const [quizFeedback, setQuizFeedback] = useState<{correct: boolean, explanation: string} | null>(null);
    const [activeDialog, setActiveDialog] = useState<string | null>(null);
    const [activeInGameQuiz, setActiveInGameQuiz] = useState<string | null>(null);

    const [catEffortDist, setCatEffortDist] = useState(200);
    const [catWeightMass, setCatWeightMass] = useState(30);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space'].includes(e.code)) {
                e.preventDefault();
            }
            keys.current.add(e.code);
            if (e.code === 'KeyR' && engineRef.current.state === 'gameover') {
                engineRef.current.reset();
            }
        };
        const handleKeyUp = (e: KeyboardEvent) => keys.current.delete(e.code);
        
        window.addEventListener('keydown', handleKeyDown, { passive: false });
        window.addEventListener('keyup', handleKeyUp);
        
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
        };
    }, []);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const loop = (time: number) => {
            const delta = time - lastTime.current;
            lastTime.current = time;
            
            // Limit delta to standard 60fps step to prevent warning and instability
            const safeDelta = Math.min(delta, 16.666); 

            const isQuizActive = !!engineRef.current.playerState.activeInGameQuiz;
            const input1 = {
                up: !isQuizActive && (keys.current.has('ArrowUp') || keys.current.has('KeyW') || keys.current.has('Space')),
                down: !isQuizActive && (keys.current.has('ArrowDown') || keys.current.has('KeyS')),
                left: !isQuizActive && (keys.current.has('ArrowLeft') || keys.current.has('KeyA')),
                right: !isQuizActive && (keys.current.has('ArrowRight') || keys.current.has('KeyD')),
            };

            engineRef.current.update(safeDelta, input1);
            render(ctx, engineRef.current);
            
            // Sync state to React so we can render the quiz UI
            setGameState(prev => {
                if (prev !== engineRef.current.state) {
                    if (engineRef.current.state === 'playing') {
                        setQuizIndex(0);
                        setHistoryIndex(0);
                        setQuizFeedback(null);
                    }
                    return engineRef.current.state as 'playing' | 'gameover' | 'quiz' | 'history';
                }
                return prev;
            });
            
            setActiveDialog(prev => {
                const current = engineRef.current.playerState.activeDialog;
                if (prev !== current) return current;
                return prev;
            });
            
            setActiveInGameQuiz(prev => {
                const current = engineRef.current.playerState.activeInGameQuiz;
                if (prev !== current) {
                    // Reset feedback if a new quiz pops up
                    if (current) setQuizFeedback(null);
                    return current;
                }
                return prev;
            });

            reqRef.current = requestAnimationFrame(loop);
        };
        
        reqRef.current = requestAnimationFrame(loop);
        return () => cancelAnimationFrame(reqRef.current);
    }, []);

    const handleAnswer = (optionIdx: number) => {
        let currentQ;
        if (activeInGameQuiz) {
            // Find quiz index by door ID suffix (e.g. quiz_door_0 -> 0)
            const idxStr = activeInGameQuiz.split('_').pop();
            const idx = parseInt(idxStr || '0');
            currentQ = levelConfig.quiz[idx];
        } else {
            currentQ = levelConfig.quiz[quizIndex];
        }
        
        if (!currentQ) return;
        
        const isCorrect = optionIdx === currentQ.correct;
        
        onQuestionAnswered?.(currentQ.question, isCorrect);
        
        setQuizFeedback({
            correct: isCorrect,
            explanation: currentQ.explanation || (isCorrect ? "Correcte!" : "Incorrecte, torna a intentar-ho.")
        });
    };

    const handleNextQuiz = () => {
        if (activeInGameQuiz) {
             if (quizFeedback?.correct) {
                 // Open the door!
                 engineRef.current.openQuizDoor(activeInGameQuiz);
             } 
             setQuizFeedback(null);
             return;
        }

        if (quizFeedback?.correct) {
            if (quizIndex + 1 < levelConfig.quiz.length) {
                setQuizIndex(quizIndex + 1);
                setQuizFeedback(null);
            } else {
                onLevelComplete?.();
                engineRef.current.state = 'gameover';
                setQuizFeedback(null);
            }
        } else {
            setQuizFeedback(null);
        }
    };

    const handleNextHistory = () => {
        if (historyIndex + 1 < levelConfig.history.length) {
            setHistoryIndex(historyIndex + 1);
        } else {
            onLevelComplete?.();
            engineRef.current.state = 'gameover';
        }
    };

    return (
        <div 
            ref={containerRef}
            className="relative w-full h-full bg-black overflow-hidden flex items-center justify-center outline-none"
        >
            <canvas 
                ref={canvasRef} 
                width={size.w} 
                height={size.h} 
                className="absolute inset-0 w-full h-full rendering-pixelated cursor-crosshair"
                style={{ imageRendering: 'pixelated' }}
            />

            {gameState === 'playing' && (
                <div className="absolute inset-x-0 bottom-8 p-4 md:p-8 flex justify-between items-end select-none pointer-events-none z-20 md:hidden opacity-30 hover:opacity-100 transition-opacity">
                    <div className="flex gap-4 sm:gap-6 pointer-events-auto">
                        <button
                            onPointerDown={(e) => { e.preventDefault(); keys.current.add('ArrowLeft'); }}
                            onPointerUp={(e) => { e.preventDefault(); keys.current.delete('ArrowLeft'); }}
                            onPointerCancel={(e) => { e.preventDefault(); keys.current.delete('ArrowLeft'); }}
                            onPointerLeave={(e) => { e.preventDefault(); keys.current.delete('ArrowLeft'); }}
                            className="bg-slate-900/40 backdrop-blur-sm border border-white/20 w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center text-white/70 font-bold text-xl active:bg-slate-900/80 active:text-white touch-none"
                        >
                            ◀
                        </button>
                        <button
                            onPointerDown={(e) => { e.preventDefault(); keys.current.add('ArrowRight'); }}
                            onPointerUp={(e) => { e.preventDefault(); keys.current.delete('ArrowRight'); }}
                            onPointerCancel={(e) => { e.preventDefault(); keys.current.delete('ArrowRight'); }}
                            onPointerLeave={(e) => { e.preventDefault(); keys.current.delete('ArrowRight'); }}
                            className="bg-slate-900/40 backdrop-blur-sm border border-white/20 w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center text-white/70 font-bold text-xl active:bg-slate-900/80 active:text-white touch-none"
                        >
                            ▶
                        </button>
                    </div>

                    <div className="flex gap-4 sm:gap-6 pointer-events-auto items-end">
                        <button
                            onPointerDown={(e) => { e.preventDefault(); keys.current.add('ArrowDown'); }}
                            onPointerUp={(e) => { e.preventDefault(); keys.current.delete('ArrowDown'); }}
                            onPointerCancel={(e) => { e.preventDefault(); keys.current.delete('ArrowDown'); }}
                            onPointerLeave={(e) => { e.preventDefault(); keys.current.delete('ArrowDown'); }}
                            className="bg-slate-900/40 backdrop-blur-sm border border-white/20 w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center text-white/70 font-bold text-xl active:bg-slate-900/80 active:text-white touch-none"
                        >
                            ▼
                        </button>
                        <button
                            onPointerDown={(e) => { e.preventDefault(); keys.current.add('ArrowUp'); }}
                            onPointerUp={(e) => { e.preventDefault(); keys.current.delete('ArrowUp'); }}
                            onPointerCancel={(e) => { e.preventDefault(); keys.current.delete('ArrowUp'); }}
                            onPointerLeave={(e) => { e.preventDefault(); keys.current.delete('ArrowUp'); }}
                            className="bg-slate-900/40 backdrop-blur-sm border border-white/20 w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center text-white/70 font-bold text-xl active:bg-slate-900/80 active:text-white touch-none sm:-mt-8"
                        >
                            ▲
                        </button>
                    </div>
                </div>
            )}

            {gameState === 'gameover' && (
                <div 
                    className="absolute inset-0 z-30 pointer-events-auto cursor-pointer bg-slate-900/95 flex flex-col items-center justify-center font-mono text-white p-8 animate-in fade-in"
                    onClick={() => engineRef.current.reset()}
                >
                    <div className="max-w-4xl text-center">
                        <p className="text-2xl md:text-3xl text-amber-500 font-bold mb-8 whitespace-pre-wrap leading-relaxed shadow-lg bg-black/30 p-8 rounded-2xl border-4 border-amber-500/30">
                            {levelConfig.texts.finish}
                        </p>
                        <p className="text-xl md:text-3xl text-green-400 font-black animate-pulse mt-12 bg-white/10 px-8 py-4 rounded-xl inline-block border-4 border-green-500/50">
                            Preme R o toca la pantalla per Recomençar
                        </p>
                        
                        <div className="mt-12">
                            <button onClick={onBack} className="bg-slate-800 hover:bg-slate-700 text-white font-bold py-3 px-8 rounded-xl shadow-lg border-2 border-slate-600 transition-all">
                                Tornar al menú principal
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {gameState === 'history' && (
                <div className="absolute inset-x-8 top-12 bottom-12 rounded-lg bg-[#5C94FC] border-4 border-white shadow-xl flex flex-col p-8 z-10 font-sans text-white animate-in slide-in-from-bottom">
                    <div className="text-3xl font-black mb-6 border-b-4 border-white pb-4 shadow-[0_4px_0_rgba(0,0,0,0.2)] flex justify-between items-center">
                         <div>HISTÒRIA I APLICACIONS: {levelConfig.name}</div>
                         <button onClick={onBack} className="text-lg bg-red-500 hover:bg-red-600 px-4 py-2 rounded shadow border-b-4 border-red-700 active:translate-y-1 active:border-b-0">Menú</button>
                    </div>
                    
                    <div className="flex-1 flex flex-col items-center justify-center bg-[#303030] rounded-xl p-8 mb-6 overflow-hidden">
                         <div className="text-8xl mb-6">{levelConfig.history[historyIndex].imageIcon}</div>
                         <h2 className="text-3xl font-bold text-[#fcd800] mb-4">{levelConfig.history[historyIndex].title}</h2>
                         <p className="text-xl leading-relaxed text-center max-w-2xl">
                              {levelConfig.history[historyIndex].content}
                         </p>
                    </div>

                    <button 
                        onClick={handleNextHistory}
                        className="bg-green-500 hover:bg-green-400 focus:bg-green-300 ring-4 ring-white rounded-lg py-4 px-8 font-bold text-2xl active:scale-95 transition-transform"
                    >
                        {historyIndex + 1 < levelConfig.history.length ? "Següent" : "Començar la Prova Final"}
                    </button>
                    
                    <div className="mt-4 text-center font-bold text-white/70">
                        Pàgina {historyIndex + 1} de {levelConfig.history.length}
                    </div>
                </div>
            )}

            {gameState === 'quiz' && (
                <div className="absolute inset-x-8 top-12 bottom-12 rounded-lg bg-[#5C94FC] border-4 border-white shadow-xl flex flex-col p-8 z-10 font-sans text-white">
                    <div className="text-3xl font-black mb-6 border-b-4 border-white pb-4 shadow-[0_4px_0_rgba(0,0,0,0.2)] flex justify-between items-center">
                        <div>PROVA FINAL: Què has après?</div>
                        <div className="text-lg">Pregunta {quizIndex + 1} de {levelConfig.quiz.length}</div>
                    </div>
                    
                    {!quizFeedback ? (
                        <>
                            <div className="text-xl font-bold bg-[#303030] rounded-xl p-6 mb-8 leading-relaxed shadow-lg">
                                {levelConfig.quiz[quizIndex].question}
                            </div>
                            <div className="flex flex-col gap-4 flex-1">
                                {levelConfig.quiz[quizIndex].options.map((opt, idx) => (
                                    <button 
                                        key={idx} 
                                        onClick={() => handleAnswer(idx)}
                                        className="text-left bg-[#388700] hover:bg-[#47a800] ring-4 ring-black/20 rounded-xl p-5 font-bold text-lg active:scale-[0.98] transition-transform shadow-lg border-b-4 border-black/30"
                                    >
                                        {opt}
                                    </button>
                                ))}
                            </div>
                        </>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center animate-in slide-in-from-bottom-4">
                            <div className={`text-4xl font-black mb-6 ${quizFeedback.correct ? 'text-green-300' : 'text-red-400'}`}>
                                {quizFeedback.correct ? '¡Correcte!' : '¡Incorrecte!'}
                            </div>
                            <div className="text-2xl font-bold bg-[#303030] rounded-xl p-8 mb-10 leading-relaxed text-center max-w-2xl shadow-xl border-l-8 border-green-500">
                                {quizFeedback.explanation}
                            </div>
                            <button 
                                onClick={handleNextQuiz}
                                className="bg-[#fc9838] hover:bg-[#fca858] ring-4 ring-white rounded-xl py-4 px-12 font-bold text-2xl active:scale-[0.98] transition-transform shadow-xl text-black border-b-4 border-black/20"
                            >
                                {quizFeedback.correct ? 'Següent Pregunta' : 'Tornar-ho a provar'}
                            </button>
                        </div>
                    )}
                </div>
            )}

            {gameState === 'playing' && activeDialog && !activeInGameQuiz && (() => {
                const text = levelConfig.texts[activeDialog];
                const formula = levelConfig.formulas?.[activeDialog];
                
                let historyItem = null;
                if (activeDialog.startsWith('sign_hist_')) {
                    const hIdx = parseInt(activeDialog.split('_')[2]);
                    if (!isNaN(hIdx) && levelConfig.history[hIdx]) {
                        historyItem = levelConfig.history[hIdx];
                    }
                }

                if (!text && !historyItem) return null;

                if (historyItem) {
                    return (
                        <div className="absolute top-4 left-1/2 -translate-x-1/2 w-11/12 max-w-4xl z-30 animate-in fade-in slide-in-from-top-4">
                            <div className="bg-[#303030]/95 backdrop-blur-md border-4 border-[#5C94FC] rounded-2xl p-6 md:p-8 shadow-2xl flex flex-col md:flex-row items-center gap-6 pointer-events-auto max-h-[70vh] overflow-y-auto">
                                <div className="text-7xl shrink-0 bg-black/30 p-4 rounded-xl shadow-inner border border-white/10">
                                    {historyItem.imageIcon}
                                </div>
                                <div className="flex-1 text-white">
                                    <h3 className="text-[#fcd800] text-2xl font-black mb-3 border-b-2 border-white/20 pb-2">
                                        {historyItem.title}
                                    </h3>
                                    <p className="text-lg font-medium leading-relaxed opacity-95">
                                        {historyItem.content}
                                    </p>
                                </div>
                            </div>
                        </div>
                    );
                }

                return (
                    <div className="absolute top-4 left-1/2 -translate-x-1/2 w-11/12 max-w-6xl z-30 pointer-events-none animate-in fade-in slide-in-from-top-4 flex flex-col md:flex-row gap-4 items-start">
                        <div className="bg-slate-900/95 backdrop-blur-md border-4 border-amber-500 rounded-2xl p-6 md:p-8 shadow-2xl flex-[2] w-full pointer-events-auto max-h-[70vh] overflow-y-auto">
                            <p className="text-white font-sans font-medium text-lg md:text-2xl leading-relaxed whitespace-pre-wrap">
                                {text}
                            </p>
                        </div>
                        {formula && (
                            <div className="bg-blue-950/95 backdrop-blur-md border-4 border-blue-400 rounded-2xl p-6 md:p-8 shadow-2xl shrink-0 w-full md:max-w-md flex-1">
                                <div className="text-blue-200 font-bold mb-4 uppercase tracking-wider text-sm border-b border-blue-800 pb-2">Equació de Força</div>
                                <div className="text-3xl font-black text-white bg-black/50 p-4 rounded-xl text-center mb-6 font-mono border border-blue-500 shadow-inner">
                                    {formula.equation}
                                </div>
                                <div className="space-y-3">
                                    {formula.legend.map((item, i) => (
                                        <div key={i} className="flex items-center gap-3">
                                            <span className="bg-blue-600 text-white font-bold font-mono px-2 py-1 rounded shadow text-lg min-w-[40px] text-center">
                                                {item.symbol}
                                            </span>
                                            <span className="text-blue-100 font-medium">
                                                {item.desc}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                );
            })()}

            {gameState === 'playing' && activeInGameQuiz && (() => {
                const idxStr = activeInGameQuiz.split('_').pop();
                const idx = parseInt(idxStr || '0');
                const quest = levelConfig.quiz[idx];
                if (!quest) return null;

                return (
                    <div className="absolute top-12 left-1/2 -translate-x-1/2 w-11/12 max-w-3xl rounded-lg bg-slate-900/95 backdrop-blur-md border-4 border-amber-500 shadow-2xl flex flex-col p-6 z-50 font-sans text-white max-h-[85vh] pointer-events-auto">
                        <div className="text-2xl font-black mb-4 border-b-2 border-amber-500 pb-2 text-amber-500 flex-shrink-0">
                            BLOCAT: Respon per avançar!
                        </div>
                        
                        {!quizFeedback ? (
                            <>
                                <div className="text-lg md:text-xl font-bold rounded-xl p-4 mb-4 leading-relaxed bg-white/5 overflow-y-auto">
                                    {quest.question}
                                </div>
                                {quest.formula && (
                                    <div className="mb-4 bg-blue-950/80 border-2 border-blue-400 rounded-xl p-4">
                                        <div className="text-blue-200 font-bold mb-2 uppercase tracking-wider text-sm border-b border-blue-800 pb-1">Equació de Força (Ajuda)</div>
                                        <div className="text-xl md:text-2xl font-black text-white bg-black/50 p-2 rounded-lg text-center font-mono border border-blue-500 shadow-inner">
                                            {quest.formula}
                                        </div>
                                    </div>
                                )}
                                <div className="flex flex-col gap-3 flex-1 overflow-y-auto pr-2">
                                    {quest.options.map((opt, oIdx) => (
                                        <button 
                                            key={oIdx} 
                                            onClick={() => handleAnswer(oIdx)}
                                            className="text-left bg-slate-800 hover:bg-slate-700 ring-2 ring-transparent hover:ring-amber-500/50 rounded-xl p-4 font-bold text-lg active:scale-[0.98] transition-all"
                                        >
                                            {opt}
                                        </button>
                                    ))}
                                </div>
                            </>
                        ) : (
                            <div className="flex-1 flex flex-col items-center justify-center animate-in fade-in zoom-in-95 overflow-y-auto">
                                <div className={`text-3xl font-black mb-4 ${quizFeedback.correct ? 'text-green-400' : 'text-red-400'}`}>
                                    {quizFeedback.correct ? '¡Correcte!' : '¡Incorrecte!'}
                                </div>
                                <div className="text-xl font-bold bg-black/40 rounded-xl p-6 mb-8 leading-relaxed text-center max-w-lg shadow-inner">
                                    {quizFeedback.explanation}
                                </div>
                                <button 
                                    onClick={handleNextQuiz}
                                    className="bg-amber-500 hover:bg-amber-400 rounded-xl py-3 px-10 font-bold text-xl active:scale-[0.98] transition-transform shadow-xl text-black flex-shrink-0"
                                >
                                    {quizFeedback.correct ? 'Continua' : 'Tornar-ho a provar'}
                                </button>
                            </div>
                        )}
                    </div>
                );
            })()}
            
            {gameState === 'playing' && (
                 <>
                     {machineId === 'lever' && (
                         <div className="absolute top-4 right-4 z-40 bg-slate-900/95 border-2 border-orange-500 rounded-xl p-5 text-white w-72 shadow-2xl pointer-events-auto">
                             <h3 className="font-black text-xl mb-4 text-orange-400 border-b-2 border-orange-500/50 pb-2">Panell de Control</h3>
                             
                             <div className="mb-4">
                                 <label className="flex justify-between text-sm font-bold text-orange-200 mb-2">
                                     <span>Distància Fulcre (d1):</span>
                                     <span>{catEffortDist}m</span>
                                 </label>
                                 <input 
                                     type="range" min="50" max="350" step="10"
                                     value={catEffortDist} 
                                     onChange={(e) => {
                                         const v = parseInt(e.target.value);
                                         setCatEffortDist(v);
                                         engineRef.current.setupCatapult(v, catWeightMass);
                                     }} 
                                     className="w-full accent-orange-500 cursor-pointer"
                                 />
                             </div>
                             
                             <div className="mb-6">
                                 <label className="flex justify-between text-sm font-bold text-orange-200 mb-2">
                                     <span>Massa Contrapès (M):</span>
                                     <span>{catWeightMass}kg</span>
                                 </label>
                                 <input 
                                     type="range" min="10" max="150" step="5"
                                     value={catWeightMass} 
                                     onChange={(e) => {
                                         const v = parseInt(e.target.value);
                                         setCatWeightMass(v);
                                         engineRef.current.setupCatapult(catEffortDist, v);
                                     }} 
                                     className="w-full accent-orange-500 cursor-pointer"
                                 />
                             </div>
                             
                             <div className="flex gap-2">
                                  <button 
                                     onClick={() => engineRef.current.setupCatapult(catEffortDist, catWeightMass)} 
                                     className="flex-1 bg-slate-700 hover:bg-slate-600 font-bold py-2 rounded-lg transition-colors"
                                  >
                                      Reinicia
                                  </button>
                                  <button 
                                     onClick={() => engineRef.current.fireCatapult()} 
                                     className="flex-1 bg-orange-600 hover:bg-orange-500 font-bold py-2 rounded-lg shadow-[0_4px_0_#9a3412] active:shadow-[0_0px_0_#9a3412] active:translate-y-1 transition-all"
                                  >
                                      Llança!
                                  </button>
                             </div>
                         </div>
                     )}
                 </>
            )}
        </div>
    );
};

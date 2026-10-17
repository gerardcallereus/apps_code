import React, { useState } from 'react';
import { Tent, TreePine, Sprout, ArrowRight, ArrowLeft, CheckCircle2, Lightbulb, GraduationCap, Sparkles, HelpCircle, Award } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import confetti from 'canvas-confetti';

interface GuidedTutorialProps {
  onComplete: () => void;
  onExit?: () => void;
  allowExit?: boolean;
}

type CellType = 'empty' | 'tent' | 'grass';

interface StepDefinition {
  title: string;
  badge: string;
  description: string;
  hint: string;
  highlightRows?: number[];
  highlightCols?: number[];
  highlightCells?: { r: number; c: number }[];
  highlightTrees?: { r: number; c: number }[];
  // Target board state after this step
  applyChanges: (prev: CellType[][]) => CellType[][];
}

const TUTORIAL_SIZE = 5;
const TUTORIAL_TREES = [
  { r: 1, c: 2 },
  { r: 3, c: 1 },
  { r: 3, c: 3 }
];
const ROW_CLUES = [1, 0, 0, 1, 1];
const COL_CLUES = [1, 0, 1, 1, 0];

export function GuidedTutorial({ onComplete, onExit, allowExit }: GuidedTutorialProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);

  // Initial empty board
  const [boardState, setBoardState] = useState<CellType[][]>(() => 
    Array.from({ length: TUTORIAL_SIZE }, () => Array(TUTORIAL_SIZE).fill('empty'))
  );

  const isTree = (r: number, c: number) => 
    TUTORIAL_TREES.some(t => t.r === r && t.c === c);

  const STEPS: StepDefinition[] = [
    {
      title: "Comença sense prova-error!",
      badge: "Introducció",
      description: "Molts alumnes comencen col·locant tendes a l'atzar per veure si sona la flauta. Això genera errors i pèrdua de punts! Els bons jugadors utilitzen la lògica: només posem tendes o gespa quan n'estem 100% segurs.",
      hint: "En aquest tutorial aprendràs 5 estratègies que et permetran resoldre qualsevol escenari sense provar a cegues.",
      applyChanges: (prev) => prev.map(row => [...row]),
    },
    {
      title: "Estratègia 1: La Regla del Zero",
      badge: "Pas 1 de 5",
      description: "Observa les pistes exteriors: si una fila o columna té un número 0, és segur que NO hi ha cap tenda! El millor primer pas és omplir totes les caselles buides d'aquestes línies amb gespa per descartar-les.",
      hint: "Fila 1, Fila 2, Columna 1 i Columna 4 tenen un 0. Marquem-les amb gespa!",
      highlightRows: [1, 2],
      highlightCols: [1, 4],
      applyChanges: (prev) => {
        const next = prev.map(row => [...row]);
        // Row 1 and Row 2 have 0; Col 1 and Col 4 have 0
        for (let r of [1, 2]) {
          for (let c = 0; c < TUTORIAL_SIZE; c++) {
            if (!isTree(r, c)) next[r][c] = 'grass';
          }
        }
        for (let c of [1, 4]) {
          for (let r = 0; r < TUTORIAL_SIZE; r++) {
            if (!isTree(r, c)) next[r][c] = 'grass';
          }
        }
        return next;
      }
    },
    {
      title: "Estratègia 2: Caselles que no toquen cap arbre",
      badge: "Pas 2 de 5",
      description: "Cada tenda ha d'estar enganxada a un arbre en creu (dalt, baix, esquerra o dreta, mai en diagonal). Les caselles que no toquen cap arbre mai no podran tenir tenda!",
      hint: "La cantonada superior esquerra (0, 0) no toca cap arbre: la podem marcar amb gespa amb total seguretat.",
      highlightCells: [{ r: 0, c: 0 }],
      applyChanges: (prev) => {
        const next = prev.map(row => [...row]);
        next[0][0] = 'grass';
        return next;
      }
    },
    {
      title: "Estratègia 3: Arbre amb una sola casella lliure (Tenda segura!)",
      badge: "Pas 3 de 5",
      description: "Fixa't en l'arbre superior (fila 2, columna 3). Al seu voltant ja hem descartat la dreta, l'esquerra i la part inferior. Només li queda UNA casella lliure a dalt (0, 2)! Com que tot arbre ha de tenir una tenda, aquesta tenda va aquí obligatòriament.",
      hint: "Col·loquem la tenda a la casella (0, 2) sense cap dubte!",
      highlightTrees: [{ r: 1, c: 2 }],
      highlightCells: [{ r: 0, c: 2 }],
      applyChanges: (prev) => {
        const next = prev.map(row => [...row]);
        next[0][2] = 'tent';
        return next;
      }
    },
    {
      title: "Estratègia 4: El voltant de la tenda i línies completades",
      badge: "Pas 4 de 5",
      description: "Recorda: dues tendes mai no poden tocar-se, ni tan sols en diagonal! Quan poses una tenda, totes les caselles del seu voltant han de ser gespa. A més, si una fila o columna ja té el número de tendes que demanava, la resta de la línia és gespa!",
      hint: "La fila 0 i la columna 2 ja tenen la seva tenda (pista 1). Omplim amb gespa (0, 3) i la resta de la columna 2!",
      highlightCells: [{ r: 0, c: 3 }, { r: 3, c: 2 }, { r: 4, c: 2 }],
      applyChanges: (prev) => {
        const next = prev.map(row => [...row]);
        next[0][3] = 'grass';
        next[3][2] = 'grass';
        next[4][2] = 'grass';
        return next;
      }
    },
    {
      title: "Estratègia 5: Tancament lògic de les darreres tendes",
      badge: "Pas 5 de 5",
      description: "Mira ara l'arbre inferior esquerre (3, 1): només té la casella (3, 0) lliure -> segona tenda segura! I com que la fila 4 demana 1 tenda i només queda (4, 3) lliure, hi va la darrera tenda!",
      hint: "Posem les dues darreres tendes a (3, 0) i (4, 3) i gespa a (4, 0).",
      highlightCells: [{ r: 3, c: 0 }, { r: 4, c: 0 }, { r: 4, c: 3 }],
      applyChanges: (prev) => {
        const next = prev.map(row => [...row]);
        next[3][0] = 'tent';
        next[4][0] = 'grass';
        next[4][3] = 'tent';
        return next;
      }
    }
  ];

  const currentStepData = STEPS[currentStep];

  const handleApplyStep = () => {
    const updated = currentStepData.applyChanges(boardState);
    setBoardState(updated);

    if (currentStep < STEPS.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      setShowCelebration(true);
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 0) {
      // Recalculate board state up to currentStep - 1
      let st: CellType[][] = Array.from({ length: TUTORIAL_SIZE }, () => Array(TUTORIAL_SIZE).fill('empty'));
      for (let i = 0; i < currentStep; i++) {
        st = STEPS[i].applyChanges(st);
      }
      setBoardState(st);
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleCellClick = (r: number, c: number) => {
    if (isTree(r, c)) return;
    setBoardState(prev => {
      const next = prev.map(row => [...row]);
      const cur = next[r][c];
      if (cur === 'empty') next[r][c] = 'tent';
      else if (cur === 'tent') next[r][c] = 'grass';
      else next[r][c] = 'empty';
      return next;
    });
  };

  const handleCellRightClick = (e: React.MouseEvent, r: number, c: number) => {
    e.preventDefault();
    if (isTree(r, c)) return;
    setBoardState(prev => {
      const next = prev.map(row => [...row]);
      next[r][c] = next[r][c] === 'grass' ? 'empty' : 'grass';
      return next;
    });
  };

  // Helper to check highlights
  const isCellHighlighted = (r: number, c: number) => {
    if (currentStepData.highlightRows?.includes(r)) return true;
    if (currentStepData.highlightCols?.includes(c)) return true;
    if (currentStepData.highlightCells?.some(cell => cell.r === r && cell.c === c)) return true;
    return false;
  };

  const isTreeHighlighted = (r: number, c: number) => {
    return currentStepData.highlightTrees?.some(tree => tree.r === r && tree.c === c);
  };

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 font-sans p-4 sm:p-8 flex flex-col items-center justify-center">
      <div className="max-w-4xl w-full">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="bg-amber-100 p-2.5 rounded-2xl text-amber-800">
              <GraduationCap className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Nivell Guiat d'Estratègies</h1>
                <span className="text-xs font-bold uppercase tracking-wider bg-amber-100 text-amber-800 px-2.5 py-0.5 rounded-full">
                  Tutorial
                </span>
              </div>
              <p className="text-sm text-stone-500">Aprèn a resoldre amb lògica sense fer prova-error</p>
            </div>
          </div>

          {allowExit && onExit && (
            <button
              onClick={onExit}
              className="text-stone-500 hover:text-stone-800 text-sm font-semibold py-2 px-4 rounded-xl border border-stone-200 hover:bg-stone-100 transition-colors"
            >
              Tornar a la partida
            </button>
          )}
        </div>

        {/* Targeta pedagògica interactiva */}
        <div className="grid md:grid-cols-5 gap-6 items-start">
          {/* Caixa de guiatge */}
          <div className="md:col-span-3 bg-white p-6 sm:p-7 rounded-3xl shadow-sm border border-stone-200 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-orange-100 text-orange-800">
                  {currentStepData.badge}
                </span>
                <span className="text-xs text-stone-400 font-medium">
                  Pas {currentStep + 1} de {STEPS.length}
                </span>
              </div>

              <h2 className="text-xl sm:text-2xl font-bold text-stone-800 mb-3 flex items-center gap-2">
                <Lightbulb className="w-6 h-6 text-amber-500 shrink-0" />
                {currentStepData.title}
              </h2>

              <p className="text-stone-600 text-sm sm:text-base leading-relaxed mb-4">
                {currentStepData.description}
              </p>

              <div className="bg-amber-50 border border-amber-200/80 rounded-2xl p-4 text-xs sm:text-sm text-amber-900 font-medium flex items-start gap-2.5 mb-6">
                <Sparkles className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <strong>Consell pràctic: </strong>
                  {currentStepData.hint}
                </div>
              </div>
            </div>

            {/* Botons d'acció */}
            <div className="flex flex-col sm:flex-row items-center gap-3 pt-2 border-t border-stone-100">
              {currentStep > 0 && (
                <button
                  onClick={handlePrevStep}
                  className="w-full sm:w-auto flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl border border-stone-300 text-stone-700 hover:bg-stone-100 font-medium text-sm transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Pas anterior
                </button>
              )}

              <button
                onClick={handleApplyStep}
                className="w-full sm:flex-1 bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-6 rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 text-sm sm:text-base"
              >
                {currentStep === STEPS.length - 1 ? (
                  <>
                    Completar tutorial
                    <CheckCircle2 className="w-5 h-5" />
                  </>
                ) : (
                  <>
                    Aplica aquest pas i continua
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Tauler del tutorial */}
          <div className="md:col-span-2 bg-white p-5 sm:p-6 rounded-3xl shadow-sm border border-stone-200 flex flex-col items-center">
            <div className="text-xs font-semibold uppercase tracking-wider text-stone-400 mb-4 flex items-center gap-1">
              <HelpCircle className="w-4 h-4" /> Tauler didàctic (5x5)
            </div>

            <div 
              className="grid gap-1 select-none"
              style={{ 
                gridTemplateColumns: `auto repeat(${TUTORIAL_SIZE}, minmax(0, 1fr))`,
                gridTemplateRows: `auto repeat(${TUTORIAL_SIZE}, minmax(0, 1fr))`
              }}
            >
              {/* Top-left corner */}
              <div className="w-8 h-8 sm:w-10 sm:h-10"></div>

              {/* Col clues */}
              {COL_CLUES.map((clue, c) => {
                const isColHighlighted = currentStepData.highlightCols?.includes(c);
                return (
                  <div 
                    key={`col-${c}`}
                    className={cn(
                      "flex items-center justify-center font-bold text-base sm:text-lg transition-colors",
                      isColHighlighted ? "text-orange-600 bg-orange-50 rounded-lg animate-pulse" : "text-stone-700"
                    )}
                  >
                    {clue}
                  </div>
                );
              })}

              {/* Rows */}
              {Array.from({ length: TUTORIAL_SIZE }).map((_, r) => {
                const isRowHighlighted = currentStepData.highlightRows?.includes(r);
                return (
                  <React.Fragment key={`row-${r}`}>
                    {/* Row clue */}
                    <div 
                      className={cn(
                        "flex items-center justify-center font-bold text-base sm:text-lg w-8 h-8 sm:w-10 sm:h-10 transition-colors",
                        isRowHighlighted ? "text-orange-600 bg-orange-50 rounded-lg animate-pulse" : "text-stone-700"
                      )}
                    >
                      {ROW_CLUES[r]}
                    </div>

                    {/* Cells */}
                    {Array.from({ length: TUTORIAL_SIZE }).map((_, c) => {
                      const tree = isTree(r, c);
                      const state = boardState[r][c];
                      const highlighted = isCellHighlighted(r, c);
                      const treeHighlighted = isTreeHighlighted(r, c);

                      return (
                        <div
                          key={`cell-${r}-${c}`}
                          onClick={() => handleCellClick(r, c)}
                          onContextMenu={(e) => handleCellRightClick(e, r, c)}
                          className={cn(
                            "w-8 h-8 sm:w-10 sm:h-10 border-2 flex items-center justify-center rounded-lg transition-all cursor-pointer",
                            tree 
                              ? treeHighlighted
                                ? "bg-amber-100 border-amber-400 ring-2 ring-amber-400"
                                : "bg-green-100 border-green-300"
                              : highlighted
                                ? "bg-orange-50/80 border-orange-400 ring-2 ring-orange-400 shadow-sm"
                                : "bg-white border-stone-200 hover:bg-stone-50"
                          )}
                        >
                          {tree && <TreePine className="w-5 h-5 sm:w-7 sm:h-7 text-green-700" />}
                          {!tree && state === 'tent' && <Tent className="w-5 h-5 sm:w-7 sm:h-7 text-orange-500 animate-in fade-in" />}
                          {!tree && state === 'grass' && <Sprout className="w-3.5 h-3.5 sm:w-5 sm:h-5 text-green-500 opacity-80" />}
                        </div>
                      );
                    })}
                  </React.Fragment>
                );
              })}
            </div>

            <p className="text-[11px] text-stone-400 text-center mt-4">
              Pots prémer el botó taronja per aplicar el pas automàticament o fer clic tu mateix/a a les caselles.
            </p>
          </div>
        </div>

        {/* Modal de celebració i síntesi de regles */}
        <AnimatePresence>
          {showCelebration && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm"
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-stone-200 text-center"
              >
                <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Award className="w-9 h-9" />
                </div>

                <h3 className="text-2xl font-black text-stone-900 mb-2">
                  Enhorabona! Ja coneixes el mètode!
                </h3>
                <p className="text-sm text-stone-600 mb-6">
                  Has resolt el tauler sencer utilitzant exclusivament la deducció lògica, sense cap intent fallit.
                </p>

                <div className="bg-stone-50 border border-stone-200 rounded-2xl p-4 text-left mb-6 space-y-2.5 text-xs sm:text-sm">
                  <div className="font-bold text-stone-800 text-sm mb-1 flex items-center gap-1.5 text-orange-600">
                    <Sparkles className="w-4 h-4" /> Les 5 Regles d'Or:
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="font-bold text-orange-600">1.</span>
                    <span><strong>Regla del 0:</strong> Tota fila o columna amb 0 s'omple de gespa.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="font-bold text-orange-600">2.</span>
                    <span><strong>Caselles aïllades:</strong> Caselles que no toquen cap arbre = gespa.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="font-bold text-orange-600">3.</span>
                    <span><strong>Única opció:</strong> Si un arbre només té 1 casella buida = tenda segura.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="font-bold text-orange-600">4.</span>
                    <span><strong>Distància de seguretat:</strong> 8 caselles al voltant d'una tenda = gespa.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="font-bold text-orange-600">5.</span>
                    <span><strong>Línies completes:</strong> Quan s'arriba a la pista, la resta de la línia és gespa.</span>
                  </div>
                </div>

                <button
                  onClick={onComplete}
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3.5 px-6 rounded-2xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 text-base"
                >
                  Comença el Nivell 1
                  <ArrowRight className="w-5 h-5" />
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { Tent, TreePine, Sprout, ArrowRight, ArrowLeft, CheckCircle2, Lightbulb, GraduationCap, Sparkles, HelpCircle, Award, AlertCircle, Check } from 'lucide-react';
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
  validate: (board: CellType[][]) => { valid: boolean; error?: string };
  autoSolve: (prev: CellType[][]) => CellType[][];
}

const TUTORIAL_SIZE = 5;
const TUTORIAL_TREES = [
  { r: 1, c: 2 },
  { r: 3, c: 1 },
  { r: 3, c: 3 }
];
const ROW_CLUES = [1, 0, 0, 1, 1];
const COL_CLUES = [1, 0, 1, 1, 0];

const isTree = (r: number, c: number) => 
  TUTORIAL_TREES.some(t => t.r === r && t.c === c);

export function GuidedTutorial({ onComplete, onExit, allowExit }: GuidedTutorialProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);
  const [feedbackError, setFeedbackError] = useState<string | null>(null);
  const [showHintUsed, setShowHintUsed] = useState(false);

  // Initial empty board
  const [boardState, setBoardState] = useState<CellType[][]>(() => 
    Array.from({ length: TUTORIAL_SIZE }, () => Array(TUTORIAL_SIZE).fill('empty'))
  );

  const STEPS: StepDefinition[] = [
    {
      title: "Comença sense prova-error!",
      badge: "Introducció",
      description: "Molts alumnes comencen col·locant tendes a l'atzar per veure si sona la flauta. Això genera errors i pèrdua de punts! Els bons jugadors utilitzen la lògica: només posem tendes o gespa quan n'estem 100% segurs.",
      hint: "En aquest tutorial hauràs de fer cada pas tu mateix/a. Recorda: 1 clic per posar tenda ⛺, i 2 clics (o clic dret) per posar gespa 🌿.",
      validate: () => ({ valid: true }),
      autoSolve: (prev) => prev.map(row => [...row]),
    },
    {
      title: "Estratègia 1: La Regla del Zero",
      badge: "Pas 1 de 5",
      description: "Observa les pistes exteriors: si una fila o columna té un número 0, és segur que NO hi ha cap tenda! El millor primer pas és omplir totes les caselles buides d'aquestes línies amb gespa per descartar-les.",
      hint: "Fila 1, Fila 2, Columna 1 i Columna 4 tenen un 0. Fes 2 clics a cadascuna de les seves caselles buides per posar-hi gespa!",
      highlightRows: [1, 2],
      highlightCols: [1, 4],
      validate: (board) => {
        // Check rows 1 and 2, cols 1 and 4
        for (let r of [1, 2]) {
          for (let c = 0; c < TUTORIAL_SIZE; c++) {
            if (isTree(r, c)) continue;
            if (board[r][c] === 'tent') {
              return { valid: false, error: "Has col·locat una tenda en una línia amb 0! En aquestes files no hi pot haver cap tenda." };
            }
            if (board[r][c] === 'empty') {
              return { valid: false, error: "Encara et queden caselles per omplir a les files amb 0. Recorda que la gespa són dos clics (o clic dret)!" };
            }
          }
        }
        for (let c of [1, 4]) {
          for (let r = 0; r < TUTORIAL_SIZE; r++) {
            if (isTree(r, c)) continue;
            if (board[r][c] === 'tent') {
              return { valid: false, error: "Has col·locat una tenda a la columna " + (c + 1) + ", que té pista 0! Recorda: fes dos clics per posar gespa." };
            }
            if (board[r][c] === 'empty') {
              return { valid: false, error: "Encara et queden caselles per marcar amb gespa a les columnes amb 0. Fes dos clics a cada casella buida!" };
            }
          }
        }
        // Check no outside cell was filled in this step
        for (let r = 0; r < TUTORIAL_SIZE; r++) {
          for (let c = 0; c < TUTORIAL_SIZE; c++) {
            if (r !== 1 && r !== 2 && c !== 1 && c !== 4 && !isTree(r, c)) {
              if (board[r][c] !== 'empty') {
                return { valid: false, error: "En aquest pas només has de treballar a les files i columnes que tenen 0. Deixa les altres caselles buides de moment." };
              }
            }
          }
        }
        return { valid: true };
      },
      autoSolve: (prev) => {
        const next = prev.map(row => [...row]);
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
      hint: "Fixa't en la cantonada superior esquerra (0, 0): no toca cap arbre. Fes 2 clics per marcar-la amb gespa!",
      highlightCells: [{ r: 0, c: 0 }],
      validate: (board) => {
        if (board[0][0] === 'tent') {
          return { valid: false, error: "La casella (0, 0) no toca cap arbre en creu! No hi pot haver cap tenda. Fes un altre clic per posar-hi gespa." };
        }
        if (board[0][0] === 'empty') {
          return { valid: false, error: "Fes 2 clics (o clic dret) a la casella superior esquerra (0, 0) per marcar-la amb gespa." };
        }
        return { valid: true };
      },
      autoSolve: (prev) => {
        const next = prev.map(row => [...row]);
        next[0][0] = 'grass';
        return next;
      }
    },
    {
      title: "Estratègia 3: Arbre amb una sola casella lliure (Tenda segura!)",
      badge: "Pas 3 de 5",
      description: "Fixa't en l'arbre superior (fila 2, columna 3). Al seu voltant ja hem descartat la dreta, l'esquerra i la part inferior. Només li queda UNA casella lliure a dalt (0, 2)! Com que tot arbre ha de tenir una tenda, aquesta tenda va aquí obligatòriament.",
      hint: "Fes 1 sol clic a la casella (0, 2) per col·locar la tenda segura de l'arbre!",
      highlightTrees: [{ r: 1, c: 2 }],
      highlightCells: [{ r: 0, c: 2 }],
      validate: (board) => {
        if (board[0][2] === 'empty') {
          return { valid: false, error: "Fes 1 clic a la casella ressaltada (0, 2) per posar-hi la tenda." };
        }
        if (board[0][2] === 'grass') {
          return { valid: false, error: "A la casella (0, 2) hi va una tenda, no gespa! Fes clic fins que aparegui la tenda taronja." };
        }
        return { valid: true };
      },
      autoSolve: (prev) => {
        const next = prev.map(row => [...row]);
        next[0][2] = 'tent';
        return next;
      }
    },
    {
      title: "Estratègia 4: El voltant de la tenda i línies completades",
      badge: "Pas 4 de 5",
      description: "Recorda: dues tendes mai no poden tocar-se, ni tan sols en diagonal! Quan poses una tenda, totes les caselles del seu voltant han de ser gespa. A més, si una fila o columna ja té el número de tendes que demanava, la resta de la línia és gespa!",
      hint: "La fila 0 i la columna 2 ja tenen la seva tenda (pista 1). Marca amb gespa (2 clics) les caselles (0, 3), (3, 2) i (4, 2)!",
      highlightCells: [{ r: 0, c: 3 }, { r: 3, c: 2 }, { r: 4, c: 2 }],
      validate: (board) => {
        const targets = [{ r: 0, c: 3 }, { r: 3, c: 2 }, { r: 4, c: 2 }];
        for (let t of targets) {
          if (board[t.r][t.c] === 'tent') {
            return { valid: false, error: "Has posat una tenda on no toca! Recorda que la columna 2 ja té la seva tenda i no es poden tocar entre elles. Posa-hi gespa (2 clics)." };
          }
          if (board[t.r][t.c] === 'empty') {
            return { valid: false, error: "Encara et falten caselles ressaltades per marcar amb gespa. Recorda: dos clics (o clic dret)!" };
          }
        }
        return { valid: true };
      },
      autoSolve: (prev) => {
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
      description: "Mira ara l'arbre inferior esquerre (3, 1): només té la casella (3, 0) lliure -> segona tenda segura! A sota seu (4, 0) ha de ser gespa perquè no es toquin. I a la fila 4 només queda (4, 3) lliure per a la darrera tenda!",
      hint: "1 clic a (3, 0) per posar tenda, 2 clics a (4, 0) per posar gespa, i 1 clic a (4, 3) per posar la darrera tenda!",
      highlightCells: [{ r: 3, c: 0 }, { r: 4, c: 0 }, { r: 4, c: 3 }],
      validate: (board) => {
        if (board[3][0] !== 'tent') {
          return { valid: false, error: "Falta col·locar la tenda a la casella (3, 0) (a l'esquerra de l'arbre)." };
        }
        if (board[4][0] !== 'grass') {
          return { valid: false, error: "La casella (4, 0) toca la tenda de sobre: posa-hi gespa (2 clics) perquè dues tendes no es toquin!" };
        }
        if (board[4][3] !== 'tent') {
          return { valid: false, error: "Falta col·locar la darrera tenda a la casella (4, 3) (1 clic)." };
        }
        return { valid: true };
      },
      autoSolve: (prev) => {
        const next = prev.map(row => [...row]);
        next[3][0] = 'tent';
        next[4][0] = 'grass';
        next[4][3] = 'tent';
        return next;
      }
    }
  ];

  const currentStepData = STEPS[currentStep];
  const stepValidation = currentStepData.validate(boardState);
  const isStepValid = stepValidation.valid;

  // Clear error message when board changes to valid
  useEffect(() => {
    if (isStepValid) {
      setFeedbackError(null);
    }
  }, [isStepValid]);

  const handleNextStep = () => {
    const check = currentStepData.validate(boardState);
    if (!check.valid) {
      setFeedbackError(check.error || "Aquest pas encara no és correcte. Revisa les indicacions!");
      return;
    }

    setFeedbackError(null);
    setShowHintUsed(false);

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

  const handleHelpWithStep = () => {
    const solved = currentStepData.autoSolve(boardState);
    setBoardState(solved);
    setShowHintUsed(true);
    setFeedbackError(null);
  };

  const handlePrevStep = () => {
    if (currentStep > 0) {
      let st: CellType[][] = Array.from({ length: TUTORIAL_SIZE }, () => Array(TUTORIAL_SIZE).fill('empty'));
      for (let i = 0; i < currentStep; i++) {
        st = STEPS[i].autoSolve(st);
      }
      setBoardState(st);
      setCurrentStep(prev => prev - 1);
      setFeedbackError(null);
      setShowHintUsed(false);
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
                  Tutorial Obligatori
                </span>
              </div>
              <p className="text-sm text-stone-500">Aprèn a resoldre amb lògica pas a pas sense prova-error</p>
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

              <div className="bg-amber-50 border border-amber-200/80 rounded-2xl p-4 text-xs sm:text-sm text-amber-900 font-medium flex items-start gap-2.5 mb-4">
                <Sparkles className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <strong>Què has de fer: </strong>
                  {currentStepData.hint}
                </div>
              </div>

              {/* Estat de validació pas a pas */}
              {currentStep > 0 && (
                <div className="mb-4">
                  {isStepValid ? (
                    <motion.div 
                      initial={{ opacity: 0, y: -5 }} 
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl p-3 text-xs sm:text-sm font-semibold flex items-center gap-2"
                    >
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                      Molt bé! Has completat aquest pas correctament. Prem el botó per continuar!
                    </motion.div>
                  ) : feedbackError ? (
                    <motion.div 
                      initial={{ opacity: 0, y: -5 }} 
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-3 text-xs sm:text-sm font-medium flex items-start gap-2"
                    >
                      <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                      <div>{feedbackError}</div>
                    </motion.div>
                  ) : (
                    <div className="bg-stone-50 border border-stone-200 text-stone-600 rounded-xl p-3 text-xs flex items-center gap-2 font-medium">
                      <HelpCircle className="w-4 h-4 text-stone-400 shrink-0" />
                      Fes els canvis al tauler de la dreta. Quan estiguis llest/a, prem comprovar!
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Botons d'acció */}
            <div className="flex flex-col gap-3 pt-3 border-t border-stone-100">
              <div className="flex flex-col sm:flex-row items-center gap-3">
                {currentStep > 0 && (
                  <button
                    onClick={handlePrevStep}
                    className="w-full sm:w-auto flex items-center justify-center gap-1.5 px-4 py-3 rounded-xl border border-stone-300 text-stone-700 hover:bg-stone-100 font-medium text-sm transition-colors"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Pas anterior
                  </button>
                )}

                <button
                  onClick={handleNextStep}
                  className={cn(
                    "w-full sm:flex-1 font-bold py-3.5 px-6 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 text-sm sm:text-base",
                    isStepValid
                      ? "bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-200 hover:shadow-lg"
                      : "bg-orange-500 hover:bg-orange-600 text-white shadow-orange-200"
                  )}
                >
                  {currentStep === 0 ? (
                    <>
                      Comença el repte guiat
                      <ArrowRight className="w-5 h-5" />
                    </>
                  ) : isStepValid ? (
                    currentStep === STEPS.length - 1 ? (
                      <>
                        Completar tutorial
                        <CheckCircle2 className="w-5 h-5" />
                      </>
                    ) : (
                      <>
                        Correcte! Següent pas
                        <ArrowRight className="w-5 h-5" />
                      </>
                    )
                  ) : (
                    <>
                      Comprovar aquest pas
                      <Check className="w-5 h-5" />
                    </>
                  )}
                </button>
              </div>

              {/* Botó d'ajuda si l'alumne es troba encallat */}
              {currentStep > 0 && !isStepValid && (
                <div className="text-center">
                  <button
                    onClick={handleHelpWithStep}
                    className="text-xs text-stone-500 hover:text-amber-800 hover:underline transition-colors inline-flex items-center gap-1 font-medium"
                  >
                    <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
                    No saps com seguir? Ajuda'm a completar aquest pas
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Tauler del tutorial */}
          <div className="md:col-span-2 bg-white p-5 sm:p-6 rounded-3xl shadow-sm border border-stone-200 flex flex-col items-center">
            <div className="text-xs font-semibold uppercase tracking-wider text-stone-400 mb-2 flex items-center gap-1">
              <HelpCircle className="w-4 h-4" /> Tauler didàctic (5x5)
            </div>

            {/* Indicador de controls ben visible */}
            <div className="bg-stone-50 border border-stone-200 rounded-xl px-3 py-1.5 mb-4 text-[11px] text-stone-600 font-medium text-center w-full">
              👆 <strong>1 clic:</strong> Tenda (⛺) | ✌️ <strong>2 clics / clic dret:</strong> Gespa (🌿)
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

            <p className="text-[11px] text-stone-400 text-center mt-3">
              Fes clic directament a les caselles ressaltades per practicar la deducció.
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
                    <span><strong>Regla del 0:</strong> Tota fila o columna amb 0 s'omple de gespa (2 clics).</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="font-bold text-orange-600">2.</span>
                    <span><strong>Caselles aïllades:</strong> Caselles que no toquen cap arbre = gespa.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="font-bold text-orange-600">3.</span>
                    <span><strong>Única opció:</strong> Si un arbre només té 1 casella buida = tenda segura (1 clic).</span>
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

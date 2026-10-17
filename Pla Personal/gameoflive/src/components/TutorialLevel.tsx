import React, { useState } from 'react';
import { ArrowRight, Check, RotateCcw, Lightbulb, Sparkles, Brain, CheckCircle2, ChevronRight, Eye } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface TutorialLevelProps {
  onComplete: () => void;
  onSkip: () => void;
}

const TUTORIAL_INITIAL = [
  [0, 0, 0, 0],
  [0, 1, 1, 0],
  [0, 1, 0, 0],
  [0, 0, 0, 0],
];

const TUTORIAL_EXPECTED = [
  [0, 0, 0, 0],
  [0, 1, 1, 0],
  [0, 1, 1, 0],
  [0, 0, 0, 0],
];

export function TutorialLevel({ onComplete, onSkip }: TutorialLevelProps) {
  const [activeStep, setActiveStep] = useState<1 | 2 | 3>(1);
  const [playerGrid, setPlayerGrid] = useState<number[][]>(() =>
    Array(4).fill(0).map(() => Array(4).fill(0))
  );
  const [isChecked, setIsChecked] = useState(false);
  const [showError, setShowError] = useState(false);

  const toggleCell = (r: number, c: number) => {
    if (isChecked) return;
    const next = playerGrid.map(row => [...row]);
    next[r][c] = next[r][c] === 1 ? 0 : 1;
    setPlayerGrid(next);
  };

  const handleCheck = () => {
    const isCorrect = JSON.stringify(playerGrid) === JSON.stringify(TUTORIAL_EXPECTED);
    if (isCorrect) {
      setIsChecked(true);
      setShowError(false);
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#10b981', '#3b82f6', '#8b5cf6'],
      });
    } else {
      setShowError(true);
      setTimeout(() => setShowError(false), 3500);
    }
  };

  const handleReset = () => {
    setPlayerGrid(Array(4).fill(0).map(() => Array(4).fill(0)));
    setIsChecked(false);
    setShowError(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-800">
      {/* Header del Tutorial */}
      <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center">
            <Lightbulb className="w-6 h-6 text-amber-600" />
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 mb-0.5">
              Nivell 0 · Entrenament
            </div>
            <h1 className="text-xl font-bold leading-tight text-slate-900">Tutorial Guiat: Bones Tècniques</h1>
          </div>
        </div>

        <button
          onClick={onSkip}
          className="text-sm font-semibold text-slate-500 hover:text-slate-800 px-4 py-2 rounded-xl hover:bg-slate-100 transition-colors flex items-center gap-1.5 cursor-pointer"
        >
          <span>Saltar al Nivell 1</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </header>

      {/* Contingut Principal */}
      <main className="flex-1 max-w-5xl w-full mx-auto p-4 sm:p-6 flex flex-col">
        {/* Banner explicatiu amb pestanyes de tècnica */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 mb-6">
          <h2 className="text-base sm:text-lg font-bold text-slate-800 mb-3 flex items-center gap-2">
            <Brain className="w-5 h-5 text-blue-600" />
            Metodologia per resoldre qualsevol escenari sense bloquejar-te
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <button
              onClick={() => setActiveStep(1)}
              className={cn(
                "p-3 rounded-xl border text-left transition-all cursor-pointer",
                activeStep === 1
                  ? "border-blue-500 bg-blue-50/70 shadow-sm"
                  : "border-slate-200 hover:border-slate-300 bg-slate-50/50"
              )}
            >
              <div className="flex items-center gap-2 font-bold text-sm text-slate-800 mb-1">
                <span className={cn(
                  "w-5 h-5 rounded-full flex items-center justify-center text-xs",
                  activeStep === 1 ? "bg-blue-600 text-white" : "bg-slate-200 text-slate-700"
                )}>1</span>
                Tècnica 1: Cèl·lules Vives
              </div>
              <p className="text-xs text-slate-600">
                No miris tota la graella de cop. Compta els veïns només de les cel·les verdes en la seva caixa 3x3.
              </p>
            </button>

            <button
              onClick={() => setActiveStep(2)}
              className={cn(
                "p-3 rounded-xl border text-left transition-all cursor-pointer",
                activeStep === 2
                  ? "border-amber-500 bg-amber-50/70 shadow-sm"
                  : "border-slate-200 hover:border-slate-300 bg-slate-50/50"
              )}
            >
              <div className="flex items-center gap-2 font-bold text-sm text-slate-800 mb-1">
                <span className={cn(
                  "w-5 h-5 rounded-full flex items-center justify-center text-xs",
                  activeStep === 2 ? "bg-amber-600 text-white" : "bg-slate-200 text-slate-700"
                )}>2</span>
                Tècnica 2: Filtra les Mortes
              </div>
              <p className="text-xs text-slate-600">
                Descarta el 90% de cel·les blanques llunyanes. Revisa només les adjacents que toquen 3 vives.
              </p>
            </button>

            <button
              onClick={() => setActiveStep(3)}
              className={cn(
                "p-3 rounded-xl border text-left transition-all cursor-pointer",
                activeStep === 3
                  ? "border-emerald-500 bg-emerald-50/70 shadow-sm"
                  : "border-slate-200 hover:border-slate-300 bg-slate-50/50"
              )}
            >
              <div className="flex items-center gap-2 font-bold text-sm text-slate-800 mb-1">
                <span className={cn(
                  "w-5 h-5 rounded-full flex items-center justify-center text-xs",
                  activeStep === 3 ? "bg-emerald-600 text-white" : "bg-slate-200 text-slate-700"
                )}>3</span>
                Tècnica 3: Dibuixa i Valida
              </div>
              <p className="text-xs text-slate-600">
                Aplica la combinació (supervivents + nous naixements) a la quadrícula de predicció.
              </p>
            </button>
          </div>

          {/* Explicació dinàmica del pas actiu */}
          <div className="mt-4 p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-700 leading-relaxed">
            {activeStep === 1 && (
              <div>
                <strong className="text-blue-700 font-semibold">Pas 1 a l'exemple:</strong> Mira les 3 cèl·lules verdes a l'Estat Inicial.
                La de dalt a la dreta té 2 veïns vius, la de dalt a l'esquerra té 2 veïns vius, i la de sota té 2 veïns vius. 
                Segons la <em>Regla de Supervivència (2 o 3 veïns)</em>, <strong>totes 3 sobreviuran!</strong>
              </div>
            )}
            {activeStep === 2 && (
              <div>
                <strong className="text-amber-700 font-semibold">Pas 2 a l'exemple:</strong> La majoria de caselles blanques estan buides i tenen 0 o 1 veí. 
                Però fixa't en la cantonada buida que envolten les tres verdes: <strong>té exactament 3 veïns vius!</strong>
                Segons la <em>Regla de Reproducció</em>, <strong>aquesta cel·la renaixerà viva!</strong>
              </div>
            )}
            {activeStep === 3 && (
              <div>
                <strong className="text-emerald-700 font-semibold">Pas 3 - Solució:</strong> Les 3 cel·les supervivents més la nova cel·la nascuda formen un <strong>quadrat de 2x2 (el Bloc)</strong>.
                Fes clic a la graella de la dreta per dibuixar aquest quadrat de 2x2 i prem «Comprovar».
              </div>
            )}
          </div>
        </div>

        {/* Quadrícules de demostració */}
        <div className="flex flex-col md:flex-row gap-8 items-center justify-center flex-1 my-4">
          {/* Estat Inicial amb pistes visuals */}
          <div className="flex flex-col items-center">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-sm font-bold text-slate-700">Estat Inicial</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-slate-200 text-slate-600 font-medium">Observa</span>
            </div>

            <div className="bg-white p-3 rounded-2xl shadow-sm border border-slate-200 grid grid-cols-4 gap-1.5">
              {TUTORIAL_INITIAL.map((row, r) =>
                row.map((cell, c) => {
                  const isAlive = cell === 1;
                  const isCandidateBirth = r === 2 && c === 2;

                  return (
                    <div
                      key={`tut-init-${r}-${c}`}
                      className={cn(
                        "w-14 h-14 sm:w-16 sm:h-16 rounded-xl flex items-center justify-center font-bold text-xs relative transition-all duration-300",
                        isAlive
                          ? "bg-emerald-500 text-white shadow-md shadow-emerald-500/20"
                          : isCandidateBirth && (activeStep === 2 || activeStep === 3)
                          ? "bg-amber-100 border-2 border-dashed border-amber-500 text-amber-800"
                          : "bg-slate-100 text-slate-400"
                      )}
                    >
                      {isAlive && (
                        <div className="flex flex-col items-center">
                          <span className="text-[10px] uppercase font-bold tracking-tight opacity-75">Viva</span>
                          <span className="text-xs bg-emerald-700/60 px-1.5 rounded-full mt-0.5">2 veïns</span>
                        </div>
                      )}
                      {!isAlive && isCandidateBirth && (activeStep === 2 || activeStep === 3) && (
                        <div className="flex flex-col items-center text-center p-0.5">
                          <span className="text-[10px] font-bold text-amber-900 leading-tight">3 veïns!</span>
                          <span className="text-[9px] text-amber-700 font-medium">Neix</span>
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>

            <div className="mt-3 flex items-center gap-3 text-xs text-slate-500">
              <span className="flex items-center gap-1">
                <span className="w-3 h-3 bg-emerald-500 rounded-sm inline-block" /> Cèl·lules vives
              </span>
              <span className="flex items-center gap-1">
                <span className="w-3 h-3 bg-amber-100 border border-amber-500 rounded-sm inline-block" /> Candidata a néixer
              </span>
            </div>
          </div>

          <div className="hidden md:flex items-center justify-center text-slate-300">
            <ArrowRight className="w-8 h-8" />
          </div>

          {/* Quadrícula del Jugador */}
          <div className="flex flex-col items-center">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-sm font-bold text-slate-700">La teva predicció</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 font-medium">Fes clic aquí</span>
            </div>

            <div
              className={cn(
                "bg-white p-3 rounded-2xl shadow-sm border-2 grid grid-cols-4 gap-1.5 transition-colors duration-300",
                isChecked ? "border-emerald-400 bg-emerald-50/40" : "border-blue-200"
              )}
            >
              {playerGrid.map((row, r) =>
                row.map((cell, c) => {
                  const isPlayerLive = cell === 1;
                  const isExpectedLive = TUTORIAL_EXPECTED[r][c] === 1;

                  let cellClass = "bg-slate-100 hover:bg-slate-200 cursor-pointer";
                  if (!isChecked) {
                    if (isPlayerLive) cellClass = "bg-blue-500 shadow-md shadow-blue-500/20 hover:bg-blue-600";
                  } else {
                    if (isPlayerLive && isExpectedLive) cellClass = "bg-emerald-500 shadow-md text-white";
                    else if (!isPlayerLive && isExpectedLive) cellClass = "bg-emerald-200 border-2 border-emerald-500 border-dashed";
                    else if (isPlayerLive && !isExpectedLive) cellClass = "bg-red-500 shadow-md";
                  }

                  return (
                    <button
                      key={`tut-player-${r}-${c}`}
                      onClick={() => toggleCell(r, c)}
                      disabled={isChecked}
                      className={cn(
                        "w-14 h-14 sm:w-16 sm:h-16 rounded-xl transition-all duration-200 flex items-center justify-center cursor-pointer",
                        cellClass
                      )}
                      aria-label={`Casella ${r}, ${c}`}
                    >
                      {isChecked && isPlayerLive && isExpectedLive && (
                        <Check className="w-6 h-6 text-white stroke-[3]" />
                      )}
                    </button>
                  );
                })
              )}
            </div>

            <div className="mt-3 text-xs text-slate-500 text-center">
              Fes clic a les caselles per activar o desactivar cèl·lules
            </div>
          </div>
        </div>

        {/* Accions de comprovació */}
        <div className="mt-6 flex flex-col items-center gap-3">
          <AnimatePresence mode="wait">
            {!isChecked ? (
              <motion.div
                key="tut-actions"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex flex-col items-center gap-3"
              >
                <div className="flex gap-3">
                  <button
                    onClick={handleReset}
                    className="py-2.5 px-5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-xl text-sm font-medium transition-colors flex items-center gap-2 cursor-pointer"
                  >
                    <RotateCcw className="w-4 h-4" />
                    Netejar
                  </button>
                  <button
                    onClick={handleCheck}
                    className="py-2.5 px-8 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-bold shadow-md hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer"
                  >
                    <Check className="w-4 h-4" />
                    Comprovar predicció
                  </button>
                </div>

                <AnimatePresence>
                  {showError && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="text-red-600 font-medium bg-red-50 px-4 py-2 rounded-xl text-xs sm:text-sm border border-red-200"
                    >
                      Recorda: han de quedar vives les 3 inicials (superviuen) i la casella que toquen les tres (reneix). En total, un quadrat 2x2!
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ) : (
              <motion.div
                key="tut-success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center gap-4 bg-emerald-50 border border-emerald-200 p-5 rounded-2xl max-w-lg w-full text-center"
              >
                <div className="w-12 h-12 bg-emerald-500 text-white rounded-full flex items-center justify-center mx-auto shadow-md">
                  <Sparkles className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-emerald-900">Molt bé! Has dominat la tècnica!</h3>
                  <p className="text-xs sm:text-sm text-emerald-800 mt-1">
                    Ja saps com analitzar primer les cèl·lules vives i després cercar només les mortes adjacents amb 3 veïns.
                    Aquest entrenament no compta per a la nota, ara estàs preparat per als 20 nivells!
                  </p>
                </div>

                <button
                  onClick={onComplete}
                  className="py-3 px-8 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold shadow-md hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer"
                >
                  <span>Començar el Nivell 1</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}

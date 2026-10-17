import React, { useState } from 'react';
import { ArrowRight, Check, RotateCcw, Lightbulb, Sparkles, Brain, CheckCircle2, ChevronRight, AlertCircle, Eye } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface TutorialLevelProps {
  onComplete: () => void;
}

interface TutorialExample {
  id: number;
  title: string;
  subtitle: string;
  size: number;
  initial: number[][];
  expected: number[][];
  step1Explanation: string;
  step2Explanation: string;
  step3Explanation: string;
  liveNeighborCounts: { r: number; c: number; count: number; outcome: 'mor' | 'viu' }[];
  candidateBirthCells: { r: number; c: number; count: number }[];
}

const EXAMPLES: TutorialExample[] = [
  {
    id: 1,
    title: "Exemple 1 de 3: Solitud i Mort",
    subtitle: "Comprendre com les cèl·lules aïllades moren quan tenen menys de 2 veïns",
    size: 3,
    initial: [
      [0, 1, 0],
      [0, 1, 0],
      [0, 0, 0],
    ],
    expected: [
      [0, 0, 0],
      [0, 0, 0],
      [0, 0, 0],
    ],
    liveNeighborCounts: [
      { r: 0, c: 1, count: 1, outcome: 'mor' },
      { r: 1, c: 1, count: 1, outcome: 'mor' },
    ],
    candidateBirthCells: [],
    step1Explanation: "Mira les dues cèl·lules verdes. Cadascuna només toca l'altra (1 veí viu). Com que tenen menys de 2 veïns, ambdues moriran per solitud!",
    step2Explanation: "Cap casella buida toca 3 cèl·lules vives (com a màxim en toquen 2). Per tant, cap cèl·lula buida pot renéixer per reproducció.",
    step3Explanation: "Com que les dues verdes moren i cap buida reneix, a la següent generació tota la quadrícula quedarà buida! Deixa totes les caselles en blanc i prem Comprovar.",
  },
  {
    id: 2,
    title: "Exemple 2 de 3: Reproducció i Naixement",
    subtitle: "Comprendre quan reneix una cèl·lula morta en tocar exactament 3 veïns vius",
    size: 3,
    initial: [
      [1, 1, 0],
      [1, 0, 0],
      [0, 0, 0],
    ],
    expected: [
      [1, 1, 0],
      [1, 1, 0],
      [0, 0, 0],
    ],
    liveNeighborCounts: [
      { r: 0, c: 0, count: 2, outcome: 'viu' },
      { r: 0, c: 1, count: 2, outcome: 'viu' },
      { r: 1, c: 0, count: 2, outcome: 'viu' },
    ],
    candidateBirthCells: [
      { r: 1, c: 1, count: 3 },
    ],
    step1Explanation: "Analitzem les 3 cèl·lules verdes. Cadascuna té exactament 2 veïns vius. Segons la Regla de Supervivència (2 o 3 veïns), totes tres sobreviuran!",
    step2Explanation: "Descarta les cel·les blanques allunyades. Fixa't en la cantonada buida del mig: toca exactament les 3 cèl·lules verdes! Segons la Regla de Reproducció, aquesta cel·la reneix!",
    step3Explanation: "Les 3 supervivents més la nova cèl·lula nascuda formen un quadrat de 2x2 (el Bloc). Fes clic a les 4 caselles per dibuixar-les i prem Comprovar.",
  },
  {
    id: 3,
    title: "Exemple 3 de 3: Supervivència, Mort i Naixement Combinats",
    subtitle: "Comprendre com es combina tot alhora per transformar una línia horitzontal en vertical",
    size: 3,
    initial: [
      [0, 0, 0],
      [1, 1, 1],
      [0, 0, 0],
    ],
    expected: [
      [0, 1, 0],
      [0, 1, 0],
      [0, 1, 0],
    ],
    liveNeighborCounts: [
      { r: 1, c: 0, count: 1, outcome: 'mor' },
      { r: 1, c: 1, count: 2, outcome: 'viu' },
      { r: 1, c: 2, count: 1, outcome: 'mor' },
    ],
    candidateBirthCells: [
      { r: 0, c: 1, count: 3 },
      { r: 2, c: 1, count: 3 },
    ],
    step1Explanation: "Revisem les 3 cèl·lules vives de la línia: Els 2 extrems només toquen 1 veí viu i per tant MOREN per solitud (✕). Només la cèl·lula central té 2 veïns vius i SOBREVIU (✓).",
    step2Explanation: "Busquem caselles blanques amb exactament 3 veïns: La de dalt i la de sota toquen totes dues les 3 cèl·lules de la línia i RENEIXEN (✨). Recorda: Dels 3 originals només la central es manté viva, els 2 extrems moren!",
    step3Explanation: "Combinem-ho tot a la quadrícula de predicció: Els 2 extrems s'apaguen (moren), el centre segueix encès (sobreviu) i s'encenen la de dalt i la de sota (neixen). La línia horitzontal esdevé una línia vertical! Marca les 3 caselles verticals i prem Comprovar.",
  },
];

export function TutorialLevel({ onComplete }: TutorialLevelProps) {
  const [exampleIndex, setExampleIndex] = useState(0);
  const [activeStep, setActiveStep] = useState<1 | 2 | 3>(1);
  const [maxStepReached, setMaxStepReached] = useState<1 | 2 | 3>(1);

  const currentExample = EXAMPLES[exampleIndex];

  const [playerGrid, setPlayerGrid] = useState<number[][]>(() =>
    Array(currentExample.size).fill(0).map(() => Array(currentExample.size).fill(0))
  );
  const [isChecked, setIsChecked] = useState(false);
  const [showError, setShowError] = useState(false);

  // Quan canviem d'exemple, reiniciem estat
  const goToExample = (idx: number) => {
    setExampleIndex(idx);
    setActiveStep(1);
    setMaxStepReached(1);
    setPlayerGrid(Array(EXAMPLES[idx].size).fill(0).map(() => Array(EXAMPLES[idx].size).fill(0)));
    setIsChecked(false);
    setShowError(false);
  };

  const handleStepClick = (step: 1 | 2 | 3) => {
    // Només es pot anar als passos ja desbloquejats
    if (step <= maxStepReached) {
      setActiveStep(step);
    }
  };

  const advanceToStep = (nextStep: 2 | 3) => {
    setActiveStep(nextStep);
    if (nextStep > maxStepReached) {
      setMaxStepReached(nextStep);
    }
  };

  const toggleCell = (r: number, c: number) => {
    if (activeStep !== 3 || isChecked) return;
    const next = playerGrid.map(row => [...row]);
    next[r][c] = next[r][c] === 1 ? 0 : 1;
    setPlayerGrid(next);
  };

  const handleCheck = () => {
    const isCorrect = JSON.stringify(playerGrid) === JSON.stringify(currentExample.expected);
    if (isCorrect) {
      setIsChecked(true);
      setShowError(false);
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#10b981', '#3b82f6', '#f59e0b'],
      });
    } else {
      setShowError(true);
      setTimeout(() => setShowError(false), 4000);
    }
  };

  const handleNextExample = () => {
    if (exampleIndex < EXAMPLES.length - 1) {
      goToExample(exampleIndex + 1);
    } else {
      onComplete();
    }
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
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-900 mb-0.5">
              Tutorial Guiat Obligatori · {currentExample.title}
            </div>
            <h1 className="text-xl font-bold leading-tight text-slate-900">{currentExample.subtitle}</h1>
          </div>
        </div>

        {/* Indicador de 3 exemples */}
        <div className="flex items-center gap-2">
          {EXAMPLES.map((ex, i) => (
            <div
              key={ex.id}
              className={cn(
                "px-3 py-1 rounded-full text-xs font-bold transition-all flex items-center gap-1",
                i === exampleIndex
                  ? "bg-blue-600 text-white shadow-sm"
                  : i < exampleIndex
                  ? "bg-emerald-100 text-emerald-800"
                  : "bg-slate-100 text-slate-400"
              )}
            >
              {i < exampleIndex && <Check className="w-3 h-3 stroke-[3]" />}
              <span>Ex. {i + 1}/3</span>
            </div>
          ))}
        </div>
      </header>

      {/* Contingut Principal */}
      <main className="flex-1 max-w-5xl w-full mx-auto p-4 sm:p-6 flex flex-col">
        {/* Caixa de Metodologia: Passos 1 -> 2 -> 3 */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
            <h2 className="text-base sm:text-lg font-extrabold text-slate-800 flex items-center gap-2">
              <Brain className="w-5 h-5 text-blue-600" />
              Metodologia Pas a Pas: Segueix l'ordre 1 ➔ 2 ➔ 3
            </h2>
            <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-lg">
              Has d'avançar pas a pas per desbloquejar la solució
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {/* Pas 1 */}
            <div
              onClick={() => handleStepClick(1)}
              className={cn(
                "p-3.5 rounded-xl border text-left transition-all",
                activeStep === 1
                  ? "border-blue-600 bg-blue-50/80 shadow-md ring-2 ring-blue-500/20"
                  : "border-slate-200 bg-slate-50/60 opacity-80 cursor-pointer hover:opacity-100"
              )}
            >
              <div className="flex items-center justify-between font-bold text-sm text-slate-900 mb-1">
                <span className="flex items-center gap-1.5">
                  <span className={cn(
                    "w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold",
                    activeStep === 1 ? "bg-blue-600 text-white" : "bg-slate-300 text-slate-700"
                  )}>1</span>
                  Tècnica 1: Cèl·lules Vives
                </span>
                {maxStepReached > 1 && <Check className="w-4 h-4 text-emerald-600 stroke-[3]" />}
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                No miris tota la graella de cop. Compta els veïns de cada cèl·lula viva (verda) a la seva àrea 3x3.
              </p>
            </div>

            {/* Pas 2 */}
            <div
              onClick={() => handleStepClick(2)}
              className={cn(
                "p-3.5 rounded-xl border text-left transition-all",
                activeStep === 2
                  ? "border-amber-600 bg-amber-50/80 shadow-md ring-2 ring-amber-500/20"
                  : maxStepReached >= 2
                  ? "border-slate-200 bg-slate-50/60 opacity-80 cursor-pointer hover:opacity-100"
                  : "border-slate-200 bg-slate-100/50 opacity-40 cursor-not-allowed"
              )}
            >
              <div className="flex items-center justify-between font-bold text-sm text-slate-900 mb-1">
                <span className="flex items-center gap-1.5">
                  <span className={cn(
                    "w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold",
                    activeStep === 2 ? "bg-amber-600 text-white" : "bg-slate-300 text-slate-700"
                  )}>2</span>
                  Tècnica 2: Filtra les Mortes
                </span>
                {maxStepReached > 2 && <Check className="w-4 h-4 text-emerald-600 stroke-[3]" />}
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Descarta el 90% de cel·les blanques. Revisa només les que toquen cèl·lules vives: si en toquen 3, reneixen!
              </p>
            </div>

            {/* Pas 3 */}
            <div
              onClick={() => handleStepClick(3)}
              className={cn(
                "p-3.5 rounded-xl border text-left transition-all",
                activeStep === 3
                  ? "border-emerald-600 bg-emerald-50/80 shadow-md ring-2 ring-emerald-500/20"
                  : maxStepReached >= 3
                  ? "border-slate-200 bg-slate-50/60 opacity-80 cursor-pointer hover:opacity-100"
                  : "border-slate-200 bg-slate-100/50 opacity-40 cursor-not-allowed"
              )}
            >
              <div className="flex items-center justify-between font-bold text-sm text-slate-900 mb-1">
                <span className="flex items-center gap-1.5">
                  <span className={cn(
                    "w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold",
                    activeStep === 3 ? "bg-emerald-600 text-white" : "bg-slate-300 text-slate-700"
                  )}>3</span>
                  Tècnica 3: Dibuixa i Valida
                </span>
                {isChecked && <Check className="w-4 h-4 text-emerald-600 stroke-[3]" />}
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Aplica la combinació (supervivents + nous naixements) a la quadrícula de predicció i comprova.
              </p>
            </div>
          </div>

          {/* Banner explicatiu interactiu amb botó de passar al següent pas */}
          <div className="mt-4 p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="text-xs sm:text-sm text-slate-800 leading-relaxed">
              {activeStep === 1 && (
                <div>
                  <span className="font-bold text-blue-700 uppercase tracking-wider text-xs block mb-1">Pas 1 actiu:</span>
                  {currentExample.step1Explanation}
                </div>
              )}
              {activeStep === 2 && (
                <div>
                  <span className="font-bold text-amber-700 uppercase tracking-wider text-xs block mb-1">Pas 2 actiu:</span>
                  {currentExample.step2Explanation}
                </div>
              )}
              {activeStep === 3 && (
                <div>
                  <span className="font-bold text-emerald-700 uppercase tracking-wider text-xs block mb-1">Pas 3 actiu:</span>
                  {currentExample.step3Explanation}
                </div>
              )}
            </div>

            {/* Botons per forçar l'avançament pas a pas */}
            <div className="shrink-0">
              {activeStep === 1 && (
                <button
                  onClick={() => advanceToStep(2)}
                  className="w-full sm:w-auto py-2.5 px-5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs sm:text-sm font-bold shadow transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Anar al Pas 2 (Cèl·lules Mortes)</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
              {activeStep === 2 && (
                <button
                  onClick={() => advanceToStep(3)}
                  className="w-full sm:w-auto py-2.5 px-5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs sm:text-sm font-bold shadow transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Anar al Pas 3 (Dibuixar Solució)</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
              {activeStep === 3 && (
                <div className="text-xs font-semibold text-emerald-700 bg-emerald-100/70 px-3 py-1.5 rounded-lg text-center">
                  Graella de predicció desbloquejada!
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Quadrícules Interactives */}
        <div className="flex flex-col md:flex-row gap-8 items-center justify-center flex-1 my-4">
          {/* Estat Inicial amb pistes segons el pas */}
          <div className="flex flex-col items-center">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-sm font-bold text-slate-700">Estat Inicial</span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-200 text-slate-700 font-semibold">
                {activeStep === 1 ? 'Pas 1: Recompte Veïns' : activeStep === 2 ? 'Pas 2: Naixements' : 'Referència'}
              </span>
            </div>

            <div
              className="bg-white p-3 rounded-2xl shadow-sm border border-slate-200 grid gap-2"
              style={{ gridTemplateColumns: `repeat(${currentExample.size}, minmax(0, 1fr))` }}
            >
              {currentExample.initial.map((row, r) =>
                row.map((cell, c) => {
                  const isAlive = cell === 1;
                  const liveInfo = currentExample.liveNeighborCounts.find(item => item.r === r && item.c === c);
                  const candidateInfo = currentExample.candidateBirthCells.find(item => item.r === r && item.c === c);

                  const willDie = isAlive && liveInfo?.outcome === 'mor';
                  const willSurvive = isAlive && liveInfo?.outcome === 'viu';

                  return (
                    <div
                      key={`tut-init-${r}-${c}`}
                      className={cn(
                        "w-16 h-16 sm:w-20 sm:h-20 rounded-xl flex items-center justify-center font-bold text-xs relative transition-all duration-300",
                        willSurvive
                          ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/30 border-2 border-emerald-400"
                          : willDie
                          ? activeStep === 1
                            ? "bg-red-500 text-white shadow-md border-2 border-red-600"
                            : "bg-red-50 border-2 border-red-300 text-red-700"
                          : candidateInfo && activeStep >= 2
                          ? "bg-amber-100 border-2 border-dashed border-amber-500 text-amber-900 shadow-sm"
                          : "bg-slate-100 text-slate-400"
                      )}
                    >
                      {/* Cèl·lula viva que MOR */}
                      {willDie && (
                        <div className="flex flex-col items-center text-center p-1">
                          <span className={cn(
                            "text-[10px] font-semibold",
                            activeStep === 1 ? "text-red-100" : "text-red-600"
                          )}>
                            {liveInfo?.count} {liveInfo?.count === 1 ? 'veí' : 'veïns'}
                          </span>
                          <span className={cn(
                            "text-[10px] uppercase font-black px-1.5 py-0.5 rounded-md mt-0.5 shadow-sm",
                            activeStep === 1 ? "bg-red-900 text-white" : "bg-red-600 text-white"
                          )}>
                            Mor ✕
                          </span>
                        </div>
                      )}

                      {/* Cèl·lula viva que SOBREVIU */}
                      {willSurvive && (
                        <div className="flex flex-col items-center text-center p-1">
                          <span className="text-[10px] text-emerald-100 font-semibold">
                            {liveInfo?.count} {liveInfo?.count === 1 ? 'veí' : 'veïns'}
                          </span>
                          <span className="text-[10px] uppercase font-black bg-emerald-800 text-white px-1.5 py-0.5 rounded-md mt-0.5 shadow-sm">
                            Superviu ✓
                          </span>
                        </div>
                      )}

                      {/* Casella buida que RENEIX (en Pas 2 o 3) */}
                      {!isAlive && candidateInfo && activeStep >= 2 && (
                        <div className="flex flex-col items-center text-center p-1 animate-pulse">
                          <span className="text-[10px] font-extrabold text-amber-900">3 veïns!</span>
                          <span className="text-[10px] uppercase font-black bg-amber-500 text-white px-1.5 py-0.5 rounded-md mt-0.5 shadow-sm">
                            Reneix ✨
                          </span>
                        </div>
                      )}

                      {/* Casella buida normal */}
                      {!isAlive && (!candidateInfo || activeStep === 1) && (
                        <span className="text-[10px] text-slate-300 font-medium">Buida</span>
                      )}
                    </div>
                  );
                })
              )}
            </div>

            <div className="mt-3 flex flex-wrap items-center justify-center gap-3 text-xs text-slate-600">
              <span className="flex items-center gap-1.5">
                <span className="w-3.5 h-3.5 bg-emerald-600 border border-emerald-700 rounded-md inline-block shadow-sm" /> 
                <span className="font-medium">Superviu (segueix viva)</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3.5 h-3.5 bg-red-500 border border-red-700 rounded-md inline-block shadow-sm" /> 
                <span className="font-medium">Mor (s'apaga)</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3.5 h-3.5 bg-amber-100 border-2 border-dashed border-amber-500 rounded-md inline-block" /> 
                <span className="font-medium">Reneix (nova cèl·lula)</span>
              </span>
            </div>
          </div>

          <div className="hidden md:flex items-center justify-center text-slate-300">
            <ArrowRight className="w-8 h-8" />
          </div>

          {/* Quadrícula del Jugador (Predicció) */}
          <div className="flex flex-col items-center">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-sm font-bold text-slate-700">La teva predicció</span>
              <span className={cn(
                "text-xs px-2.5 py-0.5 rounded-full font-semibold",
                activeStep === 3 ? "bg-emerald-100 text-emerald-800" : "bg-slate-200 text-slate-600"
              )}>
                {activeStep === 3 ? 'Desbloquejada · Fes clic' : 'Bloquejada fins al Pas 3'}
              </span>
            </div>

            <div
              className={cn(
                "bg-white p-3 rounded-2xl shadow-sm border-2 grid gap-2 transition-all duration-300 relative",
                activeStep < 3 ? "opacity-60 grayscale-[50%]" : "",
                isChecked ? "border-emerald-400 bg-emerald-50/40" : "border-blue-300"
              )}
              style={{ gridTemplateColumns: `repeat(${currentExample.size}, minmax(0, 1fr))` }}
            >
              {playerGrid.map((row, r) =>
                row.map((cell, c) => {
                  const isPlayerLive = cell === 1;
                  const isExpectedLive = currentExample.expected[r][c] === 1;

                  let cellClass = "bg-slate-100 hover:bg-slate-200 cursor-pointer";
                  if (activeStep < 3) {
                    cellClass = "bg-slate-100 cursor-not-allowed";
                  } else if (!isChecked) {
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
                      disabled={activeStep < 3 || isChecked}
                      className={cn(
                        "w-16 h-16 sm:w-20 sm:h-20 rounded-xl transition-all duration-200 flex items-center justify-center font-bold text-xs",
                        cellClass
                      )}
                      aria-label={`Casella ${r}, ${c}`}
                    >
                      {isChecked && isPlayerLive && isExpectedLive && (
                        <Check className="w-8 h-8 text-white stroke-[3]" />
                      )}
                    </button>
                  );
                })
              )}
            </div>

            <div className="mt-3 text-xs text-slate-500 text-center">
              {activeStep < 3 ? (
                <span className="text-amber-700 font-medium">Completa els passos 1 i 2 per activar aquesta graella</span>
              ) : (
                <span>Fes clic a les caselles per activar o desactivar cèl·lules</span>
              )}
            </div>
          </div>
        </div>

        {/* Accions de comprovació i transició */}
        <div className="mt-4 flex flex-col items-center gap-3">
          <AnimatePresence mode="wait">
            {!isChecked ? (
              <motion.div
                key="tut-actions"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex flex-col items-center gap-3"
              >
                {activeStep === 3 && (
                  <div className="flex gap-3">
                    <button
                      onClick={() => setPlayerGrid(Array(currentExample.size).fill(0).map(() => Array(currentExample.size).fill(0)))}
                      className="py-2.5 px-5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-xl text-sm font-medium transition-colors flex items-center gap-2 cursor-pointer"
                    >
                      <RotateCcw className="w-4 h-4" />
                      Netejar graella
                    </button>
                    <button
                      onClick={handleCheck}
                      className="py-2.5 px-8 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-bold shadow-md hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer"
                    >
                      <Check className="w-4 h-4" />
                      Comprovar predicció
                    </button>
                  </div>
                )}

                <AnimatePresence>
                  {showError && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="text-red-700 font-semibold bg-red-50 px-4 py-2.5 rounded-xl text-xs sm:text-sm border border-red-200 flex items-center gap-2"
                    >
                      <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                      <span>{currentExample.step3Explanation}</span>
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
                  <h3 className="text-lg font-bold text-emerald-900">
                    {exampleIndex < EXAMPLES.length - 1
                      ? `Exemple ${exampleIndex + 1} de 3 superat!`
                      : "Tutorial completat amb èxit!"}
                  </h3>
                  <p className="text-xs sm:text-sm text-emerald-800 mt-1">
                    {exampleIndex < EXAMPLES.length - 1
                      ? "Has aplicat correctament la metodologia. Passem al següent exemple guiat!"
                      : "Ja domines les 3 tècniques per resoldre qualsevol escenari! Ara comença la partida oficial amb els 20 nivells."}
                  </p>
                </div>

                <button
                  onClick={handleNextExample}
                  className="py-3 px-8 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold shadow-md hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer text-sm sm:text-base"
                >
                  <span>
                    {exampleIndex < EXAMPLES.length - 1
                      ? `Continuar a l'Exemple ${exampleIndex + 2} de 3`
                      : "Començar el Nivell 1 Oficial!"}
                  </span>
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

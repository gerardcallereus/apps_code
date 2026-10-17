import React, { useEffect, useRef, useState } from 'react';
import { GameEngine, MachineTelemetry } from '../game/Engine';
import { GameRenderer } from '../game/Renderer';
import { MachineType, LEVELS, LevelConfig } from '../game/levels';

const fallbackConfig: LevelConfig = {
  id: 'wheel',
  name: 'Laboratori',
  desc: 'Laboratori de Màquines Simples',
  emoji: '⚙️',
  bg: 'from-slate-800 to-slate-950',
  texts: {
    sign_intro: 'Benvingut al laboratori interactiu de física i màquines simples!',
    sign_1: 'Estació 1: Experimenta amb les forces i la geometria.',
    sign_2: 'Estació 2: Ajusta els paràmetres físics per vèncer la resistència.',
    sign_3: 'Estació 3: Prova l\'Avantatge Mecànic per assolir la meta!',
    finish: 'Enhorabona! Has completat totes les estacions del laboratori.',
  },
  formulas: {
    sign_intro: {
      equation: 'F = m · a',
      legend: [
        { symbol: 'F', desc: 'Força resultant en Newtons (N)' },
        { symbol: 'm', desc: 'Massa en kg' },
        { symbol: 'a', desc: 'Acceleració en m/s²' },
      ],
    },
  },
  quiz: [
    {
      question: 'Quina d\'aquestes és una màquina simple fonamental?',
      options: ['La Roda', 'El Motor de Combustió', 'L\'Ordinador'],
      correct: 0,
      explanation: 'La roda és una màquina simple que redueix la fricció transformant el lliscament en rodament.',
    },
  ],
  history: [
    {
      title: 'Les Màquines Simples',
      content: 'Els fonaments de l\'enginyeria clàssica.',
      imageIcon: '🏛️',
    },
  ],
};

export const GameCanvas: React.FC<{
  machineId: MachineType;
  onBack: () => void;
  onQuestionAnswered?: (question: string, isCorrect: boolean) => void;
  onLevelComplete?: () => void;
}> = ({ machineId, onBack, onQuestionAnswered, onLevelComplete }) => {
  const levelConfig: LevelConfig = LEVELS[machineId] || fallbackConfig;
  const viewportRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<GameEngine>(new GameEngine(machineId in LEVELS ? machineId : 'wheel'));
  const keys = useRef<{ [key: string]: boolean }>({});
  const lastTime = useRef<number>(performance.now());

  const [canvasSize, setCanvasSize] = useState({ w: 1000, h: 520 });
  const [gameState, setGameState] = useState<'playing' | 'gameover' | 'quiz' | 'history'>('playing');
  const [quizIndex, setQuizIndex] = useState(0);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [quizFeedback, setQuizFeedback] = useState<{ correct: boolean; explanation: string } | null>(null);
  const [activeDialog, setActiveDialog] = useState<string>('sign_intro');
  const [activeInGameQuiz, setActiveInGameQuiz] = useState<string | null>(null);
  const [showTheoryModal, setShowTheoryModal] = useState(false);

  const [telemetry, setTelemetry] = useState<MachineTelemetry>(() => engineRef.current.getTelemetry());
  const [progressPct, setProgressPct] = useState(0);
  const [starsInfo, setStarsInfo] = useState({ collected: 0, total: 0 });
  const [enemiesDefeated, setEnemiesDefeated] = useState(0);

  // Wheel state
  const [wheelSides, setWheelSides] = useState(4);

  // Angry Birds Lever state
  const [leverClass, setLeverClass] = useState<1 | 2 | 3>(1);
  const [leverAngle, setLeverAngle] = useState(45);
  const [leverPower, setLeverPower] = useState(80);

  // Inclined plane state
  const [rampLength, setRampLength] = useState(400);

  // Harbor Crane Pulley state
  const [pulleyStrands, setPulleyStrands] = useState<1 | 2 | 4 | 8>(1);
  const [cargoHooked, setCargoHooked] = useState(false);

  // Viewport resize observer
  useEffect(() => {
    const updateSize = () => {
      if (!viewportRef.current) return;
      const rect = viewportRef.current.getBoundingClientRect();
      if (rect.width > 100 && rect.height > 100) {
        const w = Math.floor(rect.width);
        const h = Math.floor(rect.height);
        setCanvasSize({ w, h });
        import('../game/constants').then((mod) => mod.setCanvasSize(w, h));
      }
    };
    updateSize();
    const observer = new ResizeObserver(updateSize);
    if (viewportRef.current) observer.observe(viewportRef.current);
    window.addEventListener('resize', updateSize);
    return () => {
      observer.disconnect();
      window.removeEventListener('resize', updateSize);
    };
  }, []);

  // Re-init engine when machineId changes
  useEffect(() => {
    const validMachine: MachineType = machineId in LEVELS ? machineId : 'wheel';
    const eng = new GameEngine(validMachine);
    engineRef.current = eng;
    setGameState('playing');
    setQuizIndex(0);
    setHistoryIndex(0);
    setQuizFeedback(null);
    setActiveDialog('sign_intro');
    setActiveInGameQuiz(null);
    setWheelSides(4);
    setLeverClass(1);
    setRampLength(400);
    setPulleyStrands(1);
    setCargoHooked(false);
    setTelemetry(eng.getTelemetry());
  }, [machineId]);

  // Keyboard listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space'].includes(e.code)) {
        e.preventDefault();
      }
      keys.current[e.code] = true;
      if (e.code === 'Space' && machineId === 'pulley') {
        engineRef.current.toggleCargoLatch();
        setCargoHooked(engineRef.current.cargoHooked);
      }
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      keys.current[e.code] = false;
    };
    window.addEventListener('keydown', handleKeyDown, { passive: false });
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [machineId]);

  // Mouse / Touch Aiming for Angry Birds Lever on Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || machineId !== 'lever') return;

    const getCanvasPos = (e: MouseEvent | Touch) => {
      const rect = canvas.getBoundingClientRect();
      const scaleX = canvas.width / rect.width;
      const scaleY = canvas.height / rect.height;
      return {
        x: (e.clientX - rect.left) * scaleX,
        y: (e.clientY - rect.top) * scaleY,
      };
    };

    const handleMouseDown = (e: MouseEvent) => {
      const pos = getCanvasPos(e);
      const eng = engineRef.current;
      const dist = Math.hypot(pos.x - eng.leverPivotX, pos.y - eng.leverPivotY);
      if (dist < 100) {
        eng.startAiming(pos.x, pos.y);
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      const eng = engineRef.current;
      if (eng.isAiming) {
        const pos = getCanvasPos(e);
        eng.updateAiming(pos.x, pos.y);
      }
    };

    const handleMouseUp = () => {
      const eng = engineRef.current;
      if (eng.isAiming) {
        eng.releaseAiming();
      }
    };

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        const pos = getCanvasPos(e.touches[0]);
        const eng = engineRef.current;
        const dist = Math.hypot(pos.x - eng.leverPivotX, pos.y - eng.leverPivotY);
        if (dist < 100) {
          eng.startAiming(pos.x, pos.y);
        }
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      const eng = engineRef.current;
      if (eng.isAiming && e.touches.length > 0) {
        const pos = getCanvasPos(e.touches[0]);
        eng.updateAiming(pos.x, pos.y);
      }
    };

    const handleTouchEnd = () => {
      const eng = engineRef.current;
      if (eng.isAiming) {
        eng.releaseAiming();
      }
    };

    canvas.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    canvas.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('touchend', handleTouchEnd);

    return () => {
      canvas.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      canvas.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [machineId]);

  // Main Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId = 0;
    let frameCount = 0;

    const loop = (time: number) => {
      const delta = time - lastTime.current;
      lastTime.current = time;
      const safeDelta = Math.min(Math.max(delta, 4), 20);

      const eng = engineRef.current;
      const renderer = new GameRenderer(ctx, eng);
      const isBlocked = Boolean(eng.playerState.activeInGameQuiz || showTheoryModal);

      const input = {
        up: !isBlocked && Boolean(keys.current['ArrowUp'] || keys.current['KeyW'] || keys.current['Space']),
        down: !isBlocked && Boolean(keys.current['ArrowDown'] || keys.current['KeyS']),
        left: !isBlocked && Boolean(keys.current['ArrowLeft'] || keys.current['KeyA']),
        right: !isBlocked && Boolean(keys.current['ArrowRight'] || keys.current['KeyD']),
      };

      eng.update(safeDelta, input);
      renderer.render();

      frameCount++;
      if (frameCount % 6 === 0) {
        setTelemetry(eng.getTelemetry());
        if (eng.playerBody) {
          const pct = Math.min(
            100,
            Math.max(0, Math.round(((eng.playerBody.position.x - 240) / Math.max(1, eng.levelEndX - 240)) * 100))
          );
          setProgressPct(pct);
        }
        setStarsInfo({
          collected: eng.playerState.starsCollected,
          total: eng.playerState.totalStars,
        });
        setEnemiesDefeated(eng.playerState.enemiesDefeated);
        setCargoHooked(eng.cargoHooked);
      }

      setGameState((prev) => (prev !== eng.state ? eng.state : prev));
      setActiveDialog((prev) => {
        const cur = eng.playerState.activeDialog || 'sign_intro';
        return prev !== cur ? cur : prev;
      });
      setActiveInGameQuiz((prev) => {
        const cur = eng.playerState.activeInGameQuiz;
        if (prev !== cur) {
          if (cur) setQuizFeedback(null);
          return cur;
        }
        return prev;
      });

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [showTheoryModal]);

  // Keep canvas width/height synced
  useEffect(() => {
    if (canvasRef.current) {
      canvasRef.current.width = canvasSize.w;
      canvasRef.current.height = canvasSize.h;
    }
  }, [canvasSize]);

  const handleResetLevel = () => {
    const eng = engineRef.current;
    eng.reset();
    setGameState('playing');
    setWheelSides(4);
    setLeverClass(1);
    setRampLength(400);
    setPulleyStrands(1);
    setCargoHooked(false);
    setTelemetry(eng.getTelemetry());
  };

  const handleAnswer = (optionIdx: number) => {
    let currentQ;
    if (activeInGameQuiz) {
      const idxStr = activeInGameQuiz.split('_').pop();
      const idx = parseInt(idxStr || '0', 10);
      currentQ = levelConfig.quiz[idx] || levelConfig.quiz[0];
    } else {
      currentQ = levelConfig.quiz[quizIndex];
    }
    if (!currentQ) return;
    const isCorrect = optionIdx === currentQ.correct;
    onQuestionAnswered?.(currentQ.question, isCorrect);
    setQuizFeedback({
      correct: isCorrect,
      explanation: currentQ.explanation || (isCorrect ? 'Correcte!' : 'Incorrecte, revisa la fórmula i torna-ho a provar.'),
    });
  };

  const handleNextQuiz = () => {
    if (activeInGameQuiz) {
      if (quizFeedback?.correct) {
        engineRef.current.openQuizDoor(activeInGameQuiz);
      }
      setQuizFeedback(null);
      return;
    }

    if (quizFeedback?.correct) {
      if (quizIndex + 1 < (levelConfig.quiz?.length || 0)) {
        setQuizIndex(quizIndex + 1);
        setQuizFeedback(null);
      } else {
        onLevelComplete?.();
        engineRef.current.state = 'gameover';
        setGameState('gameover');
        setQuizFeedback(null);
      }
    } else {
      setQuizFeedback(null);
    }
  };

  const signKey = activeDialog || 'sign_intro';
  const texts = levelConfig.texts || fallbackConfig.texts;
  const signText = texts[signKey] || texts['sign_intro'] || '';
  const formulas = levelConfig.formulas || fallbackConfig.formulas;
  const signFormula = formulas?.[signKey] || formulas?.['sign_intro'];
  const formulaEntries = Object.entries(formulas || {});

  return (
    <div className="w-full h-full bg-slate-950 flex flex-col overflow-hidden select-none">
      {/* 1. TOP HEADER BAR */}
      <div className="bg-slate-900 border-b border-slate-800 px-4 py-2 flex flex-wrap items-center justify-between gap-3 shrink-0 z-20">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-1.5 rounded-lg text-xs font-bold border border-slate-700 transition-colors cursor-pointer"
          >
            ← Menú
          </button>
          <div className="flex items-center gap-2">
            <span className="text-2xl">{levelConfig.emoji}</span>
            <div>
              <h1 className="text-sm font-black text-white leading-tight">{levelConfig.name}</h1>
              <div className="text-[11px] text-slate-400 flex items-center gap-2">
                {machineId === 'lever' ? (
                  <span>
                    🎯 Objectius destruïts: <strong className="text-rose-400">{enemiesDefeated}</strong>
                  </span>
                ) : machineId === 'pulley' ? (
                  <span>
                    ⚓ Estat: <strong className={cargoHooked ? 'text-amber-400' : 'text-emerald-400'}>{cargoHooked ? 'Càrrega enganxada' : 'Alinea ganxo'}</strong>
                  </span>
                ) : (
                  <span>
                    Progrés: <strong className="text-amber-400">{progressPct}%</strong> · ⭐ <strong className="text-yellow-300">{starsInfo.collected}/{starsInfo.total}</strong>
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowTheoryModal(true)}
            className="bg-sky-950 hover:bg-sky-900 text-sky-300 border border-sky-500/40 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer"
          >
            📐 Fórmules
          </button>
          <button
            onClick={() => {
              setHistoryIndex(0);
              engineRef.current.state = 'history';
              setGameState('history');
            }}
            className="bg-amber-950/80 hover:bg-amber-900 text-amber-300 border border-amber-500/40 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer"
          >
            📜 Història
          </button>
          <button
            onClick={() => {
              setQuizIndex(0);
              setQuizFeedback(null);
              engineRef.current.state = 'quiz';
              setGameState('quiz');
            }}
            className="bg-emerald-950/80 hover:bg-emerald-900 text-emerald-300 border border-emerald-500/40 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer"
          >
            🧠 Test
          </button>
          <button
            onClick={handleResetLevel}
            className="bg-rose-950/80 hover:bg-rose-900 text-rose-300 border border-rose-500/40 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer"
          >
            🔄 Reiniciar
          </button>
        </div>
      </div>

      {/* 2. DEDICATED SIGN & FORMULA PANEL (Outside Canvas) */}
      <div className="bg-slate-900/95 border-b border-amber-500/30 px-4 py-2.5 shrink-0 z-10 shadow-md">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-start lg:items-center justify-between gap-3">
          <div className="flex-1 flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <div className="flex items-center gap-1 shrink-0 bg-slate-950 p-1 rounded-lg border border-slate-800">
              {(['sign_intro', 'sign_1', 'sign_2', 'sign_3'] as const).map((key, idx) => {
                if (!texts[key]) return null;
                const active = signKey === key;
                return (
                  <button
                    key={key}
                    onClick={() => {
                      engineRef.current.playerState.activeDialog = key;
                      setActiveDialog(key);
                      if (machineId === 'lever' && idx >= 1) {
                        setLeverClass(idx as 1 | 2 | 3);
                        engineRef.current.setLeverClass(idx as 1 | 2 | 3);
                      }
                    }}
                    className={`px-2.5 py-1 rounded-md text-[11px] font-extrabold transition-all cursor-pointer ${
                      active
                        ? 'bg-amber-500 text-slate-950 shadow'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800'
                    }`}
                  >
                    {idx === 0 ? '🪧 Missió' : `🪧 ${idx}r Grau / Estació`}
                  </button>
                );
              })}
            </div>
            <p className="text-xs sm:text-sm text-amber-100 font-medium leading-snug whitespace-pre-line line-clamp-2 sm:line-clamp-none">
              {signText}
            </p>
          </div>

          {signFormula && (
            <div className="bg-slate-950 border border-sky-500/40 rounded-xl px-3.5 py-1.5 shrink-0 flex items-center gap-3">
              <span className="font-mono text-xs sm:text-sm font-black text-sky-300">
                {signFormula.equation}
              </span>
              {signFormula.legend?.[0] && (
                <span className="hidden xl:inline text-[11px] text-slate-400 max-w-xs">
                  {signFormula.legend[0].desc}
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* 3. PURE UNOBSTRUCTED GAMEPLAY CANVAS */}
      <div ref={viewportRef} className="flex-1 w-full relative overflow-hidden bg-slate-950">
        <canvas ref={canvasRef} className="block w-full h-full cursor-crosshair" />
        {machineId === 'lever' && (
          <div className="absolute bottom-3 left-4 bg-slate-950/80 border border-amber-500/40 px-3 py-1 rounded-lg text-[11px] font-bold text-amber-200 pointer-events-none">
            💡 Arrossega la palanca cap enrere per apuntar i deixa anar per llançar!
          </div>
        )}
      </div>

      {/* 4. BOTTOM INTERACTIVE ENGINEERING DECK (Outside Canvas) */}
      <div className="bg-slate-900 border-t border-slate-800 px-4 py-3 shrink-0 z-20">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-3 items-center">
          {/* Telemetry Box */}
          <div className="lg:col-span-5 bg-slate-950 border border-slate-800 rounded-xl p-3 flex flex-col justify-between gap-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-amber-400 uppercase">{telemetry.title}</span>
              <span className="font-mono text-xs font-black text-sky-300 bg-sky-950/70 px-2 py-0.5 rounded border border-sky-500/30">
                AM = {telemetry.mechanicalAdvantage}x
              </span>
            </div>
            <div className="font-mono text-xs text-white font-bold">{telemetry.formula}</div>
            <div
              className={`text-[11px] font-bold ${
                telemetry.canOperate ? 'text-emerald-400' : 'text-amber-300'
              }`}
            >
              {telemetry.statusMessage}
            </div>
          </div>

          {/* Interactive Controls per Machine */}
          <div className="lg:col-span-7 bg-slate-950 border border-slate-800 rounded-xl p-3">
            {/* ANGRY BIRDS LEVER CONTROLS */}
            {machineId === 'lever' && (
              <div className="flex flex-col gap-2.5">
                {/* 3 Lever Class Selector Tabs */}
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black text-amber-400 uppercase">Gènere de Palanca:</span>
                  {[
                    { grade: 1, label: '1r Grau (Fulcre al Mig)', sub: 'Catapulta' },
                    { grade: 2, label: '2n Grau (Càrrega al Mig)', sub: 'Bola Pesant 200kg' },
                    { grade: 3, label: '3r Grau (Força al Mig)', sub: 'Trabuquet Ràpid' },
                  ].map((tab) => (
                    <button
                      key={tab.grade}
                      onClick={() => {
                        setLeverClass(tab.grade as 1 | 2 | 3);
                        engineRef.current.setLeverClass(tab.grade as 1 | 2 | 3);
                      }}
                      className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        leverClass === tab.grade
                          ? 'bg-amber-500 text-slate-950 font-black shadow-lg'
                          : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                {/* Angle & Power Sliders + Quick Action Buttons */}
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2 flex-1">
                    <span className="text-[11px] text-slate-400 font-bold">Angle ({leverAngle}°):</span>
                    <input
                      type="range"
                      min={15}
                      max={85}
                      value={leverAngle}
                      onChange={(e) => setLeverAngle(Number(e.target.value))}
                      className="w-24 accent-amber-400 cursor-pointer"
                    />
                    <span className="text-[11px] text-slate-400 font-bold ml-2">Potència ({leverPower}%):</span>
                    <input
                      type="range"
                      min={30}
                      max={100}
                      value={leverPower}
                      onChange={(e) => setLeverPower(Number(e.target.value))}
                      className="w-24 accent-orange-400 cursor-pointer"
                    />
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        const rad = (leverAngle * Math.PI) / 180;
                        engineRef.current.fireLeverProjectile(rad, leverPower / 100);
                      }}
                      className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black px-4 py-1.5 rounded-lg text-xs cursor-pointer shadow"
                    >
                      🚀 Disparar!
                    </button>
                    <button
                      onClick={() => engineRef.current.buildCastleFortress()}
                      className="bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold px-3 py-1.5 rounded-lg text-xs cursor-pointer border border-slate-700"
                    >
                      🏰 Reconstruir Fortalesa
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* HARBOR CRANE PULLEY SIMULATOR CONTROLS */}
            {machineId === 'pulley' && (
              <div className="flex flex-col gap-2.5">
                {/* Pulley Selector: N = 1, 2, 4, 8 */}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-black text-sky-400 uppercase">Politges (N):</span>
                    {[
                      { n: 1, label: 'N = 1 (Fixa)', note: 'Tensió 8000 N' },
                      { n: 2, label: 'N = 2 (Mòbil)', note: 'Tensió 4000 N' },
                      { n: 4, label: 'N = 4 (Polispast)', note: 'Tensió 2000 N' },
                      { n: 8, label: 'N = 8 (Industrial)', note: 'Tensió 1000 N' },
                    ].map((tab) => (
                      <button
                        key={tab.n}
                        onClick={() => {
                          setPulleyStrands(tab.n as 1 | 2 | 4 | 8);
                          engineRef.current.setPulleyStrands(tab.n as 1 | 2 | 4 | 8);
                        }}
                        className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                          pulleyStrands === tab.n
                            ? 'bg-sky-400 text-slate-950 font-black shadow-lg'
                            : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                        }`}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>
                  <button
                    onClick={() => {
                      engineRef.current.toggleCargoLatch();
                      setCargoHooked(engineRef.current.cargoHooked);
                    }}
                    className={`font-black px-4 py-2 rounded-xl text-xs transition-all cursor-pointer shadow ${
                      cargoHooked
                        ? 'bg-amber-500 hover:bg-amber-400 text-slate-950'
                        : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950'
                    }`}
                  >
                    {cargoHooked ? '🔓 Desenganxar a la Barcassa' : '🪝 Enganxar Càrrega'}
                  </button>
                </div>

                {/* Crane Motion Controls */}
                <div className="flex items-center justify-between gap-2 border-t border-slate-800/80 pt-2">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-slate-400 font-bold">Carro:</span>
                    <button
                      onClick={() => engineRef.current.moveCraneTrolley(-3)}
                      className="bg-slate-800 hover:bg-slate-700 text-white font-bold px-3 py-1 rounded text-xs cursor-pointer"
                    >
                      ◀ Esquerra (A)
                    </button>
                    <button
                      onClick={() => engineRef.current.moveCraneTrolley(3)}
                      className="bg-slate-800 hover:bg-slate-700 text-white font-bold px-3 py-1 rounded text-xs cursor-pointer"
                    >
                      Dreta (D) ▶
                    </button>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-slate-400 font-bold">Cable:</span>
                    <button
                      onClick={() => engineRef.current.hoistCrane(-3)}
                      className="bg-slate-800 hover:bg-slate-700 text-white font-bold px-3 py-1 rounded text-xs cursor-pointer"
                    >
                      ▲ Hissar (W)
                    </button>
                    <button
                      onClick={() => engineRef.current.hoistCrane(3)}
                      className="bg-slate-800 hover:bg-slate-700 text-white font-bold px-3 py-1 rounded text-xs cursor-pointer"
                    >
                      Baixar (S) ▼
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* WHEEL CONTROLS */}
            {machineId === 'wheel' && (
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-1.5 flex-wrap">
                  {[
                    { label: 'Triangle (3)', val: 3 },
                    { label: 'Quadrat (4)', val: 4 },
                    { label: 'Hexàgon (6)', val: 6 },
                    { label: 'Octògon (8)', val: 8 },
                    { label: '⚙️ Roda (∞)', val: 0 },
                  ].map((opt) => (
                    <button
                      key={opt.val}
                      onClick={() => {
                        setWheelSides(opt.val);
                        engineRef.current.setWheelSides(opt.val);
                      }}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        wheelSides === opt.val
                          ? 'bg-amber-500 text-slate-950 font-black'
                          : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => engineRef.current.pushWheelTest()}
                  className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black px-4 py-2 rounded-xl text-xs cursor-pointer shrink-0"
                >
                  🚀 Impulsar Roda / Polígon
                </button>
              </div>
            )}

            {/* INCLINED PLANE CONTROLS */}
            {machineId === 'inclined_plane' && (
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex-1 min-w-[200px]">
                  <div className="flex justify-between text-xs font-bold text-amber-300 mb-1">
                    <span>Longitud de la Rampa (L)</span>
                    <span>{(rampLength / 100).toFixed(1)} metres</span>
                  </div>
                  <input
                    type="range"
                    min={300}
                    max={800}
                    step={50}
                    value={rampLength}
                    onChange={(e) => {
                      const l = Number(e.target.value);
                      setRampLength(l);
                      engineRef.current.setRampLength(l);
                    }}
                    className="w-full accent-amber-400 cursor-pointer"
                  />
                </div>
                <button
                  onClick={() => engineRef.current.pushActiveBox()}
                  className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-black px-5 py-2.5 rounded-xl text-xs cursor-pointer shrink-0"
                >
                  🧱 Empènyer Bloc
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* IN-GAME QUIZ DOOR MODAL */}
      {activeInGameQuiz && (
        <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-6 z-50">
          <div className="bg-slate-900 border-2 border-purple-500/60 rounded-3xl max-w-lg w-full p-7 text-white shadow-2xl">
            <div className="flex justify-between items-center mb-3">
              <span className="text-xs font-black uppercase tracking-wider text-purple-300">
                🧠 Porta de Control Físic
              </span>
              <button
                onClick={() => engineRef.current.stepBackFromQuizDoor()}
                className="text-xs text-slate-400 hover:text-white cursor-pointer"
              >
                ✕ Retrocedir
              </button>
            </div>
            {(() => {
              const idx = parseInt(activeInGameQuiz.split('_').pop() || '0', 10);
              const q = levelConfig.quiz?.[idx] || levelConfig.quiz?.[0];
              return (
                <>
                  <h3 className="text-base font-black mb-4">{q?.question}</h3>
                  <div className="space-y-2 mb-4">
                    {q?.options.map((opt, oIdx) => (
                      <button
                        key={oIdx}
                        disabled={Boolean(quizFeedback)}
                        onClick={() => handleAnswer(oIdx)}
                        className="w-full text-left p-3 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-xs font-semibold cursor-pointer"
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </>
              );
            })()}
            {quizFeedback && (
              <div
                className={`p-3.5 rounded-xl border text-xs ${
                  quizFeedback.correct
                    ? 'bg-emerald-950/70 border-emerald-500 text-emerald-200'
                    : 'bg-rose-950/70 border-rose-500 text-rose-200'
                }`}
              >
                <div className="font-black mb-1">
                  {quizFeedback.correct ? '✓ Porta Desbloquejada!' : '✗ Incorrecte'}
                </div>
                <p>{quizFeedback.explanation}</p>
                <button
                  onClick={handleNextQuiz}
                  className="mt-2.5 bg-white text-slate-950 font-black px-4 py-1.5 rounded-lg text-xs cursor-pointer"
                >
                  {quizFeedback.correct ? 'Obrir Porta →' : 'Tornar a provar'}
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* THEORY MODAL */}
      {showTheoryModal && (
        <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-6 z-50">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-2xl w-full p-6 shadow-2xl text-white">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-black text-sky-400">
                📐 Manual d'Enginyeria: {levelConfig.name}
              </h2>
              <button
                onClick={() => setShowTheoryModal(false)}
                className="bg-slate-800 hover:bg-slate-700 px-3 py-1 rounded-lg text-sm font-bold cursor-pointer"
              >
                ✕ Tancar
              </button>
            </div>
            <div className="space-y-3 max-h-[65vh] overflow-y-auto pr-2">
              {formulaEntries.map(([k, f]) => (
                <div key={k} className="bg-slate-950 border border-slate-800 p-4 rounded-2xl">
                  <div className="font-mono text-base font-black text-amber-300 mb-1">
                    {f.equation}
                  </div>
                  {f.legend && (
                    <div className="space-y-1 mt-2">
                      {f.legend.map((item, idx) => (
                        <div key={idx} className="text-xs text-slate-300 flex gap-2">
                          <span className="font-mono text-sky-300 font-bold">{item.symbol}:</span>
                          <span>{item.desc}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* HISTORY MODAL */}
      {gameState === 'history' && (
        <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-6 z-50">
          <div className="bg-slate-900 border border-amber-500/40 rounded-3xl max-w-xl w-full p-8 shadow-2xl text-white text-center">
            <div className="text-6xl mb-4">{levelConfig.history?.[historyIndex]?.imageIcon || '📜'}</div>
            <div className="text-xs font-bold uppercase tracking-widest text-amber-400 mb-1">
              Història de l'Enginyeria ({historyIndex + 1}/{levelConfig.history?.length || 1})
            </div>
            <h2 className="text-2xl font-black mb-3">{levelConfig.history?.[historyIndex]?.title}</h2>
            <p className="text-slate-300 text-sm leading-relaxed mb-6">
              {levelConfig.history?.[historyIndex]?.content}
            </p>
            <div className="flex justify-center gap-3">
              <button
                onClick={() => {
                  engineRef.current.state = 'playing';
                  setGameState('playing');
                }}
                className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-5 py-2.5 rounded-xl font-bold text-xs cursor-pointer"
              >
                Tornar al Joc
              </button>
              <button
                onClick={() => {
                  if (historyIndex + 1 < (levelConfig.history?.length || 0)) {
                    setHistoryIndex(historyIndex + 1);
                  } else {
                    setQuizIndex(0);
                    setQuizFeedback(null);
                    engineRef.current.state = 'quiz';
                    setGameState('quiz');
                  }
                }}
                className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-black px-6 py-2.5 rounded-xl text-xs cursor-pointer"
              >
                {historyIndex + 1 < (levelConfig.history?.length || 0)
                  ? 'Següent Etapa →'
                  : 'Anar al Test Final 🧠'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FINAL QUIZ MODAL */}
      {gameState === 'quiz' && (
        <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-6 z-50">
          <div className="bg-slate-900 border border-emerald-500/40 rounded-3xl max-w-xl w-full p-7 shadow-2xl text-white">
            <div className="flex justify-between items-center mb-3">
              <span className="text-xs font-black uppercase tracking-wider text-emerald-400">
                Pregunta {quizIndex + 1} de {levelConfig.quiz?.length || 1}
              </span>
              <button
                onClick={() => {
                  engineRef.current.state = 'playing';
                  setGameState('playing');
                }}
                className="text-xs text-slate-400 hover:text-white cursor-pointer"
              >
                ✕ Tornar al nivell
              </button>
            </div>
            <h3 className="text-lg font-black mb-4 leading-snug">
              {levelConfig.quiz?.[quizIndex]?.question}
            </h3>
            <div className="space-y-2.5 mb-5">
              {levelConfig.quiz?.[quizIndex]?.options.map((opt, idx) => (
                <button
                  key={idx}
                  disabled={Boolean(quizFeedback)}
                  onClick={() => handleAnswer(idx)}
                  className="w-full text-left p-3.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-xs sm:text-sm font-semibold transition-all cursor-pointer disabled:opacity-60"
                >
                  {opt}
                </button>
              ))}
            </div>
            {quizFeedback && (
              <div
                className={`p-4 rounded-2xl mb-4 border ${
                  quizFeedback.correct
                    ? 'bg-emerald-950/60 border-emerald-500/50 text-emerald-200'
                    : 'bg-rose-950/60 border-rose-500/50 text-rose-200'
                }`}
              >
                <div className="font-black text-sm mb-1">
                  {quizFeedback.correct ? '✓ Resposta Correcta!' : '✗ Resposta Incorrecta'}
                </div>
                <p className="text-xs leading-relaxed">{quizFeedback.explanation}</p>
                <button
                  onClick={handleNextQuiz}
                  className="mt-3 bg-white text-slate-950 font-black px-4 py-2 rounded-lg text-xs cursor-pointer"
                >
                  {quizFeedback.correct ? 'Continuar →' : 'Tornar a provar'}
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* LEVEL COMPLETED MODAL */}
      {gameState === 'gameover' && (
        <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-6 z-50">
          <div className="bg-slate-900 border border-emerald-500/50 rounded-3xl max-w-md w-full p-8 text-center text-white shadow-2xl">
            <div className="text-6xl mb-3">🏆</div>
            <h2 className="text-2xl font-black text-emerald-400 mb-2">Míssió Superada!</h2>
            <p className="text-slate-300 text-sm mb-6">
              {machineId === 'lever'
                ? 'Has enderrocat totes les defenses enemigues utilitzant els 3 gèneres de palanca!'
                : machineId === 'pulley'
                ? 'Has hissat i descarregat la càrrega amb èxit controlant la tensió del polispast!'
                : `Has completat amb èxit totes les proves de ${levelConfig.name}!`}
            </p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={handleResetLevel}
                className="bg-slate-800 hover:bg-slate-700 text-white px-5 py-2.5 rounded-xl font-bold text-xs cursor-pointer"
              >
                🔄 Tornar a Jugar
              </button>
              <button
                onClick={onBack}
                className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black px-6 py-2.5 rounded-xl text-xs cursor-pointer"
              >
                ← Menú de Màquines
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

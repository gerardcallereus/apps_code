import React, { useState, useEffect, useRef } from 'react';
import { Point } from '../types';
import CoordinateGrid from '../components/CoordinateGrid';
import { QuadrantIcon } from '../components/Icons';
import GameContainer from '../components/GameContainer';

type GameStatus = 'ready' | 'playing' | 'finished';

const GRID_MIN = -5;
const GRID_MAX = 5;
const GAME_DURATION = 60;

const generateRandomPoint = (): Point => {
  let x = 0, y = 0;
  while (x === 0 || y === 0) {
    x = Math.floor(Math.random() * (GRID_MAX - GRID_MIN + 1)) + GRID_MIN;
    y = Math.floor(Math.random() * (GRID_MAX - GRID_MIN + 1)) + GRID_MIN;
  }
  return { x, y };
};

const getQuadrant = (p: Point): number => {
  if (p.x > 0 && p.y > 0) return 1;
  if (p.x < 0 && p.y > 0) return 2;
  if (p.x < 0 && p.y < 0) return 3;
  if (p.x > 0 && p.y < 0) return 4;
  return 0; // On axis, handled by generator
};

const getShuffledQuadrants = (): number[] => {
    const quadrants = [1, 2, 3, 4];
    // Fisher-Yates shuffle algorithm
    for (let i = quadrants.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [quadrants[i], quadrants[j]] = [quadrants[j], quadrants[i]];
    }
    return quadrants;
};

const StellarSectorsGame: React.FC<{ onBackToMenu: () => void }> = ({ onBackToMenu }) => {
  const [status, setStatus] = useState<GameStatus>('ready');
  const [target, setTarget] = useState<Point>(generateRandomPoint);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
  const [quadrantOrder, setQuadrantOrder] = useState<number[]>(() => getShuffledQuadrants());
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    if (status === 'playing') {
      timerRef.current = window.setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [status]);

  useEffect(() => {
    if (timeLeft <= 0) {
      setStatus('finished');
      if (timerRef.current) clearInterval(timerRef.current);
    }
  }, [timeLeft]);

  const handleStart = () => {
    setScore(0);
    setTimeLeft(GAME_DURATION);
    setTarget(generateRandomPoint());
    setQuadrantOrder(getShuffledQuadrants());
    setStatus('playing');
  };

  const handleQuadrantSelection = (selectedQuadrant: number) => {
    if (status !== 'playing') return;
    if (getQuadrant(target) === selectedQuadrant) {
      setScore(prev => prev + 10);
    } else {
      setScore(prev => prev - 5);
    }
    setTarget(generateRandomPoint());
    setQuadrantOrder(getShuffledQuadrants());
  };

  const renderContent = () => {
    if (status === 'finished') {
      return (
        <div className="text-center bg-slate-800/50 backdrop-blur-sm p-8 rounded-xl shadow-lg">
          <h2 className="text-3xl font-bold mb-2">Radar apagat!</h2>
          <p className="text-xl mb-4 text-slate-300">Puntuació final:</p>
          <p className="text-6xl font-bold text-teal-400 mb-8">{score}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button onClick={handleStart} className="px-8 py-3 bg-green-500 text-white font-bold rounded-lg shadow-md hover:bg-green-600 transition-all transform hover:scale-105">
              Nova Missió
            </button>
            <button onClick={onBackToMenu} className="px-8 py-3 bg-slate-600 text-white font-bold rounded-lg shadow-md hover:bg-slate-700 transition-all transform hover:scale-105">
              Tornar al Menú
            </button>
          </div>
        </div>
      );
    }

    return (
      <main className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <div className="w-full lg:col-span-2">
          <CoordinateGrid
            gridMin={GRID_MIN}
            gridMax={GRID_MAX}
            targetPosition={target}
            userGuess={null}
            status={status}
            visibleTarget={status === 'playing' ? target : null}
          />
        </div>

        <div className="w-full flex flex-col gap-6 p-6 bg-slate-800/50 backdrop-blur-sm rounded-xl shadow-lg">
          <div className="grid grid-cols-2 gap-4 text-center">
            <div className="bg-slate-700/50 p-3 rounded-lg">
              <h2 className="text-lg font-bold text-slate-300">Puntuació</h2>
              <span className="text-3xl font-bold text-teal-400">{score}</span>
            </div>
            <div className="bg-slate-700/50 p-3 rounded-lg">
              <h2 className="text-lg font-bold text-slate-300">Temps</h2>
              <span className="text-3xl font-bold text-teal-400">{timeLeft}</span>
            </div>
          </div>
          {status === 'ready' ? (
              <button onClick={handleStart} className="w-full px-8 py-4 bg-green-500 text-white text-xl font-bold rounded-lg shadow-md hover:bg-green-600 transition-all transform hover:scale-105">
                  Comença Escaneig
              </button>
          ) : (
            <div>
              <h3 className="text-lg font-semibold mb-4 text-center">Identifica el quadrant:</h3>
              <div className="grid grid-cols-2 gap-3">
                  {quadrantOrder.map((q) => (
                      <button key={q} onClick={() => handleQuadrantSelection(q)} className="p-4 bg-teal-600 text-white font-bold rounded-lg shadow-md hover:bg-teal-500 transition-all transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-teal-300">
                          Quadrant {q === 1 ? 'I' : q === 2 ? 'II' : q === 3 ? 'III' : 'IV'}
                      </button>
                  ))}
              </div>
            </div>
          )}
        </div>
      </main>
    );
  };

  return (
    <GameContainer onBackToMenu={onBackToMenu} theme="sectors">
      <header className="text-center mb-8">
        <div className="flex justify-center items-center gap-3">
          <QuadrantIcon className="w-10 h-10 text-teal-400" />
          <h1 className="text-4xl sm:text-5xl font-bold">Sectors Estel·lars</h1>
        </div>
        <p className="opacity-80 mt-2 text-lg">Un objecte ha aparegut al radar. Classifica'l al seu quadrant!</p>
      </header>
      {renderContent()}
    </GameContainer>
  );
};

export default StellarSectorsGame;

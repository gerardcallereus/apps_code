import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Point } from '../types';
import CoordinateGrid from '../components/CoordinateGrid';
import GameControls from '../components/GameControls';
import { LightningBoltIcon } from '../components/Icons';
import GameContainer from '../components/GameContainer';

type AgilityStatus = 'ready' | 'playing' | 'finished';

const GRID_MIN = -5;
const GRID_MAX = 5;
const GAME_DURATION = 60; // seconds

const generateRandomPoint = (): Point => {
  const x = Math.floor(Math.random() * (GRID_MAX - GRID_MIN + 1)) + GRID_MIN;
  const y = Math.floor(Math.random() * (GRID_MAX - GRID_MIN + 1)) + GRID_MIN;
  return { x, y };
};

const SpaceRaceGame: React.FC<{ onBackToMenu: () => void }> = ({ onBackToMenu }) => {
  const [status, setStatus] = useState<AgilityStatus>('ready');
  const [target, setTarget] = useState<Point>(generateRandomPoint);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
  
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    if (status === 'playing') {
      timerRef.current = window.setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
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
    setStatus('playing');
  };

  const handleGuess = useCallback((guess: Point) => {
    if (guess.x === target.x && guess.y === target.y) {
      setScore(prev => prev + 1);
      setTarget(generateRandomPoint());
    }
  }, [target]);

  const renderContent = () => {
    if (status === 'finished') {
      return (
        <div className="text-center bg-slate-800/50 backdrop-blur-sm p-8 rounded-xl shadow-lg">
          <h2 className="text-3xl font-bold mb-2">Temps esgotat!</h2>
          <p className="text-xl mb-4 text-slate-300">La teva puntuació final és:</p>
          <p className="text-6xl font-bold text-purple-400 mb-8">{score}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button onClick={handleStart} className="px-8 py-3 bg-green-500 text-white font-bold rounded-lg shadow-md hover:bg-green-600 transition-all transform hover:scale-105">
              Juga de Nou
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
              <span className="text-3xl font-bold text-purple-400">{score}</span>
            </div>
            <div className="bg-slate-700/50 p-3 rounded-lg">
              <h2 className="text-lg font-bold text-slate-300">Temps</h2>
              <span className="text-3xl font-bold text-purple-400">{timeLeft}</span>
            </div>
          </div>
          
          {status === 'ready' ? (
              <button onClick={handleStart} className="w-full px-8 py-4 bg-green-500 text-white text-xl font-bold rounded-lg shadow-md hover:bg-green-600 transition-all transform hover:scale-105">
                  Comença!
              </button>
          ) : (
            <div className="text-slate-800">
                <h3 className="text-lg font-semibold mb-2 text-center text-white">Quines són les coordenades?</h3>
                <GameControls onSubmit={handleGuess} disabled={status !== 'playing'} />
            </div>
          )}
        </div>
      </main>
    );
  }

  return (
    <GameContainer onBackToMenu={onBackToMenu} theme="space">
      <header className="text-center mb-8">
        <div className="flex justify-center items-center gap-3">
          <LightningBoltIcon className="w-10 h-10 text-purple-400" />
          <h1 className="text-4xl sm:text-5xl font-bold">Carrera Espacial</h1>
        </div>
        <p className="opacity-80 mt-2 text-lg">Troba les coordenades del punt marcat el més ràpid que puguis!</p>
      </header>
      {renderContent()}
    </GameContainer>
  );
};

export default SpaceRaceGame;

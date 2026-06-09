import React, { useState, useCallback } from 'react';
import { Point } from '../types';
import CoordinateGrid from '../components/CoordinateGrid';
import { TargetIcon, CrossIcon, StarIcon } from '../components/Icons';
import GameContainer from '../components/GameContainer';

type DuelStatus = 'ready' | 'playing' | 'round-finished' | 'game-finished';
const TOTAL_ROUNDS = 10;
const GRID_MIN = -5;
const GRID_MAX = 5;

const generateRandomPoint = (): Point => {
  const x = Math.floor(Math.random() * (GRID_MAX - GRID_MIN + 1)) + GRID_MIN;
  const y = Math.floor(Math.random() * (GRID_MAX - GRID_MIN + 1)) + GRID_MIN;
  return { x, y };
};

const FarWestDuelGame: React.FC<{ onBackToMenu: () => void }> = ({ onBackToMenu }) => {
  const [status, setStatus] = useState<DuelStatus>('ready');
  const [target, setTarget] = useState<Point>(generateRandomPoint);
  const [lastClick, setLastClick] = useState<Point | null>(null);
  const [score, setScore] = useState(0);
  const [round, setRound] = useState(1);
  const [isCorrect, setIsCorrect] = useState(false);

  const startNewGame = () => {
    setScore(0);
    setRound(1);
    setTarget(generateRandomPoint());
    setStatus('playing');
    setLastClick(null);
    setIsCorrect(false);
  };

  const startNextRound = () => {
    if (round >= TOTAL_ROUNDS) {
      setStatus('game-finished');
    } else {
      setRound(prev => prev + 1);
      setTarget(generateRandomPoint());
      setStatus('playing');
      setLastClick(null);
      setIsCorrect(false);
    }
  };

  const handleGridClick = useCallback((clickedPoint: Point) => {
    if (status !== 'playing') return;

    setLastClick(clickedPoint);
    if (clickedPoint.x === target.x && clickedPoint.y === target.y) {
      setScore(prev => prev + 10);
      setIsCorrect(true);
    } else {
      setIsCorrect(false);
    }
    setStatus('round-finished');
  }, [target, status]);

  const renderContent = () => {
    if (status === 'game-finished') {
        return (
            <div className="text-center bg-white/50 backdrop-blur-sm p-8 rounded-xl shadow-lg text-slate-800">
                <h2 className="text-3xl font-bold mb-2">Duel finalitzat!</h2>
                <p className="text-xl mb-4">La teva puntuació final és:</p>
                <p className="text-6xl font-bold text-amber-700 mb-8">{score}</p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button onClick={startNewGame} className="px-8 py-3 bg-green-500 text-white font-bold rounded-lg shadow-md hover:bg-green-600 transition-all transform hover:scale-105">
                    Juga de Nou
                    </button>
                    <button onClick={onBackToMenu} className="px-8 py-3 bg-slate-500 text-white font-bold rounded-lg shadow-md hover:bg-slate-600 transition-all transform hover:scale-105">
                    Tornar al Menú
                    </button>
                </div>
            </div>
        )
    }

    return (
      <main className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <div className="w-full lg:col-span-2">
          <CoordinateGrid
            gridMin={GRID_MIN}
            gridMax={GRID_MAX}
            targetPosition={target}
            userGuess={lastClick}
            status={status === 'round-finished' ? (isCorrect ? 'correct' : 'incorrect') : 'playing'}
            onGridClick={status === 'playing' ? handleGridClick : undefined}
          />
        </div>
        <div className="w-full flex flex-col gap-6 p-6 bg-white/50 backdrop-blur-sm rounded-xl shadow-lg text-slate-800">
          <div className="grid grid-cols-2 gap-4 text-center">
            <div className="bg-slate-100 p-3 rounded-lg">
              <h2 className="text-lg font-bold text-slate-700">Puntuació</h2>
              <span className="text-3xl font-bold text-amber-700">{score}</span>
            </div>
            <div className="bg-slate-100 p-3 rounded-lg">
              <h2 className="text-lg font-bold text-slate-700">Ronda</h2>
              <span className="text-3xl font-bold text-amber-700">{round}/{TOTAL_ROUNDS}</span>
            </div>
          </div>
          {status === 'ready' ? (
              <button onClick={startNewGame} className="w-full px-8 py-4 bg-green-500 text-white text-xl font-bold rounded-lg shadow-md hover:bg-green-600 transition-all transform hover:scale-105">
                  Comença el Duel!
              </button>
          ) : (
            <div className="text-center">
              <h3 className="text-xl font-semibold mb-2">Troba el punt:</h3>
              <p className="text-5xl font-bold text-amber-800 my-4">({target.x}, {target.y})</p>
              
              {status === 'round-finished' && (
                <div className="flex flex-col items-center gap-4">
                    {isCorrect ? 
                        <p className="flex items-center gap-2 text-green-700 font-bold text-lg"><StarIcon className="w-6 h-6"/>Correcte!</p> :
                        <p className="flex items-center gap-2 text-red-700 font-bold text-lg"><CrossIcon className="w-6 h-6"/>Incorrecte!</p>
                    }
                    <button onClick={startNextRound} className="w-full px-8 py-3 bg-blue-600 text-white font-bold rounded-lg shadow-md hover:bg-blue-700 transition-all transform hover:scale-105">
                        {round >= TOTAL_ROUNDS ? 'Finalitza' : 'Següent Ronda'}
                    </button>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    );
  };

  return (
    <GameContainer onBackToMenu={onBackToMenu} theme="far-west">
      <header className="text-center mb-8">
        <div className="flex justify-center items-center gap-3">
          <TargetIcon className="w-10 h-10 text-amber-700" />
          <h1 className="text-4xl sm:text-5xl font-bold">El Duel del Far West</h1>
        </div>
        <p className="opacity-80 mt-2 text-lg">Fes clic a les coordenades indicades abans que el teu rival!</p>
      </header>
      {renderContent()}
    </GameContainer>
  );
};

export default FarWestDuelGame;
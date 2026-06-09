
import React, { useState, useMemo, useCallback } from 'react';
import { Point } from '../types';
import CoordinateGrid from '../components/CoordinateGrid';
import { TranslationIcon, CrossIcon, StarIcon } from '../components/Icons';
import GameContainer from '../components/GameContainer';

type GameStatus = 'ready' | 'playing' | 'round-finished' | 'game-finished';
const TOTAL_ROUNDS = 10;
const GRID_MIN = -8;
const GRID_MAX = 8;

const generateRandomPoint = (min = GRID_MIN, max = GRID_MAX): Point => {
  const x = Math.floor(Math.random() * (max - min + 1)) + min;
  const y = Math.floor(Math.random() * (max - min + 1)) + min;
  return { x, y };
};

const QuantumTeleporterGame: React.FC<{ onBackToMenu: () => void }> = ({ onBackToMenu }) => {
  const [status, setStatus] = useState<GameStatus>('ready');
  const [score, setScore] = useState(0);
  const [round, setRound] = useState(1);

  const [startPoint, setStartPoint] = useState<Point>(() => generateRandomPoint());
  const [translation, setTranslation] = useState<Point>(() => generateRandomPoint(-4, 4));
  const [lastClick, setLastClick] = useState<Point | null>(null);
  const [isCorrect, setIsCorrect] = useState(false);

  const endPoint = useMemo((): Point => ({
    x: startPoint.x + translation.x,
    y: startPoint.y + translation.y,
  }), [startPoint, translation]);

  const startNewGame = () => {
    setScore(0);
    setRound(1);
    startNextRound(true);
  };

  const startNextRound = (isNewGame = false) => {
    if (!isNewGame && round >= TOTAL_ROUNDS) {
      setStatus('game-finished');
      return;
    }
    
    if (!isNewGame) setRound(prev => prev + 1);

    let newStart, newTrans, newEnd;
    do {
      newStart = generateRandomPoint();
      newTrans = generateRandomPoint(-4, 4);
      newEnd = { x: newStart.x + newTrans.x, y: newStart.y + newTrans.y };
    } while (newEnd.x > GRID_MAX || newEnd.x < GRID_MIN || newEnd.y > GRID_MAX || newEnd.y < GRID_MIN);

    setStartPoint(newStart);
    setTranslation(newTrans);
    setLastClick(null);
    setIsCorrect(false);
    setStatus('playing');
  };

  const handleGridClick = useCallback((clickedPoint: Point) => {
    if (status !== 'playing') return;

    setLastClick(clickedPoint);
    if (clickedPoint.x === endPoint.x && clickedPoint.y === endPoint.y) {
      setScore(prev => prev + 10);
      setIsCorrect(true);
    } else {
      setIsCorrect(false);
    }
    setStatus('round-finished');
  }, [endPoint, status]);

  const renderContent = () => {
    if (status === 'game-finished') {
      return (
        <div className="text-center bg-slate-800/50 backdrop-blur-sm p-8 rounded-xl shadow-lg">
          <h2 className="text-3xl font-bold mb-2">Teletransportació completada!</h2>
          <p className="text-xl mb-4 text-slate-300">Puntuació final:</p>
          <p className="text-6xl font-bold text-indigo-400 mb-8">{score}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button onClick={startNewGame} className="px-8 py-3 bg-green-500 text-white font-bold rounded-lg shadow-md hover:bg-green-600 transition-all">Juga de Nou</button>
            <button onClick={onBackToMenu} className="px-8 py-3 bg-slate-600 text-white font-bold rounded-lg shadow-md hover:bg-slate-700 transition-all">Tornar al Menú</button>
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
            targetPosition={endPoint}
            userGuess={lastClick}
            status={status === 'round-finished' ? (isCorrect ? 'correct' : 'incorrect') : 'playing'}
            onGridClick={handleGridClick}
            visiblePoints={status !== 'ready' ? [startPoint] : []}
          />
        </div>
        <div className="w-full flex flex-col gap-6 p-6 bg-slate-800/50 backdrop-blur-sm rounded-xl shadow-lg">
          <div className="grid grid-cols-2 gap-4 text-center">
            <div className="bg-slate-700/50 p-3 rounded-lg"><h2 className="text-lg font-bold text-slate-300">Puntuació</h2><span className="text-3xl font-bold text-indigo-400">{score}</span></div>
            <div className="bg-slate-700/50 p-3 rounded-lg"><h2 className="text-lg font-bold text-slate-300">Ronda</h2><span className="text-3xl font-bold text-indigo-400">{round}/{TOTAL_ROUNDS}</span></div>
          </div>
          {status === 'ready' ? (
            <button onClick={startNewGame} className="w-full px-8 py-4 bg-green-500 text-white text-xl font-bold rounded-lg shadow-md hover:bg-green-600 transition-all transform hover:scale-105">Inicia el Teletransportador</button>
          ) : (
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-2">El punt de partida és <span className="font-bold text-xl text-indigo-300">({startPoint.x}, {startPoint.y})</span>.</h3>
              <p className="text-lg font-semibold mt-4">Calcula el salt quàntic:</p>
              <p className="text-3xl font-bold text-indigo-300 my-2">({translation.x >= 0 ? `+${translation.x}` : translation.x}, {translation.y >= 0 ? `+${translation.y}` : translation.y})</p>
              <p className="text-lg mt-2">Fes clic a la coordenada de destí!</p>
              
              {status === 'round-finished' && (
                <div className="flex flex-col items-center gap-4 mt-4">
                  {isCorrect ? 
                    <p className="flex items-center gap-2 text-green-400 font-bold text-lg"><StarIcon className="w-6 h-6"/>Correcte!</p> :
                    <p className="flex items-center gap-2 text-red-400 font-bold text-lg"><CrossIcon className="w-6 h-6"/>El destí era ({endPoint.x}, {endPoint.y})</p>
                  }
                  <button onClick={() => startNextRound()} className="w-full px-8 py-3 bg-purple-600 text-white font-bold rounded-lg shadow-md hover:bg-purple-700 transition-all">
                    {round >= TOTAL_ROUNDS ? 'Finalitza' : 'Següent Salt'}
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
    <GameContainer onBackToMenu={onBackToMenu} theme="teleporter">
      <header className="text-center mb-8">
        <div className="flex justify-center items-center gap-3">
          <TranslationIcon className="w-10 h-10 text-indigo-400" />
          <h1 className="text-4xl sm:text-5xl font-bold">Teletransportador Quàntic</h1>
        </div>
        <p className="opacity-80 mt-2 text-lg">Calcula el punt de destí després d'un salt de translació.</p>
      </header>
      {renderContent()}
    </GameContainer>
  );
};

export default QuantumTeleporterGame;

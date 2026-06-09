
import React, { useState, useMemo, useCallback } from 'react';
import { Point } from '../types';
import CoordinateGrid from '../components/CoordinateGrid';
import { MidpointIcon, CrossIcon, StarIcon } from '../components/Icons';
import GameContainer from '../components/GameContainer';

type GameStatus = 'ready' | 'playing' | 'round-finished' | 'game-finished';
const TOTAL_ROUNDS = 10;
const GRID_MIN = -8;
const GRID_MAX = 8;

const generatePoints = (): { p1: Point; p2: Point } => {
    let p1, p2, midX, midY;
    do {
      const x1 = Math.floor(Math.random() * (GRID_MAX*2 + 1)) + GRID_MIN;
      const y1 = Math.floor(Math.random() * (GRID_MAX*2 + 1)) + GRID_MIN;
      const x2 = Math.floor(Math.random() * (GRID_MAX*2 + 1)) + GRID_MIN;
      const y2 = Math.floor(Math.random() * (GRID_MAX*2 + 1)) + GRID_MIN;
      
      const sumXIsEven = (x1 + x2) % 2 === 0;
      const sumYIsEven = (y1 + y2) % 2 === 0;
      const pointsAreDifferent = x1 !== x2 || y1 !== y2;

      if (sumXIsEven && sumYIsEven && pointsAreDifferent) {
        p1 = {x: x1, y: y1};
        p2 = {x: x2, y: y2};
        midX = (x1 + x2) / 2;
        midY = (y1 + y2) / 2;
      }
    } while (!p1 || !p2 || midX > GRID_MAX || midX < GRID_MIN || midY > GRID_MAX || midY < GRID_MIN);
    
    return {p1, p2};
};

const MeetingPointGame: React.FC<{ onBackToMenu: () => void }> = ({ onBackToMenu }) => {
  const [status, setStatus] = useState<GameStatus>('ready');
  const [score, setScore] = useState(0);
  const [round, setRound] = useState(1);
  const [points, setPoints] = useState(() => generatePoints());
  const [lastClick, setLastClick] = useState<Point | null>(null);
  const [isCorrect, setIsCorrect] = useState(false);

  const midPoint = useMemo((): Point => ({
    x: (points.p1.x + points.p2.x) / 2,
    y: (points.p1.y + points.p2.y) / 2,
  }), [points]);

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
    
    setPoints(generatePoints());
    setLastClick(null);
    setIsCorrect(false);
    setStatus('playing');
  };

  const handleGridClick = useCallback((clickedPoint: Point) => {
    if (status !== 'playing') return;

    setLastClick(clickedPoint);
    if (clickedPoint.x === midPoint.x && clickedPoint.y === midPoint.y) {
      setScore(prev => prev + 10);
      setIsCorrect(true);
    } else {
      setIsCorrect(false);
    }
    setStatus('round-finished');
  }, [midPoint, status]);

  const renderContent = () => {
    if (status === 'game-finished') {
      return (
        <div className="text-center bg-white/50 backdrop-blur-sm p-8 rounded-xl shadow-lg">
          <h2 className="text-3xl font-bold mb-2">Missió completada!</h2>
          <p className="text-xl mb-4">Puntuació final:</p>
          <p className="text-6xl font-bold text-lime-700 mb-8">{score}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button onClick={startNewGame} className="px-8 py-3 bg-green-500 text-white font-bold rounded-lg shadow-md hover:bg-green-600">Juga de Nou</button>
            <button onClick={onBackToMenu} className="px-8 py-3 bg-slate-500 text-white font-bold rounded-lg shadow-md hover:bg-slate-600">Tornar al Menú</button>
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
            targetPosition={midPoint}
            userGuess={lastClick}
            status={status === 'round-finished' ? (isCorrect ? 'correct' : 'incorrect') : 'playing'}
            onGridClick={handleGridClick}
            visiblePoints={status !== 'ready' ? [points.p1, points.p2] : []}
          />
        </div>
        <div className="w-full flex flex-col gap-6 p-6 bg-white/50 backdrop-blur-sm rounded-xl shadow-lg">
          <div className="grid grid-cols-2 gap-4 text-center">
            <div className="bg-slate-100 p-3 rounded-lg"><h2 className="text-lg font-bold text-slate-700">Puntuació</h2><span className="text-3xl font-bold text-lime-700">{score}</span></div>
            <div className="bg-slate-100 p-3 rounded-lg"><h2 className="text-lg font-bold text-slate-700">Ronda</h2><span className="text-3xl font-bold text-lime-700">{round}/{TOTAL_ROUNDS}</span></div>
          </div>
          {status === 'ready' ? (
            <button onClick={startNewGame} className="w-full px-8 py-4 bg-green-500 text-white text-xl font-bold rounded-lg shadow-md hover:bg-green-600 transition-all">Comença el Rescat</button>
          ) : (
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-2">Troba el punt mitjà entre:</h3>
              <div className="flex justify-around my-2 text-2xl font-bold text-lime-800">
                <span>Nau A: ({points.p1.x}, {points.p1.y})</span>
                <span>Nau B: ({points.p2.x}, {points.p2.y})</span>
              </div>
              <p className="text-md mt-2">Fes clic a la coordenada exacta a mig camí!</p>
              
              {status === 'round-finished' && (
                <div className="flex flex-col items-center gap-4 mt-4">
                  {isCorrect ? 
                    <p className="flex items-center gap-2 text-green-700 font-bold text-lg"><StarIcon className="w-6 h-6"/>Rescat exitós!</p> :
                    <p className="flex items-center gap-2 text-red-700 font-bold text-lg"><CrossIcon className="w-6 h-6"/>El punt era ({midPoint.x}, {midPoint.y})</p>
                  }
                  <button onClick={() => startNextRound()} className="w-full px-8 py-3 bg-purple-600 text-white font-bold rounded-lg shadow-md hover:bg-purple-700 transition-all">
                    {round >= TOTAL_ROUNDS ? 'Finalitza' : 'Següent Missió'}
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
    <GameContainer onBackToMenu={onBackToMenu} theme="midpoint">
      <header className="text-center mb-8">
        <div className="flex justify-center items-center gap-3">
          <MidpointIcon className="w-10 h-10 text-lime-700" />
          <h1 className="text-4xl sm:text-5xl font-bold">Punt de Trobada</h1>
        </div>
        <p className="opacity-80 mt-2 text-lg">Troba el punt de rescat equidistant entre les dues naus.</p>
      </header>
      {renderContent()}
    </GameContainer>
  );
};

export default MeetingPointGame;

import React, { useState, useMemo } from 'react';
import { Point } from '../types';
import CoordinateGrid from '../components/CoordinateGrid';
import { ShapesIcon } from '../components/Icons';
import GameContainer from '../components/GameContainer';

type GameStatus = 'ready' | 'plotting' | 'guessing' | 'finished';
type Shape = { name: string; vertices: Point[] };

const GRID_MIN = -7;
const GRID_MAX = 7;

const shapesData: { name: string; generator: () => Point[] }[] = [
  { name: 'Triangle Rectangle', generator: () => {
      const x1 = Math.floor(Math.random() * 8) - 4;
      const y1 = Math.floor(Math.random() * 8) - 4;
      const width = Math.floor(Math.random() * 5) + 3;
      const height = Math.floor(Math.random() * 5) + 3;
      return [{x: x1, y: y1}, {x: x1 + width, y: y1}, {x: x1, y: y1 + height}];
  }},
  { name: 'Quadrat', generator: () => {
      const x1 = Math.floor(Math.random() * 6) - 3;
      const y1 = Math.floor(Math.random() * 6) - 3;
      const side = Math.floor(Math.random() * 4) + 3;
      return [{x: x1, y: y1}, {x: x1 + side, y: y1}, {x: x1 + side, y: y1 + side}, {x: x1, y: y1 + side}];
  }},
  { name: 'Rectangle', generator: () => {
    const x1 = Math.floor(Math.random() * 6) - 4;
    const y1 = Math.floor(Math.random() * 6) - 4;
    const width = Math.floor(Math.random() * 5) + 3;
    let height = Math.floor(Math.random() * 5) + 3;
    while(height === width) height = Math.floor(Math.random() * 5) + 3;
    return [{x: x1, y: y1}, {x: x1 + width, y: y1}, {x: x1 + width, y: y1 + height}, {x: x1, y: y1 + height}];
  }},
];

const shuffleArray = (array: any[]) => array.sort(() => Math.random() - 0.5);

const CelestialShapesGame: React.FC<{ onBackToMenu: () => void }> = ({ onBackToMenu }) => {
  const [status, setStatus] = useState<GameStatus>('ready');
  const [score, setScore] = useState(0);
  const [currentShape, setCurrentShape] = useState<Shape | null>(null);
  const [clickedPoints, setClickedPoints] = useState<Point[]>([]);
  const [feedback, setFeedback] = useState('');

  const shapeOptions = useMemo(() => {
    if (!currentShape) return [];
    const otherShapes = shapesData.filter(s => s.name !== currentShape.name).map(s => s.name);
    return shuffleArray([currentShape.name, ...shuffleArray(otherShapes).slice(0, 2)]);
  }, [currentShape]);

  const startNewGame = () => {
    setScore(0);
    startNextRound();
  };

  const startNextRound = () => {
    const randomShapeData = shapesData[Math.floor(Math.random() * shapesData.length)];
    setCurrentShape({ name: randomShapeData.name, vertices: randomShapeData.generator() });
    setClickedPoints([]);
    setFeedback('');
    setStatus('plotting');
  };

  const handleGridClick = (point: Point) => {
    if (status !== 'plotting' || !currentShape) return;

    const nextVertex = currentShape.vertices[clickedPoints.length];
    if (point.x === nextVertex.x && point.y === nextVertex.y) {
      const newPoints = [...clickedPoints, point];
      setClickedPoints(newPoints);
      if (newPoints.length === currentShape.vertices.length) {
        setStatus('guessing');
        setFeedback('Constel·lació completa! Quina forma és?');
      }
    } else {
        setFeedback('Punt incorrecte. Segueix l\'ordre de les coordenades!');
        setTimeout(() => setFeedback(''), 2000);
    }
  };

  const handleGuess = (shapeName: string) => {
    if (status !== 'guessing' || !currentShape) return;
    if (shapeName === currentShape.name) {
      setScore(s => s + 15);
      setFeedback('Correcte! Has identificat la forma celestial!');
    } else {
      setFeedback(`Oh no! Això era un ${currentShape.name}.`);
    }
    setTimeout(startNextRound, 2500);
  };
  
  return (
    <GameContainer onBackToMenu={onBackToMenu} theme="shapes">
      <header className="text-center mb-8">
        <div className="flex justify-center items-center gap-3">
          <ShapesIcon className="w-10 h-10 text-cyan-300" />
          <h1 className="text-4xl sm:text-5xl font-bold">Formes Celestials</h1>
        </div>
        <p className="opacity-80 mt-2 text-lg">Connecta les estrelles per formar constel·lacions i identifica-les.</p>
      </header>
      <main className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <div className="w-full lg:col-span-2">
          <CoordinateGrid
            gridMin={GRID_MIN}
            gridMax={GRID_MAX}
            targetPosition={{x:0, y:0}}
            userGuess={null}
            status={status}
            onGridClick={handleGridClick}
            connectionPoints={clickedPoints}
            isShapeClosed={status === 'guessing'}
          />
        </div>
        <div className="w-full flex flex-col gap-6 p-6 bg-slate-800/50 backdrop-blur-sm rounded-xl shadow-lg">
          <div className="bg-slate-700/50 p-3 rounded-lg text-center"><h2 className="text-lg font-bold text-slate-300">Puntuació</h2><span className="text-3xl font-bold text-cyan-300">{score}</span></div>
          {status === 'ready' ? (
            <button onClick={startNewGame} className="w-full px-8 py-4 bg-green-500 text-white text-xl font-bold rounded-lg shadow-md hover:bg-green-600 transition-all">Comença a Dibuixar</button>
          ) : (
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-2">{status === 'plotting' ? 'Fes clic a les estrelles en ordre:' : 'Identifica la constel·lació:'}</h3>
              {currentShape && status === 'plotting' && (
                <ul className="bg-slate-900/50 rounded-lg p-3 text-lg font-mono text-cyan-300">
                    {currentShape.vertices.map((v, i) => (
                        <li key={i} className={i < clickedPoints.length ? 'text-slate-500 line-through' : ''}>
                            {String.fromCharCode(65 + i)} ({v.x}, {v.y})
                        </li>
                    ))}
                </ul>
              )}
               {feedback && <p className="mt-4 text-center text-lg font-semibold text-yellow-300">{feedback}</p>}
               {status === 'guessing' && (
                <div className="flex flex-col gap-3 mt-4">
                    {shapeOptions.map(name => (
                        <button key={name} onClick={() => handleGuess(name)} className="w-full p-3 bg-cyan-600 text-white font-bold rounded-lg shadow-md hover:bg-cyan-500 transition-all">
                            {name}
                        </button>
                    ))}
                </div>
               )}
            </div>
          )}
        </div>
      </main>
    </GameContainer>
  );
};

export default CelestialShapesGame;
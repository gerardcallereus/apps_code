import React, { useState, useCallback } from 'react';
import { Point, GameStatus } from '../types';
import CoordinateGrid from '../components/CoordinateGrid';
import GameControls from '../components/GameControls';
import FeedbackPanel from '../components/FeedbackPanel';
import { SkullIcon } from '../components/Icons';
import GameContainer from '../components/GameContainer';

interface PirateTreasureGameProps {
    onBackToMenu: () => void;
}

const GRID_MIN = -5;
const GRID_MAX = 5;

const generateRandomPoint = (): Point => {
  const x = Math.floor(Math.random() * (GRID_MAX - GRID_MIN + 1)) + GRID_MIN;
  const y = Math.floor(Math.random() * (GRID_MAX - GRID_MIN + 1)) + GRID_MIN;
  return { x, y };
};

const PirateTreasureGame: React.FC<PirateTreasureGameProps> = ({ onBackToMenu }) => {
  const [targetPosition, setTargetPosition] = useState<Point>(generateRandomPoint);
  const [userGuess, setUserGuess] = useState<Point | null>(null);
  const [status, setStatus] = useState<GameStatus>('initial');
  const [feedback, setFeedback] = useState('');
  const [score, setScore] = useState(0);

  const handleStartGame = () => {
    setStatus('playing');
    setTargetPosition(generateRandomPoint());
    setUserGuess(null);
    setFeedback('');
  };

  const handleNextLevel = useCallback(() => {
    setStatus('playing');
    setTargetPosition(generateRandomPoint());
    setUserGuess(null);
    setFeedback('');
  }, []);

  const handleGuess = useCallback((guess: Point) => {
    setUserGuess(guess);
    if (guess.x === targetPosition.x && guess.y === targetPosition.y) {
      setStatus('correct');
      setFeedback("Molt bé! Has trobat el tresor!");
      setScore(prev => prev + 10);
    } else {
      let hint = '';
      if (guess.x === targetPosition.x) {
        hint += `La coordenada X (${guess.x}) és correcta! `;
      } else if (guess.x < targetPosition.x) {
        hint += "El tresor és més a la dreta. ";
      } else {
        hint += "El tresor és més a l'esquerra. ";
      }

      if (guess.y === targetPosition.y) {
        hint += `La coordenada Y (${guess.y}) és correcta!`;
      } else if (guess.y < targetPosition.y) {
        hint += "El tresor és més amunt.";
      } else {
        hint += "El tresor és més avall.";
      }
      setStatus('incorrect');
      setFeedback(hint.trim());
    }
  }, [targetPosition]);
  
  return (
    <GameContainer onBackToMenu={onBackToMenu} theme="pirate">
      <header className="text-center mb-8">
        <div className="flex justify-center items-center gap-3">
          <SkullIcon className="w-10 h-10 text-sky-600" />
          <h1 className="text-4xl sm:text-5xl font-bold">El Tresor del Pirata</h1>
        </div>
        <p className="opacity-80 mt-2 text-lg">Troba el tresor amagat a la graella introduint les seves coordenades.</p>
      </header>

      <main className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <div className="w-full lg:col-span-2">
          <CoordinateGrid
            gridMin={GRID_MIN}
            gridMax={GRID_MAX}
            targetPosition={targetPosition}
            userGuess={userGuess}
            status={status}
          />
        </div>

        <div className="w-full flex flex-col gap-6 p-6 bg-white/20 backdrop-blur-sm rounded-xl shadow-lg text-slate-800">
           <div className="flex justify-between items-center bg-slate-100 p-3 rounded-lg">
              <h2 className="text-xl font-bold text-slate-700">Puntuació</h2>
              <span className="text-2xl font-bold text-blue-600">{score}</span>
           </div>
          
          {status === 'initial' ? (
              <button
                  onClick={handleStartGame}
                  className="w-full px-8 py-4 bg-green-500 text-white text-xl font-bold rounded-lg shadow-md hover:bg-green-600 transition-all transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-green-300"
              >
                  Comença l'Aventura!
              </button>
          ) : (
              <>
                  <div>
                      <h3 className="text-lg font-semibold mb-2 text-center">Introdueix les coordenades:</h3>
                      <GameControls onSubmit={handleGuess} disabled={status === 'correct'} />
                  </div>
          
                  <div className="min-h-[80px]">
                    <FeedbackPanel message={feedback} status={status} />
                  </div>

                  {status === 'correct' && (
                      <button
                          onClick={handleNextLevel}
                          className="w-full px-8 py-3 bg-purple-600 text-white font-bold rounded-lg shadow-md hover:bg-purple-700 transition-all transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-purple-300"
                      >
                          Següent Mapa
                      </button>
                  )}
              </>
          )}
        </div>
      </main>
    </GameContainer>
  );
};

export default PirateTreasureGame;

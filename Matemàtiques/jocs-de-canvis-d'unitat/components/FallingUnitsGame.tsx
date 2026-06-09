import React, { useState, useEffect, useRef, useCallback } from 'react';
import GameShell from './GameShell';
import { generateFallingQuestion } from '../services/gameLogic';
import { FallingQuestion } from '../types';
import { HeartIcon, ReplayIcon } from './icons';

interface FallingItem {
  id: number;
  text: string;
  isCorrect: boolean;
  x: number; // percentage from left
  y: number; // percentage from top
}

type GameState = 'playing' | 'levelWon' | 'levelMissed' | 'gameOver';

const INITIAL_LIVES = 3;
const BASE_SPEED = 0.15; // Speed in % per frame
const SPAWN_INTERVAL = 2500; // ms

const FallingUnitsGame: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(INITIAL_LIVES);
  const [question, setQuestion] = useState(() => generateFallingQuestion());
  const [fallingItems, setFallingItems] = useState<FallingItem[]>([]);
  const [gameState, setGameState] = useState<GameState>('playing');
  const [feedback, setFeedback] = useState<{ type: 'correct' | 'incorrect', id: number } | null>(null);

  const gameAreaRef = useRef<HTMLDivElement>(null);
  // FIX: Provide an initial value to useRef to resolve the "Expected 1 arguments, but got 0" error.
  const gameLoopRef = useRef<number | null>(null);
  const nextItemId = useRef(0);
  const itemsToSpawn = useRef([...question.options].sort(() => Math.random() - 0.5));

  const resetGame = useCallback(() => {
    setScore(0);
    setLives(INITIAL_LIVES);
    const newQuestion = generateFallingQuestion();
    setQuestion(newQuestion);
    itemsToSpawn.current = [...newQuestion.options].sort(() => Math.random() - 0.5);
    setFallingItems([]);
    setFeedback(null);
    setGameState('playing');
  }, []);

  const nextLevel = useCallback(() => {
    const newQuestion = generateFallingQuestion();
    setQuestion(newQuestion);
    itemsToSpawn.current = [...newQuestion.options].sort(() => Math.random() - 0.5);
    setFallingItems([]);
    setFeedback(null);
    setGameState('playing');
  }, []);

  const handleItemClick = (item: FallingItem) => {
    if (gameState !== 'playing') return;

    if (item.isCorrect) {
      setGameState('levelWon');
      setFeedback({ type: 'correct', id: item.id });
      setScore(s => s + 10);
    } else {
      setLives(l => Math.max(0, l - 1));
      setFeedback({ type: 'incorrect', id: item.id });
      setTimeout(() => {
        setFallingItems(prev => prev.filter(i => i.id !== item.id));
        setFeedback(null);
      }, 1000);
    }
  };
  
  // Game State Manager
  useEffect(() => {
    if (gameState === 'levelWon') {
      const timer = setTimeout(nextLevel, 1500);
      return () => clearTimeout(timer);
    }
    if (gameState === 'levelMissed') {
      setLives(l => Math.max(0, l - 1));
      const timer = setTimeout(nextLevel, 1500);
      return () => clearTimeout(timer);
    }
  }, [gameState, nextLevel]);

  // Game Loop
  useEffect(() => {
    if (gameState !== 'playing') return;

    const gameLoop = () => {
      let correctItemMissed = false;
      setFallingItems(prevItems =>
        prevItems
          .map(item => ({ ...item, y: item.y + BASE_SPEED * (1 + score / 100) }))
          .filter(item => {
            if (item.y > 105) {
              if (item.isCorrect) {
                correctItemMissed = true;
              }
              return false; // Remove item if it's off-screen
            }
            return true;
          })
      );
      if (correctItemMissed) {
        setGameState('levelMissed');
      }
      gameLoopRef.current = requestAnimationFrame(gameLoop);
    };

    gameLoopRef.current = requestAnimationFrame(gameLoop);
    return () => {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current);
      }
    };
  }, [gameState, score]);

  // Item Spawner
  useEffect(() => {
    if (gameState !== 'playing') return;

    const spawnItem = () => {
      if (itemsToSpawn.current.length > 0) {
        const itemData = itemsToSpawn.current.pop()!;
        setFallingItems(prev => [
          ...prev,
          {
            id: nextItemId.current++,
            ...itemData,
            x: Math.random() * 85,
            y: -10,
          },
        ]);
      }
    };
    const spawner = setInterval(spawnItem, SPAWN_INTERVAL / (1 + score / 50));
    return () => clearInterval(spawner);
  }, [gameState, question, score]);
  
  // Check for game over
  useEffect(() => {
    if (lives <= 0) {
      setGameState('gameOver');
    }
  }, [lives]);

  const getButtonClass = (item: FallingItem) => {
    if (feedback?.id === item.id) {
        return feedback.type === 'correct' ? 'bg-green-500 scale-110 shadow-lg shadow-green-500/50' : 'bg-red-500 animate-shake';
    }
    if (gameState === 'levelWon' && item.isCorrect) {
        return 'bg-green-500 scale-110';
    }
     if (gameState !== 'playing') {
        return 'bg-purple-600 opacity-50';
    }
    return 'bg-purple-600 hover:bg-purple-500 hover:scale-105';
  }

  return (
    <GameShell title="Pluja d'Unitats" score={score} onBack={onBack}>
        <div className="relative">
             <style>{`
                @keyframes shake {
                    0%, 100% { transform: translateX(0); }
                    10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
                    20%, 40%, 60%, 80% { transform: translateX(5px); }
                }
                .animate-shake { animation: shake 0.5s ease-in-out; }
            `}</style>
            <div className="flex justify-between items-center mb-4">
                 <p className="text-xl text-center w-full">
                    Converteix: <span className="font-bold text-3xl text-cyan-400">{question.fromValue.toLocaleString('ca-ES')} {question.fromUnit.symbol}</span>
                 </p>
                <div className="flex items-center gap-1">
                    {Array.from({ length: INITIAL_LIVES }).map((_, i) => (
                        <HeartIcon key={i} className={i < lives ? 'text-red-500' : 'text-gray-600'} />
                    ))}
                </div>
            </div>

            <div
                ref={gameAreaRef}
                className="relative w-full h-96 bg-gray-900/50 rounded-lg overflow-hidden border border-gray-700"
            >
                {fallingItems.map((item) => (
                    <button
                        key={item.id}
                        onClick={() => handleItemClick(item)}
                        disabled={gameState !== 'playing'}
                        style={{
                            position: 'absolute',
                            top: `${item.y}%`,
                            left: `${item.x}%`,
                            transform: 'translateY(-50%)',
                        }}
                        className={`px-4 py-2 rounded-full font-semibold transition-all duration-300 ${getButtonClass(item)}`}
                    >
                        {item.text}
                    </button>
                ))}

                 {gameState === 'gameOver' && (
                    <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center text-center animate-fade-in z-10">
                        <h3 className="text-4xl font-bold text-red-500 mb-2">Has perdut!</h3>
                        <p className="text-xl mb-6">Puntuació final: {score}</p>
                        <button 
                          onClick={resetGame}
                          className="flex items-center gap-3 bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-3 px-6 rounded-lg transition-transform transform hover:scale-105"
                        >
                          <ReplayIcon />
                          <span>Tornar a jugar</span>
                        </button>
                    </div>
                )}
            </div>
        </div>
    </GameShell>
  );
};

export default FallingUnitsGame;
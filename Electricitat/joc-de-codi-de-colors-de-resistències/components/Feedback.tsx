import React from 'react';
import type { GameStatus } from '../types';

interface FeedbackProps {
  status: GameStatus;
  correctResistance: string;
  correctTolerance: number;
}

const CorrectIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6 mr-2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

const IncorrectIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6 mr-2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

export const Feedback: React.FC<FeedbackProps> = ({ status, correctResistance, correctTolerance }) => {
  if (status === 'playing') return null;

  const isCorrect = status === 'correct';
  const bgColor = isCorrect ? 'bg-green-500/10 border-green-500' : 'bg-red-500/10 border-red-500';
  const textColor = isCorrect ? 'text-green-400' : 'text-red-400';
  const title = isCorrect ? 'Correcte!' : 'Incorrecte!';

  return (
    <div className={`p-4 rounded-lg border ${bgColor} ${textColor} flex items-center`}>
      {isCorrect ? <CorrectIcon /> : <IncorrectIcon />}
      <div>
        <p className="font-bold">{title}</p>
        <p className="text-sm text-slate-300">
          La resposta correcta és: {correctResistance} ±{correctTolerance}%
        </p>
      </div>
    </div>
  );
};
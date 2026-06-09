import React from 'react';

interface ScoreboardProps {
  score: {
    correct: number;
    incorrect: number;
  };
  streak: number;
}

export const Scoreboard: React.FC<ScoreboardProps> = ({ score, streak }) => {
  return (
    <div className="flex justify-around items-center mb-6 text-center bg-slate-900/50 p-4 rounded-lg border border-slate-700">
      <div>
        <span className="block text-2xl font-bold text-green-400">{score.correct}</span>
        <span className="text-sm text-slate-400">Correctes</span>
      </div>
      <div>
        <span className="block text-2xl font-bold text-red-400">{score.incorrect}</span>
        <span className="text-sm text-slate-400">Incorrectes</span>
      </div>
      <div>
        <span className="block text-2xl font-bold text-yellow-400">{streak} 🔥</span>
        <span className="text-sm text-slate-400">Ratxa</span>
      </div>
    </div>
  );
};
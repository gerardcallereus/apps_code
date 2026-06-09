import React from 'react';
import { BackArrowIcon, StarIcon } from './icons';
import UnitReferenceHeader from './UnitReferenceHeader';

interface GameShellProps {
  title: string;
  score: number;
  onBack: () => void;
  children: React.ReactNode;
  roundInfo?: { current: number, total: number };
}

const GameShell: React.FC<GameShellProps> = ({ title, score, onBack, children, roundInfo }) => {
  return (
    <div className="w-full max-w-3xl mx-auto p-6 md:p-8 bg-white/80 backdrop-blur-md border border-slate-200 rounded-2xl shadow-xl animate-fade-in-scale">
      <header className="flex items-center justify-between mb-4 border-b border-slate-200 pb-4">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-slate-600 bg-slate-100 hover:bg-slate-200 hover:text-indigo-600 transition-all duration-200 group focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-400 rounded-full px-4 py-2 text-sm font-semibold"
        >
          <BackArrowIcon className="w-4 h-4" />
          <span>Menú</span>
        </button>
        <div className="text-center">
            <h2 className="text-2xl font-bold text-indigo-600">{title}</h2>
            {roundInfo && (
                <p className="text-md text-slate-500 font-semibold">
                    Pregunta {roundInfo.current} de {roundInfo.total}
                </p>
            )}
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-lg font-semibold bg-slate-100 text-slate-700 px-4 py-2 rounded-lg border border-slate-200">
            <StarIcon />
            <span>{score}</span>
          </div>
        </div>
      </header>
      <UnitReferenceHeader />
      <main className="mt-6">
        {children}
      </main>
    </div>
  );
};

export default GameShell;
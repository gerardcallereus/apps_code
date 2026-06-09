
import React from 'react';
import { ChevronLeftIcon } from './Icons';

type Theme = 'pirate' | 'space' | 'far-west' | 'sectors' | 'mirror' | 'teleporter' | 'shapes' | 'midpoint';

interface GameContainerProps {
  children: React.ReactNode;
  onBackToMenu: () => void;
  theme: Theme;
}

const themeClasses: Record<Theme, { bg: string; text: string; button: string }> = {
  pirate: {
    bg: 'bg-gradient-to-br from-cyan-200 to-blue-400',
    text: 'text-slate-800',
    button: 'text-slate-600 hover:text-blue-600',
  },
  space: {
    bg: 'bg-gradient-to-b from-slate-900 to-purple-900',
    text: 'text-white',
    button: 'text-slate-300 hover:text-purple-400',
  },
  'far-west': {
    bg: 'bg-gradient-to-br from-amber-200 to-orange-400',
    text: 'text-slate-800',
    button: 'text-slate-600 hover:text-amber-700',
  },
  sectors: {
    bg: 'bg-gradient-to-b from-gray-900 to-teal-900',
    text: 'text-white',
    button: 'text-slate-300 hover:text-teal-400',
  },
  mirror: {
    bg: 'bg-gradient-to-br from-emerald-200 to-green-400',
    text: 'text-slate-800',
    button: 'text-slate-600 hover:text-emerald-700',
  },
  teleporter: {
    bg: 'bg-gradient-to-b from-slate-900 to-indigo-900',
    text: 'text-white',
    button: 'text-slate-300 hover:text-indigo-400',
  },
  shapes: {
    bg: 'bg-gradient-to-br from-sky-900 to-cyan-800',
    text: 'text-white',
    button: 'text-slate-300 hover:text-cyan-300',
  },
  midpoint: {
    bg: 'bg-gradient-to-br from-lime-200 to-green-400',
    text: 'text-slate-800',
    button: 'text-slate-600 hover:text-lime-700',
  },
};

const GameContainer: React.FC<GameContainerProps> = ({ children, onBackToMenu, theme }) => {
  const styles = themeClasses[theme];
  return (
    <div className={`min-h-screen w-full flex items-center justify-center p-4 transition-colors duration-500 ${styles.bg}`}>
      <div className={`w-full max-w-6xl mx-auto ${styles.text}`}>
        <div className="mb-4">
          <button onClick={onBackToMenu} className={`flex items-center gap-2 font-semibold transition-colors duration-200 ${styles.button}`}>
            <ChevronLeftIcon className="w-5 h-5" />
            Tornar al Menú
          </button>
        </div>
        {children}
      </div>
    </div>
  );
};

export default GameContainer;

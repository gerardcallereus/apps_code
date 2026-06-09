import React from 'react';
import { Game } from '../types';
import { GAME_THEMES, GAME_ORDER } from '../theme';

interface MainMenuProps {
  onSelectGame: (game: Game) => void;
}

const GameButton: React.FC<{ 
    title: string; 
    description: string; 
    onClick: () => void;
    textClass: string;
    borderClass: string;
    hoverBgClass: string;
}> = ({ title, description, onClick, textClass, borderClass, hoverBgClass }) => (
    <button 
        onClick={onClick}
        className={`w-full text-left p-6 bg-white border border-slate-200 rounded-lg ${borderClass} ${hoverBgClass} transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-indigo-400`}
    >
        <div>
            <h3 className={`text-xl font-bold ${textClass}`}>{title}</h3>
            <p className="text-slate-500 mt-1">{description}</p>
        </div>
    </button>
);

const MainMenu: React.FC<MainMenuProps> = ({ onSelectGame }) => {
  return (
    <div className="w-full max-w-4xl mx-auto p-6 md:p-8 bg-white/80 backdrop-blur-md border border-slate-200 rounded-2xl shadow-xl animate-fade-in-scale">
        <header className="text-center mb-10">
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900">Joc de Conversió d'Unitats</h1>
            <p className="text-lg text-slate-600 mt-2">Tria un mode de joc per començar a practicar!</p>
        </header>
        
        <main className="grid md:grid-cols-2 gap-6">
            <div className="md:col-span-2 grid sm:grid-cols-2 gap-6">
                 <button 
                    onClick={() => onSelectGame('tournament1p')}
                    className="w-full text-left p-6 bg-gradient-to-r from-sky-500 to-blue-600 text-white border border-transparent rounded-lg hover:from-sky-600 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-300 shadow-lg"
                >
                    <div>
                        <h3 className="text-2xl font-bold">👤 {GAME_THEMES.tournament1p.name}</h3>
                        <p className="opacity-90 mt-1">{GAME_THEMES.tournament1p.description}</p>
                    </div>
                </button>
                <button 
                    onClick={() => onSelectGame('tournament2p')}
                    className="w-full text-left p-6 bg-gradient-to-r from-purple-500 to-indigo-600 text-white border border-transparent rounded-lg hover:from-purple-600 hover:to-indigo-700 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-indigo-300 shadow-lg"
                >
                    <div>
                        <h3 className="text-2xl font-bold">🏆 {GAME_THEMES.tournament2p.name}</h3>
                        <p className="opacity-90 mt-1">{GAME_THEMES.tournament2p.description}</p>
                    </div>
                </button>
            </div>
            
            {GAME_ORDER.map((gameId, index) => {
                const theme = GAME_THEMES[gameId];
                if (!theme) return null;
                return (
                    <GameButton 
                        key={gameId}
                        title={`${index + 1}. ${theme.name}`}
                        description={theme.description}
                        onClick={() => onSelectGame(gameId)}
                        textClass={theme.textClass}
                        borderClass={theme.borderClass}
                        hoverBgClass={theme.hoverBgClass}
                    />
                );
            })}
        </main>
    </div>
  );
};

export default MainMenu;
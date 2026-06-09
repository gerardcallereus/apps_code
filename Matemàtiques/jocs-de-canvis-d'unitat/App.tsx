import React, { useState } from 'react';
import MainMenu from './components/MainMenu';
import QuizGame from './components/QuizGame';
import FillBlankGame from './components/FillBlankGame';
import ComparisonGame from './components/ComparisonGame';
import WhackAMoleGame from './components/WhackAMoleGame';
import UnitMatchGame from './components/UnitMatchGame';
import UnitLadderGame from './components/UnitLadderGame';
import SortingGame from './components/SortingGame';
import UnitRaceGame from './components/UnitRaceGame';
import PuzzleGame from './components/PuzzleGame';
import LabGame from './components/LabGame';
import Tournament2PController from './components/Tournament2PController';
import Tournament1PController from './components/Tournament1PController';
import { Game } from './types';
import { GAME_THEMES } from './theme';

function App() {
  const [currentGame, setCurrentGame] = useState<Game>(null);
  const [pageBgOverride, setPageBgOverride] = useState<string | null>(null);


  const handleSelectGame = (game: Game) => {
    setCurrentGame(game);
  };

  const handleBackToMenu = () => {
    setCurrentGame(null);
    setPageBgOverride(null);
  };

  const renderGame = () => {
    switch (currentGame) {
      case 'quiz':
        return <QuizGame onBack={handleBackToMenu} />;
      case 'fillBlank':
        return <FillBlankGame onBack={handleBackToMenu} />;
      case 'comparison':
        return <ComparisonGame onBack={handleBackToMenu} />;
      case 'whackAMole':
        return <WhackAMoleGame onBack={handleBackToMenu} />;
      case 'unitMatch':
        return <UnitMatchGame onBack={handleBackToMenu} />;
      case 'unitLadder':
        return <UnitLadderGame onBack={handleBackToMenu} />;
      case 'sorting':
        return <SortingGame onBack={handleBackToMenu} />;
      case 'unitRace':
        return <UnitRaceGame onBack={handleBackToMenu} />;
      case 'puzzle':
        return <PuzzleGame onBack={handleBackToMenu} />;
      case 'lab':
        return <LabGame onBack={handleBackToMenu} />;
      case 'tournament2p':
        return <Tournament2PController onBack={handleBackToMenu} setPageBgOverride={setPageBgOverride} />;
      case 'tournament1p':
        return <Tournament1PController onBack={handleBackToMenu} setPageBgOverride={setPageBgOverride} />;
      default:
        return <MainMenu onSelectGame={handleSelectGame} />;
    }
  };

  const pageBg = pageBgOverride || (currentGame && GAME_THEMES[currentGame] 
    ? GAME_THEMES[currentGame].pageBgClass 
    : 'bg-slate-100');

  return (
    <div className={`${pageBg} text-slate-800 min-h-screen flex items-center justify-center p-4 font-sans transition-colors duration-500`}>
       <style>{`
        .animate-fade-in-scale {
            animation: fadeInScale 0.5s ease-out forwards;
        }
        @keyframes fadeInScale {
            from {
                opacity: 0;
                transform: scale(0.95);
            }
            to {
                opacity: 1;
                transform: scale(1);
            }
        }
        .animate-fade-in {
            animation: fadeIn 0.3s ease-out forwards;
        }
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
       `}</style>
      <main className="w-full">
        {renderGame()}
      </main>
    </div>
  );
}

export default App;
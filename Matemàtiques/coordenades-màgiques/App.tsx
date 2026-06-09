
import React, { useState } from 'react';
import GameMenu from './components/GameMenu';
import PirateTreasureGame from './games/PirateTreasureGame';
import SpaceRaceGame from './games/SpaceRaceGame';
import FarWestDuelGame from './games/FarWestDuelGame';
import StellarSectorsGame from './games/StellarSectorsGame';
import EnchantedMirrorGame from './games/EnchantedMirrorGame';
import QuantumTeleporterGame from './games/QuantumTeleporterGame';
import CelestialShapesGame from './games/CelestialShapesGame';
import MeetingPointGame from './games/MeetingPointGame';

type Game = 'menu' | 'pirate' | 'space' | 'duel' | 'sectors' | 'mirror' | 'teleporter' | 'shapes' | 'midpoint';

const App: React.FC = () => {
  const [activeGame, setActiveGame] = useState<Game>('menu');

  const renderGame = () => {
    switch (activeGame) {
      case 'pirate':
        return <PirateTreasureGame onBackToMenu={() => setActiveGame('menu')} />;
      case 'space':
        return <SpaceRaceGame onBackToMenu={() => setActiveGame('menu')} />;
      case 'duel':
        return <FarWestDuelGame onBackToMenu={() => setActiveGame('menu')} />;
      case 'sectors':
        return <StellarSectorsGame onBackToMenu={() => setActiveGame('menu')} />;
      case 'mirror':
        return <EnchantedMirrorGame onBackToMenu={() => setActiveGame('menu')} />;
      case 'teleporter':
        return <QuantumTeleporterGame onBackToMenu={() => setActiveGame('menu')} />;
      case 'shapes':
        return <CelestialShapesGame onBackToMenu={() => setActiveGame('menu')} />;
      case 'midpoint':
        return <MeetingPointGame onBackToMenu={() => setActiveGame('menu')} />;
      case 'menu':
      default:
        return (
          <GameMenu
            onSelectPirate={() => setActiveGame('pirate')}
            onSelectSpace={() => setActiveGame('space')}
            onSelectDuel={() => setActiveGame('duel')}
            onSelectSectors={() => setActiveGame('sectors')}
            onSelectMirror={() => setActiveGame('mirror')}
            onSelectTeleporter={() => setActiveGame('teleporter')}
            onSelectShapes={() => setActiveGame('shapes')}
            onSelectMidpoint={() => setActiveGame('midpoint')}
          />
        );
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen w-full flex flex-col items-center justify-center p-4 text-slate-800">
      {renderGame()}
    </div>
  );
};

export default App;

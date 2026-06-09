
import React from 'react';
import { SkullIcon, LightningBoltIcon, TargetIcon, QuadrantIcon, ReflectionIcon, TranslationIcon, ShapesIcon, MidpointIcon } from './Icons';

interface GameMenuProps {
  onSelectPirate: () => void;
  onSelectSpace: () => void;
  onSelectDuel: () => void;
  onSelectSectors: () => void;
  onSelectMirror: () => void;
  onSelectTeleporter: () => void;
  onSelectShapes: () => void;
  onSelectMidpoint: () => void;
}

const GameMenu: React.FC<GameMenuProps> = ({ 
    onSelectPirate, 
    onSelectSpace, 
    onSelectDuel, 
    onSelectSectors,
    onSelectMirror,
    onSelectTeleporter,
    onSelectShapes,
    onSelectMidpoint,
}) => {
  return (
    <div className="w-full max-w-6xl mx-auto text-center">
      <h1 className="text-4xl sm:text-5xl font-bold text-slate-800 mb-2">Centre de Jocs de Coordenades</h1>
      <p className="text-slate-600 mt-2 text-lg mb-12">Tria una aventura i posa a prova les teves habilitats!</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <GameCard
          onClick={onSelectPirate}
          icon={<SkullIcon className="w-10 h-10 text-sky-600" />}
          title="El Tresor del Pirata"
          description="Un tresor és amagat. Utilitza les pistes per deduir les coordenades i trobar el botí!"
          borderColor="border-sky-500"
          ringColor="ring-sky-300"
        />
        <GameCard
          onClick={onSelectSpace}
          icon={<LightningBoltIcon className="w-10 h-10 text-purple-600" />}
          title="Carrera Espacial"
          description="Un punt apareix a la galàxia. Introdueix les coordenades abans que s'acabi el temps. Velocitat i precisió!"
          borderColor="border-purple-500"
          ringColor="ring-purple-300"
        />
        <GameCard
          onClick={onSelectDuel}
          icon={<TargetIcon className="w-10 h-10 text-amber-600" />}
          title="El Duel del Far West"
          description="Se't donaran unes coordenades. Fes clic al punt exacte a la graella. Sigues el més ràpid en desenfundar!"
          borderColor="border-amber-500"
          ringColor="ring-amber-300"
        />
        <GameCard
          onClick={onSelectSectors}
          icon={<QuadrantIcon className="w-10 h-10 text-teal-600" />}
          title="Sectors Estel·lars"
          description="Classifica objectes al teu radar identificant el seu quadrant abans que s'acabi el temps. Concentració màxima!"
          borderColor="border-teal-500"
          ringColor="ring-teal-300"
        />
        <GameCard
          onClick={onSelectMirror}
          icon={<ReflectionIcon className="w-10 h-10 text-pink-600" />}
          title="El Mirall Encantat"
          description="Un punt apareix en un bosc màgic. Troba el seu reflex a través dels eixos. Posa a prova la teva visió espacial!"
          borderColor="border-pink-500"
          ringColor="ring-pink-300"
        />
        <GameCard
          onClick={onSelectTeleporter}
          icon={<TranslationIcon className="w-10 h-10 text-indigo-600" />}
          title="Teletransportador Quàntic"
          description="Calcula la destinació d'un punt després d'una translació. Introdueix la idea de vectors de forma visual!"
          borderColor="border-indigo-500"
          ringColor="ring-indigo-300"
        />
        <GameCard
          onClick={onSelectShapes}
          icon={<ShapesIcon className="w-10 h-10 text-cyan-600" />}
          title="Formes Celestials"
          description="Connecta els punts en ordre per dibuixar una constel·lació i identifica la figura geomètrica resultant."
          borderColor="border-cyan-500"
          ringColor="ring-cyan-300"
        />
        <GameCard
          onClick={onSelectMidpoint}
          icon={<MidpointIcon className="w-10 h-10 text-lime-600" />}
          title="Punt de Trobada"
          description="Dues naus necessiten rescat. Fes clic al punt exacte a mig camí entre elles. Precisió al rescat!"
          borderColor="border-lime-500"
          ringColor="ring-lime-300"
        />
      </div>
    </div>
  );
};

interface GameCardProps {
    onClick: () => void;
    icon: React.ReactNode;
    title: string;
    description: string;
    borderColor: string;
    ringColor: string;
}

const GameCard: React.FC<GameCardProps> = ({ onClick, icon, title, description, borderColor, ringColor }) => (
    <button
      onClick={onClick}
      className={`group text-left p-6 bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border-4 border-transparent hover:${borderColor} focus:outline-none focus:ring-4 focus:${ringColor}`}
    >
      <div className="flex items-center gap-4 mb-3">
        {icon}
        <h2 className="text-2xl font-bold text-slate-800">{title}</h2>
      </div>
      <p className="text-slate-600">{description}</p>
    </button>
);


export default GameMenu;

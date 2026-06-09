import React from 'react';
import Tournament2PPodium from './Tournament2PPodium';
import { useTournament, TournamentProvider } from './TournamentContext';
import { GAME_THEMES } from '../theme';

// Game Components
import QuizGame from './QuizGame';
import FillBlankGame from './FillBlankGame';
import ComparisonGame from './ComparisonGame';
import WhackAMoleGame from './WhackAMoleGame';
import SortingGame from './SortingGame';
import UnitRaceGame from './UnitRaceGame';
import PuzzleGame from './PuzzleGame';
import LabGame from './LabGame';

interface Tournament2PControllerProps {
    onBack: () => void;
    setPageBgOverride: (bgClass: string | null) => void;
}

const Tournament2PController: React.FC<Tournament2PControllerProps> = ({ onBack, setPageBgOverride }) => {
    return (
        <TournamentProvider onBack={onBack} setPageBgOverride={setPageBgOverride}>
            <TournamentView />
        </TournamentProvider>
    );
};

const TournamentView = () => {
    const { gameState } = useTournament();

    const renderContent = () => {
        switch (gameState) {
            case 'setup':
                return <TournamentSetup />;
            case 'transition':
                return <TransitionScreen />;
            case 'playing':
                return <RenderGame />;
            case 'finished':
                return <TournamentPodium />;
            default: return null;
        }
    };
    
    return <div className="w-full max-w-4xl mx-auto">{renderContent()}</div>;
}

const TournamentSetup = () => {
    const { startGame, onBack } = useTournament();
    const [p1, setP1] = React.useState('');
    const [p2, setP2] = React.useState('');
    const [error, setError] = React.useState<string | null>(null);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const trimmedP1 = p1.trim();
        const trimmedP2 = p2.trim();

        if (trimmedP1 && trimmedP1.toLowerCase() === trimmedP2.toLowerCase()) {
            setError('Els noms dels jugadors han de ser diferents.');
            return;
        }
        
        setError(null);
        startGame(p1, p2);
    };

    return (
        <div className="p-8 bg-white/80 backdrop-blur-md border border-slate-200 rounded-2xl shadow-xl text-center animate-fade-in-scale">
            <h1 className="text-4xl font-bold text-indigo-600 mb-2">Torneig 2 Jugadors</h1>
            <p className="text-slate-600 mb-8">Introduïu els vostres noms per començar la competició!</p>
            <form onSubmit={handleSubmit} className="space-y-4 max-w-sm mx-auto">
                <input type="text" value={p1} onChange={e => { setP1(e.target.value); setError(null); }} placeholder="Nom i cognoms del Jugador 1" className="w-full text-center text-xl p-3 rounded-lg border-2 border-slate-300 focus:border-indigo-500 focus:ring-indigo-500 transition"/>
                <input type="text" value={p2} onChange={e => { setP2(e.target.value); setError(null); }} placeholder="Nom i cognoms del Jugador 2" className="w-full text-center text-xl p-3 rounded-lg border-2 border-slate-300 focus:border-indigo-500 focus:ring-indigo-500 transition"/>
                {error && <p className="text-rose-500 font-semibold pt-2">{error}</p>}
                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                    <button type="button" onClick={onBack} className="w-full bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold py-3 px-6 rounded-lg">Menú</button>
                    <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-lg">Començar</button>
                </div>
            </form>
        </div>
    );
};

const TransitionScreen = () => {
    const { players, currentPlayerIndex, gameIndex, shuffledGames } = useTournament();
    const game = shuffledGames[gameIndex];

    if (!game) {
        return (
             <div className="p-8 bg-white/80 backdrop-blur-md border border-slate-200 rounded-2xl shadow-xl text-center animate-fade-in">
                <h2 className="text-3xl font-bold">Preparant el següent joc...</h2>
            </div>
        );
    }

    return (
        <div className="p-8 bg-white/80 backdrop-blur-md border border-slate-200 rounded-2xl shadow-xl text-center animate-fade-in">
            <div className="flex justify-between items-center mb-8">
                <div className="text-center w-1/2">
                    <p className="text-lg font-semibold text-purple-600">{players[0].name}</p>
                    <p className="text-4xl font-bold">{players[0].score}</p>
                </div>
                 <div className="text-center w-1/2">
                    <p className="text-lg font-semibold text-teal-600">{players[1].name}</p>
                    <p className="text-4xl font-bold">{players[1].score}</p>
                </div>
            </div>
            <div className="border-t border-slate-200 pt-8">
                <p className="text-xl text-slate-600">Torn de:</p>
                <h2 className={`text-5xl font-bold my-2 ${currentPlayerIndex === 0 ? 'text-purple-600' : 'text-teal-600'}`}>{players[currentPlayerIndex].name}</h2>
                <p className="text-2xl text-slate-500 mt-4">Següent joc: <span className="font-bold text-slate-800">{game.name}</span></p>
            </div>
        </div>
    );
};

const RenderGame = () => {
    const { onBack, gameIndex, shuffledGames } = useTournament();
    const gameKey = shuffledGames[gameIndex]?.key;

    if (!gameKey) return <div className="text-center p-8 text-xl">Carregant repte...</div>;
    
    switch (gameKey) {
        case 'quiz': return <QuizGame onBack={onBack} />;
        case 'fillBlank': return <FillBlankGame onBack={onBack} />;
        case 'comparison': return <ComparisonGame onBack={onBack} />;
        case 'whackAMole': return <WhackAMoleGame onBack={onBack} />;
        case 'sorting': return <SortingGame onBack={onBack} />;
        case 'unitRace': return <UnitRaceGame onBack={onBack} />;
        case 'puzzle': return <PuzzleGame onBack={onBack} />;
        case 'lab': return <LabGame onBack={onBack} />;
        default: return <div>Joc no trobat.</div>;
    }
};

const TournamentPodium = () => {
    const { players, playerLogs, retryGame, onBack } = useTournament();
    return <Tournament2PPodium players={players} playerLogs={playerLogs} onRetry={retryGame} onBack={onBack} />;
}

export default Tournament2PController;
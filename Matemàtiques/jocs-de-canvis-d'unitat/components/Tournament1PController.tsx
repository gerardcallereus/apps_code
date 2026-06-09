import React, { useState, useEffect, useCallback } from 'react';
import { Game, Player, TournamentState, TournamentContextType, ScoreFeedbackInfo, TournamentGame, PlayerLog, TurnLog, SortingItem, LinkedPuzzleStep } from '../types';
import * as gameLogic from '../services/gameLogic';
import { GAME_THEMES } from '../theme';
import { TournamentContext } from './TournamentContext';
import Tournament1PScoreScreen from './Tournament1PScoreScreen';

// Game Components
import QuizGame from './QuizGame';
import FillBlankGame from './FillBlankGame';
import ComparisonGame from './ComparisonGame';
import WhackAMoleGame from './WhackAMoleGame';
import SortingGame from './SortingGame';
import UnitRaceGame from './UnitRaceGame';
import PuzzleGame from './PuzzleGame';
import LabGame from './LabGame';

const TOURNAMENT_GAMES: TournamentGame[] = [
    { key: 'sorting', name: "Ordena les Mides" }, { key: 'quiz', name: "Test Ràpid" },
    { key: 'fillBlank', name: "Omple el Buit" }, { key: 'comparison', name: "Compara Valors" },
    { key: 'lab', name: "El Laboratori" }, { key: 'puzzle', name: "Trencaclosques" },
    { key: 'unitRace', name: "Cursa d'Unitats" }, { key: 'whackAMole', name: "La Fuga del Castell" },
];
const MULTI_QUESTION_GAMES: Game[] = ['quiz', 'fillBlank', 'comparison', 'unitRace'];
const QUESTIONS_PER_ROUND = 3;

interface Tournament1PControllerProps {
    onBack: () => void;
    setPageBgOverride: (bgClass: string | null) => void;
}

const Tournament1PController: React.FC<Tournament1PControllerProps> = ({ onBack: baseOnBack, setPageBgOverride }) => {
    const [gameState, setGameState] = useState<TournamentState>('setup');
    const [player, setPlayer] = useState<Player>({ name: 'Jugador', score: 0 });
    const [playerName, setPlayerName] = useState('');
    const [playerLog, setPlayerLog] = useState<PlayerLog>({});
    const [gameIndex, setGameIndex] = useState(0);
    const [shuffledGames, setShuffledGames] = useState<TournamentGame[]>([]);
    const [challenge, setChallenge] = useState<any>(null);
    const [round, setRound] = useState(0);
    const [scoreFeedback, setScoreFeedback] = useState<ScoreFeedbackInfo | null>(null);
    const [startTime, setStartTime] = useState(0);

    const generateChallenge = useCallback(() => {
        if (shuffledGames.length === 0 || gameIndex >= shuffledGames.length) return null;
        const gameKey = shuffledGames[gameIndex]?.key;
        switch (gameKey) {
            case 'quiz': return gameLogic.generateQuizQuestion();
            case 'fillBlank': return gameLogic.generateFillBlankQuestion();
            case 'comparison': return gameLogic.generateComparisonQuestion();
            case 'whackAMole': return gameLogic.generateQuizQuestion();
            case 'sorting': return gameLogic.generateSortingQuestion(5);
            case 'unitRace': return gameLogic.generateUnitRaceQuestion();
            case 'puzzle': return gameLogic.generateLinkedPuzzleQuestion(3);
            case 'lab': return gameLogic.generateLabAlchemyQuestion();
            default: return null;
        }
    }, [gameIndex, shuffledGames]);

    const startGame = (name: string) => {
        setPlayer({ name: name.trim() || 'Jugador', score: 0 });
        const finalGame = TOURNAMENT_GAMES.find(g => g.key === 'whackAMole')!;
        const otherGames = TOURNAMENT_GAMES.filter(g => g.key !== 'whackAMole');
        setShuffledGames([...otherGames.sort(() => Math.random() - 0.5), finalGame]);
        setPlayerLog({});
        setGameIndex(0);
        setRound(0);
        setGameState('transition');
    };
    
    const requestNewChallenge = () => {
        setChallenge(generateChallenge());
    };

    const endTurnAfterDelay = (delay = 2000) => {
        setTimeout(() => {
            setScoreFeedback(null);
            setRound(0);
            if (gameIndex < shuffledGames.length - 1) {
                setGameIndex(prev => prev + 1);
                setGameState('transition');
            } else {
                setGameState('finished');
            }
        }, delay);
    };

    const submitAnswer = (result: { scoreDelta: number; userAnswer?: any; isCorrect?: boolean; }) => {
        const { scoreDelta, userAnswer, isCorrect } = result;
        const elapsedTime = Date.now() - startTime;
        const currentGameKey = shuffledGames[gameIndex].key;
        
        const timeBonus = scoreDelta > 0 && currentGameKey !== 'unitRace' && currentGameKey !== 'whackAMole' ? Math.max(0, 30 - Math.floor(elapsedTime / 1000)) : 0;
        const totalPoints = scoreDelta + timeBonus;

        setPlayer(prevPlayer => ({ ...prevPlayer, score: Math.max(0, prevPlayer.score + totalPoints) }));
        
        const newLogEntry: TurnLog = { question: challenge, userAnswer, correctAnswer: challenge?.correctAnswer, isCorrect, score: totalPoints };
        setPlayerLog(prevLog => {
            const newLog = { ...prevLog };
            if (!newLog[currentGameKey as keyof PlayerLog]) newLog[currentGameKey as keyof PlayerLog] = [];
            newLog[currentGameKey as keyof PlayerLog]!.push(newLogEntry);
            return newLog;
        });

        if (MULTI_QUESTION_GAMES.includes(currentGameKey as Game)) {
            if (round < QUESTIONS_PER_ROUND - 1) {
                setTimeout(() => { setRound(prev => prev + 1); requestNewChallenge(); }, 800);
            } else {
                endTurnAfterDelay();
            }
        } else {
            if (scoreDelta > 0) setScoreFeedback({ base: scoreDelta, bonus: timeBonus, total: totalPoints });
            endTurnAfterDelay();
        }
    };
    
    const onBack = () => { setPageBgOverride(null); baseOnBack(); };
    const retryGame = () => { setGameState('setup'); };

    useEffect(() => {
        const currentGameKey = shuffledGames[gameIndex]?.key;
        if (gameState === 'transition') {
            if (currentGameKey) setPageBgOverride(GAME_THEMES[currentGameKey].pageBgClass);
            const timer = setTimeout(() => { setChallenge(generateChallenge()); setGameState('playing'); }, 2500);
            return () => clearTimeout(timer);
        } else if (gameState === 'setup' || gameState === 'finished') {
            setPageBgOverride(GAME_THEMES.tournament1p.pageBgClass);
        }
    }, [gameState, gameIndex, generateChallenge, setPageBgOverride, shuffledGames]);

    useEffect(() => { if (gameState === 'playing') setStartTime(Date.now()); }, [gameState, challenge]);
    useEffect(() => { setPageBgOverride(GAME_THEMES.tournament1p.pageBgClass); return () => setPageBgOverride(null); }, [setPageBgOverride]);

    const contextValue: TournamentContextType = {
        gameState, players: [player, { name: '', score: 0 }], playerLogs: [playerLog, {}], gameIndex, shuffledGames,
        currentPlayerIndex: 0, challenge,
        roundInfo: MULTI_QUESTION_GAMES.includes(shuffledGames[gameIndex]?.key as Game) ? { current: round + 1, total: QUESTIONS_PER_ROUND } : undefined,
        scoreFeedback, startGame: () => {}, submitAnswer, requestNewChallenge, onBack, retryGame
    };

    const renderContent = () => {
        if (gameState === 'setup') {
            return (
                <div className="p-8 bg-white/80 backdrop-blur-md border border-slate-200 rounded-2xl shadow-xl text-center animate-fade-in-scale">
                    <h1 className="text-4xl font-bold text-sky-600 mb-2">Torneig en Solitari</h1>
                    <p className="text-slate-600 mb-8">Posa a prova les teves habilitats en una sèrie de reptes!</p>
                    <form onSubmit={(e) => { e.preventDefault(); startGame(playerName); }} className="space-y-4 max-w-sm mx-auto">
                         <input type="text" value={playerName} onChange={e => setPlayerName(e.target.value)} placeholder="Escriu el teu nom i cognoms" className="w-full text-center text-xl p-3 rounded-lg border-2 border-slate-300 focus:border-sky-500 focus:ring-sky-500 transition"/>
                        <div className="flex flex-col sm:flex-row gap-4 pt-4">
                            <button type="button" onClick={onBack} className="w-full bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold py-3 px-6 rounded-lg">Menú</button>
                            <button type="submit" className="w-full bg-sky-600 hover:bg-sky-700 text-white font-bold py-3 px-6 rounded-lg">Començar</button>
                        </div>
                    </form>
                </div>
            );
        }
        if (gameState === 'transition') {
            const game = shuffledGames[gameIndex];
            return (
                <div className="p-8 bg-white/80 backdrop-blur-md border border-slate-200 rounded-2xl shadow-xl text-center animate-fade-in">
                    <p className="text-xl text-slate-500">Repte {gameIndex + 1} / {shuffledGames.length}</p>
                    <h2 className="text-5xl font-bold my-4">{game?.name || 'Carregant...'}</h2>
                    <p className="text-2xl font-semibold">Puntuació: {player.score}</p>
                </div>
            );
        }
        if (gameState === 'playing') {
            const gameKey = shuffledGames[gameIndex]?.key;
            const GameComponent = {
                quiz: QuizGame, fillBlank: FillBlankGame, comparison: ComparisonGame,
                whackAMole: WhackAMoleGame, sorting: SortingGame, unitRace: UnitRaceGame,
                puzzle: PuzzleGame, lab: LabGame
            }[gameKey as string];
            return GameComponent ? <GameComponent onBack={onBack} /> : <div>Joc no trobat.</div>;
        }
        if (gameState === 'finished') {
            return <Tournament1PScoreScreen player={player} log={playerLog} onRetry={retryGame} onBack={onBack} />;
        }
        return null;
    };

    return (
        <TournamentContext.Provider value={contextValue}>
            <div className="w-full max-w-4xl mx-auto">{renderContent()}</div>
        </TournamentContext.Provider>
    );
};

export default Tournament1PController;
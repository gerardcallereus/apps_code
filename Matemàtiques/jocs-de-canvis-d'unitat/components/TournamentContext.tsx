import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { Game, Player, TournamentState, TournamentContextType, ScoreFeedbackInfo, TournamentGame, PlayerLog, TurnLog, SortingItem, LinkedPuzzleStep } from '../types';
import * as gameLogic from '../services/gameLogic';
import { GAME_THEMES } from '../theme';

// FIX: Export 'TournamentContext' to allow it to be imported and used in other components.
export const TournamentContext = createContext<TournamentContextType | null>(null);

export const useTournament = () => {
    return useContext(TournamentContext);
};

interface TournamentProviderProps {
    children: React.ReactNode;
    onBack: () => void;
    setPageBgOverride: (bgClass: string | null) => void;
}

const TOURNAMENT_GAMES: TournamentGame[] = [
    { key: 'sorting', name: "Ordena les Mides" }, { key: 'quiz', name: "Test Ràpid" },
    { key: 'fillBlank', name: "Omple el Buit" }, { key: 'comparison', name: "Compara Valors" },
    { key: 'lab', name: "El Laboratori" }, { key: 'puzzle', name: "Trencaclosques" },
    { key: 'unitRace', name: "Cursa d'Unitats" }, { key: 'whackAMole', name: "La Fuga del Castell" },
];
const MULTI_QUESTION_GAMES: Game[] = ['quiz', 'fillBlank', 'comparison', 'unitRace'];
const QUESTIONS_PER_ROUND = 3;


export const TournamentProvider: React.FC<TournamentProviderProps> = ({ children, onBack: baseOnBack, setPageBgOverride }) => {
    const [gameState, setGameState] = useState<TournamentState>('setup');
    const [players, setPlayers] = useState<[Player, Player]>([{ name: 'Jugador 1', score: 0 }, { name: 'Jugador 2', score: 0 }]);
    const [playerLogs, setPlayerLogs] = useState<[PlayerLog, PlayerLog]>([{}, {}]);
    const [gameIndex, setGameIndex] = useState(0);
    const [shuffledGames, setShuffledGames] = useState<TournamentGame[]>([]);
    const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
    const [challenge, setChallenge] = useState<any>(null);
    const [round, setRound] = useState(0);
    const [scoreFeedback, setScoreFeedback] = useState<ScoreFeedbackInfo | null>(null);
    const [startTime, setStartTime] = useState(0);
    const [roundScore, setRoundScore] = useState<ScoreFeedbackInfo>({ base: 0, bonus: 0, total: 0 });

    const generateChallenge = useCallback(() => {
        if (shuffledGames.length === 0) return null;
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

    const startGame = (p1Name: string, p2Name: string) => {
        setPlayers([
            { name: p1Name.trim() || 'Jugador 1', score: 0 },
            { name: p2Name.trim() || 'Jugador 2', score: 0 }
        ]);
        const finalGame = TOURNAMENT_GAMES.find(g => g.key === 'whackAMole')!;
        const otherGames = TOURNAMENT_GAMES.filter(g => g.key !== 'whackAMole');
        setShuffledGames([...otherGames.sort(() => Math.random() - 0.5), finalGame]);
        setPlayerLogs([{}, {}]);
        setGameIndex(0);
        setCurrentPlayerIndex(0);
        setRound(0);
        setRoundScore({ base: 0, bonus: 0, total: 0 });
        setGameState('transition');
    };

    const requestNewChallenge = () => {
        setChallenge(generateChallenge());
    };

    const endTurnAfterDelay = () => {
        setTimeout(() => {
            setScoreFeedback(null);
            setRound(0);
            setRoundScore({ base: 0, bonus: 0, total: 0 });

            if (currentPlayerIndex === 0) {
                setCurrentPlayerIndex(1);
                setGameState('transition');
            } else {
                if (gameIndex < shuffledGames.length - 1) {
                    setGameIndex(prev => prev + 1);
                    setCurrentPlayerIndex(0);
                    setGameState('transition');
                } else {
                    setGameState('finished');
                }
            }
        }, 2000);
    };
    
    const submitAnswer = (result: { scoreDelta: number; userAnswer?: any; isCorrect?: boolean; }) => {
        const { scoreDelta, userAnswer, isCorrect } = result;
        
        const elapsedTime = Date.now() - startTime;
        const currentGameKey = shuffledGames[gameIndex].key;
        
        const isComplexGame = ['lab', 'puzzle', 'unitRace', 'sorting'].includes(currentGameKey as string);
        const difficultyMultiplier = isComplexGame ? 1.5 : 1.0;

        const timeBonus = scoreDelta > 0 && currentGameKey !== 'unitRace' && currentGameKey !== 'whackAMole'
            ? Math.max(0, 50 - Math.floor(elapsedTime / 1000))
            : 0;

        const totalPoints = Math.round((scoreDelta + timeBonus) * difficultyMultiplier);
        
        setPlayers(prevPlayers => {
            const newPlayers = [...prevPlayers] as [Player, Player];
            newPlayers[currentPlayerIndex].score = Math.max(0, newPlayers[currentPlayerIndex].score + totalPoints);
            return newPlayers;
        });
        
        // Log the turn
        let correctAnswer;
        switch (currentGameKey) {
            case 'sorting':
                correctAnswer = [...challenge].sort((a: SortingItem, b: SortingItem) => a.baseValue - b.baseValue).map((i: SortingItem) => i.text);
                break;
            case 'puzzle':
                correctAnswer = challenge.map((step: LinkedPuzzleStep) => step.correctAnswer);
                break;
            case 'lab':
                correctAnswer = "Poció completada correctament";
                break;
            case 'whackAMole':
                correctAnswer = true; // Win condition
                break;
            default:
                correctAnswer = challenge?.correctAnswer;
        }

        const newLogEntry: TurnLog = {
          question: challenge,
          userAnswer,
          correctAnswer,
          isCorrect,
          score: totalPoints,
        };
        
        setPlayerLogs(prevLogs => {
            const newLogs = [...prevLogs] as [PlayerLog, PlayerLog];
            const currentPlayerLog = { ...newLogs[currentPlayerIndex] };
            if (!currentPlayerLog[currentGameKey as keyof PlayerLog]) {
                currentPlayerLog[currentGameKey as keyof PlayerLog] = [];
            }
            currentPlayerLog[currentGameKey as keyof PlayerLog]!.push(newLogEntry);
            newLogs[currentPlayerIndex] = currentPlayerLog;
            return newLogs;
        });


        const isMultiQuestionGame = MULTI_QUESTION_GAMES.includes(currentGameKey as Game);

        if (isMultiQuestionGame) {
            const newRoundScore = {
                base: roundScore.base + scoreDelta,
                bonus: roundScore.bonus + timeBonus,
                total: roundScore.total + totalPoints
            };
            setRoundScore(newRoundScore);

            if (round < QUESTIONS_PER_ROUND - 1) {
                setTimeout(() => {
                    setRound(prev => prev + 1);
                    setChallenge(generateChallenge());
                }, 800);
            } else {
                if (newRoundScore.total > 0) {
                    setScoreFeedback({ ...newRoundScore, isRoundSummary: true });
                }
                endTurnAfterDelay();
            }
        } else {
            if (scoreDelta > 0) {
                setScoreFeedback({ base: scoreDelta, bonus: timeBonus, total: totalPoints, isRoundSummary: false });
            }
            endTurnAfterDelay();
        }
    };

    const onBack = () => {
        setPageBgOverride(null);
        baseOnBack();
    };
    
    const retryGame = () => {
        setGameState('setup');
        setGameIndex(0);
        setPlayers([{ name: 'Jugador 1', score: 0 }, { name: 'Jugador 2', score: 0 }]);
        setPlayerLogs([{}, {}]);
        setRound(0);
        setRoundScore({ base: 0, bonus: 0, total: 0 });
    };

    useEffect(() => {
        if (shuffledGames.length === 0 && gameState !== 'setup') return;
        const currentGameKey = shuffledGames[gameIndex]?.key;
        
        switch(gameState) {
            case 'transition':
                if (currentGameKey) setPageBgOverride(GAME_THEMES[currentGameKey].pageBgClass);
                const timer = setTimeout(() => {
                    setChallenge(generateChallenge());
                    setGameState('playing');
                }, 3000);
                return () => clearTimeout(timer);
            case 'setup':
            case 'finished':
                setPageBgOverride(GAME_THEMES.tournament2p.pageBgClass);
                break;
        }
    }, [gameState, gameIndex, generateChallenge, setPageBgOverride, shuffledGames]);
    
    useEffect(() => {
        if (gameState === 'playing') {
            setStartTime(Date.now());
        }
    }, [gameState, challenge]);

    useEffect(() => {
        setPageBgOverride(GAME_THEMES.tournament2p.pageBgClass);
        return () => setPageBgOverride(null);
    }, [setPageBgOverride]);

    const value: TournamentContextType = {
        gameState, players, playerLogs, gameIndex, shuffledGames, currentPlayerIndex, challenge,
        roundInfo: MULTI_QUESTION_GAMES.includes(shuffledGames[gameIndex]?.key as Game) 
            ? { current: round + 1, total: QUESTIONS_PER_ROUND } 
            : undefined,
        scoreFeedback,
        startGame, submitAnswer, requestNewChallenge, onBack, retryGame
    };

    return <TournamentContext.Provider value={value}>{children}</TournamentContext.Provider>;
};

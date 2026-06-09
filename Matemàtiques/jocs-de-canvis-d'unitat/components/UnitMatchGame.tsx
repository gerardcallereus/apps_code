import React, { useState, useEffect, useCallback } from 'react';
import GameShell from './GameShell';
import { generateUnitMatchGrid } from '../services/gameLogic';
import { Card } from '../types';
import { ReplayIcon } from './icons';

interface UnitMatchGameProps {
  onBack: () => void;
  isTournamentMode?: boolean;
  cards?: Card[];
  onTournamentAnswer?: (scoreDelta: number) => void;
  score?: number;
}

type GameStage = 'setup' | 'playing' | 'won';
type BoardSize = { name: string; rows: number; cols: number; pairs: number; };

const SIZES: BoardSize[] = [
    { name: '4x3', rows: 3, cols: 4, pairs: 6 },
    { name: '4x4', rows: 4, cols: 4, pairs: 8 },
    { name: '5x4', rows: 4, cols: 5, pairs: 10 },
];

const gridClasses: Record<number, string> = { 4: 'grid-cols-4', 5: 'grid-cols-5' };

const UnitMatchGame: React.FC<UnitMatchGameProps> = ({ onBack, isTournamentMode, cards: cardsProp, onTournamentAnswer, score: scoreProp }) => {
    const [internalScore, setInternalScore] = useState(0);
    const score = isTournamentMode ? scoreProp ?? 0 : internalScore;
    const [clicks, setClicks] = useState(0);

    const [cards, setCards] = useState<Card[]>([]);
    const [flippedCards, setFlippedCards] = useState<Card[]>([]);
    const [isChecking, setIsChecking] = useState(false);
    const [gameStage, setGameStage] = useState<GameStage>(isTournamentMode ? 'playing' : 'setup');
    const [currentSize, setCurrentSize] = useState<BoardSize | null>(null);
    
    useEffect(() => {
        if (isTournamentMode && cardsProp) {
            setCards(cardsProp);
            setFlippedCards([]);
            setIsChecking(false);
            setClicks(0);
            setInternalScore(0);
            setGameStage('playing');
        }
    }, [isTournamentMode, cardsProp]);

    const setupGame = useCallback((size: BoardSize) => {
        setCurrentSize(size);
        setCards(generateUnitMatchGrid(size.pairs));
        setFlippedCards([]);
        setIsChecking(false);
        setInternalScore(0);
        setClicks(0);
        setGameStage('playing');
    }, []);

    useEffect(() => {
        if (flippedCards.length === 2) {
            setIsChecking(true);
            const [first, second] = flippedCards;
            
            if (first.pairId === second.pairId) {
                setTimeout(() => {
                    setCards(prev => prev.map(c => (c.pairId === first.pairId ? { ...c, status: 'matched' } : c)));
                    setFlippedCards([]);
                    setIsChecking(false);
                }, 500);
            } else {
                setTimeout(() => {
                    setCards(prev => prev.map(c => (c.id === first.id || c.id === second.id ? { ...c, status: 'down' } : c)));
                    setFlippedCards([]);
                    setIsChecking(false);
                }, 1200);
            }
        }
    }, [flippedCards]);
    
    useEffect(() => {
        if (cards.length > 0 && cards.every(c => c.status === 'matched')) {
             if (isTournamentMode && onTournamentAnswer) {
                const baseScore = 120;
                const minClicks = cards.length;
                const extraClicks = Math.max(0, clicks - minClicks);
                const penalty = Math.floor(extraClicks / 2) * 8;
                const finalScore = Math.max(10, baseScore - penalty);
                onTournamentAnswer(finalScore);
             } else {
                const baseScore = 120;
                const minClicks = cards.length;
                const extraClicks = Math.max(0, clicks - minClicks);
                const penalty = Math.floor(extraClicks / 2) * 8;
                const finalScore = Math.max(10, baseScore - penalty);
                setInternalScore(finalScore);
                setTimeout(() => setGameStage('won'), 500);
             }
        }
    }, [cards, isTournamentMode, onTournamentAnswer, clicks]);

    const handleCardClick = (clickedCard: Card) => {
        if (isChecking || clickedCard.status !== 'down' || flippedCards.length >= 2) return;
        setClicks(c => c + 1);
        setCards(prev => prev.map(c => (c.id === clickedCard.id ? { ...c, status: 'up' } : c)));
        setFlippedCards(prev => [...prev, { ...clickedCard, status: 'up' }]);
    };
    
    if (gameStage === 'setup' && !isTournamentMode) {
        return (
            <GameShell title="Memory d'Unitats" score={0} onBack={onBack}>
                <div className="flex flex-col items-center text-center">
                    <h3 className="text-2xl font-bold mb-6">Tria la mida del tauler</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-lg">
                        {SIZES.map(size => (
                            <button key={size.name} onClick={() => setupGame(size)} className="p-6 bg-slate-50 border border-slate-200 rounded-lg hover:bg-indigo-100 hover:border-indigo-400 transition-all">
                                <span className="text-2xl font-bold">{size.name}</span>
                                <p className="text-slate-500">{size.pairs * 2} targetes</p>
                            </button>
                        ))}
                    </div>
                </div>
            </GameShell>
        );
    }
    
    if (cards.length === 0) return <div>Carregant...</div>;

    return (
        <GameShell title="Memory d'Unitats" score={score} onBack={onBack}>
             <div className="relative" style={{ perspective: '1000px' }}>
                {gameStage === 'won' && !isTournamentMode && (
                    <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center text-center animate-fade-in z-20 rounded-lg">
                        <h3 className="text-4xl font-bold text-emerald-400 mb-2">Has Guanyat!</h3>
                        <p className="text-xl mb-6 text-white">Puntuació final: {internalScore}</p>
                        <p className="text-lg mb-6 text-slate-300">(Intents: {Math.floor(clicks / 2)})</p>
                        <button onClick={() => setGameStage('setup')} className="flex items-center gap-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-lg">
                          <ReplayIcon /> <span>Jugar de nou</span>
                        </button>
                    </div>
                )}
                <div className={`grid ${gridClasses[currentSize?.cols ?? 4]} gap-4`}>
                    {cards.map(card => (
                        <div key={card.id} className="w-full h-24 md:h-32" onClick={() => handleCardClick(card)}>
                            <div className={`relative w-full h-full transition-transform duration-500`} style={{ transformStyle: 'preserve-3d', transform: card.status !== 'down' ? 'rotateY(180deg)' : '' }}>
                                <div className="absolute w-full h-full backface-hidden bg-indigo-500 rounded-lg flex items-center justify-center cursor-pointer hover:bg-indigo-400"></div>
                                <div className={`absolute w-full h-full backface-hidden rounded-lg flex items-center justify-center text-base md:text-xl font-bold p-2 text-center text-white ${card.status === 'matched' ? 'bg-emerald-500' : 'bg-slate-700'}`} style={{ transform: 'rotateY(180deg)' }}>
                                    {card.text}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <style>{`.backface-hidden { backface-visibility: hidden; }`}</style>
        </GameShell>
    );
};

export default UnitMatchGame;
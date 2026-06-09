import React, { useState, useEffect } from 'react';
import GameShell from './GameShell';
import { generateSortingQuestion } from '../services/gameLogic';
import { SortingItem } from '../types';
import { CorrectIcon, IncorrectIcon } from './icons';
import { useTournament } from './TournamentContext';
import ScoreFeedback from './ScoreFeedback';

interface SortingGameProps {
  onBack: () => void;
}

const POINTS_ALL_CORRECT = 25;
const POINTS_INCORRECT_PENALTY = -10;
const POINTS_PER_CORRECT_ITEM = 4;

const SortingGame: React.FC<SortingGameProps> = ({ onBack }) => {
    const tournament = useTournament();
    const isTournamentMode = !!tournament;

    const [internalScore, setInternalScore] = useState(0);
    const score = isTournamentMode ? tournament.players[tournament.currentPlayerIndex].score : internalScore;
    
    const [items, setItems] = useState<SortingItem[]>([]);
    const [results, setResults] = useState<boolean[]>([]);
    const [draggedItemIndex, setDraggedItemIndex] = useState<number | null>(null);

    useEffect(() => {
        if (isTournamentMode && tournament.challenge) {
            setItems(tournament.challenge);
            setResults([]);
        } else if (!isTournamentMode) {
            getNextQuestion();
        }
    }, [isTournamentMode, tournament?.challenge]);

    const getNextQuestion = () => {
        setItems(generateSortingQuestion(5));
        setResults([]);
    };

    const handleDragStart = (index: number) => setDraggedItemIndex(index);
    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => e.preventDefault();

    const handleDrop = (dropIndex: number) => {
        if (draggedItemIndex === null || results.length > 0) return;
        const draggedItem = items[draggedItemIndex];
        const newItems = [...items];
        newItems.splice(draggedItemIndex, 1);
        newItems.splice(dropIndex, 0, draggedItem);
        setItems(newItems);
        setDraggedItemIndex(null);
    };

    const checkOrder = () => {
        const sortedCorrectly = [...items].sort((a, b) => a.baseValue - b.baseValue);
        let correctPositions = 0;
        const newResults = items.map((item, index) => {
            const isPosCorrect = item.id === sortedCorrectly[index].id;
            if (isPosCorrect) correctPositions++;
            return isPosCorrect;
        });
        setResults(newResults);
        
        let scoreDelta = 0;
        const isAllCorrect = correctPositions === items.length;
        if (isAllCorrect) {
            scoreDelta = POINTS_ALL_CORRECT;
        } else if (correctPositions === 0) {
            scoreDelta = POINTS_INCORRECT_PENALTY;
        } else {
            scoreDelta = correctPositions * POINTS_PER_CORRECT_ITEM;
        }

        if (isTournamentMode) {
            tournament.submitAnswer({ scoreDelta, isCorrect: isAllCorrect, userAnswer: items.map(i => i.text) });
        } else {
            setInternalScore(s => Math.max(0, s + scoreDelta));
        }
    };

    return (
        <GameShell title="Ordena les Mides" score={score} onBack={onBack}>
            <div className="text-center">
                <p className="text-lg text-slate-600 mb-4">Ordena els valors de <span className="font-bold text-indigo-600">més petit</span> a <span className="font-bold text-indigo-600">més gran</span>.</p>
                <div className="text-left text-sm font-semibold text-slate-500 px-2">↑ Més petit</div>
                <div className="space-y-3 my-2">
                    {items.map((item, index) => (
                        <div
                            key={item.id}
                            draggable={results.length === 0}
                            onDragStart={() => handleDragStart(index)}
                            onDragOver={handleDragOver}
                            onDrop={() => handleDrop(index)}
                            className={`p-4 rounded-lg text-2xl font-semibold transition-all duration-300 flex items-center justify-between gap-4 border
                                ${results.length === 0 ? 'bg-white cursor-grab active:cursor-grabbing shadow-sm border-slate-200' : ''}
                                ${results.length > 0 && results[index] ? 'bg-emerald-100 text-emerald-800 border-emerald-400' : ''}
                                ${results.length > 0 && !results[index] ? 'bg-rose-100 text-rose-800 border-rose-400' : ''}
                                ${draggedItemIndex === index ? 'opacity-50' : ''}
                            `}
                        >
                           <span>{item.text}</span>
                           {results.length > 0 && (
                                results[index] 
                                    ? <CorrectIcon className="w-8 h-8 text-emerald-500" /> 
                                    : <IncorrectIcon className="w-8 h-8 text-rose-500" />
                            )}
                        </div>
                    ))}
                </div>
                <div className="text-right text-sm font-semibold text-slate-500 px-2">↓ Més gran</div>


                {results.length === 0 ? (
                    <button
                        onClick={checkOrder}
                        className="mt-6 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-8 rounded-lg"
                    >
                        Comprova l'Ordre
                    </button>
                ) : (
                    <div className="mt-8 flex flex-col items-center animate-fade-in" role="status" aria-live="polite">
                         {results.every(r => r) ? (
                            <div className="flex items-center gap-2 text-emerald-500 text-xl"><CorrectIcon /><span>Ordre Perfecte!</span></div>
                        ) : (
                            <div className="flex items-center gap-2 text-rose-500 text-xl"><IncorrectIcon /><span>Algunes posicions són incorrectes!</span></div>
                        )}
                        {isTournamentMode && tournament.scoreFeedback && <ScoreFeedback {...tournament.scoreFeedback} />}
                        {!isTournamentMode && <button onClick={getNextQuestion} className="mt-6 bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-8 rounded-lg">
                            Següent Repte
                        </button>}
                    </div>
                )}
            </div>
        </GameShell>
    );
};

export default SortingGame;
import React, { useState, useEffect, useCallback } from 'react';
import GameShell from './GameShell';
import { generateLinkedPuzzleQuestion } from '../services/gameLogic';
import { LinkedPuzzleQuestion } from '../types';
import { CorrectIcon, ReplayIcon, HeartIcon, IncorrectIcon } from './icons';
import { useTournament } from './TournamentContext';
import ScoreFeedback from './ScoreFeedback';

interface PuzzleGameProps {
  onBack: () => void;
}

const POINTS_PER_STEP = 20;
const MISTAKE_PENALTY = 10;
const COMPLETION_BONUS = 25;
const INITIAL_LIVES = 3;

const PuzzleGame: React.FC<PuzzleGameProps> = ({ onBack }) => {
  const tournament = useTournament();
  const isTournamentMode = !!tournament;

  const [internalScore, setInternalScore] = useState(0);
  const score = isTournamentMode ? tournament.players[tournament.currentPlayerIndex].score : internalScore;
  
  const [steps, setSteps] = useState<LinkedPuzzleQuestion>([]);
  const [answers, setAnswers] = useState<string[]>([]);
  const [results, setResults] = useState<(boolean | null)[]>([]);
  const [lives, setLives] = useState(INITIAL_LIVES);
  const [isGameOver, setIsGameOver] = useState(false);
  const [completionSent, setCompletionSent] = useState(false);
  const isSolved = results.every(r => r === true);

  const setupGame = useCallback((s: LinkedPuzzleQuestion) => {
    setSteps(s);
    setAnswers(new Array(s.length).fill(''));
    setResults(new Array(s.length).fill(null));
    setIsGameOver(false);
    setLives(INITIAL_LIVES);
    setCompletionSent(false);
    if (!isTournamentMode) setInternalScore(0);
  }, [isTournamentMode]);

  useEffect(() => {
    if (isTournamentMode && tournament.challenge) {
        setupGame(tournament.challenge);
        setTimeout(() => document.getElementById('puzzle-input-0')?.focus(), 50);
    } else if (!isTournamentMode) {
        setupGame(generateLinkedPuzzleQuestion(3));
    }
  }, [isTournamentMode, tournament?.challenge, setupGame]);

  const handleAnswerChange = (index: number, value: string) => {
    const newAnswers = [...answers];
    newAnswers[index] = value;
    setAnswers(newAnswers);
    if (results[index] === false) {
      const newResults = [...results];
      newResults[index] = null;
      setResults(newResults);
    }
  };
  
  const handleVerify = (index: number) => {
    if (results[index] === true || isGameOver || isSolved) return;
    const userAnswer = answers[index];
    if (!userAnswer) return;

    const userAnswerNum = parseFloat(userAnswer.replace(/\./g, '').replace(',', '.'));
    const newResults = [...results];

    if (!isNaN(userAnswerNum) && userAnswerNum === steps[index].correctAnswer) {
      newResults[index] = true;
      if (!isTournamentMode) setInternalScore(s => s + 15);
      if (index < steps.length - 1) {
        setTimeout(() => document.getElementById(`puzzle-input-${index + 1}`)?.focus(), 100);
      }
    } else {
      newResults[index] = false;
      setLives(l => l - 1);
    }
    setResults(newResults);
  };

  const submitTournamentScore = useCallback(() => {
    if (!isTournamentMode || completionSent) return;
    setCompletionSent(true);

    const correctSteps = results.filter(r => r === true).length;
    const mistakes = INITIAL_LIVES - lives;
    let finalScore = correctSteps * POINTS_PER_STEP - mistakes * MISTAKE_PENALTY;
    
    const isPuzzleSolved = correctSteps === steps.length;
    if (isPuzzleSolved) {
        finalScore += COMPLETION_BONUS;
    }
    
    tournament.submitAnswer({ scoreDelta: finalScore, isCorrect: isPuzzleSolved, userAnswer: answers });
  }, [isTournamentMode, completionSent, results, lives, steps, tournament, answers]);


  useEffect(() => {
    if (lives <= 0 && !isGameOver) {
        setIsGameOver(true);
        submitTournamentScore();
    }
  }, [lives, isGameOver, submitTournamentScore]);

  useEffect(() => {
    if (steps.length > 0 && isSolved) {
        submitTournamentScore();
    }
  }, [isSolved, steps, submitTournamentScore]);

  const getInputClass = (index: number) => {
    if (results[index] === true) return 'border-emerald-500 text-emerald-600';
    if (results[index] === false) return 'border-rose-500 text-rose-600 animate-shake';
    return 'border-slate-300 focus:border-indigo-500 focus:ring-indigo-500';
  }

  if (steps.length === 0) return <div>Carregant...</div>;

  return (
    <GameShell title="Trencaclosques Enllaçat" score={score} onBack={onBack}>
      <style>{`.animate-shake { animation: shake 0.5s ease-in-out; } @keyframes shake { 10%, 90% { transform: translateX(-1px); } 20%, 80% { transform: translateX(2px); } 30%, 50%, 70% { transform: translateX(-4px); } 40%, 60% { transform: translateX(4px); } }`}</style>
      <div className="text-center">
        <div className="flex justify-between items-center mb-4">
            <p className="text-lg text-slate-600">Resol la cadena de conversions!</p>
            {isTournamentMode && <div className="flex items-center gap-1">
                {Array.from({ length: INITIAL_LIVES }).map((_, i) => (
                    <HeartIcon key={i} className={`w-8 h-8 transition-all duration-300 ${i < lives ? 'text-rose-500' : 'text-slate-300'}`} />
                ))}
            </div>}
        </div>
        
        <div className="space-y-2 max-w-2xl mx-auto">
            {steps.map((step, index) => {
                const fromValue = step.fromValue === 'previous' ? (results[index-1] ? steps[index-1]?.correctAnswer : '???' ) : step.fromValue;
                const isLocked = index > 0 && results[index - 1] !== true;
                const isCorrect = results[index] === true;

                return (
                    <div key={step.id} className={`flex items-center justify-between gap-2 p-3 rounded-lg transition-all ${isLocked ? 'bg-slate-100 opacity-60' : 'bg-white'}`}>
                        <div className="flex-1 text-left text-slate-600 flex items-center gap-2">
                           <span className={`font-bold text-xl ${isCorrect ? 'text-emerald-500' : 'text-indigo-500'}`}>{index + 1}.</span>
                           <div className="flex-grow flex items-center justify-end font-mono p-2 bg-slate-100 rounded-md border border-slate-200">
                               <span>{typeof fromValue === 'number' ? fromValue.toLocaleString('ca-ES') : fromValue}</span>
                               <span className="ml-2 text-slate-500">{step.fromUnit.symbol}</span>
                           </div>
                           <span className="text-indigo-500 text-xl mx-2">→</span>
                        </div>
                        
                        <div className="flex items-center gap-2">
                            <input id={`puzzle-input-${index}`} type="text" value={answers[index]} onChange={(e) => handleAnswerChange(index, e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter' && !isCorrect) handleVerify(index); }} disabled={isLocked || isCorrect || isGameOver} className={`w-32 md:w-40 text-center text-xl font-bold p-2 rounded-lg bg-white border-2 transition-all focus:outline-none focus:ring-2 ${getInputClass(index)}`}/>
                            <span className="w-12 text-left text-xl font-semibold text-slate-500">{step.toUnit.symbol}</span>
                           
                            {!isCorrect ? <button onClick={() => handleVerify(index)} disabled={isLocked || !answers[index] || isGameOver} className="p-2 bg-indigo-500 hover:bg-indigo-600 rounded-lg disabled:bg-slate-300 text-white"><CorrectIcon className="w-6 h-6"/></button>
                            : <div className="w-10 h-10 flex items-center justify-center"><CorrectIcon className="w-8 h-8 text-emerald-500"/></div>}
                        </div>
                    </div>
                )
            })}
        </div>

        <div className="h-24 mt-4" role="status" aria-live="polite">
            {(isSolved || isGameOver) && isTournamentMode && tournament.scoreFeedback && <ScoreFeedback {...tournament.scoreFeedback} />}

            {isSolved && !isGameOver && (
                <div className="mt-8 flex flex-col items-center animate-fade-in">
                    <div className="flex items-center gap-2 text-emerald-500 text-2xl font-bold"><CorrectIcon /><span>Trencaclosques resolt!</span></div>
                    {!isTournamentMode && <button onClick={() => setupGame(generateLinkedPuzzleQuestion(3))} className="mt-6 bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-8 rounded-lg flex items-center gap-2">
                       <ReplayIcon/> Nou Trencaclosques
                    </button>}
                </div>
            )}
            {isGameOver && (
                 <div className="mt-8 flex flex-col items-center animate-fade-in">
                    <div className="flex items-center gap-2 text-rose-500 text-2xl font-bold"><IncorrectIcon /><span>T'has quedat sense vides!</span></div>
                    {!isTournamentMode && <button onClick={() => setupGame(generateLinkedPuzzleQuestion(3))} className="mt-6 bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-8 rounded-lg flex items-center gap-2">
                       <ReplayIcon/> Torna-ho a intentar
                    </button>}
                </div>
            )}
        </div>
      </div>
    </GameShell>
  );
};

export default PuzzleGame;
import React, { useState, useEffect, useRef } from 'react';
import GameShell from './GameShell';
import { generateFillBlankQuestion } from '../services/gameLogic';
import { BaseQuestion, AnswerStatus } from '../types';
import { CorrectIcon, IncorrectIcon } from './icons';
import { useTournament } from './TournamentContext';
import ScoreFeedback from './ScoreFeedback';

interface FillBlankGameProps {
  onBack: () => void;
}

const POINTS_PER_QUESTION = 15;
const PENALTY_POINTS = 5;

const FillBlankGame: React.FC<FillBlankGameProps> = ({ onBack }) => {
  const tournament = useTournament();
  const isTournamentMode = !!tournament;

  const [internalScore, setInternalScore] = useState(0);
  const score = isTournamentMode ? tournament.players[tournament.currentPlayerIndex].score : internalScore;

  const [question, setQuestion] = useState<BaseQuestion | null>(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [answerStatus, setAnswerStatus] = useState<AnswerStatus>('unanswered');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isTournamentMode) {
      getNextQuestion();
    }
  }, [isTournamentMode]);
  
  useEffect(() => {
    if (isTournamentMode && tournament.challenge) {
      setQuestion(tournament.challenge);
      setUserAnswer('');
      setAnswerStatus('unanswered');
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isTournamentMode, tournament?.challenge]);

  const getNextQuestion = () => {
    setQuestion(generateFillBlankQuestion());
    setUserAnswer('');
    setAnswerStatus('unanswered');
    setTimeout(() => inputRef.current?.focus(), 50);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (answerStatus !== 'unanswered' || !userAnswer) return;

    const userAnswerNum = parseFloat(userAnswer.replace(/\./g, '').replace(',', '.'));
    if (isNaN(userAnswerNum)) return;

    const isCorrect = userAnswerNum === question?.correctAnswer;
    setAnswerStatus(isCorrect ? 'correct' : 'incorrect');
    
    if (isTournamentMode) {
      const scoreDelta = isCorrect ? POINTS_PER_QUESTION : -PENALTY_POINTS;
      tournament.submitAnswer({ scoreDelta, userAnswer: userAnswerNum, isCorrect });
    } else {
      if (isCorrect) {
        setInternalScore(prev => prev + POINTS_PER_QUESTION);
      } else {
        setInternalScore(prev => Math.max(0, prev - PENALTY_POINTS));
      }
    }
  };

  if (!question) {
    return <div>Carregant preguntes...</div>;
  }
  
  const isCorrect = answerStatus === 'correct';
  const isIncorrect = answerStatus === 'incorrect';

  return (
    <GameShell title="Omple el Buit" score={score} onBack={onBack} roundInfo={tournament?.roundInfo}>
      <div className="text-center">
        <p className="text-lg text-slate-600 mb-2">Converteix:</p>
        <p className="text-4xl font-bold mb-8">
          {question.fromValue.toLocaleString('ca-ES')} {question.fromUnit.symbol}
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col items-center">
          <div className="flex items-center justify-center gap-4">
            <span className="text-4xl font-bold text-indigo-500">=</span>
            <input
              ref={inputRef}
              type="text"
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              disabled={answerStatus !== 'unanswered'}
              className={`w-48 text-center text-3xl font-bold p-3 rounded-lg bg-white border-2 transition-all duration-300 focus:outline-none focus:ring-2
              ${isCorrect ? 'border-emerald-500 text-emerald-500' : ''} 
              ${isIncorrect ? 'border-rose-500 text-rose-500' : ''}
              ${answerStatus === 'unanswered' ? 'border-slate-300 focus:border-indigo-500 focus:ring-indigo-500' : ''}`}
              placeholder="???"
              autoFocus
            />
            <span className="text-3xl font-semibold text-slate-500">{question.toUnit.symbol}</span>
          </div>
          
          {answerStatus === 'unanswered' && (
            <button
              type="submit"
              className="mt-8 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-8 rounded-lg transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            >
              Comprova
            </button>
          )}
        </form>

        {answerStatus !== 'unanswered' && (
           <div className="mt-8 flex flex-col items-center animate-fade-in" role="status" aria-live="polite">
             {isCorrect ? (
                <div className="flex items-center gap-2 text-emerald-500 text-xl"><CorrectIcon /><span>Molt bé!</span></div>
             ) : (
                <div className="flex flex-col items-center gap-2 text-rose-500 text-xl">
                  <div className="flex items-center gap-2"><IncorrectIcon/><span>Gairebé!</span></div>
                  <p className="text-slate-800 mt-2">La resposta correcta era: <span className="font-bold">{question.correctAnswer.toLocaleString('ca-ES')} {question.toUnit.symbol}</span></p>
                </div>
             )}
             {isTournamentMode && tournament.scoreFeedback && <ScoreFeedback {...tournament.scoreFeedback} />}
             {!isTournamentMode && <button
               onClick={getNextQuestion}
               className="mt-6 bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-8 rounded-lg transition-all"
             >
               Següent Pregunta
             </button>}
           </div>
         )}
      </div>
    </GameShell>
  );
};

export default FillBlankGame;
import React, { useState, useEffect } from 'react';
import GameShell from './GameShell';
import { generateQuizQuestion } from '../services/gameLogic';
import { QuizQuestion, AnswerStatus } from '../types';
import { CorrectIcon, IncorrectIcon } from './icons';
import { useTournament } from './TournamentContext';
import ScoreFeedback from './ScoreFeedback';

interface QuizGameProps {
  onBack: () => void;
}

const POINTS_PER_QUESTION = 10;
const PENALTY_POINTS = 5;

const QuizGame: React.FC<QuizGameProps> = ({ onBack }) => {
  const tournament = useTournament();
  const isTournamentMode = !!tournament;

  const [internalScore, setInternalScore] = useState(0);
  const score = isTournamentMode ? tournament.players[tournament.currentPlayerIndex].score : internalScore;
  
  const [question, setQuestion] = useState<QuizQuestion | null>(null);
  const [userAnswer, setUserAnswer] = useState<number | null>(null);
  const [answerStatus, setAnswerStatus] = useState<AnswerStatus>('unanswered');

  useEffect(() => {
    if (!isTournamentMode) {
      getNextQuestion();
    }
  }, [isTournamentMode]);
  
  useEffect(() => {
    if (isTournamentMode && tournament.challenge) {
      setQuestion(tournament.challenge);
      setUserAnswer(null);
      setAnswerStatus('unanswered');
    }
  }, [isTournamentMode, tournament?.challenge]);

  const getNextQuestion = () => {
    setQuestion(generateQuizQuestion());
    setUserAnswer(null);
    setAnswerStatus('unanswered');
  };

  const handleAnswer = (option: number) => {
    if (answerStatus !== 'unanswered') return;
    setUserAnswer(option);
    
    const isCorrect = option === question?.correctAnswer;
    setAnswerStatus(isCorrect ? 'correct' : 'incorrect');
    
    if (isTournamentMode) {
      const scoreDelta = isCorrect ? POINTS_PER_QUESTION : -PENALTY_POINTS;
      tournament.submitAnswer({ scoreDelta, userAnswer: option, isCorrect });
    } else {
      if (isCorrect) {
        setInternalScore(prev => prev + POINTS_PER_QUESTION);
      } else {
        setInternalScore(prev => Math.max(0, prev - PENALTY_POINTS));
      }
    }
  };
  
  const getButtonClass = (option: number) => {
    if (answerStatus === 'unanswered') {
      return 'bg-slate-100 hover:bg-indigo-100 border-slate-200 text-slate-700';
    }
    if (option === question?.correctAnswer) {
      return 'bg-emerald-500 text-white border-emerald-500 scale-105';
    }
    if (option === userAnswer) {
      return 'bg-rose-500 text-white border-rose-500';
    }
    return 'bg-slate-100 text-slate-700 opacity-50 border-slate-200';
  };

  if (!question) {
    return <div>Carregant preguntes...</div>;
  }

  return (
    <GameShell title="Test d'Opció Múltiple" score={score} onBack={onBack} roundInfo={tournament?.roundInfo}>
      <div className="text-center">
        <p className="text-lg text-slate-600 mb-2">Converteix:</p>
        <p className="text-4xl font-bold mb-8">
          {question.fromValue.toLocaleString('ca-ES')} {question.fromUnit.symbol} <span className="text-indigo-500">a</span> {question.toUnit.symbol}
        </p>

        <div className="grid grid-cols-2 gap-4">
          {question.options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleAnswer(option)}
              disabled={answerStatus !== 'unanswered'}
              className={`p-6 rounded-lg text-2xl font-semibold transition-all duration-300 transform border ${getButtonClass(option)}`}
            >
              {option.toLocaleString('ca-ES')}
            </button>
          ))}
        </div>

        {answerStatus !== 'unanswered' && (
          <div className="mt-8 flex flex-col items-center animate-fade-in" role="status" aria-live="polite">
            {answerStatus === 'correct' ? (
               <div className="flex items-center gap-2 text-emerald-500 text-xl"><CorrectIcon /><span>Correcte!</span></div>
            ) : (
               <div className="flex flex-col items-center gap-2 text-rose-500 text-xl">
                 <div className="flex items-center gap-2"><IncorrectIcon/><span>Incorrecte!</span></div>
                 <p className="text-slate-800 mt-2">La resposta correcta era: <span className="font-bold">{question.correctAnswer.toLocaleString('ca-ES')}</span></p>
               </div>
            )}
            {isTournamentMode && tournament.scoreFeedback && <ScoreFeedback {...tournament.scoreFeedback} />}
             {!isTournamentMode && <button
              onClick={getNextQuestion}
              className="mt-6 bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-8 rounded-lg transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-orange-400"
            >
              Següent Pregunta
            </button>}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default QuizGame;
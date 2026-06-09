import React, { useState, useEffect } from 'react';
import GameShell from './GameShell';
import { generateComparisonQuestion } from '../services/gameLogic';
import { ComparisonQuestion, AnswerStatus } from '../types';
import { CorrectIcon, IncorrectIcon } from './icons';
import { useTournament } from './TournamentContext';
import ScoreFeedback from './ScoreFeedback';

interface ComparisonGameProps {
  onBack: () => void;
}

type ComparisonOption = '>' | '<' | '=';

const POINTS_PER_QUESTION = 10;
const PENALTY_POINTS = 5;

const ComparisonGame: React.FC<ComparisonGameProps> = ({ onBack }) => {
  const tournament = useTournament();
  const isTournamentMode = !!tournament;

  const [internalScore, setInternalScore] = useState(0);
  const score = isTournamentMode ? tournament.players[tournament.currentPlayerIndex].score : internalScore;
  
  const [question, setQuestion] = useState<ComparisonQuestion | null>(null);
  const [userAnswer, setUserAnswer] = useState<ComparisonOption | null>(null);
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
    setQuestion(generateComparisonQuestion());
    setUserAnswer(null);
    setAnswerStatus('unanswered');
  };

  const handleAnswer = (option: ComparisonOption) => {
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

  const getButtonClass = (option: ComparisonOption) => {
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
    <GameShell title="Compara Valors" score={score} onBack={onBack} roundInfo={tournament?.roundInfo}>
      <div className="text-center">
        <p className="text-lg text-slate-600 mb-6">Quin valor és més gran?</p>
        <div className="flex items-center justify-around mb-8">
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg w-48 text-center">
            <p className="text-4xl font-bold">{question.valueA.toLocaleString('ca-ES')}</p>
            <p className="text-xl text-slate-500">{question.unitA.symbol}</p>
          </div>
          <div className="text-2xl font-bold text-indigo-500">vs</div>
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg w-48 text-center">
            <p className="text-4xl font-bold">{question.valueB.toLocaleString('ca-ES')}</p>
            <p className="text-xl text-slate-500">{question.unitB.symbol}</p>
          </div>
        </div>

        <div className="flex justify-center gap-4">
          {(['<', '=', '>'] as ComparisonOption[]).map((option) => (
            <button
              key={option}
              onClick={() => handleAnswer(option)}
              disabled={answerStatus !== 'unanswered'}
              className={`w-24 h-24 flex items-center justify-center rounded-lg text-4xl font-bold transition-all duration-300 transform border ${getButtonClass(option)}`}
            >
              {option}
            </button>
          ))}
        </div>

        {answerStatus !== 'unanswered' && (
          <div className="mt-8 flex flex-col items-center animate-fade-in" role="status" aria-live="polite">
            {answerStatus === 'correct' ? (
              <div className="flex items-center gap-2 text-emerald-500 text-xl"><CorrectIcon /><span>Correcte!</span></div>
            ) : (
              <div className="flex flex-col items-center gap-2 text-rose-500 text-xl">
                <div className="flex items-center gap-2"><IncorrectIcon /><span>Incorrecte!</span></div>
                <p className="text-slate-800 mt-2">
                  La resposta correcta era: <span className="font-bold">{question.valueA.toLocaleString('ca-ES')} {question.unitA.symbol} {question.correctAnswer} {question.valueB.toLocaleString('ca-ES')} {question.unitB.symbol}</span>
                </p>
              </div>
            )}
            {isTournamentMode && tournament.scoreFeedback && <ScoreFeedback {...tournament.scoreFeedback} />}
            {!isTournamentMode && <button
              onClick={getNextQuestion}
              className="mt-6 bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-8 rounded-lg"
            >
              Següent Pregunta
            </button>}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default ComparisonGame;
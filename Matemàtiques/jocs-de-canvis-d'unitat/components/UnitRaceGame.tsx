import React, { useState, useEffect, useCallback, useRef } from 'react';
import GameShell from './GameShell';
import { generateUnitRaceQuestion } from '../services/gameLogic';
import { UnitRaceQuestion, AnswerStatus } from '../types';
import { CorrectIcon, IncorrectIcon } from './icons';
import { useTournament } from './TournamentContext';
import ScoreFeedback from './ScoreFeedback';

interface UnitRaceGameProps {
  onBack: () => void;
}

const TIME_LIMIT = 90; // seconds
const POINTS_BASE = 30;
const PENALTY_POINTS = 10;

const UnitRaceGame: React.FC<UnitRaceGameProps> = ({ onBack }) => {
  const tournament = useTournament();
  const isTournamentMode = !!tournament;

  const [internalScore, setInternalScore] = useState(0);
  const score = isTournamentMode ? tournament.players[tournament.currentPlayerIndex].score : internalScore;

  const [question, setQuestion] = useState<UnitRaceQuestion | null>(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [answerStatus, setAnswerStatus] = useState<AnswerStatus>('unanswered');
  const [timeLeft, setTimeLeft] = useState(TIME_LIMIT);
  const timerRef = useRef<number | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const setupGame = useCallback((q: UnitRaceQuestion | null) => {
    if (timerRef.current) clearInterval(timerRef.current);
    setQuestion(q);
    setUserAnswer('');
    setAnswerStatus('unanswered');
    setTimeLeft(TIME_LIMIT);
    setTimeout(() => inputRef.current?.focus(), 50);
  }, []);
  
  useEffect(() => {
    if (isTournamentMode && tournament.challenge) {
        setupGame(tournament.challenge);
    } else if (!isTournamentMode) {
        setupGame(generateUnitRaceQuestion());
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [isTournamentMode, tournament?.challenge, setupGame]);


  useEffect(() => {
    if (answerStatus === 'unanswered' && timeLeft > 0) {
      timerRef.current = window.setInterval(() => setTimeLeft(t => t - 1), 1000);
    } else if (timeLeft <= 0 && answerStatus === 'unanswered') {
      if (timerRef.current) clearInterval(timerRef.current);
      setAnswerStatus('incorrect');
      if (isTournamentMode) {
        tournament.submitAnswer({ scoreDelta: -PENALTY_POINTS, userAnswer: 'Temps esgotat', isCorrect: false });
      } else {
        setInternalScore(s => Math.max(0, s - PENALTY_POINTS));
      }
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [answerStatus, timeLeft, isTournamentMode, tournament]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (answerStatus !== 'unanswered' || !userAnswer) return;
    if (timerRef.current) clearInterval(timerRef.current);

    const userAnswerNum = parseFloat(userAnswer.replace(/\./g, '').replace(',', '.'));
    if (isNaN(userAnswerNum)) { 
        setAnswerStatus('incorrect');
        if(isTournamentMode) tournament.submitAnswer({ scoreDelta: -PENALTY_POINTS, userAnswer: userAnswer, isCorrect: false });
        else setInternalScore(s => Math.max(0, s - PENALTY_POINTS));
        return;
    }
    
    const isCorrect = userAnswerNum === question?.correctAnswer;
    setAnswerStatus(isCorrect ? 'correct' : 'incorrect');

    if (isTournamentMode) {
      const scoreDelta = isCorrect ? POINTS_BASE + timeLeft : -PENALTY_POINTS;
      tournament.submitAnswer({ scoreDelta, userAnswer: userAnswerNum, isCorrect });
    } else {
      if (isCorrect) {
        setInternalScore(s => s + POINTS_BASE + timeLeft);
      } else {
        setInternalScore(s => Math.max(0, s - PENALTY_POINTS));
      }
    }
  };

  if (!question) return <div>Carregant...</div>;
  
  const isCorrect = answerStatus === 'correct';
  const isIncorrect = answerStatus === 'incorrect';
  const timeColor = timeLeft > 30 ? 'text-emerald-500' : timeLeft > 10 ? 'text-amber-500' : 'text-rose-500';

  return (
    <GameShell title="Cursa d'Unitats" score={score} onBack={onBack} roundInfo={tournament?.roundInfo}>
      <div className="text-center">
        <div className={`text-5xl font-bold mb-6 transition-colors duration-500 ${timeColor}`}>{timeLeft}s</div>
        <p className="text-lg text-slate-600 mb-2">Suma i converteix el total a {question.targetUnit.name}:</p>
        <p className="text-2xl md:text-3xl font-bold mb-8 bg-slate-100 p-4 rounded-lg border border-slate-200">
          {question.items.map(item => `${item.value.toLocaleString('ca-ES')} ${item.unit.symbol}`).join(' + ')}
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
              className={`w-48 text-center text-3xl font-bold p-3 rounded-lg bg-white border-2 transition-all ${isCorrect ? 'border-emerald-500' : ''} ${isIncorrect ? 'border-rose-500' : ''} ${answerStatus === 'unanswered' ? 'border-slate-300 focus:border-indigo-500' : ''}`}
              placeholder="???"
              autoFocus
            />
            <span className="text-3xl font-semibold text-slate-500">{question.targetUnit.symbol}</span>
          </div>
          
          {answerStatus === 'unanswered' && (
            <button type="submit" className="mt-8 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-8 rounded-lg">
                Comprova
            </button>
          )}
        </form>

        {answerStatus !== 'unanswered' && (
           <div className="mt-8 flex flex-col items-center animate-fade-in" role="status" aria-live="polite">
             {isCorrect ? <div className="flex items-center gap-2 text-emerald-500 text-xl"><CorrectIcon /><span>Molt Ràpid!</span></div>
             : <div className="flex flex-col items-center gap-2 text-rose-500 text-xl"><div className="flex items-center gap-2"><IncorrectIcon/><span>{timeLeft <= 0 ? "S'ha acabat el temps!" : "Incorrecte!"}</span></div><p className="text-slate-800 mt-2">La resposta era: <span className="font-bold">{question.correctAnswer.toLocaleString('ca-ES')}</span></p></div>}
              {isTournamentMode && tournament.scoreFeedback && <ScoreFeedback {...tournament.scoreFeedback} />}
              {!isTournamentMode && <button onClick={() => setupGame(generateUnitRaceQuestion())} className="mt-6 bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-8 rounded-lg">Següent Cursa</button>}
           </div>
         )}
      </div>
    </GameShell>
  );
};

export default UnitRaceGame;
import React, { useState, useEffect, useCallback } from 'react';
import GameShell from './GameShell';
import { generateLabAlchemyQuestion } from '../services/gameLogic';
import { LabAlchemyQuestion, AnswerStatus } from '../types';
import { CorrectIcon, IncorrectIcon, ReplayIcon, FlaskIcon } from './icons';
import { useTournament } from './TournamentContext';
import ScoreFeedback from './ScoreFeedback';

interface LabGameProps {
  onBack: () => void;
}

const POINTS_PER_STEP = 20;
const COMPLETION_BONUS = 25;
const PENALTY_FAILURE = -25;


const LabGame: React.FC<LabGameProps> = ({ onBack }) => {
  const tournament = useTournament();
  const isTournamentMode = !!tournament;

  const [internalScore, setInternalScore] = useState(0);
  const score = isTournamentMode ? tournament.players[tournament.currentPlayerIndex].score : internalScore;

  const [steps, setSteps] = useState<LabAlchemyQuestion>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [answerStatus, setAnswerStatus] = useState<AnswerStatus>('unanswered');
  const [potionLayers, setPotionLayers] = useState<string[]>([]);
  const [isFinished, setIsFinished] = useState(false);

  const startGame = useCallback((s: LabAlchemyQuestion) => {
    setSteps(s);
    setCurrentStepIndex(0);
    setAnswerStatus('unanswered');
    setPotionLayers([]);
    setIsFinished(false);
    if (!isTournamentMode) setInternalScore(0);
  }, [isTournamentMode]);

  useEffect(() => { 
    if (isTournamentMode && tournament.challenge) {
        startGame(tournament.challenge);
    } else if (!isTournamentMode) {
        startGame(generateLabAlchemyQuestion());
    }
   }, [isTournamentMode, tournament?.challenge, startGame]);
  
  const goToNextStep = () => {
    if (currentStepIndex < steps.length - 1) {
        setCurrentStepIndex(prev => prev + 1);
        setAnswerStatus('unanswered');
    }
  };

  const handleAnswer = (option: { text: string; isCorrect: boolean }) => {
    if (answerStatus !== 'unanswered') return;
    
    setAnswerStatus(option.isCorrect ? 'correct' : 'incorrect');

    if (option.isCorrect) {
      if (!isTournamentMode) setInternalScore(s => s + POINTS_PER_STEP);
      const colors = ['bg-emerald-500/50', 'bg-sky-500/50', 'bg-amber-500/50', 'bg-rose-500/50'];
      setPotionLayers(prev => [...prev, colors[currentStepIndex % colors.length]]);

      if (currentStepIndex >= steps.length - 1) {
          setTimeout(() => {
              setIsFinished(true);
              if (isTournamentMode) {
                  const finalScore = steps.length * POINTS_PER_STEP + COMPLETION_BONUS;
                  tournament.submitAnswer({ scoreDelta: finalScore, userAnswer: option.text, isCorrect: true });
              }
          }, 1000);
      } else {
          if (isTournamentMode) {
              setTimeout(() => {
                  setCurrentStepIndex(prev => prev + 1);
                  setAnswerStatus('unanswered');
              }, 1000);
          }
      }
    } else {
      setPotionLayers(prev => [...prev, 'bg-slate-400/50 animate-shake']);
      if (isTournamentMode) {
          const finalScore = currentStepIndex * POINTS_PER_STEP + PENALTY_FAILURE;
          tournament.submitAnswer({ scoreDelta: finalScore, userAnswer: option.text, isCorrect: false });
      }
    }
  };

  const currentQ = steps[currentStepIndex];
  if (!currentQ) return <div>Carregant laboratori...</div>;

  return (
    <GameShell title="El Laboratori d'Alquímia" score={score} onBack={onBack}>
      <div className="text-center">
        <style>{`.animate-shake { animation: shake 0.5s ease-in-out; } @keyframes shake { 10%, 90% { transform: translateX(-1px); } 20%, 80% { transform: translateX(2px); } 30%, 50%, 70% { transform: translateX(-4px); } 40%, 60% { transform: translateX(4px); } }`}</style>
        <div className="flex flex-col md:flex-row items-center justify-center gap-8">
            <div className="w-40 h-60 flex flex-col items-center">
                <div className="w-14 h-2 bg-slate-200 border-2 border-b-0 border-slate-300 rounded-t-sm"></div>
                <div className="w-12 h-10 bg-slate-100 border-x-2 border-slate-300 flex items-end">
                    <div className="w-full h-1/2 bg-slate-200/50"></div>
                </div>
                <div className="w-40 h-48 bg-slate-100/50 border-2 border-t-0 border-slate-300 relative overflow-hidden flex flex-col-reverse" style={{ borderBottomLeftRadius: '50%', borderBottomRightRadius: '50%', clipPath: 'polygon(0 0, 100% 0, 85% 100%, 15% 100%)' }}>
                    {potionLayers.map((layer, index) => (
                        <div key={index} className={`w-full h-1/4 transition-all duration-500 ${layer}`}></div>
                    ))}
                </div>
            </div>

            <div className="flex-1">
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg min-h-[8rem] flex flex-col justify-center mb-6">
                    <p className="text-md text-slate-500 mb-2">{currentQ.instruction}</p>
                    <p className="text-2xl font-bold">
                        {currentQ.targetValue.toLocaleString('ca-ES')} {currentQ.targetUnit.symbol}
                    </p>
                </div>

                {!isFinished && answerStatus === 'unanswered' && (
                    <div className="grid grid-cols-1 gap-3 animate-fade-in">
                        {currentQ.options.map((opt, index) => (
                            <button key={index} onClick={() => handleAnswer(opt)} className="p-4 rounded-lg text-xl font-semibold transition-all bg-white border border-slate-200 hover:bg-indigo-100 hover:border-indigo-400">
                                {opt.text}
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </div>
        
        <div className="min-h-[6rem] mt-4" role="status" aria-live="polite">
            {!isFinished && answerStatus !== 'unanswered' && (
               <div className="mt-8 flex flex-col items-center animate-fade-in">
                 {answerStatus === 'correct' ? (
                    <div className="flex items-center gap-2 text-emerald-500 text-xl"><CorrectIcon /><span>Ingredient Correcte!</span></div>
                 ) : (
                    <div className="flex flex-col items-center gap-2 text-rose-500 text-xl"><div className="flex items-center gap-2"><IncorrectIcon/><span>Oh no! La poció ha explotat!</span></div></div>
                 )}
                  {isTournamentMode && tournament.scoreFeedback && <ScoreFeedback {...tournament.scoreFeedback} />}

                  {!isTournamentMode && (
                    <>
                      {answerStatus === 'correct' && currentStepIndex < steps.length - 1 && (
                        <button onClick={goToNextStep} className="mt-6 bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-8 rounded-lg">
                          Següent ingredient
                        </button>
                      )}
                      {answerStatus === 'incorrect' && (
                        <button onClick={() => startGame(generateLabAlchemyQuestion())} className="mt-6 bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-8 rounded-lg">
                          Tornar a començar
                        </button>
                      )}
                    </>
                  )}
               </div>
             )}

             {isFinished && (
                 <div className="mt-8 flex flex-col items-center animate-fade-in" role="status" aria-live="polite">
                    <div className="relative">
                        <FlaskIcon className="w-16 h-16 text-emerald-500"/>
                        <div className="absolute -top-2 -right-2 text-3xl animate-ping">✨</div>
                    </div>
                    <h3 className="text-3xl font-bold text-emerald-500 mt-4">Poció Completada!</h3>
                     {isTournamentMode && tournament.scoreFeedback && <ScoreFeedback {...tournament.scoreFeedback} />}
                    <p className="text-xl text-slate-600">Has demostrat ser un gran alquimista!</p>
                    {!isTournamentMode && <button onClick={() => startGame(generateLabAlchemyQuestion())} className="mt-6 bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-8 rounded-lg flex items-center gap-2">
                        <ReplayIcon/> Crear una altra poció
                    </button>}
                 </div>
             )}
        </div>
      </div>
    </GameShell>
  );
};

export default LabGame;
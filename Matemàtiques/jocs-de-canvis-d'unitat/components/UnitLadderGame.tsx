import React, { useState, useEffect, useCallback } from 'react';
import GameShell from './GameShell';
import { generateBaseQuestion } from '../services/gameLogic';
import { BaseQuestion, AnswerStatus, Unit } from '../types';
import { UNITS } from '../constants';
import { CorrectIcon, IncorrectIcon } from './icons';

interface UnitLadderGameProps {
  onBack: () => void;
}

const UnitLadderGame: React.FC<UnitLadderGameProps> = ({ onBack }) => {
  const [score, setScore] = useState(0);
  const [question, setQuestion] = useState<BaseQuestion | null>(null);
  const [currentValue, setCurrentValue] = useState(0);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [answerStatus, setAnswerStatus] = useState<AnswerStatus>('unanswered');
  const [categoryUnits, setCategoryUnits] = useState<Unit[]>([]);

  const setupQuestion = useCallback((q: BaseQuestion) => {
    setQuestion(q);
    setAnswerStatus('unanswered');
    const category = UNITS['Massa'].some(u => u.symbol === q.fromUnit.symbol) ? 'Massa' : 'Longitud';
    const currentCategoryUnits = UNITS[category];
    setCategoryUnits(currentCategoryUnits);
    const fromIndex = currentCategoryUnits.findIndex(u => u.symbol === q.fromUnit.symbol);
    setCurrentStepIndex(fromIndex);
    setCurrentValue(q.fromValue);
  }, []);

  useEffect(() => {
    setupQuestion(generateBaseQuestion());
  }, [setupQuestion]);

  const getNextQuestion = () => {
    setupQuestion(generateBaseQuestion());
  };

  const handleMove = (direction: 'up' | 'down') => {
    if (answerStatus !== 'unanswered') return;
    if (direction === 'up' && currentStepIndex > 0) {
      setCurrentStepIndex(prev => prev - 1);
      setCurrentValue(prev => prev / 10);
    } else if (direction === 'down' && currentStepIndex < categoryUnits.length - 1) {
      setCurrentStepIndex(prev => prev + 1);
      setCurrentValue(prev => prev * 10);
    }
  };
  
  const handleCheckAnswer = () => {
    if (!question) return;
    
    const toUnitIndex = categoryUnits.findIndex(u => u.symbol === question.toUnit.symbol);
    if (currentStepIndex === toUnitIndex) {
      setAnswerStatus('correct');
      setScore(s => s + 15);
    } else {
      setAnswerStatus('incorrect');
      setScore(s => Math.max(0, s - 7));
    }
  };

  if (!question) return <GameShell title="Escala d'Unitats" score={score} onBack={onBack}><div/></GameShell>;
  
  const toUnitIndex = categoryUnits.findIndex(u => u.symbol === question.toUnit.symbol);

  return (
    <GameShell title="Escala d'Unitats" score={score} onBack={onBack}>
      <div className="flex flex-col items-center text-center">
        <p className="text-lg text-slate-600 mb-2">Fes servir l'escala per convertir:</p>
        <p className="text-3xl font-bold mb-8">
          {question.fromValue.toLocaleString('ca-ES')} {question.fromUnit.symbol} <span className="text-indigo-500">a</span> {question.toUnit.symbol}
        </p>

        <div className="flex items-stretch gap-4 md:gap-8 w-full max-w-md mx-auto">
            <div className="flex flex-col justify-around">
                <button onClick={() => handleMove('up')} disabled={currentStepIndex === 0 || answerStatus !== 'unanswered'} className="bg-indigo-500 hover:bg-indigo-600 disabled:bg-slate-300 text-white py-6 px-4 rounded-lg flex flex-col items-center">
                    <span className="text-2xl">↑</span><span className="text-xs">÷10</span>
                </button>
                 <button onClick={() => handleMove('down')} disabled={currentStepIndex === categoryUnits.length - 1 || answerStatus !== 'unanswered'} className="bg-indigo-500 hover:bg-indigo-600 disabled:bg-slate-300 text-white py-6 px-4 rounded-lg flex flex-col items-center">
                    <span className="text-2xl">↓</span><span className="text-xs">x10</span>
                </button>
            </div>
            
            <div className="flex-1 space-y-2">
                {categoryUnits.map((unit, index) => (
                    <div key={unit.symbol} className={`flex justify-between items-center p-3 rounded-lg border-2 transition-all ${index === currentStepIndex ? 'bg-indigo-100 border-indigo-500 scale-105' : 'bg-slate-100 border-transparent'} ${index === toUnitIndex && index !== currentStepIndex ? 'border-dashed border-amber-400' : ''}`}>
                        <span className="font-bold text-lg md:text-xl">{unit.symbol}</span>
                        {index === currentStepIndex && <span className="font-mono text-lg md:text-xl bg-white px-3 py-1 rounded border border-slate-200">{currentValue.toLocaleString('ca-ES', { maximumFractionDigits: 8 })}</span>}
                    </div>
                ))}
            </div>
        </div>

        <div className="min-h-[6rem] mt-4">
            {answerStatus === 'unanswered' ? (
              <button onClick={handleCheckAnswer} className="mt-8 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-8 rounded-lg animate-fade-in">
                  Comprova Resposta
              </button>
            ) : (
                <div className="mt-4 flex flex-col items-center animate-fade-in">
                    {answerStatus === 'correct' ? (
                      <div className="flex items-center gap-2 text-emerald-500 text-xl"><CorrectIcon /><span>Correcte!</span></div>
                    ) : (
                      <div className="flex flex-col items-center gap-2 text-rose-500 text-xl">
                        <div className="flex items-center gap-2"><IncorrectIcon/><span>Incorrecte!</span></div>
                        <p className="text-slate-800 mt-2">Havies d'arribar a <span className="font-bold">{question.toUnit.symbol}</span>. La resposta correcta era: <span className="font-bold">{question.correctAnswer.toLocaleString('ca-ES')}</span></p>
                      </div>
                    )}
                    <button onClick={getNextQuestion} className="mt-6 bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-8 rounded-lg">Següent Pregunta</button>
                </div>
            )}
        </div>
      </div>
    </GameShell>
  );
};

export default UnitLadderGame;
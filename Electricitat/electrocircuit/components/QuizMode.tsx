import React, { useState, useEffect, useCallback } from 'react';
import { CIRCUIT_ELEMENTS } from '../constants';
import { CircuitElement, QuizQuestion } from '../types';

const QuizMode: React.FC = () => {
  const [currentQuestion, setCurrentQuestion] = useState<QuizQuestion | null>(null);
  const [score, setScore] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);

  const generateQuestion = useCallback(() => {
    const randomIdx = Math.floor(Math.random() * CIRCUIT_ELEMENTS.length);
    const target = CIRCUIT_ELEMENTS[randomIdx];

    // Generate 3 distractors
    const distractors = CIRCUIT_ELEMENTS
      .filter(e => e.id !== target.id)
      .sort(() => 0.5 - Math.random())
      .slice(0, 3);

    const options = [target, ...distractors].sort(() => 0.5 - Math.random());

    setCurrentQuestion({
      targetElement: target,
      options: options
    });
    setFeedback(null);
  }, []);

  useEffect(() => {
    generateQuestion();
  }, [generateQuestion]);

  const handleAnswer = (selected: CircuitElement) => {
    if (!currentQuestion || feedback) return;

    setAttempts(p => p + 1);
    if (selected.id === currentQuestion.targetElement.id) {
      setScore(s => s + 1);
      setFeedback('correct');
      setTimeout(generateQuestion, 1500);
    } else {
      setFeedback('incorrect');
      setTimeout(generateQuestion, 1500);
    }
  };

  if (!currentQuestion) return <div className="p-8 text-center">Carregant...</div>;

  return (
    <div className="pb-24 pt-4 px-4 max-w-md mx-auto h-full flex flex-col">
      <div className="flex justify-between items-center mb-6 bg-white p-4 rounded-lg shadow-sm border border-slate-200">
        <div>
          <p className="text-xs text-slate-500 uppercase tracking-wide">Puntuació</p>
          <p className="text-2xl font-bold text-amber-600">{score}</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-slate-500 uppercase tracking-wide">Intents</p>
          <p className="text-2xl font-bold text-slate-700">{attempts}</p>
        </div>
      </div>

      <div className="flex-grow flex flex-col justify-center">
        <div className="bg-white rounded-2xl shadow-md border border-slate-200 p-8 mb-8 flex flex-col items-center min-h-[200px] justify-center relative overflow-hidden">
            {feedback === 'correct' && (
                <div className="absolute inset-0 bg-green-100 flex items-center justify-center z-10 opacity-90">
                    <span className="text-4xl font-bold text-green-700">Correcte! 🎉</span>
                </div>
            )}
             {feedback === 'incorrect' && (
                <div className="absolute inset-0 bg-red-100 flex items-center justify-center z-10 opacity-90">
                    <span className="text-2xl font-bold text-red-700 text-center">
                        Incorrecte.<br/><span className="text-lg font-normal text-slate-700 mt-2">Era: {currentQuestion.targetElement.name}</span>
                    </span>
                </div>
            )}

            <div className="w-full h-32 text-slate-800 mb-4">
                {currentQuestion.targetElement.icon}
            </div>
            <p className="text-slate-500 text-sm">Quin element és aquest?</p>
        </div>

        <div className="grid grid-cols-1 gap-3">
          {currentQuestion.options.map((option) => (
            <button
              key={option.id}
              onClick={() => handleAnswer(option)}
              disabled={feedback !== null}
              className={`p-4 rounded-xl font-semibold text-left transition-all border-2
                ${feedback === null 
                    ? 'bg-white border-slate-200 hover:border-amber-400 hover:bg-amber-50 text-slate-700 shadow-sm' 
                    : 'bg-slate-50 border-slate-100 text-slate-400 cursor-not-allowed'
                }
              `}
            >
              {option.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default QuizMode;
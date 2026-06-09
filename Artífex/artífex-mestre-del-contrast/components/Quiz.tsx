import React, { useState } from 'react';
import { QuizQuestion } from '../types';
import { calculateContrast } from '../utils/colorUtils';
import { Check, X, Trophy, ArrowRight, Lightbulb } from 'lucide-react';

const QUESTIONS: QuizQuestion[] = [
  { 
    id: 1, 
    bg: '#ffffff', 
    fg: '#d1d5db', 
    context: "Text en una notícia", 
    isGood: false,
    explanation: "El gris clar sobre blanc té molt poc contrast. És gairebé invisible si tens la brillantor de la pantalla baixa!"
  },
  { 
    id: 2, 
    bg: '#1e3a8a', 
    fg: '#ffffff', 
    context: "Botó de 'Comprar'", 
    isGood: true,
    explanation: "Perfecte! El blanc sobre blau fosc és una combinació clàssica que sempre funciona i crida l'atenció."
  },
  { 
    id: 3, 
    bg: '#ef4444', 
    fg: '#22c55e', 
    context: "Targeta de Nadal", 
    isGood: false,
    explanation: "Compte! Vermell i verd tenen una lluminositat semblant i vibren a la vista. A més, els daltònics no ho podran llegir."
  },
  { 
    id: 4, 
    bg: '#fef08a', 
    fg: '#854d0e', 
    context: "Nota important (Pòsit)", 
    isGood: true,
    explanation: "Molt bé. Tot i ser colors de la mateixa gamma, el marró és prou fosc per destacar sobre el groc pastís."
  },
  { 
    id: 5, 
    bg: '#000000', 
    fg: '#1d4ed8', 
    context: "Link en mode fosc", 
    isGood: false,
    explanation: "El blau fosc sobre negre costa moltíssim de veure. En mode fosc, els colors han de ser més brillants o pastís."
  },
];

export const Quiz: React.FC<{ onFinish: () => void }> = ({ onFinish }) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);
  const [lastCorrect, setLastCorrect] = useState(false);

  const question = QUESTIONS[currentIdx];
  const isLast = currentIdx === QUESTIONS.length - 1;

  const handleAnswer = (userSaysGood: boolean) => {
    const isCorrect = userSaysGood === question.isGood;
    setLastCorrect(isCorrect);
    
    if (isCorrect) {
      setScore(s => s + 1);
    }
    
    setShowFeedback(true);
  };

  const nextQuestion = () => {
    setShowFeedback(false);
    if (isLast) {
      onFinish();
    } else {
      setCurrentIdx(c => c + 1);
    }
  };

  if (currentIdx >= QUESTIONS.length) return null;

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="mb-6 flex justify-between items-center text-slate-500">
        <span className="font-mono text-sm uppercase tracking-widest">Pregunta {currentIdx + 1} / {QUESTIONS.length}</span>
        <span className="flex items-center gap-1 text-indigo-600 font-bold"><Trophy size={16}/> {score} Punts</span>
      </div>

      <div className="bg-white rounded-3xl shadow-2xl overflow-hidden mb-8 border border-slate-100">
        {/* Preview Area */}
        <div 
          className="h-64 flex flex-col items-center justify-center p-8 text-center transition-colors duration-500"
          style={{ backgroundColor: question.bg, color: question.fg }}
        >
          <div className="text-sm uppercase tracking-wide opacity-75 mb-2 border-b border-current pb-1">
            {question.context}
          </div>
          <h2 className="text-4xl md:text-5xl font-bold">
            Es llegeix bé?
          </h2>
        </div>

        {/* Interaction Area */}
        <div className="p-8">
            {!showFeedback ? (
                <div className="grid grid-cols-2 gap-4">
                    <button 
                        onClick={() => handleAnswer(false)}
                        className="flex flex-col items-center justify-center gap-2 p-6 rounded-xl bg-red-50 text-red-700 hover:bg-red-100 border-2 border-transparent hover:border-red-200 transition-all"
                    >
                        <X size={32} />
                        <span className="font-bold text-lg">No, costa</span>
                    </button>
                    <button 
                        onClick={() => handleAnswer(true)}
                        className="flex flex-col items-center justify-center gap-2 p-6 rounded-xl bg-green-50 text-green-700 hover:bg-green-100 border-2 border-transparent hover:border-green-200 transition-all"
                    >
                        <Check size={32} />
                        <span className="font-bold text-lg">Sí, perfecte</span>
                    </button>
                </div>
            ) : (
                <div className={`rounded-xl p-6 ${lastCorrect ? 'bg-green-50 border border-green-100' : 'bg-red-50 border border-red-100'}`}>
                    <div className="flex items-start gap-4 mb-4">
                        <div className={`p-2 rounded-full ${lastCorrect ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'}`}>
                            {lastCorrect ? <Check size={24} /> : <X size={24} />}
                        </div>
                        <div>
                            <h3 className={`text-xl font-bold ${lastCorrect ? 'text-green-900' : 'text-red-900'}`}>
                                {lastCorrect ? "Molt bé!" : "Vaja..."}
                            </h3>
                            <div className="text-slate-600 mt-1">
                                Ràtio real: <strong>{calculateContrast(question.bg, question.fg).toFixed(2)}:1</strong>
                            </div>
                        </div>
                    </div>
                    
                    <div className="bg-white/80 p-4 rounded-lg text-slate-800 border border-slate-200/50 mb-4 flex gap-3">
                         <Lightbulb className="text-yellow-500 shrink-0" size={20} />
                         <p className="text-sm">{question.explanation}</p>
                    </div>

                    <button 
                        onClick={nextQuestion}
                        className="w-full bg-slate-900 text-white py-3 rounded-lg font-bold hover:bg-slate-800 transition-colors flex items-center justify-center gap-2"
                    >
                        Següent <ArrowRight size={18} />
                    </button>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};
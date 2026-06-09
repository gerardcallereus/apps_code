import React, { useState, useEffect, useCallback, ReactNode } from 'react';
import { MAGNITUDES } from '../constants';
import { Problem, Unit } from '../types';
import { CheckIcon, XIcon } from './Icons';

type FeedbackStatus = 'none' | 'correct' | 'incorrect';

interface Feedback {
  status: FeedbackStatus;
  message?: ReactNode;
}

const generateNewProblem = (): Problem => {
  const magnitude = MAGNITUDES[Math.floor(Math.random() * MAGNITUDES.length)];
  
  let fromUnit: Unit, toUnit: Unit;
  do {
    fromUnit = magnitude.units[Math.floor(Math.random() * magnitude.units.length)];
    toUnit = magnitude.units[Math.floor(Math.random() * magnitude.units.length)];
  } while (fromUnit.symbol === toUnit.symbol);

  const value = parseFloat((Math.random() * 999 + 1).toFixed(2));
  const baseValue = value * fromUnit.multiplier;
  const correctAnswer = baseValue / toUnit.multiplier;

  return { magnitude, value, fromUnit, toUnit, correctAnswer };
};

const getExplanation = (problem: Problem): ReactNode => {
    const { fromUnit, toUnit, value, correctAnswer } = problem;
    let operationText, factor, directionText;

    if (fromUnit.multiplier > toUnit.multiplier) {
        // De gran a petit -> Multiplicar
        directionText = 'baixant a l\'escala (a una unitat més petita)';
        operationText = 'multiplicar';
        factor = fromUnit.multiplier / toUnit.multiplier;
    } else {
        // De petit a gran -> Dividir
        directionText = 'pujant a l\'escala (a una unitat més gran)';
        operationText = 'dividir';
        factor = toUnit.multiplier / fromUnit.multiplier;
    }

    return (
        <div className="text-left space-y-2 mt-4 text-slate-300 bg-slate-900/50 p-4 rounded-md">
            <p><strong>Raonament:</strong></p>
            <ul className="list-disc list-inside space-y-1 text-sm">
                <li>Estem convertint de <strong className="font-mono text-cyan-400">{fromUnit.symbol}</strong> a <strong className="font-mono text-cyan-400">{toUnit.symbol}</strong>, és a dir, estem {directionText}.</li>
                <li>Per tant, hem de <strong className="text-yellow-400">{operationText}</strong> per un factor de <strong className="font-mono">{factor}</strong>.</li>
                <li><strong>Càlcul:</strong> <span className="font-mono">{value} {fromUnit.symbol} {operationText === 'multiplicar' ? '×' : '÷'} {factor} = {correctAnswer.toPrecision(4)} {toUnit.symbol}</span></li>
            </ul>
        </div>
    );
};


const Practice: React.FC = () => {
  const [problem, setProblem] = useState<Problem | null>(null);
  const [userAnswer, setUserAnswer] = useState<string>('');
  const [feedback, setFeedback] = useState<Feedback>({ status: 'none' });
  const [score, setScore] = useState(0);
  const [attempts, setAttempts] = useState(0);

  const newQuestion = useCallback(() => {
    setProblem(generateNewProblem());
    setUserAnswer('');
    setFeedback({ status: 'none' });
  }, []);

  useEffect(() => {
    newQuestion();
  }, [newQuestion]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (feedback.status !== 'none' || !problem) return;

    const answerNum = parseFloat(userAnswer.replace(',', '.'));
    if (isNaN(answerNum)) {
      setFeedback({ status: 'incorrect', message: <p>La teva resposta no és un número vàlid.</p> });
      return;
    }

    const isCorrect = Math.abs(answerNum - problem.correctAnswer) / problem.correctAnswer < 0.015; // 1.5% tolerance

    if (isCorrect) {
      setFeedback({ status: 'correct', message: <p className="text-green-400">Molt bé! Resposta correcta.</p> });
      setScore(prev => prev + 1);
    } else {
      setFeedback({ 
        status: 'incorrect', 
        message: (
          <div>
            <p className="text-red-400">Incorrecte. La resposta correcta era <strong className="font-mono">{problem.correctAnswer.toPrecision(4)}</strong>.</p>
            {getExplanation(problem)}
          </div>
        )
      });
    }
    setAttempts(prev => prev + 1);
  };

  if (!problem) {
    return <div className="text-center p-8">Carregant preguntes...</div>;
  }
  
  const feedbackBg = {
    correct: 'bg-green-500/20 border-green-500',
    incorrect: 'bg-red-500/20 border-red-500',
    none: 'bg-slate-800/50 border-slate-700',
  };

  return (
    <section className="max-w-2xl mx-auto">
      <h2 className="text-2xl sm:text-3xl font-bold text-center mb-6 text-slate-100">Mode Pràctica</h2>
      <div className={`p-4 rounded-lg text-center mb-6 border ${feedbackBg.none} transition-colors`}>
        <p className="text-lg font-semibold text-slate-400">Puntuació</p>
        <p className="text-3xl font-bold text-cyan-400">{score} <span className="text-xl text-slate-400">/ {attempts}</span></p>
      </div>
      
      <div className={`p-6 rounded-lg shadow-lg border transition-all duration-300 ${feedbackBg[feedback.status]}`}>
        <p className="text-slate-400 text-center mb-2">{problem.magnitude.name}</p>
        <p className="text-xl sm:text-2xl font-bold text-center text-slate-100 mb-6">
          Converteix{' '}
          <span className="text-cyan-400 font-mono">{problem.value} {problem.fromUnit.symbol}</span>
          {' '}a{' '}
          <span className="text-cyan-400 font-mono">{problem.toUnit.symbol}</span>
        </p>

        {feedback.status === 'none' ? (
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              placeholder="La teva resposta..."
              className="w-full px-4 py-3 bg-slate-900 border-2 border-slate-600 rounded-md text-slate-100 text-center text-xl font-mono focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-colors"
              autoFocus
            />
            <button
              type="submit"
              className="w-full mt-4 bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-3 px-4 rounded-md transition-all duration-300 transform hover:scale-105"
            >
              Comprovar
            </button>
          </form>
        ) : (
          <div>
            <div className="mt-6 flex items-center justify-center gap-3 text-lg">
               {feedback.status === 'correct' ? 
                <CheckIcon className="w-8 h-8 text-green-500" /> : 
                <XIcon className="w-8 h-8 text-red-500" />
              }
              <div>{feedback.message}</div>
            </div>
            <button
              onClick={newQuestion}
              className="w-full mt-6 bg-slate-600 hover:bg-slate-500 text-white font-bold py-3 px-4 rounded-md transition-all duration-300"
            >
              Següent Pregunta
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default Practice;
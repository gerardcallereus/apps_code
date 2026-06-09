import React, { useState, useEffect, useCallback, ReactNode } from 'react';
import { MAGNITUDES } from '../constants';
import { Problem, Unit } from '../types';

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
    let operationText, factor, directionText, operationSymbol;

    if (fromUnit.multiplier > toUnit.multiplier) {
        // De gran a petit -> Multiplicar
        directionText = 'anem d\'una unitat més gran a una de més petita (baixem a l\'escala)';
        operationText = 'multiplicar';
        operationSymbol = '×';
        factor = fromUnit.multiplier / toUnit.multiplier;
    } else {
        // De petit a gran -> Dividir
        directionText = 'anem d\'una unitat més petita a una de més gran (pugem a l\'escala)';
        operationText = 'dividir';
        operationSymbol = '÷';
        factor = toUnit.multiplier / fromUnit.multiplier;
    }

    return (
        <div className="text-left space-y-3 mt-4 text-slate-300">
            <div className="bg-slate-900/50 p-4 rounded-md">
                <h4 className="font-semibold text-lg text-slate-200">Pas 1: Analitzar la conversió</h4>
                <p className="text-slate-400">Hem de passar de <strong className="font-mono text-cyan-400">{fromUnit.symbol}</strong> a <strong className="font-mono text-cyan-400">{toUnit.symbol}</strong>. Com que {directionText}, hem de <strong className="text-yellow-400">{operationText}</strong>.</p>
            </div>
            <div className="bg-slate-900/50 p-4 rounded-md">
                <h4 className="font-semibold text-lg text-slate-200">Pas 2: Determinar el factor</h4>
                <p className="text-slate-400">El factor de conversió entre aquestes dues unitats és <strong className="font-mono text-yellow-400">{factor.toLocaleString('ca-ES')}</strong>.</p>
            </div>
            <div className="bg-slate-900/50 p-4 rounded-md">
                <h4 className="font-semibold text-lg text-slate-200">Pas 3: Realitzar el càlcul</h4>
                <p className="text-slate-400">Ara apliquem l'operació:</p>
                <p className="font-mono text-xl text-center p-3 my-2 bg-slate-900 rounded-md text-cyan-300">{value} {operationSymbol} {factor.toLocaleString('ca-ES')} = {correctAnswer.toPrecision(5)}</p>
            </div>
        </div>
    );
};


const Examples: React.FC = () => {
  const [problem, setProblem] = useState<Problem | null>(null);

  const newExample = useCallback(() => {
    setProblem(generateNewProblem());
  }, []);

  useEffect(() => {
    newExample();
  }, [newExample]);

  if (!problem) {
    return <div className="text-center p-8">Generant exemple...</div>;
  }
  
  return (
    <section className="max-w-2xl mx-auto">
      <h2 className="text-2xl sm:text-3xl font-bold text-center mb-6 text-slate-100">Exemples Resolts</h2>
      
      <div className="p-6 rounded-lg shadow-lg bg-slate-800 border border-slate-700">
        <p className="text-slate-400 text-center mb-2">{problem.magnitude.name}</p>
        <p className="text-xl sm:text-2xl font-bold text-center text-slate-100 mb-6">
          Converteix{' '}
          <span className="text-cyan-400 font-mono">{problem.value} {problem.fromUnit.symbol}</span>
          {' '}a{' '}
          <span className="text-cyan-400 font-mono">{problem.toUnit.symbol}</span>
        </p>
        
        <hr className="border-slate-600 my-6" />

        {getExplanation(problem)}
        
        <div className="mt-8 p-4 rounded-md bg-cyan-900/50 text-center">
            <p className="text-lg text-slate-300">La resposta final és:</p>
            <p className="text-2xl font-bold font-mono text-cyan-400">{problem.correctAnswer.toPrecision(5)} {problem.toUnit.symbol}</p>
        </div>
      </div>

      <div className="text-center mt-8">
        <button
          onClick={newExample}
          className="bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-3 px-6 rounded-md transition-all duration-300 transform hover:scale-105"
        >
          Generar un Nou Exemple
        </button>
      </div>
    </section>
  );
};

export default Examples;
import React, { useState, useEffect, useCallback } from 'react';
import { Variable, Exercise } from '../types';
import { CheckCircleIcon, XCircleIcon } from './icons';

const round = (num: number) => Math.round(num * 100) / 100;

const generateExercises = (): Exercise[] => {
    const exercises: Exercise[] = [];
    for (let i = 0; i < 5; i++) {
        const solveFor = Object.values(Variable)[i % 3];
        let voltage: number | null = null;
        let current: number | null = null;
        let resistance: number | null = null;

        if (solveFor === Variable.Voltage) {
            current = round(Math.random() * 10 + 1); // 1-11 A
            resistance = round(Math.random() * 20 + 2); // 2-22 Ω
        } else if (solveFor === Variable.Current) {
            voltage = round(Math.random() * 50 + 5); // 5-55 V
            resistance = round(Math.random() * 100 + 10); // 10-110 Ω
        } else { // solveFor === Variable.Resistance
            voltage = round(Math.random() * 30 + 3); // 3-33 V
            current = round(Math.random() * 5 + 0.5); // 0.5-5.5 A
        }
        exercises.push({ id: i, voltage, current, resistance, solveFor });
    }
    return exercises;
};

const translateVariable = (variable: Variable): string => {
    switch (variable) {
        case Variable.Voltage: return 'Tensió';
        case Variable.Current: return 'Corrent';
        case Variable.Resistance: return 'Resistència';
        default: return '';
    }
};

export const Exercises: React.FC = () => {
    const [exercises, setExercises] = useState<Exercise[]>([]);
    const [userAnswers, setUserAnswers] = useState<Record<number, string>>({});
    const [results, setResults] = useState<Record<number, { correct: boolean; correctAnswer: number } | null>>({});

    const createNewExercises = useCallback(() => {
        setExercises(generateExercises());
        setUserAnswers({});
        setResults({});
    },[]);

    useEffect(() => {
        createNewExercises();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleAnswerChange = (id: number, value: string) => {
        setUserAnswers(prev => ({ ...prev, [id]: value }));
    };

    const checkAnswers = () => {
        const newResults: Record<number, { correct: boolean; correctAnswer: number }> = {};
        exercises.forEach(ex => {
            let correctAnswer = 0;
            if (ex.solveFor === Variable.Voltage) {
                correctAnswer = ex.current! * ex.resistance!;
            } else if (ex.solveFor === Variable.Current) {
                correctAnswer = ex.voltage! / ex.resistance!;
            } else {
                correctAnswer = ex.voltage! / ex.current!;
            }
            const userAnswer = parseFloat(userAnswers[ex.id]);
            newResults[ex.id] = {
                correct: Math.abs(userAnswer - correctAnswer) < 0.01,
                correctAnswer: round(correctAnswer)
            };
        });
        setResults(newResults);
    };
    
    const getUnit = (variable: Variable) => {
        if (variable === Variable.Voltage) return 'V';
        if (variable === Variable.Current) return 'A';
        return 'Ω';
    }

    return (
        <div className="animate-fade-in">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold text-slate-800">Posa't a Prova</h2>
                 <button onClick={createNewExercises} className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                    Nous Exercicis
                </button>
            </div>
            <p className="text-slate-600 mb-6">Calcula el valor que falta en cada circuit. Arrodoneix a dos decimals si cal.</p>

            <div className="space-y-4">
                {exercises.map((ex, index) => (
                    <div key={ex.id} className={`p-4 rounded-lg border transition-all ${results[ex.id] ? (results[ex.id]?.correct ? 'bg-green-50 border-green-300' : 'bg-red-50 border-red-300') : 'bg-white border-slate-200'}`}>
                        <div className="grid md:grid-cols-4 gap-4 items-center">
                            <p className="md:col-span-3 text-slate-700">
                                <strong>{index + 1}.</strong> Si un circuit té
                                {ex.voltage !== null ? ` una tensió de ${ex.voltage} V` : ''}
                                {ex.current !== null ? ` i un corrent de ${ex.current} A` : ''}
                                {ex.resistance !== null ? ` i una resistència de ${ex.resistance} Ω` : ''},
                                quin és el valor de la <strong>{translateVariable(ex.solveFor)}</strong>?
                            </p>
                            <div className="flex items-center space-x-2">
                                <input
                                    type="number"
                                    step="0.01"
                                    placeholder="Resposta"
                                    value={userAnswers[ex.id] || ''}
                                    onChange={(e) => handleAnswerChange(ex.id, e.target.value)}
                                    className="w-full px-3 py-2 text-base bg-white border border-slate-400 rounded-md focus:ring-blue-500 focus:border-blue-500 text-black placeholder-slate-500"
                                />
                                <span className="font-bold text-slate-600">{getUnit(ex.solveFor)}</span>
                                {results[ex.id] && (
                                    results[ex.id]?.correct ? <CheckCircleIcon /> : <XCircleIcon />
                                )}
                            </div>
                        </div>
                        {results[ex.id] && !results[ex.id]?.correct && (
                            <div className="mt-3 p-3 bg-red-100 rounded-md text-sm text-red-800">
                                <p className="font-bold">Resposta incorrecta.</p>
                                <p>La resposta correcta és <strong>{results[ex.id]?.correctAnswer} {getUnit(ex.solveFor)}</strong>.</p>
                                {ex.solveFor === Variable.Voltage && ex.current && ex.resistance && (
                                    <p className="mt-1 font-mono">Fórmula: V = I × R <br /> Càlcul: {ex.current} A × {ex.resistance} Ω = {results[ex.id]?.correctAnswer} V</p>
                                )}
                                {ex.solveFor === Variable.Current && ex.voltage && ex.resistance && (
                                    <p className="mt-1 font-mono">Fórmula: I = V / R <br /> Càlcul: {ex.voltage} V / {ex.resistance} Ω = {results[ex.id]?.correctAnswer} A</p>
                                )}
                                {ex.solveFor === Variable.Resistance && ex.voltage && ex.current && (
                                    <p className="mt-1 font-mono">Fórmula: R = V / I <br /> Càlcul: {ex.voltage} V / {ex.current} A = {results[ex.id]?.correctAnswer} Ω</p>
                                )}
                            </div>
                        )}
                    </div>
                ))}
            </div>
             <div className="mt-8 text-center">
                <button onClick={checkAnswers} className="px-8 py-3 bg-green-600 text-white font-bold text-lg rounded-lg shadow-lg hover:bg-green-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
                    Corregir
                </button>
            </div>
        </div>
    );
};
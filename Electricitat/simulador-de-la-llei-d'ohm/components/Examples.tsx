import React, { useState, useEffect, useCallback } from 'react';

// Helper function to round numbers to two decimal places
const round = (num: number) => Math.round(num * 100) / 100;

interface ExampleData {
    title: string;
    problem: string;
    formula: string;
    calculation: string;
    result: string;
}

const ExampleCard: React.FC<ExampleData> = ({ title, problem, formula, calculation, result }) => (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-slate-200 hover:shadow-xl hover:border-blue-300 transition-all duration-300 flex flex-col">
        <h3 className="text-2xl font-bold text-blue-700 mb-4">{title}</h3>
        <div className="space-y-4 text-slate-700 flex-grow">
            <p><strong className="font-semibold">Problema:</strong> {problem}</p>
            <div>
                <strong className="font-semibold">Fórmula:</strong>
                <p className="font-mono text-lg bg-slate-100 p-2 mt-1 rounded">{formula}</p>
            </div>
            <div>
                <strong className="font-semibold">Càlcul:</strong>
                <p className="font-mono text-lg bg-slate-100 p-2 mt-1 rounded">{calculation}</p>
            </div>
            <div>
                <strong className="font-semibold">Resultat:</strong>
                <p className="font-mono text-lg bg-green-100 text-green-800 p-2 mt-1 rounded">{result}</p>
            </div>
        </div>
    </div>
);

export const Examples: React.FC = () => {
    const [examples, setExamples] = useState<ExampleData[]>([]);

    const generateExamples = useCallback(() => {
        const newExamples: ExampleData[] = [];

        // Example 1: Calculate Voltage
        const i1 = round(Math.random() * 9 + 1); // 1-10 A
        const r1 = round(Math.random() * 48 + 2); // 2-50 Ω
        const v1 = round(i1 * r1);
        newExamples.push({
            title: "Calcular la Tensió (V)",
            problem: `Un circuit té una resistència de ${r1} Ω i hi circula un corrent de ${i1} A. Quina és la tensió?`,
            formula: "V = I × R",
            calculation: `V = ${i1} A × ${r1} Ω`,
            result: `V = ${v1} V`,
        });

        // Example 2: Calculate Current
        const v2 = round(Math.random() * 95 + 5); // 5-100 V
        const r2 = round(Math.random() * 190 + 10); // 10-200 Ω
        const i2 = round(v2 / r2);
        newExamples.push({
            title: "Calcular el Corrent (I)",
            problem: `Una bateria de ${v2} V està connectada a una resistència de ${r2} Ω. Quin corrent hi circula?`,
            formula: "I = V / R",
            calculation: `I = ${v2} V / ${r2} Ω`,
            result: `I = ${i2} A`,
        });

        // Example 3: Calculate Resistance
        const v3 = round(Math.random() * 47 + 3); // 3-50 V
        const i3 = round(Math.random() * 4.5 + 0.5); // 0.5-5 A
        const r3 = round(v3 / i3);
        newExamples.push({
            title: "Calcular la Resistència (R)",
            problem: `Un component rep una tensió de ${v3} V i deixa passar un corrent de ${i3} A. Quina és la seva resistència?`,
            formula: "R = V / I",
            calculation: `R = ${v3} V / ${i3} A`,
            result: `R = ${r3} Ω`,
        });

        setExamples(newExamples);
    }, []);

    useEffect(() => {
        generateExamples();
    }, [generateExamples]);

    return (
        <div className="animate-fade-in">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold text-slate-800">Exemples Pràctics</h2>
                <button 
                    onClick={generateExamples} 
                    className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                    Actualitzar Exemples
                </button>
            </div>
            <div className="grid lg:grid-cols-3 gap-8">
                {examples.map((ex, index) => (
                    <ExampleCard
                        key={index}
                        title={ex.title}
                        problem={ex.problem}
                        formula={ex.formula}
                        calculation={ex.calculation}
                        result={ex.result}
                    />
                ))}
            </div>
        </div>
    );
};
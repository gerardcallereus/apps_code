
import React from 'react';

const FormulaCard: React.FC<{ title: string; formula: string; description: React.ReactNode }> = ({ title, formula, description }) => (
    <div className="bg-slate-50 border border-slate-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
        <h3 className="text-xl font-semibold text-blue-700 mb-2">{title}</h3>
        <p className="text-2xl font-mono bg-slate-200 text-slate-800 py-2 px-4 rounded-md inline-block my-2">{formula}</p>
        <p className="text-slate-600 mt-2">{description}</p>
    </div>
);


export const Explanation: React.FC = () => {
  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h2 className="text-3xl font-bold text-slate-800 mb-4">Què és la Llei d'Ohm?</h2>
        <p className="text-lg text-slate-700 leading-relaxed">
          La Llei d'Ohm, anomenada així pel físic alemany Georg Ohm, és un dels principis fonamentals de l'electricitat.
          Descriu la relació entre tres magnituds clau en un circuit elèctric: la <strong>tensió (V)</strong>, el <strong>corrent (I)</strong> i la <strong>resistència (R)</strong>.
        </p>
        <p className="mt-4 text-lg text-slate-700 leading-relaxed">
          La llei estableix que el corrent que flueix a través d'un conductor entre dos punts és directament proporcional a la tensió a través dels dos punts, i inversament proporcional a la resistència entre ells.
        </p>
      </div>

      <div className="p-6 bg-blue-50 border-l-4 border-blue-500 rounded-r-lg">
        <h3 className="text-2xl font-semibold text-slate-800 mb-2">La Fórmula Fonamental</h3>
        <p className="text-3xl font-mono text-center bg-white py-4 px-6 rounded-lg shadow-sm">
            V = I × R
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6 text-center">
         <div className="bg-white p-6 rounded-lg shadow-md">
            <h4 className="text-xl font-bold mb-2">Tensió (V)</h4>
            <p className="text-slate-600">És la "pressió" o força que empeny els electrons a través del circuit. Es mesura en <strong>Volts (V)</strong>.</p>
        </div>
         <div className="bg-white p-6 rounded-lg shadow-md">
            <h4 className="text-xl font-bold mb-2">Corrent (I)</h4>
            <p className="text-slate-600">És el flux d'electrons a través del circuit. Es mesura en <strong>Ampers (A)</strong>.</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
            <h4 className="text-xl font-bold mb-2">Resistència (R)</h4>
            <p className="text-slate-600">És l'oposició al pas del corrent. Es mesura en <strong>Ohms (Ω)</strong>.</p>
        </div>
      </div>

      <div>
        <h3 className="text-2xl font-semibold text-slate-800 mb-4">Variacions de la Fórmula</h3>
        <p className="text-slate-700 mb-6">Reorganitzant la fórmula, podem calcular qualsevol de les tres magnituds si coneixem les altres dues:</p>
        <div className="grid md:grid-cols-3 gap-6">
            <FormulaCard 
                title="Calcular la Tensió"
                formula="V = I × R"
                description={<>Si coneixes el corrent (I) i la resistència (R), pots trobar la tensió (V).</>}
            />
            <FormulaCard 
                title="Calcular el Corrent"
                formula="I = V / R"
                description={<>Si coneixes la tensió (V) i la resistència (R), pots trobar el corrent (I).</>}
            />
             <FormulaCard 
                title="Calcular la Resistència"
                formula="R = V / I"
                description={<>Si coneixes la tensió (V) i el corrent (I), pots trobar la resistència (R).</>}
            />
        </div>
      </div>
    </div>
  );
};

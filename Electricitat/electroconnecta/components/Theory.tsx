import React from 'react';
import { Zap, Shield, Battery, Atom } from 'lucide-react';

export const Theory: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-2xl shadow-xl">
      <h2 className="text-3xl font-bold text-slate-800 mb-6 text-center border-b pb-4">Què és la Conductivitat Elèctrica?</h2>
      
      <div className="grid md:grid-cols-2 gap-8 mb-8">
        <div className="bg-blue-50 p-6 rounded-xl border border-blue-100">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-blue-500 text-white rounded-lg">
                <Zap size={24} />
            </div>
            <h3 className="text-xl font-bold text-blue-800">Materials Conductors</h3>
          </div>
          <p className="text-slate-700 leading-relaxed">
            Sons materials que <strong>deixen passar</strong> el corrent elèctric fàcilment a través d'ells. 
            Això passa perquè els seus àtoms tenen electrons lliures que es poden moure.
          </p>
          <ul className="mt-4 space-y-2 text-sm font-semibold text-blue-700">
            <li className="flex items-center gap-2">🔹 La majoria de metalls (Coure, Ferro, Or)</li>
            <li className="flex items-center gap-2">🔹 L'aigua amb sal</li>
            <li className="flex items-center gap-2">🔹 El grafit (mines de llapis)</li>
          </ul>
        </div>

        <div className="bg-red-50 p-6 rounded-xl border border-red-100">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-red-500 text-white rounded-lg">
                <Shield size={24} />
            </div>
            <h3 className="text-xl font-bold text-red-800">Materials Aïllants</h3>
          </div>
          <p className="text-slate-700 leading-relaxed">
            Són materials que <strong>NO deixen passar</strong> el corrent elèctric. 
            Els electrons estan fortament units als àtoms i no es poden moure. S'utilitzen per protegir-nos de l'electricitat.
          </p>
          <ul className="mt-4 space-y-2 text-sm font-semibold text-red-700">
            <li className="flex items-center gap-2">🔸 Plàstic i Goma</li>
            <li className="flex items-center gap-2">🔸 Fusta seca</li>
            <li className="flex items-center gap-2">🔸 Vidre i Ceràmica</li>
          </ul>
        </div>
      </div>

      <div className="bg-slate-100 p-6 rounded-xl border border-slate-200">
        <div className="flex items-center gap-3 mb-4">
             <Atom className="text-slate-600" />
            <h3 className="text-lg font-bold text-slate-800">Com funciona un circuit?</h3>
        </div>
        <div className="flex flex-col md:flex-row gap-6 items-center">
            <div className="flex-1 text-slate-700">
                <p className="mb-2">Imagina que l'electricitat són cotxes viatjant per una carretera:</p>
                <ul className="list-disc ml-5 space-y-1">
                    <li>El <strong>generador</strong> (pila) dóna l'energia per moure's.</li>
                    <li>Els <strong>conductors</strong> (cables) són autopistes ràpides.</li>
                    <li>Els <strong>aïllants</strong> són murs de pedra on els cotxes no poden passar.</li>
                    <li>Els <strong>receptors</strong> (bombeta, brunzidor) aprofiten el moviment per fer llum o so.</li>
                </ul>
            </div>
            <div className="bg-white p-4 rounded-lg border border-slate-300 w-full md:w-1/3 flex justify-center">
                {/* Simple schematic SVG */}
                <svg width="200" height="100" viewBox="0 0 200 100" className="opacity-80">
                    <rect x="10" y="40" width="20" height="20" fill="#3b82f6" />
                    <circle cx="100" cy="40" r="10" fill="none" stroke="#eab308" strokeWidth="2" />
                    <line x1="30" y1="50" x2="90" y2="50" stroke="#475569" strokeWidth="2" />
                    <line x1="110" y1="50" x2="170" y2="50" stroke="#475569" strokeWidth="2" />
                    <text x="10" y="80" fontSize="10" fill="#64748b">Pila</text>
                    <text x="85" y="80" fontSize="10" fill="#64748b">Receptor</text>
                </svg>
            </div>
        </div>
      </div>
    </div>
  );
};

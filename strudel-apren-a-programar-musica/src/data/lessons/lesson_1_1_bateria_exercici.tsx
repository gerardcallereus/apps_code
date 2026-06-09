import { Target } from 'lucide-react';
import React from 'react';
import { Lesson } from '../../types';

export const lesson_1_1_bateria_exercici: Lesson = {
    id: '1.1-bateria-exercici',
    title: '1.1 Exercici de Bateria Rap',
    icon: Target,
    content: () => (
      <div className="space-y-4">
        <p className="text-lg text-slate-800 font-medium font-display">Demostra el teu ritme Boom-Bap!</p>
        <p className="text-slate-600">
          En aquest exercici hauràs de crear una base de bateria bàsica de rap de club utilitzant el <strong>bombo</strong> (kick), el <strong>xarles</strong> (hi-hat), la <strong>caixa</strong> (snare) i un plat <strong>obert</strong> (open hi-hat) al final. 
        </p>
        <div className="bg-indigo-50/50 border border-indigo-100 p-5 my-6 rounded-2xl shadow-sm shadow-indigo-100/50">
          <h4 className="text-indigo-500 text-xs font-bold uppercase tracking-wider mb-2 font-display flex gap-2 items-center">📝 Requisits de l'exercici:</h4>
          <ul className="list-disc pl-5 text-sm text-slate-700 font-medium marker:text-indigo-300 space-y-2">
            <li>El teu codi ha de tenir la funció <code className="text-rose-600 bg-white px-1 py-0.5 rounded border">so()</code> per reproduir mostres de bateria.</li>
            <li>A dins de la funció `so("...")`, hi has d'esriure la seqüència de sons exacta: <code className="text-rose-600 bg-white px-1 py-0.5 rounded border">bombo xarles caixa obert</code> per donar entrada a la base.</li>
          </ul>
        </div>
      </div>
    ),
    initialCode: '',
    exercise: {
      successMessage: "Perfecte! Això ja té el ritme i el swing d'un beat de rap! Passem a la subdivisió de notes.",
      onCheck: (code) => {
        const hasS = code.includes("so(");
        const hasPattern = code.includes("bombo xarles caixa obert");
        
        if (!hasS) {
          return { success: false, message: 'El teu codi no conté la crida a la funció so("..."). Recorda que és la funció clau per reproduir la bateria.' };
        }
        if (!hasPattern) {
          return { success: false, message: 'La seqüència que has creat no és el patró requerit. Comprova que has escrit exactament "bombo xarles caixa obert" a dins de so()!' };
        }
        
        return { success: true, message: "Perfecte!" };
      }
    }
};

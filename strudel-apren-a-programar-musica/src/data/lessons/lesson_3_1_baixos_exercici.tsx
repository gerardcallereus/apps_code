import { Target } from 'lucide-react';
import React from 'react';
import { Lesson } from '../../types';

export const lesson_3_1_baixos_exercici: Lesson = {
    id: '3.1-baixos-exercici',
    title: '4.1 Exercici de Baix Rap',
    icon: Target,
    content: () => (
      <div className="space-y-4">
        <p className="text-lg text-slate-800 font-medium font-display">Programem el baix del teu beat!</p>
        <p className="text-slate-600">
          En aquest exercici has de crear una línia de baix molt greu fent servir l'escala menor de Sol per aconseguir una textura fosca.
        </p>
        <div className="bg-indigo-50/50 border border-indigo-100 p-5 my-6 rounded-2xl shadow-sm shadow-indigo-100/50">
          <h4 className="text-indigo-500 text-xs font-bold uppercase tracking-wider mb-2 font-display flex gap-2 items-center">📝 Requisits de l'exercici:</h4>
          <ul className="list-disc pl-5 text-sm text-slate-700 font-medium marker:text-indigo-300 space-y-2">
            <li>Utilitza la funció <code className="text-rose-600 bg-white px-1 py-0.5 rounded border">nota()</code> amb el patró: <code className="text-rose-600 bg-white px-1 py-0.5 rounded border">"sol2 ~ re3 ~"</code> (observa el número 2 i 3 de l'octava).</li>
            <li>Afegeix l'escala de sol menor: <code className="text-rose-600 bg-white px-1 py-0.5 rounded border">.escala("sol:menor")</code>.</li>
            <li>Defineix el sintetitzador de triangle per tenir un so de baix profund: <code className="text-rose-600 bg-white px-1 py-0.5 rounded border">.instrument("triangle")</code>.</li>
          </ul>
        </div>
      </div>
    ),
    initialCode: '',
    exercise: {
      successMessage: "Brillant! Aquest baix fa vibrar els altaveus amb molta energia. Passem a la melodia!",
      onCheck: (code) => {
        const hasNotes = code.includes('nota("sol2 ~ re3 ~")') || code.includes("nota('sol2 ~ re3 ~')");
        const hasScale = code.includes('.escala("sol:menor")') || code.includes(".escala('sol:menor')");
        const hasInstrument = code.includes('.instrument("triangle")') || code.includes(".instrument('triangle')");
        
        if (!hasNotes) {
          return { success: false, message: 'La línia de notes no és correcta o falten els greus. Has escrit exactament: nota("sol2 ~ re3 ~")?' };
        }
        if (!hasScale) {
          return { success: false, message: 'Falta configurar l\'escala de sol menor: .escala("sol:menor").' };
        }
        if (!hasInstrument) {
          return { success: false, message: 'Falta indicar l\'instrument de triangle: .instrument("triangle").' };
        }
        
        return { success: true, message: "Perfecte!" };
      }
    }
};

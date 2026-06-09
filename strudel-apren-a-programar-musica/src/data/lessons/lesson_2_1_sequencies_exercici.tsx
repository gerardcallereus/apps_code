import { Target } from 'lucide-react';
import React from 'react';
import { Lesson } from '../../types';

export const lesson_2_1_sequencies_exercici: Lesson = {
    id: '2.1-sequencies-exercici',
    title: '2.1 Exercici de Subdivisions',
    icon: Target,
    content: () => (
      <div className="space-y-4">
        <p className="text-lg text-slate-800 font-medium font-display">Afegeix repics de plat a la teva base!</p>
        <p className="text-slate-600">
          En aquest exercici programaràs una base on el segon temps estigui subdividit amb dos plats ràpids fent un hi-hat roll de Boom-Bap.
        </p>
        <div className="bg-indigo-50/50 border border-indigo-100 p-5 my-6 rounded-2xl shadow-sm shadow-indigo-100/50">
          <h4 className="text-indigo-500 text-xs font-bold uppercase tracking-wider mb-2 font-display flex gap-2 items-center">📝 Requisits de l'exercici:</h4>
          <ul className="list-disc pl-5 text-sm text-slate-700 font-medium marker:text-indigo-300 space-y-2">
            <li>Utilitza la funció <code className="text-rose-600 bg-white px-1 py-0.5 rounded border">so()</code>.</li>
            <li>A dins de la cadena, escriu exactament la seqüència: <code className="text-rose-600 bg-white px-1 py-0.5 rounded border">bombo [xarles xarles] caixa obert</code> per fer el repic de plats de manera correcta.</li>
          </ul>
        </div>
      </div>
    ),
    initialCode: '',
    exercise: {
      successMessage: "Excel·lent! El doble plat li dona molt de dinamisme i moviment. Anem a parlar del tempo (BPM).",
      onCheck: (code) => {
        const hasS = code.includes("so(");
        const hasPattern = code.includes("bombo [xarles xarles] caixa obert");
        
        if (!hasS) {
          return { success: false, message: 'El teu codi no conté la crida a la funció so("...").' };
        }
        if (!hasPattern) {
          return { success: false, message: 'La seqüència que has creat no és el patró requerit. Recorda escriure exactament: "bombo [xarles xarles] caixa obert"!' };
        }
        
        return { success: true, message: "Perfecte!" };
      }
    }
};

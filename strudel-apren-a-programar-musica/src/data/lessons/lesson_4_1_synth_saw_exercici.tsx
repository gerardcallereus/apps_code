import { Target } from 'lucide-react';
import React from 'react';
import { Lesson } from '../../types';

export const lesson_4_1_synth_saw_exercici: Lesson = {
    id: '4.1-synth-saw-exercici',
    title: '5.1 Exercici de Melodia',
    icon: Target,
    content: () => (
      <div className="space-y-4">
        <p className="text-lg text-slate-800 font-medium font-display">Enfosqueix la teva melodia!</p>
        <p className="text-slate-600">
          En aquest exercici hauràs de crear una melodia càlida i fosca utilitzant l'instrument <strong>serra</strong> combinat amb un <strong>filtre de greus</strong>.
        </p>
        <div className="bg-indigo-50/50 border border-indigo-100 p-5 my-6 rounded-2xl shadow-sm shadow-indigo-100/50">
          <h4 className="text-indigo-500 text-xs font-bold uppercase tracking-wider mb-2 font-display flex gap-2 items-center">📝 Requisits de l'exercici:</h4>
          <ul className="list-disc pl-5 text-sm text-slate-700 font-medium marker:text-indigo-300 space-y-2">
            <li>Utilitza la funció <code className="text-rose-600 bg-white px-1 py-0.5 rounded border">nota()</code> amb la seqüència: <code className="text-rose-600 bg-white px-1 py-0.5 rounded border">"sol3 sib3 re4 fa4"</code>.</li>
            <li>Configura l'escala menor: <code className="text-rose-600 bg-white px-1 py-0.5 rounded border">.escala("sol:menor")</code>.</li>
            <li>Tria l'instrument <code className="text-rose-600 bg-white px-1 py-0.5 rounded border">"serra"</code>.</li>
            <li>Afegeix el modificador <code className="text-rose-600 bg-white px-1 py-0.5 rounded border">.filtreGreus(1200)</code> per filtrar els aguts.</li>
          </ul>
        </div>
      </div>
    ),
    initialCode: '',
    exercise: {
      successMessage: "Excel·lent! Has aconseguit aquest ambient obscur i misteriós tan típic del hip-hop. Passem als efectes!",
      onCheck: (code) => {
        const hasNotes = code.includes('nota("sol3 sib3 re4 fa4")') || code.includes("nota('sol3 sib3 re4 fa4')");
        const hasScale = code.includes('.escala("sol:menor")') || code.includes(".escala('sol:menor')");
        const hasInstrument = code.includes('.instrument("serra")') || code.includes(".instrument('serra')") || code.includes('.instrument("sawtooth")') || code.includes(".instrument('sawtooth')");
        const hasFilter = code.includes(".filtreGreus(1200)");
        
        if (!hasNotes) {
          return { success: false, message: 'La línia de notes no és correcta. Has escrit exactament: nota("sol3 sib3 re4 fa4")?' };
        }
        if (!hasScale) {
          return { success: false, message: 'Recorda configurar l\'escala: .escala("sol:menor").' };
        }
        if (!hasInstrument) {
          return { success: false, message: 'Recorda triar l\'instrument: .instrument("serra").' };
        }
        if (!hasFilter) {
          return { success: false, message: 'Falta afegir el filtre exactament com: .filtreGreus(1200).' };
        }
        
        return { success: true, message: "Perfecte!" };
      }
    }
};

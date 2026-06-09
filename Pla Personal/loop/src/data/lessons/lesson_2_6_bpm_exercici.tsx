import React from 'react';
import { Target } from 'lucide-react';
import { Lesson } from '../../types';

export const lesson_2_6_bpm_exercici: Lesson = {
    id: '2.6-bpm-exercici',
    title: '3.1 Exercici de Tempo',
    icon: Target,
    content: () => (
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-bold text-slate-800 mb-3 tracking-tight font-display">Ajusta el tempo Boom-Bap</h2>
          <p className="text-slate-600 leading-relaxed font-medium">
            Estableix el tempo clàssic del rap dels anys 90. Afegeix la instrucció de tempo <code>bpm()</code> a la primera línia i fixa la velocitat a <strong>90</strong> BPM.
          </p>
          <div className="bg-indigo-50/50 border border-indigo-100 p-5 my-6 rounded-2xl shadow-sm shadow-indigo-100/50">
            <h4 className="text-indigo-500 text-xs font-bold uppercase tracking-wider mb-2 font-display flex gap-2 items-center">📝 Requisits:</h4>
            <ul className="list-disc pl-5 text-sm text-slate-700 font-medium marker:text-indigo-300 space-y-2">
              <li>El teu codi ha de començar amb <code className="text-rose-600 bg-white px-1 py-0.5 rounded border">bpm(90)</code>.</li>
              <li>A sota, afegeix una línia de so de bateria qualsevol com <code className="text-rose-600 bg-white px-1 py-0.5 rounded border">so("bombo xarles caixa xarles")</code>.</li>
            </ul>
          </div>
        </div>
      </div>
    ),
    initialCode: '',
    exercise: {
      successMessage: "Excel·lent! El beat es reprodueix al ritme clàssic de Boom-Bap (90 BPM). Anem a crear els baixos!",
      onCheck: (code) => {
        const hasBPM = code.includes("bpm(");
        const has90 = code.includes("90");
        const hasS = code.includes("so(");
        
        if (!hasBPM) {
          return { success: false, message: 'No veig la instrucció per definir els bpm().' };
        }
        
        if (!has90) {
          return { success: false, message: 'Assegura\'t de posar exactament 90 dins els parèntesis: bpm(90)' };
        }

        if (!hasS) {
          return { success: false, message: 'Recorda afegir un patró de so() a sota perquè puguem comprovar la velocitat!' };
        }
 
        return { success: true, message: 'Perfecte!' };
      }
    }
};

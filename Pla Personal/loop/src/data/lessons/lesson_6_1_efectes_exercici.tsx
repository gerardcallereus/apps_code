import { Target } from 'lucide-react';
import React from 'react';
import { Lesson } from '../../types';

export const lesson_6_1_efectes_exercici: Lesson = {
    id: '6.1-efectes-exercici',
    title: '6.1 Exercici d\'Efectes',
    icon: Target,
    content: () => (
      <div className="space-y-4">
        <p className="text-lg text-slate-800 font-medium font-display">Dona-li cruixit de vinil a la bateria!</p>
        <p className="text-slate-600">
          En aquest exercici aplicaràs l'efecte de reducció de qualitat digital (bitcrush) a la teva bateria per aconseguir aquest caràcter brut dels mostrejadors antics (MPC).
        </p>
        <div className="bg-indigo-50/50 border border-indigo-100 p-5 my-6 rounded-2xl shadow-sm shadow-indigo-100/50">
          <h4 className="text-indigo-500 text-xs font-bold uppercase tracking-wider mb-2 font-display flex gap-2 items-center">📝 Requisits de l'exercici:</h4>
          <ul className="list-disc pl-5 text-sm text-slate-700 font-medium marker:text-indigo-300 space-y-2">
            <li>Escriu un patró de bateria utilitzant la funció: <code className="text-rose-600 bg-white px-1 py-0.5 rounded border">so("bombo xarles caixa xarles")</code>.</li>
            <li>Afegeix-li el modificador de bitcrush a la bateria exactament així: <code className="text-rose-600 bg-white px-1 py-0.5 rounded border">.8bit(6)</code> per triturar el so.</li>
          </ul>
        </div>
      </div>
    ),
    initialCode: '',
    exercise: {
      successMessage: "Boníssim! La bateria té un cruixit digital molt especial, com si sortís d'una caixa de ritmes de 12 bits dels anys 80. Anem a l'estructura final!",
      onCheck: (code) => {
        const hasS = code.includes('so("bombo xarles caixa xarles")') || code.includes("so('bombo xarles caixa xarles')");
        const hasCrush = code.includes(".8bit(6)");
        
        if (!hasS) {
          return { success: false, message: 'La línia de so de bateria no és correcta. Recorda escriure: so("bombo xarles caixa xarles")' };
        }
        if (!hasCrush) {
          return { success: false, message: 'Falta afegir el modificador .8bit(6) a la línia de la bateria.' };
        }
        
        return { success: true, message: "Perfecte!" };
      }
    }
};

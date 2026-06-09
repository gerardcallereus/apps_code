import { Target } from 'lucide-react';
import React from 'react';
import { Lesson } from '../../types';

export const lesson_7_1_combinar_exercici: Lesson = {
    id: '7.1-combinar-exercici',
    title: '7.1 Exercici d\'Estructura',
    icon: Target,
    content: () => (
      <div className="space-y-4">
        <p className="text-lg text-slate-800 font-medium font-display">Ajunta les teves pistes!</p>
        <p className="text-slate-600">
          En aquest exercici has de crear dues variables: una per la <strong>bateria</strong> i una altra pel <strong>baix</strong>, i ajuntar-les per primera vegada per formar la base de rap.
        </p>
        <div className="bg-indigo-50/50 border border-indigo-100 p-5 my-6 rounded-2xl shadow-sm shadow-indigo-100/50">
          <h4 className="text-indigo-500 text-xs font-bold uppercase tracking-wider mb-2 font-display flex gap-2 items-center">📝 Requisits de l'exercici:</h4>
          <ul className="list-disc pl-5 text-sm text-slate-700 font-medium marker:text-indigo-300 space-y-2">
            <li>Crea una variable anomenada <code className="text-rose-600 bg-white px-1 py-0.5 rounded border">bateria</code> que contingui: <code className="text-rose-600 bg-white px-1 py-0.5 rounded border">so("bombo xarles caixa xarles")</code>.</li>
            <li>Crea una variable anomenada <code className="text-rose-600 bg-white px-1 py-0.5 rounded border">baix</code> que contingui: <code className="text-rose-600 bg-white px-1 py-0.5 rounded border">nota("sol2 do3 fa2").escala("sol:menor").instrument("triangle")</code>.</li>
            <li>Uneix-les al final cridant la funció de superposició de pistes: <code className="text-rose-600 bg-white px-1 py-0.5 rounded border">capes(bateria, baix)</code>.</li>
          </ul>
        </div>
      </div>
    ),
    initialCode: '',
    exercise: {
      successMessage: "Felicitats! Has aconseguit estructurar i combinar amb èxit el teu primer beat de rap multipista. Estàs a punt per a l'Estudi de Gravació!",
      onCheck: (code) => {
        const hasDrumsVar = code.includes("bateria =") || code.includes("bateria=");
        const hasBassVar = code.includes("baix =") || code.includes("baix=");
        const hasStack = code.includes("capes(");
        const hasCombined = code.includes("bateria") && code.includes("baix") && hasStack;
        
        if (!hasDrumsVar) {
          return { success: false, message: "No s'ha definit la variable 'bateria'. Recorda utilitzar: const bateria = so(...)" };
        }
        if (!hasBassVar) {
          return { success: false, message: "No s'ha definit la variable 'baix'. Recorda utilitzar: const baix = nota(...)" };
        }
        if (!hasStack) {
          return { success: false, message: "Falta cridar la funció capes() per combinar les teves variables." };
        }
        if (!hasCombined) {
          return { success: false, message: "Recorda posar 'bateria' i 'baix' a dins dels parèntesis de capes(bateria, baix)!" };
        }
        
        return { success: true, message: "Perfecte!" };
      }
    }
};

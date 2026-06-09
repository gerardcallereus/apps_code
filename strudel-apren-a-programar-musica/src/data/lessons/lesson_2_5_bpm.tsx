import { BookOpen } from 'lucide-react';
import React from 'react';
import { CodeBox } from '../../components/CodeBox';
import { Lesson } from '../../types';

export const lesson_2_5_bpm: Lesson = {
    id: '2.5-bpm',
    title: '3. El Tempo i la Velocitat (BPM)',
    icon: BookOpen,
    content: ({ setCode }) => (
      <div className="space-y-5">
        <p>
          El <strong>tempo</strong> determina la velocitat a la qual es reprodueix el nostre beat i es mesura en <strong>BPM</strong> (Beats Per Minute / Cops Per Minut). Ajustar la velocitat és crucial per definir l'estil del beat.
        </p>

        <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm">
          <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-3 font-display flex gap-2 items-center">
            ⏱️ Com configurar el tempo a l'Aon
          </h3>
          <p className="text-sm text-slate-600 mb-4 font-medium leading-relaxed">
            Per indicar la velocitat a l'Aon, escrivim la funció <code className="bg-slate-100 text-rose-600 px-1.5 py-0.5 rounded-md font-mono text-[13px] border border-slate-200">bpm(velocitat)</code> a dalt de tot del codi:
          </p>
          <div className="grid sm:grid-cols-2 gap-4 text-sm font-mono text-slate-700 bg-slate-50 p-4 rounded-xl border border-slate-100">
            <div>
              <p className="font-bold text-slate-900 border-b border-slate-200 pb-1 mb-2 font-sans text-xs uppercase tracking-wider">Boom-Bap Clàssic</p>
              <p className="text-xs text-slate-600 mb-2 leading-relaxed">Velocitat típica: 85 - 95 BPM</p>
              <code className="text-indigo-600 bg-indigo-50/50 px-1 py-0.5 rounded">bpm(90)</code>
            </div>
            <div>
              <p className="font-bold text-slate-900 border-b border-slate-200 pb-1 mb-2 font-sans text-xs uppercase tracking-wider">Trap Modern</p>
              <p className="text-xs text-slate-600 mb-2 leading-relaxed">Velocitat típica: 130 - 150 BPM</p>
              <code className="text-indigo-600 bg-indigo-50/50 px-1 py-0.5 rounded">bpm(140)</code>
            </div>
          </div>
        </div>

        <p className="text-slate-700 font-medium leading-relaxed">
          També podem fer que un patró sencer vagi més ràpid o més lent sense tocar el BPM de la cançó. Per fer-ho, encadenem els modificadors <code className="bg-white border text-rose-500 text-sm px-1 rounded shadow-sm">.ràpid(multiplicador)</code> o <code className="bg-white border text-rose-500 text-sm px-1 rounded shadow-sm">.lent(multiplicador)</code> al final:
        </p>

        <div className="space-y-4">
          <CodeBox 
            setCode={setCode} 
            description="El clàssic Boom-Bap a 90 BPM: la velocitat daurada on l'MC se sent més còmode per rimar."
            code={'bpm(90)\n\nso("bombo xarles caixa xarles")'} 
          />
          <CodeBox 
            setCode={setCode} 
            description="Un beat a 140 BPM: és massa ràpid per a un rap tradicional, sembla techno!"
            code={'bpm(140)\n\nso("bombo xarles caixa xarles")'} 
          />
          <CodeBox 
            setCode={setCode} 
            description="Velocitat a la meitat (.lent o .ràpid menor a 1): Ideal per agafar el tempo ràpid de 140 BPM del Trap, però fer que la bateria es mogui lenta i pesada a la meitat de temps (.ràpid(0.5))."
            code={'bpm(140)\n\nso("bombo xarles caixa xarles").ràpid(0.5)'} 
          />
        </div>
      </div>
    ),
    initialCode: ''
};

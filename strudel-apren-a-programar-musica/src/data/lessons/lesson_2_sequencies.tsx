import { AudioLines } from 'lucide-react';
import React from 'react';
import { CodeBox } from '../../components/CodeBox';
import { Lesson } from '../../types';

export const lesson_2_sequencies: Lesson = {
    id: '2-sequencies',
    title: '2. Subdivisions (Hi-Hat Rolls)',
    icon: AudioLines,
    content: ({ setCode }) => (
      <div className="space-y-5">
        <p>
          En la música urbana i el rap modern (especialment el Trap), és molt comú escoltar repics de plats molt ràpids, anomenats <strong>Hi-Hat Rolls</strong> o subdivisions. En programació, podem dividir el temps de qualsevol cop per encabir-hi més d'un so utilitzant els <strong>corxets</strong> <code className="bg-slate-100 font-mono text-[13px] px-1 rounded">[ ]</code>.
        </p>

        <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm">
          <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-3 font-display flex gap-2 items-center">
            📦 Agrupar i dividir amb [ ]
          </h3>
          <p className="text-sm text-slate-600 mb-4 font-medium leading-relaxed">
            Quan tanquem diverses paraules dins d'uns corxets <code className="bg-slate-100 font-mono text-[13px] px-1 rounded">[ ]</code>, el motor de l'Aon les tractarà com si fossin una sola posició en el temps, dividint-la equitativament entre elles. 
          </p>
          <div className="grid sm:grid-cols-2 gap-4 text-sm font-mono text-slate-700 bg-slate-50 p-4 rounded-xl border border-slate-100">
            <div>
              <p className="font-bold text-slate-900 border-b border-slate-200 pb-1 mb-2 font-sans text-xs uppercase tracking-wider">Subdivisió Binària</p>
              <p className="text-xs text-slate-600 mb-2 font-sans leading-relaxed">Divideix 1 temps en 2 parts iguals:</p>
              <code className="text-indigo-600 bg-indigo-50/50 px-1 py-0.5 rounded">[xarles xarles]</code>
            </div>
            <div>
              <p className="font-bold text-slate-900 border-b border-slate-200 pb-1 mb-2 font-sans text-xs uppercase tracking-wider">Subdivisió Ternària (Triplets)</p>
              <p className="text-xs text-slate-600 mb-2 font-sans leading-relaxed">Divideix 1 temps en 3 parts iguals (triolet):</p>
              <code className="text-indigo-600 bg-indigo-50/50 px-1 py-0.5 rounded">[xarles xarles xarles]</code>
            </div>
          </div>
        </div>

        <p className="text-slate-700 font-medium leading-relaxed">
          Escolta com canvien el ritme i l'energia de la bateria quan apliquem corxets en diferents punts:
        </p>

        <div className="space-y-4">
          <CodeBox 
            setCode={setCode} 
            description="Boom-Bap amb platet doble: El segon temps de plat té un repic de dos xarles ràpids."
            code={'so("bombo [xarles xarles] caixa xarles")'} 
          />
          <CodeBox 
            setCode={setCode} 
            description="Triolet de plats (Triplets): Un efecte molt típic de Trap on els plats sonen a tres contra temps."
            code={'so("bombo [xarles xarles xarles] caixa obert")'} 
          />
          <CodeBox 
            setCode={setCode} 
            description="Repics de Trap ràpids: Un cicle lent amb una subdivisió de 4 plats seguits ([xarles xarles xarles xarles]) que simula els típics rolls."
            code={'so("bombo xarles caixa [xarles xarles xarles xarles] bombo xarles caixa ~")'} 
          />
          <CodeBox 
            setCode={setCode} 
            description="Corxets niats (complex): Pots posar corxets dins d'altres corxets per a crear estructures encara més complexes!"
            code={'so("bombo [xarles [xarles xarles]] caixa obert")'} 
          />
        </div>

        <div className="mt-8 p-5 rounded-2xl bg-emerald-50/50 border border-emerald-200 shadow-sm shadow-emerald-100/50">
          <h3 className="text-[13px] font-bold text-emerald-600 uppercase tracking-wider mb-2 font-display flex gap-2 items-center">💡 Truc de codi:</h3>
          <p className="text-sm text-slate-700 font-medium leading-relaxed">També pots utilitzar corxets en el bombo per a fer cops dobles ràpids! Per exemple: <code className="bg-white/50 px-1 rounded text-emerald-800">so("[bombo bombo] xarles caixa xarles")</code>.</p>
        </div>
      </div>
    ),
    initialCode: ''
};

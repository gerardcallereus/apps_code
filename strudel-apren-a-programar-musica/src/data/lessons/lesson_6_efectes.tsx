import { AudioLines } from 'lucide-react';
import React from 'react';
import { CodeBox } from '../../components/CodeBox';
import { Lesson } from '../../types';

export const lesson_6_efectes: Lesson = {
    id: '6-efectes',
    title: '6. El So Lo-Fi i Efectes',
    icon: AudioLines,
    content: ({ setCode }) => (
      <div className="space-y-5">
        <p>
          En la producció musical de rap, sobretot en el <strong>Lo-Fi Hip Hop</strong> o el <strong>Trap</strong>, els efectes d'àudio s'utilitzen per donar textura, sensació d'espai o un caràcter vintage i sorrenc (cruixent, com d'un vinil vell o de mostrejadors antics tipus MPC).
        </p>

        <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm">
          <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-3 font-display flex gap-2 items-center">
            🎛️ Modificadors d'Efectes a l'Aon
          </h3>
          <p className="text-sm text-slate-600 mb-4 font-medium leading-relaxed">
            Podem encadenar diversos efectes al darrere dels nostres instruments o bateries:
          </p>
          <div className="grid sm:grid-cols-3 gap-4 text-sm font-mono text-slate-700 bg-slate-50 p-4 rounded-xl border border-slate-100">
            <div>
              <p className="font-bold text-slate-900 border-b border-slate-200 pb-1 mb-2 font-sans text-xs uppercase tracking-wider">L'Eco (.eco)</p>
              <p className="text-[11px] text-slate-500 mb-2 leading-relaxed">Crea repeticions del so com una muntanya (delay). Rep valors de 0 a 1:</p>
              <code className="text-indigo-600 bg-indigo-50/50 px-1 py-0.5 rounded">.eco(0.5)</code>
            </div>
            <div>
              <p className="font-bold text-slate-900 border-b border-slate-200 pb-1 mb-2 font-sans text-xs uppercase tracking-wider">El Ressò (.ressò)</p>
              <p className="text-[11px] text-slate-500 mb-2 leading-relaxed">Simula l'espai d'una habitació gran o catedral (reverb). Rep valors de 0 a 1:</p>
              <code className="text-indigo-600 bg-indigo-50/50 px-1 py-0.5 rounded">.ressò(0.8)</code>
            </div>
            <div>
              <p className="font-bold text-slate-900 border-b border-slate-200 pb-1 mb-2 font-sans text-xs uppercase tracking-wider">Textura MPC (.8bit)</p>
              <p className="text-[11px] text-slate-500 mb-2 leading-relaxed">Redueix la definició de l'àudio fent-lo sonar digitalment brut (crush). Rep valors d'1 a 16:</p>
              <code className="text-indigo-600 bg-indigo-50/50 px-1 py-0.5 rounded">.8bit(4)</code>
            </div>
          </div>
        </div>

        <p className="text-slate-700 font-medium leading-relaxed">
          Escolta la diferència espacial i la cruesa d'aquests efectes:
        </p>

        <div className="space-y-4">
          <CodeBox 
            setCode={setCode} 
            description="Melodia amb molt d'espai: Utilitzar .ressò(0.8) i .eco(0.5) amb l'instrument sinusoide crea un so de campanes fantasmagòriques molt típic del trap modern."
            code={'bpm(90)\n\nnota("sol3 sib3 re4 fa4").escala("sol:menor")\n  .instrument("sinusoide").ressò(0.8).eco(0.5)'} 
          />
          <CodeBox 
            setCode={setCode} 
            description="Bateria amb cruixit de mostra antiga: En aplicar .8bit(4) a la bateria, simulem el so dels primers samplers dels 80 que tenien poca qualitat de bits, donant molta textura i personalitat."
            code={'bpm(90)\n\nso("bombo xarles caixa xarles").8bit(4)'} 
          />
        </div>
      </div>
    ),
    initialCode: ''
};

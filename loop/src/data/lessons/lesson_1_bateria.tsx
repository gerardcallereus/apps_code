import { Drum, Target } from 'lucide-react';
import React from 'react';
import { CodeBox } from '../../components/CodeBox';
import { Lesson } from '../../types';

export const lesson_1_bateria: Lesson = {
    id: '1-bateria',
    title: '1. La Bateria (Drums)',
    icon: Drum,
    content: ({ setCode }) => (
      <div className="space-y-5">
        <p>
          El cor de qualsevol cançó de rap és la seva <strong>bateria</strong>. Els ritmes de rap tenen la seva arrel en el Funk i el Soul, i es caracteritzen per un patró de bombo i caixa molt marcat, sovint anomenat <strong>Boom-Bap</strong> pel so característic del bombo (Boom) i la caixa (Bap).
        </p>
        
        <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm">
          <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-3 font-display flex gap-2 items-center">
            🥁 Els Sons de la Bateria a LOOP
          </h3>
          <p className="text-sm text-slate-600 mb-4 font-medium leading-relaxed">
            Per reproduir sons a LOOP, fem servir la funció <code className="bg-slate-100 text-rose-600 px-1.5 py-0.5 rounded-md font-mono text-[13px] border border-slate-200">so()</code> (de <em>so</em>). A dins de les cometes escriurem les paraules de la bateria que volem que sonin seqüencialment:
          </p>
          <div className="grid sm:grid-cols-2 gap-4 text-sm font-mono text-slate-700 bg-slate-50 p-4 rounded-xl border border-slate-100">
            <div>
              <p className="font-bold text-slate-900 border-b border-slate-200 pb-1 mb-2 font-sans text-xs uppercase tracking-wider">Peces Clau</p>
              <ul className="space-y-1.5">
                <li><strong className="text-indigo-600">bombo</strong> - El cop greu i profund (kick).</li>
                <li><strong className="text-indigo-600">caixa</strong> - El cop sec al segon i quart temps (snare).</li>
                <li><strong className="text-indigo-600">xarles</strong> - El plat tancat que manté el pols (hihat).</li>
              </ul>
            </div>
            <div>
              <p className="font-bold text-slate-900 border-b border-slate-200 pb-1 mb-2 font-sans text-xs uppercase tracking-wider">Silencis i Variacions</p>
              <ul className="space-y-1.5">
                <li><strong className="text-indigo-600">~</strong> - Un espai buit o de silenci.</li>
                <li><strong className="text-indigo-600">obert</strong> - Plat obert (open hihat).</li>
                <li><strong className="text-indigo-600">palmes</strong> - Cops de mans (clap).</li>
              </ul>
            </div>
          </div>
        </div>
        
        <p className="text-slate-700 font-medium leading-relaxed">
          A LOOP, el temps es divideix en <strong>cicles</strong> (compassos). Les síl·labes que escriguis es repartiran el temps d'un cicle de manera totalment equitativa. Prova aquests patrons clàssics de rap clicant a sobre d'ells per carregar-los a l'editor i fer-los sonar:
        </p>

        <div className="space-y-4">
          <CodeBox 
            setCode={setCode} 
            description="El patró bàsic de bateria de 4 temps: Bombo a l'inici, Caixa a la meitat, amb silencis (~) entremig."
            code={'so("bombo ~ caixa ~")'} 
          />
          <CodeBox 
            setCode={setCode} 
            description="Boom-Bap clàssic (Old School): Afegim un segon bombo ràpid a contratemps per donar més empenta ('bombo bombo caixa')."
            code={'so("bombo ~ caixa [bombo bombo] ~ caixa ~")'} 
          />
          <CodeBox 
            setCode={setCode} 
            description="Incloent el Xarles: El xarles (plat tancat) fa de fil conductor entre els bombos i les caixes."
            code={'so("bombo xarles caixa xarles bombo xarles caixa obert")'} 
          />
          <CodeBox 
            setCode={setCode} 
            description="Carregant textures clàssiques: Escriguent llibreria(antics) carreguem sons de caixes i bombos més vintage i analògics tipus vinil."
            code={'llibreria(antics)\n\nso("bombo:1 xarles caixa:2 xarles")\n  .ràpid(1.5)'} 
          />
        </div>

        <div className="mt-8 p-5 rounded-2xl bg-emerald-50/50 border border-emerald-200 shadow-sm shadow-emerald-100/50">
          <h3 className="text-[13px] font-bold text-emerald-600 uppercase tracking-wider mb-2 font-display flex gap-2 items-center">🎯 Consell pràctic:</h3>
          <p className="text-sm text-slate-700 font-medium leading-relaxed">Prova de modificar el codi afegint silencis (<code className="bg-white/50 px-1 rounded text-emerald-800">~</code>) o canviant l'ordre. Observa com com més elements posis dins de <code className="bg-white/50 px-1 rounded text-emerald-800">so("...")</code>, més de pressa s'han de reproduir per cabre en un sol cicle.</p>
        </div>
      </div>
    ),
    initialCode: ''
};

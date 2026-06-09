import { AudioLines } from 'lucide-react';
import React from 'react';
import { CodeBox } from '../../components/CodeBox';
import { Lesson } from '../../types';

export const lesson_3_baixos: Lesson = {
    id: '3-baixos',
    title: '4. El Baix Greu i 808s',
    icon: AudioLines,
    content: ({ setCode }) => (
      <div className="space-y-5">
        <p>
          Si la bateria és el cor del beat de rap, el <strong>baix</strong> n'és el cos. Un baix greu i potent (com els sub-greus 808) dona profunditat, pes i lliga el ritme amb l'harmonia de la cançó.
        </p>

        <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm">
          <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-3 font-display flex gap-2 items-center">
            🎸 Com fer notes i línies de baix
          </h3>
          <p className="text-sm text-slate-600 mb-4 font-medium leading-relaxed">
            Per afegir notes musicals, utilitzem la funció <code className="bg-slate-100 text-rose-600 px-1.5 py-0.5 rounded-md font-mono text-[13px] border border-slate-200">nota()</code>. A dins de les cometes escriurem la seqüència de notes utilitzant els noms en català. A més, hem d'indicar quin instrument volem fer servir:
          </p>
          <div className="grid sm:grid-cols-2 gap-4 text-sm font-mono text-slate-700 bg-slate-50 p-4 rounded-xl border border-slate-100">
            <div>
              <p className="font-bold text-slate-900 border-b border-slate-200 pb-1 mb-2 font-sans text-xs uppercase tracking-wider">Els Tons (Octaves)</p>
              <p className="text-xs text-slate-600 mb-2 leading-relaxed">Afegim un número després de la nota. Pel baix, fem servir números petits (2 o 3) per obtenir tons molt greus:</p>
              <code className="text-indigo-600 bg-indigo-50/50 px-1 py-0.5 rounded">"sol2 ~ re3 ~"</code>
            </div>
            <div>
              <p className="font-bold text-slate-900 border-b border-slate-200 pb-1 mb-2 font-sans text-xs uppercase tracking-wider">L'Escala i Instrument</p>
              <p className="text-xs text-slate-600 mb-2 leading-relaxed">Les escales menors (.escala("sol:menor")) són perfectes per donar un ambient fosc o seriós. El timbre 'triangle' o 'sinusoide' és el millor per als sub-greus:</p>
              <code className="text-indigo-600 bg-indigo-50/50 px-1 py-0.5 rounded">.instrument("triangle")</code>
            </div>
          </div>
        </div>

        <p className="text-slate-700 font-medium leading-relaxed">
          Escolta aquests exemples de línies de baix per a beats de rap:
        </p>

        <div className="space-y-4">
          <CodeBox 
            setCode={setCode} 
            description="Línia de baix Boom-Bap clàssica: Notes greus i marcades en escala de sol menor utilitzant el sintetitzador de triangle."
            code={'bpm(90)\n\nnota("sol2 ~ re3 ~ do3 ~ si2 do3").escala("sol:menor")\n  .instrument("triangle")'} 
          />
          <CodeBox 
            setCode={setCode} 
            description="Sub-baix estil 808 (Trap): Un so súper llis i profund obtingut mitjançant l\'ona sinusoide, ideal per a fer vibrar altaveus."
            code={'bpm(140)\n\nnota("do2 ~ do3 ~ fa2 [sol2 sol2]").escala("do:menor")\n  .instrument("sinusoide").ràpid(0.5)'} 
          />
        </div>
      </div>
    ),
    initialCode: ''
};

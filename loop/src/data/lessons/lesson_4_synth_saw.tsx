import { Wand2 } from 'lucide-react';
import React from 'react';
import { CodeBox } from '../../components/CodeBox';
import { Lesson } from '../../types';

export const lesson_4_synth_saw: Lesson = {
    id: '4-synth-saw',
    title: '5. Melodia i Textures (Melody Loops)',
    icon: Wand2,
    content: ({ setCode }) => (
      <div className="space-y-5">
        <p>
          Moltes cançons de rap es basen en un <strong>melody loop</strong> (bucle de melodia) senzill i enganxós de piano o sintetitzador que es repeteix durant tota la cançó.
        </p>

        <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm">
          <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-3 font-display flex gap-2 items-center">
            🎹 El Sintetitzador de Serra (Sawtooth) i els Filtres
          </h3>
          <p className="text-sm text-slate-600 mb-4 font-medium leading-relaxed">
            Per fer melodies de sintetitzador riques i brillants, fem servir l'instrument <code className="bg-slate-100 font-mono text-[13px] px-1.5 py-0.5 rounded-md border border-slate-200 text-rose-600">"serra"</code> (ona de serra / sawtooth). Tanmateix, una ona de serra pura pot sonar massa punxeguda o estrident pel rap. 
          </p>
          <p className="text-sm text-slate-600 mb-4 font-medium leading-relaxed">
            Per solucionar-ho, apliquem un <strong>filtre de greus</strong> utilitzant el modificador <code className="bg-slate-100 font-mono text-[13px] px-1.5 py-0.5 rounded-md border border-slate-200 text-indigo-600">.filtreGreus(freqüència)</code>. Aquest filtre talla els sons aguts per sobre del valor que li posis, enfosquint el so i donant-li aquest rotllo analògic o lofi tan buscat al rap.
          </p>
        </div>

        <p className="text-slate-700 font-medium leading-relaxed">
          Compara el so obert i estrident de la serra amb el so filtrat i atmosfèric:
        </p>

        <div className="space-y-4">
          <CodeBox 
            setCode={setCode} 
            description="Melodia de serra sense filtrar: Sona molt brillant i potser massa fort o punxegut pel rap."
            code={'bpm(90)\n\nnota("sol3 sib3 re4 fa4").escala("sol:menor")\n  .instrument("serra").ràpid(2)'} 
          />
          <CodeBox 
            setCode={setCode} 
            description="Melodia filtrada: Utilitzant .filtreGreus(1500) tallem els aguts i creem una melodia molt més suau i fosca, perfecta perquè un cantant hi posi la veu per sobre."
            code={'bpm(90)\n\nnota("sol3 sib3 re4 fa4").escala("sol:menor")\n  .instrument("serra").filtreGreus(1500).ràpid(2)'} 
          />
        </div>
      </div>
    ),
    initialCode: ''
};

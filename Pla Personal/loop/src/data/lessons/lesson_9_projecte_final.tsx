import { Trophy } from 'lucide-react';
import React from 'react';
import { Lesson } from '../../types';

export const lesson_9_projecte_final: Lesson = {
    id: '9-projecte-final',
    title: '8. L\'Estudi de Gravació (Final)',
    icon: Trophy,
    content: () => (
      <div className="space-y-4">
        <h2 className="text-2xl font-display font-bold text-slate-800 tracking-tight">🎙️ L'Estudi de Gravació de Rap</h2>
        <p className="text-lg text-slate-600 font-medium leading-relaxed">
          Has arribat al final del camí de l'aprenentatge. Ara, el micròfon i l'editor són completament teus! 🚀
        </p>
        
        <p className="text-slate-600 leading-relaxed">
          A l'editor de la dreta hem deixat una base completa de rap llista perquè la modifiquis, afegeixis els teus propis ritmes, línies de baix i melodies filtrades.
        </p>
        
        <div className="bg-blue-50 border border-blue-100 p-5 rounded-2xl shadow-sm my-6">
          <h3 className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-2 font-display flex gap-2 items-center">💾 Com exportar la teva cançó a WAV:</h3>
          <p className="text-sm text-slate-700 font-medium leading-relaxed">
            Quan tinguis el teu beat a punt i t'agradi com sona:
          </p>
          <ol className="list-decimal pl-5 text-sm text-slate-700 font-medium marker:text-blue-300 space-y-2 mt-2">
            <li>Fes clic al botó blau de <strong>Exporta WAV</strong> situat a la barra superior de l'editor.</li>
            <li>El sistema sintetitzarà en silenci els primers 8 compassos (cicles) de la teva base amb qualitat digital professional.</li>
            <li>En acabar de processar, es descarregarà automàticament un arxiu <strong>.wav</strong> directament al teu ordinador.</li>
          </ol>
        </div>

        <p className="text-slate-600 leading-relaxed">
          Ja pots fer servir aquest arxiu per gravar-hi a sobre cantant les teves pròpies lletres, compartir-lo amb els teus amics o importar-lo a qualsevol editor de so!
        </p>
      </div>
    ),
    initialCode: `bpm(90)
// LA TEVA BASE DE RAP FINAL
// Modifica-la com vulguis i prem "Exporta WAV" quan estiguis llest!

const bateria = so("bombo xarles caixa [bombo xarles] bombo xarles caixa obert").ràpid(2)
const baix = nota("sol2 ~ re3 ~ do3 ~ si2 do3").escala("sol:menor").instrument("triangle")
const melodia = nota("sol3 sib3 re4 fa4").escala("sol:menor").instrument("serra").filtreGreus(1500).ràpid(2)

capes(
  bateria,
  baix,
  melodia
)`
};

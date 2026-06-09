import { Sparkles } from 'lucide-react';
import React from 'react';
import { Lesson } from '../../types';

export const lesson_0_intro: Lesson = {
    id: '0-intro',
    title: '0. Benvinguda',
    icon: Sparkles,
    isReadOnly: true,
    content: () => (
      <div className="space-y-4">
        <h2 className="text-3xl font-display font-bold text-slate-800 tracking-tight">Benvingut/da a l'Estudi de Rap de l'Aon</h2>
        <p className="text-lg text-slate-600 font-medium leading-relaxed">
          L'Aon és una eina dissenyada per ajudar-te a crear les teves pròpies <strong>bases de rap i hip-hop</strong> escrivint codi (el que anomenem <em>Live Coding</em>).
        </p>
        <p className="text-slate-600 leading-relaxed">
          En aquest taller aprendràs pas a pas com programar ritmes de bateria tipus Boom-Bap, afegir línies de baix molt greus (estil 808), crear melodies fosques o lofi, i estructurar la teva base completa. Al final del camí, podràs <strong>gravar i descarregar (exportar) el teu beat en format WAV</strong> per poder cantar-hi a sobre!
        </p>
        <div className="mt-8 p-6 rounded-2xl bg-gradient-to-br from-indigo-50 to-blue-50 border border-indigo-100/50 shadow-sm shadow-indigo-100/30">
          <h3 className="text-xs font-bold text-indigo-500 uppercase tracking-wider mb-2 font-display flex gap-2 items-center">🎧 Escolta el potencial de l'Aon:</h3>
          <p className="text-sm text-slate-700 font-medium">Fes clic al botó verd de <strong>Reprodueix</strong> a la barra superior de l'editor de la dreta i observa els visualitzadors de ritme.</p>
        </div>
      </div>
    ),
    initialCode: `bpm(90)
// UN BEAT DE RAP COMPLET (Com a mostra de benvinguda)

capes(
  // 1. Ritme de bateria Boom-Bap (Bombo, Caixa i Xarles)
  so("bombo ~ xarles caixa:1 ~ bombo bombo caixa").ràpid(2),
  
  // 2. Plats ràpids per donar dinamisme
  so("xarles!16").ràpid(2).volum(0.5),
  
  // 3. Una línia de baix greu en escala menor
  nota("sol2 ~ re3 ~ do3 ~ si2 do3").escala("sol:menor")
    .instrument("triangle").volum(0.8),
    
  // 4. Una melodia de teclat càlida i fosca
  nota("0 [3 2] 5 [~ 7]").add(12)
    .escala("sol:menor")
    .instrument("sawtooth")
    .filtreGreus(1500)
    .eco(0.5)
    .volum(0.4)
)`
};

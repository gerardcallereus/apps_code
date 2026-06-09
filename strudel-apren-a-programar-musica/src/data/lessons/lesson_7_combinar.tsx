import { ListMusic } from 'lucide-react';
import React from 'react';
import { CodeBox } from '../../components/CodeBox';
import { Lesson } from '../../types';

export const lesson_7_combinar: Lesson = {
    id: '7-combinar-sons',
    title: '7. Estructura de Rap (Variables i Capes)',
    icon: ListMusic,
    content: ({ setCode }) => (
      <div className="space-y-5">
        <p>
          Per crear una cançó o una base de rap sencera, no podem posar tots els sons en una sola línia. Hem de fer sonar la bateria, el baix i la melodia a la vegada, com si fossin diferents pistes o pistes en un estudi.
        </p>

        <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm">
          <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-3 font-display flex gap-2 items-center">
            📦 Organització: Variables i "capes"
          </h3>
          <p className="text-sm text-slate-600 mb-4 font-medium leading-relaxed">
            Per tenir un codi ordenat i fàcil de llegir, assignem cada patró musical a una <strong>variable</strong> amb la paraula clau <code className="bg-slate-100 font-mono text-[13px] px-1 rounded text-indigo-600">const nomVariable = ...</code>. Més avall, les ajuntem totes en la funció englobadora multipista <code className="bg-slate-100 font-mono text-[13px] px-1 rounded text-rose-600">capes(...)</code>:
          </p>
          <img src="https://strudel.cc/img/workflow.png" alt="Capes Aon" className="w-full max-w-xs mx-auto mix-blend-multiply rounded-lg mb-4" />
        </div>

        <p className="text-slate-700 font-medium leading-relaxed">
          Mira com s'estructura aquest beat de Boom-Bap complet en tres pistes independents i ordenades:
        </p>

        <div className="space-y-4">
          <CodeBox 
            setCode={setCode} 
            description="Base de Rap Completa: Hem separat la bateria (ritme), el baix (groove) i el teclat (melodia). Al final, les combinem totes tres amb la funció capes()."
            code={'bpm(90)\n\nconst bateria = so("bombo xarles caixa [bombo xarles] bombo xarles caixa obert").ràpid(2)\nconst baix = nota("sol2 ~ re3 ~ do3 ~ si2 do3").escala("sol:menor").instrument("triangle")\nconst melodia = nota("sol3 sib3 re4 fa4").escala("sol:menor").instrument("serra").filtreGreus(1500).ràpid(2)\n\ncapes(\n  bateria,\n  baix,\n  melodia\n)'} 
          />
        </div>
      </div>
    ),
    initialCode: ''
};

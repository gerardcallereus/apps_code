import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Search, BookMarked, Tag } from 'lucide-react';

interface GlossaryTerm {
  term: string;
  definition: string;
  category: 'TCM' | 'Estats' | 'Propietats' | 'Densitat';
}

const terms: GlossaryTerm[] = [
  {
    term: "Teoria Cinético-Molecular (TCM)",
    definition: "Teoria que explica que la matèria està formada per partícules en moviment constant que s'atreuen entre elles.",
    category: 'TCM'
  },
  {
    term: "Partícula",
    definition: "Component més petit de la matèria (com àtoms o molècules) que manté les seves propietats.",
    category: 'TCM'
  },
  {
    term: "Energia Cinètica",
    definition: "Energia associada al moviment. A més temperatura, les partícules tenen més energia cinètica i es mouen més ràpid.",
    category: 'TCM'
  },
  {
    term: "Cohesió",
    definition: "Força d'atracció que manté les partícules unides entre si. És molt forta en sòlids i gairebé nul·la en gasos.",
    category: 'TCM'
  },
  {
    term: "Sòlid",
    definition: "Estat de la matèria on les partícules estan molt juntes i en posicions fixes, amb una cohesió molt alta.",
    category: 'Estats'
  },
  {
    term: "Líquid",
    definition: "Estat on les partícules estan a prop però poden lliscar unes sobre altres, tenint volum fix però forma variable.",
    category: 'Estats'
  },
  {
    term: "Gas",
    definition: "Estat on les partícules estan molt allunyades i es mouen lliurement a gran velocitat ocupant tot el recipient.",
    category: 'Estats'
  },
  {
    term: "Fusió",
    definition: "Canvi d'estat de sòlid a líquid mitjançant l'augment de temperatura.",
    category: 'Estats'
  },
  {
    term: "Solidificació",
    definition: "Canvi d'estat de líquid a sòlid per pèrdua d'energia (refredament).",
    category: 'Estats'
  },
  {
    term: "Vaporització",
    definition: "Canvi d'estat de líquid a gas. Pot ser evaporació (només a la superfície) o ebullició (a tota la massa).",
    category: 'Estats'
  },
  {
    term: "Condensació",
    definition: "Canvi d'estat de gas a líquid per refredament.",
    category: 'Estats'
  },
  {
    term: "Sublimació",
    definition: "Pas directe de sòlid a gas sense passar per l'estat líquid.",
    category: 'Estats'
  },
  {
    term: "Planell de temperatura",
    definition: "Període durant un canvi d'estat on la temperatura es manté constant tot i seguir escalfant o refredant.",
    category: 'Estats'
  },
  {
    term: "Massa",
    definition: "Propietat general que indica la quantitat de matèria que té un cos. Es mesura en kilograms (kg) o grams (g).",
    category: 'Propietats'
  },
  {
    term: "Volum",
    definition: "Propietat general que indica l'espai que ocupa la matèria. Es mesura en litres (L) o metres cúbics (m³).",
    category: 'Propietats'
  },
  {
    term: "Propietat General",
    definition: "Propietat comuna a tota la matèria que no permet identificar de quina substància es tracta (ex: massa, volum).",
    category: 'Propietats'
  },
  {
    term: "Propietat Específica",
    definition: "Propietat que té un valor característic per a cada substància i permet identificar-la (ex: densitat).",
    category: 'Propietats'
  },
  {
    term: "Densitat",
    definition: "Relació entre la massa d'un cos i el volum que ocupa (d = m / V). Característica de cada substància.",
    category: 'Densitat'
  },
  {
    term: "Flotabilitat",
    definition: "Capacitat d'un cos de mantenir-se a la superfície d'un líquid. Depèn de si la seva densitat és menor que la del líquid.",
    category: 'Densitat'
  },
  {
    term: "Buit",
    definition: "Absència total de matèria. Segons la TCM, l'espai entre les partícules d'un gas és buit.",
    category: 'TCM'
  }
];

const Glossary: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredTerms = terms.filter(t => 
    t.term.toLowerCase().includes(searchTerm.toLowerCase()) || 
    t.definition.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-slate-400" />
        </div>
        <input
          type="text"
          placeholder="Busca un concepte (ej: cohesió, densitat...)"
          className="block w-full pl-11 pr-4 py-4 bg-white border border-slate-200 rounded-2xl shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all font-medium text-slate-700"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredTerms.map((t, i) => (
          <motion.div
            key={t.term}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow group"
          >
            <div className="flex items-start justify-between mb-3">
               <h3 className="text-lg font-black text-slate-800 tracking-tight italic uppercase group-hover:text-indigo-600 transition-colors">
                 {t.term}
               </h3>
               <span className="text-[10px] font-black uppercase px-2 py-1 rounded bg-slate-50 text-slate-400 border border-slate-100 flex items-center gap-1">
                 <Tag className="w-3 h-3" /> {t.category}
               </span>
            </div>
            <p className="text-sm text-slate-600 leading-relaxed font-medium">
              {t.definition}
            </p>
          </motion.div>
        ))}
      </div>

      {filteredTerms.length === 0 && (
        <div className="text-center py-20 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200 text-slate-400">
           <BookMarked className="w-12 h-12 mx-auto mb-4 opacity-20" />
           <p className="font-bold">No hem trobat cap concepte amb aquest nom.</p>
        </div>
      )}
    </div>
  );
};

export default Glossary;

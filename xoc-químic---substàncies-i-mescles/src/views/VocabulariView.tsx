import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Book } from 'lucide-react';
import { GlossariItem } from '../types';

const GLOSSARI: GlossariItem[] = [
  { term: 'Atom', definition: 'La partícula més petita d\'un element que conserva les seves propietats químiques.' },
  { term: 'Centrifugació', definition: 'Tècnica de separació de mescles heterogènies fluides on, mitjançant rotació a gran velocitat, la força centrífuga empeny cap al fons les partícules més denses.' },
  { term: 'Col·loide', definition: 'Tipus de mescla on les partícules dispersades són més grans que en una dissolució però prou petites per no precipitar. Causa l\'efecte Tyndall.' },
  { term: 'Compost', definition: 'Substància formada per diferents elements units químicament en proporcions fixes.' },
  { term: 'Decantació', definition: 'Tècnica de separació de mescles heterogènies, generalment per separar líquids de diferent densitat o sòlids insolubles d\'un líquid, deixant reposar perquè el canvi de fase sigui complert o el sòlid s\'assegui en el fons.' },
  { term: 'Densitat', definition: 'Magnitud que relaciona la massa d\'una substància respecte del seu volum. Els materials amb major densitat s\'assentaran sempre per sota dels menys densos (si són immiscibles).' },
  { term: 'Destil·lació', definition: 'Procediment basat en els diferents punts d\'ebullició per separar líquids miscibles. Es fa bullir la mescla, i el gas format es refreda (condensa) per recollir-lo en un altre recipient purificat.' },
  { term: 'Dissolució', definition: 'Un altre nom per a una mescla homogènia a nivell molecular o iònic.' },
  { term: 'Efecte Tyndall', definition: 'Fenomen òptic on la llum es dispersa en passar a través d\'un col·loide o d\'una suspensió molt fina.' },
  { term: 'Element', definition: 'Substància formada completament per un sol tipus d\'àtom.' },
  { term: 'Emulsió', definition: 'Mescla heterogènia formada per dos líquids immiscibles on un es dispersa en l\'altre formant petites gotes (com la llet o la maionesa).' },
  { term: 'Evaporació', definition: 'Canvi de fase de líquid a gas a l\'escalfar. S\'aprofita com a tècnica de separació per recuperar un sòlid (com la sal) dissolt completament en un medi líquid.' },
  { term: 'Fase', definition: 'Part homogènia i distingible d\'un sistema. Ex: Aigua i oli formen un sistema de dues fases.' },
  { term: 'Filtració', definition: 'Tècnica utilitzada per separar i recuperar les partícules sòlides no dissoltes presents en un medi líquid o gasós passant la mescla de forma forçada per un filtre o medi porós.' },
  { term: 'Immiscible', definition: 'Propietat de dos o més líquids que no es poden barrejar de forma homogènia (com l\'aigua i l\'oli).' },
  { term: 'Magnetisme', definition: 'Propietat d\'alguns materials (com ferro) per ser atrets per imants. S\'usa com a mètode de separació de sòlids barrejats amb aquest camp.' },
  { term: 'Matèria', definition: 'Tot allò que té massa i ocupa un volum en l\'espai.' },
  { term: 'Mescla Heterogènia', definition: 'Mescla en la qual els seus components no estan distribuïts de forma uniforme i es poden distingir les diferents fases.' },
  { term: 'Mescla Homogènia', definition: 'Mescla on no podem distingir els components i té una composició uniforme arreu.' },
  { term: 'Miscible', definition: 'Propietat de dos líquids que es poden barrejar completament en qualsevol proporció formant una mescla homogènia (com l\'aigua i l\'alcohol).' },
  { term: 'Solubilitat', definition: 'Capacitat d\'una substància (solut) per dissoldre\'s en una altra (dissolvent).' },
  { term: 'Suspensió', definition: 'Mescla heterogènia formada per petites partícules sòlides insolubles que es dispersen en un líquid. Amb el temps, si es deixa reposar, les partícules poden caure al fons.' },
  { term: 'Tamisatge (Garbellat)', definition: 'Procés físic o tècnica de separació utilitzada per a separar manualment partícules sòlides de diferents diàmetres o mides. Es fa passar la barreja per un tamís on queden les de major mida.' }
];

export default function VocabulariView() {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredItems = GLOSSARI.filter(item => 
    item.term.toLowerCase().includes(searchTerm.toLowerCase()) || 
    item.definition.toLowerCase().includes(searchTerm.toLowerCase())
  ).sort((a, b) => a.term.localeCompare(b.term));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-4xl mx-auto space-y-8"
    >
      <div className="text-center space-y-4 max-w-2xl mx-auto mb-10">
        <div className="w-16 h-16 bg-indigo-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Book className="w-8 h-8 text-indigo-600" />
        </div>
        <h2 className="text-3xl font-extrabold text-slate-800">Glossari Científic</h2>
        <p className="text-slate-600">
          Cerca els termes i conceptes principals que apareixen al llarg de la unitat per entendre millor la química de les mescles.
        </p>
      </div>

      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
        <input 
          type="text" 
          placeholder="Cerca termes o conceptes (ex: col·loide, fase...)"
          className="w-full bg-white border-2 border-slate-200 rounded-2xl py-4 pl-12 pr-4 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all text-slate-800"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <AnimatePresence>
          {filteredItems.map(item => (
            <motion.div
              key={item.term}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.2 }}
              className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow"
            >
              <h3 className="text-xl font-bold text-indigo-700 mb-2">{item.term}</h3>
              <p className="text-slate-600 leading-relaxed">{item.definition}</p>
            </motion.div>
          ))}
          {filteredItems.length === 0 && (
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              className="col-span-2 text-center py-12 text-slate-500"
            >
              No s'han trobat resultats per '{searchTerm}'.
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

import React from 'react';
import { motion } from 'motion/react';
import { Lightbulb, Ship, Cloud, Info, Zap } from 'lucide-react';

const cases = [
  {
    title: "Per què suren els vaixells de ferro?",
    desc: "Encara que el ferro és més dens que l'aigua, els vaixells tenen molt espai buit (aire) a l'interior. Això fa que el seu volum total sigui tan gran que la densitat mitjana del vaixell és menor que la de l'aigua.",
    icon: Ship,
    color: "bg-blue-500",
    tags: ["Densitat", "Volum"]
  },
  {
    title: "Per què els globus d'heli pugen?",
    desc: "L'heli és un gas menys dens que l'aire que ens envolta. Per això, l'aire l'empeny cap amunt, igual que l'aigua empeny una pilota de platja cap a la superfície.",
    icon: Cloud,
    color: "bg-indigo-500",
    tags: ["Densitat", "Gasos"]
  },
  {
    title: "Com funciona un termòmetre?",
    desc: "Quan el líquid del termòmetre s'escalfa, les seves partícules es mouen més i se separen (dilatació). Això fa que el volum del líquid augmenti i pugi pel tub.",
    icon: Zap,
    color: "bg-red-500",
    tags: ["Temperatura", "Volum"]
  },
  {
    title: "El canvi d'estat a la cuina",
    desc: "Quan bullim aigua per fer pasta, veiem que la temperatura es queda fixada a 100°C fins que tota l'aigua s'ha convertit en vapor. Tota l'energia del foc s'usa per trencar la cohesió!",
    icon: Lightbulb,
    color: "bg-amber-500",
    tags: ["Canvis d'estat", "Cohesió"]
  }
];

const RealWorldSection: React.FC = () => {
  return (
    <div className="space-y-6 mt-12">
      <div className="flex items-center gap-3 mb-8">
        <div className="bg-amber-100 p-3 rounded-2xl">
          <Info className="w-6 h-6 text-amber-600" />
        </div>
        <div>
          <h3 className="text-2xl font-black text-slate-800 italic uppercase">Casos del món real</h3>
          <p className="text-slate-500 text-sm">La química està a tot arreu, entén per què passen les coses!</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {cases.map((c, i) => (
          <motion.div
            key={i}
            whileHover={{ y: -5 }}
            className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 flex gap-5"
          >
            <div className={`w-14 h-14 ${c.color} rounded-2xl flex-shrink-0 flex items-center justify-center text-white shadow-lg`}>
              <c.icon className="w-7 h-7" />
            </div>
            <div className="space-y-2">
              <div className="flex gap-2">
                {c.tags.map(tag => (
                  <span key={tag} className="text-[9px] font-black uppercase text-slate-400 tracking-widest bg-slate-50 px-2 py-0.5 rounded border border-slate-100">
                    {tag}
                  </span>
                ))}
              </div>
              <h4 className="font-bold text-slate-800 text-lg leading-tight">{c.title}</h4>
              <p className="text-slate-600 text-xs leading-relaxed">
                {c.desc}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="bg-slate-900 rounded-3xl p-8 text-white relative overflow-hidden mt-8">
         <div className="relative z-10 flex flex-col md:flex-row gap-8 items-center">
            <div className="md:w-1/2 space-y-4">
               <h4 className="text-2xl font-black italic uppercase text-indigo-300">Resum important</h4>
               <p className="text-sm opacity-80 leading-relaxed">
                  Recorda que les <strong>propietats generals</strong> (massa, volum) depenen de la mida o quantitat d'objecte, però les <strong>específiques</strong> (densitat, duresa) depenen del material.
               </p>
               <div className="p-4 bg-white/10 rounded-2xl border border-white/10">
                  <p className="text-xs italic">"Un quilo de ferro i un quilo de suro tenen la mateixa MASSA, però el suro ocupa molt més VOLUM perquè és menys DENS."</p>
               </div>
            </div>
            <div className="md:w-1/2 grid grid-cols-2 gap-3">
               {[
                 { label: 'Densitat', val: 'm / V' },
                 { label: 'Duresa', val: 'Resistència' },
                 { label: 'Fusió', val: 'Tª canvi S→L' },
                 { label: 'Solubilitat', val: 'Es dissol?' }
               ].map(stat => (
                 <div key={stat.label} className="bg-white/5 p-4 rounded-xl text-center border border-white/5">
                    <p className="text-[10px] font-black uppercase opacity-40 mb-1">{stat.label}</p>
                    <p className="font-mono font-bold text-indigo-200">{stat.val}</p>
                 </div>
               ))}
            </div>
         </div>
      </div>
    </div>
  );
};

export default RealWorldSection;

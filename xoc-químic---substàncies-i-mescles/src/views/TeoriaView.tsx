import { motion } from 'motion/react';
import { Atom, Layers, Combine, Droplets, FlaskConical, Beaker, Zap } from 'lucide-react';

interface NodeProps {
  title: string;
  description: string;
  examples?: string;
  icon: any;
  color: string;
  delay?: number;
}

const TreeNode = ({ title, description, examples, icon: Icon, color, delay = 0 }: NodeProps) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ delay, duration: 0.5 }}
    className="flex flex-col items-center w-full"
  >
    <div className={`group relative bg-white p-5 rounded-2xl shadow-sm border-2 ${color} transition-all hover:shadow-md hover:-translate-y-1 w-full max-w-sm`}>
      <div className="flex items-center gap-4 mb-3">
        <div className={`p-2 rounded-lg opacity-80 group-hover:opacity-100 transition-opacity`}>
          <Icon className="w-6 h-6" />
        </div>
        <h3 className="text-lg font-bold text-slate-800">{title}</h3>
      </div>
      <p className="text-sm text-slate-600 leading-relaxed mb-3">{description}</p>
      {examples && (
        <div className="text-xs bg-slate-50 p-2 rounded-md border border-slate-100 text-slate-700 italic">
          <span className="font-semibold not-italic">Exemples: </span>{examples}
        </div>
      )}
    </div>
  </motion.div>
);

export default function TeoriaView() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-6xl mx-auto py-6"
    >
      <div className="text-center mb-12">
        <h2 className="text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">Esquema de la Matèria</h2>
        <p className="text-slate-600 text-lg max-w-2xl mx-auto">
          Tota la matèria de l'Univers es classifica segons la seva composició en aquestes categories principals.
        </p>
      </div>

      <div className="relative space-y-12">
        {/* NIVELL 1 - ARREL */}
        <div className="flex justify-center flex-col items-center relative">
          <TreeNode 
            title="Matèria"
            description="Tot el que té massa i ocupa un volum a l'espai. Es presenta en diversos estats i composicions."
            icon={Beaker}
            color="border-indigo-500 bg-indigo-50/30"
          />
          {/* Línies connectors */}
          <div className="h-12 w-0.5 bg-slate-300 mt-0" />
          <div className="w-[80%] h-0.5 bg-slate-300 relative">
             <div className="absolute left-0 h-8 w-0.5 bg-slate-300 bottom-[-32px]" />
             <div className="absolute right-0 h-8 w-0.5 bg-slate-300 bottom-[-32px]" />
          </div>
        </div>

        {/* NIVELL 2 - SUBSTÀNCIES VS MESCLES */}
        <div className="grid md:grid-cols-2 gap-12 pt-8">
          {/* COLUMNA 1: SUBSTÀNCIES PURES */}
          <div className="space-y-8 flex flex-col items-center">
            <TreeNode 
              title="Substàncies Pures"
              description="Formades per un sol tipus de matèria amb propietats físiques i químiques constants. No es poden separar per mètodes físics."
              icon={Zap}
              color="border-emerald-500 bg-emerald-50/30"
              delay={0.2}
            />
            {/* Línia connectora interna */}
            <div className="h-8 w-0.5 bg-slate-200" />
            <div className="grid grid-cols-2 gap-4 w-full px-4">
              <TreeNode 
                title="Elements"
                description="Substàncies que no es poden descompondre més. Formades per àtoms idèntics (tots tenen el mateix nombre de protons)."
                examples="Oxigen (O₂), Hidrogen (H₂), Or (Au), Ferro (Fe), Grafit (C)."
                icon={Atom}
                color="border-emerald-300 text-sm"
                delay={0.4}
              />
              <TreeNode 
                title="Compostos"
                description="Substàncies formades per àtoms de diferents elements combinats en una proporció fixa i definida químicament."
                examples="Aigua (H₂O), Sal (NaCl), Diòxid de carboni (CO₂), Sucre (C₁₂H₂₂O₁₁)."
                icon={FlaskConical}
                color="border-emerald-300 text-sm"
                delay={0.5}
              />
            </div>
          </div>

          {/* COLUMNA 2: MESCLES */}
          <div className="space-y-8 flex flex-col items-center">
            <TreeNode 
              title="Mescles"
              description="Combinació física de dues o més substàncies pures que mantenen les seves propietats individuals. Es poden separar per mètodes físics."
              icon={Layers}
              color="border-blue-500 bg-blue-50/30"
              delay={0.3}
            />
            {/* Línia connectora interna */}
            <div className="h-8 w-0.5 bg-slate-200" />
            
            {/* Expanded to full width for 3 elements layout (spans across boundaries using absolute positioning if needed, or simply let it wrap if needed, but flex row is better) */}
            <div className="flex flex-col xl:flex-row gap-4 w-full px-2 justify-center items-stretch">
              <div className="flex-1">
                <TreeNode 
                  title="Homogènies"
                  description="Components distribuïts uniformement. No es distingeixen les fases ni al microscopi òptic. També anomenades Dissolucions."
                  examples="Aire, Aigua del mar (filtrada), Sucre dissolt en aigua."
                  icon={Combine}
                  color="border-blue-300 text-sm h-full"
                  delay={0.6}
                />
              </div>
              <div className="flex-1">
                <TreeNode 
                  title="Col·loides"
                  description="A la frontera: semblen homogènies a simple vista però tenen micro-partícules disperses (Efecte Tyndall)."
                  examples="Llet, Boira, Sang, Gelatina."
                  icon={Droplets}
                  color="border-purple-300 bg-purple-50/10 text-sm h-full"
                  delay={0.7}
                />
              </div>
              <div className="flex-1">
                <TreeNode 
                  title="Heterogènies"
                  description="Components no distribuïts uniformement. Es distingeixen les fases a simple vista o amb instruments òptics."
                  examples="Granit, Amanida, Aigua amb oli, Sorra."
                  icon={Layers}
                  color="border-amber-400 bg-amber-50/10 text-sm h-full"
                  delay={0.8}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Nota final interactiva */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="mt-16 bg-slate-800 text-white p-8 rounded-3xl shadow-xl flex flex-col md:flex-row items-center gap-8 border border-white/10"
      >
        <div className="bg-indigo-500 p-4 rounded-full">
           <Zap className="w-8 h-8" />
        </div>
        <div>
          <h4 className="text-xl font-bold mb-2">Recorda: Propietats Específiques</h4>
              <p className="text-slate-300 text-sm leading-relaxed">
                Les <strong className="text-white">Substàncies Pures</strong> tenen densitat, temperatura de fusió i d'ebullició <strong className="text-white">fixes</strong>. 
                En canvi, les <strong className="text-white">Mescles</strong> varien aquestes propietats segons la quantitat de cada component que hi hagi 
                (per això l'aigua salada bull a més de 100°C!).
              </p>
        </div>
      </motion.div>
    </motion.div>
  );
}

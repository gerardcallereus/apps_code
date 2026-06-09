import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Droplets, Anchor, Info, ArrowDown, ArrowUp } from 'lucide-react';

interface Liquid {
  id: string;
  name: string;
  density: number; // g/cm3
  color: string;
}

interface ObjectItem {
  id: string;
  name: string;
  density: number; // g/cm3
  icon: string;
}

const liquids: Liquid[] = [
  { id: 'water', name: 'Aigua', density: 1.0, color: 'bg-blue-400/60' },
  { id: 'oil', name: 'Oli', density: 0.92, color: 'bg-yellow-400/60' },
  { id: 'mercury', name: 'Mercuri', density: 13.6, color: 'bg-slate-400/80' },
  { id: 'honey', name: 'Mel', density: 1.4, color: 'bg-amber-600/60' },
];

const objects: ObjectItem[] = [
  { id: 'wood', name: 'Fusta', density: 0.6, icon: '🪵' },
  { id: 'iron', name: 'Ferro', density: 7.8, icon: '⚙️' },
  { id: 'gold', name: 'Or', density: 19.3, icon: '🏆' },
  { id: 'cork', name: 'Suro', density: 0.25, icon: '🍾' },
];

const BuoyancySim: React.FC = () => {
  const [selectedLiquid, setSelectedLiquid] = useState<Liquid>(liquids[0]);
  const [selectedObject, setSelectedObject] = useState<ObjectItem>(objects[0]);
  const [isDropped, setIsDropped] = useState(false);

  // Position calculation
  // If object density < liquid density: it floats. 
  // Percentage submerged = object density / liquid density
  // Max submerged is 100% (sinks)
  const submergedRatio = Math.min(selectedObject.density / selectedLiquid.density, 1.2);
  const isSinking = selectedObject.density > selectedLiquid.density;

  useEffect(() => {
    setIsDropped(false);
  }, [selectedLiquid, selectedObject]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-1 space-y-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
            <Droplets className="w-5 h-5 text-blue-500" /> Líquid de la tanc
          </h3>
          <div className="grid grid-cols-2 gap-2">
            {liquids.map(l => (
              <button
                key={l.id}
                onClick={() => setSelectedLiquid(l)}
                className={`p-3 rounded-xl border-2 text-sm font-bold transition-all ${
                  selectedLiquid.id === l.id ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-slate-100 bg-slate-50 text-slate-500 hover:bg-white'
                }`}
              >
                {l.name}
                <span className="block text-[10px] opacity-60 font-mono">{l.density} g/cm³</span>
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
            <Anchor className="w-5 h-5 text-slate-500" /> Objecte a provar
          </h3>
          <div className="grid grid-cols-3 gap-2">
            {objects.map(o => (
              <button
                key={o.id}
                onClick={() => setSelectedObject(o)}
                className={`p-2 rounded-xl border-2 text-center transition-all ${
                  selectedObject.id === o.id ? 'border-indigo-500 bg-indigo-50' : 'border-slate-100 bg-slate-50 hover:bg-white'
                }`}
              >
                <span className="text-2xl">{o.icon}</span>
                <span className="block text-[10px] font-bold text-slate-600 mt-1">{o.name}</span>
                <span className="block text-[8px] opacity-60 font-mono">{o.density} g/cm³</span>
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={() => setIsDropped(!isDropped)}
          className={`w-full py-4 rounded-2xl font-black uppercase tracking-widest text-sm transition-all ${
            isDropped ? 'bg-red-500 text-white hover:bg-red-600' : 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-lg shadow-emerald-100'
          }`}
        >
          {isDropped ? 'Reiniciar' : 'Llançar l\'objecte'}
        </button>
      </div>

      <div className="lg:col-span-2 relative h-[500px] bg-slate-100 rounded-3xl border-4 border-white shadow-inner overflow-hidden">
        {/* Tank Container */}
        <div className="absolute inset-0">
          {/* Back Liquid Layer */}
          <div 
            className={`absolute bottom-0 left-0 right-0 h-[70%] ${selectedLiquid.color} transition-colors duration-500`}
          >
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-white/40 shadow-[0_0_10px_rgba(255,255,255,0.5)]"></div>
          </div>

          {/* Object Animation */}
          <motion.div
             animate={{ 
               y: isDropped 
                ? (isSinking ? 380 : (150 + (Math.min(selectedObject.density / selectedLiquid.density, 1) * 80) - 40)) 
                : 50,
               rotate: isDropped ? (isSinking ? 0 : [5, -5, 5]) : 0
             }}
             transition={{ 
               y: { type: 'spring', stiffness: 40, damping: isSinking ? 15 : 12 },
               rotate: isDropped && !isSinking 
                ? { repeat: Infinity, duration: 4, ease: "easeInOut" }
                : { type: 'spring' }
             }}
             className="absolute left-1/2 -translate-x-1/2 z-10"
          >
            <motion.div
              animate={isDropped && !isSinking ? {
                y: [0, -4, 0]
              } : {}}
              transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
              className="text-8xl filter drop-shadow-2xl select-none"
            >
               {selectedObject.icon}
            </motion.div>
          </motion.div>

          {/* Front Liquid Layer (for submerged look) */}
          <div 
            className={`absolute bottom-0 left-0 right-0 h-[70%] ${selectedLiquid.color} mix-blend-multiply opacity-30 pointer-events-none transition-colors duration-500 z-20`}
          >
             {!isDropped && (
               <div className="absolute inset-0 flex items-center justify-center">
                 <p className="text-white font-bold opacity-40 uppercase tracking-widest text-xs">A punt per la prova</p>
               </div>
             )}
          </div>
          
          {/* Surface Ripples */}
          {isDropped && !isSinking && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0] }}
              transition={{ repeat: Infinity, duration: 3 }}
              className="absolute left-1/2 -translate-x-1/2 top-[150px] w-32 h-4 bg-white/20 rounded-[100%] blur-sm pointer-events-none"
            />
          )}
        </div>

        {/* Labels & Data */}
        <div className="absolute top-6 left-6 right-6 flex justify-between items-start pointer-events-none">
           <div className="bg-white/80 backdrop-blur-md p-4 rounded-2xl border border-white shadow-sm max-w-[200px]">
              <h4 className="text-[10px] font-black text-slate-400 uppercase mb-2 tracking-widest">Densitat Relativa</h4>
              <p className="text-xl font-mono font-bold text-slate-800">
                {(selectedObject.density / selectedLiquid.density).toFixed(2)}
              </p>
              <p className="text-[10px] text-slate-500 mt-1 italic">
                {isSinking ? 'L\'objecte és més dens que el líquid.' : 'El líquid és més dens que l\'objecte.'}
              </p>
           </div>

           {isDropped && (
             <motion.div 
               initial={{ opacity: 0, x: 20 }}
               animate={{ opacity: 1, x: 0 }}
               className={`p-4 rounded-2xl border flex items-center gap-3 shadow-lg ${isSinking ? 'bg-red-500 border-red-400 text-white' : 'bg-emerald-500 border-emerald-400 text-white'}`}
             >
                {isSinking ? <ArrowDown className="w-6 h-6" /> : <ArrowUp className="w-6 h-6" />}
                <span className="font-black uppercase tracking-tight text-lg italic">
                  {isSinking ? 'S\'enfonsa!' : 'Flota!'}
                </span>
             </motion.div>
           )}
        </div>

        {/* Explanation Overlay */}
        {isDropped && (
           <motion.div 
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             className="absolute bottom-6 left-6 right-6 bg-slate-900/90 backdrop-blur-md text-white p-6 rounded-2xl border border-slate-700 z-30"
           >
              <div className="flex gap-4">
                 <div className="bg-blue-500 p-2 rounded-xl h-fit">
                    <Info className="w-5 h-5" />
                 </div>
                 <div>
                    <h5 className="font-bold mb-1">Per què {isSinking ? 's\'enfonsa' : 'flota'}?</h5>
                    <p className="text-xs opacity-80 leading-relaxed">
                      {isSinking 
                        ? `Com que la densitat del ${selectedObject.name} (${selectedObject.density} g/cm³) és MAJOR que la del ${selectedLiquid.name} (${selectedLiquid.density} g/cm³), la força del pes és major que l'empenyiment del líquid.`
                        : `Com que la densitat del ${selectedObject.name} (${selectedObject.density} g/cm³) és MENOR que la del ${selectedLiquid.name} (${selectedLiquid.density} g/cm³), el líquid és capaç d'aguantar-lo a la superfície.`
                      }
                    </p>
                 </div>
              </div>
           </motion.div>
        )}
      </div>
    </div>
  );
};

export default BuoyancySim;

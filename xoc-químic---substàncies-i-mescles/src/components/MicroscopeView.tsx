import React, { useMemo } from 'react';
import { motion } from 'framer-motion';

type SubId = 'aigua' | 'oli' | 'alcohol' | 'sal' | 'sucre' | 'sorra' | 'ferro' | 'granit' | 'llet' | 'carbo';

interface MicroscopeViewProps {
  ingredients: SubId[];
}

export default function MicroscopeView({ ingredients }: MicroscopeViewProps) {
  // Generem unes coordenades aleatòries flotants per a les molècules
  const molecules = useMemo(() => {
    const list: any[] = [];
    
    const hasAqua = ingredients.includes('aigua') || ingredients.includes('llet');
    
    ingredients.forEach(ing => {
      let count = 0;
      switch (ing) {
        case 'aigua': count = 40; break;
        case 'llet': count = 25; break; // Llet té aigua i lípids, aigua s'afegeix sola si és llet
        case 'oli': count = 15; break;
        case 'alcohol': count = 25; break;
        case 'sal': count = hasAqua ? 35 : 5; break; // si hi ha aigua, ions lliures. Si no, 1 cristall
        case 'sucre': count = hasAqua ? 20 : 5; break;
        case 'sorra': count = 6; break; // xarxa Cristalina
        case 'ferro': count = 6; break; // xarxa metàl·lica
        case 'granit': count = 6; break; // Roca heterogènia
        case 'carbo': count = 5; break; 
      }
      
      for (let i = 0; i < count; i++) {
        list.push({
          id: `${ing}-${i}`,
          type: ing,
          // posicions inicials aleatories dintre del rang del cercle
          x: Math.random() * 85 + 5, 
          y: Math.random() * 85 + 5,
          delay: Math.random() * 2,
          duration: Math.random() * 4 + 4
        });
      }

      // Afegint lípids / caseïnes si és llet
      if (ing === 'llet') {
        for (let i = 0; i < 10; i++) {
          list.push({
             id: `llet-lipids-${i}`,
             type: 'lipid_micelle',
             x: Math.random() * 85 + 5,
             y: Math.random() * 85 + 5,
             delay: Math.random() * 2,
             duration: Math.random() * 4 + 5
          });
        }
      }
    });
    return list;
  }, [ingredients]);

  const renderMolecule = (type: string, id: string) => {
    switch (type) {
      case 'aigua':
        // H2O: 1 O (vermell) i 2 H (blancs)
        return (
          <div className="relative w-8 h-8">
            <div className="absolute top-1 left-2 w-4 h-4 bg-red-500 rounded-full shadow-sm" />
            <div className="absolute top-0 left-0 w-2.5 h-2.5 bg-slate-100 rounded-full shadow-sm border border-slate-300" />
            <div className="absolute top-0 left-5 w-2.5 h-2.5 bg-slate-100 rounded-full shadow-sm border border-slate-300" />
          </div>
        );
      case 'alcohol':
        // Etanol simplificat: C2H5OH
        return (
          <div className="relative w-12 h-6 flex items-center">
            <div className="w-4 h-4 bg-gray-600 rounded-full z-10" />
            <div className="w-4 h-4 bg-gray-600 rounded-full -ml-1 z-10" />
            <div className="w-4 h-4 bg-red-500 rounded-full -ml-1 z-10" />
            <div className="absolute -top-1 left-9 w-2 h-2 bg-slate-100 rounded-full" />
          </div>
        );
      case 'oli':
      case 'lipid_micelle':
        // Micel·la de lípids o Gota d'oli (cadena llarga o cercle gras)
        return (
          <div className="relative w-12 h-8">
            <div className="absolute inset-0 bg-amber-400/80 rounded-full blur-[1px] shadow-sm border border-amber-500/50" />
            <div className="absolute top-1 left-1 w-2 h-2 bg-white/40 rounded-full" />
          </div>
        );
      case 'sal':
        if (ingredients.includes('aigua') || ingredients.includes('llet')) {
           // Ions separats (Na+ Cl-)
           const isSodium = Math.random() > 0.5;
           return isSodium ? 
             <div className="w-4 h-4 bg-indigo-400 rounded-full flex items-center justify-center text-[8px] text-white font-bold shadow-sm">Na⁺</div> :
             <div className="w-5 h-5 bg-green-400 rounded-full flex items-center justify-center text-[8px] text-white font-bold shadow-sm">Cl⁻</div>;
        } else {
           // Cristall de sal NaCl
           return (
             <div className="grid grid-cols-3 grid-rows-3 gap-[1px] w-12 h-12 bg-transparent p-1">
               {[...Array(9)].map((_, i) => (
                 <div key={i} className={`w-3 h-3 ${i % 2 === 0 ? 'bg-indigo-400' : 'bg-green-400'}`} />
               ))}
             </div>
           );
        }
      case 'sucre':
        if (ingredients.includes('aigua') || ingredients.includes('llet')) {
           // Molècules de sacarosa separades hidratades
           return (
             <div className="w-10 h-10 bg-slate-50 border-2 border-slate-300 rounded-[12px] flex items-center justify-center shadow-md rotate-12">
               <div className="text-[8px] text-slate-500 font-bold">C₁₂H₂₂O₁₁</div>
             </div>
           );
        } else {
           // Cristall de sucre macroscopic
           return (
             <div className="grid grid-cols-2 grid-rows-2 gap-[1px] w-12 h-12">
               {[...Array(4)].map((_, i) => (
                 <div key={i} className="w-5 h-5 bg-slate-100 border border-slate-300 rounded-sm" />
               ))}
             </div>
           );
        }
      case 'sorra':
        // Gel de sílice (SiO2 estructural)
        return (
          <div className="relative w-20 h-20">
            {[...Array(8)].map((_, i) => (
               <div key={i} className={`absolute w-3 h-3 rounded-full bg-orange-400 shadow-sm border border-orange-500`}
                    style={{ left: (i%3)*10, top: Math.floor(i/3)*10 }} />
            ))}
          </div>
        );
      case 'ferro':
        // Xarxa metàl·lica de Ferro
        return (
          <div className="grid grid-cols-4 grid-rows-4 gap-0.5 p-2 bg-slate-800 rounded-lg shadow-inner">
             {[...Array(16)].map((_, i) => (
               <div key={i} className="w-3 h-3 bg-slate-400 rounded-full shadow-sm" />
             ))}
          </div>
        );
      case 'carbo':
        // Estructura de carbó (amorf o grafit)
        return (
          <div className="relative w-24 h-24 bg-zinc-900/80 rounded-xl blur-[1px]">
             {[...Array(20)].map((_, i) => (
               <div key={i} className="absolute w-4 h-4 bg-black rounded-full"
                    style={{ left: Math.random()*80, top: Math.random()*80 }} />
             ))}
          </div>
        );
      case 'granit':
        // Roca formada per diversos minerals
        return (
          <div className="relative w-24 h-24 bg-slate-300 rounded-full overflow-hidden border-2 border-slate-400">
             {[...Array(15)].map((_, i) => {
                const colors = ['bg-slate-800', 'bg-white', 'bg-slate-200/50'];
                return (
                 <div key={i} className={`absolute w-4 h-4 ${colors[i%3]}`}
                      style={{ 
                        left: Math.random()*80, top: Math.random()*80, 
                        clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
                        transform: `rotate(${Math.random()*90}deg)`
                      }} />
                );
             })}
          </div>
        );
      default: return null;
    }
  };

  return (
    <div className="w-full h-full rounded-full bg-slate-800 flex items-center justify-center overflow-hidden border-8 border-slate-700 shadow-2xl relative" style={{ width: 300, height: 300 }}>
       {/* Microscopic Grid / Lens Effect */}
       <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-900/20 via-slate-900/40 to-black pointer-events-none z-10" />
       
       <div className="relative w-full h-full">
         {ingredients.length === 0 && (
           <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400/50 font-mono text-sm">
             <div className="text-4xl mb-2">🔬</div>
             Cap mostra
           </div>
         )}
         
         {molecules.map((mol) => (
           <motion.div
             key={mol.id}
             className="absolute"
             style={{ left: `${mol.x}%`, top: `${mol.y}%` }}
             initial={{ x: 0, y: 0 }}
             animate={{ 
               x: [ -8, 8, -8 ],
               y: [ -8, 8, -8 ],
               rotate: [0, 30, -30, 0]
             }}
             transition={{
               duration: mol.duration,
               repeat: Infinity,
               ease: "linear",
               delay: mol.delay
             }}
           >
             {renderMolecule(mol.type, mol.id)}
           </motion.div>
         ))}
       </div>
    </div>
  );
}

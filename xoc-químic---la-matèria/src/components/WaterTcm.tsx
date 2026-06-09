import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Droplets, Thermometer, Info, ShieldAlert } from 'lucide-react';
import ParticleSim from './ParticleSim';

const WaterTcm: React.FC = () => {
  const [temp, setTemp] = useState(20);

  const getWaterStateInfo = (t: number) => {
    if (t < 0) {
      return {
        state: 'solid' as const,
        label: 'GEL (Sòlid)',
        color: 'text-blue-500',
        bg: 'bg-blue-50',
        desc: 'Les partícules estan enllaçades formant una xarxa rígida. Les forces de cohesió són màximes i les partícules només vibren en posicions fixes.',
        cohesion: 'Molt Alta'
      };
    } else if (t >= 0 && t < 100) {
      return {
        state: 'liquid' as const,
        label: 'AIGUA LÍQUIDA',
        color: 'text-cyan-600',
        bg: 'bg-cyan-50',
        desc: 'Les partícules tenen prou energia per lliscar unes sobre altres. La cohesió és moderada: manté el volum però no la forma.',
        cohesion: 'Moderada'
      };
    } else {
      return {
        state: 'gas' as const,
        label: 'VAPOR D\'AIGUA',
        color: 'text-slate-500',
        bg: 'bg-slate-50',
        desc: 'L\'energia cinètica és tan alta que ha vençut totalment la cohesió. Les partícules es mouen a gran velocitat ocupant tot l\'espai.',
        cohesion: 'Gairebé nul·la'
      };
    }
  };

  const info = getWaterStateInfo(temp);

  return (
    <div className="space-y-8">
      <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <div className="space-y-6">
            <div className="flex items-center gap-3">
               <div className="bg-blue-600 p-2 rounded-xl">
                  <Droplets className="w-6 h-6 text-white" />
               </div>
               <div>
                  <h3 className="font-black text-xl text-slate-800 italic uppercase">L'Aigua i la TCM</h3>
                  <p className="text-slate-500 text-xs">Simulació de -50°C a 150°C</p>
               </div>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100">
              <div className="flex justify-between items-center mb-6">
                 <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Control de Temperatura</span>
                 <span className={`text-2xl font-mono font-black ${temp < 0 ? 'text-blue-600' : temp >= 100 ? 'text-orange-600' : 'text-cyan-600'}`}>
                    {temp} °C
                 </span>
              </div>
              <input 
                type="range"
                min="-50"
                max="150"
                step="5"
                value={temp}
                onChange={(e) => setTemp(parseInt(e.target.value))}
                className="w-full h-3 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
              <div className="flex justify-between mt-4 text-[10px] font-bold text-slate-400 uppercase">
                 <span>Extremadament Fred</span>
                 <span>Extremadament Calent</span>
              </div>
            </div>

            <div className={`${info.bg} p-6 rounded-2xl border border-white shadow-sm transition-colors duration-500`}>
               <h4 className={`font-black text-lg ${info.color} mb-2 uppercase italic tracking-tight`}>{info.label}</h4>
               <p className="text-sm text-slate-600 leading-relaxed">
                 {info.desc}
               </p>
               <div className="mt-4 pt-4 border-t border-white/50 flex justify-between items-center">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Força de Cohesió</span>
                  <span className={`text-xs font-black uppercase ${info.color}`}>{info.cohesion}</span>
               </div>
            </div>
          </div>

          <div className="relative bg-slate-900 rounded-3xl p-4 shadow-inner min-h-[350px]">
            <div className="absolute top-4 left-4 bg-white/10 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 z-10">
               <span className="text-[10px] font-bold text-white uppercase tracking-widest">Vista Microscòpica</span>
            </div>
            <div className="h-full w-full">
               <ParticleSim temperature={Math.max(0, (temp + 50) / 2)} state={info.state} />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <div className="bg-white p-6 rounded-2xl border border-slate-100 flex flex-col items-center text-center">
            <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center mb-4 text-blue-500 font-black">0°C</div>
            <h5 className="font-bold text-sm mb-1 uppercase tracking-tight">Punt de Fusió</h5>
            <p className="text-[11px] text-slate-500 leading-tight">El gel guanya prou energia per trencar l'estructura rígida.</p>
         </div>
         <div className="bg-white p-6 rounded-2xl border border-slate-100 flex flex-col items-center text-center">
            <div className="w-12 h-12 bg-orange-50 rounded-full flex items-center justify-center mb-4 text-orange-500 font-black">100°C</div>
            <h5 className="font-bold text-sm mb-1 uppercase tracking-tight">Punt d'Ebullició</h5>
            <p className="text-[11px] text-slate-500 leading-tight">L'agitació és tan forta que cap partícula pot quedar-se junta.</p>
         </div>
         <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 flex items-start gap-4">
            <div className="bg-blue-500 p-2 rounded-xl h-fit">
               <ShieldAlert className="w-4 h-4 text-white" />
            </div>
            <div>
               <h5 className="font-bold text-sm text-white mb-1 uppercase tracking-tight">Efecte de l'energia</h5>
               <p className="text-[11px] text-blue-100 opacity-80 leading-tight">
                 Quan escalfem, l'energia va directament a moure més les partícules, vencent la "cola" invisible que és la cohesió.
               </p>
            </div>
         </div>
      </div>
    </div>
  );
};

export default WaterTcm;

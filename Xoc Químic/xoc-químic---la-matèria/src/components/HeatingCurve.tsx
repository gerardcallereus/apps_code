import React from 'react';
import { motion } from 'motion/react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  ReferenceArea,
  Label
} from 'recharts';
import { Thermometer, Info, Flame, Snowflake } from 'lucide-react';

const data = [
  { time: 0, temp: -20, state: 'Sòlid (Gel)', desc: 'Les partícules vibren en posicions fixes.' },
  { time: 10, temp: -10, state: 'Sòlid (Gel)', desc: 'L\'energia augmenta la vibració.' },
  { time: 20, temp: 0, state: 'Fusió (Canvi)', desc: 'L\'energia s\'usa per trencar la cohesió.' },
  { time: 30, temp: 0, state: 'Fusió (Canvi)', desc: 'Coexisteixen gel i aigua líquida.' },
  { time: 40, temp: 0, state: 'Fusió (Canvi)', desc: 'Planell: La Tª es manté constant.' },
  { time: 50, temp: 25, state: 'Líquid', desc: 'Les partícules ja llisquen lliurement.' },
  { time: 60, temp: 50, state: 'Líquid', desc: 'Augmenta la velocitat de les partícules.' },
  { time: 70, temp: 75, state: 'Líquid', desc: 'Més agitació tèrmica.' },
  { time: 80, temp: 100, state: 'Ebullició (Canvi)', desc: 'L\'energia venç la cohesió totalment.' },
  { time: 90, temp: 100, state: 'Ebullició (Canvi)', desc: 'Tota la massa del líquid canvia.' },
  { time: 100, temp: 100, state: 'Ebullició (Canvi)', desc: 'Planell: La Tª no puja.' },
  { time: 110, temp: 115, state: 'Gas (Vapor)', desc: 'Les partícules es mouen a gran velocitat.' },
  { time: 120, temp: 130, state: 'Gas (Vapor)', desc: 'Moviment totalment lliure i caòtic.' },
];

const HeatingCurve: React.FC = () => {
  return (
    <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xl overflow-hidden mt-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h3 className="text-xl font-black text-slate-800 italic uppercase flex items-center gap-2">
            <Flame className="w-5 h-5 text-orange-500" /> Gràfica d'Escalfament de l'Aigua
          </h3>
          <p className="text-slate-500 text-sm">Observa com la temperatura es queda "aturada" durant els canvis d'estat.</p>
        </div>
      </div>

      <div className="h-[450px] w-full bg-slate-50 rounded-2xl p-4 relative">
        <div className="absolute top-4 left-16 z-10 flex flex-col gap-2">
           <div className="flex items-center gap-2 bg-white/80 backdrop-blur px-3 py-1 rounded-full border border-indigo-100 shadow-sm">
              <div className="w-2 h-2 rounded-full bg-orange-500 animate-pulse"></div>
              <span className="text-[10px] font-black text-slate-600 uppercase">Ebullició a 100°C</span>
           </div>
           <div className="flex items-center gap-2 bg-white/80 backdrop-blur px-3 py-1 rounded-full border border-blue-100 shadow-sm">
              <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
              <span className="text-[10px] font-black text-slate-600 uppercase">Fusió a 0°C</span>
           </div>
        </div>

        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 20, right: 30, left: 10, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
            <XAxis 
              dataKey="time" 
              label={{ value: 'Temps (energia subministrada) →', position: 'insideBottom', offset: -10, fontSize: 10, fontWeight: 'bold' }}
              hide={false}
              tick={false}
              stroke="#CBD5E1"
            />
            <YAxis 
              domain={[-30, 140]} 
              ticks={[-30, -20, -10, 0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 110, 120, 130, 140]}
              tick={{ fontSize: 9, fontWeight: 'bold', fill: '#64748B' }}
              unit="°C"
              stroke="#CBD5E1"
            />
            <Tooltip 
              contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', padding: '12px' }}
              labelClassName="hidden"
              formatter={(value: any, name: any, props: any) => [
                <div key="tooltip" className="space-y-1">
                  <div className="text-indigo-600 font-black text-xl">{value}°C</div>
                  <div className="text-[10px] font-bold uppercase text-slate-400 bg-slate-100 px-2 py-0.5 rounded inline-block">{props.payload.state}</div>
                  <div className="text-xs text-slate-600 max-w-[180px] leading-relaxed mt-2">{props.payload.desc}</div>
                </div>,
                null
              ]}
            />
            
            <Line 
              type="monotone" 
              dataKey="temp" 
              stroke="#6366F1" 
              strokeWidth={5} 
              dot={{ r: 5, fill: '#6366F1', strokeWidth: 2, stroke: '#fff' }}
              activeDot={{ r: 8, fill: '#4F46E5', strokeWidth: 3, stroke: '#fff' }}
              animationDuration={2500}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-indigo-600 p-6 rounded-2xl text-white shadow-lg">
          <h4 className="font-bold mb-3 flex items-center gap-2">
            <Info className="w-5 h-5 text-indigo-300" /> El Misteri dels Planells
          </h4>
          <p className="text-sm leading-relaxed opacity-90">
            Has fixat que la línia es torna plana a <strong>0°C</strong> i <strong>100°C</strong>? 
            Mentre una substància canvia d'estat, <strong>la temperatura no puja</strong> encara que seguim escalfant.
            <br /><br />
            L'energia no s'usa per moure més les partícules (pujar Tª), sinó per <strong>vèncer les forces de cohesió</strong> que les mantenen unides.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 italic">
            <h5 className="text-[10px] font-bold text-slate-400 uppercase mb-1">Coexistència</h5>
            <p className="text-xs text-slate-600">
              Durant el canvi d'estat, tenim partícules en els dos estats alhora. Per exemple, aigua amb gel flotant a 0°C.
            </p>
          </div>
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
            <h5 className="text-[10px] font-bold text-slate-400 uppercase mb-1">Energia</h5>
            <p className="text-xs text-slate-600">
              Quan l'última partícula ha canviat d'estat, llavors la temperatura torna a pujar.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeatingCurve;

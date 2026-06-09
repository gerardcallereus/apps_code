import React, { useState } from 'react';
import { motion } from 'motion/react';
import { MoveHorizontal, Scale, Droplets, Info } from 'lucide-react';

interface Material {
  id: string;
  name: string;
  icon: string;
  density: number; // g/cm3
  color: string;
}

const materials: Material[] = [
  { id: 'gold', name: 'Or', icon: '🏆', density: 19.3, color: 'bg-yellow-400' },
  { id: 'iron', name: 'Ferro', icon: '⛓️', density: 7.8, color: 'bg-slate-400' },
  { id: 'wood', name: 'Fusta', icon: '🪵', density: 0.6, color: 'bg-amber-700' },
  { id: 'cork', name: 'Suro', icon: '🍾', density: 0.25, color: 'bg-orange-200' },
  { id: 'aluminum', name: 'Alumini', icon: '🍴', density: 2.7, color: 'bg-slate-200' },
  { id: 'lead', name: 'Plom', icon: '⚓', density: 11.3, color: 'bg-indigo-900' },
];

const DensityLab: React.FC = () => {
  const [selectedMaterial, setSelectedMaterial] = useState<Material>(materials[1]);
  const [volume, setVolume] = useState(50);
  const [measuredMass, setMeasuredMass] = useState(false);
  const [isMeasuring, setIsMeasuring] = useState(false);
  const [userInput, setUserInput] = useState('');
  const [showResult, setShowResult] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const mass = selectedMaterial.density * volume;

  const handleMeasure = () => {
    setIsMeasuring(true);
    setMeasuredMass(false);
    setShowResult(false);
    setFeedback(null);
    setUserInput('');
    setTimeout(() => {
      setIsMeasuring(false);
      setMeasuredMass(true);
    }, 1000);
  };

  const checkCalculation = () => {
    const val = parseFloat(userInput);
    if (isNaN(val)) return;

    if (Math.abs(val - selectedMaterial.density) < 0.1) {
      setFeedback({ type: 'success', text: 'Molt bé! Càlcul correcte.' });
      setShowResult(true);
    } else {
      setFeedback({ type: 'error', text: 'Repassa el càlcul: d = m / V' });
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
      <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 shadow-sm">
        <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
          <Info className="w-5 h-5 text-indigo-500" /> Control del Laboratori
        </h3>
        
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-3 font-bold uppercase tracking-wider text-[10px]">Escull un material (i mira la seva densitat):</label>
            <div className="grid grid-cols-2 gap-2">
              {materials.map((m) => (
                <button
                  key={m.id}
                  onClick={() => {
                    setSelectedMaterial(m);
                    setMeasuredMass(false);
                    setShowResult(false);
                    setFeedback(null);
                  }}
                  className={`p-3 rounded-xl border-2 transition-all flex flex-col items-center justify-center ${
                    selectedMaterial.id === m.id 
                      ? 'border-indigo-500 bg-white shadow-md scale-105' 
                      : 'border-slate-200 bg-slate-100/50 hover:bg-white'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{m.icon}</span>
                    <span className="text-sm font-semibold">{m.name}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="flex justify-between text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">
              <span>Ajusta el Volum (V):</span>
              <span className="text-indigo-600 font-mono font-bold bg-indigo-50 px-2 py-0.5 rounded">{volume} cm³</span>
            </label>
            <input
              type="range"
              min="10"
              max="200"
              value={volume}
              onChange={(e) => {
                setVolume(parseInt(e.target.value));
                setMeasuredMass(false);
                setShowResult(false);
                setFeedback(null);
              }}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
            />
          </div>

          <button
            onClick={handleMeasure}
            disabled={isMeasuring}
            className={`w-full py-4 rounded-xl font-bold text-white transition-all transform active:scale-95 flex items-center justify-center gap-2 ${
              isMeasuring ? 'bg-slate-400' : 'bg-slate-900 hover:bg-slate-800 shadow-lg'
            }`}
          >
            <Scale className={`w-5 h-5 ${isMeasuring ? 'animate-bounce' : ''}`} />
            {isMeasuring ? 'Mesurant...' : 'Mesura la Massa'}
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-6">
        <div className="bg-white p-6 rounded-2xl border-2 border-dashed border-slate-300 flex flex-col items-center justify-center min-h-[300px] relative overflow-hidden">
          <div className="absolute top-4 right-4 text-[10px] font-black text-slate-300 tracking-widest">BALANÇA DE PRECISIÓ</div>
          
          <motion.div
            animate={{ scale: isMeasuring ? [1, 1.05, 1] : 1 }}
            transition={{ repeat: isMeasuring ? Infinity : 0, duration: 0.5 }}
            className={`relative flex items-center justify-center`}
          >
             <div className="mt-12 flex flex-col items-center">
                <div className={`w-32 h-32 ${selectedMaterial.color} rounded-lg shadow-lg flex items-center justify-center text-5xl border-4 border-white/30 transform hover:rotate-6 transition-transform cursor-pointer`}>
                  {selectedMaterial.icon}
                </div>
                {/* Scale base */}
                <div className="mt-4 w-48 h-3 bg-slate-800 rounded-full shadow-lg"></div>
                <div className="w-1.5 h-10 bg-slate-800"></div>
                <div className="w-28 h-6 bg-slate-800 rounded-t-2xl flex items-center justify-center">
                   <div className="w-16 h-2 bg-indigo-500/50 rounded-full"></div>
                </div>
             </div>
          </motion.div>

          <div className="mt-12 w-full grid grid-cols-2 gap-4">
            <div className="bg-indigo-50 p-4 rounded-xl border border-indigo-100">
              <span className="block text-[10px] uppercase tracking-wider text-indigo-500 font-bold">Massa (m)</span>
              <span className="text-2xl font-mono font-bold text-indigo-800">
                {measuredMass ? `${mass.toFixed(1)} g` : '?.? g'}
              </span>
            </div>
            <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-100">
              <span className="block text-[10px] uppercase tracking-wider text-emerald-500 font-bold">Volum (V)</span>
              <span className="text-2xl font-mono font-bold text-emerald-800">
                {volume} cm³
              </span>
            </div>
          </div>
        </div>

        {measuredMass && !showResult && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-indigo-600 p-6 rounded-2xl text-white shadow-xl"
          >
            <h4 className="font-bold mb-4 flex items-center gap-2">
               🏋️ Calcula la densitat ara!
            </h4>
            <div className="flex gap-3">
               <input 
                 type="number"
                 placeholder="Resultado..."
                 value={userInput}
                 onChange={(e) => setUserInput(e.target.value)}
                 className="flex-1 bg-white/10 border border-white/20 rounded-xl px-4 py-2 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-white/50"
               />
               <button 
                onClick={checkCalculation}
                className="bg-white text-indigo-600 px-6 py-2 rounded-xl font-bold hover:bg-slate-100 transition-colors"
               >
                 Comprova
               </button>
            </div>
            {feedback && (
              <p className={`mt-3 text-sm font-bold ${feedback.type === 'success' ? 'text-emerald-300' : 'text-red-300'}`}>
                {feedback.text}
              </p>
            )}
          </motion.div>
        )}

        {showResult && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-slate-800 text-white p-6 rounded-2xl shadow-xl border-l-8 border-indigo-500"
          >
            <div className="flex items-center gap-2 mb-2 text-indigo-300 font-bold uppercase tracking-widest text-[10px]">
              Resultat de la Densitat
            </div>
            <div className="flex justify-between items-end">
               <div>
                  <p className="text-xs opacity-60 mb-1">Càlcul: {mass.toFixed(1)} / {volume}</p>
                  <p className="text-3xl font-mono font-bold">
                    {selectedMaterial.density.toFixed(2)} <span className="text-lg font-normal opacity-60">g/cm³</span>
                  </p>
               </div>
               <div className="text-right">
                  <p className="text-[10px] opacity-60 uppercase font-black">Material</p>
                  <p className="font-bold">{selectedMaterial.name}</p>
               </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default DensityLab;

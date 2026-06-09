import React, { useEffect, useState } from 'react';
import { RefreshCw, Award, CheckCircle } from 'lucide-react';

interface VictoryProps {
  onReset: () => void;
  attempts: number;
}

export const Victory: React.FC<VictoryProps> = ({ onReset, attempts }) => {
  const [stars, setStars] = useState(0);

  useEffect(() => {
    const t1 = setTimeout(() => setStars(1), 300);
    const t2 = setTimeout(() => setStars(2), 600);
    const t3 = setTimeout(() => setStars(3), 900);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-tr from-green-400 to-emerald-600 overflow-y-auto">
      <div className="max-w-3xl w-full bg-white rounded-2xl shadow-2xl p-8 md:p-12 text-center animate-pop-in my-8">
        
        <div className="flex justify-center gap-2 mb-8">
          {[1, 2, 3].map((s) => (
            <div 
              key={s} 
              className={`transition-all duration-500 transform ${s <= stars ? 'scale-100 opacity-100' : 'scale-50 opacity-0'}`}
            >
              <Award className="w-16 h-16 text-yellow-400 fill-yellow-400 drop-shadow-md" />
            </div>
          ))}
        </div>

        <h2 className="text-4xl font-black text-slate-800 mb-2">Felicitats!</h2>
        <p className="text-xl text-emerald-600 font-semibold mb-6">Has completat el procés de creació.</p>
        
        <div className="bg-emerald-50 rounded-xl p-6 mb-8 border border-emerald-100">
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-center gap-2 text-slate-700">
              <CheckCircle size={20} className="text-emerald-500" />
              <span>Has ordenat les 6 fases correctament.</span>
            </div>
            <p className="text-sm text-slate-500 mt-2">
              Ara ja saps que crear una marca no és només tenir una idea, sinó un procés complex de disseny, producció i venda.
            </p>
          </div>
        </div>

        <button 
          onClick={onReset}
          className="inline-flex items-center justify-center px-6 py-3 text-base font-medium text-white transition-colors duration-200 bg-slate-800 rounded-lg hover:bg-slate-900 focus:outline-none shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
        >
          <RefreshCw className="mr-2 w-5 h-5" />
          Tornar a jugar
        </button>
      </div>
    </div>
  );
};
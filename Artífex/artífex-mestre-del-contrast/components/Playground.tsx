import React, { useState } from 'react';
import { calculateContrast, getWCAGStatus, getRandomHex } from '../utils/colorUtils';
import { RefreshCw, AlertCircle, CheckCircle } from 'lucide-react';

export const Playground: React.FC = () => {
  const [bg, setBg] = useState('#ffffff');
  const [fg, setFg] = useState('#000000');

  const result = getWCAGStatus(calculateContrast(bg, fg));

  const randomize = () => {
    setBg(getRandomHex());
    setFg(getRandomHex());
  };

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6 grid md:grid-cols-2 gap-8">
      
      {/* Controls Section */}
      <div className="space-y-6">
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-100">
          <h2 className="text-xl font-bold mb-6 text-slate-800">Selector de Colors</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-500 mb-1">Color de Fons</label>
              <div className="flex items-center gap-3">
                <input 
                  type="color" 
                  value={bg} 
                  onChange={(e) => setBg(e.target.value)}
                  className="h-12 w-12 rounded cursor-pointer border-none"
                />
                <input 
                  type="text" 
                  value={bg} 
                  onChange={(e) => setBg(e.target.value)}
                  className="flex-1 p-3 border rounded-lg font-mono uppercase text-slate-700 focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-500 mb-1">Color de Text</label>
              <div className="flex items-center gap-3">
                <input 
                  type="color" 
                  value={fg} 
                  onChange={(e) => setFg(e.target.value)}
                  className="h-12 w-12 rounded cursor-pointer border-none"
                />
                <input 
                  type="text" 
                  value={fg} 
                  onChange={(e) => setFg(e.target.value)}
                  className="flex-1 p-3 border rounded-lg font-mono uppercase text-slate-700 focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>
            </div>

            <button 
              onClick={randomize}
              className="w-full mt-4 flex justify-center items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 py-3 rounded-lg font-medium transition-colors"
            >
              <RefreshCw size={18} /> Colors Aleatoris
            </button>
          </div>
        </div>

        {/* Results Metrics */}
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-100">
          <div className="flex justify-between items-end mb-4">
            <h3 className="text-lg font-semibold text-slate-700">Resultat WCAG</h3>
            <span className="text-4xl font-bold text-indigo-600">{result.score}:1</span>
          </div>

          <div className="space-y-3">
            <ScoreRow label="AA Normal" pass={result.levelAA} />
            <ScoreRow label="AAA Normal" pass={result.levelAAA} />
            <ScoreRow label="AA Gran (18pt+)" pass={result.levelAALarge} />
            <ScoreRow label="AAA Gran (18pt+)" pass={result.levelAAALarge} />
          </div>
        </div>
      </div>

      {/* Preview Section */}
      <div className="flex flex-col gap-6">
        <div 
          className="flex-grow min-h-[300px] rounded-3xl shadow-2xl flex flex-col justify-center items-center p-8 text-center transition-colors duration-300 relative overflow-hidden"
          style={{ backgroundColor: bg, color: fg }}
        >
          <div className="z-10 relative">
             <h1 className="text-5xl md:text-6xl font-extrabold mb-4 tracking-tight">Contrast</h1>
             <p className="text-xl md:text-2xl font-medium max-w-md mx-auto">
               La llegibilitat és essencial per a una bona experiència d'usuari.
             </p>
             <button 
               className="mt-8 px-6 py-2 rounded-full text-sm font-bold uppercase tracking-wider border-2 opacity-80"
               style={{ borderColor: fg }}
             >
               Botó de Prova
             </button>
          </div>
          
          {/* Decorative Pattern */}
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full opacity-10" style={{ backgroundColor: fg }}></div>
          <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-48 h-48 rounded-full opacity-10" style={{ backgroundColor: fg }}></div>
        </div>
      </div>

    </div>
  );
};

const ScoreRow: React.FC<{ label: string; pass: boolean }> = ({ label, pass }) => (
  <div className="flex items-center justify-between p-2 rounded hover:bg-slate-50">
    <span className="text-slate-600 font-medium">{label}</span>
    {pass ? (
      <span className="flex items-center gap-1 text-green-600 font-bold text-sm bg-green-50 px-2 py-1 rounded-full">
        <CheckCircle size={14} /> PASS
      </span>
    ) : (
      <span className="flex items-center gap-1 text-red-500 font-bold text-sm bg-red-50 px-2 py-1 rounded-full">
        <AlertCircle size={14} /> FAIL
      </span>
    )}
  </div>
);
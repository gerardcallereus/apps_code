import React, { useState, useEffect } from 'react';
import { MATERIALS } from '../constants';
import { Material, MaterialType } from '../types';
import { CircuitBoard } from './CircuitBoard';
import { playBuzzer, playSuccessChime } from '../utils/audio';
import { Zap, XCircle, CheckCircle2 } from 'lucide-react';

export const Game: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<MaterialType | null>(null);
  const [matchedMaterials, setMatchedMaterials] = useState<Set<string>>(new Set());
  const [circuitActive, setCircuitActive] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);
  
  // Initialize materials in a random order
  const [gameMaterials] = useState<Material[]>(() => {
    return [...MATERIALS].sort(() => Math.random() - 0.5);
  });

  useEffect(() => {
    let timeout: number;
    if (circuitActive) {
      timeout = window.setTimeout(() => {
        setCircuitActive(false);
        setFeedbackMessage(null);
      }, 1500);
    }
    return () => clearTimeout(timeout);
  }, [circuitActive]);

  const handleCategorySelect = (type: MaterialType) => {
    setSelectedCategory(type);
    setFeedbackMessage(null);
  };

  const handleMaterialSelect = (material: Material) => {
    if (matchedMaterials.has(material.id)) return;
    if (!selectedCategory) {
        setFeedbackMessage("Primer selecciona 'Conductor' o 'Aïllant'!");
        return;
    }

    if (material.type === selectedCategory) {
      // Correct Match
      const newMatches = new Set(matchedMaterials);
      newMatches.add(material.id);
      setMatchedMaterials(newMatches);
      
      setCircuitActive(true);
      playBuzzer(800); // Play buzz for 0.8s
      
      setFeedbackMessage("Circuit Tancat! El corrent passa!");
      setSelectedCategory(null); // Reset selection
    } else {
      // Incorrect Match
      setFeedbackMessage("Oh no! El circuit no funciona.");
      playSuccessChime(); // Actually using a gentle error sound or chime here for feedback
      setTimeout(() => setFeedbackMessage(null), 1000);
    }
  };

  const isGameComplete = matchedMaterials.size === MATERIALS.length;

  return (
    <div className="max-w-4xl mx-auto p-4">
      
      <CircuitBoard isActive={circuitActive} />

      <div className="mb-6 text-center h-8">
        {feedbackMessage && (
            <span className={`inline-flex items-center gap-2 px-4 py-1 rounded-full text-white font-bold animate-fade-in ${circuitActive ? 'bg-green-600' : 'bg-orange-500'}`}>
                {circuitActive ? <Zap size={18} /> : <XCircle size={18} />}
                {feedbackMessage}
            </span>
        )}
        {isGameComplete && !feedbackMessage && (
            <span className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-blue-600 text-white font-bold animate-bounce">
                <CheckCircle2 size={18} />
                Felicitats! Has completat tots els materials!
            </span>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative">
        
        {/* Left Column: Categories */}
        <div className="flex flex-col gap-4">
          <h3 className="text-xl font-bold text-slate-700 text-center mb-2">PROPIETAT</h3>
          
          <button
            onClick={() => handleCategorySelect('conductor')}
            className={`
              p-6 rounded-2xl border-4 text-2xl font-bold shadow-lg transition-all flex items-center justify-between
              ${selectedCategory === 'conductor' 
                ? 'bg-blue-100 border-blue-500 text-blue-700 scale-105 ring-4 ring-blue-200' 
                : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}
            `}
          >
            <span>CONDUCTOR</span>
            <div className={`w-4 h-4 rounded-full ${selectedCategory === 'conductor' ? 'bg-blue-500' : 'bg-slate-300'}`}></div>
          </button>

          <button
            onClick={() => handleCategorySelect('aillant')}
            className={`
              p-6 rounded-2xl border-4 text-2xl font-bold shadow-lg transition-all flex items-center justify-between
              ${selectedCategory === 'aillant' 
                ? 'bg-red-100 border-red-500 text-red-700 scale-105 ring-4 ring-red-200' 
                : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}
            `}
          >
            <span>AÏLLANT</span>
            <div className={`w-4 h-4 rounded-full ${selectedCategory === 'aillant' ? 'bg-red-500' : 'bg-slate-300'}`}></div>
          </button>

          <div className="mt-4 bg-yellow-50 p-4 rounded-lg border border-yellow-200 text-sm text-yellow-800">
            <p>ℹ️ <strong>Instruccions:</strong> Primer prem un botó de l'esquerra (Conductor o Aïllant) i després connecta'l amb un material de la dreta.</p>
          </div>
        </div>

        {/* Center Wiring Graphic (Visual only, hidden on mobile) */}
        <div className="hidden md:flex flex-col justify-center items-center absolute left-1/2 top-0 bottom-0 -translate-x-1/2 pointer-events-none z-0">
             <div className="w-1 h-full bg-slate-200"></div>
        </div>

        {/* Right Column: Materials */}
        <div className="flex flex-col gap-3 z-10">
          <h3 className="text-xl font-bold text-slate-700 text-center mb-2">MATERIALS</h3>
          <div className="grid grid-cols-2 gap-3">
            {gameMaterials.map((m) => {
                const isMatched = matchedMaterials.has(m.id);
                const isConductor = m.type === 'conductor';
                
                return (
                    <button
                        key={m.id}
                        disabled={isMatched}
                        onClick={() => handleMaterialSelect(m)}
                        className={`
                        relative p-3 rounded-xl border-2 text-left shadow-sm transition-all
                        flex flex-col items-center justify-center gap-2
                        ${isMatched 
                            ? (isConductor ? 'bg-blue-500 border-blue-600 text-white opacity-50' : 'bg-red-500 border-red-600 text-white opacity-50')
                            : 'bg-white border-slate-200 hover:border-blue-300 hover:shadow-md active:scale-95'}
                        `}
                    >
                        <span className="text-4xl">{m.icon}</span>
                        <span className="font-semibold text-sm md:text-base">{m.name}</span>
                        {isMatched && (
                            <div className="absolute top-1 right-1">
                                <CheckCircle2 size={16} className="text-white" />
                            </div>
                        )}
                    </button>
                );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

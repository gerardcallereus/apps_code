import React from 'react';
import { ArrowRight, Layers, Brain, Target } from 'lucide-react';

interface IntroProps {
  onStart: () => void;
}

export const Intro: React.FC<IntroProps> = ({ onStart }) => {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-indigo-500 via-purple-600 to-blue-600">
      <div className="max-w-2xl w-full bg-white rounded-2xl shadow-2xl overflow-hidden animate-pop-in">
        <div className="p-8 md:p-12 text-center">
          <div className="flex justify-center mb-6">
            <div className="bg-indigo-100 p-4 rounded-full">
              <Layers className="w-12 h-12 text-indigo-600" />
            </div>
          </div>
          
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4">
            Brand Builder
            <span className="block text-indigo-600 text-xl md:text-2xl mt-2 font-semibold">El Repte de Creació de Marca</span>
          </h1>
          
          <p className="text-slate-600 mb-8 text-lg leading-relaxed">
            Benvingut/da al departament de màrqueting. La teva missió és posar ordre en el caos. 
            Tenim les <strong>6 fases</strong> de creació d'una marca, però les definicions i els exemples s'han barrejat.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8 text-left">
            <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
              <div className="flex items-center gap-3 mb-2">
                <Brain className="text-blue-500" size={20} />
                <h3 className="font-bold text-slate-800">Associa Conceptes</h3>
              </div>
              <p className="text-sm text-slate-600">Llegeix atentament les targetes de definició i col·loca-les a la fase correcta.</p>
            </div>
            <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
              <div className="flex items-center gap-3 mb-2">
                <Target className="text-orange-500" size={20} />
                <h3 className="font-bold text-slate-800">Exemple Real (Nike)</h3>
              </div>
              <p className="text-sm text-slate-600">Comprova com la teoria s'aplica a la realitat amb la història de Nike.</p>
            </div>
          </div>

          <button 
            onClick={onStart}
            className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-white transition-all duration-200 bg-indigo-600 rounded-full hover:bg-indigo-700 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-600"
          >
            Començar el Repte
            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
        <div className="bg-slate-100 px-6 py-4 text-center text-xs text-slate-500 font-medium">
          Projecte Artífex
        </div>
      </div>
    </div>
  );
};
import React from 'react';
import { Diamond, ArrowRight, Palette, Type, PenTool } from 'lucide-react';

interface WelcomeProps {
  onStart: () => void;
}

export const Welcome: React.FC<WelcomeProps> = ({ onStart }) => {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-center">
      <div className="max-w-5xl w-full animate-fade-in py-10">
        <div className="mb-10 flex justify-center">
          <div className="bg-black text-white p-8 rounded-3xl shadow-2xl rotate-3 transition-transform hover:rotate-0">
            <Diamond size={80} strokeWidth={1.5} />
          </div>
        </div>

        <h1 className="text-6xl md:text-8xl font-extrabold tracking-tight text-gray-900 mb-6">
          PROJECTE <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">ARTÍFEX</span>
        </h1>
        
        <p className="text-2xl md:text-3xl text-gray-600 max-w-3xl mx-auto mb-16 font-light leading-relaxed">
          Benvingut/da al mòdul de <strong>Tipografia</strong>. <br/>
          Aquí aprendràs com la lletra que tries per a la teva marca de joieria parla abans que les paraules.
        </p>

        <div className="grid md:grid-cols-3 gap-8 mb-20 text-left">
          <div className="bg-slate-50 p-8 rounded-3xl border-2 border-slate-100 hover:border-indigo-200 hover:shadow-xl transition-all">
            <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-600 mb-6">
              <Type size={32} />
            </div>
            <h3 className="text-2xl font-bold mb-3">1. La Teoria</h3>
            <p className="text-gray-600 text-lg">Entendrem els 4 grans grups tipogràfics i quines emocions amaga cadascun.</p>
          </div>

          <div className="bg-slate-50 p-8 rounded-3xl border-2 border-slate-100 hover:border-green-200 hover:shadow-xl transition-all">
            <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center text-green-600 mb-6">
              <PenTool size={32} />
            </div>
            <h3 className="text-2xl font-bold mb-3">2. La Pràctica</h3>
            <p className="text-gray-600 text-lg">Posarem a prova el teu ull de dissenyador amb 5 reptes reals.</p>
          </div>

          <div className="bg-slate-50 p-8 rounded-3xl border-2 border-slate-100 hover:border-purple-200 hover:shadow-xl transition-all">
            <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center text-purple-600 mb-6">
              <Palette size={32} />
            </div>
            <h3 className="text-2xl font-bold mb-3">3. El Laboratori</h3>
            <p className="text-gray-600 text-lg">Experimentaràs amb la teva pròpia marca Artífex sense límits.</p>
          </div>
        </div>

        <button 
          onClick={onStart}
          className="group relative inline-flex items-center justify-center px-10 py-6 font-bold text-white transition-all duration-200 bg-black text-2xl rounded-full focus:outline-none focus:ring-4 focus:ring-offset-4 focus:ring-gray-900 hover:bg-gray-800 hover:scale-105"
        >
          Començar l'Aventura
          <ArrowRight className="ml-3 w-8 h-8 group-hover:translate-x-2 transition-transform" />
        </button>
      </div>
    </div>
  );
};
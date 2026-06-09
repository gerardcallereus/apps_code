import React, { useState } from 'react';
import { Game } from './components/Game';
import { Theory } from './components/Theory';
import { BookOpen, Gamepad2, Lightbulb } from 'lucide-react';

const App: React.FC = () => {
  const [view, setView] = useState<'game' | 'theory'>('theory');

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-yellow-200">
      
      {/* Header */}
      <header className="bg-slate-900 text-white shadow-lg sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-yellow-500 p-2 rounded-full text-slate-900">
                <Lightbulb size={24} strokeWidth={2.5} />
            </div>
            <div>
                <h1 className="text-2xl font-black tracking-tight text-white">ElectroConnecta</h1>
                <p className="text-xs text-slate-400 uppercase tracking-widest font-semibold">Ciències - 6è Primària</p>
            </div>
          </div>
          
          <nav className="flex gap-2 bg-slate-800 p-1 rounded-lg">
            <button 
              onClick={() => setView('theory')}
              className={`flex items-center gap-2 px-6 py-2 rounded-md font-bold transition-all ${view === 'theory' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:text-white hover:bg-slate-700'}`}
            >
              <BookOpen size={18} />
              Teoria
            </button>
            <button 
              onClick={() => setView('game')}
              className={`flex items-center gap-2 px-6 py-2 rounded-md font-bold transition-all ${view === 'game' ? 'bg-yellow-500 text-slate-900 shadow-lg' : 'text-slate-400 hover:text-white hover:bg-slate-700'}`}
            >
              <Gamepad2 size={18} />
              Jugar
            </button>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="py-8 px-4">
        <div className="max-w-6xl mx-auto animate-fade-in-up">
          {view === 'theory' ? <Theory /> : <Game />}
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-12 py-6 text-center text-slate-400 text-sm">
        <p>© 2024 ElectroConnecta - Fet per aprendre!</p>
      </footer>

      {/* Tailwind Utility for Animations (simulated since we can't add custom css file) */}
      <style>{`
        @keyframes fade-in-up {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
            animation: fade-in-up 0.5s ease-out forwards;
        }
        @keyframes fade-in {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        .animate-fade-in {
            animation: fade-in 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default App;

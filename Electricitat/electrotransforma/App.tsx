import React, { useState } from 'react';
import { AppView } from './types';
import Theory from './components/Theory';
import Game from './components/Game';
import { Zap, BookOpen, PlayCircle, Home } from 'lucide-react';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<AppView>('home');

  const renderContent = () => {
    switch (currentView) {
      case 'theory':
        return <Theory />;
      case 'game':
        return <Game />;
      default:
        return (
          <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4 animate-fade-in">
            <div className="bg-indigo-100 p-6 rounded-full mb-8">
              <Zap size={64} className="text-indigo-600" />
            </div>
            <h1 className="text-4xl md:text-6xl font-black text-slate-800 mb-6 tracking-tight">
              Aprèn les <br/>
              <span className="text-indigo-600">Transformacions d'Energia</span>
            </h1>
            <p className="text-lg text-slate-600 max-w-xl mb-10 leading-relaxed">
              Descobreix com l'electricitat es converteix en llum, calor, moviment i so. 
              Estudia la teoria i després posa a prova els teus coneixements.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
              <button
                onClick={() => setCurrentView('theory')}
                className="flex-1 flex items-center justify-center gap-3 bg-white border-2 border-indigo-100 hover:border-indigo-300 hover:shadow-lg text-indigo-700 font-bold py-4 px-6 rounded-xl transition-all"
              >
                <BookOpen size={24} />
                Estudiar Teoria
              </button>
              <button
                onClick={() => setCurrentView('game')}
                className="flex-1 flex items-center justify-center gap-3 bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg hover:shadow-indigo-200/50 font-bold py-4 px-6 rounded-xl transition-all"
              >
                <PlayCircle size={24} />
                Jugar Ara
              </button>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Navbar */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div 
            className="flex items-center gap-2 cursor-pointer" 
            onClick={() => setCurrentView('home')}
          >
            <div className="bg-indigo-600 text-white p-1.5 rounded-lg">
              <Zap size={20} />
            </div>
            <span className="font-bold text-xl text-slate-800 tracking-tight">ElectroTransforma</span>
          </div>
          
          <div className="flex gap-2">
            <button 
              onClick={() => setCurrentView('home')}
              className={`p-2 rounded-lg transition-colors ${currentView === 'home' ? 'bg-slate-100 text-indigo-600' : 'text-slate-500 hover:bg-slate-50'}`}
              title="Inici"
            >
              <Home size={20} />
            </button>
            <button 
              onClick={() => setCurrentView('theory')}
              className={`p-2 rounded-lg transition-colors ${currentView === 'theory' ? 'bg-slate-100 text-indigo-600' : 'text-slate-500 hover:bg-slate-50'}`}
              title="Teoria"
            >
              <BookOpen size={20} />
            </button>
            <button 
              onClick={() => setCurrentView('game')}
              className={`p-2 rounded-lg transition-colors ${currentView === 'game' ? 'bg-slate-100 text-indigo-600' : 'text-slate-500 hover:bg-slate-50'}`}
              title="Joc"
            >
              <PlayCircle size={20} />
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-grow container mx-auto px-4 py-8">
        {renderContent()}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 mt-auto">
        <div className="max-w-6xl mx-auto px-4 text-center text-slate-400 text-sm">
          <p>© {new Date().getFullYear()} ElectroTransforma. Educació Científica Interactiva.</p>
        </div>
      </footer>
    </div>
  );
};

export default App;
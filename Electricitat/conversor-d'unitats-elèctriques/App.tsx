import React, { useState } from 'react';
import Header from './components/Header';
import Theory from './components/Theory';
import Practice from './components/Practice';
import Examples from './components/Examples';

type View = 'theory' | 'examples' | 'practice';

const App: React.FC = () => {
  const [view, setView] = useState<View>('theory');

  const navButtonClasses = "px-6 py-2 rounded-md font-semibold transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900";
  const activeClasses = "bg-cyan-500 text-white shadow-lg";
  const inactiveClasses = "bg-slate-700 hover:bg-slate-600 text-slate-300";

  return (
    <div className="min-h-screen font-sans">
      <Header />
      <main className="container mx-auto px-4 py-6 max-w-4xl">
        <nav className="flex flex-wrap justify-center items-center gap-4 mb-8 p-2 bg-slate-800 rounded-lg shadow-inner">
          <button
            onClick={() => setView('theory')}
            className={`${navButtonClasses} ${view === 'theory' ? activeClasses : inactiveClasses}`}
          >
            Teoria
          </button>
          <button
            onClick={() => setView('examples')}
            className={`${navButtonClasses} ${view === 'examples' ? activeClasses : inactiveClasses}`}
          >
            Exemples
          </button>
          <button
            onClick={() => setView('practice')}
            className={`${navButtonClasses} ${view === 'practice' ? activeClasses : inactiveClasses}`}
          >
            Pràctica
          </button>
        </nav>

        {view === 'theory' && <Theory />}
        {view === 'examples' && <Examples />}
        {view === 'practice' && <Practice />}

        <footer className="text-center mt-10 text-slate-500 text-sm">
            <p>Creat per a l'aprenentatge i la pràctica de l'electrònica.</p>
        </footer>
      </main>
    </div>
  );
};

export default App;
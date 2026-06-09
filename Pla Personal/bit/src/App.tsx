import { useState } from 'react';
import IntroModule from './components/IntroModule';
import BinaryModule from './components/BinaryModule';
import LogicGatesModule from './components/LogicGatesModule';
import LogicCombinationsModule from './components/LogicCombinationsModule';
import FinalChallengeModule from './components/FinalChallengeModule';

export default function App() {
  const [activeModule, setActiveModule] = useState(0);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const modules = [
    { title: 'Introducció', subtitle: 'Per què això?', emoji: '👋' },
    { title: 'El Sistema Binari', subtitle: 'Habilitats 101', emoji: '🖐️' },
    { title: 'Portes Lògiques', subtitle: 'Els interruptors', emoji: '🚪' },
    { title: 'Circuits Combinats', subtitle: 'Apilant portes', emoji: '🔗' },
    { title: 'Repte Final', subtitle: 'Escape Room', emoji: '🏆', requiresUnlock: true },
  ];

  const CurrentComponent = [IntroModule, BinaryModule, LogicGatesModule, LogicCombinationsModule, FinalChallengeModule][activeModule];

  return (
    <div className="flex h-screen w-full bg-cyan-50 font-sans overflow-hidden text-slate-800">
      {/* Mobile Header */}
      <div className="md:hidden bg-white text-slate-800 p-4 border-b-4 border-slate-800 flex items-center justify-between shadow-[0_4px_0_rgba(30,41,59,1)] z-30 shrink-0">
        <div className="flex items-center gap-2 font-black text-xl tracking-tight uppercase">
          <span className="text-2xl bg-yellow-400 border-2 border-slate-800 rounded-lg p-1 shadow-sm">⚡</span> Electrònica
        </div>
        <button 
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-2 bg-slate-100 rounded-xl text-slate-800 border-4 border-slate-800 shadow-[2px_2px_0px_rgba(30,41,59,1)] hover:bg-yellow-300 font-bold transition-colors active:translate-y-1 active:shadow-none"
        >
          {isSidebarOpen ? '✖' : '☰'}
        </button>
      </div>

      {/* Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 z-20 md:hidden backdrop-blur-sm"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`
          fixed md:relative top-0 left-0 h-screen bg-white w-80 shrink-0 z-30 border-r-4 border-slate-800 shadow-[4px_0_0_rgba(30,41,59,1)]
          transition-transform duration-300 ease-in-out flex flex-col pt-16 md:pt-0
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        `}
      >
        <div className="p-8 hidden md:block border-b-4 border-slate-800 bg-yellow-300">
          <h1 className="text-slate-800 text-2xl font-black flex items-center gap-2 tracking-tight uppercase">
             <span className="text-3xl bg-white border-2 border-slate-800 rounded-xl p-1 shadow-sm -rotate-6">⚡</span> Digital
          </h1>
          <p className="text-xs mt-2 uppercase tracking-widest text-slate-800 font-black bg-white inline-block px-2 py-1 rounded border-2 border-slate-800 shadow-sm">Camp d'Entrenament</p>
        </div>
        
        <nav className="flex-1 px-4 py-8 space-y-4 overflow-y-auto">
          {modules.map((mod, idx) => {
            const isActive = activeModule === idx;
            return (
              <div
                key={idx}
                onClick={() => {
                  setActiveModule(idx);
                  setIsSidebarOpen(false);
                }}
                className={`flex items-center gap-4 p-4 rounded-2xl cursor-pointer transition-all border-4 shadow-[4px_4px_0px_rgba(30,41,59,1)] group ${
                  isActive 
                    ? 'bg-blue-500 text-white border-slate-800 -translate-y-1' 
                    : 'bg-white text-slate-800 border-slate-800 hover:bg-yellow-100 hover:-translate-y-0.5'
                }`}
              >
                <span className={`text-3xl ${!isActive && 'grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100'} transition-all`}>{mod.emoji}</span>
                <div className="flex-1">
                  <p className={`text-base uppercase ${isActive ? 'font-black text-white' : 'font-black text-slate-800'}`}>{mod.title}</p>
                  <p className={`text-xs font-bold ${isActive ? 'text-blue-100' : 'text-slate-500'}`}>{mod.subtitle}</p>
                </div>
                {mod.requiresUnlock && !isActive && <span className="text-xl opacity-50 bg-slate-200 border-2 border-slate-400 rounded-full w-8 h-8 flex items-center justify-center">🔒</span>}
              </div>
            )
          })}
        </nav>

        <div className="p-6 bg-slate-100 border-t-4 border-slate-800 shrink-0 hidden md:block">
          <div className="flex justify-between text-xs mb-3 uppercase font-black tracking-widest text-slate-800">
            <span>Nivell d'Energia</span>
            <span className="text-blue-600 bg-white px-2 py-0.5 rounded-md border-2 border-slate-800">{Math.round(((activeModule + 1) / modules.length) * 100)}%</span>
          </div>
          <div className="w-full bg-white border-4 border-slate-800 h-6 rounded-full overflow-hidden p-0.5">
            <div 
              className="bg-green-400 h-full rounded-full border-r-4 border-slate-800 transition-all duration-500 ease-out" 
              style={{ width: `${((activeModule + 1) / modules.length) * 100}%` }}
            ></div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col relative h-full md:h-screen w-full">
        <CurrentComponent />
      </main>
    </div>
  );
}

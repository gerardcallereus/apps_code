import React, { useState } from 'react';
import { AppStage } from './types';
import { Welcome } from './components/Welcome';
import { Theory } from './components/Theory';
import { Practice } from './components/Practice';
import { Experiment } from './components/Experiment';
import { BookOpen, Target, FlaskConical, Diamond } from 'lucide-react';

const App: React.FC = () => {
  const [currentStage, setCurrentStage] = useState<AppStage>(AppStage.WELCOME);
  const [completedTheory, setCompletedTheory] = useState(false);
  const [completedPractice, setCompletedPractice] = useState(false);

  const startApp = () => {
    setCurrentStage(AppStage.THEORY);
  };

  const handleTheoryComplete = () => {
    setCompletedTheory(true);
    setCurrentStage(AppStage.PRACTICE);
  };

  const handlePracticeComplete = () => {
    setCompletedPractice(true);
    setCurrentStage(AppStage.EXPERIMENT);
  };

  // If we are in the welcome screen, render only that
  if (currentStage === AppStage.WELCOME) {
    return <Welcome onStart={startApp} />;
  }

  return (
    <div className="min-h-screen bg-slate-50 text-gray-900 font-sans pb-20">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        {/* Widened container from max-w-6xl to w-full with padding */}
        <div className="w-full px-6 md:px-10 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setCurrentStage(AppStage.WELCOME)}>
            <div className="bg-black text-white p-2 rounded-lg hover:rotate-12 transition-transform">
              <Diamond size={24} />
            </div>
            <div>
              <h1 className="text-xl font-extrabold tracking-tight">PROJECTE ARTÍFEX</h1>
              <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">Mòdul de Tipografia</p>
            </div>
          </div>
          
          <nav className="hidden md:flex gap-2 bg-gray-100 p-1 rounded-full">
            <button 
              onClick={() => setCurrentStage(AppStage.THEORY)}
              className={`px-5 py-2 rounded-full text-sm font-bold transition-all flex items-center gap-2 ${currentStage === AppStage.THEORY ? 'bg-white text-black shadow-sm' : 'text-gray-500 hover:text-gray-900'}`}
            >
              <BookOpen size={16} />
              1. Teoria
            </button>
            
            <button 
              onClick={() => completedTheory && setCurrentStage(AppStage.PRACTICE)}
              disabled={!completedTheory}
              className={`px-5 py-2 rounded-full text-sm font-bold transition-all flex items-center gap-2 ${currentStage === AppStage.PRACTICE ? 'bg-white text-black shadow-sm' : 'text-gray-500'} ${!completedTheory ? 'opacity-40 cursor-not-allowed' : 'hover:text-gray-900'}`}
            >
              <Target size={16} />
              2. Pràctica
            </button>
            
            <button 
              onClick={() => completedPractice && setCurrentStage(AppStage.EXPERIMENT)}
              disabled={!completedPractice}
              className={`px-5 py-2 rounded-full text-sm font-bold transition-all flex items-center gap-2 ${currentStage === AppStage.EXPERIMENT ? 'bg-white text-black shadow-sm' : 'text-gray-500'} ${!completedPractice ? 'opacity-40 cursor-not-allowed' : 'hover:text-gray-900'}`}
            >
              <FlaskConical size={16} />
              3. Lab
            </button>
          </nav>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="pt-8">
        {currentStage === AppStage.THEORY && (
          <Theory onComplete={handleTheoryComplete} />
        )}

        {currentStage === AppStage.PRACTICE && (
          <Practice onComplete={handlePracticeComplete} />
        )}

        {currentStage === AppStage.EXPERIMENT && (
          <Experiment />
        )}
      </main>

      {/* Mobile Footer Nav */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md border-t border-gray-200 p-2 flex justify-around z-40 pb-6 pt-3">
        <button 
          onClick={() => setCurrentStage(AppStage.THEORY)}
          className={`flex flex-col items-center p-2 rounded-lg ${currentStage === AppStage.THEORY ? 'text-black bg-gray-100' : 'text-gray-400'}`}
        >
          <BookOpen size={20} />
          <span className="text-[10px] mt-1 font-bold uppercase">Teoria</span>
        </button>
        <button 
          onClick={() => completedTheory && setCurrentStage(AppStage.PRACTICE)}
          disabled={!completedTheory}
          className={`flex flex-col items-center p-2 rounded-lg ${currentStage === AppStage.PRACTICE ? 'text-black bg-gray-100' : 'text-gray-400'} ${!completedTheory && 'opacity-30'}`}
        >
          <Target size={20} />
          <span className="text-[10px] mt-1 font-bold uppercase">Pràctica</span>
        </button>
        <button 
          onClick={() => completedPractice && setCurrentStage(AppStage.EXPERIMENT)}
          disabled={!completedPractice}
          className={`flex flex-col items-center p-2 rounded-lg ${currentStage === AppStage.EXPERIMENT ? 'text-black bg-gray-100' : 'text-gray-400'} ${!completedPractice && 'opacity-30'}`}
        >
          <FlaskConical size={20} />
          <span className="text-[10px] mt-1 font-bold uppercase">Lab</span>
        </button>
      </div>

    </div>
  );
};

export default App;
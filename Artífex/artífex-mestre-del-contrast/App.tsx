import React, { useState } from 'react';
import { AppView } from './types';
import { Theory } from './components/Theory';
import { Playground } from './components/Playground';
import { Quiz } from './components/Quiz';
import { Eye, BookOpen, Play, Home, Award, Lock } from 'lucide-react';

const App: React.FC = () => {
  const [view, setView] = useState<AppView>(AppView.HOME);
  const [theoryCompleted, setTheoryCompleted] = useState(false);

  const handleTheoryComplete = () => {
    setTheoryCompleted(true);
    setView(AppView.QUIZ);
  };

  const handleLockedClick = () => {
    alert("Has de completar la part teòrica primer!");
  };

  const renderContent = () => {
    switch (view) {
      case AppView.HOME:
        return (
          <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-8 animate-fade-in">
            <div className="bg-white p-4 rounded-full shadow-xl mb-4">
              <Eye size={64} className="text-indigo-600" />
            </div>
            <h1 className="text-5xl font-extrabold text-slate-900 tracking-tight">
              Mestre del <span className="text-indigo-600">Contrast</span>
            </h1>
            <p className="text-xl text-slate-600 max-w-lg mx-auto leading-relaxed">
              Aprèn a combinar colors accessibles, entén les normes WCAG i posa a prova el teu ull de dissenyador.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
              <button 
                onClick={() => setView(AppView.THEORY)}
                className="flex-1 flex items-center justify-center gap-2 bg-white border-2 border-slate-200 hover:border-indigo-600 hover:text-indigo-600 text-slate-700 px-8 py-4 rounded-xl font-bold text-lg transition-all"
              >
                <BookOpen size={20} /> {theoryCompleted ? "Repassar Teoria" : "Començar Teoria"}
              </button>
              
              <button 
                onClick={() => theoryCompleted ? setView(AppView.QUIZ) : handleLockedClick()}
                className={`flex-1 flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-bold text-lg transition-all ${
                    theoryCompleted 
                    ? "bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg hover:shadow-indigo-200" 
                    : "bg-slate-200 text-slate-400 cursor-not-allowed"
                }`}
              >
                {theoryCompleted ? <Play size={20} /> : <Lock size={20} />} Jugar
              </button>
            </div>
            {!theoryCompleted && (
                <p className="text-sm text-slate-400 italic">Completa la teoria per desbloquejar el joc.</p>
            )}
          </div>
        );
      case AppView.THEORY:
        return <Theory onComplete={handleTheoryComplete} />;
      case AppView.PLAYGROUND:
        return <Playground />;
      case AppView.QUIZ:
        return <Quiz onFinish={() => setView(AppView.PLAYGROUND)} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-indigo-100 selection:text-indigo-800">
      {/* Navigation Bar */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <button 
            onClick={() => setView(AppView.HOME)}
            className="flex items-center gap-2 font-bold text-xl text-slate-800 hover:text-indigo-600 transition-colors"
          >
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white">
                <Eye size={18} />
            </div>
            <span>Contrast<span className="text-indigo-600">Master</span></span>
          </button>

          <div className="hidden md:flex gap-1">
            <NavButton 
                active={view === AppView.THEORY} 
                onClick={() => setView(AppView.THEORY)} 
                icon={<BookOpen size={18} />} 
                label="Teoria" 
            />
             <NavButton 
                active={view === AppView.QUIZ} 
                onClick={() => theoryCompleted ? setView(AppView.QUIZ) : handleLockedClick()} 
                icon={theoryCompleted ? <Award size={18} /> : <Lock size={16} />} 
                label="Quiz" 
                disabled={!theoryCompleted}
            />
            <NavButton 
                active={view === AppView.PLAYGROUND} 
                onClick={() => theoryCompleted ? setView(AppView.PLAYGROUND) : handleLockedClick()} 
                icon={theoryCompleted ? <Play size={18} /> : <Lock size={16} />} 
                label="Laboratori" 
                disabled={!theoryCompleted}
            />
          </div>
          
          {/* Mobile nav placeholder (simplified) */}
          <div className="md:hidden">
              <button onClick={() => setView(AppView.HOME)} className="p-2 text-slate-600"><Home/></button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto py-8 px-4">
        {renderContent()}
      </main>
    </div>
  );
};

const NavButton: React.FC<{ active: boolean; onClick: () => void; icon: React.ReactNode; label: string; disabled?: boolean }> = ({ active, onClick, icon, label, disabled }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`px-4 py-2 rounded-lg flex items-center gap-2 font-medium transition-all ${
      active 
        ? 'bg-indigo-50 text-indigo-700' 
        : disabled 
            ? 'text-slate-400 cursor-not-allowed' 
            : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
    }`}
  >
    {icon}
    {label}
  </button>
);

export default App;
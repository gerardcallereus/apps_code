import React, { useState } from 'react';
import ReferenceMode from './components/ReferenceMode';
import QuizMode from './components/QuizMode';
import { AppMode } from './types';

const App: React.FC = () => {
  const [mode, setMode] = useState<AppMode>(AppMode.REFERENCE);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <svg className="w-8 h-8 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-amber-600 to-amber-500">
              ElectroCircuit
            </h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="w-full">
        {mode === AppMode.REFERENCE && <ReferenceMode />}
        {mode === AppMode.QUIZ && <QuizMode />}
      </main>

      {/* Navigation Bar (Sticky Bottom) */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 pb-safe z-50">
        <div className="max-w-4xl mx-auto flex justify-around items-center h-16">
          <button
            onClick={() => setMode(AppMode.REFERENCE)}
            className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors ${
              mode === AppMode.REFERENCE ? 'text-amber-600' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            <span className="text-xs font-medium">Símbols</span>
          </button>

          <button
            onClick={() => setMode(AppMode.QUIZ)}
            className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors ${
              mode === AppMode.QUIZ ? 'text-amber-600' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-xs font-medium">Test</span>
          </button>
        </div>
      </nav>
    </div>
  );
};

export default App;
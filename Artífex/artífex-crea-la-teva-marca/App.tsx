import React, { useState } from 'react';
import { Intro } from './components/Intro';
import { Game } from './components/Game';
import { Victory } from './components/Victory';

enum View {
  INTRO,
  GAME,
  VICTORY
}

export default function App() {
  const [currentView, setCurrentView] = useState<View>(View.INTRO);
  const [finalAttempts, setFinalAttempts] = useState(0);

  const handleStart = () => {
    setCurrentView(View.GAME);
  };

  const handleComplete = (attempts: number) => {
    setFinalAttempts(attempts);
    setCurrentView(View.VICTORY);
  };

  const handleReset = () => {
    setFinalAttempts(0);
    setCurrentView(View.INTRO);
  };

  return (
    <div className="antialiased text-slate-900 bg-slate-50 min-h-screen">
      {currentView === View.INTRO && <Intro onStart={handleStart} />}
      {currentView === View.GAME && <Game onComplete={handleComplete} />}
      {currentView === View.VICTORY && <Victory attempts={finalAttempts} onReset={handleReset} />}
    </div>
  );
}
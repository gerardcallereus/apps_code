import React, { useState } from 'react';
import Header from './components/Header';
import Theory from './components/Theory';
import Exercises from './components/Simulator';
import { AppSection } from './types';

const App: React.FC = () => {
  const [currentSection, setCurrentSection] = useState<AppSection>(AppSection.THEORY);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-blue-200">
      <Header currentSection={currentSection} setSection={setCurrentSection} />
      
      <main className="container mx-auto py-8 px-4">
        {currentSection === AppSection.THEORY && <Theory />}
        {currentSection === AppSection.EXERCISES && <Exercises />}
      </main>
    </div>
  );
};

export default App;
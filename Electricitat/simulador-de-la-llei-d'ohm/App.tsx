
import React, { useState } from 'react';
import { Explanation } from './components/Explanation';
import { OhmLawSimulator } from './components/OhmLawSimulator';
import { Examples } from './components/Examples';
import { Exercises } from './components/Exercises';

type Tab = 'explanation' | 'simulator' | 'examples' | 'exercises';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('explanation');

  const renderContent = () => {
    switch (activeTab) {
      case 'explanation':
        return <Explanation />;
      case 'simulator':
        return <OhmLawSimulator />;
      case 'examples':
        return <Examples />;
      case 'exercises':
        return <Exercises />;
      default:
        return <Explanation />;
    }
  };

  const TabButton: React.FC<{ tabName: Tab; label: string }> = ({ tabName, label }) => (
    <button
      onClick={() => setActiveTab(tabName)}
      className={`px-4 py-2 text-sm md:text-base font-medium rounded-t-lg transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
        activeTab === tabName
          ? 'bg-white text-blue-600 border-b-2 border-blue-600'
          : 'bg-transparent text-slate-600 hover:bg-slate-200'
      }`}
    >
      {label}
    </button>
  );

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800">
      <header className="bg-white shadow-md">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
                <h1 className="text-2xl md:text-3xl font-bold text-blue-700">
                Simulador de la Llei d'Ohm
                </h1>
            </div>
        </div>
      </header>

      <main className="container mx-auto p-4 sm:p-6 lg:p-8">
        <div className="w-full">
          <nav className="flex border-b border-slate-300 -mt-2">
            <TabButton tabName="explanation" label="Explicació" />
            <TabButton tabName="simulator" label="Simulador" />
            <TabButton tabName="examples" label="Exemples" />
            <TabButton tabName="exercises" label="Exercicis" />
          </nav>
          <div className="bg-white rounded-b-lg shadow-lg p-6 md:p-8 mt-0">
            {renderContent()}
          </div>
        </div>
      </main>

       <footer className="text-center py-4 text-slate-500 text-sm">
        <p>Creat per entendre la Llei d'Ohm de manera interactiva.</p>
      </footer>
    </div>
  );
};

export default App;

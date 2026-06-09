import { useState } from 'react';
import { ViewState } from './types';
import Navigation from './components/Navigation';
import TeoriaView from './views/TeoriaView';
import SimuladorView from './views/SimuladorView';
import SeparacioView from './views/SeparacioView';
import AtomicView from './views/AtomicView';
import ActivitatsView from './views/ActivitatsView';
import VocabulariView from './views/VocabulariView';
import { Beaker } from 'lucide-react';

export default function App() {
  const [currentView, setCurrentView] = useState<ViewState>('teoria');

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900">
      {/* Header */}
      <header className="bg-indigo-600 text-white shadow-md z-10 p-4 sticky top-0">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-2 rounded-lg">
              <Beaker className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Projecte Xoc Químic</h1>
              <p className="text-indigo-200 text-sm font-medium">Substàncies i Mescles - 2n d'ESO</p>
            </div>
          </div>
          <Navigation currentView={currentView} setCurrentView={setCurrentView} />
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow w-full max-w-7xl mx-auto p-4 md:p-6 lg:p-8">
        {currentView === 'teoria' && <TeoriaView />}
        {currentView === 'simulador' && <SimuladorView />}
        {currentView === 'separacio' && <SeparacioView />}
        {currentView === 'atomic' && <AtomicView />}
        {currentView === 'activitats' && <ActivitatsView />}
        {currentView === 'vocabulari' && <VocabulariView />}
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-6 text-center text-sm">
        <p>Projecte Educatiu "Xoc Químic" - Coneixement Científic per a l'Alumnat.</p>
      </footer>
    </div>
  );
}

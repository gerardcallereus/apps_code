import React from 'react';
import { DifficultyLevel } from '../types';

type ActiveGameView = 'dashboard' | 'policies' | 'powerPlants' | 'history';

interface MainTabsProps {
    activeView: ActiveGameView;
    setActiveView: (view: ActiveGameView) => void;
    difficulty: DifficultyLevel;
}

const ALL_TABS: { id: ActiveGameView, label: string }[] = [
    { id: 'dashboard', label: 'Panorama General' },
    { id: 'policies', label: 'Polítiques Públiques' },
    { id: 'powerPlants', label: 'Gestió Energètica' },
    { id: 'history', label: 'Historial i Anàlisi' },
];

const MainTabs: React.FC<MainTabsProps> = ({ activeView, setActiveView, difficulty }) => {
    
    const visibleTabs = ALL_TABS.filter(tab => {
        if (difficulty === DifficultyLevel.Easy && tab.id === 'policies') {
            return false;
        }
        return true;
    });

    return (
        <nav className="bg-white p-2 rounded-lg shadow-md border border-slate-200">
            <div className="flex items-center justify-center space-x-2 sm:space-x-4">
                {visibleTabs.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveView(tab.id)}
                        className={`w-full sm:w-auto font-semibold py-2 px-4 rounded-md transition-colors duration-300 text-sm sm:text-base ${
                            activeView === tab.id
                                ? 'bg-teal-600 text-white shadow-sm'
                                : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                        }`}
                        aria-current={activeView === tab.id ? 'page' : undefined}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>
        </nav>
    );
};

export default MainTabs;
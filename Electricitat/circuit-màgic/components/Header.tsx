import React from 'react';
import { AppSection } from '../types';
import { BookOpen, CheckSquare } from 'lucide-react';

interface HeaderProps {
  currentSection: AppSection;
  setSection: (section: AppSection) => void;
}

const Header: React.FC<HeaderProps> = ({ currentSection, setSection }) => {
  const navItems = [
    { id: AppSection.THEORY, label: 'Teoria', icon: BookOpen, color: 'text-blue-500' },
    { id: AppSection.EXERCISES, label: 'Exercicis', icon: CheckSquare, color: 'text-green-500' },
  ];

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-green-500 rounded-lg flex items-center justify-center shadow-lg transform -rotate-3">
              <CheckSquare className="text-white w-6 h-6" />
            </div>
            <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-green-600">
              Circuit Màgic
            </h1>
          </div>
          
          <nav className="flex bg-slate-100 p-1 rounded-xl">
            {navItems.map((item) => {
              const isActive = currentSection === item.id;
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setSection(item.id)}
                  className={`flex items-center gap-2 px-6 py-2 rounded-lg font-semibold transition-all duration-200 ${
                    isActive 
                      ? 'bg-white text-slate-800 shadow-md transform scale-105' 
                      : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  <Icon className={`w-5 h-5 ${isActive ? item.color : ''}`} />
                  {item.label}
                </button>
              );
            })}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
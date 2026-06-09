import { ViewState } from '../types';
import { BookOpen, FlaskConical, Gamepad2, GraduationCap, Filter, Microscope } from 'lucide-react';
import { cn } from '../lib/utils';
import { motion } from 'motion/react';

interface Props {
  currentView: ViewState;
  setCurrentView: (view: ViewState) => void;
}

const NAV_ITEMS = [
  { id: 'teoria', label: 'Teoria', icon: BookOpen },
  { id: 'atomic', label: 'Atoms', icon: Microscope },
  { id: 'simulador', label: 'Laboratori', icon: FlaskConical },
  { id: 'separacio', label: 'Separació', icon: Filter },
  { id: 'activitats', label: 'Activitats', icon: Gamepad2 },
  { id: 'vocabulari', label: 'Glossari', icon: GraduationCap },
] as const;

export default function Navigation({ currentView, setCurrentView }: Props) {
  return (
    <nav className="flex items-center gap-1 bg-indigo-700/50 p-1 rounded-xl w-full md:w-auto overflow-x-auto no-scrollbar">
      {NAV_ITEMS.map(({ id, label, icon: Icon }) => {
        const isActive = currentView === id;
        return (
          <button
            key={id}
            onClick={() => setCurrentView(id as ViewState)}
            className={cn(
              'relative flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors whitespace-nowrap',
              isActive ? 'text-indigo-700' : 'text-indigo-100 hover:text-white hover:bg-indigo-500/50'
            )}
          >
            {isActive && (
              <motion.div
                layoutId="nav-pill"
                className="absolute inset-0 bg-white rounded-lg shadow-sm"
                initial={false}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              />
            )}
            <span className="relative z-10 flex items-center gap-2">
              <Icon className="w-4 h-4" />
              {label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}

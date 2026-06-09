import React from 'react';
import { DraggableItem, CardType } from '../types';
import { BookOpen, Trophy } from 'lucide-react';

interface CardProps {
  item: DraggableItem;
  isSelected: boolean;
  onClick: () => void;
  className?: string;
  isPlaced?: boolean;
}

export const Card: React.FC<CardProps> = ({ item, isSelected, onClick, className = "", isPlaced = false }) => {
  const isDefinition = item.type === CardType.DEFINITION;
  
  return (
    <div
      onClick={onClick}
      className={`
        relative p-3 rounded-lg shadow-sm border-2 cursor-pointer transition-all duration-200 animate-pop-in
        flex flex-col gap-2 h-full
        ${isSelected 
          ? 'border-indigo-500 ring-2 ring-indigo-200 bg-indigo-50 transform scale-[1.02]' 
          : 'border-slate-200 bg-white hover:border-indigo-300 hover:shadow-md'
        }
        ${isPlaced ? 'h-full min-h-[120px]' : 'min-h-[140px] w-full'}
        ${className}
      `}
    >
      <div className="flex items-center gap-2 mb-1">
        <span className={`p-1 rounded-md ${isDefinition ? 'bg-blue-100 text-blue-700' : 'bg-orange-100 text-orange-700'}`}>
          {isDefinition ? <BookOpen size={14} /> : <Trophy size={14} />}
        </span>
        <span className={`text-xs font-bold uppercase tracking-wider ${isDefinition ? 'text-blue-700' : 'text-orange-700'}`}>
          {isDefinition ? 'Definició' : 'Exemple Real'}
        </span>
      </div>
      
      <p className="text-sm text-slate-700 leading-snug overflow-y-auto custom-scrollbar flex-grow">
        {item.content}
      </p>
    </div>
  );
};
import React from 'react';
import type { ColorCode } from '../types';

interface ResistorProps {
  bands: ColorCode[];
}

export const Resistor: React.FC<ResistorProps> = ({ bands }) => {
  return (
    // Se aumentó el margen inferior para hacer espacio para los nombres de los colores
    <div className="flex items-center justify-center mt-8 mb-12 select-none">
      <div className="h-1 w-12 bg-slate-500"></div>
      <div className="relative flex items-center justify-center w-64 h-24 bg-amber-200 rounded-2xl shadow-inner-lg" style={{boxShadow: 'inset 0 2px 8px rgba(0,0,0,0.3)'}}>
        
        {/* Bandas de color */}
        <div className="absolute flex items-center justify-around w-full px-12">
          {bands.map((band, index) => (
            <div
              key={index}
              className={`h-24 w-4 ${band.colorClass} ${band.name === 'Negre' ? 'border-r border-l border-gray-400' : ''}`}
              title={band.name}
            ></div>
          ))}
        </div>
        
        {/* Nombres de los colores */}
        <div className="absolute -bottom-6 flex justify-around w-full px-12">
           {bands.map((band, index) => (
             <div key={`${index}-${band.name}`} className="w-4 text-center">
                <span className="text-xs text-slate-300 font-medium">{band.name}</span>
             </div>
           ))}
        </div>

      </div>
      <div className="h-1 w-12 bg-slate-500"></div>
    </div>
  );
};
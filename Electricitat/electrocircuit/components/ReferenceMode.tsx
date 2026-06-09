import React from 'react';
import { CIRCUIT_ELEMENTS } from '../constants';

const ReferenceMode: React.FC = () => {
  return (
    <div className="pb-24 pt-4 px-4 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-slate-800 mb-6 text-center">Biblioteca de Símbols</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {CIRCUIT_ELEMENTS.map((element) => (
          <div 
            key={element.id} 
            className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow duration-300"
          >
            <div className="h-40 bg-slate-50 flex items-center justify-center p-6 border-b border-slate-100">
              <div className="w-full h-full text-slate-800">
                {element.icon}
              </div>
            </div>
            <div className="p-4">
              <h3 className="font-bold text-lg text-slate-900 mb-1">{element.name}</h3>
              <p className="text-sm text-slate-600 leading-relaxed">{element.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReferenceMode;
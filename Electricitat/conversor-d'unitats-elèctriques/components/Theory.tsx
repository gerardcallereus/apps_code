import React from 'react';
import { MAGNITUDES } from '../constants';
import { Magnitude } from '../types';

const MagnitudeCard: React.FC<{ magnitude: Magnitude }> = ({ magnitude }) => (
  <div className="bg-slate-800 rounded-lg shadow-lg overflow-hidden p-4 hover:shadow-cyan-500/20 transition-shadow duration-300">
    <h3 className="text-xl font-bold text-cyan-400 mb-2">{magnitude.name}</h3>
    <p className="text-slate-400 mb-4">Unitat base: <span className="font-semibold text-slate-300">{magnitude.baseUnit}</span></p>
    <div className="overflow-x-auto">
      <table className="w-full text-left">
        <thead className="border-b-2 border-slate-600">
          <tr>
            <th className="py-2 pr-4 font-semibold text-slate-300">Símbol</th>
            <th className="py-2 pr-4 font-semibold text-slate-300">Nom</th>
            <th className="py-2 pr-4 font-semibold text-slate-300">Multiplicador</th>
          </tr>
        </thead>
        <tbody>
          {magnitude.units.map((unit) => (
            <tr key={unit.symbol} className="border-b border-slate-700 last:border-b-0">
              <td className="py-2 pr-4 font-mono text-cyan-400">{unit.symbol}</td>
              <td className="py-2 pr-4">{unit.name}</td>
              <td className="py-2 pr-4 font-mono">{unit.multiplier.toLocaleString('ca-ES', { maximumFractionDigits: 20 })}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

const UnitScale: React.FC = () => {
  const prefixes = ['Giga (G)', 'Mega (M)', 'kilo (k)', 'Unitat Base', 'mili (m)', 'micro (µ)', 'nano (n)'];
  return (
    <div className="bg-slate-800 p-4 rounded-lg shadow-lg">
      <h3 className="text-xl font-bold text-cyan-400 mb-4 text-center">Escala de Conversió</h3>
      <p className="text-slate-400 text-center mb-6">Per convertir unitats, movem la coma decimal o multipliquem/dividim. Cada "salt" en aquesta escala equival a un factor de 1.000.</p>
      <div className="flex flex-col items-center space-y-2">
        <div className="text-center font-semibold text-slate-300">MÉS GRAN (valor numèric més petit)</div>
        <div className="text-center text-slate-500 text-sm">↓ dividir ÷ 1.000 per pujar ↓</div>
        {prefixes.map((prefix, index) => (
          <React.Fragment key={prefix}>
            <div className="bg-slate-700 w-full max-w-xs text-center py-2 px-4 rounded-md font-mono shadow-md">{prefix}</div>
            {index < prefixes.length - 1 && (
               <div className="h-8 w-px bg-slate-600 relative">
                  <div className="absolute left-full ml-4 top-1/2 -translate-y-1/2 text-cyan-400 text-sm whitespace-nowrap">x 1.000</div>
                  <div className="absolute right-full mr-4 top-1/2 -translate-y-1/2 text-orange-400 text-sm whitespace-nowrap">÷ 1.000</div>
              </div>
            )}
          </React.Fragment>
        ))}
        <div className="text-center text-slate-500 text-sm mt-2">↑ multiplicar x 1.000 per baixar ↑</div>
        <div className="text-center font-semibold text-slate-300">MÉS PETIT (valor numèric més gran)</div>
      </div>
      <ul className="text-slate-400 mt-6 list-disc list-inside space-y-2">
          <li><strong className="text-slate-300">Per anar a una unitat MÉS PETITA</strong> (baixar a l'escala), has de <strong className="text-cyan-400">MULTIPLICAR</strong>. El número resultant serà més gran. <br/><em className="text-sm text-slate-500">Ex: 1 Volt = 1.000 mil·livolts</em></li>
          <li><strong className="text-slate-300">Per anar a una unitat MÉS GRAN</strong> (pujar a l'escala), has de <strong className="text-orange-400">DIVIDIR</strong>. El número resultant serà més petit. <br/><em className="text-sm text-slate-500">Ex: 1.000 Ohms = 1 Kiloohm</em></li>
      </ul>
    </div>
  );
};


const Theory: React.FC = () => {
  return (
    <section>
      <h2 className="text-2xl sm:text-3xl font-bold text-center mb-6 text-slate-100">Teoria i Conceptes Fonamentals</h2>
      
      <div className="mb-10">
        <UnitScale />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {MAGNITUDES.map((mag) => (
          <MagnitudeCard key={mag.name} magnitude={mag} />
        ))}
      </div>
    </section>
  );
};

export default Theory;
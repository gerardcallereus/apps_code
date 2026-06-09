import React from 'react';
import { Lightbulb, Zap, Flame, Settings, BatteryCharging, Music } from 'lucide-react';

const Theory: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto p-6 animate-fade-in">
      <h2 className="text-3xl font-bold text-indigo-700 mb-6 text-center">
        Com es transforma l'energia elèctrica?
      </h2>
      
      <div className="bg-white p-6 rounded-2xl shadow-lg mb-8 border-l-8 border-yellow-400">
        <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
          <Zap className="text-yellow-500" /> Principi de Conservació
        </h3>
        <p className="text-slate-700 text-lg leading-relaxed">
          L'energia no es crea ni es destrueix, només es transforma. L'energia elèctrica és molt útil perquè és fàcil de transportar i es pot convertir fàcilment en moltes altres formes d'energia que fem servir cada dia.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Tèrmica */}
        <div className="bg-orange-50 p-6 rounded-xl border border-orange-100 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3 mb-3">
            <div className="bg-orange-100 p-3 rounded-full text-orange-600">
              <Flame size={24} />
            </div>
            <h4 className="text-xl font-bold text-orange-800">Energia Tèrmica</h4>
          </div>
          <p className="text-slate-600 mb-3">
            Es produeix calor quan el corrent elèctric passa per una resistència. Això s'anomena efecte Joule.
          </p>
          <div className="bg-white p-3 rounded-lg text-sm text-slate-500">
            <strong>Exemples:</strong> Torradora, Estufa elèctrica, Assecador, Planxa.
          </div>
        </div>

        {/* Mecànica */}
        <div className="bg-blue-50 p-6 rounded-xl border border-blue-100 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3 mb-3">
            <div className="bg-blue-100 p-3 rounded-full text-blue-600">
              <Settings size={24} />
            </div>
            <h4 className="text-xl font-bold text-blue-800">Energia Mecànica</h4>
          </div>
          <p className="text-slate-600 mb-3">
            L'electricitat es converteix en moviment (cinètica) mitjançant motors elèctrics i camps magnètics.
          </p>
          <div className="bg-white p-3 rounded-lg text-sm text-slate-500">
            <strong>Exemples:</strong> Ventilador, Batedora, Cotxe elèctric, Rentadora.
          </div>
        </div>

        {/* Lluminosa */}
        <div className="bg-yellow-50 p-6 rounded-xl border border-yellow-100 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3 mb-3">
            <div className="bg-yellow-100 p-3 rounded-full text-yellow-600">
              <Lightbulb size={24} />
            </div>
            <h4 className="text-xl font-bold text-yellow-800">Energia Lluminosa</h4>
          </div>
          <p className="text-slate-600 mb-3">
            Es produeix llum quan l'electricitat excita gasos (fluorescents), escalfa filaments (incandescents) o activa semiconductors (LEDs).
          </p>
          <div className="bg-white p-3 rounded-lg text-sm text-slate-500">
            <strong>Exemples:</strong> Bombetes LED, Pantalles de TV, Semàfors.
          </div>
        </div>

        {/* Química */}
        <div className="bg-green-50 p-6 rounded-xl border border-green-100 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3 mb-3">
            <div className="bg-green-100 p-3 rounded-full text-green-600">
              <BatteryCharging size={24} />
            </div>
            <h4 className="text-xl font-bold text-green-800">Energia Química</h4>
          </div>
          <p className="text-slate-600 mb-3">
            L'energia s'emmagatzema en enllaços químics a través de l'electròlisi o processos de càrrega.
          </p>
          <div className="bg-white p-3 rounded-lg text-sm text-slate-500">
            <strong>Exemples:</strong> Carregar una bateria, Galvanoplàstia.
          </div>
        </div>
        
         {/* Sonora */}
         <div className="bg-purple-50 p-6 rounded-xl border border-purple-100 hover:shadow-md transition-shadow md:col-span-2">
          <div className="flex items-center gap-3 mb-3">
            <div className="bg-purple-100 p-3 rounded-full text-purple-600">
              <Music size={24} />
            </div>
            <h4 className="text-xl font-bold text-purple-800">Energia Sonora</h4>
          </div>
          <p className="text-slate-600 mb-3">
            El corrent elèctric es transforma en vibracions que es propaguen per l'aire com a so.
          </p>
          <div className="bg-white p-3 rounded-lg text-sm text-slate-500">
            <strong>Exemples:</strong> Altaveus, Timbres, Auriculars.
          </div>
        </div>

      </div>
    </div>
  );
};

export default Theory;
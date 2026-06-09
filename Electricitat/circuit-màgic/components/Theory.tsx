import React from 'react';
import { Zap, CircleOff, Circle } from 'lucide-react';

const Theory: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8 animate-fade-in">
      <div className="bg-white rounded-2xl shadow-xl p-8 border-l-8 border-blue-500">
        <h2 className="text-3xl font-bold text-blue-800 mb-4 flex items-center gap-3">
          <Zap className="w-8 h-8 text-yellow-500 fill-yellow-500" />
          Què és un Circuit Elèctric?
        </h2>
        <p className="text-lg text-slate-700 leading-relaxed">
          Imagina un circuit elèctric com una carretera per on viatgen cotxes molt petits anomenats 
          <span className="font-bold text-blue-600"> electrons</span>. Perquè els electrons puguin viatjar i fer funcionar coses (com encendre una llum), necessiten un camí complet sense interrupcions per tornar a casa (la pila).
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Closed Circuit Card */}
        <div className="bg-green-50 rounded-2xl p-6 border-2 border-green-200 shadow-md hover:shadow-lg transition-shadow">
          <div className="flex items-center gap-3 mb-4">
            <Circle className="w-8 h-8 text-green-600 fill-green-200" />
            <h3 className="text-2xl font-bold text-green-800">Circuit Tancat</h3>
          </div>
          <p className="text-slate-700 mb-4">
            En un circuit tancat, el camí està <strong>complet</strong>. Els electrons poden sortir de la pila, passar pels cables i la bombeta, i tornar a la pila.
          </p>
          <ul className="list-disc list-inside text-slate-600 space-y-2 bg-white p-4 rounded-xl">
            <li>L'interruptor està connectat.</li>
            <li>No hi ha cables trencats.</li>
            <li>Resultat: <strong>La bombeta s'encén!</strong> 💡</li>
          </ul>
        </div>

        {/* Open Circuit Card */}
        <div className="bg-red-50 rounded-2xl p-6 border-2 border-red-200 shadow-md hover:shadow-lg transition-shadow">
          <div className="flex items-center gap-3 mb-4">
            <CircleOff className="w-8 h-8 text-red-600" />
            <h3 className="text-2xl font-bold text-red-800">Circuit Obert</h3>
          </div>
          <p className="text-slate-700 mb-4">
            En un circuit obert, el camí està <strong>tallat</strong>. És com un pont llevadís aixecat: els cotxes (electrons) no poden passar.
          </p>
          <ul className="list-disc list-inside text-slate-600 space-y-2 bg-white p-4 rounded-xl">
            <li>L'interruptor està desconnectat (obert).</li>
            <li>O potser un cable està trencat.</li>
            <li>Resultat: <strong>La bombeta NO s'encén.</strong> ❌</li>
          </ul>
        </div>
      </div>

      <div className="bg-yellow-50 rounded-2xl p-6 border border-yellow-200">
        <h3 className="text-xl font-bold text-yellow-800 mb-2">L'Interruptor</h3>
        <p className="text-slate-700">
          L'interruptor és l'element que ens permet controlar el circuit. Quan el premem per encendre la llum, estem <strong>tancant</strong> el circuit (ajuntant els cables). Quan l'apaguem, estem <strong>obrint</strong> el circuit (separant els cables).
        </p>
      </div>
    </div>
  );
};

export default Theory;
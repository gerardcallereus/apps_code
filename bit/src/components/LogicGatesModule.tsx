import React, { useState } from 'react';

type GateType = 'NOT' | 'AND' | 'OR' | 'XOR';

export default function LogicGatesModule() {
  const [gate, setGate] = useState<GateType>('AND');
  const [inputA, setInputA] = useState<boolean>(false);
  const [inputB, setInputB] = useState<boolean>(false);

  const calculateOutput = (g: GateType, a: boolean, b: boolean): boolean => {
    switch (g) {
      case 'NOT': return !a;
      case 'AND': return a && b;
      case 'OR': return a || b;
      case 'XOR': return a !== b;
      default: return false;
    }
  };

  const output = calculateOutput(gate, inputA, inputB);

  const getGateDescription = (g: GateType) => {
    switch (g) {
      case 'NOT': return "L'INVERSOR. Fas 1? Respon 0. Com quan demanes al teu germà que t'ajudi a recollir.";
      case 'AND': return "El PUNTILLÓS. O fas les DUES coses (A=1 i B=1) o la sortida és un zero gegant.";
      case 'OR': return "El CONFORMISTA. Em conformo amb què com a mínim UNA de les dues funcioni. Em val A, em val B, o totes dues!";
      case 'XOR': return "L'EXCLUSIU. Entri O un OR l'altre, però NO els dos alhora. Decideix-te!";
    }
  };

  const getIcon = (g: GateType) => {
    switch(g){
      case 'NOT': return '🔄';
      case 'AND': return '🕵️‍♂️';
      case 'OR': return '🤷‍♂️';
      case 'XOR': return '⚔️';
    }
  }

  return (
    <div className="flex flex-col h-full animate-in fade-in duration-500 w-full overflow-y-auto bg-cyan-50">
      <header className="bg-white border-b-4 border-slate-800 px-6 md:px-10 py-6 flex flex-col md:flex-row items-center justify-between shrink-0 gap-4 sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-400 rounded-2xl flex items-center justify-center text-white font-bold border-4 border-slate-800 shadow-[4px_4px_0px_rgba(30,41,59,1)] shrink-0 text-xl rotate-6">
            🚪
          </div>
          <div>
            <h2 className="text-2xl font-black text-slate-800 uppercase tracking-wide">Mòdul 2: Portes Lògiques</h2>
            <p className="text-sm text-slate-600 font-bold">Els cervells diminuts de la màquina</p>
          </div>
        </div>
      </header>

      <section className="p-6 md:p-10 max-w-6xl mx-auto w-full space-y-12 pb-32">
        <div className="bg-white border-4 border-slate-800 rounded-3xl p-8 shadow-[8px_8px_0px_rgba(30,41,59,1)] relative">
          <div className="absolute -top-6 -right-6 text-6xl rotate-12">🤓</div>
          <h3 className="text-2xl font-black text-blue-500 mb-4 uppercase">Electricitat intel·ligent</h3>
          <p className="text-lg text-slate-700 leading-relaxed font-medium mb-6">
            Pensa en una "Porta" com un guarda de seguretat en un cable. El guarda rep les dades en forma de corrent elèctric, i depenent del seu "tipus", decideix si encén la sortida o no.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          <div className="md:col-span-8 bg-green-100 border-4 border-slate-800 rounded-3xl p-8 flex flex-col relative pt-12 shadow-[8px_8px_0px_rgba(30,41,59,1)]">
            <div className="absolute top-0 left-6 -translate-y-1/2 bg-white text-slate-800 border-4 border-slate-800 px-6 py-2 rounded-full font-black text-sm uppercase shadow-[4px_4px_0px_rgba(30,41,59,1)] rotate-2">
              Simulator 3000
            </div>
            
            <div className="flex-1 flex flex-col md:flex-row items-center justify-around gap-8 my-8 relative z-10">
              <div className="flex flex-row md:flex-col gap-8 md:gap-12">
                <div className="text-center w-full bg-white p-4 rounded-xl border-4 border-slate-800 relative shadow-sm">
                  <p className="text-xs font-black text-slate-800 mb-2 uppercase">Interruptor A</p>
                  <button 
                    onClick={() => setInputA(!inputA)}
                    className={`w-20 mx-auto h-10 rounded-full p-1.5 flex items-center transition-all shadow-inner border-4 ${inputA ? 'bg-green-500 border-slate-800 justify-end' : 'bg-slate-200 border-slate-800 justify-start'}`}
                  >
                    <div className="bg-white w-6 h-6 rounded-full border-2 border-slate-800 shadow-sm"></div>
                  </button>
                  <span className={`text-4xl font-black mt-3 block ${inputA ? 'text-green-600' : 'text-slate-400'}`}>{inputA ? '1' : '0'}</span>
                </div>
                
                <div className={`text-center w-full bg-white p-4 rounded-xl border-4 border-slate-800 relative shadow-sm transition-opacity ${gate === 'NOT' ? 'opacity-30' : 'opacity-100'}`}>
                  {gate === 'NOT' && <div className="absolute inset-0 bg-white/50 backdrop-blur-[1px] z-10 rounded-lg"></div>}
                  <p className="text-xs font-black text-slate-800 mb-2 uppercase">Interruptor B</p>
                  <button 
                    onClick={() => setInputB(!inputB)}
                    disabled={gate === 'NOT'}
                    className={`w-20 mx-auto h-10 rounded-full p-1.5 flex items-center transition-all shadow-inner border-4 focus:outline-none ${inputB ? 'bg-green-500 border-slate-800 justify-end' : 'bg-slate-200 border-slate-800 justify-start'}`}
                  >
                    <div className="bg-white w-6 h-6 rounded-full border-2 border-slate-800 shadow-sm"></div>
                  </button>
                  <span className={`text-4xl font-black mt-3 block ${inputB ? 'text-green-600' : 'text-slate-400'}`}>{inputB ? '1' : '0'}</span>
                </div>
              </div>

              <div className="relative flex flex-col items-center group">
                <div className="w-40 h-40 bg-white border-4 border-slate-800 rounded-r-full flex flex-col items-center justify-center relative shadow-[4px_4px_0px_rgba(30,41,59,1)]">
                   <div className="absolute -left-1.5 w-2.5 bg-slate-800 h-full"></div>
                   <span className="text-4xl block mb-2">{getIcon(gate)}</span>
                   <span className="text-3xl font-black text-slate-800 uppercase tracking-tighter">{gate}</span>
                </div>
              </div>

              <div className="flex flex-col items-center w-32 bg-slate-800 p-4 rounded-2xl border-4 border-slate-900 shadow-xl">
                <p className="text-xs font-black text-white mb-4 uppercase">Resultat</p>
                <div className={`w-24 h-24 rounded-full flex items-center justify-center border-4 shadow-inner transition-all duration-300 ease-out ${output ? 'bg-yellow-300 border-yellow-500 shadow-[0_0_30px_rgba(253,224,71,0.5)]' : 'bg-slate-700 border-slate-900'}`}>
                   <span className={`text-5xl transition-all duration-300 ${output ? 'opacity-100 scale-110 drop-shadow-md' : 'opacity-20 grayscale scale-95'}`}>💡</span>
                </div>
                <span className={`text-4xl font-black mt-4 block ${output ? 'text-yellow-400' : 'text-slate-500'}`}>{output ? '1' : '0'}</span>
              </div>
            </div>

            <div className="bg-white border-4 border-slate-800 -mx-8 -mb-8 rounded-b-[20px] p-6 flex flex-col md:flex-row items-center gap-6">
              <div className="flex flex-wrap gap-3 justify-center shrink-0">
                {(['NOT', 'AND', 'OR', 'XOR'] as GateType[]).map((g) => (
                  <button 
                    key={g}
                    onClick={() => setGate(g)}
                    className={`px-4 py-3 border-4 rounded-xl text-lg font-black transition-all shadow-[2px_2px_0px_rgba(30,41,59,1)] active:translate-y-1 active:shadow-none ${gate === g ? 'border-slate-800 bg-yellow-400 text-slate-800 translate-y-1 shadow-none' : 'border-slate-800 bg-white text-slate-800 hover:bg-slate-100'}`}
                  >
                    {g}
                  </button>
                ))}
              </div>
              <div className="flex-1 bg-yellow-50 p-4 rounded-xl border-2 border-yellow-400">
                <p className="text-sm text-slate-800 font-bold leading-relaxed">
                   {getGateDescription(gate)}
                </p>
              </div>
            </div>
          </div>

          <div className="md:col-span-4 flex flex-col gap-6">
            <div className="bg-slate-900 text-white p-6 rounded-3xl shadow-[8px_8px_0px_rgba(15,23,42,0.8)] border-4 border-slate-800 flex-1 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10 text-6xl">📊</div>
              <h3 className="text-xl font-black mb-6 uppercase inline-block bg-slate-800 px-4 py-2 rounded-xl">
                Taula Mestra
              </h3>
              <table className="w-full text-center text-sm md:text-base border-separate border-spacing-y-2">
                <thead className="text-slate-400">
                  <tr>
                    <th className="py-2">A</th>
                    {gate !== 'NOT' && <th className="py-2">B</th>}
                    <th className="py-2 text-yellow-400 border-l-2 border-slate-700 pl-2">Sortida</th>
                  </tr>
                </thead>
                <tbody className="text-slate-300 font-bold text-lg">
                  {gate === 'NOT' ? (
                    [false, true].map((aVal, i) => {
                      const isActive = inputA === aVal;
                      const out = calculateOutput('NOT', aVal, false);
                      return (
                        <tr key={i} className={`transition-colors ${isActive ? 'bg-yellow-400 text-slate-900 shadow-sm' : 'bg-slate-800'}`}>
                          <td className={`py-4 rounded-l-xl border-y-2 ${isActive ? 'border-yellow-400' : 'border-slate-700'} border-l-2`}>{aVal ? '1' : '0'}</td>
                          <td className={`py-4 rounded-r-xl border-y-2 ${isActive ? 'border-yellow-400 text-slate-900 font-black' : 'border-slate-700'} border-r-2 border-l-2 ${isActive ? 'border-l-yellow-500' : 'border-l-slate-700'}`}>{out ? '1' : '0'}</td>
                        </tr>
                      )
                    })
                  ) : (
                    [
                      [false, false],
                      [false, true],
                      [true, false],
                      [true, true]
                    ].map((comb, i) => {
                      const isActive = inputA === comb[0] && inputB === comb[1];
                      const out = calculateOutput(gate, comb[0], comb[1]);
                      return (
                        <tr key={i} className={`transition-colors ${isActive ? 'bg-yellow-400 text-slate-900 scale-105 shadow-md' : 'bg-slate-800'} relative z-${isActive ? 10 : 0}`}>
                          <td className={`py-3 rounded-l-xl border-y-2 ${isActive ? 'border-yellow-400' : 'border-slate-700'} border-l-2`}>{comb[0] ? '1' : '0'}</td>
                          <td className={`py-3 border-y-2 ${isActive ? 'border-yellow-400' : 'border-slate-700'}`}>{comb[1] ? '1' : '0'}</td>
                          <td className={`py-3 rounded-r-xl border-y-2 ${isActive ? 'border-yellow-400 text-slate-900 font-black' : 'border-slate-700/50'} border-r-2 border-l-2 ${isActive ? 'border-l-yellow-500' : 'border-l-slate-900'}`}>{out ? '1' : '0'}</td>
                        </tr>
                      )
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

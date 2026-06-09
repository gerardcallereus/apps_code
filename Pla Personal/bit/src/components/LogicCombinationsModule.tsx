import React, { useState } from 'react';

type GateType = 'AND' | 'OR' | 'NAND' | 'NOR';

export default function LogicCombinationsModule() {
  const [gate1, setGate1] = useState<GateType>('AND');
  const [gate2, setGate2] = useState<GateType>('OR');
  
  const [inputA, setInputA] = useState(false);
  const [inputB, setInputB] = useState(false);
  const [inputC, setInputC] = useState(false);

  const calculateGate = (g: GateType, i1: boolean, i2: boolean) => {
    switch(g) {
      case 'AND': return i1 && i2;
      case 'OR': return i1 || i2;
      case 'NAND': return !(i1 && i2);
      case 'NOR': return !(i1 || i2);
    }
  };

  const midOutput = calculateGate(gate1, inputA, inputB);
  const finalOutput = calculateGate(gate2, midOutput, inputC);

  const getFormula = () => {
    return `(A ${gate1} B) ${gate2} C`;
  };

  return (
    <div className="flex flex-col h-full animate-in fade-in duration-500 w-full overflow-y-auto bg-cyan-50">
      <header className="bg-white border-b-4 border-slate-800 px-6 md:px-10 py-6 flex flex-col md:flex-row items-center justify-between shrink-0 gap-4 sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-purple-400 rounded-2xl flex items-center justify-center text-white font-bold border-4 border-slate-800 shadow-[4px_4px_0px_rgba(30,41,59,1)] shrink-0 text-xl rotate-12">
            🔗
          </div>
          <div>
            <h2 className="text-2xl font-black text-slate-800 uppercase tracking-wide">Mòdul 3: Circuits Combinats</h2>
            <p className="text-sm text-slate-600 font-bold">Unint portes lògiques per fer "súper" circuits!</p>
          </div>
        </div>
      </header>

      <section className="p-6 md:p-10 max-w-6xl mx-auto w-full space-y-8 pb-32">
        <div className="bg-white border-4 border-slate-800 rounded-3xl p-8 shadow-[8px_8px_0px_rgba(30,41,59,1)]">
          <h3 className="text-2xl font-black text-purple-500 mb-4 uppercase">El poder de combinar</h3>
          <p className="text-lg text-slate-700 leading-relaxed font-medium mb-6">
            Dins els ordinadors, mai no trobaràs una sola porta lògica tota sola. Es connecten entre elles en cadenes gegantines! La sortida d'una porta (Y) es converteix directament en l'entrada (A o B) d'una altra porta. 
          </p>
        </div>

        <div className="bg-yellow-100 border-4 border-slate-800 rounded-3xl p-8 shadow-[8px_8px_0px_rgba(30,41,59,1)]">
          <h3 className="text-2xl font-black text-slate-800 mb-6 uppercase text-center bg-white py-3 px-6 rounded-2xl border-4 border-slate-800 inline-block rotate-[-1deg]">
            🚀 Simulador Avançat (3 Entrades)
          </h3>
          
          <div className="bg-white border-4 border-slate-800 rounded-3xl p-6 md:p-12">
            <div className="flex justify-center mb-8">
              <div className="bg-slate-800 text-white font-mono text-xl py-3 px-6 rounded-xl border-b-4 border-r-4 border-slate-900 shadow-lg">
                Fórmula actual: <span className="text-yellow-400 font-black">{getFormula()}</span>
              </div>
            </div>

            <div className="flex flex-col lg:flex-row items-center justify-between gap-10 lg:gap-4 relative">
              
              {/* Column 1: Inputs for Gate 1 */}
              <div className="flex flex-col gap-16 z-10 w-full lg:w-auto items-center">
                <div className="text-center w-full bg-slate-100 p-4 rounded-2xl border-4 border-slate-800 shadow-[4px_4px_0px_rgba(30,41,59,1)]">
                  <p className="text-xs font-black text-slate-800 mb-2 uppercase">Interruptor A</p>
                  <button 
                    onClick={() => setInputA(!inputA)}
                    className={`w-20 mx-auto h-12 rounded-full p-1.5 flex items-center transition-all border-4 shadow-inner ${inputA ? 'bg-green-500 border-slate-800 justify-end' : 'bg-slate-300 border-slate-800 justify-start'}`}
                  >
                    <div className="bg-white w-8 h-8 rounded-full border-2 border-slate-800 shadow-sm"></div>
                  </button>
                  <span className={`text-3xl font-black mt-3 block ${inputA ? 'text-green-600' : 'text-slate-500'}`}>{inputA ? '1' : '0'}</span>
                </div>

                <div className="text-center w-full bg-slate-100 p-4 rounded-2xl border-4 border-slate-800 shadow-[4px_4px_0px_rgba(30,41,59,1)]">
                  <p className="text-xs font-black text-slate-800 mb-2 uppercase">Interruptor B</p>
                  <button 
                    onClick={() => setInputB(!inputB)}
                    className={`w-20 mx-auto h-12 rounded-full p-1.5 flex items-center transition-all border-4 shadow-inner ${inputB ? 'bg-green-500 border-slate-800 justify-end' : 'bg-slate-300 border-slate-800 justify-start'}`}
                  >
                    <div className="bg-white w-8 h-8 rounded-full border-2 border-slate-800 shadow-sm"></div>
                  </button>
                  <span className={`text-3xl font-black mt-3 block ${inputB ? 'text-green-600' : 'text-slate-500'}`}>{inputB ? '1' : '0'}</span>
                </div>
              </div>

              {/* Connecting Lines for Gate 1 (Hidden on mobile) */}
              <div className="hidden lg:flex w-16 h-32 flex-col justify-between py-10 opacity-50 relative">
                 <div className={`h-2 w-full border-y-4 border-r-4 rounded-r-xl absolute top-8 left-0 ${inputA ? 'border-green-500 bg-green-200 z-10' : 'border-slate-800 bg-slate-300'}`}></div>
                 <div className={`h-2 w-full border-y-4 border-r-4 rounded-r-xl absolute bottom-8 left-0 ${inputB ? 'border-green-500 bg-green-200 z-10' : 'border-slate-800 bg-slate-300'}`}></div>
              </div>

              {/* Column 2: Gate 1 */}
              <div className="flex flex-col items-center z-10 bg-blue-100 p-6 rounded-3xl border-4 border-slate-800 shadow-[8px_8px_0px_rgba(30,41,59,1)]">
                <select 
                  value={gate1} 
                  onChange={(e) => setGate1(e.target.value as GateType)}
                  className="mb-4 bg-white border-4 border-slate-800 rounded-xl px-4 py-2 font-black text-slate-800 focus:outline-none focus:ring-4 focus:ring-blue-300 transition-all appearance-none text-center"
                >
                  <option value="AND">AND (I)</option>
                  <option value="OR">OR (O)</option>
                  <option value="NAND">NAND (No I)</option>
                  <option value="NOR">NOR (No O)</option>
                </select>
                <div className="w-24 h-24 bg-white border-4 border-slate-800 rounded-r-full flex items-center justify-center relative">
                   <div className="absolute -left-1 w-1.5 bg-slate-800 h-full"></div>
                   <span className="text-2xl font-black text-slate-800 tracking-tighter">{gate1}</span>
                </div>
                <div className="mt-4 flex flex-col items-center">
                  <p className="text-[10px] font-bold text-slate-500 uppercase">Sortida Parcial</p>
                  <span className={`text-2xl font-black ${midOutput ? 'text-green-600' : 'text-slate-500'}`}>{midOutput ? '1' : '0'}</span>
                </div>
              </div>

              {/* Connection between Gate 1 and Gate 2 + Input C */}
              <div className="flex flex-col lg:flex-row gap-10 items-center justify-center z-10 w-full lg:w-auto">
                <div className="text-center w-full lg:w-auto bg-slate-100 p-4 rounded-2xl border-4 border-slate-800 shadow-[4px_4px_0px_rgba(30,41,59,1)] relative lg:mt-32">
                  <p className="text-xs font-black text-slate-800 mb-2 uppercase">Interruptor C</p>
                  <button 
                    onClick={() => setInputC(!inputC)}
                    className={`w-20 mx-auto h-12 rounded-full p-1.5 flex items-center transition-all border-4 shadow-inner ${inputC ? 'bg-green-500 border-slate-800 justify-end' : 'bg-slate-300 border-slate-800 justify-start'}`}
                  >
                    <div className="bg-white w-8 h-8 rounded-full border-2 border-slate-800 shadow-sm"></div>
                  </button>
                  <span className={`text-3xl font-black mt-3 block ${inputC ? 'text-green-600' : 'text-slate-500'}`}>{inputC ? '1' : '0'}</span>
                </div>
              </div>

              {/* Column 3: Gate 2 */}
              <div className="flex flex-col items-center z-10 bg-orange-100 p-6 rounded-3xl border-4 border-slate-800 shadow-[8px_8px_0px_rgba(30,41,59,1)]">
                <select 
                  value={gate2} 
                  onChange={(e) => setGate2(e.target.value as GateType)}
                  className="mb-4 bg-white border-4 border-slate-800 rounded-xl px-4 py-2 font-black text-slate-800 focus:outline-none focus:ring-4 focus:ring-orange-300 transition-all appearance-none text-center"
                >
                  <option value="AND">AND (I)</option>
                  <option value="OR">OR (O)</option>
                  <option value="NAND">NAND (No I)</option>
                  <option value="NOR">NOR (No O)</option>
                </select>
                <div className="w-24 h-24 bg-white border-4 border-slate-800 rounded-r-full flex items-center justify-center relative">
                   <div className="absolute -left-1 w-1.5 bg-slate-800 h-full"></div>
                   <span className="text-2xl font-black text-slate-800 tracking-tighter">{gate2}</span>
                </div>
              </div>

              {/* Output */}
              <div className="flex flex-col items-center bg-slate-800 p-6 rounded-3xl border-4 border-slate-900 shadow-[8px_8px_0px_rgba(30,41,59,1)] w-full lg:w-auto mt-8 lg:mt-0">
                <p className="text-sm font-black text-white mb-6 uppercase tracking-widest bg-slate-900 py-2 px-4 rounded-xl border-2 border-slate-700">Resultat (Y)</p>
                <div className={`w-28 h-28 rounded-full flex items-center justify-center border-4 shadow-inner transition-all duration-300 ${finalOutput ? 'bg-yellow-300 border-yellow-500 shadow-[0_0_30px_rgba(253,224,71,0.5)]' : 'bg-slate-700 border-slate-900'}`}>
                   <span className={`text-5xl transition-opacity duration-300 ${finalOutput ? 'opacity-100 scale-110 drop-shadow-md' : 'opacity-20 grayscale scale-95'}`}>💡</span>
                </div>
                <span className={`text-4xl font-black mt-6 block ${finalOutput ? 'text-yellow-400' : 'text-slate-500'}`}>{finalOutput ? '1' : '0'}</span>
              </div>
            </div>

          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-pink-100 border-4 border-slate-800 p-6 rounded-3xl shadow-[8px_8px_0px_rgba(30,41,59,1)]">
            <h4 className="font-black text-xl text-slate-800 mb-4 bg-white inline-block px-4 py-2 rounded-xl border-4 border-slate-800 -rotate-2">
              Exercici 1: La Porta Blindada 🏦
            </h4>
            <p className="font-medium text-slate-700 leading-relaxed mb-4">
              Tenim una caixa forta. Volem que s'obri (Resultat = 1) NOMÉS si l'interruptor de gerència està encès (C = 1) I com a mínim s'ha premut el botó A o el botó B dels empleats.
            </p>
            <p className="font-bold text-slate-800 bg-white p-4 rounded-xl border-4 border-slate-800">
              Pista: Tria OR per la primera porta, i AND per la segona. Comprova que funcioni la simulació!
            </p>
          </div>

          <div className="bg-green-100 border-4 border-slate-800 p-6 rounded-3xl shadow-[8px_8px_0px_rgba(30,41,59,1)]">
            <h4 className="font-black text-xl text-slate-800 mb-4 bg-white inline-block px-4 py-2 rounded-xl border-4 border-slate-800 rotate-2">
              Exercici 2: L'Antirrobatori 🚨
            </h4>
            <p className="font-medium text-slate-700 leading-relaxed mb-4">
              L'alarma ha de sonar si es trenca el vidre (A) O s'obre la porta (B), PERÒ si la policia ja ha desactivat el sistema (C=1), NO pot sonar mai. 
            </p>
            <p className="font-bold text-slate-800 bg-white p-4 rounded-xl border-4 border-slate-800">
              Investiga quina combinació de portes farà aquest comportament, o si cal una variable negada (NOT). És un repte obert!
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

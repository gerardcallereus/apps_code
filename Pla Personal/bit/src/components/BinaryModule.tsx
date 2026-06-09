import React, { useState } from 'react';

export default function BinaryModule() {
  const [bits, setBits] = useState<boolean[]>(Array(8).fill(false));
  const [decimalInput, setDecimalInput] = useState<number | ''>('');

  const handleBitToggle = (index: number) => {
    const newBits = [...bits];
    newBits[index] = !newBits[index];
    setBits(newBits);
  };

  const calculateDecimal = () => {
    return bits.reduce((acc, bit, index) => {
      if (bit) {
        return acc + Math.pow(2, 7 - index);
      }
      return acc;
    }, 0);
  };

  const handleDecimalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value);
    if (!isNaN(val) && val >= 0 && val <= 255) {
      setDecimalInput(val);
    } else if (e.target.value === '') {
      setDecimalInput('');
    }
  };

  const getBitsFromDecimal = (val: number | '') => {
    if (val === '') return Array(8).fill(false);
    const binaryString = val.toString(2).padStart(8, '0');
    return binaryString.split('').map(char => char === '1');
  };

  const convertedBits = getBitsFromDecimal(decimalInput);

  return (
    <div className="flex flex-col h-full animate-in fade-in duration-500 w-full overflow-y-auto bg-cyan-50">
      <header className="bg-white border-b-4 border-slate-800 px-6 md:px-10 py-6 flex flex-col md:flex-row items-center justify-between shrink-0 gap-4 sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-pink-400 rounded-2xl flex items-center justify-center text-white font-bold border-4 border-slate-800 shadow-[4px_4px_0px_rgba(30,41,59,1)] shrink-0 text-xl -rotate-6">
            10
          </div>
          <div>
            <h2 className="text-2xl font-black text-slate-800 uppercase tracking-wide">Mòdul 1: El Sistema Binari</h2>
            <p className="text-sm text-slate-600 font-bold">Comptant com un processador</p>
          </div>
        </div>
      </header>

      <section className="p-6 md:p-10 max-w-6xl mx-auto w-full space-y-12 pb-32">
        
        {/* Theory Section Expansion */}
        <div className="flex flex-col gap-8">
          <div className="bg-white border-4 border-slate-800 rounded-3xl p-8 shadow-[8px_8px_0px_rgba(30,41,59,1)] flex flex-col md:flex-row gap-8">
            <div className="flex-1">
              <h3 className="text-2xl font-black text-blue-500 mb-4 uppercase">El nostre Sistema (Base 10) vs L'ordinador (Base 2)</h3>
              <p className="text-lg text-slate-700 font-medium leading-relaxed mb-6">
                Nosaltres estem acostumats a comptar en <b>Base 10</b> (potències de 10), segurament perquè tenim 10 dits! Cada posició d'un número val 10 vegades més que l'anterior: Unitats (1), Desenes (10), Centenes (100)...
              </p>
              
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                <div className="bg-orange-50 p-5 rounded-2xl border-4 border-orange-200">
                  <h4 className="font-black text-orange-600 text-lg mb-2">Decimal (Base 10)</h4>
                  <div className="bg-white p-3 rounded-xl border-2 border-orange-200 font-mono text-center shadow-inner">
                    <div className="flex justify-between text-[10px] sm:text-xs text-orange-400 font-bold mb-1 border-b-2 border-orange-100 pb-1">
                      <span>10s (10¹)</span>
                      <span>1s (10⁰)</span>
                    </div>
                    <div className="flex justify-between text-2xl font-black text-slate-800 px-8 py-2">
                       <span>4</span>
                       <span>2</span>
                    </div>
                    <div className="text-[10px] sm:text-xs text-slate-500 mt-1">(4×10) + (2×1) = <b className="text-orange-500">42</b></div>
                  </div>
                </div>

                <div className="bg-blue-50 p-5 rounded-2xl border-4 border-blue-200">
                  <h4 className="font-black text-blue-600 text-lg mb-2">Binari (Base 2)</h4>
                  <div className="bg-white p-3 rounded-xl border-2 border-blue-200 font-mono text-center shadow-inner">
                    <div className="flex justify-between text-[10px] sm:text-xs text-blue-400 font-bold mb-1 border-b-2 border-blue-100 pb-1">
                      <span>8s (2³)</span><span>4s (2²)</span><span>2s (2¹)</span><span>1s (2⁰)</span>
                    </div>
                    <div className="flex justify-between text-xl font-black text-slate-800 px-2 py-2">
                       <span>1</span><span>0</span><span>1</span><span>0</span>
                    </div>
                    <div className="text-[10px] sm:text-xs text-slate-500 mt-1">(1×8)+(0×4)+(1×2)+(0×1)=<b className="text-blue-500">10</b></div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex-1 bg-yellow-100 p-8 rounded-2xl border-4 border-slate-800 flex items-center justify-center relative">
              <div className="absolute top-4 left-4 bg-white text-xs font-black px-3 py-1 rounded-full border-2 border-slate-800 uppercase shadow-sm">La regla màgica dels Bits</div>
              <div className="mt-6 flex flex-col items-center">
                <span className="text-7xl block mb-4">✨</span>
                <p className="text-slate-800 font-bold text-lg leading-snug text-center">
                  En binari, cada posició val <b>el doble</b> que l'anterior (1, 2, 4, 8, 16...).<br/><br/>Si el bit és un <span className="bg-green-400 text-slate-900 px-2 py-1 rounded-md border-2 border-slate-800 shadow-sm mx-1">1</span>, sumem el seu valor. Si és un <span className="bg-slate-300 text-slate-900 px-2 py-1 rounded-md border-2 border-slate-800 shadow-sm mx-1">0</span>, no el sumem!
                </p>
              </div>
            </div>
          </div>

          <div className="bg-slate-800 p-8 rounded-3xl border-4 border-slate-900 shadow-[8px_8px_0px_rgba(30,41,59,1)] text-white">
            <h3 className="text-xl font-black text-yellow-400 mb-6 uppercase flex items-center gap-2"><span className="text-3xl">🔍</span> Exemples Analitzats</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-slate-700 p-6 rounded-2xl border-2 border-slate-600">
                <div className="text-2xl font-black text-white tracking-widest mb-2 font-mono">00000001</div>
                <div className="text-yellow-400 font-bold mb-2">Valor Decimal = 1</div>
                <p className="text-sm text-slate-300 leading-relaxed">Només l'última bombeta, la que val <b className="text-white">1</b>, està encesa. Totes les altres estan apagades. Resultat final: <b>1</b>.</p>
              </div>
              <div className="bg-slate-700 p-6 rounded-2xl border-2 border-slate-600">
                <div className="text-2xl font-black text-white tracking-widest mb-2 font-mono">00000011</div>
                <div className="text-yellow-400 font-bold mb-2">Valor Decimal = 3</div>
                <p className="text-sm text-slate-300 leading-relaxed">La bombeta que val <b className="text-white">2</b> i la que val <b className="text-white">1</b> estan enceses alhora. Les sumem juntes: 2 + 1 = <b>3</b>.</p>
              </div>
              <div className="bg-slate-700 p-6 rounded-2xl border-2 border-slate-600">
                <div className="text-2xl font-black text-white tracking-widest mb-2 font-mono">11111111</div>
                <div className="text-yellow-400 font-bold mb-2">Valor Decimal = 255</div>
                <p className="text-sm text-slate-300 leading-relaxed">Pugem l'electricitat a tope! Totes 8 posicions estan enceses: 128+64+32+16+8+4+2+1 = <b>255</b>. El màxim per 8 bits.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Simulators */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <div className="bg-white border-4 border-slate-800 rounded-3xl p-6 md:p-8 flex flex-col relative pt-14 shadow-[8px_8px_0px_rgba(30,41,59,1)] h-full">
            <div className="absolute top-0 right-8 -translate-y-1/2 bg-blue-500 text-white border-4 border-slate-800 px-6 py-2 rounded-full font-black text-sm uppercase shadow-[4px_4px_0px_rgba(30,41,59,1)] rotate-3">
              1. Traductor Interactiu
            </div>
            
            <p className="text-slate-600 font-medium mb-8 text-center text-sm">Fes clic a les bombetes per tancar o obrir el circuit elèctric i observa la suma de valors màgica!</p>

            <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-10 w-full overflow-x-auto pb-4">
              {bits.map((bit, index) => (
                <div key={index} className="flex flex-col items-center gap-2 shrink-0">
                  <span className="text-[10px] sm:text-xs font-black bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full border-2 border-blue-200">
                    {Math.pow(2, 7 - index)}
                  </span>
                  <button 
                    onClick={() => handleBitToggle(index)}
                    className={`w-10 h-16 sm:w-12 sm:h-16 rounded-full p-1 flex flex-col items-center justify-center transition-all border-4 shadow-inner ${bit ? 'bg-yellow-400 border-slate-800' : 'bg-slate-300 border-slate-800'}`}
                  >
                    <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center bg-white border-2 border-slate-800 transition-opacity duration-300 ${!bit && 'opacity-60'}`}>
                      <span className={`text-lg sm:text-xl transition-all ${bit ? 'grayscale-0 opacity-100 scale-110 drop-shadow-md' : 'grayscale opacity-50 scale-100'}`}>💡</span>
                    </div>
                  </button>
                  <span className={`text-xl sm:text-2xl font-black mt-2 block ${bit ? 'text-yellow-500' : 'text-slate-400'}`}>{bit ? '1' : '0'}</span>
                </div>
              ))}
            </div>
            
            <div className="mt-auto">
              <div className="text-center bg-slate-100 border-4 border-slate-800 rounded-2xl p-6 shadow-inner relative overflow-hidden">
                <span className="text-slate-600 font-black uppercase tracking-widest block mb-2 text-xs sm:text-sm z-10 relative">Valor Decimal Total</span>
                <span className="text-6xl sm:text-7xl font-black text-slate-800 tracking-tight block drop-shadow-lg z-10 relative">{calculateDecimal()}</span>
              </div>
            </div>
          </div>

          <div className="bg-white border-4 border-slate-800 rounded-3xl p-6 md:p-8 flex flex-col relative pt-14 shadow-[8px_8px_0px_rgba(30,41,59,1)] h-full">
            <div className="absolute top-0 right-8 -translate-y-1/2 bg-green-500 text-white border-4 border-slate-800 px-6 py-2 rounded-full font-black text-sm uppercase shadow-[4px_4px_0px_rgba(30,41,59,1)] -rotate-2">
              2. Convertidor Invers
            </div>
            <p className="text-slate-600 font-medium mb-8 text-center text-sm">Escull de sobte un número entre 0 i 255 (que equival a 8 bits complets o "1 Byte"). Com s'il·lumina?</p>
            
            <div className="flex flex-col gap-8 items-center h-full justify-center">
              <div className="relative">
                <span className="absolute -top-3 -left-3 text-3xl rotate-[-20deg]">✍️</span>
                <input 
                  type="number" 
                  min="0" 
                  max="255" 
                  value={decimalInput}
                  onChange={handleDecimalChange}
                  placeholder="Ex: 42"
                  className="w-40 px-4 py-4 bg-yellow-50 border-4 border-slate-800 rounded-2xl text-3xl font-black text-center focus:outline-none focus:ring-4 focus:ring-yellow-300 text-slate-800 transition-all shadow-[4px_4px_0px_rgba(30,41,59,1)]"
                />
              </div>
              
              <div className="bg-slate-800 border-4 border-slate-900 rounded-2xl p-4 w-full shadow-inner mt-4">
                <div className="flex flex-wrap justify-center gap-2 text-xl font-mono">
                  {convertedBits.map((bit, index) => (
                    <span key={`cb-${index}`} className={`w-8 h-12 sm:w-10 sm:h-14 flex items-center justify-center rounded-xl shadow-inner border-2 transition-all ${bit ? 'bg-green-400 text-slate-900 border-slate-900 font-black shadow-[0_0_15px_rgba(74,222,128,0.6)]' : 'bg-slate-700 text-slate-500 border-slate-900 shrink-0'}`}>
                      {bit ? '1' : '0'}
                    </span>
                  ))}
                </div>
                <div className="text-center mt-4">
                  <p className="text-[10px] sm:text-xs text-slate-400 font-bold uppercase tracking-widest">El teu número a l'idioma de l'ordinador</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Exercises Section Expansion */}
        <div className="bg-purple-100 border-4 border-slate-800 rounded-3xl p-8 shadow-[8px_8px_0px_rgba(30,41,59,1)] mt-12 relative overflow-hidden">
          <div className="absolute right-0 bottom-0 text-[180px] opacity-10 translate-y-1/4 translate-x-1/4">🎮</div>
          <h3 className="text-2xl font-black text-slate-800 mb-8 uppercase bg-white inline-block px-6 py-2 rounded-xl border-4 border-slate-800 -rotate-1 relative z-10">Camp d'Entrenament</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
            <div className="bg-white border-4 border-slate-800 p-6 rounded-2xl hover:-translate-y-2 transition-transform shadow-[4px_4px_0px_rgba(30,41,59,1)]">
              <h4 className="font-black text-xl text-blue-500 mb-2 uppercase">1. L'Edat Binària</h4>
              <p className="text-sm text-slate-700 font-medium leading-relaxed">
                Utilitza el Traductor per il·luminar la teva edat actual en bits. Anota al paper la seqüència exacta de zeros i uns!
              </p>
            </div>
            
            <div className="bg-white border-4 border-slate-800 p-6 rounded-2xl hover:-translate-y-2 transition-transform shadow-[4px_4px_0px_rgba(30,41,59,1)]">
              <h4 className="font-black text-xl text-orange-500 mb-2 uppercase">2. El Límit</h4>
              <p className="text-sm text-slate-700 font-medium leading-relaxed">
                L'ordinador més antic només processava 8 bits a la vegada. Quin és el número màxim que es podria mostrar enceses TOTES les vuit bombetes? Suma-les totes a veure l'espant.
              </p>
            </div>
            
            <div className="bg-slate-800 text-white border-4 border-slate-900 p-6 rounded-2xl hover:-translate-y-2 transition-transform shadow-[4px_4px_0px_rgba(0,0,0,0.5)]">
              <h4 className="font-black text-xl text-green-400 mb-2 uppercase">3. Mentalitat Màquina</h4>
              <p className="text-sm text-slate-300 font-medium leading-relaxed mb-4">
                Sense usar el convertidor, intenta esbrinar la seqüència per al número <b>100</b>. Pista: Quina és la bulbeta de valor més alt però que no es passa de 100? Comença per allà i ves sumant fins arribar a 100 exacte!
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

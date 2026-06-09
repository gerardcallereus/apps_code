import React, { useState } from 'react';

export default function FinalChallengeModule() {
  const [stage, setStage] = useState(0);
  const [errorHighlight, setErrorHighlight] = useState(false);

  // Stage 1
  const [s1Q1, setS1Q1] = useState('');
  
  // Stage 2
  const [s2Q1, setS2Q1] = useState('');

  // Stage 3
  const [s3Q1, setS3Q1] = useState('');

  const triggerError = () => {
    setErrorHighlight(true);
    setTimeout(() => setErrorHighlight(false), 500);
  }

  const checkStage1 = () => {
    const clean = s1Q1.replace(/\s/g, '');
    if (clean === '10010110') {
      setStage(1);
    } else {
      triggerError();
    }
  }

  const checkStage2 = () => {
    if (s2Q1.toUpperCase() === 'NOR') {
      setStage(2);
    } else {
      triggerError();
    }
  }

  const checkStage3 = () => {
    if (s3Q1 === '1') {
      setStage(3);
    } else {
      triggerError();
    }
  }

  const resetEscapeRoom = () => {
    setStage(0);
    setS1Q1('');
    setS2Q1('');
    setS3Q1('');
  }

  return (
    <div className={`flex flex-col h-full animate-in fade-in duration-500 w-full overflow-y-auto transition-colors duration-300 ${errorHighlight ? 'bg-red-500' : 'bg-cyan-50'}`}>
      <header className="bg-white border-b-4 border-slate-800 px-6 md:px-10 py-6 flex flex-col md:flex-row items-center justify-between shrink-0 gap-4 sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-red-400 rounded-2xl flex items-center justify-center text-white font-bold border-4 border-slate-800 shadow-[4px_4px_0px_rgba(30,41,59,1)] shrink-0 text-xl font-mono">
            !!
          </div>
          <div>
            <h2 className="text-2xl font-black text-slate-800 uppercase tracking-wide">Repte Final</h2>
            <p className="text-sm text-slate-600 font-bold">Escape Room: El nucli del sistema</p>
          </div>
        </div>
        <div className="bg-slate-800 text-yellow-400 font-black px-4 py-2 rounded-xl border-4 border-slate-900 shadow-inner">
           NIVELL: {stage}/3
        </div>
      </header>

      <section className="flex-1 p-6 md:p-10 flex justify-center items-center h-full w-full pb-32">
        {stage === 0 && (
          <div className="w-full max-w-3xl bg-white border-4 border-slate-800 rounded-3xl p-8 md:p-12 text-center shadow-[12px_12px_0px_rgba(30,41,59,1)]">
            <span className="text-8xl block mb-6 animate-bounce">🚨</span>
            <h3 className="text-3xl md:text-5xl font-black text-slate-800 uppercase tracking-tighter mb-6">El Nucli està col·lapsant!</h3>
            <p className="text-lg md:text-xl text-slate-700 font-medium mb-8 leading-relaxed">
              El servidor principal s'ha tancat per seguretat. Per reiniciar-lo, has de <b>superar 3 nivells</b> de criptografia basada en sistemes digitals. Un error a les contrasenyes i es bloquejarà. Concentra't!
            </p>
            <button 
              onClick={() => setStage(1)}
              className="bg-red-500 text-white border-4 border-slate-800 px-8 py-4 rounded-2xl text-2xl font-black uppercase tracking-widest shadow-[6px_6px_0px_rgba(30,41,59,1)] hover:translate-y-1 hover:shadow-none transition-all active:bg-red-600"
            >
              Iniciar Hackeig
            </button>
          </div>
        )}

        {stage === 1 && (
          <div className="w-full max-w-4xl bg-orange-100 border-4 border-slate-800 rounded-3xl p-8 md:p-12 shadow-[12px_12px_0px_rgba(30,41,59,1)] relative overflow-hidden animate-in slide-in-from-right duration-500">
            <div className="absolute top-0 right-0 p-4 opacity-10 font-bold text-[180px] pointer-events-none -translate-y-1/4">01</div>
            
            <h3 className="text-3xl font-black text-slate-800 uppercase bg-white inline-block px-4 py-2 rounded-xl border-4 border-slate-800 rotate-[-2deg] mb-8 relative z-10">
              Nivell 1: Desxifratge
            </h3>
            
            <div className="bg-white border-4 border-slate-800 p-8 rounded-2xl mb-8 relative z-10">
              <p className="text-xl text-slate-700 font-bold leading-relaxed mb-6">
                El motor principal necessita rebre exactament el número <span className="text-3xl font-black text-orange-500 bg-orange-50 px-2 rounded-lg border-2 border-orange-200 inline-block rotate-3 mx-1">150</span> en binari pur (8 bits). 
              </p>
              <div className="bg-slate-100 p-4 rounded-xl border-2 border-slate-300 font-mono text-sm text-slate-500 mb-6 flex gap-2 overflow-x-auto">
                <span className="bg-slate-200 px-2 py-1 rounded">128</span>
                <span className="bg-slate-200 px-2 py-1 rounded">64</span>
                <span className="bg-slate-200 px-2 py-1 rounded">32</span>
                <span className="bg-slate-200 px-2 py-1 rounded">16</span>
                <span className="bg-slate-200 px-2 py-1 rounded">8</span>
                <span className="bg-slate-200 px-2 py-1 rounded">4</span>
                <span className="bg-slate-200 px-2 py-1 rounded">2</span>
                <span className="bg-slate-200 px-2 py-1 rounded">1</span>
              </div>
              <input 
                type="text" 
                value={s1Q1}
                onChange={(e) => setS1Q1(e.target.value)}
                placeholder="Ex: 01010101"
                className="w-full px-6 py-4 bg-slate-800 border-4 border-slate-900 rounded-xl text-3xl tracking-widest font-mono text-green-400 focus:outline-none focus:ring-4 focus:ring-orange-300 transition-colors shadow-inner"
              />
            </div>

            <div className="flex justify-end relative z-10">
              <button 
                onClick={checkStage1}
                className="bg-yellow-400 text-slate-800 border-4 border-slate-800 px-8 py-4 rounded-2xl text-xl font-black uppercase tracking-widest shadow-[6px_6px_0px_rgba(30,41,59,1)] hover:translate-y-1 hover:shadow-none transition-all active:bg-yellow-500"
              >
                Inyectar
              </button>
            </div>
          </div>
        )}

        {stage === 2 && (
          <div className="w-full max-w-4xl bg-purple-100 border-4 border-slate-800 rounded-3xl p-8 md:p-12 shadow-[12px_12px_0px_rgba(30,41,59,1)] relative overflow-hidden animate-in slide-in-from-right duration-500">
            <div className="absolute top-0 right-0 p-4 opacity-10 font-bold text-[180px] pointer-events-none -translate-y-1/4">02</div>
            
            <h3 className="text-3xl font-black text-slate-800 uppercase bg-white inline-block px-4 py-2 rounded-xl border-4 border-slate-800 rotate-[-1deg] mb-8 relative z-10">
              Nivell 2: Porta Clandestina
            </h3>
            
            <div className="bg-white border-4 border-slate-800 p-8 rounded-2xl mb-8 relative z-10 flex flex-col md:flex-row gap-8 items-center">
              <div className="flex-1">
                <p className="text-lg text-slate-700 font-bold leading-relaxed mb-6">
                  Has obert el primer firewall. Ara veus que la porta d'accés principal està ofuscada. La consola només et mostra quina és la seva taula de veritat resultant.
                </p>
                <p className="text-xl font-black text-purple-600 mb-2">Com es diu aquesta porta lògica?</p>
                <p className="text-sm font-medium text-slate-500 mb-6">Resposta requerida en text (ex: AND, OR, XOR, NAND, NOR...)</p>
                <input 
                  type="text" 
                  value={s2Q1}
                  onChange={(e) => setS2Q1(e.target.value)}
                  placeholder="EX: AND"
                  className="w-full px-6 py-4 bg-slate-800 border-4 border-slate-900 rounded-xl text-3xl font-mono text-purple-400 focus:outline-none focus:ring-4 focus:ring-purple-300 transition-colors shadow-inner uppercase"
                />
              </div>

              <div className="bg-slate-800 text-white p-6 rounded-2xl border-4 border-slate-900 shrink-0 shadow-inner">
                <table className="text-center font-mono text-xl border-separate border-spacing-4">
                  <thead>
                    <tr className="text-slate-400">
                      <th>A</th><th>B</th><th className="text-yellow-400">= Y</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr><td>0</td><td>0</td><td className="text-green-400 font-black">1</td></tr>
                    <tr><td>0</td><td>1</td><td className="text-red-400 font-black">0</td></tr>
                    <tr><td>1</td><td>0</td><td className="text-red-400 font-black">0</td></tr>
                    <tr><td>1</td><td>1</td><td className="text-red-400 font-black">0</td></tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div className="flex justify-end relative z-10">
              <button 
                onClick={checkStage2}
                className="bg-yellow-400 text-slate-800 border-4 border-slate-800 px-8 py-4 rounded-2xl text-xl font-black uppercase tracking-widest shadow-[6px_6px_0px_rgba(30,41,59,1)] hover:translate-y-1 hover:shadow-none transition-all active:bg-yellow-500"
              >
                Superar
              </button>
            </div>
          </div>
        )}

        {stage === 3 && (
          <div className="w-full max-w-4xl bg-blue-100 border-4 border-slate-800 rounded-3xl p-8 md:p-12 shadow-[12px_12px_0px_rgba(30,41,59,1)] relative overflow-hidden animate-in slide-in-from-right duration-500">
            <div className="absolute top-0 right-0 p-4 opacity-10 font-bold text-[180px] pointer-events-none -translate-y-1/4">03</div>
            
            <h3 className="text-3xl font-black text-slate-800 uppercase bg-white inline-block px-4 py-2 rounded-xl border-4 border-slate-800 rotate-[1deg] mb-8 relative z-10">
              Nivell 3: Master Override
            </h3>
            
            <div className="bg-white border-4 border-slate-800 p-8 rounded-2xl mb-8 relative z-10">
              <p className="text-lg text-slate-700 font-bold leading-relaxed mb-6">
                L'últim pont d'energia! Has d'enviar el bit resultant d'aquesta equació de portes lògiques per restaurar l'energia. Fes els càlculs mentals pas a pas:
              </p>

              <div className="bg-slate-800 p-8 rounded-2xl border-4 border-slate-900 shadow-inner flex justify-center mb-8">
                 <p className="font-mono text-2xl lg:text-3xl text-white tracking-widest text-center">
                    (<span className="text-yellow-400">1</span> <span className="text-blue-400">OR</span> <span className="text-yellow-400">0</span>) <span className="text-pink-500">AND</span> (<span className="text-yellow-400">1</span> <span className="text-green-500">NAND</span> <span className="text-yellow-400">1</span>)
                 </p>
              </div>

              <div className="flex justify-center gap-6">
                 <button onClick={() => setS3Q1('0')} className={`w-32 h-32 rounded-3xl border-4 border-slate-800 text-5xl font-black transition-all ${s3Q1 === '0' ? 'bg-slate-800 text-white translate-y-2 shadow-none' : 'bg-slate-100 text-slate-400 shadow-[6px_6px_0px_rgba(30,41,59,1)] hover:-translate-y-1'}`}>
                   0
                 </button>
                 <button onClick={() => setS3Q1('1')} className={`w-32 h-32 rounded-3xl border-4 border-slate-800 text-5xl font-black transition-all ${s3Q1 === '1' ? 'bg-slate-800 text-white translate-y-2 shadow-none' : 'bg-slate-100 text-slate-400 shadow-[6px_6px_0px_rgba(30,41,59,1)] hover:-translate-y-1'}`}>
                   1
                 </button>
              </div>
            </div>

            <div className="flex justify-end relative z-10 mt-8">
              <button 
                onClick={checkStage3}
                className="bg-red-500 text-white border-4 border-slate-800 px-8 py-4 rounded-2xl text-xl font-black uppercase tracking-widest shadow-[6px_6px_0px_rgba(30,41,59,1)] hover:translate-y-1 hover:shadow-none transition-all active:bg-red-600 w-full md:w-auto"
              >
                Inici de Sistema
              </button>
            </div>
          </div>
        )}

        {stage === 4 && (
          <div className="w-full max-w-2xl bg-white border-4 border-slate-800 rounded-3xl p-12 text-center shadow-[12px_12px_0px_rgba(30,41,59,1)] animate-in zoom-in-95 duration-500">
             <div className="w-32 h-32 bg-green-400 border-4 border-slate-800 rounded-full flex items-center justify-center mx-auto mb-8 text-7xl shadow-inner relative">
                <div className="absolute inset-0 border-4 border-white rounded-full opacity-50 animate-ping"></div>
                <span className="relative z-10 z-[1]">🎉</span>
             </div>
             <h3 className="text-4xl md:text-5xl font-black text-slate-800 uppercase tracking-tighter mb-6">Sistema Online!</h3>
             <p className="text-lg text-slate-600 font-bold mb-8 max-w-lg mx-auto leading-relaxed border-t-4 border-b-4 py-4 border-slate-100">
               Felicitats! Has dominat els bits, sumat números, traduït portes i restaurat la intel·ligència del nucli. Ets oficialment un arquitecte de dades.
             </p>
             <button 
                onClick={resetEscapeRoom}
                className="bg-white px-8 py-4 border-4 border-slate-800 hover:bg-slate-100 text-slate-800 font-black rounded-2xl transition-all uppercase tracking-widest shadow-[4px_4px_0px_rgba(30,41,59,1)] hover:translate-y-1 hover:shadow-none"
              >
                Tornar a Jugar
              </button>
          </div>
        )}
      </section>
    </div>
  );
}

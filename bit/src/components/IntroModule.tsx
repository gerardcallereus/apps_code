import React from 'react';

export default function IntroModule() {
  return (
    <div className="flex flex-col h-full animate-in fade-in duration-500 w-full overflow-y-auto bg-cyan-50">
      <header className="bg-white border-b-4 border-slate-800 px-6 md:px-10 py-6 flex flex-col md:flex-row items-center justify-between shrink-0 gap-4 sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-yellow-400 rounded-2xl flex items-center justify-center text-slate-800 font-bold border-4 border-slate-800 shadow-[4px_4px_0px_rgba(30,41,59,1)] shrink-0 text-2xl rotate-3">
            👋
          </div>
          <div>
            <h2 className="text-2xl font-black text-slate-800 uppercase tracking-wide">Introducció</h2>
            <p className="text-sm text-slate-600 font-bold">Per què estudiem binaris i portes lògiques?</p>
          </div>
        </div>
      </header>

      <section className="p-6 md:p-10 max-w-4xl mx-auto w-full space-y-8 pb-32">
        <div className="bg-white border-4 border-slate-800 rounded-3xl p-8 shadow-[8px_8px_0px_rgba(30,41,59,1)] relative">
          <div className="absolute -top-6 -right-6 text-6xl rotate-12">🤔</div>
          <h3 className="text-2xl font-black text-pink-500 mb-4 uppercase">Com "Pensa" un Ordinador?</h3>
          <p className="text-lg text-slate-700 leading-relaxed font-medium mb-6">
            Molt sovint pensem que els ordinadors són superintel·ligents, que entenen vídeos, jocs en 3D i pàgines web. Però la realitat és molt diferent! En el fons, un ordinador només és <b>una màquina plena de cables</b>.
          </p>
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-1 bg-cyan-100 p-6 rounded-2xl border-4 border-slate-800">
              <span className="text-4xl block mb-2">⚡</span>
              <h4 className="font-bold text-slate-800 text-lg mb-2">Electricitat ON/OFF</h4>
              <p className="text-sm text-slate-600 font-medium">L'única cosa que de veritat entén el processador és si per un cable hi passa electricitat (ON) o no hi passa (OFF).</p>
            </div>
            <div className="flex-1 bg-green-100 p-6 rounded-2xl border-4 border-slate-800">
              <span className="text-4xl block mb-2">🧱</span>
              <h4 className="font-bold text-slate-800 text-lg mb-2">El Totxo de Construcció</h4>
              <p className="text-sm text-slate-600 font-medium">Llavors, com construïm el Fortnite amb simples cables ON/OFF? Fent servir milions i milions d'aquests petits interruptors connectats junts.</p>
            </div>
          </div>
        </div>

        <div className="bg-white border-4 border-slate-800 rounded-3xl p-8 shadow-[8px_8px_0px_rgba(30,41,59,1)] relative">
          <h3 className="text-2xl font-black text-blue-500 mb-4 uppercase">El Sistema Binari (1 i 0)</h3>
          <p className="text-lg text-slate-700 leading-relaxed font-medium mb-6">
            Com que només tenim dos estats (ON i OFF), els enginyers van decidir utilitzar les matemàtiques per representar-ho:
          </p>
          <ul className="space-y-4 mb-6 text-lg font-bold text-slate-700">
            <li className="flex items-center gap-4 bg-orange-100 p-4 rounded-xl border-2 border-slate-800">
              <span className="bg-orange-500 text-white w-10 h-10 flex items-center justify-center rounded-lg text-xl border-2 border-slate-800">1</span>
              <span>= ON = Hi ha corrent = Cert</span>
            </li>
            <li className="flex items-center gap-4 bg-slate-200 p-4 rounded-xl border-2 border-slate-800 text-slate-600">
              <span className="bg-slate-500 text-white w-10 h-10 flex items-center justify-center rounded-lg text-xl border-2 border-slate-800">0</span>
              <span>= OFF = No hi ha corrent = Fals</span>
            </li>
          </ul>
          <p className="text-md text-slate-600 font-medium bg-blue-50 p-4 rounded-xl border-l-4 border-blue-500">
            El sistema de comptar amb només 0s i 1s s'anomena <b>Sistema Binari</b>. Amb ell, podem expressar qualsevol número, lletra o color! Un sol 0 o 1 s'anomena <b>Bit</b>.
          </p>
        </div>

        <div className="bg-white border-4 border-slate-800 rounded-3xl p-8 shadow-[8px_8px_0px_rgba(30,41,59,1)] relative">
          <h3 className="text-2xl font-black text-purple-500 mb-4 uppercase">Les Portes Lògiques</h3>
          <p className="text-lg text-slate-700 leading-relaxed font-medium mb-6">
            Tenir números binaris està molt bé, però com fem que l'ordinador "calculi" i prengui decisions? Aquí entren les <b>Portes Lògiques</b>.
          </p>
          <div className="flex gap-4 items-center bg-purple-50 p-6 rounded-2xl border-2 border-slate-800">
            <div className="text-5xl shrink-0">🚪</div>
            <p className="text-md text-slate-700 font-medium">
              Són petits circuits que reben corrent per un cantó (les entrades) i, depenent de la norma que tinguin, decideixen si deixen sortir el corrent cap a l'altre cantó (la sortida) o no.
              <br/><br/>
              Combinant milions d'aquestes portes, l'ordinador pot sumar nombres, recordar contrasenyes i mostrar imatges per la pantalla!
            </p>
          </div>
        </div>

      </section>
    </div>
  );
}

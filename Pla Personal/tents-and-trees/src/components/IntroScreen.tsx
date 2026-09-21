import React, { useState } from 'react';
import { Tent, TreePine, AlertTriangle, Play, CheckCircle2, Eye, RotateCcw } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface IntroScreenProps {
  onStart: () => void;
  savedLevelIndex?: number | null;
  onContinue?: () => void;
  onResetProgress?: () => void;
}

export function IntroScreen({ onStart, savedLevelIndex, onContinue, onResetProgress }: IntroScreenProps) {
  const [confirmReset, setConfirmReset] = useState(false);
  const hasSavedGame = typeof savedLevelIndex === 'number' && savedLevelIndex >= 0;

  return (
    <div className="min-h-screen bg-stone-50 flex items-center justify-center p-4 font-sans text-stone-800">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white max-w-3xl w-full rounded-3xl shadow-xl overflow-hidden border border-stone-200"
      >
        <div className="bg-orange-500 p-8 text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
            {/* Decorative background pattern */}
            {Array.from({ length: 20 }).map((_, i) => (
              <TreePine key={i} className="absolute text-white" style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                width: `${Math.random() * 40 + 20}px`,
                height: `${Math.random() * 40 + 20}px`,
                transform: `rotate(${Math.random() * 45 - 22.5}deg)`
              }} />
            ))}
          </div>
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", bounce: 0.5 }}
            className="relative z-10 bg-white/20 w-24 h-24 mx-auto rounded-full flex items-center justify-center mb-4 backdrop-blur-sm"
          >
            <Tent className="w-14 h-14 text-white" />
          </motion.div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-2 relative z-10 tracking-tight">
            Tents & Trees
          </h1>
          <p className="text-orange-100 text-lg sm:text-xl font-medium relative z-10">
            El repte de lògica al bosc
          </p>
        </div>

        <div className="p-8 sm:p-10">
          <h2 className="text-2xl font-bold mb-6 text-center">Com es juga?</h2>
          
          <div className="grid sm:grid-cols-2 gap-6 mb-10">
            <div className="flex gap-4 items-start">
              <div className="bg-green-100 p-3 rounded-xl shrink-0">
                <TreePine className="w-6 h-6 text-green-700" />
              </div>
              <div>
                <h3 className="font-bold text-lg mb-1">Cada arbre vol una tenda</h3>
                <p className="text-stone-600 leading-relaxed">Col·loca exactament una tenda al costat de cada arbre (a dalt, a baix, a l'esquerra o a la dreta, però <strong>mai en diagonal</strong>).</p>
              </div>
            </div>

            <div className="flex gap-4 items-start">
              <div className="bg-red-100 p-3 rounded-xl shrink-0">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h3 className="font-bold text-lg mb-1">Les tendes no es toquen</h3>
                <p className="text-stone-600 leading-relaxed">Dues tendes <strong>mai</strong> poden estar juntes, ni tan sols en diagonal. Han de mantenir les distàncies!</p>
              </div>
            </div>

            <div className="flex gap-4 items-start">
              <div className="bg-blue-100 p-3 rounded-xl shrink-0">
                <CheckCircle2 className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-bold text-lg mb-1">Respecta els números</h3>
                <p className="text-stone-600 leading-relaxed">Els números de les files i columnes t'indiquen exactament quantes tendes hi ha d'haver en aquella línia.</p>
              </div>
            </div>

            <div className="flex gap-4 items-start">
              <div className="bg-purple-100 p-3 rounded-xl shrink-0">
                <Eye className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h3 className="font-bold text-lg mb-1">Control d'aprenentatge</h3>
                <p className="text-stone-600 leading-relaxed">El joc guarda automàticament el teu progrés i comptabilitza els intents a cada nivell per a la teva nota final!</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center gap-4">
            {hasSavedGame ? (
              <>
                <button
                  onClick={onContinue || onStart}
                  className="w-full max-w-sm bg-orange-500 hover:bg-orange-600 text-white text-xl font-bold py-4 px-10 rounded-2xl shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1 flex items-center justify-center gap-3"
                >
                  <Play className="w-6 h-6 fill-current" />
                  Continuar partida (Nivell {savedLevelIndex + 1})
                </button>

                {!confirmReset ? (
                  <button
                    onClick={() => setConfirmReset(true)}
                    className="text-stone-500 hover:text-stone-800 text-sm font-medium transition-colors flex items-center gap-2 mt-1"
                  >
                    <RotateCcw className="w-4 h-4" />
                    Vols començar de nou des del nivell 1?
                  </button>
                ) : (
                  <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 flex flex-col sm:flex-row items-center gap-3 text-center sm:text-left mt-2">
                    <p className="text-xs text-amber-800 font-medium">
                      Segur? Es reiniciarà el progrés guardat al navegador.
                    </p>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setConfirmReset(false);
                          if (onResetProgress) onResetProgress();
                        }}
                        className="bg-red-500 hover:bg-red-600 text-white text-xs font-bold px-3 py-1.5 rounded-lg transition-colors"
                      >
                        Sí, reiniciar
                      </button>
                      <button
                        onClick={() => setConfirmReset(false)}
                        className="bg-stone-200 hover:bg-stone-300 text-stone-700 text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors"
                      >
                        Cancel·lar
                      </button>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <button
                onClick={onStart}
                className="w-full max-w-sm bg-orange-500 hover:bg-orange-600 text-white text-xl font-bold py-4 px-10 rounded-2xl shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1 flex items-center justify-center gap-3"
              >
                <Play className="w-6 h-6 fill-current" />
                Començar a jugar
              </button>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}

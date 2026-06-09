import React, { useState } from 'react';
import { Tent, TreePine, AlertTriangle, Play, CheckCircle2, Eye, KeyRound, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { GameStats } from '../App';
import { decodeSaveData } from '../lib/saveCode';

interface IntroScreenProps {
  onStart: () => void;
  onRestore: (levelIndex: number, stats: GameStats) => void;
}

export function IntroScreen({ onStart, onRestore }: IntroScreenProps) {
  const [showRestore, setShowRestore] = useState(false);
  const [restoreCode, setRestoreCode] = useState('');
  const [restoreError, setRestoreError] = useState(false);

  const handleRestore = () => {
    const data = decodeSaveData(restoreCode);
    if (data) {
      setRestoreError(false);
      onRestore(data.levelIndex, data.stats);
    } else {
      setRestoreError(true);
    }
  };

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
                <p className="text-stone-600 leading-relaxed">Pensa bé abans de comprovar! El joc registrarà els teus intents i errors perquè el teu professor/a pugui veure el teu progrés.</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center gap-4">
            <button
              onClick={onStart}
              className="w-full max-w-sm bg-orange-500 hover:bg-orange-600 text-white text-xl font-bold py-4 px-10 rounded-2xl shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1 flex items-center justify-center gap-3"
            >
              <Play className="w-6 h-6 fill-current" />
              Començar a jugar
            </button>
            
            <button
              onClick={() => setShowRestore(!showRestore)}
              className="text-stone-500 hover:text-stone-800 font-medium transition-colors flex items-center gap-2"
            >
              <KeyRound className="w-4 h-4" />
              Tinc un codi per restaurar la partida
            </button>

            <AnimatePresence>
              {showRestore && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="w-full max-w-sm overflow-hidden"
                >
                  <div className="bg-stone-50 p-4 rounded-xl border border-stone-200 flex flex-col gap-3 mt-2">
                    <input 
                      type="text" 
                      placeholder="Introdueix el codi aquí..." 
                      value={restoreCode}
                      onChange={(e) => setRestoreCode(e.target.value)}
                      className="w-full px-4 py-2 rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-orange-500 font-mono text-sm"
                    />
                    {restoreError && (
                      <p className="text-red-500 text-sm flex items-center gap-1 font-medium">
                        <AlertCircle className="w-4 h-4" /> Codi invàlid o malformat.
                      </p>
                    )}
                    <button
                      onClick={handleRestore}
                      disabled={!restoreCode.trim()}
                      className="w-full bg-stone-800 hover:bg-stone-900 disabled:bg-stone-300 text-white font-bold py-2 rounded-lg transition-colors"
                    >
                      Restaurar
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

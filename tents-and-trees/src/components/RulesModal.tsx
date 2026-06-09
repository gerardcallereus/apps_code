import React from 'react';
import { Tent, TreePine, AlertTriangle, CheckCircle2, X, MousePointerClick } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface RulesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function RulesModal({ isOpen, onClose }: RulesModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/50 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden border border-stone-200"
          >
            <div className="bg-orange-500 p-6 flex items-center justify-between text-white">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <Tent className="w-7 h-7" />
                Regles del Joc
              </h2>
              <button 
                onClick={onClose}
                className="p-2 hover:bg-white/20 rounded-full transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-6 sm:p-8 grid sm:grid-cols-2 gap-6">
              <div className="flex gap-4 items-start">
                <div className="bg-green-100 p-3 rounded-xl shrink-0">
                  <TreePine className="w-6 h-6 text-green-700" />
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-1">Cada arbre vol una tenda</h3>
                  <p className="text-stone-600 text-sm leading-relaxed">Col·loca exactament una tenda al costat de cada arbre (a dalt, a baix, a l'esquerra o a la dreta, però <strong>mai en diagonal</strong>).</p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <div className="bg-red-100 p-3 rounded-xl shrink-0">
                  <AlertTriangle className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-1">Les tendes no es toquen</h3>
                  <p className="text-stone-600 text-sm leading-relaxed">Dues tendes <strong>mai</strong> poden estar juntes, ni tan sols en diagonal. Han de mantenir les distàncies!</p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <div className="bg-blue-100 p-3 rounded-xl shrink-0">
                  <CheckCircle2 className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-1">Respecta els números</h3>
                  <p className="text-stone-600 text-sm leading-relaxed">Els números de les files i columnes t'indiquen exactament quantes tendes hi ha d'haver en aquella línia.</p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <div className="bg-stone-100 p-3 rounded-xl shrink-0">
                  <MousePointerClick className="w-6 h-6 text-stone-600" />
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-1">Controls</h3>
                  <p className="text-stone-600 text-sm leading-relaxed">
                    <strong>Clic esquerre:</strong> Posa una tenda o herba.<br/>
                    <strong>Clic dret:</strong> Posa herba ràpidament (per marcar on no hi va res).
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6 bg-stone-50 border-t border-stone-100 flex justify-end">
              <button 
                onClick={onClose}
                className="bg-stone-800 hover:bg-stone-900 text-white font-bold py-2.5 px-6 rounded-xl transition-colors"
              >
                Entès!
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

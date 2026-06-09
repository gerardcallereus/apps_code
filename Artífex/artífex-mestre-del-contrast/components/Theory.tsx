import React, { useState } from 'react';
import { ArrowRight, BookOpen, Check, X, Sun, Smartphone } from 'lucide-react';

export const Theory: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const [step, setStep] = useState(0);

  const slides = [
    {
      title: "Per què no veig la pantalla?",
      content: (
        <div className="space-y-4">
          <p>
            T'ha passat mai que estàs al pati o a la platja mirant el mòbil i no veus res? 
            O quan entres a una web amb lletra gris clareta sobre fons blanc i et fan mal els ulls?
          </p>
          <div className="flex items-center gap-4 bg-yellow-100 p-4 rounded-xl text-yellow-800">
            <Sun size={32} />
            <p className="font-bold">Això és culpa del CONTRAST.</p>
          </div>
          <p>
            El contrast és simplement la diferència de "llum" entre el text i el fons. 
            Si hi ha poca diferència, el nostre cervell ha de fer un esforç extra per llegir.
          </p>
        </div>
      ),
    },
    {
      title: "Dissenyar per a tothom",
      content: (
        <div className="space-y-4">
          <p>
            A internet no tothom hi veu igual de bé. Hi ha moltes persones amb dificultats visuals.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
             <div className="bg-white border p-4 rounded-lg shadow-sm">
                <h4 className="font-bold text-indigo-600 mb-2">Daltonisme</h4>
                <p className="text-sm">Hi ha gent que no distingeix bé entre vermell i verd. Si poses text vermell sobre fons verd, per a ells és invisible!</p>
             </div>
             <div className="bg-white border p-4 rounded-lg shadow-sm">
                <h4 className="font-bold text-indigo-600 mb-2">Reflexos</h4>
                <p className="text-sm">Fins i tot amb la vista perfecta, el sol directe a la pantalla fa que el contrast baixi dràsticament.</p>
             </div>
          </div>
        </div>
      ),
    },
    {
      title: "La regla del 'Semàfor'",
      content: (
        <div className="space-y-4">
          <p>Per sort, hi ha unes matemàtiques que ens ajuden a saber si ho estem fent bé. Es diuen normes <strong>WCAG</strong>.</p>
          
          <div className="space-y-3 mt-4">
            <div className="flex items-center gap-3 bg-red-50 p-3 rounded-lg border border-red-100">
              <div className="bg-red-500 text-white font-bold px-3 py-1 rounded">FAIL</div>
              <span>Menys de <strong>3:1</strong>. Costa molt de llegir. Evita-ho!</span>
            </div>
            
            <div className="flex items-center gap-3 bg-yellow-50 p-3 rounded-lg border border-yellow-100">
              <div className="bg-yellow-500 text-white font-bold px-3 py-1 rounded">AA</div>
              <span>Mínim <strong>4.5:1</strong>. És l'aprovat. Es llegeix bé en la majoria de casos.</span>
            </div>

            <div className="flex items-center gap-3 bg-green-50 p-3 rounded-lg border border-green-100">
              <div className="bg-green-600 text-white font-bold px-3 py-1 rounded">AAA</div>
              <span>Òptim <strong>7:1</strong>. L'excel·lent. Contrast súper alt i clar.</span>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "Trucs de dissenyador",
      content: (
        <div className="space-y-6">
          <p className="font-medium">Vols que els teus dissenys (Instagram, PowerPoints, Webs) es vegin professionals?</p>
          
          <div className="grid grid-cols-2 gap-4 text-center">
            <div className="bg-slate-800 text-slate-600 p-4 rounded-lg font-bold">
               Fosc sobre Fosc
               <div className="text-red-500 text-sm mt-1 flex justify-center items-center gap-1"><X size={14}/> Error</div>
            </div>
            <div className="bg-slate-800 text-white p-4 rounded-lg font-bold">
               Clar sobre Fosc
               <div className="text-green-400 text-sm mt-1 flex justify-center items-center gap-1"><Check size={14}/> Genial</div>
            </div>
             <div className="bg-white text-yellow-300 p-4 rounded-lg font-bold border">
               Clar sobre Clar
               <div className="text-red-500 text-sm mt-1 flex justify-center items-center gap-1"><X size={14}/> Error</div>
            </div>
            <div className="bg-white text-slate-900 p-4 rounded-lg font-bold border">
               Fosc sobre Clar
               <div className="text-green-600 text-sm mt-1 flex justify-center items-center gap-1"><Check size={14}/> Genial</div>
            </div>
          </div>
        </div>
      )
    }
  ];

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden min-h-[500px] flex flex-col">
        {/* Header */}
        <div className="bg-indigo-600 p-6 text-white flex items-center gap-3">
          <BookOpen className="w-6 h-6" />
          <h2 className="text-2xl font-bold">Lliçó {step + 1}: {slides[step].title}</h2>
        </div>

        {/* Content */}
        <div className="p-8 flex-grow text-lg text-slate-700 leading-relaxed">
          {slides[step].content}
        </div>

        {/* Footer Navigation */}
        <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-between items-center">
            <div className="flex gap-1">
                {slides.map((_, i) => (
                    <div key={i} className={`h-2 w-2 rounded-full transition-colors ${i === step ? 'bg-indigo-600' : 'bg-slate-300'}`} />
                ))}
            </div>
          
          <button
            onClick={() => {
              if (step < slides.length - 1) {
                setStep(step + 1);
              } else {
                onComplete();
              }
            }}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-full font-bold transition-all shadow-md hover:shadow-lg"
          >
            {step === slides.length - 1 ? "Entesos, vull jugar!" : "Següent"}
            <ArrowRight size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};
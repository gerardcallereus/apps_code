import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Beaker, HelpCircle, CheckCircle2, RotateCcw } from 'lucide-react';

interface Question {
  id: number;
  text: string;
  options: string[];
  correct: number;
  feedback: string;
}

const quizQuestions: Question[] = [
  {
    id: 1,
    text: "Segons la TCM, què passa amb les partícules d'un gas quan augmenta la temperatura?",
    options: ["Es fan més grans", "Es mouen més ràpid", "Es mouen més lent", "Desapareixen"],
    correct: 1,
    feedback: "L'augment de temperatura incrementa l'energia cinètica (velocitat) de les partícules."
  },
  {
    id: 2,
    text: "Quina d'aquestes és una propietat específica de la matèria?",
    options: ["La massa", "El volum", "La densitat", "La longitud"],
    correct: 2,
    feedback: "La densitat és específica perquè ajuda a identificar el tipus de substància."
  },
  {
    id: 3,
    text: "Si un objecte té una massa de 100g i un volum de 50cm³, quina és la seva densitat?",
    options: ["5000 g/cm³", "0.5 g/cm³", "2 g/cm³", "150 g/cm³"],
    correct: 2,
    feedback: "D = m / V = 100 / 50 = 2 g/cm³."
  },
  {
    id: 4,
    text: "Quin estat de la matèria té forma i volum fixos?",
    options: ["Sòlid", "Líquid", "Gas", "Plasma"],
    correct: 0,
    feedback: "En el sòlid, les forces d'atracció són molt fortes."
  },
  {
    id: 5,
    text: "Com s'anomena el pas directe de sòlid a gas?",
    options: ["Fusió", "Vaporització", "Sublimació", "Condensació"],
    correct: 2,
    feedback: "La sublimació és el pas directe sense passar per líquid."
  },
  {
    id: 6,
    text: "Què és la cohesió?",
    options: ["La velocitat de les partícules", "La força que uneix les partícules", "L'espai buit entre partícules", "El pes de la matèria"],
    correct: 1,
    feedback: "La cohesió és la força d'atracció que manté les partícules unides."
  },
  {
    id: 7,
    text: "En quin estat la cohesió és pràcticament nul·la?",
    options: ["Sòlid", "Líquid", "Gas", "En tots igual"],
    correct: 2,
    feedback: "En els gasos les partícules estan molt allunyades i gairebé no s'atreuen."
  },
  {
    id: 8,
    text: "Si un objecte sura en aigua, quina és la seva densitat?",
    options: ["Major de 1 g/cm³", "Igual a 10 g/cm³", "Menor de 1 g/cm³", "Exactament 1 g/cm³"],
    correct: 2,
    feedback: "L'aigua té densitat 1 g/cm³. Per surar, cal tenir menys densitat que el líquid."
  },
  {
    id: 9,
    text: "Quina és la fórmula per calcular la massa si sabem densitat i volum?",
    options: ["m = d / V", "m = d · V", "m = V / d", "m = d + V"],
    correct: 1,
    feedback: "Massa = Densitat multiplicada per Volum."
  },
  {
    id: 10,
    text: "Com s'anomena el pas de gas a sòlid (sublimació inversa)?",
    options: ["Solidificació", "Cristal·lització", "Condensació", "Fusió"],
    correct: 1,
    feedback: "També conegut com a sublimació regressiva o deposició."
  },
  {
    id: 11,
    text: "Què passa amb la cohesió quan escalfem un sòlid?",
    options: ["Augmenta", "Es manté igual", "Disminueix fins a permetre el moviment", "Totes les partícules s'aturen"],
    correct: 2,
    feedback: "La calor augmenta la vibració i debilita les forces de cohesió."
  },
  {
    id: 12,
    text: "El volum és una propietat...",
    options: ["Específica", "General", "Química", "Inexistent"],
    correct: 1,
    feedback: "És general perquè no ens diu de quina substància es tracta."
  },
  {
    id: 13,
    text: "Unitat de la densitat en el SI (Sistema Internacional)?",
    options: ["g/cm³", "kg/m³", "kg/L", "mg/mm³"],
    correct: 1,
    feedback: "Tot i que usem g/cm³ sovint, el SI és kg/m³."
  },
  {
    id: 14,
    text: "Un líquid s'adapta a la forma del recipient perquè...",
    options: ["No té massa", "Les partícules tenen cohesió moderada i llisquen", "Està buit", "Té volum variable"],
    correct: 1,
    feedback: "Les forces de cohesió permeten que estiguin juntes però moure's."
  },
  {
    id: 15,
    text: "Si la temperatura de l'aigua és de -10°C, les partícules...",
    options: ["Es mouen lliurement", "Estan en posicions fixes (Gel)", "S'han evaporat", "Ja no existeixen"],
    correct: 1,
    feedback: "Per sota de 0°C l'aigua és sòlida i les partícules només vibren."
  },
  {
    id: 16,
    text: "Què ocupa més espai (volum): 1kg de ferro o 1kg de suro?",
    options: ["El ferro", "El suro", "Ocupen el mateix", "Depèn de la gravetat"],
    correct: 1,
    feedback: "El suro és molt menys dens, per tant 1kg necessita molt més volum."
  },
  {
    id: 17,
    text: "Què passa amb la temperatura durant el canvi d'estat de sòlid a líquid (fusió)?",
    options: ["Puja ràpidament", "Baixa de cop", "Es manté constant (planell)", "Depèn del foc"],
    correct: 2,
    feedback: "Mentre dura el canvi d'estat, l'energia s'usa per vèncer la cohesió i la temperatura no puja (planell)."
  },
  {
    id: 18,
    text: "Per què el ferro s'enfonsa a l'oli?",
    options: ["Perquè l'oli és groc", "Perquè el ferro és més dens que l'oli", "Perquè el ferro té més massa", "Perquè no li agrada l'oli"],
    correct: 1,
    feedback: "L'enfonsament depèn de la densitat relativa, no de la massa total."
  },
  {
    id: 19,
    text: "A la gràfica d'escalfament de l'aigua, què observem a 100°C?",
    options: ["Un planell on coexisteixen líquid i gas", "L'aigua es congela", "La temperatura segueix pujant", "Només hi ha aigua líquida"],
    correct: 0,
    feedback: "A 100°C es produeix l'ebullició. Durant aquest canvi d'estat, la temperatura es manté constant formant un planell."
  },
  {
    id: 20,
    text: "Segons la TCM, entre les partícules d'un gas hi ha...",
    options: ["Aire", "Aigua", "Buit", "Energia blava"],
    correct: 2,
    feedback: "Entre les partícules no hi ha RES, només espai buit."
  }
];

const Quiz: React.FC<{ onComplete: (score: number) => void }> = ({ onComplete }) => {
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  const handleSelect = (idx: number) => {
    if (showFeedback) return;
    setSelected(idx);
    setShowFeedback(true);
    if (idx === quizQuestions[current].correct) {
      setScore(s => s + 1);
    }
  };

  const nextQuestion = () => {
    if (current < quizQuestions.length - 1) {
      setCurrent(c => c + 1);
      setSelected(null);
      setShowFeedback(false);
    } else {
      setFinished(true);
      onComplete(score + (selected === quizQuestions[current].correct ? 1 : 0));
    }
  };

  const resetQuiz = () => {
    setCurrent(0);
    setSelected(null);
    setShowFeedback(false);
    setScore(0);
    setFinished(false);
  };

  if (finished) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white p-8 rounded-2xl shadow-xl text-center border-t-8 border-indigo-500"
      >
        <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
        <h2 className="text-3xl font-bold text-slate-800 mb-2">Activitat Completada!</h2>
        <p className="text-xl text-slate-600 mb-6">
          Has obtingut {score} de {quizQuestions.length} punts.
        </p>
        <button
          onClick={resetQuiz}
          className="flex items-center gap-2 mx-auto bg-slate-100 hover:bg-slate-200 text-slate-700 px-6 py-3 rounded-full font-semibold transition-colors"
        >
          <RotateCcw className="w-5 h-5" /> Tornar a intentar
        </button>
      </motion.div>
    );
  }

  const q = quizQuestions[current];

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8 flex justify-between items-end">
        <div>
          <span className="text-indigo-600 font-bold tracking-wider text-sm uppercase">Pregunta {current + 1} de {quizQuestions.length}</span>
          <h2 className="text-2xl font-bold text-slate-800 mt-1">{q.text}</h2>
        </div>
        <div className="bg-indigo-50 px-3 py-1 rounded-lg text-indigo-700 font-mono text-sm border border-indigo-100">
          Punts: {score}
        </div>
      </div>

      <div className="space-y-3">
        {q.options.map((opt, i) => (
          <motion.button
            key={i}
            disabled={showFeedback}
            onClick={() => handleSelect(i)}
            whileHover={{ scale: showFeedback ? 1 : 1.01 }}
            whileTap={{ scale: showFeedback ? 1 : 0.98 }}
            className={`w-full text-left p-4 rounded-xl border-2 transition-all flex items-center justify-between ${
              selected === i 
                ? (i === q.correct ? 'bg-green-50 border-green-500 text-green-800' : 'bg-red-50 border-red-500 text-red-800')
                : (showFeedback && i === q.correct ? 'bg-green-50 border-green-500 text-green-800' : 'bg-white border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/30')
            } ${showFeedback && i !== selected && i !== q.correct ? 'opacity-50' : ''}`}
          >
            <span className="text-lg">{opt}</span>
            {showFeedback && i === q.correct && <CheckCircle2 className="w-6 h-6 text-green-500" />}
          </motion.button>
        ))}
      </div>

      <AnimatePresence>
        {showFeedback && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`mt-6 p-4 rounded-xl border-l-4 ${selected === q.correct ? 'bg-green-50 border-green-400 text-green-700' : 'bg-blue-50 border-blue-400 text-blue-700'}`}
          >
            <p className="font-medium">{selected === q.correct ? 'Correcte!' : 'Incorrecte...'}</p>
            <p className="text-sm mt-1">{q.feedback}</p>
            <button
              onClick={nextQuestion}
              className="mt-4 w-full bg-slate-800 text-white py-2 rounded-lg font-bold hover:bg-slate-700 transition-colors"
            >
              Següent
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Quiz;

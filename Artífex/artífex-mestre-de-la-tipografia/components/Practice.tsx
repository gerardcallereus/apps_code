import React, { useState } from 'react';
import { FontCategory, QuizQuestion } from '../types';
import { Target, Check, X, Award } from 'lucide-react';

interface PracticeProps {
  onComplete: () => void;
}

const questions: QuizQuestion[] = [
  {
    id: 1,
    scenario: "La teva marca ven anells de compromís de diamants molt cars i exclusius. Vols transmetre història, serietat i prestigi.",
    brandValues: ["Luxe", "Tradició", "Seriositat"],
    correctCategory: FontCategory.SERIF,
    options: [
      { fontCategory: FontCategory.SERIF, fontFamily: "font-['Playfair_Display']", label: "Opció A" },
      { fontCategory: FontCategory.DISPLAY, fontFamily: "font-['Rubik_Glitch']", label: "Opció B" },
    ],
    explanation: "Excel·lent! Les serifes (Opció A) transmeten història i respecte. La font 'Glitch' (Opció B) seria massa caòtica i faria semblar que els diamants són falsos o poc seriosos."
  },
  {
    id: 2,
    scenario: "Crearàs una línia de polseres de tela i fusta fetes a mà. El teu públic són joves que valoren l'artesania i la proximitat.",
    brandValues: ["Artesania", "Proximitat", "Informal"],
    correctCategory: FontCategory.SCRIPT,
    options: [
      { fontCategory: FontCategory.SANS_SERIF, fontFamily: "font-['Roboto_Mono']", label: "Opció A" },
      { fontCategory: FontCategory.SCRIPT, fontFamily: "font-['Dancing_Script']", label: "Opció B" },
    ],
    explanation: "Correcte! La lletra manuscrita (Opció B) diu 'això ho ha fet una persona', mentre que l'Opció A sembla feta per una màquina o un ordinador."
  },
  {
    id: 3,
    scenario: "La marca 'NEO' fa joies impreses en 3D amb titani. Busques un look futurista, tecnològic i molt net.",
    brandValues: ["Tecnologia", "Minimalisme", "Futur"],
    correctCategory: FontCategory.SANS_SERIF,
    options: [
      { fontCategory: FontCategory.SANS_SERIF, fontFamily: "font-['Montserrat'] font-bold", label: "Opció A" },
      { fontCategory: FontCategory.SERIF, fontFamily: "font-['Merriweather']", label: "Opció B" },
    ],
    explanation: "Exacte! L'Opció A (Pal Sec) és geomètrica i neta, ideal per tecnologia. L'Opció B és massa antiga i clàssica per a una impressora 3D."
  },
  {
    id: 4,
    scenario: "Vols crear una marca de joies inspirada en el Graffiti i la cultura Skate. Vols que sigui impactant i rebel.",
    brandValues: ["Rebeldia", "Carrer", "Impacte"],
    correctCategory: FontCategory.DISPLAY,
    options: [
      { fontCategory: FontCategory.SCRIPT, fontFamily: "font-['Great_Vibes']", label: "Opció A" },
      { fontCategory: FontCategory.DISPLAY, fontFamily: "font-['Rubik_Glitch']", label: "Opció B" },
    ],
    explanation: "Molt bé! L'Opció B és cridanera i 'bruta', perfecta per l'estil urbà. L'Opció A és massa elegant i cursi per a un skater."
  },
  {
    id: 5,
    scenario: "Tens una botiga de joies minimalistes de plata. Tot és molt senzill, 'Zen' i ordenat. Menys és més.",
    brandValues: ["Zen", "Ordre", "Sencillesa"],
    correctCategory: FontCategory.SANS_SERIF,
    options: [
      { fontCategory: FontCategory.SANS_SERIF, fontFamily: "font-['Open_Sans']", label: "Opció A" },
      { fontCategory: FontCategory.DISPLAY, fontFamily: "font-['Abril_Fatface']", label: "Opció B" },
    ],
    explanation: "Bravo! L'Opció A no té distraccions, és pura informació. L'Opció B té massa contrast i adorns per ser minimalista."
  }
];

export const Practice: React.FC<PracticeProps> = ({ onComplete }) => {
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [showFinalScore, setShowFinalScore] = useState(false); // New state to control modal visibility
  const [score, setScore] = useState(0);

  const currentQuestion = questions[currentQIndex];

  const handleSelect = (idx: number) => {
    if (showResult) return;
    setSelectedOption(idx);
    setShowResult(true);
    
    if (currentQuestion.options[idx].fontCategory === currentQuestion.correctCategory) {
      setScore(s => s + 1);
    }
  };

  const handleNext = () => {
    if (currentQIndex < questions.length - 1) {
      setCurrentQIndex(prev => prev + 1);
      setSelectedOption(null);
      setShowResult(false);
    } else {
      // It's the last question, so show the final score modal
      setShowFinalScore(true);
    }
  };

  return (
    // Increased max width to 7xl
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-10 text-center">
        <h2 className="text-4xl md:text-5xl font-extrabold text-gray-800 flex items-center justify-center gap-4">
          <Target className="w-10 h-10" />
          Repte Tipogràfic
        </h2>
        <p className="text-xl text-gray-500 mt-4 font-bold">Pregunta {currentQIndex + 1} de {questions.length}</p>
      </div>

      <div className="bg-white rounded-3xl shadow-xl border-2 border-gray-100 p-10">
        <div className="mb-8">
          <p className="text-2xl md:text-3xl text-gray-900 font-medium mb-6 leading-normal">{currentQuestion.scenario}</p>
          <div className="flex flex-wrap gap-3 mb-8">
            {currentQuestion.brandValues.map(v => (
              <span key={v} className="px-5 py-2 bg-indigo-100 text-indigo-800 rounded-full text-base font-bold uppercase tracking-wide">
                {v}
              </span>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {currentQuestion.options.map((option, idx) => {
            let borderClass = "border-4 border-gray-100 hover:border-indigo-400";
            if (showResult) {
              if (idx === selectedOption) {
                borderClass = option.fontCategory === currentQuestion.correctCategory 
                  ? "border-4 border-green-500 bg-green-50" 
                  : "border-4 border-red-500 bg-red-50";
              } else if (option.fontCategory === currentQuestion.correctCategory) {
                 borderClass = "border-4 border-green-500 border-dashed opacity-60";
              } else {
                 borderClass = "opacity-30 border-4 border-gray-100 grayscale";
              }
            }

            return (
              <button
                key={idx}
                onClick={() => handleSelect(idx)}
                disabled={showResult}
                className={`p-10 rounded-2xl transition-all duration-300 text-center flex flex-col items-center justify-center gap-6 min-h-[250px] ${borderClass}`}
              >
                <span className={`text-6xl md:text-7xl lg:text-8xl ${option.fontFamily}`}>Joieria</span>
                <span className="text-lg text-gray-400 font-mono font-bold bg-white px-3 py-1 rounded-md border border-gray-200">{option.label}</span>
              </button>
            );
          })}
        </div>

        {showResult && (
          <div className={`p-6 rounded-2xl mb-8 flex items-start gap-4 animate-fade-in ${
            questions[currentQIndex].options[selectedOption!].fontCategory === currentQuestion.correctCategory
            ? "bg-green-100 text-green-900"
            : "bg-red-100 text-red-900"
          }`}>
             {questions[currentQIndex].options[selectedOption!].fontCategory === currentQuestion.correctCategory 
               ? <Check className="w-10 h-10 shrink-0 mt-1" /> 
               : <X className="w-10 h-10 shrink-0 mt-1" />
             }
             <div>
               <p className="text-2xl font-bold mb-2">
                 {questions[currentQIndex].options[selectedOption!].fontCategory === currentQuestion.correctCategory 
                   ? "Correcte! Ben vist." 
                   : "Vaja... no és la millor opció."}
               </p>
               <p className="text-xl leading-relaxed opacity-90">{currentQuestion.explanation}</p>
             </div>
          </div>
        )}

        {showResult && (
          <div className="flex justify-end">
             <button 
              onClick={handleNext}
              className="px-10 py-4 bg-indigo-600 text-white rounded-xl font-bold text-xl hover:bg-indigo-700 transition-colors shadow-lg hover:shadow-xl"
            >
              {currentQIndex === questions.length - 1 ? "Veure resultats" : "Següent Repte"}
            </button>
          </div>
        )}
      </div>
      
      {showFinalScore && (
         <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-3xl p-10 max-w-lg w-full text-center shadow-2xl animate-fade-in">
                <Award className="w-24 h-24 text-yellow-500 mx-auto mb-6" />
                <h3 className="text-4xl font-extrabold mb-4 text-gray-900">Part Pràctica Completada!</h3>
                <p className="text-2xl text-gray-600 mb-8">Has encertat <span className="font-bold text-indigo-600">{score}</span> de {questions.length} preguntes.</p>
                <button 
                  onClick={onComplete}
                  className="w-full py-5 bg-black text-white rounded-2xl font-bold text-xl hover:bg-gray-800 transition-transform hover:scale-105"
                >
                  Anar al Laboratori Experimental
                </button>
            </div>
         </div>
      )}
    </div>
  );
};
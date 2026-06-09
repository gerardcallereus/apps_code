import React, { useState } from 'react';
import { FontCategory } from '../types';
import { ArrowRight, BookOpen, CheckCircle, Info } from 'lucide-react';

interface TheoryProps {
  onComplete: () => void;
}

const slides = [
  {
    category: FontCategory.SERIF,
    title: "La Serifa (Serif): La Clàssica",
    fontFamily: "font-['Playfair_Display']",
    sample: "Artífex Joies",
    keywords: ["Elegància", "Tradició", "Respecte", "Alta Gamma"],
    description: "Fixa't en els acabats de les lletres: tenen petits 'peus' o remats (serifes). Aquest estil ve de quan es tallaven lletres en pedra fa segles.",
    usage: "Fes-la servir si la teva marca de joieria és cara, exclusiva, tradicional o vol transmetre molta serietat.",
    color: "bg-stone-100",
    visualStyle: "classic"
  },
  {
    category: FontCategory.SANS_SERIF,
    title: "Pal Sec (Sans Serif): La Moderna",
    fontFamily: "font-['Montserrat']",
    sample: "ARTÍFEX MODERN",
    keywords: ["Minimalisme", "Claredat", "Futur", "Honestedat"],
    description: "'Sans' vol dir 'sense'. Són lletres nues, geomètriques i netes. No tenen cap ornament que distregui.",
    usage: "Ideal si fas joieria contemporània, peces geomètriques, unisex o si vols que la marca es vegi jove i tecnològica.",
    color: "bg-slate-100",
    visualStyle: "clean"
  },
  {
    category: FontCategory.SCRIPT,
    title: "Manuscrita (Script): L'Artesana",
    fontFamily: "font-['Great_Vibes']",
    sample: "Artífex Handmade",
    keywords: ["Creativitat", "Personal", "Amor", "Fet a mà"],
    description: "Imiten l'escriptura a mà amb ploma o pinzell. Tenen corbes i sovint les lletres estan lligades entre elles.",
    usage: "Perfectes si les teves joies són 'handmade', personalitzades, romàntiques o tenen un toc bohèmi.",
    color: "bg-rose-50",
    visualStyle: "elegant"
  },
  {
    category: FontCategory.DISPLAY,
    title: "Decorativa (Display): La Rebel",
    fontFamily: "font-['Rubik_Glitch']",
    sample: "ARTÍFEX",
    keywords: ["Impacte", "Diversió", "Unicitat", "Cridanera"],
    description: "Són fonts dissenyades per NO passar desapercebudes. Trenquen les normes, tenen formes estranyes i molta personalitat.",
    usage: "Atenció! Fes-les servir NOMÉS per al logotip. Si escrius un text llarg amb això, ningú ho podrà llegir.",
    color: "bg-gray-900", // Dark background for visual side
    visualStyle: "striking"
  }
];

export const Theory: React.FC<TheoryProps> = ({ onComplete }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(prev => prev + 1);
    } else {
      onComplete();
    }
  };

  const slide = slides[currentSlide];
  const isLastSlide = currentSlide === slides.length - 1;

  // Render logic for different visual styles based on font type
  const renderVisual = () => {
    if (slide.visualStyle === 'striking') {
      return (
        <div className="w-full md:w-1/2 p-4 md:p-12 flex flex-col justify-center items-center relative overflow-hidden bg-black text-white min-h-[400px]">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20"></div>
          <div className="absolute inset-0 bg-gradient-to-br from-purple-600 via-pink-600 to-yellow-500 opacity-30 mix-blend-overlay"></div>
          
          <h3 className="text-xl font-bold uppercase tracking-[0.5em] text-yellow-400 mb-10 z-10 animate-pulse">{slide.category}</h3>
          
          <p className={`text-6xl md:text-8xl xl:text-9xl ${slide.fontFamily} text-center leading-tight z-10 text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-pink-500 to-cyan-400 drop-shadow-[4px_4px_0_rgba(255,255,255,0.2)] transform -rotate-3 hover:rotate-0 transition-transform duration-300 w-full break-words px-4`}>
            {slide.sample}
          </p>
          
          <p className={`mt-10 text-3xl md:text-4xl ${slide.fontFamily} text-white opacity-80 z-10 tracking-widest`}>Aa Bb Cc 123</p>
        </div>
      );
    }

    return (
      <div className={`w-full md:w-1/2 p-4 md:p-12 flex flex-col justify-center items-center border-b md:border-b-0 md:border-r border-black/10 relative min-h-[400px] ${slide.color}`}>
        <h3 className="text-xl uppercase tracking-widest opacity-70 mb-8 font-bold text-gray-800">{slide.category}</h3>
        <p className={`text-6xl md:text-8xl xl:text-9xl ${slide.fontFamily} text-center leading-tight transition-all hover:scale-105 duration-500 text-gray-900 w-full break-words px-4`}>
          {slide.sample}
        </p>
        <p className={`mt-8 text-3xl md:text-4xl ${slide.fontFamily} opacity-60 text-gray-700`}>Aa Bb Cc 123</p>
      </div>
    );
  };

  return (
    // Changed max-w-6xl to max-w-[95%] xl:max-w-[1600px] for much wider layout
    <div className="max-w-[95%] xl:max-w-[1600px] mx-auto p-6 animate-fade-in">
      <div className="mb-10 text-center">
        <h2 className="text-4xl md:text-5xl font-extrabold text-gray-800 flex items-center justify-center gap-4">
          <BookOpen className="w-10 h-10" />
          Teoria Tipogràfica
        </h2>
        <p className="text-xl text-gray-500 mt-4 font-medium">Fitxa {currentSlide + 1} de {slides.length}</p>
      </div>

      <div className={`rounded-[2.5rem] shadow-2xl overflow-hidden transition-all duration-500 min-h-[600px] flex flex-col md:flex-row border-4 border-gray-100`}>
        {/* Visual Example Side */}
        {renderVisual()}

        {/* Information Side - ALWAYS WHITE BACKGROUND FOR READABILITY */}
        <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center bg-white">
          <h3 className="text-4xl font-extrabold mb-6 text-gray-900">{slide.title}</h3>
          
          <div className="space-y-6 mb-10">
            <div className="bg-slate-50 p-6 rounded-2xl border-l-8 border-slate-200">
               <p className="text-2xl leading-relaxed font-medium text-gray-700">{slide.description}</p>
            </div>
            
            <div className="flex items-start gap-4 text-lg text-gray-700 bg-blue-50 p-5 rounded-xl border border-blue-100">
              <Info className="w-8 h-8 text-blue-600 shrink-0 mt-0.5" />
              <p><span className="font-bold text-blue-800 block mb-1">Quan utilitzar-la?</span> {slide.usage}</p>
            </div>
          </div>
          
          <div className="mb-10">
            <span className="text-sm font-bold text-gray-400 uppercase block mb-4 tracking-wider">Emocions que transmet:</span>
            <div className="flex flex-wrap gap-3">
              {slide.keywords.map(k => (
                <span key={k} className="px-5 py-3 bg-gray-100 text-gray-800 rounded-xl text-lg font-bold border border-gray-200 shadow-sm">
                  {k}
                </span>
              ))}
            </div>
          </div>

          <button 
            onClick={handleNext}
            className="self-end px-10 py-5 bg-black text-white rounded-2xl hover:bg-gray-800 transition-all hover:shadow-xl flex items-center gap-3 font-bold text-xl group mt-auto"
          >
            {isLastSlide ? "Anar a la Pràctica" : "Següent Estil"}
            {isLastSlide ? <CheckCircle className="w-7 h-7"/> : <ArrowRight className="w-7 h-7 group-hover:translate-x-1 transition-transform"/>}
          </button>
        </div>
      </div>
      
      <div className="flex justify-center mt-10 gap-4">
        {slides.map((_, idx) => (
          <button 
            key={idx} 
            onClick={() => setCurrentSlide(idx)}
            className={`h-4 rounded-full transition-all duration-300 ${idx === currentSlide ? 'w-16 bg-gray-900' : 'w-4 bg-gray-300 hover:bg-gray-400'}`}
          />
        ))}
      </div>
    </div>
  );
};
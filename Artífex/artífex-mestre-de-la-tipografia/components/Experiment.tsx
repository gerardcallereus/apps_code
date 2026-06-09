import React, { useState } from 'react';
import { FontCategory } from '../types';
import { Sparkles, FlaskConical, RotateCcw, Check, Tag } from 'lucide-react';

// 40 Adjectives mapped to categories
const ADJECTIVES = [
  // Serifa (Tradició/Luxe)
  { word: "Elegant", category: FontCategory.SERIF },
  { word: "Clàssica", category: FontCategory.SERIF },
  { word: "Seriosa", category: FontCategory.SERIF },
  { word: "Tradicional", category: FontCategory.SERIF },
  { word: "Luxosa", category: FontCategory.SERIF },
  { word: "Prestigiosa", category: FontCategory.SERIF },
  { word: "Acadèmica", category: FontCategory.SERIF },
  { word: "Històrica", category: FontCategory.SERIF },
  { word: "Fina", category: FontCategory.SERIF },
  { word: "Cultural", category: FontCategory.SERIF },
  // Pal Sec (Modernitat/Neteja)
  { word: "Moderna", category: FontCategory.SANS_SERIF },
  { word: "Minimalista", category: FontCategory.SANS_SERIF },
  { word: "Tecnològica", category: FontCategory.SANS_SERIF },
  { word: "Neta", category: FontCategory.SANS_SERIF },
  { word: "Jove", category: FontCategory.SANS_SERIF },
  { word: "Honesta", category: FontCategory.SANS_SERIF },
  { word: "Simple", category: FontCategory.SANS_SERIF },
  { word: "Racional", category: FontCategory.SANS_SERIF },
  { word: "Futurista", category: FontCategory.SANS_SERIF },
  { word: "Global", category: FontCategory.SANS_SERIF },
  // Manuscrita (Personal/Artesà)
  { word: "Artesana", category: FontCategory.SCRIPT },
  { word: "Personal", category: FontCategory.SCRIPT },
  { word: "Romàntica", category: FontCategory.SCRIPT },
  { word: "Creativa", category: FontCategory.SCRIPT },
  { word: "Delicada", category: FontCategory.SCRIPT },
  { word: "Espontània", category: FontCategory.SCRIPT },
  { word: "Fluida", category: FontCategory.SCRIPT },
  { word: "Amable", category: FontCategory.SCRIPT },
  { word: "Natural", category: FontCategory.SCRIPT },
  { word: "Íntima", category: FontCategory.SCRIPT },
  // Decorativa (Impacte/Rebeldia)
  { word: "Rebel", category: FontCategory.DISPLAY },
  { word: "Impactant", category: FontCategory.DISPLAY },
  { word: "Urbana", category: FontCategory.DISPLAY },
  { word: "Cridanera", category: FontCategory.DISPLAY },
  { word: "Divertida", category: FontCategory.DISPLAY },
  { word: "Única", category: FontCategory.DISPLAY },
  { word: "Agressiva", category: FontCategory.DISPLAY },
  { word: "Sorollosa", category: FontCategory.DISPLAY },
  { word: "Caòtica", category: FontCategory.DISPLAY },
  { word: "Experimental", category: FontCategory.DISPLAY },
].sort(() => Math.random() - 0.5); // Shuffle initially

interface AlgorithmResult {
  category: FontCategory;
  description: string;
}

export const Experiment: React.FC = () => {
  const [step, setStep] = useState<1 | 2>(1);
  const [brandName, setBrandName] = useState('');
  const [selectedAdjectives, setSelectedAdjectives] = useState<string[]>([]);
  const [result, setResult] = useState<AlgorithmResult | null>(null);

  const toggleAdjective = (word: string) => {
    if (selectedAdjectives.includes(word)) {
      setSelectedAdjectives(prev => prev.filter(w => w !== word));
    } else {
      if (selectedAdjectives.length < 3) {
        setSelectedAdjectives(prev => [...prev, word]);
      }
    }
  };

  const calculateResult = () => {
    if (!brandName || selectedAdjectives.length !== 3) return;

    // Count votes per category
    const counts: Record<string, number> = {
      [FontCategory.SERIF]: 0,
      [FontCategory.SANS_SERIF]: 0,
      [FontCategory.SCRIPT]: 0,
      [FontCategory.DISPLAY]: 0,
    };

    selectedAdjectives.forEach(adj => {
      const match = ADJECTIVES.find(a => a.word === adj);
      if (match) {
        counts[match.category]++;
      }
    });

    // Find winner
    let winner = FontCategory.SANS_SERIF; // Default
    let maxVotes = -1;

    Object.entries(counts).forEach(([cat, votes]) => {
      if (votes > maxVotes) {
        maxVotes = votes;
        winner = cat as FontCategory;
      }
    });

    // Generate specific description based on the mix
    let desc = "";
    if (maxVotes === 3) {
      desc = "Has triat tres adjectius molt coherents. La teva marca té una personalitat molt definida i pura.";
    } else if (maxVotes === 2) {
      desc = "Tens una base sòlida amb un petit toc diferent. Això dona riquesa a la marca sense perdre el focus.";
    } else {
      desc = "Has triat una barreja eclèctica. Hem seleccionat l'opció que millor equilibra aquests contrastos.";
    }

    setResult({
      category: winner,
      description: desc
    });
    setStep(2);
  };

  const reset = () => {
    setResult(null);
    setStep(1);
    setBrandName('');
    setSelectedAdjectives([]);
  };

  const getFontFamilyForCategory = (cat: FontCategory) => {
    switch (cat) {
      case FontCategory.SERIF: return "font-['Playfair_Display']";
      case FontCategory.SANS_SERIF: return "font-['Montserrat']";
      case FontCategory.SCRIPT: return "font-['Great_Vibes']";
      case FontCategory.DISPLAY: return "font-['Rubik_Glitch']";
      default: return "font-sans";
    }
  };

  return (
    // Increased max width to 7xl
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-10 text-center">
        <h2 className="text-4xl md:text-5xl font-extrabold text-gray-800 flex items-center justify-center gap-4">
          <FlaskConical className="w-10 h-10 text-indigo-600" />
          Laboratori d'Adjectius
        </h2>
        <p className="text-xl text-gray-500 mt-4">
          Defineix la teva marca amb 3 paraules i l'algoritme trobarà la teva lletra.
        </p>
      </div>

      {step === 1 && (
        <div className="animate-fade-in space-y-8">
          
          {/* Brand Name Input */}
          <div className="bg-white p-8 rounded-3xl shadow-lg border-2 border-indigo-50 text-center max-w-2xl mx-auto">
            <label className="block text-xl font-bold text-gray-800 mb-4">Com es diu la teva marca?</label>
            <input 
              type="text" 
              value={brandName}
              onChange={(e) => setBrandName(e.target.value)}
              placeholder="Ex: Artífex Joies"
              className="w-full p-4 text-center border-b-4 border-gray-200 focus:border-indigo-600 outline-none text-3xl font-bold bg-transparent transition-colors placeholder:text-gray-300"
            />
          </div>

          {/* Adjective Grid */}
          <div className="bg-white p-8 rounded-3xl shadow-xl border-2 border-indigo-100">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                <Tag className="text-indigo-600" />
                Tria'n exactament 3:
              </h3>
              <span className={`px-4 py-2 rounded-full font-bold text-sm ${selectedAdjectives.length === 3 ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                {selectedAdjectives.length} / 3 seleccionats
              </span>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">
              {ADJECTIVES.map((item, idx) => {
                const isSelected = selectedAdjectives.includes(item.word);
                const isDisabled = !isSelected && selectedAdjectives.length >= 3;

                return (
                  <button
                    key={idx}
                    onClick={() => toggleAdjective(item.word)}
                    disabled={isDisabled}
                    className={`
                      relative p-3 rounded-xl text-sm md:text-base font-bold transition-all duration-200 border-2
                      ${isSelected 
                        ? 'bg-indigo-600 text-white border-indigo-600 transform scale-105 shadow-md z-10' 
                        : 'bg-slate-50 text-gray-600 border-slate-100 hover:border-indigo-200 hover:bg-white'}
                      ${isDisabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}
                    `}
                  >
                    {item.word}
                    {isSelected && <Check size={16} className="absolute top-1 right-1 opacity-50" />}
                  </button>
                );
              })}
            </div>

            <div className="mt-10 flex justify-center">
              <button 
                onClick={calculateResult}
                disabled={!brandName || selectedAdjectives.length !== 3}
                className="w-full md:w-auto px-12 py-5 bg-black text-white rounded-2xl font-bold text-2xl hover:bg-gray-800 hover:shadow-xl transition-all disabled:opacity-50 flex items-center justify-center gap-3 disabled:cursor-not-allowed"
              >
                <Sparkles className="w-6 h-6" />
                Analitzar ADN de la Marca
              </button>
            </div>
          </div>
        </div>
      )}

      {step === 2 && result && (
        <div className="animate-fade-in max-w-5xl mx-auto">
          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-200">
            
            {/* Header Result */}
            <div className="bg-gray-900 p-10 text-center text-white relative overflow-hidden">
               <div className="absolute inset-0 bg-indigo-600 opacity-20 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-400 via-gray-900 to-gray-900"></div>
               <div className="relative z-10">
                 <p className="text-indigo-300 font-bold uppercase tracking-widest text-sm mb-4">Resultat de l'anàlisi</p>
                 <h2 className="text-4xl md:text-5xl font-extrabold mb-2">{result.category}</h2>
                 <div className="flex justify-center gap-2 mt-6">
                    {selectedAdjectives.map(adj => (
                      <span key={adj} className="px-3 py-1 bg-white/10 rounded-full text-sm backdrop-blur-sm border border-white/20">
                        {adj}
                      </span>
                    ))}
                 </div>
               </div>
            </div>

            {/* Preview Section */}
            <div className="p-16 text-center bg-gray-50 border-b border-gray-200">
               <p className="text-xs text-gray-400 uppercase tracking-[0.3em] font-bold mb-10">Previsualització Oficial</p>
               <h1 className={`text-6xl md:text-8xl xl:text-9xl text-gray-900 ${getFontFamilyForCategory(result.category)} break-words leading-tight drop-shadow-sm`}>
                 {brandName}
               </h1>
            </div>

            {/* Explanation */}
            <div className="p-10 bg-white">
              <div className="flex gap-6 items-start">
                <div className="bg-indigo-100 p-4 rounded-2xl text-indigo-700 hidden md:block">
                  <FlaskConical size={32} />
                </div>
                <div>
                  <h4 className="text-2xl font-bold text-gray-800 mb-3">Per què aquesta tipografia?</h4>
                  <p className="text-xl text-gray-600 leading-relaxed">
                    {result.description} Els adjectius que has triat ({selectedAdjectives.join(', ').toLowerCase()}) demanen 
                    una lletra que transmeti <strong>{result.category === FontCategory.SERIF ? 'respecte i tradició' : 
                                              result.category === FontCategory.SANS_SERIF ? 'modernitat i claredat' :
                                              result.category === FontCategory.SCRIPT ? 'proximitat i artesania' : 'impacte i diferència'}</strong>.
                  </p>
                </div>
              </div>

              <button 
                onClick={reset}
                className="mt-10 w-full py-5 border-4 border-gray-100 text-gray-900 rounded-2xl font-bold text-xl hover:bg-gray-100 hover:border-gray-200 transition-colors flex items-center justify-center gap-3"
              >
                <RotateCcw size={24} />
                Tornar a començar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
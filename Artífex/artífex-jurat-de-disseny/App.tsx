import React, { useState, useEffect, useMemo } from 'react';
import { GameState, LocalBrand, VerdictType } from './types';
import { GAME_BRANDS } from './data';
import { Button } from './components/Button';
import { ScoreGauge } from './components/ScoreGauge';

// --- Icons ---
const CheckIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M20 6L9 17l-5-5" />
  </svg>
);

const XIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M18 6L6 18M6 6l12 12" />
  </svg>
);

const BulbIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M12 2a7 7 0 0 1 7 7c0 2.38-1.19 4.47-3 5.74V17a2 2 0 0 1-2 2H10a2 2 0 0 1-2-2v-2.26C6.19 13.47 5 11.38 5 9a7 7 0 0 1 7-7z"></path>
    <path d="M9 21h6"></path>
  </svg>
);

const CategoryIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect x="3" y="3" width="7" height="7"></rect>
    <rect x="14" y="3" width="7" height="7"></rect>
    <rect x="14" y="14" width="7" height="7"></rect>
    <rect x="3" y="14" width="7" height="7"></rect>
  </svg>
);

export default function App() {
  const [gameState, setGameState] = useState<GameState>('intro');
  const [currentRound, setCurrentRound] = useState(0);
  const [totalScore, setTotalScore] = useState(0);
  const [roundPoints, setRoundPoints] = useState(0);
  
  // Player inputs
  const [verdict, setVerdict] = useState<VerdictType>(null);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const currentBrand = GAME_BRANDS[currentRound];
  const isLastRound = currentRound === GAME_BRANDS.length - 1;

  // --- Logic ---

  // Memoize shuffled tags so they don't re-shuffle on every render (click), only when brand changes
  const shuffledTags = useMemo(() => {
    // Create a copy of the array and sort it randomly
    return [...currentBrand.availableTags].sort(() => Math.random() - 0.5);
  }, [currentBrand]);

  const handleStartGame = () => {
    setCurrentRound(0);
    setTotalScore(0);
    setGameState('playing');
    resetInputs();
  };

  const resetInputs = () => {
    setVerdict(null);
    setSelectedTags([]);
    setRoundPoints(0);
  };

  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(prev => prev.filter(t => t !== tag));
    } else {
      if (selectedTags.length < 3) {
        setSelectedTags(prev => [...prev, tag]);
      }
    }
  };

  const submitRound = () => {
    if (!verdict) return;

    let points = 0;

    // 1. Verdict (50 pts)
    const correctVerdict = currentBrand.isGood ? 'GOOD' : 'BAD';
    if (verdict === correctVerdict) {
      points += 50;
    }

    // 2. Tags (50 pts distributed)
    // For each selected tag that is in correctTags, give points
    // Max 3 tags correct. 50 / 3 approx 16.6 pts per tag.
    // Let's standardize: 15 pts per correct tag.
    let correctTagsCount = 0;
    selectedTags.forEach(tag => {
      if (currentBrand.correctTags.includes(tag)) {
        points += 15;
        correctTagsCount++;
      }
    });

    // Bonus for perfect round
    if (verdict === correctVerdict && correctTagsCount === 3) {
      points += 5; // Round up to 100
    }

    setRoundPoints(points);
    setTotalScore(prev => prev + points);
    setGameState('feedback');
  };

  const nextRound = () => {
    if (isLastRound) {
      setGameState('summary');
    } else {
      setCurrentRound(prev => prev + 1);
      resetInputs();
      setGameState('playing');
    }
  };

  // --- Render Components ---

  const Background = () => (
    <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:40px_40px] opacity-50"></div>
      
      {/* Blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-indigo-900/20 rounded-full blur-[120px] animate-float"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] bg-purple-900/20 rounded-full blur-[120px] animate-float" style={{ animationDelay: '2s' }}></div>
      <div className="absolute top-[40%] left-[40%] w-[30vw] h-[30vw] bg-rose-900/10 rounded-full blur-[100px] animate-float" style={{ animationDelay: '4s' }}></div>
    </div>
  );

  const renderIntro = () => (
    <div className="relative flex flex-col items-center justify-center flex-grow p-6 text-center">
      <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center">
        {/* Badge */}
        <div className="mb-8 animate-fade-in-up">
           <span className="px-4 py-1.5 rounded-full border border-white/10 bg-white/5 text-zinc-300 text-[10px] font-bold uppercase tracking-[0.3em] backdrop-blur-md shadow-lg">
             Projecte Artífex v1.1
           </span>
        </div>

        {/* Main Title */}
        <h1 className="text-7xl md:text-9xl font-black text-white brand-font tracking-tighter leading-[0.9] mb-8 drop-shadow-2xl">
          JURAT<br />
          <span className="text-zinc-600">DE</span> DISSENY
        </h1>
        
        {/* Description Card */}
        <div className="glass-panel p-8 rounded-2xl max-w-2xl mx-auto mb-12 border border-white/10 shadow-2xl backdrop-blur-xl bg-zinc-900/40">
            <p className="text-xl md:text-2xl text-zinc-300 leading-relaxed font-light">
              Tens fusta de dissenyador? <br/>
              T'ensenyaré <strong className="text-white font-bold">10 marques</strong>. <br/>
              Tu decideixes si són bones o un desastre.
            </p>
        </div>
        
        <Button onClick={handleStartGame} className="!bg-white !text-black group relative text-xl px-16 py-6 hover:!bg-zinc-200 hover:scale-105 transition-all duration-300 font-black tracking-wider shadow-[0_0_40px_rgba(255,255,255,0.3)]">
          <span className="absolute inset-0 rounded-lg border-2 border-white opacity-50 scale-105 group-hover:scale-110 transition-transform duration-500"></span>
          COMENÇAR JOC
        </Button>
      </div>
    </div>
  );

  const renderPlaying = () => {
    const isReadyToSubmit = verdict !== null && selectedTags.length === 3;

    return (
      <div className="w-full max-w-7xl mx-auto px-4 py-4 flex-grow flex flex-col min-h-0">
        
        {/* Header HUD */}
        <div className="flex-shrink-0 flex justify-between items-end mb-6 border-b border-white/10 pb-4">
            <div className="flex flex-col gap-1">
                <span className="text-[10px] font-bold text-zinc-500 tracking-[0.2em] uppercase">Progrés</span>
                <div className="flex items-center gap-3">
                   <span className="text-2xl font-bold brand-font text-white">{currentRound + 1} <span className="text-zinc-600 text-lg">/ {GAME_BRANDS.length}</span></span>
                </div>
                {/* Sleek Progress Bar */}
                <div className="h-1 w-32 bg-zinc-800 rounded-full overflow-hidden mt-1">
                    <div className="h-full bg-white shadow-[0_0_10px_rgba(255,255,255,0.5)] transition-all duration-500" style={{ width: `${((currentRound + 1) / GAME_BRANDS.length) * 100}%` }}></div>
                </div>
            </div>
            <div className="flex flex-col items-end">
               <span className="text-[10px] font-bold text-zinc-500 tracking-[0.2em] uppercase">Puntuació</span>
               <div className="text-3xl font-bold brand-font text-indigo-400 drop-shadow-lg">{totalScore}</div>
            </div>
        </div>

        {/* Main Content - Two Columns Layout */}
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-10 lg:items-start flex-grow min-h-0">
            
            {/* LEFT COLUMN: Brand Visuals */}
            <div className="lg:w-5/12 flex flex-col flex-shrink-0 lg:sticky lg:top-4 gap-4">
                
                {/* NEW IMPROVED CATEGORY DISPLAY */}
                <div className="w-full mb-2">
                    <div className="text-[10px] text-zinc-500 font-bold uppercase tracking-[0.2em] mb-2 flex items-center gap-2">
                        <CategoryIcon className="w-4 h-4" />
                        Sector / Indústria
                    </div>
                    <div className="w-full bg-zinc-800/80 backdrop-blur border border-white/10 rounded-xl p-4 flex items-center gap-4 shadow-lg relative overflow-hidden group">
                        <div className="absolute inset-0 bg-indigo-500/10 -skew-x-12 translate-x-full group-hover:translate-x-[-100%] transition-transform duration-1000"></div>
                        <div className="w-10 h-10 rounded-lg bg-indigo-500 flex items-center justify-center shadow-lg shadow-indigo-500/30 flex-shrink-0">
                             <CategoryIcon className="w-6 h-6 text-white" />
                        </div>
                        <span className="text-xl md:text-2xl font-bold text-white brand-font tracking-tight">
                            {currentBrand.category}
                        </span>
                    </div>
                </div>

                {/* Image Container with "Tech" border */}
                <div className="relative group w-full max-w-sm lg:max-w-full mx-auto aspect-square rounded-2xl overflow-hidden border border-white/10 bg-zinc-900 shadow-2xl">
                    <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent pointer-events-none z-10"></div>
                    <img 
                        src={currentBrand.logoUrl} 
                        alt={currentBrand.name} 
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute bottom-0 left-0 w-full p-6 bg-gradient-to-t from-black via-black/80 to-transparent z-20">
                        <h2 className="text-4xl font-bold text-white brand-font tracking-tight">{currentBrand.name}</h2>
                    </div>
                </div>
            </div>

            {/* RIGHT COLUMN: Controls */}
            <div className="lg:w-7/12 flex flex-col gap-6 flex-grow pb-8 lg:pb-0">
                
                {/* Step 1: Verdict */}
                <div className="glass-panel bg-zinc-900/40 border-white/5 rounded-2xl p-6 flex-shrink-0">
                    <h3 className="text-xs text-zinc-500 uppercase tracking-[0.2em] font-bold mb-6 flex items-center gap-2">
                        <span className="flex items-center justify-center w-5 h-5 rounded bg-white text-black text-[10px] font-bold">1</span> 
                        VEREDICTE
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                        <button 
                            onClick={() => setVerdict('BAD')}
                            className={`group relative h-32 rounded-xl border transition-all duration-300 flex flex-col items-center justify-center gap-3 overflow-hidden
                                ${verdict === 'BAD' 
                                    ? 'bg-rose-500/10 border-rose-500 text-rose-400 shadow-[0_0_30px_rgba(244,63,94,0.2)]' 
                                    : 'bg-zinc-900/50 border-zinc-800 text-zinc-500 hover:bg-zinc-800 hover:border-zinc-600 hover:text-zinc-300'
                                }`}
                        >
                            <div className={`absolute inset-0 bg-rose-500/5 transform transition-transform duration-500 ${verdict === 'BAD' ? 'translate-y-0' : 'translate-y-full group-hover:translate-y-0'}`}></div>
                            <XIcon className={`w-12 h-12 relative z-10 transition-transform duration-300 ${verdict === 'BAD' ? 'scale-110' : 'group-hover:scale-110'}`} />
                            <span className="font-bold uppercase tracking-wider text-sm relative z-10 font-brand">DOLENTA</span>
                        </button>

                        <button 
                            onClick={() => setVerdict('GOOD')}
                            className={`group relative h-32 rounded-xl border transition-all duration-300 flex flex-col items-center justify-center gap-3 overflow-hidden
                                ${verdict === 'GOOD' 
                                    ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400 shadow-[0_0_30px_rgba(16,185,129,0.2)]' 
                                    : 'bg-zinc-900/50 border-zinc-800 text-zinc-500 hover:bg-zinc-800 hover:border-zinc-600 hover:text-zinc-300'
                                }`}
                        >
                            <div className={`absolute inset-0 bg-emerald-500/5 transform transition-transform duration-500 ${verdict === 'GOOD' ? 'translate-y-0' : 'translate-y-full group-hover:translate-y-0'}`}></div>
                            <CheckIcon className={`w-12 h-12 relative z-10 transition-transform duration-300 ${verdict === 'GOOD' ? 'scale-110' : 'group-hover:scale-110'}`} />
                            <span className="font-bold uppercase tracking-wider text-sm relative z-10 font-brand">BONA</span>
                        </button>
                    </div>
                </div>

                {/* Step 2: Tags */}
                <div className={`glass-panel bg-zinc-900/40 border-white/5 rounded-2xl p-6 transition-all duration-500 flex-grow flex flex-col ${!verdict ? 'opacity-40 pointer-events-none blur-[2px]' : 'opacity-100'}`}>
                    <div className="flex justify-between items-center mb-6 flex-shrink-0">
                        <h3 className="text-xs text-zinc-500 uppercase tracking-[0.2em] font-bold flex items-center gap-2">
                             <span className="flex items-center justify-center w-5 h-5 rounded bg-white text-black text-[10px] font-bold">2</span>
                             ANÀLISI
                        </h3>
                        <span className={`text-[10px] font-bold px-2 py-1 rounded border ${selectedTags.length === 3 ? 'bg-white text-black border-white' : 'bg-zinc-900 text-zinc-500 border-zinc-800'}`}>
                            {selectedTags.length} / 3 SELECCIONATS
                        </span>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3 h-full">
                        {shuffledTags.map((tag) => (
                            <button
                                key={tag}
                                onClick={() => toggleTag(tag)}
                                disabled={selectedTags.length >= 3 && !selectedTags.includes(tag)}
                                className={`relative p-4 rounded-lg border text-base font-medium transition-all duration-200 flex items-center justify-center text-center
                                    ${selectedTags.includes(tag)
                                        ? 'bg-white text-black border-white shadow-[0_0_20px_rgba(255,255,255,0.2)] scale-[1.02] z-10 font-bold'
                                        : 'bg-zinc-900/30 border-zinc-800 text-zinc-400 hover:bg-zinc-800 hover:border-zinc-600 hover:text-white'
                                    }
                                    ${selectedTags.length >= 3 && !selectedTags.includes(tag) ? 'opacity-30' : ''}
                                `}
                            >
                                {tag}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Submit */}
                <Button 
                    onClick={submitRound} 
                    disabled={!isReadyToSubmit}
                    className={`w-full py-5 text-xl rounded-xl flex-shrink-0 shadow-2xl transition-all duration-500 
                        ${isReadyToSubmit ? '!bg-indigo-600 hover:!bg-indigo-500 !text-white translate-y-0 opacity-100' : 'translate-y-4 opacity-0 pointer-events-none'}`}
                >
                    CONFIRMAR DECISIÓ
                </Button>
            </div>
        </div>
      </div>
    );
  };

  const renderFeedback = () => {
    const isVerdictCorrect = verdict === (currentBrand.isGood ? 'GOOD' : 'BAD');
    
    return (
        <div className="w-full max-w-5xl mx-auto px-4 py-8 fade-enter flex flex-col items-center justify-center flex-grow">
            
            {/* Score Header */}
            <div className="text-center mb-8 relative">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-white/10 rounded-full blur-[50px] -z-10"></div>
                <div className="inline-flex items-center justify-center mb-4">
                    {isVerdictCorrect ? (
                        <div className="w-24 h-24 rounded-2xl bg-emerald-500 flex items-center justify-center text-black animate-float shadow-[0_0_50px_rgba(16,185,129,0.4)] rotate-3 border-4 border-black/20">
                            <CheckIcon className="w-12 h-12" />
                        </div>
                    ) : (
                        <div className="w-24 h-24 rounded-2xl bg-rose-500 flex items-center justify-center text-white animate-float shadow-[0_0_50px_rgba(244,63,94,0.4)] -rotate-3 border-4 border-black/20">
                             <XIcon className="w-12 h-12" />
                        </div>
                    )}
                </div>
                <h2 className="text-5xl font-black mb-2 brand-font text-white tracking-tight">
                    {isVerdictCorrect ? 'EXCEL·LENT' : 'ERROR'}
                </h2>
                <div className="inline-block px-4 py-1 rounded-full bg-zinc-900 border border-zinc-800">
                    <span className="text-zinc-400 text-sm font-bold tracking-wide">Has guanyat <span className="text-white text-lg mx-1">{roundPoints}</span> punts</span>
                </div>
            </div>

            {/* Main Feedback Card */}
            <div className="glass-panel bg-zinc-900/60 border-white/10 rounded-3xl overflow-hidden w-full shadow-2xl mb-8 backdrop-blur-xl">
                <div className="flex flex-col md:flex-row">
                    
                    {/* Left: Brand + Status */}
                    <div className="md:w-1/3 bg-black/20 p-8 flex flex-col items-center justify-start border-b md:border-b-0 md:border-r border-white/5">
                         <img 
                            src={currentBrand.logoUrl} 
                            alt={currentBrand.name} 
                            className="w-40 md:w-full aspect-square object-cover rounded-xl border border-zinc-700 shadow-lg mb-6"
                        />
                         <div className={`py-3 px-6 rounded-lg font-bold uppercase tracking-widest text-xs w-full text-center border
                            ${currentBrand.isGood 
                                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' 
                                : 'bg-rose-500/10 border-rose-500/30 text-rose-400'}
                         `}>
                             {currentBrand.isGood ? 'Bon Disseny' : 'Mal Disseny'}
                         </div>
                    </div>

                    {/* Right: Analysis */}
                    <div className="md:w-2/3 p-8">
                        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2 font-brand">
                            <span className="w-1 h-6 bg-indigo-500 rounded-full"></span>
                            L'ANÀLISI DE L'EXPERT
                        </h3>
                        <p className="text-zinc-300 leading-relaxed text-lg mb-8 font-light border-l-2 border-white/5 pl-4">
                            {currentBrand.explanation}
                        </p>

                        {/* Pro Tip Card */}
                        <div className="bg-gradient-to-r from-indigo-900/40 to-purple-900/40 border border-indigo-500/30 rounded-xl p-5 mb-8 relative overflow-hidden group">
                            <div className="absolute -right-6 -top-6 w-20 h-20 bg-indigo-500/20 rounded-full blur-[20px] group-hover:bg-indigo-500/30 transition-colors"></div>
                            <h4 className="flex items-center gap-2 text-indigo-300 font-bold mb-2 text-xs tracking-widest uppercase relative z-10">
                                <BulbIcon className="w-4 h-4" /> Consell Pro
                            </h4>
                            <p className="text-white text-base font-medium leading-relaxed relative z-10">{currentBrand.tip}</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <h4 className="text-[10px] uppercase text-zinc-500 font-bold mb-3 tracking-widest">Claus del disseny</h4>
                                <div className="flex flex-wrap gap-2">
                                    {currentBrand.correctTags.map(tag => (
                                        <span key={tag} className="px-3 py-1.5 bg-zinc-800 border border-zinc-700 text-zinc-200 rounded text-xs font-bold">
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </div>
                             <div>
                                <h4 className="text-[10px] uppercase text-zinc-500 font-bold mb-3 tracking-widest">La teva elecció</h4>
                                <div className="flex flex-wrap gap-2">
                                    {selectedTags.map(tag => {
                                        const isCorrect = currentBrand.correctTags.includes(tag);
                                        return (
                                            <span key={tag} className={`px-3 py-1.5 border rounded text-xs font-bold flex items-center gap-1.5
                                                ${isCorrect 
                                                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' 
                                                    : 'bg-rose-500/10 border-rose-500/30 text-rose-400 line-through decoration-rose-500/50'
                                                }
                                            `}>
                                                {isCorrect ? <CheckIcon className="w-3 h-3" /> : <XIcon className="w-3 h-3" />}
                                                {tag}
                                            </span>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Button onClick={nextRound} className="!bg-white !text-black w-full md:w-auto px-16 py-4 text-lg hover:!bg-zinc-200 shadow-[0_0_30px_rgba(255,255,255,0.2)]">
                {isLastRound ? 'RESULTATS FINALS' : 'SEGÜENT DISSENY'}
            </Button>
        </div>
    );
  };

  const renderSummary = () => {
    const maxScore = GAME_BRANDS.length * 100; // 50 + 45 + bonus 5
    const percentage = Math.round((totalScore / maxScore) * 100);
    
    let rank = "Aprenent Visual";
    let message = "El disseny té moltes normes. Segueix practicant i fixant-te en els logos pel carrer!";
    
    if (percentage > 30) { rank = "Ull Crític"; message = "No està malament! Comences a veure els errors més greus, però et falten detalls."; }
    if (percentage > 60) { rank = "Expert en Estil"; message = "Molt bé! Tens molt bon gust i saps distingir el que és bo del que no."; }
    if (percentage > 85) { rank = "Mestre del Disseny"; message = "Increïble! Podries treballar fent logos demà mateix."; }

    return (
        <div className="flex flex-col items-center justify-center flex-grow p-6 animate-float">
            <h2 className="text-4xl md:text-6xl font-black mb-10 brand-font text-white tracking-tight text-center">RESULTAT FINAL</h2>
            
            <div className="mb-12 scale-125 relative">
                <div className="absolute inset-0 bg-indigo-500/20 blur-[60px] rounded-full"></div>
                <ScoreGauge score={percentage} />
            </div>

            <div className="glass-panel bg-zinc-900/80 backdrop-blur-xl p-10 rounded-3xl border border-white/10 max-w-lg w-full mx-auto mb-12 text-center relative overflow-hidden shadow-2xl">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-rose-500"></div>
                
                <div className="grid grid-cols-2 gap-8 mb-8">
                    <div className="flex flex-col">
                        <span className="text-zinc-500 uppercase tracking-[0.2em] text-[10px] font-bold mb-2">Punts Totals</span>
                        <span className="text-4xl font-bold text-white font-brand">{totalScore}</span>
                    </div>
                    <div className="flex flex-col">
                         <span className="text-zinc-500 uppercase tracking-[0.2em] text-[10px] font-bold mb-2">Precisió</span>
                         <span className="text-4xl font-bold text-white font-brand">{percentage}%</span>
                    </div>
                </div>
                
                <div className="h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent mb-8"></div>

                <div className="text-zinc-500 uppercase tracking-[0.2em] text-[10px] font-bold mb-3">Nivell Assolit</div>
                <div className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-white mb-4 brand-font">{rank}</div>
                <p className="text-zinc-400 text-sm leading-relaxed">{message}</p>
            </div>

            <Button onClick={handleStartGame} className="px-12 py-5 !bg-white !text-black hover:!bg-zinc-200 font-bold tracking-widest text-sm">
                TORNAR A JUGAR
            </Button>
        </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#050505] text-zinc-100 selection:bg-indigo-500/30 flex flex-col overflow-hidden font-sans">
      
      <Background />

      {gameState === 'intro' && renderIntro()}
      {gameState === 'playing' && renderPlaying()}
      {gameState === 'feedback' && renderFeedback()}
      {gameState === 'summary' && renderSummary()}

      <footer className="w-full py-6 text-center z-10">
          <span className="text-zinc-700 text-[10px] uppercase tracking-[0.3em] font-bold brand-font hover:text-zinc-500 transition-colors cursor-default">
            Projecte Artífex
          </span>
      </footer>
      
    </div>
  );
}
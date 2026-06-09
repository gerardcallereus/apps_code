import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Beaker, 
  FlaskConical, 
  Atom, 
  Thermometer, 
  Weight, 
  GraduationCap, 
  ChevronRight, 
  ChevronLeft,
  BookOpen,
  PlayCircle,
  ClipboardList,
  Scale,
  Anchor,
  ArrowUp,
  Info,
  Droplets,
  BookMarked
} from 'lucide-react';
import confetti from 'canvas-confetti';

// Components
import ParticleSim from './components/ParticleSim';
import DensityLab from './components/DensityLab';
import BuoyancySim from './components/BuoyancySim';
import WaterTcm from './components/WaterTcm';
import HeatingCurve from './components/HeatingCurve';
import Glossary from './components/Glossary';
import RealWorldSection from './components/RealWorldSection';
import Quiz from './components/Quiz';

type Section = 'home' | 'tcm' | 'tcm_aigua' | 'estats' | 'propietats' | 'densitat' | 'flotabilitat' | 'quiz' | 'glosari';

export default function App() {
  const [activeSection, setActiveSection] = useState<Section>('home');
  const [temp, setTemp] = useState(25);
  const [viewMode, setViewMode] = useState<'theory' | 'sim'>('theory');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [activeSection]);

  const handleQuizComplete = (score: number) => {
    if (score >= 3) {
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#4f46e5', '#10b981', '#f59e0b']
      });
    }
  };

  const NavItem = ({ section, label, icon: Icon }: { section: Section, label: string, icon: any }) => (
    <button
      onClick={() => { setActiveSection(section); setViewMode('theory'); }}
      className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 w-full text-left group ${
        activeSection === section 
          ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200 translate-x-2' 
          : 'text-slate-500 hover:bg-slate-100 hover:text-slate-700'
      }`}
    >
      <Icon className={`w-5 h-5 transition-transform group-hover:scale-110 ${activeSection === section ? 'text-white' : 'text-slate-400'}`} />
      <span className="font-semibold text-sm">{label}</span>
      {activeSection === section && <motion.div layoutId="nav-pill" className="ml-auto w-1.5 h-1.5 rounded-full bg-white shadow-sm" />}
    </button>
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans selection:bg-indigo-100 selection:text-indigo-900">
      {/* Mobile Header */}
      <header className="lg:hidden bg-white border-b border-slate-200 px-6 py-4 sticky top-0 z-50 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="bg-indigo-600 p-1.5 rounded-lg shadow-sm">
            <FlaskConical className="w-5 h-5 text-white" />
          </div>
          <span className="font-black text-lg tracking-tight text-slate-800 italic uppercase">Xoc Químic</span>
        </div>
      </header>

      <div className="max-w-[1400px] mx-auto flex flex-col lg:flex-row min-h-screen">
        {/* Sidebar Navigation */}
        <aside className="w-full lg:w-72 bg-white border-r border-slate-200 p-6 lg:fixed lg:h-full z-40 overflow-y-auto hidden lg:block">
          <div className="flex items-center gap-3 mb-10 px-2">
            <div className="bg-gradient-to-br from-indigo-600 to-blue-500 p-2 rounded-xl shadow-md rotate-3 group-hover:rotate-0 transition-transform">
              <FlaskConical className="w-6 h-6 text-white" />
            </div>
            <h1 className="font-black text-xl tracking-tight text-slate-800 italic uppercase leading-none">
              Xoc <span className="text-indigo-600 block">Químic</span>
            </h1>
          </div>

          <nav className="space-y-1.5">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-4 px-2">Navegació</p>
            <NavItem section="home" label="Introducció" icon={BookOpen} />
            <NavItem section="tcm" label="Teoria Cinètica" icon={Atom} />
            <NavItem section="tcm_aigua" label="Estat de l'Aigua" icon={Droplets} />
            <NavItem section="estats" label="Estats i Canvis" icon={Thermometer} />
            <NavItem section="propietats" label="Propietats" icon={Weight} />
            <NavItem section="densitat" label="Densitat" icon={Beaker} />
            <NavItem section="flotabilitat" label="Flotabilitat" icon={Anchor} />
            <NavItem section="glosari" label="Glosari de Conceptes" icon={BookMarked} />
            <div className="mt-8 pt-8 border-t border-slate-100">
              <NavItem section="quiz" label="Autoavaluació" icon={ClipboardList} />
            </div>
          </nav>

          <div className="mt-auto pt-10 px-2">
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
              <p className="text-xs text-slate-500 leading-relaxed font-medium">
                Projecte de Ciències <br /> <span className="text-indigo-600">2n d'ESO</span>
              </p>
            </div>
          </div>
        </aside>

        {/* Content Area */}
        <main className="flex-1 lg:ml-72 flex flex-col">
          <header className="hidden lg:flex h-16 bg-white/80 backdrop-blur-md border-b border-slate-200 px-8 items-center justify-between sticky top-0 z-30">
             <div className="flex items-center gap-2 text-slate-400 text-xs font-bold uppercase tracking-widest">
                <GraduationCap className="w-4 h-4" />
                <span>Unitat 1: La Matèria</span>
             </div>
             <div className="flex items-center gap-4">
                <div className="h-2 w-32 bg-slate-100 rounded-full overflow-hidden">
                   <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${(['home', 'tcm', 'tcm_aigua', 'estats', 'propietats', 'densitat', 'flotabilitat', 'quiz'].indexOf(activeSection) + 1) * 12.5}%` }}
                    className="h-full bg-indigo-500" 
                   />
                </div>
                <span className="text-xs font-mono text-slate-500 font-bold">
                  {Math.round((['home', 'tcm', 'tcm_aigua', 'estats', 'propietats', 'densitat', 'flotabilitat', 'quiz'].indexOf(activeSection) + 1) * 12.5)}%
                </span>
             </div>
          </header>

          <div className="p-6 lg:p-10 flex-1 relative overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeSection}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="max-w-4xl mx-auto"
              >
                {activeSection === 'home' && (
                  <div className="space-y-8">
                    <div className="relative group">
                      <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-blue-600 rounded-3xl blur opacity-25 group-hover:opacity-40 transition duration-1000"></div>
                      <div className="relative bg-white p-8 lg:p-12 rounded-3xl shadow-xl border border-slate-100">
                        <div className="flex flex-col lg:flex-row gap-10 items-center">
                          <div className="flex-1 space-y-6">
                            <span className="inline-block bg-indigo-50 text-indigo-600 text-xs font-black uppercase tracking-[0.25em] px-4 py-1.5 rounded-full border border-indigo-100">
                              Benvinguts al laboratori
                            </span>
                            <h2 className="text-4xl lg:text-6xl font-black text-slate-800 tracking-tight leading-none italic">
                              EL <span className="text-indigo-600">XOC</span> QUÍMIC
                            </h2>
                            <p className="text-lg text-slate-600 leading-relaxed max-w-xl">
                              Explora els secrets de la matèria a través d'aquesta unitat interactiva. Aprendràs com es mouen les partícules, per què canvien els estats i com la densitat defineix el món que ens envolta.
                            </p>
                            <div className="flex flex-wrap gap-4">
                              <button 
                                onClick={() => setActiveSection('tcm')}
                                className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-bold hover:bg-slate-800 transition-all shadow-lg hover:shadow-xl active:scale-95 flex items-center gap-2 group"
                              >
                                Comença l'estudi
                                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                              </button>
                            </div>
                          </div>
                          <div className="w-full lg:w-1/3 aspect-square bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 flex items-center justify-center relative overflow-hidden group">
                             <motion.div 
                              animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }}
                              transition={{ duration: 10, repeat: Infinity }}
                              className="text-8xl"
                             >
                              🔬
                             </motion.div>
                             <div className="absolute inset-0 bg-indigo-500/5 group-hover:bg-transparent transition-colors"></div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                        <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center mb-4">
                          <PlayCircle className="w-6 h-6 text-blue-500" />
                        </div>
                        <h4 className="font-bold text-slate-800 mb-2">Simuladors</h4>
                        <p className="text-sm text-slate-500">Inteactua amb la matèria a nivell microscòpic en temps real.</p>
                      </div>
                      <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                        <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center mb-4">
                          <BookOpen className="w-6 h-6 text-amber-500" />
                        </div>
                        <h4 className="font-bold text-slate-800 mb-2">Teoria</h4>
                        <p className="text-sm text-slate-500">Conceptes clau explicats de manera senzilla i visual.</p>
                      </div>
                      <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                        <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center mb-4">
                          <ClipboardList className="w-6 h-6 text-emerald-500" />
                        </div>
                        <h4 className="font-bold text-slate-800 mb-2">Autoavaluació</h4>
                        <p className="text-sm text-slate-500">Posa a prova el que has après amb el test final.</p>
                      </div>
                    </div>
                  </div>
                )}

                {activeSection === 'tcm' && (
                  <div className="space-y-8">
                    <div className="flex items-center justify-between border-b border-slate-200 pb-6">
                       <div>
                          <h2 className="text-3xl font-black text-slate-800 italic uppercase">La Teoria Cinètico-Molecular</h2>
                          <p className="text-slate-500 mt-1">Com es comporta la matèria per dins?</p>
                       </div>
                       <div className="flex bg-slate-100 p-1 rounded-xl">
                          <button 
                            onClick={() => setViewMode('theory')}
                            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${viewMode === 'theory' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500'}`}
                          >
                            CONCEPTES
                          </button>
                          <button 
                            onClick={() => setViewMode('sim')}
                            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${viewMode === 'sim' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500'}`}
                          >
                            SIMULADOR
                          </button>
                       </div>
                    </div>

                    {viewMode === 'theory' ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-6">
                          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                            <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
                              <span className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[10px]">1</span>
                              Partícules diminutes
                            </h3>
                            <p className="text-slate-600 leading-relaxed text-sm">
                              Tota la matèria està formada per partícules extremadament petites que són invisibles a simple vista.
                            </p>
                          </div>
                          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                            <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
                              <span className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[10px]">2</span>
                              En moviment constant
                            </h3>
                            <p className="text-slate-600 leading-relaxed text-sm">
                              Aquestes partícules es mouen o vibren de forma continua. La seva velocitat depèn de l'energia (calor).
                            </p>
                          </div>
                          <div className="bg-indigo-600 p-6 rounded-2xl text-white shadow-xl shadow-indigo-100">
                            <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
                              <Atom className="w-5 h-5 text-indigo-300" /> Forces de Cohesió
                            </h3>
                            <p className="leading-relaxed text-sm opacity-90">
                              Entre les partícules hi ha <strong>forces d'atracció</strong> o cohesió. 
                              <br /><br />
                              Aquestes forces intenten mantenir les partícules juntes. Si l'agitació (temperatura) és molt forta, les partícules guanyen la partida a la cohesió i se separen.
                            </p>
                          </div>
                   
                          <button 
                            onClick={() => setViewMode('sim')}
                            className="w-full flex items-center justify-center gap-2 py-4 bg-slate-100 text-slate-800 rounded-2xl font-bold hover:bg-slate-200 transition-all border border-slate-200"
                          >
                            Anar al Simulador <PlayCircle className="w-5 h-5 text-indigo-500" />
                          </button>
                        </div>
                        <div className="bg-slate-900 rounded-3xl p-8 text-white relative overflow-hidden group">
                           <div className="absolute top-0 right-0 p-4 opacity-10">
                              <Atom className="w-32 h-32" />
                           </div>
                           <h4 className="text-indigo-400 font-bold uppercase tracking-widest text-xs mb-4">El paper de la temperatura</h4>
                           <p className="text-lg leading-relaxed font-medium mb-4 italic">
                             "La temperatura és la mesura de l'agitació de les partícules."
                           </p>
                           <p className="text-xs opacity-70 mb-6 leading-relaxed">
                             Quan augmenta la temperatura, les partícules es mouen amb tanta força que les **forces de cohesió** comencen a fallar. És com si les partícules "vibressin" tant que poguessin trencar els vincles que les mantenen unides.
                           </p>
                           <ul className="space-y-4 text-sm opacity-80">
                             <li className="flex items-center gap-3">
                               <div className="w-1.5 h-1.5 rounded-full bg-indigo-500"></div>
                               Més Temperatura = Més Velocitat
                             </li>
                             <li className="flex items-center gap-3">
                               <div className="w-1.5 h-1.5 rounded-full bg-indigo-500"></div>
                               Menys Temperatura = Més Repòs
                             </li>
                           </ul>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-6">
                        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xl overflow-hidden min-h-[500px] flex flex-col md:flex-row gap-8">
                           <div className="flex-1">
                              <ParticleSim temperature={temp} state="gas" />
                           </div>
                           <div className="w-full md:w-64 space-y-6">
                              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                                <label className="flex justify-between text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">
                                  <span>Temperatura</span>
                                  <span className="text-indigo-600 font-mono italic">{temp} °C</span>
                                </label>
                                <input 
                                  type="range" 
                                  min="0" 
                                  max="100" 
                                  value={temp}
                                  onChange={(e) => setTemp(parseInt(e.target.value))}
                                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                                />
                                <div className="flex justify-between mt-2 text-[10px] text-slate-400 font-bold uppercase">
                                  <span>Fred</span>
                                  <span>Calent</span>
                                </div>
                              </div>
                              <div className="space-y-3">
                                <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Observació</h5>
                                <p className="text-xs text-slate-600 leading-normal bg-white p-3 rounded-lg border border-slate-100 shadow-sm">
                                  {temp < 30 ? "Les partícules es mouen lentament. Tenen poca energia." : 
                                   temp > 70 ? "Les partícules xoquen violentament i es mouen molt ràpid!" : 
                                   "Moviment moderat de les partícules."}
                                </p>
                              </div>
                           </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {activeSection === 'tcm_aigua' && (
                  <div className="space-y-8">
                    <div className="flex items-center justify-between border-b border-slate-200 pb-6">
                       <div>
                          <h2 className="text-3xl font-black text-slate-800 italic uppercase">L'Aigua i els seus estats</h2>
                          <p className="text-slate-500 mt-1">Simulació completa de canvis d'estat segons la TCM</p>
                       </div>
                    </div>
                    
                    <WaterTcm />
                  </div>
                )}

                {activeSection === 'estats' && (
                  <div className="space-y-8">
                    <div className="flex items-center justify-between border-b border-slate-200 pb-6">
                       <div>
                          <h2 className="text-3xl font-black text-slate-800 italic uppercase">Estats de la Matèria</h2>
                          <p className="text-slate-500 mt-1">Sòlid, Líquid i Gas</p>
                       </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                       {[
                         { id: 'solid' as const, label: 'Sòlid', desc: 'Cohesió molt forta. Partícules juntes en posicions fixes. Només vibren.', emoji: '🧊' },
                         { id: 'liquid' as const, label: 'Líquid', desc: 'Cohesió moderada. Partícules properes però amb llibertat per lliscar.', emoji: '💧' },
                         { id: 'gas' as const, label: 'Gas', desc: 'Cohesió gairebé nula. Partícules molt allunyades que es mouen lliurement.', emoji: '☁️' }
                       ].map(st => (
                         <div key={st.id} className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm hover:shadow-lg transition-all group">
                            <div className="p-6">
                               <div className="text-4xl mb-4 grayscale group-hover:grayscale-0 transition-all">{st.emoji}</div>
                               <h3 className="text-xl font-bold text-slate-800 mb-2">{st.label}</h3>
                               <p className="text-sm text-slate-500 leading-relaxed mb-6">{st.desc}</p>
                            </div>
                            <div className="bg-slate-50 p-2">
                               <ParticleSim temperature={st.id === 'solid' ? 10 : st.id === 'liquid' ? 40 : 90} state={st.id} />
                            </div>
                         </div>
                       ))}
                    </div>

                    <div className="bg-slate-900 rounded-3xl p-8 text-indigo-50 relative overflow-hidden">
                       <div className="absolute top-0 right-0 p-10 opacity-10">
                          <Thermometer className="w-40 h-40" />
                       </div>
                       <h3 className="text-xl font-bold mb-4 tracking-tight uppercase italic">El Mapa dels Canvis d'Estat</h3>
                       <p className="text-sm opacity-80 mb-8 max-w-2xl leading-relaxed">
                         Quan subministrem o traiem energia (calor), les partícules guanyen o perden la força contra la cohesió, provocant el canvi.
                       </p>
                       <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                          {[
                            { name: 'Fusió', path: 'Sòlid → Líquid', icon: '🔥' },
                            { name: 'Vaporització', path: 'Líquid → Gas', icon: '♨️' },
                            { name: 'Solidificació', path: 'Líquid → Sòlid', icon: '❄️' },
                            { name: 'Condensació', path: 'Gas → Líquid', icon: '💧' },
                            { name: 'Sublimació', path: 'Sòlid → Gas', icon: '✨' },
                            { name: 'Sublimació inversa', path: 'Gas → Sòlid', icon: '💎' }
                          ].map(c => (
                            <div key={c.name} className="bg-white/5 backdrop-blur-md p-4 rounded-xl border border-white/10 flex items-center gap-3">
                               <div className="text-xl">{c.icon}</div>
                               <div>
                                  <span className="block text-[10px] font-bold uppercase opacity-60">{c.path}</span>
                                  <span className="font-bold text-sm tracking-tight">{c.name}</span>
                               </div>
                            </div>
                          ))}
                       </div>
                    </div>

                    <HeatingCurve />
                  </div>
                )}

                {activeSection === 'propietats' && (
                  <div className="space-y-8">
                    <div className="flex items-center justify-between border-b border-slate-200 pb-6">
                       <div>
                          <h2 className="text-3xl font-black text-slate-800 italic uppercase">Propietats de la matèria</h2>
                          <p className="text-slate-500 mt-1">Generals vs Específiques</p>
                       </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                       <div className="space-y-6">
                          <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm relative overflow-hidden transition-colors hover:border-indigo-200">
                             <div className="flex items-center gap-4 mb-6">
                                <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center">
                                   <Scale className="w-6 h-6 text-indigo-500" />
                                </div>
                                <h3 className="text-2xl font-bold text-slate-800">Generals</h3>
                             </div>
                             <p className="text-slate-600 mb-6 text-sm leading-relaxed">
                                Són aquelles comunes a tota la matèria i no serveixen per identificar una substància.
                             </p>
                             <ul className="space-y-4">
                                <li className="flex items-start gap-4 p-4 bg-slate-50 rounded-2xl">
                                   <div className="font-black text-indigo-200 text-2xl leading-none">M</div>
                                   <div>
                                      <span className="block font-bold text-slate-800">Massa</span>
                                      <span className="text-xs text-slate-500">Quantitat de matèria (kg, g). Balança.</span>
                                   </div>
                                </li>
                                <li className="flex items-start gap-4 p-4 bg-slate-50 rounded-2xl">
                                   <div className="font-black text-indigo-200 text-2xl leading-none">V</div>
                                   <div>
                                      <span className="block font-bold text-slate-800">Volum</span>
                                      <span className="text-xs text-slate-500">Espai que ocupa (m³, L). Proveta.</span>
                                   </div>
                                </li>
                                <li className="flex items-start gap-4 p-4 bg-slate-50 rounded-2xl">
                                   <div className="font-black text-indigo-200 text-2xl leading-none italic">T</div>
                                   <div>
                                      <span className="block font-bold text-slate-800">Temperatura</span>
                                      <span className="text-xs text-slate-500">Mesura de l'agitació tèrmica (°C). Termòmetre.</span>
                                   </div>
                                </li>
                                <li className="flex items-start gap-4 p-4 bg-slate-50 rounded-2xl">
                                   <div className="font-black text-indigo-200 text-2xl leading-none">L</div>
                                   <div>
                                      <span className="block font-bold text-slate-800">Longitud / Àrea</span>
                                      <span className="text-xs text-slate-500">Dimensions espacials.</span>
                                   </div>
                                </li>
                             </ul>
                          </div>
                       </div>

                       <div className="space-y-6">
                       <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm relative overflow-hidden transition-colors hover:border-emerald-200">
                             <div className="flex items-center gap-4 mb-6">
                                <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center">
                                   <FlaskConical className="w-6 h-6 text-emerald-500" />
                                </div>
                                <h3 className="text-2xl font-bold text-slate-800">Específiques</h3>
                             </div>
                             <p className="text-slate-600 mb-6 text-sm leading-relaxed">
                                Tenen un valor propi per a cada substància i ens permeten identificar-la.
                             </p>
                             <div className="p-6 bg-emerald-600 rounded-2xl text-white shadow-xl shadow-emerald-200 relative group overflow-hidden mb-6">
                                <div className="relative z-10">
                                   <h4 className="text-emerald-100 text-[10px] font-black uppercase tracking-[0.25em] mb-2">L'exemple estrella</h4>
                                   <p className="text-3xl font-black italic mb-2 tracking-tight">LA DENSITAT</p>
                                   <p className="text-xs opacity-90 leading-relaxed max-w-[220px]">
                                      Indica la quantitat de <strong>massa</strong> que conté cada unitat de <strong>volum</strong> d'una substància.
                                   </p>
                                </div>
                                <div className="absolute top-2 right-2 text-6xl opacity-10 -rotate-12 transition-transform group-hover:scale-125 group-hover:rotate-0">⚖️</div>
                             </div>

                             <div className="grid grid-cols-2 gap-4">
                                {[
                                   { name: 'Punts Fusió/Ebu', desc: 'Temperatures de canvi' },
                                   { name: 'Duresa', desc: 'Resistència a ratllar-se' },
                                   { name: 'Color / Olor', desc: 'Aspecte visual organolèptic' },
                                   { name: 'Conductivitat', desc: 'Passa el calor/electricitat?' }
                                ].map(p => (
                                   <div key={p.name} className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                      <span className="block font-bold text-slate-800 text-sm italic">{p.name}</span>
                                      <span className="text-[10px] text-slate-500 leading-tight block mt-1">{p.desc}</span>
                                   </div>
                                ))}
                             </div>
                          </div>
                       </div>
                    </div>

                    <RealWorldSection />
                  </div>
                )}

                {activeSection === 'densitat' && (
                  <div className="space-y-8">
                    <div className="flex items-center justify-between border-b border-slate-200 pb-6">
                       <div>
                          <h2 className="text-3xl font-black text-slate-800 italic uppercase">El Laboratori de Densitat</h2>
                          <p className="text-slate-500 mt-1">Mesura i calcula la propietat característica</p>
                       </div>
                    </div>
                    
                    <div className="bg-white p-4 rounded-3xl shadow-2xl border border-slate-100">
                      <DensityLab />
                    </div>

                    <div className="bg-indigo-50 border-2 border-dashed border-indigo-200 p-8 rounded-3xl flex flex-col md:flex-row gap-8 items-center">
                       <div className="flex-1">
                          <h4 className="font-bold text-indigo-900 text-xl mb-4 italic uppercase">Reflexiona i Recorda...</h4>
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                             <div className="bg-white p-3 rounded-xl border border-indigo-100 text-center">
                                <p className="text-[10px] font-bold text-indigo-400 uppercase mb-1">Massa</p>
                                <p className="font-mono font-black text-indigo-800">m = d · V</p>
                             </div>
                             <div className="bg-white p-3 rounded-xl border border-indigo-100 text-center scale-110 shadow-md">
                                <p className="text-[10px] font-bold text-indigo-400 uppercase mb-1">Densitat</p>
                                <p className="font-mono font-black text-indigo-800">d = m / V</p>
                             </div>
                             <div className="bg-white p-3 rounded-xl border border-indigo-100 text-center">
                                <p className="text-[10px] font-bold text-indigo-400 uppercase mb-1">Volum</p>
                                <p className="font-mono font-black text-indigo-800">V = m / d</p>
                             </div>
                          </div>
                          <p className="text-indigo-700 text-xs mt-6 leading-relaxed bg-white/50 p-3 rounded-lg">
                             Has vist com materials amb el mateix volum tenen masses diferents? Aquesta és la màgia de la densitat. Pots predir la massa d'un objecte abans de pesar-lo si coneixes la seva densitat i el volum que ocupa. Multiplicant ambdós valors sabràs exactament què marcarà la balança!
                          </p>
                       </div>
                    </div>
                  </div>
                )}

                {activeSection === 'flotabilitat' && (
                  <div className="space-y-8">
                    <div className="flex items-center justify-between border-b border-slate-200 pb-6">
                       <div>
                          <h2 className="text-3xl font-black text-slate-800 italic uppercase">Flotabilitat i Densitat</h2>
                          <p className="text-slate-500 mt-1">Per què unes coses suren i unes altres no?</p>
                       </div>
                    </div>
                    
                    <div className="bg-white p-4 rounded-3xl shadow-2xl border border-slate-100">
                      <BuoyancySim />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                       <div className="bg-blue-50 p-8 rounded-3xl border border-blue-100">
                          <h4 className="font-bold text-blue-900 mb-3 flex items-center gap-2">
                             <ArrowUp className="w-5 h-5" /> Principi de Flotació
                          </h4>
                          <p className="text-blue-700 text-sm leading-relaxed">
                             Un cos flota quan la seva densitat és <strong>menor</strong> que la del líquid on es troba. El líquid exerceix una força cap amunt anomenada <em>empenyiment</em>.
                          </p>
                       </div>
                       <div className="bg-slate-800 p-8 rounded-3xl text-white">
                          <h4 className="font-bold text-indigo-300 mb-3 flex items-center gap-2">
                             <Info className="w-5 h-5" /> Sabies que...?
                          </h4>
                          <p className="text-xs opacity-80 leading-relaxed">
                             Al Mar Mort, la densitat de l'aigua és molt alta degut a la gran quantitat de sal. Això fa que sigui gairebé impossible enfonsar-se, ja que la nostra densitat mitjana és molt menor que la de l'aigua salada d'allà!
                          </p>
                       </div>
                    </div>
                  </div>
                )}

                {activeSection === 'glosari' && (
                  <div className="space-y-8">
                    <div className="flex items-center justify-between border-b border-slate-200 pb-6">
                       <div>
                          <h2 className="text-3xl font-black text-slate-800 italic uppercase">Glosari Químic</h2>
                          <p className="text-slate-500 mt-1">Conceptes clau per dominar la matèria</p>
                       </div>
                    </div>
                    <Glossary />
                  </div>
                )}

                {activeSection === 'quiz' && (
                  <div className="space-y-8">
                    <div className="flex flex-col items-center text-center mb-10">
                       <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center mb-6 shadow-xl shadow-indigo-200 animate-bounce">
                          <ClipboardList className="w-8 h-8 text-white" />
                       </div>
                       <h2 className="text-4xl font-black text-slate-800 uppercase italic">Test de coneixements</h2>
                       <p className="text-slate-500 mt-2 max-w-md">Completa l'activitat per demostrar que ets un expert en matèria.</p>
                    </div>
                    <Quiz onComplete={handleQuizComplete} />
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          <footer className="bg-white border-t border-slate-200 p-6 flex flex-col items-center">
             <div className="flex items-center gap-2 mb-4">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Projecte Xoc Químic actiu</span>
             </div>
             <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Desenvolupat per a l'ús educatiu local</p>
          </footer>
        </main>
      </div>

      {/* Persistent Navigation for Mobile */}
      <nav className="lg:hidden fixed bottom-6 left-6 right-6 bg-white/80 backdrop-blur-xl border border-white/20 p-2 rounded-2xl shadow-2xl flex justify-around items-center z-50">
        {[
          { icon: BookOpen, s: 'home' },
          { icon: Atom, s: 'tcm' },
          { icon: Droplets, s: 'tcm_aigua' },
          { icon: Thermometer, s: 'estats' },
          { icon: Weight, s: 'propietats' },
          { icon: Beaker, s: 'densitat' },
          { icon: Anchor, s: 'flotabilitat' },
          { icon: BookMarked, s: 'glosari' },
          { icon: ClipboardList, s: 'quiz' }
        ].map(item => (
          <button
            key={item.s}
            onClick={() => setActiveSection(item.s as Section)}
            className={`p-3 rounded-xl transition-all ${activeSection === item.s ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' : 'text-slate-400 hover:bg-slate-100 hover:text-slate-600'}`}
          >
            <item.icon className="w-5 h-5" />
          </button>
        ))}
      </nav>
    </div>
  );
}

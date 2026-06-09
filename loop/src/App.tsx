import React, { useState, useEffect } from 'react';
import { lessons } from './data/lessons';
import { LoopEditor } from './components/LoopEditor';
import { Sparkles, Code2, PlaySquare, BookOpen, Menu, X, Orbit, Disc } from 'lucide-react';
import { DocsModal } from './components/DocsModal';

export default function App() {
  const [activeLessonId, setActiveLessonId] = useState(lessons[0].id);
  const [editorCode, setEditorCode] = useState(lessons[0].initialCode);
  const [loadTrigger, setLoadTrigger] = useState(0);
  const [isDocsOpen, setIsDocsOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth >= 1024;
    }
    return true;
  });

  const activeLesson = lessons.find((l) => l.id === activeLessonId) || lessons[0];

  const handleSetCode = (code: string) => {
    setEditorCode(code);
    setLoadTrigger((prev) => prev + 1);
  };

  const handleSelectLesson = (lessonId: string) => {
    setActiveLessonId(lessonId);
    const newLesson = lessons.find((l) => l.id === lessonId) || lessons[0];
    setEditorCode(newLesson.initialCode);
    setLoadTrigger(0); // Reset load trigger for new lesson
    if (window.innerWidth < 1024) {
      setIsSidebarOpen(false); // Close sidebar on mobile after navigating
    }
  };

  return (
    <div className="flex h-screen bg-zinc-950 text-zinc-100 overflow-hidden font-sans relative selection:bg-lime-500/30 selection:text-lime-200">
      
      {/* Subtle background noise overlay to give analog grit */}
      <div className="absolute inset-0 studio-noise pointer-events-none z-0"></div>

      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/70 z-40 lg:hidden backdrop-blur-sm"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}

      {/* Sidebar / Navigation */}
      <nav className={`fixed lg:relative bg-zinc-950 border-r border-zinc-900 flex flex-col h-full flex-shrink-0 z-40 transition-all duration-300 ${isSidebarOpen ? 'w-80 translate-x-0' : 'w-0 -translate-x-full overflow-hidden border-r-0'}`}>
        
        {/* Sidebar Header with Neon Brand */}
        <div className="h-20 p-6 border-b border-zinc-900 bg-zinc-950 flex items-center justify-between">
          <div className="flex items-center gap-3 relative">
            <div className="w-9 h-9 bg-lime-500/10 text-lime-400 border border-lime-500/30 rounded-xl flex items-center justify-center font-bold shadow-[0_0_12px_rgba(163,230,53,0.15)]">
              <Orbit size={20} className="animate-spin-slow" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-black tracking-widest text-white font-display uppercase">LOOP STUDIO</h1>
                <div className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-lime-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-lime-500"></span>
                </div>
              </div>
              <span className="text-[9px] uppercase tracking-widest text-zinc-500 font-bold -mt-0.5">Beatmaker Pro v2</span>
            </div>
          </div>
          <button className="lg:hidden p-2 text-zinc-400 hover:text-white" onClick={() => setIsSidebarOpen(false)}>
            <X size={20} />
          </button>
        </div>

        {/* Lesson Channels (DAW Track Mix style) */}
        <div className="flex-1 overflow-y-auto p-4 space-y-1.5 bg-zinc-950">
          <h2 className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold mb-4 px-3 mt-2">CANALS DE RITME (TRACKS)</h2>
          {lessons.map((lesson) => {
            const Icon = lesson.icon;
            const isActive = lesson.id === activeLessonId;
            const isExercise = lesson.id.includes('-exercici');

            return (
              <button
                key={lesson.id}
                onClick={() => handleSelectLesson(lesson.id)}
                className={`w-full flex items-center gap-3 py-2.5 rounded-xl transition-all duration-200 text-left cursor-pointer border
                  ${isExercise ? 'px-3 pl-8' : 'px-3'}
                  ${isActive 
                    ? 'bg-zinc-900 text-white border-zinc-800 font-bold shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] shadow-[0_4px_12px_rgba(0,0,0,0.5)]' 
                    : 'text-zinc-450 border-transparent hover:bg-zinc-900/60 hover:text-zinc-200'}
                `}
              >
                {!isExercise && (
                  <div className={`w-2.5 h-2.5 rounded-full border transition-colors ${
                    isActive 
                      ? 'bg-lime-400 border-lime-400 shadow-[0_0_10px_rgba(163,230,53,0.8)]' 
                      : 'bg-zinc-800 border-zinc-700'
                  }`}></div>
                )}
                {isExercise && (
                  <div className={`text-xs ${isActive ? 'text-lime-450 font-bold' : 'text-zinc-655 opacity-60'}`}>↳</div>
                )}
                <span className={`text-[14px] tracking-wide ${isActive ? 'font-semibold text-white' : 'font-medium'} outline-none ${isExercise ? 'text-[13px] opacity-90' : ''}`}>{lesson.title}</span>
              </button>
            );
          })}
        </div>

        {/* Engine Status Block */}
        <div className="p-4 bg-zinc-950 border-t border-zinc-900">
          <div className="p-4 rounded-xl bg-zinc-900/40 border border-zinc-800/80 shadow-[inset_0_1px_0_rgba(255,255,255,0.02)]">
            <h4 className="text-[9px] font-black text-lime-400 uppercase mb-1.5 tracking-widest flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-lime-400"></div>
              LOOP Engine
            </h4>
            <p className="text-[11px] text-zinc-450 leading-relaxed font-medium">Motor de síntesi algorísmica en català. Processant senyals d'àudio en temps real sobre LOOP.</p>
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-full relative overflow-hidden bg-zinc-950 w-full lg:w-auto z-10">
        
        {/* Top bar (Mixer Console style) */}
        <header className="h-20 border-b border-zinc-900 bg-zinc-950 flex items-center justify-between px-4 lg:px-8 flex-shrink-0 z-10">
          <div className="flex items-center gap-3 lg:gap-4 flex-1">
            <button 
              className="p-2 -ml-2 text-zinc-400 hover:text-white hover:bg-zinc-900 rounded-lg transition-colors select-none"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              title={isSidebarOpen ? "Amaga el menú" : "Mostra el menú"}
            >
              <Menu size={22} />
            </button>
            <h2 className="text-md lg:text-xl font-bold text-white flex items-center gap-3">
               <div className="hidden lg:flex p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-lime-400 shadow-inner">
                 <activeLesson.icon size={22} strokeWidth={2.5} />
               </div>
               <span className="truncate tracking-wide">{activeLesson.title}</span>
            </h2>
          </div>

          <div className="flex items-center gap-4">
            {/* LED Spectrogram Indicator */}
            <div className="hidden md:flex items-end gap-1 h-6 px-3 py-1.5 bg-zinc-900/80 border border-zinc-800 rounded-lg shadow-inner" title="Equalitzador Estudi">
              <div className="w-0.5 bg-lime-500 led-bar" style={{ height: '35%' }}></div>
              <div className="w-0.5 bg-lime-500 led-bar" style={{ height: '70%' }}></div>
              <div className="w-0.5 bg-lime-500 led-bar" style={{ height: '90%' }}></div>
              <div className="w-0.5 bg-emerald-500 led-bar" style={{ height: '55%' }}></div>
              <div className="w-0.5 bg-emerald-500 led-bar" style={{ height: '80%' }}></div>
              <div className="w-0.5 bg-yellow-500 led-bar" style={{ height: '40%' }}></div>
              <div className="w-0.5 bg-yellow-500 led-bar" style={{ height: '75%' }}></div>
              <div className="w-0.5 bg-rose-500 led-bar" style={{ height: '20%' }}></div>
            </div>

            <button
              onClick={() => setIsDocsOpen(true)}
              className="flex items-center gap-2 px-3.5 py-2.5 bg-zinc-900 hover:bg-zinc-800 text-lime-400 hover:text-lime-300 rounded-xl border border-zinc-850 hover:border-lime-500/20 transition-all text-xs font-bold shadow-md active:scale-95 whitespace-nowrap"
            >
              <Disc size={15} className="text-lime-400 animate-spin-slow" />
              <span>Sampler Banks</span>
            </button>
          </div>
        </header>

        {/* Content & Sandbox Layout */}
        <div className="flex-1 flex flex-col lg:flex-row h-[calc(100vh-5rem)] overflow-hidden">
          
          {/* Lesson Content - Dark textured */}
          <div className="w-full lg:w-[45%] bg-zinc-950/20 p-4 lg:p-8 overflow-y-auto border-b lg:border-b-0 lg:border-r border-zinc-900 lg:pb-32 flex-1 lg:flex-none lesson-content">
            <div className="text-zinc-300 leading-relaxed text-[14px] lg:text-[15px] max-w-2xl mx-auto lg:mx-0">
              <activeLesson.content setCode={handleSetCode} />
            </div>
            
            {/* Visual Guide helper - only in first lesson */}
            {activeLesson.id === '0-intro' && (
              <div className="mt-10 p-6 rounded-2xl bg-zinc-900/30 border border-zinc-850 shadow-inner relative overflow-hidden">
                <h4 className="flex items-center gap-2 text-xs font-black text-lime-400 uppercase mb-3 tracking-widest">
                  <PlaySquare size={16} />
                  Guia de l'Estudi de Rap
                </h4>
                <ul className="text-sm text-zinc-400 space-y-3 font-medium relative z-10">
                  <li className="flex gap-2 items-start"><span className="text-lime-400">•</span><span className="flex-1">Clica al botó <strong className="text-white">Play (Reprodueix)</strong> dins de l'editor de la dreta per començar a escoltar el ritme de mostra.</span></li>
                  <li className="flex gap-2 items-start"><span className="text-lime-400">•</span><span className="flex-1">Fes clic a qualsevol botó <strong className="text-white">Carrega Codi</strong> de les lliçons per carregar les bases a l'estudi.</span></li>
                  <li className="flex gap-2 items-start"><span className="text-lime-400">•</span><span className="flex-1">Pots editar el codi lliurement i prémer <strong className="text-white">Shift+Enter</strong> per avaluar els canvis a l'instant.</span></li>
                </ul>
              </div>
            )}
          </div>

          {/* Sandbox Area (LOOP Repl / MPC beats board) */}
          <div className="w-full lg:w-[55%] h-[50vh] lg:h-full bg-zinc-950/50 relative flex flex-col p-2 lg:p-6 gap-3 flex-shrink-0 lg:flex-shrink">
            <div className="flex-1 w-full relative overflow-hidden rounded-xl lg:rounded-2xl shadow-2xl bg-zinc-900 border border-zinc-800 min-h-0">
               <LoopEditor key={activeLesson.id} code={editorCode} loadTrigger={loadTrigger} readOnly={activeLesson.isReadOnly} exercise={activeLesson.exercise} />
            </div>
          </div>
          
        </div>
      </main>

      <DocsModal isOpen={isDocsOpen} onClose={() => setIsDocsOpen(false)} setCode={handleSetCode} />
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { lessons } from './data/lessons';
import { AonEditor } from './components/AonEditor';
import { Sparkles, Code2, PlaySquare, BookOpen, Menu, X, Orbit } from 'lucide-react';
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
    <div className="flex h-screen bg-slate-50 text-slate-900 overflow-hidden font-sans selection:bg-violet-200 selection:text-violet-900">
      
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/40 z-40 lg:hidden backdrop-blur-sm"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}

      {/* Sidebar / Navigation */}
      <nav className={`fixed lg:relative bg-white border-r border-slate-200 flex flex-col h-full flex-shrink-0 z-40 transition-all duration-300 ${isSidebarOpen ? 'w-80 translate-x-0' : 'w-0 -translate-x-full overflow-hidden border-r-0'}`}>
        <div className="h-20 p-6 border-b border-slate-200 bg-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-violet-600 rounded-xl flex items-center justify-center font-bold text-white shadow-sm shadow-violet-500/20">
              <Orbit size={18} />
            </div>
            <h1 className="text-2xl font-bold tracking-widest text-slate-800 font-display uppercase font-serif">Aon</h1>
          </div>
          <button className="lg:hidden p-2 text-slate-550 hover:text-slate-800" onClick={() => setIsSidebarOpen(false)}>
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-2 bg-[#FAFAFA]/65">
          <h2 className="text-[11px] uppercase tracking-wider text-slate-500 font-bold mb-4 px-3 mt-2">Cicles d'Aprenentatge</h2>
          {lessons.map((lesson) => {
            const Icon = lesson.icon;
            const isActive = lesson.id === activeLessonId;
            const isExercise = lesson.id.includes('-exercici');

            return (
              <button
                key={lesson.id}
                onClick={() => handleSelectLesson(lesson.id)}
                className={`w-full flex items-center gap-3 py-2.5 rounded-xl transition-all duration-300 text-left cursor-pointer border
                  ${isExercise ? 'px-3 pl-8' : 'px-3'}
                  ${isActive 
                    ? 'bg-slate-100 text-slate-900 border-slate-200 font-bold shadow-sm' 
                    : 'text-slate-600 border-transparent hover:bg-slate-50 hover:text-slate-900'}
                `}
              >
                {!isExercise && (
                  <div className={`w-2 h-2 rounded-full transition-colors ${isActive ? 'bg-violet-600 shadow-[0_0_6px_rgba(124,58,237,0.4)]' : 'bg-slate-300 group-hover:bg-slate-500'}`}></div>
                )}
                {isExercise && (
                  <div className="text-violet-500/60 opacity-60">↳</div>
                )}
                <span className={`text-[15px] ${isActive ? 'font-semibold' : 'font-medium'} outline-none ${isExercise ? 'text-sm opacity-90' : ''}`}>{lesson.title}</span>
              </button>
            );
          })}
        </div>

        <div className="p-6 bg-white border-t border-slate-150">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 shadow-inner">
            <h4 className="text-[11px] font-bold text-slate-700 uppercase mb-2 tracking-widest">Aon Motor</h4>
            <p className="text-xs text-slate-500 leading-relaxed font-semibold">La llibreria en català per a la generació de música algorísmica en temps real. El motor del temps cíclic sobre Aon.</p>
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-full relative overflow-hidden bg-slate-50 w-full lg:w-auto">
        
        {/* Top bar */}
        <header className="h-auto min-h-[4rem] lg:min-h-[5rem] border-b border-slate-200 bg-white flex items-center justify-between px-4 lg:px-8 flex-shrink-0 z-10 transition-shadow">
          <div className="flex items-center gap-2 lg:gap-4 flex-1">
            <button 
              className="p-2 -ml-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors select-none"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              title={isSidebarOpen ? "Amaga el menú" : "Mostra el menú"}
            >
              <Menu size={22} />
            </button>
            <h2 className="text-lg lg:text-2xl font-bold text-slate-800 flex items-center gap-3">
               <div className="hidden lg:flex p-2.5 rounded-xl bg-violet-50 text-violet-600 border border-violet-100 shadow-sm">
                 <activeLesson.icon size={24} strokeWidth={2.5} />
               </div>
               <span className="truncate">{activeLesson.title}</span>
            </h2>
          </div>
          <button
            onClick={() => setIsDocsOpen(true)}
            className="flex items-center gap-2 px-3 lg:px-4 py-2 bg-slate-100 hover:bg-violet-50 text-violet-700 hover:text-violet-800 rounded-xl border border-violet-200 transition-all text-xs lg:text-sm font-bold shadow-sm active:scale-95 whitespace-nowrap ml-2"
          >
            <BookOpen size={16} className="text-violet-500" />
            <span className="hidden sm:inline">Llista d'Instruments</span>
            <span className="sm:hidden">Docs</span>
          </button>
        </header>

        {/* Content & Sandbox Layout */}
        <div className="flex-1 flex flex-col lg:flex-row h-[calc(100vh-4rem)] lg:h-[calc(100vh-5rem)] overflow-hidden">
          
          {/* Lesson Content - Mobile stacking optimization */}
          <div className="w-full lg:w-[45%] bg-white p-4 lg:p-8 overflow-y-auto border-b lg:border-b-0 lg:border-r border-slate-200 lg:pb-32 flex-1 lg:flex-none">
            <div className="text-slate-700 leading-relaxed text-[14px] lg:text-[15px] max-w-2xl mx-auto lg:mx-0">
              <activeLesson.content setCode={handleSetCode} />
            </div>
            
            {/* Visual Guide helper - only in first lesson */}
            {activeLesson.id === '0-intro' && (
              <div className="mt-12 p-6 rounded-2xl bg-slate-50 border border-slate-200 shadow-sm relative overflow-hidden">
                <h4 className="flex items-center gap-2 text-sm font-bold text-slate-800 uppercase mb-3 tracking-widest">
                  <PlaySquare size={18} className="text-violet-600" />
                  Guia d'Aon
                </h4>
                <ul className="text-sm text-slate-600 space-y-3 font-medium relative z-10">
                  <li className="flex gap-2 items-start"><span className="text-violet-650">•</span><span className="flex-1 font-semibold">Clica al botó <span className="text-slate-800 font-bold">Play</span> dins l'editor per escoltar el ritme de la dreta.</span></li>
                  <li className="flex gap-2 items-start"><span className="text-violet-650">•</span><span className="flex-1 font-semibold">Fes clic a qualsevol botó <span className="text-slate-800 font-bold">Obrir a l'Editor</span> dels exemples d'aquí dalt per carregar codi nou automàticament a la dreta.</span></li>
                  <li className="flex gap-2 items-start"><span className="text-violet-650">•</span><span className="flex-1 font-semibold">Experimenta! Si canvies el codi i dónes al Shift+Enter, avaluarà el teu codi nou cap a l'instrument.</span></li>
                </ul>
              </div>
            )}
          </div>

          {/* Sandbox Area (Aon Repl) */}
          <div className="w-full lg:w-[55%] h-[50vh] lg:h-full bg-slate-50 relative flex flex-col p-2 lg:p-4 sm:p-6 gap-3 flex-shrink-0 lg:flex-shrink border-l border-slate-150">
            <div className="flex-1 w-full relative overflow-hidden rounded-xl lg:rounded-2xl shadow-sm bg-white border border-slate-200 min-h-0">
               <AonEditor key={activeLesson.id} code={editorCode} loadTrigger={loadTrigger} readOnly={activeLesson.isReadOnly} exercise={activeLesson.exercise} />
            </div>
          </div>
          
        </div>
      </main>

      <DocsModal isOpen={isDocsOpen} onClose={() => setIsDocsOpen(false)} setCode={handleSetCode} />
    </div>
  );
}

import React, { useRef, useState, useEffect } from 'react';
import '@strudel/repl';
import { Play, Square, CheckCircle2, XCircle, Check, AlertCircle, RotateCcw, Download } from 'lucide-react';
import { initAudio, getAudioContext, renderPatternAudio } from '@strudel/webaudio';
import { Pattern } from '@strudel/core';

function replaceMapped(
  mappedChars: { char: string; originalIndex: number }[],
  regex: RegExp,
  replacement: string | ((m: string, p1?: string) => string)
) {
  const r = new RegExp(regex.source, regex.flags.includes('g') ? regex.flags : regex.flags + 'g');
  const currentText = mappedChars.map(mc => mc.char).join('');
  let match;
  
  const matches: { start: number; end: number; matchStr: string; p1?: string }[] = [];
  r.lastIndex = 0;
  while ((match = r.exec(currentText)) !== null) {
    matches.push({
      start: match.index,
      end: r.lastIndex,
      matchStr: match[0],
      p1: match[1]
    });
    if (match[0].length === 0) {
      r.lastIndex++;
    }
  }
  
  for (let i = matches.length - 1; i >= 0; i--) {
    const { start, end, matchStr, p1 } = matches[i];
    const repVal = typeof replacement === 'function' ? replacement(matchStr, p1) : replacement;
    
    const origStart = mappedChars[start]?.originalIndex ?? 0;
    const origEnd = mappedChars[end - 1]?.originalIndex ?? origStart;
    
    const newSlice = Array.from(repVal).map((c, idx) => {
      const t = repVal.length > 1 ? idx / (repVal.length - 1) : 0;
      const originalIndex = Math.round(origStart + t * (origEnd - origStart));
      return { char: c, originalIndex };
    });
    
    mappedChars.splice(start, end - start, ...newSlice);
  }
}

function translateCodeAndGetMap(code: string) {
  const mappedChars = Array.from(code).map((char, index) => ({ char, originalIndex: index }));

  const catalaDictionary = [
    { cat: /\bso\b/g, eng: 's' },
    { cat: /\bllibreria\b/g, eng: 'await samples' },
    { cat: /\bsoundfonts\b/g, eng: 'await soundfonts' },
    { cat: /\bantics\b/g, eng: "'github:tidalcycles/Dirt-Samples'" },
    { cat: /\bgm_synth\b/g, eng: "'github:joelmatthys/GM-synth'" },
    { cat: /\binstrument\b/g, eng: 's' },
    { cat: /\bnota\b/g, eng: 'note' },
    { cat: /\bnotes\b/g, eng: 'note' },
    { cat: /\btria\b/g, eng: 'choose' },
    { cat: /\bcapes\b/g, eng: 'stack' },
    { cat: /\.ràpid\b/g, eng: '.fast' },
    { cat: /\.lent\b/g, eng: '.slow' },
    { cat: /\.escala\b/g, eng: '.scale' },
    { cat: /\.ress(?:ò|o)(?!\w)/g, eng: '.room' },
    { cat: /\.reverb\b/g, eng: '.room' },
    { cat: /\.barreja\b/g, eng: '.shuffle' },
    { cat: /\.inversa\b/g, eng: '.rev' },
    { cat: /\.rev(?:é|e)s\b/g, eng: '.rev' },
    { cat: /\.panorama\b/g, eng: '.pan' },
    { cat: /\.banc\b/g, eng: '.bank' },
    { cat: /\.filtreGreus\b/g, eng: '.lpf' },
    { cat: /\.filtreAguts\b/g, eng: '.hpf' },
    { cat: /\.eco\b/g, eng: '.delay' },
    { cat: /\.8bit\b/g, eng: '.crush' },
    { cat: /\.distorsi[oó](?!\w)/g, eng: '.distort' },
    { cat: /\.volum\b/g, eng: '.gain' },
    { cat: /\.cada\b/g, eng: '.every' },
    { cat: /\.sovint\b/g, eng: '.sometimes' },
    { cat: /\.deVegades\b/g, eng: '.sometimes' },
    { cat: /\.moltSovint\b/g, eng: '.often' },
    { cat: /\.rarament\b/g, eng: '.rarely' },
    { cat: /\bbombo\b/g, eng: 'bd' },
    { cat: /\bcaixa\b/g, eng: 'sd' },
    { cat: /\bxarles\b/g, eng: 'hh' },
    { cat: /\bobert\b/g, eng: 'ho' },
    { cat: /\bpalmes\b/g, eng: 'cp' },
    { cat: /\bplateret\b/g, eng: 'cr' },
    { cat: /\btomagut\b/g, eng: 'ht' },
    { cat: /\btommig\b/g, eng: 'mt' },
    { cat: /\btomgreu\b/g, eng: 'lt' },
    { cat: /\bserra\b/g, eng: 'sawtooth' },
    { cat: /\bsinusoide\b/g, eng: 'sine' },
    { cat: /\bquadrat\b/g, eng: 'square' },
    { cat: /\btriangle\b/g, eng: 'triangle' },
    { cat: /\bbaix\b/g, eng: 'bass' },
    { cat: /(?<![a-zA-Z])dosostingut(?![a-zA-Z])/gi, eng: 'cs' },
    { cat: /(?<![a-zA-Z])dodiesi(?![a-zA-Z])/gi, eng: 'cs' },
    { cat: /(?<![a-zA-Z])dobemoll(?![a-zA-Z])/gi, eng: 'cb' },
    { cat: /(?<![a-zA-Z])resostingut(?![a-zA-Z])/gi, eng: 'ds' },
    { cat: /(?<![a-zA-Z])rediesi(?![a-zA-Z])/gi, eng: 'ds' },
    { cat: /(?<![a-zA-Z])rebemoll(?![a-zA-Z])/gi, eng: 'db' },
    { cat: /(?<![a-zA-Z])misostingut(?![a-zA-Z])/gi, eng: 'es' },
    { cat: /(?<![a-zA-Z])midiesi(?![a-zA-Z])/gi, eng: 'es' },
    { cat: /(?<![a-zA-Z])mibemoll(?![a-zA-Z])/gi, eng: 'eb' },
    { cat: /(?<![a-zA-Z])fasostingut(?![a-zA-Z])/gi, eng: 'fs' },
    { cat: /(?<![a-zA-Z])fadiesi(?![a-zA-Z])/gi, eng: 'fs' },
    { cat: /(?<![a-zA-Z])fabemoll(?![a-zA-Z])/gi, eng: 'fb' },
    { cat: /(?<![a-zA-Z])solsostingut(?![a-zA-Z])/gi, eng: 'gs' },
    { cat: /(?<![a-zA-Z])soldiesi(?![a-zA-Z])/gi, eng: 'gs' },
    { cat: /(?<![a-zA-Z])solbemoll(?![a-zA-Z])/gi, eng: 'gb' },
    { cat: /(?<![a-zA-Z])lasostingut(?![a-zA-Z])/gi, eng: 'as' },
    { cat: /(?<![a-zA-Z])ladiesi(?![a-zA-Z])/gi, eng: 'as' },
    { cat: /(?<![a-zA-Z])labemoll(?![a-zA-Z])/gi, eng: 'ab' },
    { cat: /(?<![a-zA-Z])sisostingut(?![a-zA-Z])/gi, eng: 'bs' },
    { cat: /(?<![a-zA-Z])sidiesi(?![a-zA-Z])/gi, eng: 'bs' },
    { cat: /(?<![a-zA-Z])sibemoll(?![a-zA-Z])/gi, eng: 'bb' },
    { cat: /(?<![a-zA-Z])do(?![a-zA-Z])/g, eng: 'c' },
    { cat: /(?<![a-zA-Z])re(?![a-zA-Z])/g, eng: 'd' },
    { cat: /(?<![a-zA-Z])mi(?![a-zA-Z])/g, eng: 'e' },
    { cat: /(?<![a-zA-Z])fa(?![a-zA-Z])/g, eng: 'f' },
    { cat: /(?<![a-zA-Z])sol(?![a-zA-Z])/g, eng: 'g' },
    { cat: /(?<![a-zA-Z])la(?![a-zA-Z])/g, eng: 'a' },
    { cat: /(?<![a-zA-Z])si(?![a-zA-Z])/g, eng: 'b' },
    { cat: /(?<![a-zA-Z])menor(?![a-zA-Z])/g, eng: 'minor' },
    { cat: /(?<![a-zA-Z])major(?![a-zA-Z])/g, eng: 'major' },
    { cat: /\bbpm\b/g, eng: '((c)=>setcpm(c/4))' },
  ];

  catalaDictionary.forEach((pair) => {
    replaceMapped(mappedChars, pair.cat, pair.eng);
  });

  const translatedText = mappedChars.map((mc) => mc.char).join('');
  return { translatedText, mappedChars };
}

export const LoopEditor: React.FC<{ 
  code: string; 
  loadTrigger?: number;
  key?: string; 
  readOnly?: boolean;
  exercise?: {
    successMessage?: string;
    onCheck: (code: string) => { success: boolean; message: string };
  }
}> = ({ code, loadTrigger, readOnly, exercise }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const editorNode = useRef<any>(null);
  const [checkResult, setCheckResult] = useState<{success: boolean; message: string} | null>(null);
  const [isPatched, setIsPatched] = useState(false);
  const [consoleErrors, setConsoleErrors] = useState<string[]>([]);
  const [showErrorOverlay, setShowErrorOverlay] = useState(false);

  useEffect(() => {
    const originalConsoleError = console.error;
    const handleError = (event: ErrorEvent) => {
      setConsoleErrors(prev => [...prev.slice(-9), `Error: ${event.message}`]);
    };
    const handleRejection = (event: PromiseRejectionEvent) => {
      setConsoleErrors(prev => [...prev.slice(-9), `Rejection: ${event.reason?.message || event.reason}`]);
    };
    console.error = (...args: any[]) => {
      const msg = args.map(arg => typeof arg === 'object' ? JSON.stringify(arg) : String(arg)).join(' ');
      setConsoleErrors(prev => [...prev.slice(-9), msg]);
      originalConsoleError.apply(console, args);
    };
    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleRejection);
    return () => {
      console.error = originalConsoleError;
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleRejection);
    };
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      const editorEl = containerRef.current?.querySelector('strudel-editor') as any;
      if (editorEl && editorEl.editor && editorEl.editor.editor) {
        editorNode.current = editorEl;
        
        const strudelMirror = editorEl.editor;
        if (strudelMirror.repl) {
          if (!strudelMirror._patchedForCatalan) {
            // 1. Inject Catalan prototype method aliases for Patterns as a fallback safety net
            if (Pattern && Pattern.prototype) {
              const p = Pattern.prototype as any;
              if (p.fast && !p.ràpid) p.ràpid = p.fast;
              if (p.slow && !p.lent) p.lent = p.slow;
              if (p.scale && !p.escala) p.escala = p.scale;
              if (p.room && !p.ressò) p.ressò = p.room;
              if (p.room && !p.reverb) p.reverb = p.room;
              if (p.shuffle && !p.barreja) p.barreja = p.shuffle;
              if (p.rev && !p.inversa) p.inversa = p.rev;
              if (p.rev && !p.revés) p.revés = p.rev;
              if (p.pan && !p.panorama) p.panorama = p.pan;
              if (p.bank && !p.banc) p.banc = p.bank;
              if (p.lpf && !p.filtreGreus) p.filtreGreus = p.lpf;
              if (p.hpf && !p.filtreAguts) p.filtreAguts = p.hpf;
              if (p.delay && !p.eco) p.eco = p.delay;
              if (p.distort && !p.distorsió) p.distorsió = p.distort;
              if (p.distort && !p.distorsio) p.distorsio = p.distort;
              if (p.gain && !p.volum) p.volum = p.gain;
              if (p.every && !p.cada) p.cada = p.every;
              if (p.sometimes && !p.sovint) p.sovint = p.sometimes;
              if (p.sometimes && !p.deVegades) p.deVegades = p.sometimes;
              if (p.often && !p.moltSovint) p.moltSovint = p.often;
              if (p.rarely && !p.rarament) p.rarament = p.rarely;
            }

            const originalReplEvaluate = strudelMirror.repl.evaluate.bind(strudelMirror.repl);
            strudelMirror.repl.evaluate = async function(codeToEvaluate: string, autostart = true) {
              try {
                await initAudio();
                const ctx = getAudioContext();
                if (ctx && ctx.state === 'suspended') {
                  await ctx.resume();
                }
              } catch (e) {
                console.warn('Failed to initialize audio:', e);
              }

              // 2. Inject Catalan global function aliases to window using getters (resolves dynamically)
              if (typeof window !== 'undefined') {
                const w = window as any;
                const defineGlobalGetter = (name: string, targetName: string) => {
                  if (!(name in w)) {
                    Object.defineProperty(w, name, {
                      get() { return w[targetName]; },
                      configurable: true
                    });
                  }
                };
                defineGlobalGetter('so', 's');
                defineGlobalGetter('instrument', 's');
                defineGlobalGetter('llibreria', 'samples');
                defineGlobalGetter('soundfonts', 'soundfonts');
                defineGlobalGetter('nota', 'note');
                defineGlobalGetter('notes', 'note');
                defineGlobalGetter('tria', 'choose');
                defineGlobalGetter('capes', 'stack');
                if (!('bpm' in w)) {
                  Object.defineProperty(w, 'bpm', {
                    get() { return (c: number) => w.setcpm ? w.setcpm(c / 4) : undefined; },
                    configurable: true
                  });
                }
                w.antics = 'github:tidalcycles/Dirt-Samples';
                w.gm_synth = 'github:joelmatthys/GM-synth';
                w.serra = 'sawtooth';
                w.sinusoide = 'sine';
                w.quadrat = 'square';
                w.triangle = 'triangle';
                w.baix = 'bass';
              }

              console.log('--- LOOP EVALUATE START ---');
              console.log('Original code to evaluate:', codeToEvaluate);
              const { translatedText, mappedChars } = translateCodeAndGetMap(codeToEvaluate);
              console.log('Translated code to evaluate:', translatedText);
              strudelMirror._lastMapping = { mappedChars, originalLen: codeToEvaluate.length };
              try {
                const res = await originalReplEvaluate(translatedText, autostart);
                console.log('--- LOOP EVALUATE SUCCESS ---');
                return res;
              } catch (err: any) {
                console.error('--- LOOP EVALUATE ERROR ---', err);
                throw err;
              }
            };

            const originalEvaluate = strudelMirror.evaluate.bind(strudelMirror);
            strudelMirror.evaluate = async function(autostart = true) {
              if (this.flash) {
                try { this.flash(); } catch (e) {}
              }
              return await this.repl.evaluate(this.code, autostart);
            };

            // Patch the CodeMirror view dispatch function to reverse-map index positions
            if (strudelMirror.editor && !strudelMirror.editor._dispatchPatched) {
              const originalDispatch = strudelMirror.editor.dispatch;
              strudelMirror.editor.dispatch = function(...args: any[]) {
                const mapping = strudelMirror._lastMapping;
                if (mapping) {
                  for (const arg of args) {
                    if (arg && arg.effects) {
                      const effects = Array.isArray(arg.effects) ? arg.effects : [arg.effects];
                      for (const effect of effects) {
                        if (effect && effect.value) {
                          try {
                            // 1. setMiniLocations: array of [start, end]
                            if (
                              Array.isArray(effect.value) &&
                              effect.value.length > 0 &&
                              Array.isArray(effect.value[0]) &&
                              effect.value[0].length === 2
                            ) {
                              effect.value = effect.value.map(([start, end]: [number, number]) => {
                                const mappedStart = mapping.mappedChars[start]?.originalIndex ?? mapping.originalLen;
                                const mappedEnd = end > 0 ? (mapping.mappedChars[end - 1]?.originalIndex ?? mapping.originalLen) + 1 : mapping.originalLen;
                                return [mappedStart, mappedEnd];
                              });
                            }
                            // 2. showMiniLocations: object with haps containing whole.context.locations
                            else if (effect.value.haps) {
                              for (const hap of effect.value.haps) {
                                if (hap && hap.context && hap.context.locations) {
                                  hap.context.locations = hap.context.locations.map(({ start, end }: { start: number; end: number }) => {
                                    const mappedStart = mapping.mappedChars[start]?.originalIndex ?? mapping.originalLen;
                                    const mappedEnd = end > 0 ? (mapping.mappedChars[end - 1]?.originalIndex ?? mapping.originalLen) + 1 : mapping.originalLen;
                                    return { start: mappedStart, end: mappedEnd };
                                  });
                                }
                              }
                            }
                          } catch (e) {
                            console.warn('Error patching miniLocation effect', e);
                          }
                        }
                      }
                    }
                  }
                }
                return originalDispatch.apply(this, args);
              };
              strudelMirror.editor._dispatchPatched = true;
            }

            strudelMirror._patchedForCatalan = true;
          }
          clearInterval(timer);
          setIsPatched(true);
        }
      }
    }, 100);

    return () => {
      clearInterval(timer);
      const editorEl = editorNode.current || containerRef.current?.querySelector('strudel-editor') as any;
      if (editorEl && editorEl.editor) {
        try {
          editorEl.editor.stop();
        } catch (e) {
          console.warn('Error stopping on unmount', e);
        }
      }
    };
  }, []);

  useEffect(() => {
    if (isPatched && containerRef.current) {
      const editorEl = containerRef.current.querySelector('strudel-editor') as any;
      if (editorEl) {
        editorEl.setAttribute('code', code);
        if (editorEl.editor && typeof editorEl.editor.setCode === 'function') {
          editorEl.editor.setCode(code);
        }
        
        if (editorEl.getAttribute('data-prebake-handled') !== 'true') {
          editorEl.setAttribute('data-prebake-handled', 'true');
          if (code && code.trim()) {
            if (editorEl.editor && typeof editorEl.editor.evaluate === 'function') {
              editorEl.editor.evaluate(false).catch((e: any) => console.log('initial eval err:', e));
            }
          }
        }
      }
    }
  }, [code, loadTrigger, isPatched]);

  const getEditorEl = () => {
    if (editorNode.current) return editorNode.current;
    if (containerRef.current) {
      const editorEl = containerRef.current.querySelector('strudel-editor') as any;
      if (editorEl && editorEl.editor) {
        editorNode.current = editorEl;
        return editorEl;
      }
    }
    return null;
  };

  const handlePlay = async () => {
    const editorEl = getEditorEl();
    if (editorEl && editorEl.editor) {
      const currentCode = editorEl.editor.code || editorEl.code || "";
      if (!currentCode.trim()) {
        try {
          editorEl.editor.stop();
        } catch (e) {
          console.error(e);
        }
        setIsPlaying(false);
        return;
      }
      try {
        await initAudio();
        const ctx = getAudioContext();
        if (ctx && ctx.state === 'suspended') {
          await ctx.resume();
        }
        await editorEl.editor.evaluate();
        setIsPlaying(true);
      } catch (e) {
        console.error(e);
        setIsPlaying(false);
      }
    }
  };

  const handleStop = () => {
    const editorEl = getEditorEl();
    if (editorEl && editorEl.editor) {
      try {
        editorEl.editor.stop();
      } catch (e) {
        console.error(e);
      }
      setIsPlaying(false);
    }
  };

  const handleCheck = () => {
    const editorEl = getEditorEl();
    if (editorEl && exercise) {
      const currentCode = editorEl.editor.code || editorEl.code || "";
      const result = exercise.onCheck(currentCode);
      if (result.success && exercise.successMessage) {
        setCheckResult({ success: true, message: exercise.successMessage });
      } else {
        setCheckResult(result);
      }
    }
  };

  const handleExport = async () => {
    const editorEl = getEditorEl();
    if (editorEl && editorEl.editor && editorEl.editor.repl) {
      setIsExporting(true);
      try {
        await editorEl.editor.evaluate(false);
        const state = editorEl.editor.repl.state;
        const pattern = state.pattern;
        if (!pattern) {
          alert("No s'ha pogut compilar cap patró de música per exportar. Comprova que el teu codi no tingui errors.");
          setIsExporting(false);
          return;
        }
        const cps = editorEl.editor.repl.scheduler.cps || 1;
        // Render 8 cycles (bars) of the pattern.
        await renderPatternAudio(pattern, cps, 0, 8, 44100, 32, true, 'base_de_rap');
      } catch (e: any) {
        console.error("Error durant l'exportació:", e);
        alert("Error en exportar: " + (e?.message || e));
      } finally {
        setIsExporting(false);
      }
    }
  };

  const handleReset = () => {
    const editorEl = getEditorEl();
    if (editorEl) {
      editorEl.setAttribute('code', code);
      if (editorEl.editor && typeof editorEl.editor.setCode === 'function') {
        editorEl.editor.setCode(code);
      }
      setCheckResult(null); // Clear check results on reset
    }
  };

  return (
    <div className="w-full h-full overflow-hidden rounded-2xl border border-zinc-850 bg-zinc-950 shadow-2xl flex flex-col relative" style={{ minHeight: '600px' }} ref={containerRef}>
      
      {/* Tools Bar (MPC Control Board Style) */}
      <div className="h-14 border-b border-zinc-900 bg-zinc-950 flex items-center px-4 gap-2.5 relative z-20 flex-shrink-0">
        <button 
          onClick={handlePlay}
          disabled={!isPatched}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-black font-bold tracking-wide transition-all shadow-md active:scale-95 cursor-pointer border border-lime-500/10 ${
            !isPatched 
              ? 'bg-zinc-800 border-zinc-750 text-zinc-550 cursor-not-allowed opacity-50' 
              : isPlaying 
                ? 'bg-lime-400 shadow-[0_0_15px_rgba(163,230,53,0.6)] animate-pulse' 
                : 'bg-lime-500 hover:bg-lime-400'
          }`}
        >
          <Play size={15} fill="currentColor" />
          {!isPatched ? 'Carregant...' : isPlaying ? 'En línia' : 'Play'}
        </button>

        <button 
          onClick={handleStop}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-white font-bold tracking-wide transition-all border shadow-md active:scale-95 cursor-pointer ${
            isPlaying 
              ? 'bg-rose-500 border-rose-400 hover:bg-rose-600 shadow-[0_0_12px_rgba(244,63,94,0.4)]' 
              : 'bg-zinc-800 border-zinc-750 hover:bg-zinc-700 text-zinc-300'
          }`}
        >
          <Square size={15} fill="currentColor" />Atura</button>

        <button 
          onClick={handleReset}
          className="flex items-center gap-2 px-4 py-2 rounded-xl border border-zinc-800 bg-zinc-900 hover:bg-zinc-850 text-zinc-300 hover:text-white font-bold tracking-wide transition-all shadow-md active:scale-95 cursor-pointer"
          title="Restableix el codi de la lliçó"
        >
          <RotateCcw size={15} />
          Reset
        </button>

        <button 
          onClick={handleExport}
          disabled={!isPatched || isExporting}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-zinc-950 font-bold tracking-wide transition-all shadow-md active:scale-95 cursor-pointer border ${
            !isPatched || isExporting
              ? 'bg-zinc-800 border-zinc-750 text-zinc-550 cursor-not-allowed opacity-50' 
              : 'bg-cyan-400 border-cyan-300 hover:bg-cyan-300 shadow-[0_0_12px_rgba(34,211,238,0.2)]'
          }`}
          title="Exporta la base de rap a un fitxer WAV de 8 compassos"
        >
          <Download size={15} />
          {isExporting ? 'Exportant...' : 'Exporta WAV'}
        </button>

        {exercise && (
          <button 
            onClick={handleCheck}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-pink-500 hover:bg-pink-400 text-white font-bold tracking-wide transition-all border border-pink-400 shadow-[0_0_12px_rgba(236,72,153,0.3)] active:scale-95 cursor-pointer"
          >
            <Check size={15} fill="currentColor" />
            Valida Beat
          </button>
        )}
        
        <div className="text-[10px] font-bold text-zinc-500 ml-auto hidden lg:flex items-center gap-3 bg-zinc-900/40 border border-zinc-850 px-3 py-1.5 rounded-xl">
          <span className="flex items-center gap-1">
            <span className="text-zinc-500">Executa:</span>
            <kbd className="bg-zinc-950 border border-zinc-800 text-zinc-350 px-1.5 py-0.5 rounded font-mono shadow-sm">Shift+Enter</kbd>
          </span>
          <span className="w-px h-3 bg-zinc-850"></span>
          <span className="flex items-center gap-1">
            <span className="text-zinc-500">Atura:</span>
            <kbd className="bg-zinc-950 border border-zinc-800 text-zinc-350 px-1.5 py-0.5 rounded font-mono shadow-sm">Ctrl+.</kbd>
          </span>
        </div>
      </div>


      {/* Editor Content */}
      <div 
        className={`flex-1 relative overflow-hidden flex flex-col min-h-[400px] ${readOnly ? 'opacity-90' : 'bg-zinc-950'}`}
        onKeyDownCapture={(e) => {
          if (readOnly) {
            const isCmdOrCtrl = e.metaKey || e.ctrlKey;
            if (isCmdOrCtrl && (e.key === 'c' || e.key === 'a')) {
              return; // Allow copy and select all
            }
            if (e.key.startsWith('Arrow') || ['Home', 'End', 'PageUp', 'PageDown', 'Tab'].includes(e.key)) {
              return; // Allow navigation
            }
            e.preventDefault();
            e.stopPropagation();
          }
        }}
        onPasteCapture={(e) => { if (readOnly) { e.preventDefault(); e.stopPropagation(); } }}
        onCutCapture={(e) => { if (readOnly) { e.preventDefault(); e.stopPropagation(); } }}
        onDropCapture={(e) => { if (readOnly) { e.preventDefault(); e.stopPropagation(); } }}
        onBeforeInputCapture={(e) => { if (readOnly) { e.preventDefault(); e.stopPropagation(); } }}
      >
        {/* @ts-ignore */}
        <strudel-editor></strudel-editor>

        {consoleErrors.length > 0 && (
          <div className="absolute top-4 right-4 z-40 max-w-sm">
            <button 
              onClick={() => setShowErrorOverlay(!showErrorOverlay)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-zinc-900 border border-rose-500/30 text-rose-450 text-xs font-bold shadow-md hover:bg-zinc-850 transition-all cursor-pointer"
            >
              <AlertCircle size={14} />
              {consoleErrors.length} alerta{consoleErrors.length > 1 ? 's' : ''} de consola
            </button>
            {showErrorOverlay && (
              <div className="mt-2 p-4 rounded-xl bg-zinc-950 text-zinc-200 text-xs font-mono max-h-40 overflow-y-auto shadow-2xl border border-rose-550/30">
                <div className="flex justify-between items-center border-b border-zinc-850 pb-1.5 mb-2 font-sans font-black text-zinc-450 uppercase text-[9px] tracking-widest">
                  <span>REGISTRE DE CONSOLA</span>
                  <button onClick={() => setConsoleErrors([])} className="hover:text-white underline">Neteja</button>
                </div>
                <ul className="space-y-1">
                  {consoleErrors.map((err, idx) => (
                    <li key={idx} className="break-all border-b border-zinc-900/50 pb-1 last:border-0">{err}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {checkResult && (
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-50 w-11/12 max-w-lg">
             <div className={`p-5 rounded-2xl flex items-start gap-3 shadow-2xl border backdrop-blur-md ${
               checkResult.success 
                 ? 'bg-zinc-900/95 border-lime-500/30 text-lime-400 shadow-[0_0_20px_rgba(163,230,53,0.15)]' 
                 : 'bg-zinc-900/95 border-pink-500/30 text-pink-400 shadow-[0_0_20px_rgba(236,72,153,0.15)]'
             }`}>
               {checkResult.success ? <CheckCircle2 className="text-lime-400 shrink-0 mt-0.5" /> : <XCircle className="text-pink-550 shrink-0 mt-0.5" />}
               <div className="flex-1">
                 <p className="text-sm font-semibold leading-relaxed text-zinc-200">{checkResult.message}</p>
                 <button onClick={() => setCheckResult(null)} className={`text-xs mt-3 font-bold underline cursor-pointer hover:no-underline ${checkResult.success ? 'text-lime-400' : 'text-pink-400'}`}>
                   {checkResult.success ? 'Continuar' : 'Tancar i provar de nou'}
                 </button>
               </div>
             </div>
          </div>
        )}
      </div>
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { GameCanvas } from './components/GameCanvas';
import { LevelEditor } from './components/LevelEditor';
import { MachineType, LEVELS } from './game/levels';

export type GameLog = {
    question: string;
    correct: boolean;
    attemptNo: number;
    machineId: string;
};

export type PlayerStats = {
    playerName: string;
    corrects: number;
    errors: number;
    attempts: number;
    completedLevels: Set<string>;
    logs: GameLog[];
};

const MACHINE_KEYS = Object.keys(LEVELS) as MachineType[];

export default function App() {
    const [activeMachine, setActiveMachine] = useState<MachineType | null>(null);
    const [isEditor, setIsEditor] = useState(false);

    const [stats, setStats] = useState<PlayerStats>(() => {
        try {
            const saved = localStorage.getItem('playerStats');
            if (saved) {
                const parsed = JSON.parse(saved);
                return {
                    ...parsed,
                    completedLevels: new Set(parsed.completedLevels || []),
                    logs: parsed.logs || [],
                };
            }
        } catch (e) {
            console.error(e);
        }
        return {
            playerName: '',
            corrects: 0,
            errors: 0,
            attempts: 0,
            completedLevels: new Set(),
            logs: [],
        };
    });

    useEffect(() => {
        localStorage.setItem(
            'playerStats',
            JSON.stringify({
                ...stats,
                completedLevels: Array.from(stats.completedLevels),
            })
        );
    }, [stats]);

    const [inputName, setInputName] = useState('');

    const onQuestionAnswered = (question: string, correct: boolean, machineId: string) => {
        setStats(prev => ({
            ...prev,
            corrects: prev.corrects + (correct ? 1 : 0),
            errors: prev.errors + (!correct ? 1 : 0),
            attempts: prev.attempts + 1,
            logs: [{ question, correct, attemptNo: prev.attempts + 1, machineId }, ...prev.logs],
        }));
    };

    const onLevelComplete = (machineId: string) => {
        setStats(prev => {
            const newCompleted = new Set(prev.completedLevels);
            newCompleted.add(machineId);
            return { ...prev, completedLevels: newCompleted };
        });
    };

    if (!stats.playerName) {
        return (
            <div className="w-full min-h-screen bg-slate-950 text-white flex flex-col justify-center items-center p-6 font-sans">
                <div className="max-w-lg w-full text-center mb-8">
                    <div className="inline-block bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-4">
                        Laboratori Interactiu de Física i Enginyeria
                    </div>
                    <h1 className="text-4xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-orange-400 to-emerald-400 mb-3">
                        Les Màquines Simples
                    </h1>
                    <p className="text-slate-400 text-base">
                        Experimenta amb la roda, la palanca, el pla inclinat i la politja en escenaris vius i realistes per superar els reptes físics!
                    </p>
                </div>

                <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl shadow-2xl w-full max-w-md">
                    <h2 className="text-xl font-bold mb-4 text-center text-slate-200">
                        Identificació d'Enginyer/a
                    </h2>
                    <input
                        type="text"
                        value={inputName}
                        onChange={e => setInputName(e.target.value)}
                        onKeyDown={e =>
                            e.key === 'Enter' &&
                            inputName.trim() &&
                            setStats(p => ({ ...p, playerName: inputName.trim() }))
                        }
                        className="w-full p-4 rounded-xl bg-slate-950 text-white mb-5 border-2 border-slate-700 focus:border-amber-400 focus:outline-none text-lg"
                        placeholder="Escriu el teu nom..."
                        autoFocus
                    />
                    <button
                        onClick={() =>
                            inputName.trim() &&
                            setStats(p => ({ ...p, playerName: inputName.trim() }))
                        }
                        disabled={!inputName.trim()}
                        className="w-full bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-black py-4 rounded-xl text-lg disabled:opacity-40 transition-all hover:scale-[1.01] cursor-pointer"
                    >
                        🚀 Entrar al Laboratori
                    </button>
                </div>
            </div>
        );
    }

    if (isEditor) {
        return <LevelEditor onBack={() => setIsEditor(false)} />;
    }

    const completionPercentage = Math.round(
        (stats.completedLevels.size / MACHINE_KEYS.length) * 100
    );

    if (activeMachine) {
        const machineConfig = LEVELS[activeMachine];
        return (
            <div className="w-full h-screen bg-slate-950 flex flex-row overflow-hidden">
                {/* Left Sidebar */}
                <div className="w-72 bg-slate-900 border-r border-slate-800 flex flex-col z-40 text-white shadow-2xl shrink-0">
                    <div className="p-4 border-b border-slate-800 bg-slate-950/60 flex flex-col gap-3">
                        <div className="flex justify-between items-center">
                            <h2 className="font-bold text-sm text-slate-200 truncate pr-2">
                                👷 {stats.playerName}
                            </h2>
                            <div className="text-emerald-400 font-black text-xs bg-emerald-950 border border-emerald-500/30 px-2.5 py-1 rounded-lg">
                                {stats.completedLevels.size}/{MACHINE_KEYS.length} ({completionPercentage}%)
                            </div>
                        </div>

                        <button
                            onClick={() => setActiveMachine(null)}
                            className="w-full bg-slate-800 hover:bg-slate-700 border border-slate-700 px-3 py-2 rounded-xl font-bold text-xs transition-colors uppercase tracking-wider text-slate-200"
                        >
                            ← Menú de Màquines
                        </button>
                    </div>

                    {/* Quick Machine Switcher */}
                    <div className="p-3 border-b border-slate-800">
                        <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-2 px-1">
                            4 Màquines Simples
                        </div>
                        <div className="grid grid-cols-1 gap-1">
                            {MACHINE_KEYS.map(key => {
                                const m = LEVELS[key];
                                const done = stats.completedLevels.has(key);
                                const isCurrent = key === activeMachine;
                                return (
                                    <button
                                        key={key}
                                        onClick={() => setActiveMachine(key)}
                                        className={`flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                                            isCurrent
                                                ? 'bg-amber-500 text-slate-950 shadow'
                                                : 'bg-slate-950/50 hover:bg-slate-800 text-slate-300'
                                        }`}
                                    >
                                        <span className="flex items-center gap-2 truncate">
                                            <span>{m.emoji}</span>
                                            <span className="truncate">{m.name}</span>
                                        </span>
                                        {done && (
                                            <span
                                                className={
                                                    isCurrent
                                                        ? 'text-slate-950 font-black'
                                                        : 'text-emerald-400'
                                                }
                                            >
                                                ✓
                                            </span>
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Global Score Metrics */}
                    <div className="p-4 border-b border-slate-800">
                        <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-2 text-center">
                            Estadístiques de Respostes
                        </div>
                        <div className="grid grid-cols-3 gap-1.5">
                            <div className="bg-emerald-950/40 border border-emerald-800/40 p-2 rounded-xl text-center">
                                <div className="text-lg font-black text-emerald-400">
                                    {stats.corrects}
                                </div>
                                <div className="text-[9px] text-emerald-500 font-bold uppercase">
                                    Encerts
                                </div>
                            </div>
                            <div className="bg-rose-950/40 border border-rose-800/40 p-2 rounded-xl text-center">
                                <div className="text-lg font-black text-rose-400">
                                    {stats.errors}
                                </div>
                                <div className="text-[9px] text-rose-500 font-bold uppercase">
                                    Errors
                                </div>
                            </div>
                            <div className="bg-sky-950/40 border border-sky-800/40 p-2 rounded-xl text-center">
                                <div className="text-lg font-black text-sky-400">
                                    {stats.attempts}
                                </div>
                                <div className="text-[9px] text-sky-500 font-bold uppercase">
                                    Total
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Log Book */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-2">
                        <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-2 flex justify-between items-center">
                            <span>Quadern de Laboratori</span>
                            <span className="bg-slate-800 text-slate-300 px-2 py-0.5 rounded-full font-mono text-[10px]">
                                {stats.logs.length}
                            </span>
                        </div>
                        {stats.logs.length === 0 ? (
                            <div className="text-slate-500 text-xs text-center py-6 border border-dashed border-slate-800 rounded-xl">
                                Respon les preguntes de control per registrar els teus resultats.
                            </div>
                        ) : (
                            stats.logs.slice(0, 15).map((log, i) => (
                                <div
                                    key={i}
                                    className={`p-2.5 rounded-xl border-l-4 text-xs bg-slate-950/70 ${
                                        log.correct ? 'border-l-emerald-500' : 'border-l-rose-500'
                                    }`}
                                >
                                    <div className="text-slate-300 text-[11px] line-clamp-2 mb-1">
                                        {log.question}
                                    </div>
                                    <div
                                        className={`font-bold text-[10px] flex justify-between ${
                                            log.correct ? 'text-emerald-400' : 'text-rose-400'
                                        }`}
                                    >
                                        <span>{log.correct ? '✓ Correcte' : '✗ Incorrecte'}</span>
                                        <span className="text-slate-500">#{log.attemptNo}</span>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    <div className="p-2.5 bg-slate-950 text-center border-t border-slate-800 text-[10px] text-slate-400 font-mono">
                        WASD / FLETXES + PANELL INTERACTIU
                    </div>
                </div>

                {/* Main Canvas Area */}
                <div className="flex-1 h-full relative">
                    <GameCanvas
                        machineId={activeMachine}
                        onBack={() => setActiveMachine(null)}
                        onQuestionAnswered={(q, correct) =>
                            onQuestionAnswered(q, correct, activeMachine)
                        }
                        onLevelComplete={() => onLevelComplete(activeMachine)}
                    />
                </div>
            </div>
        );
    }

    return (
        <div className="w-full min-h-screen bg-slate-950 text-white p-6 md:p-10 font-sans flex flex-col justify-center">
            <div className="flex flex-wrap justify-between items-center max-w-6xl mx-auto w-full mb-8 bg-slate-900 border border-slate-800 px-6 py-4 rounded-2xl shadow-lg">
                <div className="flex items-center gap-4">
                    <div className="text-3xl bg-amber-500/10 border border-amber-500/30 p-2.5 rounded-xl">
                        👷
                    </div>
                    <div>
                        <h2 className="text-lg font-black text-white">
                            Enginyer/a: {stats.playerName}
                        </h2>
                        <div className="text-emerald-400 font-bold text-xs">
                            {stats.completedLevels.size} de {MACHINE_KEYS.length} màquines completades ({completionPercentage}%)
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <div className="text-xs text-slate-400">
                        Encerts: <strong className="text-emerald-400">{stats.corrects}</strong> |
                        Errors: <strong className="text-rose-400">{stats.errors}</strong>
                    </div>
                    <button
                        onClick={() => setStats(p => ({ ...p, playerName: '' }))}
                        className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-2 rounded-lg font-bold transition-colors"
                    >
                        Canviar perfil
                    </button>
                </div>
            </div>

            <div className="text-center max-w-3xl mx-auto mb-10">
                <h1 className="text-4xl md:text-6xl font-black mb-3 text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-orange-400 to-emerald-400">
                    Les 4 Màquines Simples
                </h1>
                <p className="text-base md:text-lg text-slate-300">
                    Tria un laboratori per experimentar amb les forces, ajustar l'Avantatge Mecànic en temps real, descobrir-ne la història i superar les proves físiques!
                </p>
            </div>

            <div className="max-w-5xl mx-auto w-full grid grid-cols-1 md:grid-cols-2 gap-6">
                {MACHINE_KEYS.map((key, idx) => {
                    const m = LEVELS[key];
                    const isComplete = stats.completedLevels.has(m.id);
                    const eq = m.formulas?.sign_intro?.equation;
                    return (
                        <div key={m.id} className="relative group h-full">
                            <button
                                onClick={() => setActiveMachine(m.id)}
                                className={`bg-gradient-to-br w-full ${m.bg} p-0.5 rounded-2xl hover:scale-[1.02] transition-all duration-200 shadow-xl text-left h-full flex flex-col relative overflow-hidden cursor-pointer`}
                            >
                                {isComplete && (
                                    <div className="absolute top-4 right-4 bg-emerald-500 text-slate-950 px-3 py-1 rounded-full text-xs font-black z-10 shadow-lg">
                                        ✓ SUPERAT
                                    </div>
                                )}
                                <div className="bg-slate-900/90 hover:bg-slate-900/80 transition-colors flex-1 rounded-[14px] p-6 flex flex-col justify-between w-full">
                                    <div>
                                        <div className="flex items-center gap-3 mb-3">
                                            <span className="text-4xl">{m.emoji}</span>
                                            <div>
                                                <div className="text-[10px] font-bold uppercase tracking-widest text-amber-400">
                                                    Laboratori {idx + 1}
                                                </div>
                                                <h2 className="text-xl font-black text-white">
                                                    {m.name}
                                                </h2>
                                            </div>
                                        </div>
                                        <p className="text-slate-300 text-xs leading-relaxed mb-4">
                                            {m.desc}
                                        </p>
                                    </div>
                                    <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                                        {eq ? (
                                            <span className="font-mono text-[11px] font-bold text-sky-300 bg-sky-950/60 border border-sky-500/30 px-2.5 py-1 rounded-md">
                                                {eq}
                                            </span>
                                        ) : (
                                            <span />
                                        )}
                                        <span className="text-xs font-bold text-amber-400 group-hover:translate-x-1 transition-transform">
                                            Jugar →
                                        </span>
                                    </div>
                                </div>
                            </button>
                            {m.id === 'wheel' && (
                                <button
                                    onClick={() => setIsEditor(true)}
                                    className="absolute bottom-4 right-24 bg-purple-700 hover:bg-purple-600 text-white font-bold py-1 px-2.5 rounded-lg text-[11px] z-10 shadow transition-colors"
                                >
                                    Editor
                                </button>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

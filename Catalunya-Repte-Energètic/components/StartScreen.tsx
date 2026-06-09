

import React, { useState, useEffect } from 'react';
import { ZapIcon, HeartIcon, CloudIcon, CoinIcon, AlertTriangleIcon, TrophyIcon, InfoIcon, EnterFullScreenIcon, ExitFullScreenIcon } from './Icons';
import { DifficultyLevel } from '../types';

interface StartScreenProps {
    onStartGame: (playerName: string, difficulty: DifficultyLevel) => void;
    onThemeChange: (difficulty: DifficultyLevel) => void;
    onShowGuide: () => void;
}

const InstructionCard = ({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) => (
    <div className="bg-slate-50/50 p-4 rounded-lg flex flex-col items-center text-center h-full border border-slate-200">
        <div className="text-teal-500 w-8 h-8 mx-auto mb-2 flex-shrink-0">{icon}</div>
        <h4 className="font-bold text-slate-800 mb-1">{title}</h4>
        <p className="text-xs text-slate-500">{description}</p>
    </div>
);

const StartScreen: React.FC<StartScreenProps> = ({ onStartGame, onThemeChange, onShowGuide }) => {
    const [playerName, setPlayerName] = useState('');
    const [difficulty, setDifficulty] = useState<DifficultyLevel>(DifficultyLevel.Medium);
    const [isFullscreen, setIsFullscreen] = useState(false);

    useEffect(() => {
        const handleFullscreenChange = () => {
            setIsFullscreen(!!document.fullscreenElement);
        };
        document.addEventListener('fullscreenchange', handleFullscreenChange);
        return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
    }, []);

    const toggleFullscreen = () => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch(err => {
                console.error(`Error attempting to enable full-screen mode: ${err.message} (${err.name})`);
            });
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            }
        }
    };

    const handleDifficultyChange = (level: DifficultyLevel) => {
        setDifficulty(level);
        onThemeChange(level);
    };

    const handleStart = () => {
        if (playerName.trim()) {
            onStartGame(playerName.trim(), difficulty);
        }
    };

    return (
        <div className="min-h-screen text-slate-800 font-sans flex items-center justify-center p-4 transition-colors duration-500 bg-slate-100">
            <div className="relative w-full max-w-5xl mx-auto bg-white rounded-lg shadow-2xl p-8 border border-slate-200/80">
                <div className="absolute top-4 right-4 z-50 flex items-center space-x-2">
                    <button
                        onClick={onShowGuide}
                        className="flex items-center gap-2 text-slate-500 hover:text-slate-800 transition-colors p-2 sm:p-3 rounded-full sm:rounded-lg hover:bg-slate-100/80"
                        title="Llegir la Guia del Joc"
                        aria-label="Llegir la Guia del Joc"
                    >
                        <InfoIcon className="w-6 h-6" />
                        <span className="hidden sm:inline font-semibold text-sm">Guia del Joc</span>
                    </button>
                     <button
                        onClick={toggleFullscreen}
                        className="hidden sm:flex items-center gap-2 text-slate-500 hover:text-slate-800 transition-colors p-2 sm:p-3 rounded-full sm:rounded-lg hover:bg-slate-100/80"
                        title={isFullscreen ? 'Reduir pantalla' : 'Pantalla completa'}
                        aria-label={isFullscreen ? 'Reduir pantalla' : 'Pantalla completa'}
                    >
                        {isFullscreen ? <ExitFullScreenIcon className="w-6 h-6" /> : <EnterFullScreenIcon className="w-6 h-6" />}
                        <span className="hidden sm:inline font-semibold text-sm">{isFullscreen ? 'Reduir' : 'Ampliar'}</span>
                    </button>
                </div>
                <div className="text-center mb-6">
                    <ZapIcon className="h-12 w-12 text-teal-500 mx-auto mb-4" />
                    <h1 className="text-4xl font-bold text-slate-900 tracking-wider">Catalunya: Repte Energètic</h1>
                    <p className="text-teal-600 mt-2 text-lg">El futur energètic està a les teves mans.</p>
                </div>

                <div className="bg-slate-50 p-6 rounded-lg mb-6 text-center border border-slate-200">
                    <h2 className="text-2xl font-semibold text-yellow-500 mb-2">El Teu Mandat Comença Ara</h2>
                    <p className="text-slate-600 max-w-2xl mx-auto">
                        Acabes de ser nomenat/da Conseller/a de Territori, Habitatge i Transició Ecològica. Durant el teu mandat de <strong>4 anys (16 trimestres)</strong>, hauràs de prendre decisions crucials per al futur energètic de Catalunya.
                    </p>
                </div>
                
                <div className="mb-6">
                    <h3 className="text-xl font-semibold text-center text-slate-800 mb-4">Com Funciona el Joc?</h3>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
                        <InstructionCard icon={<CoinIcon />} title="Gestiona les Mètriques" description="Controla el pressupost, l'aprovació ciutadana i les emissions de CO₂." />
                        <InstructionCard icon={<ZapIcon />} title="Construeix Centrals" description="Inverteix en noves centrals per cobrir la demanda creixent." />
                        <InstructionCard icon={<AlertTriangleIcon />} title="Afronta Esdeveniments" description="Pren decisions difícils que afectaran el teu mandat." />
                        <InstructionCard icon={<TrophyIcon />} title="Completa el Mandat" description="Supera els 4 anys de govern per guanyar la partida." />
                    </div>
                </div>

                <div className="mb-6">
                    <h3 className="text-xl font-semibold text-center text-slate-800 mb-4">Tria el Context del teu Mandat</h3>
                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                        <DifficultyButton
                            label="Llegat Pròsper"
                            description="Comences amb un llegat favorable: més pressupost i alta aprovació. Ideal per aprendre."
                            isSelected={difficulty === DifficultyLevel.Easy}
                            onClick={() => handleDifficultyChange(DifficultyLevel.Easy)}
                        />
                        <DifficultyButton
                            label="Repte Realista"
                            description="La situació actual de Catalunya. Un repte equilibrat amb recursos estàndard."
                            isSelected={difficulty === DifficultyLevel.Medium}
                            onClick={() => handleDifficultyChange(DifficultyLevel.Medium)}
                        />
                        <DifficultyButton
                            label="Crisi Heretada"
                            description="Heretes una crisi energètica i social. Menys pressupost, baixa aprovació i més demanda."
                            isSelected={difficulty === DifficultyLevel.Hard}
                            onClick={() => handleDifficultyChange(DifficultyLevel.Hard)}
                        />
                    </div>
                </div>

                <div className="mt-8 text-center">
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <input
                            type="text"
                            value={playerName}
                            onChange={(e) => setPlayerName(e.target.value)}
                            placeholder="Introdueix el teu nom de Conseller/a"
                            className="bg-slate-100 text-slate-800 placeholder-slate-400 border border-slate-300 rounded-lg py-3 px-4 w-full sm:w-80 text-center focus:ring-2 focus:ring-teal-500 focus:outline-none"
                            onKeyPress={(e) => e.key === 'Enter' && handleStart()}
                        />
                        <button
                            onClick={handleStart}
                            disabled={!playerName.trim()}
                            className="w-full sm:w-auto bg-teal-600 hover:bg-teal-700 text-white font-bold py-3 px-8 rounded-lg transition duration-300 shadow-md disabled:bg-slate-400 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            Començar Mandat
                        </button>
                    </div>
                </div>

                <div className="absolute bottom-4 right-4 text-xs text-slate-400 font-mono">v2.4</div>
            </div>
        </div>
    );
};

const DifficultyButton = ({ label, description, isSelected, onClick }: { label: string, description: string, isSelected: boolean, onClick: () => void }) => (
    <button
        onClick={onClick}
        className={`p-4 rounded-lg border-2 text-center transition-all duration-200 w-full sm:w-1/3 ${
            isSelected ? 'bg-teal-50/50 border-teal-500 scale-105 shadow-lg' : 'bg-slate-100/50 border-slate-300 hover:border-slate-400'
        }`}
    >
        <h4 className={`font-bold text-lg mb-1 ${isSelected ? 'text-teal-700' : 'text-slate-800'}`}>{label}</h4>
        <p className="text-xs text-slate-500">{description}</p>
    </button>
);

export default StartScreen;
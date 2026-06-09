

import React, { useState, useEffect } from 'react';
import { Quarter, ClimateEvent } from '../types';
import { ZapIcon, EnterFullScreenIcon, ExitFullScreenIcon, InfoIcon, AlertTriangleIcon, HomeIcon } from './Icons';

interface HeaderProps {
    playerName: string;
    year: number;
    quarter: Quarter;
    mandateRemaining: number;
    onAdvanceTurnClick: () => void;
    onImportEnergy: () => void;
    isAdvanceTurnDisabled: boolean;
    isAdvancingTurn: boolean;
    energyDeficit: number;
    onShowGuide: () => void;
    onRestart: () => void;
    currentClimateEvent: ClimateEvent | null;
}

const seasonMap: Record<Quarter, string> = {
    [Quarter.Q1]: 'Primavera',
    [Quarter.Q2]: 'Estiu',
    [Quarter.Q3]: 'Tardor',
    [Quarter.Q4]: 'Hivern',
};

const Header: React.FC<HeaderProps> = ({
    playerName,
    year,
    quarter,
    mandateRemaining,
    onAdvanceTurnClick,
    onImportEnergy,
    isAdvanceTurnDisabled,
    isAdvancingTurn,
    energyDeficit,
    onShowGuide,
    onRestart,
    currentClimateEvent
}) => {
    const [isFullscreen, setIsFullscreen] = useState(false);
    const hasDeficit = energyDeficit > 0;

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

    const quarterText = currentClimateEvent ? currentClimateEvent.description : `${quarter} (${seasonMap[quarter]})`;

    return (
        <header className="bg-white p-4 rounded-lg shadow-md border border-slate-200">
            <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
                <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
                    <div className="text-center sm:text-left border-b-2 sm:border-b-0 sm:border-r-2 border-slate-200 pb-2 sm:pb-0 sm:pr-6">
                        <p className="text-sm font-semibold text-slate-500">Conseller/a</p>
                        <h2 className="text-xl font-bold text-slate-800">{playerName}</h2>
                    </div>
                    <div className="text-center sm:text-left">
                        <h1 className="text-2xl font-bold text-teal-600">Mandat {year}</h1>
                        <p className="text-lg text-slate-600">
                            {quarterText} - Queden {mandateRemaining} trimestres
                        </p>
                    </div>
                </div>

                <div className="flex items-center space-x-2 sm:space-x-4">
                    <button
                        onClick={onRestart}
                        className="flex items-center gap-2 p-3 bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-600 hover:text-slate-800 transition-colors"
                        title="Reiniciar Partida"
                    >
                        <HomeIcon className="w-6 h-6" />
                        <span className="hidden sm:inline font-semibold">Inici</span>
                    </button>
                     <button
                        onClick={onShowGuide}
                        className="flex items-center gap-2 p-3 bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-600 hover:text-slate-800 transition-colors"
                        title="Guia del Joc"
                    >
                        <InfoIcon className="w-6 h-6" />
                        <span className="hidden sm:inline font-semibold">Guia</span>
                    </button>
                     <button
                        onClick={toggleFullscreen}
                        className="hidden sm:flex items-center gap-2 p-3 bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-600 hover:text-slate-800 transition-colors"
                        title={isFullscreen ? 'Reduir pantalla' : 'Pantalla completa'}
                    >
                        {isFullscreen ? <ExitFullScreenIcon className="w-6 h-6" /> : <EnterFullScreenIcon className="w-6 h-6" />}
                        <span className="hidden sm:inline font-semibold">{isFullscreen ? 'Reduir' : 'Ampliar'}</span>
                    </button>
                    <button
                        onClick={hasDeficit ? onImportEnergy : onAdvanceTurnClick}
                        disabled={isAdvanceTurnDisabled && !hasDeficit}
                        className={`font-bold py-3 px-6 rounded-lg text-white transition duration-300 shadow-md text-lg text-center ${
                            isAdvanceTurnDisabled && !hasDeficit
                                ? 'bg-slate-400 cursor-not-allowed'
                                : hasDeficit
                                ? 'bg-red-500 hover:bg-red-600 animate-pulse'
                                : 'bg-indigo-500 hover:bg-indigo-600'
                        }`}
                    >
                        {hasDeficit ? (
                            <span className="flex items-center justify-center">
                                <AlertTriangleIcon className="w-5 h-5 mr-2" />
                                Importar energia i avançar
                            </span>
                        ) : (
                            isAdvancingTurn ? 'Avançant...' : 'Avançar Trimestre'
                        )}
                    </button>
                </div>
            </div>
        </header>
    );
};

export default Header;
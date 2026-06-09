import React from 'react';
import { ReplayIcon, BackArrowIcon } from './icons';
import { GameResult } from '../types';

interface TournamentScoreScreenProps {
    results: GameResult[];
    onBack: () => void;
    onRetry: () => void;
    finalScore: number;
}

const TournamentScoreScreen: React.FC<TournamentScoreScreenProps> = ({ results, onBack, onRetry, finalScore }) => {
    const totalScore = finalScore;
    const maxTotalScore = results.reduce((acc, r) => acc + r.maxScore, 0);
    const totalMistakes = results.reduce((acc, r) => acc + r.mistakes, 0);
    
    const finalPercentage = maxTotalScore > 0 ? Math.round((totalScore / maxTotalScore) * 100) : 0;

    const getFeedback = () => {
        if (finalPercentage >= 95) return { title: "Excel·lent! Ets un Mestre!", color: "text-emerald-500", message: "Has aconseguit una puntuació gairebé perfecta!" };
        if (finalPercentage >= 80) return { title: "Molt Bé! Gairebé perfecte!", color: "text-sky-500", message: "Un resultat fantàstic! Continua així." };
        if (finalPercentage >= 60) return { title: "Bon Treball! Segueix practicant!", color: "text-amber-500", message: "Vas per bon camí, no paris ara." };
        if (finalPercentage >= 40) return { title: "No està malament, però pots millorar!", color: "text-orange-500", message: "Una mica més de pràctica i ho tindràs dominat." };
        return { title: "Necessites més pràctica. No et rendeixis!", color: "text-rose-500", message: "Cada intent és un pas endavant. Torna-ho a provar!" };
    };

    const feedback = getFeedback();

    return (
        <div className="w-full max-w-3xl mx-auto p-8 bg-white/80 backdrop-blur-md border border-slate-200 rounded-2xl shadow-xl text-center animate-fade-in-scale">
            <h1 className="text-3xl font-bold mb-2">Gran Torneig Completat!</h1>
            <p className={`text-2xl font-bold mb-4 ${feedback.color}`}>{feedback.title}</p>
            
            <div className="my-6">
                <p className="text-lg text-slate-600">La teva puntuació final és:</p>
                <p className={`text-8xl font-bold my-2 ${feedback.color}`}>{finalPercentage}</p>
                <p className="text-lg text-slate-500">sobre 100</p>
            </div>

            <p className="text-slate-600 text-lg mb-8">{feedback.message}</p>
            
            <div className="my-8 text-left bg-slate-50 p-4 rounded-lg border border-slate-200">
                <h3 className="text-xl font-bold text-slate-800 mb-4 text-center">Informe Detallat</h3>
                <div className="space-y-2">
                    <div className="grid grid-cols-3 gap-4 font-bold text-slate-500 px-3">
                        <span>Joc</span>
                        <span className="text-right">Puntuació</span>
                        <span className="text-right">Errors</span>
                    </div>
                    {results.map((result, index) => (
                         <div key={index} className="grid grid-cols-3 gap-4 p-3 rounded-md bg-white border border-slate-200/50">
                            <span className="font-semibold text-indigo-700">{result.gameName}</span>
                            <span className="text-right font-mono">{result.score} / {result.maxScore}</span>
                            <span className={`text-right font-mono font-bold ${result.mistakes > 0 ? 'text-rose-500' : 'text-emerald-500'}`}>{result.mistakes}</span>
                        </div>
                    ))}
                    <div className="grid grid-cols-3 gap-4 font-bold text-slate-800 px-3 pt-3 border-t-2 border-slate-300">
                        <span>TOTAL</span>
                        <span className="text-right font-mono">{results.reduce((acc, r) => acc + r.score, 0)} / {maxTotalScore}</span>
                        <span className="text-right font-mono">{totalMistakes}</span>
                    </div>
                </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
                <button
                    onClick={onRetry}
                    className="flex items-center justify-center gap-2 w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-lg transition-transform transform hover:scale-105"
                >
                    <ReplayIcon />
                    <span>Tornar a intentar</span>
                </button>
                 <button
                    onClick={onBack}
                    className="flex items-center justify-center gap-2 w-full sm:w-auto bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold py-3 px-6 rounded-lg transition-transform transform hover:scale-105"
                >
                    <BackArrowIcon className="w-4 h-4" />
                    <span>Tornar al Menú</span>
                </button>
            </div>
        </div>
    );
};

export default TournamentScoreScreen;
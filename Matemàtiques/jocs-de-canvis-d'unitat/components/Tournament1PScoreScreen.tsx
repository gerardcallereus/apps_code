import React from 'react';
import { ReplayIcon, BackArrowIcon } from './icons';
import { Player, PlayerLog, TurnLog } from '../types';
import { GAME_THEMES } from '../theme';

// Type assertion for global libraries
declare global {
    interface Window {
        html2canvas: any;
        jspdf: any;
    }
}

const formatQuestion = (turn: TurnLog, gameKey: string | null): string => {
    const q = turn.question;
    if (!q) return "Repte";
    switch (gameKey) {
        case 'quiz': case 'fillBlank':
            return `Converteix ${q.fromValue.toLocaleString('ca-ES')} ${q.fromUnit.symbol} → ${q.toUnit.symbol}`;
        case 'comparison':
            return `Compara ${q.valueA.toLocaleString('ca-ES')} ${q.unitA.symbol} vs ${q.valueB.toLocaleString('ca-ES')} ${q.unitB.symbol}`;
        case 'unitRace':
             return `Suma i converteix a ${q.targetUnit.symbol}: ${q.items.map((i: any) => `${i.value.toLocaleString('ca-ES')} ${i.unit.symbol}`).join(' + ')}`;
        case 'sorting': return `Ordena de petit a gran.`;
        case 'puzzle': return `Resol el trencaclosques en cadena.`;
        case 'lab': return `Crea la poció.`;
        case 'whackAMole': return `Fuga del Castell`;
        default: return "Repte";
    }
};

const formatAnswer = (answer: any, gameKey: string | null): string => {
    if (answer === undefined || answer === null) return 'N/A';
    if (typeof answer === 'number') return answer.toLocaleString('ca-ES');
    switch (gameKey) {
        case 'sorting': case 'puzzle':
            return Array.isArray(answer) ? answer.join(', ').substring(0, 100) : String(answer);
        case 'whackAMole': return answer ? "Escapat!" : "Atrapat!";
        default: return String(answer);
    }
};

const getQualification = (score: number) => {
    if (score > 700) return { grade: 'AE', label: 'Assoliment Excel·lent', color: 'text-emerald-500' };
    if (score > 500) return { grade: 'AN', label: 'Assoliment Notable', color: 'text-sky-500' };
    if (score > 300) return { grade: 'AS', label: 'Assoliment Satisfactori', color: 'text-amber-500' };
    return { grade: 'NA', label: 'No Assolit', color: 'text-rose-500' };
};

interface Tournament1PScoreScreenProps {
    player: Player;
    log: PlayerLog;
    onBack: () => void;
    onRetry: () => void;
}

const Tournament1PScoreScreen: React.FC<Tournament1PScoreScreenProps> = ({ player, log, onBack, onRetry }) => {
    const qualification = getQualification(player.score);
    const [isDownloading, setIsDownloading] = React.useState(false);

    const handleDownload = async () => {
        setIsDownloading(true);
        const reportElement = document.getElementById('pdf-content-wrapper');
        if (!reportElement) {
            setIsDownloading(false);
            return;
        }

        reportElement.classList.add('pdf-export-mode');
        const detailsElements = reportElement.querySelectorAll('details');
        detailsElements.forEach(d => d.open = true);

        try {
            const { jsPDF } = window.jspdf;
            const pdf = new jsPDF('p', 'mm', 'a4');

            const canvas = await window.html2canvas(reportElement, {
                scale: 2,
                backgroundColor: '#ffffff'
            });
            const imgData = canvas.toDataURL('image/png');
            
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = pdf.internal.pageSize.getHeight();
            const imgProps = pdf.getImageProperties(imgData);
            
            const margin = 10;
            const usableWidth = pdfWidth - margin * 2;
            const usableHeight = pdfHeight - margin * 2;
            
            const imgAspectRatio = imgProps.width / imgProps.height;
            const pageAspectRatio = usableWidth / usableHeight;

            let finalWidth, finalHeight;
            if (imgAspectRatio > pageAspectRatio) {
                finalWidth = usableWidth;
                finalHeight = finalWidth / imgAspectRatio;
            } else {
                finalHeight = usableHeight;
                finalWidth = finalHeight * imgAspectRatio;
            }

            const xOffset = (pdfWidth - finalWidth) / 2;
            const yOffset = (pdfHeight - finalHeight) / 2;

            pdf.addImage(imgData, 'PNG', xOffset, yOffset, finalWidth, finalHeight);
            pdf.save(`informe-torneig-${player.name}.pdf`);
        } catch (error) {
            console.error("Error en generar el PDF:", error);
        } finally {
            reportElement.classList.remove('pdf-export-mode');
            setIsDownloading(false);
        }
    };

    return (
        <>
        <style>{`
            .pdf-export-mode {
                background: white !important;
                padding: 15px !important;
                font-family: 'Helvetica', sans-serif;
                color: black !important;
            }
            .pdf-export-mode h1, .pdf-export-mode h3 { font-size: 16pt !important; margin-bottom: 8px !important; font-weight: bold; }
            .pdf-export-mode p, .pdf-export-mode span, .pdf-export-mode div, .pdf-export-mode summary { font-size: 8pt !important; line-height: 1.3 !important; }
            .pdf-export-mode .text-8xl { font-size: 48pt !important; font-weight: bold; }
            .pdf-export-mode .text-6xl { font-size: 32pt !important; font-weight: bold; }
            .pdf-export-mode .text-xl { font-size: 10pt !important; }
            .pdf-export-mode .my-6 { margin-top: 12px !important; margin-bottom: 12px !important; }
            .pdf-export-mode .mt-8 { margin-top: 16px !important; }
            .pdf-export-mode .p-4 { padding: 8px !important; }
            .pdf-export-mode .max-h-96 { max-height: none !important; overflow-y: visible !important; }
            .pdf-export-mode details { page-break-inside: avoid; border: 1px solid #eee; margin-bottom: 4px; }
            .pdf-export-mode summary { padding: 4px !important; background-color: #f0f0f0; border-bottom: 1px solid #ddd; font-weight: bold; }
            .pdf-export-mode .p-3 { padding: 4px !important; }
            .pdf-export-mode .p-2 { padding: 3px !important; }
            .pdf-export-mode .mb-3 { margin-bottom: 4px !important; }
            .pdf-export-mode .mt-1 { margin-top: 2px !important; }
            .pdf-export-mode .shadow-sm { box-shadow: none !important; }
            .pdf-export-mode * {
                border-color: #ccc !important;
                color: #000 !important;
            }
        `}</style>
        <div className="w-full max-w-3xl mx-auto p-8 bg-white/80 backdrop-blur-md border border-slate-200 rounded-2xl shadow-xl text-center animate-fade-in-scale">
            <div id="pdf-content-wrapper">
                <h1 className="text-3xl font-bold mb-2">Torneig Completat!</h1>
                <p className="text-xl text-slate-700 font-semibold">{player.name}</p>
                
                <div className="my-6">
                    <div className="flex items-center justify-center gap-x-8 gap-y-4 flex-wrap">
                        <div className="text-center">
                            <p className="text-lg text-slate-600">Puntuació Final</p>
                            <p className={`text-8xl font-bold ${qualification.color}`}>{player.score}</p>
                        </div>
                         <div className="text-center">
                            <p className="text-lg text-slate-600">Qualificació</p>
                            <p className={`text-6xl font-bold ${qualification.color}`}>{qualification.grade}</p>
                            <p className="font-semibold">{qualification.label}</p>
                        </div>
                    </div>
                </div>
                
                <div className="mt-8 text-left p-4 bg-slate-50 border border-slate-200 rounded-lg">
                    <div className="text-center mb-4">
                         <h3 className="text-2xl font-bold">Informe de la Partida</h3>
                    </div>
                    <div className="max-h-96 overflow-y-auto pr-2">
                        {Object.keys(log).map((gameKey) => {
                            const turns = log[gameKey as keyof PlayerLog] || [];
                            const gameTotal = turns.reduce((acc, t) => acc + t.score, 0);
                            return (
                                <details key={gameKey} className="mb-2 bg-white rounded-lg shadow-sm" open>
                                    <summary className="font-semibold cursor-pointer p-3 flex justify-between items-center text-indigo-700">
                                        <span>{GAME_THEMES[gameKey as keyof typeof GAME_THEMES]?.name || gameKey}</span>
                                        <span className="font-bold">{gameTotal} pts</span>
                                    </summary>
                                    <div className="p-3 border-t border-slate-200">
                                        {turns.map((turn, index) => (
                                            <div key={index} className="mb-3 pb-3 border-b border-slate-200 last:border-b-0 text-sm">
                                                <p className="font-semibold text-slate-700">{index + 1}. {formatQuestion(turn, gameKey)}</p>
                                                <div className={`p-2 rounded mt-1 ${turn.isCorrect ? 'bg-emerald-50' : 'bg-rose-50'}`}>
                                                    <p><span className="font-medium">Resposta:</span>{' '}<span className={`font-semibold ${turn.isCorrect ? 'text-emerald-700' : 'text-rose-700'}`}>{formatAnswer(turn.userAnswer, gameKey)} {turn.isCorrect ? '✔' : '✘'}</span></p>
                                                    {turn.isCorrect === false && (<p><span className="font-medium">Correcta:</span> <span className="font-semibold text-slate-600">{formatAnswer(turn.correctAnswer, gameKey)}</span></p>)}
                                                </div>
                                                <p className="text-right font-semibold text-indigo-600 mt-1">{turn.score} pts</p>
                                            </div>
                                        ))}
                                    </div>
                                </details>
                            )
                        })}
                    </div>
                </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 my-8">
                <button onClick={onRetry} className="flex items-center justify-center gap-2 w-full sm:w-auto bg-sky-600 hover:bg-sky-700 text-white font-bold py-3 px-6 rounded-lg"><ReplayIcon /><span>Tornar a jugar</span></button>
                <button onClick={onBack} className="flex items-center justify-center gap-2 w-full sm:w-auto bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold py-3 px-6 rounded-lg"><BackArrowIcon className="w-4 h-4" /><span>Tornar al Menú</span></button>
            </div>
            <div className="text-center mt-4">
                 <button onClick={handleDownload} disabled={isDownloading} className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2 px-4 rounded-lg disabled:bg-slate-400">{isDownloading ? 'Generant PDF...' : 'Descarregar Informe'}</button>
            </div>
        </div>
        </>
    );
};

export default Tournament1PScoreScreen;
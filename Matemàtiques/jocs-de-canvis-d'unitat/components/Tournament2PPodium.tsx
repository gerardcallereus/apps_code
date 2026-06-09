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
        case 'quiz':
        case 'fillBlank':
            return `Converteix ${q.fromValue.toLocaleString('ca-ES')} ${q.fromUnit.symbol} → ${q.toUnit.symbol}`;
        case 'comparison':
            return `Compara ${q.valueA.toLocaleString('ca-ES')} ${q.unitA.symbol} vs ${q.valueB.toLocaleString('ca-ES')} ${q.unitB.symbol}`;
        case 'unitRace':
             return `Suma i converteix a ${q.targetUnit.symbol}: ${q.items.map((i: any) => `${i.value.toLocaleString('ca-ES')} ${i.unit.symbol}`).join(' + ')}`;
        case 'sorting':
            return `Ordena de petit a gran.`;
        case 'puzzle':
            return `Resol el trencaclosques en cadena.`;
        case 'lab':
            return `Crea la poció.`;
        case 'whackAMole':
            return `Fuga del Castell`;
        default:
            return "Repte";
    }
};

const formatAnswer = (answer: any, gameKey: string | null): string => {
    if (answer === undefined || answer === null) return 'N/A';
    if (typeof answer === 'number') return answer.toLocaleString('ca-ES');
    switch (gameKey) {
        case 'sorting':
        case 'puzzle':
            return Array.isArray(answer) ? answer.join(', ').substring(0, 100) : String(answer);
        case 'whackAMole':
             return answer ? "Escapat!" : "Atrapat!";
        default:
            return String(answer);
    }
};

const getQualification = (score: number) => {
    if (score > 700) return { grade: 'AE', label: 'Assoliment Excel·lent', color: 'text-emerald-500' };
    if (score > 500) return { grade: 'AN', label: 'Assoliment Notable', color: 'text-sky-500' };
    if (score > 300) return { grade: 'AS', label: 'Assoliment Satisfactori', color: 'text-amber-500' };
    return { grade: 'NA', label: 'No Assolit', color: 'text-rose-500' };
};

const PlayerReport: React.FC<{ player: Player; log: PlayerLog; reportId: string }> = ({ player, log, reportId }) => {
    const gameKeys = Object.keys(log);
    const qualification = getQualification(player.score);

    if (gameKeys.length === 0) {
        return <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg"><p className="text-slate-500 text-center">No s'han registrat dades.</p></div>;
    }

    return (
        <div id={reportId} className="p-4 bg-slate-50 border border-slate-200 rounded-lg">
             <div className="text-center mb-4">
                <h4 className="text-2xl font-bold">{player.name}</h4>
                <p className={`text-4xl font-bold ${qualification.color}`}>{player.score} pts</p>
                <p className={`text-2xl font-semibold ${qualification.color}`}>{qualification.grade}</p>
                <p className="text-sm text-slate-500">{qualification.label}</p>
            </div>

            <div className="max-h-80 overflow-y-auto pr-2">
                {gameKeys.map((gameKey) => {
                    const turns = log[gameKey as keyof PlayerLog] || [];
                    const gameTotal = turns.reduce((acc, t) => acc + t.score, 0);

                    return (
                        <details key={gameKey} className="mb-2 bg-white rounded-lg shadow-sm">
                            <summary className="font-semibold cursor-pointer p-3 flex justify-between items-center text-indigo-700">
                                <span>{GAME_THEMES[gameKey as keyof typeof GAME_THEMES]?.name || gameKey}</span>
                                <span className="font-bold">{gameTotal} pts</span>
                            </summary>
                            <div className="p-3 border-t border-slate-200">
                                {turns.map((turn, index) => (
                                    <div key={index} className="mb-3 pb-3 border-b border-slate-200 last:border-b-0 text-sm">
                                        <p className="font-semibold text-slate-700">{index + 1}. {formatQuestion(turn, gameKey)}</p>
                                        <div className={`p-2 rounded mt-1 ${turn.isCorrect ? 'bg-emerald-50' : 'bg-rose-50'}`}>
                                            <p><span className="font-medium">Resposta:</span>{' '} <span className={`font-semibold ${turn.isCorrect ? 'text-emerald-700' : 'text-rose-700'}`}>{formatAnswer(turn.userAnswer, gameKey)} {turn.isCorrect ? '✔' : '✘'}</span></p>
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
    );
};

interface Tournament2PPodiumProps {
    players: [Player, Player];
    playerLogs: [PlayerLog, PlayerLog];
    onBack: () => void;
    onRetry: () => void;
}

const Tournament2PPodium: React.FC<Tournament2PPodiumProps> = ({ players, playerLogs, onBack, onRetry }) => {
    const [p1, p2] = players;
    const winner = p1.score > p2.score ? p1 : p2.score > p1.score ? p2 : null;
    const isTie = p1.score === p2.score;
    const [isDownloading, setIsDownloading] = React.useState(false);

    const handleDownload = async () => {
        setIsDownloading(true);
        const reportElement = document.getElementById('full-tournament-report');
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
            pdf.save(`informe-torneig-${players[0].name}-vs-${players[1].name}.pdf`);
        } catch (error) {
            console.error("Error en generar el PDF:", error);
        } finally {
            reportElement.classList.remove('pdf-export-mode');
            setIsDownloading(false);
        }
    };

    const getPodiumStep = (player: Player, position: '1st' | '2nd') => {
        const height = isTie ? 'h-40' : position === '1st' ? 'h-40' : 'h-24';
        const color = player === p1 ? 'bg-purple-500' : 'bg-teal-500';
        const positionText = isTie ? '1' : position === '1st' ? '1' : '2';
        
        return (
             <div className={`relative w-1/3 text-white font-bold text-center flex flex-col justify-end items-center transition-all duration-1000 ease-out ${height}`}>
                <div className={`w-full flex-grow flex flex-col items-center justify-end p-4 ${color} rounded-t-lg`}>
                     <span className={`text-3xl mb-2 transition-opacity duration-500 delay-1000 ${winner === player || isTie ? 'opacity-100' : 'opacity-0'}`}>
                        {winner === player || isTie ? '👑' : ''}
                    </span>
                    <p className="text-xl truncate w-full">{player.name}</p>
                    <p className="text-3xl">{player.score}</p>
                </div>
                <div className="w-full h-8 bg-slate-400 flex items-center justify-center text-2xl text-slate-800">{positionText}</div>
            </div>
        );
    }
    
    const [first, second] = p1.score >= p2.score ? [p1, p2] : [p2, p1];

    return (
        <>
        <style>{`
            .pdf-export-mode {
                background: white !important;
                padding: 15px !important;
                font-family: 'Helvetica', sans-serif;
                color: black !important;
            }
            .pdf-export-mode .grid { display: grid !important; }
            .pdf-export-mode .md\\:grid-cols-2 { grid-template-columns: repeat(2, minmax(0, 1fr)) !important; gap: 10px !important; }
            .pdf-export-mode h3 { font-size: 16pt !important; margin-bottom: 8px !important; font-weight: bold; }
            .pdf-export-mode h4 { font-size: 14pt !important; margin-bottom: 4px !important; font-weight: bold; }
            .pdf-export-mode p, .pdf-export-mode span, .pdf-export-mode div, .pdf-export-mode summary { font-size: 8pt !important; line-height: 1.3 !important; }
            .pdf-export-mode .text-4xl { font-size: 20pt !important; font-weight: bold; }
            .pdf-export-mode .text-2xl { font-size: 12pt !important; font-weight: bold; }
            .pdf-export-mode .text-sm { font-size: 7pt !important; }
            .pdf-export-mode .max-h-80 { max-height: none !important; overflow-y: visible !important; }
            .pdf-export-mode details { page-break-inside: avoid; border: 1px solid #eee; margin-bottom: 4px; }
            .pdf-export-mode summary { padding: 4px !important; background-color: #f0f0f0; border-bottom: 1px solid #ddd; font-weight: bold; }
            .pdf-export-mode .p-4 { padding: 8px !important; }
            .pdf-export-mode .p-3 { padding: 4px !important; }
            .pdf-export-mode .p-2 { padding: 3px !important; }
            .pdf-export-mode .mb-4 { margin-bottom: 8px !important; }
            .pdf-export-mode .mb-3 { margin-bottom: 4px !important; }
            .pdf-export-mode .mt-1 { margin-top: 2px !important; }
            .pdf-export-mode .shadow-sm { box-shadow: none !important; }
            .pdf-export-mode * {
                border-color: #ccc !important;
                color: #000 !important;
            }
        `}</style>
        <div className="w-full p-6 md:p-8 bg-white/80 backdrop-blur-md border border-slate-200 rounded-2xl shadow-xl text-center animate-fade-in-scale">
            <h1 className="text-4xl font-bold mb-2">Torneig Finalitzat!</h1>
            <h2 className={`text-2xl font-semibold mb-8 ${isTie ? 'text-amber-500' : winner === p1 ? 'text-purple-600' : 'text-teal-600'}`}>
                {isTie ? "És un empat!" : `El guanyador és ${winner?.name}!`}
            </h2>
            
            <div className="flex justify-center items-end gap-2 h-64">
                {getPodiumStep(second, '2nd')}
                {getPodiumStep(first, '1st')}
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
                <button onClick={onRetry} className="flex items-center justify-center gap-2 w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-lg transition-transform transform hover:scale-105"><ReplayIcon /><span>Tornar a jugar</span></button>
                <button onClick={onBack} className="flex items-center justify-center gap-2 w-full sm:w-auto bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold py-3 px-6 rounded-lg transition-transform transform hover:scale-105"><BackArrowIcon className="w-4 h-4" /><span>Tornar al Menú</span></button>
            </div>
            
            <div className="mt-12 text-left">
                 <div id="full-tournament-report">
                    <div className="text-center mb-6">
                        <h3 className="text-2xl font-bold">Informe Detallat de la Partida</h3>
                    </div>
                    <div className="grid md:grid-cols-2 gap-8">
                        <PlayerReport player={players[0]} log={playerLogs[0]} reportId="player-report-0" />
                        <PlayerReport player={players[1]} log={playerLogs[1]} reportId="player-report-1" />
                    </div>
                </div>
                <div className="text-center mt-4">
                    <button onClick={handleDownload} disabled={isDownloading} className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2 px-4 rounded-lg disabled:bg-slate-400">
                        {isDownloading ? 'Generant PDF...' : 'Descarregar Informe'}
                    </button>
                </div>
            </div>
        </div>
        </>
    );
};

export default Tournament2PPodium;
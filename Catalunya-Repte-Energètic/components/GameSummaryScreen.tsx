import React, { useState, useEffect, useMemo } from 'react';
import { GameStatus, GameState, EnergySource, Quarter, DifficultyLevel, Policy, ApprovalRatings, AnalysisReport } from '../types';
import { CheckCircleIcon, XCircleIcon, ZapIcon, InfoIcon, SunIcon, WindIcon, WaveIcon, DropletIcon, AtomIcon, FireIcon, LeafIcon, DownloadIcon, LoadingSpinner, AlertTriangleIcon, ThermometerSunIcon, ScaleIcon, CoinIcon, HeartIcon } from './Icons';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { APPROVAL_LOSS_THRESHOLD, QUARTERS, ALL_POLICIES } from '../constants';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

interface GameSummaryScreenProps {
    status: GameStatus;
    history: GameState[];
    onRestart: () => void;
    finalScore: number;
    difficulty: DifficultyLevel;
}

const THEME_CONFIGS = {
    [DifficultyLevel.Easy]: { bg: 'bg-theme-easy-bg', text: 'text-theme-easy-text', border: 'border-theme-easy-border' },
    [DifficultyLevel.Medium]: { bg: 'bg-theme-medium-bg', text: 'text-theme-medium-text', border: 'border-theme-medium-border' },
    [DifficultyLevel.Hard]: { bg: 'bg-theme-hard-bg', text: 'text-theme-hard-text', border: 'border-theme-hard-border' }
};

const getQuarterAndYear = (turn: number, startYear: number, startQuarterIndex: number) => {
    const effectiveTurn = turn + startQuarterIndex;
    const year = startYear + Math.floor(effectiveTurn / 4);
    const quarter = QUARTERS[effectiveTurn % 4];
    return `${quarter} ${year}`;
};

// New, more complex analysis generator
const generateRichAnalysis = (history: GameState[], finalScore: number): AnalysisReport => {
    if (history.length <= 1) {
        return {
            title: "Anàlisi Inconclusa",
            sections: [{ title: "Dades insuficients", points: ["La partida ha estat massa curta per a una anàlisi detallada."], icon: <InfoIcon /> }],
            conclusion: "Juga una partida més llarga per obtenir un informe complet del teu mandat."
        };
    }
    const initialState = history[0];
    const finalState = history[history.length - 1];

    // --- Title ---
    let title = `Informe de Final de Mandat: ${finalState.playerName}`;

    // --- Economic Section ---
    const economicPoints: string[] = [];
    const budgetChange = finalState.budget - initialState.budget;
    if (budgetChange > 2000) {
        economicPoints.push(`Gestió pressupostària excel·lent, finalitzant amb un superàvit de ${budgetChange.toLocaleString()} M€ respecte a l'inici.`);
    } else if (budgetChange >= 0) {
        economicPoints.push(`Has mantingut la solvència econòmica, acabant amb un pressupost de ${finalState.budget.toLocaleString()} M€.`);
    } else {
        economicPoints.push(`El mandat ha suposat un cost net per a les arques públiques, amb una reducció del pressupost de ${Math.abs(budgetChange).toLocaleString()} M€.`);
    }
    const turnsWithDeficit = history.filter(h => h.energyDeficit > 0).length;
    if (turnsWithDeficit > 5) {
        economicPoints.push(`La dependència energètica ha estat un llast econòmic, amb ${turnsWithDeficit} trimestres on s'ha hagut d'importar energia a preus elevats.`);
    } else if (turnsWithDeficit > 0) {
        economicPoints.push(`S'ha recorregut a la importació d'energia en ${turnsWithDeficit} trimestres, impactant en el pressupost.`);
    } else {
        economicPoints.push(`S'ha assolit la sobirania energètica, sense necessitat d'importar energia durant tot el mandat.`);
    }

    // --- Energy & Climate Section ---
    const energyPoints: string[] = [];
    const co2ReductionPercentage = ((initialState.co2Emissions - finalState.co2Emissions) / (initialState.co2Emissions || 1)) * 100;

    if (co2ReductionPercentage > 25) {
        energyPoints.push(`Èxit climàtic rotund, amb una reducció de les emissions de CO₂ del ${co2ReductionPercentage.toFixed(0)}%.`);
    } else if (co2ReductionPercentage > 0) {
        energyPoints.push(`S'ha avançat en la descarbonització, aconseguint una reducció de les emissions de CO₂ del ${co2ReductionPercentage.toFixed(0)}%.`);
    } else {
        energyPoints.push(`Les emissions de CO₂ han augmentat un ${Math.abs(co2ReductionPercentage).toFixed(0)}%, un dels reptes pendents del mandat.`);
    }

    if (history.length > 4) {
        const lastTurnCO2 = finalState.co2Emissions;
        const midTermCO2 = history[Math.floor(history.length / 2)].co2Emissions;
        if (lastTurnCO2 < midTermCO2) {
            energyPoints.push(`Tot i el resultat final, es va aconseguir una tendència a la baixa en les emissions durant la segona meitat del mandat.`);
        }
    }
    
    const newPlants = finalState.powerPlants.filter(p => p.constructionStartTurn !== -1 && initialState.powerPlants.every(ip => ip.id !== p.id));
    if (newPlants.length > 0) {
        const plantTypes = [...new Set(newPlants.map(p => p.type))].join(', ');
        energyPoints.push(`S'ha expandit la xarxa amb ${newPlants.length} nova/es central/s, principalment de tipus: ${plantTypes}.`);
    } else {
        energyPoints.push(`No s'ha realitzat cap inversió en noves centrals elèctriques.`);
    }

    // --- Social & Political Section ---
    const socialPoints: string[] = [];
    const approvalChanges: Record<keyof ApprovalRatings, number> = {
        citizen: finalState.approvalRatings.citizen - initialState.approvalRatings.citizen,
        business: finalState.approvalRatings.business - initialState.approvalRatings.business,
        political: finalState.approvalRatings.political - initialState.approvalRatings.political,
        environmentalist: finalState.approvalRatings.environmentalist - initialState.approvalRatings.environmentalist,
    };
    
    const getAgentName = (agentKey: keyof ApprovalRatings): { name: string, plural: boolean } => {
        switch (agentKey) {
            case 'citizen': return { name: 'la Ciutadania', plural: false };
            case 'business': return { name: "l'Empresariat", plural: false };
            case 'political': return { name: 'el Suport Polític', plural: false };
            case 'environmentalist': return { name: 'els Ecologistes', plural: true };
            default: return { name: agentKey, plural: false };
        }
    };

    const sortedApprovals = (Object.keys(approvalChanges) as (keyof ApprovalRatings)[]).sort((a,b) => approvalChanges[b] - approvalChanges[a]);
    
    const bestAgentInfo = getAgentName(sortedApprovals[0]);
    const worstAgentInfo = getAgentName(sortedApprovals[3]);

    socialPoints.push(`El sector que més ha valorat la teva gestió ${bestAgentInfo.plural ? 'han estat' : 'ha estat'} ${bestAgentInfo.name}, amb un canvi de ${approvalChanges[sortedApprovals[0]].toFixed(0)} punts.`);
    socialPoints.push(`Per contra, el sector més crític ${worstAgentInfo.plural ? 'han estat' : 'ha estat'} ${worstAgentInfo.name}, amb una variació de ${approvalChanges[sortedApprovals[3]].toFixed(0)} punts.`);
    
    const approvedPolicies = finalState.policies.filter(p => p.status === 'active');
    if (approvedPolicies.length > 2) {
        socialPoints.push(`La teva capacitat de negociació ha estat clau, aprovant ${approvedPolicies.length} polítiques públiques que han modelat el futur energètic.`);
    } else if (approvedPolicies.length > 0) {
        socialPoints.push(`S'ha aconseguit tirar endavant ${approvedPolicies.length} llei/s importants.`);
    }

    // --- Key Decisions Section ---
    const keyDecisionPoints: string[] = [];
    const significantDecisions = finalState.majorDecisions.filter(d => 
        d.event.title.includes("Aeroport") || d.event.title.includes("Crisi:")
    ).slice(0, 3);

    if (significantDecisions.length > 0) {
        significantDecisions.forEach(d => {
            keyDecisionPoints.push(`Al trimestre ${d.turn}, la decisió de "${d.decisionText}" durant l'esdeveniment "${d.event.title}" va marcar un punt d'inflexió.`);
        });
    } else if (finalState.majorDecisions.length > 0) {
        const lastDecision = finalState.majorDecisions[finalState.majorDecisions.length - 1];
        keyDecisionPoints.push(`Una decisió rellevant va ser "${lastDecision.decisionText}" durant l'esdeveniment "${lastDecision.event.title}".`);
    } else {
        keyDecisionPoints.push("El mandat ha transcorregut sense esdeveniments de gran impacte estratègic, basant-se en una gestió contínua.");
    }

    // --- Conclusion ---
    let conclusion = `Amb una nota final de ${finalScore.toFixed(1)}, el teu mandat ha estat un complex exercici d'equilibris. `;
    if (finalState.gameStatus === GameStatus.Won) {
        conclusion += "Has aconseguit arribar al final, demostrant resiliència i capacitat de gestió a llarg termini.";
    } else {
        if (finalState.budget <= 0) conclusion += "La gestió econòmica ha estat el principal escull, portant finalment a la bancarrota.";
        else if (finalState.overallApproval < APPROVAL_LOSS_THRESHOLD) conclusion += "La pèrdua progressiva de confiança social ha estat la causa principal de la fi prematura del mandat.";
        else conclusion += "L'impacte mediambiental de les teves decisions ha impedit assolir els objectius climàtics, un repte clau no superat.";
    }

    return {
        title,
        sections: [
            { title: "Gestió Econòmica", points: economicPoints, icon: <CoinIcon /> },
            { title: "Gestió Energètica i Climàtica", points: energyPoints, icon: <ZapIcon /> },
            { title: "Gestió Social i Política", points: socialPoints, icon: <HeartIcon /> },
            { title: "Decisions Clau", points: keyDecisionPoints, icon: <ScaleIcon /> },
        ],
        conclusion
    };
};

const AnalysisReportDisplay: React.FC<{ report: AnalysisReport }> = ({ report }) => {
    return (
        <div className="mb-6 text-slate-700">
            <h3 className="text-xl font-semibold text-center text-yellow-600 mb-4">{report.title}</h3>
            <div className="bg-slate-100 p-4 rounded-lg space-y-4 border border-slate-200">
                {report.sections.map((section, index) => (
                    <div key={index}>
                        <h4 className="font-bold text-teal-600 flex items-center mb-2">
                            <span className="w-5 h-5 mr-2">{section.icon}</span>
                            {section.title}
                        </h4>
                        <ul className="list-disc pl-10 space-y-1 text-sm">
                            {section.points.map((point, pIndex) => <li key={pIndex}>{point}</li>)}
                        </ul>
                    </div>
                ))}
                <div className="mt-4 pt-4 border-t border-slate-200">
                    <h4 className="font-bold text-teal-600 flex items-center mb-2">
                        <InfoIcon className="w-5 h-5 mr-2" />
                        Conclusió del Mandat
                    </h4>
                    <p className="text-sm italic pl-7 text-slate-600">{report.conclusion}</p>
                </div>
            </div>
        </div>
    );
};

const PLANT_ICONS: Record<EnergySource, React.ReactNode> = {
    [EnergySource.Solar]: <SunIcon className="w-5 h-5 text-yellow-400 mr-2 flex-shrink-0" />,
    [EnergySource.Termosolar]: <ThermometerSunIcon className="w-5 h-5 text-orange-400 mr-2 flex-shrink-0" />,
    [EnergySource.Wind]: <WindIcon className="w-5 h-5 text-blue-400 mr-2 flex-shrink-0" />,
    [EnergySource.EolicaMarina]: <WaveIcon className="w-5 h-5 text-cyan-300 mr-2 flex-shrink-0" />,
    [EnergySource.Hydro]: <DropletIcon className="w-5 h-5 text-cyan-400 mr-2 flex-shrink-0" />,
    [EnergySource.Nuclear]: <AtomIcon className="w-5 h-5 text-purple-400 mr-2 flex-shrink-0" />,
    [EnergySource.Fossil]: <FireIcon className="w-5 h-5 text-red-500 mr-2 flex-shrink-0" />,
    [EnergySource.Biofuel]: <LeafIcon className="w-5 h-5 text-green-500 mr-2 flex-shrink-0" />,
};

const difficultyTextMap = {
    [DifficultyLevel.Easy]: "Llegat Pròsper",
    [DifficultyLevel.Medium]: "Repte Realista",
    [DifficultyLevel.Hard]: "Crisi Heredada"
};

export const GameSummaryScreen: React.FC<GameSummaryScreenProps> = ({ status, history, onRestart, finalScore, difficulty }) => {
    
    const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
    const analysis = useMemo(() => generateRichAnalysis(history, finalScore), [history, finalScore]);
    const theme = THEME_CONFIGS[difficulty];
    
    if (history.length <= 1) {
        return (
             <div className={`fixed inset-0 flex flex-col items-center justify-center z-50 p-4 ${theme.text} ${theme.bg}`}>
                <p>No hi ha dades per mostrar. Reiniciant...</p>
                 <button onClick={onRestart} className="mt-4 bg-teal-600 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded">
                    Reiniciar
                </button>
            </div>
        )
    }

    const isWin = status === GameStatus.Won;
    const finalState = history[history.length - 1];
    const initialState = history[0];
    const finalTurn = history.length - 1;

    const newPlants = finalState.powerPlants.filter(p => p.constructionStartTurn !== -1 && !initialState.powerPlants.some(ip => ip.id === p.id));
    const approvedPolicies = finalState.policies.filter(p => p.status === 'active').map(p => ALL_POLICIES.find(pol => pol.id === p.policyId)).filter((p): p is Policy => p !== undefined);

    const chartData = history.map((state, index) => ({
        turn: index,
        Pressupost: state.budget,
        'Ciutadania': state.approvalRatings.citizen,
        'Empresariat': state.approvalRatings.business,
        'Suport Polític': state.approvalRatings.political,
        'Ecologistes': state.approvalRatings.environmentalist,
        'Emissions CO₂': state.co2Emissions,
        Producció: state.totalProduction,
        Demanda: state.totalDemand,
    }));
    
    const getScoreColor = (score: number) => {
        if (score < 4.5) return 'text-red-500';
        if (score < 7.5) return 'text-yellow-500';
        return 'text-green-500';
    };

    const mandateDurationText = (() => {
        const turnsPlayed = finalTurn;
        if (turnsPlayed >= 16) {
            return "dels teus 4 anys de govern.";
        }
        const years = Math.floor(turnsPlayed / 4);
        const quarters = turnsPlayed % 4;
        const parts = [];
        if (years > 0) parts.push(`${years} any${years > 1 ? 's' : ''}`);
        if (quarters > 0) parts.push(`${quarters} trimestre${quarters > 1 ? 's' : ''}`);
        return parts.length > 0 ? `del teu mandat d'${parts.join(' i ')}.` : "del teu breu mandat.";
    })();
    
    const handleDownloadPdf = async () => {
        setIsGeneratingPdf(true);
        const input = document.getElementById('pdf-summary');
        if (input) {
            try {
                const canvas = await html2canvas(input, {
                    scale: 2,
                    backgroundColor: '#ffffff',
                    useCORS: true,
                    onclone: (document) => {
                        document.querySelectorAll('*').forEach(el => {
                            (el as HTMLElement).style.color = '#1e293b';
                        });
                    }
                });
    
                const imgData = canvas.toDataURL('image/png');
                const imgWidth = canvas.width;
                const imgHeight = canvas.height;
    
                const pdf = new jsPDF('p', 'mm', 'a4');
                const pdfWidth = pdf.internal.pageSize.getWidth();
                const pdfHeight = pdf.internal.pageSize.getHeight();
    
                const ratio = imgWidth / pdfWidth;
                const totalPdfHeight = imgHeight / ratio;
    
                const totalPages = Math.ceil(totalPdfHeight / pdfHeight);
    
                for (let i = 0; i < totalPages; i++) {
                    if (i > 0) {
                        pdf.addPage();
                    }
                    const yPosition = - (pdfHeight * i);
                    pdf.addImage(imgData, 'PNG', 0, yPosition, pdfWidth, totalPdfHeight);
                }
    
                pdf.save(`resum-mandat-${finalState.playerName}.pdf`);
            } catch (error) {
                console.error("Error generating PDF:", error);
            }
        }
        setIsGeneratingPdf(false);
    };

    return (
        <div className={`min-h-screen ${theme.bg} text-slate-800 font-sans overflow-y-auto p-4 sm:p-6 lg:p-8 transition-colors duration-500`}>
            <div id="pdf-summary" className={`relative w-full max-w-6xl mx-auto bg-white rounded-lg shadow-2xl p-8 my-8 border ${theme.border}/50`}>
                 <div className="text-center mb-6">
                     {isWin ? <CheckCircleIcon className="h-16 w-16 text-green-500 mx-auto mb-4" /> : <XCircleIcon className="h-16 w-16 text-red-500 mx-auto mb-4" />}
                     <h1 className="text-4xl font-bold text-slate-900 tracking-wider">{isWin ? "Mandat Completat amb Èxit" : "Final del Mandat"}</h1>
                     <p className={`${theme.text} mt-2 text-lg`}>Aquest és el resum {mandateDurationText}</p>
                 </div>
                 
                 <div className="bg-slate-50 p-6 rounded-lg mb-6 text-center grid grid-cols-1 md:grid-cols-3 gap-4 items-center border border-slate-200">
                    <div>
                        <p className="text-sm text-slate-500">Conseller/a</p>
                        <p className="text-2xl font-bold text-slate-800">{finalState.playerName}</p>
                    </div>
                    <div>
                        <p className="text-sm text-slate-500">Puntuació Final</p>
                        <p className={`text-5xl font-bold ${getScoreColor(finalScore)}`}>{finalScore.toFixed(1)}</p>
                    </div>
                    <div>
                        <p className="text-sm text-slate-500">Dificultat</p>
                        <p className="text-2xl font-bold text-slate-800">{difficultyTextMap[difficulty]}</p>
                    </div>
                </div>

                <AnalysisReportDisplay report={analysis} />

                 <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                    <div className="bg-slate-50/50 p-4 rounded-lg h-64 border border-slate-200"><h3 className="text-center font-semibold text-sm mb-2 text-slate-700">Evolució del Pressupost</h3><ResponsiveContainer width="100%" height="90%"><LineChart data={chartData}><CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" /><XAxis dataKey="turn" stroke="#64748b" /><YAxis stroke="#64748b" tickFormatter={(v) => `${(v/1000)}k`} /><Tooltip contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0' }}/><Line type="monotone" dataKey="Pressupost" stroke="#f59e0b" strokeWidth={2} dot={false}/></LineChart></ResponsiveContainer></div>
                    <div className="bg-slate-50/50 p-4 rounded-lg h-64 border border-slate-200"><h3 className="text-center font-semibold text-sm mb-2 text-slate-700">Evolució de l'Aprovació</h3><ResponsiveContainer width="100%" height="90%"><LineChart data={chartData}><CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" /><XAxis dataKey="turn" stroke="#64748b" /><YAxis stroke="#64748b" domain={[0, 100]} /><Tooltip contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0' }}/><Legend wrapperStyle={{fontSize: "13px"}}/><Line type="monotone" dataKey="Ciutadania" stroke="#fb7185" strokeWidth={2} dot={false}/><Line type="monotone" dataKey="Empresariat" stroke="#60a5fa" strokeWidth={2} dot={false}/><Line type="monotone" dataKey="Suport Polític" stroke="#c084fc" strokeWidth={2} dot={false}/><Line type="monotone" dataKey="Ecologistes" stroke="#4ade80" strokeWidth={2} dot={false}/></LineChart></ResponsiveContainer></div>
                    <div className="bg-slate-50/50 p-4 rounded-lg h-64 border border-slate-200"><h3 className="text-center font-semibold text-sm mb-2 text-slate-700">Producció vs Demanda</h3><ResponsiveContainer width="100%" height="90%"><LineChart data={chartData}><CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" /><XAxis dataKey="turn" stroke="#64748b" /><YAxis stroke="#64748b" /><Tooltip contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0' }}/><Legend wrapperStyle={{fontSize: "13px"}}/><Line type="monotone" dataKey="Producció" stroke="#2dd4bf" strokeWidth={2} dot={false}/><Line type="monotone" dataKey="Demanda" stroke="#f43f5e" strokeWidth={2} dot={false}/></LineChart></ResponsiveContainer></div>
                    <div className="bg-slate-50/50 p-4 rounded-lg h-64 border border-slate-200"><h3 className="text-center font-semibold text-sm mb-2 text-slate-700">Evolució d'Emissions CO₂</h3><ResponsiveContainer width="100%" height="90%"><LineChart data={chartData}><CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" /><XAxis dataKey="turn" stroke="#64748b" /><YAxis stroke="#64748b" /><Tooltip contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0' }}/><Line type="monotone" dataKey="Emissions CO₂" stroke="#38bdf8" strokeWidth={2} dot={false}/></LineChart></ResponsiveContainer></div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-slate-700">
                    <div>
                        <h3 className="text-lg font-semibold text-teal-600 mb-2">Noves Centrals Construïdes</h3>
                        <div className="bg-slate-50 p-4 rounded-lg space-y-2 border border-slate-200">
                            {newPlants.length > 0 ? newPlants.map(p => (
                                <div key={p.id} className="flex items-center text-sm">
                                    {PLANT_ICONS[p.type]}
                                    <span>{p.name} ({p.capacity} MW) - Operativa des de {getQuarterAndYear(p.operationalTurn, initialState.startYear, initialState.startQuarterIndex)}</span>
                                </div>
                            )) : <p className="text-sm text-slate-500">No s'han construït noves centrals durant aquest mandat.</p>}
                        </div>
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-teal-600 mb-2">Polítiques Públiques Aprovades</h3>
                        <div className="bg-slate-50 p-4 rounded-lg space-y-2 border border-slate-200">
                            {approvedPolicies.length > 0 ? approvedPolicies.map(p => (
                                <div key={p.id} className="flex items-center text-sm">
                                    <ScaleIcon className="w-5 h-5 text-teal-500 mr-2 flex-shrink-0" />
                                    <span>{p.title}</span>
                                </div>
                            )) : <p className="text-sm text-slate-500">No s'ha aprovat cap política pública durant aquest mandat.</p>}
                        </div>
                    </div>
                </div>

                <div className="mt-8 text-center flex flex-col sm:flex-row justify-center gap-4">
                    <button onClick={onRestart} className={`w-full sm:w-auto font-bold py-3 px-8 rounded-lg text-white transition duration-300 shadow-md bg-indigo-600 hover:bg-indigo-700`}>Tornar a Jugar</button>
                    <button onClick={handleDownloadPdf} disabled={isGeneratingPdf} className={`w-full sm:w-auto font-bold py-3 px-8 rounded-lg text-white transition duration-300 shadow-md flex items-center justify-center ${isGeneratingPdf ? 'bg-slate-400' : 'bg-teal-600 hover:bg-teal-700'}`}>
                        {isGeneratingPdf ? <LoadingSpinner className="w-5 h-5 mr-2"/> : <DownloadIcon className="w-5 h-5 mr-2"/>}
                        {isGeneratingPdf ? 'Generant PDF...' : 'Descarregar Resum'}
                    </button>
                </div>
            </div>
        </div>
    );
};
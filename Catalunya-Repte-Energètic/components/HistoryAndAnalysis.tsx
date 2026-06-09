import React from 'react';
import { GameState, NewsArticle } from '../types';
import ActivityFeed from './NewsFeed';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ALL_POLICIES, POWER_PLANT_CONFIG } from '../constants';
import { BriefcaseIcon, CheckCircleIcon, CogIcon, XCircleIcon, ScaleIcon } from './Icons';

interface HistoryAndAnalysisProps {
    gameState: GameState;
    gameHistory: GameState[];
    log: { message: string; turn: number; id:string }[];
    news: NewsArticle[];
}

const getIconForTimeline = (type: string) => {
    switch(type) {
        case 'construction': return <CogIcon className="w-5 h-5 text-yellow-500" />;
        case 'event': return <BriefcaseIcon className="w-5 h-5 text-blue-500" />;
        case 'policy_approved': return <CheckCircleIcon className="w-5 h-5 text-green-500" />;
        case 'policy_rejected': return <XCircleIcon className="w-5 h-5 text-red-500" />;
        default: return <ScaleIcon className="w-5 h-5 text-purple-500" />;
    }
}

const HistoryAndAnalysis: React.FC<HistoryAndAnalysisProps> = ({ gameState, gameHistory, log, news }) => {
    
    const timelineItems = React.useMemo(() => {
        const items: { turn: number; type: string; title: string; description: string }[] = [];

        // Construction events
        gameState.powerPlants.forEach(plant => {
            if (plant.constructionStartTurn >= 0) {
                // FIX: Correctly find the specific plant config to access its cost.
                // POWER_PLANT_CONFIG[plant.type] is an array, so we must find the correct config object.
                const config = POWER_PLANT_CONFIG[plant.type].find(c => c.name === plant.name);
                const costText = config ? `${config.cost.toLocaleString()} M€` : 'N/A';
                items.push({
                    turn: plant.constructionStartTurn,
                    type: 'construction',
                    title: `Inici Construcció: ${plant.name}`,
                    description: `Cost de ${costText}. Operativa en ${plant.operationalTurn - plant.constructionStartTurn} trimestres.`
                });
            }
        });

        // Major decisions from events
        gameState.majorDecisions.forEach(decision => {
            items.push({
                turn: decision.turn,
                type: 'event',
                title: `Esdeveniment: ${decision.event.title}`,
                description: `Decisió presa: "${decision.decisionText}"`
            });
        });
        
        // Policy results
        gameState.policies.forEach(policy => {
            const policyInfo = ALL_POLICIES.find(p => p.id === policy.policyId);
            if (policyInfo && (policy.status === 'active' || policy.status === 'rejected')) {
                const resolutionTurn = policy.turnWillResolve;
                 items.push({
                    turn: resolutionTurn,
                    type: policy.status === 'active' ? 'policy_approved' : 'policy_rejected',
                    title: `Resultat Llei: ${policyInfo.title}`,
                    description: `La proposta de llei ha estat ${policy.status === 'active' ? 'APROVADA' : 'REBUTJADA'} pel parlament.`
                });
            }
        });

        return items.sort((a, b) => b.turn - a.turn);
    }, [gameState.powerPlants, gameState.majorDecisions, gameState.policies]);

    const chartData = gameHistory.map((state, index) => ({
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
    
    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left Column: Timeline & News */}
                <div className="space-y-6">
                     <div>
                        <h2 className="text-xl font-bold text-teal-600 mb-4 border-b border-slate-200 pb-2">Línia Temporal de Decisions Clau</h2>
                        <div className="bg-white p-4 rounded-lg space-y-4 max-h-[30rem] overflow-y-auto border border-slate-200">
                            {timelineItems.length > 0 ? timelineItems.map((item, index) => (
                                <div key={index} className="flex items-start gap-4">
                                    <div className="mt-1 flex-shrink-0">{getIconForTimeline(item.type)}</div>
                                    <div>
                                        <p className="font-semibold text-slate-800">{item.title}</p>
                                        <p className="text-sm text-slate-500">{item.description}</p>
                                        <p className="text-xs text-slate-400 mt-1">Trimestre {item.turn}</p>
                                    </div>
                                </div>
                            )) : <p className="text-slate-400 text-center">No s'han pres decisions importants encara.</p>}
                        </div>
                    </div>
                     <ActivityFeed news={news} log={log} />
                </div>

                {/* Right Column: Charts */}
                 <div>
                    <h2 className="text-xl font-bold text-teal-600 mb-4 text-center border-b border-slate-200 pb-2">Gràfiques d'Evolució</h2>
                     <div className="space-y-6">
                         <div className="bg-white p-4 rounded-lg h-64 border border-slate-200">
                            <h3 className="text-center font-semibold text-slate-600 mb-2">Pressupost</h3>
                             <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={chartData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                                     <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                                    <XAxis dataKey="turn" stroke="#64748b" name="Trimestre" />
                                    <YAxis stroke="#64748b" tickFormatter={(value) => `${(value/1000).toFixed(0)}k`} />
                                    <Tooltip contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0' }}/>
                                    <Line type="monotone" dataKey="Pressupost" stroke="#f59e0b" strokeWidth={2} dot={false}/>
                                </LineChart>
                            </ResponsiveContainer>
                         </div>
                          <div className="bg-white p-4 rounded-lg h-64 border border-slate-200">
                             <h3 className="text-center font-semibold text-slate-600 mb-2">Evolució de l'Aprovació</h3>
                             <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={chartData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                                     <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                                    <XAxis dataKey="turn" stroke="#64748b" name="Trimestre" />
                                    <YAxis stroke="#64748b" domain={[0, 100]}/>
                                    <Tooltip contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0' }}/>
                                    <Legend wrapperStyle={{fontSize: "13px"}}/>
                                    <Line type="monotone" dataKey="Ciutadania" name="Ciutadania" stroke="#fb7185" strokeWidth={2} dot={false}/>
                                    <Line type="monotone" dataKey="Empresariat" name="Empresariat" stroke="#60a5fa" strokeWidth={2} dot={false}/>
                                    <Line type="monotone" dataKey="Suport Polític" name="Suport Polític" stroke="#c084fc" strokeWidth={2} dot={false}/>
                                    <Line type="monotone" dataKey="Ecologistes" name="Ecologistes" stroke="#4ade80" strokeWidth={2} dot={false}/>
                                </LineChart>
                            </ResponsiveContainer>
                         </div>
                         <div className="bg-white p-4 rounded-lg h-64 border border-slate-200">
                            <h3 className="text-center font-semibold text-slate-600 mb-2">Producció vs. Demanda</h3>
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={chartData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                                    <XAxis dataKey="turn" stroke="#64748b" name="Trimestre" />
                                    <YAxis stroke="#64748b" />
                                    <Tooltip contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0' }}/>
                                    <Legend wrapperStyle={{fontSize: "13px"}}/>
                                    <Line type="monotone" dataKey="Producció" stroke="#2dd4bf" strokeWidth={2} dot={false} />
                                    <Line type="monotone" dataKey="Demanda" stroke="#f43f5e" strokeWidth={2} dot={false} />
                                </LineChart>
                            </ResponsiveContainer>
                         </div>
                         <div className="bg-white p-4 rounded-lg h-64 border border-slate-200">
                            <h3 className="text-center font-semibold text-slate-600 mb-2">Emissions CO₂</h3>
                             <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={chartData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                                     <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                                    <XAxis dataKey="turn" stroke="#64748b" name="Trimestre" />
                                    <YAxis stroke="#64748b" />
                                    <Tooltip contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0' }}/>
                                    <Line type="monotone" dataKey="Emissions CO₂" stroke="#38bdf8" strokeWidth={2} dot={false} />
                                </LineChart>
                            </ResponsiveContainer>
                         </div>
                     </div>
                 </div>
            </div>
        </div>
    );
};

export default HistoryAndAnalysis;
import React, { useState, useMemo } from 'react';
import { GameEvent, Decision, GameState, EnergySource, Quarter, DifficultyLevel } from '../types';
import { CAPACITY_FACTORS, QUARTERS } from '../constants';
import { CheckCircleIcon, XCircleIcon, InfoIcon, CoinIcon, HeartIcon, CloudIcon, ZapIcon, BoltIcon, ShieldCheckIcon, ChevronDownIcon, CalendarIcon } from './Icons';
import { PLANT_ICONS } from './Icons';


interface EventScreenProps {
    event: GameEvent;
    onDecision: (decision: Decision) => void;
    gameState: GameState;
    turn: number;
    seasonalProductionMultipliers: Record<EnergySource, number>;
}

const EventScreen: React.FC<EventScreenProps> = ({ event, onDecision, gameState, turn, seasonalProductionMultipliers }) => {
    
    const [isEnergyOverviewOpen, setIsEnergyOverviewOpen] = useState(false);
    const { difficulty, startYear, startQuarterIndex } = gameState;
    const effectiveTurn = turn + startQuarterIndex;
    const currentQuarter = QUARTERS[effectiveTurn % 4];
    const currentYear = startYear + Math.floor(effectiveTurn / 4);

    const productionBySource = useMemo(() => {
        const operationalPlants = gameState.powerPlants.filter(p => p.operationalTurn <= turn && p.isActive && !p.isForcedOffline && !p.isDecommissioned);
        const production: Partial<Record<EnergySource, number>> = {};

        Object.values(EnergySource).forEach(source => {
            const sourcePlants = operationalPlants.filter(p => p.type === source);
            const sourceProduction = sourcePlants.reduce((acc, plant) => {
                let baseProduction = plant.capacity * CAPACITY_FACTORS[plant.type] * plant.outputPercentage;
                baseProduction *= seasonalProductionMultipliers[plant.type];
                return acc + baseProduction;
            }, 0);
            if(sourceProduction > 0) {
                 production[source] = sourceProduction;
            }
        });
        return production;
    }, [gameState.powerPlants, turn, seasonalProductionMultipliers]);

    const energySovereignty = gameState.totalDemand > 0 ? (gameState.totalProduction / gameState.totalDemand) * 100 : 100;

    const parseExplanation = (text: string) => {
        const prosMatch = text.match(/\*\*Pros:\*\*\s*([\s\S]*?)(?=\n\*\*Contres:\*\*|\n\*\*Conclusió:\*\*|$)/);
        const consMatch = text.match(/\*\*Contres:\*\*\s*([\s\S]*?)(?=\n\*\*Conclusió:\*\*|$)/);
        const conclusionMatch = text.match(/\*\*Conclusió:\*\*\s*([\s\S]*)/);

        const pros = prosMatch ? prosMatch[1].trim().split('\n').filter(line => line.trim() !== '') : [];
        const cons = consMatch ? consMatch[1].trim().split('\n').filter(line => line.trim() !== '') : [];
        const conclusion = conclusionMatch ? conclusionMatch[1].trim() : '';

        return { pros, cons, conclusion };
    };
    
    const narration = event.description(difficulty);

    return (
        <div className="min-h-screen overflow-y-auto p-4 sm:p-6 lg:p-8 flex items-center justify-center">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-5xl border border-teal-300 my-8 mx-auto flex flex-col">
                <div className="p-6">
                    <h2 className="text-2xl font-bold text-teal-600 mb-2 text-center">{event.title}</h2>
                     <div className="flex justify-center items-center gap-2 text-md text-slate-500 mb-4 font-semibold">
                        <CalendarIcon className="w-5 h-5" />
                        <span>{currentQuarter} de {currentYear}</span>
                    </div>
                    <div className="text-slate-600 my-4 bg-slate-100 rounded-lg p-4 border border-slate-200">
                        <p className="italic text-center">"{narration}"</p>
                    </div>
                </div>
                
                 <div className="px-6 pb-4 border-t border-b border-slate-200 bg-slate-50/50">
                    <h3 className="text-lg font-semibold text-slate-700 my-3 text-center">Estat Actual</h3>
                    <div className="grid grid-cols-3 gap-4 text-center">
                        <div className="bg-white p-3 rounded-lg border border-slate-200">
                            <CoinIcon className="w-7 h-7 mx-auto text-yellow-500 mb-1" />
                            <span className="font-bold text-lg">{gameState.budget.toLocaleString()} M€</span>
                            <span className="text-xs block text-slate-500">Pressupost</span>
                        </div>
                         <div className="bg-white p-3 rounded-lg border border-slate-200">
                            <HeartIcon className="w-7 h-7 mx-auto text-rose-500 mb-1" />
                            <span className="font-bold text-lg">{gameState.overallApproval.toFixed(0)}%</span>
                            <span className="text-xs block text-slate-500">Aprov. General</span>
                        </div>
                         <div className="bg-white p-3 rounded-lg border border-slate-200">
                            <CloudIcon className="w-7 h-7 mx-auto text-sky-500 mb-1" />
                            <span className="font-bold text-lg">{gameState.co2Emissions.toLocaleString()} t</span>
                            <span className="text-xs block text-slate-500">Emissions CO₂</span>
                        </div>
                    </div>
                    {/* New Energy Overview Panel */}
                     <div className="mt-4">
                        <button onClick={() => setIsEnergyOverviewOpen(!isEnergyOverviewOpen)} className="w-full flex justify-between items-center text-left bg-slate-100 hover:bg-slate-200 p-2 rounded-lg text-sm font-semibold text-slate-700 transition-colors border border-slate-200">
                            <span>Panorama Energètic Actual</span>
                            <ChevronDownIcon className={`w-5 h-5 transition-transform ${isEnergyOverviewOpen ? 'rotate-180' : ''}`} />
                        </button>
                        {isEnergyOverviewOpen && (
                            <div className="mt-2 bg-white p-3 rounded-lg border border-slate-200">
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                    {Object.entries(productionBySource).map(([source, production]) => (
                                        <div key={source} className="flex items-center space-x-2 text-sm">
                                            {PLANT_ICONS[source as EnergySource]}
                                            <span className="font-semibold text-slate-600">{source}:</span>
                                            <span className="text-slate-800 font-medium">{(production as number).toFixed(0)} MW</span>
                                        </div>
                                    ))}
                                </div>
                                <div className="mt-3 pt-3 border-t border-slate-200 grid grid-cols-3 text-center text-sm">
                                    <div className="font-semibold"><ZapIcon className="w-4 h-4 inline-block mr-1" />{gameState.totalProduction.toFixed(0)} <span className="text-slate-500">MW Prod.</span></div>
                                    <div className="font-semibold"><BoltIcon className="w-4 h-4 inline-block mr-1" />{gameState.totalDemand.toFixed(0)} <span className="text-slate-500">MW Dem.</span></div>
                                    <div className="font-semibold"><ShieldCheckIcon className="w-4 h-4 inline-block mr-1" />{energySovereignty.toFixed(0)}<span className="text-slate-500">% Sobir.</span></div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <div className="overflow-y-auto px-6 py-6 space-y-6">
                    {event.decisions.map((decision, index) => {
                        const { pros, cons, conclusion } = parseExplanation(decision.explanation(gameState, difficulty));
                        
                        return (
                            <div key={index} className="bg-slate-50 p-5 rounded-lg border border-slate-200 flex flex-col">
                                <button
                                    onClick={() => onDecision(decision)}
                                    className="w-full bg-white hover:bg-teal-600 text-slate-800 hover:text-white font-semibold py-3 px-4 rounded-lg transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-opacity-50 border border-teal-500/50 mb-4 shadow-sm"
                                >
                                    {decision.text}
                                </button>
                                <div className="flex-grow">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                                        {/* Pros Column */}
                                        <div>
                                            <h4 className="flex items-center text-lg font-semibold text-green-600 mb-2">
                                                <CheckCircleIcon className="w-6 h-6 mr-2 flex-shrink-0" />
                                                Pros
                                            </h4>
                                            <ul className="space-y-1.5 pl-2">
                                                {pros.map((pro, i) => (
                                                    <li key={`pro-${i}`} className="text-sm text-slate-700 flex items-start">
                                                        <span className="text-green-500 mr-2 mt-1">&#10003;</span>
                                                        <span>{pro}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>

                                        {/* Cons Column */}
                                        <div>
                                            <h4 className="flex items-center text-lg font-semibold text-red-600 mb-2">
                                                <XCircleIcon className="w-6 h-6 mr-2 flex-shrink-0" />
                                                Contres
                                            </h4>
                                            <ul className="space-y-1.5 pl-2">
                                                {cons.map((con, i) => (
                                                    <li key={`con-${i}`} className="text-sm text-slate-700 flex items-start">
                                                        <span className="text-red-500 mr-2 mt-1">&#10007;</span>
                                                        <span>{con}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>

                                    {/* Conclusion */}
                                    {conclusion && (
                                        <div className="mt-4 pt-4 border-t border-slate-200">
                                            <h4 className="flex items-center text-md font-semibold text-teal-600 mb-2">
                                                <InfoIcon className="w-5 h-5 mr-2 flex-shrink-0" />
                                                Conclusió Estratègica
                                            </h4>
                                            <p className="text-sm text-slate-500 italic">{conclusion}</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default EventScreen;
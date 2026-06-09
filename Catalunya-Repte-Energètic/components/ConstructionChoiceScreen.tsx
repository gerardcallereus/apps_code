import React from 'react';
import { PowerPlantConfig, EnergySource, GameState } from '../types';
import { PLANT_CONSTRUCTION_PROS_CONS, AGENT_CONFIG } from '../constants';
import { PLANT_ICONS } from './Icons';

interface ConstructionChoiceScreenProps {
    plantType: EnergySource;
    options: PowerPlantConfig[];
    onSelect: (config: PowerPlantConfig) => void;
    onCancel: () => void;
    gameState: GameState;
}

const ConstructionChoiceScreen: React.FC<ConstructionChoiceScreenProps> = ({ plantType, options, onSelect, onCancel, gameState }) => {
    const prosCons = PLANT_CONSTRUCTION_PROS_CONS[plantType];

    const getModifiedCost = (config: PowerPlantConfig): number => {
        const costModifier = gameState.costModifiers.find(m => m.source === plantType);
        return costModifier ? config.cost * costModifier.multiplier : config.cost;
    };

    return (
        <div className="fixed inset-0 bg-slate-900 bg-opacity-75 flex items-start sm:items-center justify-center overflow-y-auto p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-5xl border border-teal-300 flex flex-col">
                <div className="p-6 text-center">
                    <div className="flex items-center justify-center text-3xl font-bold text-slate-800 tracking-wider">
                        {PLANT_ICONS[plantType]}
                        <h1 className="ml-4">Triar Escala del Projecte {plantType}</h1>
                    </div>
                    <p className="text-teal-600 mt-2 text-lg">En mode Difícil, cada construcció és una decisió estratègica.</p>
                </div>

                <div className="px-6 pb-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                    {options.map((option, index) => {
                        const finalCost = getModifiedCost(option);
                        const canAfford = gameState.budget >= finalCost;
                        const approvalModifiers = Object.entries(option.approvalModifier).filter(([, val]) => val !== 0 && val !== undefined);


                        return (
                            <div key={index} className={`bg-slate-50 p-4 rounded-lg flex flex-col h-full border-2 transition-all ${canAfford ? 'border-slate-200 hover:border-teal-500' : 'border-red-300/50 opacity-70'}`}>
                                <h3 className="text-xl font-bold text-center text-yellow-600 mb-3">{option.name}</h3>
                                <div className="space-y-2 text-sm flex-grow text-slate-600">
                                    <div className="flex justify-between"><span>Capacitat:</span> <span className="font-mono font-bold text-slate-800">{option.capacity.toLocaleString()} MW</span></div>
                                    <div className="flex justify-between"><span>Cost:</span> <span className={`font-mono font-bold ${canAfford ? 'text-slate-800' : 'text-red-500'}`}>{finalCost.toLocaleString()} M€</span></div>
                                    <div className="flex justify-between"><span>Temps Construcció:</span> <span className="font-mono font-bold text-slate-800">{option.buildTime} trimestres</span></div>
                                    <div className="flex justify-between"><span>Manteniment:</span> <span className="font-mono font-bold text-slate-800">{option.upkeep.toLocaleString()} M€/trim.</span></div>
                                </div>
                                <div className="mt-4 pt-3 border-t border-slate-200">
                                    <h4 className="text-center text-sm font-semibold text-slate-500 mb-2">Impacte en l'Aprovació</h4>
                                    {approvalModifiers.length > 0 ? (
                                        <div className="grid grid-cols-2 gap-2 text-xs">
                                            {approvalModifiers.map(([agent, value]) => {
                                                const agentConfig = AGENT_CONFIG[agent as keyof typeof AGENT_CONFIG];
                                                return (
                                                    <div key={agent} className="flex items-center justify-between bg-white p-1.5 rounded border border-slate-200">
                                                        <div className="flex items-center gap-1.5 text-slate-600">
                                                           <div className={`w-4 h-4 ${agentConfig.color}`}>{agentConfig.icon}</div>
                                                           <span>{agentConfig.label}</span>
                                                        </div>
                                                        <span className={`font-mono font-bold ${(value as number) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                                            {(value as number) > 0 ? '+' : ''}{value}%
                                                        </span>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    ) : (
                                        <p className="text-center text-xs text-slate-400 italic">Cap canvi significatiu</p>
                                    )}
                                </div>
                                <button
                                    onClick={() => onSelect(option)}
                                    disabled={!canAfford}
                                    className={`w-full font-semibold py-2 px-4 rounded-lg transition mt-4 ${
                                        canAfford 
                                        ? 'bg-teal-600 hover:bg-teal-700 text-white' 
                                        : 'bg-slate-300 cursor-not-allowed text-slate-500'
                                    }`}
                                >
                                    {canAfford ? 'Seleccionar Projecte' : 'Fons Insuficients'}
                                </button>
                            </div>
                        );
                    })}
                </div>

                <div className="px-6 pb-6 bg-slate-100">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm p-4 text-slate-600">
                        <div>
                            <h4 className="font-bold text-green-600 mb-1">Pros de {plantType}</h4>
                            <ul className="list-disc pl-5 space-y-1">
                                {prosCons.pros.map((pro, i) => <li key={i}>{pro}</li>)}
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-bold text-red-600 mb-1">Contres de {plantType}</h4>
                            <ul className="list-disc pl-5 space-y-1">
                                {prosCons.cons.map((con, i) => <li key={i}>{con}</li>)}
                            </ul>
                        </div>
                    </div>
                </div>

                <div className="p-4 mt-auto bg-slate-50/50 rounded-b-lg text-center">
                    <button
                        onClick={onCancel}
                        className="bg-slate-200 hover:bg-slate-300 text-slate-800 font-semibold py-2 px-6 rounded-lg transition duration-300"
                    >
                        Tornar a la Gestió Energètica
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConstructionChoiceScreen;
import React from 'react';
import { GameState, PowerPlant, EnergySource, DifficultyLevel } from '../types';
import { POWER_PLANT_CONFIG, CAPACITY_FACTORS, DISPATCHABLE_PLANTS } from '../constants';
import { PLANT_ICONS, LightbulbIcon } from './Icons';

interface PowerPlantOverviewProps {
    powerPlants: PowerPlant[];
    turn: number;
    gameState: GameState;
    onBuildPlant: (plantType: EnergySource) => void;
    onTogglePlant: (plantId: number) => void;
    onSetPlantOutput: (plantId: number, percentage: number) => void;
    seasonalProductionMultipliers: Record<EnergySource, number>;
    onCancelConstruction: (plantId: number) => void;
    difficulty: DifficultyLevel;
}

const PowerPlantOverview: React.FC<PowerPlantOverviewProps> = ({ powerPlants, turn, gameState, onBuildPlant, onTogglePlant, onSetPlantOutput, seasonalProductionMultipliers, onCancelConstruction, difficulty }) => {
    
    const renderResourceInfo = (type: EnergySource) => {
        let resourceText: string | null = null;
        let textColor = 'text-slate-500';

        switch (type) {
            case EnergySource.Hydro:
                const hydroLevel = gameState.hydroModifier;
                if (hydroLevel <= 0.2) resourceText = "Hídrics: Crítics";
                else if (hydroLevel < 1.0) resourceText = "Hídrics: Baixos";
                else if (hydroLevel > 1.15) resourceText = "Hídrics: Alts";
                else resourceText = "Hídrics: Normals";
                textColor = 'text-cyan-600';
                break;
            case EnergySource.Solar:
            case EnergySource.Termosolar:
                const solarMultiplier = seasonalProductionMultipliers[type];
                if (solarMultiplier >= 1.5) resourceText = "Insolació: Màxima";
                else if (solarMultiplier < 0.7) resourceText = "Insolació: Baixa";
                else if (solarMultiplier > 1.0) resourceText = "Insolació: Bona";
                else resourceText = "Insolació: Moderada";
                textColor = 'text-yellow-600';
                break;
            case EnergySource.Wind:
            case EnergySource.EolicaMarina:
                const windMultiplier = seasonalProductionMultipliers[type];
                if (windMultiplier >= 1.2) resourceText = "Vent: Molt Fort";
                else if (windMultiplier > 1.0) resourceText = "Vent: Fort";
                else if (windMultiplier < 1.0) resourceText = "Vent: Fluix";
                else resourceText = "Vent: Moderat";
                textColor = 'text-sky-600';
                break;
        }

        if (!resourceText) return null;

        return (
            <span className={`text-xs font-semibold ml-2 ${textColor}`}>
                ({resourceText})
            </span>
        );
    };

    const renderPlantControls = (plant: PowerPlant) => {
        if (plant.isDecommissioned) {
             return (
                <div className="text-xs text-center flex-shrink-0 font-semibold text-slate-500 bg-slate-200 px-2 py-1 rounded-full w-28">
                    Clausurada
                </div>
            );
        }

        if (plant.operationalTurn > turn) {
             const isCancellable = plant.constructionStartTurn === turn;
            return (
                <div className={`flex flex-col items-center ${isCancellable ? 'gap-1' : ''}`}>
                    <div className="text-xs text-center flex-shrink-0 font-semibold text-yellow-800 bg-yellow-100 px-2 py-1 rounded-full w-28">
                        Llest en {plant.operationalTurn - turn} trim.
                    </div>
                    {isCancellable && (
                        <button 
                            onClick={() => onCancelConstruction(plant.id)}
                            className="text-xs bg-red-600 hover:bg-red-700 text-white font-semibold px-2 py-1 rounded-full w-28 transition-colors"
                        >
                            Cancel·lar
                        </button>
                    )}
                </div>
            );
        }

        if (plant.isForcedOffline) {
            return (
                 <div className="text-xs text-center flex-shrink-0 font-semibold text-red-800 bg-red-100 px-2 py-1 rounded-full w-28">
                    Fora de Servei
                </div>
            )
        }
        
        if (plant.type === EnergySource.Fossil || plant.type === EnergySource.Biofuel) {
            return (
                <div className="flex items-center space-x-2">
                    <button
                        onClick={() => onTogglePlant(plant.id)}
                        className={`w-16 text-xs flex-shrink-0 font-semibold px-2 py-1 rounded-full transition-colors duration-200 ${
                            plant.isActive 
                            ? 'bg-green-500 hover:bg-green-600 text-white' 
                            : 'bg-slate-400 hover:bg-slate-500 text-white'
                        }`}
                    >
                        {plant.isActive ? 'Activa' : 'Inactiva'}
                    </button>
                    <div className="flex items-center">
                        <input
                            type="range"
                            min="30"
                            max="100"
                            step="1"
                            value={plant.outputPercentage * 100}
                            onChange={(e) => onSetPlantOutput(plant.id, parseInt(e.target.value) / 100)}
                            disabled={!plant.isActive}
                            className="w-16 h-1 bg-slate-300 rounded-lg appearance-none cursor-pointer disabled:opacity-50"
                        />
                        <span className="text-xs font-mono w-8 text-right text-slate-700">{plant.isActive ? `${Math.round(plant.outputPercentage * 100)}%` : '---'}</span>
                    </div>
                </div>
            )
        }

        if (DISPATCHABLE_PLANTS.includes(plant.type)) {
            return (
                <button 
                    onClick={() => onTogglePlant(plant.id)}
                    className={`text-xs flex-shrink-0 font-semibold px-3 py-1 rounded-full transition-colors duration-200 w-28 ${
                        plant.isActive 
                        ? 'bg-green-500 hover:bg-green-600 text-white' 
                        : 'bg-slate-400 hover:bg-slate-500 text-white'
                    }`}
                >
                    {plant.isActive ? 'Activa' : 'Inactiva'}
                </button>
            );
        }

        return (
             <div className="text-xs text-center flex-shrink-0 font-semibold text-green-800 bg-green-100 px-2 py-1 rounded-full w-28">
                Operativa
            </div>
        );
    };
    
    
    const plantsByType = powerPlants.reduce((acc, plant) => {
        if (!acc[plant.type]) {
            acc[plant.type] = [];
        }
        acc[plant.type].push(plant);
        return acc;
    }, {} as Record<EnergySource, PowerPlant[]>);

    const orderedSources = [
        EnergySource.Nuclear,
        EnergySource.Fossil,
        EnergySource.Hydro,
        EnergySource.Wind,
        EnergySource.EolicaMarina,
        EnergySource.Solar,
        EnergySource.Termosolar,
        EnergySource.Biofuel
    ];

    const visibleSources = orderedSources.filter(source => {
        if (difficulty === DifficultyLevel.Easy && (source === EnergySource.EolicaMarina || source === EnergySource.Termosolar)) {
            return false;
        }
        return true;
    });

    return (
        <div className="space-y-6">
            <div className="text-center mb-4">
                 <h2 className="text-xl font-bold text-teal-600">Gestió Energètica</h2>
                 <p className="text-sm text-slate-500 max-w-3xl mx-auto">Construeix noves centrals per cobrir la demanda i gestiona les existents per optimitzar la producció.</p>
            </div>
             <div className="bg-slate-50 p-3 rounded-lg flex items-start gap-3 text-xs text-slate-600 mb-6 border border-slate-200">
                <LightbulbIcon className="w-6 h-6 text-yellow-500 mr-2 flex-shrink-0 mt-1" />
                <div>
                    <strong className="text-teal-700">Com Gestionar?</strong>
                    <ol className="list-decimal pl-4 space-y-1 mt-1">
                        <li><strong className="text-slate-800">Construir Noves Centrals:</strong> Fes clic al botó "Construir" de qualsevol tipus d'energia per iniciar un nou projecte.</li>
                        <li><strong className="text-slate-800">Activar/Desactivar:</strong> Les centrals gestionables (Nuclear, Hidro, etc.) es poden aturar per estalviar costos de manteniment.</li>
                        <li><strong className="text-slate-800">Regular Potència:</strong> Les centrals de Gas i Biomassa poden ajustar la seva producció. Útil per no generar CO₂ innecessari.</li>
                        <li><strong className="text-slate-800">Cancel·lar Obres:</strong> Si has començat una construcció en aquest mateix trimestre, la pots cancel·lar per recuperar els diners.</li>
                    </ol>
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {visibleSources.map(type => {
                    const plants = plantsByType[type] || [];
                    const config = POWER_PLANT_CONFIG[type][1]; // Standard config for display

                    const costModifier = gameState.costModifiers.find(m => m.source === type);
                    const capacityModifier = gameState.capacityModifiers.find(m => m.source === type && m.duration === 'permanent');
                    const constructionBan = gameState.constructionBans.find(b => b.source === type);

                    const isLocked = constructionBan && constructionBan.duration === 'permanent';
                    const finalCost = costModifier ? config.cost * costModifier.multiplier : config.cost;
                    const isHardMode = difficulty === DifficultyLevel.Hard;

                    const totalActualGeneration = plants
                        .filter(p => p.operationalTurn <= turn && p.isActive && !p.isForcedOffline && !p.isDecommissioned)
                        .reduce((acc, p) => {
                            const basePerformance = CAPACITY_FACTORS[p.type] * seasonalProductionMultipliers[p.type];
                            const plantCapacityModifier = gameState.capacityModifiers.find(m => m.source === p.type);
                            const finalPerformance = plantCapacityModifier ? basePerformance * plantCapacityModifier.multiplier : basePerformance;
                            const actualGeneration = p.capacity * finalPerformance * p.outputPercentage;
                            return acc + actualGeneration;
                        }, 0);

                    const totalCO2Emissions = plants
                        .filter(p => p.operationalTurn <= turn && p.isActive && !p.isForcedOffline && !p.isDecommissioned && (p.type === EnergySource.Fossil || p.type === EnergySource.Biofuel))
                        .reduce((acc, p) => {
                             const basePerformance = CAPACITY_FACTORS[p.type] * seasonalProductionMultipliers[p.type];
                             const plantCapacityModifier = gameState.capacityModifiers.find(m => m.source === p.type);
                             const finalPerformance = plantCapacityModifier ? basePerformance * plantCapacityModifier.multiplier : basePerformance;
                             const actualGeneration = p.capacity * finalPerformance * p.outputPercentage;
                             const plantConfig = POWER_PLANT_CONFIG[p.type].find(c => c.name === p.name) || POWER_PLANT_CONFIG[p.type][1];
                             return acc + (plantConfig.co2 * actualGeneration);
                        }, 0);

                    const finalCapacity = capacityModifier ? config.capacity * capacityModifier.multiplier : config.capacity;
                    const estimatedPerformance = (CAPACITY_FACTORS[type] * seasonalProductionMultipliers[type]) * (capacityModifier ? capacityModifier.multiplier : 1);
                    const estimatedProduction = finalCapacity * estimatedPerformance;
                    
                    const isButtonDisabled = isLocked || !!constructionBan || gameState.plantBuiltThisTurn;
                    
                    let buttonContent: React.ReactNode;
                    let buttonClass: string;

                    if (isLocked) {
                        buttonContent = 'Tecnologia Bloquejada';
                        buttonClass = 'bg-slate-300 cursor-not-allowed text-slate-500';
                    } else if (constructionBan) {
                        buttonContent = `Aturat (${typeof constructionBan.duration === 'number' ? `${constructionBan.duration} trim.` : 'permanent'})`;
                        buttonClass = 'bg-yellow-200 cursor-not-allowed text-yellow-800';
                    } else if (gameState.plantBuiltThisTurn) {
                        buttonContent = 'Només una construcció per torn';
                        buttonClass = 'bg-slate-300 cursor-not-allowed text-slate-500';
                    } else if (isHardMode) {
                        buttonContent = 'Construir...';
                        buttonClass = 'bg-indigo-600 hover:bg-indigo-700 text-white';
                    } else {
                        buttonContent = (
                            <div className="text-center">
                                <div>{`Construir (${finalCost.toLocaleString()} M€ - ${config.buildTime} trimestres)`}</div>
                                <div className="text-xs opacity-80 mt-1">
                                    {`Rend. Est. ${Math.round(estimatedPerformance * 100)}% | Prod. Est. ${estimatedProduction.toFixed(0)} MW`}
                                </div>
                            </div>
                        );
                        buttonClass = 'bg-indigo-600 hover:bg-indigo-700 text-white';
                    }

                    return (
                        <div key={type} className={`bg-white p-4 rounded-lg flex flex-col h-full border ${isLocked ? 'border-slate-300' : 'border-slate-200'}`}>
                            <div className="flex-grow">
                                <div className="flex items-center mb-3">
                                    {PLANT_ICONS[type]}
                                    <h3 className="text-lg font-bold text-slate-800 ml-2">{type}</h3>
                                    {renderResourceInfo(type)}
                                </div>
                                <div className="space-y-3 min-h-[6rem] max-h-80 overflow-y-auto pr-2">
                                    {plants.length > 0 ? plants.map(p => {
                                        const basePerformance = CAPACITY_FACTORS[p.type] * seasonalProductionMultipliers[p.type];
                                        const plantCapacityModifier = gameState.capacityModifiers.find(m => m.source === p.type);
                                        const finalPerformance = plantCapacityModifier ? basePerformance * plantCapacityModifier.multiplier : basePerformance;
                                        
                                        const actualGeneration = p.operationalTurn <= turn && p.isActive && !p.isForcedOffline && !p.isDecommissioned
                                            ? p.capacity * finalPerformance * p.outputPercentage
                                            : 0;
                                        
                                        return (
                                            <div key={p.id} className="bg-slate-50 p-2 rounded-md border border-slate-200">
                                                <div className="flex items-center justify-between">
                                                    <span className="font-semibold text-sm text-slate-700">{p.name}</span>
                                                    {renderPlantControls(p)}
                                                </div>
                                                <div className="grid grid-cols-3 gap-1 text-center mt-2 text-xs border-t border-slate-200 pt-2">
                                                    <div>
                                                        <p className="text-slate-500">Pot.</p>
                                                        <p className="font-mono font-bold text-slate-800">{p.capacity.toLocaleString()}<span className="text-slate-500"> MW</span></p>
                                                    </div>
                                                    <div>
                                                        <p className="text-slate-500">Rend.</p>
                                                        <p className="font-mono font-bold text-slate-800">{Math.round(finalPerformance * 100)}<span className="text-slate-500">%</span></p>
                                                    </div>
                                                    <div>
                                                        <p className="text-slate-500">Gen.</p>
                                                        <p className="font-mono font-bold text-slate-800">{actualGeneration.toLocaleString(undefined, {maximumFractionDigits: 0})}<span className="text-slate-500"> MW</span></p>
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    }) : <p className="text-xs text-center text-slate-400 pt-8">No hi ha centrals d'aquest tipus.</p>}
                                </div>
                            </div>
                            <div className="mt-4 pt-4 border-t border-slate-200">
                                <div className="text-xs text-center text-slate-500 space-y-1 mb-3">
                                    {plants.length > 0 ? (
                                        <>
                                            <p>Total Generat: <span className="font-bold text-slate-800">{totalActualGeneration.toLocaleString(undefined, { maximumFractionDigits: 0 })} MW</span></p>
                                            {totalCO2Emissions > 0 && (
                                                <p>Emissions Totals: <span className="font-bold text-slate-800">{totalCO2Emissions.toLocaleString(undefined, { maximumFractionDigits: 0 })} t CO₂</span></p>
                                            )}
                                        </>
                                    ) : (
                                        <p className="italic h-8 flex items-center justify-center">Encara no hi ha centrals d'aquest tipus.</p>
                                    )}
                                </div>

                                <button
                                    onClick={() => onBuildPlant(type)}
                                    disabled={isButtonDisabled}
                                    className={`w-full font-semibold py-2 px-4 rounded-lg transition ${buttonClass}`}
                                >
                                    {buttonContent}
                                </button>
                                {capacityModifier && (
                                    <p className="text-xs text-center text-green-600 mt-2">
                                        Producció millorada (+{((capacityModifier.multiplier - 1) * 100).toFixed(0)}%)
                                    </p>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default PowerPlantOverview;
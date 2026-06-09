import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { GameState, PowerPlant, GameEvent, EnergySource, Decision, GameStatus, Quarter, CostModifier, ConstructionBan, NewsArticle, DifficultyLevel, MajorDecisionRecord, TurnEventFinancial, ApprovalModifier, PolicyId, ActivePolicy, PowerPlantConfig, TurnNotification, ApprovalRatings, ClimateEvent } from './types';
// FIX: CONSTRUCTION_TRIGGERED_EVENTS was missing from constants file, it has been added.
import { INITIAL_GAME_STATE, POWER_PLANT_CONFIG, GAME_EVENTS, QUARTERS, CAPACITY_FACTORS, CO2_WARNING_THRESHOLD, CO2_SANCTION_THRESHOLD, EU_WARNING_EVENT, EU_SANCTION_EVENT, PLANT_CONSTRUCTION_PROS_CONS, NEWS_ITEMS, REACTIVE_NEWS_TEMPLATES, APPROVAL_LOSS_THRESHOLD, CONSTRUCTION_TRIGGERED_EVENTS, CO2_PROTEST_THRESHOLD, CLIMATE_PROTEST_EVENT, AIRPORT_EXPANSION_EVENT, CONDITIONAL_NEWS_TEMPLATES, CO2_REDUCTION_SUCCESS_EVENT, BASE_MARKET_PRICE_PER_MW, ALL_POLICIES, AGENT_CONFIG, REACTIVE_APPROVAL_THRESHOLD, BUSINESS_CRISIS_EVENT, ENVIRONMENTALIST_CRISIS_EVENT, POLITICAL_CRISIS_EVENT, CITIZEN_CRISIS_EVENT, SEASONAL_CLIMATE_EVENTS, DISPATCHABLE_PLANTS, THEME_CONFIGS } from './constants';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import PoliciesOverview from './components/PoliciesOverview';
import PowerPlantOverview from './components/PowerPlantOverview';
import StartScreen from './components/StartScreen';
import { GameSummaryScreen } from './components/GameSummaryScreen';
import { GuideScreen } from './components/GuideScreen';
import EventScreen from './components/EventScreen';
import ConfirmationScreen from './components/ConfirmationScreen';
import ConstructionChoiceScreen from './components/ConstructionChoiceScreen';
import MandateStartScreen from './components/MandateStartScreen';
import MainTabs from './components/MainTabs';
import HistoryAndAnalysis from './components/HistoryAndAnalysis';
import TurnNotificationPanel from './components/TurnNotificationPanel';
import StatsBar from './components/StatsBar';
import { AlertTriangleIcon, CheckCircleIcon, XCircleIcon, InfoIcon, UsersIcon } from './components/Icons';

interface ConfirmationState {
    title: string;
    message?: string;
    pros?: string[];
    cons?: string[];
    importantInfo?: string[];
    onConfirm: () => void;
    confirmText: string;
}

interface LogEntry {
    message: string;
    turn: number;
    id: string;
}

type View = 'startScreen' | 'mandateStart' | 'playing' | 'summary' | 'guideScreen' | 'eventScreen' | 'confirmationScreen' | 'referendumResult' | 'constructionChoiceScreen';
type ActiveGameView = 'dashboard' | 'policies' | 'powerPlants' | 'history';

const getQuarterlyProductionMultipliers = (quarter: Quarter, hydroModifier: number, climateEvent: ClimateEvent | null): Record<EnergySource, number> => {
    const multipliers: Record<EnergySource, number> = {
        [EnergySource.Solar]: 1,
        [EnergySource.Termosolar]: 1,
        [EnergySource.Wind]: 1,
        [EnergySource.EolicaMarina]: 1,
        [EnergySource.Hydro]: 1,
        [EnergySource.Nuclear]: 1,
        [EnergySource.Fossil]: 1,
        [EnergySource.Biofuel]: 1,
    };
    // Base seasonal multipliers
    switch (quarter) {
        case Quarter.Q2: // Estiu
            multipliers[EnergySource.Solar] = 1.5;
            multipliers[EnergySource.Termosolar] = 1.5;
            multipliers[EnergySource.Hydro] = hydroModifier;
            break;
        case Quarter.Q4: // Hivern
            multipliers[EnergySource.Solar] = 0.6;
            multipliers[EnergySource.Termosolar] = 0.7;
            multipliers[EnergySource.Wind] = 1.2;
            break;
        case Quarter.Q1: // Primavera
            multipliers[EnergySource.Hydro] = 1.2 * hydroModifier;
            multipliers[EnergySource.Wind] = 1.1;
            break;
        case Quarter.Q3: // Tardor
            multipliers[EnergySource.Hydro] = 1.1 * hydroModifier;
            break;
    }
    
    // Apply climate event modifiers on top
    if (climateEvent) {
        multipliers[EnergySource.Solar] *= (1 + climateEvent.modifiers.solar);
        multipliers[EnergySource.Termosolar] *= (1 + climateEvent.modifiers.solar);
        multipliers[EnergySource.Wind] *= (1 + climateEvent.modifiers.wind);
        multipliers[EnergySource.EolicaMarina] *= (1 + climateEvent.modifiers.wind);
        multipliers[EnergySource.Hydro] *= (1 + climateEvent.modifiers.hydro);
    }

    return multipliers;
};

// Referendum Result Screen Component
const ReferendumResultScreen: React.FC<{ result: { decision: Decision }, onContinue: () => void, gameState: GameState }> = ({ result, onContinue, gameState }) => {
    const { decision } = result;

    const parseExplanation = (text: string) => {
        const prosMatch = text.match(/\*\*Pros:\*\*\s*([\s\S]*?)(?=\n\*\*Contres:\*\*|\n\*\*Conclusió:\*\*|$)/);
        const consMatch = text.match(/\*\*Contres:\*\*\s*([\s\S]*?)(?=\n\*\*Conclusió:\*\*|$)/);
        const conclusionMatch = text.match(/\*\*Conclusió:\*\*\s*([\s\S]*)/);

        const pros = prosMatch ? prosMatch[1].trim().split('\n').filter(line => line.trim() !== '') : [];
        const cons = consMatch ? consMatch[1].trim().split('\n').filter(line => line.trim() !== '') : [];
        const conclusion = conclusionMatch ? conclusionMatch[1].trim() : '';

        return { pros, cons, conclusion };
    };
    
    const { pros, cons, conclusion } = parseExplanation(decision.explanation(gameState, gameState.difficulty));

    return (
        <div className="min-h-screen overflow-y-auto p-4 sm:p-6 lg:p-8 flex items-center justify-center">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl border border-teal-300 my-8 mx-auto flex flex-col">
                <div className="p-6 text-center">
                    <UsersIcon className="h-16 w-16 text-teal-500 mx-auto mb-4" />
                    <h1 className="text-3xl font-bold text-slate-900 tracking-wider">El Poble ha Parlat!</h1>
                    <p className="text-teal-600 mt-2 text-lg">El resultat del referèndum és vinculant.</p>
                </div>
                <div className="bg-slate-100 p-6 rounded-lg m-6 text-center border border-slate-200">
                    <p className="text-slate-500 mb-2">La decisió escollida per la ciutadania és:</p>
                    <h2 className="text-xl font-bold text-yellow-600">"{decision.text}"</h2>
                </div>
                
                <div className="overflow-y-auto px-6 pb-6 space-y-4 max-h-64">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                        <div>
                            <h4 className="flex items-center text-lg font-semibold text-green-600 mb-2">
                                <CheckCircleIcon className="w-6 h-6 mr-2 flex-shrink-0" /> Pros
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
                        <div>
                            <h4 className="flex items-center text-lg font-semibold text-red-600 mb-2">
                                <XCircleIcon className="w-6 h-6 mr-2 flex-shrink-0" /> Contres
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
                     {conclusion && (
                        <div className="mt-4 pt-4 border-t border-slate-200">
                            <h4 className="flex items-center text-md font-semibold text-teal-600 mb-2">
                                <InfoIcon className="w-5 h-5 mr-2 flex-shrink-0" /> Conclusió Estratègica
                            </h4>
                            <p className="text-sm text-slate-500 italic">{conclusion}</p>
                        </div>
                    )}
                </div>

                <div className="p-6 mt-auto bg-slate-50 rounded-b-lg text-center">
                    <button
                        onClick={onContinue}
                        className="bg-teal-600 hover:bg-teal-700 text-white font-bold py-3 px-8 rounded-lg transition duration-300 shadow-md transform hover:scale-105"
                    >
                        Acceptar Decisió i Continuar
                    </button>
                </div>
            </div>
        </div>
    );
};

const calculateOverallApproval = (ratings: ApprovalRatings): number => {
    return (ratings.citizen + ratings.business + ratings.political + ratings.environmentalist) / 4;
};

const isEventAvailable = (event: GameEvent, gs: GameState, currentTurn: number): boolean => {
    if (event.allowedQuarters && !event.allowedQuarters.includes(QUARTERS[currentTurn % 4])) return false;
    if (event.minTurn && currentTurn < event.minTurn) return false;
    if (event.allowedDifficulties && !event.allowedDifficulties.includes(gs.difficulty)) return false;
    
    if (event.title === "Projecte Pilot d'Eòlica Marina Flotant") {
        const isPolicyBlocking = gs.policies.some(p => p.policyId === 'offshore_wind_unlock' && (p.status === 'active' || p.status === 'enacting'));
        if (isPolicyBlocking) return false;
    }
    if (event.title === "Avenç en l'Emmagatzematge Tèrmic Solar") {
        const isPolicyBlocking = gs.policies.some(p => p.policyId === 'solar_thermal_unlock' && (p.status === 'active' || p.status === 'enacting'));
        if (isPolicyBlocking) return false;
    }
    if (event.title === "Acord Europeu de Desnuclearització") {
        const asco1 = gs.powerPlants.find(p => p.id === 1);
        if (!asco1 || asco1.isDecommissioned) return false;
    }
    if (event.title === "Revisió de Seguretat a una Nuclear") {
        const vandellos = gs.powerPlants.find(p => p.id === 3);
        if (!vandellos || vandellos.isDecommissioned) return false;
    }
    if (event.title === "El Cementiri de Residus Nuclears està Ple") {
        const hasActiveNuclear = gs.powerPlants.some(p => p.type === EnergySource.Nuclear && !p.isDecommissioned);
        if (!hasActiveNuclear) return false;
    }
    if (event.title === "Acord d'Importació de Residus per a Biomassa") {
        const hasBiomassPlant = gs.powerPlants.some(p => p.type === EnergySource.Biofuel && !p.isDecommissioned);
        if (!hasBiomassPlant) return false;
    }
    if (event.title === "Oportunitat d'Inversió en Bateries" && gs.hasInvestedInBatteries) {
        return false;
    }
    if (event.title === "Oportunitat de Projecte d'Hidrogen Verd" && gs.hasInvestedInHydrogen) {
        return false;
    }
    if (event.title === "Temporal Marítim Devastador") {
        const hasWind = gs.powerPlants.some(p => (p.type === EnergySource.Wind || p.type === EnergySource.EolicaMarina) && !p.isDecommissioned);
        if (!hasWind) return false;
    }
     if (event.title === "Pujada del Preu del Gas Natural") {
        const hasFossil = gs.powerPlants.some(p => p.type === EnergySource.Fossil && !p.isDecommissioned);
        if (!hasFossil) return false;
    }
    if (event.title === "Incendi Forestal Gegant") {
        const hasBiomass = gs.powerPlants.some(p => p.type === EnergySource.Biofuel && !p.isDecommissioned);
        if (!hasBiomass) return false;
    }
    if (event.title === "Oportunitat: Millora Tecnològica en Plaques Solars") {
        const hasSolar = gs.powerPlants.some(p => p.type === EnergySource.Solar && !p.isDecommissioned);
        if (!hasSolar) return false;
    }
    if (event.title === "Subvenció per a la Bioeconomia") {
        const hasBiomass = gs.powerPlants.some(p => p.type === EnergySource.Biofuel && !p.isDecommissioned);
        if (!hasBiomass) return false;
    }

    return true;
};


// FIX: Removed explicit React.FC type to fix a typing error and allow for better type inference.
const App = () => {
    const [view, setView] = useState<View>('startScreen');
    const [viewBeforeGuide, setViewBeforeGuide] = useState<View>('startScreen');
    const [activeGameView, setActiveGameView] = useState<ActiveGameView>('dashboard');
    const [gameState, setGameState] = useState<GameState>(INITIAL_GAME_STATE);
    const [turn, setTurn] = useState(0);
    const [activeEvent, setActiveEvent] = useState<GameEvent | null>(null);
    const [scheduledEvent, setScheduledEvent] = useState<GameEvent | null>(null);
    const [log, setLog] = useState<LogEntry[]>([{ message: 'Benvingut/da a Catalunya: Repte Energètic.', turn: -1, id: `log-${Date.now()}` }]);
    const [confirmation, setConfirmation] = useState<ConfirmationState | null>(null);
    const [constructionChoice, setConstructionChoice] = useState<{ type: EnergySource; options: PowerPlantConfig[] } | null>(null);
    const [isAdvancingTurn, setIsAdvancingTurn] = useState(false);
    const [gameHistory, setGameHistory] = useState<GameState[]>([]);
    const [finalScore, setFinalScore] = useState(0);
    const [themeDifficulty, setThemeDifficulty] = useState<DifficultyLevel>(DifficultyLevel.Medium);
    const [referendumResult, setReferendumResult] = useState<{ event: GameEvent; decision: Decision } | null>(null);
    const [shouldAdvanceAfterUpdate, setShouldAdvanceAfterUpdate] = useState(false);
    const [turnNotifications, setTurnNotifications] = useState<TurnNotification[]>([]);
    
    const hasTriggeredEventForTurn = useRef(false);

    const handleShowGuide = () => {
        setViewBeforeGuide(view);
        setView('guideScreen');
    };
    
    const effectiveTurn = turn + gameState.startQuarterIndex;
    const currentYear = gameState.startYear + Math.floor(effectiveTurn / 4);
    const currentQuarter = QUARTERS[effectiveTurn % 4];
    const gameStatus = gameState.gameStatus;
    const theme = THEME_CONFIGS[themeDifficulty];
    
    const quarterlyProductionMultipliers = useMemo(() => 
        getQuarterlyProductionMultipliers(currentQuarter, gameState.hydroModifier, gameState.currentClimateEvent),
        [currentQuarter, gameState.hydroModifier, gameState.currentClimateEvent]
    );

    const addLog = useCallback((message: string) => {
        const effectiveTurnForLog = turn + gameState.startQuarterIndex;
        const yearForLog = gameState.startYear + Math.floor(effectiveTurnForLog / 4);
        const quarterForLog = QUARTERS[effectiveTurnForLog % 4];
        const fullMessage = `[${quarterForLog} de ${yearForLog}] ${message}`;
        setLog(prevLog => [{ message: fullMessage, turn: turn, id: `log-${Date.now()}-${Math.random()}` }, ...prevLog].slice(0, 15));
    }, [turn, gameState.startYear, gameState.startQuarterIndex]);
    
    const recalculateTotals = useCallback((currentState: GameState, currentTurn: number): Partial<GameState> => {
        const operationalPlants = currentState.powerPlants.filter(p => p.operationalTurn <= currentTurn && p.isActive && !p.isForcedOffline && !p.isDecommissioned);
        
        const currentMultipliers = getQuarterlyProductionMultipliers(QUARTERS[(currentTurn + currentState.startQuarterIndex) % 4], currentState.hydroModifier, currentState.currentClimateEvent);

        const production = operationalPlants.reduce((acc, plant) => {
             let baseProduction = plant.capacity * CAPACITY_FACTORS[plant.type] * plant.outputPercentage;
             
             const capacityModifier = currentState.capacityModifiers.find(m => m.source === plant.type);
             if (capacityModifier) {
                baseProduction *= capacityModifier.multiplier;
             }

             baseProduction *= currentMultipliers[plant.type];
             return acc + baseProduction;
        }, 0);

        const co2 = operationalPlants.reduce((acc, plant) => {
             if (plant.type === EnergySource.Fossil || plant.type === EnergySource.Biofuel) {
                 const plantProduction = plant.capacity * CAPACITY_FACTORS[plant.type] * plant.outputPercentage;
                 // Need a default config for CO2 calculation
                 const config = POWER_PLANT_CONFIG[plant.type][1];
                 return acc + (config.co2 * plantProduction);
             }
             return acc;
        }, 0);
        
        const demand = currentState.totalDemand;
        const deficit = Math.max(0, demand - production);

        return {
            totalProduction: production,
            co2Emissions: co2,
            energyDeficit: deficit
        };

    }, []);

    const calculateFinalScore = useCallback((initialState: GameState, finalState: GameState, history: GameState[], status: GameStatus): number => {
        if (status === GameStatus.Lost) {
            const budgetScore = Math.max(0, finalState.budget / initialState.budget) * 4;
            const approvalScore = (finalState.overallApproval / 100) * 6;
            let score = (budgetScore + approvalScore) / 2.5;
            return parseFloat(Math.min(4.0, score).toFixed(1));
        }

        let score = 0;

        // 1. Energy Sovereignty (up to 2 points)
        const turnsWithDeficit = history.filter(h => h.energyDeficit > 0).length;
        const sovereigntyScore = Math.max(0, 2.0 - (turnsWithDeficit * 0.5));
        score += sovereigntyScore;

        // 2. Renewable Energy Expansion (up to 2 points)
        const initialRenewableMW = initialState.powerPlants
            .filter(p => ![EnergySource.Fossil, EnergySource.Nuclear].includes(p.type))
            .reduce((acc, p) => acc + p.capacity, 0);
        const finalRenewableMW = finalState.powerPlants
            .filter(p => ![EnergySource.Fossil, EnergySource.Nuclear].includes(p.type))
            .reduce((acc, p) => acc + p.capacity, 0);
        const newRenewableMW = finalRenewableMW - initialRenewableMW;
        const renewableScore = Math.min(2.0, (newRenewableMW / 3000) * 2.0); // 3000 MW is a strong goal
        score += renewableScore;

        // 3. Budget Management (up to 2 points)
        if (finalState.budget > initialState.budget) {
            score += 2.0;
        } else if (finalState.budget > 0) {
            score += (finalState.budget / initialState.budget) * 2.0;
        }

        // 4. Public Approval (up to 2 points)
        const approvalScore = (finalState.overallApproval / 100) * 2.0;
        score += approvalScore;

        // 5. CO2 Reduction (up to 1 point)
        const co2ReductionRatio = (initialState.co2Emissions - finalState.co2Emissions) / initialState.co2Emissions;
        if (co2ReductionRatio > 0) {
            score += Math.min(1.0, co2ReductionRatio * 2); // 50% reduction = 1 point
        }

        // 6. Legislative Success (up to 1 point)
        const approvedPolicies = finalState.policies.filter(p => p.status === 'active');
        const policyScore = approvedPolicies.reduce((acc, p) => {
            const policyInfo = ALL_POLICIES.find(pol => pol.id === p.policyId);
            return acc + (policyInfo?.scoreImpact || 0);
        }, 0);
        score += Math.min(1.0, policyScore * 0.5);

        return parseFloat(Math.min(10.0, score).toFixed(1));
    }, []);

    const selectRandomClimateEvent = (quarter: Quarter): ClimateEvent => {
        const possibleEvents = SEASONAL_CLIMATE_EVENTS[quarter];
        return possibleEvents[Math.floor(Math.random() * possibleEvents.length)];
    };

    const advanceTurn = useCallback(() => {
        setIsAdvancingTurn(true);
        const nextTurn = turn + 1;
        
        let turnEndState = { ...gameState };

        // Apply FINANCIAL events from the completed turn
        const financialSummary = turnEndState.currentTurnFinancialEvents.reduce((acc, ev) => acc + ev.amount, 0);
        if (financialSummary !== 0) {
            addLog(`Balanç financer del trimestre: ${financialSummary > 0 ? '+' : ''}${financialSummary.toLocaleString()} M€ aplicats al pressupost.`);
        }
        turnEndState.budget += financialSummary;

        // Apply APPROVAL events from the completed turn
        const approvalChanges: Partial<ApprovalRatings> = {};
        turnEndState.currentTurnApprovalModifiers.forEach(mod => {
            for (const key in mod.changes) {
                const agent = key as keyof ApprovalRatings;
                approvalChanges[agent] = (approvalChanges[agent] || 0) + (mod.changes[agent] || 0);
            }
        });
        
        let approvalLog = "Canvis d'aprovació: ";
        const approvalLogParts: string[] = [];
        const newApprovalRatings = { ...turnEndState.approvalRatings };
        (Object.keys(approvalChanges) as (keyof ApprovalRatings)[]).forEach(agent => {
            newApprovalRatings[agent] = Math.max(0, Math.min(100, newApprovalRatings[agent] + (approvalChanges[agent] || 0)));
            approvalLogParts.push(`${AGENT_CONFIG[agent].label}: ${(approvalChanges[agent] || 0).toFixed(1)}%`);
        });
        if(approvalLogParts.length > 0) addLog(approvalLog + approvalLogParts.join(', '));
        
        turnEndState.approvalRatings = newApprovalRatings;
        turnEndState.overallApproval = calculateOverallApproval(newApprovalRatings);


        // Upkeep, Costs, and Revenue for the completed turn
        let upkeepCost = turnEndState.powerPlants
            .filter(p => p.operationalTurn <= turn)
            .reduce((acc, p) => acc + p.upkeep, 0);
        
        turnEndState.upkeepModifiers.forEach(mod => {
            upkeepCost *= mod.multiplier;
        });

        const deficitCost = turnEndState.energyDeficit > 0 ? turnEndState.energyDeficit * turnEndState.marketPricePerMW * turnEndState.importEnergyPriceMultiplier : 0;
        let newBudget = turnEndState.budget - upkeepCost - deficitCost - turnEndState.recurrentUpkeep;
        addLog(`Costos de trimestre: ${upkeepCost.toLocaleString(undefined, { maximumFractionDigits: 0 })} M€ (manteniment) + ${deficitCost.toLocaleString(undefined, { maximumFractionDigits: 0 })} M€ (dèficit) + ${turnEndState.recurrentUpkeep.toLocaleString()} M€ (recurrents).`);

        const surplus = turnEndState.totalProduction - turnEndState.totalDemand;
        const surplusRevenue = surplus > 0 && turnEndState.energyDeficit === 0 ? surplus * turnEndState.marketPricePerMW * turnEndState.surplusSalePriceMultiplier : 0;
        newBudget += turnEndState.taxRevenuePerTurn;
        if (surplusRevenue > 0) {
            newBudget += surplusRevenue;
            addLog(`Ingressos: ${turnEndState.taxRevenuePerTurn.toLocaleString()} M€ (impostos) + ${surplusRevenue.toLocaleString(undefined, { maximumFractionDigits: 0 })} M€ (venda d'excedent).`);
        } else {
            addLog(`Ingressos: ${turnEndState.taxRevenuePerTurn.toLocaleString()} M€ (impostos).`);
        }
        turnEndState.budget = newBudget;

        // === STAGE 2: Prepare state for the start of `nextTurn` ===
        let nextTurnState = { ...turnEndState };
        const newTurnNotifications: TurnNotification[] = [];

        const nextEffectiveTurn = nextTurn + gameState.startQuarterIndex;
        const newClimateEvent = selectRandomClimateEvent(QUARTERS[nextEffectiveTurn % 4]);
        nextTurnState.currentClimateEvent = newClimateEvent;
        addLog(`Condició climàtica: ${newClimateEvent.description}.`);

        // Reset turn-specific flags and prepare new modifier arrays
        nextTurnState.plantBuiltThisTurn = false;
        nextTurnState.currentTurnFinancialEvents = [];
        let nextTurnApprovalModifiers: ApprovalModifier[] = [];

        // Update durations of modifiers, bans, etc.
        nextTurnState.costModifiers = nextTurnState.costModifiers.map(m => m.duration !== 'permanent' ? { ...m, duration: m.duration - 1 } : m).filter(m => m.duration !== 0);
        nextTurnState.upkeepModifiers = nextTurnState.upkeepModifiers.map(m => m.duration !== 'permanent' ? { ...m, duration: m.duration - 1 } : m).filter(m => m.duration !== 0);
        nextTurnState.capacityModifiers = nextTurnState.capacityModifiers.map(m => m.duration !== 'permanent' ? { ...m, duration: m.duration - 1 } : m).filter(m => m.duration !== 0);
        nextTurnState.constructionBans = nextTurnState.constructionBans.map(b => b.duration !== 'permanent' ? { ...b, duration: b.duration - 1 } : b).filter(b => b.duration !== 0);
        nextTurnState.constructionDemandModifiers = nextTurnState.constructionDemandModifiers.map(d => ({ ...d, duration: d.duration - 1 })).filter(d => d.duration > 0);
        if (nextTurnState.temporaryDemandModifier) {
            const newDuration = nextTurnState.temporaryDemandModifier.duration - 1;
            if (newDuration <= 0) {
                nextTurnState.temporaryDemandModifier = null;
            } else {
                nextTurnState.temporaryDemandModifier.duration = newDuration;
            }
        }

        // Update Plants for the new turn
        nextTurnState.powerPlants = nextTurnState.powerPlants.map(p => {
            let updatedPlant = { ...p };
            if (p.isForcedOffline) {
                addLog(`La central ${p.name} ha estat reparada i torna a estar operativa.`);
                updatedPlant.isForcedOffline = false;
            }
            if (p.operationalTurn === nextTurn) {
                addLog(`CONSTRUCCIÓ FINALITZADA: La nova central ${p.name} (${p.type}) ja està operativa!`);
                newTurnNotifications.push({
                    id: `notif-plant-${p.id}-${nextTurn}`,
                    type: 'info',
                    message: `Construcció finalitzada: La nova central "${p.name}" ja està operativa.`
                });
            }
            return updatedPlant;
        });
        
        // Resolve Policies for `nextTurn`
        const resolvingPolicies = nextTurnState.policies.filter(p => p.status === 'enacting' && p.turnWillResolve === nextTurn);
        if (resolvingPolicies.length > 0) {
            resolvingPolicies.forEach(p => {
                const policyInfo = ALL_POLICIES.find(pol => pol.id === p.policyId);
                if (policyInfo) {
                    const successChance = Math.min(95, Math.max(10, policyInfo.baseSuccessChance + (nextTurnState.overallApproval - 55) * 0.5));
                    const isSuccess = Math.random() * 100 < successChance;

                    if (isSuccess) {
                        const preEffectState = { ...nextTurnState };
                        const effects = policyInfo.effect(preEffectState);
                        const { approvalRatings: newApproval, ...otherEffects } = effects;

                        nextTurnState = { ...nextTurnState, ...otherEffects };
                        
                        if (newApproval) {
                            const clampedRatings: ApprovalRatings = { ...newApproval };
                            (Object.keys(clampedRatings) as (keyof ApprovalRatings)[]).forEach(agent => {
                                clampedRatings[agent] = Math.max(0, Math.min(100, clampedRatings[agent]));
                            });
                            nextTurnState.approvalRatings = clampedRatings;
                            nextTurnState.overallApproval = calculateOverallApproval(clampedRatings);
                        }
                        
                        addLog(`ÈXIT PARLAMENTARI: La llei "${policyInfo.title}" ha estat APROVADA gràcies al consens polític.`);
                        newTurnNotifications.push({
                            id: `notif-policy-success-${p.policyId}-${nextTurn}`,
                            type: 'success',
                            message: `Llei APROVADA: "${policyInfo.title}" s'ha aprovat amb un ${successChance.toFixed(0)}% de suport.`
                        });
                        p.status = 'active';
                    } else {
                        addLog(`FRACÀS PARLAMENTARI: La llei "${policyInfo.title}" ha estat REBUTJADA per falta de suport.`);
                        newTurnNotifications.push({
                            id: `notif-policy-fail-${p.policyId}-${nextTurn}`,
                            type: 'failure',
                            message: `Llei REBUTJADA: "${policyInfo.title}" ha estat rebutjada (suport del ${successChance.toFixed(0)}%).`
                        });
                        p.status = 'rejected';
                    }
                }
            });
        }

        // Update Demand and Market Price for `nextTurn`
        const nextQuarter = QUARTERS[nextEffectiveTurn % 4];
        let demandModifier = 1.0;
        if (nextQuarter === Quarter.Q2) demandModifier = 1.15; // Estiu
        if (nextQuarter === Quarter.Q4) demandModifier = 1.10; // Hivern
        
        let temporaryDemandMultiplier = 1.0;
        if(nextTurnState.temporaryDemandModifier) {
            temporaryDemandMultiplier = nextTurnState.temporaryDemandModifier.multiplier;
        }

        const constructionDemand = nextTurnState.constructionDemandModifiers.reduce((acc, d) => acc + d.demand, 0);
        nextTurnState.totalDemand = (nextTurnState.baseDemand * demandModifier * temporaryDemandMultiplier) + constructionDemand;
        
        let marketPriceFluctuation = (Math.random() - 0.45) * 0.1;
        if (nextQuarter === Quarter.Q2 || nextQuarter === Quarter.Q4) marketPriceFluctuation += 0.02;
        else marketPriceFluctuation -= 0.01;
        nextTurnState.marketPricePerMW = Math.max(0.05, nextTurnState.marketPricePerMW + marketPriceFluctuation);

        // Recalculate totals (production, co2, deficit) for the new turn state
        const newTotals = recalculateTotals(nextTurnState, nextTurn);
        nextTurnState = { ...nextTurnState, ...newTotals };

        // Prepare PREDICTIVE approval modifiers for `nextTurn` and add them to the list
        if (newTotals.energyDeficit > 0) {
            nextTurnApprovalModifiers.push({
                id: `app-def-${nextTurn}`,
                description: "Penalització per Dèficit",
                changes: { citizen: Math.round(-5 * nextTurnState.penaltyMultiplier), business: Math.round(-3 * nextTurnState.penaltyMultiplier), political: Math.round(-2 * nextTurnState.penaltyMultiplier) }
            });
            addLog(`PREVISIÓ: El dèficit energètic afectarà negativament l'aprovació al proper trimestre.`);
        } else {
            nextTurnApprovalModifiers.push({
                id: `app-sur-${nextTurn}`,
                description: "Gestió Energètica Estable",
                changes: { citizen: 1, business: 1, political: 1 }
            });
        }
        if (newTotals.co2Emissions > CO2_WARNING_THRESHOLD) {
            nextTurnApprovalModifiers.push({
                id: `app-co2-${nextTurn}`,
                description: "Emissions de CO₂ Elevades",
                changes: { environmentalist: Math.round(-4 * nextTurnState.penaltyMultiplier), citizen: Math.round(-1 * nextTurnState.penaltyMultiplier) }
            });
        }
        
        nextTurnState.currentTurnApprovalModifiers = nextTurnApprovalModifiers;
        
        if (nextTurnState.budget < 0) {
            nextTurnState.gameStatus = GameStatus.Lost;
            addLog("BANCARROTA! El govern ha intervingut. Final del mandat.");
        } else if (nextTurnState.overallApproval < APPROVAL_LOSS_THRESHOLD) {
            nextTurnState.gameStatus = GameStatus.Lost;
            addLog("CRISI SOCIAL: L'aprovació ha caigut per sota del límit. Final del mandat.");
        }
        
        const nextGameState = nextTurnState;
        setGameState(nextGameState);
        setTurnNotifications(newTurnNotifications);
        const newHistory = [...gameHistory, nextGameState];

        if (nextGameState.gameStatus === GameStatus.Lost) {
            setGameHistory(newHistory);
            const score = calculateFinalScore(gameHistory[0] || INITIAL_GAME_STATE, nextGameState, newHistory, GameStatus.Lost);
            setFinalScore(score);
            setView('summary');
        } else if (nextTurn >= 16) {
            const finalStateForSummary = { ...nextGameState };
            const status = finalStateForSummary.co2Emissions > CO2_WARNING_THRESHOLD ? GameStatus.Lost : GameStatus.Won;
            if (status === GameStatus.Lost) addLog("FRACÀS CLIMÀTIC: Mandat completat, però amb emissions massa altes.");
            else addLog("MANDAT COMPLETAT! S'ha arribat al final dels 4 anys de govern.");
            finalStateForSummary.gameStatus = status;

            setGameState(finalStateForSummary);
            const finalHistory = [...newHistory, finalStateForSummary]
            setGameHistory(finalHistory);
            const score = calculateFinalScore(gameHistory[0] || INITIAL_GAME_STATE, finalStateForSummary, finalHistory, status);
            setFinalScore(score);
            setView('summary');
        } else {
            setGameHistory(newHistory);
            setTurn(nextTurn);
            hasTriggeredEventForTurn.current = false;
        }
        setIsAdvancingTurn(false);
    }, [turn, gameState, gameHistory, addLog, recalculateTotals, calculateFinalScore]);

    const triggerEvent = useCallback((gs: GameState, currentTurn: number, scheduled: GameEvent | null): boolean => {
        if (gs.gameStatus !== GameStatus.Playing) return false;

        let eventToTrigger: GameEvent | null = null;

        // --- NEW: REACTIVE CRISIS EVENTS BASED ON LOW APPROVAL ---
        if (gs.approvalRatings.business < REACTIVE_APPROVAL_THRESHOLD && !gs.hasTriggeredBusinessCrisis) {
            eventToTrigger = BUSINESS_CRISIS_EVENT;
            addLog("CRISI EMPRESARIAL: La baixa confiança del sector ha provocat una fuga de capitals!");
            setGameState(prev => ({ ...prev, hasTriggeredBusinessCrisis: true }));
        } else if (gs.approvalRatings.environmentalist < REACTIVE_APPROVAL_THRESHOLD && !gs.hasTriggeredEnvironmentalistCrisis) {
            eventToTrigger = ENVIRONMENTALIST_CRISIS_EVENT;
            addLog("CRISI ECOLOGISTA: Ofensiva legal massiva contra els teus projectes!");
            setGameState(prev => ({ ...prev, hasTriggeredEnvironmentalistCrisis: true }));
        } else if (gs.approvalRatings.political < REACTIVE_APPROVAL_THRESHOLD && !gs.hasTriggeredPoliticalCrisis) {
            eventToTrigger = POLITICAL_CRISIS_EVENT;
            addLog("CRISI POLÍTICA: Moció de censura al Parlament!");
            setGameState(prev => ({ ...prev, hasTriggeredPoliticalCrisis: true }));
        } else if (gs.approvalRatings.citizen < REACTIVE_APPROVAL_THRESHOLD && !gs.hasTriggeredCitizenCrisis) {
            eventToTrigger = CITIZEN_CRISIS_EVENT;
            addLog("CRISI SOCIAL: Convocada una Vaga General!");
            setGameState(prev => ({ ...prev, hasTriggeredCitizenCrisis: true }));
        }
        
        // If a crisis event was triggered, we don't look for others
        if (!eventToTrigger) {
            if (!gs.hasTriggeredCO2ReductionEvent && currentTurn >= 3 && gameHistory.length >= 4) {
                const initialCO2 = gameHistory[0]?.co2Emissions;
                if (initialCO2 !== undefined) {
                    const lastThreeStates = gameHistory.slice(-3);
                    if (lastThreeStates.length === 3 && lastThreeStates.every(s => s.co2Emissions < initialCO2)) {
                        eventToTrigger = CO2_REDUCTION_SUCCESS_EVENT;
                        addLog("ÈXIT CLIMÀTIC: Reconeixement internacional per la reducció de CO₂!");
                        setGameState(prev => ({ ...prev, hasTriggeredCO2ReductionEvent: true }));
                    }
                }
            }
        
            if (!eventToTrigger) {
                if (currentTurn === 8) { 
                    eventToTrigger = AIRPORT_EXPANSION_EVENT;
                    addLog(`ESDEVENIMENT CLAU: S'ha de prendre una decisió sobre l'Aeroport del Prat.`);
                } else if (scheduled) {
                    eventToTrigger = scheduled;
                    setScheduledEvent(null);
                    addLog(`Esdeveniment programat: ${scheduled.title}`);
                } else if (gs.co2Emissions > CO2_SANCTION_THRESHOLD && gs.hasReceivedEUWarning) {
                    eventToTrigger = EU_SANCTION_EVENT;
                    addLog("ALERTA: Sanció de la Unió Europea per excés d'emissions!");
                } else if (gs.co2Emissions > CO2_WARNING_THRESHOLD && !gs.hasReceivedEUWarning) {
                    eventToTrigger = EU_WARNING_EVENT;
                    addLog("AVÍS: Advertència de la Unió Europea per alts nivells de CO₂.");
                    setGameState(prev => ({ ...prev, hasReceivedEUWarning: true }));
                } else if (gs.co2Emissions > CO2_PROTEST_THRESHOLD && !gs.hasTriggeredClimateProtest) {
                    eventToTrigger = CLIMATE_PROTEST_EVENT;
                    addLog("PROTESTA: Gran manifestació ciutadana pel clima a Barcelona.");
                    setGameState(prev => ({ ...prev, hasTriggeredClimateProtest: true }));
                } else {
                    if (!eventToTrigger) {
                        const plantTypesInPlay = [
                            ...new Set(
                                gs.powerPlants
                                    .filter(p => p.constructionStartTurn !== -1 && !p.isDecommissioned) 
                                    .map(p => p.type)
                            ),
                        ];

                        const potentialReactions = [];
                        for (const type of plantTypesInPlay) {
                            const reactionConfig = CONSTRUCTION_TRIGGERED_EVENTS[type];
                            if (reactionConfig) {
                                for (const reaction of reactionConfig) {
                                    if (!gs.triggeredEventTitles.includes(reaction.event.title)) {
                                        const perTurnChance = reaction.chance / 8; 
                                        if (Math.random() < perTurnChance) {
                                            potentialReactions.push(reaction.event);
                                        }
                                    }
                                }
                            }
                        }

                        if (potentialReactions.length > 0) {
                            eventToTrigger = potentialReactions[Math.floor(Math.random() * potentialReactions.length)];
                            addLog(`Reacció a construcció: ${eventToTrigger.title}`);
                        }
                    }

                     const breakdownChance = gs.nuclearMaintenanceRisk ? 0.40 : 0.15;
                    if (!eventToTrigger && Math.random() < breakdownChance) {
                        const eligiblePlants = gs.powerPlants.filter(
                            p => p.operationalTurn <= currentTurn &&
                                 p.isActive &&
                                 !p.isDecommissioned &&
                                 !p.isForcedOffline &&
                                 (p.type === EnergySource.Fossil || p.type === EnergySource.Hydro || p.type === EnergySource.Biofuel || (p.type === EnergySource.Nuclear && gs.nuclearMaintenanceRisk))
                        );
                        if (eligiblePlants.length > 0) {
                            const brokenPlant = eligiblePlants[Math.floor(Math.random() * eligiblePlants.length)];
                            const breakdownEvent: GameEvent = {
                                title: `Avaria Inesperada a ${brokenPlant.name}`,
                                description: (difficulty) => `S'ha detectat una avaria greu a la central ${brokenPlant.name} (${brokenPlant.type}). Ha de quedar fora de servei durant un trimestre per a reparacions urgents. Això causarà una pèrdua immediata de ${brokenPlant.capacity} MW de producció.`,
                                decisions: [{
                                    text: "Entesos, procedir amb la reparació",
                                    explanation: (s,d) => `**Pros:** La seguretat és el primer. La reparació és obligatòria.\n**Contres:** La pèrdua de producció pot generar un dèficit energètic que hauràs de cobrir.\n**Conclusió:** No hi ha alternativa. És una crisi que s'ha de gestionar.`,
                                    effect: (s: GameState, m: number) => ({
                                        powerPlants: s.powerPlants.map(p => p.id === brokenPlant.id ? { ...p, isForcedOffline: true } : p)
                                    }),
                                    strategicAdvice: "Consell: Les avaries són inevitables. L'única decisió és acceptar el cop i assegurar-se de tenir prou marge de producció per compensar aquestes pèrdues inesperades."
                                }]
                            };
                            eventToTrigger = breakdownEvent;
                            addLog(`AVARIA GREU: La central ${brokenPlant.name} ha patit una avaria!`);
                        }
                    }

                    if (!eventToTrigger) {
                        let availableEvents = GAME_EVENTS.filter(event =>
                            !gs.triggeredEventTitles.includes(event.title) && isEventAvailable(event, gs, currentTurn)
                        );
        
                        if (availableEvents.length === 0) {
                            addLog("No hi ha esdeveniments únics disponibles. Buscant un esdeveniment repetible...");
                            availableEvents = GAME_EVENTS.filter(event => isEventAvailable(event, gs, currentTurn));
                        }
        
                        if (availableEvents.length > 0) {
                            eventToTrigger = availableEvents[Math.floor(Math.random() * availableEvents.length)];
                            addLog(`Esdeveniment aleatori: ${eventToTrigger.title}`);
                        } else {
                            addLog("ALERTA: No s'ha trobat cap esdeveniment aplicable. S'activa un esdeveniment genèric.");
                            const fallbackEvent: GameEvent = {
                                title: "Reunió de Seguiment Trimestral",
                                category: "Política i Societat",
                                description: () => "L'equip de govern es reuneix per analitzar la situació. És un bon moment per reflexionar sobre l'estratègia general. No hi ha grans canvis, però la feina continua.",
                                decisions: [{
                                    text: "Continuar amb el pla actual",
                                    explanation: () => "**Pros:** Es manté l'estabilitat i no hi ha despeses inesperades.\n**Contres:** No s'aprofita per fer cap canvi significatiu.\n**Conclusió:** Una decisió de continuïtat.",
                                    effect: () => ({}),
                                    strategicAdvice: "De vegades, la millor decisió és no prendre'n cap. Aprofita la calma per planificar el següent trimestre."
                                }]
                            };
                            eventToTrigger = fallbackEvent;
                        }
                    }
                }
            }
        }
        
        if(eventToTrigger) {
            setActiveEvent(eventToTrigger);
            // Only add to triggeredEventTitles if it's not the fallback, to allow it to repeat
            if (eventToTrigger.title !== "Reunió de Seguiment Trimestral") {
                setGameState(prev => ({...prev, triggeredEventTitles: [...prev.triggeredEventTitles, eventToTrigger!.title]}));
            }
            setView('eventScreen');
            return true;
        }
        return false;
    }, [addLog, gameHistory]);

    const stableTriggerEvent = useCallback(triggerEvent, [addLog, gameHistory]);
    
    useEffect(() => {
        if (shouldAdvanceAfterUpdate) {
            setShouldAdvanceAfterUpdate(false);
            setTimeout(() => advanceTurn(), 100);
        }
    }, [shouldAdvanceAfterUpdate, advanceTurn]);

    useEffect(() => {
        if (gameStatus === GameStatus.Playing && view === 'playing' && !hasTriggeredEventForTurn.current) {
            stableTriggerEvent(gameState, turn, scheduledEvent);
            hasTriggeredEventForTurn.current = true;
        }
    }, [gameStatus, turn, gameState, scheduledEvent, stableTriggerEvent, view]);
    
    const handleStartGame = (playerName: string, difficulty: DifficultyLevel) => {
        const finalPlayerName = playerName.trim() === '' ? 'Anònim' : playerName;
        
        let initialBudget = INITIAL_GAME_STATE.budget;
        let initialApproval = INITIAL_GAME_STATE.overallApproval;
        let penaltyMultiplier = INITIAL_GAME_STATE.penaltyMultiplier;
        let baseDemand = INITIAL_GAME_STATE.baseDemand;
        let constructionBans = INITIAL_GAME_STATE.constructionBans;

        const startDate = new Date();
        const startYear = startDate.getFullYear();
        const startQuarterIndex = Math.floor(startDate.getMonth() / 3);
        const startQuarter = QUARTERS[startQuarterIndex];

        switch (difficulty) {
            case DifficultyLevel.Easy:
                initialBudget *= 1.25;
                initialApproval = 75;
                penaltyMultiplier = 0.7;
                break;
            case DifficultyLevel.Hard:
                initialBudget *= 0.85;
                initialApproval = 45;
                baseDemand *= 1.05;
                penaltyMultiplier = 1.15;
                break;
        }

        const initialApprovalRatings: ApprovalRatings = {
            citizen: initialApproval,
            business: initialApproval,
            political: initialApproval,
            environmentalist: initialApproval
        };

        const shuffledPolicies = [...ALL_POLICIES].sort(() => 0.5 - Math.random());
        const selectedPolicies = shuffledPolicies.slice(0, 6).map(p => p.id);
        
        const firstClimateEvent = selectRandomClimateEvent(startQuarter);

        const initialState: GameState = {
            ...INITIAL_GAME_STATE,
            playerName: finalPlayerName,
            budget: initialBudget,
            approvalRatings: initialApprovalRatings,
            overallApproval: calculateOverallApproval(initialApprovalRatings),
            baseDemand: baseDemand,
            totalDemand: baseDemand, // Recalculate based on new baseDemand for Q1
            difficulty: difficulty,
            penaltyMultiplier: penaltyMultiplier,
            displayedPolicyIds: difficulty === DifficultyLevel.Easy ? [] : selectedPolicies,
            constructionBans: constructionBans,
            currentClimateEvent: firstClimateEvent,
            startYear: startYear,
            startQuarterIndex: startQuarterIndex,
        };

        const newTotals = recalculateTotals(initialState, 0);
        const finalInitialState = { ...initialState, ...newTotals };

        setGameState(finalInitialState);
        setGameHistory([finalInitialState]);
        setView('mandateStart');
        setTurn(0);
        setLog([{ message: `[${startQuarter} de ${startYear}] El conseller/a ${finalPlayerName} ha pres possessió del càrrec. Comença el mandat.`, turn: 0, id: `log-${Date.now()}` }]);
        hasTriggeredEventForTurn.current = false;
    };

    const handleAcceptMandate = () => {
        // Directly trigger the event for the first turn instead of going to 'playing' view first.
        const eventWasTriggered = triggerEvent(gameState, turn, scheduledEvent);
        hasTriggeredEventForTurn.current = true;

        if (!eventWasTriggered) {
            // If no event was found, fall back to the dashboard.
            setView('playing');
            setActiveGameView('dashboard');
        }
        // If an event was triggered, triggerEvent() already set the view to 'eventScreen'.
    };

    const handleDecision = (decision: Decision) => {
        if (!activeEvent) return;

        const newDecisionRecord: MajorDecisionRecord = {
            turn: turn,
            event: activeEvent,
            decisionText: decision.text,
        };

        let preEffectState = { ...gameState };

        if (activeEvent.title === "Projecte d'Ampliació de l'Aeroport del Prat" && decision.text === "Convocar un Referèndum Ciutadà") {
            const otherDecisions = activeEvent.decisions.filter(d => d.text !== "Convocar un Referèndum Ciutadà");
            const chosenDecision = otherDecisions[Math.floor(Math.random() * otherDecisions.length)];
            setReferendumResult({ event: activeEvent, decision: chosenDecision });
        }

        const effects = decision.effect(preEffectState, preEffectState.penaltyMultiplier);
        
        if (effects.approvalRatings) {
            const originalRatings = effects.approvalRatings;
            const clampedRatings: ApprovalRatings = { ...originalRatings };
            (Object.keys(clampedRatings) as (keyof ApprovalRatings)[]).forEach(agent => {
                clampedRatings[agent] = Math.max(0, Math.min(100, clampedRatings[agent]));
            });
            effects.approvalRatings = clampedRatings;
        }

        let stateAfterEffect = { ...preEffectState, ...effects, majorDecisions: [...preEffectState.majorDecisions, newDecisionRecord] };
        
        if (effects.approvalRatings) {
             stateAfterEffect.overallApproval = calculateOverallApproval(effects.approvalRatings);
        }

        const finalNewState = { ...stateAfterEffect, ...recalculateTotals(stateAfterEffect, turn) };
        
        addLog(`Decisió presa: ${decision.text}`);
        setGameState(finalNewState);
        setActiveEvent(null);
        setView(referendumResult ? 'referendumResult' : 'playing');
    };
    
    const handleApplyReferendumResult = () => {
        if (!referendumResult) return;

        const { event, decision } = referendumResult;
        addLog(`El poble ha parlat! La decisió del referèndum és: "${decision.text}"`);

        const referendumDecisionRecord: MajorDecisionRecord = {
            turn: turn,
            event: event,
            decisionText: `Resultat del Referèndum: ${decision.text}`,
        };

        const preEffectState = gameState;
        const effects = decision.effect(preEffectState, preEffectState.penaltyMultiplier);
        let stateAfterEffect = { ...preEffectState, ...effects, majorDecisions: [...preEffectState.majorDecisions, referendumDecisionRecord] };
        
        if (effects.approvalRatings) {
             stateAfterEffect.overallApproval = calculateOverallApproval(effects.approvalRatings);
        }

        const finalNewState = { ...stateAfterEffect, ...recalculateTotals(stateAfterEffect, turn) };
        setGameState(finalNewState);
        setReferendumResult(null);
        setView('playing');
    };

    const handleBuildPlant = (plantType: EnergySource) => {
        if (gameState.plantBuiltThisTurn) {
            addLog("Ja has iniciat una construcció aquest trimestre. Només se'n pot fer una per torn.");
            return;
        }

        const constructionBan = gameState.constructionBans.find(b => b.source === plantType);
        if (constructionBan) {
            addLog(`La construcció de centrals de ${plantType} està actualment bloquejada.`);
            return;
        }

        const plantOptions = POWER_PLANT_CONFIG[plantType];

        if (gameState.difficulty === DifficultyLevel.Hard) {
            setConstructionChoice({ type: plantType, options: plantOptions });
            setView('constructionChoiceScreen');
        } else {
            // Build the standard (medium) option by default on Easy/Medium
            const standardPlantConfig = plantOptions[1] || plantOptions[0];
            handleSelectPlantToBuild(standardPlantConfig);
        }
    };

    const handleSelectPlantToBuild = (config: PowerPlantConfig) => {
        const plantType = Object.keys(POWER_PLANT_CONFIG).find(key => POWER_PLANT_CONFIG[key as EnergySource].some(c => c.name === config.name)) as EnergySource;
        if (!plantType) return;

        const costModifier = gameState.costModifiers.find(m => m.source === plantType);
        const finalCost = costModifier ? config.cost * costModifier.multiplier : config.cost;

        if (gameState.budget < finalCost) {
            addLog(`No tens pressupost suficient per construir ${config.name}.`);
            if (view === 'constructionChoiceScreen') {
                setConstructionChoice(null);
                setView('playing');
            }
            return;
        }

        const prosCons = PLANT_CONSTRUCTION_PROS_CONS[plantType];

        setConfirmation({
            title: `Confirmar Construcció: ${config.name}`,
            message: `Estàs segur que vols iniciar la construcció de la central ${config.name}?`,
            pros: prosCons.pros,
            cons: prosCons.cons,
            importantInfo: [
                `Cost: ${finalCost.toLocaleString()} M€`,
                `Temps de construcció: ${config.buildTime} trimestres`,
                `Capacitat: ${config.capacity} MW`
            ],
            onConfirm: () => {
                const newPlant: PowerPlant = {
                    id: gameState.powerPlants.length > 0 ? Math.max(...gameState.powerPlants.map(p => p.id)) + 1 : 1,
                    name: config.name,
                    type: plantType,
                    capacity: config.capacity,
                    upkeep: config.upkeep,
                    operationalTurn: turn + config.buildTime,
                    isActive: true,
                    outputPercentage: 1,
                    isForcedOffline: false,
                    isDecommissioned: false,
                    constructionStartTurn: turn,
                };

                const constructionDemandPerTurn = config.constructionEnergyDemand / config.buildTime;
                const newConstructionDemandModifier = config.constructionEnergyDemand > 0 ? {
                    id: `demand-${newPlant.id}`,
                    relatedPlantId: newPlant.id,
                    demand: constructionDemandPerTurn,
                    duration: config.buildTime
                } : null;

                const newFinancialEvent: TurnEventFinancial = {
                    id: `fin-build-${newPlant.id}-${turn}`,
                    description: `Construcció ${newPlant.name}`,
                    amount: -finalCost,
                    relatedPlantId: newPlant.id
                };
                
                const newApprovalModifier: ApprovalModifier = {
                    id: `app-build-${newPlant.id}-${turn}`,
                    description: `Construcció de ${plantType}`,
                    changes: config.approvalModifier,
                    relatedPlantId: newPlant.id,
                };

                let updatedState = { ...gameState };
                updatedState.powerPlants = [...updatedState.powerPlants, newPlant];
                updatedState.plantBuiltThisTurn = true;
                updatedState.lastAction = { type: 'build', plantType: newPlant.type };
                if (newConstructionDemandModifier) {
                    updatedState.constructionDemandModifiers = [...updatedState.constructionDemandModifiers, newConstructionDemandModifier];
                }
                
                updatedState.currentTurnFinancialEvents = [...updatedState.currentTurnFinancialEvents, newFinancialEvent];
                updatedState.currentTurnApprovalModifiers = [...updatedState.currentTurnApprovalModifiers, newApprovalModifier];

                const newsTemplates = REACTIVE_NEWS_TEMPLATES.build[newPlant.type];
                if (newsTemplates) {
                    const newNews = newsTemplates[Math.floor(Math.random() * newsTemplates.length)];
                    const newsArticle: NewsArticle = {
                        ...newNews,
                        content: newNews.content.replace(/\[PLAYER_NAME\]/g, gameState.playerName),
                        id: `news-${Date.now()}`,
                        turnGenerated: turn
                    };
                    updatedState.newsFeed = [newsArticle, ...updatedState.newsFeed].slice(0, 10);
                }
                
                const finalState = { ...updatedState, ...recalculateTotals(updatedState, turn) };
                
                setGameState(finalState);
                addLog(`S'ha iniciat la construcció de la central ${config.name}. Estarà llesta en ${config.buildTime} trimestres.`);
                setConfirmation(null);
                if (view === 'constructionChoiceScreen') {
                    setConstructionChoice(null);
                }
                setView('playing');
            },
            confirmText: "Iniciar Construcció",
        });
        setView('confirmationScreen');
    };

    const handleTogglePlant = (plantId: number) => {
        setGameState(prevState => {
            const updatedPlants = prevState.powerPlants.map(p => {
                if (p.id === plantId && DISPATCHABLE_PLANTS.includes(p.type)) {
                    return { ...p, isActive: !p.isActive };
                }
                return p;
            });
            const newState = { ...prevState, powerPlants: updatedPlants };
            return { ...newState, ...recalculateTotals(newState, turn) };
        });
    };
    
    const handleSetPlantOutput = (plantId: number, percentage: number) => {
        setGameState(prevState => {
            const updatedPlants = prevState.powerPlants.map(p => {
                if (p.id === plantId) {
                    return { ...p, outputPercentage: percentage };
                }
                return p;
            });
            const newState = { ...prevState, powerPlants: updatedPlants };
            return { ...newState, ...recalculateTotals(newState, turn) };
        });
    };

    const handleCancelConstruction = (plantId: number) => {
        const plant = gameState.powerPlants.find(p => p.id === plantId);
        if (!plant || plant.constructionStartTurn !== turn) return;

        const config = POWER_PLANT_CONFIG[plant.type].find(c => c.name === plant.name);
        if (!config) return;

        const costModifier = gameState.costModifiers.find(m => m.source === plant.type);
        const refundAmount = costModifier ? config.cost * costModifier.multiplier : config.cost;

        setGameState(prevState => {
            const newState = {
                ...prevState,
                powerPlants: prevState.powerPlants.filter(p => p.id !== plantId),
                plantBuiltThisTurn: false,
                constructionDemandModifiers: prevState.constructionDemandModifiers.filter(d => d.relatedPlantId !== plantId),
                currentTurnFinancialEvents: prevState.currentTurnFinancialEvents.filter(e => e.relatedPlantId !== plantId),
                currentTurnApprovalModifiers: prevState.currentTurnApprovalModifiers.filter(m => m.relatedPlantId !== plantId)
            };
            // Add refund as a positive financial event
            newState.currentTurnFinancialEvents.push({
                id: `fin-refund-${plant.id}-${turn}`,
                description: `Reemborsament ${plant.name}`,
                amount: refundAmount,
                relatedPlantId: plant.id
            });
            addLog(`Construcció de ${plant.name} cancel·lada. ${refundAmount.toLocaleString()} M€ reemborsats.`);
            return { ...newState, ...recalculateTotals(newState, turn) };
        });
    };

    const handleEnactPolicy = (policyId: PolicyId) => {
        const policyInfo = ALL_POLICIES.find(p => p.id === policyId);
        if (!policyInfo || gameState.budget < policyInfo.cost) return;

        const isPolicyCurrentlyEnacting = gameState.policies.some(p => p.status === 'enacting');
        if (isPolicyCurrentlyEnacting) {
            addLog("Ja hi ha una llei en tràmit parlamentari. Espera que es resolgui.");
            return;
        }

        const newActivePolicy: ActivePolicy = {
            policyId,
            status: 'enacting',
            turnEnacted: turn,
            turnWillResolve: turn + policyInfo.implementationTime
        };
        
        let newFinancialEvents = [...gameState.currentTurnFinancialEvents];
        if (policyInfo.cost > 0) {
            newFinancialEvents.push({
                id: `fin-policy-${policyId}-${turn}`,
                description: `Inversió llei: ${policyInfo.title}`,
                amount: -policyInfo.cost,
                relatedPolicyId: policyId,
            });
        }
        
        let newApprovalModifiers = [...gameState.currentTurnApprovalModifiers];
        if (policyInfo.enactmentApprovalModifier) {
            newApprovalModifiers.push({
                id: `app-policy-${policyId}-${turn}`,
                description: `Proposta llei: ${policyInfo.title}`,
                changes: policyInfo.enactmentApprovalModifier,
                relatedPolicyId: policyId,
            });
        }
        
        setGameState(prev => ({
            ...prev,
            policies: [...prev.policies.filter(p => p.policyId !== policyId), newActivePolicy],
            currentTurnFinancialEvents: newFinancialEvents,
            currentTurnApprovalModifiers: newApprovalModifiers
        }));
        
        addLog(`S'ha iniciat el tràmit parlamentari per a la llei "${policyInfo.title}".`);
    };
    
    const handleCancelPolicy = (policyId: PolicyId) => {
         const policyInfo = ALL_POLICIES.find(p => p.id === policyId);
         if (!policyInfo) return;
        // FIX: The callback for setGameState must return the new state object. The function was incomplete and not returning anything.
         setGameState(prev => {
             const newState = {
                 ...prev,
                 policies: prev.policies.filter(p => p.policyId !== policyId),
                 currentTurnFinancialEvents: prev.currentTurnFinancialEvents.filter(e => e.relatedPolicyId !== policyId),
                 currentTurnApprovalModifiers: prev.currentTurnApprovalModifiers.filter(m => m.relatedPolicyId !== policyId),
             };
             if (policyInfo.cost > 0) {
                 newState.currentTurnFinancialEvents.push({
                     id: `fin-refund-policy-${policyId}-${turn}`,
                     description: `Reemborsament llei: ${policyInfo.title}`,
                     amount: policyInfo.cost,
                     relatedPolicyId: policyId,
                 });
                 addLog(`Tràmit de la llei "${policyInfo.title}" cancel·lat. S'han reemborsat ${policyInfo.cost.toLocaleString()} M€.`);
             } else {
                 addLog(`Tràmit de la llei "${policyInfo.title}" cancel·lat.`);
             }
             return { ...newState, ...recalculateTotals(newState, turn) };
         });
    };
    
    const handleRestartGame = () => {
        setGameState(INITIAL_GAME_STATE);
        setTurn(0);
        setLog([{ message: 'Benvingut/da a Catalunya: Repte Energètic.', turn: -1, id: `log-${Date.now()}` }]);
        setGameHistory([]);
        setFinalScore(0);
        setThemeDifficulty(DifficultyLevel.Medium);
        setReferendumResult(null);
        setTurnNotifications([]);
        setActiveEvent(null);
        setScheduledEvent(null);
        setConstructionChoice(null);
        setActiveGameView('dashboard');
        hasTriggeredEventForTurn.current = false;
    };

    // This is a reconstructed render method for the App component.
    // The original file was truncated, leaving the component without a return statement.
    const renderContent = () => {
        switch (view) {
            case 'startScreen':
                return <StartScreen onStartGame={handleStartGame} onThemeChange={setThemeDifficulty} onShowGuide={handleShowGuide} />;
            case 'mandateStart':
                return <MandateStartScreen playerName={gameState.playerName} onContinue={handleAcceptMandate} />;
            case 'playing':
                const projectedBudget = gameState.budget + gameState.currentTurnFinancialEvents.reduce((acc, ev) => acc + ev.amount, 0);
                return (
                    <div className={`p-4 sm:p-6 lg:p-8 min-h-screen font-sans transition-colors duration-500 ${theme.bg}`}>
                        <div className="max-w-7xl mx-auto space-y-6">
                            <Header 
                                playerName={gameState.playerName}
                                year={currentYear}
                                quarter={currentQuarter}
                                mandateRemaining={16 - turn}
                                onAdvanceTurnClick={advanceTurn}
                                onImportEnergy={() => {
                                    addLog("Has hagut d'importar energia per cobrir el dèficit. El cost s'aplicarà al final del trimestre.");
                                    advanceTurn();
                                }}
                                isAdvanceTurnDisabled={isAdvancingTurn || gameState.plantBuiltThisTurn}
                                isAdvancingTurn={isAdvancingTurn}
                                energyDeficit={gameState.energyDeficit}
                                onShowGuide={handleShowGuide}
                                onRestart={() => {
                                    setConfirmation({
                                        title: 'Tornar a l\'inici?',
                                        message: 'Estàs segur que vols tornar a la pantalla d\'inici? Perdràs tot el progrés de la partida actual.',
                                        onConfirm: () => {
                                            handleRestartGame();
                                            setConfirmation(null);
                                            setView('startScreen');
                                        },
                                        confirmText: 'Sí, tornar a l\'inici',
                                    });
                                    setView('confirmationScreen');
                                }}
                                currentClimateEvent={gameState.currentClimateEvent}
                            />
                            <StatsBar
                                projectedBudget={projectedBudget}
                                projectedOverallApproval={gameState.overallApproval} // This could be more complex
                                co2Emissions={gameState.co2Emissions}
                                energyBalance={gameState.totalProduction - gameState.totalDemand}
                            />
                             <TurnNotificationPanel notifications={turnNotifications} onDismiss={(id) => setTurnNotifications(prev => prev.filter(n => n.id !== id))} />
                            <MainTabs activeView={activeGameView} setActiveView={setActiveGameView} difficulty={gameState.difficulty} />
                            
                            <div className="mt-6">
                                {activeGameView === 'dashboard' && <Dashboard gameState={gameState} turn={turn} difficulty={gameState.difficulty} />}
                                {activeGameView === 'policies' && <PoliciesOverview gameState={gameState} onEnactPolicy={handleEnactPolicy} turn={turn} onCancelPolicy={handleCancelPolicy} onRethinkPolicies={() => {}} />}
                                {activeGameView === 'powerPlants' && <PowerPlantOverview powerPlants={gameState.powerPlants} turn={turn} gameState={gameState} onBuildPlant={handleBuildPlant} onTogglePlant={handleTogglePlant} onSetPlantOutput={handleSetPlantOutput} seasonalProductionMultipliers={quarterlyProductionMultipliers} onCancelConstruction={handleCancelConstruction} difficulty={gameState.difficulty} />}
                                {activeGameView === 'history' && <HistoryAndAnalysis gameState={gameState} gameHistory={gameHistory} log={log} news={gameState.newsFeed} />}
                            </div>
                        </div>
                    </div>
                );
            case 'summary':
                return <GameSummaryScreen status={gameStatus} history={gameHistory} onRestart={() => window.location.reload()} finalScore={finalScore} difficulty={gameState.difficulty} />;
            case 'guideScreen':
                return <GuideScreen onBack={() => setView(viewBeforeGuide)} />;
            case 'eventScreen':
                return activeEvent && <EventScreen event={activeEvent} onDecision={handleDecision} gameState={gameState} turn={turn} seasonalProductionMultipliers={quarterlyProductionMultipliers} />;
            case 'confirmationScreen':
                return confirmation && (
                    <ConfirmationScreen
                        title={confirmation.title}
                        onConfirm={confirmation.onConfirm}
                        onCancel={() => {
                            setConfirmation(null);
                            if (view === 'confirmationScreen') setView('playing');
                        }}
                        confirmText={confirmation.confirmText}
                        pros={confirmation.pros}
                        cons={confirmation.cons}
                        importantInfo={confirmation.importantInfo}
                    >
                       <p>{confirmation.message}</p>
                    </ConfirmationScreen>
                );
             case 'referendumResult':
                return referendumResult && <ReferendumResultScreen result={referendumResult} onContinue={handleApplyReferendumResult} gameState={gameState} />;
             case 'constructionChoiceScreen':
                return constructionChoice && <ConstructionChoiceScreen plantType={constructionChoice.type} options={constructionChoice.options} onSelect={handleSelectPlantToBuild} onCancel={() => { setConstructionChoice(null); setView('playing'); }} gameState={gameState} />;
            default:
                return <div>Unknown view</div>;
        }
    };

    return <>{renderContent()}</>;
};

// FIX: Add default export for App component to be used in index.tsx
export default App;
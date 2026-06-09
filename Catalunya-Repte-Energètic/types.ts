import React from 'react';

export enum EnergySource {
    Solar = 'Solar',
    Wind = 'Eòlica',
    Hydro = 'Hidràulica',
    Nuclear = 'Nuclear',
    Fossil = 'Combustibles Fòssils',
    Biofuel = 'Biocombustible',
    EolicaMarina = 'Eòlica Marina',
    Termosolar = 'Termosolar'
}

export enum Quarter {
    Q1 = "1r Trimestre",
    Q2 = "2n Trimestre",
    Q3 = "3r Trimestre",
    Q4 = "4t Trimestre"
}

export enum DifficultyLevel {
    Easy = 'Easy',
    Medium = 'Medium',
    Hard = 'Hard',
}

export interface PowerPlant {
    id: number;
    name: string;
    type: EnergySource;
    capacity: number; // in MW
    upkeep: number; // M€ per trimestre
    operationalTurn: number;
    isActive: boolean;
    outputPercentage: number; // 0 to 1, representing current output
    isForcedOffline: boolean; // True if an event forces it offline
    isDecommissioned: boolean;
    constructionStartTurn: number;
}

export interface CostModifier {
    source: EnergySource;
    multiplier: number;
    duration: number | 'permanent';
}

export interface UpkeepModifier {
    id: string;
    multiplier: number;
    duration: number | 'permanent';
}

export interface ConstructionBan {
    source: EnergySource;
    duration: number | 'permanent';
}

export interface CapacityModifier {
    source: EnergySource;
    multiplier: number;
    duration: number | 'permanent';
}

export enum NewsCategory {
    Economic = "Economia",
    Political = "Política",
    Social = "Social",
    Environmental = "Medi Ambient",
    International = "Internacional",
    // FIX: Add Technology to NewsCategory enum to resolve compilation error in constants.ts.
    Technology = "Tecnologia"
}

export interface NewsArticle {
    id: string;
    headline: string;
    content: string;
    category: NewsCategory;
    turnGenerated: number;
}

export interface MajorDecisionRecord {
    turn: number;
    event: GameEvent;
    decisionText: string;
}

// Tracks one-off financial events within a turn for detailed breakdown
export interface TurnEventFinancial {
    id: string;
    description: string;
    amount: number; // positive for income, negative for expense
    relatedPlantId?: number;
    relatedPolicyId?: PolicyId;
}

export interface ApprovalRatings {
    citizen: number; // Ciutadania
    business: number; // Empresariat
    political: number; // Suport Polític
    environmentalist: number; // Ecologistes
}

export interface ApprovalModifier {
    id: string;
    description: string;
    changes: Partial<ApprovalRatings>;
    relatedPlantId?: number;
    relatedPolicyId?: PolicyId;
}

export type PolicyId = 'rehabilitation' | 'carbon_tax' | 'wind_rd' | 'grid_modernization' | 'self_consumption' | 'battery_storage' | 'green_hydrogen' | 'solar_efficiency' | 'energy_education' | 'nuclear_life_extension' | 'simplify_bureaucracy' | 'green_fiscal_reform' | 'predictive_maintenance' | 'hydro_rd' | 'offshore_wind_unlock' | 'solar_thermal_unlock' | 'corporate_tax_cut' | 'windfall_tax' | 'energy_check' | 'electrification_incentives' | 'appliance_renewal' | 'eco_tourist_tax' | 'aragon_energy_pact';
export type PolicyStatus = 'available' | 'enacting' | 'active' | 'rejected';
export type PolicyCategory = "Eficiència i Demanda" | "Fiscalitat i Mercat" | "R+D i Tecnologia" | "Infraestructura Estratègica";

export interface Policy {
    id: PolicyId;
    title: string;
    category: PolicyCategory;
    description: string;
    pros: string[];
    cons: string[];
    cost: number; // one-time cost
    implementationTime: number; // turns
    effect: (currentState: GameState) => Partial<GameState>;
    enactmentApprovalModifier?: Partial<ApprovalRatings>;
    baseSuccessChance: number;
    scoreImpact: number;
}

export interface ActivePolicy {
    policyId: PolicyId;
    status: PolicyStatus;
    turnEnacted: number;
    turnWillResolve: number;
}

export interface ClimateEvent {
    id: string;
    description: string;
    modifiers: {
        solar: number; // e.g., 0.1 for +10%, -0.15 for -15%
        wind: number;
        hydro: number;
    };
}

export interface GameState {
    playerName: string;
    budget: number; // in millions of €
    approvalRatings: ApprovalRatings;
    overallApproval: number;
    co2Emissions: number; // in tons per turn
    totalProduction: number; // in MW
    totalDemand: number; // in MW
    powerPlants: PowerPlant[];
    baseDemand: number;
    hydroModifier: number; // 1.0 is normal, < 1.0 is drought
    energyDeficit: number; // in MW, amount to import
    hasReceivedEUWarning: boolean;
    hasTriggeredClimateProtest: boolean;
    hasTriggeredCO2ReductionEvent: boolean;
    costModifiers: CostModifier[];
    constructionBans: ConstructionBan[];
    capacityModifiers: CapacityModifier[];
    newsFeed: NewsArticle[];
    lastAction: { type: 'build', plantType: EnergySource } | null;
    constructionDemandModifiers: { id: string; relatedPlantId: number; demand: number, duration: number }[];
    triggeredEventTitles: string[];
    history: GameState[]; // For end-game summary
    gameStatus: GameStatus;
    majorDecisions: MajorDecisionRecord[];
    scheduledEvent: GameEvent | null;
    // New properties for new events
    hasInvestedInBatteries: boolean;
    hasInvestedInHydrogen: boolean;
    nuclearMaintenanceRisk: boolean;
    surplusSalePriceMultiplier: number;
    importEnergyPriceMultiplier: number;
    recurrentUpkeep: number;
    // Dynamic Market
    marketPricePerMW: number;
    // Difficulty
    difficulty: DifficultyLevel;
    penaltyMultiplier: number;
    // Financial Breakdown
    currentTurnFinancialEvents: TurnEventFinancial[];
    // Approval Breakdown
    currentTurnApprovalModifiers: ApprovalModifier[];
    // Policies
    policies: ActivePolicy[];
    plantBuiltThisTurn: boolean;
    displayedPolicyIds: PolicyId[];
    // Dynamic economy
    taxRevenuePerTurn: number;
    upkeepModifiers: UpkeepModifier[];
    temporaryDemandModifier: { multiplier: number, duration: number } | null;
    // Reactive crisis events
    hasTriggeredBusinessCrisis: boolean;
    hasTriggeredEnvironmentalistCrisis: boolean;
    hasTriggeredPoliticalCrisis: boolean;
    hasTriggeredCitizenCrisis: boolean;
    currentClimateEvent: ClimateEvent | null;
    // Dynamic start date
    startYear: number;
    startQuarterIndex: number;
}

export interface Decision {
    text: string;
    explanation: (currentState: GameState, difficulty: DifficultyLevel) => string;
    effect: (currentState: GameState, penaltyMultiplier: number) => Partial<GameState>;
    strategicAdvice: string;
}

export type EventCategory = 'Tecnologia i Indústria' | 'Clima i Desastres' | 'Política i Societat' | 'Economia i Mercat' | 'Reacció a Construcció' | 'Crisi Governamental';

export interface GameEvent {
    title: string;
    description: (difficulty: DifficultyLevel) => string;
    decisions: Decision[];
    allowedQuarters?: Quarter[];
    minTurn?: number; // Event cannot appear before this turn
    allowedDifficulties?: DifficultyLevel[];
    category?: EventCategory;
}

export interface PowerPlantConfig {
    name: string;
    cost: number;
    capacity: number;
    buildTime: number; // in turns
    co2: number; // tons per MW per turn
    upkeep: number;
    constructionEnergyDemand: number; // total MW required over the construction period
    approvalModifier: Partial<ApprovalRatings>;
}

export enum GameStatus {
    Playing = 'Playing',
    Won = 'Won',
    Lost = 'Lost'
}

export interface TurnNotification {
    id: string;
    message: string;
    type: 'success' | 'failure' | 'info';
}

export interface AnalysisReport {
    title: string;
    sections: {
        title: string;
        points: string[];
        icon: React.ReactNode;
    }[];
    conclusion: string;
}
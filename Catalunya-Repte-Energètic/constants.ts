import { GameState, PowerPlant, GameEvent, EnergySource, PowerPlantConfig, Quarter, NewsArticle, NewsCategory, GameStatus, DifficultyLevel, ApprovalModifier, Policy, PolicyId, ApprovalRatings, TurnEventFinancial, ConstructionBan, ClimateEvent, EventCategory } from './types';
import { UsersIcon, BriefcaseIcon, ScaleIcon, GlobeAltIcon } from './components/Icons';
import React from 'react';

export const BASE_MARKET_PRICE_PER_MW = 0.13; // M€ per MW
export const TAX_REVENUE_PER_TURN = 600; // M€ per trimestre (Augmentat de 250 per cobrir manteniment)
export const APPROVAL_LOSS_THRESHOLD = 15; // Game is lost if approval drops below this
export const REACTIVE_APPROVAL_THRESHOLD = 25; // Approval crisis events trigger below this

export const THEME_CONFIGS = {
    [DifficultyLevel.Easy]: {
        bg: 'bg-theme-easy-bg',
        text: 'text-theme-easy-text',
        border: 'border-theme-easy-border'
    },
    [DifficultyLevel.Medium]: {
        bg: 'bg-theme-medium-bg',
        text: 'text-theme-medium-text',
        border: 'border-theme-medium-border'
    },
    [DifficultyLevel.Hard]: {
        bg: 'bg-theme-hard-bg',
        text: 'text-theme-hard-text',
        border: 'border-theme-hard-border'
    }
};

export const THEME_HEX_COLORS: Record<DifficultyLevel, string> = {
    [DifficultyLevel.Easy]: '#f0fdf4',
    [DifficultyLevel.Medium]: '#f8fafc',
    [DifficultyLevel.Hard]: '#fef2f2',
};

export const DISPATCHABLE_PLANTS: EnergySource[] = [
    EnergySource.Nuclear,
    EnergySource.Fossil,
    EnergySource.Hydro,
    EnergySource.Biofuel,
    EnergySource.Termosolar,
];

export const QUARTERS: Quarter[] = [Quarter.Q1, Quarter.Q2, Quarter.Q3, Quarter.Q4];

export type AgentKey = keyof ApprovalRatings;

// FIX: Replaced JSX with React.createElement to be valid in a .ts file
export const AGENT_CONFIG: Record<AgentKey, { label: string; icon: React.ReactNode; color: string }> = {
    citizen: { label: 'Ciutadania', icon: React.createElement(UsersIcon, { className: "w-6 h-6" }), color: 'text-rose-500' },
    business: { label: 'Empresariat', icon: React.createElement(BriefcaseIcon, { className: "w-6 h-6" }), color: 'text-blue-500' },
    political: { label: 'Suport Polític', icon: React.createElement(ScaleIcon, { className: "w-6 h-6" }), color: 'text-purple-500' },
    environmentalist: { label: 'Ecologistes', icon: React.createElement(GlobeAltIcon, { className: "w-6 h-6" }), color: 'text-green-500' },
};

// FIX: Export CAPACITY_FACTORS to be used across the application for production calculations.
export const CAPACITY_FACTORS: Record<EnergySource, number> = {
    [EnergySource.Nuclear]: 0.90,
    [EnergySource.Fossil]: 0.55,
    [EnergySource.Hydro]: 0.40,
    [EnergySource.Wind]: 0.35,
    [EnergySource.EolicaMarina]: 0.50,
    [EnergySource.Solar]: 0.22,
    [EnergySource.Termosolar]: 0.30,
    [EnergySource.Biofuel]: 0.80
};

export const SEASONAL_CLIMATE_EVENTS: Record<Quarter, ClimateEvent[]> = {
    [Quarter.Q1]: [ // Primavera
        { id: 'spring_normal', description: "Primavera Normal", modifiers: { solar: 0, wind: 0, hydro: 0 } },
        { id: 'spring_rainy', description: "Primavera plujosa i ennuvolada", modifiers: { solar: -0.15, wind: 0, hydro: 0.10 } },
        { id: 'spring_dry', description: "Primavera seca i assolellada", modifiers: { solar: 0.10, wind: 0, hydro: -0.10 } },
    ],
    [Quarter.Q2]: [ // Estiu
        { id: 'summer_normal', description: "Estiu Normal", modifiers: { solar: 0, wind: 0, hydro: 0 } },
        { id: 'summer_torrid', description: "Estiu tòrrid i calmat", modifiers: { solar: 0.15, wind: -0.10, hydro: -0.15 } },
        { id: 'summer_mild', description: "Estiu suau i amb tempestes", modifiers: { solar: -0.10, wind: 0.05, hydro: 0.05 } },
    ],
    [Quarter.Q3]: [ // Tardor
        { id: 'autumn_normal', description: "Tardor Normal", modifiers: { solar: 0, wind: 0, hydro: 0 } },
        { id: 'autumn_rainy', description: "Tardor molt plujosa", modifiers: { solar: -0.10, wind: 0.05, hydro: 0.15 } },
        { id: 'autumn_dry', description: "Tardor seca (Estiuet de Sant Martí)", modifiers: { solar: 0.10, wind: 0, hydro: -0.10 } },
    ],
    [Quarter.Q4]: [ // Hivern
        { id: 'winter_normal', description: "Hivern Normal", modifiers: { solar: 0, wind: 0, hydro: 0 } },
        { id: 'winter_windy', description: "Hivern ventós i fred", modifiers: { solar: 0, wind: 0.15, hydro: 0 } },
        { id: 'winter_mild', description: "Hivern suau i calmat", modifiers: { solar: 0.05, wind: -0.10, hydro: 0 } },
    ]
};

export const ALL_POLICIES: Policy[] = [
    {
        id: 'rehabilitation',
        title: "Pla de Rehabilitació Energètica",
        category: "Eficiència i Demanda",
        description: "Un programa a llarg termini per subvencionar la millora de l'aïllament en edificis existents, reduint la necessitat de calefacció i aire condicionat.",
        cost: 1200,
        implementationTime: 4,
        pros: ["Reducció permanent de la demanda base (-150 MW).", "Millora l'aprovació ciutadana (+5%) i dels ecologistes (+2%) per l'estalvi energètic."],
        cons: ["Inversió inicial molt elevada.", "No ofereix cap benefici de producció a curt termini."],
        effect: (s) => ({ baseDemand: s.baseDemand - 150, approvalRatings: { ...s.approvalRatings, citizen: s.approvalRatings.citizen + 5, environmentalist: s.approvalRatings.environmentalist + 2 } }),
        baseSuccessChance: 70,
        scoreImpact: 0.8,
    },
    {
        id: 'electrification_incentives',
        title: "Pla d'Incentius a l'Electrificació",
        category: "Eficiència i Demanda",
        description: "Un paquet de subvencions per accelerar la transició a vehicles elèctrics, climatització eficient i altres tecnologies elèctriques.",
        cost: 1500,
        implementationTime: 3,
        pros: ["Reducció permanent de la demanda energètica (-120 MW).", "Suport molt ampli (Ciutadans +5%, Empresaris +3%, Ecologistes +4%)."],
        cons: ["Cost d'inversió inicial molt elevat.", "Els beneficis en la demanda es noten a llarg termini."],
        enactmentApprovalModifier: { citizen: 4, business: 2, environmentalist: 3, political: 2 },
        effect: (s) => ({ 
            baseDemand: s.baseDemand - 120, 
            approvalRatings: { 
                ...s.approvalRatings, 
                citizen: s.approvalRatings.citizen + 5, 
                business: s.approvalRatings.business + 3, 
                environmentalist: s.approvalRatings.environmentalist + 4 
            } 
        }),
        baseSuccessChance: 75,
        scoreImpact: 0.9,
    },
    {
        id: 'appliance_renewal',
        title: "Pla de Renovació d'Electrodomèstics",
        category: "Eficiència i Demanda",
        description: "Subvenciona la compra d'electrodomèstics de baix consum per a les llars, reduint de forma permanent la demanda base del país.",
        cost: 700,
        implementationTime: 2,
        pros: ["Reducció permanent de la demanda base (-80 MW).", "Mesura ben rebuda per ciutadans (+4%) i ecologistes (+2%)."],
        cons: ["Cost d'inversió considerable.", "L'impacte sobre la demanda és real, però no és una solució per si sola."],
        effect: (s) => ({ baseDemand: s.baseDemand - 80, approvalRatings: { ...s.approvalRatings, citizen: s.approvalRatings.citizen + 4, environmentalist: s.approvalRatings.environmentalist + 2 } }),
        baseSuccessChance: 80,
        scoreImpact: 0.6,
    },
    {
        id: 'carbon_tax',
        title: "Impost a les Emissions de CO₂",
        category: "Fiscalitat i Mercat",
        description: "Grava les emissions de CO₂ de les centrals de combustibles fòssils, generant ingressos i desincentivant el seu ús.",
        cost: 0,
        implementationTime: 2,
        pros: ["Genera ingressos estables (+200 M€/trimestre).", "Ben rebut per ecologistes (+5%) i ciutadans (+2%)."],
        cons: ["Mesura impopular entre el sector industrial (-5% aprovació).", "No redueix directament la demanda ni augmenta la producció."],
        effect: (s) => ({ recurrentUpkeep: s.recurrentUpkeep - 200, approvalRatings: { ...s.approvalRatings, business: s.approvalRatings.business - 5, environmentalist: s.approvalRatings.environmentalist + 5, citizen: s.approvalRatings.citizen + 2 } }),
        baseSuccessChance: 50,
        scoreImpact: 0.3,
    },
    {
        id: 'green_fiscal_reform',
        title: "Reforma Fiscal Verda",
        category: "Fiscalitat i Mercat",
        description: "Reforma el sistema d'impostos per incentivar pràctiques sostenibles, augmentant la recaptació general que es pot destinar a la transició energètica.",
        cost: 300,
        implementationTime: 2,
        pros: ["Augmenta els ingressos per impostos (+100 M€/trimestre).", "Ben vist per ecologistes (+3%)."],
        cons: ["Petita pèrdua d'aprovació ciutadana (-3%) i empresarial (-2%) per la percepció d'un augment d'impostos.", "Requereix una inversió inicial."],
        effect: (s) => ({ taxRevenuePerTurn: s.taxRevenuePerTurn + 100, approvalRatings: { ...s.approvalRatings, citizen: s.approvalRatings.citizen - 3, business: s.approvalRatings.business - 2, environmentalist: s.approvalRatings.environmentalist + 3 } }),
        baseSuccessChance: 60,
        scoreImpact: 0.4,
    },
    {
        id: 'corporate_tax_cut',
        title: "Llei de Reducció de l'Impost de Societats",
        category: "Fiscalitat i Mercat",
        description: "Una rebaixa fiscal directa a les empreses per atreure inversió i estimular l'economia.",
        cost: 150,
        implementationTime: 2,
        pros: ["Impuls a l'economia i gran suport empresarial (+10%).", "Atrau nova inversió al país."],
        cons: ["Reducció permanent dels ingressos per impostos (-150 M€/trimestre).", "Crítiques per afavorir les grans empreses (Ciutadans -3%, Ecologistes -2%)."],
        enactmentApprovalModifier: { business: 8 },
        effect: (s) => ({ 
            taxRevenuePerTurn: s.taxRevenuePerTurn - 150, 
            approvalRatings: { 
                ...s.approvalRatings, 
                business: s.approvalRatings.business + 10, 
                citizen: s.approvalRatings.citizen - 3, 
                environmentalist: s.approvalRatings.environmentalist - 2 
            } 
        }),
        baseSuccessChance: 60,
        scoreImpact: 0.2,
    },
    {
        id: 'windfall_tax',
        title: "Taxa als Beneficis Extraordinaris de les Elèctriques",
        category: "Fiscalitat i Mercat",
        description: "Un impost especial sobre els beneficis 'caiguts del cel' de les grans companyies elèctriques en temps de preus alts.",
        cost: 0,
        implementationTime: 2,
        pros: ["Augmenta massivament la recaptació (+250 M€/trimestre).", "Mesura molt popular entre la ciutadania (+10%)."],
        cons: ["Genera un rebuig frontal del sector empresarial (-12%).", "Pot desincentivar futures inversions privades en energia."],
        enactmentApprovalModifier: { citizen: 8, business: -10 },
        effect: (s) => ({ 
            taxRevenuePerTurn: s.taxRevenuePerTurn + 250, 
            approvalRatings: { 
                ...s.approvalRatings, 
                business: s.approvalRatings.business - 12, 
                citizen: s.approvalRatings.citizen + 10 
            } 
        }),
        baseSuccessChance: 55,
        scoreImpact: 0.5,
    },
    {
        id: 'energy_check',
        title: "Xec Energètic Directe a la Ciutadania",
        category: "Fiscalitat i Mercat",
        description: "Una ajuda directa i recurrent a les famílies per alleujar el cost de la factura de la llum.",
        cost: 100,
        implementationTime: 1,
        pros: ["Augment massiu i immediat del suport ciutadà (+15%).", "Alleuja la pressió econòmica sobre les famílies."],
        cons: ["Crea una nova despesa recurrent molt elevada (+300 M€/trimestre).", "Mesura criticada per l'empresariat (-3%) per ser populista."],
        enactmentApprovalModifier: { citizen: 10 },
        effect: (s) => ({ 
            recurrentUpkeep: s.recurrentUpkeep + 300, 
            approvalRatings: { 
                ...s.approvalRatings, 
                citizen: s.approvalRatings.citizen + 15, 
                business: s.approvalRatings.business - 3 
            } 
        }),
        baseSuccessChance: 80,
        scoreImpact: 0.6,
    },
    {
        id: 'eco_tourist_tax',
        title: "Taxa Turística Ecològica",
        category: "Fiscalitat i Mercat",
        description: "Crea una taxa finalista sobre les pernoctacions turístiques. Els ingressos es destinaran a projectes de sostenibilitat.",
        cost: 50,
        implementationTime: 2,
        pros: ["Genera ingressos estables (+80 M€/trimestre).", "Ben vist per ecologistes (+4%) i suport polític (+2%)."],
        cons: ["Mesura impopular entre el sector empresarial (-4%) per por a perdre competitivitat."],
        effect: (s) => ({ taxRevenuePerTurn: s.taxRevenuePerTurn + 80, approvalRatings: { ...s.approvalRatings, business: s.approvalRatings.business - 4, environmentalist: s.approvalRatings.environmentalist + 4, political: s.approvalRatings.political + 2 } }),
        baseSuccessChance: 65,
        scoreImpact: 0.4,
    },
     {
        id: 'predictive_maintenance',
        title: "Pla de Manteniment Predictiu",
        category: "Infraestructura Estratègica",
        description: "Inverteix en IA i sensors per predir avaries abans que passin, optimitzant el manteniment de totes les centrals elèctriques.",
        cost: 800,
        implementationTime: 3,
        pros: ["Redueix el cost de manteniment de TOTES les centrals en un 15%.", "Millora el suport empresarial (+2%) per l'augment d'eficiència."],
        cons: ["Inversió tecnològica inicial considerable.", "No augmenta la producció directament, només redueix costos."],
        effect: (s) => ({ upkeepModifiers: [...s.upkeepModifiers, { id: 'predictive_maintenance', multiplier: 0.85, duration: 'permanent' }], approvalRatings: { ...s.approvalRatings, business: s.approvalRatings.business + 2 } }),
        baseSuccessChance: 75,
        scoreImpact: 0.6,
    },
    {
        id: 'hydro_rd',
        title: "Projecte d'R+D Hidroelèctric",
        category: "R+D i Tecnologia",
        description: "Inverteix en la modernització de les turbines i sistemes de gestió de les centrals hidroelèctriques per augmentar la seva eficiència.",
        cost: 650,
        implementationTime: 3,
        pros: ["Augmenta la producció de totes les centrals hidroelèctriques en un 15%.", "Ben rebut pel sector empresarial (+2%) i polític (+1%)."],
        cons: ["Cost elevat per a una tecnologia que depèn de la pluja.", "No té efecte durant les sequeres."],
        effect: (s) => ({ capacityModifiers: [...s.capacityModifiers, { source: EnergySource.Hydro, multiplier: 1.15, duration: 'permanent' }], approvalRatings: { ...s.approvalRatings, business: s.approvalRatings.business + 2, political: s.approvalRatings.political + 1 } }),
        baseSuccessChance: 70,
        scoreImpact: 0.5,
    },
    {
        id: 'wind_rd',
        title: "Decret de Foment a l'R+D Eòlic",
        category: "R+D i Tecnologia",
        description: "Inverteix en centres de recerca per desenvolupar turbines eòliques més eficients i materials més lleugers.",
        cost: 750,
        implementationTime: 3,
        pros: ["Les centrals eòliques (terrestres i marines) produiran un 10% més.", "Millora la imatge del govern (Ciutadans +2%, Ecologistes +3%)."],
        cons: ["Inversió cara sense retorn immediat.", "El benefici només s'aplica a una tecnologia concreta."],
        enactmentApprovalModifier: { citizen: 2, environmentalist: 3, business: 1 },
        effect: (s) => ({
            capacityModifiers: [...s.capacityModifiers, { source: EnergySource.Wind, multiplier: 1.10, duration: 'permanent' }, { source: EnergySource.EolicaMarina, multiplier: 1.10, duration: 'permanent' }],
        }),
        baseSuccessChance: 75,
        scoreImpact: 0.5,
    },
    {
        id: 'grid_modernization',
        title: "Llei de Modernització de la Xarxa",
        category: "Infraestructura Estratègica",
        description: "Inverteix en la digitalització i millora de la xarxa de transport elèctric per reduir pèrdues i millorar l'estabilitat.",
        cost: 900,
        implementationTime: 2,
        pros: ["Importar i exportar energia serà un 10% més eficient.", "Mesura aplaudida pel sector empresarial (+3%) i polític (+2%)."],
        cons: ["Cost inicial molt elevat.", "No genera nova producció directament, només optimitza el mercat."],
        enactmentApprovalModifier: { business: 3, political: 2 },
        effect: (s) => ({ surplusSalePriceMultiplier: s.surplusSalePriceMultiplier + 0.1, importEnergyPriceMultiplier: s.importEnergyPriceMultiplier - 0.1 }),
        baseSuccessChance: 80,
        scoreImpact: 0.4,
    },
    {
        id: 'aragon_energy_pact',
        title: "Acord Bilateral d'Energia amb Aragó",
        category: "Infraestructura Estratègica",
        description: "Signa un acord estratègic per millorar la interconnexió i establir preus preferencials de compra i venda d'energia amb la comunitat veïna.",
        cost: 400,
        implementationTime: 3,
        pros: ["Millora el preu de venda d'excedent (+15%) i redueix el de compra per dèficit (-15%).", "Reforça les relacions institucionals (+4% suport polític)."],
        cons: ["Cost inicial de la millora de la interconnexió.", "No genera nova energia, només optimitza el mercat."],
        effect: (s) => ({ surplusSalePriceMultiplier: s.surplusSalePriceMultiplier + 0.15, importEnergyPriceMultiplier: s.importEnergyPriceMultiplier - 0.15, approvalRatings: { ...s.approvalRatings, political: s.approvalRatings.political + 4 } }),
        baseSuccessChance: 75,
        scoreImpact: 0.5,
    },
    {
        id: 'self_consumption',
        title: "Llei d'Impuls a l'Autoconsum",
        category: "Eficiència i Demanda",
        description: "Simplifica la burocràcia i ofereix incentius fiscals per a instal·lacions d'autoconsum en llars i empreses.",
        cost: 500,
        implementationTime: 2,
        pros: ["Reducció permanent de la demanda (-100 MW).", "Mesura molt popular entre ciutadans (+4%) i ecologistes (+4%)."],
        cons: ["Inversió inicial considerable.", "Redueix la base de consumidors de la xarxa general."],
        effect: (s) => ({ baseDemand: s.baseDemand - 100, approvalRatings: { ...s.approvalRatings, citizen: s.approvalRatings.citizen + 4, environmentalist: s.approvalRatings.environmentalist + 4 } }),
        baseSuccessChance: 80,
        scoreImpact: 0.7,
    },
    {
        id: 'battery_storage',
        title: "Pla Estratègic d'Emmagatzematge (Bateries)",
        category: "Infraestructura Estratègica",
        description: "Inverteix massivament en la construcció de grans sistemes de bateries per emmagatzemar l'energia sobrant de les renovables i utilitzar-la quan calgui.",
        cost: 2000,
        implementationTime: 4,
        pros: ["Augmenta massivament l'eficiència de les renovables intermitents (Solar i Eòlica +20% efectiu).", "Millora la sobirania energètica (Suport polític +3%)."],
        cons: ["És una de les inversions més cares del joc.", "Tecnologia encara en desenvolupament."],
        effect: (s) => ({ capacityModifiers: [...s.capacityModifiers, { source: EnergySource.Solar, multiplier: 1.20, duration: 'permanent' }, { source: EnergySource.Wind, multiplier: 1.20, duration: 'permanent' }, { source: EnergySource.EolicaMarina, multiplier: 1.20, duration: 'permanent' }], approvalRatings: { ...s.approvalRatings, political: s.approvalRatings.political + 3 } }),
        baseSuccessChance: 70,
        scoreImpact: 1.0,
    },
    {
        id: 'green_hydrogen',
        title: "Projecte Pilot d'Hidrogen Verd",
        category: "R+D i Tecnologia",
        description: "Inverteix en un projecte pioner per produir hidrogen verd a partir d'excedents d'energia renovable, una aposta de futur.",
        cost: 1300,
        implementationTime: 3,
        pros: ["Redueix la dependència del gas (manteniment de centrals fòssils -25%).", "Gran impuls a l'aprovació ecologista (+5%) i empresarial (+3%)."],
        cons: ["Cost molt elevat per un benefici indirecte.", "Tecnologia experimental amb resultats a llarg termini."],
        effect: (s) => ({ upkeepModifiers: [...s.upkeepModifiers, { id: 'green_hydrogen', multiplier: 0.75, duration: 'permanent' }], approvalRatings: { ...s.approvalRatings, environmentalist: s.approvalRatings.environmentalist + 5, business: s.approvalRatings.business + 3 } }),
        baseSuccessChance: 65,
        scoreImpact: 0.6,
    },
    {
        id: 'solar_efficiency',
        title: "Programa d'R+D en Eficiència Solar",
        category: "R+D i Tecnologia",
        description: "Subvenciona la investigació per millorar l'eficiència de les plaques solars i la seva producció en condicions de poca llum.",
        cost: 850,
        implementationTime: 3,
        pros: ["Totes les teves centrals solars produiran un 15% més.", "Ben vist per ecologistes (+3%) i empresaris (+2%)."],
        cons: ["Inversió considerable centrada en una única tecnologia.", "No resol el problema de la producció nocturna."],
        effect: (s) => ({ capacityModifiers: [...s.capacityModifiers, { source: EnergySource.Solar, multiplier: 1.15, duration: 'permanent' }], approvalRatings: { ...s.approvalRatings, environmentalist: s.approvalRatings.environmentalist + 3, business: s.approvalRatings.business + 2 } }),
        baseSuccessChance: 70,
        scoreImpact: 0.5,
    },
    {
        id: 'energy_education',
        title: "Programa d'Educació Energètica",
        category: "Eficiència i Demanda",
        description: "Llança una campanya educativa a les escoles i mitjans de comunicació per fomentar hàbits de consum responsable i estalvi energètic.",
        cost: 200,
        implementationTime: 2,
        pros: ["Reducció permanent de la demanda base (-50 MW).", "Mesura molt popular entre ciutadans (+3%) i ecologistes (+1%)."],
        cons: ["El seu impacte en la demanda és modest.", "Requereix una inversió inicial."],
        effect: (s) => ({ baseDemand: s.baseDemand - 50, approvalRatings: { ...s.approvalRatings, citizen: s.approvalRatings.citizen + 3, environmentalist: s.approvalRatings.environmentalist + 1 } }),
        baseSuccessChance: 85,
        scoreImpact: 0.3,
    },
    {
        id: 'nuclear_life_extension',
        title: "Extensió de Vida de Centrals Nuclears",
        category: "Infraestructura Estratègica",
        description: "Inverteix en la seguretat i modernització de les centrals nuclears existents per allargar la seva vida útil i augmentar-ne lleugerament la potència.",
        cost: 1800,
        implementationTime: 4,
        pros: ["Augmenta la producció de les nuclears en un 10%.", "Gran suport empresarial (+5%) per l'estabilitat energètica."],
        cons: ["Cost molt elevat.", "Mesura extremadament impopular entre ecologistes (-10%) i ciutadans (-5%)."],
        effect: (s) => ({ capacityModifiers: [...s.capacityModifiers, { source: EnergySource.Nuclear, multiplier: 1.10, duration: 'permanent' }], approvalRatings: { ...s.approvalRatings, business: s.approvalRatings.business + 5, environmentalist: s.approvalRatings.environmentalist - 10, citizen: s.approvalRatings.citizen - 5 } }),
        baseSuccessChance: 60,
        scoreImpact: 0.1,
    },
    {
        id: 'simplify_bureaucracy',
        title: "Simplificació Burocràtica per a Renovables",
        category: "Infraestructura Estratègica",
        description: "Redueix els tràmits administratius per a la construcció de parcs eòlics i solars, accelerant la seva posada en marxa.",
        cost: 150,
        implementationTime: 1,
        pros: ["Redueix el temps de construcció de centrals solars i eòliques en 1 trimestre.", "Molt ben rebut pel sector empresarial (+4%)."],
        cons: ["Pot generar rebuig ecologista (-3%) per la por a una menor supervisió ambiental."],
        effect: (s) => ({ approvalRatings: { ...s.approvalRatings, business: s.approvalRatings.business + 4, environmentalist: s.approvalRatings.environmentalist - 3 } }),
        baseSuccessChance: 75,
        scoreImpact: 0.3,
    },
    {
        id: 'offshore_wind_unlock',
        title: "Desbloqueig de l'Eòlica Marina",
        category: "R+D i Tecnologia",
        description: "Inicia els estudis i la planificació per permetre la construcció de parcs eòlics marins, una tecnologia de gran potencial però molt complexa.",
        cost: 1000,
        implementationTime: 3,
        pros: ["Permet construir parcs eòlics marins.", "Projecte de país que genera il·lusió (Ciutadans +3%, Polítics +3%, Empresaris +2%)."],
        cons: ["Inversió molt alta només per desbloquejar la tecnologia, sense cap benefici directe immediat."],
        effect: (s) => ({ constructionBans: s.constructionBans.filter(b => b.source !== EnergySource.EolicaMarina), approvalRatings: { ...s.approvalRatings, citizen: s.approvalRatings.citizen + 3, political: s.approvalRatings.political + 3, business: s.approvalRatings.business + 2 } }),
        baseSuccessChance: 70,
        scoreImpact: 0.5,
    },
    {
        id: 'solar_thermal_unlock',
        title: "Pla de Desenvolupament Termosolar",
        category: "R+D i Tecnologia",
        description: "Impulsa la tecnologia termosolar, que permet emmagatzemar calor per generar electricitat fins i tot de nit.",
        cost: 1200,
        implementationTime: 3,
        pros: ["Permet construir centrals termosolars.", "Gran suport ecologista (+4%) i polític (+2%) per ser una renovable gestionable."],
        cons: ["Cost molt elevat per desbloquejar una tecnologia cara.", "Ocupa molt de territori."],
        effect: (s) => ({ constructionBans: s.constructionBans.filter(b => b.source !== EnergySource.Termosolar), approvalRatings: { ...s.approvalRatings, environmentalist: s.approvalRatings.environmentalist + 4, political: s.approvalRatings.political + 2 } }),
        baseSuccessChance: 65,
        scoreImpact: 0.5,
    }
];

export const POWER_PLANT_CONFIG: Record<EnergySource, PowerPlantConfig[]> = {
    [EnergySource.Solar]: [
        { name: "Petit Parc Solar", cost: 400, capacity: 200, buildTime: 2, co2: 0, upkeep: 4, constructionEnergyDemand: 20, approvalModifier: { citizen: 2, environmentalist: 3 } },
        { name: "Parc Solar Estàndard", cost: 750, capacity: 400, buildTime: 3, co2: 0, upkeep: 8, constructionEnergyDemand: 40, approvalModifier: { citizen: 2, environmentalist: 3 } },
        { name: "Gran Parc Solar", cost: 1300, capacity: 750, buildTime: 4, co2: 0, upkeep: 15, constructionEnergyDemand: 75, approvalModifier: { citizen: 1, environmentalist: 2, business: -1 } }
    ],
    [EnergySource.Wind]: [
        { name: "Petit Parc Eòlic", cost: 600, capacity: 250, buildTime: 3, co2: 0, upkeep: 9, constructionEnergyDemand: 30, approvalModifier: { citizen: 1, environmentalist: 2 } },
        { name: "Parc Eòlic Estàndard", cost: 1100, capacity: 500, buildTime: 4, co2: 0, upkeep: 18, constructionEnergyDemand: 60, approvalModifier: { citizen: 0, environmentalist: 2, business: -1 } },
        { name: "Gran Parc Eòlic", cost: 2000, capacity: 900, buildTime: 5, co2: 0, upkeep: 32, constructionEnergyDemand: 100, approvalModifier: { citizen: -2, environmentalist: 1, business: -2 } }
    ],
    [EnergySource.Hydro]: [
        { name: "Central de Bombament", cost: 1500, capacity: 400, buildTime: 5, co2: 0, upkeep: 12, constructionEnergyDemand: 150, approvalModifier: { business: 2, political: 2, environmentalist: -2 } },
        { name: "Ampliació de Presa", cost: 2500, capacity: 700, buildTime: 6, co2: 0, upkeep: 20, constructionEnergyDemand: 250, approvalModifier: { business: 3, political: 3, environmentalist: -4 } },
        { name: "Nova Presa al Pirineu", cost: 4000, capacity: 1100, buildTime: 8, co2: 0, upkeep: 30, constructionEnergyDemand: 400, approvalModifier: { business: 4, political: 4, environmentalist: -8, citizen: -2 } }
    ],
    [EnergySource.Nuclear]: [
        { name: "Mini-reactor Nuclear (SMR)", cost: 3500, capacity: 300, buildTime: 6, co2: 0, upkeep: 40, constructionEnergyDemand: 200, approvalModifier: { business: 5, political: 2, environmentalist: -10, citizen: -5 } },
        { name: "Central Nuclear Mitjana", cost: 6000, capacity: 1100, buildTime: 8, co2: 0, upkeep: 120, constructionEnergyDemand: 500, approvalModifier: { business: 8, political: 3, environmentalist: -15, citizen: -8 } },
        { name: "Gran Central Nuclear", cost: 9000, capacity: 1600, buildTime: 10, co2: 0, upkeep: 180, constructionEnergyDemand: 800, approvalModifier: { business: 10, political: 4, environmentalist: -20, citizen: -12 } }
    ],
    [EnergySource.Fossil]: [
        { name: "Cicle Combinat (Gas) Petit", cost: 500, capacity: 400, buildTime: 2, co2: 0.4, upkeep: 15, constructionEnergyDemand: 50, approvalModifier: { business: 4, environmentalist: -8 } },
        { name: "Cicle Combinat (Gas) Estàndard", cost: 800, capacity: 800, buildTime: 3, co2: 0.4, upkeep: 30, constructionEnergyDemand: 90, approvalModifier: { business: 5, environmentalist: -10, citizen: -2 } },
        { name: "Gran Central de Cicle Combinat", cost: 1200, capacity: 1200, buildTime: 4, co2: 0.4, upkeep: 45, constructionEnergyDemand: 130, approvalModifier: { business: 6, environmentalist: -12, citizen: -4, political: -2 } }
    ],
    [EnergySource.Biofuel]: [
        { name: "Planta de Biogàs Comarcal", cost: 300, capacity: 50, buildTime: 3, co2: 0.1, upkeep: 8, constructionEnergyDemand: 10, approvalModifier: { environmentalist: 1, business: 1, citizen: -1 } },
        { name: "Planta de Biomassa Estàndard", cost: 550, capacity: 100, buildTime: 4, co2: 0.1, upkeep: 15, constructionEnergyDemand: 25, approvalModifier: { environmentalist: 0, business: 2, citizen: -2 } },
        { name: "Gran Centre de Valorització", cost: 900, capacity: 180, buildTime: 5, co2: 0.1, upkeep: 25, constructionEnergyDemand: 40, approvalModifier: { environmentalist: -2, business: 3, citizen: -4 } }
    ],
    [EnergySource.EolicaMarina]: [
        { name: "Parc Eòlic Marí Experimental", cost: 2500, capacity: 400, buildTime: 6, co2: 0, upkeep: 40, constructionEnergyDemand: 200, approvalModifier: { business: 3, political: 2, environmentalist: 1 } },
        { name: "Parc Eòlic Marí Estàndard", cost: 4500, capacity: 800, buildTime: 8, co2: 0, upkeep: 75, constructionEnergyDemand: 350, approvalModifier: { business: 4, political: 3, environmentalist: 0, citizen: -2 } },
        { name: "Macroparc Eòlic Marí", cost: 7000, capacity: 1300, buildTime: 10, co2: 0, upkeep: 120, constructionEnergyDemand: 500, approvalModifier: { business: 5, political: 4, environmentalist: -2, citizen: -4 } }
    ],
    [EnergySource.Termosolar]: [
        { name: "Planta Termosolar Petita", cost: 1800, capacity: 150, buildTime: 5, co2: 0, upkeep: 25, constructionEnergyDemand: 100, approvalModifier: { business: 1, environmentalist: 4, political: 1 } },
        { name: "Planta Termosolar Estàndard", cost: 3000, capacity: 300, buildTime: 7, co2: 0, upkeep: 45, constructionEnergyDemand: 180, approvalModifier: { business: 2, environmentalist: 3, citizen: -1 } },
        { name: "Gran Complex Termosolar", cost: 5000, capacity: 500, buildTime: 9, co2: 0, upkeep: 70, constructionEnergyDemand: 300, approvalModifier: { business: 3, environmentalist: 2, citizen: -3 } }
    ]
};

export const PLANT_CONSTRUCTION_PROS_CONS: Record<EnergySource, { pros: string[]; cons: string[] }> = {
    [EnergySource.Solar]: {
        pros: ["Energia neta (0 CO₂).", "Cost de manteniment baix.", "Bona aprovació ciutadana i ecologista."],
        cons: ["Només produeix de dia.", "Rendiment molt baix a l'hivern.", "Ocupa molt de terreny."]
    },
    [EnergySource.Wind]: {
        pros: ["Energia neta (0 CO₂).", "Produeix de dia i de nit.", "Bon rendiment a l'hivern i primavera."],
        cons: ["Intermitent (depèn del vent).", "Impacte visual i sonor (impopular).", "Manteniment relativament car."]
    },
    [EnergySource.Hydro]: {
        pros: ["Energia neta i gestionable.", "Gran capacitat de producció.", "Molt fiable si hi ha aigua."],
        cons: ["Depèn de la pluja (vulnerable a sequeres).", "Impacte ambiental molt alt (preses).", "Cost i temps de construcció enormes."]
    },
    [EnergySource.Nuclear]: {
        pros: ["Potència massiva i constant (energia de base).", "No genera CO₂.", "Molt fiable."],
        cons: ["Extremadament cara de construir i mantenir.", "Molt impopular (risc i residus).", "Temps de construcció molt llarg."]
    },
    [EnergySource.Fossil]: {
        pros: ["Energia gestionable i fiable.", "Cost i temps de construcció baixos.", "Tecnologia coneguda (suport empresarial)."],
        cons: ["Genera moltíssimes emissions de CO₂.", "Depèn de preus de gas volàtils.", "Molt impopular entre ecologistes i ciutadans."]
    },
    [EnergySource.Biofuel]: {
        pros: ["Energia gestionable.", "Menys emissions de CO₂ que el gas.", "Pot aprofitar residus."],
        cons: ["Contaminant (menys que el gas).", "Pot generar conflictes per l'ús del sòl.", "Cost d'operació elevat."]
    },
    [EnergySource.EolicaMarina]: {
        pros: ["Potència massiva i més constant que la terrestre.", "No ocupa terreny a Catalunya.", "Energia neta."],
        cons: ["Cost de construcció i manteniment extremadament elevat.", "Tecnologia complexa.", "Pot afectar ecosistemes marins."]
    },
    [EnergySource.Termosolar]: {
        pros: ["Energia renovable i gestionable (pot produir de nit).", "No genera CO₂.", "Gran potencial tecnològic."],
        cons: ["Cost de construcció altíssim.", "Ocupa molt de terreny.", "Rendiment dependent del sol directe (poc eficient en dies ennuvolats)."]
    }
};

export const NEWS_ITEMS: NewsArticle[] = [
    { id: "news-1", headline: "El nou Conseller d'Energia pren possessió del càrrec", content: "En un acte solemne, [PLAYER_NAME] ha assumit avui la cartera d'Energia, prometent afrontar la transició energètica amb 'valentia i responsabilitat'.", category: NewsCategory.Political, turnGenerated: 0 },
    { id: "news-2", headline: "La patronal demana 'estabilitat i preus competitius' al nou govern", content: "El president de la principal patronal catalana ha reclamat al nou conseller mesures que garanteixin un subministrament elèctric fiable i a un cost raonable per a la indústria.", category: NewsCategory.Economic, turnGenerated: 0 },
    { id: "news-3", headline: "Grups ecologistes exigeixen un 'gir de 180 graus' en la política energètica", content: "Les principals organitzacions ecologistes del país han publicat un manifest demanant al nou govern l'abandonament definitiu dels combustibles fòssils i una aposta decidida per les renovables.", category: NewsCategory.Environmental, turnGenerated: 0 }
];

// FIX: Changed type from Record<string, any> to a more specific type.
export const REACTIVE_NEWS_TEMPLATES: Record<string, Record<EnergySource, { headline: string; content: string; category: NewsCategory; }[]>> = {
    build: {
        [EnergySource.Solar]: [
            { headline: "El govern aprova la construcció d'un nou parc solar", content: "El Conseller [PLAYER_NAME] ha anunciat la llum verda a un nou parc fotovoltaic. La mesura ha estat ben rebuda per grups ecologistes, tot i que algunes veus del territori expressen preocupació per l'ocupació del sòl.", category: NewsCategory.Environmental }
        ],
        [EnergySource.Wind]: [
            { headline: "Nou parc eòlic en marxa", content: "El govern de [PLAYER_NAME] ha iniciat els tràmits per a la construcció d'un nou parc eòlic. La decisió ha generat un debat sobre l'impacte paisatgístic a les zones rurals.", category: NewsCategory.Social }
        ],
        [EnergySource.Nuclear]: [
            { headline: "Polèmica decisió: El govern aposta per més energia nuclear", content: "En una controvertida roda de premsa, el Conseller [PLAYER_NAME] ha defensat la construcció d'una nova instal·lació nuclear per garantir l'estabilitat de la xarxa. L'anunci ha provocat una onada de protestes.", category: NewsCategory.Political }
        ],
        [EnergySource.Fossil]: [
            { headline: "El govern recorre al gas per garantir el subministrament", content: "Davant la necessitat de potència a curt termini, el Conseller [PLAYER_NAME] ha autoritzat una nova central de cicle combinat. La decisió ha estat durament criticada per l'oposició i els grups ecologistes.", category: NewsCategory.Political }
        ],
        [EnergySource.Hydro]: [
            { headline: "Inversió milionària en una nova infraestructura hidroelèctrica", content: "El govern de [PLAYER_NAME] ha anunciat un projecte a llarg termini per ampliar la capacitat hidroelèctrica del país, una decisió que ha obert el debat sobre l'impacte als ecosistemes fluvials.", category: NewsCategory.Environmental }
        ],
        [EnergySource.Biofuel]: [
            { headline: "Llum verda a una nova planta de biomassa", content: "El Conseller [PLAYER_NAME] ha defensat el projecte d'una nova planta de biomassa com una aposta per l'economia circular, tot i les crítiques d'alguns sectors que qüestionen les seves emissions.", category: NewsCategory.Economic }
        ],
        [EnergySource.EolicaMarina]: [
            { headline: "Projecte pioner: Catalunya tindrà un parc eòlic marí", content: "El Conseller [PLAYER_NAME] ha presentat el que considera 'un projecte estratègic de país', la construcció d'un parc eòlic al mar. La inversió serà una de les més grans de la legislatura.", category: NewsCategory.Technology }
        ],
        [EnergySource.Termosolar]: [
            { headline: "Aposta per la termosolar per emmagatzemar energia renovable", content: "El govern de [PLAYER_NAME] ha anunciat la construcció d'una planta termosolar, destacant la seva capacitat de generar electricitat fins i tot sense sol directe gràcies a l'emmagatzematge tèrmic.", category: NewsCategory.Technology }
        ],
    }
};

export const CONDITIONAL_NEWS_TEMPLATES: Record<string, { headline: string; content: string; category: NewsCategory; }> = {
    deficit: { headline: "Augmenta la preocupació pel dèficit energètic de Catalunya", content: "Experts adverteixen que la producció elèctrica del país és insuficient per cobrir la demanda, obligant a importar energia a preus elevats i posant en risc la competitivitat de la indústria.", category: NewsCategory.Economic },
    co2_warning: { headline: "La Unió Europea adverteix Catalunya per les seves altes emissions de CO₂", content: "Brussel·les ha enviat una comunicació formal al govern de [PLAYER_NAME], instant a prendre mesures urgents per reduir la contaminació si es volen evitar sancions econòmiques.", category: NewsCategory.International },
    co2_sanction: { headline: "Brussel·les sanciona Catalunya per incomplir els objectius climàtics", content: "La Comissió Europea ha imposat una multa milionària a Catalunya per no haver reduït les seves emissions de CO₂. La decisió suposa un cop dur per a les finances del govern de [PLAYER_NAME].", category: NewsCategory.International }
};

export const CO2_WARNING_THRESHOLD = 500000;
export const CO2_SANCTION_THRESHOLD = 700000;
export const CO2_PROTEST_THRESHOLD = 600000;

// FIX: Added definitions for missing GameEvent constants to resolve errors.
export const EU_WARNING_EVENT: GameEvent = {
    title: "Advertència de la Unió Europea",
    category: "Política i Societat",
    description: (d) => "Hem rebut una comunicació oficial de Brussel·les. Les nostres emissions de CO₂ han superat els límits permesos. Ens exigeixen un pla de xoc per reduir la contaminació o ens enfrontarem a sancions econòmiques.",
    decisions: [
        {
            text: "Ignorar l'advertència, la indústria és prioritària",
            explanation: (s, d) => "**Pros:** No s'atura l'activitat econòmica, el que agrada al sector empresarial (+5%).\n**Contres:** Ignorar Brussel·les és un risc enorme. Si no reduïm les emissions, la pròxima notícia serà una multa. Molt mala imatge internacional (Suport Polític -5%, Ecologistes -5%).\n**Conclusió:** Una decisió perillosa a llarg termini, només recomanable si no tens cap altra alternativa per mantenir l'economia.",
            effect: (s, m) => ({ approvalRatings: { ...s.approvalRatings, business: s.approvalRatings.business + (5 / m), political: s.approvalRatings.political - (5 * m), environmentalist: s.approvalRatings.environmentalist - (5 * m) } }),
            strategicAdvice: "Aquesta decisió et compra temps a canvi d'un risc futur molt alt. Prepara't per a una sanció si les teves emissions no baixen ràpidament."
        },
        {
            text: "Crear un pla per contaminar menys (Cost: 250 M€)",
            explanation: (s, d) => "**Pros:** Mostrem bona voluntat a Europa (Suport Polític +3%). La mesura és aplaudida pels ecologistes (+4%).\n**Contres:** Implementar el pla té un cost immediat (250 M€). L'empresariat es queixa de les noves regulacions (-3%).\n**Conclusió:** És la decisió responsable per evitar la multa, tot i que té un cost econòmic i un petit impacte en l'aprovació empresarial.",
            effect: (s, m) => ({ budget: s.budget - 250, approvalRatings: { ...s.approvalRatings, business: s.approvalRatings.business - (3 * m), political: s.approvalRatings.political + (3 / m), environmentalist: s.approvalRatings.environmentalist + (4 / m) } }),
            strategicAdvice: "Pagar ara et pot estalviar una multa molt més gran en el futur. És la decisió estratègicament més segura."
        }
    ]
};

export const EU_SANCTION_EVENT: GameEvent = {
    title: "Sanció de la Unió Europea",
    category: "Política i Societat",
    description: (d) => "És oficial. La Comissió Europea ens ha imposat una multa per l'excés continuat d'emissions de CO₂. La sanció és severa i ha de ser pagada immediatament. La nostra reputació internacional està per terra.",
    decisions: [
        {
            text: "Acceptar la multa i pagar (Cost: 1.500 M€)",
            explanation: (s, d) => "**Pros:** Resolem la crisi diplomàtica immediatament.\n**Contres:** La pèrdua de 1.500 M€ és un cop duríssim per al pressupost. La teva gestió queda en entredit (TOTS -5%).\n**Conclusió:** Una decisió inevitable que demostra el fracàs de la teva política climàtica fins ara.",
            effect: (s, m) => ({
                budget: s.budget - 1500,
                approvalRatings: {
                    citizen: s.approvalRatings.citizen - (5 * m),
                    business: s.approvalRatings.business - (5 * m),
                    political: s.approvalRatings.political - (5 * m),
                    environmentalist: s.approvalRatings.environmentalist - (5 * m),
                }
            }),
            strategicAdvice: "Aquesta multa és el resultat d'ignorar les advertències. A partir d'ara, reduir el CO₂ ha de ser la teva màxima prioritat per evitar futures sancions."
        }
    ]
};

export const CLIMATE_PROTEST_EVENT: GameEvent = {
    title: "Manifestació Massiva pel Clima",
    category: "Política i Societat",
    description: (d) => "Milers de persones, convocades per organitzacions ecologistes, han sortit als carrers de Barcelona per protestar contra la teva política energètica. Acusen el govern d'inacció davant l'emergència climàtica.",
    decisions: [
        {
            text: "Ignorar la protesta",
            explanation: (s,d) => "**Pros:** No té cap cost econòmic.\n**Contres:** La teva imatge es veu molt danyada. Se't percep com un governant autoritari i poc dialogant (Ciutadans -5%, Ecologistes -8%, Polítics -3%).\n**Conclusió:** Una opció que et pot estalviar diners a curt termini, però que enfonsa la teva credibilitat i popularitat.",
            effect: (s, m) => ({ approvalRatings: { ...s.approvalRatings, citizen: s.approvalRatings.citizen - (5 * m), environmentalist: s.approvalRatings.environmentalist - (8 * m), political: s.approvalRatings.political - (3 * m) } }),
            strategicAdvice: "Ignorar la veu del carrer sol tenir conseqüències greus. Aquesta decisió pot accelerar una crisi de govern si la teva aprovació ja és baixa."
        },
        {
            text: "Reunir-se amb els líders i prometre més inversions verdes (Cost: 500 M€)",
            explanation: (s,d) => "**Pros:** Calmes la protesta i la teva imatge millora (Ciutadans +3%, Ecologistes +6%, Polítics +2%).\n**Contres:** Et compromet a una inversió immediata de 500 M€ en projectes verds.\n**Conclusió:** Una inversió en la teva imatge i en el futur del planeta, però que té un impacte directe en el teu pressupost actual.",
            effect: (s, m) => ({ budget: s.budget - 500, approvalRatings: { ...s.approvalRatings, citizen: s.approvalRatings.citizen + (3 / m), environmentalist: s.approvalRatings.environmentalist + (6 / m), political: s.approvalRatings.political + (2 / m) } }),
            strategicAdvice: "És l'opció correcta si vols mantenir la pau social i demostrar el teu compromís amb el medi ambient, sempre que el teu pressupost ho permeti."
        }
    ]
};

export const AIRPORT_EXPANSION_EVENT: GameEvent = {
    title: "Projecte d'Ampliació de l'Aeroport del Prat",
    category: "Política i Societat",
    description: (d) => "El govern central i la patronal aeronàutica presenten un projecte per ampliar la tercera pista de l'aeroport, la qual cosa implicaria afectar l'espai natural protegit de La Ricarda. La pressió és enorme.",
    decisions: [
        {
            text: "Donar suport total a l'ampliació",
            explanation: (s,d) => "**Pros:** Suport massiu de l'empresariat (+10%), que ho veu com una oportunitat econòmica clau.\n**Contres:** Rebuig frontal dels ecologistes (-15%) i gran part de la ciutadania (-5%) per l'impacte mediambiental.\n**Conclusió:** Una decisió purament econòmica que sacrifica el capital mediambiental i social.",
            effect: (s, m) => ({ approvalRatings: { ...s.approvalRatings, business: s.approvalRatings.business + (10 / m), environmentalist: s.approvalRatings.environmentalist - (15 * m), citizen: s.approvalRatings.citizen - (5 * m) } }),
            strategicAdvice: "Aquesta opció et donarà un gran impuls empresarial, però pot crear una crisi ecologista i social molt difícil de gestionar."
        },
        {
            text: "Rebutjar l'ampliació i protegir La Ricarda",
            explanation: (s,d) => "**Pros:** Suport massiu dels ecologistes (+12%) i la ciutadania (+4%).\n**Contres:** Rebuig frontal de l'empresariat (-12%), que t'acusa de frenar el progrés. Tensió amb el govern central (Polítics -4%).\n**Conclusió:** Una decisió purament ecologista i social que sacrifica el suport empresarial.",
            effect: (s, m) => ({ approvalRatings: { ...s.approvalRatings, business: s.approvalRatings.business - (12 * m), environmentalist: s.approvalRatings.environmentalist + (12 / m), citizen: s.approvalRatings.citizen + (4 / m), political: s.approvalRatings.political - (4 * m) } }),
            strategicAdvice: "Aquesta opció et convertirà en un heroi per als ecologistes, però pot provocar una crisi econòmica si el sector empresarial et retira la confiança."
        },
        {
            text: "Ampliació Sostenible (amb Compensació Ecològica) (Cost: 1.200 M€)",
            explanation: (s,d) => "**Pros:** Una solució de consens que minimitza els danys. Cap grup s'enfada de manera extrema.\n**Contres:** És extremadament cara. Tothom queda una mica descontent: l'empresariat volia més (+2%), els ecologistes menys (-4%) i els ciutadans no entenen la despesa (-2%).\n**Conclusió:** La via del mig, que et permet evitar una crisi oberta a canvi d'un cost econòmic enorme i un desgast general.",
            effect: (s, m) => ({ budget: s.budget - 1200, approvalRatings: { ...s.approvalRatings, business: s.approvalRatings.business + (2 / m), environmentalist: s.approvalRatings.environmentalist - (4 * m), citizen: s.approvalRatings.citizen - (2 * m) } }),
            strategicAdvice: "És la decisió dels grans estadistes... o dels que no s'atreveixen a triar bàndol. Prepara la cartera."
        },
        {
            text: "Convocar un Referèndum Ciutadà",
            explanation: (s,d) => "**Pros:** Trasllades la responsabilitat a la ciutadania. Sembla una mesura molt democràtica (Polítics +5%).\n**Contres:** El resultat és imprevisible! La decisió final serà aleatòria entre les altres opcions, i hauràs d'acceptar-la amb totes les seves conseqüències.\n**Conclusió:** Una manera d'evitar el desgast directe de la decisió, però t'exposes a un resultat que potser no t'interessa gens.",
            effect: (s, m) => ({ approvalRatings: { ...s.approvalRatings, political: s.approvalRatings.political + (5 / m) } }),
            strategicAdvice: "Juga-te-la només si creus que qualsevol dels resultats possibles és acceptable per a la teva estratègia."
        }
    ]
};

export const CO2_REDUCTION_SUCCESS_EVENT: GameEvent = {
    title: "Reconeixement Internacional per la Reducció de CO₂",
    category: "Política i Societat",
    description: (d) => "La teva gestió ha donat fruits! Un informe de l'Agència Internacional de l'Energia destaca Catalunya com un exemple en la reducció d'emissions. La notícia ha tingut un gran ressò.",
    decisions: [
        {
            text: "Acceptar el reconeixement amb humilitat",
            explanation: (s,d) => "**Pros:** La teva reputació millora a tots els nivells (TOTS +5%).\n**Contres:** Cap.\n**Conclusió:** És el resultat d'una bona feina. Gaudeix de l'èxit.",
            effect: (s, m) => ({
                approvalRatings: {
                    citizen: s.approvalRatings.citizen + 5,
                    business: s.approvalRatings.business + 5,
                    political: s.approvalRatings.political + 5,
                    environmentalist: s.approvalRatings.environmentalist + 5,
                }
            }),
            strategicAdvice: "Aquest esdeveniment és una recompensa a una estratègia de descarbonització exitosa. Aprofita aquest impuls d'aprovació."
        }
    ]
};

export const BUSINESS_CRISIS_EVENT: GameEvent = {
    title: "Crisi: Fuga de Capitals",
    category: "Crisi Governamental",
    description: (d) => "La falta de confiança del sector empresarial ha arribat a un punt crític. Grans empreses anuncien que traslladen les seves seus fora de Catalunya, provocant una onada de pànic econòmic.",
    decisions: [
        {
            text: "Llançar un paquet d'incentius fiscals urgent (Cost: 1.800 M€)",
            explanation: (s,d) => "**Pros:** Atura la sagnia immediatament i recuperes part de la confiança empresarial (+15%).\n**Contres:** El cost per a les arques públiques és gairebé insostenible.\n**Conclusió:** Una mesura desesperada per evitar el col·lapse econòmic.",
            effect: (s, m) => ({ budget: s.budget - 1800, approvalRatings: { ...s.approvalRatings, business: s.approvalRatings.business + 15 } }),
            strategicAdvice: "Si no actues, l'economia es pot enfonsar. Aquesta decisió és cara, però pot ser l'única manera de salvar el teu mandat."
        },
        {
            text: "No cedir al 'xantatge' empresarial",
            explanation: (s,d) => "**Pros:** No gastes diners públics. Els ecologistes aplaudeixen la teva fermesa (+5%).\n**Contres:** L'economia entra en recessió. Els teus ingressos per impostos es redueixen permanentment un 30%. La confiança empresarial s'enfonsa del tot (-10%).\n**Conclusió:** Una decisió de principis que té conseqüències econòmiques devastadores.",
            effect: (s, m) => ({ taxRevenuePerTurn: s.taxRevenuePerTurn * 0.7, approvalRatings: { ...s.approvalRatings, business: s.approvalRatings.business - 10, environmentalist: s.approvalRatings.environmentalist + 5 } }),
            strategicAdvice: "Aquesta decisió pot portar-te a la bancarrota a llarg termini. Només és viable si ja tens un superàvit pressupostari enorme."
        }
    ]
};

export const ENVIRONMENTALIST_CRISIS_EVENT: GameEvent = {
    title: "Crisi: Ofensiva Legal Ecologista",
    category: "Crisi Governamental",
    description: (d) => "Les principals organitzacions ecologistes, fartes de la teva política, han llançat una ofensiva legal massiva. Han portat als tribunals tots els teus projectes energètics per defectes de forma mediambiental, amenaçant de paralitzar qualsevol nova construcció.",
    decisions: [
        {
            text: "Crear un fons de compensació mediambiental (Cost: 1.000 M€)",
            explanation: (s,d) => "**Pros:** Atura l'ofensiva legal i recuperes una mica de credibilitat ecologista (+10%).\n**Contres:** El cost és molt elevat.\n**Conclusió:** Pagar per la pau mediambiental. És una manera cara de resoldre una crisi que has creat tu.",
            effect: (s, m) => ({ budget: s.budget - 1000, approvalRatings: { ...s.approvalRatings, environmentalist: s.approvalRatings.environmentalist + 10 } }),
            strategicAdvice: "Si necessites continuar construint, aquesta és l'única opció. Assumeix el cost i intenta millorar la teva política ambiental."
        },
        {
            text: "Lluitar als tribunals",
            explanation: (s,d) => "**Pros:** No té cap cost econòmic inicial. Demostres fermesa (Suport Polític +3%).\n**Contres:** Els tribunals paralitzen cautelarment la construcció de TOTES les noves centrals durant 4 trimestres. L'enfrontament enfonsa encara més la teva relació amb els ecologistes (-8%).\n**Conclusió:** Una decisió que et bloqueja la capacitat de reacció durant un any sencer.",
            effect: (s, m) => ({ constructionBans: [...s.constructionBans, { source: EnergySource.Solar, duration: 4 }, { source: EnergySource.Wind, duration: 4 }, { source: EnergySource.Hydro, duration: 4 }, { source: EnergySource.Fossil, duration: 4 }, { source: EnergySource.Nuclear, duration: 4 }, { source: EnergySource.Biofuel, duration: 4 }, { source: EnergySource.EolicaMarina, duration: 4 }, { source: EnergySource.Termosolar, duration: 4 }], approvalRatings: { ...s.approvalRatings, environmentalist: s.approvalRatings.environmentalist - 8, political: s.approvalRatings.political + 3 } }),
            strategicAdvice: "Aquesta decisió pot ser fatal si tens un dèficit energètic, ja que no podràs construir res per solucionar-lo. Molt arriscat."
        }
    ]
};

export const POLITICAL_CRISIS_EVENT: GameEvent = {
    title: "Crisi: Moció de Censura",
    category: "Crisi Governamental",
    description: (d) => "Has perdut la confiança de la cambra. El teu suport polític s'ha desplomat i l'oposició ha presentat una moció de censura per forçar la teva dimissió.",
    decisions: [
        {
            text: "Negociar suports a canvi de concessions (Cost: 750 M€)",
            explanation: (s,d) => "**Pros:** Superes la moció i salves el teu lloc, recuperant part del suport polític (+15%).\n**Contres:** El cost de les negociacions és molt alt.\n**Conclusió:** Compres la teva supervivència política. És car, però et permet continuar al càrrec.",
            effect: (s, m) => ({ budget: s.budget - 750, approvalRatings: { ...s.approvalRatings, political: s.approvalRatings.political + 15 } }),
            strategicAdvice: "Si creus que pots remuntar la situació, aquesta inversió pot valer la pena. Si no, només estàs allargant l'agonia."
        },
        {
            text: "Sotmetre's a la votació sense negociar",
            explanation: (s,d) => "**Pros:** No gastes diners i mostres integritat.\n**Contres:** Perds la votació. La teva autoritat s'enfonsa, provocant una pèrdua de confiança generalitzada (Ciutadans -10%, Empresaris -10%, Polítics -5%).\n**Conclusió:** Un suïcidi polític. La pèrdua d'aprovació és tan gran que et pot costar la partida.",
            effect: (s, m) => ({ approvalRatings: { ...s.approvalRatings, citizen: s.approvalRatings.citizen - 10, business: s.approvalRatings.business - 10, political: s.approvalRatings.political - 5 } }),
            strategicAdvice: "Aquesta decisió és gairebé sempre una mala idea, a menys que estiguis absolutament segur que pots sobreviure a una caiguda massiva d'aprovació."
        }
    ]
};

export const CITIZEN_CRISIS_EVENT: GameEvent = {
    title: "Crisi: Vaga General",
    category: "Crisi Governamental",
    description: (d) => "El descontentament social ha esclatat. Els sindicats majoritaris han convocat una Vaga General que ha paralitzat el país. Exigeixen mesures socials urgents per compensar el cost de la transició energètica.",
    decisions: [
        {
            text: "Negociar un paquet de mesures socials (Cost: 1.200 M€)",
            explanation: (s,d) => "**Pros:** Atura la vaga i recuperes la confiança de la ciutadania (+15%).\n**Contres:** Un cost pressupostari enorme.\n**Conclusió:** Cedeixes a les demandes populars per restaurar la pau social.",
            effect: (s, m) => ({ budget: s.budget - 1200, approvalRatings: { ...s.approvalRatings, citizen: s.approvalRatings.citizen + 15 } }),
            strategicAdvice: "És la via més ràpida per resoldre la crisi, però has de valorar si el teu pressupost ho pot suportar."
        },
        {
            text: "Aguantar el pols i no cedir",
            explanation: (s,d) => "**Pros:** No gastes diners. Demostres fermesa (Empresariat +4%).\n**Contres:** El país es paralitza. La vaga fa caure l'activitat econòmica, reduint els teus ingressos per impostos un 20% durant 2 trimestres. La ciutadania s'enfada encara més (-10%).\n**Conclusió:** Una decisió autoritària que pot tenir greus conseqüències econòmiques i socials.",
            effect: (s, m) => ({ temporaryDemandModifier: { multiplier: 0.8, duration: 2 }, approvalRatings: { ...s.approvalRatings, citizen: s.approvalRatings.citizen - 10, business: s.approvalRatings.business + 4 } }),
            strategicAdvice: "La reducció d'ingressos pot ser pitjor que el cost del paquet social. A més, la pèrdua d'aprovació et pot apropar al límit de la derrota."
        }
    ]
};

// FIX: Added definitions for more missing GameEvent constants.
export const ONSHORE_TOURISM_BOOM_EVENT: GameEvent = {
    title: "Onada de Turisme Rècord",
    category: "Economia i Mercat",
    description: (d) => "Un estiu excepcionalment bo ha portat una onada de turisme sense precedents. Els hotels estan plens i el consum es dispara, però la demanda energètica, especialment per l'aire acondicionat, està al límit.",
    allowedQuarters: [Quarter.Q2],
    minTurn: 4,
    decisions: [
        {
            text: "Celebrar l'èxit i assumir el cost energètic",
            explanation: (s,d) => "**Pros:** La imatge del govern es veu reforçada per l'èxit turístic (Empresaris +4%, Ciutadans +2%).\n**Contres:** La demanda energètica base puja un 10% aquest trimestre, posant la xarxa sota una pressió enorme.\n**Conclusió:** Una aposta arriscada. Si tens superàvit energètic, és una bona notícia. Si no, pot portar-te al dèficit.",
            effect: (s, m) => ({ temporaryDemandModifier: { multiplier: 1.10, duration: 1 }, approvalRatings: { ...s.approvalRatings, business: s.approvalRatings.business + 4, citizen: s.approvalRatings.citizen + 2 } }),
            strategicAdvice: "Valora bé la teva capacitat de producció. Un 10% de demanda extra és molt si ja vas just."
        },
        {
            text: "Llançar campanya de conscienciació per a l'estalvi",
            explanation: (s,d) => "**Pros:** Es mitiga l'augment de la demanda. L'esforç és apreciat pels ecologistes (+3%).\n**Contres:** La mesura és vista com una limitació per l'empresariat (-3%). Requereix una petita inversió (50 M€).\n**Conclusió:** Una opció conservadora per protegir la xarxa elèctrica si no estàs segur de poder cobrir la demanda.",
            effect: (s, m) => ({ budget: s.budget - 50, approvalRatings: { ...s.approvalRatings, business: s.approvalRatings.business - 3, environmentalist: s.approvalRatings.environmentalist + 3 } }),
            strategicAdvice: "És l'opció segura si el teu balanç energètic és ajustat. Sacrifiques una mica d'aprovació empresarial per estabilitat."
        }
    ]
};

export const EUROPEAN_MARKET_VOLATILITY_EVENT: GameEvent = {
    title: "Volatilitat Extrema al Mercat Europeu",
    category: "Economia i Mercat",
    description: (d) => "Una crisi geopolítica a Europa ha disparat la volatilitat dels preus de l'energia. Això afecta directament el cost d'importar electricitat quan tens dèficit i el benefici de vendre'n quan tens excedent.",
    minTurn: 6,
    decisions: [
        {
            text: "Mantenir-se exposat al mercat lliure",
            explanation: (s,d) => "**Pros:** No hi ha cap cost inicial. Si tens un gran superàvit, els beneficis per vendre energia poden ser enormes (+50% al preu de venda).\n**Contres:** Si tens dèficit, el cost d'importar energia es duplica (x2), el que pot ser devastador per al pressupost. L'empresariat es preocupa per la inestabilitat (-3%).\n**Conclusió:** Una aposta d'alt risc. Només recomanable si tens una sobirania energètica totalment garantida.",
            effect: (s, m) => ({ surplusSalePriceMultiplier: s.surplusSalePriceMultiplier * 1.5, importEnergyPriceMultiplier: s.importEnergyPriceMultiplier * 2.0, approvalRatings: { ...s.approvalRatings, business: s.approvalRatings.business - 3 } }),
            strategicAdvice: "Aquesta decisió pot guanyar o perdre la partida. Analitza el teu balanç energètic amb molta cura."
        },
        {
            text: "Negociar un preu fix temporal (Cost: 200 M€)",
            explanation: (s,d) => "**Pros:** T'aïlles de la volatilitat, mantenint els preus de compra i venda estables. Dona una imatge de solvència (+3% suport polític).\n**Contres:** Té un cost diplomàtic i financer (200 M€). Renuncies a la possibilitat de beneficis extraordinaris si tens excedent.\n**Conclusió:** L'opció segura que et protegeix del pitjor escenari a canvi d'un cost i de renunciar a guanys potencials.",
            effect: (s, m) => ({ budget: s.budget - 200, approvalRatings: { ...s.approvalRatings, political: s.approvalRatings.political + 3 } }),
            strategicAdvice: "Si depens de les importacions o el teu marge és estret, aquesta és la decisió prudent per protegir les teves finances."
        }
    ]
};



// FIX: Added the missing export for CONSTRUCTION_TRIGGERED_EVENTS
export const ARCHAEOLOGICAL_DISCOVERY_EVENT: GameEvent = {
    title: "Troballa Arqueològica Inesperada",
    category: "Reacció a Construcció",
    description: (d) => "Durant les excavacions per a una nova presa, s'han trobat unes restes arqueològiques d'un valor incalculable. Els arqueòlegs demanen aturar les obres immediatament.",
    decisions: [
        {
            text: "Aturar les obres i reubicar el projecte (Cost: +50% al cost original)",
            explanation: (s, d) => "**Pros:** La decisió és aplaudida per la ciutadania (+5%) i el suport polític (+3%) per la protecció del patrimoni.\n**Contres:** El cost de la central es dispara un 50%, un cop molt dur per al pressupost.\n**Conclusió:** Una decisió culturalment responsable però econòmicament dolorosa.",
            effect: (s, m) => ({ /* This needs complex logic in App.tsx */ approvalRatings: { ...s.approvalRatings, citizen: s.approvalRatings.citizen + (5 / m), political: s.approvalRatings.political + (3 / m) } }),
            strategicAdvice: "Si el teu pressupost és ajustat, aquesta opció pot ser inviable. Valora si pots assumir el sobrecost."
        },
        {
            text: "Continuar les obres. El progrés no es pot aturar.",
            explanation: (s, d) => "**Pros:** No hi ha cap sobrecost. L'empresariat aplaudeix la teva decisió (+4%).\n**Contres:** Ets acusat de 'bàrbar'. La teva imatge es desploma (Ciutadans -8%, Polítics -5%, Ecologistes -3%).\n**Conclusió:** Prioritzes l'economia per sobre del patrimoni, amb un cost polític i social molt alt.",
            effect: (s, m) => ({ approvalRatings: { ...s.approvalRatings, citizen: s.approvalRatings.citizen - (8 * m), political: s.approvalRatings.political - (5 * m), environmentalist: s.approvalRatings.environmentalist - (3 * m), business: s.approvalRatings.business + (4 / m) } }),
            strategicAdvice: "Aquesta decisió et pot estalviar molts diners, però la pèrdua d'aprovació pot desestabilitzar el teu govern."
        }
    ]
};

export const NUCLEAR_SAFETY_CONCERNS_EVENT: GameEvent = {
    title: "Preocupació per la Seguretat Nuclear",
    category: "Reacció a Construcció",
    description: (d) => "Un informe filtrat a la premsa sobre la nova central nuclear en construcció suggereix que no s'estan seguint tots els protocols de seguretat internacionals. L'alarma social és màxima.",
    decisions: [
        {
            text: "Invertir en una auditoria externa i millores (Cost: 800 M€)",
            explanation: (s,d) => "**Pros:** Calmes la por de la gent i recuperes la confiança (Ciutadans +8%, Polítics +3%).\n**Contres:** El cost de les millores de seguretat és molt elevat.\n**Conclusió:** Una inversió en seguretat i tranquil·litat social.",
            effect: (s,m) => ({ budget: s.budget - 800, approvalRatings: { ...s.approvalRatings, citizen: s.approvalRatings.citizen + (8 / m), political: s.approvalRatings.political + (3 / m) } }),
            strategicAdvice: "La seguretat nuclear no és negociable. Aquesta és l'opció més responsable, si te la pots permetre."
        },
        {
            text: "Negar les acusacions i continuar com fins ara",
            explanation: (s,d) => "**Pros:** No té cap cost econòmic.\n**Contres:** La gent no et creu. L'aprovació ciutadana s'enfonsa (-12%) i la teva credibilitat política també (-5%). El risc d'un futur accident augmenta.\n**Conclusió:** Una decisió temerària que et pot estalviar diners a canvi d'un risc enorme i una gran pèrdua de confiança.",
            effect: (s,m) => ({ nuclearMaintenanceRisk: true, approvalRatings: { ...s.approvalRatings, citizen: s.approvalRatings.citizen - (12 * m), political: s.approvalRatings.political - (5 * m) } }),
            strategicAdvice: "Aquesta decisió deixa una 'bomba de rellotgeria' a la teva xarxa. Un futur esdeveniment d'avaria nuclear podria ser catastròfic."
        }
    ]
};

export const RADIOACTIVE_WASTE_EVENT: GameEvent = {
    title: "El Cementiri de Residus Nuclears està Ple",
    category: "Reacció a Construcció",
    description: (d) => "El magatzem temporal de residus radioactius de les teves centrals nuclears ha arribat a la seva capacitat màxima. Hem de decidir què fer amb els nous residus que es generin.",
    decisions: [
         {
            text: "Construir un nou magatzem (Cost: 2.000 M€)",
            explanation: (s,d) => "**Pros:** Soluciona el problema a llarg termini i permet que les nuclears segueixin funcionant.\n**Contres:** És una inversió massiva. La construcció del nou magatzem genera rebuig (Ciutadans -4%, Ecologistes -6%).\n**Conclusió:** Una solució definitiva però molt cara i impopular.",
            effect: (s,m) => ({ budget: s.budget - 2000, approvalRatings: { ...s.approvalRatings, citizen: s.approvalRatings.citizen - (4 * m), environmentalist: s.approvalRatings.environmentalist - (6*m) } }),
            strategicAdvice: "Si apostes per l'energia nuclear, aquesta inversió és gairebé obligatòria en algun moment."
        },
        {
            text: "Pagar a França per a que gestioni els residus",
            explanation: (s,d) => "**Pros:** No has de construir res a Catalunya, el que evita protestes locals.\n**Contres:** Crea una nova despesa recurrent cada trimestre (-150 M€/trimestre) i et fa dependent d'un altre país (Polítics -4%).\n**Conclusió:** Una solució 'ràpida' que es converteix en una sagnia econòmica constant.",
            effect: (s,m) => ({ recurrentUpkeep: s.recurrentUpkeep + 150, approvalRatings: { ...s.approvalRatings, political: s.approvalRatings.political - (4 * m) } }),
            strategicAdvice: "Aquesta opció pot semblar barata a curt termini, però a la llarga pot costar-te més que el magatzem. Fes números."
        }
    ]
};

export const SOLAR_PROTEST_EVENT: GameEvent = {
    title: "Protestes per l'Ocupació de Sòl Agrícola",
    category: "Reacció a Construcció",
    description: (d) => "Agricultors i grups ecologistes s'han unit per protestar contra l'expansió dels parcs solars, argumentant que estan ocupant sòl agrícola fèrtil i danyant la sobirania alimentària.",
    decisions: [
        {
            text: "Crear un fons de compensació per als agricultors (Cost: 400 M€)",
            explanation: (s,d) => "**Pros:** Calmes les protestes i millores la teva relació amb el sector (Ciutadans +3%, Ecologistes +2%).\n**Contres:** Té un cost econòmic directe.\n**Conclusió:** Una inversió en pau social al territori.",
            effect: (s,m) => ({ budget: s.budget - 400, approvalRatings: { ...s.approvalRatings, citizen: s.approvalRatings.citizen + (3 / m), environmentalist: s.approvalRatings.environmentalist + (2 / m) } }),
            strategicAdvice: "Si l'energia solar és una part important de la teva estratègia, mantenir una bona relació amb el territori és clau."
        },
        {
            text: "Prioritzar la producció energètica",
            explanation: (s,d) => "**Pros:** No té cap cost. L'empresariat recolza la teva decisió (+2%).\n**Contres:** La teva imatge es veu danyada, especialment al món rural (Ciutadans -5%, Ecologistes -4%).\n**Conclusió:** Una decisió que et pot estalviar diners però que et genera enemics al territori.",
            effect: (s,m) => ({ approvalRatings: { ...s.approvalRatings, citizen: s.approvalRatings.citizen - (5 * m), environmentalist: s.approvalRatings.environmentalist - (4 * m), business: s.approvalRatings.business + (2 / m) } }),
            strategicAdvice: "Vigila, una aprovació ciutadana baixa pot portar-te a una Crisi de Vaga General."
        }
    ]
};

export const WIND_PROTEST_EVENT: GameEvent = {
    title: "Rebuig Veïnal a un Parc Eòlic",
    category: "Reacció a Construcció",
    description: (d) => "Una plataforma veïnal de la comarca on s'està construint un parc eòlic ha iniciat una campanya molt activa en contra, al·legant impacte paisatgístic i acústic. Amenacen amb bloquejar les obres.",
    decisions: [
        {
            text: "Negociar i invertir en millores per al municipi (Cost: 300 M€)",
            explanation: (s,d) => "**Pros:** Resol el conflicte i les obres continuen. Millora la teva imatge com a govern dialogant (Ciutadans +4%, Polítics +2%).\n**Contres:** La inversió no estava pressupostada.\n**Conclusió:** Una solució pactada que et costa diners però et garanteix l'estabilitat del projecte.",
            effect: (s,m) => ({ budget: s.budget - 300, approvalRatings: { ...s.approvalRatings, citizen: s.approvalRatings.citizen + (4 / m), political: s.approvalRatings.political + (2 / m) } }),
            strategicAdvice: "Mantenir una bona relació amb els municipis afectats per les infraestructures és una bona inversió a llarg termini."
        },
        {
            text: "Imposar el projecte. L'interès general preval.",
            explanation: (s,d) => "**Pros:** No gastes diners.\n**Contres:** La teva aprovació ciutadana cau en picat (-7%). El conflicte pot afectar el suport polític (-3%).\n**Conclusió:** Una decisió autoritària que et pot sortir molt cara en termes d'aprovació.",
            effect: (s,m) => ({ approvalRatings: { ...s.approvalRatings, citizen: s.approvalRatings.citizen - (7 * m), political: s.approvalRatings.political - (3 * m) } }),
            strategicAdvice: "Compte amb aquesta decisió. Una caiguda forta d'aprovació et pot deixar molt vulnerable a futures crisis."
        }
    ]
};

export const BIOMASS_PROTEST_EVENT: GameEvent = {
    title: "Queixes per les Olors d'una Planta de Biomassa",
    category: "Reacció a Construcció",
    description: (d) => "Els veïns propers a una de les teves plantes de biomassa es queixen de males olors constants i han començat a protestar. Demanen una inversió en nous filtres i sistemes de tractament.",
    decisions: [
        {
            text: "Instal·lar els nous filtres (Cost: 150 M€)",
            explanation: (s,d) => "**Pros:** Resol el problema i la ciutadania ho agraeix (+4%).\n**Contres:** Té un cost moderat.\n**Conclusió:** Una inversió necessària per a la convivència.",
            effect: (s,m) => ({ budget: s.budget - 150, approvalRatings: { ...s.approvalRatings, citizen: s.approvalRatings.citizen + (4 / m) } }),
            strategicAdvice: "Ignorar les queixes veïnals rarament és una bona estratègia. Aquesta inversió sol ser rendible en termes d'aprovació."
        },
        {
            text: "Argumentar que la planta compleix la normativa",
            explanation: (s,d) => "**Pros:** Estalvies diners.\n**Contres:** La teva aprovació ciutadana baixa (-5%) per la teva falta de sensibilitat.\n**Conclusió:** T'aferres a la legalitat però perds el suport de la gent.",
            effect: (s,m) => ({ approvalRatings: { ...s.approvalRatings, citizen: s.approvalRatings.citizen - (5 * m) } }),
            strategicAdvice: "Aquesta opció és arriscada. Una pèrdua de 5 punts d'aprovació pot semblar poc, però es van acumulant."
        }
    ]
};

export const CONSTRUCTION_TRIGGERED_EVENTS: Partial<Record<EnergySource, { event: GameEvent; chance: number }[]>> = {
    [EnergySource.Hydro]: [{ event: ARCHAEOLOGICAL_DISCOVERY_EVENT, chance: 0.3 }],
    [EnergySource.Nuclear]: [{ event: NUCLEAR_SAFETY_CONCERNS_EVENT, chance: 0.4 }, { event: RADIOACTIVE_WASTE_EVENT, chance: 0.25 }],
    [EnergySource.Solar]: [{ event: SOLAR_PROTEST_EVENT, chance: 0.35 }],
    [EnergySource.Wind]: [{ event: WIND_PROTEST_EVENT, chance: 0.4 }],
    [EnergySource.Biofuel]: [{ event: BIOMASS_PROTEST_EVENT, chance: 0.5 }],
};

export const INITIAL_GAME_STATE: GameState = {
    playerName: 'Anònim',
    budget: 13000,
    approvalRatings: { citizen: 60, business: 60, political: 60, environmentalist: 60 },
    overallApproval: 60,
    co2Emissions: 450000,
    totalProduction: 0,
    totalDemand: 7000, // Reduced from 8500
    baseDemand: 7000, // Reduced from 8000
    hydroModifier: 1.0,
    energyDeficit: 0,
    hasReceivedEUWarning: false,
    hasTriggeredClimateProtest: false,
    hasTriggeredCO2ReductionEvent: false,
    powerPlants: [
        { id: 1, name: 'Ascó I', type: EnergySource.Nuclear, capacity: 1032, upkeep: 100, operationalTurn: 0, isActive: true, outputPercentage: 1, isForcedOffline: false, isDecommissioned: false, constructionStartTurn: -1 },
        { id: 2, name: 'Ascó II', type: EnergySource.Nuclear, capacity: 1027, upkeep: 100, operationalTurn: 0, isActive: true, outputPercentage: 1, isForcedOffline: false, isDecommissioned: false, constructionStartTurn: -1 },
        { id: 3, name: 'Vandellòs II', type: EnergySource.Nuclear, capacity: 1087, upkeep: 110, operationalTurn: 0, isActive: true, outputPercentage: 1, isForcedOffline: false, isDecommissioned: false, constructionStartTurn: -1 },
        { id: 4, name: 'Cicle Combinat Tarragona', type: EnergySource.Fossil, capacity: 800, upkeep: 30, operationalTurn: 0, isActive: true, outputPercentage: 1, isForcedOffline: false, isDecommissioned: false, constructionStartTurn: -1 },
        { id: 5, name: 'Cicle Combinat Besòs', type: EnergySource.Fossil, capacity: 800, upkeep: 30, operationalTurn: 0, isActive: true, outputPercentage: 1, isForcedOffline: false, isDecommissioned: false, constructionStartTurn: -1 },
        { id: 6, name: 'Preses del Pirineu', type: EnergySource.Hydro, capacity: 2500, upkeep: 50, operationalTurn: 0, isActive: true, outputPercentage: 1, isForcedOffline: false, isDecommissioned: false, constructionStartTurn: -1 },
        { id: 7, name: 'Parcs Eòlics Terres de l\'Ebre', type: EnergySource.Wind, capacity: 1200, upkeep: 36, operationalTurn: 0, isActive: true, outputPercentage: 1, isForcedOffline: false, isDecommissioned: false, constructionStartTurn: -1 },
        { id: 8, name: 'Parcs Solars de Ponent', type: EnergySource.Solar, capacity: 1000, upkeep: 10, operationalTurn: 0, isActive: true, outputPercentage: 1, isForcedOffline: false, isDecommissioned: false, constructionStartTurn: -1 },
    ],
    costModifiers: [],
    constructionBans: [
        { source: EnergySource.EolicaMarina, duration: 'permanent' },
        { source: EnergySource.Termosolar, duration: 'permanent' }
    ],
    capacityModifiers: [],
    newsFeed: NEWS_ITEMS,
    lastAction: null,
    constructionDemandModifiers: [],
    triggeredEventTitles: [],
    history: [],
    gameStatus: GameStatus.Playing,
    majorDecisions: [],
    scheduledEvent: null,
    hasInvestedInBatteries: false,
    hasInvestedInHydrogen: false,
    nuclearMaintenanceRisk: false,
    surplusSalePriceMultiplier: 0.5,
    importEnergyPriceMultiplier: 1.5,
    recurrentUpkeep: 0,
    marketPricePerMW: BASE_MARKET_PRICE_PER_MW,
    difficulty: DifficultyLevel.Medium,
    penaltyMultiplier: 0.9,
    currentTurnFinancialEvents: [],
    currentTurnApprovalModifiers: [],
    policies: [],
    plantBuiltThisTurn: false,
    displayedPolicyIds: [],
    taxRevenuePerTurn: TAX_REVENUE_PER_TURN,
    upkeepModifiers: [],
    temporaryDemandModifier: null,
    hasTriggeredBusinessCrisis: false,
    hasTriggeredEnvironmentalistCrisis: false,
    hasTriggeredPoliticalCrisis: false,
    hasTriggeredCitizenCrisis: false,
    currentClimateEvent: null,
    startYear: 2024,
    startQuarterIndex: 0,
};
export const SEQUERA_HIST_RICA_EVENT: GameEvent = {
    title: "Sequera Històrica",
    category: "Clima i Desastres",
    description: (d) => "La manca de pluges prolongada ha deixat els embassaments sota mínims, posant en risc la producció de les centrals hidroelèctriques i el subministrament d'aigua a la indústria.",
    decisions: [
        {
            text: "Decretar restriccions d'aigua a la indústria",
            explanation: (s, d) => "**Pros:** Els ecologistes aplaudeixen la mesura per protegir els recursos hídrics (+2%).\n**Contres:** Té un cost de gestió de 100 M€. La indústria es veu molt afectada, reduint l'aprovació empresarial (-5%).\n**Conclusió:** Una mesura impopular però necessària per reduir la demanda un 5% durant 2 trimestres.",
            effect: (s, m) => ({ budget: s.budget + (-100), approvalRatings: { ...s.approvalRatings, business: s.approvalRatings.business + (-5 * (-5 > 0 ? (1/m) : m)), environmentalist: s.approvalRatings.environmentalist + (2 * (2 > 0 ? (1/m) : m)) }, temporaryDemandModifier: { multiplier: 0.95, duration: 2 } }),
            strategicAdvice: "Considera els pros i contres abans de decidir."
        },
        {
            text: "Assumir el cost de la baixa producció hidràulica",
            explanation: (s, d) => "**Pros:** No té cap cost directe i la indústria pot continuar operant.\n**Contres:** La ciutadania (-3%) i els polítics (-2%) critiquen la inacció davant la crisi hídrica.\n**Conclusió:** Evites enfrontar-te a la indústria, però la teva imatge es deteriora i la producció hidràulica cau.",
            effect: (s, m) => ({ approvalRatings: { ...s.approvalRatings, citizen: s.approvalRatings.citizen + (-3 * (-3 > 0 ? (1/m) : m)), political: s.approvalRatings.political + (-2 * (-2 > 0 ? (1/m) : m)) } }),
            strategicAdvice: "Considera els pros i contres abans de decidir."
        },
    ]
};

export const VAGA_GENERAL_INDUSTRIAL_EVENT: GameEvent = {
    title: "Vaga General Industrial",
    category: "Economia i Mercat",
    description: (d) => "Els sindicats del sector industrial han convocat una vaga general per protestar contra els alts costos energètics que amenacen els llocs de treball.",
    decisions: [
        {
            text: "Mediar en el conflicte (Cost: 350 M€)",
            explanation: (s, d) => "**Pros:** La ciutadania (+5%) i l'empresariat (+2%) valoren positivament la teva intervenció.\n**Contres:** El paquet d'ajudes per aturar la vaga costa 350 M€.\n**Conclusió:** Compres la pau social a canvi d'un cost econòmic important.",
            effect: (s, m) => ({ budget: s.budget + (-350), approvalRatings: { ...s.approvalRatings, citizen: s.approvalRatings.citizen + (5 * (5 > 0 ? (1/m) : m)), business: s.approvalRatings.business + (2 * (2 > 0 ? (1/m) : m)) } }),
            strategicAdvice: "Considera els pros i contres abans de decidir."
        },
        {
            text: "No intervenir i esperar",
            explanation: (s, d) => "**Pros:** Estalvies diners públics al no intervenir.\n**Contres:** La vaga paralitza la indústria, reduint l'aprovació ciutadana (-8%) i empresarial (-5%).\n**Conclusió:** La demanda elèctrica cau un 15% durant 2 trimestres per l'aturada, però el desgast polític és enorme.",
            effect: (s, m) => ({ approvalRatings: { ...s.approvalRatings, citizen: s.approvalRatings.citizen + (-8 * (-8 > 0 ? (1/m) : m)), business: s.approvalRatings.business + (-5 * (-5 > 0 ? (1/m) : m)) }, temporaryDemandModifier: { multiplier: 0.85, duration: 2 } }),
            strategicAdvice: "Considera els pros i contres abans de decidir."
        },
    ]
};

export const CRISI_DE_MATERIALS_PER_A_RENOVABLES_EVENT: GameEvent = {
    title: "Crisi de Materials per a Renovables",
    category: "Economia i Mercat",
    description: (d) => "Una ruptura en les cadenes de subministrament globals ha provocat una escassetat de components clau per a la construcció de plaques solars i aerogeneradors.",
    decisions: [
        {
            text: "Assumir el sobrecost i continuar invertint",
            explanation: (s, d) => "**Pros:** Mantens el rumb de la transició energètica, guanyant suport polític (+2%).\n**Contres:** L'empresariat es queixa dels sobrecostos (-2%). El cost de construir centrals solars i eòliques augmenta un 25% durant 4 trimestres.\n**Conclusió:** Una decisió ferma per no aturar el progrés, però que encarirà molt les properes infraestructures.",
            effect: (s, m) => ({ approvalRatings: { ...s.approvalRatings, business: s.approvalRatings.business + (-2 * (-2 > 0 ? (1/m) : m)), political: s.approvalRatings.political + (2 * (2 > 0 ? (1/m) : m)) }, costModifiers: [...s.costModifiers, { source: EnergySource.Solar, multiplier: 1.25, duration: 4 }, { source: EnergySource.Wind, multiplier: 1.25, duration: 4 }] }),
            strategicAdvice: "Considera els pros i contres abans de decidir."
        },
        {
            text: "Aturar les inversions en renovables temporalment",
            explanation: (s, d) => "**Pros:** L'empresariat aprova la prudència financera (+2%).\n**Contres:** Els ecologistes critiquen durament l'aturada de la transició (-6%). No es podran construir centrals solars ni eòliques durant 2 trimestres.\n**Conclusió:** Protegeixes el pressupost a curt termini, però paralitzes el creixement de les energies netes.",
            effect: (s, m) => ({ approvalRatings: { ...s.approvalRatings, business: s.approvalRatings.business + (2 * (2 > 0 ? (1/m) : m)), environmentalist: s.approvalRatings.environmentalist + (-6 * (-6 > 0 ? (1/m) : m)) }, constructionBans: [...s.constructionBans, { source: EnergySource.Solar, duration: 2 }, { source: EnergySource.Wind, duration: 2 }] }),
            strategicAdvice: "Considera els pros i contres abans de decidir."
        },
    ]
};

export const PUJADA_DEL_PREU_DEL_GAS_NATURAL_EVENT: GameEvent = {
    title: "Pujada del Preu del Gas Natural",
    category: "Economia i Mercat",
    description: (d) => "Les tensions geopolítiques han disparat el preu del gas natural als mercats internacionals, amenaçant de disparar la factura elèctrica de la indústria.",
    decisions: [
        {
            text: "Subvencionar el preu per a la indústria (Cost: 600 M€)",
            explanation: (s, d) => "**Pros:** Salves la competitivitat de la indústria, guanyant molt suport empresarial (+5%).\n**Contres:** Té un cost massiu de 600 M€. Els ecologistes (-3%) i l'oposició (-2%) critiquen subvencionar els combustibles fòssils.\n**Conclusió:** Una mesura d'emergència molt cara per evitar el col·lapse industrial.",
            effect: (s, m) => ({ budget: s.budget + (-600), approvalRatings: { ...s.approvalRatings, business: s.approvalRatings.business + (5 * (5 > 0 ? (1/m) : m)), political: s.approvalRatings.political + (-2 * (-2 > 0 ? (1/m) : m)), environmentalist: s.approvalRatings.environmentalist + (-3 * (-3 > 0 ? (1/m) : m)) } }),
            strategicAdvice: "Considera els pros i contres abans de decidir."
        },
        {
            text: "No intervenir i deixar que el mercat actuï",
            explanation: (s, d) => "**Pros:** Els ecologistes aplaudeixen que no se subvencioni el gas (+3%).\n**Contres:** L'impacte en la factura enfonsa l'aprovació ciutadana (-5%) i empresarial (-5%). El manteniment de les centrals de gas augmenta un 50% durant 3 trimestres.\n**Conclusió:** Deixes que el mercat actuï, assumint un gran desgast social i un augment dels costos operatius.",
            effect: (s, m) => ({ approvalRatings: { ...s.approvalRatings, citizen: s.approvalRatings.citizen + (-5 * (-5 > 0 ? (1/m) : m)), business: s.approvalRatings.business + (-5 * (-5 > 0 ? (1/m) : m)), environmentalist: s.approvalRatings.environmentalist + (3 * (3 > 0 ? (1/m) : m)) }, upkeepModifiers: [...s.upkeepModifiers, { id: 'gas_price_hike', multiplier: 1.5, duration: 3 }] }),
            strategicAdvice: "Considera els pros i contres abans de decidir."
        },
    ]
};

export const INCENDI_FORESTAL_GEGANT_EVENT: GameEvent = {
    title: "Incendi Forestal Gegant",
    category: "Clima i Desastres",
    description: (d) => "Un incendi forestal de grans proporcions amenaça diverses zones boscoses. Les autoritats recomanen aturar les activitats forestals, incloent l'abastiment de les plantes de biomassa.",
    decisions: [
        {
            text: "Decretar l'aturada de les plantes de biomassa per risc",
            explanation: (s, d) => "**Pros:** Evites qualsevol risc addicional i mostres prudència.\n**Contres:** L'empresariat del sector forestal i energètic es queixa (-3%). S'atura la producció de totes les plantes de biomassa durant 1 trimestre.\n**Conclusió:** Poses la seguretat per davant de la producció, perdent capacitat de generació temporalment.",
            effect: (s, m) => ({ approvalRatings: { ...s.approvalRatings, business: s.approvalRatings.business + (-3 * (-3 > 0 ? (1/m) : m)) }, capacityModifiers: [...s.capacityModifiers, { source: EnergySource.Biofuel, multiplier: 0, duration: 1 }] }),
            strategicAdvice: "Considera els pros i contres abans de decidir."
        },
        {
            text: "Mantenir l'operativa amb mesures extremes de seguretat",
            explanation: (s, d) => "**Pros:** Mantens la producció d'energia de biomassa intacta.\n**Contres:** La decisió és vista com a temerària, enfonsant l'aprovació ciutadana (-4%), política (-2%) i ecologista (-3%).\n**Conclusió:** T'arrisques a una tragèdia per no perdre producció, amb un alt cost reputacional.",
            effect: (s, m) => ({ approvalRatings: { ...s.approvalRatings, citizen: s.approvalRatings.citizen + (-4 * (-4 > 0 ? (1/m) : m)), political: s.approvalRatings.political + (-2 * (-2 > 0 ? (1/m) : m)), environmentalist: s.approvalRatings.environmentalist + (-3 * (-3 > 0 ? (1/m) : m)) } }),
            strategicAdvice: "Considera els pros i contres abans de decidir."
        },
    ]
};

export const TEMPORAL_MAR_TIM_DEVASTADOR_EVENT: GameEvent = {
    title: "Temporal Marítim Devastador",
    category: "Clima i Desastres",
    description: (d) => "Un temporal històric ha colpejat la costa, causant danys severs a les infraestructures elèctriques properes al mar, especialment als parcs eòlics.",
    decisions: [
        {
            text: "Iniciar reparacions urgents (Cost: 450 M€)",
            explanation: (s, d) => "**Pros:** Mostres capacitat de reacció ràpida, guanyant suport polític (+2%). Les centrals tornen a operar ràpidament.\n**Contres:** La reparació d'emergència té un cost de 450 M€.\n**Conclusió:** Una acció ràpida i eficaç, però que suposa un cop dur per a les finances.",
            effect: (s, m) => ({ budget: s.budget + (-450), approvalRatings: { ...s.approvalRatings, political: s.approvalRatings.political + (2 * (2 > 0 ? (1/m) : m)) } }),
            strategicAdvice: "Considera els pros i contres abans de decidir."
        },
        {
            text: "Esperar a les ajudes de l'Estat",
            explanation: (s, d) => "**Pros:** Estalvies els diners de la reparació immediata.\n**Contres:** La inacció indigna a tothom: ciutadans (-4%), empresaris (-4%), polítics (-3%) i ecologistes (-2%). Les centrals eòliques produeixen un 50% menys durant 2 trimestres.\n**Conclusió:** L'estalvi a curt termini provoca una crisi de confiança i una pèrdua de producció prolongada.",
            effect: (s, m) => ({ approvalRatings: { ...s.approvalRatings, citizen: s.approvalRatings.citizen + (-4 * (-4 > 0 ? (1/m) : m)), business: s.approvalRatings.business + (-4 * (-4 > 0 ? (1/m) : m)), political: s.approvalRatings.political + (-3 * (-3 > 0 ? (1/m) : m)), environmentalist: s.approvalRatings.environmentalist + (-2 * (-2 > 0 ? (1/m) : m)) }, capacityModifiers: [...s.capacityModifiers, { source: EnergySource.Wind, multiplier: 0.5, duration: 2 }, { source: EnergySource.EolicaMarina, multiplier: 0.5, duration: 2 }] }),
            strategicAdvice: "Considera els pros i contres abans de decidir."
        },
    ]
};

export const HIVERN_ANORMALMENT_SUAU_EVENT: GameEvent = {
    title: "Hivern Anormalment Suau",
    category: "Clima i Desastres",
    description: (d) => "Les temperatures d'aquest hivern estan sent inusualment altes, la qual cosa ha reduït dràsticament la necessitat de calefacció a les llars.",
    decisions: [
        {
            text: "Celebrar l'estalvi en calefacció",
            explanation: (s, d) => "**Pros:** La ciutadania està contenta per l'estalvi en la factura de la llum (+3%). La demanda energètica baixa un 10% aquest trimestre.\n**Contres:** No aprofites l'oportunitat per fer canvis estructurals.\n**Conclusió:** Gaudeixes d'un trimestre tranquil amb menys pressió sobre la xarxa elèctrica.",
            effect: (s, m) => ({ approvalRatings: { ...s.approvalRatings, citizen: s.approvalRatings.citizen + (3 * (3 > 0 ? (1/m) : m)) }, temporaryDemandModifier: { multiplier: 0.90, duration: 1 } }),
            strategicAdvice: "Considera els pros i contres abans de decidir."
        },
        {
            text: "Invertir els estalvis en eficiència (Cost: 200 M€)",
            explanation: (s, d) => "**Pros:** Aprofites el moment per millorar l'eficiència, guanyant suport ciutadà (+4%), empresarial (+2%) i ecologista (+3%). La demanda base es redueix permanentment en 30MW.\n**Contres:** Requereix una inversió de 200 M€.\n**Conclusió:** Una inversió intel·ligent a llarg termini aprofitant una conjuntura favorable.",
            effect: (s, m) => ({ budget: s.budget + (-200), approvalRatings: { ...s.approvalRatings, citizen: s.approvalRatings.citizen + (4 * (4 > 0 ? (1/m) : m)), business: s.approvalRatings.business + (2 * (2 > 0 ? (1/m) : m)), environmentalist: s.approvalRatings.environmentalist + (3 * (3 > 0 ? (1/m) : m)) }, baseDemand: s.baseDemand - 30 }),
            strategicAdvice: "Considera els pros i contres abans de decidir."
        },
    ]
};

export const PROJECTE_PILOT_D_E_LICA_MARINA_FLOTANT_EVENT: GameEvent = {
    title: "Projecte Pilot d'Eòlica Marina Flotant",
    category: "Tecnologia i Indústria",
    description: (d) => "Un consorci tecnològic proposa instal·lar el primer parc eòlic marí flotant del país, una tecnologia pionera que podria revolucionar la generació d'energia.",
    decisions: [
        {
            text: "Invertir en el projecte (Cost: 1.000 M€)",
            explanation: (s, d) => "**Pros:** La innovació genera entusiasme entre ciutadans (+3%), empresaris (+2%) i polítics (+3%). Desbloqueja la construcció de centrals d'Eòlica Marina.\n**Contres:** És una aposta molt cara, amb un cost de 1.000 M€.\n**Conclusió:** Una inversió estratègica massiva que obre la porta a una nova font d'energia renovable.",
            effect: (s, m) => ({ budget: s.budget + (-1000), approvalRatings: { ...s.approvalRatings, citizen: s.approvalRatings.citizen + (3 * (3 > 0 ? (1/m) : m)), business: s.approvalRatings.business + (2 * (2 > 0 ? (1/m) : m)), political: s.approvalRatings.political + (3 * (3 > 0 ? (1/m) : m)) }, constructionBans: s.constructionBans.filter(b => b.source !== EnergySource.EolicaMarina) }),
            strategicAdvice: "Considera els pros i contres abans de decidir."
        },
        {
            text: "Considerar-ho massa arriscat",
            explanation: (s, d) => "**Pros:** Evites un risc financer enorme.\n**Contres:** L'empresariat tecnològic es decep per la falta d'ambició (-3%).\n**Conclusió:** Mantens la prudència pressupostària, però perds l'oportunitat de liderar una nova tecnologia.",
            effect: (s, m) => ({ approvalRatings: { ...s.approvalRatings, business: s.approvalRatings.business + (-3 * (-3 > 0 ? (1/m) : m)) } }),
            strategicAdvice: "Considera els pros i contres abans de decidir."
        },
    ]
};

export const AVEN_EN_L_EMMAGATZEMATGE_T_RMIC_SOLAR_EVENT: GameEvent = {
    title: "Avenç en l'Emmagatzematge Tèrmic Solar",
    category: "Tecnologia i Indústria",
    description: (d) => "Investigadors locals han patentat un nou sistema d'emmagatzematge tèrmic que fa les plantes termosolars molt més eficients i rendibles.",
    decisions: [
        {
            text: "Finançar el desenvolupament (Cost: 1.200 M€)",
            explanation: (s, d) => "**Pros:** Gran suport de l'empresariat (+2%), polítics (+2%) i ecologistes (+4%). Desbloqueja la construcció de centrals Termosolars.\n**Contres:** El finançament del desenvolupament costa 1.200 M€.\n**Conclusió:** Una aposta de futur molt cara que permetrà generar energia solar fins i tot de nit.",
            effect: (s, m) => ({ budget: s.budget + (-1200), approvalRatings: { ...s.approvalRatings, business: s.approvalRatings.business + (2 * (2 > 0 ? (1/m) : m)), political: s.approvalRatings.political + (2 * (2 > 0 ? (1/m) : m)), environmentalist: s.approvalRatings.environmentalist + (4 * (4 > 0 ? (1/m) : m)) }, constructionBans: s.constructionBans.filter(b => b.source !== EnergySource.Termosolar) }),
            strategicAdvice: "Considera els pros i contres abans de decidir."
        },
        {
            text: "Esperar que la tecnologia maduri",
            explanation: (s, d) => "**Pros:** No gastes diners públics.\n**Contres:** L'empresariat lamenta la pèrdua de competitivitat tecnològica (-2%).\n**Conclusió:** Deixes passar una oportunitat d'innovació per protegir les finances actuals.",
            effect: (s, m) => ({ approvalRatings: { ...s.approvalRatings, business: s.approvalRatings.business + (-2 * (-2 > 0 ? (1/m) : m)) } }),
            strategicAdvice: "Considera els pros i contres abans de decidir."
        },
    ]
};

export const ACORD_EUROPEU_DE_DESNUCLEARITZACI_EVENT: GameEvent = {
    title: "Acord Europeu de Desnuclearització",
    category: "Política i Societat",
    description: (d) => "La Unió Europea ha llançat un fons per incentivar el tancament anticipat de les centrals nuclears més antigues, pressionant per accelerar la transició verda.",
    decisions: [
        {
            text: "Acceptar i tancar Ascó I (Cost: 1.500 M€)",
            explanation: (s, d) => "**Pros:** Èxit rotund entre ecologistes (+10%), ciutadans (+5%) i polítics (+5%).\n**Contres:** El tancament i desmantellament costa 1.500 M€. L'empresariat s'alarma per la pèrdua d'energia base (-8%). Clausura permanent de la central Ascó I.\n**Conclusió:** Una victòria ecologista històrica, però amb un cost econòmic i de producció massiu.",
            effect: (s, m) => ({ budget: s.budget + (-1500), approvalRatings: { ...s.approvalRatings, citizen: s.approvalRatings.citizen + (5 * (5 > 0 ? (1/m) : m)), business: s.approvalRatings.business + (-8 * (-8 > 0 ? (1/m) : m)), political: s.approvalRatings.political + (5 * (5 > 0 ? (1/m) : m)), environmentalist: s.approvalRatings.environmentalist + (10 * (10 > 0 ? (1/m) : m)) }, powerPlants: s.powerPlants.map(p => p.name === 'Ascó I' ? { ...p, isDecommissioned: true, isActive: false } : p) }),
            strategicAdvice: "Considera els pros i contres abans de decidir."
        },
        {
            text: "Rebutjar l'acord i defensar la sobirania energètica",
            explanation: (s, d) => "**Pros:** L'empresariat aplaudeix la defensa de l'estabilitat energètica (+5%).\n**Contres:** Rebuig frontal d'ecologistes (-5%), ciutadans (-5%) i aïllament polític europeu (-8%).\n**Conclusió:** Mantens la producció nuclear, però assumeixes un desgast polític i social molt important.",
            effect: (s, m) => ({ approvalRatings: { ...s.approvalRatings, citizen: s.approvalRatings.citizen + (-5 * (-5 > 0 ? (1/m) : m)), business: s.approvalRatings.business + (5 * (5 > 0 ? (1/m) : m)), political: s.approvalRatings.political + (-8 * (-8 > 0 ? (1/m) : m)), environmentalist: s.approvalRatings.environmentalist + (-5 * (-5 > 0 ? (1/m) : m)) } }),
            strategicAdvice: "Considera els pros i contres abans de decidir."
        },
    ]
};

export const REVISI_DE_SEGURETAT_A_UNA_NUCLEAR_EVENT: GameEvent = {
    title: "Revisió de Seguretat a una Nuclear",
    category: "Tecnologia i Indústria",
    description: (d) => "L'organisme regulador ha detectat anomalies menors a la central de Vandellòs II i recomana una revisió a fons per garantir-ne la seguretat.",
    decisions: [
        {
            text: "Fer una aturada completa per revisió (Cost: 400 M€)",
            explanation: (s, d) => "**Pros:** La transparència i priorització de la seguretat tranquil·litza la ciutadania (+5%) i els polítics (+2%).\n**Contres:** L'aturada costa 400 M€ i la central Vandellòs II deixa de produir durant 1 trimestre.\n**Conclusió:** Una decisió responsable que evita riscos majors a canvi d'un cost econòmic i de producció.",
            effect: (s, m) => ({ budget: s.budget + (-400), approvalRatings: { ...s.approvalRatings, citizen: s.approvalRatings.citizen + (5 * (5 > 0 ? (1/m) : m)), political: s.approvalRatings.political + (2 * (2 > 0 ? (1/m) : m)) }, powerPlants: s.powerPlants.map(p => p.name === 'Vandellòs II' ? { ...p, isForcedOffline: true } : p) }),
            strategicAdvice: "Considera els pros i contres abans de decidir."
        },
        {
            text: "Fer revisions parcials sense aturar la producció",
            explanation: (s, d) => "**Pros:** Mantens la producció d'energia ininterrompuda i estalvies els costos de l'aturada.\n**Contres:** La percepció de risc enfonsa l'aprovació ciutadana (-8%), ecologista (-5%) i política (-3%). Activa el risc de manteniment nuclear.\n**Conclusió:** Una decisió temerària que posa en risc la seguretat a llarg termini per mantenir la producció a curt termini.",
            effect: (s, m) => ({ approvalRatings: { ...s.approvalRatings, citizen: s.approvalRatings.citizen + (-8 * (-8 > 0 ? (1/m) : m)), business: s.approvalRatings.business + (-3 * (-3 > 0 ? (1/m) : m)), political: s.approvalRatings.political + (-3 * (-3 > 0 ? (1/m) : m)), environmentalist: s.approvalRatings.environmentalist + (-5 * (-5 > 0 ? (1/m) : m)) }, nuclearMaintenanceRisk: true }),
            strategicAdvice: "Considera els pros i contres abans de decidir."
        },
    ]
};

export const ACORD_D_IMPORTACI_DE_RESIDUS_PER_A_BIOMASSA_EVENT: GameEvent = {
    title: "Acord d'Importació de Residus per a Biomassa",
    category: "Economia i Mercat",
    description: (d) => "Un país veí ofereix pagar-nos per processar els seus residus forestals a les nostres plantes de biomassa, generant ingressos extra.",
    decisions: [
        {
            text: "Acceptar l'acord",
            explanation: (s, d) => "**Pros:** Aconsegueixes uns ingressos addicionals de +100 M€.\n**Contres:** Els ecologistes (-6%) i la ciutadania (-2%) s'oposen a convertir el país en l'abocador d'altres. L'empresariat local tem perdre prioritat (-2%).\n**Conclusió:** Guanyes diners a curt termini, però generes un fort rebuig social i ecologista.",
            effect: (s, m) => ({ budget: s.budget + (100), approvalRatings: { ...s.approvalRatings, citizen: s.approvalRatings.citizen + (-2 * (-2 > 0 ? (1/m) : m)), business: s.approvalRatings.business + (-2 * (-2 > 0 ? (1/m) : m)), environmentalist: s.approvalRatings.environmentalist + (-6 * (-6 > 0 ? (1/m) : m)) } }),
            strategicAdvice: "Considera els pros i contres abans de decidir."
        },
        {
            text: "Rebutjar l'acord per motius ecològics",
            explanation: (s, d) => "**Pros:** La decisió de protegir el territori és aplaudida per ecologistes (+4%) i ciutadans (+2%).\n**Contres:** Renuncies a uns ingressos fàcils.\n**Conclusió:** Poses l'ètica i l'ecologia per davant dels beneficis econòmics.",
            effect: (s, m) => ({ approvalRatings: { ...s.approvalRatings, citizen: s.approvalRatings.citizen + (2 * (2 > 0 ? (1/m) : m)), environmentalist: s.approvalRatings.environmentalist + (4 * (4 > 0 ? (1/m) : m)) } }),
            strategicAdvice: "Considera els pros i contres abans de decidir."
        },
    ]
};

export const OPORTUNITAT_D_INVERSI_EN_BATERIES_EVENT: GameEvent = {
    title: "Oportunitat d'Inversió en Bateries",
    category: "Tecnologia i Indústria",
    description: (d) => "Ha sorgit l'oportunitat de construir una gigafactoria de bateries d'última generació, que permetria emmagatzemar l'excedent de les renovables a gran escala.",
    decisions: [
        {
            text: "Invertir massivament (Cost: 2.000 M€)",
            explanation: (s, d) => "**Pros:** Suport polític per la visió de futur (+3%). La producció efectiva de Solar i Eòlica augmenta un 20% permanentment gràcies a l'emmagatzematge.\n**Contres:** Requereix una inversió colossal de 2.000 M€.\n**Conclusió:** Una de les millors inversions a llarg termini del joc, però que pot buidar les teves arques.",
            effect: (s, m) => ({ budget: s.budget + (-2000), approvalRatings: { ...s.approvalRatings, political: s.approvalRatings.political + (3 * (3 > 0 ? (1/m) : m)) }, capacityModifiers: [...s.capacityModifiers, { source: EnergySource.Solar, multiplier: 1.2, duration: 'permanent' }, { source: EnergySource.Wind, multiplier: 1.2, duration: 'permanent' }] }),
            strategicAdvice: "Considera els pros i contres abans de decidir."
        },
        {
            text: "Descartar la inversió per l'alt cost",
            explanation: (s, d) => "**Pros:** Evites un deute massiu.\n**Contres:** L'empresariat i els ecologistes es deceben per la falta de visió (-2%).\n**Conclusió:** Mantens l'estabilitat financera, però l'energia renovable continuarà sent intermitent.",
            effect: (s, m) => ({ approvalRatings: { ...s.approvalRatings, business: s.approvalRatings.business + (-2 * (-2 > 0 ? (1/m) : m)), environmentalist: s.approvalRatings.environmentalist + (-2 * (-2 > 0 ? (1/m) : m)) } }),
            strategicAdvice: "Considera els pros i contres abans de decidir."
        },
    ]
};

export const OPORTUNITAT_DE_PROJECTE_D_HIDROGEN_VERD_EVENT: GameEvent = {
    title: "Oportunitat de Projecte d'Hidrogen Verd",
    category: "Tecnologia i Indústria",
    description: (d) => "Es presenta un pla estratègic per adaptar la xarxa de gas natural perquè pugui transportar hidrogen verd, reduint la dependència dels combustibles fòssils.",
    decisions: [
        {
            text: "Apostar per l'hidrogen (Cost: 1.300 M€)",
            explanation: (s, d) => "**Pros:** Gran suport empresarial (+3%) i ecologista (+5%). El manteniment de les centrals de gas es redueix un 25% permanentment en poder usar hidrogen barrejat.\n**Contres:** La infraestructura costa 1.300 M€.\n**Conclusió:** Una aposta clau per descarbonitzar la indústria pesant i reduir els costos del gas a llarg termini.",
            effect: (s, m) => ({ budget: s.budget + (-1300), approvalRatings: { ...s.approvalRatings, business: s.approvalRatings.business + (3 * (3 > 0 ? (1/m) : m)), environmentalist: s.approvalRatings.environmentalist + (5 * (5 > 0 ? (1/m) : m)) }, upkeepModifiers: [...s.upkeepModifiers, { id: 'green_hydrogen', multiplier: 0.75, duration: 'permanent' }] }),
            strategicAdvice: "Considera els pros i contres abans de decidir."
        },
        {
            text: "Centrar-se en tecnologies més madures",
            explanation: (s, d) => "**Pros:** Estalvies una gran quantitat de diners.\n**Contres:** Perds el suport dels sectors més innovadors i ecologistes (-2%).\n**Conclusió:** Una decisió conservadora que manté la dependència total del gas natural d'importació.",
            effect: (s, m) => ({ approvalRatings: { ...s.approvalRatings, business: s.approvalRatings.business + (-2 * (-2 > 0 ? (1/m) : m)), environmentalist: s.approvalRatings.environmentalist + (-2 * (-2 > 0 ? (1/m) : m)) } }),
            strategicAdvice: "Considera els pros i contres abans de decidir."
        },
    ]
};

export const OPORTUNITAT_MILLORA_TECNOL_GICA_EN_PLAQUES_SOLARS_EVENT: GameEvent = {
    title: "Oportunitat: Millora Tecnològica en Plaques Solars",
    category: "Tecnologia i Indústria",
    description: (d) => "Una nova tecnologia de cèl·lules fotovoltaiques promet augmentar significativament el rendiment de tots els parcs solars existents i futurs.",
    decisions: [
        {
            text: "Invertir en la nova tecnologia (Cost: 850 M€)",
            explanation: (s, d) => "**Pros:** L'empresariat (+2%) i els ecologistes (+3%) aplaudeixen la innovació. La producció de totes les centrals solars augmenta un 15% permanentment.\n**Contres:** L'actualització tecnològica costa 850 M€.\n**Conclusió:** Una inversió molt rendible si tens una gran capacitat d'energia solar instal·lada.",
            effect: (s, m) => ({ budget: s.budget + (-850), approvalRatings: { ...s.approvalRatings, business: s.approvalRatings.business + (2 * (2 > 0 ? (1/m) : m)), environmentalist: s.approvalRatings.environmentalist + (3 * (3 > 0 ? (1/m) : m)) }, capacityModifiers: [...s.capacityModifiers, { source: EnergySource.Solar, multiplier: 1.15, duration: 'permanent' }] }),
            strategicAdvice: "Considera els pros i contres abans de decidir."
        },
        {
            text: "Mantenir la tecnologia actual",
            explanation: (s, d) => "**Pros:** No hi ha cap cost econòmic.\n**Contres:** Cap efecte negatiu directe, però perds una oportunitat de millora.\n**Conclusió:** Mantens l'statu quo financer i tecnològic.",
            effect: (s, m) => ({}),
            strategicAdvice: "Considera els pros i contres abans de decidir."
        },
    ]
};

export const SUBVENCI_PER_A_LA_BIOECONOMIA_EVENT: GameEvent = {
    title: "Subvenció per a la Bioeconomia",
    category: "Economia i Mercat",
    description: (d) => "El govern central ofereix una subvenció directa per fomentar l'economia circular i l'ús de la biomassa com a font d'energia.",
    decisions: [
        {
            text: "Acceptar la subvenció",
            explanation: (s, d) => "**Pros:** Ingressos directes de +500 M€. L'empresariat (+3%) i els polítics (+2%) celebren l'arribada de fons.\n**Contres:** Cap efecte negatiu destacable.\n**Conclusió:** Una injecció de capital molt benvinguda que reforça el teu mandat.",
            effect: (s, m) => ({ budget: s.budget + (500), approvalRatings: { ...s.approvalRatings, business: s.approvalRatings.business + (3 * (3 > 0 ? (1/m) : m)), political: s.approvalRatings.political + (2 * (2 > 0 ? (1/m) : m)) } }),
            strategicAdvice: "Considera els pros i contres abans de decidir."
        },
        {
            text: "No acceptar-la",
            explanation: (s, d) => "**Pros:** Cap.\n**Contres:** Rebutjar diners gratuïts no té cap sentit estratègic.\n**Conclusió:** Una decisió incomprensible.",
            effect: (s, m) => ({}),
            strategicAdvice: "Considera els pros i contres abans de decidir."
        },
    ]
};

export const SUBVENCI_INESPERADA_DE_LA_UE_PER_A_EFICI_NCIA_EVENT: GameEvent = {
    title: "Subvenció Inesperada de la UE per a Eficiència",
    category: "Economia i Mercat",
    description: (d) => "La Unió Europea ha assignat uns fons extraordinaris a Catalunya. Pots decidir si invertir-los en eficiència energètica o fer-los servir per quadrar els pressupostos.",
    decisions: [
        {
            text: "Destinar-la a la rehabilitació d'edificis",
            explanation: (s, d) => "**Pros:** Molt popular entre ciutadans (+5%), polítics (+3%) i ecologistes (+3%). La demanda base es redueix permanentment en 80MW.\n**Contres:** Requereix cofinançament, amb un cost net de 700 M€ per a la Generalitat.\n**Conclusió:** Una inversió excel·lent per reduir la demanda a llarg termini, si t'ho pots permetre.",
            effect: (s, m) => ({ budget: s.budget + (-700), approvalRatings: { ...s.approvalRatings, citizen: s.approvalRatings.citizen + (5 * (5 > 0 ? (1/m) : m)), political: s.approvalRatings.political + (3 * (3 > 0 ? (1/m) : m)), environmentalist: s.approvalRatings.environmentalist + (3 * (3 > 0 ? (1/m) : m)) }, baseDemand: s.baseDemand - 80 }),
            strategicAdvice: "Considera els pros i contres abans de decidir."
        },
        {
            text: "Injectar els diners al pressupost general",
            explanation: (s, d) => "**Pros:** Ingressos directes de +800 M€ per a les arques públiques.\n**Contres:** Perds l'oportunitat de fer canvis estructurals en la demanda.\n**Conclusió:** Una injecció de liquiditat ideal si estàs a prop de la fallida econòmica.",
            effect: (s, m) => ({ budget: s.budget + (800) }),
            strategicAdvice: "Considera els pros i contres abans de decidir."
        },
    ]
};

export const BOOM_DE_L_AUTOCONSUM_EVENT: GameEvent = {
    title: "Boom de l'Autoconsum",
    category: "Economia i Mercat",
    description: (d) => "L'interès ciutadà per instal·lar plaques solars a les teulades s'ha disparat. El govern pot aprofitar l'impuls per accelerar la transició.",
    decisions: [
        {
            text: "Accelerar el model amb ajudes públiques (Cost: 400 M€)",
            explanation: (s, d) => "**Pros:** Gran suport ciutadà (+6%) i ecologista (+4%). La demanda base es redueix permanentment en 120MW.\n**Contres:** El pla d'ajudes costa 400 M€.\n**Conclusió:** Una de les millors polítiques per reduir la demanda elèctrica de forma descentralitzada.",
            effect: (s, m) => ({ budget: s.budget + (-400), approvalRatings: { ...s.approvalRatings, citizen: s.approvalRatings.citizen + (6 * (6 > 0 ? (1/m) : m)), environmentalist: s.approvalRatings.environmentalist + (4 * (4 > 0 ? (1/m) : m)) }, baseDemand: s.baseDemand - 120 }),
            strategicAdvice: "Considera els pros i contres abans de decidir."
        },
        {
            text: "Deixar que el mercat es reguli sol",
            explanation: (s, d) => "**Pros:** Estalvies diners públics.\n**Contres:** La ciutadania i l'empresariat instal·lador es deceben (-3%). La demanda base només es redueix en 40MW.\n**Conclusió:** El fenomen continua, però a un ritme molt menor per la falta de suport institucional.",
            effect: (s, m) => ({ approvalRatings: { ...s.approvalRatings, citizen: s.approvalRatings.citizen + (-3 * (-3 > 0 ? (1/m) : m)), business: s.approvalRatings.business + (-3 * (-3 > 0 ? (1/m) : m)) }, baseDemand: s.baseDemand - 40 }),
            strategicAdvice: "Considera els pros i contres abans de decidir."
        },
    ]
};

export const NEW_GAME_EVENTS = [
    SEQUERA_HIST_RICA_EVENT,
    VAGA_GENERAL_INDUSTRIAL_EVENT,
    CRISI_DE_MATERIALS_PER_A_RENOVABLES_EVENT,
    PUJADA_DEL_PREU_DEL_GAS_NATURAL_EVENT,
    INCENDI_FORESTAL_GEGANT_EVENT,
    TEMPORAL_MAR_TIM_DEVASTADOR_EVENT,
    HIVERN_ANORMALMENT_SUAU_EVENT,
    PROJECTE_PILOT_D_E_LICA_MARINA_FLOTANT_EVENT,
    AVEN_EN_L_EMMAGATZEMATGE_T_RMIC_SOLAR_EVENT,
    ACORD_EUROPEU_DE_DESNUCLEARITZACI_EVENT,
    REVISI_DE_SEGURETAT_A_UNA_NUCLEAR_EVENT,
    ACORD_D_IMPORTACI_DE_RESIDUS_PER_A_BIOMASSA_EVENT,
    OPORTUNITAT_D_INVERSI_EN_BATERIES_EVENT,
    OPORTUNITAT_DE_PROJECTE_D_HIDROGEN_VERD_EVENT,
    OPORTUNITAT_MILLORA_TECNOL_GICA_EN_PLAQUES_SOLARS_EVENT,
    SUBVENCI_PER_A_LA_BIOECONOMIA_EVENT,
    SUBVENCI_INESPERADA_DE_LA_UE_PER_A_EFICI_NCIA_EVENT,
    BOOM_DE_L_AUTOCONSUM_EVENT,
];

export const GAME_EVENTS: GameEvent[] = [
    ONSHORE_TOURISM_BOOM_EVENT,
    EUROPEAN_MARKET_VOLATILITY_EVENT,
    ...NEW_GAME_EVENTS,
];



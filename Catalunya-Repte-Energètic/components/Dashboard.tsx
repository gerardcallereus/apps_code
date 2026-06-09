import React from 'react';
import { GameState, EnergySource, DifficultyLevel } from '../types';
import { BASE_MARKET_PRICE_PER_MW } from '../constants';
import MetricsCard from './MetricsCard';
import EnergyMixChart from './EnergyMixChart';
import FinancialBreakdownCard from './FinancialBreakdownCard';
import ApprovalRatingsDashboard from './ApprovalRatingsDashboard';
import AdvisorPanel from './AdvisorPanel';
import { CoinIcon, HeartIcon, CloudIcon, ZapIcon, BoltIcon, ShieldCheckIcon, AlertTriangleIcon, ArrowsRightLeftIcon, TrendingUpIcon, EuroIcon, TrendingDownIcon } from './Icons';

interface DashboardProps {
    gameState: GameState;
    turn: number;
    difficulty: DifficultyLevel;
}

const Dashboard: React.FC<DashboardProps> = ({ gameState, turn, difficulty }) => {
    const { budget, approvalRatings, co2Emissions, totalProduction, totalDemand, powerPlants, energyDeficit, marketPricePerMW, currentTurnFinancialEvents, recurrentUpkeep, surplusSalePriceMultiplier, importEnergyPriceMultiplier, currentTurnApprovalModifiers, taxRevenuePerTurn, upkeepModifiers } = gameState;

    const operationalPlants = powerPlants.filter(p => p.isActive);
    const productionMix = Object.values(EnergySource).map(source => {
        const total = operationalPlants
            .filter(p => p.type === source)
            .reduce((acc, p) => acc + p.capacity, 0);
        return { name: source, value: total };
    }).filter(d => d.value > 0);

    const rawBalance = totalProduction - totalDemand;
    const energyBalance = energyDeficit > 0 ? rawBalance : (rawBalance < 0 ? 0 : rawBalance);

    let balanceText: string;
    let balanceColor: string;
    let balanceValueText: string;

    if (energyBalance > 0) {
        balanceText = 'Superàvit energètic';
        balanceColor = 'text-green-600';
        balanceValueText = `+${energyBalance.toFixed(0)}`;
    } else if (energyBalance < 0) {
        balanceText = 'Dèficit energètic';
        balanceColor = 'text-red-600';
        balanceValueText = energyBalance.toFixed(0);
    } else { // energyBalance === 0
        balanceText = 'Balanç Equilibrat';
        balanceColor = 'text-slate-500';
        balanceValueText = energyBalance.toFixed(0);
    }
    
    // Financial Breakdown Calculation
    const surplusRevenue = energyBalance > 0 ? energyBalance * marketPricePerMW * surplusSalePriceMultiplier : 0;
    const deficitCost = energyDeficit > 0 ? energyDeficit * marketPricePerMW * importEnergyPriceMultiplier : 0;
    let maintenanceCost = powerPlants
        .filter(p => p.operationalTurn <= turn)
        .reduce((acc, plant) => acc + plant.upkeep, 0);
    
    upkeepModifiers.forEach(mod => {
        maintenanceCost *= mod.multiplier;
    });

    const incomeItems: { label: string; value: number }[] = [{ label: 'Impostos Fixos', value: taxRevenuePerTurn }];
    if (surplusRevenue > 0) {
        incomeItems.push({ label: "Venda d'Energia", value: surplusRevenue });
    }
    if (recurrentUpkeep < 0) {
        incomeItems.push({ label: 'Ingressos Recurrents', value: -recurrentUpkeep });
    }

    const expenseItems: { label: string; value: number }[] = [];
    if (maintenanceCost > 0) {
        expenseItems.push({ label: 'Manteniment de Centrals', value: -maintenanceCost });
    }
     if (recurrentUpkeep > 0) {
        expenseItems.push({ label: 'Despeses Recurrents', value: -recurrentUpkeep });
    }
    if (deficitCost > 0) {
        expenseItems.push({ label: "Compra d'Energia", value: -deficitCost });
    }

    currentTurnFinancialEvents.forEach(event => {
        if (event.amount > 0) {
            incomeItems.push({ label: event.description, value: event.amount });
        } else {
            expenseItems.push({ label: event.description, value: event.amount });
        }
    });

    const totalIncome = incomeItems.reduce((sum, item) => sum + item.value, 0);
    const totalExpenses = expenseItems.reduce((sum, item) => sum + item.value, 0);
    const budgetBalance = totalIncome + totalExpenses;
    const projectedBudget = budget + budgetBalance;

    const energySovereignty = totalDemand > 0 ? (totalProduction / totalDemand) * 100 : 100;
    const getSovereigntyStatus = (sovereignty: number): { text: string; color: string } => {
        const value = `${sovereignty.toFixed(0)}%`;
        if (sovereignty < 90) return { text: value, color: "text-red-500" };
        if (sovereignty < 100) return { text: value, color: "text-yellow-500" };
        return { text: value, color: "text-green-500" };
    };
    const sovereigntyStatus = getSovereigntyStatus(energySovereignty);

    return (
        <div>
            {difficulty === DifficultyLevel.Easy && <AdvisorPanel gameState={gameState} />}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <FinancialBreakdownCard
                    title="Ingressos"
                    icon={<TrendingUpIcon className="w-6 h-6 text-green-500" />}
                    items={incomeItems}
                    total={totalIncome}
                    type="income"
                />
                <FinancialBreakdownCard
                    title="Despeses"
                    icon={<TrendingDownIcon className="w-6 h-6 text-red-500" />}
                    items={expenseItems}
                    total={totalExpenses}
                    type="expense"
                />
                <div className="bg-white p-4 rounded-lg shadow-md flex flex-col h-full justify-between border border-slate-200">
                    <div>
                        <div className="flex items-center mb-3">
                            <EuroIcon className="w-6 h-6 text-teal-500" />
                            <h4 className="text-md font-semibold text-slate-700 uppercase tracking-wider ml-2">Situació Pressupostària</h4>
                        </div>
                        <div className="text-center space-y-2">
                             <div>
                                <p className="text-xs text-slate-500">Pressupost Actual</p>
                                <p className="text-2xl font-bold text-slate-800">{budget.toLocaleString()} M€</p>
                            </div>
                            <div className="flex justify-center items-center">
                                <div className={`text-2xl font-bold ${budgetBalance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                    {budgetBalance >= 0 ? '+' : ''}{budgetBalance.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                                </div>
                                <p className="text-xs text-slate-500 ml-2">Balanç<br/>Trimestre</p>
                            </div>
                        </div>
                    </div>
                     <div className="mt-auto pt-2 border-t border-slate-200 text-center">
                        <p className="text-xs text-slate-500">Total Previst</p>
                        <p className="text-2xl font-bold text-yellow-500">{projectedBudget.toLocaleString(undefined, { maximumFractionDigits: 0 })} M€</p>
                    </div>
                </div>
            </div>

            <div className="mb-6">
                <ApprovalRatingsDashboard approvalRatings={approvalRatings} modifiers={currentTurnApprovalModifiers} />
            </div>
            
             <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <MetricsCard icon={<CloudIcon />} title="Emissions CO₂" value={`${co2Emissions.toLocaleString()} t`} />
                <MetricsCard icon={<ZapIcon />} title="Producció" value={`${totalProduction.toFixed(0)} MW`} />
                <MetricsCard icon={<BoltIcon />} title="Demanda" value={`${totalDemand.toFixed(0)} MW`} />
                <MetricsCard 
                    icon={<ShieldCheckIcon />} 
                    title="Sobirania" 
                    value={sovereigntyStatus.text}
                    valueColor={sovereigntyStatus.color}
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
                <div className="lg:col-span-2 h-80 bg-white p-4 rounded-lg shadow-md border border-slate-200">
                    <EnergyMixChart data={productionMix} />
                </div>
                <div className="text-center bg-slate-50 p-6 rounded-lg border border-slate-200">
                    <h3 className="text-lg font-semibold text-slate-700 mb-2">Balanç Energètic</h3>
                    <p className={`text-4xl font-bold ${balanceColor}`}>
                        {balanceValueText} MW
                    </p>
                    <p className="text-slate-500 mt-2">
                        {balanceText}
                    </p>
                    
                    <div className="mt-4 pt-4 border-t border-slate-200 space-y-2">
                        <div className="flex justify-center items-center text-sm">
                            <ArrowsRightLeftIcon className="w-5 h-5 mr-2 text-teal-500" />
                            <span className="font-semibold text-slate-600">Preu Mercat:</span>
                            <span className={`ml-2 font-bold ${marketPricePerMW > BASE_MARKET_PRICE_PER_MW * 1.25 ? 'text-yellow-600' : 'text-slate-800'}`}>
                                {marketPricePerMW.toFixed(3)} M€/MW
                            </span>
                        </div>
                        {energyDeficit > 0 && (
                            <div className="text-sm">
                                <span className="font-semibold text-slate-600">Cost Importació:</span>
                                <span className="ml-2 font-bold text-red-600">
                                    -{deficitCost.toLocaleString(undefined, { maximumFractionDigits: 0 })} M€
                                </span>
                            </div>
                        )}
                        {energyBalance > 0 && (
                            <div className="text-sm">
                                <span className="font-semibold text-slate-600">Ingressos Venda (Previst):</span>
                                <span className="ml-2 font-bold text-green-600">
                                    +{surplusRevenue.toLocaleString(undefined, { maximumFractionDigits: 0 })} M€
                                </span>
                            </div>
                        )}
                    </div>

                    {gameState.energyDeficit > 0 && (
                        <div className="mt-4 p-3 bg-red-100 border border-red-300 rounded-lg text-center animate-pulse">
                            <div className="flex items-center justify-center space-x-2 text-red-800">
                                <AlertTriangleIcon className="w-5 h-5" />
                                <span className="font-bold">DÈFICIT ENERGÈTIC CRÍTIC</span>
                            </div>
                            <p className="text-red-700 mt-1 text-xs">
                                La xarxa no és estable. Has d'importar energia per evitar talls de llum.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
import React from 'react';
import { CoinIcon, HeartIcon, CloudIcon, ZapIcon } from './Icons';

interface StatsBarProps {
    projectedBudget: number;
    projectedOverallApproval: number;
    co2Emissions: number;
    energyBalance: number;
}

const StatItem: React.FC<{ icon: React.ReactNode; value: string; label: string; valueColor?: string }> = ({ icon, value, label, valueColor = 'text-slate-800' }) => (
    <div className="flex items-center space-x-2 sm:space-x-3">
        <div className="w-7 h-7 flex-shrink-0">{icon}</div>
        <div className="text-left">
            <span className={`font-bold text-lg ${valueColor}`}>{value}</span>
            <span className="text-slate-500 text-xs ml-1.5">{label}</span>
        </div>
    </div>
);

const StatsBar: React.FC<StatsBarProps> = ({ projectedBudget, projectedOverallApproval, co2Emissions, energyBalance }) => {
    // Logic for colors
    const balanceColor = energyBalance >= 0 ? 'text-green-500' : 'text-red-500';
    const approvalColor = projectedOverallApproval < 30 ? 'text-red-500' : projectedOverallApproval < 60 ? 'text-yellow-500' : 'text-green-500';

    return (
        <div className="bg-white p-3 rounded-lg shadow-md border border-slate-200">
            <div className="flex flex-wrap justify-around items-center gap-y-3 gap-x-6">
                <StatItem 
                    icon={<CoinIcon className="text-yellow-500" />} 
                    value={`${projectedBudget.toLocaleString(undefined, { maximumFractionDigits: 0 })}`} 
                    label="M€ (previst)" 
                />
                <StatItem 
                    icon={<HeartIcon className="text-rose-500" />} 
                    value={`${projectedOverallApproval.toFixed(0)}%`} 
                    label="aprov. (prev.)"
                    valueColor={approvalColor}
                />
                <StatItem 
                    icon={<CloudIcon className="text-sky-500" />} 
                    value={`${co2Emissions.toLocaleString()}`}
                    label="t CO₂"
                />
                <StatItem 
                    icon={<ZapIcon className={balanceColor} />} 
                    value={`${energyBalance >= 0 ? '+' : ''}${energyBalance.toFixed(0)}`}
                    label="MW (balanç)"
                    valueColor={balanceColor}
                />
            </div>
        </div>
    );
};

export default StatsBar;
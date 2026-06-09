import React from 'react';
import { ApprovalModifier, ApprovalRatings } from '../types';
import { AGENT_CONFIG } from '../constants';

export type AgentKey = keyof ApprovalRatings;

interface ApprovalBreakdownCardProps {
    agent: AgentKey;
    currentApproval: number;
    modifiers: ApprovalModifier[];
}

// FIX: Component was missing its return statement and implementation logic.
// The implementation has been completed to render the approval breakdown.
// Also added 'export default' to fix the import error in ApprovalRatingsDashboard.tsx.
const ApprovalBreakdownCard: React.FC<ApprovalBreakdownCardProps> = ({ agent, currentApproval, modifiers }) => {
    const agentConfig = AGENT_CONFIG[agent];
    const relevantModifiers = modifiers.filter(m => m.changes[agent] !== undefined && m.changes[agent] !== 0);
    const totalChange = relevantModifiers.reduce((sum, item) => sum + (item.changes[agent] || 0), 0);
    const projectedApproval = Math.max(0, Math.min(100, currentApproval + totalChange));

    const getProjectedColor = (value: number) => {
        if (value < 30) return 'text-red-500';
        if (value < 60) return 'text-yellow-500';
        return 'text-green-500';
    };

    return (
        <div className="bg-slate-50 p-3 rounded-lg flex flex-col h-full border border-slate-200">
            <div className="flex items-center mb-2">
                <div className={`w-6 h-6 ${agentConfig.color}`}>{agentConfig.icon}</div>
                <h4 className="text-sm font-semibold text-slate-700 uppercase tracking-wider ml-2">{agentConfig.label}</h4>
            </div>
            <div className="text-center my-2 flex-grow">
                <span className="text-xs text-slate-500">Actual</span>
                <p className="text-2xl font-bold text-slate-800">{currentApproval.toFixed(0)}%</p>
            </div>
            <div className="text-center text-xs space-y-0.5 mb-2 min-h-[2.5rem]">
                {relevantModifiers.map((mod, index) => (
                    <div key={index} className="flex justify-between items-center text-slate-500">
                        <span className="truncate" title={mod.description}>{mod.description}</span>
                        <span className={`font-mono font-semibold ${mod.changes[agent]! > 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {mod.changes[agent]! > 0 ? '+' : ''}{mod.changes[agent]?.toFixed(1)}%
                        </span>
                    </div>
                ))}
            </div>
            <div className="mt-auto pt-2 border-t border-slate-200 text-center">
                <span className="text-xs text-slate-500">Previst</span>
                <p className={`text-xl font-bold ${getProjectedColor(projectedApproval)}`}>{projectedApproval.toFixed(0)}%</p>
            </div>
        </div>
    );
};

export default ApprovalBreakdownCard;
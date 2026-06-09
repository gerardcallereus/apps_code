import React from 'react';
import { ApprovalRatings, ApprovalModifier } from '../types';
import { HeartIcon } from './Icons';
import ApprovalBreakdownCard, { AgentKey } from './ApprovalBreakdownCard';

interface ApprovalRatingsDashboardProps {
    approvalRatings: ApprovalRatings;
    modifiers: ApprovalModifier[];
}

const ApprovalRatingsDashboard: React.FC<ApprovalRatingsDashboardProps> = ({ approvalRatings, modifiers }) => {
     const overallApproval = (approvalRatings.citizen + approvalRatings.business + approvalRatings.political + approvalRatings.environmentalist) / 4;

    const overallTotalChange = modifiers.reduce((sum, item) => {
        const itemTotal = (item.changes.citizen || 0) + (item.changes.business || 0) + (item.changes.political || 0) + (item.changes.environmentalist || 0);
        return sum + (itemTotal / 4);
    }, 0);
    const projectedOverallApproval = Math.max(0, Math.min(100, overallApproval + overallTotalChange));

     const getProjectedColor = (value: number) => {
        if (value < 30) return 'text-red-500';
        if (value < 60) return 'text-yellow-500';
        return 'text-green-500';
    };

    return (
        <div className="bg-white p-4 rounded-lg shadow-md border border-slate-200">
            <div className="flex items-center justify-center mb-3">
                <HeartIcon className="w-7 h-7 text-rose-500" />
                <h3 className="text-lg font-bold text-slate-800 uppercase tracking-wider ml-2">Aprovació General</h3>
                <div className="ml-auto flex items-baseline">
                    <span className="text-slate-500 text-sm mr-2">Prevista:</span>
                    <span className={`text-2xl font-bold ${getProjectedColor(projectedOverallApproval)}`}>{projectedOverallApproval.toFixed(0)}%</span>
                </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {(Object.keys(approvalRatings) as AgentKey[]).map(agentKey => (
                    <ApprovalBreakdownCard
                        key={agentKey}
                        agent={agentKey}
                        currentApproval={approvalRatings[agentKey]}
                        modifiers={modifiers}
                    />
                ))}
            </div>
        </div>
    );
};

export default ApprovalRatingsDashboard;
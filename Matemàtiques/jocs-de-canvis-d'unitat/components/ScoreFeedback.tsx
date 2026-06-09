import React from 'react';
import { ScoreFeedbackInfo } from '../types';

const ScoreFeedback: React.FC<ScoreFeedbackInfo> = ({ base, bonus, total, isRoundSummary }) => {
    if (total <= 0) return null;

    return (
        <div className="mt-4 flex flex-col items-center justify-center gap-2 text-lg font-semibold text-slate-700 animate-fade-in">
            {isRoundSummary && <h4 className="text-lg font-bold text-slate-800">Punts d'aquesta ronda:</h4>}
            <div className="flex items-center gap-4">
                <span>{base} pts</span>
                {bonus > 0 && <span className="text-sky-500">+ {bonus} temps</span>}
                <span className="text-2xl font-bold text-indigo-600">= {total} pts</span>
            </div>
        </div>
    );
};

export default ScoreFeedback;
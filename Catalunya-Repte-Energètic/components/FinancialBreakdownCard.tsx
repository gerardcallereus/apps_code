import React from 'react';

interface FinancialBreakdownCardProps {
    title: string;
    icon: React.ReactNode;
    items: { label: string; value: number }[];
    total: number;
    type: 'income' | 'expense';
}

const FinancialBreakdownCard: React.FC<FinancialBreakdownCardProps> = ({ title, icon, items, total, type }) => {
    const isIncome = type === 'income';
    const totalColor = isIncome ? 'text-green-600' : 'text-red-600';
    const itemValueColor = isIncome ? 'text-green-700' : 'text-slate-700';

    return (
        <div className="bg-white p-4 rounded-lg shadow-md flex flex-col h-full border border-slate-200">
            <div className="flex items-center mb-3">
                {icon}
                <h4 className="text-md font-semibold text-slate-700 uppercase tracking-wider ml-2">{title}</h4>
            </div>
            <div className="flex-grow space-y-1.5 text-sm overflow-y-auto pr-2 max-h-24">
                {items.map((item, index) => (
                    <div key={index} className="flex justify-between items-center gap-2">
                        <span className="text-slate-500 truncate" title={item.label}>{item.label}</span>
                        <span className={`font-mono font-semibold ${itemValueColor} flex-shrink-0`}>
                            {item.value >= 0 && isIncome ? '+' : ''}
                            {item.value.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                        </span>
                    </div>
                ))}
                {items.length === 0 && <p className="text-xs text-slate-400 text-center pt-4">Cap moviment registrat.</p>}
            </div>
            <div className="mt-auto pt-2 border-t border-slate-200 flex justify-between items-center font-bold">
                <span className="text-slate-800 text-sm">TOTAL (TRIMESTRE)</span>
                <span className={`${totalColor} text-lg`}>
                    {total >= 0 && isIncome ? '+' : ''}
                    {total.toLocaleString(undefined, { maximumFractionDigits: 0 })} M€
                </span>
            </div>
        </div>
    );
};

export default FinancialBreakdownCard;
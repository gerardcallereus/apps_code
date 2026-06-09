import React from 'react';

interface MetricsCardProps {
    icon: React.ReactNode;
    title: string;
    value: string;
    valueColor?: string;
    subtitle?: string;
}

const MetricsCard: React.FC<MetricsCardProps> = ({ icon, title, value, valueColor = 'text-slate-900', subtitle }) => {
    return (
        <div className="bg-white p-4 rounded-lg shadow-md flex flex-col items-center justify-center text-center h-full border border-slate-200">
            <div className="text-teal-500 mb-2 w-8 h-8">{icon}</div>
            <h4 className="text-sm font-semibold text-slate-600 uppercase tracking-wider">{title}</h4>
            <p className={`text-xl font-bold ${valueColor}`}>{value}</p>
            {subtitle && <p className="text-xs text-slate-500 mt-1">{subtitle}</p>}
        </div>
    );
};

export default MetricsCard;
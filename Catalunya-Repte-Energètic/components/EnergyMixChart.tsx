import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { EnergySource } from '../types';

interface EnergyMixChartProps {
    data: { name: EnergySource; value: number }[];
}

const COLORS: Record<EnergySource, string> = {
    [EnergySource.Solar]: '#f59e0b', // amber-500
    [EnergySource.Termosolar]: '#fb923c', // orange-400
    [EnergySource.Wind]: '#38bdf8', // lightBlue-400
    [EnergySource.EolicaMarina]: '#06b6d4', // cyan-500
    [EnergySource.Hydro]: '#3b82f6', // blue-500
    [EnergySource.Nuclear]: '#8b5cf6', // violet-500
    [EnergySource.Fossil]: '#ef4444', // red-500
    [EnergySource.Biofuel]: '#22c55e', // green-500
};

const EnergyMixChart: React.FC<EnergyMixChartProps> = ({ data }) => {
    const activeData = data.filter(d => d.value > 0);
    return (
        <ResponsiveContainer width="100%" height="100%">
            <PieChart>
                <Pie
                    data={activeData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius="80%"
                    fill="#8884d8"
                    dataKey="value"
                    nameKey="name"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                    {activeData.map((entry) => (
                        <Cell key={`cell-${entry.name}`} fill={COLORS[entry.name]} />
                    ))}
                </Pie>
                <Tooltip
                    contentStyle={{
                        backgroundColor: '#ffffff',
                        borderColor: '#e2e8f0', // slate-200
                        color: '#1e293b' // slate-800
                    }}
                    itemStyle={{ color: '#1e293b' }}
                    formatter={(value: number, name: string) => [`${value.toLocaleString()} MW`, name]}
                />
                <Legend />
            </PieChart>
        </ResponsiveContainer>
    );
};

export default EnergyMixChart;
import React from 'react';
import { COLOR_CODES } from '../constants';

export const ColorCodeChart: React.FC = () => {
    return (
        <div className="mt-8 bg-slate-800 p-6 rounded-2xl shadow-lg border border-slate-700 animate-fade-in">
            <h3 className="text-2xl font-bold text-cyan-400 mb-4 text-center">Taula de Codi de Colors</h3>
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-slate-300">
                    <thead className="text-xs text-cyan-300 uppercase bg-slate-700/50">
                        <tr>
                            <th scope="col" className="px-4 py-3">Color</th>
                            <th scope="col" className="px-4 py-3 text-center">Valor (1a/2a Banda)</th>
                            <th scope="col" className="px-4 py-3 text-center">Multiplicador (3a Banda)</th>
                            <th scope="col" className="px-4 py-3 text-center">Tolerància (4a Banda)</th>
                        </tr>
                    </thead>
                    <tbody>
                        {COLOR_CODES.map((code) => (
                            <tr key={code.name} className="border-b border-slate-700 hover:bg-slate-700/50">
                                <th scope="row" className="px-4 py-3 font-medium text-slate-100 whitespace-nowrap flex items-center">
                                    <div className={`w-4 h-4 rounded-full mr-3 ${code.colorClass} border border-slate-500`}></div>
                                    {code.name}
                                </th>
                                <td className="px-4 py-3 text-center">
                                    {code.value !== null ? code.value : '—'}
                                </td>
                                <td className="px-4 py-3 text-center">
                                    {code.multiplier !== null ? `x${code.multiplier.toLocaleString()}` : '—'}
                                </td>
                                <td className="px-4 py-3 text-center">
                                    {code.tolerance !== null ? `±${code.tolerance}%` : '—'}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <style>
            {`
            @keyframes fade-in {
                from { opacity: 0; transform: translateY(-10px); }
                to { opacity: 1; transform: translateY(0); }
            }
            .animate-fade-in {
                animation: fade-in 0.3s ease-out forwards;
            }
            `}
            </style>
        </div>
    );
};
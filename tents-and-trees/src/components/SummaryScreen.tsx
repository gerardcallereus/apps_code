import React from 'react';
import { ArrowLeft, BarChart3, CheckCircle2, XCircle, Activity } from 'lucide-react';
import { GameStats } from '../App';

interface SummaryScreenProps {
  stats: GameStats;
  totalLevels: number;
  onBack: () => void;
}

export function SummaryScreen({ stats, totalLevels, onBack }: SummaryScreenProps) {
  const levelsPlayed = Object.keys(stats).length;
  const totalChecks = Object.values(stats).reduce((acc, curr) => acc + curr.checks, 0);
  const totalErrors = Object.values(stats).reduce((acc, curr) => acc + curr.errors, 0);
  const levelsSolved = Object.values(stats).filter(s => s.solved).length;

  return (
    <div className="min-h-screen bg-stone-50 p-4 sm:p-8 font-sans text-stone-800">
      <div className="max-w-5xl mx-auto">
        <header className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="bg-purple-100 p-3 rounded-xl">
              <BarChart3 className="w-8 h-8 text-purple-700" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight">Resum per al Professorat</h1>
          </div>
          <button
            onClick={onBack}
            className="flex items-center gap-2 bg-white border border-stone-300 hover:bg-stone-100 text-stone-700 font-medium py-2 px-4 rounded-xl transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Tornar al joc
          </button>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-200">
            <div className="text-stone-500 font-medium mb-1 flex items-center gap-2">
              <Activity className="w-5 h-5" /> Nivells Iniciats
            </div>
            <div className="text-3xl font-bold">{levelsPlayed} <span className="text-lg text-stone-400 font-normal">/ {totalLevels}</span></div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-200">
            <div className="text-stone-500 font-medium mb-1 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-green-500" /> Nivells Resolts
            </div>
            <div className="text-3xl font-bold">{levelsSolved}</div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-200">
            <div className="text-stone-500 font-medium mb-1 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-blue-500" /> Total Comprovacions
            </div>
            <div className="text-3xl font-bold">{totalChecks}</div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-200">
            <div className="text-stone-500 font-medium mb-1 flex items-center gap-2">
              <XCircle className="w-5 h-5 text-red-500" /> Total Errors
            </div>
            <div className="text-3xl font-bold text-red-600">{totalErrors}</div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-stone-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-stone-100 text-stone-600 text-sm uppercase tracking-wider">
                  <th className="p-4 font-semibold border-b border-stone-200">Nivell</th>
                  <th className="p-4 font-semibold border-b border-stone-200">Estat</th>
                  <th className="p-4 font-semibold border-b border-stone-200 text-center">Comprovacions</th>
                  <th className="p-4 font-semibold border-b border-stone-200 text-center">Errors</th>
                  <th className="p-4 font-semibold border-b border-stone-200">Rendiment</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-200">
                {Array.from({ length: totalLevels }).map((_, i) => {
                  const stat = stats[i];
                  if (!stat) {
                    return (
                      <tr key={i} className="text-stone-400 bg-stone-50/50">
                        <td className="p-4 font-medium">Nivell {i + 1}</td>
                        <td className="p-4">No iniciat</td>
                        <td className="p-4 text-center">-</td>
                        <td className="p-4 text-center">-</td>
                        <td className="p-4">-</td>
                      </tr>
                    );
                  }

                  const errorRate = stat.checks > 0 ? (stat.errors / stat.checks) : 0;
                  let performanceColor = "text-green-600";
                  if (errorRate > 0.5 || stat.errors > 3) performanceColor = "text-red-600";
                  else if (errorRate > 0 || stat.errors > 0) performanceColor = "text-orange-500";

                  return (
                    <tr key={i} className="hover:bg-stone-50 transition-colors">
                      <td className="p-4 font-medium text-stone-900">Nivell {i + 1}</td>
                      <td className="p-4">
                        {stat.solved ? (
                          <span className="inline-flex items-center gap-1.5 py-1 px-2.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Resolt
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 py-1 px-2.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                            <Activity className="w-3.5 h-3.5" /> En procés
                          </span>
                        )}
                      </td>
                      <td className="p-4 text-center font-medium">{stat.checks}</td>
                      <td className="p-4 text-center font-medium text-red-600">{stat.errors}</td>
                      <td className="p-4">
                        <span className={`font-medium ${performanceColor}`}>
                          {stat.errors === 0 && stat.solved ? 'Perfecte!' : 
                           stat.errors <= 2 && stat.solved ? 'Molt bé' : 
                           stat.errors > 5 ? 'Necessita ajuda' : 'Millorable'}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

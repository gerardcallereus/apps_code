import React, { useState } from 'react';
import { Award, RotateCcw, CheckCircle2, Trophy, Sparkles, Target, Activity } from 'lucide-react';
import { LevelStat } from '../storage';

export interface ScoreSummaryProps {
  totalLevels: number;
  levelStats: Record<number, LevelStat>;
  currentLevelIndex: number;
  totalChecks: number;
  totalErrors: number;
  isCompleted: boolean;
  onResetProgress: () => void;
  levelNames?: string[];
}

export function ScoreSummary({
  totalLevels,
  levelStats,
  currentLevelIndex,
  totalChecks,
  totalErrors,
  isCompleted,
  onResetProgress,
  levelNames = [],
}: ScoreSummaryProps) {
  const [confirmReset, setConfirmReset] = useState(false);

  const pointsPerLevel = 10 / totalLevels;
  let totalScore = 0;
  let firstTryCount = 0;
  let solvedCount = 0;

  const levelDetails = Array.from({ length: totalLevels }).map((_, i) => {
    const levelId = i + 1;
    const stat = levelStats[levelId];
    const isSolved = stat?.solved || (i < currentLevelIndex) || isCompleted;
    const attempts = stat?.checks || 0;
    const errors = stat?.errors || 0;
    const levelName = levelNames[i] || `Nivell ${levelId}`;

    if (!isSolved && attempts === 0) {
      return {
        level: levelId,
        name: levelName,
        solved: false,
        attempts: 0,
        errors: 0,
        score: 0,
        perfText: 'Pendent',
        perfColor: 'text-slate-400',
      };
    }

    if (isSolved) {
      solvedCount++;
      if (errors === 0) firstTryCount++;

      let multiplier = 1.0;
      let perfText = 'Perfecte! (1r intent)';
      let perfColor = 'text-emerald-600 font-semibold';

      if (errors === 1) {
        multiplier = 0.9;
        perfText = 'Molt bé (2n intent)';
        perfColor = 'text-blue-600';
      } else if (errors === 2) {
        multiplier = 0.8;
        perfText = 'Correcte (3r intent)';
        perfColor = 'text-indigo-600';
      } else if (errors === 3) {
        multiplier = 0.7;
        perfText = 'Acceptable (4t intent)';
        perfColor = 'text-amber-600';
      } else if (errors >= 4) {
        multiplier = 0.5;
        perfText = 'Costós (5+ intents)';
        perfColor = 'text-red-500';
      }

      const score = pointsPerLevel * multiplier;
      totalScore += score;

      return {
        level: levelId,
        name: levelName,
        solved: true,
        attempts,
        errors,
        score,
        perfText,
        perfColor,
      };
    }

    return {
      level: levelId,
      name: levelName,
      solved: false,
      attempts,
      errors,
      score: 0,
      perfText: 'En curs',
      perfColor: 'text-orange-500 font-medium',
    };
  });

  const finalGrade = Math.min(10, Math.round(totalScore * 100) / 100);

  let gradeText = 'Insuficient';
  let gradeBadgeColor = 'text-red-700 bg-red-100 border-red-300';
  let gradeIcon = '💪';
  if (finalGrade >= 9.0) {
    gradeText = 'Excel·lent';
    gradeBadgeColor = 'text-emerald-800 bg-emerald-100 border-emerald-300';
    gradeIcon = '🏆';
  } else if (finalGrade >= 7.0) {
    gradeText = 'Notable';
    gradeBadgeColor = 'text-blue-800 bg-blue-100 border-blue-300';
    gradeIcon = '⭐';
  } else if (finalGrade >= 6.0) {
    gradeText = 'Bé';
    gradeBadgeColor = 'text-cyan-800 bg-cyan-100 border-cyan-300';
    gradeIcon = '👍';
  } else if (finalGrade >= 5.0) {
    gradeText = 'Suficient';
    gradeBadgeColor = 'text-amber-800 bg-amber-100 border-amber-300';
    gradeIcon = '👌';
  }

  return (
    <div className="space-y-6">
      {/* Banner Principal de Qualificació */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-8 -translate-y-8 w-44 h-44 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 text-blue-100 text-xs font-semibold uppercase tracking-wider mb-1">
              <Award className="w-4 h-4" /> Qualificació Global
            </div>
            <div className="flex items-baseline gap-3">
              <span className="text-4xl sm:text-5xl font-extrabold tracking-tight">
                {finalGrade.toFixed(2)}
              </span>
              <span className="text-blue-200 text-lg sm:text-xl font-medium">/ 10 punts</span>
            </div>
            <div className="mt-3 flex items-center gap-2">
              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-bold border ${gradeBadgeColor}`}>
                <span>{gradeIcon}</span>
                <span>{gradeText}</span>
              </span>
              <span className="text-xs text-blue-100">
                ({pointsPerLevel.toFixed(2)} pts màx. per nivell)
              </span>
            </div>
          </div>

          {/* Estadístiques ràpides */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/10 text-center">
            <div>
              <div className="text-xs text-blue-100 font-medium">Nivells superats</div>
              <div className="text-xl font-bold mt-0.5">
                {solvedCount} <span className="text-xs font-normal text-blue-200">/ {totalLevels}</span>
              </div>
            </div>
            <div>
              <div className="text-xs text-blue-100 font-medium">Al 1r intent</div>
              <div className="text-xl font-bold text-emerald-300 mt-0.5">
                {firstTryCount}
              </div>
            </div>
            <div className="col-span-2 sm:col-span-1">
              <div className="text-xs text-blue-100 font-medium">Total intents/errors</div>
              <div className="text-xl font-bold mt-0.5">
                {totalChecks} <span className="text-xs font-normal text-red-300">({totalErrors} err)</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Criteris de puntuació informatius */}
      <div className="bg-slate-100 border border-slate-200 rounded-xl p-4 text-xs text-slate-600">
        <p className="font-semibold text-slate-800 mb-1 flex items-center gap-1.5">
          <Target className="w-3.5 h-3.5 text-blue-600" /> Com es calcula la nota?
        </p>
        <p>
          Cada nivell val fins a <strong>{pointsPerLevel.toFixed(2)} punts</strong>. 
          Al 1r intent (sense errors) obtens el 100%, al 2n intent el 90%, al 3r el 80%, al 4t el 70% i a partir del 5è intent el 50%.
        </p>
      </div>

      {/* Taula de Desglossament per Nivell */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <h3 className="font-bold text-slate-800 text-sm sm:text-base">Detall per Nivells</h3>
          <span className="text-xs text-slate-500">20 Nivells de Conway</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                <th className="py-2.5 px-3 sm:px-4">Nivell</th>
                <th className="py-2.5 px-3 sm:px-4 text-center">Estat</th>
                <th className="py-2.5 px-3 sm:px-4 text-center">Intents</th>
                <th className="py-2.5 px-3 sm:px-4 text-center">Errors</th>
                <th className="py-2.5 px-3 sm:px-4 text-center">Punts</th>
                <th className="py-2.5 px-3 sm:px-4">Rendiment</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {levelDetails.map((item) => (
                <tr key={item.level} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-2.5 px-3 sm:px-4 font-medium text-slate-800 whitespace-nowrap">
                    {item.name}
                  </td>
                  <td className="py-2.5 px-3 sm:px-4 text-center whitespace-nowrap">
                    {item.solved ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                        <CheckCircle2 className="w-3 h-3" /> Superat
                      </span>
                    ) : item.attempts > 0 ? (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        En curs
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-500">
                        Pendent
                      </span>
                    )}
                  </td>
                  <td className="py-2.5 px-3 sm:px-4 text-center font-medium text-slate-600">
                    {item.attempts > 0 ? item.attempts : '-'}
                  </td>
                  <td className="py-2.5 px-3 sm:px-4 text-center font-medium text-red-500">
                    {item.errors > 0 ? item.errors : item.attempts > 0 ? '0' : '-'}
                  </td>
                  <td className="py-2.5 px-3 sm:px-4 text-center font-semibold text-slate-800 whitespace-nowrap">
                    +{item.score.toFixed(2)} pts
                  </td>
                  <td className="py-2.5 px-3 sm:px-4 whitespace-nowrap">
                    <span className={item.perfColor}>{item.perfText}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Zona per reiniciar progrés si es vol millorar la nota */}
      <div className="bg-white rounded-xl p-4 sm:p-5 border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h4 className="font-bold text-slate-800 text-sm">Vols reiniciar la partida per millorar la teva nota?</h4>
          <p className="text-xs text-slate-500 mt-0.5">
            Es restabliran tots els nivells i comptadors d'intents desats al navegador.
          </p>
        </div>
        {!confirmReset ? (
          <button
            onClick={() => setConfirmReset(true)}
            className="flex items-center gap-2 border border-red-200 hover:border-red-300 text-red-600 hover:bg-red-50 font-medium py-2 px-4 rounded-xl text-xs sm:text-sm transition-colors whitespace-nowrap cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reiniciar tota la partida
          </button>
        ) : (
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setConfirmReset(false);
                onResetProgress();
              }}
              className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-3.5 rounded-xl text-xs sm:text-sm transition-colors cursor-pointer"
            >
              Confirmar reinici
            </button>
            <button
              onClick={() => setConfirmReset(false)}
              className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium py-2 px-3 rounded-xl text-xs sm:text-sm transition-colors cursor-pointer"
            >
              Cancel·lar
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

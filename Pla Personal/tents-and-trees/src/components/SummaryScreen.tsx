import React, { useState } from 'react';
import { ArrowLeft, BarChart3, CheckCircle2, XCircle, Activity, Award, Sparkles, RotateCcw, Target } from 'lucide-react';
import { GameStats } from '../App';

interface SummaryScreenProps {
  stats: GameStats;
  totalLevels: number;
  onBack: () => void;
  onResetProgress?: () => void;
}

export function SummaryScreen({ stats, totalLevels, onBack, onResetProgress }: SummaryScreenProps) {
  const [confirmReset, setConfirmReset] = useState(false);

  const levelsPlayed = Object.keys(stats).length;
  const totalChecks = Object.values(stats).reduce((acc, curr) => acc + curr.checks, 0);
  const totalErrors = Object.values(stats).reduce((acc, curr) => acc + curr.errors, 0);
  const levelsSolved = Object.values(stats).filter(s => s.solved).length;

  const pointsPerLevel = 10 / totalLevels;
  let totalScore = 0;
  let firstTryCount = 0;

  const levelDetails = Array.from({ length: totalLevels }).map((_, i) => {
    const stat = stats[i];
    if (!stat || !stat.solved) {
      return {
        level: i + 1,
        stat,
        score: 0,
        solved: !!stat?.solved,
        attempts: stat ? stat.checks : 0,
        errors: stat ? stat.errors : 0,
      };
    }

    if (stat.errors === 0) firstTryCount++;

    // Calculate score based on errors:
    // 0 errors (1st attempt): 100% of points
    // 1 error (2nd attempt): 90%
    // 2 errors (3rd attempt): 80%
    // 3 errors (4th attempt): 70%
    // 4+ errors (5+ attempts): 50%
    let multiplier = 1.0;
    if (stat.errors === 1) multiplier = 0.9;
    else if (stat.errors === 2) multiplier = 0.8;
    else if (stat.errors === 3) multiplier = 0.7;
    else if (stat.errors >= 4) multiplier = 0.5;

    const score = pointsPerLevel * multiplier;
    totalScore += score;

    return {
      level: i + 1,
      stat,
      score,
      solved: true,
      attempts: stat.checks,
      errors: stat.errors,
    };
  });

  const finalGrade = Math.min(10, Math.round(totalScore * 10) / 10);
  const solvedLevels = Object.values(stats).filter(s => s.solved);
  const avgAttempts = solvedLevels.length > 0 
    ? (solvedLevels.reduce((acc, s) => acc + s.checks, 0) / solvedLevels.length).toFixed(1)
    : '0';

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
    <div className="min-h-screen bg-stone-50 p-4 sm:p-8 font-sans text-stone-800">
      <div className="max-w-5xl mx-auto">
        <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-3">
            <div className="bg-purple-100 p-3 rounded-xl">
              <BarChart3 className="w-8 h-8 text-purple-700" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Resum de Rendiment</h1>
              <p className="text-sm text-stone-500">Avaluació detallada i nota final de la partida</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={onBack}
              className="flex items-center gap-2 bg-white border border-stone-300 hover:bg-stone-100 text-stone-700 font-medium py-2 px-4 rounded-xl transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              Tornar al joc
            </button>
          </div>
        </header>

        {/* Banner principal amb la Nota Final */}
        <div className="bg-gradient-to-r from-orange-500 to-amber-500 rounded-3xl p-6 sm:p-8 text-white shadow-lg mb-8 relative overflow-hidden">
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 text-orange-100 text-sm font-semibold uppercase tracking-wider mb-1">
                <Award className="w-5 h-5" /> Qualificació Global
              </div>
              <h2 className="text-2xl sm:text-3xl font-black">Nota Final del Joc</h2>
              <p className="text-orange-100 text-sm max-w-xl mt-1">
                Calculada sobre 10 punts en funció dels 20 nivells i del nombre d'intents necessaris per resoldre cadascun.
              </p>
            </div>

            <div className="flex items-center gap-4 bg-white/15 backdrop-blur-md px-6 py-4 rounded-2xl border border-white/20 self-start md:self-auto">
              <div className="text-center">
                <div className="text-4xl sm:text-5xl font-black tracking-tight">{finalGrade.toFixed(1)}</div>
                <div className="text-xs text-orange-100 font-medium">sobre 10</div>
              </div>
              <div className="h-10 w-px bg-white/30" />
              <div className={`px-3 py-1.5 rounded-xl border text-sm font-bold flex items-center gap-1.5 shadow-sm bg-white text-stone-800 border-white/40`}>
                <span>{gradeIcon}</span>
                <span>{gradeText}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Targetes de mètriques secundàries */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-stone-200">
            <div className="text-stone-500 font-medium mb-1 text-sm flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-500" /> Nivells Resolts
            </div>
            <div className="text-2xl font-bold text-stone-900">
              {levelsSolved} <span className="text-sm text-stone-400 font-normal">/ {totalLevels}</span>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl shadow-sm border border-stone-200">
            <div className="text-stone-500 font-medium mb-1 text-sm flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500" /> Al 1r intent (sense error)
            </div>
            <div className="text-2xl font-bold text-stone-900">
              {firstTryCount} <span className="text-sm text-stone-400 font-normal">nivells</span>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl shadow-sm border border-stone-200">
            <div className="text-stone-500 font-medium mb-1 text-sm flex items-center gap-2">
              <Target className="w-4 h-4 text-blue-500" /> Mitjana d'intents / nivell
            </div>
            <div className="text-2xl font-bold text-stone-900">{avgAttempts}</div>
          </div>

          <div className="bg-white p-5 rounded-2xl shadow-sm border border-stone-200">
            <div className="text-stone-500 font-medium mb-1 text-sm flex items-center gap-2">
              <XCircle className="w-4 h-4 text-red-500" /> Total Errors comessos
            </div>
            <div className="text-2xl font-bold text-red-600">{totalErrors}</div>
          </div>
        </div>

        {/* Taula de detall per nivells */}
        <div className="bg-white rounded-2xl shadow-sm border border-stone-200 overflow-hidden mb-8">
          <div className="p-4 sm:p-5 border-b border-stone-200 bg-stone-50/50 flex items-center justify-between">
            <h3 className="font-bold text-stone-800 text-lg">Detall per Nivell</h3>
            <span className="text-xs text-stone-500">Màx. {pointsPerLevel.toFixed(2)} pts per nivell</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-stone-100 text-stone-600 text-xs uppercase tracking-wider">
                  <th className="p-4 font-semibold border-b border-stone-200">Nivell</th>
                  <th className="p-4 font-semibold border-b border-stone-200">Estat</th>
                  <th className="p-4 font-semibold border-b border-stone-200 text-center">Intents</th>
                  <th className="p-4 font-semibold border-b border-stone-200 text-center">Errors</th>
                  <th className="p-4 font-semibold border-b border-stone-200 text-center">Punts</th>
                  <th className="p-4 font-semibold border-b border-stone-200">Rendiment</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-200 text-sm">
                {levelDetails.map(item => {
                  if (!item.stat) {
                    return (
                      <tr key={item.level} className="text-stone-400 bg-stone-50/30">
                        <td className="p-4 font-medium">Nivell {item.level}</td>
                        <td className="p-4">No iniciat</td>
                        <td className="p-4 text-center">-</td>
                        <td className="p-4 text-center">-</td>
                        <td className="p-4 text-center">0.00 pts</td>
                        <td className="p-4">-</td>
                      </tr>
                    );
                  }

                  let perfText = 'Millorable';
                  let perfColor = 'text-amber-600';
                  if (item.solved) {
                    if (item.errors === 0) {
                      perfText = 'Perfecte! (1r intent)';
                      perfColor = 'text-emerald-600 font-semibold';
                    } else if (item.errors === 1) {
                      perfText = 'Molt bé (2n intent)';
                      perfColor = 'text-blue-600';
                    } else if (item.errors <= 3) {
                      perfText = 'Correcte';
                      perfColor = 'text-stone-700';
                    } else {
                      perfText = 'Costós (4+ errors)';
                      perfColor = 'text-red-500';
                    }
                  } else {
                    perfText = 'En curs';
                    perfColor = 'text-orange-500';
                  }

                  return (
                    <tr key={item.level} className="hover:bg-stone-50 transition-colors">
                      <td className="p-4 font-medium text-stone-900">Nivell {item.level}</td>
                      <td className="p-4">
                        {item.solved ? (
                          <span className="inline-flex items-center gap-1.5 py-1 px-2.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Resolt
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 py-1 px-2.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                            <Activity className="w-3.5 h-3.5" /> En procés
                          </span>
                        )}
                      </td>
                      <td className="p-4 text-center font-medium">{item.attempts}</td>
                      <td className="p-4 text-center font-medium text-red-600">{item.errors}</td>
                      <td className="p-4 text-center font-semibold text-stone-800">
                        +{item.score.toFixed(2)} pts
                      </td>
                      <td className="p-4">
                        <span className={perfColor}>{perfText}</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Zona per reiniciar progrés si es vol */}
        {onResetProgress && (
          <div className="bg-white rounded-2xl p-6 border border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h4 className="font-bold text-stone-800">Vols repetir la partida per millorar la teva nota?</h4>
              <p className="text-xs text-stone-500 mt-0.5">
                Es restabliran tots els nivells i comptadors d'intents desats al navegador.
              </p>
            </div>
            {!confirmReset ? (
              <button
                onClick={() => setConfirmReset(true)}
                className="flex items-center gap-2 border border-red-200 hover:border-red-300 text-red-600 hover:bg-red-50 font-medium py-2 px-4 rounded-xl text-sm transition-colors whitespace-nowrap"
              >
                <RotateCcw className="w-4 h-4" />
                Reiniciar tota la partida
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setConfirmReset(false);
                    onResetProgress();
                  }}
                  className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-xl text-sm transition-colors"
                >
                  Confirmar reinici
                </button>
                <button
                  onClick={() => setConfirmReset(false)}
                  className="bg-stone-100 hover:bg-stone-200 text-stone-700 font-medium py-2 px-3 rounded-xl text-sm transition-colors"
                >
                  Cancel·lar
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

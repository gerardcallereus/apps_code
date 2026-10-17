import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  BookOpen, 
  ArrowRight, 
  ArrowLeft, 
  UserMinus, 
  Heart, 
  Users, 
  Sparkles, 
  Grid3X3, 
  HelpCircle,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';

interface RulesScreenProps {
  onContinue: () => void;
  onBackToVideo: () => void;
}

export const RulesScreen: React.FC<RulesScreenProps> = ({ onContinue, onBackToVideo }) => {
  const [selectedRule, setSelectedRule] = useState<number>(1);

  const rulesData = [
    {
      id: 1,
      title: "Regla 1: Mort per Solitud (Subpoblació)",
      tag: "Cèl·lula VIVA",
      icon: UserMinus,
      condition: "Té 0 o 1 veí viu (< 2 veïns)",
      result: "Mor i s'apaga (es torna blanca)",
      color: "red",
      description: "Les cèl·lules necessiten interacció social per subsistir. Si una cèl·lula està aïllada o només té un únic veí al voltant, no té prou suport i mor a la següent generació.",
      beforeGrid: [
        [0, 1, 0],
        [0, 1, 0],
        [0, 0, 0]
      ],
      targetCoord: [1, 1],
      afterGrid: [
        [0, 0, 0],
        [0, 0, 0],
        [0, 0, 0]
      ],
      note: "La cèl·lula central viva només té 1 veí viu a dalt. Com que 1 < 2, a la següent generació MOR."
    },
    {
      id: 2,
      title: "Regla 2: Supervivència Equilibrada",
      tag: "Cèl·lula VIVA",
      icon: Heart,
      condition: "Té 2 o 3 veïns vius",
      result: "Segueix VIVA a la següent generació",
      color: "emerald",
      description: "Aquest és l'interval d'or per a la vida cel·lular. Si una cèl·lula viva està acompanyada per 2 o 3 veïnes, l'ecosistema està en equilibri i es manté viva.",
      beforeGrid: [
        [1, 0, 0],
        [0, 1, 0],
        [0, 0, 1]
      ],
      targetCoord: [1, 1],
      afterGrid: [
        [0, 0, 0],
        [0, 1, 0],
        [0, 0, 0]
      ],
      note: "La cèl·lula central té 2 veïns a les diagonals. Com que té exactament 2 veïns, SOBREVIU."
    },
    {
      id: 3,
      title: "Regla 3: Mort per Sobrepoblació",
      tag: "Cèl·lula VIVA",
      icon: Users,
      condition: "Té 4, 5, 6, 7 o 8 veïns vius (> 3 veïns)",
      result: "Mor per asfíxia (es torna blanca)",
      color: "amber",
      description: "Quan una cèl·lula té massa veïns al seu voltant, els recursos s'esgoten per massificació. Tota cèl·lula viva amb 4 o més veïns mor a la següent generació.",
      beforeGrid: [
        [0, 1, 0],
        [1, 1, 1],
        [0, 1, 0]
      ],
      targetCoord: [1, 1],
      afterGrid: [
        [0, 1, 0],
        [1, 0, 1],
        [0, 1, 0]
      ],
      note: "La cèl·lula central té 4 veïns (dalt, baix, esquerra, dreta). Com que 4 > 3, MOR per sobrepoblació."
    },
    {
      id: 4,
      title: "Regla 4: Naixement per Reproducció",
      tag: "Casella MORTA / BUIDA",
      icon: Sparkles,
      condition: "Té exactament 3 veïns vius (ni 2, ni 4)",
      result: "NEIX una nova cèl·lula viva (es torna verda)",
      color: "blue",
      description: "Aquesta és l'única regla que crea vida a partir del no-res. Si una casella buida (morta) està envoltada per exactament 3 cèl·lules vives, les condicions de fertilitat provoquen un nou naixement.",
      beforeGrid: [
        [1, 1, 0],
        [1, 0, 0],
        [0, 0, 0]
      ],
      targetCoord: [1, 1],
      afterGrid: [
        [1, 1, 0],
        [1, 1, 0],
        [0, 0, 0]
      ],
      note: "La casella buida central toca les 3 cèl·lules vives de la cantonada. Com que té exactament 3 veïns, NEIX una cèl·lula."
    }
  ];

  const currentRuleData = rulesData.find(r => r.id === selectedRule) || rulesData[0];

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 font-sans text-slate-800">
      <div className="max-w-4xl mx-auto">
        {/* Capçalera */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-200 mb-8"
        >
          <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center shadow-inner">
                <BookOpen className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-200">
                  Pas previ al Tutorial
                </span>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
                  Les 4 Regles del Joc de la Vida
                </h1>
              </div>
            </div>
            
            <button
              onClick={onBackToVideo}
              className="text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1.5 px-3 py-2 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer border border-slate-200"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Tornar a veure el vídeo
            </button>
          </div>

          <p className="text-slate-600 text-base leading-relaxed">
            Abans d'aprendre les tècniques per resoldre els escenaris, hem de tenir molt clares les <strong className="text-slate-800">4 regles fonamentals</strong> establertes pel matemàtic John Conway el 1970. Totes les cèl·lules de la graella evolucionen a la vegada segons aquestes lleis!
          </p>
        </motion.div>

        {/* Bloc 1: El Veïnat de Moore (8 Veïns) */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-indigo-50 to-blue-50 border border-indigo-200/80 rounded-3xl p-6 sm:p-8 shadow-md mb-8"
        >
          <div className="flex items-start gap-4 mb-4">
            <div className="p-3 bg-indigo-600 text-white rounded-2xl shadow-sm shrink-0">
              <Grid3X3 className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-indigo-950">
                El Concepte Clau: Els 8 Veïns (Veïnat de Moore)
              </h2>
              <p className="text-indigo-900/80 text-sm mt-1">
                Per saber què li passarà a qualsevol casella, <strong className="text-indigo-950">només cal mirar les 8 caselles que la toquen</strong> (dalt, baix, esquerra, dreta i les 4 diagonals).
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center mt-6 pt-4 border-t border-indigo-100">
            {/* Diagrama 3x3 */}
            <div className="flex flex-col items-center justify-center p-4 bg-white rounded-2xl border border-indigo-100 shadow-sm">
              <div className="grid grid-cols-3 gap-2">
                <div className="w-12 h-12 rounded-lg bg-indigo-100 border-2 border-indigo-300 flex flex-col items-center justify-center text-xs font-bold text-indigo-700 shadow-sm">
                  <span>Veí</span>
                  <span className="text-[10px] text-indigo-500 font-normal">↖</span>
                </div>
                <div className="w-12 h-12 rounded-lg bg-indigo-100 border-2 border-indigo-300 flex flex-col items-center justify-center text-xs font-bold text-indigo-700 shadow-sm">
                  <span>Veí</span>
                  <span className="text-[10px] text-indigo-500 font-normal">↑</span>
                </div>
                <div className="w-12 h-12 rounded-lg bg-indigo-100 border-2 border-indigo-300 flex flex-col items-center justify-center text-xs font-bold text-indigo-700 shadow-sm">
                  <span>Veí</span>
                  <span className="text-[10px] text-indigo-500 font-normal">↗</span>
                </div>
                
                <div className="w-12 h-12 rounded-lg bg-indigo-100 border-2 border-indigo-300 flex flex-col items-center justify-center text-xs font-bold text-indigo-700 shadow-sm">
                  <span>Veí</span>
                  <span className="text-[10px] text-indigo-500 font-normal">←</span>
                </div>
                <div className="w-12 h-12 rounded-lg bg-amber-500 border-2 border-amber-600 flex flex-col items-center justify-center text-xs font-black text-white shadow-md animate-pulse">
                  <span>TU</span>
                  <span className="text-[9px] font-semibold">Casella</span>
                </div>
                <div className="w-12 h-12 rounded-lg bg-indigo-100 border-2 border-indigo-300 flex flex-col items-center justify-center text-xs font-bold text-indigo-700 shadow-sm">
                  <span>Veí</span>
                  <span className="text-[10px] text-indigo-500 font-normal">→</span>
                </div>

                <div className="w-12 h-12 rounded-lg bg-indigo-100 border-2 border-indigo-300 flex flex-col items-center justify-center text-xs font-bold text-indigo-700 shadow-sm">
                  <span>Veí</span>
                  <span className="text-[10px] text-indigo-500 font-normal">↙</span>
                </div>
                <div className="w-12 h-12 rounded-lg bg-indigo-100 border-2 border-indigo-300 flex flex-col items-center justify-center text-xs font-bold text-indigo-700 shadow-sm">
                  <span>Veí</span>
                  <span className="text-[10px] text-indigo-500 font-normal">↓</span>
                </div>
                <div className="w-12 h-12 rounded-lg bg-indigo-100 border-2 border-indigo-300 flex flex-col items-center justify-center text-xs font-bold text-indigo-700 shadow-sm">
                  <span>Veí</span>
                  <span className="text-[10px] text-indigo-500 font-normal">↘</span>
                </div>
              </div>
              <span className="text-[11px] font-medium text-slate-500 mt-3">Caixa 3×3 al voltant de qualsevol cel·la</span>
            </div>

            {/* Punts explicatius */}
            <div className="md:col-span-2 space-y-3 text-sm text-slate-700">
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <p>
                  <strong>Les diagonals SÍ que compten:</strong> Sovint ens descuidem de les cantonades, però al Joc de la Vida toquen i compten exactament igual que les adjacents rectes.
                </p>
              </div>
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <p>
                  <strong>Només es compten les cèl·lules VIVES (verdes):</strong> Les caselles blanques (mortes) no sumen. Només comptem quants veïns verds hi ha entre els 8 possibles.
                </p>
              </div>
              <div className="flex items-start gap-2.5">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <p>
                  <strong>A les vores del tauler:</strong> Les caselles dels marges tenen menys veïns (5 a les vores i 3 a les cantonades), ja que fora de la graella no hi ha cèl·lules.
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Bloc 2: Navegació de les 4 Regles */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <span>Les 4 Regles en Detall</span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-200 text-slate-700">
                Fes clic per explorar cadascuna
              </span>
            </h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
            {rulesData.map((rule) => {
              const Icon = rule.icon;
              const isSelected = selectedRule === rule.id;
              return (
                <button
                  key={rule.id}
                  onClick={() => setSelectedRule(rule.id)}
                  className={`p-3.5 rounded-2xl border-2 text-left transition-all flex flex-col justify-between cursor-pointer ${
                    isSelected 
                      ? 'border-blue-600 bg-blue-50 shadow-md ring-2 ring-blue-600/20' 
                      : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs ${
                      rule.color === 'red' ? 'bg-red-100 text-red-700' :
                      rule.color === 'emerald' ? 'bg-emerald-100 text-emerald-700' :
                      rule.color === 'amber' ? 'bg-amber-100 text-amber-700' :
                      'bg-blue-100 text-blue-700'
                    }`}>
                      {rule.id}
                    </span>
                    <Icon className={`w-4 h-4 ${
                      rule.color === 'red' ? 'text-red-500' :
                      rule.color === 'emerald' ? 'text-emerald-500' :
                      rule.color === 'amber' ? 'text-amber-500' :
                      'text-blue-500'
                    }`} />
                  </div>
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider block text-slate-400">
                      {rule.tag}
                    </span>
                    <span className="text-xs sm:text-sm font-bold text-slate-800 line-clamp-1">
                      {rule.id === 1 ? 'Solitud' : rule.id === 2 ? 'Supervivència' : rule.id === 3 ? 'Sobrepoblació' : 'Reproducció'}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Targeta interactiva de la regla seleccionada */}
          <motion.div
            key={currentRuleData.id}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-200"
          >
            <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <span className={`w-9 h-9 rounded-xl flex items-center justify-center font-black text-base ${
                  currentRuleData.color === 'red' ? 'bg-red-100 text-red-700' :
                  currentRuleData.color === 'emerald' ? 'bg-emerald-100 text-emerald-700' :
                  currentRuleData.color === 'amber' ? 'bg-amber-100 text-amber-700' :
                  'bg-blue-100 text-blue-700'
                }`}>
                  {currentRuleData.id}
                </span>
                <div>
                  <h3 className="text-lg sm:text-xl font-bold text-slate-900">
                    {currentRuleData.title}
                  </h3>
                  <span className="text-xs font-semibold text-slate-500">
                    Aplica sobre: <strong className="text-slate-700">{currentRuleData.tag}</strong>
                  </span>
                </div>
              </div>

              <div className={`px-3 py-1 rounded-full text-xs font-bold border ${
                currentRuleData.color === 'red' ? 'bg-red-50 text-red-700 border-red-200' :
                currentRuleData.color === 'emerald' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                currentRuleData.color === 'amber' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                'bg-blue-50 text-blue-700 border-blue-200'
              }`}>
                {currentRuleData.condition}
              </div>
            </div>

            <p className="text-slate-600 text-sm sm:text-base my-5 leading-relaxed">
              {currentRuleData.description}
            </p>

            {/* Demostració Visual Abans / Després */}
            <div className="bg-slate-50 rounded-2xl p-4 sm:p-6 border border-slate-200/80">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-4 text-center">
                Exemple Gràfic (Abans i Després d'avançar 1 generació)
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-10">
                {/* Abans */}
                <div className="flex flex-col items-center">
                  <span className="text-xs font-semibold text-slate-600 mb-2">Generació Actual (t)</span>
                  <div className="grid grid-cols-3 gap-1.5 p-2 bg-white rounded-xl border border-slate-300 shadow-sm">
                    {currentRuleData.beforeGrid.map((row, r) =>
                      row.map((val, c) => {
                        const isTarget = r === currentRuleData.targetCoord[0] && c === currentRuleData.targetCoord[1];
                        return (
                          <div
                            key={`${r}-${c}`}
                            className={`w-10 h-10 rounded-lg flex items-center justify-center text-xs font-bold transition-all ${
                              val === 1 ? 'bg-emerald-500 text-white shadow-sm' : 'bg-slate-100 text-slate-400'
                            } ${isTarget ? 'ring-2 ring-blue-600 ring-offset-2' : ''}`}
                            title={isTarget ? "Cèl·lula que analitzem" : undefined}
                          >
                            {isTarget ? (val === 1 ? '🎯' : '⭕') : (val === 1 ? '●' : '')}
                          </div>
                        );
                      })
                    )}
                  </div>
                  <span className="text-[11px] text-slate-500 mt-1.5 font-medium">🎯 Cèl·lula en anàlisi</span>
                </div>

                <div className="flex flex-col items-center justify-center text-slate-400">
                  <div className="w-10 h-10 rounded-full bg-slate-200/70 flex items-center justify-center text-slate-600 font-bold">
                    <ArrowRight className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-bold text-slate-500 uppercase mt-1">Evolució</span>
                </div>

                {/* Després */}
                <div className="flex flex-col items-center">
                  <span className="text-xs font-semibold text-slate-600 mb-2">Següent Generació (t+1)</span>
                  <div className="grid grid-cols-3 gap-1.5 p-2 bg-white rounded-xl border border-slate-300 shadow-sm">
                    {currentRuleData.afterGrid.map((row, r) =>
                      row.map((val, c) => {
                        const isTarget = r === currentRuleData.targetCoord[0] && c === currentRuleData.targetCoord[1];
                        return (
                          <div
                            key={`${r}-${c}`}
                            className={`w-10 h-10 rounded-lg flex items-center justify-center text-xs font-bold transition-all ${
                              val === 1 ? 'bg-emerald-500 text-white shadow-sm' : 'bg-slate-100 text-slate-400'
                            } ${isTarget ? 'ring-2 ring-blue-600 ring-offset-2' : ''}`}
                          >
                            {isTarget ? (val === 1 ? '✓' : '✗') : (val === 1 ? '●' : '')}
                          </div>
                        );
                      })
                    )}
                  </div>
                  <span className={`text-[11px] mt-1.5 font-bold ${
                    currentRuleData.color === 'emerald' || currentRuleData.color === 'blue' 
                      ? 'text-emerald-700' 
                      : 'text-red-600'
                  }`}>
                    {currentRuleData.result}
                  </span>
                </div>
              </div>

              {/* Nota d'explicació de l'exemple */}
              <div className="mt-5 p-3 bg-white rounded-xl border border-slate-200 text-xs text-slate-700 text-center flex items-center justify-center gap-2">
                <HelpCircle className="w-4 h-4 text-blue-500 shrink-0" />
                <span>{currentRuleData.note}</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Resum mnemotècnic ràpid */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm mb-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900">Truc de Memòria Ràpid:</h4>
              <p className="text-xs text-slate-600">
                Cèl·lula VIVA només viu amb <strong className="text-emerald-700">2 o 3 veïns</strong>. Casella MORTA només neix amb <strong className="text-blue-700">exactament 3 veïns</strong>.
              </p>
            </div>
          </div>

          <div className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1.5 rounded-lg shrink-0">
            Qualsevol altre número = MORT / BUIT
          </div>
        </div>

        {/* Botó per continuar al tutorial */}
        <div className="text-center pt-2 pb-6">
          <button
            onClick={onContinue}
            className="py-4 px-8 bg-blue-600 hover:bg-blue-700 text-white rounded-full font-bold text-base sm:text-lg shadow-xl shadow-blue-600/30 hover:shadow-blue-600/50 hover:-translate-y-1 transition-all inline-flex items-center justify-center gap-3 cursor-pointer"
          >
            <span>Anar al Tutorial Guiat de Tècniques (Exemple 1 de 3)</span>
            <ArrowRight className="w-5 h-5" />
          </button>
          <div className="mt-3 text-xs text-slate-500">
            A continuació aprendràs la metodologia pas a pas per no bloquejar-te mai.
          </div>
        </div>
      </div>
    </div>
  );
};

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, XCircle, ChevronRight, RotateCcw } from 'lucide-react';
import { cn } from '../lib/utils';
import { QuizQuestion } from '../types';

const QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    question: "Quina de les següents opcions és una substància pura (element)?",
    options: ["Aigua salada", "Or (Au)", "Aire", "Llet"],
    correctAnswerIndex: 1,
    explanation: "L'or és un element químic, per tant és una substància pura. L'aigua salada i l'aire són mescles homogènies, i la llet és un col·loide."
  },
  {
    id: 2,
    question: "Quan barregem aigua i oli, quin tipus de mescla obtenim?",
    options: ["Homogènia", "Heterogènia", "Col·loide", "Dissolució"],
    correctAnswerIndex: 1,
    explanation: "S'obté una mescla heterogènia perquè podem distingir les diferents fases (aigua i oli) a simple vista."
  },
  {
    id: 3,
    question: "Quin mètode de separació utilitzaries per separar aigua i sorra?",
    options: ["Imantació", "Evaporació", "Filtració", "Decantació"],
    correctAnswerIndex: 2,
    explanation: "La filtració és ideal per separar un sòlid insoluble (com la sorra) d'un líquid (l'aigua)."
  },
  {
    id: 4,
    question: "L'efecte Tyndall ens serveix per identificar...",
    options: ["Mescles homogènies", "Elements químics", "Col·loides", "Compostos purs"],
    correctAnswerIndex: 2,
    explanation: "Els col·loides dispersen un feix de llum al seu pas (efecte Tyndall), mentre que les dissolucions veritables no ho fan."
  },
  {
    id: 5,
    question: "Per separar l'oli de l'aigua, que són líquids immiscibles amb diferent densitat, utilitzem:",
    options: ["Decantació", "Cristal·lització", "Imantació", "Filtració"],
    correctAnswerIndex: 0,
    explanation: "S'utilitza un embut de decantació. L'aigua, més densa, queda baix i l'oli dalt, podent treure l'aigua controlant l'aixeta."
  },
  {
    id: 6,
    question: "Com separaríes la sal de l'aigua del mar un cop recollida?",
    options: ["Amb un filtre", "Aproximant un imant", "Amb un embut de decantació", "Escalfant la mescla perquè l'aigua s'evapori"],
    correctAnswerIndex: 3,
    explanation: "En tractar-se d'una dissolució, el sòlid dissolt (sal) s'obté per evaporació o cristal·lització del dissolvent (aigua)."
  },
  {
    id: 7,
    question: "Què diferencia principalment un col·loide d'una dissolució veritable?",
    options: ["La mida de partícules: en el col·loide són més grans i presenten efecte Tyndall.", "Les partícules de la dissolució es poden veure al microscopi.", "Els col·loides només s'originen en mescles de gasos.", "No hi ha cap diferència gaire apreciable."],
    correctAnswerIndex: 0,
    explanation: "Un col·loide té partícules més grans que una dissolució, però prou petites per no caure al fons. A més, dispersen la llum (efecte Tyndall)."
  },
  {
    id: 8,
    question: "Un exemple quotidià d'una emulsió (un tipus de col·loide) seria:",
    options: ["L'aigua de l'aixeta.", "La maionesa.", "La sopa de galets.", "La sal dissolta en aigua calenta."],
    correctAnswerIndex: 1,
    explanation: "La maionesa és una emulsió estable formada per petites gotes d'oli disperses en aigua, gràcies al rovell d'ou que actua com a emulsionant."
  },
  {
    id: 9,
    question: "Una suspensió consisteix en una mescla on...",
    options: ["Les partícules sòlides queden surant sense caure mai a terra.", "Les partícules s'evaporen com si fossin un líquid.", "Les partícules sòlides insolubles, amb el temps, acaben dipositant-se al fons.", "Totes les partícules estan integrades de manera homogènia i invisible."],
    correctAnswerIndex: 2,
    explanation: "En una suspensió, com l'aigua amb fang, les fraccions de sòlid són prou grans com per acabar decantant-se o sedimentant a sota si deixem la mescla en repòs."
  },
  {
    id: 10,
    question: "Un xarop mèdic on s'indica \"agitar bé abans de prendre\" probablement és...",
    options: ["Un element pur de laboratori.", "Una suspensió (mescla heterogènia).", "Una dissolució ideal.", "Aigua destil·lada."],
    correctAnswerIndex: 1,
    explanation: "Molts xarops són suspensions on el medicament sòlid (insoluble) ha anat caient al fons de l'ampolla per l'acció de la gravetat; per això s'han de remenar bé per tornar a dispersar-lo."
  },
  {
    id: 11,
    question: "Quin mètode faries servir per separar pedres de diferents mides de la sorra fina?",
    options: ["Decantació", "Imantació", "Tamisatge (Garbellat)", "Afegeix aigua per desfer-les"],
    correctAnswerIndex: 2,
    explanation: "El tamisatge o garbellat permet separar sòlids de diferent mida utilitzant una malla o tamís amb forats d'una mida concreta."
  },
  {
    id: 12,
    question: "Si tirem al mateix pot oli, aigua i mel (considerant que són immiscibles). Com s'ordenaran, d'abaix cap a dalt?",
    options: ["Mel, aigua, oli", "Aigua, oli, mel", "Oli, aigua, mel", "Es barregen formant una emulsió automàticament"],
    correctAnswerIndex: 0,
    explanation: "S'ordenen segons la seva densitat. El més dens (la mel) anirà al fons, seguit de l'aigua i, a dalt de tot flotarà l'oli (el menys dens)."
  },
  {
    id: 13,
    question: "Si observem que un objecte o líquid sempre flota per sobre d'un altre (com l'oli sobre l'aigua), a què és degut?",
    options: ["A que el líquid que flota té una densitat menor.", "A que té una temperatura més alta.", "A la reacció química entre líquids.", "Només passa si es barreja amb aire."],
    correctAnswerIndex: 0,
    explanation: "La flotabilitat depèn de la densitat. Les substàncies amb menor densitat (com l'oli o el carbó respecte de l'aigua) flotaran per sobre d'aquelles amb densitat més gran."
  },
  {
    id: 14,
    question: "Durant l'evaporació d'aigua salada en un recipient al foc, què li passa a l'aigua i què li passa a la sal?",
    options: ["La sal i l'aigua s'evaporen juntes.", "L'aigua i la sal s'ajunten en pedres.", "L'aigua canvia a estat gasós i s'escapa, però la sal queda cristal·litzada al fons.", "La calor destrueix les partícules d'aigua."],
    correctAnswerIndex: 2,
    explanation: "Si s'escalfa una dissolució d'aigua i sal, només l'aigua experimenta el canvi de fase cap a gas i s'esvaeix, deixant darrere la sal sòlida que ens desvetlla aquesta separació."
  },
  {
    id: 15,
    question: "Si al laboratori cauen llimadures de ferro dins d'un pot amb pols de sofre groc... Com ho podem separar ràpidament?",
    options: ["Aproximant-hi un imant.", "Escalfant la barreja per evaporar el ferro.", "Afegint-hi aigua i utilitzant un embut.", "Afegint-hi oli per fer surar el sofre."],
    correctAnswerIndex: 0,
    explanation: "El ferro posseeix propietats magnètiques i seria atret de seguida per l'imant, deixant la pols de sofre al pot, tractant-se d'un mètode físic de separació ràpid i en sec."
  },
  {
    id: 16,
    question: "En una dissolució d'aigua amb un polsim de sal, quin paper juga l'aigua exactament?",
    options: ["L'aigua és el solut.", "L'aigua fa de dissolvent.", "Aquestes partícules formen un aliatge pur.", "L'aigua es transforma completament en element salí."],
    correctAnswerIndex: 1,
    explanation: "En una dissolució, el component majoritari i capaç de dissoldre les altres substàncies, s'anomena dissolvent (s'acostuma a dir que l'aigua és el dissolvent universal)."
  },
  {
    id: 17,
    question: "Un suc de taronja natural i acabat d'esprémer, ple de polpa flotant, seria en l'àmbit científic...",
    options: ["Un pur compost químic elementari.", "Una suspensió, mescla heterogènia on certes parts grosses decantaran si es deixa reposar.", "Un gas noble dissolt a l'aire de casa.", "Una dissolució perfecta, homogènia a qualsevol escala."],
    correctAnswerIndex: 1,
    explanation: "Es tracta d'una suspensió. La polpa o restes de fruita són prou grans (insolubles) per no dissoldre's pas al suc líquid. Acabaran sedimentant al cap d'una estona cap al fons del recipient."
  },
  {
    id: 18,
    question: "L'aire de les nostres ciutats format majoritàriament per gasos com nitrogen i oxigen, es pot definir com:",
    options: ["Un únic element de la taula periòdica en llibertat gasosa.", "Una simple mescla heterogènia i lletosa d'imitar núvols artificials.", "Una mescla homogènia de diversos gasos completament fluids entre si.", "Un col·loide on precipiten sòlids invisiblement."],
    correctAnswerIndex: 2,
    explanation: "Els gasos formen mescles perfectament uniformes en qualsevol proporció. Per tant, l'aire (net i lliure de partícules de pols) es considera i s'etiqueta com una mescla homogènia gasosa."
  },
  {
    id: 19,
    question: "La boira que sovint amaga algunes zones de muntanya sol classificar-se com:",
    options: ["Gas pur format fora del líquid d'aigua.", "Un aerosol o col·loide, on petites gotes de líquid es suspenen i es dispersen a l'exterior acompanyant gasos d'aire.", "Solament una precipitació química barrejada amb fang i líquids.", "Una dissolució homogènia d'aire pur en aigua líquida."],
    correctAnswerIndex: 1,
    explanation: "La boira és un aerosol líquid (un col·loide), on finíssimes gotes d'aigua es disseminen dins una fase de gas continu (l'aire). Aquesta gran densitat col·loidal fa que la llum es dispersi en passar-hi a través."
  },
  {
    id: 20,
    question: "L'esmentat i famós efecte Tyndall, a la pràctica de laboratori ens serveix exactament per...",
    options: ["Escalfar més de pressa els mars o líquids grans.", "Diferenciar entre dissolucions i col·loides utilitzant un raig de llum (com un làser).", "Generar gravetat en partícules molt denses.", "Separar suspensions on les mides passarien fàcilment pel paper de filtre."],
    correctAnswerIndex: 1,
    explanation: "L'efecte Tyndall ens serveix per descobrir si el que estem veient és un col·loide (les partícules són prou grans per desviar la llum de manera apreciable, revelant el feix sencer), diferenciant-lo de dissolucions vertaderes."
  },
  {
    id: 21,
    question: "Quin mètode faries servir per separar dos líquids miscibles (com l'aigua i l'alcohol) que tenen diferents punts d'ebullició?",
    options: ["Decantació", "Filtració", "Centrifugació", "Destil·lació"],
    correctAnswerIndex: 3,
    explanation: "La destil·lació s'aprofita precisament d'aquesta diferència de temperatures d'ebullició. Al fer bullir la mescla, el líquid més volàtil (com l'alcohol) s'evapora primer i després es condensa en un tub refrigerant."
  },
  {
    id: 22,
    question: "Dins d'un tub d'assaig amb una suspensió (per exemple de sang), com podem fer que les cèl·lules vagin al fons ràpidament sense esperar hores?",
    options: ["Fent servir un imant de gran potència", "Aplicant un mètode de centrifugació per augmentar la força sobre les partícules segons la seva densitat", "Evaporant tot el líquid per deixar només pols seca", "Passant-ho pel tamís més fi del laboratori"],
    correctAnswerIndex: 1,
    explanation: "La centrifugació fa rotar el tub a grans velocitats i la força centrífuga resultant fa que les partícules denses sedimentin gairebé de forma instantània al fons."
  },
  {
    id: 23,
    question: "En quin ordre actuen els canvis d'estat fonamentals d'una destil·lació?",
    options: ["Condensació i després Solidificació", "Líquid a Sòlid i Sòlid a Gas", "Només hi ha un canvi a fase gas permanent", "Evaporació seguida de Condensació"],
    correctAnswerIndex: 3,
    explanation: "A la destil·lació primer s'escalfa el líquid fins que s'evapora gas (evaporació o vaporització), i aquest gas recorre el refrigerant on es refreda fins a tornar-se líquid de nou (condensació)."
  },
  {
    id: 24,
    question: "La centrifugació s'utilitza sovint com una alternativa ràpida a...",
    options: ["L'evaporació", "La decantació de suspensions (on la simple gravetat tardaria massa)", "La imantació", "El tamisatge"],
    correctAnswerIndex: 1,
    explanation: "És, de fet, una 'decantació forçada i accelerada', ja que substitueix l'espera de la decantació per gravetat sotmetent la mostra a forces molt majors."
  }
];

export default function ActivitatsView() {
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  const q = QUESTIONS[currentQuestionIdx];

  const handleSelect = (idx: number) => {
    if (showResult) return;
    setSelectedAnswer(idx);
    setShowResult(true);
    if (idx === q.correctAnswerIndex) {
      setScore(s => s + 1);
    }
  };

  const handleNext = () => {
    if (currentQuestionIdx < QUESTIONS.length - 1) {
      setCurrentQuestionIdx(idx => idx + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    } else {
      setIsFinished(true);
    }
  };

  const resetQuiz = () => {
    setCurrentQuestionIdx(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setScore(0);
    setIsFinished(false);
  };

  if (isFinished) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-2xl mx-auto bg-white rounded-3xl p-10 shadow-sm border border-slate-200 text-center"
      >
        <div className="w-24 h-24 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="w-12 h-12 text-indigo-600" />
        </div>
        <h2 className="text-3xl font-bold text-slate-800 mb-4">Activitat Completada!</h2>
        <p className="text-xl text-slate-600 mb-8">
          Has encertat <span className="font-bold text-indigo-600">{score}</span> de {QUESTIONS.length} preguntes.
        </p>
        
        <button
          onClick={resetQuiz}
          className="flex items-center gap-2 mx-auto bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-medium transition-colors"
        >
          <RotateCcw className="w-5 h-5" /> Tornar a intentar
        </button>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-3xl mx-auto"
    >
      <div className="mb-8 flex justify-between items-center text-sm font-medium text-slate-500">
        <span>Pregunta {currentQuestionIdx + 1} de {QUESTIONS.length}</span>
        <span>Punts: {score}</span>
      </div>

      <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-200 mb-6">
        <h2 className="text-2xl font-bold text-slate-800 mb-8">
          {q.question}
        </h2>

        <div className="space-y-3">
          {q.options.map((opt, idx) => {
            const isSelected = selectedAnswer === idx;
            const isCorrect = idx === q.correctAnswerIndex;
            
            let btnClass = "border-slate-200 hover:border-indigo-300 hover:bg-indigo-50 text-slate-700";
            let Icon = null;

            if (showResult) {
              if (isCorrect) {
                btnClass = "border-emerald-500 bg-emerald-50 text-emerald-800";
                Icon = CheckCircle2;
              } else if (isSelected) {
                btnClass = "border-rose-500 bg-rose-50 text-rose-800";
                Icon = XCircle;
              } else {
                btnClass = "border-slate-100 bg-slate-50 text-slate-400 opacity-50";
              }
            }

            return (
              <button
                key={idx}
                onClick={() => handleSelect(idx)}
                disabled={showResult}
                className={cn(
                  "w-full flex items-center justify-between p-4 rounded-xl border-2 transition-all font-medium text-left",
                  btnClass
                )}
              >
                <span>{opt}</span>
                {Icon && <Icon className="w-5 h-5 shrink-0" />}
              </button>
            );
          })}
        </div>

        <AnimatePresence>
          {showResult && (
            <motion.div
              initial={{ opacity: 0, height: 0, marginTop: 0 }}
              animate={{ opacity: 1, height: 'auto', marginTop: 24 }}
              className="bg-indigo-50 p-5 rounded-xl border border-indigo-100"
            >
              <p className="text-indigo-800">
                <span className="font-bold">Explicació: </span>
                {q.explanation}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {showResult && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex justify-end"
        >
          <button
            onClick={handleNext}
            className="flex items-center gap-2 bg-slate-800 hover:bg-slate-900 text-white px-6 py-3 rounded-xl font-medium transition-colors"
          >
            {currentQuestionIdx < QUESTIONS.length - 1 ? 'Següent Pregunta' : 'Veure Resultats'}
            <ChevronRight className="w-5 h-5" />
          </button>
        </motion.div>
      )}
    </motion.div>
  );
}

import { QuizQuestion } from '../types';

// Static questions database replacing the AI generation
const questions: QuizQuestion[] = [
  {
    id: '1',
    question: "Què passa quan un circuit està obert?",
    options: [
      "Els electrons corren molt ràpid",
      "El camí està tallat i no passa corrent",
      "La bombeta s'encén més fort",
      "La pila es gasta de seguida"
    ],
    correctAnswerIndex: 1,
    explanation: "En un circuit obert, hi ha una interrupció en el camí (com un pont aixecat), per tant els electrons no poden circular."
  },
  {
    id: '2',
    question: "Quina és la funció d'un interruptor?",
    options: [
      "Donar llum",
      "Gastar pila",
      "Obrir i tancar el circuit a voluntat",
      "Escalfar els cables"
    ],
    correctAnswerIndex: 2,
    explanation: "L'interruptor és l'element de control que ens permet connectar (tancar) o desconnectar (obrir) el circuit fàcilment."
  },
  {
    id: '3',
    question: "En un circuit en sèrie amb dues bombetes, si se'n fon una...",
    options: [
      "L'altra continua funcionant igual",
      "L'altra s'encén més fort",
      "L'altra també s'apaga",
      "La pila explota"
    ],
    correctAnswerIndex: 2,
    explanation: "En sèrie, només hi ha un camí. Si una part es trenca (bombeta fosa), s'obre tot el circuit i deixa de passar corrent."
  },
  {
    id: '4',
    question: "En un circuit en paral·lel, si apagues una bombeta...",
    options: [
      "Les altres continuen funcionant",
      "Totes s'apaguen",
      "Es fa fosc a tota la casa",
      "Has de canviar la pila"
    ],
    correctAnswerIndex: 0,
    explanation: "En paral·lel, cada component té el seu propi camí independent cap a la pila. Si en talles un, els altres segueixen connectats."
  },
  {
    id: '5',
    question: "Què necessiten els electrons per viatjar?",
    options: [
      "Un bitllet d'autobús",
      "Un camí tancat de material conductor",
      "Un camí de plàstic",
      "Molt de vent"
    ],
    correctAnswerIndex: 1,
    explanation: "El corrent elèctric necessita un material conductor (com el coure) i un circuit tancat per poder circular."
  }
];

export const getQuizQuestions = async (): Promise<QuizQuestion[]> => {
  // Simulate a small delay for realistic feel
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(questions);
    }, 500);
  });
};
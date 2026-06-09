import { LevelConfig } from './index';

export const wedgeConfig: LevelConfig = {
    id: 'wedge',
    name: 'La Falca',
    desc: "Divideix la força en dues per separar o tallar.",
    emoji: "🪓",
    bg: "from-emerald-700 to-green-900",
    texts: {
        sign_intro: "OBJECTIU D'APRENENTATGE:\nLa falca consisteix en dos plans inclinats units per la base. I en lloc d'usar per elevar pes lliscant-lo... l'usem per dividir un objecte en dos, tallant un camí recte i redirigint la força cap als costats!",
        sign_1: "Acostem-nos a la fusta! Si impactem amb la base de la falca, la punta més aguda i afilada multiplicarà la pressió exercida i penetrarà, separant-ho tot violentament en vèncer la cohesió.",
        finish: "Nivell completat!\n\nDestrals, tisores, fins i tot les nostres dents o els morros dels trens d'alta velocitat actuen aplicant aquest concepte angular bàsic."
    },
    quiz: [
        {
            question: "1. L'objectiu principal d'una falca mecànica és...",
            options: [
                "A) Enrotllar material al seu voltant.",
                "B) Mantenir objectes flotant.",
                "C) Transformar una força aplicada en el seu cap pla cap a una força perpendicular als costats tallants inferiors."
            ],
            correct: 2,
            explanation: "Exacte. En picar al cap pla d'una destral (falca), estem forçant la matèria a obrir-se cap a ambdós costats del tall angular."
        }
    ],
    history: [
        {
            title: "La Prehistòria viva",
            content: "La més antiga de totes. Les destrals i ganivets paleolítics fets de sílex afilat ja eren, físicament, precises màquines simples anomenades 'falques', que van facilitar dràsticament l'evolució.",
            imageIcon: "💥"
        }
    ]
};

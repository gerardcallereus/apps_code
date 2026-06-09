import { LevelConfig } from './index';

export const winchConfig: LevelConfig = {
    id: 'winch',
    name: 'El Torn',
    desc: "Un eix i una manovella per enrolar cordes i aixecar pes.",
    emoji: "🚰",
    bg: "from-indigo-600 to-purple-800",
    texts: {
        sign_intro: "OBJECTIU D'APRENENTATGE:\nUn torn o cilindre amb manovella. Com una palanca circular contínua!",
        sign_1: "Si la manovella on tu fas força té un radi més gran que l'eix on s'enrotlla la corda, faràs molt menys esforç a canvi de fer més voltes.",
        finish: "Nivell completat!\n\nL'avantatge mecànic d'un torn permet pujar aigua des del fons de pous profunds sense trencar-se l'esquena."
    },
    quiz: [
        {
            question: "1. Un torn multiplica la força quan...",
            options: [
                "A) El radi de la manovella és més gran que el del cilindre on gira la corda.",
                "B) L'eix és enorme i la manovella és minúscula.",
                "C) El material és de bronze."
            ],
            correct: 0,
            explanation: "Correcte! Com més gran és la circumferència descrita per la mà exterior, més avantatge mecànic aconsegueixes."
        }
    ],
    history: [
        {
            title: "El pou de tota la vida",
            content: "Les referències més antigues de l'ús de torns les trobem al s. IV aC, i no falten a cap representació dels antics pous d'aigua europeus i romans.",
            imageIcon: "💧"
        }
    ]
};

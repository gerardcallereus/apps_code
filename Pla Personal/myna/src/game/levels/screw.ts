import { LevelConfig } from './index';

export const screwConfig: LevelConfig = {
    id: 'screw',
    name: 'El Cargol',
    desc: "Un pla inclinat enrotllat per penetrar o fixar fort.",
    emoji: "🔩",
    bg: "from-cyan-700 to-blue-900",
    texts: {
        sign_intro: "OBJECTIU D'APRENENTATGE:\nMira de prop un cargol: ¿no te n'adones que la rosca és, en el fons, una rampa (pla inclinat) enrotllada helicoïdalment al voltant d'un cilindre?",
        sign_1: "Quan girem un cargol, aquesta 'rampa' infinita converteix el moviment giratori en un moviment descendent molt forçut que perfora o serra superfícies enrere de manera potent i lenta.",
        finish: "Nivell completat!\n\nA més de per ajuntar fustes, el Cargol d'Arquimedes s'utilitzava (i s'utilitza!) per bombar aigua cap amunt!"
    },
    quiz: [
        {
            question: "1. Com es defineix sovint un cargol en la física clàssica?",
            options: [
                "A) Una roda que va molt ràpid.",
                "B) Un pla inclinat enrotllat en un cilindre.",
                "C) Una falca múltiple."
            ],
            correct: 1,
            explanation: "Ho has encertat! Es regeix matemàticament per exactament la mateixa fòrmula de multiplicació de força."
        }
    ],
    history: [
        {
            title: "El Cargol d'Arquimedes",
            content: "Tot un clàssic. A l'antiga Grècia es va crear la bomba de cargol: posaven un tub en espiral o un cargol immens dins d'un tub buit apuntat cap avall a l'aigua. A l'anar donant voltes a la manovella manualment (el torn), el cargol pescava l'aigua i l'obligava a pujar contra la gravetat per regar camps sencers.",
            imageIcon: "♒"
        }
    ]
};

import { LevelConfig } from './index';

export const pulleyConfig: LevelConfig = {
    id: 'pulley',
    name: 'La Politja',
    desc: "Canvia la direcció de la força per fer-ho més fàcil.",
    emoji: "🏗️",
    bg: "from-slate-800 to-slate-600",
    texts: {
        sign_intro: "PROJECTE NOVA YORK:\nEns han contractat per ajudar en la construcció d'un gratacels a Nova York.\nTenim grues amb diferents sistemes de politges. Analitzem com funcionen!",
        sign_1: "Politja Simple\nAquí tenim una sola politja fixa de la qual penja un gran bloc d'acer. Canvia la direcció, pots fer força cap a baix, però la força a fer és EXACTAMENT igual al pes del bloc.",
        sign_3: "Aquesta última grua fa servir un Polispast de 4 politges (2 fixes i 2 mòbils). La corda que tiba aguanta només 1/4 part del pes total!",
        finish: "Nivell completat!\n\nUna sola politja et permet usar la gravetat a favor teu, i vàries et donen super-força!"
    },
    quiz: [
        {
            question: "1. Si tens una sola politja (la primera grua) per aixecar una biga que pesa 200 kg (1960 N), quina força hauràs de fer cap a baix?",
            options: [
                "A) La meitat, 100 kg de força.",
                "B) Els mateixos 200 kg (1960 N).",
                "C) El doble, per poder aixecar-la.",
            ],
            correct: 1,
            explanation: "Correcte! La politja simple fixa només canvia la direcció (és com estirar directament des de dalt), però NO redueix el pes a moure."
        },
        {
            question: "2. La segona grua té una politja MÒBIL extra. Això fa que la tensió de la corda es reparteixi en DUES (N=2) cordes subjectant. Si el bloc pesa 500 kg, quina força cal fer?",
            options: [
                "A) 500 kg igual, les politges només reorienten.",
                "B) 1000 kg, costa més.",
                "C) Només 250 kg! S'ha dividit per 2."
            ],
            correct: 2,
            explanation: "Exacte. En posar una politja mòbil, el pes penja de dos costats de la corda, per tant cadascun suporta la meitat de l'esforç."
        },
        {
            question: "3. La última grua és un polispast de 4 seccions de corda (N=4) suportant la càrrega mòbil de 1000 kg (aprox 10000 N). Quanta força està aplicant l'operari al final de la corda respecte la resistència?",
            options: [
                "A) Fa un quart de força: 250 kg (~2500 N).",
                "B) Ho divideix per 10, fent només 100 kg.",
                "C) Fa tota la força ell mateix."
            ],
            correct: 0,
            explanation: "La fórmula és P=R/n. Utilitzant vàries politges un humà podria arribar a moure tonelades literalment ell sol, l'únic que per intercanvi haurà destirar moooooooooooolta més longitud de corda!"
        }
    ],
    history: [
        {
            title: "Elevació d'Impediments Construits",
            content: "L'esclat dels gratacels a principis del segle XX a llagts com Manhattan va ser totalment dependent dels sistemes complexos de politges i motors per poder aixecar materials de tones centenars de metres en l'aire.",
            imageIcon: "🏢"
        }
    ]
};

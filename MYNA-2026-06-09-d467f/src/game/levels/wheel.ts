import { LevelConfig } from './index';

export const wheelConfig: LevelConfig = {
    id: 'wheel',
    name: 'La Roda',
    desc: "Redueix la fricció de lliscament convertint-la en rodament.",
    emoji: "⚙️",
    bg: "from-sky-500 to-emerald-600",
    texts: {
        sign_intro: " LABORATORI 1: FRICCIÓ I GEOMETRIA\nPer què costa tant arrossegar un bloc quadrat pel terra i és tan fàcil fer rodar una roda?\n\nLa resposta és la FRICCIÓ. La línia vermella sota cada figura mostra la superfície de contacte amb el terra. Empenta o fes servir el Panell de Control per comparar com es mouen!",
        sign_1: "ESTACIÓ 1: Polígons de Pocs Costats (Triangle i Quadrat)\nUn quadrat té tota la base plana en contacte amb el terra. Per fer-lo avançar per tomballons cal aixecar el seu centre de gravetat a cada aresta!\n\nProva d'empènyer el quadrat o canvia el nombre de costats al Panell de Control fins a portar la peça a la placa verda per obrir la Porta 1.",
        sign_2: "ESTACIÓ 2: Evolució Poligonal (Hexàgon i Dodecàgon)\nCom més costats té un polígon regular (6, 8, 12 costats), més curt és cada costat i més suau és el gir. L'altura que cal aixecar el centre de massa a cada pas disminueix dràsticament!\n\nFes rodar el polígon per la rampa d'impuls per enderrocar el mur de blocs i activar el sensor.",
        sign_3: "ESTACIÓ 3: La Roda Perfecta i el Carretó (∞ Costats)\nUna circumferència és el límit d'un polígon d'infinits costats: toca el terra en UN SOL PUNT tangent! El centre de gravetat es manté a altura constant i la fricció de rodament és mínima.\n\nEmpenta la Roda gegant fins a la meta final per obrir la Porta de Control!",
        finish: "Nivell Superat: La Roda!\n\nHas comprovat experimentalment com passar d'arrossegar una cara plana (fricció de lliscament alta) a fer rodar una circumferència (contacte puntual i fricció de rodament mínima) permet transportar grans càrregues amb una fracció de l'esforç."
    },
    formulas: {
        sign_intro: {
            equation: "F_freg = μ · N",
            legend: [
                { symbol: "F_freg", desc: "Força d'oposició per fricció (Newtons - N)" },
                { symbol: "μ", desc: "Coeficient de fricció (μ_rodament ≪ μ_lliscament)" },
                { symbol: "N", desc: "Força Normal (Pes de l'objecte sobre el terra)" }
            ]
        },
        sign_1: {
            equation: "μ_lliscament ≈ 0.50  →  F = 250 N",
            legend: [
                { symbol: "4 costats", desc: "Base plana: cal vèncer el lliscament o aixecar el vèrtex" },
                { symbol: "P = 500 N", desc: "Bloc de 50 kg" },
                { symbol: "Esforç", desc: "Alt consum d'energia per avançar" }
            ]
        },
        sign_2: {
            equation: "Costats ↑  ⇒  Δh_centre ↓  ⇒  F ↓",
            legend: [
                { symbol: "n = 6..12", desc: "Polígon de molts costats: gairebé circular" },
                { symbol: "Δh", desc: "Oscil·lació vertical del centre de massa" }
            ]
        },
        sign_3: {
            equation: "μ_rodament ≈ 0.02  →  F = 10 N",
            legend: [
                { symbol: "Roda (∞)", desc: "1 sol punt de contacte instantani" },
                { symbol: "Estalvi", desc: "Fins a 25 vegades menys força que arrossegant!" }
            ]
        }
    },
    quiz: [
        {
            question: "1. Per què un bloc quadrat costa molt més de moure pel terra que una roda del mateix pes?",
            formula: "F_freg = μ · N  (μ_lliscament ≫ μ_rodament)",
            options: [
                "A) Perquè el quadrat pesa més quan té forma d'angle recte.",
                "B) Perquè el quadrat llisca sobre tota una cara plana amb alta fricció i cal aixecar el seu centre de gravetat per tombar-lo.",
                "C) Perquè la roda anul·la la gravetat terrestre."
            ],
            correct: 1,
            explanation: "Exacte! En una roda el centre de gravetat es manté a la mateixa altura i només hi ha un punt instantani de contacte (fricció de rodament mínima)."
        },
        {
            question: "2. Què passa amb l'esforç necessari a mesura que augmentem el nombre de costats d'un polígon (de 3 a 6, 12, fins a una circumferència)?",
            formula: "Límit (n → ∞) Polígon = Circumferència",
            options: [
                "A) Cada vegada costa menys fer-lo rodar perquè els costats són més curts i s'aproxima a una roda.",
                "B) Costa més perquè té més vèrtexs.",
                "C) L'esforç és idèntic independentment de la forma."
            ],
            correct: 0,
            explanation: "Correcte! Com més costats té el polígon, menor és el ressalt angular entre cara i cara i més suau és el moviment."
        },
        {
            question: "3. Si arrossegar una pedra de 1000 N té un coeficient de lliscament μ = 0.5 (calen 500 N), i posar-la sobre rodes redueix el coeficient a μ_r = 0.02, quina força mínima cal per moure-la en pla?",
            formula: "F = μ_r · P = 0.02 × 1000 N",
            options: [
                "A) 500 N",
                "B) Només 20 N (25 vegades menys força!)",
                "C) 200 N"
            ],
            correct: 1,
            explanation: "Molt bé! 0.02 × 1000 N = 20 N. Per això un sol operari pot empènyer una vagoneta d'una tona sobre rails o rodes."
        }
    ],
    history: [
        {
            title: "L'Origen a Mesopotàmia (3500 aC)",
            content: "La roda no va aparèixer fins a l'Edat del Bronze a Mesopotàmia (actual Iraq). Abans d'això, els humans utilitzaven troncs d'arbre com a corrons sota trineus de fusta per moure grans pedres.",
            imageIcon: "🏺"
        },
        {
            title: "El Torn de Terrisser Primer!",
            content: "Sorpresa històrica: les primeres rodes no eren per a vehicles! Eren torns de terrisser horitzontals que giraven sobre un pivot per modelar recipients de fang amb simetria perfecta.",
            imageIcon: "⚱️"
        },
        {
            title: "La Revolució de l'Eix i el Carro (3200 aC)",
            content: "El veritable salt tecnològic va ser combinar la roda amb un EIX fixat a una plataforma. Això va permetre crear els primers carros agrícoles i de transport a Sumer i l'Europa central.",
            imageIcon: "🛞"
        },
        {
            title: "Rodes de Radis i Coixinets",
            content: "Cap al 2000 aC es van inventar les rodes amb radis (molt més lleugeres i ràpides). A l'era moderna, els coixinets de boles d'acer i els pneumàtics amb cambra d'aire van portar la fricció al mínim històric.",
            imageIcon: "🚗"
        }
    ]
};

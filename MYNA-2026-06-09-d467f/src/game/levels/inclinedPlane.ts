import { LevelConfig } from './index';

export const inclinedPlaneConfig: LevelConfig = {
    id: 'inclined_plane',
    name: 'El Pla Inclinat',
    desc: "Redueix la força necessària per elevar una càrrega allargant el recorregut.",
    emoji: "📐",
    bg: "from-blue-600 to-indigo-900",
    texts: {
        sign_intro: "🔬 LABORATORI 3: EL PLA INCLINAT\nAixecar un bloc de pedra de 500 N en vertical costa 500 N de força. Però si el fem pujar lliscant per una rampa de longitud L fins a l'alçada h, la força es redueix en la proporció h / L!\n\nEmpenta les caixes fins al pedestal verd de dalt de cada rampa per desbloquejar les portes.",
        sign_1: "ESTACIÓ 1: Rampa Suau (Alçada h = 2 m, Longitud L = 8 m)\nLa rampa és 4 vegades més llarga que alta (Avantatge Mecànic = L / h = 4). Per pujar un bloc de P = 600 N, només cal fer F = 600 × (2/8) = 150 N!\n\nEmpenta la caixa groga fins al cercle verd superior per obrir la Porta 1.",
        sign_2: "ESTACIÓ 2: Rampa Ajustable (Intercanvi Força ↔ Distància)\nSi una rampa és massa curta i dreta, la força requerida F supera la teva força màxima! Fes servir el Panell de Control (o empeny després d'allargar la rampa) per suavitzar el pendent i pujar el bloc fins a dalt.",
        sign_3: "ESTACIÓ 3: Rampa de Gran Precisió (h = 1.5 m, L = 9 m)\nAmb una relació 1:6, fins i tot un bloc pesant de 900 N es pot pujar amb només 150 N de força. Recorda: el Treball total (W = F · L = P · h) es manté constant!\n\nPorta l'últim bloc al cim per desbloquejar la Meta!",
        finish: "Nivell Superat: El Pla Inclinat!\n\nHas comprovat que una rampa no redueix el treball total (W = P · h), però ens permet aplicar una força molt menor (F = P · h / L) a canvi de recórrer més distància!"
    },
    formulas: {
        sign_intro: {
            equation: "F = P × (h / L)",
            legend: [
                { symbol: "F", desc: "Força d'empenta paral·lela a la rampa (N)" },
                { symbol: "P", desc: "Pes de l'objecte (m · g, en Newtons - N)" },
                { symbol: "h", desc: "Alçada vertical guanyada (m)" },
                { symbol: "L", desc: "Longitud total de la rampa (m)" }
            ]
        },
        sign_1: {
            equation: "F = 600 N × (2 m / 8 m) = 150 N",
            legend: [
                { symbol: "AM = L/h", desc: "8 m / 2 m = 4 (Avantatge Mecànic 4x)" },
                { symbol: "F = 150 N", desc: "Només el 25% del pes del bloc!" }
            ]
        },
        sign_2: {
            equation: "Treball: W = F · L = P · h",
            legend: [
                { symbol: "W", desc: "Energia / Treball mecànic (Joules - J)" },
                { symbol: "L ↑ ⇒ F ↓", desc: "El doble de longitud exigeix la meitat de força" }
            ]
        },
        sign_3: {
            equation: "F = 900 N × (1.5 m / 9 m) = 150 N",
            legend: [
                { symbol: "AM = 6", desc: "Rampa 6 vegades més llarga que alta" },
                { symbol: "Estalvi", desc: "Dividim la força necessària per 6!" }
            ]
        }
    },
    quiz: [
        {
            question: "1. Volem pujar un bloc de 1000 N fins a una plataforma de h = 2 m d'alçada utilitzant una rampa de L = 10 m de longitud (sense fricció). Quina força F cal fer?",
            formula: "F = P × (h / L) = 1000 N × (2 m / 10 m)",
            options: [
                "A) 200 N",
                "B) 500 N",
                "C) 1000 N"
            ],
            correct: 0,
            explanation: "Exacte! 1000 × (2 / 10) = 200 N. La rampa és 5 vegades més llarga que alta (AM = 5), així que fem una cinquena part de la força."
        },
        {
            question: "2. Què passa amb el Treball mecànic total (Energia = Força × Distància) quan utilitzem una rampa més llarga i suau?",
            formula: "W = F · L = P · h",
            options: [
                "A) El treball total disminueix perquè fem menys força.",
                "B) El treball total és el mateix: fem menys força (F), però durant més distància (L).",
                "C) El treball és zero."
            ],
            correct: 1,
            explanation: "Molt bé! L'energia es conserva: cap màquina simple estalvia Treball (Joules); el que fa és reduir la Força instantània necessària a canvi de més recorregut."
        },
        {
            question: "3. Per què les carreteres d'alta muntanya i les rampes d'accessibilitat per a cadires de rodes fan corbes en ziga-zaga?",
            formula: "Pendent = h / L",
            options: [
                "A) Per augmentar la longitud L del camí i així reduir l'angle i la força necessària per pujar.",
                "B) Perquè els cotxes vagin més de pressa.",
                "C) Per augmentar l'alçada h de la muntanya."
            ],
            correct: 0,
            explanation: "Correcte! Allargant la longitud L de la carretera amb revolts, la fracció h/L es fa petita i els motors (o braços) poden pujar sense sobreesforç."
        }
    ],
    history: [
        {
            title: "Les Rampes de les Piràmides d'Egipte (2500 aC)",
            content: "Per elevar més de 2 milions de blocs de pedra de 2,5 tones a la Gran Piràmide de Kheops (146 m d'alçada), els enginyers egipcis van construir immenses rampes de maó i terra lubrificada amb aigua.",
            imageIcon: "🔺"
        },
        {
            title: "Galileu i les Lleis del Moviment (1604)",
            content: "Galileo Galilei va utilitzar plans inclinats de fusta polida amb campanes per alentir la caiguda dels cossos i demostrar que l'acceleració de la gravetat és constant (d ∝ t²).",
            imageIcon: "🔭"
        },
        {
            title: "Enginyeria Viària i Ports de Muntanya",
            content: "Totes les carreteres de muntanya, vies de ferrocarril i canals amb rescloses apliquen el principi del pla inclinat per mantenir pendents inferiors al 6-8%.",
            imageIcon: "⛰️"
        },
        {
            title: "Accessibilitat Universal",
            content: "Les rampes modernes segueixen normatives estrictes de pendent màxim (per exemple, L = 12 vegades l'alçada h, és a dir, un 8%) perquè qualsevol persona en cadira de rodes pugui desplaçar-se amb autonomia.",
            imageIcon: "♿"
        }
    ]
};

import { LevelConfig } from './index';

export const pulleyConfig: LevelConfig = {
    id: 'pulley',
    name: 'La Politja: Operació Grua Portuària',
    desc: "Simulador de grua portuària: hissa càrregues industrials i submarins variant el nombre de cordes (N = 1, 2, 4, 8) i controlant la tensió del cable!",
    emoji: "🏗️",
    bg: "from-cyan-900 to-slate-950",
    texts: {
        sign_intro: "⚓ OPERACIÓ PORT & RESCAT: GRUA DE POLISPASTS\nControla la grua pòrtic del moll industrial! Hissa contenidors marítims i càpsules pesants de l'aigua i diposita-les suaument a la barcassa de transport.\n\nUtilitza el selector de politges (N = 1, 2, 4 o 8) per evitar que la tensió superi el límit del cable i el motor s'aturi!",
        sign_1: "ESTACIÓ 1: Politja Fixa Simple (N = 1 Corda)\nUna sola politja al sostre de la grua només canvia la direcció del cable (AM = 1). La tensió suportada pel cable és IGUAL al pes total de la càrrega!\n\nSi intentes aixecar un contenidor molt pesant amb N = 1, el cable entrarà en alerta vermella per sobrefreqüència de tensió!",
        sign_2: "ESTACIÓ 2: Politja Mòbil (N = 2 Cordes)\nLa politja mòbil acompanya la càrrega, de manera que el pes es reparteix entre 2 trams de corda (F = P / 2). L'Avantatge Mecànic és AM = 2!\n\nLa força que ha de fer el motor es redueix a la meitat, permetent hissar pesos mitjans sense risc.",
        sign_3: "ESTACIÓ 3: Polispast Industrial Quàdruple (N = 4 o 8 Cordes)\nCombinant politges fixes i mòbils en polispast (aparell de bossells), la força es divideix per 4 o per 8 (F = P / N)!\n\nFins i tot la càrrega més colossal de 1200 kg es pot aixecar amb suavitat. A canvi, hauràs de recollir N vegades més longitud de cable!",
        finish: "Operació Portuària Completada amb Èxit!\n\nHas demostrat dominar el funcionament real de les politges:\n• Politja fixa (N=1): canvia la direcció, AM = 1 (tensió = pes complet)\n• Politja mòbil (N=2): divideix la tensió per 2 (F = P/2)\n• Polispast (N=4, 8): divideix la tensió per N (F = P/N, recollint N·h de corda)"
    },
    formulas: {
        sign_intro: {
            equation: "F = P / N",
            legend: [
                { symbol: "F", desc: "Força o tensió suportada pel motor (N)" },
                { symbol: "P", desc: "Pes total de la càrrega (m · g en N)" },
                { symbol: "N", desc: "Nombre de trams de corda que sostenen la politja mòbil" }
            ]
        },
        sign_1: {
            equation: "N = 1 (Politja Fixa)  ⇒  F = P  (AM = 1)",
            legend: [
                { symbol: "Tensió", desc: "100% del pes: cable sota màxima tensió" },
                { symbol: "Límit", desc: "Càrregues superiors a 400 kg provoquen sobrecàrrega" }
            ]
        },
        sign_2: {
            equation: "N = 2 (Politja Mòbil)  ⇒  F = P / 2  (AM = 2)",
            legend: [
                { symbol: "Repartiment", desc: "El pes es divideix entre 2 ramals verticals" },
                { symbol: "Distància", desc: "Recollim 2 metres de cable per cada metre d'alçada" }
            ]
        },
        sign_3: {
            equation: "N = 4 o 8 (Polispast)  ⇒  F = P / N",
            legend: [
                { symbol: "Polispast", desc: "Redueix la tensió fins a un 87.5%!" },
                { symbol: "Seguretat", desc: "Tensió verda per a càrregues industrials molt pesades" }
            ]
        }
    },
    quiz: [
        {
            question: "1. Si utilitzem una sola POLITJA FIXA al capdamunt d'una grua, quin és el seu Avantatge Mecànic (AM)?",
            formula: "Politja fixa: F = P",
            options: [
                "A) AM = 1 (només canvia el sentit del cable, no redueix la força).",
                "B) AM = 2 (redueix la força a la meitat).",
                "C) AM = 4."
            ],
            correct: 0,
            explanation: "Correcte! Una politja fixa té AM = 1: la tensió del cable és exactament igual al pes de la càrrega."
        },
        {
            question: "2. Una grua ha d'aixecar un bloc de 8000 N. Quina tensió suportarà el motor si configurem un polispast de N = 4 cordes?",
            formula: "F = P / N = 8000 N / 4",
            options: [
                "A) 8000 N",
                "B) 2000 N (només la quarta part!)",
                "C) 4000 N"
            ],
            correct: 1,
            explanation: "Exacte! Amb N = 4 ramals, cadascun suporta una quarta part del pes (8000 / 4 = 2000 N), evitant que el motor es cremi."
        },
        {
            question: "3. Segons el principi de conservació del treball (W = F · L), si un polispast divideix la força per 4 (F = P/4), quanta corda caldrà estirar per pujar la càrrega 3 metres?",
            formula: "L_corda = N · h = 4 × 3 m",
            options: [
                "A) 3 metres.",
                "B) 0.75 metres.",
                "C) 12 metres (4 vegades l'alçada guanyada)."
            ],
            correct: 2,
            explanation: "Molt bé! La física no 'regala' energia: per fer 4 vegades menys força cal recollir 4 vegades més distància de corda (4 × 3 m = 12 m)."
        }
    ],
    history: [
        {
            title: "Arquimedes i el Vaixell Siracusia (s. III aC)",
            content: "Amb un sistema de politges múltiples (polispast), Arquimedes va arrossegar ell sol un vaixell mercant de 3 pals completament carregat des de la platja fins a l'aigua.",
            imageIcon: "⛵"
        },
        {
            title: "Grues Portuàries Medievals de Roda de Trepitjar",
            content: "Als ports de Bruges, Hamburg i Barcelona, grans grues de fusta amb polispasts i rodes de trepitjar interiors permetien carregar barrils i mercaderies de tones.",
            imageIcon: "⚓"
        },
        {
            title: "L'Ascensor de Seguretat d'Otis (1853)",
            content: "L'invent del fre de seguretat per a cables de politges va permetre el naixement dels ascensors de passatgers i l'expansió vertical de les ciutats modernes.",
            imageIcon: "🏙️"
        },
        {
            title: "Grues Pòrtic de Contenidors Actuals",
            content: "Les grues 'Post-Panamax' dels ports moderns empren polispasts d'alta resistència capaços d'aixecar més de 65 tones de contenidors en un sol cicle de treball.",
            imageIcon: "🏗️"
        }
    ]
};

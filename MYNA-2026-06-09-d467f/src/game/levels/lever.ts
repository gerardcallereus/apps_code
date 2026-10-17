import { LevelConfig } from './index';

export const leverConfig: LevelConfig = {
    id: 'lever',
    name: 'La Palanca: Angry Levers',
    desc: "Destrueix les fortaleses enemigues experimentant amb els 3 tipus de palanca (1r, 2n i 3r grau) a l'estil Angry Birds!",
    emoji: "⚖️",
    bg: "from-amber-500 to-orange-700",
    texts: {
        sign_intro: "🎯 MISSIONS D'ASSETJAMENT: ELS 3 GRAUS DE PALANCA\nBenvingut a 'Angry Levers'! Arrossega la palanca cap enrere per apuntar i llançar projectils contra les fortaleses enemigues.\n\nCada tipus de palanca (1r, 2n o 3r grau) té una posició diferent del FULCRE (▲), la FORÇA (F) i la CÀRREGA (R), variant la potència i la velocitat de llançament!",
        sign_1: "PALANCA DE 1R GRAU: Catapulta d'Arquimedes (Fulcre al Mig)\nEl fulcre està entre la força i la resistència (com unes tisores o un balancí). Permet equilibrar forces i canviar la direcció.\n\nAllunya el fulcre de la teva força per obtenir un tir parabòlic equilibrat ideal per superar murs alts!",
        sign_2: "PALANCA DE 2N GRAU: Projectil Pesant (Càrrega al Mig)\nLa resistència és al mig, entre el fulcre i la força (com un carretó d'obra o un trencanous). L'Avantatge Mecànic és SEMPRE > 1!\n\nPermet llançar boles de pedra massives d'alt pes amb gran energia cinètica d'impacte per rebentar pilars de pedra dura!",
        sign_3: "PALANCA DE 3R GRAU: Trabuquet Ràpid (Força al Mig)\nLa força s'aplica al mig, entre el fulcre i la càrrega (com una canya de pescar o el braç humà). L'Avantatge Mecànic és < 1, però MULTIPLICA LA VELOCITAT a la punta!\n\nLlança projectils a velocitats altíssimes amb tir rasant per travessar les defenses enemigues més llunyanes!",
        finish: "Fortalesa Conquerida!\n\nHas dominat els 3 gèneres de palanca:\n• 1r grau (interfixa): fulcre al mig (equilibri i canvi de sentit)\n• 2n grau (interresistent): càrrega al mig (multiplica la força, AM > 1)\n• 3r grau (interpotent): força al mig (multiplica la velocitat i l'abast)"
    },
    formulas: {
        sign_intro: {
            equation: "F₁ · d₁ = F₂ · d₂",
            legend: [
                { symbol: "F₁", desc: "Força aplicada o Potència de llançament (N)" },
                { symbol: "d₁", desc: "Braç de força (distància del fulcre al punt d'esforç)" },
                { symbol: "F₂", desc: "Resistència o pes del projectil (N)" },
                { symbol: "d₂", desc: "Braç de resistència (distància del fulcre al projectil)" }
            ]
        },
        sign_1: {
            equation: "1r Grau: Fulcre al mig  ⇒  AM = d₁ / d₂",
            legend: [
                { symbol: "Fulcre ▲", desc: "Situat entre la força i el projectil" },
                { symbol: "Trajectòria", desc: "Tir equilibrat de gran precisió parabòlica" }
            ]
        },
        sign_2: {
            equation: "2n Grau: Càrrega al mig  ⇒  AM > 1 SEMPRE",
            legend: [
                { symbol: "Càrrega ●", desc: "Entre el fulcre i la força (carretó)" },
                { symbol: "Impacte", desc: "Màxima potència per enderrocar blocs massissos de pedra" }
            ]
        },
        sign_3: {
            equation: "3r Grau: Força al mig  ⇒  Velocitat v = ω · d₂ (AM < 1)",
            legend: [
                { symbol: "Força ⚡", desc: "Entre el fulcre i el projectil (canya de pescar / braç)" },
                { symbol: "Abast", desc: "Alta velocitat de sortida per a tirs llargs i ràpids" }
            ]
        }
    },
    quiz: [
        {
            question: "1. Quin element està situat al mig en una palanca de PRIMER GRAU (com la catapulta clàssica o un balancí)?",
            formula: "1r Grau: F --- ▲ (Fulcre) --- R",
            options: [
                "A) La resistència o càrrega a llançar.",
                "B) El Fulcre o punt de suport (▲).",
                "C) El punt on apliquem la força."
            ],
            correct: 1,
            explanation: "Exacte! En les palanques de 1r grau (interfixes), el punt de suport o fulcre està situat entre la força i la resistència."
        },
        {
            question: "2. Per què les palanques de SEGON GRAU (càrrega al mig, com un carretó) tenen SEMPRE un Avantatge Mecànic superior a 1?",
            formula: "AM = d_força / d_càrrega > 1",
            options: [
                "A) Perquè el braç de la força és necessàriament més llarg que el braç de la càrrega.",
                "B) Perquè no tenen fricció amb el terra.",
                "C) Perquè la gravetat s'inverteix."
            ],
            correct: 0,
            explanation: "Correcte! Com que la càrrega està al mig, la distància de la força al fulcre és sempre més gran que la de la càrrega, garantint que calgui menys força."
        },
        {
            question: "3. Si una palanca de TERCER GRAU (força al mig, com una canya de pescar o el braç humà) té AM < 1 (cal fer més força), quin avantatge físic ens aporta?",
            formula: "Velocitat tangencial: v = ω · r",
            options: [
                "A) Redueix el pes de l'objecte a zero.",
                "B) Multiplica la VELOCITAT i l'amplitud del moviment a l'extrem.",
                "C) Estalvia combustible."
            ],
            correct: 1,
            explanation: "Molt bé! Les palanques de 3r grau sacrifiquen força per guanyar velocitat i recorregut a l'extrem, per això són les que fem servir per llançar fletxes, canyes de pescar o xutar una pilota amb la cama!"
        }
    ],
    history: [
        {
            title: "Palanques de 1r Grau: La Catapulta i el Balancí",
            content: "Fulcre al mig (▲). Des de les balances egípcies fins a les catapultes romanes (onagre), permeten equilibrar pesos o invertir el sentit del moviment.",
            imageIcon: "⚖️"
        },
        {
            title: "Palanques de 2n Grau: El Carretó i l'Ariet",
            content: "Càrrega al mig (●). Inventat a la Xina durant la dinastia Han per Chuko Liang, el carretó permet a una sola persona transportar càrregues de més de 200 kg.",
            imageIcon: "🛒"
        },
        {
            title: "Palanques de 3r Grau: El Braç Humà i el Trabuquet",
            content: "Força al mig (⚡). El nostre bíceps s'insereix al radi molt a prop del colze (fulcre). Un petit moviment del múscul produeix un moviment ràpid i ampli de la mà!",
            imageIcon: "🦾"
        },
        {
            title: "La Llei de la Palanca d'Arquimedes",
            content: "«Doneu-me un punt de suport i mouré el món». La relació F₁ · d₁ = F₂ · d₂ és la base de tota la mecànica clàssica i de la conservació del moment de força.",
            imageIcon: "🏛️"
        }
    ]
};

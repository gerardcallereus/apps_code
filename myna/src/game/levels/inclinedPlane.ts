import { LevelConfig } from './index';

export const inclinedPlaneConfig: LevelConfig = {
    id: 'inclined_plane',
    name: 'El Pla Inclinat',
    desc: "Menys força per pujar, a canvi de més distància.",
    emoji: "📐",
    bg: "from-blue-700 to-white",
    texts: {
        sign_intro: "PROJECTE PIRÀMIDE:\nL'objectiu és pujar un pes fins a certa altura. Si ho intentem fer en vertical, ens costarà molt! Un pla inclinat ens permet repartir el pes sempre i quan estiguem disposats a caminar més distància.",
        sign_1: "RAMPA SUAU\nAquesta rampa puja 2 metres però és molt llarga (10 metres de llargada). Això vol dir que la nostra fracció és de 2/10.\nSi la capsa té 50 kg (pesa 500 N), només hauràs d'empènyer amb una cinquena part de la força!",
        sign_2: "RAMPA DE MOLTA ALÇADA\nAquesta rampa puja 3 metres en poc menys espai (5 metres de llargada). L'angle és molt més costerut!\nLa fracció és 3/5. Això et demanarà més força bruta, però faràs el camí molt abans.",
        sign_3: "RAMPA SUPER LLARGA\nAquesta rampa només puja 1 metre però s'allarga durant 10 metres. La fracció és de només 1/10.\nEmpènyer aquí serà com passejar (només 50 N de força), però trigaràs moltíssim en pujar l'objecte amunt del tot.",
        finish: "Nivell completat!\n\nUna rampa és exactament això: intercanviar longitud per esforç."
    },
    formulas: {
        sign_intro: {
            equation: "F = P × (h / L)",
            legend: [
                { symbol: "F", desc: "Força necessària (Newtons - N)" },
                { symbol: "P", desc: "Pes de l'objecte (Massa × 10 m/s²) (Newtons - N)" },
                { symbol: "h", desc: "Alçada de la rampa (Metres - m)" },
                { symbol: "L", desc: "Longitud de la rampa (Metres - m)" }
            ]
        },
        sign_1: {
            equation: "F = 500 N × (2 m / 10 m) = 100 N",
            legend: [
                { symbol: "P", desc: "500 N (Bloc de 50 kg)" },
                { symbol: "Fracció", desc: "2/10 = 0.2 (20% de l'esforç)" },
                { symbol: "F", desc: "100 Newtons per empènyer!" }
            ]
        },
        sign_2: {
            equation: "F = 500 N × (3 m / 5 m) = 300 N",
            legend: [
                { symbol: "P", desc: "500 N (Bloc de 50 kg)" },
                { symbol: "Fracció", desc: "3/5 = 0.6 (60% de l'esforç)" },
                { symbol: "F", desc: "300 Newtons per empènyer!" }
            ]
        },
        sign_3: {
            equation: "F = 500 N × (1 m / 10 m) = 50 N",
            legend: [
                { symbol: "P", desc: "500 N (Bloc de 50 kg)" },
                { symbol: "Fracció", desc: "1/10 = 0.1 (10% de l'esforç)" },
                { symbol: "F", desc: "Només 50 Newtons. Un joc de nens!" }
            ]
        }
    },
    quiz: [
        {
            question: "1. Si tens un bloc de 100 kg (Pes = 1000 N) i una rampa d'Alçada 2 m i Longitud 4 m. Quina Força necessitaràs?",
            formula: "F = P × (h / L)  =>  F = 1000 × (2 / 4)",
            options: [
                "A) 500 N",
                "B) 1000 N",
                "C) 2000 N"
            ],
            correct: 0,
            explanation: "L'alçada és just la meitat que la longitud (2/4 = 0.5), per tant només has de fer la meitat de força que si l'haguéssis d'aixecar en vertical."
        },
        {
            question: "2. Una rampa ens 'regala' l'energia i fa que tot el procés (Força × Distància = Energia) sigui més petit?",
            formula: "Treball (Energia) = Força × Distància",
            options: [
                "A) Sí, la rampa fa màgia i redueix l'energia total.",
                "B) No! L'energia total gastada és la mateixa. Fas menys Força, però durant molta més Distància.",
                "C) Ens costa més energia anar per rampa que per paret vertical."
            ],
            correct: 1,
            explanation: "L'energia es conserva. Treball = Força × Distància. Si baixes la Força a la meitat, has de recórrer el doble de distància per acumular la mateixa ascensió."
        },
        {
            question: "3. Per fer pujar un cotxe per una muntanya empinada, com fan les carreteres per reduir l'angle de pujada?",
            options: [
                "A) Van en línia recta vertical.",
                "B) Fan voltes en zig-zag (ziga-zaga).",
                "C) Fan servir materials amb poca fricció com gel."
            ],
            correct: 1,
            explanation: "Fent corbes en ziga-zaga allarguem dràsticament la longitud 'L' de la carretera. Així reduïm la fracció (h/L) i els motors dels cotxes poden empènyer-ho sense calar."
        }
    ],
    history: [
        {
            title: "Les Piràmides d'Egipte",
            content: "Encara avui s'estudia com es van poder construir piràmides enormes fa 4.500 anys. Els antics egipcis van emprar matemàticament els plans inclinats. Van construir quilòmetres de rampes al voltant dels monuments permetent que esclaus i bous arrosseguessin blocs de diverses tones aplicant una força moltíssim més petita que el seu propi pes.",
            imageIcon: "🔺"
        },
        {
            title: "Als teus peus i al volant",
            content: "Has conduït per una carretera alpina on cal prendre corbes de 180° que van serpentejant la muntanya i fent zig-zag? Si les carreteres anessin rectes amunt (com ho fa un ascensor), l'angle seria tan alt que els motors dels cotxes normals no tindrien prou força (Torque) per pujar-ho! Les correses d'accessibilitat utilitzades per les cadires de rodes també es basen estretament en limitar l'angle.",
            imageIcon: "⛰️"
        }
    ]
};

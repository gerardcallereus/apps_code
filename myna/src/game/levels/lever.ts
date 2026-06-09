import { LevelConfig } from './index';

export const leverConfig: LevelConfig = {
    id: 'lever',
    name: 'La Palanca',
    desc: "Aixeca grans pesos controlant el punt de suport.",
    emoji: "🕹️",
    bg: "from-orange-500 to-yellow-600",
    texts: {
        sign_intro: "CATAPULTA: ATAC AL CASTELL!\nEns encarreguen la tasca d'enderrocar el castell enemic amb una catapulta. La catapulta és bàsicament una Palanca Gegant on el fulcre (punt de suport) es pot moure.\n\nLa Llei de la Palanca: Força × BraçForça = Pes × BraçPes.",
        sign_1: "CATAPULTA 1: Braç Curt (d=1m)\nTreu la traba prement el botó vermell. Fixa't on arriba la pedra aplicant el contrapès prop del fulcre.",
        sign_2: "CATAPULTA 2: Braç Mitjà (d=2.5m)\nSi allarguem la distància d'on cau el pes cap enfora, augmentem el Parell de Força. Mira l'impacte!",
        sign_3: "CATAPULTA 3: Braç Llarg (d=3.8m)\nPosant el pes al màxim del braç la potència llançadora es multiplica... Enderroca la fortalesa!",
        finish: "Nivell completat!\n\nHas demostrat dominar el principi de la palanca i hem pres la fortalesa enemiga."
    },
    quiz: [
        {
            question: "1. Si posem un contrapès de 2000 kg a UN (1) metre del fulcre, quanta força de projecció tindrem sobre una pedra que col·loquem a 10 metres del fulcre?",
            options: [
                "A) Tindrem el mateix pes: 2000 kg.",
                "B) Serà 10 vegades inferior (2000 kg × 1 = Força × 10) => Força = 200 kg.",
                "C) Tindrem 20000 kg destructius!"
            ],
            correct: 1,
            explanation: "Correcte. Sembla poc dir 'perdem força', però a canvi guanyem una VELOCITAT i ABAST formidables! La velocitat de la pedra serà molt més ràpida que la caiguda del contrapès."
        },
        {
            question: "2. Si per trencar la muralla principal s'ha calculat que necessitem aplicar 500 kg de força, i tenim el projectil a 8 metres del fulcre. Si el nostre contrapès està a 2 metres, quant ha de pesar contrapès?",
            options: [
                "A) 2000 kg (Contrapès × 2m = 500kg × 8m)",
                "B) 500 kg, el mateix que la força que necessitem.",
                "C) 125 kg (500kg/4)"
            ],
            correct: 0,
            explanation: "Perfecte! Contrapès × 2 = 4000. Llavors Contrapès = 2000 kg."
        }
    ],
    history: [
        {
            title: "El Trabuquet Medieval",
            content: "Abans de l'aparició dels canons i la pólvora, el Trabuquet va ser l'arma de setge més mortífera i destructiva. Feia servir exclusivament de la física de la gravetat per baixar un contra-pés immens, aixecant un braç llarg amb la baia llançant les pedres.",
            imageIcon: "🏰"
        },
        {
            title: "La Llei d'Arquímedes",
            content: "Va ser el matemàtic grec qui va encunyar 'Doneu-me un punt de suport i mouré el món.', posant la llei que governa tota aquesta família de màquines p=R·d.",
            imageIcon: "📐"
        },
        {
            title: "Tipus primari (Balanço)",
            content: "Una balança infantil és l'exemple clàssic on el fulcre es troba al bell mig. Si apliques força en un costat (pes cap avall), aixeques la persona a l'altre costat.",
            imageIcon: "⚖️"
        },
        {
            title: "Tipus secundari (Carretó)",
            content: "Els carretons utilitzen la palanca on el fulcre és la roda que està al principi, la càrrega va al mig, i apliquem la potència enlaire des de l'extrem posterior. Per això la terra no pesa quan va muntada!",
            imageIcon: "🛒"
        },
        {
            title: "Tipus terciari (Pinces)",
            content: "T'has fet servir mai unes pinces per agafar roba o de cosmètica? El fulcre es troba a la cua d'aquestes, apliquem força de pressió al mig per atrapar subtilment alguna cosa a l'estrem de la punta contrària.",
            imageIcon: "🥢"
        },
        {
            title: "Sistemes Biològics",
            content: "No només existeix a les màquines humanes! Els nostres cossos són conjunts de palanques biològiques. Les articulacions fan de fulcre i els músculs apliquen força als ossos per caminar o mastegar menjar.",
            imageIcon: "🦵"
        }
    ]
};

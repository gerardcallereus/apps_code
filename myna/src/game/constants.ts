export const TILE = 36;
export let CANVAS_W = 1000;
export let CANVAS_H = 800;
export const setCanvasSize = (w: number, h: number) => {
    CANVAS_W = w;
    CANVAS_H = h;
};
export const VIEW_HALF_H = CANVAS_H;

// Physics
export const MAX_SPEED = 5.5;
export const ACCEL = 0.6;
export const FRICTION = 0.82;
export const GRAVITY = 0.5;
export const MAX_FALL = 12;
export const JUMP_FORCE = 11.5;

// Aesthetic colors (SNES Mario style)
export const COLORS = {
    skyTop: '#5c94fc', 
    skyBottom: '#c8d4fc',
    grassTop: '#00a800',
    dirt: '#b85c00',
    brick: '#c04a0e',
    wood: '#d89410',
    lavaTop: '#fc5c00',
    lavaBot: '#c02400',
    spike: '#a8a8a8',
    starMain: '#fcd800',
    starDark: '#fc9800',
    metal: '#484848',
    p1Hat: '#fc0000',     // Mario Red
    p1Skin: '#fc9838',
    p1Overall: '#0000fc',
    p2Hat: '#00a800',     // Luigi Green
    p2Skin: '#fc9838',
    p2Overall: '#0000fc',
};

export const TEXTS = {
    sign_intro: "OBJECTIU D'APRENENTATGE:\nAvui aprendrem com la forma d'un objecte canvia la manera com es mou.\nObserva com cada figura geomètrica interacciona amb el terra. La línia vermella que apareix a sota indica la zona de fregament (fricció) amb el terra. Com més línia vermella = més fricció i més costa d'empènyer!",
    sign_triangle: "El triangle (3 costats). Fixa't en la línia vermella de fregament: tot un costat llarg rasca el terra! Tombar-lo requereix força i el cop és brusc.",
    sign_square: "El quadrat (4 costats). Tota una cara plana toca al terra produeixent molta fricció. Fixa't en com la línia vermella és igual de llarga que el seu costat.",
    sign_pentagon: "El pentàgon (5 costats). La línia vermella de contacte és més curta! Ja comença a rodar una mica més fàcilment.",
    sign_hexagon: "L'hexàgon (6 costats). Menys superfície vermella de contacte = el moviment és més suau i continu.",
    sign_octagon: "L'octàgon (8 costats). Cada vegada la línia vermella és més petita. Costa molt menys empènyer!",
    sign_decagon: "El decàgon (10 costats). La base de fregament és minsa. Quasi sembla que rodi sol.",
    sign_dodecagon: "El dodecàgon (12 costats). Gairebé només toca un petit punt vermell. Quin canvi a l'hora de moure'l!",
    sign_hexadecagon: "Polígon de 16 costats. El fregament és mínim, pràcticament rodola sense esforç i travessa el mur sense problemes.",
    sign_wheel: "La Roda! La màxima eficiència: la seva superfície de contacte és només un minúscul punt vermell! Fricció mínima i màxima eficiència energètica!",
    finish: "Nivell completat!\n\nHas demostrat per què la roda és genial! Ens permet moure grans pesos fent servir molta menys força justament perquè minimitza la fricció."
};

export const QUIZ_QUESTIONS = [
    {
        question: "1. Per què un quadrat costa més d'empènyer que una roda?",
        options: [
            "A) Perquè el quadrat té menys superfície en contacte amb el terra.",
            "B) Perquè el quadrat té més superfície en contacte amb el terra i, per tant, més fricció.",
            "C) Perquè el quadrat és més pesat."
        ],
        correct: 1,
        explanation: "Correcte! La força de fregament (fricció) depèn molt de la interacció entre superfícies. En recolzar-se completament, el quadrat s'atura."
    },
    {
        question: "2. Com afecta augmentar els costats d'un polígon a l'hora d'empènyer-lo?",
        options: [
            "A) Cada vegada costa menys tombar-lo, s'assembla més a una roda.",
            "B) Costa més perquè té més racons que xoquen contra el terra.",
            "C) No afecta en absolut."
        ],
        correct: 0,
        explanation: "Exacte! Com més costats, més petita és la superfície de contacte (la línia vermella) que es recolza al terra a cada instant, reduint la fricció."
    },
    {
        question: "3. Què converteix la roda en la màquina simple més eficient per desplaçar-se?",
        options: [
            "A) El seu color ajuda a relliscar.",
            "B) Només està en contacte amb el terra en un sol punt, minimitzant la fricció al màxim.",
            "C) Que rellisca en comptes de rodolar."
        ],
        correct: 1,
        explanation: "Molt bé! Una circumferència perfecta només té un punt de contacte tangent al terra, fent que la força de fregament i d'inèrcia lineal sigui mínima."
    },
    {
        question: "4. Quan s'estima que es va inventar la roda segons les restes arqueològiques més antigues?",
        options: [
            "A) Aproximadament al 3500 aC.",
            "B) A l'Edat Mitjana (any 1200 dC).",
            "C) Fa un milió d'anys per part de l'Homo Sapiens."
        ],
        correct: 0,
        explanation: "Correcte. Els primers registres es troben a Mesopotàmia al voltant d'aquesta data (Edat del Bronze), força mil·lenis després de l'origen de l'homo sapiens."
    },
    {
        question: "5. Quina va ser una de les principals primeres aplicacions de la roda, abans que s'utilitzés massivament en carros de transport?",
        options: [
            "A) Sistemes de politges per extreure aigua.",
            "B) Peces mecàniques per als primers rellotges.",
            "C) El torn de terrisser, per ajudar a modelar gerros d'argila."
        ],
        correct: 2,
        explanation: "Així és! La rotació constant del torn revolucionar l'alfareria abans d'aplicar-se horitzontalment als vehicles."
    }
];

export const HISTORY_SLIDES = [
    {
        title: "L'Origen de la Roda",
        content: "La roda és una de les invencions més grans de la història de la humanitat. Es calcula que va ser inventada al voltant del 3500 aC a Mesopotàmia, durant l'Edat del Bronze. Curiosament, no va ser l'homo sapiens de la prehistòria qui la va inventar, sinó les primeres societats agrícoles grans.",
        imageIcon: "🏺"
    },
    {
        title: "Els Primers Usos",
        content: "Pot sorprendre, però s'ha trobat evidència que abans de fer-se servir per al transport, s'utilitzava industrialment. Les primeres rodes eren torns de terrisser: rodes horitzontals que giraven sobre un eix vertical i permetien donar forma ràpida a gerros i atuells de fang de manera simètrica i eficient.",
        imageIcon: "🏺"
    },
    {
        title: "Revolució en el Transport",
        content: "Uns segles més tard, algú va tenir la brillant idea de girar aquell torn horitzontal i posar-ne dos de verticals units per un eix, permetent la creació del carro o carretó. Això va permetre als agricultors transportar quantitats massives d'aliments que, amb el fregament antic (arrossegant), hauria sigut pràcticament impossible.",
        imageIcon: "🛒"
    },
    {
        title: "Evolució Imparable",
        content: "Des d'aquell moment, la roda no es va aturar: engranatges, molins d'aigua per moldre gra (transformant moviment circular de l'aigua en feina mecànica), politges per aixecar pes sense esforç, rellotges mecànics... La nostra civilització es mou sobre rodes. I recorda el mecanisme clau: gairebé no tenen fricció respecte de lliscar o arrossegar!",
        imageIcon: "⚙️"
    }
];

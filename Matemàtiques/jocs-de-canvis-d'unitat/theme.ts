import { Game } from './types';

type GameTheme = {
    name: string;
    description: string;
    textClass: string;
    borderClass: string;
    hoverBgClass: string;
    pageBgClass: string;
};

export const GAME_THEMES: Record<Extract<Game, string>, GameTheme> = {
    tournament1p: {
        name: "Torneig en Solitari",
        description: "Supera una sèrie de reptes i aconsegueix la màxima puntuació.",
        textClass: 'text-white',
        borderClass: 'border-transparent',
        hoverBgClass: 'hover:from-sky-600',
        pageBgClass: 'bg-sky-100',
    },
    tournament2p: {
        name: "Torneig 2 Jugadors",
        description: "Competiu per torns en diferents jocs per veure qui és el millor!",
        textClass: 'text-white',
        borderClass: 'border-transparent',
        hoverBgClass: 'hover:from-purple-600',
        pageBgClass: 'bg-indigo-100',
    },
    unitLadder: {
        name: "Escala d'Unitats",
        description: "Visualitza els salts entre unitats. Ideal per començar.",
        textClass: 'text-sky-600',
        borderClass: 'hover:border-sky-400',
        hoverBgClass: 'hover:bg-sky-50',
        pageBgClass: 'bg-sky-100',
    },
    sorting: {
        name: "Ordena les Mides",
        description: "Arrossega i ordena valors de més petit a més gran.",
        textClass: 'text-amber-600',
        borderClass: 'hover:border-amber-400',
        hoverBgClass: 'hover:bg-amber-50',
        pageBgClass: 'bg-amber-100',
    },
    quiz: {
        name: "Test d'Opció Múltiple",
        description: "Tria la resposta correcta entre quatre opcions.",
        textClass: 'text-emerald-600',
        borderClass: 'hover:border-emerald-400',
        hoverBgClass: 'hover:bg-emerald-50',
        pageBgClass: 'bg-emerald-100',
    },
    unitMatch: {
        name: "Memory d'Unitats",
        description: "Troba les parelles de valors equivalents.",
        textClass: 'text-rose-600',
        borderClass: 'hover:border-rose-400',
        hoverBgClass: 'hover:bg-rose-50',
        pageBgClass: 'bg-rose-100',
    },
    fillBlank: {
        name: "Omple el Buit",
        description: "Escriu la conversió correcta. Un clàssic!",
        textClass: 'text-cyan-600',
        borderClass: 'hover:border-cyan-400',
        hoverBgClass: 'hover:bg-cyan-50',
        pageBgClass: 'bg-cyan-100',
    },
    comparison: {
        name: "Compara Valors",
        description: "Digues quin valor és més gran, més petit o igual.",
        textClass: 'text-orange-600',
        borderClass: 'hover:border-orange-400',
        hoverBgClass: 'hover:bg-orange-50',
        pageBgClass: 'bg-orange-100',
    },
    lab: {
        name: "El Laboratori d'Alquímia",
        description: "Tria l'ingredient correcte per crear la teva poció màgica.",
        textClass: 'text-lime-600',
        borderClass: 'hover:border-lime-400',
        hoverBgClass: 'hover:bg-lime-50',
        pageBgClass: 'bg-lime-100',
    },
    puzzle: {
        name: "Trencaclosques Enllaçat",
        description: "Resol conversions en cadena. La resposta d'una és el començament de la següent!",
        textClass: 'text-violet-600',
        borderClass: 'hover:border-violet-400',
        hoverBgClass: 'hover:bg-violet-50',
        pageBgClass: 'bg-violet-100',
    },
    unitRace: {
        name: "Cursa d'Unitats",
        description: "Suma valors i converteix el total contrarellotge.",
        textClass: 'text-blue-600',
        borderClass: 'hover:border-blue-400',
        hoverBgClass: 'hover:bg-blue-50',
        pageBgClass: 'bg-blue-100',
    },
    whackAMole: {
        name: "La Fuga del Castell",
        description: "Respon preguntes per avançar i escapar de l'enemic!",
        textClass: 'text-pink-600',
        borderClass: 'hover:border-pink-400',
        hoverBgClass: 'hover:bg-pink-50',
        pageBgClass: 'bg-pink-100',
    },
};

export const GAME_ORDER: Exclude<Game, 'tournament2p' | 'tournament1p' | null>[] = [
    'unitLadder', 'sorting', 'quiz', 'unitMatch', 'fillBlank',
    'comparison', 'lab', 'puzzle', 'unitRace', 'whackAMole'
];
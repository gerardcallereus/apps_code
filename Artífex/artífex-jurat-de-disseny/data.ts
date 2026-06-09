import { LocalBrand } from './types';

// Base de dades de marques adaptada per a alumnes de 2n d'ESO.
// Logos optimitzats visualment per exagerar el "Bon Disseny" vs "Mal Disseny".

export const GAME_BRANDS: LocalBrand[] = [
  {
    id: '1',
    name: 'LUMINA',
    category: 'Tecnologia / Llums',
    // TRUC: Tracking extrem (doble espai) i un fons "Rich Black" (#09090b) que és més elegant que el negre pur.
    logoUrl: 'https://placehold.co/600x600/09090b/FFFFFF?text=L++U++M++I++N++A&font=montserrat',
    isGood: true,
    availableTags: ['Airejada', 'Senzilla', 'Atapeïda', 'Elegant', 'Borrosa', 'Moderna'],
    correctTags: ['Airejada', 'Elegant', 'Moderna'],
    explanation: "Veus com les lletres estan molt separades? Això es diu 'tracking'. En deixar que les lletres respirin sobre un fons fosc i profund, aconsegueixes que la marca sembli automàticament de luxe i tecnologia punta. Transmet calma i claredat.",
    tip: "L'espai buit és tan important com el dibuix. No tinguis por de separar les lletres (especialment si estan en majúscules). Això es diu 'espai negatiu' i fa que el teu logo sembli més car."
  },
  {
    id: '2',
    name: 'Kebab King',
    category: 'Menjar Ràpid',
    // TRUC: Vibració cromàtica màxima. Vermell pur i Blau elèctric. Font bàsica.
    logoUrl: 'https://placehold.co/600x600/FF0000/0000FF?text=KEBAB%0AKING&font=oswald',
    isGood: false,
    availableTags: ['Mal d\'ulls', 'Luxosa', 'Agressiva', 'Relaxant', 'Amateur', 'Neta'],
    correctTags: ['Mal d\'ulls', 'Agressiva', 'Amateur'],
    explanation: "Aaaaaarg! Els meus ulls! Això es diu 'Vibració Cromàtica'. Has posat blau elèctric sobre vermell pur. L'ull humà no pot enfocar aquests dos colors alhora i es crea un efecte visual que mareja físicament. Mai, mai facis això.",
    tip: "Fes la 'Prova de la Mirada': Entretanca els ulls. Si el text i el fons sembla que es barallen o vibren, canvia els colors. El text sempre ha de destacar netament sobre el fons."
  },
  {
    id: '3',
    name: 'VELVET',
    category: 'Roba de Luxe',
    // TRUC: Negre ric (no pur) i un daurat metàl·lic elegant. Font amb Serifa clàssica.
    logoUrl: 'https://placehold.co/600x600/121212/D4AF37?text=VELVET&font=playfair-display',
    isGood: true,
    availableTags: ['Barata', 'Sofisticada', 'Avorrida', 'Clàssica', 'Confusa', 'Elegant'],
    correctTags: ['Sofisticada', 'Clàssica', 'Elegant'],
    explanation: "Fixa't en la lletra: té uns petits peuets o remats als extrems. Això es diu 'Serifa'. Marques com Gucci o Vogue les usen perquè recorden a l'escriptura clàssica romana. El daurat sobre negre és la combinació reina de l'elegància.",
    tip: "El tipus de lletra té personalitat. Si vols semblar seriós, tradicional o car, usa lletres amb Serifa (amb peuets). Si vols semblar modern i tecnològic, usa Sans Serif (lletres de pal sec)."
  },
  {
    id: '4',
    name: 'ClickTech 2000',
    category: 'Informàtica',
    // TRUC: Contrast nul. Fons groc brillant amb lletra blanca. Il·legible.
    logoUrl: 'https://placehold.co/600x600/FFFF00/FFFFFF?text=ClickTech%0A2000&font=roboto',
    isGood: false,
    availableTags: ['Futurista', 'Sense Contrast', 'Professional', 'Il·legible', 'Elegant', 'Antiquada'],
    correctTags: ['Sense Contrast', 'Il·legible', 'Antiquada'],
    explanation: "Pots llegir-ho? Jo tampoc. Lletra blanca sobre fons groc brillant és el pitjor contrast de la història. És com mirar el sol. A més, posar '2000' en un nom fa que l'empresa sembli que es va quedar atrapada fa 20 anys.",
    tip: "El contrast ho és tot. Si costa de llegir, el logo no serveix. Posa sempre lletra fosca sobre fons clar, o lletra clara sobre fons fosc. Mai clar sobre clar!"
  },
  {
    id: '5',
    name: 'OAK & STONE',
    category: 'Arquitectura',
    // TRUC: Fons gris carbó (#333333) per donar pes. Lletres blanques. Disposició en bloc.
    logoUrl: 'https://placehold.co/600x600/333333/F3F4F6?text=OAK%0A%26%0ASTONE&font=montserrat',
    isGood: true,
    availableTags: ['Sòlida', 'Feble', 'Seriosa', 'Massa colors', 'Professional', 'Desordenada'],
    correctTags: ['Sòlida', 'Seriosa', 'Professional'],
    explanation: "Això sí que és estructura! El fons fosc (gris carbó) i les lletres blanques creen un contrast fort i seriós. En posar el text en dues línies, crees un 'bloc' visual que transmet estabilitat, com els fonaments d'un edifici.",
    tip: "Pensa en el 'Pes Visual'. Utilitza colors foscos i lletres gruixudes o majúscules per transmetre força i potència. L'arquitectura necessita transmetre seguretat."
  },
  {
    id: '6',
    name: 'FUN TOYZ',
    category: 'Joguines',
    // TRUC: Font super seriosa (Times New Roman) en un color gris depressiu. Error de context.
    logoUrl: 'https://placehold.co/600x600/4A5568/1A202C?text=Fun+Toyz&font=lora',
    isGood: false,
    availableTags: ['Alegre', 'Trista', 'Avorrida', 'Divertida', 'Depriment', 'Vibrant'],
    correctTags: ['Trista', 'Avorrida', 'Depriment'],
    explanation: "Aquesta botiga sembla una funerària! El públic són nens, però has fet servir grisos apagats i una lletra super seriosa (com la dels llibres de text). No transmet diversió, sinó avorriment total. Error de context!",
    tip: "Els colors tenen significat (Psicologia del Color). Per a nens, utilitza colors vius i saturats (vermell, groc, blau). Deixa el gris i el negre per a advocats o arquitectes."
  },
  {
    id: '7',
    name: 'MÖD',
    category: 'Mobles',
    // TRUC: Estil Suís. Helvètica negreta sobre blanc pur. Sense marges.
    logoUrl: 'https://placehold.co/600x600/FFFFFF/000000?text=M%C3%96D&font=roboto',
    isGood: true,
    availableTags: ['Moderna', 'Massa color', 'Neta', 'Antiga', 'Funcional', 'Confusa'],
    correctTags: ['Moderna', 'Neta', 'Funcional'],
    explanation: "Menys és més. Aquest estil es diu 'Minimalisme'. Com una habitació ben endreçada, no té res que sobri. Blanc i negre sempre funciona. A més, és súper fàcil d'imprimir en etiquetes, caixes o la web.",
    tip: "Fes la 'Prova de la Reducció': Fes el teu logo molt petit (de 2cm). Si es converteix en una taca i no s'entén, té massa detalls. Simplifica fins que funcioni en petit."
  },
  {
    id: '8',
    name: 'Construct.SL',
    category: 'Obres',
    // TRUC: Font "Dancing Script" (cursiva de boda) per a construcció. Error total de concepte.
    logoUrl: 'https://placehold.co/600x600/F3F4F6/000000?text=Construcciones%0APerez+y+Lopez%0AS.L.&font=dancing-script',
    isGood: false,
    availableTags: ['Amateur', 'Professional', 'Simple', 'Divertida', 'Elegant', 'Antiga'],
    correctTags: ['Amateur', 'Simple', 'Antiga'],
    explanation: "Sembla una invitació de casament, no una empresa que posa totxos! La lletra cursiva transmet delicadesa, romanticisme o fragilitat. Construir requereix força. A més, hi ha massa text innecessari (S.L., cognoms...).",
    tip: "La tipografia parla. No facis servir lletres 'Manuscrites' o 'Cursives' (Script) si vols transmetre tecnologia, construcció o serietat. Usa-les per a coses artesanes o personals."
  },
  {
    id: '9',
    name: 'NEXUS',
    category: 'Apps / Mòbils',
    // TRUC: Color "Blurple" (típic de Discord/Twitch). Lletra geomètrica.
    logoUrl: 'https://placehold.co/600x600/4F46E5/FFFFFF?text=NEXUS&font=montserrat',
    isGood: true,
    availableTags: ['Professional', 'Antiga', 'Digital', 'Confusa', 'Global', 'Rústica'],
    correctTags: ['Professional', 'Digital', 'Global'],
    explanation: "Aquest color blau-violeta elèctric és el rei de les apps modernes. Transmet futur, pantalles i creativitat digital. La lletra és rodona i geomètrica, cosa que la fa semblar 'friendly' (amigable) i fàcil d'utilitzar.",
    tip: "El teu logo funciona en blanc i negre? Aquest sí. Abans de posar-li colors xulos i degradats, assegura't que la forma funcioni perfectament només en tinta negra."
  },
  {
    id: '10',
    name: 'Sweet Dreams',
    category: 'Pastisseria',
    // TRUC: Fons negre i lletra vermell sang fosc. Sembla una peli de terror.
    logoUrl: 'https://placehold.co/600x600/000000/8B0000?text=Sweet%0ADreams&font=playfair-display',
    isGood: false,
    availableTags: ['Dolça', 'De por', 'Agradable', 'Sangonosa', 'Poc Apetitosa', 'Acollidora'],
    correctTags: ['De por', 'Sangonosa', 'Poc Apetitosa'],
    explanation: "El nom diu 'Dolços Somnis', però la imatge diu 'Malson'. La combinació de fons negre amb lletres vermell fosc recorda a la sang i a les pel·lícules de terror. Si vols vendre pastissos, has de fer venir gana, no por!",
    tip: "Si fas una marca de menjar, busca colors 'comestibles': taronges, marrons xocolata, cremes, vermells vius... Evita les combinacions que recordin a la brutícia, la sang o el verí."
  }
];

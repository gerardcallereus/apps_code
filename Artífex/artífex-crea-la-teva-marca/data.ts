import { PhaseData } from './types';

export const GAME_DATA: PhaseData[] = [
  {
    id: 1,
    title: "FASE 1: LA GUSPIRA",
    subtitle: "(IDEA)",
    iconName: "Lightbulb",
    definition: "Tot comença amb una necessitat o una observació. No és només \"tenir una idea feliç\", sinó detectar un problema i imaginar una solució que ningú més ha vist. És el pas de la inspiració abstracta (natura, art, problemes quotidians) al concepte inicial.",
    example: "Bill Bowerman (Nike) volia sabatilles més lleugeres. Mirant la màquina de fer gofres de la seva dona, va tenir una revelació: \"I si la sola tingués aquesta forma de graella?\". Va destrossar la màquina amb goma líquida i va crear el primer prototip."
  },
  {
    id: 2,
    title: "FASE 2: IDENTITAT",
    subtitle: "(MARCA)",
    iconName: "Fingerprint",
    definition: "Un producte sense nom és només un objecte. Aquí definim la \"personalitat\" de l'empresa. Triem el Naming (nom), dissenyem el logotip i decidim colors. L'objectiu és que, quan algú vegi el símbol, senti alguna cosa sense llegir res.",
    example: "Van triar el nom \"Nike\" (deessa de la victòria). Carolyn Davidson va dissenyar el logotip (Swoosh) per només 35 dòlars. La \"pipa\" representa l'ala de la deessa i el so de la velocitat."
  },
  {
    id: 3,
    title: "FASE 3: DISSENY TÈCNIC",
    subtitle: "",
    iconName: "Ruler",
    definition: "Convertim l'esbós artístic en instruccions per a les màquines. Utilitzem programes CAD per dibuixar plànols mil·limètrics. Decidim mesures exactes, gruixos i materials. Si ens equivoquem aquí, la producció sortirà malament.",
    example: "Els enginyers dissenyen les cambres d'aire i les soles a l'ordinador abans de fabricar. Calculen on va cada costura i el gruix de la sola. Dibuixen els plànols que s'enviaran a la fàbrica."
  },
  {
    id: 4,
    title: "FASE 4: PRODUCCIÓ",
    subtitle: "",
    iconName: "Factory",
    definition: "Passem del món digital al físic. Preparem motlles i comprem materials a l'engròs. És el procés de fabricar el producte en sèrie (moltes unitats iguals) seguint els estàndards de qualitat definits.",
    example: "Les fàbriques reben els dissenys i comencen la producció massiva. Grans màquines tallen patrons, injecten escuma i línies de muntatge (robots i persones) cusen les peces per crear milers de sabatilles."
  },
  {
    id: 5,
    title: "FASE 5: COSTOS I PREU",
    subtitle: "",
    iconName: "Calculator",
    definition: "Les matemàtiques del negoci. Sumem materials, llum, feina, transport i impostos. A aquest \"Cost de fabricació\" li sumem el \"Marge de benefici\" per decidir el \"Preu de Venda al Públic\" (PVP).",
    example: "Fabricar unes Jordan pot costar 25€. Però s'ha de sumar transport, lloguer de botigues i publicitat. Per això, el preu final a la botiga acaba sent de 150€ o més."
  },
  {
    id: 6,
    title: "FASE 6: COMERCIALITZACIÓ",
    subtitle: "(VENDA)",
    iconName: "ShoppingBag",
    definition: "L'últim pas: connectar amb el client. Inclou el disseny del packaging, la distribució a les botigues i, sobretot, el màrqueting i la publicitat per generar desig de compra.",
    example: "Nike posa les sabatilles a la seva caixa taronja icònica. Llancen campanyes com \"Just Do It\" i patrocinen atletes. No venen només sabates; venen la idea que tu també ets un atleta."
  }
];
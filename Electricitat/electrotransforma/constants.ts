import { Question, TransformationType } from './types';

export const APP_TITLE = "ElectroTransforma";

// Database of questions to be used locally
export const QUESTIONS_DB: Question[] = [
  {
    id: 1,
    objectName: "Bombeta Incandescent",
    description: "Un dispositiu clàssic que il·lumina una habitació.",
    correctType: TransformationType.LUMINOUS,
    options: [TransformationType.LUMINOUS, TransformationType.MECHANICAL, TransformationType.CHEMICAL, TransformationType.SOUND],
    explanation: "El corrent elèctric passa pel filament i el fa brillar, transformant l'energia elèctrica en lluminosa (i també molta tèrmica!)."
  },
  {
    id: 2,
    objectName: "Ventilador",
    description: "Té aspes que giren per moure l'aire.",
    correctType: TransformationType.MECHANICAL,
    options: [TransformationType.MECHANICAL, TransformationType.THERMAL, TransformationType.CHEMICAL, TransformationType.LUMINOUS],
    explanation: "El motor elèctric converteix l'electricitat en moviment (energia mecànica cinètica)."
  },
  {
    id: 3,
    objectName: "Torradora",
    description: "S'utilitza per escalfar pa a l'esmorzar.",
    correctType: TransformationType.THERMAL,
    options: [TransformationType.THERMAL, TransformationType.MECHANICAL, TransformationType.SOUND, TransformationType.CHEMICAL],
    explanation: "Les resistències internes s'escalfen al pas del corrent, transformant energia elèctrica en tèrmica (calor)."
  },
  {
    id: 4,
    objectName: "Bateria de Mòbil (carregant)",
    description: "Quan connectes el telèfon al corrent.",
    correctType: TransformationType.CHEMICAL,
    options: [TransformationType.CHEMICAL, TransformationType.MECHANICAL, TransformationType.LUMINOUS, TransformationType.SOUND],
    explanation: "L'energia elèctrica s'emmagatzema dins la bateria transformant-se en energia química."
  },
  {
    id: 5,
    objectName: "Altaveu",
    description: "El fas servir per escoltar música.",
    correctType: TransformationType.SOUND,
    options: [TransformationType.SOUND, TransformationType.THERMAL, TransformationType.CHEMICAL, TransformationType.LUMINOUS],
    explanation: "El senyal elèctric fa vibrar una membrana que produeix ondes sonores."
  },
  {
    id: 6,
    objectName: "Forn Elèctric",
    description: "Electrodomèstic per cuinar aliments mitjançant calor.",
    correctType: TransformationType.THERMAL,
    options: [TransformationType.THERMAL, TransformationType.MECHANICAL, TransformationType.LUMINOUS, TransformationType.CHEMICAL],
    explanation: "Les resistències converteixen l'energia elèctrica en calor per cuinar els aliments."
  },
  {
    id: 7,
    objectName: "Batedora",
    description: "Eina de cuina per triturar aliments.",
    correctType: TransformationType.MECHANICAL,
    options: [TransformationType.MECHANICAL, TransformationType.THERMAL, TransformationType.SOUND, TransformationType.CHEMICAL],
    explanation: "El motor fa girar les fulles a gran velocitat (energia mecànica)."
  },
  {
    id: 8,
    objectName: "Semàfor LED",
    description: "Senyal de trànsit que canvia de color.",
    correctType: TransformationType.LUMINOUS,
    options: [TransformationType.LUMINOUS, TransformationType.THERMAL, TransformationType.MECHANICAL, TransformationType.SOUND],
    explanation: "Els díodes LED emeten llum de colors quan hi passa corrent elèctric."
  },
  {
    id: 9,
    objectName: "Timbre de Porta",
    description: "Avisa quan algú arriba a casa.",
    correctType: TransformationType.SOUND,
    options: [TransformationType.SOUND, TransformationType.LUMINOUS, TransformationType.CHEMICAL, TransformationType.THERMAL],
    explanation: "Un electroimant colpeja una campana metàl·lica produint so."
  },
  {
    id: 10,
    objectName: "Electròlisi de l'aigua",
    description: "Procés per separar hidrogen i oxigen.",
    correctType: TransformationType.CHEMICAL,
    options: [TransformationType.CHEMICAL, TransformationType.THERMAL, TransformationType.MECHANICAL, TransformationType.LUMINOUS],
    explanation: "L'electricitat trenca els enllaços químics de l'aigua."
  },
  {
    id: 11,
    objectName: "Planxa de Roba",
    description: "Serveix per treure les arrugues de la roba.",
    correctType: TransformationType.THERMAL,
    options: [TransformationType.THERMAL, TransformationType.SOUND, TransformationType.LUMINOUS, TransformationType.CHEMICAL],
    explanation: "La base metàl·lica s'escalfa molt gràcies a una resistència elèctrica."
  },
  {
    id: 12,
    objectName: "Cotxe Elèctric (Motor)",
    description: "El propulsor que mou el vehicle.",
    correctType: TransformationType.MECHANICAL,
    options: [TransformationType.MECHANICAL, TransformationType.THERMAL, TransformationType.CHEMICAL, TransformationType.SOUND],
    explanation: "L'energia de la bateria es transforma en moviment a les rodes."
  },
  {
    id: 13,
    objectName: "Trepant (Taladradora)",
    description: "Eina per fer forats a la paret.",
    correctType: TransformationType.MECHANICAL,
    options: [TransformationType.MECHANICAL, TransformationType.LUMINOUS, TransformationType.THERMAL, TransformationType.CHEMICAL],
    explanation: "El motor fa girar la broca amb força per perforar materials."
  },
  {
    id: 14,
    objectName: "Estufa de Quars",
    description: "Calefactor amb barres que es posen vermelles.",
    correctType: TransformationType.THERMAL,
    options: [TransformationType.THERMAL, TransformationType.MECHANICAL, TransformationType.CHEMICAL, TransformationType.SOUND],
    explanation: "Emet calor per radiació quan les barres s'escalfen pel pas del corrent."
  },
  {
    id: 15,
    objectName: "Auriculars",
    description: "Dispositius petits per escoltar música.",
    correctType: TransformationType.SOUND,
    options: [TransformationType.SOUND, TransformationType.CHEMICAL, TransformationType.THERMAL, TransformationType.LUMINOUS],
    explanation: "Transformen senyals elèctrics en ones sonores directament a l'oïda."
  },
  {
    id: 16,
    objectName: "Tub Fluorescent",
    description: "Il·luminació típica d'oficines o cuines.",
    correctType: TransformationType.LUMINOUS,
    options: [TransformationType.LUMINOUS, TransformationType.MECHANICAL, TransformationType.THERMAL, TransformationType.CHEMICAL],
    explanation: "El gas interior s'excita amb l'electricitat i emet llum."
  },
  {
    id: 17,
    objectName: "Soldador d'Estany",
    description: "Eina per unir components electrònics.",
    correctType: TransformationType.THERMAL,
    options: [TransformationType.THERMAL, TransformationType.MECHANICAL, TransformationType.SOUND, TransformationType.LUMINOUS],
    explanation: "La punta s'escalfa a altes temperatures per fondre el metall."
  },
  {
    id: 18,
    objectName: "Ascensor",
    description: "Màquina per pujar i baixar pisos.",
    correctType: TransformationType.MECHANICAL,
    options: [TransformationType.MECHANICAL, TransformationType.THERMAL, TransformationType.CHEMICAL, TransformationType.LUMINOUS],
    explanation: "Un gran motor elèctric estira els cables per moure la cabina."
  },
  {
    id: 19,
    objectName: "Bateria de Patinet (Càrrega)",
    description: "Quan endolles el patinet a la paret.",
    correctType: TransformationType.CHEMICAL,
    options: [TransformationType.CHEMICAL, TransformationType.MECHANICAL, TransformationType.SOUND, TransformationType.LUMINOUS],
    explanation: "L'energia elèctrica es guarda com a energia química a les bateries de liti."
  },
  {
    id: 20,
    objectName: "Sirena d'Ambulància",
    description: "Emet un soroll fort per avisar.",
    correctType: TransformationType.SOUND,
    options: [TransformationType.SOUND, TransformationType.THERMAL, TransformationType.CHEMICAL, TransformationType.MECHANICAL],
    explanation: "Converteix electricitat en un so molt potent d'avís."
  }
];
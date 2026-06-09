import { Scene } from './types';

export const STORY_DATA: Record<string, Scene> = {
  'start': {
    id: 'start',
    title: 'El Despertar en la Cueva de Obsidiana',
    text: 'Te despiertas en una cámara de paredes negras y brillantes. El aire es frío y huele a ozono. Delante de ti hay dos pasillos: uno iluminado por un tenue resplandor azul y otro envuelto en sombras totales. Tienes un dado de 6 caras en tu mano.',
    imageUrl: 'https://picsum.photos/seed/cave/800/450',
    type: 'story',
    choices: [
      {
        text: 'Seguir el resplandor azul',
        nextSceneId: 'blue_hall',
        probability: {
          successChance: 0.8,
          info: {
            type: 'laplace',
            title: 'Regla de Laplace',
            explanation: 'La probabilidad de éxito se calcula como casos favorables entre casos posibles. Si lanzas un dado y necesitas un 2 o más para avanzar sin tropezar, tienes 5 casos favorables (2,3,4,5,6) de 6 posibles.',
            formula: 'P(A) = Casos Favorables / Casos Totales = 5/6 ≈ 0.83',
            data: { favorable: 5, total: 6 }
          }
        }
      },
      {
        text: 'Adentrarse en las sombras',
        nextSceneId: 'dark_hall',
        probability: {
          successChance: 0.5,
          info: {
            type: 'laplace',
            title: 'Equiprobabilidad',
            explanation: 'En la oscuridad total, tienes las mismas posibilidades de encontrar un tesoro que de caer en una trampa. Es como lanzar una moneda.',
            formula: 'P(Éxito) = 1/2 = 0.5',
            data: { favorable: 1, total: 2 }
          }
        }
      }
    ]
  },
  'blue_hall': {
    id: 'blue_hall',
    title: 'El Pasillo de los Cristales',
    text: 'El resplandor proviene de cristales de mana incrustados en las paredes. Encuentras un cofre antiguo cerrado con un candado de combinación. Hay 3 cofres, pero solo uno contiene una Espada de Luz. ¿Cuál eliges?',
    imageUrl: 'https://picsum.photos/seed/crystals/800/450',
    type: 'story',
    choices: [
      {
        text: 'Abrir el cofre de Obsidiana',
        nextSceneId: 'victory_hall',
        probability: {
          successChance: 1/3,
          info: {
            type: 'laplace',
            title: 'Probabilidad Simple',
            explanation: 'Hay 3 opciones mutuamente excluyentes. Solo una es correcta.',
            formula: 'P(Espada) = 1/3 ≈ 0.33',
            data: { favorable: 1, total: 3 }
          }
        }
      },
      {
         text: 'Abrir el cofre de Zafiro',
         nextSceneId: 'victory_hall',
         probability: {
           successChance: 1/3,
           info: {
             type: 'laplace',
             title: 'Laplace en Acción',
             explanation: 'Al igual que con el de obsidiana, tu suerte aquí es de 1 entre 3.',
             formula: 'P(A) = 1/3',
             data: { favorable: 1, total: 3 }
           }
         }
      }
    ]
  },
  'victory_hall': {
    id: 'victory_hall',
    title: 'La Sala del Trono',
    text: 'Has superado los desafíos matemáticos y físicos de Obsidiana. Ante ti se alza el Trono de la Probabilidad. Has aprendido que el azar no es caos, sino un patrón que puede entenderse.',
    imageUrl: 'https://picsum.photos/seed/victory/800/450',
    type: 'end',
    choices: [
      { text: 'Empezar una nueva leyenda', nextSceneId: 'start' }
    ]
  },
  'dark_hall': {
    id: 'dark_hall',
    title: 'La Sombra Acechante',
    text: 'Un Guardián de Sombras surge de la oscuridad. Debes luchar para pasar.',
    imageUrl: 'https://picsum.photos/seed/shadow/800/450',
    type: 'combat',
    combat: {
      enemyName: 'Guardián de Sombras',
      enemyHealth: 20,
      winSceneId: 'victory_hall',
      lossSceneId: 'game_over',
      combatProbability: {
        type: 'tree',
        title: 'Diagrama de Árbol',
        explanation: 'Para vencer al Guardián, debes acertar dos golpes seguidos. Si cada golpe tiene un 50% de probabilidad, el camino hacia la victoria se estrecha.',
        formula: 'P(Victoria) = P(Golpe 1) * P(Golpe 2) = 0.5 * 0.5 = 0.25',
        data: { steps: [0.5, 0.5] }
      }
    }
  },
  'game_over': {
    id: 'game_over',
    title: 'Fin de la Aventura',
    text: 'Tus fuerzas te han abandonado. La oscuridad de Obsidiana te consume. ¿Quieres volver a intentarlo?',
    imageUrl: 'https://picsum.photos/seed/end/800/450',
    type: 'end',
    choices: [
      { text: 'Reiniciar aventura', nextSceneId: 'start' }
    ]
  }
};

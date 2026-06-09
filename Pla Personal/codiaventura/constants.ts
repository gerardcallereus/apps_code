import { CommandType } from './types';
import { LEVELS } from './levels/index';

const cmd = (type: CommandType, value?: number) => ({ id: Math.random().toString(), type, value });

// Re-export the levels so App.tsx doesn't need to change
export const LEVEL_DATA = LEVELS;

// Placeholder for World 2 (User created levels can be added here later)
export const WORLD_2_DATA = [
    // Currently empty or can reuse some levels for demo
];

// 5-Digit codes to unlock levels. 
// Level 1 is always unlocked. The code for Level X unlocks Level X (meaning you passed Level X-1).
export const LEVEL_CODES: Record<number, string> = {
    2: "RX7K9P2M",
    3: "J4H8Q1W5",
    4: "B3N6T9C2",
    5: "F5V8D1L7",
    6: "H2P4M9R3",
    7: "Z6K1W8G5",
    8: "N3C7T4Y2",
    9: "Q9J2X5B8",
    10: "M4L8V1P6",
    11: "W7F3D9K2",
    12: "T2H6R5N8",
    13: "P9B1J4Q7",
    14: "D5M8K2C6",
    15: "L3W7X1Y9",
    16: "V6R2N8H4",
    17: "G1T9F5P3",
    18: "K8Q4C7J2",
    19: "X5H1B9D6",
    20: "C2Z7M4W8",
    21: "FINAL-WIN" // Code given after beating level 20
};

export const COMMAND_DESCRIPTIONS: Record<CommandType, { label: string, desc: string }> = {
  [CommandType.FORWARD]: { label: 'Avançar', desc: "Mou el robot un pas endavant." },
  [CommandType.FORWARD_VAR]: { label: 'Avançar X', desc: "Avança diversos passos d'un cop." },
  [CommandType.TURN_LEFT]: { label: 'Gir Esquerra', desc: "Gira 90º a l'esquerra." },
  [CommandType.TURN_RIGHT]: { label: 'Gir Dreta', desc: "Gira 90º a la dreta." },
  [CommandType.TURN_AROUND]: { label: 'Girar 180', desc: "Mitja volta." },
  [CommandType.LOOP_START]: { label: 'Bucle (Repetir)', desc: "Repeteix instruccions N vegades." },
  [CommandType.LOOP_END]: { label: 'Fi Bucle', desc: "Marca el final del bloc de repetició." },
  [CommandType.WHILE_START]: { label: 'Mentre (While)', desc: "Repeteix mentre es compleixi la condició." },
  [CommandType.WHILE_END]: { label: 'Fi Mentre', desc: "Marca el final del bloc Mentre." },
  
  [CommandType.IF_WALL]: { label: 'Si Mur', desc: "Si hi ha un mur davant." },
  [CommandType.IF_NOT_WALL]: { label: 'Si No Mur', desc: "Si NO hi ha un mur davant." },
  
  [CommandType.IF_WATER]: { label: 'Si Aigua', desc: "Si hi ha aigua davant." },
  [CommandType.IF_NOT_WATER]: { label: 'Si No Aigua', desc: "Si NO hi ha aigua davant." },
  
  [CommandType.IF_HAZARD]: { label: 'Si Lava', desc: "Si hi ha lava davant." },
  [CommandType.IF_NOT_HAZARD]: { label: 'Si No Lava', desc: "Si NO hi ha lava davant." },
  
  [CommandType.IF_DOOR]: { label: 'Si Porta', desc: "Si hi ha una porta davant." },
  [CommandType.IF_NOT_DOOR]: { label: 'Si No Porta', desc: "Si NO hi ha una porta davant." },
  
  [CommandType.IF_PATH_LEFT]: { label: 'Si Camí Esq.', desc: "Si hi ha camí lliure a l'esquerra." },
  [CommandType.IF_NOT_PATH_LEFT]: { label: 'Si No Camí Esq.', desc: "Si NO hi ha camí lliure a l'esquerra." },
  
  [CommandType.IF_PATH_RIGHT]: { label: 'Si Camí Dreta', desc: "Si hi ha camí lliure a la dreta." },
  [CommandType.IF_NOT_PATH_RIGHT]: { label: 'Si No Camí Dreta', desc: "Si NO hi ha camí lliure a la dreta." },
  
  [CommandType.ELSE]: { label: 'Si No (Else)', desc: "S'executa si la condició anterior NO s'ha complert." },
  [CommandType.END_IF]: { label: 'Fi Si', desc: "Marca el final del bloc condicional." },
  
  [CommandType.PICKUP]: { label: 'Agafar', desc: "Recull l'objecte de la casella actual." },
  
  [CommandType.IF_RED]: { label: 'Si Vermell', desc: "Si el terra de sota és vermell." },
  [CommandType.IF_NOT_RED]: { label: 'Si No Vermell', desc: "Si el terra de sota NO és vermell." },
  
  [CommandType.IF_BLUE]: { label: 'Si Blau', desc: "Si el terra de sota és blau." },
  [CommandType.IF_NOT_BLUE]: { label: 'Si No Blau', desc: "Si el terra de sota NO és blau." },
  
  [CommandType.IF_GREEN]: { label: 'Si Verd', desc: "Si el terra de sota és verd." },
  [CommandType.IF_NOT_GREEN]: { label: 'Si No Verd', desc: "Si el terra de sota NO és verd." },
  
  [CommandType.UNLOCK_DOOR]: { label: 'Obrir Porta', desc: "Obre porta si tens clau." },
  [CommandType.JUMP]: { label: 'Saltar', desc: "Salta 1 casella (costa 2 energia)." },
  [CommandType.HAMMER]: { label: 'Trencar', desc: "Trenca murs esquerdats." },
  [CommandType.BUILD_BRIDGE]: { label: 'Fer Pont', desc: "Construeix pont sobre aigua." },
  
  [CommandType.IF_TILE_ITEM]: { label: 'Si Item', desc: "Si hi ha un objecte a sota." },
  [CommandType.IF_NOT_TILE_ITEM]: { label: 'Si No Item', desc: "Si NO hi ha un objecte a sota." },
  
  [CommandType.IF_TILE_KEY]: { label: 'Si Clau', desc: "Si hi ha una clau a sota." },
  [CommandType.IF_NOT_TILE_KEY]: { label: 'Si No Clau', desc: "Si NO hi ha una clau a sota." },
  
  [CommandType.IF_HAS_KEY]: { label: 'Tinc Clau', desc: "Si tens la clau a l'inventari." },
  [CommandType.IF_NOT_HAS_KEY]: { label: 'No Tinc Clau', desc: "Si NO tens la clau a l'inventari." },
  
  [CommandType.IF_HAS_ITEMS]: { label: 'Tinc X Items', desc: "Si tens N items recollits." },
  [CommandType.IF_NOT_HAS_ITEMS]: { label: 'No Tinc X Items', desc: "Si NO tens N items recollits." },
};
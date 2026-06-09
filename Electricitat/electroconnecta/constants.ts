import { Material } from './types';

export const MATERIALS: Material[] = [
  { id: 'm1', name: 'Fil de Coure', type: 'conductor', icon: '🪡' },
  { id: 'm2', name: 'Bloc de Fusta', type: 'aillant', icon: '🪵' },
  { id: 'm3', name: 'Aigua Salada', type: 'conductor', icon: '💧' },
  { id: 'm4', name: 'Goma d\'Esborrar', type: 'aillant', icon: '✏️' },
  { id: 'm5', name: 'Clau de Ferro', type: 'conductor', icon: '🗝️' },
  { id: 'm6', name: 'Plàstic', type: 'aillant', icon: '🥤' },
  { id: 'm7', name: 'Paper d\'Alumini', type: 'conductor', icon: '🌯' },
  { id: 'm8', name: 'Vidre', type: 'aillant', icon: '🪟' },
  { id: 'm9', name: 'Moneda d\'Or', type: 'conductor', icon: '💰' },
  { id: 'm10', name: 'Llana', type: 'aillant', icon: '🧶' },
];

export const AUDIO_FREQ = {
  BUZZER: 150, // Hz
  SUCCESS: 880, // Hz
};

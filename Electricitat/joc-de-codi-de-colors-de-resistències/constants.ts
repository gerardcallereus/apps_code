import type { ColorCode } from './types';

export const COLOR_CODES: ColorCode[] = [
  { name: 'Negre', value: 0, multiplier: 1, tolerance: null, colorClass: 'bg-black' },
  { name: 'Marró', value: 1, multiplier: 10, tolerance: 1, colorClass: 'bg-amber-800' },
  { name: 'Vermell', value: 2, multiplier: 100, tolerance: 2, colorClass: 'bg-red-600' },
  { name: 'Taronja', value: 3, multiplier: 1000, tolerance: null, colorClass: 'bg-orange-500' },
  { name: 'Groc', value: 4, multiplier: 10000, tolerance: null, colorClass: 'bg-yellow-400' },
  { name: 'Verd', value: 5, multiplier: 100000, tolerance: 0.5, colorClass: 'bg-green-600' },
  { name: 'Blau', value: 6, multiplier: 1000000, tolerance: 0.25, colorClass: 'bg-blue-600' },
  { name: 'Violeta', value: 7, multiplier: 10000000, tolerance: 0.1, colorClass: 'bg-violet-600' },
  { name: 'Gris', value: 8, multiplier: null, tolerance: 0.05, colorClass: 'bg-gray-500' },
  { name: 'Blanc', value: 9, multiplier: null, tolerance: null, colorClass: 'bg-white' },
  { name: 'Or', value: null, multiplier: 0.1, tolerance: 5, colorClass: 'bg-yellow-500' },
  { name: 'Plata', value: null, multiplier: 0.01, tolerance: 10, colorClass: 'bg-slate-400' },
];

export const DIGIT_BAND_COLORS = COLOR_CODES.filter(c => c.value !== null);
export const MULTIPLIER_BAND_COLORS = COLOR_CODES.filter(c => c.multiplier !== null);
export const TOLERANCE_BAND_COLORS = [
    COLOR_CODES.find(c => c.name === 'Marró')!,
    COLOR_CODES.find(c => c.name === 'Vermell')!,
    COLOR_CODES.find(c => c.name === 'Verd')!,
    COLOR_CODES.find(c => c.name === 'Blau')!,
    COLOR_CODES.find(c => c.name === 'Violeta')!,
    COLOR_CODES.find(c => c.name === 'Gris')!,
    COLOR_CODES.find(c => c.name === 'Or')!,
    COLOR_CODES.find(c => c.name === 'Plata')!,
];
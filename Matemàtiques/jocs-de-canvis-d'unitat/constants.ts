
import { Unit, UnitCategory } from './types';

export const UNITS: Record<UnitCategory, Unit[]> = {
  'Longitud': [
    { name: 'quilòmetre', symbol: 'km', factor: 1000 },
    { name: 'hectòmetre', symbol: 'hm', factor: 100 },
    { name: 'decàmetre', symbol: 'dam', factor: 10 },
    { name: 'metre', symbol: 'm', factor: 1 },
    { name: 'decímetre', symbol: 'dm', factor: 0.1 },
    { name: 'centímetre', symbol: 'cm', factor: 0.01 },
    { name: 'mil·límetre', symbol: 'mm', factor: 0.001 },
  ],
  'Massa': [
    { name: 'quilogram', symbol: 'kg', factor: 1000 },
    { name: 'hectogram', symbol: 'hg', factor: 100 },
    { name: 'decagram', symbol: 'dag', factor: 10 },
    { name: 'gram', symbol: 'g', factor: 1 },
    { name: 'decigram', symbol: 'dg', factor: 0.1 },
    { name: 'centigram', symbol: 'cg', factor: 0.01 },
    { name: 'mil·ligram', symbol: 'mg', factor: 0.001 },
  ],
};

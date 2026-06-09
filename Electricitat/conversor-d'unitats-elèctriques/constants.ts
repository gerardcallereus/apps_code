
import { Magnitude } from './types';

export const MAGNITUDES: Magnitude[] = [
  {
    name: 'Tensió',
    baseUnit: 'Volt (V)',
    units: [
      { symbol: 'MV', name: 'Megavolt', multiplier: 1e6 },
      { symbol: 'kV', name: 'Kilovolt', multiplier: 1e3 },
      { symbol: 'V', name: 'Volt', multiplier: 1 },
      { symbol: 'mV', name: 'Mil·livolt', multiplier: 1e-3 },
      { symbol: 'µV', name: 'Microvolt', multiplier: 1e-6 },
      { symbol: 'nV', name: 'Nanovolt', multiplier: 1e-9 },
    ],
  },
  {
    name: 'Corrent',
    baseUnit: 'Ampere (A)',
    units: [
      { symbol: 'kA', name: 'Kiloampere', multiplier: 1e3 },
      { symbol: 'A', name: 'Ampere', multiplier: 1 },
      { symbol: 'mA', name: 'Mil·liampere', multiplier: 1e-3 },
      { symbol: 'µA', name: 'Microampere', multiplier: 1e-6 },
      { symbol: 'nA', name: 'Nanoampere', multiplier: 1e-9 },
    ],
  },
  {
    name: 'Resistència',
    baseUnit: 'Ohm (Ω)',
    units: [
      { symbol: 'GΩ', name: 'Gigaohm', multiplier: 1e9 },
      { symbol: 'MΩ', name: 'Megaohm', multiplier: 1e6 },
      { symbol: 'kΩ', name: 'Kiloohm', multiplier: 1e3 },
      { symbol: 'Ω', name: 'Ohm', multiplier: 1 },
      { symbol: 'mΩ', name: 'Mil·liohm', multiplier: 1e-3 },
    ],
  },
  {
    name: 'Potència',
    baseUnit: 'Watt (W)',
    units: [
      { symbol: 'MW', name: 'Megawatt', multiplier: 1e6 },
      { symbol: 'kW', name: 'Kilowatt', multiplier: 1e3 },
      { symbol: 'W', name: 'Watt', multiplier: 1 },
      { symbol: 'mW', name: 'Mil·liwatt', multiplier: 1e-3 },
      { symbol: 'µW', name: 'Microwatt', multiplier: 1e-6 },
    ],
  },
];

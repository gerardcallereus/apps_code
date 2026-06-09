
export interface Unit {
  symbol: string;
  name: string;
  multiplier: number;
}

export interface Magnitude {
  name: string;
  baseUnit: string;
  units: Unit[];
}

export interface Problem {
  magnitude: Magnitude;
  value: number;
  fromUnit: Unit;
  toUnit: Unit;
  correctAnswer: number;
}

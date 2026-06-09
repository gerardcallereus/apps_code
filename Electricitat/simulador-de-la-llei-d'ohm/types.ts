
export enum Variable {
  Voltage = 'voltage',
  Current = 'current',
  Resistance = 'resistance',
}

export interface Exercise {
  id: number;
  voltage: number | null;
  current: number | null;
  resistance: number | null;
  solveFor: Variable;
}

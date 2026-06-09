export interface CostItem {
  id: string;
  name: string;
  value: number;
  isEditable?: boolean;
}

export interface CostCategory {
  id: string;
  title: string;
  description: string;
  items: CostItem[];
  totalLabel: string;
  color: string;
}

export const INITIAL_INFRASTRUCTURE: CostCategory = {
  id: 'infrastructure',
  title: 'TAULA 1: INFRAESTRUCTURA I MAQUINÀRIA',
  description: "Són les eines cares que no es gasten amb l'ús i que l'escola posa a la vostra disposició (Aportat pel Centre).",
  totalLabel: "TOTAL QUE T'ESTALVIES",
  color: "bg-blue-100 border-blue-200 text-blue-900",
  items: [
    { id: 'i1', name: 'Impressora 3D (Filament)', value: 400.00 },
    { id: 'i2', name: 'Talladora Làser', value: 2500.00 },
    { id: 'i3', name: 'Multieina rotatòria', value: 60.00 },
    { id: 'i4', name: "Joc d'Alicates de precisió", value: 15.00 },
    { id: 'i5', name: 'Ordinadors i Programari', value: 600.00 },
  ]
};

export const INITIAL_FIXED_COSTS: CostCategory = {
  id: 'fixed',
  title: 'TAULA 2: LA INVERSIÓ INICIAL (Costos Fixos)',
  description: "Són les coses que hem comprat per aquest projecte, però que podreu fer servir moltes vegades.",
  totalLabel: "TOTAL A RECUPERAR (EINES)",
  color: "bg-amber-100 border-amber-200 text-amber-900",
  items: [
    { id: 'f1', name: "Planxes DM de Fusta per a l'encofrat", value: 21.99, isEditable: false },
    { id: 'f2', name: "Silicona per al Motlle", value: 5.00, isEditable: false },
    { id: 'f3', name: "Filament PLA 1KG Negre", value: 14.99, isEditable: false },
  ]
};

export const INITIAL_VARIABLE_COSTS: CostCategory = {
  id: 'variable',
  title: 'TAULA 3: EL COST PER ARRACADA (Costos Variables)',
  description: "Aquí calculem els materials que desapareixen o es gasten cada vegada que fabriquem un parell d'arracades.",
  totalLabel: "TOTAL INVERSIÓ EN MATERIALS",
  color: "bg-emerald-100 border-emerald-200 text-emerald-900",
  items: [
    { id: 'v1', name: 'Resina Epoxi 800gr', value: 19.99, isEditable: false },
    { id: 'v2', name: 'Tints i Pigments', value: 16.99, isEditable: false },
    { id: 'v3', name: 'Ganxos', value: 2.29, isEditable: false },
    { id: 'v4', name: 'Volanderes', value: 0.99, isEditable: false },
    { id: 'v5', name: 'Gots de plàstic', value: 1.99, isEditable: false },
    { id: 'v6', name: 'Guants', value: 1.99, isEditable: false },
    { id: 'v7', name: 'Culleres de plàstic', value: 0.99, isEditable: false },
    { id: 'v8', name: 'Paquet de Cartolines (50 fulls)', value: 5.21, isEditable: false },
  ]
};

export enum CardType {
  DEFINITION = 'DEFINITION',
  EXAMPLE = 'EXAMPLE'
}

export interface PhaseData {
  id: number;
  title: string;
  subtitle: string;
  iconName: string; // Used to map to Lucide icons dynamically if needed, or just descriptive
  definition: string;
  example: string;
}

export interface DraggableItem {
  id: string;
  type: CardType;
  content: string;
  phaseId: number; // The correct phase matches this ID
}

export interface GameState {
  placedItems: {
    [key: string]: DraggableItem | null; // key format: "phaseId-type" e.g., "1-DEFINITION"
  };
  selectedItemId: string | null;
  isComplete: boolean;
  attempts: number;
}
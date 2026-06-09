export type VerdictType = 'GOOD' | 'BAD' | null;

export interface LocalBrand {
  id: string;
  name: string;
  logoUrl: string; // URL de la imatge del logo
  isGood: boolean; // El veredicte correcte
  
  // Llista d'adjectius disponibles per a aquesta ronda (barreja de correctes i incorrectes)
  availableTags: string[];
  
  // Els adjectius que l'expert considera correctes
  correctTags: string[];
  
  explanation: string; // Perquè és bona o dolenta
  tip: string; // Consell pràctic per a l'alumne
  category: string; // Ex: Tecnologia, Restauració, Moda...
}

export interface PlayerState {
  currentRound: number;
  score: number;
  history: {
    brandId: string;
    points: number;
    wasCorrectVerdict: boolean;
  }[];
}

export type GameState = 'intro' | 'playing' | 'feedback' | 'summary';
import React from 'react';

export interface CircuitElement {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode; // The SVG representation
}

export enum AppMode {
  REFERENCE = 'REFERENCE',
  QUIZ = 'QUIZ',
}

export interface QuizQuestion {
  targetElement: CircuitElement;
  options: CircuitElement[];
}

export interface AnalysisResult {
  elementId: string | null;
  confidence: number;
  explanation: string;
}
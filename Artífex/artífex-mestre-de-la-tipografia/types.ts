export enum AppStage {
  WELCOME = 'welcome',
  THEORY = 'theory',
  PRACTICE = 'practice',
  EXPERIMENT = 'experiment'
}

export enum FontCategory {
  SERIF = 'Serifa',
  SANS_SERIF = 'Pal Sec (Sans Serif)',
  SCRIPT = 'Manuscrita (Script)',
  DISPLAY = 'Decorativa (Display)'
}

export interface QuizQuestion {
  id: number;
  scenario: string;
  brandValues: string[];
  options: {
    fontCategory: FontCategory;
    fontFamily: string;
    label: string;
  }[];
  correctCategory: FontCategory;
  explanation: string;
}

export interface BrandAnalysis {
  name: string;
  target: string;
  vibe: string;
}

export interface AIAnalysisResult {
  suggestion: string;
  reasoning: string;
  recommendedFontCategory: string;
}
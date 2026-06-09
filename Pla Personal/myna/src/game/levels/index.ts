import { wheelConfig } from './wheel';
import { leverConfig } from './lever';
import { inclinedPlaneConfig } from './inclinedPlane';
import { pulleyConfig } from './pulley';

export type MachineType = 'wheel' | 'lever' | 'inclined_plane' | 'pulley' | 'wedge' | 'screw' | 'winch';

export interface LevelConfig {
    id: MachineType;
    name: string;
    desc: string;
    emoji: string;
    bg: string;
    texts: Record<string, string>;
    formulas?: Record<string, {
        equation: string;
        legend: { symbol: string; desc: string; }[];
    }>;
    quiz: {
        question: string;
        formula?: string;
        options: string[];
        correct: number;
        explanation: string;
    }[];
    history: {
        title: string;
        content: string;
        imageIcon: string;
    }[];
}

export const LEVELS: Record<string, LevelConfig> = {
    wheel: wheelConfig,
    lever: leverConfig,
    inclined_plane: inclinedPlaneConfig,
    pulley: pulleyConfig,
};

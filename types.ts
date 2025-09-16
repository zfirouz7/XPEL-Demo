
export interface Color {
  name: string;
  hex: string;
}

export type Environment = 'original' | 'studio' | 'timesSquare' | 'shibuyaCrossing';

export interface EnvironmentInfo {
    id: Environment;
    name: string;
    description: string;
}

// FIX: Add and export the missing AspectRatio type.
export type AspectRatio = '16:9' | '9:16';

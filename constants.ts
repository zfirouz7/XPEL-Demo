import type { Color, EnvironmentInfo } from './types';

export const COLORS: Color[] = [
  { name: 'Moss Green', hex: '#5e624c' },
  { name: 'Molten Orange', hex: '#b9541a' },
  { name: 'Yellow', hex: '#b5841d' },
  { name: 'Satin Thermal Seige', hex: '#8f897d' },
  { name: 'Bond Silver', hex: '#c7c7c7' },
  { name: 'South Beach Blue', hex: '#3485a3' },
  { name: 'Monza Red', hex: '#ff0000' },
  { name: 'Ultra Plum', hex: '#5b3e72' },
  { name: 'Satin Abyss Blue', hex: '#364056' },
  { name: 'Satin Battle Green', hex: '#565a54' },
  { name: 'Heritage Grey', hex: '#c8cdc8' },
  { name: 'Satin Tarmac', hex: '#545859' },
  { name: 'Obsidian Black', hex: '#000000' },
  { name: 'Satin Midnight Black', hex: '#181818' },
  { name: 'Grey Black', hex: '#2c2a29' },
  { name: 'Pearl White', hex: '#d1d0ca' },
];

export const ENVIRONMENTS: EnvironmentInfo[] = [
  { id: 'original', name: 'Original Background', description: 'Keep the uploaded background.' },
  { id: 'studio', name: 'Photo Studio', description: 'Place in a professional studio.' },
  { id: 'timesSquare', name: 'Times Square', description: 'Feature in NYC with matching ads.' },
  { id: 'shibuyaCrossing', name: 'Shibuya Crossing', description: 'Place in Tokyo with matching ads.' },
];
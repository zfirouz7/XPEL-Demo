import React from 'react';
import { Monitor, Smartphone } from 'lucide-react';
import type { AspectRatio } from '../types';

interface AspectRatioInfo {
    id: AspectRatio;
    name: string;
    description: string;
    icon: React.ReactNode;
}

const RATIOS: AspectRatioInfo[] = [
    { id: '16:9', name: 'Desktop', description: 'Widescreen (1920x1080)', icon: <Monitor size={24} className="mx-auto" /> },
    { id: '9:16', name: 'Mobile', description: 'Portrait (1080x1920)', icon: <Smartphone size={24} className="mx-auto" /> },
];

interface AspectRatioSelectorProps {
  onSelect: (ratio: AspectRatio) => void;
  selectedAspectRatio: AspectRatio;
  isDisabled: boolean;
}

export const AspectRatioSelector: React.FC<AspectRatioSelectorProps> = ({ onSelect, selectedAspectRatio, isDisabled }) => {
  return (
    <div className="bg-gray-800/50 p-4 rounded-xl shadow-lg w-full max-w-2xl">
      <p className="text-center text-gray-400 mb-4 font-medium">Choose an image size</p>
      <div className="grid grid-cols-2 gap-4">
        {RATIOS.map((ratio) => (
          <button
            key={ratio.id}
            onClick={() => onSelect(ratio.id)}
            disabled={isDisabled}
            className={`flex flex-col items-center justify-start text-center p-4 rounded-lg transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 h-32
                        ${selectedAspectRatio === ratio.id && !isDisabled
                          ? 'bg-blue-600 text-white ring-blue-500'
                          : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                        }
                        ${isDisabled ? 'cursor-not-allowed opacity-50' : ''}`}
            aria-label={`Select ${ratio.name} size`}
          >
            {ratio.icon}
            <span className="mt-2 font-semibold text-sm">{ratio.name}</span>
            <span className="text-xs text-gray-400 mt-1">{ratio.description}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

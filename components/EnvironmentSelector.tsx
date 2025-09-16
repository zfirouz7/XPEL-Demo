import React from 'react';
import { Image, Camera, Building2, Landmark } from 'lucide-react';
import type { Environment, EnvironmentInfo } from '../types';
import { ENVIRONMENTS } from '../constants';

interface EnvironmentSelectorProps {
  onSelect: (environment: Environment) => void;
  selectedEnvironment: Environment;
  isDisabled: boolean;
}

const ICONS: Record<Environment, React.ReactNode> = {
  original: <Image size={24} className="mx-auto" />,
  studio: <Camera size={24} className="mx-auto" />,
  timesSquare: <Building2 size={24} className="mx-auto" />,
  shibuyaCrossing: <Landmark size={24} className="mx-auto" />,
};

export const EnvironmentSelector: React.FC<EnvironmentSelectorProps> = ({ onSelect, selectedEnvironment, isDisabled }) => {
  return (
    <div className="bg-gray-100 p-4 rounded-xl shadow-lg w-full max-w-2xl">
      <p className="text-center text-gray-600 mb-4 font-medium">Choose an environment</p>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {ENVIRONMENTS.map((env: EnvironmentInfo) => (
          <button
            key={env.id}
            onClick={() => onSelect(env.id)}
            disabled={isDisabled}
            className={`flex flex-col items-center justify-start text-center p-4 rounded-lg transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 h-32
                        ${selectedEnvironment === env.id
                          ? 'bg-blue-600 text-white ring-blue-500'
                          : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                        }
                        ${isDisabled ? 'cursor-not-allowed opacity-50' : ''}`}
            aria-label={`Select ${env.name} environment`}
          >
            {ICONS[env.id]}
            <span className="mt-2 font-semibold text-sm">{env.name}</span>
            <span className="text-xs text-gray-500 mt-1">{env.description}</span>
          </button>
        ))}
      </div>
    </div>
  );
};
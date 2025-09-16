import React from 'react';
import type { Color } from '../types';

interface ColorPaletteProps {
  colors: Color[];
  selectedColor: Color;
  onColorSelect: (color: Color) => void;
  isDisabled: boolean;
}

export const ColorPalette: React.FC<ColorPaletteProps> = ({ 
  colors, 
  selectedColor, 
  onColorSelect,
  isDisabled
}) => {
  return (
    <div className="bg-gray-100 p-4 rounded-xl shadow-lg w-full max-w-2xl">
      <p className="text-center text-gray-600 mb-4 font-medium">Select a color to apply</p>
      <div className="flex justify-center items-center flex-wrap gap-4">
        {colors.map((color) => (
          <button
            key={color.hex}
            onClick={() => onColorSelect(color)}
            disabled={isDisabled}
            className={`w-12 h-12 rounded-full transition-transform duration-200 ease-in-out focus:outline-none
                        ${selectedColor.hex === color.hex ? 'ring-4 ring-offset-2 ring-offset-gray-100 ring-blue-500 scale-110' : 'ring-2 ring-transparent'}
                        ${isDisabled ? 'cursor-not-allowed opacity-50' : 'hover:scale-110'}`}
            style={{ backgroundColor: color.hex }}
            aria-label={`Select ${color.name} color`}
            title={color.name}
          />
        ))}
      </div>
    </div>
  );
};
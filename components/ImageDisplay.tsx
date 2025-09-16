import React from 'react';
import { RefreshCw } from 'lucide-react';

interface ImageDisplayProps {
  displayImage: string;
  isLoading: boolean;
  onReset: () => void;
  loadingMessage: string | null;
}

export const ImageDisplay: React.FC<ImageDisplayProps> = ({ 
  displayImage, 
  isLoading, 
  onReset,
  loadingMessage,
}) => {
  return (
    <div className="relative w-full max-w-2xl bg-black rounded-lg shadow-2xl overflow-hidden">
      <img
        src={displayImage}
        alt={'Car view'}
        className="object-contain w-full h-full"
      />
      {isLoading && (
        <div className="absolute inset-0 bg-black bg-opacity-70 flex flex-col items-center justify-center space-y-4 backdrop-blur-sm animate-pulse">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
          {loadingMessage && <p className="text-lg text-white font-medium">{loadingMessage}</p>}
          <p className="text-sm text-gray-400">This may take a moment.</p>
        </div>
      )}
      <button 
        onClick={onReset} 
        className="absolute top-4 right-4 bg-white/70 text-gray-800 p-2 rounded-full hover:bg-gray-200 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 backdrop-blur-sm"
        aria-label="Upload new image"
        title="Upload new image"
      >
        <RefreshCw size={20} />
      </button>
    </div>
  );
};
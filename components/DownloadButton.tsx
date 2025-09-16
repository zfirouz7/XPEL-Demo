import React from 'react';
import { Download } from 'lucide-react';

interface DownloadButtonProps {
  onDownload: () => void;
  isDisabled: boolean;
}

export const DownloadButton: React.FC<DownloadButtonProps> = ({ onDownload, isDisabled }) => {
  return (
    <div className="w-full max-w-2xl flex justify-center">
        <button
            onClick={onDownload}
            disabled={isDisabled}
            className="flex items-center justify-center gap-2 w-full sm:w-auto px-8 py-3 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white focus:ring-green-500 transition-all duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed disabled:opacity-70"
            aria-label="Download generated image"
            >
            <Download size={20} />
            <span>Download Image</span>
        </button>
    </div>
  );
};
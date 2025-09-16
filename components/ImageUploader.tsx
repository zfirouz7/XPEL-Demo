import React, { useCallback } from 'react';
import { UploadIcon } from './icons/UploadIcon';

interface ImageUploaderProps {
  onImageUpload: (file: File) => void;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageUpload }) => {
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onImageUpload(file);
    }
  };

  const onDragOver = useCallback((event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
  }, []);

  const onDrop = useCallback((event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    const file = event.dataTransfer.files?.[0];
    if (file) {
        onImageUpload(file);
    }
  }, [onImageUpload]);

  return (
    <div className="w-full max-w-xl flex flex-col items-center justify-center bg-gray-50 rounded-2xl p-8 shadow-lg">
      <label
        htmlFor="file-upload"
        onDragOver={onDragOver}
        onDrop={onDrop}
        className="relative flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors duration-300"
      >
        <div className="flex flex-col items-center justify-center pt-5 pb-6">
          <UploadIcon className="w-10 h-10 mb-4 text-gray-400" />
          <p className="mb-2 text-sm text-gray-500">
            <span className="font-semibold text-blue-400">Click to upload</span> or drag and drop
          </p>
          <p className="text-xs text-gray-400">PNG, JPG, or WEBP</p>
        </div>
        <input
          id="file-upload"
          type="file"
          className="hidden"
          accept="image/png, image/jpeg, image/webp"
          onChange={handleFileChange}
        />
      </label>
    </div>
  );
};
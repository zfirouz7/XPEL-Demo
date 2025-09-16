
import React, { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { ImageUploader } from './components/ImageUploader';
import { ImageDisplay } from './components/ImageDisplay';
import { ColorPalette } from './components/ColorPalette';
import { EnvironmentSelector } from './components/EnvironmentSelector';
import { DownloadButton } from './components/DownloadButton';
import { changeCarColor, changeCarEnvironment } from './services/geminiService';
import { applyWatermark } from './services/imageUtils';
import { COLORS, ENVIRONMENTS } from './constants';
import type { Color, Environment } from './types';

const App: React.FC = () => {
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [originalMimeType, setOriginalMimeType] = useState<string | null>(null);
  const [colorChangedImage, setColorChangedImage] = useState<string | null>(null);
  const [finalImage, setFinalImage] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<Color>(COLORS[0]);
  const [selectedEnvironment, setSelectedEnvironment] = useState<Environment>('original');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadingMessage, setLoadingMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleImageUpload = (file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      const mimeType = result.substring(5, result.indexOf(';'));
      setOriginalImage(result);
      setOriginalMimeType(mimeType);
      setColorChangedImage(null);
      setFinalImage(null);
      setError(null);
      setSelectedEnvironment('original');
    };
    reader.onerror = () => {
      setError("Failed to read the image file.");
    };
    reader.readAsDataURL(file);
  };

  const handleColorSelect = useCallback(async (color: Color) => {
    if (!originalImage || !originalMimeType || isLoading) return;

    setSelectedColor(color);
    setIsLoading(true);
    setLoadingMessage(`Changing color to ${color.name}...`);
    setError(null);
    setFinalImage(originalImage); // Show original while processing
    setSelectedEnvironment('original');

    try {
      const base64Data = originalImage.split(',')[1];
      const newImageBase64 = await changeCarColor(base64Data, originalMimeType, color.name);
      
      if (newImageBase64) {
        const fullImageSrc = `data:${originalMimeType};base64,${newImageBase64}`;
        setColorChangedImage(fullImageSrc); // Store non-watermarked image
        const watermarkedImage = await applyWatermark(fullImageSrc);
        setFinalImage(watermarkedImage); // Display watermarked image
      } else {
        setError("The AI could not process the image for color change. Please try another one.");
        setColorChangedImage(null);
        setFinalImage(originalImage);
      }
    } catch (e) {
      console.error(e);
      setError(e instanceof Error ? e.message : "An unknown error occurred.");
      setColorChangedImage(null);
      setFinalImage(originalImage);
    } finally {
      setIsLoading(false);
      setLoadingMessage(null);
    }
  }, [originalImage, originalMimeType, isLoading]);

  const generateEnvironmentImage = useCallback(async (environment: Environment) => {
    if (!colorChangedImage) return;

    if (environment === 'original') {
        const watermarkedImage = await applyWatermark(colorChangedImage);
        setFinalImage(watermarkedImage);
        return;
    }

    setIsLoading(true);
    setError(null);
    const envName = ENVIRONMENTS.find(e => e.id === environment)?.name || 'a new location';
    setLoadingMessage(`Generating scene in ${envName}...`);

    try {
        const mimeType = colorChangedImage.substring(5, colorChangedImage.indexOf(';'));
        const base64Data = colorChangedImage.split(',')[1];
        
        const newImageBase64 = await changeCarEnvironment(base64Data, mimeType, selectedColor.name, environment as Exclude<Environment, 'original'>);
        
        if (newImageBase64) {
            // Assume the output format is compatible; use original mime for the data URL
            const fullImageSrc = `data:${mimeType};base64,${newImageBase64}`;
            const watermarkedImage = await applyWatermark(fullImageSrc);
            setFinalImage(watermarkedImage);
        } else {
            setError("The AI could not change the environment. Please try again.");
            const watermarkedImage = await applyWatermark(colorChangedImage);
            setFinalImage(watermarkedImage);
        }
    } catch(e) {
        console.error(e);
        setError(e instanceof Error ? e.message : "An unknown error occurred.");
        const watermarkedImage = await applyWatermark(colorChangedImage);
        setFinalImage(watermarkedImage);
    } finally {
        setIsLoading(false);
        setLoadingMessage(null);
    }
  }, [colorChangedImage, selectedColor.name]);

  const handleEnvironmentSelect = useCallback(async (environment: Environment) => {
    if (isLoading || !colorChangedImage) return;
    
    setSelectedEnvironment(environment);
    await generateEnvironmentImage(environment);

  }, [isLoading, colorChangedImage, generateEnvironmentImage]);
  
  const handleDownload = () => {
    if (!finalImage) return;

    const link = document.createElement('a');
    link.href = finalImage;
    link.download = 'xpel-custom-car.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleReset = () => {
    setOriginalImage(null);
    setOriginalMimeType(null);
    setColorChangedImage(null);
    setFinalImage(null);
    setError(null);
    setIsLoading(false);
    setLoadingMessage(null);
    setSelectedEnvironment('original');
  };

  return (
    <div className="min-h-screen bg-white text-gray-900 flex flex-col items-center p-4 sm:p-6 lg:p-8 font-sans">
      <Header />
      <main className="flex-grow container mx-auto w-full max-w-4xl flex flex-col items-center mt-12">
        {!originalImage ? (
          <ImageUploader onImageUpload={handleImageUpload} />
        ) : (
          <div className="w-full flex flex-col items-center space-y-6">
            <ImageDisplay 
              displayImage={finalImage || originalImage}
              isLoading={isLoading}
              onReset={handleReset}
              loadingMessage={loadingMessage}
            />
             {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative w-full text-center">
                <strong className="font-bold">Error:</strong>
                <span className="block sm:inline ml-2">{error}</span>
              </div>
            )}
            <ColorPalette
              colors={COLORS}
              selectedColor={selectedColor}
              onColorSelect={handleColorSelect}
              isDisabled={isLoading}
            />
            {colorChangedImage && !error && (
              <>
                <EnvironmentSelector
                  onSelect={handleEnvironmentSelect}
                  selectedEnvironment={selectedEnvironment}
                  isDisabled={isLoading}
                />
                <DownloadButton
                  onDownload={handleDownload}
                  isDisabled={isLoading || !finalImage}
                />
              </>
            )}
          </div>
        )}
      </main>
      <footer className="w-full text-center text-gray-600 p-4 mt-8">
        <p>Powered by Gemini. Built for illustrative purposes.</p>
      </footer>
    </div>
  );
};

export default App;
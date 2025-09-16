const WATERMARK_SVG_DATA_URL = 'data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%201200%201200%22%3E%3Cdefs%3E%3Cstyle%3E.st0%20%7B%20fill%3A%20rgba(255%2C%20255%2C%20255%2C%200.8)%3B%20%7D%3C%2Fstyle%3E%3C%2Fdefs%3E%3Cpath%20class%3D%22st0%22%20d%3D%22M243.22%2C538.01c19.6%2C0%2C35.49-15.89%2C35.49-35.49s-15.89-35.49-35.49-35.49-35.49%2C15.89-35.49%2C35.49%2C15.89%2C35.49%2C35.49%2C35.49%22%2F%3E%3Cpath%20class%3D%22st0%22%20d%3D%22M164.64%2C476.5c-14.37%2C0-26.02%2C11.65-26.02%2C26.02s11.65%2C26.02%2C26.02%2C26.02%2C26.02-11.65%2C26.02-26.02-11.65-26.02-26.02-26.02%22%2F%3E%3Cpath%20class%3D%22st0%22%20d%3D%22M101.66%2C482.65c-10.97%2C0-19.87%2C8.9-19.87%2C19.87s8.9%2C19.87%2C19.87%2C19.87%2C19.87-8.9%2C19.87-19.87-8.9-19.87-19.87-19.87%22%2F%3E%3Cpolygon%20class%3D%22st0%22%20points%3D%22999.28%20590.42%201034.35%20439.01%20952.35%20439.01%20904.46%20646.34%201087.41%20646.34%201100.19%20590.42%20999.28%20590.42%22%2F%3E%3Cpath%20class%3D%22st0%22%20d%3D%22M899.98%2C563.71l9.86-42.69h-127.1l6.27-27.17h127.12l12.69-54.83h-209.36l-16.18%2C70.07c.66-4.93.79-10.17.75-15.24-.07-16.13-11.13-33.55-29.27-44.48-12.4-7.49-28.57-10.35-45.39-10.35h-133.2l52.85-53.69h-107.47l-56.84%2C59.04-35.27-59.04h-107.09l77.75%2C126.12-129.89%2C134.9h101.91l68.34-69.44%2C42.82%2C69.44h122.15l16.35-69.87h74.77c31.03%2C0%2C53.8-11.51%2C64.86-22.06%2C9.53-9.08%2C14.91-19.42%2C18.35-29.96l-28.14%2C121.89h209.29l12.92-55.92h-127.08l6.16-26.72h127.1ZM628.65%2C521.02h-155.36l-11.97%2C51.58-36.5-61.1%2C66.31-67.37-11.54%2C49.71h149.05c7.51%2C0%2C13.6%2C6.07%2C13.6%2C13.6s-6.09%2C13.58-13.6%2C13.58%22%2F%3E%3C%2Fsvg%3E';

export const applyWatermark = (baseImageSrc: string): Promise<string> => {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      console.warn('Canvas not supported, returning original image.');
      return resolve(baseImageSrc);
    }

    const baseImage = new Image();
    baseImage.crossOrigin = 'anonymous';
    const watermarkImage = new Image();
    watermarkImage.crossOrigin = 'anonymous';

    let baseImageLoaded = false;
    let watermarkImageLoaded = false;

    const tryComposite = () => {
      if (!baseImageLoaded || !watermarkImageLoaded) return;
      
      try {
        // Set canvas dimensions
        canvas.width = baseImage.naturalWidth;
        canvas.height = baseImage.naturalHeight;

        // Draw the base image
        ctx.drawImage(baseImage, 0, 0);

        // --- Watermark positioning and scaling ---
        const isLandscape = baseImage.naturalWidth > baseImage.naturalHeight;
        // Use the smaller of the two dimensions for padding calculation to ensure consistency
        const padding = Math.min(canvas.width, canvas.height) * 0.03; // 3% padding from edges
        const watermarkAspectRatio = watermarkImage.naturalWidth / watermarkImage.naturalHeight;
        
        // Size the watermark based on image height. For landscape images, make it 50% larger.
        const baseHeightPercent = 0.115;
        const landscapeMultiplier = 3.5;
        let watermarkHeight = canvas.height * (isLandscape ? baseHeightPercent * landscapeMultiplier : baseHeightPercent);
        let watermarkWidth = watermarkHeight * watermarkAspectRatio;
        
        // The visible content of the watermark SVG has internal padding.
        // These ratios identify the bounding box of the actual logo inside the SVG's viewBox.
        const watermarkContentRightRatio = 1100.19 / 1200; // max x-coord in SVG / viewBox width
        const watermarkContentBottomRatio = 646.34 / 1200; // max y-coord in SVG / viewBox height
        
        // Calculate position to align the visible logo's edges with the padding, not the SVG's edges.
        const x = canvas.width - (watermarkWidth * watermarkContentRightRatio) - padding;
        const y = canvas.height - (watermarkHeight * watermarkContentBottomRatio) - padding;

        // Add a subtle shadow for better readability
        ctx.shadowColor = 'rgba(0, 0, 0, 0.6)';
        ctx.shadowBlur = 10;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 4;

        // Draw the watermark image
        ctx.drawImage(watermarkImage, x, y, watermarkWidth, watermarkHeight);
        
        // Resolve with the new watermarked data URL
        resolve(canvas.toDataURL('image/png'));
      } catch (e) {
        console.error("Error during canvas compositing:", e);
        resolve(baseImageSrc); // Fallback on compositing error
      }
    };

    baseImage.onload = () => {
      baseImageLoaded = true;
      tryComposite();
    };
    baseImage.onerror = () => {
      console.error('Failed to load base image for watermarking.');
      resolve(baseImageSrc); // Fallback
    };

    watermarkImage.onload = () => {
      watermarkImageLoaded = true;
      tryComposite();
    };
    watermarkImage.onerror = () => {
      console.error('Failed to load watermark image.');
      resolve(baseImageSrc); // Fallback
    };
    
    baseImage.src = baseImageSrc;
    watermarkImage.src = WATERMARK_SVG_DATA_URL;
  });
};
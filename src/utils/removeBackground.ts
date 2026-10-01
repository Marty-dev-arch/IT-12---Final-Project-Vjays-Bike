/**
 * Intelligent Client-Side Background Removal Utility
 * Uses HTML5 Canvas to sample background color profile, isolate foreground subjects,
 * and feather edges into a clean transparent PNG.
 */

export interface BgRemovalOptions {
  tolerance?: number; // 10 - 100 (default: 48)
  feather?: number; // feather edge in px (default: 3)
  backgroundColor?: 'transparent' | 'white' | 'dark'; // output background
}

export async function removeImageBackground(
  imageSource: string,
  options: BgRemovalOptions = {}
): Promise<string> {
  const { tolerance = 48, backgroundColor = 'transparent' } = options;

  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';

    img.onload = () => {
      try {
        const width = img.naturalWidth || img.width;
        const height = img.naturalHeight || img.height;

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d', { willReadFrequently: true });

        if (!ctx) {
          reject(new Error('Could not get canvas context'));
          return;
        }

        ctx.drawImage(img, 0, 0);
        const imgData = ctx.getImageData(0, 0, width, height);
        const data = imgData.data;

        // Sample perimeter and corners for background color signatures
        const sampleCoords: [number, number][] = [
          [4, 4],
          [width - 5, 4],
          [4, height - 5],
          [width - 5, height - 5],
          [Math.floor(width / 2), 4],
          [Math.floor(width / 2), height - 5],
          [4, Math.floor(height / 2)],
          [width - 5, Math.floor(height / 2)],
          [Math.floor(width * 0.25), 4],
          [Math.floor(width * 0.75), 4],
          [Math.floor(width * 0.25), height - 5],
          [Math.floor(width * 0.75), height - 5],
        ];

        const bgSamples: { r: number; g: number; b: number }[] = [];
        sampleCoords.forEach(([x, y]) => {
          const idx = (y * width + x) * 4;
          bgSamples.push({
            r: data[idx],
            g: data[idx + 1],
            b: data[idx + 2],
          });
        });

        // Calculate average background RGB
        const avgR = bgSamples.reduce((sum, s) => sum + s.r, 0) / bgSamples.length;
        const avgG = bgSamples.reduce((sum, s) => sum + s.g, 0) / bgSamples.length;
        const avgB = bgSamples.reduce((sum, s) => sum + s.b, 0) / bgSamples.length;

        // Detect if background is wood/warm table texture
        const isWoodLike = avgR > avgG + 10 && avgG > avgB + 8 && avgR > 60;

        for (let i = 0; i < data.length; i += 4) {
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];

          // Check distance to closest background sample
          let minDist = 999999;
          for (let s = 0; s < bgSamples.length; s++) {
            const sample = bgSamples[s];
            const dr = r - sample.r;
            const dg = g - sample.g;
            const db = b - sample.b;
            const dist = Math.sqrt(dr * dr * 0.3 + dg * dg * 0.59 + db * db * 0.11);
            if (dist < minDist) minDist = dist;
          }

          // Wood chroma heuristic (warm brown table)
          const woodMatch =
            isWoodLike &&
            r > g + 10 &&
            g > b + 8 &&
            r > 50 &&
            r < 235 &&
            b < 150 &&
            Math.abs(r - avgR) < 65 &&
            Math.abs(g - avgG) < 55;

          const tolLow = tolerance * 0.7;
          const tolHigh = tolerance * 1.25;

          if (woodMatch || minDist < tolLow) {
            // Full background transparency
            data[i + 3] = 0;
          } else if (minDist < tolHigh) {
            // Feathered soft edge
            const alphaRatio = (minDist - tolLow) / (tolHigh - tolLow);
            data[i + 3] = Math.round(alphaRatio * 255);
          }
        }

        ctx.putImageData(imgData, 0, 0);

        // If user requested solid white or dark studio background instead of transparent
        if (backgroundColor !== 'transparent') {
          const finalCanvas = document.createElement('canvas');
          finalCanvas.width = width;
          finalCanvas.height = height;
          const fCtx = finalCanvas.getContext('2d');
          if (fCtx) {
            fCtx.fillStyle = backgroundColor === 'white' ? '#FFFFFF' : '#121212';
            fCtx.fillRect(0, 0, width, height);
            fCtx.drawImage(canvas, 0, 0);
            resolve(finalCanvas.toDataURL('image/png'));
            return;
          }
        }

        resolve(canvas.toDataURL('image/png'));
      } catch (err) {
        reject(err);
      }
    };

    img.onerror = (err) => {
      reject(err);
    };

    img.src = imageSource;
  });
}

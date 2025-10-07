// Web Worker for processing image pixel data
// This runs in a separate thread to keep the UI responsive

interface PixelData {
  x: number;
  y: number;
  r: number;
  g: number;
  b: number;
  hex: string;
}

interface WorkerMessage {
  imageData: ImageData;
}

// Helper function to convert RGB to HEX
function rgbToHex(r: number, g: number, b: number): string {
  return "#" + [r, g, b]
    .map((x) => {
      const hex = x.toString(16);
      return hex.length === 1 ? "0" + hex : hex;
    })
    .join("");
}

// Listen for messages from main thread
self.onmessage = (e: MessageEvent<WorkerMessage>) => {
  const { imageData } = e.data;
  
  if (!imageData) {
    self.postMessage([]);
    return;
  }

  const { width, height, data } = imageData;
  const pixelArray: PixelData[] = [];

  // Process each pixel
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      // Calculate index in the data array
      // Each pixel has 4 values: R, G, B, A
      const index = (y * width + x) * 4;

      const r = data[index];
      const g = data[index + 1];
      const b = data[index + 2];
      // const a = data[index + 3]; // Alpha channel, not used in this case

      const hex = rgbToHex(r, g, b);

      pixelArray.push({
        x,
        y,
        r,
        g,
        b,
        hex,
      });
    }

    // Send progress updates for large images (every 10%)
    if (y % Math.floor(height / 10) === 0 && y > 0) {
      const progress = Math.round((y / height) * 100);
      // Could send progress updates if needed
      // self.postMessage({ type: 'progress', progress });
    }
  }

  // Send the complete data back to main thread
  self.postMessage(pixelArray);
};

// Export empty object for TypeScript module compatibility
export {};

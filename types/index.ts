// Type definitions for the application

export interface PixelData {
  x: number;
  y: number;
  r: number;
  g: number;
  b: number;
  hex: string;
}

export interface TooltipData extends PixelData {
  visible: boolean;
  clientX: number;
  clientY: number;
}

export interface ImageDimensions {
  width: number;
  height: number;
}

export interface WorkerMessage {
  imageData: ImageData;
}

export interface WorkerResponse {
  type?: 'progress' | 'complete';
  progress?: number;
  data?: PixelData[];
}

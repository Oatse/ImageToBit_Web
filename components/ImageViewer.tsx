"use client";

import { useRef, useEffect, MouseEvent, useState } from "react";
import { TooltipData } from "@/app/page";

interface ImageViewerProps {
  imageUrl: string;
  onImageClick: (imageData: ImageData) => void;
  onPixelHover: (data: TooltipData) => void;
  onImageLoad: (width: number, height: number) => void;
  isProcessing: boolean;
}

export default function ImageViewer({
  imageUrl,
  onImageClick,
  onPixelHover,
  onImageLoad,
  isProcessing,
}: ImageViewerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageDimensions, setImageDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !imageUrl) return;

    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return;

    const img = new Image();
    img.onload = () => {
      // Set canvas size to match image
      canvas.width = img.width;
      canvas.height = img.height;
      
      // Draw image
      ctx.drawImage(img, 0, 0);
      
      setImageDimensions({ width: img.width, height: img.height });
      setImageLoaded(true);
      onImageLoad(img.width, img.height);
    };

    img.onerror = () => {
      alert("Gagal memuat gambar. Silakan coba lagi.");
      setImageLoaded(false);
    };

    img.src = imageUrl;

    return () => {
      setImageLoaded(false);
    };
  }, [imageUrl, onImageLoad]);

  const getPixelColor = (x: number, y: number): { r: number; g: number; b: number } | null => {
    const canvas = canvasRef.current;
    if (!canvas) return null;

    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return null;

    const imageData = ctx.getImageData(x, y, 1, 1);
    const data = imageData.data;

    return {
      r: data[0],
      g: data[1],
      b: data[2],
    };
  };

  const rgbToHex = (r: number, g: number, b: number): string => {
    return "#" + [r, g, b].map((x) => {
      const hex = x.toString(16);
      return hex.length === 1 ? "0" + hex : hex;
    }).join("");
  };

  const handleMouseMove = (e: MouseEvent<HTMLCanvasElement>) => {
    if (!imageLoaded) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    const x = Math.floor((e.clientX - rect.left) * scaleX);
    const y = Math.floor((e.clientY - rect.top) * scaleY);

    // Check bounds
    if (x < 0 || x >= canvas.width || y < 0 || y >= canvas.height) {
      onPixelHover({
        x: 0,
        y: 0,
        r: 0,
        g: 0,
        b: 0,
        hex: "#000000",
        visible: false,
        clientX: e.clientX,
        clientY: e.clientY,
      });
      return;
    }

    const color = getPixelColor(x, y);
    if (!color) return;

    const hex = rgbToHex(color.r, color.g, color.b);

    onPixelHover({
      x,
      y,
      r: color.r,
      g: color.g,
      b: color.b,
      hex,
      visible: true,
      clientX: e.clientX,
      clientY: e.clientY,
    });
  };

  const handleMouseLeave = () => {
    onPixelHover({
      x: 0,
      y: 0,
      r: 0,
      g: 0,
      b: 0,
      hex: "#000000",
      visible: false,
      clientX: 0,
      clientY: 0,
    });
  };

  const handleClick = () => {
    if (!imageLoaded || isProcessing) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return;

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    onImageClick(imageData);
  };

  return (
    <div ref={containerRef} className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <div className="mb-4">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Preview Gambar
        </h2>
        {imageLoaded && (
          <p className="text-gray-600 dark:text-gray-400">
            Dimensi: {imageDimensions.width} × {imageDimensions.height} piksel
          </p>
        )}
      </div>

      <div className="relative overflow-auto max-h-[600px] border-2 border-gray-200 dark:border-gray-700 rounded-lg">
        <canvas
          ref={canvasRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          onClick={handleClick}
          className={`max-w-full h-auto ${
            isProcessing ? "cursor-wait opacity-50" : "cursor-crosshair"
          }`}
        />
        
        {isProcessing && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-xl">
              <div className="flex items-center gap-3">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <p className="text-lg font-semibold text-gray-900 dark:text-white">
                  Memproses gambar...
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900 dark:bg-opacity-20 rounded-lg">
        <p className="text-sm text-blue-900 dark:text-blue-300">
          <strong>Tips:</strong> Hover mouse untuk melihat info piksel, klik untuk menampilkan tabel data
        </p>
      </div>
    </div>
  );
}

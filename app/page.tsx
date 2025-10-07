"use client";

import { useState, useRef } from "react";
import ImageUploader from "@/components/ImageUploader";
import ImageViewer from "@/components/ImageViewer";
import PixelTooltip from "@/components/PixelTooltip";
import RgbTable from "@/components/RgbTable";
import ImageStats from "@/components/ImageStats";

export interface PixelData {
  x: number;
  y: number;
  r: number;
  g: number;
  b: number;
  hex: string;
}

export interface TooltipData {
  x: number;
  y: number;
  r: number;
  g: number;
  b: number;
  hex: string;
  visible: boolean;
  clientX: number;
  clientY: number;
}

export default function Home() {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string>("");
  const [imageDimensions, setImageDimensions] = useState<{ width: number; height: number } | null>(null);
  const [pixelData, setPixelData] = useState<PixelData[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [tooltipData, setTooltipData] = useState<TooltipData>({
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
  const [showTable, setShowTable] = useState(false);
  const workerRef = useRef<Worker | null>(null);

  const handleFileSelect = (file: File) => {
    // Reset state
    setImageFile(file);
    setPixelData([]);
    setShowTable(false);
    setTooltipData((prev) => ({ ...prev, visible: false }));

    // Create object URL for image display
    if (imageUrl) {
      URL.revokeObjectURL(imageUrl);
    }
    const url = URL.createObjectURL(file);
    setImageUrl(url);
  };

  const handleImageLoad = (width: number, height: number) => {
    setImageDimensions({ width, height });
  };

  const handleImageClick = (imageData: ImageData) => {
    setIsProcessing(true);
    setShowTable(false);

    // Initialize Web Worker if not already done
    if (!workerRef.current) {
      workerRef.current = new Worker(new URL("../workers/pixelProcessor.ts", import.meta.url));
      
      workerRef.current.onmessage = (e: MessageEvent<PixelData[]>) => {
        setPixelData(e.data);
        setIsProcessing(false);
        setShowTable(true);
      };

      workerRef.current.onerror = (error) => {
        console.error("Worker error:", error);
        setIsProcessing(false);
        alert("Terjadi kesalahan saat memproses gambar. Silakan coba lagi.");
      };
    }

    // Send image data to worker
    workerRef.current.postMessage({ imageData });
  };

  const handlePixelHover = (data: TooltipData) => {
    setTooltipData(data);
  };

  const handleExportCSV = () => {
    if (pixelData.length === 0) return;

    // Create CSV content
    const headers = ["X", "Y", "R", "G", "B", "HEX"];
    const csvContent = [
      headers.join(","),
      ...pixelData.map((pixel) => 
        `${pixel.x},${pixel.y},${pixel.r},${pixel.g},${pixel.b},${pixel.hex}`
      ),
    ].join("\n");

    // Create blob and download
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    
    link.setAttribute("href", url);
    link.setAttribute("download", `rgb_matrix_${Date.now()}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Cleanup on unmount
  useState(() => {
    return () => {
      if (workerRef.current) {
        workerRef.current.terminate();
      }
      if (imageUrl) {
        URL.revokeObjectURL(imageUrl);
      }
    };
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-2">
            Image to RGB Matrix Converter
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            Analisis gambar dan lihat data piksel dalam format tabel matriks RGB
          </p>
        </header>

        {/* Image Uploader */}
        <div className="mb-8">
          <ImageUploader onFileSelect={handleFileSelect} />
        </div>

        {/* Image Viewer */}
        {imageUrl && (
          <div className="mb-8">
            <ImageViewer
              imageUrl={imageUrl}
              onImageClick={handleImageClick}
              onPixelHover={handlePixelHover}
              onImageLoad={handleImageLoad}
              isProcessing={isProcessing}
            />
          </div>
        )}

        {/* Pixel Tooltip */}
        <PixelTooltip data={tooltipData} />

        {/* Image Statistics */}
        {showTable && pixelData.length > 0 && imageDimensions && (
          <ImageStats 
            data={pixelData} 
            imageWidth={imageDimensions.width}
            imageHeight={imageDimensions.height}
          />
        )}

        {/* RGB Table */}
        {showTable && pixelData.length > 0 && imageDimensions && (
          <div className="mt-8">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Data Matriks RGB
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400">
                    Total Piksel: {pixelData.length.toLocaleString()} | Dimensi: {imageDimensions.width} × {imageDimensions.height}
                  </p>
                </div>
                <button
                  onClick={handleExportCSV}
                  className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg shadow-md transition-colors duration-200 flex items-center gap-2"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  Export CSV
                </button>
              </div>
              <RgbTable data={pixelData} imageWidth={imageDimensions.width} />
            </div>
          </div>
        )}

        {/* Info Section */}
        {!imageUrl && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 mt-8">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              Cara Menggunakan:
            </h3>
            <ol className="list-decimal list-inside space-y-2 text-gray-700 dark:text-gray-300">
              <li>Unggah gambar (JPG, PNG) menggunakan tombol di atas</li>
              <li>Hover mouse di atas gambar untuk melihat info piksel real-time</li>
              <li>Klik gambar untuk memproses dan menampilkan tabel matriks RGB</li>
              <li>Gunakan fitur pencarian untuk melompat ke koordinat tertentu</li>
              <li>Ekspor data ke CSV untuk analisis lebih lanjut</li>
            </ol>
          </div>
        )}
      </div>
    </div>
  );
}

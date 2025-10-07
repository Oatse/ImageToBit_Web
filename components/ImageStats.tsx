"use client";

import { useMemo } from "react";
import { PixelData } from "@/app/page";

interface ImageStatsProps {
  data: PixelData[];
  imageWidth: number;
  imageHeight: number;
}

export default function ImageStats({ data, imageWidth, imageHeight }: ImageStatsProps) {
  const stats = useMemo(() => {
    if (data.length === 0) {
      return {
        totalPixels: 0,
        avgRed: 0,
        avgGreen: 0,
        avgBlue: 0,
        brightestPixel: null as PixelData | null,
        darkestPixel: null as PixelData | null,
      };
    }

    let sumR = 0, sumG = 0, sumB = 0;
    let maxBrightness = -1;
    let minBrightness = 256;
    let brightestPixel = data[0];
    let darkestPixel = data[0];

    data.forEach((pixel) => {
      sumR += pixel.r;
      sumG += pixel.g;
      sumB += pixel.b;

      const brightness = (pixel.r * 299 + pixel.g * 587 + pixel.b * 114) / 1000;
      
      if (brightness > maxBrightness) {
        maxBrightness = brightness;
        brightestPixel = pixel;
      }
      
      if (brightness < minBrightness) {
        minBrightness = brightness;
        darkestPixel = pixel;
      }
    });

    return {
      totalPixels: data.length,
      avgRed: Math.round(sumR / data.length),
      avgGreen: Math.round(sumG / data.length),
      avgBlue: Math.round(sumB / data.length),
      brightestPixel,
      darkestPixel,
    };
  }, [data]);

  if (data.length === 0) return null;

  const avgHex = `#${[stats.avgRed, stats.avgGreen, stats.avgBlue]
    .map(x => x.toString(16).padStart(2, '0'))
    .join('')}`;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-6">
      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
        Statistik Gambar
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Dimensi */}
        <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Dimensi</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {imageWidth} × {imageHeight}
          </p>
        </div>

        {/* Total Piksel */}
        <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Piksel</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {stats.totalPixels.toLocaleString()}
          </p>
        </div>

        {/* Rata-rata Warna */}
        <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Rata-rata Warna</p>
          <div className="flex items-center gap-3">
            <div
              className="w-12 h-12 rounded-lg border-2 border-gray-300 dark:border-gray-600 shadow-md"
              style={{ backgroundColor: avgHex }}
            />
            <div className="text-sm">
              <p className="font-mono font-bold text-gray-900 dark:text-white">{avgHex}</p>
              <p className="text-gray-600 dark:text-gray-400">
                R:{stats.avgRed} G:{stats.avgGreen} B:{stats.avgBlue}
              </p>
            </div>
          </div>
        </div>

        {/* Piksel Paling Terang */}
        {stats.brightestPixel && (
          <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Piksel Paling Terang</p>
            <div className="flex items-center gap-3">
              <div
                className="w-12 h-12 rounded-lg border-2 border-gray-300 dark:border-gray-600 shadow-md"
                style={{ backgroundColor: stats.brightestPixel.hex }}
              />
              <div className="text-xs">
                <p className="font-mono font-bold text-gray-900 dark:text-white">
                  {stats.brightestPixel.hex}
                </p>
                <p className="text-gray-600 dark:text-gray-400">
                  ({stats.brightestPixel.x}, {stats.brightestPixel.y})
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Piksel Paling Gelap */}
        {stats.darkestPixel && (
          <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Piksel Paling Gelap</p>
            <div className="flex items-center gap-3">
              <div
                className="w-12 h-12 rounded-lg border-2 border-gray-300 dark:border-gray-600 shadow-md"
                style={{ backgroundColor: stats.darkestPixel.hex }}
              />
              <div className="text-xs">
                <p className="font-mono font-bold text-gray-900 dark:text-white">
                  {stats.darkestPixel.hex}
                </p>
                <p className="text-gray-600 dark:text-gray-400">
                  ({stats.darkestPixel.x}, {stats.darkestPixel.y})
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

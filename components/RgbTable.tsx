"use client";

import { useRef, useState, useEffect } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import { PixelData } from "@/app/page";

interface RgbTableProps {
  data: PixelData[];
  imageWidth: number;
}

export default function RgbTable({ data, imageWidth }: RgbTableProps) {
  const parentRef = useRef<HTMLDivElement>(null);
  const [searchX, setSearchX] = useState("");
  const [searchY, setSearchY] = useState("");

  const rowVirtualizer = useVirtualizer({
    count: data.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 45,
    overscan: 10,
  });

  const handleSearch = () => {
    const x = parseInt(searchX);
    const y = parseInt(searchY);

    if (isNaN(x) || isNaN(y)) {
      alert("Mohon masukkan koordinat yang valid");
      return;
    }

    // Calculate index from coordinates
    // Formula: index = y * imageWidth + x
    const index = y * imageWidth + x;

    if (index < 0 || index >= data.length) {
      alert("Koordinat di luar jangkauan gambar");
      return;
    }

    rowVirtualizer.scrollToIndex(index, {
      align: "center",
      behavior: "smooth",
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div>
      {/* Search Controls */}
      <div className="mb-4 flex flex-wrap gap-4 items-end">
        <div className="flex-1 min-w-[200px]">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Koordinat X
          </label>
          <input
            type="number"
            value={searchX}
            onChange={(e) => setSearchX(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="0"
            min="0"
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />
        </div>
        <div className="flex-1 min-w-[200px]">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Koordinat Y
          </label>
          <input
            type="number"
            value={searchY}
            onChange={(e) => setSearchY(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="0"
            min="0"
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />
        </div>
        <button
          onClick={handleSearch}
          className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md transition-colors duration-200"
        >
          Cari
        </button>
      </div>

      {/* Virtual Table */}
      <div
        ref={parentRef}
        className="h-[500px] overflow-auto border border-gray-300 dark:border-gray-600 rounded-lg"
      >
        <div
          style={{
            height: `${rowVirtualizer.getTotalSize()}px`,
            width: "100%",
            position: "relative",
          }}
        >
          {/* Table Header */}
          <div className="sticky top-0 z-10 bg-gray-100 dark:bg-gray-700 border-b-2 border-gray-300 dark:border-gray-600">
            <div className="flex font-semibold text-gray-900 dark:text-white">
              <div className="flex-1 px-4 py-3 text-center border-r border-gray-300 dark:border-gray-600">
                X
              </div>
              <div className="flex-1 px-4 py-3 text-center border-r border-gray-300 dark:border-gray-600">
                Y
              </div>
              <div className="flex-1 px-4 py-3 text-center border-r border-gray-300 dark:border-gray-600">
                R
              </div>
              <div className="flex-1 px-4 py-3 text-center border-r border-gray-300 dark:border-gray-600">
                G
              </div>
              <div className="flex-1 px-4 py-3 text-center border-r border-gray-300 dark:border-gray-600">
                B
              </div>
              <div className="flex-1 px-4 py-3 text-center border-r border-gray-300 dark:border-gray-600">
                HEX
              </div>
              <div className="flex-1 px-4 py-3 text-center">
                Warna
              </div>
            </div>
          </div>

          {/* Virtual Rows */}
          {rowVirtualizer.getVirtualItems().map((virtualRow) => {
            const pixel = data[virtualRow.index];
            return (
              <div
                key={virtualRow.index}
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: `${virtualRow.size}px`,
                  transform: `translateY(${virtualRow.start}px)`,
                }}
              >
                <div className="flex h-full items-center border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-750 text-gray-900 dark:text-white">
                  <div className="flex-1 px-4 py-2 text-center border-r border-gray-200 dark:border-gray-700">
                    {pixel.x}
                  </div>
                  <div className="flex-1 px-4 py-2 text-center border-r border-gray-200 dark:border-gray-700">
                    {pixel.y}
                  </div>
                  <div className="flex-1 px-4 py-2 text-center border-r border-gray-200 dark:border-gray-700">
                    {pixel.r}
                  </div>
                  <div className="flex-1 px-4 py-2 text-center border-r border-gray-200 dark:border-gray-700">
                    {pixel.g}
                  </div>
                  <div className="flex-1 px-4 py-2 text-center border-r border-gray-200 dark:border-gray-700">
                    {pixel.b}
                  </div>
                  <div className="flex-1 px-4 py-2 text-center border-r border-gray-200 dark:border-gray-700 font-mono">
                    {pixel.hex}
                  </div>
                  <div className="flex-1 px-4 py-2 flex justify-center">
                    <div
                      className="w-8 h-8 rounded border border-gray-300 dark:border-gray-600 shadow-sm"
                      style={{ backgroundColor: pixel.hex }}
                      title={pixel.hex}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
        Menampilkan {rowVirtualizer.getVirtualItems().length} dari {data.length.toLocaleString()} baris
      </div>
    </div>
  );
}

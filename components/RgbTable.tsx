"use client";

import { useRef, useState, useEffect } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import { PixelData } from "@/app/page";

interface RgbTableProps {
  data: PixelData[];
  imageWidth: number;
}

type TableFormat = "list" | "matrix";

export default function RgbTable({ data, imageWidth }: RgbTableProps) {
  const parentRef = useRef<HTMLDivElement>(null);
  const [searchX, setSearchX] = useState("");
  const [searchY, setSearchY] = useState("");
  const [tableFormat, setTableFormat] = useState<TableFormat>("list");
  const [zoomLevel, setZoomLevel] = useState(100); // Zoom level in percentage (50% to 200%)

  // Calculate image height from data
  const imageHeight = data.length > 0 ? Math.ceil(data.length / imageWidth) : 0;

  // Calculate cell dimensions based on zoom level
  const baseCellWidth = 128; // Base width in pixels (w-32 = 128px)
  const baseCellHeight = 60; // Base row height
  const cellWidth = (baseCellWidth * zoomLevel) / 100;
  const cellHeight = (baseCellHeight * zoomLevel) / 100;

  // Zoom controls
  const handleZoomIn = () => {
    setZoomLevel((prev) => Math.min(prev + 25, 200));
  };

  const handleZoomOut = () => {
    setZoomLevel((prev) => Math.max(prev - 25, 50));
  };

  const handleResetZoom = () => {
    setZoomLevel(100);
  };

  const rowVirtualizer = useVirtualizer({
    count: tableFormat === "list" ? data.length : imageHeight,
    getScrollElement: () => parentRef.current,
    estimateSize: () => tableFormat === "list" ? 45 : cellHeight,
    overscan: 10,
  });

  // Recalculate virtualizer when zoom changes
  useEffect(() => {
    if (tableFormat === "matrix") {
      rowVirtualizer.measure();
    }
  }, [zoomLevel, tableFormat, rowVirtualizer]);

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

  // Helper function to get pixel data by coordinates
  const getPixelByCoordinates = (x: number, y: number): PixelData | undefined => {
    const index = y * imageWidth + x;
    return data[index];
  };

  return (
    <div>
      {/* Table Format Toggle */}
      <div className="mb-4 flex flex-wrap gap-4 items-center justify-between">
        <div className="flex gap-2 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
          <button
            onClick={() => setTableFormat("list")}
            className={`px-4 py-2 rounded-md font-medium transition-colors duration-200 ${
              tableFormat === "list"
                ? "bg-blue-600 text-white shadow-md"
                : "text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
            }`}
          >
            Format List
          </button>
          <button
            onClick={() => setTableFormat("matrix")}
            className={`px-4 py-2 rounded-md font-medium transition-colors duration-200 ${
              tableFormat === "matrix"
                ? "bg-blue-600 text-white shadow-md"
                : "text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
            }`}
          >
            Format Matrix
          </button>
        </div>

        {/* Zoom Controls - Only visible in matrix format */}
        {tableFormat === "matrix" && (
          <div className="flex items-center gap-3 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
            <button
              onClick={handleZoomOut}
              disabled={zoomLevel <= 50}
              className="px-3 py-2 rounded-md font-medium transition-colors duration-200 hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed text-gray-700 dark:text-gray-300"
              title="Zoom Out (25%)"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                <path fillRule="evenodd" d="M5 8a1 1 0 011-1h4a1 1 0 110 2H6a1 1 0 01-1-1z" clipRule="evenodd" />
              </svg>
            </button>
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300 min-w-[60px] text-center">
              {zoomLevel}%
            </span>
            <button
              onClick={handleResetZoom}
              className="px-3 py-2 rounded-md font-medium transition-colors duration-200 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 text-xs"
              title="Reset Zoom (100%)"
            >
              Reset
            </button>
            <button
              onClick={handleZoomIn}
              disabled={zoomLevel >= 200}
              className="px-3 py-2 rounded-md font-medium transition-colors duration-200 hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed text-gray-700 dark:text-gray-300"
              title="Zoom In (25%)"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                <path fillRule="evenodd" d="M8 5a1 1 0 011 1v1h1a1 1 0 110 2H9v1a1 1 0 11-2 0V9H6a1 1 0 110-2h1V6a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        )}
      </div>

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
        className="h-[500px] overflow-auto border border-gray-300 dark:border-gray-600 rounded-lg relative"
      >
        <div
          style={{
            height: `${rowVirtualizer.getTotalSize()}px`,
            width: tableFormat === "matrix" ? "max-content" : "100%",
            position: "relative",
          }}
        >
          {tableFormat === "list" ? (
            <>
              {/* List Format Table Header */}
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

              {/* List Format Virtual Rows */}
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
                    <div className="flex h-full items-center border-b border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white">
                      <div className="flex-1 px-4 py-2 text-center border-r border-gray-200 dark:border-gray-700 hover:bg-blue-100 dark:hover:bg-blue-900 transition-colors duration-150">
                        {pixel.x}
                      </div>
                      <div className="flex-1 px-4 py-2 text-center border-r border-gray-200 dark:border-gray-700 hover:bg-blue-100 dark:hover:bg-blue-900 transition-colors duration-150">
                        {pixel.y}
                      </div>
                      <div className="flex-1 px-4 py-2 text-center border-r border-gray-200 dark:border-gray-700 hover:bg-blue-100 dark:hover:bg-blue-900 transition-colors duration-150">
                        {pixel.r}
                      </div>
                      <div className="flex-1 px-4 py-2 text-center border-r border-gray-200 dark:border-gray-700 hover:bg-blue-100 dark:hover:bg-blue-900 transition-colors duration-150">
                        {pixel.g}
                      </div>
                      <div className="flex-1 px-4 py-2 text-center border-r border-gray-200 dark:border-gray-700 hover:bg-blue-100 dark:hover:bg-blue-900 transition-colors duration-150">
                        {pixel.b}
                      </div>
                      <div className="flex-1 px-4 py-2 text-center border-r border-gray-200 dark:border-gray-700 font-mono hover:bg-blue-100 dark:hover:bg-blue-900 transition-colors duration-150">
                        {pixel.hex}
                      </div>
                      <div className="flex-1 px-4 py-2 flex justify-center hover:bg-blue-100 dark:hover:bg-blue-900 transition-colors duration-150">
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
            </>
          ) : (
            <>
              {/* Matrix Format Table Header */}
              <div className="sticky top-0 left-0 z-20 bg-gray-100 dark:bg-gray-700 border-b-2 border-gray-300 dark:border-gray-600">
                <div className="flex font-semibold text-gray-900 dark:text-white min-w-max">
                  <div 
                    className="sticky left-0 z-30 px-2 py-3 text-center border-r border-gray-300 dark:border-gray-600 shrink-0 bg-gray-100 dark:bg-gray-700"
                    style={{ width: `${Math.max(64, cellWidth / 2)}px` }}
                  >
                    Y \ X
                  </div>
                  {Array.from({ length: imageWidth }, (_, i) => (
                    <div
                      key={i}
                      className="px-2 py-3 text-center border-r border-gray-300 dark:border-gray-600 shrink-0"
                      style={{ width: `${cellWidth}px` }}
                    >
                      {i}
                    </div>
                  ))}
                </div>
              </div>

              {/* Matrix Format Virtual Rows */}
              {rowVirtualizer.getVirtualItems().map((virtualRow) => {
                const y = virtualRow.index;
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
                    <div className="flex h-full items-center border-b border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white min-w-max">
                      <div 
                        className="sticky left-0 z-10 px-2 py-2 text-center border-r border-gray-200 dark:border-gray-700 font-semibold shrink-0 bg-white dark:bg-gray-800 hover:bg-blue-100 dark:hover:bg-blue-900 transition-colors duration-150"
                        style={{ width: `${Math.max(64, cellWidth / 2)}px` }}
                      >
                        {y}
                      </div>
                      {Array.from({ length: imageWidth }, (_, x) => {
                        const pixel = getPixelByCoordinates(x, y);
                        
                        // Helper function to determine if text should be white or black based on background brightness
                        const getTextColor = (r: number, g: number, b: number) => {
                          // Calculate relative luminance using the formula
                          const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
                          return luminance > 0.5 ? '#000000' : '#ffffff';
                        };

                        // Calculate font size based on zoom level
                        const fontSize = Math.max(8, (12 * zoomLevel) / 100);
                        
                        return (
                          <div
                            key={x}
                            className="px-2 py-2 text-center border-r border-gray-200 dark:border-gray-700 font-mono shrink-0 transition-all duration-150 hover:scale-105 hover:shadow-lg hover:z-10"
                            style={
                              pixel
                                ? {
                                    backgroundColor: pixel.hex,
                                    color: getTextColor(pixel.r, pixel.g, pixel.b),
                                    width: `${cellWidth}px`,
                                    fontSize: `${fontSize}px`,
                                  }
                                : {
                                    width: `${cellWidth}px`,
                                    fontSize: `${fontSize}px`,
                                  }
                            }
                            title={pixel ? `${pixel.hex}\n(${pixel.r}, ${pixel.g}, ${pixel.b})` : ""}
                          >
                            {pixel ? `(${pixel.r},${pixel.g},${pixel.b})` : "-"}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </>
          )}
        </div>
      </div>

      <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
        {tableFormat === "list" ? (
          <>Menampilkan {rowVirtualizer.getVirtualItems().length} dari {data.length.toLocaleString()} baris</>
        ) : (
          <>Menampilkan {rowVirtualizer.getVirtualItems().length} dari {imageHeight} baris (Matrix {imageWidth} x {imageHeight})</>
        )}
      </div>
    </div>
  );
}

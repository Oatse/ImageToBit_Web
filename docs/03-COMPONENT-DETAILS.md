# Detail Komponen - Component Deep Dive

## Table of Contents
1. [app/page.tsx - Main Application](#appppagetsx---main-application)
2. [components/ImageUploader.tsx](#componentsimageuploadertsx)
3. [components/ImageViewer.tsx](#componentsimageviewertsx)
4. [components/PixelTooltip.tsx](#componentspixeltooltiptsx)
5. [components/ImageStats.tsx](#componentsimagestatstsx)
6. [components/RgbTable.tsx](#componentsrgbtabletsx)

---

## app/page.tsx - Main Application

### Deskripsi
File ini adalah **container component** utama yang mengatur seluruh state aplikasi dan mengkoordinasikan komunikasi antar komponen child.

### Imports

```typescript
"use client";  // Client component untuk interactivity

import { useState, useRef, useEffect, useCallback } from "react";
import ImageUploader from "@/components/ImageUploader";
import ImageViewer from "@/components/ImageViewer";
import PixelTooltip from "@/components/PixelTooltip";
import RgbTable from "@/components/RgbTable";
import ImageStats from "@/components/ImageStats";
```

### Type Definitions

```typescript
// Data struktur untuk setiap piksel
export interface PixelData {
  x: number;      // Koordinat X (0 to width-1)
  y: number;      // Koordinat Y (0 to height-1)
  r: number;      // Red (0-255)
  g: number;      // Green (0-255)
  b: number;      // Blue (0-255)
  hex: string;    // Hex color code (e.g., "#FF5733")
}

// Data untuk tooltip hover
export interface TooltipData {
  x: number;
  y: number;
  r: number;
  g: number;
  b: number;
  hex: string;
  visible: boolean;    // Show/hide tooltip
  clientX: number;     // Mouse X position
  clientY: number;     // Mouse Y position
}
```

### State Management

```typescript
// 1. File Management
const [imageFile, setImageFile] = useState<File | null>(null);
// Menyimpan File object dari input

const [imageUrl, setImageUrl] = useState<string>("");
// Object URL untuk display di canvas (blob:...)

// 2. Image Properties
const [imageDimensions, setImageDimensions] = useState<{
  width: number;
  height: number;
} | null>(null);
// Dimensi gambar setelah loaded

// 3. Pixel Data
const [pixelData, setPixelData] = useState<PixelData[]>([]);
// Array berisi semua data piksel hasil processing

// 4. UI States
const [isProcessing, setIsProcessing] = useState(false);
// Loading state saat worker processing

const [showTable, setShowTable] = useState(false);
// Toggle visibility tabel

// 5. Interactive Data
const [tooltipData, setTooltipData] = useState<TooltipData>({
  x: 0, y: 0, r: 0, g: 0, b: 0,
  hex: "#000000",
  visible: false,
  clientX: 0, clientY: 0,
});
// Real-time pixel info untuk tooltip

// 6. Worker Reference
const workerRef = useRef<Worker | null>(null);
// Reference ke Web Worker instance
```

### Key Functions

#### 1. handleFileSelect
```typescript
const handleFileSelect = (file: File) => {
  // Reset semua state
  setImageFile(file);
  setPixelData([]);
  setShowTable(false);
  setTooltipData((prev) => ({ ...prev, visible: false }));

  // Cleanup old URL jika ada
  if (imageUrl) {
    URL.revokeObjectURL(imageUrl);
  }

  // Create new object URL untuk display
  const url = URL.createObjectURL(file);
  setImageUrl(url);
};
```

**Logic Flow:**
1. Reset state sebelumnya
2. Save file reference
3. Cleanup old object URL untuk memory management
4. Create new object URL
5. Update state

#### 2. handleImageLoad
```typescript
const handleImageLoad = useCallback((width: number, height: number) => {
  setImageDimensions({ width, height });
}, []);
```

**Logic:**
- Callback dari ImageViewer setelah gambar loaded
- Simpan dimensi untuk keperluan statistik dan tabel

#### 3. handleImageClick
```typescript
const handleImageClick = useCallback((imageData: ImageData) => {
  setIsProcessing(true);
  setShowTable(false);

  // Initialize Web Worker jika belum ada
  if (!workerRef.current) {
    workerRef.current = new Worker(
      new URL("../workers/pixelProcessor.ts", import.meta.url)
    );
    
    // Setup message handler
    workerRef.current.onmessage = (e: MessageEvent<PixelData[]>) => {
      setPixelData(e.data);
      setIsProcessing(false);
      setShowTable(true);
    };

    // Setup error handler
    workerRef.current.onerror = (error) => {
      console.error("Worker error:", error);
      setIsProcessing(false);
      alert("Terjadi kesalahan saat memproses gambar. Silakan coba lagi.");
    };
  }

  // Kirim data ke worker untuk processing
  workerRef.current.postMessage({ imageData });
}, []);
```

**Logic Flow:**
1. Set loading state
2. Initialize worker (lazy initialization - hanya sekali)
3. Setup message handler untuk menerima hasil
4. Setup error handler
5. Send ImageData ke worker
6. Worker akan process di background
7. Ketika selesai, onmessage akan update state
8. Table akan ditampilkan

**Why Web Worker?**
- Processing ribuan/jutaan piksel memakan waktu
- Tanpa worker, UI akan freeze
- Dengan worker, UI tetap responsive

#### 4. handlePixelHover
```typescript
const handlePixelHover = useCallback((data: TooltipData) => {
  setTooltipData(data);
}, []);
```

**Logic:**
- Update tooltip data setiap mouse move
- useCallback untuk stable reference (prevent re-renders)

#### 5. handleExportCSV
```typescript
const handleExportCSV = () => {
  if (pixelData.length === 0) return;

  // 1. Buat CSV headers
  const headers = ["X", "Y", "R", "G", "B", "HEX"];
  
  // 2. Convert pixel data ke CSV rows
  const csvContent = [
    headers.join(","),
    ...pixelData.map((pixel) => 
      `${pixel.x},${pixel.y},${pixel.r},${pixel.g},${pixel.b},${pixel.hex}`
    ),
  ].join("\n");

  // 3. Create Blob
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  
  // 4. Create download link
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  
  link.setAttribute("href", url);
  link.setAttribute("download", `rgb_matrix_${Date.now()}.csv`);
  link.style.visibility = "hidden";
  
  // 5. Trigger download
  document.body.appendChild(link);
  link.click();
  
  // 6. Cleanup
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
```

**CSV Format Example:**
```csv
X,Y,R,G,B,HEX
0,0,255,0,0,#ff0000
1,0,0,255,0,#00ff00
2,0,0,0,255,#0000ff
...
```

### Cleanup Effect

```typescript
useEffect(() => {
  return () => {
    // Cleanup saat component unmount
    if (workerRef.current) {
      workerRef.current.terminate();  // Stop worker
    }
    if (imageUrl) {
      URL.revokeObjectURL(imageUrl);  // Free memory
    }
  };
}, [imageUrl]);
```

**Pentingnya Cleanup:**
- Worker tetap berjalan jika tidak di-terminate
- Object URL tetap di memory jika tidak di-revoke
- Memory leaks dapat terjadi tanpa proper cleanup

### JSX Structure

```tsx
return (
  <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-4 md:p-8">
    <div className="max-w-7xl mx-auto">
      
      {/* Header */}
      <header>
        <h1>Image to RGB Matrix Converter</h1>
        <p>Analisis gambar dan lihat data piksel...</p>
      </header>

      {/* Image Uploader - Always visible */}
      <ImageUploader onFileSelect={handleFileSelect} />

      {/* Image Viewer - Conditional: shown jika ada imageUrl */}
      {imageUrl && (
        <ImageViewer
          imageUrl={imageUrl}
          onImageClick={handleImageClick}
          onPixelHover={handlePixelHover}
          onImageLoad={handleImageLoad}
          isProcessing={isProcessing}
        />
      )}

      {/* Pixel Tooltip - Always rendered tapi visibility controlled */}
      <PixelTooltip data={tooltipData} />

      {/* Image Statistics - Conditional: shown setelah processing */}
      {showTable && pixelData.length > 0 && imageDimensions && (
        <ImageStats 
          data={pixelData} 
          imageWidth={imageDimensions.width}
          imageHeight={imageDimensions.height}
        />
      )}

      {/* RGB Table - Conditional: shown setelah processing */}
      {showTable && pixelData.length > 0 && imageDimensions && (
        <div>
          <button onClick={handleExportCSV}>Export CSV</button>
          <RgbTable 
            data={pixelData} 
            imageWidth={imageDimensions.width}
          />
        </div>
      )}
      
    </div>
  </div>
);
```

---

## components/ImageUploader.tsx

### Deskripsi
Komponen sederhana untuk upload file gambar dengan validasi.

### Props Interface

```typescript
interface ImageUploaderProps {
  onFileSelect: (file: File) => void;
}
```

### Code Logic

```typescript
export default function ImageUploader({ onFileSelect }: ImageUploaderProps) {
  // Hidden file input reference
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file menggunakan utility function
    const validation = validateImageFile(file, 50);  // 50MB max
    
    if (!validation.valid) {
      alert(validation.error);
      return;
    }

    // Pass valid file ke parent
    onFileSelect(file);
  };

  const handleClick = () => {
    // Trigger hidden file input click
    fileInputRef.current?.click();
  };

  return (
    <div>
      {/* Hidden input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />
      
      {/* Styled button */}
      <button onClick={handleClick}>
        <svg>{/* Icon */}</svg>
        Pilih Gambar
      </button>
      
      <p>Mendukung JPG, PNG (Maksimal 50MB)</p>
    </div>
  );
}
```

### Validation Logic

Menggunakan `validateImageFile` dari `utils/imageUtils.ts`:

```typescript
export function validateImageFile(file: File, maxSizeInMB: number = 50) {
  // 1. Check if file is image
  if (!file.type.startsWith("image/")) {
    return {
      valid: false,
      error: "File yang dipilih bukan gambar..."
    };
  }

  // 2. Check file size
  const maxSizeInBytes = maxSizeInMB * 1024 * 1024;
  if (file.size > maxSizeInBytes) {
    return {
      valid: false,
      error: `Ukuran file terlalu besar. Maksimal ${maxSizeInMB}MB`
    };
  }

  return { valid: true };
}
```

### UI Pattern

```
┌─────────────────────────────────────┐
│  📁  Pilih Gambar                   │  ← Styled button
└─────────────────────────────────────┘
  Mendukung JPG, PNG (Maksimal 50MB)   ← Info text

Hidden: <input type="file" />          ← Actual input
```

**Why Hidden Input?**
- Default file input tidak bisa di-style
- Hidden input + styled button = better UX
- Full control atas design

---

## components/ImageViewer.tsx

### Deskripsi
Komponen yang menampilkan gambar di canvas dan menangani mouse interactions.

### Props Interface

```typescript
interface ImageViewerProps {
  imageUrl: string;                    // Blob URL
  onImageClick: (imageData: ImageData) => void;  // Process trigger
  onPixelHover: (data: TooltipData) => void;    // Tooltip update
  onImageLoad: (width: number, height: number) => void;  // Dimension callback
  isProcessing: boolean;               // Loading state
}
```

### State Management

```typescript
const canvasRef = useRef<HTMLCanvasElement>(null);
const containerRef = useRef<HTMLDivElement>(null);
const [imageLoaded, setImageLoaded] = useState(false);
const [imageDimensions, setImageDimensions] = useState({ width: 0, height: 0 });
```

### Canvas Setup Effect

```typescript
useEffect(() => {
  const canvas = canvasRef.current;
  if (!canvas || !imageUrl) return;

  // Get context dengan optimization flag
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) return;

  const img = new Image();
  
  img.onload = () => {
    // Set canvas size ke ukuran asli gambar
    canvas.width = img.width;
    canvas.height = img.height;
    
    // Draw image ke canvas
    ctx.drawImage(img, 0, 0);
    
    // Update state
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
```

**willReadFrequently Flag:**
- Optimization untuk frequent pixel reading
- Browser akan optimize memory layout
- Penting untuk performa tooltip hover

### Helper Functions

#### getPixelColor
```typescript
const getPixelColor = (x: number, y: number): { r: number; g: number; b: number } | null => {
  const canvas = canvasRef.current;
  if (!canvas) return null;

  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) return null;

  // Get 1x1 pixel data
  const imageData = ctx.getImageData(x, y, 1, 1);
  const data = imageData.data;  // Uint8ClampedArray [R, G, B, A]

  return {
    r: data[0],
    g: data[1],
    b: data[2],
    // data[3] is alpha, not used
  };
};
```

**ImageData Structure:**
```
imageData.data = [R0, G0, B0, A0, R1, G1, B1, A1, ...]
                  └────pixel 0────┘ └────pixel 1────┘
```

#### rgbToHex
```typescript
const rgbToHex = (r: number, g: number, b: number): string => {
  return "#" + [r, g, b].map((x) => {
    const hex = x.toString(16);
    return hex.length === 1 ? "0" + hex : hex;
  }).join("");
};
```

**Example:**
```typescript
rgbToHex(255, 0, 127)  // → "#ff007f"
rgbToHex(0, 255, 0)    // → "#00ff00"
```

### Mouse Move Handler

```typescript
const handleMouseMove = (e: MouseEvent<HTMLCanvasElement>) => {
  if (!imageLoaded) return;

  const canvas = canvasRef.current;
  if (!canvas) return;

  const rect = canvas.getBoundingClientRect();
  
  // Calculate scale (canvas size vs display size)
  const scaleX = canvas.width / rect.width;
  const scaleY = canvas.height / rect.height;

  // Convert mouse position ke canvas coordinates
  const x = Math.floor((e.clientX - rect.left) * scaleX);
  const y = Math.floor((e.clientY - rect.top) * scaleY);

  // Check bounds
  if (x < 0 || x >= canvas.width || y < 0 || y >= canvas.height) {
    onPixelHover({
      x: 0, y: 0, r: 0, g: 0, b: 0, hex: "#000000",
      visible: false,
      clientX: e.clientX,
      clientY: e.clientY,
    });
    return;
  }

  // Get pixel color
  const color = getPixelColor(x, y);
  if (!color) return;

  const hex = rgbToHex(color.r, color.g, color.b);

  // Update tooltip
  onPixelHover({
    x, y,
    r: color.r,
    g: color.g,
    b: color.b,
    hex,
    visible: true,
    clientX: e.clientX,
    clientY: e.clientY,
  });
};
```

**Coordinate Transformation:**
```
Mouse Position (screen)
        ↓
  e.clientX, e.clientY
        ↓
  - rect.left, - rect.top (relative ke canvas)
        ↓
  × scaleX, × scaleY (scale ke ukuran asli)
        ↓
Canvas Coordinates (pixel)
```

### Click Handler

```typescript
const handleClick = () => {
  if (!imageLoaded || isProcessing) return;

  const canvas = canvasRef.current;
  if (!canvas) return;

  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) return;

  // Get ALL pixel data
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  
  // Pass ke parent untuk processing
  onImageClick(imageData);
};
```

**ImageData untuk gambar 3×2:**
```
canvas.width = 3
canvas.height = 2

imageData.data = [
  R0, G0, B0, A0,  // Pixel (0,0)
  R1, G1, B1, A1,  // Pixel (1,0)
  R2, G2, B2, A2,  // Pixel (2,0)
  R3, G3, B3, A3,  // Pixel (0,1)
  R4, G4, B4, A4,  // Pixel (1,1)
  R5, G5, B5, A5,  // Pixel (2,1)
]

Total length = width × height × 4
             = 3 × 2 × 4
             = 24 values
```

### JSX Structure

```tsx
return (
  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
    
    {/* Header */}
    <div className="mb-4">
      <h2>Preview Gambar</h2>
      {imageLoaded && (
        <p>Dimensi: {imageDimensions.width} × {imageDimensions.height} piksel</p>
      )}
    </div>

    {/* Canvas Container */}
    <div className="relative overflow-auto max-h-[600px] ...">
      <canvas
        ref={canvasRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onClick={handleClick}
        className={isProcessing ? "cursor-wait opacity-50" : "cursor-crosshair"}
      />
      
      {/* Loading Overlay */}
      {isProcessing && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-xl">
            <div className="flex items-center gap-3">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <p>Memproses gambar...</p>
            </div>
          </div>
        </div>
      )}
    </div>

    {/* Tips */}
    <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900 ...">
      <p><strong>Tips:</strong> Hover mouse untuk melihat info piksel, klik untuk menampilkan tabel data</p>
    </div>
    
  </div>
);
```

---

## components/PixelTooltip.tsx

### Deskripsi
Floating tooltip yang mengikuti mouse dan menampilkan info piksel real-time.

### Props Interface

```typescript
interface PixelTooltipProps {
  data: TooltipData;
}
```

### Code Logic

```typescript
export default function PixelTooltip({ data }: PixelTooltipProps) {
  // Hide jika tidak visible
  if (!data.visible) return null;

  // Position near cursor dengan offset
  const style = {
    left: `${data.clientX + 15}px`,
    top: `${data.clientY + 15}px`,
  };

  return (
    <div
      className="fixed z-50 pointer-events-none"  // Fixed positioning, no block clicks
      style={style}
    >
      <div className="bg-gray-900 text-white rounded-lg shadow-xl p-3 text-sm">
        <div className="space-y-1">
          
          {/* Color preview + HEX */}
          <div className="flex items-center gap-2">
            <div
              className="w-8 h-8 rounded border-2 border-white shadow-md"
              style={{ backgroundColor: data.hex }}
            />
            <div>
              <div className="font-mono font-bold">{data.hex.toUpperCase()}</div>
              <div className="text-xs text-gray-300">
                X: {data.x}, Y: {data.y}
              </div>
            </div>
          </div>

          {/* RGB Values */}
          <div className="border-t border-gray-700 pt-1 text-xs">
            <div className="flex gap-3">
              <span className="text-red-400">R: {data.r}</span>
              <span className="text-green-400">G: {data.g}</span>
              <span className="text-blue-400">B: {data.b}</span>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}
```

### Visual Layout

```
┌──────────────────────────┐
│ ┌──┐  #FF5733            │
│ │██│  X: 150, Y: 200     │  ← Fixed position near cursor
│ └──┘                     │
│ ─────────────────────    │
│ R: 255  G: 87  B: 51     │
└──────────────────────────┘
```

**Key Points:**
- `fixed` positioning untuk follow cursor
- `pointer-events-none` agar tidak block clicks
- `z-50` untuk always on top
- Offset 15px agar tidak tertutup cursor

---

## components/ImageStats.tsx

### Deskripsi
Menampilkan statistik gambar seperti rata-rata warna, piksel paling terang/gelap.

### Props Interface

```typescript
interface ImageStatsProps {
  data: PixelData[];
  imageWidth: number;
  imageHeight: number;
}
```

### Statistics Calculation

```typescript
const stats = useMemo(() => {
  if (data.length === 0) {
    return {
      totalPixels: 0,
      avgRed: 0,
      avgGreen: 0,
      avgBlue: 0,
      brightestPixel: null,
      darkestPixel: null,
    };
  }

  let sumR = 0, sumG = 0, sumB = 0;
  let maxBrightness = -1;
  let minBrightness = 256;
  let brightestPixel = data[0];
  let darkestPixel = data[0];

  data.forEach((pixel) => {
    // Sum untuk average
    sumR += pixel.r;
    sumG += pixel.g;
    sumB += pixel.b;

    // Calculate brightness menggunakan formula luminance
    // Formula: Y = 0.299R + 0.587G + 0.114B
    const brightness = (pixel.r * 299 + pixel.g * 587 + pixel.b * 114) / 1000;
    
    // Track brightest
    if (brightness > maxBrightness) {
      maxBrightness = brightness;
      brightestPixel = pixel;
    }
    
    // Track darkest
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
```

**useMemo Benefits:**
- Expensive calculation (loop through all pixels)
- Hanya re-calculate jika data berubah
- Prevent unnecessary re-calculations

**Brightness Formula:**
```
Luminance = 0.299×R + 0.587×G + 0.114×B

Why these coefficients?
- Human eye lebih sensitive ke green
- Green contributes paling banyak ke perceived brightness
- Red second, blue least
```

### JSX Structure

```tsx
return (
  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-6">
    <h3>Statistik Gambar</h3>
    
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      
      {/* Dimensi */}
      <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
        <p>Dimensi</p>
        <p>{imageWidth} × {imageHeight}</p>
      </div>

      {/* Total Piksel */}
      <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
        <p>Total Piksel</p>
        <p>{stats.totalPixels.toLocaleString()}</p>
      </div>

      {/* Rata-rata Warna */}
      <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
        <p>Rata-rata Warna</p>
        <div className="flex items-center gap-3">
          <div
            className="w-12 h-12 rounded-lg"
            style={{ backgroundColor: avgHex }}
          />
          <div>
            <p>{avgHex}</p>
            <p>R:{avgRed} G:{avgGreen} B:{avgBlue}</p>
          </div>
        </div>
      </div>

      {/* Piksel Paling Terang */}
      <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
        <p>Piksel Paling Terang</p>
        {stats.brightestPixel && (
          <div className="flex items-center gap-3">
            <div
              className="w-12 h-12 rounded-lg"
              style={{ backgroundColor: stats.brightestPixel.hex }}
            />
            <div>
              <p>{stats.brightestPixel.hex}</p>
              <p>({stats.brightestPixel.x}, {stats.brightestPixel.y})</p>
            </div>
          </div>
        )}
      </div>

      {/* Piksel Paling Gelap */}
      <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
        <p>Piksel Paling Gelap</p>
        {stats.darkestPixel && (
          <div className="flex items-center gap-3">
            <div
              className="w-12 h-12 rounded-lg"
              style={{ backgroundColor: stats.darkestPixel.hex }}
            />
            <div>
              <p>{stats.darkestPixel.hex}</p>
              <p>({stats.darkestPixel.x}, {stats.darkestPixel.y})</p>
            </div>
          </div>
        )}
      </div>
      
    </div>
  </div>
);
```

---

## components/RgbTable.tsx

### Deskripsi
Tabel virtual berkinerja tinggi untuk menampilkan jutaan baris data piksel.

### Props Interface

```typescript
interface RgbTableProps {
  data: PixelData[];
  imageWidth: number;
}
```

### State Management

```typescript
const parentRef = useRef<HTMLDivElement>(null);  // Scroll container
const [searchX, setSearchX] = useState("");       // X coordinate search
const [searchY, setSearchY] = useState("");       // Y coordinate search
const [tableFormat, setTableFormat] = useState<"list" | "matrix">("list");
```

### Virtual Scrolling Setup

```typescript
const rowVirtualizer = useVirtualizer({
  count: tableFormat === "list" ? data.length : imageHeight,
  getScrollElement: () => parentRef.current,
  estimateSize: () => tableFormat === "list" ? 45 : 60,
  overscan: 10,  // Render 10 extra rows above/below for smooth scroll
});
```

**Parameters Explained:**
- `count`: Total number of rows
- `getScrollElement`: Ref to scrollable container
- `estimateSize`: Height per row (px)
- `overscan`: Extra rows to render (buffer)

### Search Function

```typescript
const handleSearch = () => {
  const x = parseInt(searchX);
  const y = parseInt(searchY);

  // Validation
  if (isNaN(x) || isNaN(y)) {
    alert("Mohon masukkan koordinat yang valid");
    return;
  }

  // Calculate index dari coordinates
  // Formula: index = y * width + x
  const index = y * imageWidth + x;

  // Bounds check
  if (index < 0 || index >= data.length) {
    alert("Koordinat di luar jangkauan gambar");
    return;
  }

  // Scroll to index
  rowVirtualizer.scrollToIndex(index, {
    align: "center",
    behavior: "smooth",
  });
};
```

**Coordinate to Index Formula:**
```
For image width = 5:

(0,0) → 0    (1,0) → 1    (2,0) → 2    (3,0) → 3    (4,0) → 4
(0,1) → 5    (1,1) → 6    (2,1) → 7    (3,1) → 8    (4,1) → 9
(0,2) → 10   (1,2) → 11   (2,2) → 12   (3,2) → 13   (4,2) → 14

Formula: index = y * width + x
Example: (2,1) = 1 * 5 + 2 = 7 ✓
```

### List Format Rendering

```typescript
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
      <div className="flex h-full items-center border-b">
        <div className="flex-1 px-4 py-2 text-center">{pixel.x}</div>
        <div className="flex-1 px-4 py-2 text-center">{pixel.y}</div>
        <div className="flex-1 px-4 py-2 text-center">{pixel.r}</div>
        <div className="flex-1 px-4 py-2 text-center">{pixel.g}</div>
        <div className="flex-1 px-4 py-2 text-center">{pixel.b}</div>
        <div className="flex-1 px-4 py-2 text-center">{pixel.hex}</div>
        <div className="flex-1 px-4 py-2">
          <div
            className="w-8 h-8 rounded"
            style={{ backgroundColor: pixel.hex }}
          />
        </div>
      </div>
    </div>
  );
})}
```

**Virtual Scrolling Visual:**
```
┌─────────────────────────┐
│ X | Y | R | G | B | HEX │ ← Sticky header
├─────────────────────────┤
│ 0 | 0 | 255 | 0 | 0 |...│ ← Visible row (rendered)
│ 1 | 0 | 0 | 255 | 0 |...│ ← Visible row (rendered)
│ 2 | 0 | 0 | 0 | 255|...│ ← Visible row (rendered)
│                         │
│ [virtual space]         │ ← Not rendered
│ [1,000,000 rows]        │ ← Not rendered
│ [virtual space]         │ ← Not rendered
│                         │
└─────────────────────────┘

Only ~20 rows rendered at a time!
```

### Matrix Format Rendering

```typescript
{rowVirtualizer.getVirtualItems().map((virtualRow) => {
  const rowY = virtualRow.index;
  
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
      <div className="flex h-full items-center border-b">
        {/* Row Y label */}
        <div className="sticky left-0 z-10 px-4 py-2 bg-gray-100 dark:bg-gray-700">
          Y: {rowY}
        </div>
        
        {/* All pixels in this row */}
        {Array.from({ length: imageWidth }, (_, x) => {
          const pixel = getPixelByCoordinates(x, rowY);
          if (!pixel) return null;
          
          return (
            <div
              key={x}
              className="px-2 py-2"
              title={`(${x}, ${rowY}) RGB(${pixel.r}, ${pixel.g}, ${pixel.b})`}
            >
              <div
                className="w-12 h-12 rounded"
                style={{ backgroundColor: pixel.hex }}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
})}
```

**Matrix Format Visual:**
```
┌──────┬────┬────┬────┬────┐
│ Y: 0 │ ██ │ ██ │ ██ │ ██ │  ← Row 0, all columns
├──────┼────┼────┼────┼────┤
│ Y: 1 │ ██ │ ██ │ ██ │ ██ │  ← Row 1, all columns
├──────┼────┼────┼────┼────┤
│ Y: 2 │ ██ │ ██ │ ██ │ ██ │  ← Row 2, all columns
└──────┴────┴────┴────┴────┘

Each ██ = Color preview of pixel
Tooltip shows RGB on hover
```

### Complete JSX Structure

```tsx
return (
  <div>
    {/* Format Toggle */}
    <div className="mb-4">
      <button onClick={() => setTableFormat("list")}>Format List</button>
      <button onClick={() => setTableFormat("matrix")}>Format Matrix</button>
    </div>

    {/* Search Controls */}
    <div className="mb-4 flex gap-4">
      <input
        type="number"
        value={searchX}
        onChange={(e) => setSearchX(e.target.value)}
        placeholder="X"
      />
      <input
        type="number"
        value={searchY}
        onChange={(e) => setSearchY(e.target.value)}
        placeholder="Y"
      />
      <button onClick={handleSearch}>Cari</button>
    </div>

    {/* Virtual Table */}
    <div
      ref={parentRef}
      className="h-[500px] overflow-auto"
    >
      <div style={{ height: `${rowVirtualizer.getTotalSize()}px` }}>
        {tableFormat === "list" ? (
          // List format rendering
        ) : (
          // Matrix format rendering
        )}
      </div>
    </div>
  </div>
);
```

---

**Next**: [04-WORKERS-AND-UTILS.md](./04-WORKERS-AND-UTILS.md) untuk penjelasan Web Workers dan utility functions

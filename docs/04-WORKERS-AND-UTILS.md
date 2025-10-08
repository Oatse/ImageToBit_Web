# Web Workers & Utility Functions

## Table of Contents
1. [workers/pixelProcessor.ts - Web Worker](#workerspixelprocessorts---web-worker)
2. [utils/imageUtils.ts - Utility Functions](#utilsimageutilsts---utility-functions)
3. [types/index.ts - Type Definitions](#typesindexts---type-definitions)

---

## workers/pixelProcessor.ts - Web Worker

### Deskripsi
Web Worker yang berjalan di background thread untuk memproses data piksel gambar tanpa memblokir UI thread.

### Apa itu Web Worker?

**Web Worker** adalah JavaScript yang berjalan di thread terpisah dari main thread (UI thread).

```
Main Thread (UI)          Web Worker Thread
─────────────────────────────────────────────
React rendering           Heavy computation
User interactions         Pixel processing
DOM updates              Data transformation
Event handling           Loop operations

⚠️ No blocking UI        ✅ Can do heavy work
```

**Benefits:**
- UI tetap responsive
- Tidak ada lag/freeze
- Parallel processing
- Better user experience

**Limitations:**
- Tidak bisa akses DOM
- Tidak bisa akses window object
- Communication via postMessage only

### Code Structure

```typescript
// Type definitions
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
```

### Helper Function: rgbToHex

```typescript
function rgbToHex(r: number, g: number, b: number): string {
  return "#" + [r, g, b]
    .map((x) => {
      const hex = x.toString(16);
      return hex.length === 1 ? "0" + hex : hex;
    })
    .join("");
}
```

**Logic Explained:**
```typescript
// Example: RGB(255, 0, 127)

255.toString(16)  // "ff"
0.toString(16)    // "0"  → padded to "00"
127.toString(16)  // "7f"

Result: "#" + "ff" + "00" + "7f" = "#ff007f"
```

**Padding Logic:**
```typescript
// If hex is 1 character, pad with "0"
"0".length === 1   // true  → "0" + "0" = "00"
"ff".length === 1  // false → "ff"
```

### Main Message Handler

```typescript
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

      const r = data[index];      // Red
      const g = data[index + 1];  // Green
      const b = data[index + 2];  // Blue
      // const a = data[index + 3]; // Alpha (not used)

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

    // Optional: Send progress updates for large images
    if (y % Math.floor(height / 10) === 0 && y > 0) {
      const progress = Math.round((y / height) * 100);
      // Could send: self.postMessage({ type: 'progress', progress });
    }
  }

  // Send the complete data back to main thread
  self.postMessage(pixelArray);
};

// Export for TypeScript module compatibility
export {};
```

### ImageData Structure Deep Dive

**Example: 3×2 image**
```
Gambar:
┌───┬───┬───┐
│ R │ G │ B │  Row 0
├───┼───┼───┤
│ Y │ M │ C │  Row 1
└───┴───┴───┘

ImageData:
width = 3
height = 2
data = Uint8ClampedArray [
  255,0,0,255,    // Pixel (0,0) - Red
  0,255,0,255,    // Pixel (1,0) - Green
  0,0,255,255,    // Pixel (2,0) - Blue
  255,255,0,255,  // Pixel (0,1) - Yellow
  255,0,255,255,  // Pixel (1,1) - Magenta
  0,255,255,255   // Pixel (2,1) - Cyan
]
```

### Index Calculation Formula

```typescript
const index = (y * width + x) * 4;
```

**Example calculations:**
```
width = 3

(0,0): (0 * 3 + 0) * 4 = 0   → data[0] = R, data[1] = G, data[2] = B
(1,0): (0 * 3 + 1) * 4 = 4   → data[4] = R, data[5] = G, data[6] = B
(2,0): (0 * 3 + 2) * 4 = 8   → data[8] = R, data[9] = G, data[10] = B
(0,1): (1 * 3 + 0) * 4 = 12  → data[12] = R, data[13] = G, data[14] = B
(1,1): (1 * 3 + 1) * 4 = 16  → data[16] = R, data[17] = G, data[18] = B
(2,1): (1 * 3 + 2) * 4 = 20  → data[20] = R, data[21] = G, data[22] = B
```

### Processing Flow Diagram

```
Main Thread                    Web Worker Thread
─────────────────────────────────────────────────

1. User clicks image
   │
2. Get ImageData from canvas
   │
3. worker.postMessage({imageData})
   │                              │
   │                         4. Receive message
   │                              │
   │                         5. Extract width, height, data
   │                              │
   │                         6. For each y (0 to height-1)
   │                              │  For each x (0 to width-1)
   │                              │    Calculate index
   │                              │    Extract R, G, B
   │                              │    Convert to HEX
   │                              │    Push to array
   │                              │
   │                         7. postMessage(pixelArray)
   │                              │
8. worker.onmessage         ◄────┘
   │
9. Update state
   │
10. Render table
```

### Performance Considerations

**For 4000×3000 image:**
```
Total pixels: 12,000,000
Operations per pixel: ~5 (read RGB, convert HEX, create object)
Total operations: ~60,000,000

Without Web Worker:
- UI freezes for ~2-5 seconds
- User can't interact
- Bad UX

With Web Worker:
- UI stays responsive
- User can still interact
- Good UX
- Processing happens in background
```

### Communication Protocol

**From Main → Worker:**
```typescript
worker.postMessage({
  imageData: ImageData  // Contains width, height, data
});
```

**From Worker → Main:**
```typescript
self.postMessage(pixelArray);  // Array of PixelData objects
```

---

## utils/imageUtils.ts - Utility Functions

### Deskripsi
Kumpulan helper functions untuk operasi umum pada gambar dan data piksel.

### 1. rgbToHex

```typescript
export function rgbToHex(r: number, g: number, b: number): string {
  return "#" + [r, g, b]
    .map((x) => {
      const hex = x.toString(16);
      return hex.length === 1 ? "0" + hex : hex;
    })
    .join("");
}
```

**Usage:**
```typescript
rgbToHex(255, 0, 0)    // "#ff0000" (red)
rgbToHex(0, 255, 0)    // "#00ff00" (green)
rgbToHex(0, 0, 255)    // "#0000ff" (blue)
rgbToHex(255, 255, 0)  // "#ffff00" (yellow)
```

### 2. hexToRgb

```typescript
export function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}
```

**Regex Breakdown:**
```typescript
/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i

^           // Start of string
#?          // Optional # character
([a-f\d]{2}) // Capture group 1: 2 hex digits (R)
([a-f\d]{2}) // Capture group 2: 2 hex digits (G)
([a-f\d]{2}) // Capture group 3: 2 hex digits (B)
$           // End of string
i           // Case insensitive
```

**Usage:**
```typescript
hexToRgb("#ff0000")  // { r: 255, g: 0, b: 0 }
hexToRgb("00ff00")   // { r: 0, g: 255, b: 0 }
hexToRgb("#0000FF")  // { r: 0, g: 0, b: 255 }
hexToRgb("invalid")  // null
```

**Parsing Logic:**
```typescript
parseInt("ff", 16)  // 255
parseInt("00", 16)  // 0
parseInt("7f", 16)  // 127
```

### 3. formatFileSize

```typescript
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + " " + sizes[i];
}
```

**Logic Explained:**
```typescript
// Example: 1536 bytes

Math.log(1536) / Math.log(1024)  // ~1.08
Math.floor(1.08)                 // 1
sizes[1]                         // "KB"

1536 / Math.pow(1024, 1)         // 1.5
Math.round(1.5 * 100) / 100      // 1.5

Result: "1.5 KB"
```

**More Examples:**
```typescript
formatFileSize(1024)        // "1 KB"
formatFileSize(1536)        // "1.5 KB"
formatFileSize(1048576)     // "1 MB"
formatFileSize(5242880)     // "5 MB"
formatFileSize(1073741824)  // "1 GB"
```

### 4. calculateBrightness

```typescript
export function calculateBrightness(r: number, g: number, b: number): number {
  return (r * 299 + g * 587 + b * 114) / 1000;
}
```

**Formula: Luminance (Perceived Brightness)**

```
Y = 0.299 × R + 0.587 × G + 0.114 × B
```

**Why these coefficients?**
- Human eye lebih sensitive terhadap **green**
- Green contributes **58.7%** ke perceived brightness
- Red contributes **29.9%**
- Blue contributes **11.4%**

**Examples:**
```typescript
calculateBrightness(255, 255, 255)  // 255 (white, brightest)
calculateBrightness(0, 0, 0)        // 0   (black, darkest)
calculateBrightness(255, 0, 0)      // 76.245 (red)
calculateBrightness(0, 255, 0)      // 149.685 (green, brighter than red!)
calculateBrightness(0, 0, 255)      // 29.07  (blue, darkest of RGB)
```

### 5. getContrastColor

```typescript
export function getContrastColor(r: number, g: number, b: number): "light" | "dark" {
  const brightness = calculateBrightness(r, g, b);
  return brightness > 128 ? "dark" : "light";
}
```

**Use Case:**
Menentukan warna text yang kontras dengan background.

**Logic:**
- Brightness > 128 (terang) → gunakan text hitam
- Brightness ≤ 128 (gelap) → gunakan text putih

**Examples:**
```typescript
getContrastColor(255, 255, 255)  // "dark"  (white bg → black text)
getContrastColor(0, 0, 0)        // "light" (black bg → white text)
getContrastColor(255, 0, 0)      // "light" (red bg → white text)
getContrastColor(255, 255, 0)    // "dark"  (yellow bg → black text)
```

### 6. generateCSV

```typescript
export function generateCSV(
  data: Array<{ x: number; y: number; r: number; g: number; b: number; hex: string }>
): string {
  const headers = ["X", "Y", "R", "G", "B", "HEX"];
  const rows = data.map((pixel) => 
    `${pixel.x},${pixel.y},${pixel.r},${pixel.g},${pixel.b},${pixel.hex}`
  );
  
  return [headers.join(","), ...rows].join("\n");
}
```

**Output Example:**
```csv
X,Y,R,G,B,HEX
0,0,255,0,0,#ff0000
1,0,0,255,0,#00ff00
2,0,0,0,255,#0000ff
0,1,255,255,0,#ffff00
```

**Step-by-step:**
```typescript
// 1. Headers
headers.join(",")  // "X,Y,R,G,B,HEX"

// 2. Data rows
data.map(pixel => `${pixel.x},${pixel.y},...`)
// ["0,0,255,0,0,#ff0000", "1,0,0,255,0,#00ff00", ...]

// 3. Combine all
[headers, ...rows].join("\n")
```

### 7. downloadFile

```typescript
export function downloadFile(
  content: string,
  filename: string,
  mimeType: string = "text/plain"
): void {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  
  link.href = url;
  link.download = filename;
  link.style.display = "none";
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  URL.revokeObjectURL(url);
}
```

**Flow:**
```
1. Create Blob dari content
   ↓
2. Create Object URL dari Blob
   ↓
3. Create <a> element dengan download attribute
   ↓
4. Append ke DOM (hidden)
   ↓
5. Programmatically click link
   ↓
6. Browser triggers download
   ↓
7. Remove link from DOM
   ↓
8. Revoke Object URL (cleanup memory)
```

**Usage:**
```typescript
const csvContent = "X,Y,R,G,B\n0,0,255,0,0";
downloadFile(csvContent, "data.csv", "text/csv");
```

### 8. validateImageFile

```typescript
export function validateImageFile(
  file: File,
  maxSizeInMB: number = 50
): { valid: boolean; error?: string } {
  
  // Check if it's an image
  if (!file.type.startsWith("image/")) {
    return {
      valid: false,
      error: "File yang dipilih bukan gambar. Mohon pilih file JPG, PNG, atau format gambar lainnya.",
    };
  }

  // Check file size
  const maxSizeInBytes = maxSizeInMB * 1024 * 1024;
  if (file.size > maxSizeInBytes) {
    return {
      valid: false,
      error: `Ukuran file terlalu besar. Maksimal ${maxSizeInMB}MB. File Anda: ${formatFileSize(file.size)}`,
    };
  }

  return { valid: true };
}
```

**Validation Steps:**

1. **Type Check:**
```typescript
file.type.startsWith("image/")

Valid types:
- "image/jpeg"
- "image/png"
- "image/gif"
- "image/webp"

Invalid:
- "application/pdf"
- "text/plain"
```

2. **Size Check:**
```typescript
maxSizeInMB = 50
maxSizeInBytes = 50 * 1024 * 1024 = 52,428,800 bytes

file.size > maxSizeInBytes  // true = too large
```

**Usage:**
```typescript
const file = event.target.files[0];
const validation = validateImageFile(file, 50);

if (!validation.valid) {
  alert(validation.error);
  return;
}

// Proceed with file
```

---

## types/index.ts - Type Definitions

### Deskripsi
Central location untuk semua TypeScript type definitions yang digunakan di berbagai file.

### Complete Type Definitions

```typescript
// ═══════════════════════════════════════════════════════
// PIXEL DATA
// ═══════════════════════════════════════════════════════

/**
 * Represents a single pixel with its coordinates and color values
 */
export interface PixelData {
  x: number;        // X coordinate (0 to width-1)
  y: number;        // Y coordinate (0 to height-1)
  r: number;        // Red component (0-255)
  g: number;        // Green component (0-255)
  b: number;        // Blue component (0-255)
  hex: string;      // Hexadecimal color representation (e.g., "#ff0000")
}

// ═══════════════════════════════════════════════════════
// TOOLTIP DATA
// ═══════════════════════════════════════════════════════

/**
 * Extended PixelData with additional properties for tooltip display
 */
export interface TooltipData extends PixelData {
  visible: boolean;   // Whether tooltip should be shown
  clientX: number;    // Mouse X position on screen
  clientY: number;    // Mouse Y position on screen
}

// ═══════════════════════════════════════════════════════
// IMAGE PROPERTIES
// ═══════════════════════════════════════════════════════

/**
 * Image dimensions
 */
export interface ImageDimensions {
  width: number;     // Image width in pixels
  height: number;    // Image height in pixels
}

// ═══════════════════════════════════════════════════════
// WEB WORKER COMMUNICATION
// ═══════════════════════════════════════════════════════

/**
 * Message sent from main thread to worker
 */
export interface WorkerMessage {
  imageData: ImageData;  // Canvas ImageData object
}

/**
 * Response from worker to main thread
 */
export interface WorkerResponse {
  type?: 'progress' | 'complete';  // Message type
  progress?: number;                // Progress percentage (0-100)
  data?: PixelData[];              // Processed pixel data
}
```

### Type Usage Examples

#### PixelData
```typescript
const pixel: PixelData = {
  x: 100,
  y: 50,
  r: 255,
  g: 128,
  b: 0,
  hex: "#ff8000"
};

const pixels: PixelData[] = [pixel];
```

#### TooltipData
```typescript
const tooltip: TooltipData = {
  x: 100,
  y: 50,
  r: 255,
  g: 128,
  b: 0,
  hex: "#ff8000",
  visible: true,
  clientX: 500,  // Screen position
  clientY: 300
};
```

#### ImageDimensions
```typescript
const dims: ImageDimensions = {
  width: 1920,
  height: 1080
};
```

#### WorkerMessage & WorkerResponse
```typescript
// Main thread sends:
const message: WorkerMessage = {
  imageData: ctx.getImageData(0, 0, width, height)
};
worker.postMessage(message);

// Worker responds:
const response: WorkerResponse = {
  type: 'complete',
  data: pixelArray
};
self.postMessage(response);

// Or progress update:
const progressResponse: WorkerResponse = {
  type: 'progress',
  progress: 45  // 45%
};
self.postMessage(progressResponse);
```

### Benefits of TypeScript Types

#### 1. Type Safety
```typescript
// ✅ Valid
const pixel: PixelData = {
  x: 10,
  y: 20,
  r: 255,
  g: 0,
  b: 0,
  hex: "#ff0000"
};

// ❌ Compile error - missing properties
const invalid: PixelData = {
  x: 10,
  y: 20
};

// ❌ Compile error - wrong type
const invalid2: PixelData = {
  x: "10",  // Should be number
  y: 20,
  r: 255,
  g: 0,
  b: 0,
  hex: "#ff0000"
};
```

#### 2. IntelliSense
```typescript
const pixel: PixelData = {
  // IDE will autocomplete: x, y, r, g, b, hex
};

pixel.  // IDE will show: x, y, r, g, b, hex
```

#### 3. Refactoring Safety
```typescript
// If you change interface:
export interface PixelData {
  x: number;
  y: number;
  rgb: { r: number; g: number; b: number };  // Changed structure
  hex: string;
}

// TypeScript will show errors in all files that use PixelData
// You won't miss any usage
```

#### 4. Documentation
```typescript
/**
 * Processes an image and extracts pixel data
 * @param imageData - Canvas ImageData object
 * @returns Array of pixel data with RGB and HEX values
 */
function processImage(imageData: ImageData): PixelData[] {
  // ...
}
```

---

## Summary

### workers/pixelProcessor.ts
- **Purpose**: Background processing untuk ekstraksi pixel data
- **Input**: ImageData dari canvas
- **Output**: Array of PixelData objects
- **Key Feature**: Non-blocking, UI tetap responsive

### utils/imageUtils.ts
- **Purpose**: Helper functions untuk operasi umum
- **Functions**: RGB↔HEX conversion, validation, CSV generation, file size formatting
- **Key Feature**: Reusable, pure functions

### types/index.ts
- **Purpose**: Centralized type definitions
- **Benefits**: Type safety, IntelliSense, refactoring safety
- **Key Feature**: Single source of truth untuk types

---

**Next**: [05-DATA-FLOW.md](./05-DATA-FLOW.md) untuk penjelasan detail alur data aplikasi

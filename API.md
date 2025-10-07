# API Documentation

Dokumentasi untuk utility functions dan interfaces yang digunakan dalam aplikasi.

## Types & Interfaces

### PixelData

```typescript
interface PixelData {
  x: number;        // Koordinat X (0-based)
  y: number;        // Koordinat Y (0-based)
  r: number;        // Red channel (0-255)
  g: number;        // Green channel (0-255)
  b: number;        // Blue channel (0-255)
  hex: string;      // HEX color (#RRGGBB)
}
```

**Usage:**
```typescript
const pixel: PixelData = {
  x: 10,
  y: 20,
  r: 255,
  g: 128,
  b: 64,
  hex: "#ff8040"
};
```

### TooltipData

```typescript
interface TooltipData extends PixelData {
  visible: boolean;    // Tooltip visibility state
  clientX: number;     // Mouse X position (screen coordinates)
  clientY: number;     // Mouse Y position (screen coordinates)
}
```

**Usage:**
```typescript
const tooltipData: TooltipData = {
  x: 10,
  y: 20,
  r: 255,
  g: 128,
  b: 64,
  hex: "#ff8040",
  visible: true,
  clientX: 500,
  clientY: 300
};
```

### ImageDimensions

```typescript
interface ImageDimensions {
  width: number;     // Image width in pixels
  height: number;    // Image height in pixels
}
```

## Utility Functions

### Color Conversion

#### rgbToHex()

Convert RGB values to HEX color string.

```typescript
function rgbToHex(r: number, g: number, b: number): string
```

**Parameters:**
- `r` (number): Red value (0-255)
- `g` (number): Green value (0-255)
- `b` (number): Blue value (0-255)

**Returns:** String - HEX color (#RRGGBB)

**Example:**
```typescript
const hex = rgbToHex(255, 128, 64);
// Returns: "#ff8040"
```

#### hexToRgb()

Convert HEX color string to RGB values.

```typescript
function hexToRgb(hex: string): { r: number; g: number; b: number } | null
```

**Parameters:**
- `hex` (string): HEX color string (#RRGGBB or RRGGBB)

**Returns:** Object with r, g, b properties or null if invalid

**Example:**
```typescript
const rgb = hexToRgb("#ff8040");
// Returns: { r: 255, g: 128, b: 64 }

const invalid = hexToRgb("invalid");
// Returns: null
```

### File Utilities

#### formatFileSize()

Format file size in human-readable format.

```typescript
function formatFileSize(bytes: number): string
```

**Parameters:**
- `bytes` (number): File size in bytes

**Returns:** String - Formatted size (e.g., "1.5 MB")

**Example:**
```typescript
formatFileSize(1024);        // "1 KB"
formatFileSize(1048576);     // "1 MB"
formatFileSize(1536000);     // "1.46 MB"
```

#### validateImageFile()

Validate image file type and size.

```typescript
function validateImageFile(
  file: File,
  maxSizeInMB?: number
): { valid: boolean; error?: string }
```

**Parameters:**
- `file` (File): File object to validate
- `maxSizeInMB` (number, optional): Maximum size in MB (default: 50)

**Returns:** Object with validation result

**Example:**
```typescript
const result = validateImageFile(file, 50);
if (result.valid) {
  // File is valid
} else {
  alert(result.error);
}
```

### Color Analysis

#### calculateBrightness()

Calculate perceived brightness of a color.

```typescript
function calculateBrightness(r: number, g: number, b: number): number
```

**Parameters:**
- `r` (number): Red value (0-255)
- `g` (number): Green value (0-255)
- `b` (number): Blue value (0-255)

**Returns:** Number - Brightness value (0-255)

**Formula:** `(R * 299 + G * 587 + B * 114) / 1000`

**Example:**
```typescript
const brightness = calculateBrightness(255, 255, 255);
// Returns: 255 (white)

const brightness2 = calculateBrightness(0, 0, 0);
// Returns: 0 (black)
```

#### getContrastColor()

Determine if text should be light or dark based on background color.

```typescript
function getContrastColor(
  r: number,
  g: number,
  b: number
): "light" | "dark"
```

**Parameters:**
- `r` (number): Red value (0-255)
- `g` (number): Green value (0-255)
- `b` (number): Blue value (0-255)

**Returns:** String - "light" or "dark"

**Example:**
```typescript
getContrastColor(255, 255, 255);  // "dark" (use dark text on white)
getContrastColor(0, 0, 0);        // "light" (use light text on black)
```

### Data Export

#### generateCSV()

Generate CSV content from pixel data.

```typescript
function generateCSV(data: PixelData[]): string
```

**Parameters:**
- `data` (PixelData[]): Array of pixel data

**Returns:** String - CSV content

**Format:**
```csv
X,Y,R,G,B,HEX
0,0,255,128,64,#ff8040
1,0,200,100,50,#c86432
...
```

**Example:**
```typescript
const csv = generateCSV(pixelData);
// Returns CSV string with headers and data
```

#### downloadFile()

Download content as a file.

```typescript
function downloadFile(
  content: string,
  filename: string,
  mimeType?: string
): void
```

**Parameters:**
- `content` (string): File content
- `filename` (string): Name for downloaded file
- `mimeType` (string, optional): MIME type (default: "text/plain")

**Returns:** void

**Example:**
```typescript
downloadFile(
  csvContent,
  `rgb_matrix_${Date.now()}.csv`,
  "text/csv;charset=utf-8;"
);
```

## Component Props

### ImageUploader

```typescript
interface ImageUploaderProps {
  onFileSelect: (file: File) => void;
}
```

### ImageViewer

```typescript
interface ImageViewerProps {
  imageUrl: string;
  onImageClick: (imageData: ImageData) => void;
  onPixelHover: (data: TooltipData) => void;
  onImageLoad: (width: number, height: number) => void;
  isProcessing: boolean;
}
```

### PixelTooltip

```typescript
interface PixelTooltipProps {
  data: TooltipData;
}
```

### RgbTable

```typescript
interface RgbTableProps {
  data: PixelData[];
  imageWidth: number;
}
```

### ImageStats

```typescript
interface ImageStatsProps {
  data: PixelData[];
  imageWidth: number;
  imageHeight: number;
}
```

## Web Worker Messages

### Request Message (Main → Worker)

```typescript
interface WorkerMessage {
  imageData: ImageData;
}
```

**Example:**
```typescript
worker.postMessage({
  imageData: ctx.getImageData(0, 0, width, height)
});
```

### Response Message (Worker → Main)

```typescript
type WorkerResponse = PixelData[];
```

**Example:**
```typescript
worker.onmessage = (e: MessageEvent<PixelData[]>) => {
  const pixelData = e.data;
  // Process pixel data
};
```

## Canvas Operations

### Get Pixel Color

```typescript
function getPixelColor(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number
): { r: number; g: number; b: number } | null
```

**Example:**
```typescript
const ctx = canvas.getContext('2d', { willReadFrequently: true });
const imageData = ctx.getImageData(x, y, 1, 1);
const data = imageData.data;

const color = {
  r: data[0],
  g: data[1],
  b: data[2]
};
```

### Draw Image

```typescript
const img = new Image();
img.onload = () => {
  canvas.width = img.width;
  canvas.height = img.height;
  ctx.drawImage(img, 0, 0);
};
img.src = imageUrl;
```

## Virtual Scroll Configuration

### TanStack Virtual Options

```typescript
const rowVirtualizer = useVirtualizer({
  count: data.length,                    // Total number of items
  getScrollElement: () => parentRef.current,  // Scroll container
  estimateSize: () => 45,                // Estimated row height
  overscan: 10,                          // Extra rows to render
});
```

### Virtual Item

```typescript
interface VirtualItem {
  index: number;      // Item index
  start: number;      // Start position (px)
  size: number;       // Item size (px)
  end: number;        // End position (px)
  key: string;        // Unique key
}
```

## Error Handling

### File Validation Errors

```typescript
// Invalid file type
{
  valid: false,
  error: "File yang dipilih bukan gambar..."
}

// File too large
{
  valid: false,
  error: "Ukuran file terlalu besar..."
}
```

### Worker Errors

```typescript
worker.onerror = (error: ErrorEvent) => {
  console.error("Worker error:", error);
  // Handle error
};
```

### Canvas Errors

```typescript
img.onerror = () => {
  alert("Gagal memuat gambar...");
  // Handle error
};
```

## Performance Considerations

### Canvas Context Options

```typescript
const ctx = canvas.getContext('2d', {
  willReadFrequently: true,  // Optimize for frequent reads
  alpha: true                // Enable alpha channel
});
```

### Memory Management

```typescript
// Cleanup object URL
URL.revokeObjectURL(imageUrl);

// Terminate worker
worker.terminate();

// Clear canvas
ctx.clearRect(0, 0, canvas.width, canvas.height);
```

## Best Practices

1. **Always validate inputs**
   ```typescript
   if (!file || !file.type.startsWith('image/')) {
     return;
   }
   ```

2. **Handle async operations properly**
   ```typescript
   useEffect(() => {
     return () => {
       // Cleanup
     };
   }, [dependencies]);
   ```

3. **Use proper type guards**
   ```typescript
   if (!ctx || !canvas) return;
   ```

4. **Optimize re-renders**
   ```typescript
   const memoizedValue = useMemo(() => {
     // Expensive calculation
   }, [dependencies]);
   ```

---

**For more details, see the source code and inline comments.**

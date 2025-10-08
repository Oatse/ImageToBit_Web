# Data Flow & Lifecycle - Complete Application Flow

## Table of Contents
1. [Application Lifecycle](#application-lifecycle)
2. [Complete User Flow](#complete-user-flow)
3. [State Management Flow](#state-management-flow)
4. [Event Flow Diagrams](#event-flow-diagrams)
5. [Performance Optimization Flow](#performance-optimization-flow)
6. [Error Handling Flow](#error-handling-flow)

---

## Application Lifecycle

### 1. Initial Mount

```
Browser loads page
       ↓
Next.js renders app/layout.tsx
       ↓
Renders app/page.tsx (Client Component)
       ↓
Initialize all states with default values
       ↓
Render ImageUploader component
       ↓
Application ready - waiting for user input
```

**Initial State:**
```typescript
{
  imageFile: null,
  imageUrl: "",
  imageDimensions: null,
  pixelData: [],
  isProcessing: false,
  tooltipData: { visible: false, ... },
  showTable: false,
  workerRef: { current: null }
}
```

### 2. Cleanup on Unmount

```typescript
useEffect(() => {
  return () => {
    // Cleanup function
    if (workerRef.current) {
      workerRef.current.terminate();
    }
    if (imageUrl) {
      URL.revokeObjectURL(imageUrl);
    }
  };
}, [imageUrl]);
```

**Cleanup Flow:**
```
Component unmounting
       ↓
Cleanup function triggered
       ↓
Terminate Web Worker (if exists)
       ↓
Revoke Object URL (free memory)
       ↓
Component unmounted
```

---

## Complete User Flow

### Flow 1: Upload & Preview

```
┌────────────────────────────────────────────────────────────────┐
│                        USER ACTIONS                            │
└────────────────────────────────────────────────────────────────┘

1. User clicks "Pilih Gambar" button
   ↓
2. File input dialog opens
   ↓
3. User selects image file (e.g., landscape.jpg)
   ↓
4. File selected (File object)

┌────────────────────────────────────────────────────────────────┐
│                    APPLICATION PROCESSING                       │
└────────────────────────────────────────────────────────────────┘

ImageUploader Component:
   ↓
handleFileChange triggered
   ↓
validateImageFile(file, 50MB)
   │
   ├─ Check: Is image? ───► NO ──► Show error alert ──► END
   │                        
   └─ Check: Size OK? ────► NO ──► Show error alert ──► END
                            
                           YES
                            ↓
   onFileSelect(file) called
                            ↓

app/page.tsx:
   ↓
handleFileSelect receives file
   ↓
Reset previous state:
   - setPixelData([])
   - setShowTable(false)
   - setTooltipData({ visible: false })
   ↓
Cleanup old imageUrl (if exists):
   - URL.revokeObjectURL(imageUrl)
   ↓
Create new Object URL:
   - const url = URL.createObjectURL(file)
   ↓
Update state:
   - setImageFile(file)
   - setImageUrl(url)
   ↓

ImageViewer Component renders:
   ↓
useEffect triggered (imageUrl changed)
   ↓
Create new Image()
   ↓
img.src = imageUrl
   ↓
Image loading...
   ↓
img.onload triggered
   ↓
Set canvas dimensions:
   - canvas.width = img.width
   - canvas.height = img.height
   ↓
Draw image to canvas:
   - ctx.drawImage(img, 0, 0)
   ↓
Update state:
   - setImageDimensions({ width, height })
   - setImageLoaded(true)
   ↓
Callback to parent:
   - onImageLoad(width, height)
   ↓

┌────────────────────────────────────────────────────────────────┐
│                         RESULT                                 │
└────────────────────────────────────────────────────────────────┘

Image displayed on canvas
User can now:
   - Hover to inspect pixels
   - Click to process image
```

### Flow 2: Pixel Inspection (Hover)

```
┌────────────────────────────────────────────────────────────────┐
│                        USER ACTIONS                            │
└────────────────────────────────────────────────────────────────┘

User moves mouse over canvas
   ↓ (continuous)

┌────────────────────────────────────────────────────────────────┐
│                    APPLICATION PROCESSING                       │
└────────────────────────────────────────────────────────────────┘

ImageViewer Component:
   ↓
handleMouseMove triggered (every frame)
   ↓
Get canvas bounds:
   - const rect = canvas.getBoundingClientRect()
   ↓
Calculate scale:
   - scaleX = canvas.width / rect.width
   - scaleY = canvas.height / rect.height
   ↓
Transform mouse coordinates:
   - x = floor((e.clientX - rect.left) × scaleX)
   - y = floor((e.clientY - rect.top) × scaleY)
   ↓
Bounds check:
   - x ≥ 0 && x < canvas.width?
   - y ≥ 0 && y < canvas.height?
   ↓
   NO ──► onPixelHover({ visible: false }) ──► Hide tooltip
   │
   YES
   ↓
Get pixel color:
   - const imageData = ctx.getImageData(x, y, 1, 1)
   - r = data[0], g = data[1], b = data[2]
   ↓
Convert to HEX:
   - hex = rgbToHex(r, g, b)
   ↓
Call parent callback:
   - onPixelHover({
       x, y, r, g, b, hex,
       visible: true,
       clientX: e.clientX,
       clientY: e.clientY
     })
   ↓

app/page.tsx:
   ↓
handlePixelHover receives data
   ↓
Update state:
   - setTooltipData(data)
   ↓

PixelTooltip Component re-renders:
   ↓
Position at (clientX + 15, clientY + 15)
   ↓
Display:
   - Color preview box
   - HEX code
   - Coordinates (X, Y)
   - RGB values

┌────────────────────────────────────────────────────────────────┐
│                         RESULT                                 │
└────────────────────────────────────────────────────────────────┘

Tooltip follows mouse showing pixel info
Updates ~60 times per second (60 FPS)
```

### Flow 3: Image Processing

```
┌────────────────────────────────────────────────────────────────┐
│                        USER ACTIONS                            │
└────────────────────────────────────────────────────────────────┘

User clicks on canvas
   ↓

┌────────────────────────────────────────────────────────────────┐
│                    MAIN THREAD (UI)                            │
└────────────────────────────────────────────────────────────────┘

ImageViewer Component:
   ↓
handleClick triggered
   ↓
Check: imageLoaded? ──► NO ──► END
Check: isProcessing? ─► YES ─► END
   ↓
   Both OK
   ↓
Get full image data:
   - const imageData = ctx.getImageData(0, 0, width, height)
   ↓
Call parent:
   - onImageClick(imageData)
   ↓

app/page.tsx:
   ↓
handleImageClick receives imageData
   ↓
Update UI state:
   - setIsProcessing(true)
   - setShowTable(false)
   ↓
Check: Worker exists? ──► NO ──► Initialize worker
   │                              - Create Worker instance
   │                              - Setup onmessage handler
   │                              - Setup onerror handler
   │
   Worker ready
   ↓
Send data to worker:
   - workerRef.current.postMessage({ imageData })
   ↓

┌────────────────────────────────────────────────────────────────┐
│                    WEB WORKER THREAD                           │
└────────────────────────────────────────────────────────────────┘

Worker receives message
   ↓
Extract imageData properties:
   - const { width, height, data } = imageData
   ↓
Initialize pixelArray = []
   ↓
For y = 0 to height-1:
   ↓
   For x = 0 to width-1:
      ↓
      Calculate index = (y × width + x) × 4
      ↓
      Extract RGB:
         - r = data[index]
         - g = data[index + 1]
         - b = data[index + 2]
      ↓
      Convert to HEX:
         - hex = rgbToHex(r, g, b)
      ↓
      Push to array:
         - pixelArray.push({ x, y, r, g, b, hex })
      ↓
   End for x
   ↓
   (Optional) Send progress:
      - if (y % (height/10) === 0)
      - self.postMessage({ type: 'progress', progress: % })
   ↓
End for y
   ↓
All pixels processed
   ↓
Send result back:
   - self.postMessage(pixelArray)
   ↓

┌────────────────────────────────────────────────────────────────┐
│                    MAIN THREAD (UI)                            │
└────────────────────────────────────────────────────────────────┘

Worker onmessage triggered
   ↓
Receive pixelArray
   ↓
Update state:
   - setPixelData(pixelArray)
   - setIsProcessing(false)
   - setShowTable(true)
   ↓

Components re-render:
   ↓
ImageStats Component:
   - Calculate statistics
   - Display avg color, brightest, darkest
   ↓
RgbTable Component:
   - Initialize TanStack Virtual
   - Render visible rows only
   ↓

┌────────────────────────────────────────────────────────────────┐
│                         RESULT                                 │
└────────────────────────────────────────────────────────────────┘

Table displayed with all pixel data
User can now:
   - Scroll through data (virtual scrolling)
   - Search by coordinates
   - Toggle format (List/Matrix)
   - Export to CSV
```

### Flow 4: Export CSV

```
┌────────────────────────────────────────────────────────────────┐
│                        USER ACTIONS                            │
└────────────────────────────────────────────────────────────────┘

User clicks "Export CSV" button
   ↓

┌────────────────────────────────────────────────────────────────┐
│                    APPLICATION PROCESSING                       │
└────────────────────────────────────────────────────────────────┘

app/page.tsx:
   ↓
handleExportCSV triggered
   ↓
Check: pixelData.length > 0? ──► NO ──► END
   ↓
   YES
   ↓
Create CSV headers:
   - const headers = ["X", "Y", "R", "G", "B", "HEX"]
   ↓
Convert pixel data to CSV rows:
   - pixelData.map(pixel => 
       `${pixel.x},${pixel.y},${pixel.r},${pixel.g},${pixel.b},${pixel.hex}`
     )
   ↓
Combine headers + rows:
   - csvContent = [headers.join(","), ...rows].join("\n")
   ↓
Create Blob:
   - const blob = new Blob([csvContent], { type: "text/csv" })
   ↓
Create Object URL:
   - const url = URL.createObjectURL(blob)
   ↓
Create download link:
   - const link = document.createElement("a")
   - link.href = url
   - link.download = `rgb_matrix_${Date.now()}.csv`
   - link.style.visibility = "hidden"
   ↓
Trigger download:
   - document.body.appendChild(link)
   - link.click()
   ↓
Cleanup:
   - document.body.removeChild(link)
   - URL.revokeObjectURL(url)
   ↓

┌────────────────────────────────────────────────────────────────┐
│                         RESULT                                 │
└────────────────────────────────────────────────────────────────┘

CSV file downloaded to user's computer
Filename: rgb_matrix_<timestamp>.csv
Can be opened in Excel, Google Sheets, etc.
```

---

## State Management Flow

### State Dependencies

```
imageFile
   ↓
imageUrl (derived from imageFile)
   ↓
imageDimensions (set after image loads)
   ↓
pixelData (set after processing)
   ↓
showTable (enabled when pixelData ready)
```

### State Update Sequences

#### Sequence 1: File Upload
```
Action: User uploads file

setImageFile(file) ──┐
setImageUrl(url) ────┼──► Component re-renders
setPixelData([]) ────┤     ├─► ImageViewer mounts
setShowTable(false) ─┘     └─► Canvas draws image
```

#### Sequence 2: Image Processing
```
Action: User clicks canvas

setIsProcessing(true) ──► Loading overlay shows
         ↓
    Worker processes
         ↓
setPixelData(data) ──┐
setIsProcessing(false)┼──► Components re-render
setShowTable(true) ───┘     ├─► Stats component shows
                            └─► Table component shows
```

### State Synchronization

```typescript
// State updates are batched in React 18+
// Multiple setState calls in same function = single re-render

const handleFileSelect = (file: File) => {
  setImageFile(file);        // ┐
  setPixelData([]);          // ├─ Batched
  setShowTable(false);       // ├─ Single
  setTooltipData({ ... });   // ┘  re-render
};
```

---

## Event Flow Diagrams

### Mouse Hover Event Flow

```
User Mouse Move
       │
       ├─► Browser Mouse Event
       │        ↓
       │   onMouseMove handler
       │        ↓
       │   Calculate coordinates
       │        ↓
       │   Read pixel from canvas
       │        ↓
       │   Convert RGB to HEX
       │        ↓
       │   Update tooltip state
       │        ↓
       │   React re-render
       │        ↓
       └─► Tooltip position updated

Performance: ~16ms per frame (60 FPS)
Optimization: useCallback prevents function recreation
```

### Click Event Flow

```
User Click
    │
    ├─► Browser Click Event
    │        ↓
    │   onClick handler
    │        ↓
    │   Get ImageData from canvas
    │        ↓
    │   Send to Web Worker
    │        ↓
    │   [UI remains responsive]
    │        │
    │        │ (Worker processing in parallel)
    │        │
    │        ↓
    │   Worker completes
    │        ↓
    │   onmessage receives data
    │        ↓
    │   Update state
    │        ↓
    │   React re-render
    │        ↓
    └─► Table displayed
```

### Virtual Scroll Event Flow

```
User Scrolls Table
       │
       ├─► Browser Scroll Event
       │        ↓
       │   TanStack Virtual detects scroll
       │        ↓
       │   Calculate visible range
       │        ↓
       │   Determine rows to render
       │        ↓
       │   Update virtualItems array
       │        ↓
       │   React re-render (only visible rows)
       │        ↓
       └─► Smooth scrolling experience

Performance: Only ~20 DOM nodes for millions of rows
```

---

## Performance Optimization Flow

### 1. Virtual Scrolling Performance

```
WITHOUT Virtual Scrolling:
┌────────────────────────────────────┐
│ 1,000,000 rows                     │
│ × 7 cells per row                  │
│ × 1 DOM node per cell              │
│ = 7,000,000 DOM nodes              │
│                                    │
│ Result: Browser CRASH              │
└────────────────────────────────────┘

WITH Virtual Scrolling:
┌────────────────────────────────────┐
│ Visible rows: ~15                  │
│ Overscan rows: 10                  │
│ Total rendered: ~25                │
│ × 7 cells per row                  │
│ = ~175 DOM nodes                   │
│                                    │
│ Result: Smooth performance ✅      │
└────────────────────────────────────┘
```

### 2. Web Worker Performance

```
SCENARIO: 4000×3000 image (12 million pixels)

WITHOUT Web Worker:
┌────────────────────────────────────┐
│ Main Thread (UI)                   │
│                                    │
│ User clicks                        │
│   ↓                                │
│ Process 12M pixels (5 seconds)    │
│   │                                │
│   ├─ UI FROZEN                    │
│   ├─ No user interaction          │
│   └─ Browser "Not Responding"     │
│                                    │
│ Result: BAD UX ❌                  │
└────────────────────────────────────┘

WITH Web Worker:
┌────────────────────────────────────┐
│ Main Thread (UI)                   │
│                                    │
│ User clicks                        │
│   ↓                                │
│ Send to worker                     │
│   ↓                                │
│ UI REMAINS RESPONSIVE ✅           │
│   │                                │
│   ├─ User can scroll              │
│   ├─ Can click buttons            │
│   └─ See loading animation        │
│                                    │
│ (Worker processing in parallel)   │
│                                    │
│ Worker completes → Update UI       │
│                                    │
│ Result: GOOD UX ✅                 │
└────────────────────────────────────┘
```

### 3. React Performance Optimizations

```typescript
// 1. useCallback - Prevent function recreation
const handlePixelHover = useCallback((data: TooltipData) => {
  setTooltipData(data);
}, []); // Empty deps = function never recreated

// 2. useMemo - Cache expensive calculations
const stats = useMemo(() => {
  // Calculate statistics
  return { avgColor, brightest, darkest };
}, [data]); // Only recalculate when data changes

// 3. Conditional Rendering - Avoid unnecessary renders
{showTable && pixelData.length > 0 && (
  <RgbTable data={pixelData} />
)}

// 4. Key Props - Help React identify elements
{items.map((item) => (
  <div key={item.id}>{item.name}</div>
))}
```

### 4. Canvas Optimization

```typescript
// willReadFrequently flag
const ctx = canvas.getContext("2d", { willReadFrequently: true });

// What it does:
// - Browser optimizes memory layout for frequent pixel reading
// - Improves performance of getImageData() calls
// - Important for hover tooltip (60 calls per second)
```

---

## Error Handling Flow

### 1. File Upload Errors

```
User selects file
       ↓
validateImageFile()
       ↓
Is image? ──NO──► alert("File bukan gambar") ──► STOP
       ↓YES
Size OK? ──NO──► alert("Ukuran terlalu besar") ──► STOP
       ↓YES
Process file ──► SUCCESS
```

### 2. Image Loading Errors

```typescript
img.onerror = () => {
  alert("Gagal memuat gambar. Silakan coba lagi.");
  setImageLoaded(false);
};
```

**Possible causes:**
- Corrupted file
- Invalid image format
- Memory issues

### 3. Worker Errors

```typescript
workerRef.current.onerror = (error) => {
  console.error("Worker error:", error);
  setIsProcessing(false);
  alert("Terjadi kesalahan saat memproses gambar. Silakan coba lagi.");
};
```

**Possible causes:**
- Out of memory
- Invalid ImageData
- Worker script error

### 4. Bounds Checking

```typescript
// Coordinate search
if (index < 0 || index >= data.length) {
  alert("Koordinat di luar jangkauan gambar");
  return;
}

// Mouse position
if (x < 0 || x >= canvas.width || y < 0 || y >= canvas.height) {
  // Hide tooltip
  return;
}
```

---

## Complete Application State Machine

```
┌─────────────────────────────────────────────────────────────────┐
│                         IDLE STATE                              │
│                                                                 │
│  - No image loaded                                              │
│  - Showing "Pilih Gambar" button                               │
└────────────────────┬────────────────────────────────────────────┘
                     │
                     │ User uploads file
                     ↓
┌─────────────────────────────────────────────────────────────────┐
│                      IMAGE LOADED STATE                         │
│                                                                 │
│  - Image displayed on canvas                                    │
│  - Tooltip shows on hover                                       │
│  - Ready to process                                             │
└────────────────────┬────────────────────────────────────────────┘
                     │
                     │ User clicks canvas
                     ↓
┌─────────────────────────────────────────────────────────────────┐
│                    PROCESSING STATE                             │
│                                                                 │
│  - Loading overlay visible                                      │
│  - Worker processing in background                              │
│  - UI still responsive                                          │
└────────────────────┬────────────────────────────────────────────┘
                     │
                     │ Worker completes
                     ↓
┌─────────────────────────────────────────────────────────────────┐
│                      DATA READY STATE                           │
│                                                                 │
│  - Statistics displayed                                         │
│  - Table with all pixel data                                    │
│  - Can search coordinates                                       │
│  - Can export CSV                                               │
│  - Can upload new image (returns to IDLE)                      │
└─────────────────────────────────────────────────────────────────┘
```

---

## Summary

### Key Data Flow Patterns

1. **Unidirectional Data Flow**: Props down, events up
2. **State Lifting**: State in parent, controlled components
3. **Async Processing**: Web Workers for heavy computation
4. **Performance**: Virtual scrolling, memoization, callbacks
5. **Error Handling**: Validation at every step
6. **Memory Management**: Proper cleanup of resources

### Performance Metrics

- **Initial Load**: < 1 second
- **Image Upload**: < 100ms
- **Image Preview**: < 500ms
- **Hover Tooltip**: 60 FPS (16ms/frame)
- **Processing (1000×1000)**: ~500ms
- **Processing (4000×3000)**: ~2-5 seconds
- **Table Render**: < 100ms (any size)
- **Scroll Performance**: 60 FPS

### Critical Paths

1. **File Upload → Preview**: Must be fast
2. **Hover → Tooltip**: Must be smooth (60 FPS)
3. **Click → Processing**: Must not block UI
4. **Data → Table**: Must handle millions of rows

---

**Next**: [06-CONFIGURATION.md](./06-CONFIGURATION.md) untuk penjelasan konfigurasi Next.js, TypeScript, dan Tailwind

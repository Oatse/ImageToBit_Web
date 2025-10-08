# Arsitektur Aplikasi - Image to RGB Matrix Converter

## Table of Contents
1. [Struktur Folder](#struktur-folder)
2. [Arsitektur Teknis](#arsitektur-teknis)
3. [Data Flow](#data-flow)
4. [State Management](#state-management)
5. [Component Architecture](#component-architecture)
6. [Performance Strategy](#performance-strategy)

---

## Struktur Folder

```
ImageToBit_Web/
├── app/                          # Next.js App Router
│   ├── layout.tsx               # Root layout dengan metadata
│   ├── page.tsx                 # Main page - orchestrator semua komponen
│   ├── globals.css              # Global styles + Tailwind directives
│   └── opengraph-image.tsx      # OG image untuk social sharing
│
├── components/                   # React Components (Client-side)
│   ├── ImageUploader.tsx        # Upload file component
│   ├── ImageViewer.tsx          # Canvas viewer + mouse interaction
│   ├── PixelTooltip.tsx         # Floating tooltip untuk pixel info
│   ├── RgbTable.tsx             # Virtual table dengan TanStack
│   └── ImageStats.tsx           # Statistik gambar (avg color, brightest, darkest)
│
├── workers/                      # Web Workers
│   └── pixelProcessor.ts        # Background pixel data extraction
│
├── types/                        # TypeScript Type Definitions
│   └── index.ts                 # Shared types & interfaces
│
├── utils/                        # Utility Functions
│   └── imageUtils.ts            # Helper functions (RGB/HEX, validation, CSV)
│
├── docs/                         # Documentation
│   ├── 01-OVERVIEW.md
│   ├── 02-ARCHITECTURE.md
│   └── ...
│
├── public/                       # Static Assets
│   └── icon.svg                 # App icon
│
├── next.config.ts               # Next.js configuration
├── tailwind.config.ts           # Tailwind CSS configuration
├── tsconfig.json                # TypeScript configuration
├── postcss.config.mjs           # PostCSS configuration
├── package.json                 # Dependencies & scripts
└── README.md                    # Project documentation
```

---

## Arsitektur Teknis

### 1. Next.js App Router Architecture

```
┌────────────────────────────────────────────────────┐
│                   Next.js 15                       │
│                  App Router                        │
│                                                    │
│  ┌──────────────────────────────────────────────┐ │
│  │           app/layout.tsx                     │ │
│  │  - HTML structure                            │ │
│  │  - Metadata (SEO)                            │ │
│  │  - Global CSS import                         │ │
│  └──────────────────┬───────────────────────────┘ │
│                     │                              │
│                     ↓                              │
│  ┌──────────────────────────────────────────────┐ │
│  │           app/page.tsx                       │ │
│  │  - State Management                          │ │
│  │  - Component Orchestration                   │ │
│  │  - Event Handlers                            │ │
│  │  - Web Worker Management                     │ │
│  └──────────────────────────────────────────────┘ │
│                                                    │
└────────────────────────────────────────────────────┘
```

### 2. Multi-Threading Architecture

```
┌─────────────────────────────────────────────────────┐
│                 Browser Environment                 │
│                                                     │
│  ┌───────────────────────────────────────────────┐ │
│  │         MAIN THREAD (UI Thread)               │ │
│  │                                               │ │
│  │  - React Rendering                            │ │
│  │  - User Interactions                          │ │
│  │  - State Updates                              │ │
│  │  - Canvas Drawing                             │ │
│  │  - DOM Manipulations                          │ │
│  │                                               │ │
│  └────────────────┬──────────────────────────────┘ │
│                   │                                 │
│                   │ postMessage()                   │
│                   │ (Send ImageData)                │
│                   ↓                                 │
│  ┌───────────────────────────────────────────────┐ │
│  │      WEB WORKER THREAD (Background)           │ │
│  │                                               │ │
│  │  workers/pixelProcessor.ts                    │ │
│  │                                               │ │
│  │  - Loop through pixels                        │ │
│  │  - Extract RGB values                         │ │
│  │  - Convert to HEX                             │ │
│  │  - Build pixel array                          │ │
│  │                                               │ │
│  └────────────────┬──────────────────────────────┘ │
│                   │                                 │
│                   │ postMessage()                   │
│                   │ (Send PixelData[])              │
│                   ↓                                 │
│  ┌───────────────────────────────────────────────┐ │
│  │         MAIN THREAD (Receive Result)          │ │
│  │                                               │ │
│  │  - Update State                               │ │
│  │  - Render Table                               │ │
│  │  - Enable Export                              │ │
│  │                                               │ │
│  └───────────────────────────────────────────────┘ │
│                                                     │
└─────────────────────────────────────────────────────┘
```

**Keuntungan Multi-Threading:**
- UI tetap responsive saat processing
- Tidak ada freeze/lag
- Background processing untuk heavy computation
- Better user experience

---

## Data Flow

### 1. Upload & Preview Flow

```
User Action                 Component                State Update
──────────────────────────────────────────────────────────────
                                                    
  📁 Select File   →    ImageUploader          →    imageFile
                         │                          imageUrl
                         │ onFileSelect()
                         ↓
                    validateImageFile()
                         │
                         ↓
                    URL.createObjectURL()
                         │
                         ↓
                    ImageViewer
                         │
                         ↓
                    Canvas Rendering
                         │
                         ↓
                    onImageLoad()            →    imageDimensions
```

### 2. Pixel Inspection Flow

```
User Action                 Component                State Update
──────────────────────────────────────────────────────────────

  🖱️ Mouse Move   →    ImageViewer            →    tooltipData
                         │
                         ↓
                    Calculate Canvas Coords
                         │
                         ↓
                    ctx.getImageData(x, y, 1, 1)
                         │
                         ↓
                    Extract RGB values
                         │
                         ↓
                    Convert to HEX
                         │
                         ↓
                    onPixelHover()           →    tooltipData.visible = true
                         │
                         ↓
                    PixelTooltip renders
```

### 3. Processing Flow

```
User Action                 Component                State Update
──────────────────────────────────────────────────────────────

  👆 Click Image  →    ImageViewer            →    isProcessing = true
                         │
                         ↓
                    ctx.getImageData(0, 0, w, h)
                         │
                         ↓
                    onImageClick(imageData)
                         │
                         ↓
                    app/page.tsx
                         │
                         ↓
                    Initialize Web Worker
                         │
                         ↓
                    worker.postMessage({imageData})
                         │
                         ↓
                    ┌────────────────────┐
                    │  Web Worker        │
                    │  pixelProcessor.ts │
                    │                    │
                    │  Loop pixels       │
                    │  Extract RGB       │
                    │  Convert HEX       │
                    │  Build array       │
                    └────────┬───────────┘
                             │
                             ↓
                    worker.onmessage
                         │
                         ↓
                    setPixelData(data)   →    pixelData
                    setIsProcessing(false)    isProcessing = false
                    setShowTable(true)        showTable = true
                         │
                         ↓
                    ImageStats renders
                         │
                         ↓
                    RgbTable renders
```

### 4. Export Flow

```
User Action                 Component                Browser Action
──────────────────────────────────────────────────────────────

  💾 Export CSV   →    app/page.tsx
                         │
                         ↓
                    handleExportCSV()
                         │
                         ↓
                    Generate CSV content
                         │
                         ↓
                    Create Blob
                         │
                         ↓
                    Create Object URL
                         │
                         ↓
                    Create <a> element
                         │
                         ↓
                    Trigger download     →    Browser downloads file
                         │
                         ↓
                    Cleanup URL
```

---

## State Management

### Main State (app/page.tsx)

```typescript
// File yang diupload
const [imageFile, setImageFile] = useState<File | null>(null);

// URL untuk display di canvas
const [imageUrl, setImageUrl] = useState<string>("");

// Dimensi gambar (width, height)
const [imageDimensions, setImageDimensions] = useState<{
  width: number;
  height: number;
} | null>(null);

// Array data piksel hasil processing
const [pixelData, setPixelData] = useState<PixelData[]>([]);

// Status loading saat processing
const [isProcessing, setIsProcessing] = useState(false);

// Data untuk tooltip hover
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

// Flag untuk menampilkan tabel
const [showTable, setShowTable] = useState(false);

// Reference ke Web Worker
const workerRef = useRef<Worker | null>(null);
```

### State Transitions

```
Initial State
     ↓
[imageFile = null]
     ↓
User Upload
     ↓
[imageFile = File, imageUrl = "blob:..."]
     ↓
Image Loaded
     ↓
[imageDimensions = {width, height}]
     ↓
User Click
     ↓
[isProcessing = true]
     ↓
Worker Processing
     ↓
[isProcessing = false, pixelData = [...], showTable = true]
     ↓
Table Visible
     ↓
User Export
     ↓
CSV Downloaded
```

---

## Component Architecture

### 1. Container Component (app/page.tsx)

**Responsibility:**
- State management untuk seluruh aplikasi
- Koordinasi antar komponen
- Event handling dan data flow
- Web Worker lifecycle management

**Key Functions:**
```typescript
handleFileSelect(file: File)        // Upload handler
handleImageLoad(w: number, h: number) // Dimension tracker
handleImageClick(imageData: ImageData) // Process trigger
handlePixelHover(data: TooltipData)    // Tooltip updater
handleExportCSV()                      // CSV generator
```

### 2. Presentational Components

#### ImageUploader
```typescript
Props: {
  onFileSelect: (file: File) => void
}

Responsibilities:
- File input UI
- File validation
- Error messages
```

#### ImageViewer
```typescript
Props: {
  imageUrl: string
  onImageClick: (imageData: ImageData) => void
  onPixelHover: (data: TooltipData) => void
  onImageLoad: (width: number, height: number) => void
  isProcessing: boolean
}

Responsibilities:
- Canvas rendering
- Mouse tracking
- Pixel color reading
- Loading overlay
```

#### PixelTooltip
```typescript
Props: {
  data: TooltipData
}

Responsibilities:
- Fixed positioning
- Color preview
- Coordinate display
```

#### ImageStats
```typescript
Props: {
  data: PixelData[]
  imageWidth: number
  imageHeight: number
}

Responsibilities:
- Calculate statistics
- Display average color
- Find brightest/darkest pixels
```

#### RgbTable
```typescript
Props: {
  data: PixelData[]
  imageWidth: number
}

Responsibilities:
- Virtual scrolling
- Coordinate search
- Format toggle
- Row rendering
```

---

## Performance Strategy

### 1. Virtual Scrolling (TanStack Virtual)

```typescript
// Hanya render visible rows
const rowVirtualizer = useVirtualizer({
  count: data.length,              // Total rows
  getScrollElement: () => parentRef.current,
  estimateSize: () => 45,          // Row height
  overscan: 10,                    // Extra rows above/below
});

// Render only visible items
rowVirtualizer.getVirtualItems().map((virtualRow) => {
  // Render row at virtualRow.index
});
```

**Benefits:**
- Memory efficient (hanya ~20 DOM nodes untuk jutaan data)
- Smooth scrolling
- Fast rendering

### 2. Web Worker Processing

```typescript
// Initialize worker
workerRef.current = new Worker(
  new URL("../workers/pixelProcessor.ts", import.meta.url)
);

// Send data
workerRef.current.postMessage({ imageData });

// Receive result
workerRef.current.onmessage = (e: MessageEvent<PixelData[]>) => {
  setPixelData(e.data);
};
```

**Benefits:**
- Non-blocking processing
- UI remains responsive
- Better for large images

### 3. React Optimizations

```typescript
// Memoized callbacks
const handlePixelHover = useCallback((data: TooltipData) => {
  setTooltipData(data);
}, []);

// Memoized expensive calculations
const stats = useMemo(() => {
  // Calculate statistics
}, [data]);
```

### 4. Canvas Optimization

```typescript
// willReadFrequently untuk performa reading
const ctx = canvas.getContext("2d", { willReadFrequently: true });

// Scale calculation untuk koordinat akurat
const scaleX = canvas.width / rect.width;
const scaleY = canvas.height / rect.height;
```

### 5. Memory Management

```typescript
// Cleanup on unmount
useEffect(() => {
  return () => {
    if (workerRef.current) {
      workerRef.current.terminate();  // Terminate worker
    }
    if (imageUrl) {
      URL.revokeObjectURL(imageUrl);  // Free memory
    }
  };
}, [imageUrl]);
```

---

## Technology Stack Deep Dive

### Next.js 15 (App Router)
- **Server Components**: Default untuk performance
- **Client Components**: "use client" untuk interactivity
- **File-based Routing**: Automatic route generation
- **Built-in Optimization**: Image optimization, code splitting

### React 19
- **Hooks**: useState, useEffect, useCallback, useMemo, useRef
- **Component Model**: Functional components only
- **Event System**: Synthetic events untuk cross-browser compatibility

### TypeScript 5
- **Type Safety**: Compile-time error checking
- **IntelliSense**: Better IDE support
- **Interfaces**: Strict prop types dan data structures

### Tailwind CSS 3.4
- **Utility Classes**: Rapid styling
- **Dark Mode**: Built-in dark theme support
- **Responsive**: Mobile-first design
- **Customization**: Extended color palette

### TanStack Virtual 3.10
- **Virtual Scrolling**: Efficient rendering
- **Smooth Scroll**: Built-in smooth scrolling
- **Flexible**: Support both row dan column virtualization

---

**Next**: [03-COMPONENT-DETAILS.md](./03-COMPONENT-DETAILS.md) untuk penjelasan detail setiap komponen

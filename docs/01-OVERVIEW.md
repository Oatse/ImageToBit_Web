# Overview - Image to RGB Matrix Converter

## Deskripsi Proyek

**Image to RGB Matrix Converter** adalah aplikasi web interaktif yang dirancang untuk mengkonversi gambar digital menjadi tabel matriks RGB yang dapat dianalisis. Aplikasi ini dibangun dengan teknologi web modern untuk memberikan performa tinggi bahkan saat memproses gambar berukuran besar dengan jutaan piksel.

## Tujuan Proyek

Aplikasi ini dibuat untuk keperluan:
- **Analisis Citra Digital**: Memahami komposisi warna setiap piksel dalam gambar
- **Pengolahan Citra**: Mendapatkan data numerik RGB dari gambar untuk penelitian dan pembelajaran
- **Ekspor Data**: Menyediakan data piksel dalam format CSV untuk analisis lebih lanjut
- **Visualisasi Real-time**: Inspeksi piksel secara interaktif dengan hover mouse

## Fitur Utama

### 1. Upload dan Preview Gambar
- Mendukung format JPG, PNG, dan format gambar umum lainnya
- Validasi ukuran file (maksimal 50MB)
- Preview gambar dengan canvas HTML5
- Menampilkan dimensi gambar secara real-time

### 2. Inspeksi Piksel Real-time
- **Hover Tooltip**: Gerakkan mouse di atas gambar untuk melihat informasi piksel
- Menampilkan koordinat (X, Y)
- Menampilkan nilai RGB (Red, Green, Blue)
- Menampilkan kode warna HEX
- Preview warna piksel dalam tooltip

### 3. Pemrosesan Gambar Asinkron
- Menggunakan **Web Workers** untuk pemrosesan di background
- UI tetap responsif saat memproses gambar besar
- Tidak ada freeze atau lag pada interface
- Progress processing yang smooth

### 4. Tabel Matriks RGB Virtual
- **TanStack React Virtual** untuk performa optimal
- Dapat menampilkan jutaan baris data tanpa lag
- Hanya me-render baris yang terlihat di viewport
- Smooth scrolling dengan virtualisasi

### 5. Dua Format Tampilan
- **Format List**: Tampilan baris per baris (X, Y, R, G, B, HEX, Color)
- **Format Matrix**: Tampilan per baris gambar dengan kolom per piksel

### 6. Pencarian Koordinat
- Input X dan Y untuk mencari piksel tertentu
- Jump langsung ke baris data piksel yang dicari
- Smooth scroll animation ke koordinat target

### 7. Statistik Gambar
- Dimensi gambar (width × height)
- Total jumlah piksel
- Rata-rata warna (Average RGB)
- Piksel paling terang (brightest)
- Piksel paling gelap (darkest)

### 8. Ekspor Data CSV
- Download seluruh data matriks RGB
- Format CSV dengan header: X, Y, R, G, B, HEX
- File naming dengan timestamp
- Kompatibel dengan Excel, Google Sheets, dan tools analisis data lainnya

### 9. User Experience
- **Dark Mode**: Mendukung tema gelap dan terang
- **Responsive Design**: Optimal di desktop, tablet, dan mobile
- **Loading States**: Feedback visual saat processing
- **Error Handling**: Validasi input dan penanganan error yang informatif

## Teknologi yang Digunakan

### Core Framework
- **Next.js 15**: React framework dengan App Router untuk routing dan rendering
- **React 19**: Library UI untuk membangun komponen interaktif
- **TypeScript 5**: Type safety dan developer experience yang lebih baik

### Styling
- **Tailwind CSS 3.4**: Utility-first CSS framework untuk styling cepat dan konsisten
- **CSS Custom Properties**: Untuk tema dark mode

### Performance Optimization
- **TanStack React Virtual 3.10**: Virtual scrolling untuk tabel dengan jutaan baris
- **Web Workers API**: Background processing untuk mencegah UI blocking
- **HTML5 Canvas API**: Rendering dan pixel manipulation yang efisien

### Build Tools
- **PostCSS**: CSS processing dengan Autoprefixer
- **ESLint**: Code linting untuk konsistensi kode
- **TypeScript Compiler**: Type checking dan transpilation

## Arsitektur Aplikasi

### Client-Side Architecture
```
┌─────────────────────────────────────────┐
│         Browser (Client)                │
│                                         │
│  ┌───────────────────────────────────┐ │
│  │     Main Thread (UI)              │ │
│  │  - React Components               │ │
│  │  - State Management               │ │
│  │  - User Interactions              │ │
│  │  - Canvas Rendering               │ │
│  └───────────────┬───────────────────┘ │
│                  │                      │
│                  │ postMessage          │
│                  ↓                      │
│  ┌───────────────────────────────────┐ │
│  │  Web Worker (Background Thread)   │ │
│  │  - Image Data Processing          │ │
│  │  - RGB Extraction                 │ │
│  │  - HEX Conversion                 │ │
│  └───────────────────────────────────┘ │
└─────────────────────────────────────────┘
```

### Component Hierarchy
```
App (page.tsx)
├── ImageUploader
│   └── File Input & Validation
├── ImageViewer
│   ├── Canvas Rendering
│   ├── Mouse Tracking
│   └── Click Handler
├── PixelTooltip
│   └── Real-time Pixel Info
├── ImageStats
│   └── Statistical Analysis
└── RgbTable
    ├── TanStack Virtual
    ├── Search Controls
    └── Format Toggle
```

## Data Flow

1. **Upload Stage**
   ```
   User → File Input → Validation → Object URL → Canvas Rendering
   ```

2. **Inspection Stage**
   ```
   Mouse Move → Canvas Coordinates → Get Pixel Color → Update Tooltip
   ```

3. **Processing Stage**
   ```
   Click → Get ImageData → Web Worker → Process Pixels → Update State → Show Table
   ```

4. **Export Stage**
   ```
   Export Button → Generate CSV → Create Blob → Download File
   ```

## Performance Optimizations

### 1. Virtual Scrolling
- Hanya render 10-20 baris yang visible
- Smooth scrolling dengan minimal re-renders
- Memory efficient untuk jutaan data points

### 2. Web Workers
- Pixel processing di background thread
- UI thread tetap responsive
- No blocking operations

### 3. Canvas Optimization
- `willReadFrequently` context option
- Efficient pixel reading
- Proper coordinate scaling

### 4. React Optimizations
- `useCallback` untuk stable function references
- `useMemo` untuk expensive calculations
- Proper dependency arrays

### 5. Memory Management
- Cleanup object URLs
- Terminate workers on unmount
- Proper event listener cleanup

## Browser Compatibility

- **Chrome/Edge**: Full support (Recommended)
- **Firefox**: Full support
- **Safari**: Full support
- **Mobile Browsers**: Responsive design support

## File Size Limits

- **Maximum Image Size**: 50MB
- **Recommended**: < 10MB untuk performa optimal
- **Large Images**: May take longer to process (e.g., 4000×3000 pixels)

## Use Cases

1. **Pendidikan**: Pembelajaran pengolahan citra digital
2. **Penelitian**: Analisis komposisi warna gambar
3. **Development**: Testing dan debugging image processing algorithms
4. **Data Analysis**: Ekspor data piksel untuk analisis statistik

## Keunggulan

✅ **High Performance**: Dapat handle gambar besar tanpa lag  
✅ **User Friendly**: Interface intuitif dan mudah digunakan  
✅ **Modern Stack**: Built with latest web technologies  
✅ **Type Safe**: Full TypeScript untuk mengurangi bugs  
✅ **Responsive**: Works on all device sizes  
✅ **Offline Capable**: Processing happens on client-side  
✅ **No Server Required**: Fully client-side application  
✅ **Privacy**: Data tidak dikirim ke server  

## Limitasi

⚠️ **Client-Side Only**: Membutuhkan browser modern  
⚠️ **Memory Intensive**: Gambar sangat besar dapat memakan banyak RAM  
⚠️ **Processing Time**: Gambar besar membutuhkan waktu processing lebih lama  

## Roadmap & Future Enhancements

- [ ] Drag & drop file upload
- [ ] Multiple image comparison
- [ ] Color histogram visualization
- [ ] Image filtering and effects
- [ ] Batch processing
- [ ] Export to JSON format
- [ ] PWA support for offline usage
- [ ] Image compression before processing

---

**Dibuat untuk**: Tugas Pengolahan Citra Digital  
**Tech Stack**: Next.js 15, React 19, TypeScript, Tailwind CSS, TanStack Virtual  
**License**: Open Source

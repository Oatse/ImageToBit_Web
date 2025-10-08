# Fitur Zoom untuk Table Matrix

## Overview
Fitur zoom in dan zoom out telah ditambahkan untuk format matrix pada tabel RGB, memungkinkan pengguna untuk memperbesar atau memperkecil tampilan cell matrix untuk visibilitas yang lebih baik.

## Fitur yang Ditambahkan

### 1. Kontrol Zoom
- **Zoom In**: Memperbesar ukuran cell sebesar 25%
- **Zoom Out**: Memperkecil ukuran cell sebesar 25%
- **Reset**: Mengembalikan zoom ke 100% (ukuran default)

### 2. Range Zoom
- **Minimum**: 50% (setengah dari ukuran default)
- **Maximum**: 200% (dua kali lipat dari ukuran default)
- **Default**: 100% (ukuran asli)

### 3. Perubahan UI
- Kontrol zoom muncul di sebelah kanan toggle format (hanya saat format matrix aktif)
- Ikon zoom menggunakan SVG dengan magnifying glass (kaca pembesar)
- Indikator persentase zoom ditampilkan di tengah kontrol
- Tombol zoom di-disable ketika mencapai batas minimum/maximum

## Implementasi Teknis

### State Management
```typescript
const [zoomLevel, setZoomLevel] = useState(100); // Zoom level dalam persentase
```

### Perhitungan Dimensi
```typescript
const baseCellWidth = 128; // Base width (w-32 = 128px)
const baseCellHeight = 60; // Base row height
const cellWidth = (baseCellWidth * zoomLevel) / 100;
const cellHeight = (baseCellHeight * zoomLevel) / 100;
```

### Font Size Responsif
Font size pada cell matrix juga menyesuaikan dengan zoom level:
```typescript
const fontSize = Math.max(8, (12 * zoomLevel) / 100);
```

### Virtualisasi
Virtual scroller secara otomatis di-update ketika zoom level berubah menggunakan `useEffect`:
```typescript
useEffect(() => {
  if (tableFormat === "matrix") {
    rowVirtualizer.measure();
  }
}, [zoomLevel, tableFormat, rowVirtualizer]);
```

## Cara Penggunaan

1. Pastikan tabel dalam mode "Format Matrix"
2. Gunakan tombol zoom yang muncul di kanan atas:
   - Klik ikon "−" (minus dalam kaca pembesar) untuk zoom out
   - Klik ikon "+" (plus dalam kaca pembesar) untuk zoom in
   - Klik "Reset" untuk kembali ke ukuran default
3. Persentase zoom saat ini ditampilkan di tengah kontrol

## Manfaat

- **Fleksibilitas Tampilan**: Pengguna dapat menyesuaikan ukuran cell sesuai kebutuhan
- **Detail Lebih Baik**: Zoom in membantu melihat detail RGB value dengan lebih jelas
- **Overview Lebih Luas**: Zoom out memungkinkan melihat lebih banyak data sekaligus
- **Responsif**: Font size dan dimensi cell menyesuaikan secara proporsional

## Catatan

- Fitur zoom hanya aktif pada format matrix (tidak tersedia pada format list)
- Zoom tidak mempengaruhi data yang ditampilkan, hanya ukuran visual
- Perubahan zoom tidak mengubah state pencarian koordinat
- Virtual scrolling tetap berfungsi optimal pada semua level zoom

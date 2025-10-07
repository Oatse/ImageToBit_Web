# Fitur Toggle Format Tabel RGB

## Deskripsi
Fitur ini menambahkan kemampuan untuk beralih antara dua format tampilan tabel data piksel RGB:

### 1. Format List (Default)
Format tabel tradisional dengan kolom terpisah:
- X: Koordinat horizontal
- Y: Koordinat vertikal
- R: Nilai merah (0-255)
- G: Nilai hijau (0-255)
- B: Nilai biru (0-255)
- HEX: Kode warna heksadesimal
- Warna: Preview warna visual

### 2. Format Matrix (Baru)
Format tabel matriks dengan:
- **Baris**: Koordinat Y (0, 1, 2, ...)
- **Kolom**: Koordinat X (0, 1, 2, ...)
- **Sel**: Tuple RGB dalam format `(R,G,B)`

Contoh Format Matrix:
```
Y \ X |   0        |   1        |   2        | ...
------+------------+------------+------------+----
  0   | (255,128,64) | (128,255,32) | (64,128,255) | ...
  1   | (200,100,50) | (100,200,25) | (50,100,200) | ...
  2   | (150,75,40)  | (75,150,20)  | (40,75,150)  | ...
```

## Penggunaan

1. **Memilih Format**:
   - Klik tombol "Format List" untuk tampilan list tradisional
   - Klik tombol "Format Matrix" untuk tampilan matriks

2. **Fitur Tambahan**:
   - Kedua format mendukung virtual scrolling untuk performa optimal
   - Hover pada sel matrix menampilkan tooltip dengan nilai RGB lengkap
   - Pencarian koordinat tetap berfungsi di kedua format

## Implementasi Teknis

### Perubahan File
- `components/RgbTable.tsx`: Ditambahkan state `tableFormat` dan logika rendering kondisional

### Fitur Virtual Scrolling
- Format List: Menampilkan baris per piksel
- Format Matrix: Menampilkan baris per koordinat Y

### Responsivitas
- Format Matrix menggunakan scroll horizontal untuk gambar yang lebar
- Lebar kolom tetap (32 unit) untuk konsistensi tampilan

## Kelebihan Format Matrix
- ✅ Visualisasi spasial yang lebih baik
- ✅ Mudah melihat pola warna dalam gambar
- ✅ Cocok untuk gambar berukuran kecil hingga menengah
- ✅ Format compact untuk dokumentasi

## Kelebihan Format List
- ✅ Menampilkan semua informasi termasuk HEX dan preview warna
- ✅ Lebih mudah untuk mencari nilai spesifik
- ✅ Cocok untuk analisis detail per piksel

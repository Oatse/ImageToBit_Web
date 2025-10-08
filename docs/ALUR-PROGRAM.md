# 📖 Panduan Alur Program ImageToBit Web

Dokumen ini menjelaskan bagaimana aplikasi ImageToBit Web bekerja dari awal hingga akhir dengan bahasa yang mudah dipahami.

---

## 🎯 Apa yang Dilakukan Aplikasi Ini?

Aplikasi ini adalah website yang memungkinkan pengguna untuk:
1. **Mengunggah gambar** dari komputer
2. **Melihat gambar** dalam berbagai format (Original, Grayscale, Binary)
3. **Melihat informasi detail** tentang gambar (ukuran, tipe file, dll)
4. **Melihat data pixel** dalam bentuk tabel warna RGB

---

## 🗂️ Struktur File dan Fungsinya

### 📁 **Folder `app/`** - Halaman Utama
Berisi file-file yang mengatur tampilan dan struktur halaman website.

#### 1. **`page.tsx`** - Halaman Utama
- **Fungsi**: Ini adalah halaman yang pertama kali Anda lihat saat membuka website
- **Apa yang dilakukan**:
  - Menampilkan judul "ImageToBit Web"
  - Menampilkan area untuk upload gambar
  - Mengatur tata letak semua komponen di halaman
  - Mengelola gambar yang dipilih pengguna

#### 2. **`layout.tsx`** - Kerangka Website
- **Fungsi**: Mengatur struktur dasar seluruh website
- **Apa yang dilakukan**:
  - Mengatur font yang digunakan (Geist Sans dan Geist Mono)
  - Mengatur metadata (judul, deskripsi, icon)
  - Menyediakan kerangka HTML dasar

#### 3. **`globals.css`** - Gaya Tampilan
- **Fungsi**: Mengatur warna, ukuran, dan gaya visual seluruh website
- **Apa yang dilakukan**:
  - Mengatur tema warna (gelap/terang)
  - Mengatur animasi dan efek visual
  - Mengatur tampilan scrollbar dan elemen UI

---

### 📁 **Folder `components/`** - Komponen UI
Berisi komponen-komponen yang bisa digunakan berkali-kali di berbagai tempat.

#### 1. **`ImageUploader.tsx`** - Area Upload Gambar
- **Fungsi**: Tempat pengguna mengunggah gambar
- **Apa yang dilakukan**:
  - Menampilkan area drag & drop untuk gambar
  - Tombol "Choose File" untuk memilih gambar
  - Menerima file gambar (JPG, PNG, WebP, AVIF)
  - Memberitahu jika ada error (file terlalu besar/format salah)
  - Menampilkan preview gambar yang dipilih

#### 2. **`ImageViewer.tsx`** - Penampil Gambar
- **Fungsi**: Menampilkan gambar dalam berbagai format
- **Apa yang dilakukan**:
  - Menampilkan 3 versi gambar: Original, Grayscale, Binary
  - Memproses gambar menggunakan Web Worker (agar tidak lemot)
  - Menampilkan tooltip informasi pixel saat cursor diarahkan ke gambar
  - Zoom in/out pada gambar
  - Download gambar hasil proses

#### 3. **`ImageStats.tsx`** - Statistik Gambar
- **Fungsi**: Menampilkan informasi detail tentang gambar
- **Apa yang dilakukan**:
  - Menampilkan ukuran file (KB/MB)
  - Menampilkan dimensi gambar (lebar x tinggi)
  - Menampilkan tipe/format file
  - Menampilkan rasio aspek (perbandingan lebar dan tinggi)

#### 4. **`RgbTable.tsx`** - Tabel Data Pixel
- **Fungsi**: Menampilkan data pixel dalam bentuk tabel
- **Apa yang dilakukan**:
  - Menampilkan nilai RGB setiap pixel
  - Menampilkan warna sesuai nilai RGB-nya
  - Navigasi halaman untuk gambar besar
  - Filter untuk memilih area gambar tertentu

#### 5. **`PixelTooltip.tsx`** - Tooltip Informasi Pixel
- **Fungsi**: Menampilkan info pixel saat cursor diarahkan ke gambar
- **Apa yang dilakukan**:
  - Menampilkan koordinat pixel (x, y)
  - Menampilkan nilai RGB
  - Menampilkan preview warna
  - Muncul di posisi cursor

---

### 📁 **Folder `workers/`** - Pemrosesan Gambar
Berisi kode untuk memproses gambar secara terpisah agar tidak membuat website lemot.

#### **`pixelProcessor.ts`** - Prosesor Pixel
- **Fungsi**: Memproses gambar menjadi grayscale dan binary
- **Apa yang dilakukan**:
  - Mengubah gambar warna menjadi hitam-putih (grayscale)
  - Mengubah gambar menjadi binary (hanya hitam dan putih murni)
  - Bekerja di background agar website tetap responsif
  - Menggunakan rumus standar konversi RGB ke grayscale

---

### 📁 **Folder `utils/`** - Fungsi Pembantu
Berisi fungsi-fungsi bantuan yang digunakan di berbagai tempat.

#### **`imageUtils.ts`** - Utilitas Gambar
- **Fungsi**: Menyediakan fungsi-fungsi pembantu untuk gambar
- **Apa yang dilakukan**:
  - Mengubah ukuran file ke format yang mudah dibaca (KB, MB)
  - Menghitung rasio aspek gambar
  - Validasi file gambar (ukuran, tipe)
  - Mengekstrak data pixel dari gambar

---

### 📁 **Folder `types/`** - Definisi Tipe Data
Berisi definisi tipe data yang digunakan di seluruh aplikasi.

#### **`index.ts`** - Tipe Data
- **Fungsi**: Mendefinisikan struktur data
- **Apa yang dilakukan**:
  - Mendefinisikan struktur ImageData
  - Mendefinisikan struktur PixelData
  - Memastikan konsistensi tipe data di seluruh aplikasi

---

## 🔄 Alur Kerja Program

### **Tahap 1: Pengguna Mengunggah Gambar**
```
1. Pengguna membuka website
   ↓
2. Pengguna drag & drop atau klik "Choose File"
   ↓
3. ImageUploader menerima file
   ↓
4. Validasi file (ukuran max 10MB, format JPG/PNG/WebP/AVIF)
   ↓
5. Jika valid, gambar disimpan di state aplikasi
   ↓
6. Preview gambar ditampilkan
```

### **Tahap 2: Pemrosesan Gambar**
```
1. ImageViewer menerima gambar original
   ↓
2. Membuat Web Worker untuk proses di background
   ↓
3. Worker memproses gambar:
   - Konversi ke Grayscale (hitam-putih)
   - Konversi ke Binary (hitam-putih murni)
   ↓
4. Hasil proses dikirim kembali ke ImageViewer
   ↓
5. Tampilkan 3 versi gambar di layar
```

### **Tahap 3: Menampilkan Informasi**
```
1. ImageStats menghitung:
   - Ukuran file
   - Dimensi (lebar x tinggi)
   - Rasio aspek
   - Tipe file
   ↓
2. Informasi ditampilkan dalam card
```

### **Tahap 4: Menampilkan Data Pixel**
```
1. RgbTable mengekstrak data pixel dari gambar
   ↓
2. Membuat tabel dengan nilai RGB setiap pixel
   ↓
3. Menampilkan warna sesuai nilai RGB
   ↓
4. Menyediakan navigasi halaman untuk gambar besar
```

### **Tahap 5: Interaksi Pengguna**
```
1. Pengguna mengarahkan cursor ke gambar
   ↓
2. PixelTooltip mendeteksi posisi cursor
   ↓
3. Mengambil data pixel di posisi tersebut
   ↓
4. Menampilkan tooltip dengan info pixel
```

---

## 🎨 Alur Data dalam Aplikasi

```
┌─────────────────┐
│  Pengguna       │
│  Upload Gambar  │
└────────┬────────┘
         │
         ↓
┌─────────────────────┐
│  ImageUploader      │
│  - Validasi file    │
│  - Simpan gambar    │
└────────┬────────────┘
         │
         ↓
┌─────────────────────┐
│  page.tsx           │
│  - State management │
│  - Koordinasi       │
└────────┬────────────┘
         │
         ├──────────────────────────────────┐
         │                                  │
         ↓                                  ↓
┌─────────────────────┐          ┌──────────────────┐
│  ImageViewer        │          │  ImageStats      │
│  - Tampilkan gambar │          │  - Info gambar   │
│  - Proses di Worker │          └──────────────────┘
└────────┬────────────┘
         │
         ↓
┌─────────────────────┐
│  RgbTable           │
│  - Tabel pixel      │
│  - Nilai RGB        │
└─────────────────────┘
```

---

## 💡 Teknologi yang Digunakan

### **Next.js**
Framework React untuk membuat website modern dengan performa tinggi.

### **TypeScript**
Bahasa pemrograman yang membuat kode lebih aman dan mudah di-maintain.

### **Tailwind CSS**
Framework CSS untuk styling yang cepat dan konsisten.

### **Web Workers**
Teknologi untuk memproses gambar di background tanpa membuat website lemot.

### **Canvas API**
API browser untuk manipulasi gambar pixel per pixel.

---

## 🚀 Fitur Utama

### 1. **Upload Gambar**
- Drag & drop atau klik untuk upload
- Validasi otomatis
- Preview langsung

### 2. **Konversi Gambar**
- Original → Grayscale (hitam-putih)
- Original → Binary (hitam-putih murni)
- Proses cepat dengan Web Worker

### 3. **Informasi Detail**
- Ukuran file
- Dimensi gambar
- Rasio aspek
- Tipe file

### 4. **Data Pixel**
- Tabel RGB semua pixel
- Warna visual setiap pixel
- Navigasi untuk gambar besar

### 5. **Interaktif**
- Tooltip info pixel
- Zoom gambar
- Download hasil proses

---

## 📝 Catatan Penting

### **Batasan Aplikasi**
- Maksimal ukuran file: 10 MB
- Format yang didukung: JPG, PNG, WebP, AVIF
- Untuk gambar sangat besar, proses mungkin memakan waktu

### **Optimasi**
- Web Worker mencegah UI freeze
- Lazy loading untuk performa
- Responsive design untuk semua ukuran layar

### **Browser Support**
- Chrome (recommended)
- Firefox
- Safari
- Edge

---

## 🎓 Untuk Developer

Jika Anda ingin memodifikasi atau mengembangkan aplikasi ini:

1. **Tambah format gambar baru**: Edit validasi di `ImageUploader.tsx`
2. **Ubah algoritma konversi**: Edit `pixelProcessor.ts`
3. **Tambah fitur baru**: Buat komponen baru di folder `components/`
4. **Ubah tampilan**: Edit `globals.css` atau Tailwind classes

---

## 📚 Dokumen Terkait

- **OVERVIEW.md**: Gambaran umum aplikasi
- **ARCHITECTURE.md**: Struktur teknis aplikasi
- **COMPONENT-DETAILS.md**: Detail setiap komponen
- **DEVELOPMENT-GUIDE.md**: Panduan development

---

**Dibuat dengan ❤️ untuk memudahkan pemahaman aplikasi ImageToBit Web**

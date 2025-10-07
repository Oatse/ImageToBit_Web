# Quick Start Guide

Panduan cepat untuk mulai menggunakan Image to RGB Matrix Converter.

## ⚡ 5 Menit Setup

### 1. Install Dependencies

```bash
cd ImageToBit_Web
npm install
```

### 2. Jalankan Development Server

```bash
npm run dev
```

### 3. Buka Browser

Navigasi ke [http://localhost:3000](http://localhost:3000)

🎉 **Done!** Aplikasi sudah berjalan.

## 🎯 Quick Tutorial

### Step 1: Upload Gambar
![Upload](docs/images/step1-upload.png)

- Klik tombol **"Pilih Gambar"**
- Pilih file JPG atau PNG (max 50MB)
- Gambar akan muncul di canvas

### Step 2: Inspeksi Piksel (Hover)
![Inspect](docs/images/step2-inspect.png)

- Gerakkan mouse di atas gambar
- Tooltip akan menampilkan:
  - Koordinat (X, Y)
  - RGB values
  - HEX color
  - Color preview

### Step 3: Proses Gambar (Click)
![Process](docs/images/step3-process.png)

- Klik pada gambar
- Tunggu processing selesai (background process)
- Tabel matriks RGB akan muncul

### Step 4: Cari Koordinat
![Search](docs/images/step4-search.png)

- Masukkan koordinat X dan Y
- Klik **"Cari"**
- Tabel akan scroll ke koordinat tersebut

### Step 5: Export Data
![Export](docs/images/step5-export.png)

- Klik tombol **"Export CSV"**
- File CSV akan ter-download
- Buka dengan Excel/Spreadsheet

## 📚 Key Features

### 1. Upload
✅ Support JPG, PNG  
✅ Max 50MB  
✅ File validation  

### 2. Inspect
✅ Real-time tooltip  
✅ Accurate coordinates  
✅ Color preview  

### 3. Process
✅ Background processing  
✅ No UI freeze  
✅ Progress indicator  

### 4. Table
✅ Virtual scrolling  
✅ Smooth performance  
✅ Millions of rows  

### 5. Search
✅ Jump to coordinates  
✅ Smooth scroll  
✅ Input validation  

### 6. Export
✅ CSV format  
✅ All data included  
✅ One-click download  

## 🔥 Pro Tips

### Tip 1: Large Images
Untuk gambar besar (>10MB), processing akan memakan waktu. Tunggu hingga loading selesai.

### Tip 2: Virtual Scroll
Tabel menggunakan virtual scrolling. Scroll smooth meskipun jutaan baris!

### Tip 3: Search
Gunakan search untuk langsung jump ke koordinat tertentu tanpa scroll manual.

### Tip 4: CSV Export
CSV bisa dibuka di Excel, Google Sheets, atau text editor apapun.

### Tip 5: Dark Mode
Aplikasi otomatis mengikuti system theme. Toggle dark mode di OS settings.

## 🎨 Use Cases

### 1. Analisis Warna
Cari warna dominan, average color, brightest/darkest pixel.

### 2. Debugging
Debug masalah dengan pixel-perfect accuracy.

### 3. Data Extraction
Extract RGB data untuk machine learning atau analisis.

### 4. Education
Pelajari komposisi warna gambar digital.

### 5. Development
Test color algorithms, filters, atau transformasi.

## ⚙️ Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `Tab` | Navigate elements |
| `Enter` | Submit search |
| `Esc` | Close tooltips |

## 🐛 Troubleshooting

### Gambar tidak muncul?
- Pastikan file adalah JPG/PNG
- Check file size < 50MB
- Refresh halaman

### Processing lambat?
- Normal untuk gambar besar
- Wait for completion
- Don't reload page

### Tabel lag?
- Should be smooth with virtual scroll
- Close other browser tabs
- Check system memory

### Export tidak jalan?
- Check browser popup blocker
- Check download folder
- Try different browser

## 📖 Next Steps

Setelah comfortable dengan basics:

1. **Explore Statistics**  
   Check average color, brightest/darkest pixels

2. **Read Documentation**  
   - [README.md](README.md) - Overview
   - [ARCHITECTURE.md](ARCHITECTURE.md) - Technical details
   - [API.md](API.md) - API reference

3. **Contribute**  
   Check [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines

4. **Deploy**  
   See [DEPLOYMENT.md](DEPLOYMENT.md) for hosting

## 💡 FAQ

**Q: Apakah data gambar dikirim ke server?**  
A: Tidak! Semua processing dilakukan di browser Anda (client-side).

**Q: Berapa maksimal ukuran gambar?**  
A: 50MB untuk menjaga performa. Bisa diubah di kode.

**Q: Format apa yang didukung?**  
A: JPG, PNG, dan format gambar browser-supported lainnya.

**Q: Apakah bisa offline?**  
A: Ya, setelah loaded, aplikasi bisa jalan offline.

**Q: Apakah gratis?**  
A: Ya! Open source dengan MIT License.

## 🔗 Links

- [GitHub Repository](#)
- [Live Demo](#)
- [Issues & Support](#)
- [Documentation](README.md)

---

**Happy analyzing! 🎉**

Need help? [Create an issue](https://github.com/yourusername/imagetobit-web/issues)

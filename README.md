# Image to RGB Matrix Converter

![Next.js](https://img.shields.io/badge/Next.js-15.1.6-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4.1-38bdf8)

Aplikasi web interaktif berkinerja tinggi untuk mengkonversi gambar menjadi tabel matriks RGB. Dibangun dengan Next.js, TypeScript, dan TanStack Virtual untuk menangani jutaan baris data piksel tanpa lag.

## ✨ Fitur Utama

- 🖼️ **Upload Gambar**: Mendukung JPG, PNG (maksimal 50MB)
- 🔍 **Inspeksi Piksel Real-time**: Hover mouse untuk melihat info piksel (koordinat, RGB, HEX)
- 📊 **Tabel Virtual**: Tampilkan jutaan piksel dengan performa optimal menggunakan TanStack Virtual
- 🎯 **Pencarian Koordinat**: Langsung jump ke koordinat piksel tertentu
- 💾 **Ekspor CSV**: Download data matriks RGB lengkap
- ⚡ **Pemrosesan Asinkron**: Web Workers mencegah UI freeze saat memproses gambar besar
- 🎨 **Dark Mode**: Mendukung tema gelap dan terang
- 📱 **Responsive**: Optimal di desktop, tablet, dan mobile

## 🚀 Teknologi

- **Framework**: Next.js 15 (App Router)
- **Bahasa**: TypeScript
- **Styling**: Tailwind CSS
- **Tabel Virtual**: TanStack React Virtual
- **Pemrosesan**: Web Workers API
- **Canvas**: HTML5 Canvas API

## 📦 Instalasi

### Prerequisites

- Node.js 18+ atau Bun
- npm, yarn, atau bun

### Setup

1. Clone repository atau extract project

```bash
cd ImageToBit_Web
```

2. Install dependencies

```bash
npm install
# atau
yarn install
# atau
bun install
```

3. Jalankan development server

```bash
npm run dev
# atau
yarn dev
# atau
bun dev
```

4. Buka browser di [http://localhost:3000](http://localhost:3000)

## 🎯 Cara Menggunakan

1. **Upload Gambar**: Klik tombol "Pilih Gambar" dan pilih file gambar (JPG/PNG)
2. **Inspeksi Piksel**: Gerakkan mouse di atas gambar untuk melihat info piksel real-time
3. **Proses Gambar**: Klik pada gambar untuk memproses dan menampilkan tabel matriks RGB
4. **Cari Koordinat**: Gunakan input X dan Y untuk melompat ke baris data tertentu
5. **Ekspor Data**: Klik tombol "Export CSV" untuk download data

## 🏗️ Struktur Proyek

```
ImageToBit_Web/
├── app/
│   ├── layout.tsx          # Root layout dengan metadata
│   ├── page.tsx            # Halaman utama dengan state management
│   └── globals.css         # Global styles dengan Tailwind
├── components/
│   ├── ImageUploader.tsx   # Komponen upload file
│   ├── ImageViewer.tsx     # Komponen canvas dan interaksi
│   ├── PixelTooltip.tsx    # Tooltip info piksel
│   └── RgbTable.tsx        # Tabel virtual dengan TanStack
├── workers/
│   └── pixelProcessor.ts   # Web Worker untuk ekstraksi data
├── public/                 # Static assets
├── next.config.ts          # Konfigurasi Next.js
├── tailwind.config.ts      # Konfigurasi Tailwind
├── tsconfig.json           # Konfigurasi TypeScript
└── package.json            # Dependencies dan scripts
```

## ⚙️ Konfigurasi

### Next.js Config

File `next.config.ts` sudah dikonfigurasi untuk mendukung Web Workers.

### TypeScript Config

`tsconfig.json` dikonfigurasi dengan:
- Strict mode untuk type safety
- Path alias `@/*` untuk import yang lebih clean
- WebWorker lib untuk Web Workers support

## 🎨 Customization

### Styling

Ubah tema di `app/globals.css`:

```css
:root {
  --background: #ffffff;
  --foreground: #171717;
}
```

### Tailwind

Customize di `tailwind.config.ts`:

```typescript
theme: {
  extend: {
    // Tambahkan custom colors, spacing, dll
  }
}
```

## 🚀 Build untuk Production

```bash
npm run build
npm start
```

## 📊 Performa

- **Virtual Scrolling**: Hanya render baris yang visible
- **Web Workers**: Pemrosesan di background thread
- **Efficient Memory**: Cleanup otomatis untuk object URLs
- **Optimized Canvas**: `willReadFrequently` flag untuk context

## 🐛 Troubleshooting

### Gambar terlalu besar?

- Batasi ukuran maksimal di `ImageUploader.tsx`
- Compress gambar sebelum upload
- Performa bergantung pada hardware device

### Worker error?

- Pastikan browser mendukung Web Workers (semua browser modern)
- Check console untuk error messages

### Tabel lambat?

- TanStack Virtual sudah optimal untuk jutaan baris
- Pastikan tidak ada extension browser yang mengganggu

## 📝 License

MIT License - Bebas digunakan untuk project personal atau komersial

## 👨‍💻 Author

Dibuat untuk tugas Pengolahan Citra Digital

## 🙏 Credits

- [Next.js](https://nextjs.org/)
- [TanStack Virtual](https://tanstack.com/virtual)
- [Tailwind CSS](https://tailwindcss.com/)

## 📮 Support

Jika ada pertanyaan atau issue, silakan buat issue di repository atau hubungi developer.

---

**Selamat menggunakan Image to RGB Matrix Converter! 🎉**

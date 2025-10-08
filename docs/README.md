# README - Documentation Index

## 📚 Dokumentasi Lengkap Proyek ImageToBit_Web

Dokumentasi ini menjelaskan secara menyeluruh bagaimana aplikasi **Image to RGB Matrix Converter** bekerja, mulai dari arsitektur, komponen, hingga deployment.

---

## 📖 Daftar Dokumentasi

### 1. [Overview - Gambaran Umum](./01-OVERVIEW.md)
**Isi:**
- Deskripsi proyek dan tujuan
- Fitur-fitur utama (upload, inspeksi, processing, tabel, export)
- Teknologi yang digunakan (Next.js, React, TypeScript, Tailwind)
- Arsitektur aplikasi (client-side, multi-threading)
- Use cases dan keunggulan
- Roadmap pengembangan

**Untuk siapa:** Semua orang yang ingin memahami proyek secara umum

---

### 2. [Architecture - Arsitektur Aplikasi](./02-ARCHITECTURE.md)
**Isi:**
- Struktur folder lengkap dengan penjelasan
- Arsitektur teknis (Next.js App Router, Multi-threading)
- Data flow (upload, inspection, processing, export)
- State management pattern
- Component architecture (container vs presentational)
- Performance strategy (virtual scrolling, web workers, memoization)

**Untuk siapa:** Developer yang ingin memahami struktur dan arsitektur

---

### 3. [Component Details - Detail Komponen](./03-COMPONENT-DETAILS.md)
**Isi:**
- **app/page.tsx**: State management, event handlers, worker lifecycle
- **ImageUploader**: File upload dan validasi
- **ImageViewer**: Canvas rendering, mouse tracking, pixel reading
- **PixelTooltip**: Floating tooltip dengan info piksel
- **ImageStats**: Kalkulasi statistik (avg, brightest, darkest)
- **RgbTable**: Virtual scrolling, search, format toggle

**Untuk siapa:** Developer yang ingin memahami setiap komponen secara detail

---

### 4. [Workers & Utils - Web Workers dan Utility Functions](./04-WORKERS-AND-UTILS.md)
**Isi:**
- **workers/pixelProcessor.ts**: Background processing, ImageData structure
- **utils/imageUtils.ts**: Helper functions (RGB↔HEX, validation, CSV, file size)
- **types/index.ts**: TypeScript type definitions
- Penjelasan Web Worker (apa, mengapa, bagaimana)
- Performance considerations

**Untuk siapa:** Developer yang ingin memahami logic processing dan utilities

---

### 5. [Data Flow - Alur Data Aplikasi](./05-DATA-FLOW.md)
**Isi:**
- Application lifecycle (mount, cleanup)
- Complete user flow (upload, inspection, processing, export)
- State management flow dan dependencies
- Event flow diagrams (hover, click, scroll)
- Performance optimization flow
- Error handling flow
- State machine diagram

**Untuk siapa:** Developer yang ingin memahami bagaimana data mengalir

---

### 6. [Configuration - Konfigurasi](./06-CONFIGURATION.md)
**Isi:**
- **next.config.ts**: Next.js configuration
- **tsconfig.json**: TypeScript compiler options
- **tailwind.config.ts**: Tailwind CSS customization
- **postcss.config.mjs**: PostCSS plugins
- **package.json**: Dependencies dan scripts
- **app/layout.tsx**: Root layout dan metadata
- **app/globals.css**: Global styles dan CSS variables
- Build process flow

**Untuk siapa:** Developer yang ingin memahami atau memodifikasi konfigurasi

---

### 7. [Development Guide - Panduan Pengembangan](./07-DEVELOPMENT-GUIDE.md)
**Isi:**
- Setup development environment
- Development workflow (creating components, git workflow)
- Code style dan best practices
- Testing checklist (manual testing)
- Debugging tips dan tools
- Common issues & solutions
- Performance optimization
- Deployment (Vercel, Netlify, Docker)
- Useful commands

**Untuk siapa:** Developer yang akan mengembangkan atau maintain aplikasi

---

## 🎯 Quick Start untuk Berbagai Kebutuhan

### Saya ingin memahami proyek secara umum
→ Baca: **[01-OVERVIEW.md](./01-OVERVIEW.md)**

### Saya ingin memahami struktur folder dan arsitektur
→ Baca: **[02-ARCHITECTURE.md](./02-ARCHITECTURE.md)**

### Saya ingin memahami komponen tertentu
→ Baca: **[03-COMPONENT-DETAILS.md](./03-COMPONENT-DETAILS.md)**

### Saya ingin memahami Web Workers dan utility functions
→ Baca: **[04-WORKERS-AND-UTILS.md](./04-WORKERS-AND-UTILS.md)**

### Saya ingin memahami bagaimana data mengalir
→ Baca: **[05-DATA-FLOW.md](./05-DATA-FLOW.md)**

### Saya ingin mengubah konfigurasi (TypeScript, Tailwind, dll)
→ Baca: **[06-CONFIGURATION.md](./06-CONFIGURATION.md)**

### Saya ingin mengembangkan fitur baru atau deploy
→ Baca: **[07-DEVELOPMENT-GUIDE.md](./07-DEVELOPMENT-GUIDE.md)**

---

## 📊 Diagram Arsitektur Singkat

```
┌─────────────────────────────────────────┐
│         Browser (Client)                │
│                                         │
│  ┌───────────────────────────────────┐ │
│  │     Main Thread (UI)              │ │
│  │  ┌─────────────────────────────┐ │ │
│  │  │ app/page.tsx                │ │ │
│  │  │ - State Management          │ │ │
│  │  │ - Event Coordination        │ │ │
│  │  └─────────────────────────────┘ │ │
│  │  ┌─────────────────────────────┐ │ │
│  │  │ Components                  │ │ │
│  │  │ - ImageUploader             │ │ │
│  │  │ - ImageViewer (Canvas)      │ │ │
│  │  │ - PixelTooltip              │ │ │
│  │  │ - ImageStats                │ │ │
│  │  │ - RgbTable (Virtual)        │ │ │
│  │  └─────────────────────────────┘ │ │
│  └───────────────┬───────────────────┘ │
│                  │                      │
│                  │ postMessage          │
│                  ↓                      │
│  ┌───────────────────────────────────┐ │
│  │  Web Worker (Background Thread)   │ │
│  │  - Pixel Processing               │ │
│  │  - RGB Extraction                 │ │
│  │  - No UI Blocking                 │ │
│  └───────────────────────────────────┘ │
└─────────────────────────────────────────┘
```

---

## 🔑 Konsep Kunci

### 1. Next.js App Router
- File-based routing
- Server & Client Components
- Automatic code splitting

### 2. TypeScript
- Type safety
- Better developer experience
- Compile-time error checking

### 3. Tailwind CSS
- Utility-first CSS
- Rapid development
- Consistent design

### 4. Web Workers
- Background processing
- Non-blocking UI
- Better performance

### 5. TanStack Virtual
- Virtual scrolling
- Handle millions of rows
- Optimal performance

---

## 💡 Tips Membaca Dokumentasi

1. **Mulai dari Overview** untuk mendapat gambaran besar
2. **Lanjut ke Architecture** untuk memahami struktur
3. **Detail per komponen** jika ingin deep dive
4. **Gunakan sebagai referensi** saat coding
5. **Update dokumentasi** jika ada perubahan

---

## 🛠️ Tools yang Digunakan

- **Next.js 15**: React framework
- **React 19**: UI library
- **TypeScript 5**: Type safety
- **Tailwind CSS 3.4**: Styling
- **TanStack Virtual 3.10**: Virtual scrolling
- **Web Workers API**: Background processing
- **HTML5 Canvas API**: Image manipulation

---

## 📝 Kontribusi Dokumentasi

Jika menemukan:
- Typo atau kesalahan
- Penjelasan yang kurang jelas
- Bagian yang perlu ditambahkan

Silakan buat issue atau pull request!

---

## 📧 Kontak

**Project:** Image to RGB Matrix Converter  
**Purpose:** Tugas Pengolahan Citra Digital  
**Tech Stack:** Next.js, React, TypeScript, Tailwind CSS  
**Version:** 1.0.0  
**Last Updated:** October 8, 2025

---

## 📄 License

Open Source - Silakan digunakan untuk pembelajaran

---

**Happy Coding! 🚀**

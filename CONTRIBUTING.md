# Contributing to Image to RGB Matrix Converter

Terima kasih atas minat Anda untuk berkontribusi! 🎉

## Cara Berkontribusi

### 1. Setup Development Environment

```bash
# Clone repository
git clone https://github.com/yourusername/imagetobit-web.git
cd imagetobit-web

# Install dependencies
npm install

# Jalankan development server
npm run dev
```

### 2. Membuat Perubahan

1. Fork repository
2. Buat branch baru untuk fitur/fix Anda
   ```bash
   git checkout -b feature/nama-fitur
   ```
3. Lakukan perubahan dengan commit message yang jelas
   ```bash
   git commit -m "feat: menambahkan fitur X"
   ```
4. Push ke fork Anda
   ```bash
   git push origin feature/nama-fitur
   ```
5. Buat Pull Request

### 3. Commit Message Guidelines

Gunakan format conventional commits:

- `feat:` untuk fitur baru
- `fix:` untuk bug fixes
- `docs:` untuk perubahan dokumentasi
- `style:` untuk perubahan styling/formatting
- `refactor:` untuk refactoring code
- `test:` untuk menambah tests
- `chore:` untuk maintenance tasks

Contoh:
```
feat: add drag and drop upload functionality
fix: resolve coordinate mapping issue on scaled images
docs: update README with new features
```

### 4. Coding Standards

#### TypeScript
- Gunakan TypeScript strict mode
- Definisikan types untuk semua props dan functions
- Hindari `any` type
- Gunakan interfaces untuk object shapes

#### React Components
- Gunakan functional components dengan hooks
- Implement proper prop types
- Add comments untuk logic yang kompleks
- Keep components focused (single responsibility)

#### Styling
- Gunakan Tailwind CSS utility classes
- Follow responsive design principles
- Maintain consistent spacing dan colors
- Support dark mode

#### Performance
- Optimize re-renders dengan `useMemo`, `useCallback`
- Implement proper cleanup di `useEffect`
- Use Web Workers untuk heavy computations
- Virtual scrolling untuk large lists

### 5. Testing

Sebelum submit PR, pastikan:

- [ ] Code berjalan tanpa errors
- [ ] Tidak ada TypeScript errors
- [ ] Tested di multiple browsers (Chrome, Firefox, Safari)
- [ ] Tested di mobile devices
- [ ] No console errors atau warnings
- [ ] Performance tidak menurun

### 6. Pull Request Process

1. Update README.md jika menambah fitur
2. Update CHANGELOG.md dengan perubahan Anda
3. Pastikan code sudah di-lint
4. Request review dari maintainer
5. Address review comments jika ada

## Areas for Contribution

### 🎯 High Priority
- [ ] Drag & drop upload functionality
- [ ] Image compression options
- [ ] More export formats (JSON, XML)
- [ ] Color histogram visualization
- [ ] Image filters preview

### 🔧 Improvements
- [ ] Better error handling
- [ ] Loading progress indicators
- [ ] Keyboard shortcuts
- [ ] Accessibility improvements
- [ ] Unit tests

### 📝 Documentation
- [ ] Video tutorials
- [ ] API documentation
- [ ] Code examples
- [ ] Translation to other languages

### 🐛 Bug Fixes
- Check [Issues](https://github.com/yourusername/imagetobit-web/issues) untuk bugs yang perlu di-fix

## Development Tips

### Working with Canvas
```typescript
// Always check for context
const canvas = canvasRef.current;
const ctx = canvas?.getContext('2d', { willReadFrequently: true });
if (!ctx) return;

// Use proper scaling
const rect = canvas.getBoundingClientRect();
const scaleX = canvas.width / rect.width;
const scaleY = canvas.height / rect.height;
```

### Working with Web Workers
```typescript
// Initialize worker
const worker = new Worker(new URL('../workers/myWorker.ts', import.meta.url));

// Send message
worker.postMessage({ data });

// Listen for response
worker.onmessage = (e) => {
  console.log(e.data);
};

// Cleanup
worker.terminate();
```

### Virtual Scrolling
```typescript
const rowVirtualizer = useVirtualizer({
  count: data.length,
  getScrollElement: () => parentRef.current,
  estimateSize: () => 45,
  overscan: 10,
});
```

## Questions?

Jika Anda punya pertanyaan:
- Open an issue dengan label `question`
- Check dokumentasi di `ARCHITECTURE.md`
- Review existing issues

## Code of Conduct

- Be respectful dan professional
- Welcome newcomers
- Help each other
- Focus on constructive feedback
- Celebrate successes

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

**Happy coding! 🚀**

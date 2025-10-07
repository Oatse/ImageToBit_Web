# Testing & Quality Guide

Panduan untuk testing dan quality assurance aplikasi.

## Testing Strategy

### 1. Manual Testing Checklist

#### Upload Functionality
- [ ] Upload file JPG
- [ ] Upload file PNG
- [ ] Upload file WebP (should show error)
- [ ] Upload file > 50MB (should show error)
- [ ] Upload non-image file (should show error)
- [ ] Cancel file selection

#### Image Display
- [ ] Gambar ditampilkan dengan benar
- [ ] Dimensi gambar ditampilkan
- [ ] Canvas render accurate
- [ ] Responsive di berbagai ukuran layar

#### Pixel Inspection (Hover)
- [ ] Tooltip muncul saat hover
- [ ] Koordinat akurat
- [ ] RGB values benar
- [ ] HEX color benar
- [ ] Color preview box akurat
- [ ] Tooltip mengikuti cursor
- [ ] Tooltip hilang saat mouse leave

#### Image Processing
- [ ] Loading indicator muncul
- [ ] Processing tidak freeze UI
- [ ] Hasil processing akurat
- [ ] Error handling untuk gambar corrupt

#### RGB Table
- [ ] Tabel muncul setelah processing
- [ ] Virtual scroll bekerja smooth
- [ ] Data akurat (X, Y, R, G, B, HEX)
- [ ] Color preview di setiap row
- [ ] Scroll performance baik dengan data besar

#### Search Functionality
- [ ] Input X dan Y
- [ ] Validation untuk input invalid
- [ ] Scroll to koordinat bekerja
- [ ] Smooth scroll animation
- [ ] Error untuk koordinat di luar range

#### Export CSV
- [ ] CSV file ter-download
- [ ] Format CSV benar
- [ ] Data lengkap dan akurat
- [ ] Filename dengan timestamp

#### Statistics
- [ ] Total pixels benar
- [ ] Average color calculation akurat
- [ ] Brightest pixel detected correctly
- [ ] Darkest pixel detected correctly
- [ ] Dimensi gambar benar

#### UI/UX
- [ ] Dark mode toggle
- [ ] Responsive layout (mobile, tablet, desktop)
- [ ] Loading states
- [ ] Error messages
- [ ] Button hover effects
- [ ] Smooth transitions

### 2. Browser Compatibility Testing

Test di berbagai browser:

#### Desktop
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)
- [ ] Opera (latest)

#### Mobile
- [ ] Chrome Mobile
- [ ] Safari iOS
- [ ] Firefox Mobile
- [ ] Samsung Internet

### 3. Performance Testing

#### Small Images (< 100KB)
```
Expected:
- Upload: < 100ms
- Processing: < 50ms
- Table render: < 100ms
- Total: < 250ms
```

#### Medium Images (1-5MB)
```
Expected:
- Upload: < 500ms
- Processing: < 2s
- Table render: < 500ms
- Total: < 3s
```

#### Large Images (5-50MB)
```
Expected:
- Upload: < 2s
- Processing: < 10s
- Table render: < 1s
- Total: < 15s
```

### 4. Memory Testing

Monitor memory usage dengan Chrome DevTools:

1. Open DevTools → Performance → Memory
2. Upload dan process gambar besar
3. Check memory usage
4. Force garbage collection
5. Verify no memory leaks

**Expected:**
- Small image: < 10MB
- Medium image: < 100MB
- Large image: < 500MB
- No memory leaks after cleanup

## Quality Checks

### 1. TypeScript Validation

```bash
# Check TypeScript errors
npm run lint

# Type check without emit
npx tsc --noEmit
```

**Expected:** No errors

### 2. ESLint

```bash
# Run ESLint
npm run lint

# Auto-fix issues
npm run lint -- --fix
```

**Expected:** No errors or warnings

### 3. Build Validation

```bash
# Production build
npm run build
```

**Expected:**
- Build completes successfully
- No errors in output
- Bundle size reasonable
- All pages compiled

### 4. Code Quality Metrics

#### Component Complexity
- Functions < 50 lines
- Components < 200 lines
- Cyclomatic complexity < 10

#### Type Coverage
- 100% TypeScript coverage
- No `any` types (except necessary)
- All props typed
- All functions typed

#### Performance
- First Contentful Paint < 1.5s
- Time to Interactive < 3s
- Largest Contentful Paint < 2.5s
- Cumulative Layout Shift < 0.1

## Automated Testing (Optional)

### Setup Jest (untuk unit tests)

```bash
npm install -D jest @testing-library/react @testing-library/jest-dom
```

### Example Test

```typescript
// components/__tests__/ImageUploader.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import ImageUploader from '../ImageUploader';

describe('ImageUploader', () => {
  it('renders upload button', () => {
    render(<ImageUploader onFileSelect={() => {}} />);
    expect(screen.getByText('Pilih Gambar')).toBeInTheDocument();
  });

  it('validates file type', async () => {
    const onFileSelect = jest.fn();
    render(<ImageUploader onFileSelect={onFileSelect} />);
    
    const file = new File(['test'], 'test.txt', { type: 'text/plain' });
    const input = screen.getByRole('input', { hidden: true });
    
    fireEvent.change(input, { target: { files: [file] } });
    
    expect(onFileSelect).not.toHaveBeenCalled();
  });
});
```

## Accessibility Testing

### 1. Keyboard Navigation
- [ ] Tab through all interactive elements
- [ ] Enter/Space activate buttons
- [ ] Escape closes modals/tooltips
- [ ] Arrow keys navigate table (if implemented)

### 2. Screen Reader
- [ ] All images have alt text
- [ ] Buttons have descriptive labels
- [ ] Form inputs have labels
- [ ] ARIA attributes correct

### 3. Color Contrast
- [ ] Text readable in light mode
- [ ] Text readable in dark mode
- [ ] Buttons have sufficient contrast
- [ ] Links distinguishable

### 4. WCAG Compliance
Use tools:
- [WAVE](https://wave.webaim.org/)
- [axe DevTools](https://www.deque.com/axe/devtools/)
- Lighthouse Accessibility audit

**Target:** WCAG 2.1 Level AA

## Security Testing

### 1. Input Validation
- [ ] File type validation
- [ ] File size validation
- [ ] Coordinate bounds checking
- [ ] No XSS vulnerabilities

### 2. Content Security Policy
Check CSP headers:
```bash
curl -I http://localhost:3000
```

### 3. Dependencies
```bash
# Check for vulnerabilities
npm audit

# Fix vulnerabilities
npm audit fix
```

## Performance Profiling

### Chrome DevTools

1. Open DevTools → Performance
2. Start recording
3. Upload dan process gambar
4. Stop recording
5. Analyze:
   - Main thread activity
   - Worker thread activity
   - Long tasks
   - Frame rate

### Lighthouse

```bash
# Install Lighthouse
npm install -g lighthouse

# Run audit
lighthouse http://localhost:3000 --view
```

**Target Scores:**
- Performance: > 90
- Accessibility: > 95
- Best Practices: > 95
- SEO: > 90

## Load Testing (untuk production)

### Using Apache Bench

```bash
# Test concurrent uploads
ab -n 100 -c 10 http://localhost:3000/
```

### Using k6

```javascript
import http from 'k6/http';
import { check } from 'k6';

export default function() {
  const res = http.get('http://localhost:3000');
  check(res, {
    'status is 200': (r) => r.status === 200,
    'page loads in < 1s': (r) => r.timings.duration < 1000,
  });
}
```

## Continuous Integration

### GitHub Actions Example

```yaml
# .github/workflows/test.yml
name: Test

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run lint
      - run: npm run build
      - run: npm test
```

## Quality Gates

Before merging/deploying:

- [ ] All manual tests pass
- [ ] TypeScript validation passes
- [ ] ESLint passes
- [ ] Build successful
- [ ] No console errors
- [ ] Performance acceptable
- [ ] Browser compatibility verified
- [ ] Accessibility checks pass
- [ ] Security audit clean

## Reporting Issues

When reporting bugs:

1. **Environment**
   - Browser & version
   - OS & version
   - Screen size
   - Connection speed

2. **Steps to Reproduce**
   - Detailed steps
   - Sample image (if applicable)
   - Expected vs actual behavior

3. **Screenshots/Videos**
   - Error messages
   - Console logs
   - Network tab

4. **Impact**
   - Critical / High / Medium / Low
   - Workaround available?

---

**Quality is not an act, it is a habit! ✨**

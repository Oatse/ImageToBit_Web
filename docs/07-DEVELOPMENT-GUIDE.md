# Development Guide - Panduan Pengembangan

## Table of Contents
1. [Setup Development Environment](#setup-development-environment)
2. [Development Workflow](#development-workflow)
3. [Code Style & Best Practices](#code-style--best-practices)
4. [Testing](#testing)
5. [Debugging](#debugging)
6. [Common Issues & Solutions](#common-issues--solutions)
7. [Performance Optimization](#performance-optimization)
8. [Deployment](#deployment)

---

## Setup Development Environment

### Prerequisites

**Required:**
- **Node.js**: 18.17 atau lebih tinggi
- **npm**: 9.x atau lebih tinggi (atau yarn/pnpm/bun)
- **Git**: Untuk version control

**Recommended:**
- **VS Code**: Editor dengan extension berikut:
  - ES Lint
  - Prettier
  - Tailwind CSS IntelliSense
  - TypeScript and JavaScript Language Features

### Installation Steps

```bash
# 1. Clone repository
git clone https://github.com/your-username/ImageToBit_Web.git
cd ImageToBit_Web

# 2. Install dependencies
npm install
# or
yarn install
# or
pnpm install
# or
bun install

# 3. Start development server
npm run dev

# 4. Open browser
# Navigate to http://localhost:3000
```

### Project Structure

```
ImageToBit_Web/
├── app/                    # Next.js App Router
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Main page
│   └── globals.css        # Global styles
│
├── components/            # React components
│   ├── ImageUploader.tsx
│   ├── ImageViewer.tsx
│   ├── PixelTooltip.tsx
│   ├── RgbTable.tsx
│   └── ImageStats.tsx
│
├── workers/              # Web Workers
│   └── pixelProcessor.ts
│
├── types/                # TypeScript types
│   └── index.ts
│
├── utils/                # Utility functions
│   └── imageUtils.ts
│
├── docs/                 # Documentation
│
├── public/               # Static assets
│
└── Configuration files:
    ├── next.config.ts
    ├── tsconfig.json
    ├── tailwind.config.ts
    ├── postcss.config.mjs
    └── package.json
```

---

## Development Workflow

### 1. Creating New Component

```bash
# Create component file
touch components/NewComponent.tsx
```

```typescript
// components/NewComponent.tsx
"use client";  // If needs interactivity

import { useState } from "react";

interface NewComponentProps {
  // Define props
  title: string;
  onAction: () => void;
}

export default function NewComponent({ title, onAction }: NewComponentProps) {
  const [state, setState] = useState<string>("");

  return (
    <div className="p-4 bg-white dark:bg-gray-800 rounded-lg">
      <h2 className="text-xl font-bold">{title}</h2>
      <button onClick={onAction}>Action</button>
    </div>
  );
}
```

### 2. Adding New Utility Function

```bash
# Edit utils file
code utils/imageUtils.ts
```

```typescript
// Add new function
export function newUtilFunction(param: string): string {
  // Implementation
  return param.toUpperCase();
}

// Add tests if needed
// utils/imageUtils.test.ts
```

### 3. Adding New Type

```typescript
// types/index.ts
export interface NewType {
  id: number;
  name: string;
  data: any[];
}
```

### 4. Git Workflow

```bash
# 1. Create feature branch
git checkout -b feature/new-feature

# 2. Make changes
# ... edit files ...

# 3. Stage changes
git add .

# 4. Commit with descriptive message
git commit -m "feat: add new feature for XYZ"

# 5. Push to remote
git push origin feature/new-feature

# 6. Create Pull Request on GitHub
```

### Commit Message Convention

```bash
# Format: <type>: <description>

feat: add new image filter feature
fix: resolve memory leak in worker
docs: update API documentation
style: format code with prettier
refactor: simplify pixel processing logic
perf: optimize table rendering
test: add unit tests for imageUtils
chore: update dependencies
```

---

## Code Style & Best Practices

### TypeScript Best Practices

**1. Always use types**
```typescript
// ❌ Bad
function process(data) {
  return data;
}

// ✅ Good
function process(data: PixelData[]): PixelData[] {
  return data;
}
```

**2. Use interfaces for objects**
```typescript
// ✅ Good
interface Props {
  title: string;
  count: number;
  onAction: () => void;
}

function Component({ title, count, onAction }: Props) {
  // ...
}
```

**3. Avoid 'any' type**
```typescript
// ❌ Bad
const data: any = getData();

// ✅ Good
const data: PixelData[] = getData();

// ✅ Good (if truly unknown)
const data: unknown = getData();
if (isPixelData(data)) {
  // Type guard
}
```

### React Best Practices

**1. Use functional components**
```typescript
// ✅ Good
export default function Component() {
  return <div>Hello</div>;
}

// ❌ Avoid class components
class Component extends React.Component {
  render() {
    return <div>Hello</div>;
  }
}
```

**2. Use hooks properly**
```typescript
// ✅ Good - stable callback
const handleClick = useCallback(() => {
  setCount(count + 1);
}, [count]);

// ✅ Good - memoized value
const expensiveValue = useMemo(() => {
  return computeExpensive(data);
}, [data]);

// ❌ Bad - recreated every render
const handleClick = () => {
  setCount(count + 1);
};
```

**3. Conditional rendering**
```typescript
// ✅ Good
{showTable && <RgbTable data={data} />}

// ✅ Good
{showTable ? <RgbTable data={data} /> : <EmptyState />}

// ❌ Bad (renders "false" string if showTable is false)
{showTable && <RgbTable data={data} /> || "false"}
```

**4. Props destructuring**
```typescript
// ✅ Good
function Component({ title, count }: Props) {
  return <div>{title}: {count}</div>;
}

// ❌ Less readable
function Component(props: Props) {
  return <div>{props.title}: {props.count}</div>;
}
```

### Tailwind CSS Best Practices

**1. Use utility classes**
```typescript
// ✅ Good
<div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md">

// ❌ Bad (inline styles)
<div style={{ padding: '1rem', background: 'white' }}>
```

**2. Responsive design**
```typescript
// ✅ Good - mobile first
<div className="text-sm md:text-base lg:text-lg">

// ✅ Good - conditional layout
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
```

**3. Dark mode**
```typescript
// ✅ Good
<div className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
```

**4. Extract repeated patterns**
```typescript
// If same classes used multiple times, consider extracting

// components/Button.tsx
export function Button({ children, variant = 'primary' }: Props) {
  const baseClasses = "px-4 py-2 rounded-lg font-semibold transition-colors";
  const variantClasses = {
    primary: "bg-blue-600 hover:bg-blue-700 text-white",
    secondary: "bg-gray-600 hover:bg-gray-700 text-white",
  };
  
  return (
    <button className={`${baseClasses} ${variantClasses[variant]}`}>
      {children}
    </button>
  );
}
```

### File Organization

**1. Component structure**
```typescript
// Component file structure
// 1. Imports
import { useState } from "react";
import OtherComponent from "./OtherComponent";

// 2. Type definitions
interface Props {
  // ...
}

// 3. Component
export default function Component({ prop1, prop2 }: Props) {
  // 3.1 Hooks
  const [state, setState] = useState();
  
  // 3.2 Functions
  const handleAction = () => {
    // ...
  };
  
  // 3.3 Effects
  useEffect(() => {
    // ...
  }, []);
  
  // 3.4 Render
  return (
    <div>
      {/* JSX */}
    </div>
  );
}
```

**2. Naming conventions**
```typescript
// Components: PascalCase
ImageUploader.tsx
PixelTooltip.tsx

// Functions: camelCase
handleFileSelect()
getPixelColor()

// Constants: UPPER_SNAKE_CASE
const MAX_FILE_SIZE = 50;
const DEFAULT_COLOR = "#000000";

// Types/Interfaces: PascalCase
interface PixelData { }
type TableFormat = "list" | "matrix";
```

---

## Testing

### Manual Testing Checklist

**1. File Upload**
- [ ] Upload JPG image
- [ ] Upload PNG image
- [ ] Upload large file (>50MB) → should show error
- [ ] Upload non-image file → should show error
- [ ] Upload multiple images sequentially

**2. Image Display**
- [ ] Image renders correctly
- [ ] Canvas size matches image
- [ ] Dimensions displayed correctly
- [ ] Responsive on different screen sizes

**3. Pixel Inspection**
- [ ] Tooltip shows on hover
- [ ] Tooltip follows cursor
- [ ] Coordinates accurate
- [ ] RGB values correct
- [ ] HEX color matches
- [ ] Tooltip hides on mouse leave

**4. Image Processing**
- [ ] Click triggers processing
- [ ] Loading overlay appears
- [ ] UI remains responsive
- [ ] Processing completes successfully
- [ ] Table displays after processing

**5. Table Features**
- [ ] Virtual scrolling smooth
- [ ] Search by coordinates works
- [ ] Format toggle (List/Matrix) works
- [ ] All data displayed correctly
- [ ] Performance good with large images

**6. Export**
- [ ] CSV export triggers download
- [ ] File format correct
- [ ] All data included
- [ ] File naming correct

**7. Edge Cases**
- [ ] Very small image (1×1)
- [ ] Very large image (4000×3000)
- [ ] Long image (100×2000)
- [ ] Wide image (2000×100)

### Browser Testing

```bash
# Test on multiple browsers:
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

# Test on mobile:
- iOS Safari
- Android Chrome
```

---

## Debugging

### Development Tools

**1. React DevTools**
```
Chrome Extension: React Developer Tools
- Inspect component tree
- View props and state
- Profile performance
```

**2. Browser DevTools**
```javascript
// Console logging
console.log('Pixel data:', pixelData);
console.table(pixelData); // Table format

// Debugging
debugger; // Breakpoint

// Performance
console.time('processing');
// ... code ...
console.timeEnd('processing');
```

**3. TypeScript Errors**
```bash
# Check types
npm run build

# or watch mode
tsc --noEmit --watch
```

### Common Debug Scenarios

**1. Component not rendering**
```typescript
// Check:
// 1. Is component exported?
export default function Component() { }

// 2. Is component imported correctly?
import Component from '@/components/Component';

// 3. Is conditional rendering correct?
{showComponent && <Component />}

// 4. Check console for errors
// F12 → Console
```

**2. State not updating**
```typescript
// Check:
// 1. Using setState correctly?
setState(newValue);  // ✅
state = newValue;    // ❌

// 2. State is immutable
setState([...array, newItem]);  // ✅
array.push(newItem);            // ❌

// 3. useEffect dependencies
useEffect(() => {
  // ...
}, [dependency]); // Include all dependencies
```

**3. Worker not responding**
```typescript
// Check:
// 1. Worker initialized?
console.log('Worker:', workerRef.current);

// 2. Message handler set?
workerRef.current.onmessage = (e) => {
  console.log('Worker response:', e.data);
};

// 3. Error handler?
workerRef.current.onerror = (error) => {
  console.error('Worker error:', error);
};
```

**4. Performance issues**
```typescript
// Use React Profiler
import { Profiler } from 'react';

<Profiler id="Component" onRender={onRenderCallback}>
  <Component />
</Profiler>

function onRenderCallback(
  id, phase, actualDuration, baseDuration, startTime, commitTime
) {
  console.log(`${id} took ${actualDuration}ms`);
}
```

---

## Common Issues & Solutions

### Issue 1: Memory Leak

**Symptom:** Browser becomes slow over time

**Solution:**
```typescript
// Always cleanup in useEffect
useEffect(() => {
  const worker = new Worker('...');
  
  return () => {
    worker.terminate();  // Cleanup
  };
}, []);

// Revoke object URLs
useEffect(() => {
  return () => {
    if (imageUrl) {
      URL.revokeObjectURL(imageUrl);
    }
  };
}, [imageUrl]);
```

### Issue 2: Worker Not Working

**Symptom:** Image processing doesn't complete

**Solution:**
```typescript
// Check worker file location
const worker = new Worker(
  new URL('../workers/pixelProcessor.ts', import.meta.url)
);

// Check message format
worker.postMessage({ imageData }); // ✅ Object
worker.postMessage(imageData);     // ❌ Direct value

// Check worker response
worker.onmessage = (e) => {
  console.log('Worker data:', e.data); // Debug
  setPixelData(e.data);
};
```

### Issue 3: Table Not Scrolling Smoothly

**Symptom:** Laggy scrolling with large datasets

**Solution:**
```typescript
// Check overscan value
const virtualizer = useVirtualizer({
  count: data.length,
  getScrollElement: () => parentRef.current,
  estimateSize: () => 45,
  overscan: 10,  // Increase if needed
});

// Check row height consistency
estimateSize: () => 45,  // Should match actual row height
```

### Issue 4: Image Not Loading

**Symptom:** Blank canvas after upload

**Solution:**
```typescript
// Check CORS issues
// If loading from URL, ensure CORS enabled

// Check file validation
const validation = validateImageFile(file, 50);
if (!validation.valid) {
  console.error(validation.error);
  return;
}

// Check image onload
img.onload = () => {
  console.log('Image loaded:', img.width, img.height);
};

img.onerror = () => {
  console.error('Image failed to load');
};
```

---

## Performance Optimization

### 1. Component Optimization

```typescript
// Use React.memo for pure components
import { memo } from 'react';

const PixelTooltip = memo(({ data }: Props) => {
  // Only re-renders if data changes
  return <div>{/* ... */}</div>;
});

// Use useCallback for stable functions
const handleClick = useCallback(() => {
  // Function reference stable across renders
}, [dependency]);

// Use useMemo for expensive calculations
const stats = useMemo(() => {
  return calculateStats(data);
}, [data]);
```

### 2. Bundle Optimization

```typescript
// Dynamic imports for code splitting
const HeavyComponent = dynamic(() => import('./HeavyComponent'), {
  loading: () => <div>Loading...</div>,
  ssr: false, // Disable server-side rendering if not needed
});

// Use next/image for optimized images
import Image from 'next/image';

<Image
  src="/image.jpg"
  width={500}
  height={300}
  alt="Description"
  loading="lazy"
/>
```

### 3. Network Optimization

```bash
# Enable compression (automatic in Next.js)
# Enable caching
# Use CDN for static assets
# Optimize images before upload
```

### 4. Profiling

```bash
# Build with profiling
npm run build

# Analyze bundle size
npm install -g @next/bundle-analyzer
ANALYZE=true npm run build
```

---

## Deployment

### Vercel (Recommended)

```bash
# 1. Install Vercel CLI
npm install -g vercel

# 2. Login
vercel login

# 3. Deploy
vercel

# 4. Deploy to production
vercel --prod
```

### Netlify

```bash
# 1. Build command
npm run build

# 2. Publish directory
.next

# 3. Deploy via CLI or web interface
netlify deploy --prod
```

### Docker

```dockerfile
# Dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
```

```bash
# Build image
docker build -t imagetobit-web .

# Run container
docker run -p 3000:3000 imagetobit-web
```

### Environment Variables

```bash
# Production environment variables
NEXT_PUBLIC_API_URL=https://api.production.com
NODE_ENV=production
```

---

## Useful Commands

```bash
# Development
npm run dev          # Start dev server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Lint code

# Dependencies
npm install          # Install all dependencies
npm update           # Update dependencies
npm outdated         # Check outdated packages

# Debugging
npm run build -- --debug  # Build with debug info

# Clean
rm -rf .next node_modules  # Clean build and deps
npm install                 # Reinstall
```

---

**Last Updated:** October 8, 2025  
**Version:** 1.0.0  
**Maintainer:** Tugas Pengolahan Citra Digital

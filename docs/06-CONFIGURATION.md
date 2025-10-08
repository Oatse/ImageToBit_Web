# Configuration Files - Setup & Build Configuration

## Table of Contents
1. [next.config.ts - Next.js Configuration](#nextconfigts---nextjs-configuration)
2. [tsconfig.json - TypeScript Configuration](#tsconfigjson---typescript-configuration)
3. [tailwind.config.ts - Tailwind CSS Configuration](#tailwindconfigts---tailwind-css-configuration)
4. [postcss.config.mjs - PostCSS Configuration](#postcssconfigmjs---postcss-configuration)
5. [package.json - Dependencies & Scripts](#packagejson---dependencies--scripts)
6. [app/layout.tsx - Root Layout](#applayouttsx---root-layout)
7. [app/globals.css - Global Styles](#appglobalscss---global-styles)

---

## next.config.ts - Next.js Configuration

### File Content

```typescript
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
};

export default nextConfig;
```

### Configuration Explained

**Minimal Configuration**: Aplikasi ini menggunakan konfigurasi default Next.js 15.

**Default Features Enabled:**

1. **App Router**: 
   - File-based routing dengan `app/` directory
   - Server Components by default
   - Client Components dengan `"use client"`

2. **Turbopack** (in dev mode):
   - Faster bundler replacement untuk Webpack
   - Improved development performance

3. **Automatic Code Splitting**:
   - Each route is a separate bundle
   - Lazy loading untuk optimal performance

4. **Image Optimization**:
   - Automatic image optimization (if using next/image)
   - WebP conversion, resizing, lazy loading

5. **Font Optimization**:
   - Automatic font loading optimization
   - Eliminate layout shift

### Common Configuration Options

```typescript
// Jika ingin menambah konfigurasi:

const nextConfig: NextConfig = {
  // Disable strict mode untuk development
  reactStrictMode: true,
  
  // Custom webpack configuration
  webpack: (config, { isServer }) => {
    // Modify webpack config
    return config;
  },
  
  // Environment variables
  env: {
    CUSTOM_KEY: 'value',
  },
  
  // Image domains (jika load image dari external)
  images: {
    domains: ['example.com'],
  },
  
  // Redirect rules
  async redirects() {
    return [
      {
        source: '/old-route',
        destination: '/new-route',
        permanent: true,
      },
    ];
  },
};
```

---

## tsconfig.json - TypeScript Configuration

### File Content

```json
{
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "paths": {
      "@/*": ["./*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

### Configuration Explained

#### Compiler Options

**1. target: "ES2017"**
```typescript
// Compile to ES2017 JavaScript
// Supports: async/await, Object.entries, etc.
```

**2. lib: ["dom", "dom.iterable", "esnext"]**
```typescript
// Include type definitions for:
// - DOM APIs (window, document, canvas, etc.)
// - Iterable DOM collections
// - Latest ECMAScript features
```

**3. allowJs: true**
```typescript
// Allow importing .js files alongside .ts files
import utils from './utils.js';  // ✅ Allowed
```

**4. strict: true**
```typescript
// Enable all strict type-checking options:
// - strictNullChecks: null/undefined must be explicit
// - strictFunctionTypes: stricter function parameter checking
// - strictPropertyInitialization: class properties must be initialized
// - noImplicitAny: variables must have types
// - noImplicitThis: 'this' must have type

// Example:
let value: string;
value = null;  // ❌ Error: Type 'null' is not assignable to type 'string'

let value: string | null;
value = null;  // ✅ OK
```

**5. noEmit: true**
```typescript
// Don't emit compiled JavaScript files
// Next.js handles the compilation
// TypeScript only used for type checking
```

**6. module: "esnext" & moduleResolution: "bundler"**
```typescript
// Use latest ES module syntax
// Module resolution optimized for bundlers (Next.js/Turbopack)

import { Component } from 'react';  // ES modules
export default function App() {}
```

**7. jsx: "preserve"**
```typescript
// Keep JSX syntax as-is
// Next.js will transform it during build

// Your code:
const element = <div>Hello</div>;

// Preserved for Next.js to transform
```

**8. incremental: true**
```typescript
// Enable incremental compilation
// Faster subsequent builds by caching type information
```

**9. paths: { "@/*": ["./*"] }**
```typescript
// Path alias configuration
// Allows clean imports:

// Instead of:
import ImageUploader from '../../../../components/ImageUploader';

// Use:
import ImageUploader from '@/components/ImageUploader';
```

### Type Checking Examples

```typescript
// ✅ Strict type checking in action

// 1. No implicit any
function process(data) {  // ❌ Error: Parameter 'data' implicitly has an 'any' type
  return data;
}

function process(data: string) {  // ✅ OK
  return data;
}

// 2. Null checks
const element = document.getElementById('canvas');
element.width = 100;  // ❌ Error: Object is possibly 'null'

if (element) {  // ✅ OK
  element.width = 100;
}

// 3. Function parameter types
function add(a: number, b: number): number {
  return a + b;
}

add(1, 2);      // ✅ OK
add(1, "2");    // ❌ Error: Argument of type 'string' is not assignable to parameter of type 'number'
```

---

## tailwind.config.ts - Tailwind CSS Configuration

### File Content

```typescript
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
    },
  },
  plugins: [],
};

export default config;
```

### Configuration Explained

**1. content: [...]**
```typescript
// File paths where Tailwind should look for class names
// Tailwind will scan these files and include only used classes in final CSS

// Example:
// If you use: className="bg-blue-500 text-white"
// Tailwind includes: .bg-blue-500, .text-white in output
```

**2. theme.extend**
```typescript
// Extend default Tailwind theme
// Don't override, just add to existing

theme: {
  extend: {
    colors: {
      // Custom CSS variables
      background: "var(--background)",
      foreground: "var(--foreground)",
    },
  },
}

// Usage:
<div className="bg-background text-foreground">
  // Uses CSS variables from globals.css
</div>
```

### Tailwind Classes Used in Project

```typescript
// Layout & Spacing
"p-4"           // padding: 1rem
"px-6"          // padding-left/right: 1.5rem
"py-3"          // padding-top/bottom: 0.75rem
"m-8"           // margin: 2rem
"gap-4"         // gap: 1rem

// Flexbox & Grid
"flex"          // display: flex
"flex-1"        // flex: 1 1 0%
"items-center"  // align-items: center
"justify-center"// justify-content: center
"grid"          // display: grid
"grid-cols-3"   // grid-template-columns: repeat(3, minmax(0, 1fr))

// Colors
"bg-blue-600"   // background-color: rgb(37 99 235)
"text-white"    // color: rgb(255 255 255)
"border-gray-300" // border-color: rgb(209 213 219)

// Dark Mode
"dark:bg-gray-800"  // Applies in dark mode
"dark:text-white"   // Applies in dark mode

// Sizing
"w-full"        // width: 100%
"h-[500px]"     // height: 500px (arbitrary value)
"max-w-7xl"     // max-width: 80rem

// Typography
"text-2xl"      // font-size: 1.5rem
"font-bold"     // font-weight: 700
"text-center"   // text-align: center

// Borders & Shadows
"rounded-lg"    // border-radius: 0.5rem
"shadow-lg"     // box-shadow: large
"border-2"      // border-width: 2px

// Transitions
"transition-colors"  // transition-property: color, background-color, border-color
"duration-200"       // transition-duration: 200ms
"hover:bg-blue-700"  // Hover state

// Responsive
"md:p-8"        // padding: 2rem on medium screens and up
"lg:grid-cols-3"// 3 columns on large screens
```

### Custom Theme Extension Example

```typescript
// If you want to add custom colors:

const config: Config = {
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          500: '#3b82f6',
          900: '#1e3a8a',
        },
        custom: '#ff5733',
      },
      spacing: {
        '128': '32rem',
        '144': '36rem',
      },
      fontSize: {
        'xxs': '0.625rem',
      },
    },
  },
};

// Usage:
<div className="bg-primary-500 text-custom p-128 text-xxs">
```

---

## postcss.config.mjs - PostCSS Configuration

### File Content

```javascript
/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};

export default config;
```

### Configuration Explained

**PostCSS**: Tool untuk transforming CSS dengan JavaScript plugins

**1. tailwindcss plugin**
```css
/* Input CSS */
.bg-blue-500 {
  /* Will be generated by Tailwind */
}

/* Output CSS */
.bg-blue-500 {
  --tw-bg-opacity: 1;
  background-color: rgb(59 130 246 / var(--tw-bg-opacity));
}
```

**2. autoprefixer plugin**
```css
/* Input CSS */
.element {
  display: flex;
  user-select: none;
}

/* Output CSS (with vendor prefixes) */
.element {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-user-select: none;
     -moz-user-select: none;
      -ms-user-select: none;
          user-select: none;
}
```

**Benefits:**
- Cross-browser compatibility
- Automatically adds vendor prefixes
- Based on browserlist configuration

---

## package.json - Dependencies & Scripts

### File Content

```json
{
  "name": "imagetobit-web",
  "version": "1.0.0",
  "private": true,
  "description": "Aplikasi web untuk mengkonversi gambar menjadi tabel matriks RGB",
  "author": "Tugas Pengolahan Citra Digital",
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  },
  "dependencies": {
    "@tanstack/react-virtual": "^3.10.8",
    "next": "15.1.6",
    "react": "^19.0.0",
    "react-dom": "^19.0.0"
  },
  "devDependencies": {
    "@types/node": "^20",
    "@types/react": "^19",
    "@types/react-dom": "^19",
    "autoprefixer": "^10.4.21",
    "eslint": "^8",
    "eslint-config-next": "15.1.6",
    "postcss": "^8",
    "tailwindcss": "^3.4.1",
    "typescript": "^5"
  }
}
```

### Scripts Explained

```bash
# Development server dengan hot reload
npm run dev
# Starts at http://localhost:3000
# Turbopack bundler
# Fast refresh on file changes

# Production build
npm run build
# 1. Type checking (TypeScript)
# 2. Linting (ESLint)
# 3. Bundle optimization
# 4. Generate static pages
# Output: .next/ directory

# Start production server
npm run start
# Must run 'npm run build' first
# Serves optimized production build
# For deployment

# Lint code
npm run lint
# Check for code quality issues
# ESLint rules from eslint-config-next
```

### Dependencies Explained

**Production Dependencies:**

**1. @tanstack/react-virtual**
```typescript
// Virtual scrolling library
// Efficiently render large lists
import { useVirtualizer } from '@tanstack/react-virtual';

const virtualizer = useVirtualizer({
  count: 1000000,
  getScrollElement: () => parentRef.current,
  estimateSize: () => 45,
});
```

**2. next**
```typescript
// React framework
// Provides routing, bundling, optimization
import Link from 'next/link';
import Image from 'next/image';
```

**3. react & react-dom**
```typescript
// Core React libraries
import { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
```

**Dev Dependencies:**

**1. @types/*** (TypeScript type definitions)
```typescript
// Type definitions for JavaScript libraries
// Enables TypeScript IntelliSense
```

**2. autoprefixer**
```javascript
// PostCSS plugin
// Adds vendor prefixes automatically
```

**3. eslint & eslint-config-next**
```javascript
// Code linter
// Enforces code quality rules
// Next.js specific rules
```

**4. postcss**
```javascript
// CSS transformation tool
// Used by Tailwind
```

**5. tailwindcss**
```css
/* Utility-first CSS framework */
```

**6. typescript**
```typescript
// TypeScript compiler
// Type checking
```

### Version Management

```json
// Semantic Versioning: MAJOR.MINOR.PATCH

"next": "15.1.6"          // Exact version
"react": "^19.0.0"        // Compatible with 19.x.x
"@types/node": "^20"      // Compatible with 20.x.x

// ^ (caret): Minor and patch updates allowed
// ~ (tilde): Only patch updates allowed
// No prefix: Exact version required
```

---

## app/layout.tsx - Root Layout

### File Content

```typescript
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Image to RGB Matrix Converter",
  description: "Convert images to RGB matrix table with pixel inspection and CSV export",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
```

### Layout Explained

**Purpose**: Root layout wraps all pages in the application.

**1. Metadata Export**
```typescript
export const metadata: Metadata = {
  title: "Image to RGB Matrix Converter",
  description: "Convert images to RGB matrix...",
};
```

**Generated HTML:**
```html
<head>
  <title>Image to RGB Matrix Converter</title>
  <meta name="description" content="Convert images to RGB matrix...">
  <!-- SEO optimization -->
</head>
```

**2. HTML Structure**
```typescript
<html lang="id">        // Indonesian language
  <body className="antialiased">  // Font smoothing
    {children}          // Page content injected here
  </body>
</html>
```

**3. Global CSS Import**
```typescript
import "./globals.css";
// Applies to all pages
```

### Metadata Options

```typescript
// Extended metadata example:
export const metadata: Metadata = {
  title: {
    default: 'Image to RGB Matrix',
    template: '%s | Image Converter',  // Page title | Image Converter
  },
  description: 'Convert images...',
  keywords: ['image', 'rgb', 'matrix', 'converter'],
  authors: [{ name: 'Your Name' }],
  creator: 'Your Name',
  openGraph: {
    title: 'Image to RGB Matrix Converter',
    description: 'Convert images...',
    images: ['/og-image.png'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Image to RGB Matrix',
    description: 'Convert images...',
  },
};
```

---

## app/globals.css - Global Styles

### File Content

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --background: #ffffff;
  --foreground: #171717;
}

@media (prefers-color-scheme: dark) {
  :root {
    --background: #0a0a0a;
    --foreground: #ededed;
  }
}

body {
  color: var(--foreground);
  background: var(--background);
  font-family: Arial, Helvetica, sans-serif;
}

@layer utilities {
  .text-balance {
    text-wrap: balance;
  }
}
```

### Styles Explained

**1. Tailwind Directives**
```css
@tailwind base;        /* Base styles (normalize.css, etc.) */
@tailwind components;  /* Component classes */
@tailwind utilities;   /* Utility classes (bg-blue-500, etc.) */
```

**2. CSS Variables**
```css
:root {
  --background: #ffffff;
  --foreground: #171717;
}

/* Usage in Tailwind: */
/* bg-background → background-color: var(--background) */
```

**3. Dark Mode Support**
```css
@media (prefers-color-scheme: dark) {
  :root {
    --background: #0a0a0a;    /* Dark background */
    --foreground: #ededed;    /* Light text */
  }
}

/* Automatically switches based on OS/browser setting */
```

**4. Custom Utility Layer**
```css
@layer utilities {
  .text-balance {
    text-wrap: balance;
  }
}

/* Usage: */
<h1 className="text-balance">Title</h1>
```

### Global Styles Best Practices

```css
/* Good: Use Tailwind utilities */
<div className="p-4 bg-white dark:bg-gray-900">

/* Bad: Custom CSS everywhere */
<div style={{ padding: '1rem', background: 'white' }}>

/* Good: CSS variables for theming */
:root {
  --primary-color: #3b82f6;
}

/* Good: Custom utilities in @layer */
@layer utilities {
  .scrollbar-hide {
    scrollbar-width: none;
    -ms-overflow-style: none;
  }
}
```

---

## Build Process Flow

```
Development (npm run dev):
────────────────────────────
Source Files (.tsx, .ts, .css)
         ↓
TypeScript Compiler (type checking)
         ↓
Turbopack Bundler (fast bundling)
         ↓
PostCSS (Tailwind + Autoprefixer)
         ↓
Hot Module Replacement (HMR)
         ↓
Browser (http://localhost:3000)


Production (npm run build):
────────────────────────────
Source Files (.tsx, .ts, .css)
         ↓
TypeScript Compiler (type checking)
         ↓
ESLint (code quality check)
         ↓
Next.js Compiler (optimization)
         ↓
Webpack/Turbopack (bundling)
         ↓
PostCSS (Tailwind + Autoprefixer)
         ↓
Code Splitting (automatic)
         ↓
Minification (JS, CSS)
         ↓
Tree Shaking (remove unused code)
         ↓
.next/ directory (optimized build)
         ↓
Deploy (Vercel, Netlify, etc.)
```

---

## Environment Variables

### Creating .env.local

```bash
# .env.local (not committed to git)
NEXT_PUBLIC_API_URL=https://api.example.com
SECRET_KEY=your-secret-key
```

### Usage

```typescript
// Client-side (NEXT_PUBLIC_ prefix required)
const apiUrl = process.env.NEXT_PUBLIC_API_URL;

// Server-side (no prefix needed)
const secret = process.env.SECRET_KEY;
```

---

**Next**: [07-DEPLOYMENT.md](./07-DEPLOYMENT.md) untuk panduan deployment dan production optimization

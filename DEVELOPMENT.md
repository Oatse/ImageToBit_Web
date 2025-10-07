# Development Workflow

Panduan untuk development workflow yang efisien saat mengembangkan aplikasi.

## 🛠️ Development Environment Setup

### Prerequisites

```bash
# Check Node.js version (18+)
node --version

# Check npm version
npm --version

# Optional: Check if bun is available
bun --version
```

### Initial Setup

```bash
# Clone atau navigate ke project
cd ImageToBit_Web

# Install dependencies
npm install

# Start development server
npm run dev
```

Server akan berjalan di http://localhost:3000

## 📁 File Organization

### When to Create New Files

#### New Component
```bash
# Create in components/ directory
components/MyComponent.tsx
```

#### New Utility
```bash
# Create in utils/ directory
utils/myUtil.ts
```

#### New Type
```bash
# Add to types/index.ts
# Keep all types centralized
```

#### New Worker
```bash
# Create in workers/ directory
workers/myWorker.ts
```

### File Naming Conventions

- **Components:** PascalCase (`ImageUploader.tsx`)
- **Utilities:** camelCase (`imageUtils.ts`)
- **Types:** camelCase (`index.ts`)
- **Constants:** UPPER_SNAKE_CASE (`const MAX_SIZE = 50`)

## 🔄 Development Cycle

### 1. Planning Phase

```
1. Identify feature/bug
2. Break down into tasks
3. Check existing code
4. Plan approach
```

### 2. Implementation Phase

```typescript
// 1. Create branch (if using git)
git checkout -b feature/my-feature

// 2. Make changes
// 3. Test locally
// 4. Fix issues
// 5. Commit

git add .
git commit -m "feat: add new feature"
```

### 3. Testing Phase

```bash
# Check TypeScript errors
npm run lint

# Build to catch build errors
npm run build

# Test in different browsers
# Test different scenarios
```

### 4. Documentation Phase

```
1. Update inline comments
2. Update API.md if needed
3. Update CHANGELOG.md
4. Update README.md if feature is user-facing
```

## 🎯 Common Tasks

### Adding a New Component

```typescript
// 1. Create file: components/NewComponent.tsx
"use client";

import { useState } from "react";

interface NewComponentProps {
  // Define props
  value: string;
  onChange: (value: string) => void;
}

export default function NewComponent({ value, onChange }: NewComponentProps) {
  // Component logic
  return (
    <div>
      {/* JSX */}
    </div>
  );
}

// 2. Export from component (if needed)

// 3. Import in page.tsx
import NewComponent from "@/components/NewComponent";

// 4. Use in JSX
<NewComponent value={value} onChange={handleChange} />
```

### Adding a New Utility Function

```typescript
// 1. Add to utils/imageUtils.ts (or create new file)
/**
 * Description of function
 * @param param - Description
 * @returns Description
 */
export function myUtilFunction(param: string): string {
  // Implementation
  return result;
}

// 2. Import where needed
import { myUtilFunction } from "@/utils/imageUtils";

// 3. Use
const result = myUtilFunction(input);
```

### Adding New Types

```typescript
// 1. Add to types/index.ts
export interface MyNewType {
  id: number;
  name: string;
  data: unknown;
}

// 2. Import where needed
import type { MyNewType } from "@/types";

// 3. Use
const item: MyNewType = {
  id: 1,
  name: "test",
  data: {}
};
```

### Modifying Existing Component

```typescript
// 1. Read component thoroughly
// 2. Understand props and state
// 3. Identify what needs to change
// 4. Make minimal changes
// 5. Test all use cases
// 6. Check for TypeScript errors
// 7. Update prop types if needed
```

## 🐛 Debugging

### React DevTools

```bash
# Install React DevTools browser extension
# Open DevTools → Components tab
# Inspect component props and state
```

### Console Logging

```typescript
// Development only
console.log("Debug:", value);
console.error("Error:", error);
console.warn("Warning:", warning);

// Use conditionally
if (process.env.NODE_ENV === 'development') {
  console.log("Dev only log");
}
```

### TypeScript Errors

```bash
# Check all TypeScript errors
npx tsc --noEmit

# Watch mode
npx tsc --noEmit --watch
```

### Performance Profiling

```typescript
// Use React DevTools Profiler
// Record interaction
// Analyze render times
// Identify slow components
```

### Worker Debugging

```typescript
// In worker file
self.addEventListener('message', (e) => {
  console.log("Worker received:", e.data);
  // Debug worker logic
});

// In main thread
worker.onmessage = (e) => {
  console.log("Main received:", e.data);
};
```

## 🧪 Testing Before Commit

### Checklist

```
□ No TypeScript errors (npm run lint)
□ Application builds (npm run build)
□ No console errors
□ Feature works as expected
□ Edge cases handled
□ Error states handled
□ Loading states shown
□ Responsive on mobile
□ Dark mode works
□ No performance regression
```

### Quick Test Script

```bash
# Run all checks
npm run lint && npm run build

# If all pass, ready to commit
```

## 📦 Managing Dependencies

### Adding New Dependency

```bash
# Install package
npm install package-name

# Dev dependency
npm install -D package-name

# Check if needed
# Verify bundle size impact
# Read documentation
```

### Updating Dependencies

```bash
# Check outdated packages
npm outdated

# Update specific package
npm update package-name

# Update all (carefully!)
npm update

# Test thoroughly after updates
```

### Removing Dependencies

```bash
# Remove package
npm uninstall package-name

# Remove from code
# Check for any remaining imports
# Test application
```

## 🔧 Configuration Changes

### Tailwind Config

```typescript
// tailwind.config.ts
export default {
  theme: {
    extend: {
      // Add custom colors, spacing, etc.
      colors: {
        'custom': '#123456'
      }
    }
  }
};

// Use in components
className="bg-custom"
```

### Next.js Config

```typescript
// next.config.ts
const nextConfig: NextConfig = {
  // Add configuration
  experimental: {
    // Enable experimental features
  }
};
```

### TypeScript Config

```json
// tsconfig.json
{
  "compilerOptions": {
    // Modify compiler options
    "strict": true
  }
}
```

## 🚀 Performance Tips

### 1. Optimize Re-renders

```typescript
// Use useMemo for expensive calculations
const expensiveValue = useMemo(() => {
  return computeExpensiveValue(data);
}, [data]);

// Use useCallback for functions
const handleClick = useCallback(() => {
  doSomething();
}, [dependency]);
```

### 2. Code Splitting

```typescript
// Dynamic imports
const HeavyComponent = dynamic(() => import('./HeavyComponent'), {
  loading: () => <p>Loading...</p>
});
```

### 3. Image Optimization

```typescript
// Use Next.js Image component (for static images)
import Image from 'next/image';

<Image src="/image.jpg" width={500} height={300} alt="Description" />
```

## 🎨 Styling Guidelines

### Tailwind Usage

```typescript
// Prefer Tailwind utilities
className="px-4 py-2 bg-blue-600 hover:bg-blue-700"

// Group related utilities
className="flex items-center justify-center gap-2"

// Use responsive prefixes
className="text-sm md:text-base lg:text-lg"

// Dark mode
className="bg-white dark:bg-gray-800"
```

### Custom Styles

```css
/* Only when Tailwind utilities insufficient */
.custom-style {
  /* Custom CSS */
}
```

## 📊 Git Workflow

### Branch Naming

```
feature/feature-name
fix/bug-name
refactor/what-refactored
docs/what-documented
```

### Commit Messages

```
feat: add new feature
fix: resolve bug
refactor: improve code structure
docs: update documentation
style: format code
test: add tests
chore: update dependencies
```

### Before Push

```bash
# 1. Lint
npm run lint

# 2. Build
npm run build

# 3. Test locally

# 4. Commit
git add .
git commit -m "feat: descriptive message"

# 5. Push
git push origin branch-name
```

## 🔍 Code Review

### Self Review Checklist

```
□ Code follows conventions
□ No commented-out code
□ No console.logs (except necessary)
□ No TypeScript errors
□ Props properly typed
□ Error handling present
□ Loading states handled
□ Edge cases considered
□ Comments for complex logic
□ Performance optimized
```

## 📚 Learning Resources

### Next.js
- [Next.js Documentation](https://nextjs.org/docs)
- [Next.js Examples](https://github.com/vercel/next.js/tree/canary/examples)

### TypeScript
- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/)
- [React TypeScript Cheatsheet](https://react-typescript-cheatsheet.netlify.app/)

### Tailwind CSS
- [Tailwind Documentation](https://tailwindcss.com/docs)
- [Tailwind Cheatsheet](https://nerdcave.com/tailwind-cheat-sheet)

### TanStack Virtual
- [TanStack Virtual Docs](https://tanstack.com/virtual/latest)

---

## 💡 Pro Tips

1. **Use TypeScript strict mode** - Catch errors early
2. **Keep components small** - Single responsibility
3. **Extract reusable logic** - DRY principle
4. **Write self-documenting code** - Clear naming
5. **Test edge cases** - Don't assume happy path
6. **Profile performance** - Don't premature optimize
7. **Read error messages** - They usually tell you what's wrong
8. **Use React DevTools** - Invaluable for debugging
9. **Keep dependencies updated** - Security & features
10. **Document complex code** - Future you will thank you

---

**Happy developing! 🚀**

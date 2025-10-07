# Deployment Guide

Panduan untuk mendeploy aplikasi Image to RGB Matrix Converter ke berbagai platform.

## Build untuk Production

```bash
# Build aplikasi
npm run build

# Test production build locally
npm start
```

## Platform Deployment

### 1. Vercel (Recommended)

Vercel adalah platform terbaik untuk Next.js applications.

#### Via Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

#### Via Vercel Dashboard

1. Push code ke GitHub/GitLab/Bitbucket
2. Import project di [vercel.com/new](https://vercel.com/new)
3. Vercel akan otomatis detect Next.js dan configure
4. Click "Deploy"

**Environment Variables**: Tidak ada yang diperlukan untuk versi dasar

### 2. Netlify

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Build
npm run build

# Deploy
netlify deploy --prod
```

**Build Settings:**
- Build command: `npm run build`
- Publish directory: `.next`

### 3. Static Export (untuk hosting statis)

Jika Anda ingin export sebagai static HTML:

1. Update `next.config.ts`:
```typescript
const nextConfig: NextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
};
```

2. Build:
```bash
npm run build
```

3. Deploy folder `out/` ke hosting statis:
   - GitHub Pages
   - AWS S3
   - Firebase Hosting
   - Cloudflare Pages

### 4. Docker

#### Dockerfile

```dockerfile
FROM node:18-alpine AS base

# Dependencies
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package*.json ./
RUN npm ci

# Builder
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# Runner
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000

CMD ["node", "server.js"]
```

#### Build dan Run

```bash
# Build image
docker build -t imagetobit-web .

# Run container
docker run -p 3000:3000 imagetobit-web
```

### 5. Self-Hosted (VPS/Dedicated Server)

#### Menggunakan PM2

1. Install PM2:
```bash
npm install -g pm2
```

2. Build aplikasi:
```bash
npm run build
```

3. Start dengan PM2:
```bash
pm2 start npm --name "imagetobit-web" -- start
pm2 save
pm2 startup
```

#### Menggunakan Nginx sebagai Reverse Proxy

```nginx
server {
    listen 80;
    server_name yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## Environment Configuration

### Production Environment Variables

Buat file `.env.production` jika diperlukan:

```env
# Contoh - sesuaikan dengan kebutuhan
NEXT_PUBLIC_API_URL=https://api.yourdomain.com
NEXT_PUBLIC_ANALYTICS_ID=your-analytics-id
```

### Security Headers

Update `next.config.ts` untuk production:

```typescript
const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
        ],
      },
    ];
  },
};
```

## Performance Optimization

### 1. Image Optimization

Aplikasi sudah menggunakan Canvas API yang efficient, tapi untuk production:

- Set maximum file size yang reasonable (50MB sudah cukup)
- Consider adding image compression before processing
- Implement lazy loading untuk components yang tidak langsung diperlukan

### 2. Caching

```typescript
// next.config.ts
const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: '/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
};
```

### 3. Bundle Size

Check bundle size:
```bash
npm run build
# Akan menampilkan size analysis
```

## Monitoring

### 1. Error Tracking

Integrate dengan Sentry:

```bash
npm install @sentry/nextjs
```

```typescript
// sentry.client.config.ts
import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  tracesSampleRate: 1.0,
});
```

### 2. Analytics

Integrate dengan Google Analytics atau Vercel Analytics:

```typescript
// app/layout.tsx
import { Analytics } from '@vercel/analytics/react';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
```

## Troubleshooting

### Build Errors

1. **Out of Memory**
   ```bash
   NODE_OPTIONS="--max-old-space-size=4096" npm run build
   ```

2. **TypeScript Errors**
   ```bash
   npm run lint
   tsc --noEmit
   ```

3. **Missing Dependencies**
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

### Runtime Errors

1. **Web Worker tidak load**
   - Pastikan Next.js config sudah benar
   - Check CORS headers
   - Verify worker file path

2. **Canvas Issues**
   - Pastikan browser support Canvas API
   - Check CSP headers tidak block canvas

## Post-Deployment Checklist

- [ ] Aplikasi dapat diakses di production URL
- [ ] Upload gambar berfungsi
- [ ] Pixel inspection (hover) berfungsi
- [ ] Click processing berfungsi
- [ ] Tabel virtual render dengan baik
- [ ] Search koordinat berfungsi
- [ ] Export CSV berfungsi
- [ ] Dark mode toggle berfungsi
- [ ] Responsive di mobile
- [ ] Performance metrics acceptable
- [ ] No console errors
- [ ] Analytics tracking (jika ada)

## Support

Untuk pertanyaan atau masalah deployment, buat issue di repository atau hubungi maintainer.

---

**Good luck dengan deployment! 🚀**

# 🚀 Deployment Guide - Ticketing Hub

This guide covers deploying your Ticketing Hub application to various platforms.

## 📦 Production Build

Your production build is ready in the `code/dist/` directory!

**Build stats:**
- ✅ TypeScript compilation successful
- ✅ Vite production build complete
- 📦 Total size: ~590 KB (173 KB gzipped)
- 🎨 CSS: 25.6 KB (5.24 KB gzipped)
- ⚡ JavaScript: 563.8 KB (172.7 KB gzipped)

## 🌐 Deployment Options

### Option 1: Vercel (Recommended) ⚡

**Fastest and easiest deployment**

```bash
# Install Vercel CLI
npm install -g vercel

# Navigate to your project
cd /Users/arnon/Desktop/ticketing-hub/code

# Deploy
vercel

# Follow prompts:
# - Link to Vercel account
# - Set up project
# - Deploy!
```

**Or deploy via Git:**
1. Push code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Import your repository
4. Vercel auto-detects Vite
5. Click "Deploy"

**Configuration:** Zero config needed! Vercel automatically detects Vite.

---

### Option 2: Netlify 🎯

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Navigate to project
cd /Users/arnon/Desktop/ticketing-hub/code

# Deploy
netlify deploy

# For production
netlify deploy --prod
```

**Or deploy via Git:**
1. Push to GitHub
2. Go to [netlify.com](https://netlify.com)
3. Click "Add new site" → "Import an existing project"
4. Connect to GitHub
5. Configure:
   - Build command: `npm run build`
   - Publish directory: `dist`
6. Deploy!

**Configuration (netlify.toml):**
```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

---

### Option 3: GitHub Pages 📄

```bash
# Install gh-pages
npm install -D gh-pages

# Add to package.json scripts:
{
  "scripts": {
    "predeploy": "npm run build",
    "deploy": "gh-pages -d dist"
  }
}

# Deploy
npm run deploy
```

**Important:** Update `vite.config.ts`:
```typescript
export default defineConfig({
  base: '/ticketing-hub/', // Your repo name
  // ... rest of config
})
```

**Steps:**
1. Create GitHub repository
2. Push code
3. Run `npm run deploy`
4. Enable GitHub Pages in repository settings
5. Select `gh-pages` branch

---

### Option 4: AWS S3 + CloudFront ☁️

**For enterprise deployments**

```bash
# Install AWS CLI
# Configure AWS credentials

# Build
npm run build

# Sync to S3
aws s3 sync dist/ s3://your-bucket-name --delete

# Invalidate CloudFront cache
aws cloudfront create-invalidation --distribution-id YOUR_ID --paths "/*"
```

**Setup:**
1. Create S3 bucket
2. Enable static website hosting
3. Create CloudFront distribution
4. Point to S3 bucket
5. Configure custom domain (optional)

---

### Option 5: Docker 🐳

**Dockerfile:**
```dockerfile
# Build stage
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Production stage
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

**nginx.conf:**
```nginx
server {
    listen 80;
    server_name localhost;
    root /usr/share/nginx/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /assets {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

**Build and run:**
```bash
docker build -t ticketing-hub .
docker run -p 8080:80 ticketing-hub
```

---

## 🔧 Environment Configuration

### Current Setup
The app currently uses **mock data** - no backend or environment variables needed!

### Future Backend Integration

When you add a backend, create `.env` files:

**.env.example:**
```bash
VITE_API_URL=https://api.yourdomain.com
VITE_AUTH_DOMAIN=your-auth-domain
```

**Update code to use:**
```typescript
const API_URL = import.meta.env.VITE_API_URL;
```

---

## ✅ Pre-Deployment Checklist

- [x] Production build successful (`npm run build`)
- [x] No TypeScript errors
- [x] All features tested locally
- [x] README.md created
- [x] 404 page implemented
- [x] Page title updated
- [ ] Domain name configured (if using custom domain)
- [ ] Analytics added (optional: Google Analytics, Plausible, etc.)
- [ ] Error tracking setup (optional: Sentry, LogRocket, etc.)

---

## 📊 Performance Optimization (Optional)

### Code Splitting
Current bundle is ~564 KB. For better performance:

**vite.config.ts:**
```typescript
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'ui-vendor': ['@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu'],
          'form-vendor': ['react-hook-form', 'zod'],
        }
      }
    }
  }
})
```

### Image Optimization
Add images to `public/` directory and use Vite's asset handling.

### CDN
Use Vercel Edge Network or CloudFront for global distribution.

---

## 🔐 Security Headers

Add these headers in your platform:

**Vercel (vercel.json):**
```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-XSS-Protection",
          "value": "1; mode=block"
        }
      ]
    }
  ]
}
```

---

## 📱 Custom Domain Setup

### Vercel
1. Go to project settings
2. Click "Domains"
3. Add your domain
4. Follow DNS configuration instructions

### Netlify
1. Go to "Domain settings"
2. Click "Add custom domain"
3. Update DNS records

---

## 🐛 Troubleshooting

### Build Fails
```bash
# Clear cache and rebuild
rm -rf node_modules/.vite
npm run build
```

### 404 on Refresh
Configure your platform for SPA routing (see platform sections above).

### Assets Not Loading
Ensure `base` in `vite.config.ts` matches your deployment path.

---

## 📈 Monitoring (Optional)

### Add Analytics
```html
<!-- Add to index.html -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_ID"></script>
```

### Error Tracking
```bash
npm install @sentry/react
```

---

## 🎉 You're Ready to Deploy!

**Quick Deploy (Vercel):**
```bash
cd /Users/arnon/Desktop/ticketing-hub/code
vercel
```

**Your app will be live in ~60 seconds! 🚀**

---

## 📞 Support

Need help? Check:
- [Vite Deployment Guide](https://vitejs.dev/guide/static-deploy.html)
- [Vercel Documentation](https://vercel.com/docs)
- [Netlify Documentation](https://docs.netlify.com/)

---

**Happy Deploying! 🎊**


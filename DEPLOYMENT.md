# Deployment Guide

This guide covers deploying the SAM.gov Integrity Records System to various platforms.

## Quick Start

### Prerequisites
- Node.js 18+ installed
- Git installed
- GitHub account

## GitHub Setup

### 1. Create a New Repository

```bash
# Initialize git (if not already done)
git init

# Add all files
git add .

# Initial commit
git commit -m "feat: initial commit - SAM.gov Integrity Records System"

# Create repository on GitHub, then:
git remote add origin https://github.com/your-username/sam-gov-integrity-records.git
git branch -M main
git push -u origin main
```

### 2. Repository Settings

**Recommended settings:**
- Add description: "Modern interface for federal contractor integrity records management"
- Add topics: `sam-gov`, `federal-government`, `uswds`, `react`, `typescript`, `contracting`
- Enable Issues for bug tracking
- Enable Discussions for community feedback

## Deployment Options

### Option 1: GitHub Pages

**Step 1: Update vite.config.ts**
```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/sam-gov-integrity-records/', // Your repo name
});
```

**Step 2: Add deployment script to package.json**
```json
{
  "scripts": {
    "deploy": "vite build && gh-pages -d dist"
  }
}
```

**Step 3: Install gh-pages**
```bash
pnpm add -D gh-pages
```

**Step 4: Deploy**
```bash
pnpm run deploy
```

**Step 5: Enable GitHub Pages**
- Go to repository Settings → Pages
- Source: Deploy from a branch
- Branch: `gh-pages`, folder: `/ (root)`
- Save

Your site will be live at: `https://your-username.github.io/sam-gov-integrity-records/`

### Option 2: Vercel

**Step 1: Install Vercel CLI**
```bash
pnpm add -g vercel
```

**Step 2: Deploy**
```bash
vercel
```

**Step 3: Follow prompts**
- Link to existing project or create new
- Vercel will auto-detect Vite configuration
- Deploy

**Settings:**
- Build Command: `vite build`
- Output Directory: `dist`
- Install Command: `pnpm install`

Your site will be live at: `https://your-project.vercel.app`

### Option 3: Netlify

**Step 1: Create netlify.toml**
```toml
[build]
  command = "pnpm build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

**Step 2: Deploy**

**Via CLI:**
```bash
pnpm add -g netlify-cli
netlify deploy --prod
```

**Via Web Interface:**
1. Go to https://app.netlify.com
2. Connect your GitHub repository
3. Configure build settings:
   - Build command: `pnpm build`
   - Publish directory: `dist`
4. Deploy

Your site will be live at: `https://your-project.netlify.app`

### Option 4: AWS Amplify

**Step 1: Create amplify.yml**
```yaml
version: 1
frontend:
  phases:
    preBuild:
      commands:
        - npm install -g pnpm
        - pnpm install
    build:
      commands:
        - pnpm build
  artifacts:
    baseDirectory: dist
    files:
      - '**/*'
  cache:
    paths:
      - node_modules/**/*
```

**Step 2: Deploy via AWS Console**
1. Go to AWS Amplify Console
2. Connect your GitHub repository
3. AWS will auto-detect the configuration
4. Deploy

## Environment Variables

If you add backend integration, create `.env` file:

```env
# API Configuration
VITE_API_BASE_URL=https://api.sam.gov
VITE_API_KEY=your_api_key_here

# Feature Flags
VITE_ENABLE_ANALYTICS=false
VITE_ENABLE_NOTIFICATIONS=true
```

**Important:** Never commit `.env` to Git. Use platform-specific environment variable settings.

## CI/CD Setup

### GitHub Actions (Recommended)

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        
    - name: Setup pnpm
      uses: pnpm/action-setup@v2
      with:
        version: 8
        
    - name: Install dependencies
      run: pnpm install
      
    - name: Build
      run: pnpm build
      
    - name: Deploy to GitHub Pages
      if: github.ref == 'refs/heads/main'
      uses: peaceiris/actions-gh-pages@v3
      with:
        github_token: ${{ secrets.GITHUB_TOKEN }}
        publish_dir: ./dist
```

## Production Checklist

Before deploying to production:

- [ ] Update all TODO comments
- [ ] Remove or replace mock data with real API calls
- [ ] Configure proper error handling
- [ ] Set up analytics (if required)
- [ ] Enable error tracking (Sentry, etc.)
- [ ] Test on all target browsers
- [ ] Verify mobile responsiveness
- [ ] Check accessibility compliance
- [ ] Review security headers
- [ ] Set up monitoring
- [ ] Configure backup strategy
- [ ] Document API endpoints
- [ ] Set up staging environment
- [ ] Create rollback plan

## Performance Optimization

### Build Optimization
```bash
# Analyze bundle size
pnpm add -D rollup-plugin-visualizer

# Add to vite.config.ts
import { visualizer } from 'rollup-plugin-visualizer';

export default defineConfig({
  plugins: [
    react(),
    visualizer({ open: true })
  ],
});
```

### Lighthouse Checks
```bash
# Install Lighthouse CLI
npm install -g lighthouse

# Run audit
lighthouse https://your-site.com --view
```

## Troubleshooting

### Build Fails
```bash
# Clear cache and reinstall
rm -rf node_modules pnpm-lock.yaml
pnpm install
pnpm build
```

### 404 on Routes
- Ensure SPA redirect is configured (see Netlify example)
- Check base URL in vite.config.ts

### Slow Build Times
- Check bundle size
- Lazy load large components
- Use dynamic imports for routes

## Support

For deployment issues:
1. Check build logs for errors
2. Verify environment variables
3. Test build locally: `pnpm build && pnpm preview`
4. Check platform-specific documentation
5. Open an issue on GitHub

## Monitoring

### Recommended Tools
- **Uptime**: UptimeRobot, Pingdom
- **Analytics**: Google Analytics, Plausible
- **Errors**: Sentry, LogRocket
- **Performance**: Lighthouse, WebPageTest

---

**Note:** This is a demonstration application. For production federal systems, follow your agency's deployment and security requirements.

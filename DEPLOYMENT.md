# Deployment Guide

This project is configured for automatic deployment to Vercel via GitHub Actions.

## 🚀 Quick Setup

### Step 1: Create a Vercel Account

1. Go to [vercel.com](https://vercel.com) and sign up (free)
2. Connect your GitHub account

### Step 2: Create a Vercel Project

**Option A: Via Vercel Dashboard (Easiest)**
1. Go to [vercel.com/new](https://vercel.com/new)
2. Import your GitHub repository
3. Vercel will auto-detect the settings from `vercel.json`
4. Click "Deploy"

**Option B: Via Vercel CLI**
```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Link project (run in project root)
vercel link

# Deploy
vercel --prod
```

### Step 3: Get Vercel Credentials for GitHub Actions

1. **Get your Vercel Token:**
   - Go to [vercel.com/account/tokens](https://vercel.com/account/tokens)
   - Create a new token with a descriptive name (e.g., "github-actions")
   - Copy the token

2. **Get Organization ID and Project ID:**
   - After running `vercel link`, check `.vercel/project.json` file
   - Or find them in your Vercel dashboard project settings

### Step 4: Add GitHub Secrets

Go to your GitHub repo → Settings → Secrets and variables → Actions

Add these secrets:
| Secret Name | Value |
|-------------|-------|
| `VERCEL_TOKEN` | Your Vercel API token |
| `VERCEL_ORG_ID` | Your Vercel Organization/Team ID |
| `VERCEL_PROJECT_ID` | Your Vercel Project ID |

### Step 5: Deploy!

Push to `main` or `master` branch → Auto-deploys to production 🎉

## 📋 Deployment Workflow

| Trigger | Environment | URL |
|---------|-------------|-----|
| Push to `main`/`master` | Production | your-app.vercel.app |
| Pull Request | Preview | unique-preview-url.vercel.app |

## 🔧 Configuration Files

- `vercel.json` - Vercel build and routing config
- `.github/workflows/deploy.yml` - GitHub Actions workflow

## 🐛 Troubleshooting

### Build Fails
```bash
# Test build locally
npm run build
```

### Routing Issues (404 on refresh)
The `vercel.json` includes rewrites for SPA routing. All routes redirect to `index.html`.

### Environment Variables
Add any env vars in:
1. Vercel Dashboard → Project → Settings → Environment Variables
2. Or in `.env.production` (don't commit secrets!)

## 🔗 Useful Links

- [Vercel Documentation](https://vercel.com/docs)
- [GitHub Actions for Vercel](https://vercel.com/guides/how-can-i-use-github-actions-with-vercel)
- [Vercel CLI Reference](https://vercel.com/docs/cli)

# Deployment Guide

This project is configured for automatic deployment to Vercel via GitHub Actions.

## 🚀 Quick Setup (2 Steps!)

### Step 1: Get Vercel Token

1. Go to [vercel.com](https://vercel.com) and sign up (free)
2. Go to [vercel.com/account/tokens](https://vercel.com/account/tokens)
3. Click "Create Token"
4. Name it (e.g., "github-actions") and copy the token

### Step 2: Add GitHub Secret

1. Go to your GitHub repo → **Settings** → **Secrets and variables** → **Actions**
2. Click **"New repository secret"**
3. Add:
   - **Name:** `VERCEL_TOKEN`
   - **Value:** Your Vercel token from Step 1

### That's it! 🎉

Push to `main` or `master` → Auto-deploys to production!

The first deploy will automatically create the Vercel project for you.

---

## Alternative: Vercel Dashboard (No GitHub Actions)

If you prefer Vercel's built-in Git integration:

1. Go to [vercel.com/new](https://vercel.com/new)
2. Import your GitHub repository
3. Vercel auto-detects settings from `vercel.json`
4. Click "Deploy"

Vercel will automatically deploy on every push - no GitHub Actions needed!

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

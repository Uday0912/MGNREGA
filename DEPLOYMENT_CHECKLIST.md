# 🚀 Vercel Deployment Checklist

## Step 1: Commit Your Changes ✅

Your project already has Git setup. Commit the new Vercel configuration files:

```bash
# Add all new files
git add .

# Commit with a message
git commit -m "Add Vercel deployment configuration with dynamic API detection"

# Push to GitHub
git push origin main
```

## Step 2: Deploy to Vercel

### Option A: Deploy via Vercel Dashboard (Easiest)

1. **Go to [vercel.com](https://vercel.com)** and sign in (or sign up for free)

2. **Click "New Project"**

3. **Import your GitHub repository**
   - Select your MGNREGA repository
   - Click "Import"

4. **Configure the project:**
   - **Framework Preset**: Leave as "Other" or "Create React App" (auto-detected)
   - **Root Directory**: Keep as `.` (root)
   - **Build Command**: `cd frontend && npm ci && npm run build`
   - **Output Directory**: `frontend/build`
   - **Install Command**: `cd frontend && npm ci`

5. **Add Environment Variable:**
   - Click "Environment Variables"
   - Add: `REACT_APP_API_URL`
   - Value: `https://your-backend-url.com/api`
     - Replace with your actual backend URL (from Render, Railway, etc.)
     - If backend not deployed yet, you can add this later

6. **Click "Deploy"**

7. **Wait for deployment to complete** (~2-3 minutes)

### Option B: Deploy via Vercel CLI (Advanced)

```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Deploy (from project root)
vercel

# Follow prompts:
# - Set up and deploy? Yes
# - Which scope? (Your account)
# - Link to existing project? No (first time)
# - Project name: mgnrega-dashboard
# - Directory: ./
# - Override settings? No

# Add environment variable
vercel env add REACT_APP_API_URL
# Enter your backend API URL when prompted
# Select: Production, Preview, Development

# Deploy to production
vercel --prod
```

## Step 3: Deploy Your Backend (If Not Already Done)

Your backend needs to be deployed separately. Recommended options:

### Option A: Deploy to Render (Recommended)

1. **Go to [render.com](https://render.com)** and sign up
2. **New → Web Service**
3. **Connect your GitHub repository**
4. **Configure:**
   - **Name**: `mgnrega-backend`
   - **Environment**: Node
   - **Build Command**: `cd backend && npm install`
   - **Start Command**: `cd backend && npm start`
   - **Root Directory**: `backend`

5. **Add Environment Variables:**
   - `MONGODB_URI` = your MongoDB connection string
   - `NODE_ENV` = `production`
   - `FRONTEND_URLS` = `https://your-vercel-app.vercel.app` (your Vercel frontend URL)
   - `DATA_GOV_API_KEY` = your API key

6. **Deploy**

### Option B: Use Existing Backend

If you already have a backend deployed, just update the `REACT_APP_API_URL` in Vercel with your backend URL.

## Step 4: Update Environment Variables

After both frontend and backend are deployed:

1. **In Vercel Dashboard:**
   - Go to your project → Settings → Environment Variables
   - Update `REACT_APP_API_URL` to your backend URL (if not set)
   - Redeploy

2. **In Backend (Render/Railway/etc.):**
   - Update `FRONTEND_URLS` to include your Vercel URL
   - Example: `https://your-app.vercel.app,https://your-app-git-main.vercel.app`

## Step 5: Test Your Deployment

1. **Visit your Vercel URL**: `https://your-app.vercel.app`
2. **Check browser console** for any errors
3. **Test API connection**: Navigate the dashboard and verify data loads
4. **Test backend health**: Visit `https://your-backend-url.com/health`

## ✅ Quick Commands Reference

```bash
# Commit and push changes
git add .
git commit -m "Add Vercel deployment config"
git push

# Deploy with Vercel CLI
vercel
vercel --prod

# Check deployment status
vercel ls
```

## 🆘 Troubleshooting

- **Build fails?** Check Vercel build logs in the dashboard
- **API not connecting?** Verify `REACT_APP_API_URL` is set correctly
- **CORS errors?** Make sure `FRONTEND_URLS` in backend includes your Vercel domain
- **404 on routes?** The SPA rewrite should handle this automatically

## 📚 Next Steps After Deployment

- Set up custom domain (optional)
- Enable Vercel Analytics
- Set up monitoring and error tracking
- Configure preview deployments for PRs

---

**Need help?** Check `VERCEL_DEPLOYMENT.md` for detailed documentation.


# ⚡ Quick Deploy Guide - Full Stack on Vercel

## 🚀 One-Time Setup

### In Vercel Dashboard:

1. **Project Settings:**
   - **Project Name:** `mgnrega`
   - **Framework Preset:** `Other`
   - **Root Directory:** `.` (leave empty)
   - **Build Command:** `cd frontend; npm ci; npm run build`
   - **Output Directory:** `frontend/build`
   - **Install Command:** `cd frontend; npm ci; cd ../backend; npm ci`

2. **Environment Variables** (add all of these):

   ```
   MONGODB_URI=mongodb+srv://Eren_db_user:Uday_0912@cluster0.akg05hj.mongodb.net/mgnrega_data?retryWrites=true&w=majority
   DATA_GOV_API_KEY=579b464db66ec23bdd000001cdd3946e44ce4aad7209ff7b23ac571b
   CRON_SECRET=your-random-secret-string-here
   NODE_ENV=production
   ```

   **⚠️ Important:** 
   - You **CANNOT** use `mongodb://localhost:27017` - Vercel needs cloud MongoDB
   - Use **MongoDB Atlas** (free tier) - see `MONGODB_SETUP.md` for setup guide
   - Connection string format: `mongodb+srv://user:pass@cluster.mongodb.net/mgnrega_data?retryWrites=true&w=majority`

   **Important:** 
   - Check all three boxes: Production, Preview, Development
   - Generate a random string for `CRON_SECRET` (e.g., use: `openssl rand -hex 32`)

3. **Click "Deploy"** 🎉

## ✅ That's It!

Your app will be deployed with:
- ✅ Frontend on `/`
- ✅ Backend API on `/api/*`
- ✅ Automatic data sync (daily at 2 AM)
- ✅ MongoDB connection pooling
- ✅ CORS configured automatically

## 📍 Your URLs

- **Frontend:** `https://your-app.vercel.app`
- **API:** `https://your-app.vercel.app/api`
- **Health Check:** `https://your-app.vercel.app/api/health`

## 🧪 Quick Test

```bash
# Test API
curl https://your-app.vercel.app/api/health

# Should return: {"status":"OK",...}
```

---

## 📝 Complete Step-by-Step Deployment Guide

### Step 1: Prepare Your GitHub Repository

1. **Ensure your code is pushed to GitHub:**
   ```bash
   git add .
   git commit -m "Prepare for Vercel deployment"
   git push origin main
   ```

### Step 2: Connect to Vercel

1. Go to [vercel.com](https://vercel.com) and sign in (or create an account)
2. Click **"New Project"** button
3. Click **"Import Git Repository"**
4. If this is your first time:
   - Click **"Configure"** next to GitHub
   - Authorize Vercel to access your GitHub account
   - Select **"Only select repositories"** → Choose your `MGNREGA` repository
   - Click **"Install"**
5. Select your repository and click **"Import"**

### Step 3: Configure Project Settings

Vercel should auto-detect your settings, but verify these:

- **Project Name:** `mgnrega` (or your preferred name)
- **Framework Preset:** `Other` or `Create React App`
- **Root Directory:** Leave as `.` (default)
- **Build Command:** `cd frontend; npm ci; npm run build`
- **Output Directory:** `frontend/build`
- **Install Command:** `cd frontend; npm ci; cd ../backend; npm ci`

### Step 4: Add Environment Variables

**CRITICAL:** Add these BEFORE clicking Deploy!

Click **"Environment Variables"** and add each one:

| Variable | Value | Environment |
|----------|-------|-------------|
| `MONGODB_URI` | `mongodb+srv://Eren_db_user:Uday_0912@cluster0.akg05hj.mongodb.net/mgnrega_data?retryWrites=true&w=majority` | Production, Preview, Development |
| `DATA_GOV_API_KEY` | `579b464db66ec23bdd000001cdd3946e44ce4aad7209ff7b23ac571b` | Production, Preview, Development |
| `CRON_SECRET` | `your-random-secret-here` | Production, Preview, Development |
| `NODE_ENV` | `production` | Production, Preview, Development |

**Important:**
- ✅ Check ALL THREE boxes (Production, Preview, Development) for each variable
- ⚠️ For `CRON_SECRET`, generate a random string (you can use: `openssl rand -hex 32`)

### Step 5: Deploy

1. Click **"Deploy"** button
2. Wait 2-3 minutes for the build to complete
3. You'll see a success message with your URL!

### Step 6: Verify Deployment

1. **Check Frontend:**
   - Visit `https://your-app.vercel.app`
   - Should load the MGNREGA dashboard

2. **Check Backend API:**
   ```bash
   curl https://your-app.vercel.app/api/health
   ```
   Should return: `{"status":"OK","timestamp":"..."}`

3. **Test API Endpoints:**
   ```bash
   curl https://your-app.vercel.app/api/districts
   ```

### Step 7: Automatic Updates

**Every time you push to GitHub:**
- Vercel automatically deploys the latest version
- No manual steps needed!
- Each deployment gets a unique preview URL

## 🔧 Troubleshooting

### Build Fails

**Error:** "Cannot find module"
- ✅ Check `Install Command` includes both `frontend` and `backend` npm install
- ✅ Verify `package.json` files exist in both folders

**Error:** "MONGODB_URI is not defined"
- ✅ Verify environment variables are added
- ✅ Check all three environment boxes are selected

### API Returns 404

- ✅ Check `vercel.json` exists and has correct rewrites
- ✅ Verify `api/index.js` exists
- ✅ Check deployment logs in Vercel dashboard

### MongoDB Connection Fails

- ✅ Verify IP whitelist in MongoDB Atlas includes `0.0.0.0/0`
- ✅ Check username/password are correct
- ✅ Ensure database user has read/write permissions

### Cron Job Not Running

- ✅ Verify `CRON_SECRET` is set in environment variables
- ✅ Check `vercel.json` has cron configuration
- ✅ Wait for the scheduled time (2 AM UTC daily)

## 📚 Additional Resources

- 📖 [MongoDB Setup Guide](MONGODB_SETUP.md)
- 🔗 [Vercel Documentation](https://vercel.com/docs)
- 💡 [MongoDB Atlas Docs](https://docs.atlas.mongodb.com/)

## ✅ Deployment Checklist

Before deploying, ensure:
- [ ] Code pushed to GitHub
- [ ] MongoDB Atlas cluster created
- [ ] Database user configured
- [ ] Network access whitelisted (0.0.0.0/0)
- [ ] All environment variables added to Vercel
- [ ] Production, Preview, and Development checked for each variable
- [ ] `vercel.json` exists in root directory
- [ ] `api/index.js` exists
- [ ] Frontend build works locally (`npm run build`)


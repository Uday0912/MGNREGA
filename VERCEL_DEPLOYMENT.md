# Vercel Deployment Guide

This guide will help you deploy the MGNREGA Dashboard to Vercel.

## Prerequisites

1. A [Vercel account](https://vercel.com/signup) (free tier is fine)
2. Vercel CLI installed (optional, for CLI deployment)
3. Your backend API deployed somewhere (Render, Railway, Heroku, etc.)
4. MongoDB Atlas account (or your MongoDB connection string)

## Deployment Options

### Option 1: Frontend Only on Vercel (Recommended)

Deploy the React frontend to Vercel and host the backend separately.

#### Step 1: Prepare the Backend

Deploy your backend to a service that supports Node.js and MongoDB:
- **Render** (recommended - already configured with `render.yaml`)
- Railway
- Heroku
- DigitalOcean App Platform

Set these environment variables in your backend:
```
MONGODB_URI=your_mongodb_connection_string
NODE_ENV=production
FRONTEND_URLS=https://your-vercel-app.vercel.app
DATA_GOV_API_KEY=your_api_key
```

#### Step 2: Deploy Frontend to Vercel

**Using Vercel Dashboard:**

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click "New Project"
3. Import your Git repository
4. Configure the project:
   - **Root Directory**: Keep as root (`.`)
   - **Framework Preset**: Create React App (auto-detected)
   - **Build Command**: `cd frontend && npm install && npm run build`
   - **Output Directory**: `frontend/build`
   - **Install Command**: `cd frontend && npm install`

5. Add Environment Variables:
   - `REACT_APP_API_URL`: `https://your-backend-url.com/api`
     - Replace `your-backend-url.com` with your actual backend URL
     - **Note**: This is optional but recommended. If not set, the app will try to auto-detect the API URL from the current origin.

6. Click "Deploy"

**Using Vercel CLI:**

```bash
# Install Vercel CLI globally
npm install -g vercel

# Login to Vercel
vercel login

# Deploy (from project root)
vercel

# For production deployment
vercel --prod
```

When prompted:
- Set up and deploy: **Yes**
- Which scope: **Your account**
- Link to existing project: **No** (first time) or **Yes** (if updating)
- Project name: **mgnrega-dashboard** (or your preferred name)
- In which directory is your code located: **./**

Then set environment variable:
```bash
vercel env add REACT_APP_API_URL
# Enter: https://your-backend-url.com/api
# Select: Production, Preview, Development
```

#### Step 3: Update Backend CORS Settings

After your frontend is deployed, update your backend's `FRONTEND_URLS` environment variable to include your Vercel domain:
```
FRONTEND_URLS=https://your-app.vercel.app,https://your-app-git-main.vercel.app
```

### Option 2: Full Stack on Vercel (Advanced)

This requires converting the backend to serverless functions. This is more complex and has limitations:
- MongoDB connections need to be managed carefully (connection pooling)
- Cron jobs need to be converted to Vercel Cron Jobs
- Some Express.js patterns need adjustment

**Not recommended for this project** due to the persistent database connections and cron jobs.

## Environment Variables

### Frontend (Vercel)

| Variable | Description | Example | Required |
|----------|-------------|---------|----------|
| `REACT_APP_API_URL` | Backend API URL | `https://your-backend.onrender.com/api` | **Recommended** |

**Dynamic API Detection**: If `REACT_APP_API_URL` is not set, the app will automatically try to detect the API URL:
- Uses same origin with `/api` path (works if backend is proxied)
- Falls back to relative `/api` path
- **Best Practice**: Always set `REACT_APP_API_URL` explicitly for production

### Backend (Render/Railway/etc.)

| Variable | Description | Example |
|----------|-------------|---------|
| `MONGODB_URI` | MongoDB connection string | `mongodb+srv://...` |
| `NODE_ENV` | Environment | `production` |
| `PORT` | Server port | `5000` (or auto-assigned) |
| `FRONTEND_URLS` | Allowed CORS origins | `https://your-app.vercel.app` |
| `DATA_GOV_API_KEY` | data.gov.in API key | Your API key |
| `DATA_GOV_BASE_URL` | API base URL | `https://api.data.gov.in/resource` |

## Verifying Deployment

1. **Frontend**: Visit `https://your-app.vercel.app`
   - Should load the dashboard
   - Check browser console for any errors

2. **Backend**: Visit `https://your-backend-url.com/health`
   - Should return `{ status: "OK", ... }`

3. **API Connection**: 
   - Open browser DevTools → Network tab
   - Navigate the dashboard
   - Check if API calls to your backend are successful

## Troubleshooting

### CORS Errors

If you see CORS errors:
1. Ensure `FRONTEND_URLS` in backend includes your Vercel domain
2. Check that the domain matches exactly (including https://)
3. Restart your backend after updating environment variables

### API Connection Failed

1. Verify `REACT_APP_API_URL` is set correctly in Vercel
2. Check that your backend is running and accessible
3. Test the backend URL directly in browser
4. Check browser console for specific error messages

### Build Failures

1. Check Vercel build logs for specific errors
2. Ensure all dependencies are in `package.json`
3. Verify Node.js version compatibility
4. Check that `frontend/package.json` has a valid `build` script

### Environment Variables Not Working

- Vercel requires a redeploy after adding environment variables
- Environment variables must start with `REACT_APP_` to be available in the React app
- Use Vercel dashboard to add variables for all environments (Production, Preview, Development)

## Custom Domain

To use a custom domain:

1. Go to your project settings in Vercel
2. Navigate to "Domains"
3. Add your custom domain
4. Follow DNS configuration instructions
5. Update `FRONTEND_URLS` in backend to include custom domain

## Continuous Deployment

Vercel automatically deploys when you push to:
- `main` branch → Production
- Other branches → Preview deployments

To disable auto-deployment:
1. Go to project settings
2. Navigate to "Git"
3. Adjust deployment settings

## Monitoring

Vercel provides:
- Real-time logs for each deployment
- Analytics for page views and performance
- Function logs for serverless functions
- Error tracking

## Additional Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Vercel CLI Reference](https://vercel.com/docs/cli)
- [React App Deployment](https://vercel.com/guides/deploying-react-with-vercel)


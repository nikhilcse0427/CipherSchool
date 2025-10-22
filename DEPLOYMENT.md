# CipherStudio - Vercel Deployment Guide

This guide will walk you through deploying your full-stack application on Vercel.

## Prerequisites

- GitHub account
- Vercel account (sign up at https://vercel.com)
- MongoDB Atlas account (already set up)

---

## Part 1: Deploy Backend to Vercel

### Step 1: Push Backend to GitHub

1. **Create a new GitHub repository** for the backend:
   - Go to https://github.com/new
   - Name it: `cipherstudio-backend`
   - Make it Public or Private
   - Don't initialize with README

2. **Push backend code to GitHub:**

```bash
cd backend
git init
git add .
git commit -m "Initial backend commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/cipherstudio-backend.git
git push -u origin main
```

### Step 2: Deploy Backend on Vercel

1. **Go to Vercel Dashboard:**
   - Visit https://vercel.com/dashboard
   - Click "Add New" → "Project"

2. **Import GitHub Repository:**
   - Select `cipherstudio-backend`
   - Click "Import"

3. **Configure Project:**
   - **Framework Preset:** Other
   - **Root Directory:** `./` (leave as is)
   - **Build Command:** Leave empty
   - **Output Directory:** Leave empty

4. **Add Environment Variables:**
   Click "Environment Variables" and add these:

   ```
   MONGODB_URI=mongodb+srv://nikhilverma0427_db_user:cIiWM4tW6Qm5yV9p@cluster0.4roa1st.mongodb.net/cipherstudio?retryWrites=true&w=majority&appName=Cluster0
   
   JWT_SECRET=your_super_secret_jwt_key_change_this_in_production_make_it_very_long_and_random
   
   NODE_ENV=production
   
   CORS_ORIGIN=https://your-frontend-app.vercel.app
   ```

   **Note:** You'll update `CORS_ORIGIN` after deploying the frontend.

5. **Deploy:**
   - Click "Deploy"
   - Wait for deployment to complete (2-3 minutes)
   - Copy your backend URL: `https://cipherstudio-backend.vercel.app`

### Step 3: Update MongoDB Atlas

1. Go to MongoDB Atlas → Network Access
2. Add IP Address: `0.0.0.0/0` (Allow from anywhere)
3. This allows Vercel's servers to connect

---

## Part 2: Deploy Frontend to Vercel

### Step 1: Update Frontend Environment Variables

1. **Update the `.env` file in `frontend-new` folder:**

```bash
cd ../frontend-new
```

Create/Update `.env`:
```
VITE_API_URL=https://cipherstudio-backend.vercel.app/api
```

2. **Update the API configuration:**

The `src/lib/api.js` already uses `import.meta.env.VITE_API_URL`, so it will automatically use the production URL.

### Step 2: Push Frontend to GitHub

1. **Create a new GitHub repository** for the frontend:
   - Go to https://github.com/new
   - Name it: `cipherstudio-frontend`
   - Make it Public or Private

2. **Push frontend code to GitHub:**

```bash
cd frontend-new
git init
git add .
git commit -m "Initial frontend commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/cipherstudio-frontend.git
git push -u origin main
```

### Step 3: Deploy Frontend on Vercel

1. **Go to Vercel Dashboard:**
   - Click "Add New" → "Project"

2. **Import GitHub Repository:**
   - Select `cipherstudio-frontend`
   - Click "Import"

3. **Configure Project:**
   - **Framework Preset:** Vite
   - **Root Directory:** `./` (leave as is)
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`

4. **Add Environment Variables:**

   ```
   VITE_API_URL=https://cipherstudio-backend.vercel.app/api
   ```

   Replace with your actual backend URL from Step 1.

5. **Deploy:**
   - Click "Deploy"
   - Wait for deployment (2-3 minutes)
   - Your frontend will be live at: `https://cipherstudio-frontend.vercel.app`

---

## Part 3: Update Backend CORS

Now that you have your frontend URL, update the backend:

1. **Go to Vercel Dashboard → Backend Project**
2. **Settings → Environment Variables**
3. **Update `CORS_ORIGIN`:**
   ```
   CORS_ORIGIN=https://cipherstudio-frontend.vercel.app
   ```
   (Use your actual frontend URL)

4. **Redeploy Backend:**
   - Go to "Deployments" tab
   - Click "..." on the latest deployment
   - Click "Redeploy"

---

## Part 4: Test Your Deployment

1. Visit your frontend URL: `https://cipherstudio-frontend.vercel.app`
2. Register a new account
3. Create a project
4. Test the code editor

---

## Alternative: Deploy Both in One Repository

If you prefer to keep everything in one repository:

### Step 1: Create Monorepo Structure

```
project1/
├── backend/
├── frontend/
└── vercel.json
```

### Step 2: Create Root `vercel.json`

```json
{
  "version": 2,
  "builds": [
    {
      "src": "backend/server.js",
      "use": "@vercel/node"
    },
    {
      "src": "frontend/package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "frontend/dist"
      }
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "backend/server.js"
    },
    {
      "src": "/(.*)",
      "dest": "frontend/$1"
    }
  ]
}
```

### Step 3: Update Frontend Build Command

In `frontend/package.json`, add:
```json
{
  "scripts": {
    "vercel-build": "npm run build"
  }
}
```

### Step 4: Deploy

1. Push entire project to GitHub
2. Import to Vercel
3. Add all environment variables
4. Deploy

---

## Environment Variables Summary

### Backend Environment Variables:
```
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
NODE_ENV=production
CORS_ORIGIN=https://your-frontend-url.vercel.app
```

### Frontend Environment Variables:
```
VITE_API_URL=https://your-backend-url.vercel.app/api
```

---

## Troubleshooting

### Issue: CORS Error
**Solution:** Make sure `CORS_ORIGIN` in backend matches your frontend URL exactly.

### Issue: MongoDB Connection Failed
**Solution:** Whitelist `0.0.0.0/0` in MongoDB Atlas Network Access.

### Issue: 404 on API Routes
**Solution:** Check that your backend `vercel.json` routes are correct.

### Issue: Environment Variables Not Working
**Solution:** 
- Make sure variables are added in Vercel dashboard
- Redeploy after adding variables
- For Vite, variables must start with `VITE_`

---

## Custom Domain (Optional)

1. Go to Vercel Dashboard → Your Project
2. Click "Settings" → "Domains"
3. Add your custom domain
4. Update DNS records as instructed
5. Update `CORS_ORIGIN` in backend to match new domain

---

## Continuous Deployment

Once set up, every push to your GitHub repository will automatically deploy:
- Push to `main` branch → Automatic deployment
- Pull requests → Preview deployments

---

## Cost

- **Vercel Free Tier:**
  - 100 GB bandwidth/month
  - Unlimited projects
  - Automatic HTTPS
  - Perfect for this project!

- **MongoDB Atlas Free Tier:**
  - 512 MB storage
  - Shared cluster
  - Good for development/small projects

---

## Next Steps

1. ✅ Deploy backend
2. ✅ Deploy frontend
3. ✅ Update CORS settings
4. ✅ Test the application
5. 🎉 Share your live app!

Your CipherStudio IDE will be live and accessible worldwide!

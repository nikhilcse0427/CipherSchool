# 🚀 Quick Deployment Checklist

## Before You Start
- [ ] GitHub account created
- [ ] Vercel account created (https://vercel.com)
- [ ] MongoDB Atlas whitelist updated (0.0.0.0/0)

---

## Step 1: Deploy Backend (15 minutes)

### 1.1 Create GitHub Repository
```bash
cd backend
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/cipherstudio-backend.git
git push -u origin main
```

### 1.2 Deploy on Vercel
1. Go to https://vercel.com/new
2. Import `cipherstudio-backend` repository
3. Add environment variables:
   - `MONGODB_URI` = `mongodb+srv://nikhilverma0427_db_user:cIiWM4tW6Qm5yV9p@cluster0.4roa1st.mongodb.net/cipherstudio?retryWrites=true&w=majority&appName=Cluster0`
   - `JWT_SECRET` = `your_super_secret_jwt_key_change_this_in_production`
   - `NODE_ENV` = `production`
   - `CORS_ORIGIN` = `https://your-frontend-url.vercel.app` (update later)
4. Click Deploy
5. **Copy your backend URL**: `https://cipherstudio-backend-xxx.vercel.app`

---

## Step 2: Deploy Frontend (15 minutes)

### 2.1 Update Frontend Environment
```bash
cd ../frontend-new
```

Create `.env` file:
```
VITE_API_URL=https://YOUR_BACKEND_URL.vercel.app/api
```

### 2.2 Create GitHub Repository
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/cipherstudio-frontend.git
git push -u origin main
```

### 2.3 Deploy on Vercel
1. Go to https://vercel.com/new
2. Import `cipherstudio-frontend` repository
3. Framework: **Vite**
4. Add environment variable:
   - `VITE_API_URL` = `https://YOUR_BACKEND_URL.vercel.app/api`
5. Click Deploy
6. **Copy your frontend URL**: `https://cipherstudio-frontend-xxx.vercel.app`

---

## Step 3: Update Backend CORS (5 minutes)

1. Go to Vercel → Backend Project → Settings → Environment Variables
2. Update `CORS_ORIGIN` to your frontend URL
3. Go to Deployments → Click "..." → Redeploy

---

## Step 4: Test Your App ✅

1. Visit your frontend URL
2. Register a new account
3. Create a project
4. Test the code editor
5. 🎉 **Your app is live!**

---

## Your URLs

**Backend API:** `https://_____________________.vercel.app`

**Frontend App:** `https://_____________________.vercel.app`

---

## Quick Commands Reference

### Deploy Backend
```bash
cd backend
git add .
git commit -m "Update"
git push
```

### Deploy Frontend
```bash
cd frontend-new
git add .
git commit -m "Update"
git push
```

Vercel will auto-deploy on every push!

---

## Need Help?

Check the full guide: `DEPLOYMENT.md`

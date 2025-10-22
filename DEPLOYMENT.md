# Deployment Guide

This guide covers deploying CipherStudio to production environments.

## Table of Contents
- [Backend Deployment](#backend-deployment)
- [Frontend Deployment](#frontend-deployment)
- [Environment Configuration](#environment-configuration)
- [Post-Deployment](#post-deployment)

---

## Backend Deployment

### Option 1: Render

#### Step 1: Prepare Repository
1. Push your code to GitHub
2. Ensure `.gitignore` excludes `node_modules` and `.env`

#### Step 2: Create Render Account
1. Go to [Render.com](https://render.com)
2. Sign up with GitHub

#### Step 3: Create Web Service
1. Click **New +** → **Web Service**
2. Connect your GitHub repository
3. Configure:
   - **Name**: `cipherstudio-backend`
   - **Region**: Choose closest to your users
   - **Branch**: `main`
   - **Root Directory**: `backend`
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Instance Type**: Free (or paid for production)

#### Step 4: Set Environment Variables
Add these in Render dashboard:
```
NODE_ENV=production
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
AWS_ACCESS_KEY_ID=your_aws_key
AWS_SECRET_ACCESS_KEY=your_aws_secret
AWS_REGION=us-east-1
AWS_S3_BUCKET_NAME=cipherstudio-files
CORS_ORIGIN=https://your-frontend-url.vercel.app
```

#### Step 5: Deploy
1. Click **Create Web Service**
2. Wait for deployment to complete
3. Note your backend URL: `https://cipherstudio-backend.onrender.com`

---

### Option 2: Railway

#### Step 1: Install Railway CLI
```bash
npm install -g @railway/cli
```

#### Step 2: Login and Initialize
```bash
railway login
cd backend
railway init
```

#### Step 3: Add Environment Variables
```bash
railway variables set NODE_ENV=production
railway variables set MONGODB_URI=your_mongodb_uri
railway variables set JWT_SECRET=your_jwt_secret
railway variables set AWS_ACCESS_KEY_ID=your_aws_key
railway variables set AWS_SECRET_ACCESS_KEY=your_aws_secret
railway variables set AWS_REGION=us-east-1
railway variables set AWS_S3_BUCKET_NAME=cipherstudio-files
railway variables set CORS_ORIGIN=https://your-frontend.vercel.app
```

#### Step 4: Deploy
```bash
railway up
```

#### Step 5: Get URL
```bash
railway domain
```

---

### Option 3: Cyclic

#### Step 1: Create Account
1. Go to [Cyclic.sh](https://cyclic.sh)
2. Sign in with GitHub

#### Step 2: Deploy
1. Click **Deploy**
2. Select your repository
3. Choose `backend` folder
4. Add environment variables
5. Click **Deploy**

---

## Frontend Deployment

### Vercel (Recommended)

#### Step 1: Install Vercel CLI
```bash
npm install -g vercel
```

#### Step 2: Deploy from Frontend Directory
```bash
cd frontend
vercel
```

Follow the prompts:
- **Set up and deploy**: Yes
- **Which scope**: Your account
- **Link to existing project**: No
- **Project name**: cipherstudio
- **Directory**: `./`
- **Override settings**: No

#### Step 3: Set Environment Variables
```bash
vercel env add NEXT_PUBLIC_API_URL
```
Enter your backend URL: `https://cipherstudio-backend.onrender.com/api`

For production:
```bash
vercel env add NEXT_PUBLIC_API_URL production
```

#### Step 4: Deploy to Production
```bash
vercel --prod
```

#### Alternative: Vercel Dashboard

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **Import Project**
3. Import from GitHub
4. Select your repository
5. Configure:
   - **Framework Preset**: Next.js
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`
6. Add environment variable:
   - `NEXT_PUBLIC_API_URL`: Your backend URL
7. Click **Deploy**

---

### Netlify (Alternative)

#### Step 1: Create `netlify.toml`
Create in `frontend` directory:
```toml
[build]
  command = "npm run build"
  publish = ".next"

[[plugins]]
  package = "@netlify/plugin-nextjs"
```

#### Step 2: Deploy
```bash
cd frontend
npm install -g netlify-cli
netlify login
netlify init
netlify deploy --prod
```

#### Step 3: Set Environment Variables
In Netlify dashboard:
- Go to **Site settings** → **Environment variables**
- Add `NEXT_PUBLIC_API_URL`

---

## Environment Configuration

### Production Backend `.env`
```env
NODE_ENV=production
PORT=5000

# MongoDB Atlas (Production)
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/cipherstudio?retryWrites=true&w=majority

# Strong JWT Secret (generate new one)
JWT_SECRET=use_crypto_randomBytes_64_hex_here

# AWS S3
AWS_ACCESS_KEY_ID=your_production_key
AWS_SECRET_ACCESS_KEY=your_production_secret
AWS_REGION=us-east-1
AWS_S3_BUCKET_NAME=cipherstudio-production

# Frontend URL
CORS_ORIGIN=https://cipherstudio.vercel.app
```

### Production Frontend `.env.local`
```env
NEXT_PUBLIC_API_URL=https://cipherstudio-backend.onrender.com/api
```

---

## Security Checklist

### Before Deployment

- [ ] Generate strong JWT secret
- [ ] Update CORS_ORIGIN to production URL
- [ ] Set NODE_ENV=production
- [ ] Remove console.logs from production code
- [ ] Enable MongoDB IP whitelist (or use 0.0.0.0/0 carefully)
- [ ] Use environment variables for all secrets
- [ ] Enable HTTPS (automatic on Vercel/Render)
- [ ] Set up error monitoring (Sentry, LogRocket)
- [ ] Configure rate limiting
- [ ] Review S3 bucket permissions
- [ ] Enable MongoDB Atlas backup

### MongoDB Atlas Production Settings

1. **Network Access**:
   - Add your backend server IP
   - Or use 0.0.0.0/0 (less secure but easier)

2. **Database Access**:
   - Create production-specific user
   - Use strong password
   - Limit to specific database

3. **Backup**:
   - Enable continuous backup
   - Set retention period

### AWS S3 Production Settings

1. **Bucket Policy**:
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Deny",
      "Principal": "*",
      "Action": "s3:*",
      "Resource": [
        "arn:aws:s3:::cipherstudio-production",
        "arn:aws:s3:::cipherstudio-production/*"
      ],
      "Condition": {
        "Bool": {
          "aws:SecureTransport": "false"
        }
      }
    }
  ]
}
```

2. **Versioning**: Enable for file recovery
3. **Encryption**: Enable default encryption
4. **Lifecycle Rules**: Archive old files (optional)

---

## Post-Deployment

### 1. Test Deployment

#### Backend Health Check
```bash
curl https://your-backend-url.onrender.com
```

Expected response:
```json
{
  "message": "CipherStudio API is running"
}
```

#### Test Registration
```bash
curl -X POST https://your-backend-url.onrender.com/api/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "test123"
  }'
```

#### Test Frontend
1. Open your frontend URL
2. Register a new account
3. Create a project
4. Edit code and save
5. Verify changes persist

### 2. Monitor Logs

**Render**:
- Go to your service dashboard
- Click **Logs** tab
- Monitor for errors

**Vercel**:
- Go to your project
- Click **Deployments**
- Click on deployment → **Functions** tab

### 3. Set Up Custom Domain (Optional)

#### Vercel
1. Go to project settings
2. Click **Domains**
3. Add your domain
4. Update DNS records as instructed

#### Render
1. Go to service settings
2. Click **Custom Domains**
3. Add domain
4. Update DNS CNAME record

### 4. Enable Analytics

#### Vercel Analytics
```bash
npm install @vercel/analytics
```

In `_app.js`:
```javascript
import { Analytics } from '@vercel/analytics/react';

export default function App({ Component, pageProps }) {
  return (
    <>
      <Component {...pageProps} />
      <Analytics />
    </>
  );
}
```

### 5. Set Up Error Monitoring

#### Sentry (Recommended)

**Backend**:
```bash
npm install @sentry/node
```

In `server.js`:
```javascript
const Sentry = require('@sentry/node');

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
});
```

**Frontend**:
```bash
npm install @sentry/nextjs
```

Run:
```bash
npx @sentry/wizard -i nextjs
```

---

## Troubleshooting

### Backend Issues

**Problem**: 502 Bad Gateway
- **Solution**: Check backend logs, verify environment variables

**Problem**: MongoDB connection timeout
- **Solution**: Check MongoDB Atlas IP whitelist

**Problem**: S3 Access Denied
- **Solution**: Verify AWS credentials and IAM permissions

### Frontend Issues

**Problem**: API calls failing
- **Solution**: Check CORS settings in backend

**Problem**: 404 on refresh
- **Solution**: Configure rewrites in Vercel/Netlify

**Problem**: Environment variables not working
- **Solution**: Rebuild after adding variables

---

## Continuous Deployment

### GitHub Actions (Optional)

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy-backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to Render
        run: |
          curl -X POST ${{ secrets.RENDER_DEPLOY_HOOK }}

  deploy-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to Vercel
        run: |
          npm install -g vercel
          cd frontend
          vercel --token ${{ secrets.VERCEL_TOKEN }} --prod
```

---

## Scaling Considerations

### When to Scale

- Response time > 1 second
- CPU usage > 80%
- Memory usage > 80%
- Error rate > 1%

### How to Scale

**Render**: Upgrade instance type
**Railway**: Auto-scales based on usage
**MongoDB**: Upgrade cluster tier
**S3**: Automatically scales

---

## Backup Strategy

### Database Backup
- MongoDB Atlas: Automatic continuous backup
- Manual export: `mongodump`

### S3 Backup
- Enable versioning
- Set up cross-region replication (optional)

### Code Backup
- Git repository (GitHub)
- Regular commits and tags

---

## Cost Estimation

### Free Tier (Development)
- **Render**: Free tier (sleeps after inactivity)
- **Vercel**: Free tier (hobby)
- **MongoDB Atlas**: M0 Free tier (512MB)
- **AWS S3**: Free tier (5GB, 12 months)

**Total**: $0/month

### Production (Low Traffic)
- **Render**: $7/month (Starter)
- **Vercel**: $20/month (Pro)
- **MongoDB Atlas**: $9/month (M2)
- **AWS S3**: ~$1-5/month

**Total**: ~$37-41/month

### Production (High Traffic)
- **Render**: $25-85/month
- **Vercel**: $20-150/month
- **MongoDB Atlas**: $57+/month
- **AWS S3**: $10-50/month

**Total**: ~$112-342/month

---

## Support

For deployment issues:
- Check service status pages
- Review documentation
- Contact support teams
- Check community forums

---

**Congratulations! Your CipherStudio is now live! 🚀**

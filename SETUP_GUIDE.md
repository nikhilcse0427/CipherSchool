# CipherStudio Setup Guide

This guide will walk you through setting up CipherStudio from scratch.

## Table of Contents
1. [MongoDB Atlas Setup](#mongodb-atlas-setup)
2. [AWS S3 Setup](#aws-s3-setup)
3. [Backend Configuration](#backend-configuration)
4. [Frontend Configuration](#frontend-configuration)
5. [Running the Application](#running-the-application)
6. [Troubleshooting](#troubleshooting)

## MongoDB Atlas Setup

### Step 1: Create MongoDB Atlas Account
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Sign up for a free account
3. Create a new cluster (M0 Free tier is sufficient for development)

### Step 2: Configure Database Access
1. Go to **Database Access** in the left sidebar
2. Click **Add New Database User**
3. Choose **Password** authentication
4. Set username and password (save these for later)
5. Set user privileges to **Read and write to any database**
6. Click **Add User**

### Step 3: Configure Network Access
1. Go to **Network Access** in the left sidebar
2. Click **Add IP Address**
3. For development, click **Allow Access from Anywhere** (0.0.0.0/0)
4. For production, add your server's IP address
5. Click **Confirm**

### Step 4: Get Connection String
1. Go to **Database** in the left sidebar
2. Click **Connect** on your cluster
3. Choose **Connect your application**
4. Copy the connection string
5. Replace `<password>` with your database user password
6. Replace `<dbname>` with `cipherstudio`

Example:
```
mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/cipherstudio?retryWrites=true&w=majority
```

## AWS S3 Setup

### Step 1: Create AWS Account
1. Go to [AWS Console](https://aws.amazon.com/)
2. Sign up or log in to your account

### Step 2: Create S3 Bucket
1. Navigate to **S3** service
2. Click **Create bucket**
3. Enter bucket name: `cipherstudio-files` (or your preferred name)
4. Choose your preferred region (e.g., `us-east-1`)
5. **Block Public Access**: Keep all public access blocked (recommended)
6. Enable **Bucket Versioning** (optional but recommended)
7. Click **Create bucket**

### Step 3: Create IAM User
1. Navigate to **IAM** service
2. Click **Users** → **Add users**
3. Enter username: `cipherstudio-s3-user`
4. Select **Access key - Programmatic access**
5. Click **Next: Permissions**

### Step 4: Set Permissions
1. Click **Attach existing policies directly**
2. Search for and select **AmazonS3FullAccess** (or create a custom policy for specific bucket)
3. Click **Next: Tags** (optional)
4. Click **Next: Review**
5. Click **Create user**

### Step 5: Save Credentials
1. **IMPORTANT**: Save the **Access Key ID** and **Secret Access Key**
2. You won't be able to see the secret key again
3. Download the CSV file as backup

### Custom S3 Policy (Recommended for Production)
Instead of `AmazonS3FullAccess`, create a custom policy:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "s3:PutObject",
        "s3:GetObject",
        "s3:DeleteObject",
        "s3:ListBucket"
      ],
      "Resource": [
        "arn:aws:s3:::cipherstudio-files",
        "arn:aws:s3:::cipherstudio-files/*"
      ]
    }
  ]
}
```

## Backend Configuration

### Step 1: Install Dependencies
```bash
cd backend
npm install
```

### Step 2: Create .env File
Create a `.env` file in the `backend` directory:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# MongoDB Configuration
MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/cipherstudio?retryWrites=true&w=majority

# JWT Secret (generate a random string)
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production_use_random_string

# AWS S3 Configuration
AWS_ACCESS_KEY_ID=your_aws_access_key_id_here
AWS_SECRET_ACCESS_KEY=your_aws_secret_access_key_here
AWS_REGION=us-east-1
AWS_S3_BUCKET_NAME=cipherstudio-files

# CORS Origin (Frontend URL)
CORS_ORIGIN=http://localhost:3000
```

### Step 3: Generate JWT Secret
You can generate a secure JWT secret using Node.js:

```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

## Frontend Configuration

### Step 1: Install Dependencies
```bash
cd frontend
npm install
```

### Step 2: Create .env.local File
Create a `.env.local` file in the `frontend` directory:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

## Running the Application

### Step 1: Start Backend Server
```bash
cd backend
npm run dev
```

You should see:
```
Server is running on port 5000
MongoDB Connected: cluster0.xxxxx.mongodb.net
```

### Step 2: Start Frontend Server
Open a new terminal:

```bash
cd frontend
npm run dev
```

You should see:
```
ready - started server on 0.0.0.0:3000, url: http://localhost:3000
```

### Step 3: Access the Application
Open your browser and navigate to:
```
http://localhost:3000
```

## Troubleshooting

### MongoDB Connection Issues

**Error**: `MongoServerError: bad auth`
- **Solution**: Check your MongoDB username and password in the connection string

**Error**: `MongooseServerSelectionError: connect ETIMEDOUT`
- **Solution**: Check Network Access settings in MongoDB Atlas
- Add your IP address or allow access from anywhere (0.0.0.0/0)

### AWS S3 Issues

**Error**: `AccessDenied: Access Denied`
- **Solution**: Check IAM user permissions
- Ensure the user has S3 access permissions
- Verify the bucket name is correct

**Error**: `InvalidAccessKeyId: The AWS Access Key Id you provided does not exist`
- **Solution**: Verify your AWS credentials in the `.env` file
- Make sure there are no extra spaces or quotes

### CORS Issues

**Error**: `CORS policy: No 'Access-Control-Allow-Origin' header`
- **Solution**: Check `CORS_ORIGIN` in backend `.env` file
- Ensure it matches your frontend URL
- Restart the backend server after changing `.env`

### Port Already in Use

**Error**: `EADDRINUSE: address already in use :::5000`
- **Solution**: Kill the process using the port:

**Windows:**
```bash
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

**Mac/Linux:**
```bash
lsof -ti:5000 | xargs kill -9
```

### Module Not Found Errors

**Error**: `Cannot find module 'xyz'`
- **Solution**: Delete `node_modules` and reinstall:

```bash
rm -rf node_modules package-lock.json
npm install
```

## Production Deployment

### Environment Variables for Production

**Backend:**
- Set `NODE_ENV=production`
- Use strong JWT secret
- Restrict CORS to your frontend domain
- Use specific IP addresses in MongoDB Atlas

**Frontend:**
- Update `NEXT_PUBLIC_API_URL` to your backend URL
- Build the application: `npm run build`

### Security Checklist
- [ ] Change default JWT secret
- [ ] Restrict MongoDB network access
- [ ] Use IAM roles instead of access keys (if deploying to AWS)
- [ ] Enable HTTPS
- [ ] Set up rate limiting
- [ ] Enable logging and monitoring
- [ ] Regular security updates

## Need Help?

If you encounter any issues not covered here:
1. Check the error logs in the terminal
2. Verify all environment variables are set correctly
3. Ensure all services (MongoDB, AWS S3) are properly configured
4. Check the GitHub issues page for similar problems

---

Happy coding! 🚀

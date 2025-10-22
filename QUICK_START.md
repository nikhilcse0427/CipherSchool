# Quick Start Guide

Get CipherStudio running in 5 minutes!

## Prerequisites

- Node.js v16+ installed
- MongoDB Atlas account (free tier)
- AWS account with S3 access

## Step 1: Clone and Install

```bash
# Clone the repository
git clone <your-repo-url>
cd project1

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

## Step 2: Set Up MongoDB Atlas

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster
3. Create a database user
4. Whitelist your IP (or use 0.0.0.0/0 for development)
5. Get your connection string

## Step 3: Set Up AWS S3

1. Go to [AWS Console](https://aws.amazon.com/)
2. Create an S3 bucket (e.g., `cipherstudio-files`)
3. Create an IAM user with S3 access
4. Save Access Key ID and Secret Access Key

## Step 4: Configure Backend

Create `backend/.env`:

```env
PORT=5000
NODE_ENV=development

MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/cipherstudio?retryWrites=true&w=majority

JWT_SECRET=your_random_secret_key_here

AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
AWS_REGION=us-east-1
AWS_S3_BUCKET_NAME=cipherstudio-files

CORS_ORIGIN=http://localhost:3000
```

**Generate JWT Secret:**
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

## Step 5: Configure Frontend

Create `frontend/.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

## Step 6: Run the Application

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

## Step 7: Access the Application

Open your browser and go to:
```
http://localhost:3000
```

## Step 8: Create Your First Project

1. Click "Get Started" or "Sign Up"
2. Register a new account
3. Click "New Project"
4. Enter a project name
5. Start coding!

## Troubleshooting

### Backend won't start
- Check MongoDB connection string
- Verify AWS credentials
- Ensure port 5000 is available

### Frontend won't start
- Check if backend is running
- Verify `.env.local` file exists
- Ensure port 3000 is available

### Can't connect to MongoDB
- Check IP whitelist in MongoDB Atlas
- Verify connection string format
- Test connection string with MongoDB Compass

### S3 errors
- Verify AWS credentials
- Check bucket name
- Ensure IAM user has S3 permissions

## Next Steps

- Read the [Full Setup Guide](SETUP_GUIDE.md)
- Check out the [Architecture](ARCHITECTURE.md)
- Learn about [Deployment](DEPLOYMENT.md)

## Need Help?

- Check [SETUP_GUIDE.md](SETUP_GUIDE.md) for detailed instructions
- Open an issue on GitHub
- Review error logs in terminal

---

Happy coding! 🚀

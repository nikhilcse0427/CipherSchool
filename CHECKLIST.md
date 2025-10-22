# CipherStudio Setup Checklist

Use this checklist to ensure everything is properly configured.

## ✅ Pre-Setup

- [ ] Node.js v16+ installed
- [ ] npm or yarn installed
- [ ] Git installed
- [ ] Code editor (VS Code recommended)
- [ ] MongoDB Atlas account created
- [ ] AWS account created

---

## ✅ MongoDB Atlas Setup

- [ ] Created free cluster
- [ ] Created database user with password
- [ ] Saved username and password securely
- [ ] Added IP to whitelist (0.0.0.0/0 for dev)
- [ ] Copied connection string
- [ ] Replaced `<password>` in connection string
- [ ] Replaced `<dbname>` with `cipherstudio`
- [ ] Tested connection (optional: MongoDB Compass)

---

## ✅ AWS S3 Setup

- [ ] Created S3 bucket
- [ ] Noted bucket name
- [ ] Noted region (e.g., us-east-1)
- [ ] Created IAM user
- [ ] Attached S3 permissions
- [ ] Saved Access Key ID
- [ ] Saved Secret Access Key
- [ ] Verified bucket is private

---

## ✅ Backend Setup

- [ ] Navigated to `backend` folder
- [ ] Ran `npm install`
- [ ] Created `.env` file
- [ ] Added `PORT=5000`
- [ ] Added `NODE_ENV=development`
- [ ] Added MongoDB connection string
- [ ] Generated JWT secret
- [ ] Added JWT secret to `.env`
- [ ] Added AWS credentials to `.env`
- [ ] Added S3 bucket name to `.env`
- [ ] Added CORS origin to `.env`
- [ ] Verified all environment variables

---

## ✅ Frontend Setup

- [ ] Navigated to `frontend` folder
- [ ] Ran `npm install`
- [ ] Created `.env.local` file
- [ ] Added `NEXT_PUBLIC_API_URL=http://localhost:5000/api`
- [ ] Verified environment variable

---

## ✅ Running the Application

- [ ] Opened terminal 1
- [ ] Navigated to `backend` folder
- [ ] Ran `npm run dev`
- [ ] Saw "Server is running on port 5000"
- [ ] Saw "MongoDB Connected"
- [ ] Opened terminal 2
- [ ] Navigated to `frontend` folder
- [ ] Ran `npm run dev`
- [ ] Saw "ready - started server on 0.0.0.0:3000"
- [ ] Opened browser to http://localhost:3000
- [ ] Saw landing page

---

## ✅ Testing Basic Functionality

### User Registration
- [ ] Clicked "Get Started" or "Sign Up"
- [ ] Filled registration form
- [ ] Submitted form
- [ ] Redirected to dashboard
- [ ] Saw welcome message

### Create Project
- [ ] Clicked "New Project"
- [ ] Entered project name
- [ ] Clicked "Create"
- [ ] Redirected to editor
- [ ] Saw file explorer
- [ ] Saw code editor
- [ ] Saw live preview

### Edit Code
- [ ] Modified code in editor
- [ ] Saw live preview update
- [ ] Clicked "Save"
- [ ] Saw success message

### File Management
- [ ] Clicked "+" to create file
- [ ] Created new file
- [ ] Saw file in explorer
- [ ] Deleted file
- [ ] Confirmed deletion

### Logout and Login
- [ ] Clicked "Logout"
- [ ] Redirected to home
- [ ] Clicked "Login"
- [ ] Entered credentials
- [ ] Successfully logged in
- [ ] Saw projects in dashboard

---

## ✅ Troubleshooting Checks

### Backend Issues
- [ ] Backend terminal shows no errors
- [ ] Port 5000 is not in use by another app
- [ ] MongoDB connection string is correct
- [ ] AWS credentials are correct
- [ ] S3 bucket name matches `.env`
- [ ] All dependencies installed

### Frontend Issues
- [ ] Frontend terminal shows no errors
- [ ] Port 3000 is not in use
- [ ] Backend is running
- [ ] `.env.local` file exists
- [ ] API URL is correct
- [ ] All dependencies installed

### Database Issues
- [ ] MongoDB Atlas cluster is running
- [ ] IP is whitelisted
- [ ] Database user exists
- [ ] Password is correct
- [ ] Connection string format is correct

### S3 Issues
- [ ] S3 bucket exists
- [ ] IAM user has permissions
- [ ] Access keys are correct
- [ ] Region matches bucket region
- [ ] No typos in bucket name

---

## ✅ Code Quality Checks

- [ ] No console errors in browser
- [ ] No console errors in backend terminal
- [ ] No console errors in frontend terminal
- [ ] All pages load correctly
- [ ] All buttons work
- [ ] Forms validate properly
- [ ] Error messages display correctly
- [ ] Loading states work

---

## ✅ Security Checks

- [ ] `.env` files are in `.gitignore`
- [ ] JWT secret is strong and unique
- [ ] Passwords are hashed
- [ ] API routes are protected
- [ ] CORS is configured
- [ ] No sensitive data in code
- [ ] S3 bucket is private

---

## ✅ Documentation Review

- [ ] Read README.md
- [ ] Read QUICK_START.md
- [ ] Read SETUP_GUIDE.md
- [ ] Understand ARCHITECTURE.md
- [ ] Know how to deploy (DEPLOYMENT.md)
- [ ] Understand file structure

---

## ✅ Optional Enhancements

- [ ] Set up custom domain
- [ ] Configure SSL/HTTPS
- [ ] Set up error monitoring (Sentry)
- [ ] Add analytics (Vercel Analytics)
- [ ] Set up CI/CD pipeline
- [ ] Add unit tests
- [ ] Add integration tests
- [ ] Set up staging environment

---

## ✅ Production Deployment

### Backend Deployment
- [ ] Chose hosting platform (Render/Railway/Cyclic)
- [ ] Created account
- [ ] Connected GitHub repository
- [ ] Set environment variables
- [ ] Deployed backend
- [ ] Verified deployment
- [ ] Noted backend URL
- [ ] Tested API endpoints

### Frontend Deployment
- [ ] Chose Vercel
- [ ] Connected GitHub repository
- [ ] Set environment variable (API URL)
- [ ] Deployed frontend
- [ ] Verified deployment
- [ ] Tested all pages
- [ ] Tested all functionality

### Post-Deployment
- [ ] Updated CORS_ORIGIN in backend
- [ ] Tested registration
- [ ] Tested login
- [ ] Tested project creation
- [ ] Tested code editing
- [ ] Tested file operations
- [ ] Verified data persistence

---

## ✅ Final Checks

- [ ] All features working
- [ ] No errors in production
- [ ] Performance is acceptable
- [ ] Mobile responsive
- [ ] Cross-browser compatible
- [ ] Data is persisting
- [ ] Files are saving to S3
- [ ] Authentication working
- [ ] Projects loading correctly

---

## 🎉 Completion

Congratulations! If all items are checked, your CipherStudio is fully set up and ready to use!

### Next Steps:
1. Start building projects
2. Invite users to test
3. Gather feedback
4. Implement improvements
5. Add new features

### Need Help?
- Review documentation
- Check error logs
- Open GitHub issue
- Ask in discussions

---

**Happy Coding! 🚀**

# CipherStudio - Online React IDE

A powerful online IDE for React development built with Next.js, Express.js, MongoDB, AWS S3, and Sandpack.

## 🚀 Features

- **Live Code Editor**: Write React code with instant preview powered by Sandpack
- **File Management**: Create, edit, and organize files and folders
- **Cloud Storage**: Projects and files stored securely in MongoDB and AWS S3
- **User Authentication**: Secure JWT-based authentication
- **Project Management**: Create and manage multiple React projects
- **Modern UI**: Beautiful, responsive interface built with Tailwind CSS

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 14 (React 18)
- **Code Editor**: Sandpack by CodeSandbox
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **HTTP Client**: Axios

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB Atlas
- **File Storage**: AWS S3
- **Authentication**: JWT (JSON Web Tokens)
- **Validation**: Express Validator

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v16 or higher)
- npm or yarn
- MongoDB Atlas account
- AWS account with S3 access

## 🔧 Installation

### 1. Clone the repository

```bash
git clone <repository-url>
cd project1
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the backend directory:

```env
PORT=5000
NODE_ENV=development

# MongoDB Configuration
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/cipherstudio?retryWrites=true&w=majority

# JWT Secret
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production

# AWS S3 Configuration
AWS_ACCESS_KEY_ID=your_aws_access_key_id
AWS_SECRET_ACCESS_KEY=your_aws_secret_access_key
AWS_REGION=us-east-1
AWS_S3_BUCKET_NAME=cipherstudio-files

# CORS Origin
CORS_ORIGIN=http://localhost:3000
```

### 3. Frontend Setup

```bash
cd ../frontend
npm install
```

Create a `.env.local` file in the frontend directory:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

## 🚀 Running the Application

### Start Backend Server

```bash
cd backend
npm run dev
```

The backend server will start on `http://localhost:5000`

### Start Frontend Development Server

```bash
cd frontend
npm run dev
```

The frontend will be available at `http://localhost:3000`

## 📁 Project Structure

```
project1/
├── backend/
│   ├── config/
│   │   ├── database.js       # MongoDB connection
│   │   └── s3.js            # AWS S3 configuration
│   ├── controllers/
│   │   ├── userController.js
│   │   ├── projectController.js
│   │   └── fileController.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Project.js
│   │   └── File.js
│   ├── routes/
│   │   ├── userRoutes.js
│   │   ├── projectRoutes.js
│   │   └── fileRoutes.js
│   ├── middleware/
│   │   ├── auth.js
│   │   └── errorHandler.js
│   ├── utils/
│   │   └── projectTemplates.js
│   ├── server.js
│   └── package.json
│
├── frontend/
│   ├── components/
│   │   ├── FileExplorer.js
│   │   └── SandpackEditor.js
│   ├── lib/
│   │   ├── api.js
│   │   └── auth.js
│   ├── pages/
│   │   ├── index.js         # Landing page
│   │   ├── login.js         # Login page
│   │   ├── register.js      # Registration page
│   │   ├── dashboard.js     # Projects dashboard
│   │   └── editor/
│   │       └── [id].js      # IDE editor
│   ├── styles/
│   │   └── globals.css
│   └── package.json
│
└── README.md
```

## 🗄️ Database Schema

### Users Collection
```javascript
{
  username: String (unique),
  email: String (unique),
  password: String (hashed),
  fullName: String,
  avatar: String,
  createdAt: Date,
  updatedAt: Date
}
```

### Projects Collection
```javascript
{
  name: String,
  description: String,
  userId: ObjectId (ref: User),
  template: String (react, react-ts, vanilla, vanilla-ts),
  isPublic: Boolean,
  lastOpened: Date,
  createdAt: Date,
  updatedAt: Date
}
```

### Files Collection
```javascript
{
  projectId: ObjectId (ref: Project),
  parentId: ObjectId (ref: File, nullable),
  name: String,
  type: String (file, folder),
  s3Key: String (for files only),
  order: Number,
  createdAt: Date,
  updatedAt: Date
}
```

## 🔐 API Endpoints

### Authentication
- `POST /api/users/register` - Register new user
- `POST /api/users/login` - Login user
- `GET /api/users/profile` - Get user profile (Protected)
- `PUT /api/users/profile` - Update user profile (Protected)

### Projects
- `POST /api/projects` - Create new project (Protected)
- `GET /api/projects` - Get all user projects (Protected)
- `GET /api/projects/:id` - Get project by ID (Protected)
- `PUT /api/projects/:id` - Update project (Protected)
- `DELETE /api/projects/:id` - Delete project (Protected)

### Files
- `POST /api/files` - Create file/folder (Protected)
- `GET /api/files/project/:projectId` - Get all project files (Protected)
- `GET /api/files/:id` - Get file/folder by ID (Protected)
- `GET /api/files/:id/content` - Get file content from S3 (Protected)
- `PUT /api/files/:id` - Update file/folder (Protected)
- `DELETE /api/files/:id` - Delete file/folder (Protected)

## 🌐 Deployment

### Backend Deployment (Render/Railway/Cyclic)

1. Push your code to GitHub
2. Connect your repository to Render/Railway/Cyclic
3. Set environment variables
4. Deploy

### Frontend Deployment (Vercel)

```bash
cd frontend
vercel
```

Or connect your GitHub repository to Vercel for automatic deployments.

## 🔒 Security Features

- Password hashing with bcrypt
- JWT-based authentication
- Protected API routes
- CORS configuration
- Input validation
- Secure file storage in AWS S3

## 🎨 UI Features

- Responsive design
- Dark mode IDE interface
- Syntax highlighting
- Live preview
- File tree navigation
- Modal dialogs
- Loading states
- Error handling

## 📝 License

MIT License

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📧 Support

For support, email support@cipherstudio.com or open an issue in the repository.

---

Built with ❤️ for developers by developers

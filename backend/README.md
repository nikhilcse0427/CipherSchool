# CipherStudio Backend API

Express.js backend for CipherStudio online IDE.

## Quick Start

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file (see `.env.example`)

3. Start development server:
```bash
npm run dev
```

## API Documentation

### Authentication Endpoints

#### Register User
```http
POST /api/users/register
Content-Type: application/json

{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "password123",
  "fullName": "John Doe"
}
```

#### Login User
```http
POST /api/users/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

#### Get User Profile
```http
GET /api/users/profile
Authorization: Bearer <token>
```

### Project Endpoints

#### Create Project
```http
POST /api/projects
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "My React App",
  "description": "A cool project",
  "template": "react"
}
```

#### Get All Projects
```http
GET /api/projects
Authorization: Bearer <token>
```

#### Get Project by ID
```http
GET /api/projects/:id
Authorization: Bearer <token>
```

#### Update Project
```http
PUT /api/projects/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Updated Name",
  "description": "Updated description"
}
```

#### Delete Project
```http
DELETE /api/projects/:id
Authorization: Bearer <token>
```

### File Endpoints

#### Create File/Folder
```http
POST /api/files
Authorization: Bearer <token>
Content-Type: application/json

{
  "projectId": "project_id_here",
  "name": "App.js",
  "type": "file",
  "parentId": null,
  "content": "console.log('Hello');"
}
```

#### Get Project Files
```http
GET /api/files/project/:projectId
Authorization: Bearer <token>
```

#### Get File Content
```http
GET /api/files/:id/content
Authorization: Bearer <token>
```

#### Update File
```http
PUT /api/files/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "content": "updated code here"
}
```

#### Delete File
```http
DELETE /api/files/:id
Authorization: Bearer <token>
```

## Environment Variables

See `.env.example` for all required environment variables.

## Scripts

- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon

## Tech Stack

- Express.js
- MongoDB with Mongoose
- AWS S3 for file storage
- JWT for authentication
- bcryptjs for password hashing

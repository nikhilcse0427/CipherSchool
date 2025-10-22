# CipherStudio Visual Guide

## 🎨 User Interface Overview

### Landing Page
```
┌─────────────────────────────────────────────────────────────┐
│  [CipherStudio Logo]              [Login] [Get Started]     │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│              Build React Apps                                │
│           Right in Your Browser                              │
│                                                              │
│    A powerful online IDE for React development               │
│                                                              │
│        [Start Coding Now]  [Sign In]                        │
│                                                              │
├─────────────────────────────────────────────────────────────┤
│  Features:                                                   │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐  │
│  │   Live   │  │   Fast   │  │  Cloud   │  │  Secure  │  │
│  │ Preview  │  │ Powerful │  │ Storage  │  │          │  │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘  │
└─────────────────────────────────────────────────────────────┘
```

### Dashboard
```
┌─────────────────────────────────────────────────────────────┐
│  [CipherStudio]           Welcome, Username    [Logout]     │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  My Projects                          [+ New Project]       │
│                                                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │ 📁 Project 1 │  │ 📁 Project 2 │  │ 📁 Project 3 │     │
│  │              │  │              │  │              │     │
│  │ React App    │  │ Dashboard    │  │ Portfolio    │     │
│  │              │  │              │  │              │     │
│  │ Updated 2h   │  │ Updated 1d   │  │ Updated 3d   │     │
│  │              │  │              │  │              │     │
│  │ [Open] [🗑️]  │  │ [Open] [🗑️]  │  │ [Open] [🗑️]  │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
└─────────────────────────────────────────────────────────────┘
```

### IDE Editor
```
┌─────────────────────────────────────────────────────────────┐
│  [←] CipherStudio - My Project              [Save]          │
├──────────┬──────────────────────────────────────────────────┤
│  FILES   │                                                   │
│          │                                                   │
│  📁 src  │  CODE EDITOR              │  LIVE PREVIEW        │
│    📄 App│  ┌─────────────────────┐  │  ┌─────────────────┐│
│    📄 ind│  │ import React from   │  │  │                 ││
│  📁 publi│  │ 'react';            │  │  │  Welcome to     ││
│    📄 ind│  │                     │  │  │  CipherStudio!  ││
│  📄 packa│  │ function App() {    │  │  │                 ││
│          │  │   return (          │  │  │  Start editing  ││
│  [+ New] │  │     <div>           │  │  │  to see magic!  ││
│          │  │       <h1>Welcome   │  │  │                 ││
│          │  │       </h1>         │  │  │                 ││
│          │  │     </div>          │  │  │                 ││
│          │  │   );                │  │  │                 ││
│          │  │ }                   │  │  │                 ││
│          │  │                     │  │  │                 ││
│          │  │ export default App; │  │  │                 ││
│          │  └─────────────────────┘  │  └─────────────────┘│
└──────────┴──────────────────────────────────────────────────┘
```

## 🔄 Data Flow Diagrams

### User Registration Flow
```
User Input                Backend                 Database
    │                        │                        │
    │  1. Fill Form          │                        │
    ├───────────────────────>│                        │
    │                        │  2. Hash Password      │
    │                        │  3. Create User        │
    │                        ├───────────────────────>│
    │                        │                        │
    │                        │  4. User Created       │
    │                        │<───────────────────────┤
    │                        │  5. Generate JWT       │
    │  6. Token + User Data  │                        │
    │<───────────────────────┤                        │
    │  7. Store Token        │                        │
    │  8. Redirect Dashboard │                        │
```

### Project Creation Flow
```
User Action              Backend                 Storage
    │                       │                        │
    │  1. Click New         │                        │
    │  2. Enter Name        │                        │
    ├──────────────────────>│                        │
    │                       │  3. Create Project     │
    │                       ├───────────────────────>│ MongoDB
    │                       │  4. Project ID         │
    │                       │<───────────────────────┤
    │                       │                        │
    │                       │  5. Create Files       │
    │                       ├───────────────────────>│ S3
    │                       │  6. Upload Content     │
    │                       ├───────────────────────>│ S3
    │                       │                        │
    │                       │  7. Save File Records  │
    │                       ├───────────────────────>│ MongoDB
    │                       │                        │
    │  8. Project Created   │                        │
    │<──────────────────────┤                        │
    │  9. Open Editor       │                        │
```

### Code Editing Flow
```
Editor                   State                   Backend
  │                        │                        │
  │  1. Type Code          │                        │
  ├───────────────────────>│                        │
  │                        │  2. Update State       │
  │                        │  3. Live Preview       │
  │  4. Click Save         │                        │
  ├───────────────────────>│                        │
  │                        │  5. Send to Backend    │
  │                        ├───────────────────────>│
  │                        │                        │  6. Upload to S3
  │                        │                        │  7. Update MongoDB
  │                        │  8. Success Response   │
  │                        │<───────────────────────┤
  │  9. Show Success       │                        │
  │<───────────────────────┤                        │
```

## 🗄️ Database Schema Visualization

### Users Collection
```
┌─────────────────────────┐
│        Users            │
├─────────────────────────┤
│ _id: ObjectId           │
│ username: String ●      │
│ email: String ●         │
│ password: String (hash) │
│ fullName: String        │
│ avatar: String          │
│ createdAt: Date         │
│ updatedAt: Date         │
└─────────────────────────┘
         │
         │ 1:N
         ▼
┌─────────────────────────┐
│       Projects          │
├─────────────────────────┤
│ _id: ObjectId           │
│ name: String            │
│ description: String     │
│ userId: ObjectId ───────┘
│ template: String        │
│ isPublic: Boolean       │
│ lastOpened: Date        │
│ createdAt: Date         │
│ updatedAt: Date         │
└─────────────────────────┘
         │
         │ 1:N
         ▼
┌─────────────────────────┐
│         Files           │
├─────────────────────────┤
│ _id: ObjectId           │
│ projectId: ObjectId ────┘
│ parentId: ObjectId ─┐   
│ name: String        │   
│ type: String        │   
│ s3Key: String       │   
│ order: Number       │   
│ createdAt: Date     │   
│ updatedAt: Date     │   
└─────────────────────┘   
         │                
         └────────────────┘ (self-reference for folders)
```

### File Hierarchy Example
```
Root (parentId: null)
  │
  ├── src (parentId: root)
  │    │
  │    ├── App.js (parentId: src)
  │    │   └── s3Key: "projects/p1/src/App.js"
  │    │
  │    ├── index.js (parentId: src)
  │    │   └── s3Key: "projects/p1/src/index.js"
  │    │
  │    └── components (parentId: src)
  │         │
  │         ├── Header.js (parentId: components)
  │         │   └── s3Key: "projects/p1/src/components/Header.js"
  │         │
  │         └── Footer.js (parentId: components)
  │             └── s3Key: "projects/p1/src/components/Footer.js"
  │
  └── public (parentId: root)
       │
       └── index.html (parentId: public)
           └── s3Key: "projects/p1/public/index.html"
```

## 🏗️ System Architecture

### High-Level Architecture
```
┌─────────────────────────────────────────────────────────────┐
│                         FRONTEND                             │
│                        (Next.js)                             │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │  Pages   │  │Components│  │   Lib    │  │  Styles  │   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘   │
└─────────────────────────────────────────────────────────────┘
                            │
                            │ HTTP/REST
                            │ (Axios)
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                         BACKEND                              │
│                       (Express.js)                           │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │  Routes  │  │Controller│  │  Models  │  │Middleware│   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘   │
└─────────────────────────────────────────────────────────────┘
                │                           │
                │                           │
                ▼                           ▼
┌──────────────────────┐      ┌──────────────────────┐
│   MongoDB Atlas      │      │      AWS S3          │
│  ┌────────────────┐  │      │  ┌────────────────┐ │
│  │ Users          │  │      │  │ File Content   │ │
│  │ Projects       │  │      │  │ (Code Files)   │ │
│  │ Files Metadata │  │      │  └────────────────┘ │
│  └────────────────┘  │      └──────────────────────┘
└──────────────────────┘
```

### Request/Response Flow
```
1. User Action (Browser)
   │
   ▼
2. React Component
   │
   ▼
3. API Call (Axios)
   │
   ▼
4. Express Route
   │
   ▼
5. Auth Middleware (JWT)
   │
   ▼
6. Controller Logic
   │
   ├──> 7a. MongoDB Query
   │    │
   │    └──> 8a. Data Retrieved
   │
   └──> 7b. S3 Operation
        │
        └──> 8b. File Retrieved
   │
   ▼
9. Response Sent
   │
   ▼
10. React State Updated
   │
   ▼
11. UI Re-rendered
```

## 📊 Component Hierarchy

### Frontend Component Tree
```
App (_app.js)
│
├── Landing Page (index.js)
│   ├── Header
│   ├── Hero Section
│   ├── Features Grid
│   └── Footer
│
├── Auth Pages
│   ├── Login (login.js)
│   │   └── Login Form
│   └── Register (register.js)
│       └── Registration Form
│
├── Dashboard (dashboard.js)
│   ├── Header
│   │   ├── Logo
│   │   └── Logout Button
│   ├── Project Grid
│   │   └── Project Card (multiple)
│   │       ├── Project Info
│   │       ├── Open Button
│   │       └── Delete Button
│   └── New Project Modal
│       └── Project Form
│
└── Editor (editor/[id].js)
    ├── Header
    │   ├── Back Button
    │   ├── Project Name
    │   └── Save Button
    ├── File Explorer (FileExplorer.js)
    │   ├── Files List
    │   │   ├── Folder Item (recursive)
    │   │   └── File Item
    │   └── New File Modal
    └── Sandpack Editor (SandpackEditor.js)
        ├── Code Editor
        └── Live Preview
```

## 🔐 Authentication Flow Diagram
```
┌──────────┐
│  User    │
└────┬─────┘
     │
     │ 1. Enter credentials
     ▼
┌─────────────────┐
│  Login Form     │
└────┬────────────┘
     │
     │ 2. POST /api/users/login
     ▼
┌─────────────────┐
│  Backend API    │
└────┬────────────┘
     │
     │ 3. Query database
     ▼
┌─────────────────┐
│  MongoDB        │
└────┬────────────┘
     │
     │ 4. User found
     ▼
┌─────────────────┐
│  Compare        │
│  Password       │
└────┬────────────┘
     │
     │ 5. Password matches
     ▼
┌─────────────────┐
│  Generate JWT   │
└────┬────────────┘
     │
     │ 6. Return token
     ▼
┌─────────────────┐
│  Frontend       │
│  Store Token    │
└────┬────────────┘
     │
     │ 7. Redirect to Dashboard
     ▼
┌─────────────────┐
│  Dashboard      │
└─────────────────┘
```

## 📁 File Storage Strategy
```
MongoDB                          AWS S3
┌─────────────────┐             ┌─────────────────────┐
│ File Metadata   │             │  File Content       │
│                 │             │                     │
│ _id: "f1"       │             │  Key:               │
│ name: "App.js"  │────────────>│  "projects/p1/      │
│ type: "file"    │             │   src/App.js"       │
│ s3Key: "..."    │             │                     │
│ projectId: "p1" │             │  Content:           │
│ parentId: "src" │             │  "import React..."  │
└─────────────────┘             └─────────────────────┘
```

---

This visual guide helps you understand the structure and flow of CipherStudio!

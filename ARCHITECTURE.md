# CipherStudio Architecture

## System Overview

CipherStudio is a full-stack web application that provides an online IDE for React development. The system consists of three main components:

1. **Frontend** (Next.js) - User interface and code editor
2. **Backend** (Express.js) - REST API server
3. **Storage** (MongoDB + AWS S3) - Data and file storage

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                         Frontend                             │
│                        (Next.js)                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │   Landing    │  │     Auth     │  │   Dashboard  │     │
│  │     Page     │  │  (Login/Reg) │  │   Projects   │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │              IDE Editor (Sandpack)                    │  │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────────────┐  │  │
│  │  │   File   │  │   Code   │  │   Live Preview   │  │  │
│  │  │ Explorer │  │  Editor  │  │                  │  │  │
│  │  └──────────┘  └──────────┘  └──────────────────┘  │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                            │
                            │ HTTP/REST API
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                         Backend                              │
│                       (Express.js)                           │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │     Auth     │  │   Projects   │  │    Files     │     │
│  │  Controller  │  │  Controller  │  │  Controller  │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
│         │                 │                   │             │
│         ▼                 ▼                   ▼             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │     User     │  │   Project    │  │     File     │     │
│  │    Model     │  │    Model     │  │    Model     │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
└─────────────────────────────────────────────────────────────┘
         │                     │                   │
         │                     │                   │
         ▼                     ▼                   ▼
┌──────────────────┐  ┌──────────────────┐  ┌──────────────┐
│    MongoDB       │  │    MongoDB       │  │    AWS S3    │
│  Users Collection│  │Projects & Files  │  │ File Storage │
└──────────────────┘  └──────────────────┘  └──────────────┘
```

## Data Flow

### 1. User Registration/Login Flow

```
User → Frontend (Login Form)
     → Backend (POST /api/users/login)
     → MongoDB (Verify credentials)
     → Backend (Generate JWT)
     → Frontend (Store token in localStorage)
     → Redirect to Dashboard
```

### 2. Project Creation Flow

```
User → Dashboard (Click "New Project")
     → Frontend (POST /api/projects)
     → Backend (Create project in MongoDB)
     → Backend (Initialize template files)
     → Backend (Upload files to S3)
     → Backend (Create file records in MongoDB)
     → Frontend (Redirect to Editor)
```

### 3. Code Editing Flow

```
User → Editor (Edit code in Sandpack)
     → Frontend (Update local state)
     → Sandpack (Live preview update)
     → User clicks "Save"
     → Frontend (PUT /api/files/:id)
     → Backend (Upload to S3)
     → Backend (Update MongoDB record)
     → Frontend (Show success message)
```

### 4. File Loading Flow

```
User → Dashboard (Open project)
     → Frontend (GET /api/projects/:id)
     → Backend (Fetch project from MongoDB)
     → Frontend (GET /api/files/project/:projectId)
     → Backend (Fetch file list from MongoDB)
     → Frontend (GET /api/files/:id/content for each file)
     → Backend (Fetch content from S3)
     → Frontend (Load into Sandpack)
     → Sandpack (Render preview)
```

## Database Schema Design

### Hierarchical File Structure

The file system uses a parent-child relationship model:

```
Root (parentId: null)
├── src (parentId: root_id)
│   ├── App.js (parentId: src_id)
│   ├── index.js (parentId: src_id)
│   └── components (parentId: src_id)
│       ├── Header.js (parentId: components_id)
│       └── Footer.js (parentId: components_id)
└── public (parentId: root_id)
    └── index.html (parentId: public_id)
```

Each file/folder document contains:
- `_id`: Unique identifier
- `projectId`: Reference to parent project
- `parentId`: Reference to parent folder (null for root)
- `name`: File/folder name
- `type`: "file" or "folder"
- `s3Key`: S3 storage key (files only)

### Relationships

```
User (1) ──────< Projects (many)
              │
              │
              └──────< Files (many)
```

## Security Architecture

### Authentication Flow

1. **Registration**:
   - Password hashed with bcrypt (10 salt rounds)
   - User stored in MongoDB
   - JWT token generated and returned

2. **Login**:
   - Password compared with bcrypt
   - JWT token generated with user ID
   - Token expires in 30 days

3. **Protected Routes**:
   - Token sent in Authorization header
   - Middleware verifies token
   - User object attached to request

### Authorization

- Users can only access their own projects
- Public projects can be viewed by anyone
- File operations require project ownership
- S3 files are private (not publicly accessible)

## API Design

### RESTful Principles

- **GET**: Retrieve resources
- **POST**: Create new resources
- **PUT**: Update existing resources
- **DELETE**: Remove resources

### Response Format

Success:
```json
{
  "_id": "...",
  "name": "...",
  "data": "..."
}
```

Error:
```json
{
  "message": "Error description",
  "stack": "..." // Development only
}
```

### Status Codes

- `200`: Success
- `201`: Created
- `400`: Bad Request
- `401`: Unauthorized
- `403`: Forbidden
- `404`: Not Found
- `500`: Server Error

## Frontend Architecture

### Component Hierarchy

```
App
├── Landing Page
│   ├── Header
│   ├── Hero Section
│   ├── Features
│   └── Footer
│
├── Auth Pages
│   ├── Login Form
│   └── Register Form
│
├── Dashboard
│   ├── Header
│   ├── Project Grid
│   └── New Project Modal
│
└── Editor
    ├── Header (with Save button)
    ├── File Explorer
    │   ├── Folder Tree
    │   ├── File Items
    │   └── New File Modal
    └── Sandpack Editor
        ├── Code Editor
        └── Live Preview
```

### State Management

- **Local State**: React useState for component-level state
- **API State**: Axios for HTTP requests
- **Auth State**: localStorage for token persistence
- **Editor State**: Sandpack internal state + local file contents

## Storage Strategy

### MongoDB Collections

**Users**: User accounts and authentication
**Projects**: Project metadata and settings
**Files**: File/folder structure and metadata

### AWS S3 Buckets

**File Content**: Actual code files
- Path structure: `projects/{projectId}/{path}/{filename}`
- Private access (requires AWS credentials)
- Versioning enabled (optional)

### Why This Approach?

1. **Scalability**: S3 handles large files efficiently
2. **Cost**: MongoDB charges by storage; S3 is cheaper for files
3. **Performance**: S3 CDN for fast file delivery
4. **Separation**: Metadata in DB, content in S3
5. **Backup**: S3 versioning for file history

## Performance Optimizations

### Frontend

1. **Code Splitting**: Next.js automatic code splitting
2. **Dynamic Import**: Sandpack loaded only when needed
3. **Lazy Loading**: Files loaded on demand
4. **Caching**: API responses cached in browser

### Backend

1. **Database Indexing**: 
   - userId indexed for fast user queries
   - projectId indexed for file lookups
   - Compound indexes for common queries

2. **Connection Pooling**: MongoDB connection reuse

3. **Async Operations**: Non-blocking I/O for S3 operations

## Scalability Considerations

### Horizontal Scaling

- **Frontend**: Deploy to CDN (Vercel Edge Network)
- **Backend**: Multiple server instances behind load balancer
- **Database**: MongoDB Atlas auto-scaling
- **Storage**: S3 automatically scales

### Vertical Scaling

- Increase server resources as needed
- MongoDB Atlas tier upgrades
- S3 has no limits

## Monitoring & Logging

### Backend Logging

- Request/response logging
- Error tracking
- Performance metrics
- S3 operation logs

### Frontend Monitoring

- Error boundaries for React errors
- API call monitoring
- User interaction tracking

## Future Enhancements

1. **Real-time Collaboration**: WebSocket for multi-user editing
2. **Version Control**: Git integration
3. **Package Management**: npm package installation
4. **Deployment**: One-click deploy to Vercel/Netlify
5. **Templates**: More project templates
6. **Themes**: Multiple editor themes
7. **Extensions**: Plugin system
8. **AI Assistant**: Code completion and suggestions

## Technology Choices Rationale

### Why Next.js?
- Server-side rendering for better SEO
- File-based routing
- API routes (optional)
- Excellent developer experience
- Vercel deployment integration

### Why Express.js?
- Lightweight and flexible
- Large ecosystem
- Easy to understand
- Good performance
- Middleware support

### Why MongoDB?
- Flexible schema for file hierarchy
- Easy to scale
- Good performance for document queries
- Atlas managed service

### Why AWS S3?
- Industry standard
- Highly reliable
- Cost-effective
- Excellent SDK support
- Versioning and backup features

### Why Sandpack?
- Official CodeSandbox solution
- React-specific
- Live preview out of the box
- Good performance
- Active maintenance

---

This architecture provides a solid foundation for a production-ready online IDE while maintaining flexibility for future enhancements.

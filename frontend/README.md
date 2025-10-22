# CipherStudio Frontend

Next.js frontend for CipherStudio online IDE.

## Quick Start

1. Install dependencies:
```bash
npm install
```

2. Create `.env.local` file:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

3. Start development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000)

## Features

- **Landing Page** - Marketing page with features
- **Authentication** - Login and registration
- **Dashboard** - Project management
- **IDE Editor** - Full-featured code editor with live preview

## Pages

- `/` - Landing page
- `/login` - User login
- `/register` - User registration
- `/dashboard` - Projects dashboard
- `/editor/[id]` - IDE editor for specific project

## Components

### SandpackEditor
Sandpack-powered code editor with live preview.

```jsx
<SandpackEditor 
  files={fileContents}
  onFileChange={handleFileContentChange}
/>
```

### FileExplorer
File tree navigation component.

```jsx
<FileExplorer
  files={files}
  onCreateFile={handleCreateFile}
  onDeleteFile={handleDeleteFile}
  onSelectFile={setSelectedFile}
  selectedFile={selectedFile}
/>
```

## API Integration

All API calls are handled through `lib/api.js`:

```javascript
import { projectAPI, fileAPI, authAPI } from '@/lib/api';

// Example usage
const projects = await projectAPI.getAll();
const project = await projectAPI.getById(id);
```

## Authentication

Authentication utilities in `lib/auth.js`:

```javascript
import { setAuthToken, getAuthToken, isAuthenticated } from '@/lib/auth';

// Check if user is authenticated
if (isAuthenticated()) {
  // User is logged in
}
```

## Styling

- **Tailwind CSS** for styling
- **Lucide React** for icons
- Custom scrollbar styles
- Dark mode IDE interface

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Import project in Vercel
3. Set environment variables
4. Deploy

Or use Vercel CLI:
```bash
vercel
```

## Tech Stack

- Next.js 14
- React 18
- Sandpack (CodeSandbox)
- Tailwind CSS
- Axios
- Lucide React

const File = require('../models/File');
const { uploadToS3 } = require('../config/s3');

// Default React template files
const reactTemplate = {
  'src': {
    'App.js': `import React from 'react';

function App() {
  return (
    <div className="App">
      <h1>Welcome to CipherStudio!</h1>
      <p>Start editing to see some magic happen!</p>
    </div>
  );
}

export default App;`,

    'index.js': `import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);`,

    'styles.css': `* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.App {
  text-align: center;
  padding: 50px;
}

h1 {
  color: #333;
  margin-bottom: 20px;
}

p {
  color: #666;
  font-size: 18px;
}`,
  },
  'public': {
    'index.html': `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>React App</title>
</head>
<body>
  <div id="root"></div>
</body>
</html>`,
  },
  'package.json': JSON.stringify({
    name: 'react-app',
    version: '1.0.0',
    dependencies: {
      react: '^18.2.0',
      'react-dom': '^18.2.0',
    },
  }, null, 2),
};

// Initialize project structure based on template
const initializeProjectStructure = async (projectId, template = 'react') => {
  try {
    let templateFiles = reactTemplate;

    // Create folders and files recursively
    const createStructure = async (structure, parentId = null, basePath = '') => {
      for (const [name, content] of Object.entries(structure)) {
        if (typeof content === 'object' && !Array.isArray(content)) {
          // It's a folder
          const folder = await File.create({
            projectId,
            parentId,
            name,
            type: 'folder',
          });
          
          // Recursively create contents
          await createStructure(content, folder._id, basePath ? `${basePath}/${name}` : name);
        } else {
          // It's a file
          const filePath = basePath ? `${basePath}/${name}` : name;
          const s3Key = `projects/${projectId}/${filePath}`;
          
          try {
            // Upload to local storage
            await uploadToS3(s3Key, content, getContentType(name));

            // Create file record
            await File.create({
              projectId,
              parentId,
              name,
              type: 'file',
              s3Key,
            });
          } catch (fileError) {
            console.error(`Error creating file ${name}:`, fileError);
          }
        }
      }
    };

    await createStructure(templateFiles);

    console.log(`Project ${projectId} initialized with ${template} template`);
  } catch (error) {
    console.error('Error initializing project structure:', error);
    throw error;
  }
};

// Helper function to determine content type
const getContentType = (filename) => {
  const ext = filename.split('.').pop().toLowerCase();
  const contentTypes = {
    js: 'application/javascript',
    jsx: 'application/javascript',
    ts: 'application/typescript',
    tsx: 'application/typescript',
    json: 'application/json',
    html: 'text/html',
    css: 'text/css',
    md: 'text/markdown',
    txt: 'text/plain',
  };

  return contentTypes[ext] || 'text/plain';
};

module.exports = {
  initializeProjectStructure,
};

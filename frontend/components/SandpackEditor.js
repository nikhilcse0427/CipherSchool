import { Sandpack } from '@codesandbox/sandpack-react';
import { nightOwl } from '@codesandbox/sandpack-themes';

export default function SandpackEditor({ files, onFileChange }) {
  // Convert files object to Sandpack format
  const sandpackFiles = {};
  
  Object.keys(files).forEach(path => {
    sandpackFiles[`/${path}`] = {
      code: files[path] || '',
    };
  });

  return (
    <div className="h-full">
      <Sandpack
        template="react"
        theme={nightOwl}
        files={sandpackFiles}
        options={{
          showNavigator: true,
          showTabs: true,
          showLineNumbers: true,
          showInlineErrors: true,
          wrapContent: true,
          editorHeight: '100%',
          editorWidthPercentage: 60,
          autorun: true,
          autoReload: true,
          recompileMode: 'delayed',
          recompileDelay: 500,
        }}
        customSetup={{
          dependencies: {
            react: '^18.2.0',
            'react-dom': '^18.2.0',
          },
        }}
      />
    </div>
  );
}

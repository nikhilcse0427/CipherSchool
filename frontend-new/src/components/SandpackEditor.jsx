import { Sandpack } from '@codesandbox/sandpack-react';
import { nightOwl } from '@codesandbox/sandpack-themes';

export default function SandpackEditor({ files, onFileChange }) {
  // Convert files object to Sandpack format
  const sandpackFiles = {};
  
  for (const [path, content] of Object.entries(files)) {
    sandpackFiles[`/${path}`] = {
      code: content || '',
    };
  }

  return (
    <Sandpack
      template="react"
      theme={nightOwl}
      files={sandpackFiles}
      options={{
        showNavigator: false,
        showTabs: true,
        showLineNumbers: true,
        showInlineErrors: true,
        wrapContent: true,
        editorHeight: '100%',
        editorWidthPercentage: 60,
      }}
    />
  );
}

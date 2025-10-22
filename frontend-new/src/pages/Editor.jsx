import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Code2, Save, ArrowLeft } from 'lucide-react';
import { projectAPI, fileAPI } from '../lib/api';
import FileExplorer from '../components/FileExplorer';
import SandpackEditor from '../components/SandpackEditor';

export default function Editor() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [project, setProject] = useState(null);
  const [files, setFiles] = useState([]);
  const [fileContents, setFileContents] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    if (id) {
      loadProject();
    }
  }, [id]);

  const loadProject = async () => {
    try {
      // Load project details
      const projectRes = await projectAPI.getById(id);
      setProject(projectRes.data);

      // Load project files
      const filesRes = await fileAPI.getProjectFiles(id);
      setFiles(filesRes.data);

      // Load file contents
      const contents = {};
      for (const file of filesRes.data) {
        if (file.type === 'file') {
          try {
            const contentRes = await fileAPI.getContent(file._id);
            const filePath = getFilePath(file, filesRes.data);
            contents[filePath] = contentRes.data.content;
          } catch (error) {
            console.error(`Error loading content for ${file.name}:`, error);
          }
        }
      }
      setFileContents(contents);
    } catch (error) {
      console.error('Error loading project:', error);
      alert('Failed to load project');
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const getFilePath = (file, allFiles) => {
    if (!file.parentId) {
      return file.name;
    }

    const parent = allFiles.find(f => f._id === file.parentId);
    if (parent) {
      return `${getFilePath(parent, allFiles)}/${file.name}`;
    }

    return file.name;
  };

  const handleFileContentChange = (path, content) => {
    setFileContents(prev => ({
      ...prev,
      [path]: content,
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      // Save all modified files
      for (const file of files) {
        if (file.type === 'file') {
          const filePath = getFilePath(file, files);
          const content = fileContents[filePath];
          
          if (content !== undefined) {
            await fileAPI.update(file._id, { content });
          }
        }
      }
      
      alert('Project saved successfully!');
    } catch (error) {
      console.error('Error saving project:', error);
      alert('Failed to save project');
    } finally {
      setSaving(false);
    }
  };

  const handleCreateFile = async (name, parentId, type) => {
    try {
      const newFile = await fileAPI.create({
        projectId: id,
        name,
        parentId,
        type,
        content: type === 'file' ? '' : undefined,
      });

      setFiles([...files, newFile.data]);
      
      if (type === 'file') {
        const filePath = getFilePath(newFile.data, [...files, newFile.data]);
        setFileContents(prev => ({
          ...prev,
          [filePath]: '',
        }));
      }
    } catch (error) {
      console.error('Error creating file:', error);
      alert('Failed to create file');
    }
  };

  const handleDeleteFile = async (fileId) => {
    try {
      await fileAPI.delete(fileId);
      setFiles(files.filter(f => f._id !== fileId));
      
      // Remove from fileContents if it's a file
      const deletedFile = files.find(f => f._id === fileId);
      if (deletedFile && deletedFile.type === 'file') {
        const filePath = getFilePath(deletedFile, files);
        const newContents = { ...fileContents };
        delete newContents[filePath];
        setFileContents(newContents);
      }
    } catch (error) {
      console.error('Error deleting file:', error);
      alert('Failed to delete file');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading project...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-gray-900">
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link
              to="/dashboard"
              className="text-gray-400 hover:text-white transition"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div className="flex items-center space-x-2">
              <Code2 className="w-6 h-6 text-primary-500" />
              <span className="text-white font-semibold">{project?.name}</span>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center space-x-2 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? 'Saving...' : 'Save'}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Editor Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* File Explorer */}
        <div className="w-64 bg-gray-800 border-r border-gray-700 overflow-y-auto">
          <FileExplorer
            files={files}
            onCreateFile={handleCreateFile}
            onDeleteFile={handleDeleteFile}
            onSelectFile={setSelectedFile}
            selectedFile={selectedFile}
          />
        </div>

        {/* Sandpack Editor */}
        <div className="flex-1">
          <SandpackEditor
            files={fileContents}
            onFileChange={handleFileContentChange}
          />
        </div>
      </div>
    </div>
  );
}

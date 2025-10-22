import { useState } from 'react';
import { 
  Folder, 
  FolderOpen, 
  File, 
  Plus, 
  Trash2, 
  ChevronRight, 
  ChevronDown,
  FileCode,
  FileJson,
  FileText
} from 'lucide-react';

export default function FileExplorer({ files, onCreateFile, onDeleteFile, onSelectFile, selectedFile }) {
  const [expandedFolders, setExpandedFolders] = useState(new Set());
  const [showNewFileModal, setShowNewFileModal] = useState(false);
  const [newFileName, setNewFileName] = useState('');
  const [newFileType, setNewFileType] = useState('file');
  const [parentFolderId, setParentFolderId] = useState(null);

  const toggleFolder = (folderId) => {
    const newExpanded = new Set(expandedFolders);
    if (newExpanded.has(folderId)) {
      newExpanded.delete(folderId);
    } else {
      newExpanded.add(folderId);
    }
    setExpandedFolders(newExpanded);
  };

  const getFileIcon = (fileName) => {
    const ext = fileName.split('.').pop().toLowerCase();
    
    if (ext === 'json') return <FileJson className="w-4 h-4 text-yellow-400" />;
    if (['js', 'jsx', 'ts', 'tsx'].includes(ext)) return <FileCode className="w-4 h-4 text-blue-400" />;
    if (['css', 'html'].includes(ext)) return <FileCode className="w-4 h-4 text-purple-400" />;
    
    return <FileText className="w-4 h-4 text-gray-400" />;
  };

  const handleCreateFile = () => {
    if (!newFileName.trim()) return;
    
    onCreateFile(newFileName, parentFolderId, newFileType);
    setShowNewFileModal(false);
    setNewFileName('');
    setNewFileType('file');
    setParentFolderId(null);
  };

  const openNewFileModal = (parentId = null) => {
    setParentFolderId(parentId);
    setShowNewFileModal(true);
  };

  const renderFileTree = (parentId = null, level = 0) => {
    const items = files.filter(f => f.parentId === parentId);
    
    return items.map(item => {
      const isExpanded = expandedFolders.has(item._id);
      const isSelected = selectedFile?._id === item._id;

      if (item.type === 'folder') {
        return (
          <div key={item._id}>
            <div
              className={`flex items-center space-x-2 px-3 py-2 hover:bg-gray-700 cursor-pointer group ${
                isSelected ? 'bg-gray-700' : ''
              }`}
              style={{ paddingLeft: `${level * 16 + 12}px` }}
            >
              <button
                onClick={() => toggleFolder(item._id)}
                className="flex items-center space-x-2 flex-1"
              >
                {isExpanded ? (
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                )}
                {isExpanded ? (
                  <FolderOpen className="w-4 h-4 text-blue-400" />
                ) : (
                  <Folder className="w-4 h-4 text-blue-400" />
                )}
                <span className="text-gray-200 text-sm">{item.name}</span>
              </button>
              <div className="opacity-0 group-hover:opacity-100 flex items-center space-x-1">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    openNewFileModal(item._id);
                  }}
                  className="p-1 hover:bg-gray-600 rounded"
                  title="New file"
                >
                  <Plus className="w-3 h-3 text-gray-400" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (confirm(`Delete folder "${item.name}"?`)) {
                      onDeleteFile(item._id);
                    }
                  }}
                  className="p-1 hover:bg-gray-600 rounded"
                  title="Delete"
                >
                  <Trash2 className="w-3 h-3 text-gray-400" />
                </button>
              </div>
            </div>
            {isExpanded && renderFileTree(item._id, level + 1)}
          </div>
        );
      }

      return (
        <div
          key={item._id}
          className={`flex items-center space-x-2 px-3 py-2 hover:bg-gray-700 cursor-pointer group ${
            isSelected ? 'bg-gray-700' : ''
          }`}
          style={{ paddingLeft: `${level * 16 + 28}px` }}
          onClick={() => onSelectFile(item)}
        >
          {getFileIcon(item.name)}
          <span className="text-gray-200 text-sm flex-1">{item.name}</span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (confirm(`Delete file "${item.name}"?`)) {
                onDeleteFile(item._id);
              }
            }}
            className="opacity-0 group-hover:opacity-100 p-1 hover:bg-gray-600 rounded"
            title="Delete"
          >
            <Trash2 className="w-3 h-3 text-gray-400" />
          </button>
        </div>
      );
    });
  };

  return (
    <div className="h-full flex flex-col">
      <div className="px-3 py-3 border-b border-gray-700 flex items-center justify-between">
        <span className="text-gray-300 font-semibold text-sm">FILES</span>
        <button
          onClick={() => openNewFileModal(null)}
          className="p-1 hover:bg-gray-700 rounded"
          title="New file"
        >
          <Plus className="w-4 h-4 text-gray-400" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {files.length === 0 ? (
          <div className="text-center py-8 px-4">
            <File className="w-8 h-8 text-gray-600 mx-auto mb-2" />
            <p className="text-gray-500 text-sm">No files yet</p>
          </div>
        ) : (
          renderFileTree()
        )}
      </div>

      {/* New File Modal */}
      {showNewFileModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-white text-lg font-semibold mb-4">Create New</h3>
            
            <div className="mb-4">
              <label className="block text-gray-300 text-sm mb-2">Type</label>
              <div className="flex space-x-4">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    value="file"
                    checked={newFileType === 'file'}
                    onChange={(e) => setNewFileType(e.target.value)}
                    className="text-primary-600"
                  />
                  <span className="text-gray-300">File</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    value="folder"
                    checked={newFileType === 'folder'}
                    onChange={(e) => setNewFileType(e.target.value)}
                    className="text-primary-600"
                  />
                  <span className="text-gray-300">Folder</span>
                </label>
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-gray-300 text-sm mb-2">Name</label>
              <input
                type="text"
                value={newFileName}
                onChange={(e) => setNewFileName(e.target.value)}
                className="w-full px-3 py-2 bg-gray-700 text-white border border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                placeholder={newFileType === 'file' ? 'example.js' : 'folder-name'}
                autoFocus
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleCreateFile();
                  }
                }}
              />
            </div>

            <div className="flex space-x-3">
              <button
                onClick={() => {
                  setShowNewFileModal(false);
                  setNewFileName('');
                  setNewFileType('file');
                  setParentFolderId(null);
                }}
                className="flex-1 px-4 py-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateFile}
                className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

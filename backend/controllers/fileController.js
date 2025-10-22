const { validationResult } = require('express-validator');
const File = require('../models/File');
const Project = require('../models/Project');
const { uploadToS3, getFromS3, deleteFromS3, deleteMultipleFromS3 } = require('../config/s3');

// @desc    Create a new file or folder
// @route   POST /api/files
// @access  Private
const createFile = async (req, res) => {
  try {
    console.log('Creating file/folder:', req.body);
    
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log('Validation errors:', errors.array());
      return res.status(400).json({ errors: errors.array() });
    }

    const { projectId, name, type, parentId, content = '' } = req.body;

    // Verify project exists and user owns it
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    if (project.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to modify this project' });
    }

    // If parentId is provided, verify it exists
    if (parentId) {
      const parentFolder = await File.findById(parentId);
      if (!parentFolder || parentFolder.type !== 'folder') {
        return res.status(400).json({ message: 'Invalid parent folder' });
      }
    }

    let s3Key = null;

    // If it's a file, upload content to S3
    if (type === 'file') {
      const parentPath = parentId ? await getFilePath(parentId) : '';
      s3Key = `projects/${projectId}/${parentPath}${name}`;
      
      await uploadToS3(s3Key, content, getContentType(name));
    }

    // Create file/folder record
    const file = await File.create({
      projectId,
      parentId: parentId || null,
      name,
      type,
      s3Key,
    });

    console.log('File/folder created successfully:', file._id);
    res.status(201).json(file);
  } catch (error) {
    console.error('Create file error:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({ message: 'Server error while creating file', error: error.message });
  }
};

// @desc    Get all files for a project
// @route   GET /api/files/project/:projectId
// @access  Private
const getProjectFiles = async (req, res) => {
  try {
    const { projectId } = req.params;

    // Verify project exists and user has access
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    if (project.userId.toString() !== req.user._id.toString() && !project.isPublic) {
      return res.status(403).json({ message: 'Not authorized to access this project' });
    }

    // Get all files and folders for the project
    const files = await File.find({ projectId }).sort({ order: 1, name: 1 });

    res.json(files);
  } catch (error) {
    console.error('Get project files error:', error);
    res.status(500).json({ message: 'Server error while fetching files' });
  }
};

// @desc    Get file/folder by ID
// @route   GET /api/files/:id
// @access  Private
const getFileById = async (req, res) => {
  try {
    const file = await File.findById(req.params.id);

    if (!file) {
      return res.status(404).json({ message: 'File not found' });
    }

    // Verify user has access to the project
    const project = await Project.findById(file.projectId);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    if (project.userId.toString() !== req.user._id.toString() && !project.isPublic) {
      return res.status(403).json({ message: 'Not authorized to access this file' });
    }

    res.json(file);
  } catch (error) {
    console.error('Get file error:', error);
    res.status(500).json({ message: 'Server error while fetching file' });
  }
};

// @desc    Get file content from S3
// @route   GET /api/files/:id/content
// @access  Private
const getFileContent = async (req, res) => {
  try {
    const file = await File.findById(req.params.id);

    if (!file) {
      return res.status(404).json({ message: 'File not found' });
    }

    if (file.type !== 'file') {
      return res.status(400).json({ message: 'Cannot get content of a folder' });
    }

    // Verify user has access to the project
    const project = await Project.findById(file.projectId);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    if (project.userId.toString() !== req.user._id.toString() && !project.isPublic) {
      return res.status(403).json({ message: 'Not authorized to access this file' });
    }

    // Get content from S3
    const content = await getFromS3(file.s3Key);

    res.json({ content });
  } catch (error) {
    console.error('Get file content error:', error);
    res.status(500).json({ message: 'Server error while fetching file content' });
  }
};

// @desc    Update file/folder
// @route   PUT /api/files/:id
// @access  Private
const updateFile = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const file = await File.findById(req.params.id);

    if (!file) {
      return res.status(404).json({ message: 'File not found' });
    }

    // Verify user owns the project
    const project = await Project.findById(file.projectId);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    if (project.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to modify this file' });
    }

    // Update name if provided
    if (req.body.name && req.body.name !== file.name) {
      const oldS3Key = file.s3Key;
      file.name = req.body.name;

      // If it's a file, update S3 key
      if (file.type === 'file') {
        const parentPath = file.parentId ? await getFilePath(file.parentId) : '';
        const newS3Key = `projects/${file.projectId}/${parentPath}${file.name}`;
        
        // Get old content, upload to new key, delete old key
        const content = await getFromS3(oldS3Key);
        await uploadToS3(newS3Key, content, getContentType(file.name));
        await deleteFromS3(oldS3Key);
        
        file.s3Key = newS3Key;
      }
    }

    // Update content if provided (only for files)
    if (req.body.content !== undefined && file.type === 'file') {
      await uploadToS3(file.s3Key, req.body.content, getContentType(file.name));
    }

    const updatedFile = await file.save();

    res.json(updatedFile);
  } catch (error) {
    console.error('Update file error:', error);
    res.status(500).json({ message: 'Server error while updating file' });
  }
};

// @desc    Delete file/folder
// @route   DELETE /api/files/:id
// @access  Private
const deleteFile = async (req, res) => {
  try {
    const file = await File.findById(req.params.id);

    if (!file) {
      return res.status(404).json({ message: 'File not found' });
    }

    // Verify user owns the project
    const project = await Project.findById(file.projectId);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    if (project.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this file' });
    }

    if (file.type === 'folder') {
      // Recursively delete all children
      await deleteFolder(file._id);
    } else {
      // Delete file from S3
      await deleteFromS3(file.s3Key);
    }

    // Delete the file/folder record
    await file.deleteOne();

    res.json({ message: 'File deleted successfully' });
  } catch (error) {
    console.error('Delete file error:', error);
    res.status(500).json({ message: 'Server error while deleting file' });
  }
};

// Helper function to recursively delete folder and its contents
const deleteFolder = async (folderId) => {
  const children = await File.find({ parentId: folderId });

  for (const child of children) {
    if (child.type === 'folder') {
      await deleteFolder(child._id);
    } else {
      await deleteFromS3(child.s3Key);
    }
    await child.deleteOne();
  }
};

// Helper function to get file path
const getFilePath = async (fileId) => {
  const file = await File.findById(fileId);
  if (!file) return '';

  if (file.parentId) {
    const parentPath = await getFilePath(file.parentId);
    return `${parentPath}${file.name}/`;
  }

  return `${file.name}/`;
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
  createFile,
  getProjectFiles,
  getFileById,
  getFileContent,
  updateFile,
  deleteFile,
};

const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const {
  createFile,
  getFileById,
  getProjectFiles,
  updateFile,
  deleteFile,
  getFileContent,
} = require('../controllers/fileController');
const { protect } = require('../middleware/auth');

// All routes are protected
router.use(protect);

// Create a new file or folder
router.post(
  '/',
  [
    body('projectId').isMongoId(),
    body('name').trim().notEmpty(),
    body('type').isIn(['file', 'folder']),
    body('parentId').optional().isMongoId(),
    body('content').optional().isString(),
  ],
  createFile
);

// Get all files for a project
router.get('/project/:projectId', getProjectFiles);

// Get file/folder by ID
router.get('/:id', getFileById);

// Get file content from S3
router.get('/:id/content', getFileContent);

// Update file/folder
router.put(
  '/:id',
  [
    body('name').optional().trim().notEmpty(),
    body('content').optional().isString(),
  ],
  updateFile
);

// Delete file/folder
router.delete('/:id', deleteFile);

module.exports = router;

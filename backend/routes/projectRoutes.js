const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const {
  createProject,
  getUserProjects,
  getProjectById,
  updateProject,
  deleteProject,
} = require('../controllers/projectController');
const { protect } = require('../middleware/auth');

// All routes are protected
router.use(protect);

// Create a new project
router.post(
  '/',
  [
    body('name').trim().notEmpty().isLength({ max: 100 }),
    body('description').optional().isLength({ max: 500 }),
    body('template').optional().isIn(['react', 'react-ts', 'vanilla', 'vanilla-ts']),
  ],
  createProject
);

// Get all projects for the authenticated user
router.get('/', getUserProjects);

// Get a specific project by ID
router.get('/:id', getProjectById);

// Update a project
router.put(
  '/:id',
  [
    body('name').optional().trim().notEmpty().isLength({ max: 100 }),
    body('description').optional().isLength({ max: 500 }),
    body('isPublic').optional().isBoolean(),
  ],
  updateProject
);

// Delete a project
router.delete('/:id', deleteProject);

module.exports = router;

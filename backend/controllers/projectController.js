const { validationResult } = require('express-validator');
const Project = require('../models/Project');
const File = require('../models/File');
const { deleteMultipleFromS3 } = require('../config/s3');
const { initializeProjectStructure } = require('../utils/projectTemplates');

// @desc    Create a new project
// @route   POST /api/projects
// @access  Private
const createProject = async (req, res) => {
  try {
    console.log('Creating project for user:', req.user?._id);
    console.log('Request body:', req.body);
    
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log('Validation errors:', errors.array());
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, description, template = 'react', isPublic = false } = req.body;

    // Create project
    const project = await Project.create({
      name,
      description,
      userId: req.user._id,
      template,
      isPublic,
    });
    
    console.log('Project created:', project._id);

    // Initialize project structure based on template
    await initializeProjectStructure(project._id, template);
    
    console.log('Project structure initialized');

    res.status(201).json(project);
  } catch (error) {
    console.error('Create project error:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({ message: 'Server error while creating project', error: error.message });
  }
};

// @desc    Get all projects for authenticated user
// @route   GET /api/projects
// @access  Private
const getUserProjects = async (req, res) => {
  try {
    const projects = await Project.find({ userId: req.user._id })
      .sort({ updatedAt: -1 })
      .select('-__v');

    res.json(projects);
  } catch (error) {
    console.error('Get projects error:', error);
    res.status(500).json({ message: 'Server error while fetching projects' });
  }
};

// @desc    Get project by ID
// @route   GET /api/projects/:id
// @access  Private
const getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Check if user owns the project or if it's public
    if (project.userId.toString() !== req.user._id.toString() && !project.isPublic) {
      return res.status(403).json({ message: 'Not authorized to access this project' });
    }

    // Update lastOpened timestamp
    project.lastOpened = Date.now();
    await project.save();

    res.json(project);
  } catch (error) {
    console.error('Get project error:', error);
    res.status(500).json({ message: 'Server error while fetching project' });
  }
};

// @desc    Update project
// @route   PUT /api/projects/:id
// @access  Private
const updateProject = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Check if user owns the project
    if (project.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this project' });
    }

    // Update fields
    project.name = req.body.name || project.name;
    project.description = req.body.description !== undefined ? req.body.description : project.description;
    project.isPublic = req.body.isPublic !== undefined ? req.body.isPublic : project.isPublic;

    const updatedProject = await project.save();

    res.json(updatedProject);
  } catch (error) {
    console.error('Update project error:', error);
    res.status(500).json({ message: 'Server error while updating project' });
  }
};

// @desc    Delete project
// @route   DELETE /api/projects/:id
// @access  Private
const deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Check if user owns the project
    if (project.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this project' });
    }

    // Get all files associated with the project
    const files = await File.find({ projectId: req.params.id, type: 'file' });

    // Delete all files from S3
    const s3Keys = files.map(file => file.s3Key).filter(key => key);
    if (s3Keys.length > 0) {
      await deleteMultipleFromS3(s3Keys);
    }

    // Delete all file/folder records from database
    await File.deleteMany({ projectId: req.params.id });

    // Delete the project
    await project.deleteOne();

    res.json({ message: 'Project deleted successfully' });
  } catch (error) {
    console.error('Delete project error:', error);
    res.status(500).json({ message: 'Server error while deleting project' });
  }
};

module.exports = {
  createProject,
  getUserProjects,
  getProjectById,
  updateProject,
  deleteProject,
};

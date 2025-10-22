# Contributing to CipherStudio

Thank you for your interest in contributing to CipherStudio! This document provides guidelines and instructions for contributing.

## Table of Contents
- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Coding Standards](#coding-standards)
- [Commit Guidelines](#commit-guidelines)
- [Pull Request Process](#pull-request-process)

## Code of Conduct

### Our Pledge
We are committed to providing a welcoming and inclusive environment for all contributors.

### Our Standards
- Use welcoming and inclusive language
- Be respectful of differing viewpoints
- Accept constructive criticism gracefully
- Focus on what is best for the community
- Show empathy towards other community members

## Getting Started

### Prerequisites
- Node.js v16 or higher
- npm or yarn
- Git
- MongoDB Atlas account (for testing)
- AWS account (for S3 testing)

### Fork and Clone
1. Fork the repository on GitHub
2. Clone your fork:
```bash
git clone https://github.com/YOUR_USERNAME/cipherstudio.git
cd cipherstudio
```

3. Add upstream remote:
```bash
git remote add upstream https://github.com/ORIGINAL_OWNER/cipherstudio.git
```

### Install Dependencies

**Backend**:
```bash
cd backend
npm install
```

**Frontend**:
```bash
cd frontend
npm install
```

### Set Up Environment
Follow the setup instructions in `SETUP_GUIDE.md`

## Development Workflow

### 1. Create a Branch
```bash
git checkout -b feature/your-feature-name
```

Branch naming conventions:
- `feature/` - New features
- `fix/` - Bug fixes
- `docs/` - Documentation updates
- `refactor/` - Code refactoring
- `test/` - Adding tests
- `chore/` - Maintenance tasks

### 2. Make Changes
- Write clean, readable code
- Follow existing code style
- Add comments for complex logic
- Update documentation if needed

### 3. Test Your Changes
```bash
# Backend
cd backend
npm run dev

# Frontend
cd frontend
npm run dev
```

### 4. Commit Changes
```bash
git add .
git commit -m "feat: add new feature"
```

### 5. Push to Your Fork
```bash
git push origin feature/your-feature-name
```

### 6. Create Pull Request
1. Go to GitHub
2. Click "New Pull Request"
3. Select your branch
4. Fill out the PR template
5. Submit for review

## Coding Standards

### JavaScript/React Style Guide

#### General Rules
- Use ES6+ syntax
- Use functional components with hooks
- Avoid inline styles (use Tailwind classes)
- Keep components small and focused
- Use meaningful variable names

#### Example:
```javascript
// Good
const UserProfile = ({ user }) => {
  const [isEditing, setIsEditing] = useState(false);
  
  const handleEdit = () => {
    setIsEditing(true);
  };
  
  return (
    <div className="p-4 bg-white rounded-lg">
      <h2 className="text-xl font-bold">{user.name}</h2>
      <button onClick={handleEdit}>Edit</button>
    </div>
  );
};

// Bad
const UserProfile = (props) => {
  const [x, setX] = useState(false);
  
  return (
    <div style={{ padding: '16px', background: 'white' }}>
      <h2>{props.user.name}</h2>
      <button onClick={() => setX(true)}>Edit</button>
    </div>
  );
};
```

### Backend Style Guide

#### Express.js Controllers
```javascript
// Good
const createProject = async (req, res) => {
  try {
    const { name, description } = req.body;
    
    const project = await Project.create({
      name,
      description,
      userId: req.user._id,
    });
    
    res.status(201).json(project);
  } catch (error) {
    console.error('Create project error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Bad
const createProject = async (req, res) => {
  const project = await Project.create(req.body);
  res.json(project);
};
```

### File Organization

#### Frontend
```
components/
  ├── ComponentName.js       # Component file
  └── index.js              # Export file (if needed)

pages/
  ├── index.js              # Page component
  └── [dynamic].js          # Dynamic route

lib/
  ├── api.js                # API utilities
  └── utils.js              # Helper functions
```

#### Backend
```
controllers/
  └── resourceController.js  # Controller logic

models/
  └── Resource.js           # Mongoose model

routes/
  └── resourceRoutes.js     # Route definitions

middleware/
  └── auth.js               # Middleware functions
```

## Commit Guidelines

### Commit Message Format
```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting)
- `refactor`: Code refactoring
- `test`: Adding tests
- `chore`: Maintenance tasks

### Examples
```bash
feat(editor): add syntax highlighting

Add Monaco editor integration for better syntax highlighting
and code completion features.

Closes #123
```

```bash
fix(auth): resolve token expiration issue

Fixed bug where JWT tokens were not being properly validated
after expiration.

Fixes #456
```

## Pull Request Process

### Before Submitting
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Comments added for complex code
- [ ] Documentation updated
- [ ] No console.log statements
- [ ] Tested locally
- [ ] No merge conflicts

### PR Template
```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
How to test these changes

## Screenshots (if applicable)
Add screenshots here

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-reviewed
- [ ] Commented complex code
- [ ] Updated documentation
- [ ] No breaking changes
- [ ] Tested locally
```

### Review Process
1. Maintainer reviews code
2. Feedback provided (if needed)
3. Make requested changes
4. Re-request review
5. Approved and merged

## Areas for Contribution

### High Priority
- [ ] Add unit tests
- [ ] Improve error handling
- [ ] Add loading states
- [ ] Optimize performance
- [ ] Improve accessibility

### Feature Ideas
- [ ] Real-time collaboration
- [ ] Git integration
- [ ] More project templates
- [ ] Theme customization
- [ ] Code snippets library
- [ ] AI code completion
- [ ] Mobile responsive improvements

### Documentation
- [ ] API documentation
- [ ] Component documentation
- [ ] Tutorial videos
- [ ] Blog posts
- [ ] Translation (i18n)

## Testing Guidelines

### Manual Testing
1. Test all user flows
2. Test edge cases
3. Test error scenarios
4. Test on different browsers
5. Test responsive design

### Automated Testing (Future)
```javascript
// Example test
describe('ProjectController', () => {
  it('should create a new project', async () => {
    const project = await createProject({
      name: 'Test Project',
      userId: 'user123',
    });
    
    expect(project.name).toBe('Test Project');
  });
});
```

## Documentation

### Code Comments
```javascript
/**
 * Create a new project with default template
 * @param {Object} projectData - Project information
 * @param {string} projectData.name - Project name
 * @param {string} projectData.userId - Owner user ID
 * @returns {Promise<Object>} Created project
 */
const createProject = async (projectData) => {
  // Implementation
};
```

### README Updates
- Keep README.md up to date
- Add new features to feature list
- Update setup instructions if needed
- Add screenshots for UI changes

## Getting Help

### Resources
- [Setup Guide](SETUP_GUIDE.md)
- [Architecture](ARCHITECTURE.md)
- [Deployment Guide](DEPLOYMENT.md)

### Communication
- GitHub Issues: Bug reports and feature requests
- GitHub Discussions: Questions and ideas
- Pull Requests: Code contributions

## Recognition

Contributors will be:
- Listed in CONTRIBUTORS.md
- Mentioned in release notes
- Credited in documentation

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing to CipherStudio! 🎉

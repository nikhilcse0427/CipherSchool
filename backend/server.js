require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/database');
const { errorHandler, notFound } = require('./middleware/errorHandler');

// Import routes
const userRoutes = require('./routes/userRoutes');
const projectRoutes = require('./routes/projectRoutes');
const fileRoutes = require('./routes/fileRoutes');

// Connect to MongoDB
connectDB();

const app = express();

// Middleware - Allow multiple origins for development and production
const allowedOrigins = [
  'http://localhost:3000',
  'https://cipher-school-yllk.vercel.app',
  process.env.CORS_ORIGIN
].filter(Boolean);

const cors = require('cors');
app.use(cors({
  origin: [
    'http://localhost:3000', // For development
    'https://cipher-school-nyua.vercel.app/' // Your production frontend URL
  ],
  credentials: true
}));

app.use(express.json());
// Routes
app.get('/', (req, res) => {
  res.json({ message: 'CipherStudio API is running' });
});

// Log all requests
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

// Routes
app.use('/api/users', userRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/files', fileRoutes);

// Error handling
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

// For local development
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

// Export for Vercel serverless
module.exports = app;

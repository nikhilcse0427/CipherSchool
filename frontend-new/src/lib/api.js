import axios from 'axios';

// Get the environment
const isProduction = import.meta.env.PROD;

// Set API URL based on environment
const getApiUrl = () => {
  // In production, use VITE_API_URL environment variable
  if (isProduction) {
    // Remove any trailing slashes and add /api
    const baseUrl = import.meta.env.VITE_API_URL || window.location.origin;
    return baseUrl.replace(/\/+$/, '');
  }
  // In development, use localhost
  return 'http://localhost:5000';
};

// Ensure the API URL ends with /api to match backend routes
const API_URL = getApiUrl().replace(/\/+$/, '') + '/api';

console.log('Using API URL:', API_URL); // Debug log

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  withCredentials: false,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    if (error.response?.status === 401) {
      // Clear token and redirect to login
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth APIs
export const authAPI = {
  register: (data) => api.post('/users/register', data),
  login: (data) => api.post('/users/login', data),
  getProfile: () => api.get('/users/profile'),
  updateProfile: (data) => api.put('/users/profile', data),
};

// Project APIs
export const projectAPI = {
  create: (data) => api.post('/projects', data),
  getAll: () => api.get('/projects'),
  getById: (id) => api.get(`/projects/${id}`),
  update: (id, data) => api.put(`/projects/${id}`, data),
  delete: (id) => api.delete(`/projects/${id}`),
};

// File APIs
export const fileAPI = {
  create: (data) => api.post('/files', data),
  getProjectFiles: (projectId) => api.get(`/files/project/${projectId}`),
  getById: (id) => api.get(`/files/${id}`),
  getContent: (id) => api.get(`/files/${id}/content`),
  update: (id, data) => api.put(`/files/${id}`, data),
  delete: (id) => api.delete(`/files/${id}`),
};

export default api;

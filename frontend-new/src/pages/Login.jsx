import { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { Code2 } from 'lucide-react';
import { authAPI } from '../lib/api';
import { setAuthToken, setUser } from '../lib/auth';

export default function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      console.log('Sending login request with data:', formData);
      const response = await authAPI.login(formData);
      console.log('Login response:', response);
      
      // Validate response data
      if (!response || !response.data) {
        console.error('No response data from server');
        throw new Error('No response data from server');
      }
      
      const { _id, username, email, token, fullName } = response.data;
      
      if (!token) {
        console.error('No token in response:', response.data);
        throw new Error('No authentication token received');
      }
      
      // Format user data
      const userData = {
        id: _id,
        name: fullName || username || email.split('@')[0],
        email: email,
        username: username,
        fullName: fullName,
        token: token
      };
      
      console.log('Setting user data:', userData);
      
      // Set auth token and user data
      setAuthToken(token);
      setUser(userData);
      
      // Redirect to dashboard or previous location
      const from = location.state?.from?.pathname || '/dashboard';
      navigate(from, { replace: true });
      
    } catch (err) {
      console.error('Login error:', err);
      const errorMessage = err.response?.data?.message || 
                         (err.message === 'Invalid response from server' 
                          ? 'Invalid response from server. Please try again.' 
                          : 'Login failed. Please check your credentials and try again.');
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center space-x-2 mb-6">
            <Code2 className="w-10 h-10 text-primary-600" />
            <span className="text-3xl font-bold text-gray-900">CipherStudio</span>
          </Link>
          <h2 className="text-2xl font-bold text-gray-900">Welcome Back</h2>
          <p className="text-gray-600 mt-2">Sign in to continue coding</p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8">
          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                placeholder="you@example.com"
                required
              />
            </div>

            <div className="mb-6">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                placeholder="••••••••"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary-600 text-white py-3 rounded-lg font-semibold hover:bg-primary-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <p className="mt-6 text-center text-gray-600">
            Don't have an account?{' '}
            <Link to="/register" className="text-primary-600 hover:text-primary-700 font-medium">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

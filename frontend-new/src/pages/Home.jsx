import { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Code2, Zap, Shield, Cloud } from 'lucide-react';
import { isAuthenticated } from '../lib/auth';

export default function Home() {
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated()) {
      navigate('/dashboard');
    }
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="container mx-auto px-6 py-6">
        <nav className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Code2 className="w-8 h-8 text-primary-600" />
            <span className="text-2xl font-bold text-gray-900">CipherStudio</span>
          </div>
          <div className="space-x-4">
            <Link to="/login" className="text-gray-600 hover:text-gray-900 font-medium">
              Login
            </Link>
            <Link to="/register" className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition">
              Get Started
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-6 py-20">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-6xl font-bold text-gray-900 mb-6">
            Build React Apps
            <span className="block text-primary-600">Right in Your Browser</span>
          </h1>
          <p className="text-xl text-gray-600 mb-10">
            A powerful online IDE for React development. Write, run, and share your code instantly.
          </p>
          <div className="flex justify-center space-x-4">
            <Link to="/register" className="bg-primary-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-primary-700 transition shadow-lg">
              Start Coding Now
            </Link>
            <Link to="/login" className="bg-white text-primary-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-50 transition border-2 border-primary-600">
              Sign In
            </Link>
          </div>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mt-24">
          <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition">
            <div className="bg-primary-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <Code2 className="w-6 h-6 text-primary-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Live Preview</h3>
            <p className="text-gray-600">See your changes instantly with hot module reloading</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition">
            <div className="bg-purple-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <Zap className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Fast & Powerful</h3>
            <p className="text-gray-600">Built on Sandpack for lightning-fast execution</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition">
            <div className="bg-green-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <Cloud className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Cloud Storage</h3>
            <p className="text-gray-600">Your projects are safely stored in the cloud</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition">
            <div className="bg-orange-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <Shield className="w-6 h-6 text-orange-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Secure</h3>
            <p className="text-gray-600">Your code is protected with enterprise-grade security</p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="container mx-auto px-6 py-8 mt-20 border-t border-gray-200">
        <div className="text-center text-gray-600">
          <p>&copy; 2025 CipherStudio. Built with ❤️ for developers.</p>
        </div>
      </footer>
    </div>
  );
}

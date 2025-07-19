import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Eye, EyeOff, ShoppingCart, Package } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login, error, clearError } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (error) {
      toast.error(error);
      clearError();
    }
  }, [error, clearError]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await login(formData);
      toast.success('Login successful!');
      navigate('/dashboard');
    } catch (err) {
      // Error is handled by the context and shown via useEffect
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="flex justify-center items-center space-x-2 mb-6">
            <div className="bg-primary-600 p-3 rounded-full">
              <Package className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">OrderMS</h1>
          </div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">
            Welcome back
          </h2>
          <p className="text-gray-600">
            Sign in to your account to continue
          </p>
        </div>

        {/* Demo Credentials */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="text-sm font-medium text-blue-900 mb-2">Demo Credentials</h3>
          <div className="text-sm text-blue-800 space-y-1">
            <div><strong>Admin:</strong> admin@orderms.com / admin123</div>
            <div><strong>Staff:</strong> staff@orderms.com / staff123</div>
            <div><strong>Customer:</strong> customer@example.com / customer123</div>
          </div>
        </div>

        {/* Login Form */}
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="form-input"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  className="form-input pr-10"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full btn-primary flex justify-center py-3"
            >
              {isSubmitting ? (
                <LoadingSpinner size="sm" className="text-white" />
              ) : (
                'Sign in'
              )}
            </button>
          </div>

          <div className="text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{' '}
              <Link
                to="/register"
                className="font-medium text-primary-600 hover:text-primary-500"
              >
                Sign up here
              </Link>
            </p>
          </div>
        </form>

        {/* Features */}
        <div className="mt-8 pt-8 border-t border-gray-200">
          <div className="grid grid-cols-2 gap-4 text-center">
            <div className="flex flex-col items-center space-y-2">
              <div className="bg-green-100 p-2 rounded-full">
                <ShoppingCart className="h-5 w-5 text-green-600" />
              </div>
              <span className="text-sm text-gray-600">Order Management</span>
            </div>
            <div className="flex flex-col items-center space-y-2">
              <div className="bg-blue-100 p-2 rounded-full">
                <Package className="h-5 w-5 text-blue-600" />
              </div>
              <span className="text-sm text-gray-600">Delivery Tracking</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
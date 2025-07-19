import React from 'react';
import { Link } from 'react-router-dom';
import { Package } from 'lucide-react';

const RegisterPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="flex justify-center items-center space-x-2 mb-6">
            <div className="bg-primary-600 p-3 rounded-full">
              <Package className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">OrderMS</h1>
          </div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">
            Create Account
          </h2>
          <p className="text-gray-600 mb-8">
            Registration is currently disabled for demo purposes.
          </p>
          <Link
            to="/login"
            className="btn-primary"
          >
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
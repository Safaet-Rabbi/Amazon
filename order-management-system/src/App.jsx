import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { AuthProvider, useAuth } from './context/AuthContext';
import LoadingSpinner from './components/common/LoadingSpinner';

// Auth components
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';

// Layout components
import DashboardLayout from './components/layout/DashboardLayout';

// Dashboard pages
import Dashboard from './pages/dashboard/Dashboard';
import OrdersPage from './pages/orders/OrdersPage';
import OrderDetailsPage from './pages/orders/OrderDetailsPage';
import CustomersPage from './pages/customers/CustomersPage';
import ProductsPage from './pages/products/ProductsPage';
import DeliveriesPage from './pages/deliveries/DeliveriesPage';
import TrackingPage from './pages/tracking/TrackingPage';

// Protected Route component
const ProtectedRoute = ({ children, requiredRole = null }) => {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="xl" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && user?.role !== requiredRole && user?.role !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

// Public Route component (redirect if authenticated)
const PublicRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="xl" />
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={
        <PublicRoute>
          <LoginPage />
        </PublicRoute>
      } />
      
      <Route path="/register" element={
        <PublicRoute>
          <RegisterPage />
        </PublicRoute>
      } />

      {/* Public tracking page */}
      <Route path="/track/:trackingNumber?" element={<TrackingPage />} />

      {/* Protected Routes */}
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <DashboardLayout>
            <Dashboard />
          </DashboardLayout>
        </ProtectedRoute>
      } />

      <Route path="/orders" element={
        <ProtectedRoute>
          <DashboardLayout>
            <OrdersPage />
          </DashboardLayout>
        </ProtectedRoute>
      } />

      <Route path="/orders/:orderId" element={
        <ProtectedRoute>
          <DashboardLayout>
            <OrderDetailsPage />
          </DashboardLayout>
        </ProtectedRoute>
      } />

      <Route path="/customers" element={
        <ProtectedRoute>
          <DashboardLayout>
            <CustomersPage />
          </DashboardLayout>
        </ProtectedRoute>
      } />

      <Route path="/products" element={
        <ProtectedRoute>
          <DashboardLayout>
            <ProductsPage />
          </DashboardLayout>
        </ProtectedRoute>
      } />

      <Route path="/deliveries" element={
        <ProtectedRoute requiredRole="staff">
          <DashboardLayout>
            <DeliveriesPage />
          </DashboardLayout>
        </ProtectedRoute>
      } />

      {/* Default redirect */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      
      {/* 404 fallback */}
      <Route path="*" element={
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">404</h1>
            <p className="text-gray-600 mb-8">Page not found</p>
            <a href="/dashboard" className="btn-primary">
              Go to Dashboard
            </a>
          </div>
        </div>
      } />
    </Routes>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <AppRoutes />
          
          {/* Toast notifications */}
          <ToastContainer
            position="top-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
          />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;

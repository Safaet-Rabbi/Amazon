import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Package, 
  ShoppingCart, 
  Users, 
  Truck, 
  BarChart3, 
  Menu, 
  X, 
  LogOut,
  User
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';

const DashboardLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout, isStaff } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: BarChart3, current: location.pathname === '/dashboard' },
    { name: 'Orders', href: '/orders', icon: ShoppingCart, current: location.pathname.startsWith('/orders') },
    { name: 'Customers', href: '/customers', icon: Users, current: location.pathname === '/customers' },
    { name: 'Products', href: '/products', icon: Package, current: location.pathname === '/products' },
    ...(isStaff ? [{ name: 'Deliveries', href: '/deliveries', icon: Truck, current: location.pathname === '/deliveries' }] : []),
  ];

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/login');
  };

  return (
    <div className="h-screen flex overflow-hidden bg-gray-100">
      {/* Mobile sidebar */}
      <div className={`fixed inset-0 flex z-40 md:hidden ${sidebarOpen ? '' : 'hidden'}`}>
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)} />
        <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white">
          <div className="absolute top-0 right-0 -mr-12 pt-2">
            <button
              className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="h-6 w-6 text-white" />
            </button>
          </div>
          <SidebarContent navigation={navigation} />
        </div>
      </div>

      {/* Static sidebar for desktop */}
      <div className="hidden md:flex md:flex-shrink-0">
        <div className="flex flex-col w-64">
          <SidebarContent navigation={navigation} />
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-col w-0 flex-1 overflow-hidden">
        {/* Header */}
        <div className="relative z-10 flex-shrink-0 flex h-16 bg-white shadow">
          <button
            className="px-4 border-r border-gray-200 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500 md:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-6 w-6" />
          </button>
          
          <div className="flex-1 px-4 flex justify-between">
            <div className="flex-1 flex">
              <div className="w-full flex md:ml-0">
                <div className="relative w-full text-gray-400 focus-within:text-gray-600">
                  {/* You can add a search bar here if needed */}
                </div>
              </div>
            </div>
            
            <div className="ml-4 flex items-center md:ml-6 space-x-4">
              <div className="flex items-center space-x-2">
                <div className="bg-primary-600 p-2 rounded-full">
                  <User className="h-4 w-4 text-white" />
                </div>
                <div className="hidden md:block">
                  <div className="text-sm font-medium text-gray-900">{user?.firstName} {user?.lastName}</div>
                  <div className="text-xs text-gray-500 capitalize">{user?.role}</div>
                </div>
              </div>
              
              <button
                onClick={handleLogout}
                className="bg-gray-100 p-2 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="flex-1 relative overflow-y-auto focus:outline-none">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

const SidebarContent = ({ navigation }) => (
  <div className="flex flex-col h-0 flex-1">
    <div className="flex items-center h-16 flex-shrink-0 px-4 bg-primary-600">
      <Package className="h-8 w-8 text-white" />
      <span className="ml-2 text-xl font-semibold text-white">OrderMS</span>
    </div>
    <div className="flex-1 flex flex-col overflow-y-auto">
      <nav className="flex-1 px-2 py-4 bg-white space-y-1">
        {navigation.map((item) => (
          <Link
            key={item.name}
            to={item.href}
            className={`${
              item.current
                ? 'bg-primary-100 border-r-4 border-primary-600 text-primary-700'
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
            } group flex items-center px-2 py-2 text-sm font-medium rounded-md`}
          >
            <item.icon
              className={`${
                item.current ? 'text-primary-500' : 'text-gray-400 group-hover:text-gray-500'
              } mr-3 flex-shrink-0 h-6 w-6`}
            />
            {item.name}
          </Link>
        ))}
      </nav>
    </div>
  </div>
);

export default DashboardLayout;
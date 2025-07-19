import { format, parseISO } from 'date-fns';

// Format currency
export const formatCurrency = (amount, currency = 'USD') => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
  }).format(amount);
};

// Format date
export const formatDate = (date, formatStr = 'MMM dd, yyyy') => {
  if (!date) return '';
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return format(dateObj, formatStr);
};

// Format date and time
export const formatDateTime = (date) => {
  return formatDate(date, 'MMM dd, yyyy HH:mm');
};

// Get status badge class
export const getStatusBadgeClass = (status) => {
  const statusClasses = {
    // Order statuses
    pending: 'badge-warning',
    confirmed: 'badge-primary',
    processing: 'badge-primary',
    shipped: 'badge-primary',
    delivered: 'badge-success',
    cancelled: 'badge-danger',
    
    // Payment statuses
    paid: 'badge-success',
    failed: 'badge-danger',
    refunded: 'badge-gray',
    
    // Delivery statuses
    picked_up: 'badge-primary',
    in_transit: 'badge-primary',
    out_for_delivery: 'badge-warning',
    returned: 'badge-danger',
    
    // General
    active: 'badge-success',
    inactive: 'badge-gray',
    low_stock: 'badge-warning',
  };
  
  return statusClasses[status] || 'badge-gray';
};

// Capitalize first letter
export const capitalize = (str) => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
};

// Generate random ID
export const generateId = (prefix = '') => {
  const timestamp = Date.now().toString(36);
  const randomStr = Math.random().toString(36).substr(2, 5);
  return `${prefix}${timestamp}${randomStr}`;
};

// Debounce function
export const debounce = (func, delay) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(null, args), delay);
  };
};

// Deep clone object
export const deepClone = (obj) => {
  return JSON.parse(JSON.stringify(obj));
};

// Get membership color
export const getMembershipColor = (membership) => {
  const colors = {
    bronze: 'text-amber-600',
    silver: 'text-gray-600',
    gold: 'text-yellow-600',
    platinum: 'text-purple-600',
  };
  return colors[membership] || 'text-gray-600';
};

// Calculate order totals
export const calculateOrderTotals = (items, taxRate = 0.08, freeShippingThreshold = 100) => {
  const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const tax = subtotal * taxRate;
  const shipping = subtotal >= freeShippingThreshold ? 0 : 10;
  const total = subtotal + tax + shipping;
  
  return {
    subtotal: Number(subtotal.toFixed(2)),
    tax: Number(tax.toFixed(2)),
    shipping: Number(shipping.toFixed(2)),
    total: Number(total.toFixed(2)),
  };
};

// Validate email
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Validate phone number
export const isValidPhone = (phone) => {
  const phoneRegex = /^\+?[\d\s\-\(\)]+$/;
  return phoneRegex.test(phone) && phone.replace(/\D/g, '').length >= 10;
};

// Get order status steps
export const getOrderStatusSteps = (currentStatus) => {
  const allSteps = [
    { key: 'pending', label: 'Order Placed', completed: false },
    { key: 'confirmed', label: 'Confirmed', completed: false },
    { key: 'processing', label: 'Processing', completed: false },
    { key: 'shipped', label: 'Shipped', completed: false },
    { key: 'delivered', label: 'Delivered', completed: false },
  ];
  
  const statusOrder = ['pending', 'confirmed', 'processing', 'shipped', 'delivered'];
  const currentIndex = statusOrder.indexOf(currentStatus);
  
  return allSteps.map((step, index) => ({
    ...step,
    completed: index <= currentIndex,
    current: index === currentIndex,
  }));
};

// Format file size
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// Truncate text
export const truncateText = (text, maxLength = 50) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substr(0, maxLength) + '...';
};

// Get initials from name
export const getInitials = (name) => {
  if (!name) return '';
  return name
    .split(' ')
    .map(word => word.charAt(0).toUpperCase())
    .slice(0, 2)
    .join('');
};
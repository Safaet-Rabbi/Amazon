import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
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

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  getProfile: () => api.get('/auth/me'),
};

// Orders API
export const ordersAPI = {
  getOrders: (params) => api.get('/orders', { params }),
  getOrder: (id) => api.get(`/orders/${id}`),
  createOrder: (orderData) => api.post('/orders', orderData),
  updateOrderStatus: (id, status) => api.put(`/orders/${id}/status`, { status }),
  updateOrderItems: (id, items) => api.put(`/orders/${id}/items`, { items }),
  deleteOrder: (id) => api.delete(`/orders/${id}`),
  getCustomerOrders: (customerId, params) => api.get(`/orders/customer/${customerId}`, { params }),
  getProductCustomers: (productId) => api.get(`/orders/product/${productId}/customers`),
};

// Customers API
export const customersAPI = {
  getCustomers: (params) => api.get('/customers', { params }),
  getCustomer: (id) => api.get(`/customers/${id}`),
  createCustomer: (customerData) => api.post('/customers', customerData),
  updateCustomer: (id, customerData) => api.put(`/customers/${id}`, customerData),
  deleteCustomer: (id) => api.delete(`/customers/${id}`),
  getCustomerStats: () => api.get('/customers/stats'),
};

// Products API
export const productsAPI = {
  getProducts: (params) => api.get('/products', { params }),
  getProduct: (id) => api.get(`/products/${id}`),
  createProduct: (productData) => api.post('/products', productData),
  updateProduct: (id, productData) => api.put(`/products/${id}`, productData),
  deleteProduct: (id) => api.delete(`/products/${id}`),
  updateProductStock: (id, stockData) => api.put(`/products/${id}/stock`, stockData),
  getLowStockProducts: () => api.get('/products/admin/low-stock'),
  getProductCategories: () => api.get('/products/categories'),
  getProductStats: () => api.get('/products/admin/stats'),
};

// Deliveries API
export const deliveriesAPI = {
  getDeliveries: (params) => api.get('/deliveries', { params }),
  getDelivery: (identifier) => api.get(`/deliveries/${identifier}`),
  createDelivery: (deliveryData) => api.post('/deliveries', deliveryData),
  updateDelivery: (orderId, deliveryData) => api.put(`/deliveries/order/${orderId}`, deliveryData),
  updateDeliveryStatus: (orderId, statusData) => api.put(`/deliveries/order/${orderId}/status`, statusData),
  deleteDelivery: (orderId) => api.delete(`/deliveries/order/${orderId}`),
  trackDelivery: (trackingNumber) => api.get(`/deliveries/track/${trackingNumber}`),
  getDeliveryStats: () => api.get('/deliveries/stats'),
};

export default api;
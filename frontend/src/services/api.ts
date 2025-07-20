import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { 
  User, 
  Customer, 
  Product, 
  Order, 
  ApiResponse, 
  PaginatedResponse,
  OrderStats 
} from '../types';

class ApiService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Add request interceptor to include auth token
    this.api.interceptors.request.use(
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

    // Add response interceptor for error handling
    this.api.interceptors.response.use(
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
  }

  // Auth endpoints
  async login(email: string, password: string): Promise<AxiosResponse<any>> {
    return this.api.post('/auth/login', { email, password });
  }

  async register(name: string, email: string, password: string, role?: string): Promise<AxiosResponse<any>> {
    return this.api.post('/auth/register', { name, email, password, role });
  }

  async getCurrentUser(): Promise<AxiosResponse<{ user: User }>> {
    return this.api.get('/auth/me');
  }

  // Customer endpoints
  async getCustomers(params?: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
  }): Promise<AxiosResponse<PaginatedResponse<Customer>>> {
    return this.api.get('/customers', { params });
  }

  async getCustomer(id: string): Promise<AxiosResponse<Customer>> {
    return this.api.get(`/customers/${id}`);
  }

  async createCustomer(customerData: Partial<Customer>): Promise<AxiosResponse<ApiResponse<Customer>>> {
    return this.api.post('/customers', customerData);
  }

  async updateCustomer(id: string, customerData: Partial<Customer>): Promise<AxiosResponse<ApiResponse<Customer>>> {
    return this.api.put(`/customers/${id}`, customerData);
  }

  async deleteCustomer(id: string): Promise<AxiosResponse<ApiResponse<any>>> {
    return this.api.delete(`/customers/${id}`);
  }

  // Product endpoints
  async getProducts(params?: {
    page?: number;
    limit?: number;
    search?: string;
    category?: string;
    status?: string;
  }): Promise<AxiosResponse<PaginatedResponse<Product>>> {
    return this.api.get('/products', { params });
  }

  async getProduct(id: string): Promise<AxiosResponse<Product>> {
    return this.api.get(`/products/${id}`);
  }

  async createProduct(productData: Partial<Product>): Promise<AxiosResponse<ApiResponse<Product>>> {
    return this.api.post('/products', productData);
  }

  async updateProduct(id: string, productData: Partial<Product>): Promise<AxiosResponse<ApiResponse<Product>>> {
    return this.api.put(`/products/${id}`, productData);
  }

  async deleteProduct(id: string): Promise<AxiosResponse<ApiResponse<any>>> {
    return this.api.delete(`/products/${id}`);
  }

  async getCategories(): Promise<AxiosResponse<string[]>> {
    return this.api.get('/products/categories/list');
  }

  // Order endpoints
  async getOrders(params?: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
    paymentStatus?: string;
  }): Promise<AxiosResponse<PaginatedResponse<Order>>> {
    return this.api.get('/orders', { params });
  }

  async getOrder(id: string): Promise<AxiosResponse<Order>> {
    return this.api.get(`/orders/${id}`);
  }

  async createOrder(orderData: any): Promise<AxiosResponse<ApiResponse<Order>>> {
    return this.api.post('/orders', orderData);
  }

  async updateOrderStatus(id: string, status: string): Promise<AxiosResponse<ApiResponse<Order>>> {
    return this.api.put(`/orders/${id}/status`, { status });
  }

  async updatePaymentStatus(id: string, paymentStatus: string): Promise<AxiosResponse<ApiResponse<Order>>> {
    return this.api.put(`/orders/${id}/payment`, { paymentStatus });
  }

  async deleteOrder(id: string): Promise<AxiosResponse<ApiResponse<any>>> {
    return this.api.delete(`/orders/${id}`);
  }

  async getOrderStats(): Promise<AxiosResponse<OrderStats>> {
    return this.api.get('/orders/stats/summary');
  }
}

export default new ApiService();
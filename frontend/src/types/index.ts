export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'staff';
}

export interface Customer {
  _id: string;
  name: string;
  email: string;
  phone: string;
  address: {
    street?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
  };
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

export interface Product {
  _id: string;
  name: string;
  description?: string;
  price: number;
  category: string;
  stock: number;
  sku: string;
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  product: Product;
  quantity: number;
  price: number;
}

export interface Order {
  _id: string;
  orderNumber: string;
  customer: Customer;
  items: OrderItem[];
  subtotal: number;
  tax: number;
  total: number;
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ApiResponse<T> {
  message?: string;
  data?: T;
  error?: string;
}

export interface PaginatedResponse<T> {
  items?: T[];
  products?: T[];
  customers?: T[];
  orders?: T[];
  totalPages: number;
  currentPage: number;
  total: number;
}

export interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, role?: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

export interface OrderStats {
  totalOrders: number;
  pendingOrders: number;
  completedOrders: number;
  totalRevenue: number;
}
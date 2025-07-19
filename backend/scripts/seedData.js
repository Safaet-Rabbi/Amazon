import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';

// Load environment variables
dotenv.config();

// Import models
import User from '../models/User.js';
import Customer from '../models/Customer.js';
import Product from '../models/Product.js';
import Order from '../models/Order.js';
import Delivery from '../models/Delivery.js';

// Connect to MongoDB
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('Database connection failed:', error);
    process.exit(1);
  }
};

// Sample data
const users = [
  {
    username: 'admin',
    email: 'admin@orderms.com',
    password: 'admin123',
    firstName: 'Admin',
    lastName: 'User',
    role: 'admin'
  },
  {
    username: 'staff1',
    email: 'staff@orderms.com',
    password: 'staff123',
    firstName: 'Staff',
    lastName: 'Member',
    role: 'staff'
  },
  {
    username: 'customer1',
    email: 'customer@example.com',
    password: 'customer123',
    firstName: 'John',
    lastName: 'Doe',
    role: 'customer'
  }
];

const customers = [
  {
    _id: 'CUST001',
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+1-555-0101',
    address: {
      street: '123 Main St',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
      country: 'USA'
    },
    membership: 'gold',
    totalOrders: 0,
    totalSpent: 0
  },
  {
    _id: 'CUST002',
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    phone: '+1-555-0102',
    address: {
      street: '456 Oak Ave',
      city: 'Los Angeles',
      state: 'CA',
      zipCode: '90001',
      country: 'USA'
    },
    membership: 'silver',
    totalOrders: 0,
    totalSpent: 0
  },
  {
    _id: 'CUST003',
    name: 'Bob Johnson',
    email: 'bob.johnson@example.com',
    phone: '+1-555-0103',
    address: {
      street: '789 Pine Rd',
      city: 'Chicago',
      state: 'IL',
      zipCode: '60601',
      country: 'USA'
    },
    membership: 'bronze',
    totalOrders: 0,
    totalSpent: 0
  },
  {
    _id: 'CUST004',
    name: 'Alice Brown',
    email: 'alice.brown@example.com',
    phone: '+1-555-0104',
    address: {
      street: '321 Elm St',
      city: 'Houston',
      state: 'TX',
      zipCode: '77001',
      country: 'USA'
    },
    membership: 'platinum',
    totalOrders: 0,
    totalSpent: 0
  }
];

const products = [
  {
    _id: 'P001',
    name: 'Wireless Mouse',
    description: 'Ergonomic wireless mouse with USB receiver',
    price: 25.99,
    stock: 100,
    category: 'Electronics',
    brand: 'TechCorp',
    image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=300&h=300&fit=crop'
  },
  {
    _id: 'P002',
    name: 'Bluetooth Headphones',
    description: 'Noise-cancelling over-ear headphones',
    price: 89.99,
    stock: 50,
    category: 'Electronics',
    brand: 'AudioMax',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&h=300&fit=crop'
  },
  {
    _id: 'P003',
    name: 'USB-C Cable',
    description: 'High-speed USB-C charging cable 6ft',
    price: 12.99,
    stock: 200,
    category: 'Electronics',
    brand: 'CableCo',
    image: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=300&h=300&fit=crop'
  },
  {
    _id: 'P004',
    name: 'Laptop Stand',
    description: 'Adjustable aluminum laptop stand',
    price: 45.99,
    stock: 75,
    category: 'Accessories',
    brand: 'ErgoDesk',
    image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=300&h=300&fit=crop'
  },
  {
    _id: 'P005',
    name: 'Mechanical Keyboard',
    description: 'RGB backlit mechanical gaming keyboard',
    price: 129.99,
    stock: 30,
    category: 'Electronics',
    brand: 'GameTech',
    image: 'https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=300&h=300&fit=crop'
  },
  {
    _id: 'P006',
    name: 'Webcam HD',
    description: '1080p HD webcam with microphone',
    price: 59.99,
    stock: 40,
    category: 'Electronics',
    brand: 'VisionCam',
    image: 'https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?w=300&h=300&fit=crop'
  },
  {
    _id: 'P007',
    name: 'Desk Organizer',
    description: 'Bamboo desk organizer with compartments',
    price: 24.99,
    stock: 60,
    category: 'Office',
    brand: 'OrganizePro',
    image: 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=300&h=300&fit=crop'
  },
  {
    _id: 'P008',
    name: 'Power Bank',
    description: '10000mAh portable power bank',
    price: 34.99,
    stock: 80,
    category: 'Electronics',
    brand: 'PowerMax',
    image: 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=300&h=300&fit=crop'
  }
];

const orders = [
  {
    order_id: 'ORD001',
    customer_id: 'CUST001',
    customerName: 'John Doe',
    items: [
      {
        product_id: 'P001',
        productName: 'Wireless Mouse',
        quantity: 2,
        price: 25.99,
        total: 51.98
      },
      {
        product_id: 'P003',
        productName: 'USB-C Cable',
        quantity: 1,
        price: 12.99,
        total: 12.99
      }
    ],
    status: 'delivered',
    subtotal: 64.97,
    tax: 5.20,
    shipping: 0,
    total: 70.17,
    shippingAddress: {
      street: '123 Main St',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
      country: 'USA'
    },
    paymentMethod: 'credit_card',
    paymentStatus: 'paid',
    ordered_at: new Date('2024-01-15T10:30:00Z')
  },
  {
    order_id: 'ORD002',
    customer_id: 'CUST002',
    customerName: 'Jane Smith',
    items: [
      {
        product_id: 'P002',
        productName: 'Bluetooth Headphones',
        quantity: 1,
        price: 89.99,
        total: 89.99
      },
      {
        product_id: 'P004',
        productName: 'Laptop Stand',
        quantity: 1,
        price: 45.99,
        total: 45.99
      }
    ],
    status: 'shipped',
    subtotal: 135.98,
    tax: 10.88,
    shipping: 0,
    total: 146.86,
    shippingAddress: {
      street: '456 Oak Ave',
      city: 'Los Angeles',
      state: 'CA',
      zipCode: '90001',
      country: 'USA'
    },
    paymentMethod: 'paypal',
    paymentStatus: 'paid',
    ordered_at: new Date('2024-01-20T14:15:00Z')
  },
  {
    order_id: 'ORD003',
    customer_id: 'CUST003',
    customerName: 'Bob Johnson',
    items: [
      {
        product_id: 'P005',
        productName: 'Mechanical Keyboard',
        quantity: 1,
        price: 129.99,
        total: 129.99
      }
    ],
    status: 'processing',
    subtotal: 129.99,
    tax: 10.40,
    shipping: 0,
    total: 140.39,
    shippingAddress: {
      street: '789 Pine Rd',
      city: 'Chicago',
      state: 'IL',
      zipCode: '60601',
      country: 'USA'
    },
    paymentMethod: 'credit_card',
    paymentStatus: 'paid',
    ordered_at: new Date('2024-01-25T09:45:00Z')
  }
];

const deliveries = [
  {
    order_id: 'ORD001',
    tracking_number: 'TRK123456789',
    carrier: 'ups',
    shipping_method: 'standard',
    estimated_delivery: new Date('2024-01-18T17:00:00Z'),
    actual_delivery: new Date('2024-01-18T15:30:00Z'),
    delivered: true,
    delivery_status: 'delivered',
    delivery_address: {
      street: '123 Main St',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
      country: 'USA'
    },
    recipient_name: 'John Doe',
    date: new Date('2024-01-15T10:30:00Z')
  },
  {
    order_id: 'ORD002',
    tracking_number: 'TRK987654321',
    carrier: 'fedex',
    shipping_method: 'express',
    estimated_delivery: new Date('2024-01-23T17:00:00Z'),
    delivered: false,
    delivery_status: 'in_transit',
    delivery_address: {
      street: '456 Oak Ave',
      city: 'Los Angeles',
      state: 'CA',
      zipCode: '90001',
      country: 'USA'
    },
    recipient_name: 'Jane Smith',
    date: new Date('2024-01-20T14:15:00Z')
  }
];

const seedDatabase = async () => {
  try {
    console.log('🌱 Starting database seeding...');

    // Clear existing data
    await User.deleteMany({});
    await Customer.deleteMany({});
    await Product.deleteMany({});
    await Order.deleteMany({});
    await Delivery.deleteMany({});

    console.log('✅ Cleared existing data');

    // Create users
    for (const userData of users) {
      const salt = await bcrypt.genSalt(10);
      userData.password = await bcrypt.hash(userData.password, salt);
    }
    await User.insertMany(users);
    console.log('✅ Created users');

    // Create customers
    await Customer.insertMany(customers);
    console.log('✅ Created customers');

    // Create products
    await Product.insertMany(products);
    console.log('✅ Created products');

    // Create orders and update customer/product stats
    for (const orderData of orders) {
      await Order.create(orderData);
      
      // Update customer stats
      const customer = await Customer.findById(orderData.customer_id);
      customer.totalOrders += 1;
      customer.totalSpent += orderData.total;
      await customer.save();

      // Update product stock
      for (const item of orderData.items) {
        const product = await Product.findById(item.product_id);
        product.stock -= item.quantity;
        await product.save();
      }
    }
    console.log('✅ Created orders and updated stats');

    // Create deliveries
    await Delivery.insertMany(deliveries);
    console.log('✅ Created deliveries');

    console.log('🎉 Database seeding completed successfully!');
    console.log('\n📋 Sample Login Credentials:');
    console.log('Admin: admin@orderms.com / admin123');
    console.log('Staff: staff@orderms.com / staff123');
    console.log('Customer: customer@example.com / customer123');

  } catch (error) {
    console.error('❌ Seeding failed:', error);
  } finally {
    mongoose.connection.close();
  }
};

// Run seeding
connectDB().then(() => {
  seedDatabase();
});
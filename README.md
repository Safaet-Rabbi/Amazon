# Order Management System

A comprehensive MERN stack application for managing orders, customers, products, and deliveries with real-time tracking capabilities.

## 🚀 Features

### Core Functionality
- **Order Management**: Create, view, update, and delete orders with real-time status tracking
- **Customer Management**: Manage customer profiles with membership levels and order history
- **Product Management**: Inventory management with low stock alerts and categories
- **Delivery Tracking**: Real-time delivery status updates with tracking numbers
- **User Authentication**: JWT-based authentication with role-based access control

### User Roles
- **Admin**: Full access to all features and system management
- **Staff**: Access to orders, customers, products, and deliveries management
- **Customer**: View own orders and track deliveries

### UI Features
- **Responsive Design**: Modern, mobile-first design using Tailwind CSS
- **Real-time Updates**: Live order status and delivery tracking
- **Dashboard Analytics**: Comprehensive statistics and insights
- **Search & Filtering**: Advanced filtering capabilities across all modules
- **Toast Notifications**: User-friendly feedback system

## 🛠 Technology Stack

### Frontend
- **React 18** with Vite for fast development
- **React Router** for client-side routing
- **Tailwind CSS** for styling and responsive design
- **Lucide React** for modern icons
- **Axios** for API communication
- **React Toastify** for notifications
- **Date-fns** for date manipulation

### Backend
- **Node.js** with Express.js framework
- **MongoDB** with Mongoose ODM
- **JWT** for authentication
- **Bcrypt** for password hashing
- **CORS** for cross-origin requests
- **Dotenv** for environment configuration

## 📋 Prerequisites

- Node.js (v16 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn package manager

## 🚀 Installation & Setup

### 1. Clone the Repository
```bash
git clone <repository-url>
cd order-management-system
```

### 2. Backend Setup
```bash
cd backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Edit .env file with your configuration:
# NODE_ENV=development
# PORT=5000
# MONGODB_URI=mongodb://localhost:27017/order_management
# JWT_SECRET=your_jwt_secret_key_here_make_it_long_and_secure
# JWT_EXPIRE=30d

# Seed the database with sample data
npm run seed

# Start the backend server
npm run dev
```

### 3. Frontend Setup
```bash
cd ../order-management-system

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Edit .env file:
# VITE_API_URL=http://localhost:5000/api

# Start the frontend development server
npm run dev
```

## 🔐 Demo Credentials

The seeded database includes the following demo accounts:

- **Admin**: admin@orderms.com / admin123
- **Staff**: staff@orderms.com / staff123
- **Customer**: customer@example.com / customer123

## 📊 Database Schema

### Collections Overview

#### Users
- Authentication and role management
- Admin, Staff, and Customer roles

#### Customers
```javascript
{
  "_id": "CUST1001",
  "name": "John Doe",
  "email": "john@example.com",
  "membership": "gold",
  "totalOrders": 5,
  "totalSpent": 450.75
}
```

#### Products
```javascript
{
  "_id": "P123",
  "name": "Wireless Mouse",
  "price": 25.99,
  "stock": 100,
  "category": "Electronics",
  "lowStockThreshold": 10
}
```

#### Orders
```javascript
{
  "order_id": "ORD1001",
  "customer_id": "CUST1001",
  "items": [
    { "product_id": "P123", "quantity": 2, "price": 25.99 }
  ],
  "status": "shipped",
  "total": 70.17,
  "ordered_at": "2025-01-15T10:20:30Z"
}
```

#### Deliveries
```javascript
{
  "order_id": "ORD1001",
  "tracking_number": "TRK123456789",
  "delivered": true,
  "delivery_status": "delivered",
  "estimated_delivery": "2025-01-18T17:00:00Z"
}
```

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `GET /api/auth/me` - Get current user

### Orders
- `GET /api/orders` - Get all orders (with pagination & filters)
- `POST /api/orders` - Create new order
- `GET /api/orders/:id` - Get order details
- `PUT /api/orders/:id/status` - Update order status
- `DELETE /api/orders/:id` - Delete order

### Customers
- `GET /api/customers` - Get all customers
- `POST /api/customers` - Create customer
- `GET /api/customers/:id` - Get customer details
- `PUT /api/customers/:id` - Update customer
- `DELETE /api/customers/:id` - Delete customer

### Products
- `GET /api/products` - Get all products
- `POST /api/products` - Create product
- `PUT /api/products/:id` - Update product
- `PUT /api/products/:id/stock` - Update product stock

### Deliveries
- `GET /api/deliveries` - Get all deliveries
- `POST /api/deliveries` - Create delivery record
- `PUT /api/deliveries/order/:orderId/status` - Update delivery status
- `GET /api/deliveries/track/:trackingNumber` - Track delivery (public)

## 🎨 UI Components

### Key Features
- **Responsive Dashboard Layout** with collapsible sidebar
- **Modern Authentication Forms** with validation
- **Data Tables** with sorting, filtering, and pagination
- **Modal Dialogs** for forms and confirmations
- **Status Badges** with color coding
- **Loading States** and error handling
- **Toast Notifications** for user feedback

### Design System
- **Color Palette**: Professional blue and gray theme
- **Typography**: Clean, readable font stack
- **Spacing**: Consistent 4px grid system
- **Components**: Reusable, accessible components
- **Icons**: Lucide React icon library

## 🔒 Security Features

- **JWT Authentication** with secure token storage
- **Password Hashing** using bcrypt
- **Role-based Access Control** (RBAC)
- **Input Validation** on both frontend and backend
- **CORS Protection** for API endpoints
- **Environment Variables** for sensitive data

## 📱 Responsive Design

The application is fully responsive and works seamlessly on:
- **Desktop** (1200px+)
- **Tablet** (768px - 1199px)
- **Mobile** (320px - 767px)

## 🚀 Deployment

### Backend Deployment
1. Set up MongoDB Atlas or your preferred MongoDB hosting
2. Deploy to Heroku, Vercel, or your preferred platform
3. Set environment variables in production
4. Run database seeding if needed

### Frontend Deployment
1. Build the production version: `npm run build`
2. Deploy to Netlify, Vercel, or your preferred static hosting
3. Set the production API URL in environment variables

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Commit changes: `git commit -am 'Add new feature'`
4. Push to the branch: `git push origin feature/new-feature`
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🐛 Known Issues

- Registration is currently disabled in the demo
- Some advanced filtering features are placeholders
- Real-time updates require WebSocket implementation for production

## 🔮 Future Enhancements

- **WebSocket Integration** for real-time updates
- **Email Notifications** for order status changes
- **Advanced Analytics** with charts and reports
- **Inventory Forecasting** with AI/ML integration
- **Mobile App** using React Native
- **Multi-tenant Support** for multiple businesses
- **Advanced Search** with Elasticsearch integration

## 📞 Support

For support, please create an issue in the repository or contact the development team.

---

Built with ❤️ using the MERN stack
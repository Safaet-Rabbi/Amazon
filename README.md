# Order Management System - MERN Stack

A complete **Order Management System** built with the MERN stack (MongoDB, Express.js, React, Node.js) and styled with **Tailwind CSS**. This application is designed for beginners to understand full-stack development concepts.

## 🚀 Features

### Backend Features
- **User Authentication** with JWT tokens
- **Role-based Access Control** (Admin/Staff)
- **RESTful API** for all operations
- **MongoDB** integration with Mongoose ODM
- **Input validation** and error handling
- **Password hashing** with bcrypt
- **CORS** enabled for cross-origin requests

### Frontend Features
- **Modern React** with TypeScript
- **Responsive Design** with Tailwind CSS
- **Protected Routes** with authentication
- **Context API** for state management
- **Beautiful UI Components** with custom styling
- **Real-time Dashboard** with statistics
- **Form Validation** and error handling

### Core Functionality
- **Dashboard** with order statistics and quick actions
- **Order Management** - Create, view, update, and track orders
- **Product Management** - Add, edit, and manage inventory
- **Customer Management** - Maintain customer database
- **Inventory Tracking** - Real-time stock management
- **Order Status Tracking** - From pending to delivered
- **Payment Status Management** - Track payment states

## 📋 Prerequisites

Before running this application, make sure you have the following installed:

- **Node.js** (v14.0.0 or higher)
- **npm** (v6.0.0 or higher)
- **MongoDB** (v4.0.0 or higher)
- **Git**

## 🛠️ Installation & Setup

### 1. Clone the Repository
```bash
git clone <your-repository-url>
cd order-management-system
```

### 2. Install Dependencies
```bash
# Install root dependencies
npm install

# Install backend dependencies
npm run install-server

# Install frontend dependencies
npm run install-client
```

### 3. Environment Setup

Create a `.env` file in the `backend` directory:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/order_management
JWT_SECRET=your_jwt_secret_key_here_make_it_strong
NODE_ENV=development
```

### 4. Start MongoDB
Make sure MongoDB is running on your system:
```bash
# On macOS with Homebrew
brew services start mongodb-community

# On Ubuntu
sudo systemctl start mongod

# On Windows
net start MongoDB
```

### 5. Run the Application
```bash
# Run both frontend and backend concurrently
npm run dev

# Or run them separately:
# Backend only
npm run server

# Frontend only
npm run client
```

The application will be available at:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000

## 📁 Project Structure

```
order-management-system/
├── backend/                 # Express.js API
│   ├── middleware/         # Authentication middleware
│   ├── models/            # MongoDB models
│   ├── routes/            # API routes
│   ├── .env               # Environment variables
│   ├── package.json       # Backend dependencies
│   └── server.js          # Express server
├── frontend/              # React application
│   ├── public/           # Static files
│   ├── src/
│   │   ├── components/   # Reusable components
│   │   ├── context/      # React Context
│   │   ├── pages/        # Page components
│   │   ├── services/     # API services
│   │   ├── types/        # TypeScript types
│   │   └── App.tsx       # Main App component
│   ├── package.json      # Frontend dependencies
│   └── tailwind.config.js # Tailwind configuration
├── package.json          # Root package.json
└── README.md             # This file
```

## 🔐 Default User Accounts

After setting up the application, you can create accounts using the registration page. The first user created will have admin privileges.

**Default Admin Account** (create via registration):
- Email: admin@example.com
- Password: admin123
- Role: Admin

**Default Staff Account** (create via registration):
- Email: staff@example.com
- Password: staff123
- Role: Staff

## 📚 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### Customers
- `GET /api/customers` - Get all customers
- `GET /api/customers/:id` - Get single customer
- `POST /api/customers` - Create customer
- `PUT /api/customers/:id` - Update customer
- `DELETE /api/customers/:id` - Delete customer (Admin only)

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product (Admin only)
- `GET /api/products/categories/list` - Get product categories

### Orders
- `GET /api/orders` - Get all orders
- `GET /api/orders/:id` - Get single order
- `POST /api/orders` - Create order
- `PUT /api/orders/:id/status` - Update order status
- `PUT /api/orders/:id/payment` - Update payment status
- `DELETE /api/orders/:id` - Delete order (Admin only)
- `GET /api/orders/stats/summary` - Get order statistics

## 🎨 UI Components & Styling

The application uses **Tailwind CSS** with custom components:

### Button Classes
- `.btn-primary` - Primary blue button
- `.btn-secondary` - Secondary gray button
- `.btn-success` - Green success button
- `.btn-danger` - Red danger button

### Badge Classes
- `.badge-success` - Green status badge
- `.badge-warning` - Yellow warning badge
- `.badge-danger` - Red error badge
- `.badge-info` - Blue info badge

### Form Classes
- `.input` - Styled input fields
- `.card` - Container cards with shadow

## 🔧 Customization

### Adding New Features
1. **Backend**: Add new routes in `backend/routes/`
2. **Frontend**: Create new pages in `frontend/src/pages/`
3. **Models**: Add new MongoDB models in `backend/models/`
4. **Types**: Update TypeScript types in `frontend/src/types/`

### Styling Customization
1. Modify `frontend/tailwind.config.js` for theme changes
2. Update `frontend/src/index.css` for custom CSS classes
3. Colors and spacing can be adjusted in Tailwind config

## 🐛 Troubleshooting

### Common Issues

**MongoDB Connection Error**
```bash
# Make sure MongoDB is running
sudo systemctl status mongod

# Check MongoDB logs
tail -f /var/log/mongodb/mongod.log
```

**Port Already in Use**
```bash
# Kill process using port 5000
lsof -ti:5000 | xargs kill -9

# Kill process using port 3000
lsof -ti:3000 | xargs kill -9
```

**Dependencies Issues**
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

## 🚀 Deployment

### Backend Deployment (Heroku)
1. Create a Heroku app
2. Set environment variables in Heroku dashboard
3. Deploy using Git or GitHub integration

### Frontend Deployment (Netlify/Vercel)
1. Build the frontend: `npm run build`
2. Deploy the `build` folder
3. Set `REACT_APP_API_URL` to your backend URL

### Database (MongoDB Atlas)
1. Create a MongoDB Atlas cluster
2. Update `MONGODB_URI` in environment variables
3. Whitelist your deployment IP addresses

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -am 'Add feature'`
4. Push to branch: `git push origin feature-name`
5. Submit a Pull Request

## 📝 Learning Resources

This project demonstrates:
- **Full-stack development** with MERN stack
- **RESTful API** design and implementation
- **JWT Authentication** and authorization
- **React Hooks** and Context API
- **TypeScript** with React
- **Tailwind CSS** for styling
- **MongoDB** database design
- **Express.js** middleware and routing

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 💡 Next Steps

Potential enhancements for learning:
- Add email notifications
- Implement real-time updates with Socket.io
- Add data export functionality
- Integrate payment processing
- Add advanced reporting and analytics
- Implement file upload for product images
- Add search and filtering capabilities
- Create mobile responsive design improvements

---

**Happy Coding! 🎉**

For questions or support, please create an issue in the repository.
import express from 'express';
import {
  createOrder,
  getOrders,
  getOrder,
  updateOrderStatus,
  updateOrderItems,
  deleteOrder,
  getCustomerOrders,
  getProductCustomers
} from '../controllers/orderController.js';
import { protect, staffOrAdmin } from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication
router.use(protect);

// Order CRUD operations
router.route('/')
  .get(getOrders)
  .post(createOrder);

router.route('/:id')
  .get(getOrder)
  .delete(staffOrAdmin, deleteOrder);

// Order status and items management
router.put('/:id/status', staffOrAdmin, updateOrderStatus);
router.put('/:id/items', updateOrderItems);

// Customer and product relationship queries
router.get('/customer/:customerId', getCustomerOrders);
router.get('/product/:productId/customers', staffOrAdmin, getProductCustomers);

export default router;
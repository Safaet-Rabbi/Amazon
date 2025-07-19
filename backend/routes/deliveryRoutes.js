import express from 'express';
import {
  createDelivery,
  getDeliveries,
  getDelivery,
  updateDeliveryStatus,
  updateDelivery,
  trackDelivery,
  deleteDelivery,
  getDeliveryStats
} from '../controllers/deliveryController.js';
import { protect, staffOrAdmin } from '../middleware/auth.js';

const router = express.Router();

// Public tracking route
router.get('/track/:trackingNumber', trackDelivery);

// Protected routes
router.use(protect);

// Delivery CRUD operations
router.route('/')
  .get(staffOrAdmin, getDeliveries)
  .post(staffOrAdmin, createDelivery);

router.get('/stats', staffOrAdmin, getDeliveryStats);

// Delivery management by order ID
router.route('/order/:orderId')
  .put(staffOrAdmin, updateDelivery)
  .delete(staffOrAdmin, deleteDelivery);

router.put('/order/:orderId/status', staffOrAdmin, updateDeliveryStatus);

// Get delivery by order ID or tracking number
router.get('/:identifier', getDelivery);

export default router;
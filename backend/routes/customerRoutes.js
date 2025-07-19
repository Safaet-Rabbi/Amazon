import express from 'express';
import {
  createCustomer,
  getCustomers,
  getCustomer,
  updateCustomer,
  deleteCustomer,
  getCustomerStats
} from '../controllers/customerController.js';
import { protect, staffOrAdmin } from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication
router.use(protect);

// Customer CRUD operations
router.route('/')
  .get(getCustomers)
  .post(staffOrAdmin, createCustomer);

router.route('/stats')
  .get(staffOrAdmin, getCustomerStats);

router.route('/:id')
  .get(getCustomer)
  .put(staffOrAdmin, updateCustomer)
  .delete(staffOrAdmin, deleteCustomer);

export default router;
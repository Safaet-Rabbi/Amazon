import express from 'express';
import {
  createProduct,
  getProducts,
  getProduct,
  updateProduct,
  deleteProduct,
  updateProductStock,
  getLowStockProducts,
  getProductCategories,
  getProductStats
} from '../controllers/productController.js';
import { protect, staffOrAdmin } from '../middleware/auth.js';

const router = express.Router();

// Public routes (products can be viewed by anyone)
router.get('/', getProducts);
router.get('/categories', getProductCategories);
router.get('/:id', getProduct);

// Protected routes
router.use(protect);

// Staff/Admin only routes
router.post('/', staffOrAdmin, createProduct);
router.put('/:id', staffOrAdmin, updateProduct);
router.delete('/:id', staffOrAdmin, deleteProduct);
router.put('/:id/stock', staffOrAdmin, updateProductStock);
router.get('/admin/low-stock', staffOrAdmin, getLowStockProducts);
router.get('/admin/stats', staffOrAdmin, getProductStats);

export default router;
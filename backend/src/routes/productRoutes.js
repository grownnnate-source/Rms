import express from 'express';
import {
  getAllProducts,
  createProduct,
  updateProduct,
  toggleProductAvailability
} from '../controllers/productController.js';
import { protect, authorize } from '../middlewares/authMiddleware.js';

const router = express.Router();

// All staff can view menu products
router.get('/', protect, getAllProducts);

// Manager-only routes for catalog maintenance
router.post('/', protect, authorize('manager'), createProduct);
router.put('/:id', protect, authorize('manager'), updateProduct);
router.patch('/:id/availability', protect, authorize('manager'), toggleProductAvailability);

export default router;

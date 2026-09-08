import express from 'express';
import {
  getAllProducts,
  createProduct,
  updateProduct,
  toggleProductAvailability
} from '../controllers/productController.js';

const router = express.Router();

router.get('/', getAllProducts);
router.post('/', createProduct);
router.put('/:id', updateProduct);
router.patch('/:id/availability', toggleProductAvailability);

export default router;

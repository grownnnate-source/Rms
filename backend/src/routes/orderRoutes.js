import express from 'express';
import {
  createOrder,
  getOrders,
  getOrderById,
  updateOrderItems,
  updateOrderStatus
} from '../controllers/orderController.js';
import { protect, authorize } from '../middlewares/authMiddleware.js';

const router = express.Router();

// POST /api/orders -> Attendant or Manager creates an order
router.post('/', protect, authorize('attendant', 'manager'), createOrder);

// GET /api/orders -> All authenticated staff can view orders queue
router.get('/', protect, getOrders);

// GET /api/orders/:id -> View full details of a specific order
router.get('/:id', protect, getOrderById);

// PATCH /api/orders/:id/items -> Attendant adds extra scoops/toppings before payment
router.patch('/:id/items', protect, authorize('attendant', 'manager'), updateOrderItems);

// PATCH /api/orders/:id/status -> Cashier/Staff updates status (e.g. mark COMPLETED)
router.patch('/:id/status', protect, authorize('cashier', 'attendant', 'manager'), updateOrderStatus);

export default router;

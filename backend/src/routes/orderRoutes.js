import express from 'express';
import {
  createOrder,
  getOrders,
  getOrderById,
  updateOrderItems,
  updateOrderStatus
} from '../controllers/orderController.js';

const router = express.Router();

// POST /api/orders -> Attendant places a customer order
router.post('/', createOrder);

// GET /api/orders -> Cashier & Attendant view the active orders queue
router.get('/', getOrders);

// GET /api/orders/:id -> View full details of a specific order
router.get('/:id', getOrderById);

// PATCH /api/orders/:id/items -> Attendant adds extra scoops/toppings before payment
router.patch('/:id/items', updateOrderItems);

// PATCH /api/orders/:id/status -> Cashier marks order as COMPLETED after handing ice cream
router.patch('/:id/status', updateOrderStatus);

export default router;

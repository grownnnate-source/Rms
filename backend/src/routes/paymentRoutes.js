import express from 'express';
import {
  initializePayment,
  verifyPayment,
  processCashPayment,
  chapaWebhook
} from '../controllers/paymentController.js';
import { protect, authorize } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Initialize Chapa QR payment
router.post('/initialize/:orderId', protect, authorize('cashier', 'manager'), initializePayment);

// Verify Chapa payment status
router.get('/verify/:txRef', protect, authorize('cashier', 'manager'), verifyPayment);

// Process in-person Cash payment
router.post('/cash/:orderId', protect, authorize('cashier', 'manager'), processCashPayment);

// Chapa Webhook listener
router.post('/webhook', chapaWebhook);

export default router;

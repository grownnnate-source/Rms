import express from 'express';
import {
  getFinancialSummary,
  getBestSellers,
  getSalesTrend
} from '../controllers/analyticsController.js';
import { protect, authorize } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Manager-only routes for business analytics & financial reporting
router.get('/financial-summary', protect, authorize('manager'), getFinancialSummary);
router.get('/best-sellers', protect, authorize('manager'), getBestSellers);
router.get('/sales-trend', protect, authorize('manager'), getSalesTrend);

export default router;

import express from 'express';
import {
  getExpenses,
  createExpense,
  deleteExpense
} from '../controllers/expenseController.js';
import { protect, authorize } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Manager-only routes for operating expenses
router.get('/', protect, authorize('manager'), getExpenses);
router.post('/', protect, authorize('manager'), createExpense);
router.delete('/:id', protect, authorize('manager'), deleteExpense);

export default router;

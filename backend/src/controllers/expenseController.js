import Expense from '../models/Expense.js';

/**
 * @description Fetch all shop operating expenses with optional category and date filters
 * @route GET /api/expenses
 * @access Protected (Manager)
 */
export async function getExpenses(req, res) {
  try {
    const { category, startDate, endDate } = req.query;
    const filter = {};

    if (category) {
      filter.category = category;
    }

    if (startDate || endDate) {
      filter.date = {};
      if (startDate) filter.date.$gte = new Date(startDate);
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        filter.date.$lte = end;
      }
    }

    const expenses = await Expense.find(filter)
      .populate('recordedBy', 'name role')
      .sort({ date: -1 });

    const totalAmount = expenses.reduce((sum, e) => sum + e.amount, 0);

    res.status(200).json({
      success: true,
      count: expenses.length,
      totalAmount,
      expenses
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve expenses',
      error: error.message
    });
  }
}

/**
 * @description Log a new business expense (Manager only)
 * @route POST /api/expenses
 * @access Protected (Manager)
 */
export async function createExpense(req, res) {
  try {
    const { title, category, amount, date } = req.body;

    if (!title || !category || amount === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Title, category, and amount are required'
      });
    }

    const parsedAmount = Number(amount);
    if (isNaN(parsedAmount) || parsedAmount < 0) {
      return res.status(400).json({
        success: false,
        message: 'Amount must be a non-negative number'
      });
    }

    const expense = await Expense.create({
      title: title.trim(),
      category,
      amount: parsedAmount,
      date: date ? new Date(date) : new Date(),
      recordedBy: req.user._id
    });

    const populatedExpense = await Expense.findById(expense._id).populate('recordedBy', 'name role');

    res.status(201).json({
      success: true,
      message: 'Expense recorded successfully',
      expense: populatedExpense
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to create expense',
      error: error.message
    });
  }
}

/**
 * @description Delete an expense record (Manager only)
 * @route DELETE /api/expenses/:id
 * @access Protected (Manager)
 */
export async function deleteExpense(req, res) {
  try {
    const expense = await Expense.findByIdAndDelete(req.params.id);

    if (!expense) {
      return res.status(404).json({
        success: false,
        message: 'Expense not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Expense deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete expense',
      error: error.message
    });
  }
}

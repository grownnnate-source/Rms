import Order from '../models/Order.js';
import Expense from '../models/Expense.js';

/**
 * @description Get overall financial summary: Inflow, Outflow, Net Cash Flow, and Order counts
 * @route GET /api/analytics/financial-summary
 * @access Protected (Manager)
 */
export async function getFinancialSummary(req, res) {
  try {
    const { period = 'today' } = req.query;
    const now = new Date();
    let startDate = new Date();

    if (period === 'today') {
      startDate.setHours(0, 0, 0, 0);
    } else if (period === 'week') {
      startDate.setDate(now.getDate() - 7);
      startDate.setHours(0, 0, 0, 0);
    } else if (period === 'month') {
      startDate.setDate(now.getDate() - 30);
      startDate.setHours(0, 0, 0, 0);
    } else if (period === 'year') {
      startDate = new Date(now.getFullYear(), 0, 1);
    } else if (period === 'all') {
      startDate = new Date(0); // Unix epoch
    }

    // 1. Calculate Cash Inflow from completed/paid orders
    const orderAggregation = await Order.aggregate([
      {
        $match: {
          status: { $in: ['PAID', 'COMPLETED'] },
          createdAt: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: null,
          totalInflow: { $sum: '$totalAmount' },
          totalOrders: { $sum: 1 },
          itemsList: { $push: '$items' }
        }
      }
    ]);

    const totalInflow = orderAggregation[0]?.totalInflow || 0;
    const totalOrders = orderAggregation[0]?.totalOrders || 0;

    // Calculate total scoops / items sold
    let totalScoopsSold = 0;
    if (orderAggregation[0]?.itemsList) {
      orderAggregation[0].itemsList.flat().forEach((item) => {
        const scoops = Number(item.options?.scoops) || 1;
        const qty = Number(item.quantity) || 1;
        totalScoopsSold += scoops * qty;
      });
    }

    // 2. Calculate Cash Outflow from logged shop expenses
    const expenseAggregation = await Expense.aggregate([
      {
        $match: {
          date: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: null,
          totalOutflow: { $sum: '$amount' },
          expenseCount: { $sum: 1 }
        }
      }
    ]);

    const totalOutflow = expenseAggregation[0]?.totalOutflow || 0;

    // 3. Compute Net Cash Flow
    const netCashFlow = totalInflow - totalOutflow;

    res.status(200).json({
      success: true,
      period,
      summary: {
        totalInflow,
        totalOutflow,
        netCashFlow,
        totalOrders,
        totalScoopsSold,
        averageOrderValue: totalOrders > 0 ? Math.round(totalInflow / totalOrders) : 0
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to calculate financial summary',
      error: error.message
    });
  }
}

/**
 * @description Get ranked best-selling ice cream flavors and products
 * @route GET /api/analytics/best-sellers
 * @access Protected (Manager)
 */
export async function getBestSellers(req, res) {
  try {
    const bestSellers = await Order.aggregate([
      {
        $match: {
          status: { $in: ['PAID', 'COMPLETED'] }
        }
      },
      { $unwind: '$items' },
      {
        $group: {
          _id: '$items.name',
          totalQuantity: { $sum: '$items.quantity' },
          totalRevenue: { $sum: '$items.itemTotal' }
        }
      },
      { $sort: { totalQuantity: -1 } },
      { $limit: 10 },
      {
        $project: {
          _id: 0,
          name: '$_id',
          totalQuantity: 1,
          totalRevenue: 1
        }
      }
    ]);

    res.status(200).json({
      success: true,
      count: bestSellers.length,
      bestSellers
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve best sellers',
      error: error.message
    });
  }
}

/**
 * @description Daily sales and expense trend for the last 7 days
 * @route GET /api/analytics/sales-trend
 * @access Protected (Manager)
 */
export async function getSalesTrend(req, res) {
  try {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
    sevenDaysAgo.setHours(0, 0, 0, 0);

    const dailyOrders = await Order.aggregate([
      {
        $match: {
          status: { $in: ['PAID', 'COMPLETED'] },
          createdAt: { $gte: sevenDaysAgo }
        }
      },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          inflow: { $sum: '$totalAmount' },
          orders: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    const dailyExpenses = await Expense.aggregate([
      {
        $match: {
          date: { $gte: sevenDaysAgo }
        }
      },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$date' } },
          outflow: { $sum: '$amount' }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    res.status(200).json({
      success: true,
      trends: {
        dailyOrders,
        dailyExpenses
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to calculate sales trends',
      error: error.message
    });
  }
}

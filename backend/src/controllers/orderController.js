import Order from '../models/Order.js';

/**
 * Helper to generate sequential order numbers starting from #101
 */
async function generateNextOrderNumber() {
  const latestOrder = await Order.findOne().sort({ createdAt: -1 });
  if (!latestOrder || !latestOrder.orderNumber) {
    return '#101';
  }

  const match = latestOrder.orderNumber.match(/#(\d+)/);
  if (!match) {
    return '#101';
  }

  const nextSeq = parseInt(match[1], 10) + 1;
  return `#${nextSeq}`;
}

/**
 * @description Create a new customer order and broadcast to cashier via Socket.IO
 * @route POST /api/orders
 * @access Protected (Attendant, Manager)
 */
export async function createOrder(req, res) {
  try {
    const { items } = req.body;

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'An order must contain at least one item'
      });
    }

    // Calculate item totals and snapshot unit prices
    let totalAmount = 0;
    const formattedItems = items.map((item) => {
      const quantity = Number(item.quantity) || 1;
      const unitPrice = Number(item.unitPrice) || 0;
      const itemTotal = unitPrice * quantity;
      totalAmount += itemTotal;

      return {
        product: item.product,
        name: item.name,
        unitPrice,
        quantity,
        options: {
          scoops: item.options?.scoops || 1,
          flavor: item.options?.flavor || '',
          containerType: item.options?.containerType || 'Cup',
          cupSize: item.options?.cupSize || '',
          toppings: Array.isArray(item.options?.toppings) ? item.options.toppings : []
        },
        itemTotal
      };
    });

    const orderNumber = await generateNextOrderNumber();

    const newOrder = await Order.create({
      orderNumber,
      attendant: req.user._id,
      items: formattedItems,
      totalAmount,
      status: 'CREATED'
    });

    const populatedOrder = await Order.findById(newOrder._id)
      .populate('attendant', 'name role')
      .populate('payment');

    // Broadcast new order in real-time to Cashier terminal
    if (req.io) {
      req.io.emit('order:created', populatedOrder);
    }

    res.status(201).json({
      success: true,
      message: `Order ${orderNumber} created successfully`,
      order: populatedOrder
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to create order',
      error: error.message
    });
  }
}

/**
 * @description Retrieve active orders queue with optional status filtering
 * @route GET /api/orders
 * @access Protected (All Staff)
 */
export async function getOrders(req, res) {
  try {
    const { status, date } = req.query;
    const filter = {};

    if (status) {
      // Support comma-separated status filters, e.g. ?status=CREATED,PAYMENT_PENDING
      const statusList = status.split(',').map((s) => s.trim());
      filter.status = { $in: statusList };
    }

    if (date) {
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);

      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);

      filter.createdAt = { $gte: startOfDay, $lte: endOfDay };
    }

    const orders = await Order.find(filter)
      .populate('attendant', 'name role')
      .populate('payment')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: orders.length,
      orders
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve orders',
      error: error.message
    });
  }
}

/**
 * @description Fetch single order details by its unique ID
 * @route GET /api/orders/:id
 * @access Protected (All Staff)
 */
export async function getOrderById(req, res) {
  try {
    const order = await Order.findById(req.params.id)
      .populate('attendant', 'name role')
      .populate('payment');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    res.status(200).json({
      success: true,
      order
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve order details',
      error: error.message
    });
  }
}

/**
 * @description Update or append items to an unpaid order (Attendant only)
 * @route PATCH /api/orders/:id/items
 * @access Protected (Attendant, Manager)
 */
export async function updateOrderItems(req, res) {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Guard: Paid or completed orders cannot have their items changed
    if (['PAID', 'COMPLETED', 'CANCELLED'].includes(order.status)) {
      return res.status(400).json({
        success: false,
        message: `Cannot edit items: Order status is already '${order.status}'`
      });
    }

    const { items } = req.body;

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'An order must contain at least one item'
      });
    }

    let totalAmount = 0;
    const formattedItems = items.map((item) => {
      const quantity = Number(item.quantity) || 1;
      const unitPrice = Number(item.unitPrice) || 0;
      const itemTotal = unitPrice * quantity;
      totalAmount += itemTotal;

      return {
        product: item.product,
        name: item.name,
        unitPrice,
        quantity,
        options: {
          scoops: item.options?.scoops || 1,
          flavor: item.options?.flavor || '',
          containerType: item.options?.containerType || 'Cup',
          cupSize: item.options?.cupSize || '',
          toppings: Array.isArray(item.options?.toppings) ? item.options.toppings : []
        },
        itemTotal
      };
    });

    order.items = formattedItems;
    order.totalAmount = totalAmount;

    const updatedOrder = await order.save();
    const populatedOrder = await Order.findById(updatedOrder._id)
      .populate('attendant', 'name role')
      .populate('payment');

    if (req.io) {
      req.io.emit('order:updated', populatedOrder);
    }

    res.status(200).json({
      success: true,
      message: 'Order items updated successfully',
      order: populatedOrder
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update order items',
      error: error.message
    });
  }
}

/**
 * @description Update order status (e.g. mark COMPLETED after handing ice cream)
 * @route PATCH /api/orders/:id/status
 * @access Protected (Cashier, Attendant, Manager)
 */
export async function updateOrderStatus(req, res) {
  try {
    const { status } = req.body;
    const allowedStatuses = ['CREATED', 'PAYMENT_PENDING', 'PAID', 'COMPLETED', 'CANCELLED'];

    if (!status || !allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Allowed values: ${allowedStatuses.join(', ')}`
      });
    }

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    order.status = status;
    const savedOrder = await order.save();

    const populatedOrder = await Order.findById(savedOrder._id)
      .populate('attendant', 'name role')
      .populate('payment');

    // Broadcast status change to all connected staff terminals
    if (req.io) {
      req.io.emit('order:statusUpdated', {
        orderId: populatedOrder._id,
        orderNumber: populatedOrder.orderNumber,
        status: populatedOrder.status
      });
    }

    res.status(200).json({
      success: true,
      message: `Order status updated to ${status}`,
      order: populatedOrder
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update order status',
      error: error.message
    });
  }
}

import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
  // Reference to original product
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },

  name: {
    type: String,
    required: true
  },

  unitPrice: {
    type: Number,
    required: true,
    min: 0
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
    default: 1
  },

  options: {
    scoops: { type: Number, default: 1 },
    flavor: { type: String, default: '' },
    containerType: { type: String, enum: ['Cup', 'Cone', 'Other'], default: 'Cup' },
    cupSize: { type: String, enum: ['sm', 'md', 'L', 'XL', ''], default: '' },
    toppings: [{ type: String }]
  },

  itemTotal: {
    type: Number,
    required: true,
    min: 0
  }
});

const orderSchema = new mongoose.Schema(
  {
    // (e.g. '#101')
    orderNumber: {
      type: String,
      required: true,
      unique: true
    },
    // Staff member (Attendant) who created the order
    attendant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },

    items: [orderItemSchema], //1 to * relationship represenation.aingle order has many items(iceCreams)
    // Total order price in ETB
    totalAmount: {
      type: Number,
      required: true,
      min: 0
    },
    // Order lifecycle status
    status: {
      type: String,
      enum: ['CREATED', 'PAYMENT_PENDING', 'PAID', 'COMPLETED', 'CANCELLED'],
      default: 'CREATED'
    },
    // Reference to payment record once created
    payment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Payment'
    }
  },
  {
    timestamps: true
  }
);

// Mongoose creates the 'orders' collection in MongoDB
const Order = mongoose.model('Order', orderSchema);

export default Order;

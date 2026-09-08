import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema(
  {
    order: {
      type: mongoose.Schema.Types.ObjectId, //"Foreign Key" to another document(order) , returns default id by mongodb
      ref: 'Order', //specifies the collection from which the ObjectId is taken
      required: true
    },

    amount: {
      type: Number,
      required: true,
      min: 0
    },
    currency: {
      type: String,
      default: 'ETB'
    },
    provider: {
      type: String,
      default: 'chapa'
    },

    txRef: {
      type: String,
      required: true,
      unique: true
    },

    chapaReference: {
      type: String,
      default: ''
    },

    status: {
      type: String,
      enum: ['PENDING', 'SUCCESS', 'FAILED'],
      default: 'PENDING'
    },

    confirmedAt: {
      type: Date
    },

    rawResponse: {
      type: Object
    }
  },
  {
    timestamps: true
  }
);

// Mongoose creates the 'payments' collection in MongoDB
const Payment = mongoose.model('Payment', paymentSchema);

export default Payment;

import mongoose from 'mongoose';

const expenseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },

    category: {
      type: String,
      required: true,
      enum: ['Ingredients', 'Supplies', 'Utilities', 'Maintenance', 'Other']
    },

    amount: {
      type: Number,
      required: true,
      min: 0
    },

    date: {
      type: Date,
      default: Date.now
    },

    recordedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  },
  {
    timestamps: true
  }
);

// Mongoose creates the 'expenses' collection in MongoDB
const Expense = mongoose.model('Expense', expenseSchema);

export default Expense;

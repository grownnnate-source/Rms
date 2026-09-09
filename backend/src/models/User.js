import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    // Staff member's display name (e.g., 'Abebe Tadesse')
    name: {
      type: String,
      required: true,
      trim: true
    },

    role: {
      type: String,
      required: true,
      enum: ['attendant', 'cashier', 'manager']
    },
    // Unique 4-digit PIN
    pin: {
      type: String,
      required: true,
      unique: true,
      maxlength: 4
    },
    // Allows manager to disable staff access without deleting history
    isActive: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

// Method: Compares user entered PIN against stored PIN
userSchema.methods.matchPin = function (enteredPin) {
  return enteredPin === this.pin;
};

// Mongoose creates the 'users' collection in MongoDB
const User = mongoose.model('User', userSchema);

export default User;

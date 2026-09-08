import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    // Staff member's display name (e.g., 'Sarah Jenkins')
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
    // Unique 4-digit PIN (stored as bcrypt hash, never plaintext)
    pin: {
      type: String,
      required: true,
      unique: true
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

// Pre-save hook: Hashes PIN with bcrypt before saving to MongoDB
userSchema.pre('save', async function (next) {
  if (!this.isModified('pin')) return next();
  this.pin = await bcrypt.hash(this.pin, 10);
  next();
});

// Method: Compares user entered PIN against the hashed PIN in DB
userSchema.methods.matchPin = async function (enteredPin) {
  return await bcrypt.compare(enteredPin, this.pin);
};

// Mongoose creates the 'users' collection in MongoDB
const User = mongoose.model('User', userSchema);

export default User;

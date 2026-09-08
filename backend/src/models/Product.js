import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    // (e.g., 'Belgian Chocolate Scoop', 'Waffle Cone')
    name: {
      type: String,
      required: true,
      trim: true
    },

    category: {
      type: String,
      required: true,
      enum: ['Ice Cream', 'Toppings', 'Cones', 'Cups']
    },

    description: {
      type: String,
      default: ''
    },

    price: {
      type: Number,
      default: 0,
      min: 0
    },

    // Optional size-based pricing for items with size variants (e.g., Cups)
    sizes: [
      {
        size: {
          type: String,
          enum: ['sm', 'md', 'L', 'XL']
        },
        price: {
          type: Number,
          required: true,
          min: 0
        }
      }
    ],

    image: {
      type: String,
      default: ''
    },
    // Toggle false when out of stock so attendants cannot select it
    isAvailable: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true // Automatically creates createdAt and updatedAt
  }
);

const Product = mongoose.model('Product', productSchema);

export default Product;

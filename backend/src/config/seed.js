/**
 * @file seed.js
 * @description Database seeder script.
 * Populates MongoDB Atlas with initial staff accounts and ice cream shop menu items.
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from '../models/Product.js';
import User from '../models/User.js';

dotenv.config();

const staffUsers = [
  {
    name: 'Abebe Tadesse',
    role: 'attendant',
    pin: '1111',
    isActive: true
  },
  {
    name: 'Sara Hailu',
    role: 'cashier',
    pin: '2222',
    isActive: true
  },
  {
    name: 'Dawit Bekele',
    role: 'manager',
    pin: '9999',
    isActive: true
  }
];

const initialProducts = [
  // 1. Ice Cream Flavors (Market avg in Addis Ababa: 250 - 280 ETB per scoop)
  {
    name: 'Vanilla Bean',
    category: 'Ice Cream',
    description: 'Classic rich and creamy Madagascar vanilla bean ice cream',
    price: 250,
    isAvailable: true,
    sizes: []
  },
  {
    name: 'Belgian Dark Chocolate',
    category: 'Ice Cream',
    description: 'Deep, decadent chocolate crafted with premium Belgian cocoa',
    price: 280,
    isAvailable: true,
    sizes: []
  },
  {
    name: 'Strawberry Swirl',
    category: 'Ice Cream',
    description: 'Refreshing sweet cream swirled with real sun-ripened strawberry puree',
    price: 250,
    isAvailable: true,
    sizes: []
  },
  {
    name: 'Mango Passionfruit',
    category: 'Ice Cream',
    description: 'Tropical blend of ripe Ethiopian mangoes and tangy passionfruit',
    price: 260,
    isAvailable: true,
    sizes: []
  },
  {
    name: 'Mint Chocolate Chip',
    category: 'Ice Cream',
    description: 'Cool garden mint infused ice cream studded with dark chocolate flakes',
    price: 270,
    isAvailable: true,
    sizes: []
  },
  {
    name: 'Salted Caramel',
    category: 'Ice Cream',
    description: 'Golden buttery caramel blended with sea salt and sweet cream',
    price: 280,
    isAvailable: true,
    sizes: []
  },

  // 2. Cups with Size-Based Pricing (Variant Pattern)
  {
    name: 'Ice Cream Paper Cup',
    category: 'Cups',
    description: 'Eco-friendly insulated paper cup with your choice of size',
    price: 0,
    sizes: [
      { size: 'sm', price: 20 },
      { size: 'md', price: 35 },
      { size: 'L', price: 50 },
      { size: 'XL', price: 70 }
    ],
    isAvailable: true
  },

  // 3. Cones (Included free / 0 ETB)
  {
    name: 'Regular Waffle Cone',
    category: 'Cones',
    description: 'Freshly baked, crunchy golden waffle cone (Included free)',
    price: 0,
    sizes: [],
    isAvailable: true
  },

  // 4. Toppings (40 ETB each)
  {
    name: 'Crushed Oreo',
    category: 'Toppings',
    description: 'Crunchy chocolate cookie crumbs with cream filling',
    price: 40,
    sizes: [],
    isAvailable: true
  },
  {
    name: 'Rainbow Sprinkles',
    category: 'Toppings',
    description: 'Vibrant festive sugar sprinkles',
    price: 40,
    sizes: [],
    isAvailable: true
  },
  {
    name: 'Chocolate Chips',
    category: 'Toppings',
    description: 'Semi-sweet dark chocolate morsels',
    price: 40,
    sizes: [],
    isAvailable: true
  },
  {
    name: 'Crushed M&Ms',
    category: 'Toppings',
    description: 'Crispy colorful candy-coated chocolate gems',
    price: 40,
    sizes: [],
    isAvailable: true
  },
  {
    name: 'Crushed Peanuts',
    category: 'Toppings',
    description: 'Roasted and lightly salted crushed peanuts',
    price: 40,
    sizes: [],
    isAvailable: true
  }
];

async function seedDatabase() {
  try {
    console.log('🍃 Connecting to MongoDB Atlas...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB Atlas');

    // 1. Clear existing products and staff
    console.log('🧹 Clearing previous products and users...');
    await Product.deleteMany({});
    await User.deleteMany({});

    // 2. Insert staff accounts (triggers bcrypt pre-save hook for PIN hashing)
    console.log('👤 Seeding Staff Users...');
    for (const staff of staffUsers) {
      await User.create(staff);
    }
    console.log(`✅ Seeded ${staffUsers.length} staff members (Abebe: 1111, Sara: 2222, Dawit: 9999)`);

    // 3. Insert products
    console.log('🍦 Seeding Products Catalog...');
    await Product.insertMany(initialProducts);
    console.log(`✅ Seeded ${initialProducts.length} menu items with real images & prices`);

    console.log('\n🎉 DATABASE SEEDING COMPLETED SUCCESSFULLY!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding Error:', error);
    process.exit(1);
  }
}

seedDatabase();

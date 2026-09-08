import Product from '../models/Product.js';

/**
 * @description Fetch all products with optional category and availability filters
 * @route GET /api/products
 * @access Protected / Public
 */
export async function getAllProducts(req, res) {
  try {
    const { category, availableOnly } = req.query;
    const filter = {};

    if (category) {
      filter.category = category;
    }

    if (availableOnly === 'true') {
      filter.isAvailable = true;
    }

    const products = await Product.find(filter).sort({ category: 1, name: 1 });

    res.status(200).json({
      success: true,
      count: products.length,
      products
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve products',
      error: error.message
    });
  }
}

/**
 * @description Create a new product in the catalog (Manager only)
 * @route POST /api/products
 * @access Protected (Manager)
 */
export async function createProduct(req, res) {
  try {
    const { name, category, description, price, sizes, isAvailable } = req.body;

    if (!name || !category) {
      return res.status(400).json({
        success: false,
        message: 'Product name and category are required'
      });
    }

    const newProduct = await Product.create({
      name,
      category,
      description: description || '',
      price: price !== undefined ? price : 0,
      sizes: Array.isArray(sizes) ? sizes : [],
      isAvailable: isAvailable !== undefined ? isAvailable : true
    });

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      product: newProduct
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to create product',
      error: error.message
    });
  }
}

/**
 * @description Update an existing product's details and pricing (Manager only)
 * @route PUT /api/products/:id
 * @access Protected (Manager)
 */
export async function updateProduct(req, res) {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    const { name, category, description, price, sizes, isAvailable } = req.body;

    if (name !== undefined) product.name = name;
    if (category !== undefined) product.category = category;
    if (description !== undefined) product.description = description;
    if (price !== undefined) product.price = price;
    if (sizes !== undefined) product.sizes = sizes;
    if (isAvailable !== undefined) product.isAvailable = isAvailable;

    const updatedProduct = await product.save();

    res.status(200).json({
      success: true,
      message: 'Product updated successfully',
      product: updatedProduct
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update product',
      error: error.message
    });
  }
}

/**
 * @description Toggle product availability between available and unavailable (Manager only)
 * @route PATCH /api/products/:id/availability
 * @access Protected (Manager)
 */
export async function toggleProductAvailability(req, res) {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    product.isAvailable =
      req.body.isAvailable !== undefined ? Boolean(req.body.isAvailable) : !product.isAvailable;

    await product.save();

    // Broadcast live stock status change to connected POS tablets
    if (req.io) {
      req.io.emit('product:availabilityChanged', {
        productId: product._id,
        name: product.name,
        isAvailable: product.isAvailable
      });
    }

    res.status(200).json({
      success: true,
      message: `Product marked as ${product.isAvailable ? 'available' : 'unavailable'}`,
      product
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to toggle product availability',
      error: error.message
    });
  }
}

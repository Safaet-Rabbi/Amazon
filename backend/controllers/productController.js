import Product from '../models/Product.js';

// Generate unique product ID
const generateProductId = () => {
  const timestamp = Date.now().toString().slice(-6);
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `P${timestamp}${random}`;
};

// Create new product
export const createProduct = async (req, res) => {
  try {
    const { name, description, price, stock, category, brand, image, lowStockThreshold } = req.body;

    const product = await Product.create({
      _id: generateProductId(),
      name,
      description,
      price,
      stock,
      category,
      brand,
      image,
      lowStockThreshold: lowStockThreshold || 10
    });

    res.status(201).json({
      success: true,
      data: product
    });
  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({ message: 'Server error creating product' });
  }
};

// Get all products with filtering and pagination
export const getProducts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Build filter object
    const filter = { isActive: true };
    
    if (req.query.category) filter.category = req.query.category;
    if (req.query.brand) filter.brand = req.query.brand;
    if (req.query.low_stock === 'true') {
      filter.$expr = { $lte: ['$stock', '$lowStockThreshold'] };
    }
    
    // Price range filter
    if (req.query.min_price || req.query.max_price) {
      filter.price = {};
      if (req.query.min_price) filter.price.$gte = parseFloat(req.query.min_price);
      if (req.query.max_price) filter.price.$lte = parseFloat(req.query.max_price);
    }

    // Search filter
    if (req.query.search) {
      filter.$text = { $search: req.query.search };
    }

    // Sort options
    let sort = { createdAt: -1 };
    if (req.query.sort) {
      switch (req.query.sort) {
        case 'price_asc':
          sort = { price: 1 };
          break;
        case 'price_desc':
          sort = { price: -1 };
          break;
        case 'name_asc':
          sort = { name: 1 };
          break;
        case 'name_desc':
          sort = { name: -1 };
          break;
        case 'stock_asc':
          sort = { stock: 1 };
          break;
        case 'stock_desc':
          sort = { stock: -1 };
          break;
      }
    }

    const products = await Product.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(limit);

    const total = await Product.countDocuments(filter);

    res.json({
      success: true,
      data: products,
      pagination: {
        current: page,
        pages: Math.ceil(total / limit),
        total
      }
    });
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({ message: 'Server error fetching products' });
  }
};

// Get single product
export const getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json({
      success: true,
      data: product
    });
  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({ message: 'Server error fetching product' });
  }
};

// Update product
export const updateProduct = async (req, res) => {
  try {
    const { name, description, price, stock, category, brand, image, isActive, lowStockThreshold } = req.body;

    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      {
        ...(name && { name }),
        ...(description !== undefined && { description }),
        ...(price !== undefined && { price }),
        ...(stock !== undefined && { stock }),
        ...(category && { category }),
        ...(brand !== undefined && { brand }),
        ...(image && { image }),
        ...(isActive !== undefined && { isActive }),
        ...(lowStockThreshold !== undefined && { lowStockThreshold })
      },
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      data: updatedProduct
    });
  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({ message: 'Server error updating product' });
  }
};

// Delete product (soft delete by setting isActive to false)
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Soft delete - just mark as inactive
    product.isActive = false;
    await product.save();

    res.json({
      success: true,
      message: 'Product deactivated successfully'
    });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({ message: 'Server error deleting product' });
  }
};

// Update product stock
export const updateProductStock = async (req, res) => {
  try {
    const { stock, operation } = req.body; // operation: 'set', 'add', 'subtract'

    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    let newStock;
    switch (operation) {
      case 'add':
        newStock = product.stock + stock;
        break;
      case 'subtract':
        newStock = Math.max(0, product.stock - stock);
        break;
      case 'set':
      default:
        newStock = stock;
        break;
    }

    product.stock = newStock;
    await product.save();

    res.json({
      success: true,
      data: product
    });
  } catch (error) {
    console.error('Update product stock error:', error);
    res.status(500).json({ message: 'Server error updating product stock' });
  }
};

// Get low stock products
export const getLowStockProducts = async (req, res) => {
  try {
    const products = await Product.find({
      isActive: true,
      $expr: { $lte: ['$stock', '$lowStockThreshold'] }
    }).sort({ stock: 1 });

    res.json({
      success: true,
      data: products
    });
  } catch (error) {
    console.error('Get low stock products error:', error);
    res.status(500).json({ message: 'Server error fetching low stock products' });
  }
};

// Get product categories
export const getProductCategories = async (req, res) => {
  try {
    const categories = await Product.distinct('category', { isActive: true });
    
    res.json({
      success: true,
      data: categories
    });
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({ message: 'Server error fetching categories' });
  }
};

// Get product statistics
export const getProductStats = async (req, res) => {
  try {
    const stats = await Product.aggregate([
      { $match: { isActive: true } },
      {
        $group: {
          _id: null,
          totalProducts: { $sum: 1 },
          totalStock: { $sum: '$stock' },
          avgPrice: { $avg: '$price' },
          lowStockCount: {
            $sum: {
              $cond: [{ $lte: ['$stock', '$lowStockThreshold'] }, 1, 0]
            }
          }
        }
      }
    ]);

    const categoryStats = await Product.aggregate([
      { $match: { isActive: true } },
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
          totalStock: { $sum: '$stock' },
          avgPrice: { $avg: '$price' }
        }
      }
    ]);

    res.json({
      success: true,
      data: {
        overview: stats[0] || {},
        categoryBreakdown: categoryStats
      }
    });
  } catch (error) {
    console.error('Get product stats error:', error);
    res.status(500).json({ message: 'Server error fetching product statistics' });
  }
};
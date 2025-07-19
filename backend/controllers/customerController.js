import Customer from '../models/Customer.js';

// Generate unique customer ID
const generateCustomerId = () => {
  const timestamp = Date.now().toString().slice(-6);
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `CUST${timestamp}${random}`;
};

// Create new customer
export const createCustomer = async (req, res) => {
  try {
    const { name, email, phone, address, membership } = req.body;

    // Check if customer with email already exists
    const existingCustomer = await Customer.findOne({ email });
    if (existingCustomer) {
      return res.status(400).json({ 
        message: 'Customer with this email already exists' 
      });
    }

    const customer = await Customer.create({
      _id: generateCustomerId(),
      name,
      email,
      phone,
      address,
      membership: membership || 'bronze'
    });

    res.status(201).json({
      success: true,
      data: customer
    });
  } catch (error) {
    console.error('Create customer error:', error);
    res.status(500).json({ message: 'Server error creating customer' });
  }
};

// Get all customers with filtering and pagination
export const getCustomers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Build filter object
    const filter = {};
    if (req.query.membership) filter.membership = req.query.membership;
    if (req.query.search) {
      filter.$or = [
        { name: { $regex: req.query.search, $options: 'i' } },
        { email: { $regex: req.query.search, $options: 'i' } }
      ];
    }

    const customers = await Customer.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Customer.countDocuments(filter);

    res.json({
      success: true,
      data: customers,
      pagination: {
        current: page,
        pages: Math.ceil(total / limit),
        total
      }
    });
  } catch (error) {
    console.error('Get customers error:', error);
    res.status(500).json({ message: 'Server error fetching customers' });
  }
};

// Get single customer
export const getCustomer = async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);
    
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    res.json({
      success: true,
      data: customer
    });
  } catch (error) {
    console.error('Get customer error:', error);
    res.status(500).json({ message: 'Server error fetching customer' });
  }
};

// Update customer
export const updateCustomer = async (req, res) => {
  try {
    const { name, email, phone, address, membership } = req.body;

    const customer = await Customer.findById(req.params.id);
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    // Check if email is being changed and if it's already taken
    if (email && email !== customer.email) {
      const existingCustomer = await Customer.findOne({ email });
      if (existingCustomer) {
        return res.status(400).json({ 
          message: 'Email already taken by another customer' 
        });
      }
    }

    const updatedCustomer = await Customer.findByIdAndUpdate(
      req.params.id,
      {
        ...(name && { name }),
        ...(email && { email }),
        ...(phone && { phone }),
        ...(address && { address }),
        ...(membership && { membership })
      },
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      data: updatedCustomer
    });
  } catch (error) {
    console.error('Update customer error:', error);
    res.status(500).json({ message: 'Server error updating customer' });
  }
};

// Delete customer
export const deleteCustomer = async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    // Check if customer has orders
    const Order = (await import('../models/Order.js')).default;
    const orderCount = await Order.countDocuments({ customer_id: req.params.id });
    
    if (orderCount > 0) {
      return res.status(400).json({ 
        message: `Cannot delete customer with ${orderCount} existing orders` 
      });
    }

    await Customer.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Customer deleted successfully'
    });
  } catch (error) {
    console.error('Delete customer error:', error);
    res.status(500).json({ message: 'Server error deleting customer' });
  }
};

// Get customer statistics
export const getCustomerStats = async (req, res) => {
  try {
    const stats = await Customer.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          totalSpent: { $sum: '$totalSpent' },
          totalOrders: { $sum: '$totalOrders' },
          avgOrdersPerCustomer: { $avg: '$totalOrders' },
          avgSpentPerCustomer: { $avg: '$totalSpent' }
        }
      }
    ]);

    const membershipStats = await Customer.aggregate([
      {
        $group: {
          _id: '$membership',
          count: { $sum: 1 },
          totalSpent: { $sum: '$totalSpent' }
        }
      }
    ]);

    res.json({
      success: true,
      data: {
        overview: stats[0] || {},
        membershipBreakdown: membershipStats
      }
    });
  } catch (error) {
    console.error('Get customer stats error:', error);
    res.status(500).json({ message: 'Server error fetching customer statistics' });
  }
};
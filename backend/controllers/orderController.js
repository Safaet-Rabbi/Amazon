import Order from '../models/Order.js';
import Product from '../models/Product.js';
import Customer from '../models/Customer.js';
import Delivery from '../models/Delivery.js';

// Generate unique order ID
const generateOrderId = () => {
  const timestamp = Date.now().toString().slice(-6);
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `ORD${timestamp}${random}`;
};

// Create new order
export const createOrder = async (req, res) => {
  try {
    const { customer_id, items, shippingAddress, paymentMethod, notes } = req.body;

    // Validate customer exists
    const customer = await Customer.findById(customer_id);
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    // Validate and calculate order totals
    let subtotal = 0;
    const orderItems = [];

    for (const item of items) {
      const product = await Product.findById(item.product_id);
      if (!product) {
        return res.status(404).json({ 
          message: `Product ${item.product_id} not found` 
        });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({ 
          message: `Insufficient stock for ${product.name}. Available: ${product.stock}` 
        });
      }

      const itemTotal = product.price * item.quantity;
      subtotal += itemTotal;

      orderItems.push({
        product_id: product._id,
        productName: product.name,
        quantity: item.quantity,
        price: product.price,
        total: itemTotal
      });

      // Update product stock
      product.stock -= item.quantity;
      await product.save();
    }

    // Calculate totals
    const tax = subtotal * 0.08; // 8% tax
    const shipping = subtotal > 100 ? 0 : 10; // Free shipping over $100
    const total = subtotal + tax + shipping;

    // Create order
    const order = await Order.create({
      order_id: generateOrderId(),
      customer_id,
      customerName: customer.name,
      items: orderItems,
      subtotal,
      tax,
      shipping,
      total,
      shippingAddress,
      paymentMethod,
      notes
    });

    // Update customer stats
    customer.totalOrders += 1;
    customer.totalSpent += total;
    await customer.save();

    res.status(201).json({
      success: true,
      data: order
    });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({ message: 'Server error creating order' });
  }
};

// Get all orders with filtering and pagination
export const getOrders = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Build filter object
    const filter = {};
    if (req.query.status) filter.status = req.query.status;
    if (req.query.customer_id) filter.customer_id = req.query.customer_id;
    if (req.query.payment_status) filter.paymentStatus = req.query.payment_status;

    // Date range filter
    if (req.query.start_date || req.query.end_date) {
      filter.ordered_at = {};
      if (req.query.start_date) {
        filter.ordered_at.$gte = new Date(req.query.start_date);
      }
      if (req.query.end_date) {
        filter.ordered_at.$lte = new Date(req.query.end_date);
      }
    }

    const orders = await Order.find(filter)
      .sort({ ordered_at: -1 })
      .skip(skip)
      .limit(limit)
      .populate('customer_id', 'name email membership');

    const total = await Order.countDocuments(filter);

    res.json({
      success: true,
      data: orders,
      pagination: {
        current: page,
        pages: Math.ceil(total / limit),
        total
      }
    });
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({ message: 'Server error fetching orders' });
  }
};

// Get single order
export const getOrder = async (req, res) => {
  try {
    const order = await Order.findOne({ order_id: req.params.id })
      .populate('customer_id', 'name email phone address membership');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Get delivery info if exists
    const delivery = await Delivery.findOne({ order_id: order.order_id });

    res.json({
      success: true,
      data: {
        ...order.toObject(),
        delivery
      }
    });
  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({ message: 'Server error fetching order' });
  }
};

// Update order status
export const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    
    const order = await Order.findOne({ order_id: req.params.id });
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    order.status = status;
    await order.save();

    // Create or update delivery record for shipped orders
    if (status === 'shipped') {
      const existingDelivery = await Delivery.findOne({ order_id: order.order_id });
      
      if (!existingDelivery) {
        await Delivery.create({
          order_id: order.order_id,
          delivery_address: order.shippingAddress,
          recipient_name: order.customerName,
          estimated_delivery: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days
          delivery_status: 'in_transit'
        });
      }
    }

    res.json({
      success: true,
      data: order
    });
  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({ message: 'Server error updating order' });
  }
};

// Update order items quantity
export const updateOrderItems = async (req, res) => {
  try {
    const { items } = req.body;
    
    const order = await Order.findOne({ order_id: req.params.id });
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (order.status !== 'pending') {
      return res.status(400).json({ 
        message: 'Cannot modify items for non-pending orders' 
      });
    }

    // Restore original stock quantities
    for (const item of order.items) {
      const product = await Product.findById(item.product_id);
      if (product) {
        product.stock += item.quantity;
        await product.save();
      }
    }

    // Calculate new totals with updated items
    let subtotal = 0;
    const updatedItems = [];

    for (const item of items) {
      const product = await Product.findById(item.product_id);
      if (!product) {
        return res.status(404).json({ 
          message: `Product ${item.product_id} not found` 
        });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({ 
          message: `Insufficient stock for ${product.name}` 
        });
      }

      const itemTotal = product.price * item.quantity;
      subtotal += itemTotal;

      updatedItems.push({
        product_id: product._id,
        productName: product.name,
        quantity: item.quantity,
        price: product.price,
        total: itemTotal
      });

      // Update stock with new quantity
      product.stock -= item.quantity;
      await product.save();
    }

    // Update order
    const tax = subtotal * 0.08;
    const shipping = subtotal > 100 ? 0 : 10;
    const total = subtotal + tax + shipping;

    order.items = updatedItems;
    order.subtotal = subtotal;
    order.tax = tax;
    order.shipping = shipping;
    order.total = total;
    await order.save();

    res.json({
      success: true,
      data: order
    });
  } catch (error) {
    console.error('Update order items error:', error);
    res.status(500).json({ message: 'Server error updating order items' });
  }
};

// Delete/Cancel order
export const deleteOrder = async (req, res) => {
  try {
    const order = await Order.findOne({ order_id: req.params.id });
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (order.status === 'shipped' || order.status === 'delivered') {
      return res.status(400).json({ 
        message: 'Cannot delete shipped or delivered orders' 
      });
    }

    // Restore product stock
    for (const item of order.items) {
      const product = await Product.findById(item.product_id);
      if (product) {
        product.stock += item.quantity;
        await product.save();
      }
    }

    // Update customer stats
    const customer = await Customer.findById(order.customer_id);
    if (customer) {
      customer.totalOrders -= 1;
      customer.totalSpent -= order.total;
      await customer.save();
    }

    // Delete associated delivery record
    await Delivery.deleteOne({ order_id: order.order_id });

    // Delete order
    await Order.deleteOne({ order_id: req.params.id });

    res.json({
      success: true,
      message: 'Order deleted successfully'
    });
  } catch (error) {
    console.error('Delete order error:', error);
    res.status(500).json({ message: 'Server error deleting order' });
  }
};

// Get order history by customer
export const getCustomerOrders = async (req, res) => {
  try {
    const { customerId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const orders = await Order.find({ customer_id: customerId })
      .sort({ ordered_at: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Order.countDocuments({ customer_id: customerId });

    res.json({
      success: true,
      data: orders,
      pagination: {
        current: page,
        pages: Math.ceil(total / limit),
        total
      }
    });
  } catch (error) {
    console.error('Get customer orders error:', error);
    res.status(500).json({ message: 'Server error fetching customer orders' });
  }
};

// Get customers who ordered specific product
export const getProductCustomers = async (req, res) => {
  try {
    const { productId } = req.params;
    
    const orders = await Order.aggregate([
      { $match: { 'items.product_id': productId } },
      { $group: { 
        _id: '$customer_id',
        customerName: { $first: '$customerName' },
        totalOrders: { $sum: 1 },
        totalQuantity: { 
          $sum: {
            $sum: {
              $map: {
                input: '$items',
                as: 'item',
                in: {
                  $cond: [
                    { $eq: ['$$item.product_id', productId] },
                    '$$item.quantity',
                    0
                  ]
                }
              }
            }
          }
        }
      }},
      { $lookup: {
        from: 'customers',
        localField: '_id',
        foreignField: '_id',
        as: 'customer'
      }},
      { $unwind: '$customer' },
      { $project: {
        customerId: '$_id',
        customerName: '$customerName',
        email: '$customer.email',
        membership: '$customer.membership',
        totalOrders: 1,
        totalQuantity: 1
      }}
    ]);

    res.json({
      success: true,
      data: orders
    });
  } catch (error) {
    console.error('Get product customers error:', error);
    res.status(500).json({ message: 'Server error fetching product customers' });
  }
};
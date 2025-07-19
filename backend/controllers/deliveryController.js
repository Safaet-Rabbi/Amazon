import Delivery from '../models/Delivery.js';
import Order from '../models/Order.js';

// Generate unique tracking number
const generateTrackingNumber = () => {
  const timestamp = Date.now().toString().slice(-8);
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `TRK${timestamp}${random}`;
};

// Create delivery record
export const createDelivery = async (req, res) => {
  try {
    const { 
      order_id, 
      carrier, 
      shipping_method, 
      estimated_delivery, 
      delivery_address, 
      recipient_name,
      signature_required,
      delivery_notes
    } = req.body;

    // Check if order exists
    const order = await Order.findOne({ order_id });
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Check if delivery record already exists
    const existingDelivery = await Delivery.findOne({ order_id });
    if (existingDelivery) {
      return res.status(400).json({ 
        message: 'Delivery record already exists for this order' 
      });
    }

    const delivery = await Delivery.create({
      order_id,
      tracking_number: generateTrackingNumber(),
      carrier: carrier || 'local_delivery',
      shipping_method: shipping_method || 'standard',
      estimated_delivery: estimated_delivery || new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      delivery_address: delivery_address || order.shippingAddress,
      recipient_name: recipient_name || order.customerName,
      signature_required: signature_required || false,
      delivery_notes
    });

    res.status(201).json({
      success: true,
      data: delivery
    });
  } catch (error) {
    console.error('Create delivery error:', error);
    res.status(500).json({ message: 'Server error creating delivery record' });
  }
};

// Get all deliveries with filtering
export const getDeliveries = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Build filter object
    const filter = {};
    if (req.query.status) filter.delivery_status = req.query.status;
    if (req.query.carrier) filter.carrier = req.query.carrier;
    if (req.query.delivered !== undefined) filter.delivered = req.query.delivered === 'true';

    // Date range filter
    if (req.query.start_date || req.query.end_date) {
      filter.date = {};
      if (req.query.start_date) {
        filter.date.$gte = new Date(req.query.start_date);
      }
      if (req.query.end_date) {
        filter.date.$lte = new Date(req.query.end_date);
      }
    }

    const deliveries = await Delivery.find(filter)
      .sort({ date: -1 })
      .skip(skip)
      .limit(limit)
      .populate({
        path: 'order_id',
        select: 'customerName total status',
        model: 'Order',
        localField: 'order_id',
        foreignField: 'order_id'
      });

    const total = await Delivery.countDocuments(filter);

    res.json({
      success: true,
      data: deliveries,
      pagination: {
        current: page,
        pages: Math.ceil(total / limit),
        total
      }
    });
  } catch (error) {
    console.error('Get deliveries error:', error);
    res.status(500).json({ message: 'Server error fetching deliveries' });
  }
};

// Get single delivery by order ID or tracking number
export const getDelivery = async (req, res) => {
  try {
    const { identifier } = req.params; // Can be order_id or tracking_number
    
    let delivery = await Delivery.findOne({ order_id: identifier });
    
    if (!delivery) {
      delivery = await Delivery.findOne({ tracking_number: identifier });
    }

    if (!delivery) {
      return res.status(404).json({ message: 'Delivery record not found' });
    }

    // Get associated order details
    const order = await Order.findOne({ order_id: delivery.order_id });

    res.json({
      success: true,
      data: {
        ...delivery.toObject(),
        order
      }
    });
  } catch (error) {
    console.error('Get delivery error:', error);
    res.status(500).json({ message: 'Server error fetching delivery' });
  }
};

// Update delivery status
export const updateDeliveryStatus = async (req, res) => {
  try {
    const { delivery_status, driver_notes, actual_delivery } = req.body;
    
    const delivery = await Delivery.findOne({ order_id: req.params.orderId });
    if (!delivery) {
      return res.status(404).json({ message: 'Delivery record not found' });
    }

    // Update delivery status
    delivery.delivery_status = delivery_status;
    if (driver_notes) delivery.driver_notes = driver_notes;
    
    // If delivered, mark as delivered and set actual delivery time
    if (delivery_status === 'delivered') {
      delivery.delivered = true;
      delivery.actual_delivery = actual_delivery || new Date();
      
      // Update order status to delivered
      await Order.findOneAndUpdate(
        { order_id: delivery.order_id },
        { status: 'delivered' }
      );
    }

    await delivery.save();

    res.json({
      success: true,
      data: delivery
    });
  } catch (error) {
    console.error('Update delivery status error:', error);
    res.status(500).json({ message: 'Server error updating delivery status' });
  }
};

// Update delivery details
export const updateDelivery = async (req, res) => {
  try {
    const { 
      carrier, 
      shipping_method, 
      estimated_delivery, 
      delivery_address,
      recipient_name,
      signature_required,
      delivery_notes 
    } = req.body;

    const delivery = await Delivery.findOne({ order_id: req.params.orderId });
    if (!delivery) {
      return res.status(404).json({ message: 'Delivery record not found' });
    }

    const updatedDelivery = await Delivery.findByIdAndUpdate(
      delivery._id,
      {
        ...(carrier && { carrier }),
        ...(shipping_method && { shipping_method }),
        ...(estimated_delivery && { estimated_delivery }),
        ...(delivery_address && { delivery_address }),
        ...(recipient_name && { recipient_name }),
        ...(signature_required !== undefined && { signature_required }),
        ...(delivery_notes !== undefined && { delivery_notes })
      },
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      data: updatedDelivery
    });
  } catch (error) {
    console.error('Update delivery error:', error);
    res.status(500).json({ message: 'Server error updating delivery' });
  }
};

// Track delivery by tracking number
export const trackDelivery = async (req, res) => {
  try {
    const { trackingNumber } = req.params;
    
    const delivery = await Delivery.findOne({ tracking_number: trackingNumber });
    if (!delivery) {
      return res.status(404).json({ message: 'Invalid tracking number' });
    }

    // Get associated order for customer info
    const order = await Order.findOne({ order_id: delivery.order_id })
      .select('customerName total items status');

    // Create tracking timeline
    const timeline = [];
    
    timeline.push({
      status: 'pending',
      message: 'Order received and being prepared',
      timestamp: delivery.date,
      completed: true
    });

    if (['picked_up', 'in_transit', 'out_for_delivery', 'delivered'].includes(delivery.delivery_status)) {
      timeline.push({
        status: 'picked_up',
        message: 'Package picked up by carrier',
        timestamp: delivery.updatedAt,
        completed: true
      });
    }

    if (['in_transit', 'out_for_delivery', 'delivered'].includes(delivery.delivery_status)) {
      timeline.push({
        status: 'in_transit',
        message: 'Package is in transit',
        timestamp: delivery.updatedAt,
        completed: true
      });
    }

    if (['out_for_delivery', 'delivered'].includes(delivery.delivery_status)) {
      timeline.push({
        status: 'out_for_delivery',
        message: 'Out for delivery',
        timestamp: delivery.updatedAt,
        completed: true
      });
    }

    if (delivery.delivery_status === 'delivered') {
      timeline.push({
        status: 'delivered',
        message: 'Package delivered successfully',
        timestamp: delivery.actual_delivery,
        completed: true
      });
    }

    res.json({
      success: true,
      data: {
        tracking_number: delivery.tracking_number,
        order_id: delivery.order_id,
        current_status: delivery.delivery_status,
        delivered: delivery.delivered,
        estimated_delivery: delivery.estimated_delivery,
        actual_delivery: delivery.actual_delivery,
        carrier: delivery.carrier,
        shipping_method: delivery.shipping_method,
        timeline,
        order_summary: order
      }
    });
  } catch (error) {
    console.error('Track delivery error:', error);
    res.status(500).json({ message: 'Server error tracking delivery' });
  }
};

// Delete delivery record
export const deleteDelivery = async (req, res) => {
  try {
    const delivery = await Delivery.findOne({ order_id: req.params.orderId });
    if (!delivery) {
      return res.status(404).json({ message: 'Delivery record not found' });
    }

    await Delivery.findByIdAndDelete(delivery._id);

    res.json({
      success: true,
      message: 'Delivery record deleted successfully'
    });
  } catch (error) {
    console.error('Delete delivery error:', error);
    res.status(500).json({ message: 'Server error deleting delivery record' });
  }
};

// Get delivery statistics
export const getDeliveryStats = async (req, res) => {
  try {
    const stats = await Delivery.aggregate([
      {
        $group: {
          _id: null,
          totalDeliveries: { $sum: 1 },
          deliveredCount: { $sum: { $cond: ['$delivered', 1, 0] } },
          pendingCount: { 
            $sum: { 
              $cond: [{ $ne: ['$delivery_status', 'delivered'] }, 1, 0] 
            } 
          }
        }
      }
    ]);

    const statusStats = await Delivery.aggregate([
      {
        $group: {
          _id: '$delivery_status',
          count: { $sum: 1 }
        }
      }
    ]);

    const carrierStats = await Delivery.aggregate([
      {
        $group: {
          _id: '$carrier',
          count: { $sum: 1 },
          deliveredCount: { $sum: { $cond: ['$delivered', 1, 0] } }
        }
      }
    ]);

    res.json({
      success: true,
      data: {
        overview: stats[0] || {},
        statusBreakdown: statusStats,
        carrierBreakdown: carrierStats
      }
    });
  } catch (error) {
    console.error('Get delivery stats error:', error);
    res.status(500).json({ message: 'Server error fetching delivery statistics' });
  }
};
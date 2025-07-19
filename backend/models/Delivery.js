import mongoose from 'mongoose';

const deliverySchema = new mongoose.Schema({
  order_id: {
    type: String,
    required: true,
    unique: true,
    ref: 'Order'
  },
  tracking_number: {
    type: String,
    unique: true,
    sparse: true
  },
  carrier: {
    type: String,
    enum: ['ups', 'fedex', 'dhl', 'usps', 'local_delivery'],
    default: 'local_delivery'
  },
  shipping_method: {
    type: String,
    enum: ['standard', 'express', 'overnight', 'same_day'],
    default: 'standard'
  },
  estimated_delivery: {
    type: Date
  },
  actual_delivery: {
    type: Date
  },
  delivered: {
    type: Boolean,
    default: false
  },
  delivery_status: {
    type: String,
    enum: ['pending', 'picked_up', 'in_transit', 'out_for_delivery', 'delivered', 'failed', 'returned'],
    default: 'pending'
  },
  delivery_address: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String
  },
  recipient_name: String,
  signature_required: {
    type: Boolean,
    default: false
  },
  delivery_notes: String,
  driver_notes: String,
  date: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index for better query performance
deliverySchema.index({ order_id: 1 });
deliverySchema.index({ tracking_number: 1 });
deliverySchema.index({ delivery_status: 1 });
deliverySchema.index({ delivered: 1, date: -1 });

export default mongoose.model('Delivery', deliverySchema);
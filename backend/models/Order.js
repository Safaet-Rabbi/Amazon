import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
  product_id: {
    type: String,
    required: true,
    ref: 'Product'
  },
  productName: {
    type: String,
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  total: {
    type: Number,
    required: true,
    min: 0
  }
});

const orderSchema = new mongoose.Schema({
  order_id: {
    type: String,
    required: true,
    unique: true
  },
  customer_id: {
    type: String,
    required: true,
    ref: 'Customer'
  },
  customerName: {
    type: String,
    required: true
  },
  items: [orderItemSchema],
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'],
    default: 'pending'
  },
  subtotal: {
    type: Number,
    required: true,
    min: 0
  },
  tax: {
    type: Number,
    default: 0,
    min: 0
  },
  shipping: {
    type: Number,
    default: 0,
    min: 0
  },
  total: {
    type: Number,
    required: true,
    min: 0
  },
  shippingAddress: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String
  },
  paymentMethod: {
    type: String,
    enum: ['credit_card', 'debit_card', 'paypal', 'cash_on_delivery'],
    default: 'credit_card'
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed', 'refunded'],
    default: 'pending'
  },
  notes: String,
  ordered_at: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index for better query performance
orderSchema.index({ customer_id: 1, ordered_at: -1 });
orderSchema.index({ status: 1 });
orderSchema.index({ order_id: 1 });
orderSchema.index({ ordered_at: -1 });

export default mongoose.model('Order', orderSchema);
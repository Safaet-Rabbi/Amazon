import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  _id: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  stock: {
    type: Number,
    required: true,
    min: 0,
    default: 0
  },
  category: {
    type: String,
    required: true,
    trim: true
  },
  brand: {
    type: String,
    trim: true
  },
  image: {
    type: String,
    default: 'https://via.placeholder.com/300x300?text=Product+Image'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lowStockThreshold: {
    type: Number,
    default: 10
  }
}, {
  timestamps: true,
  _id: false
});

// Virtual for checking low stock
productSchema.virtual('isLowStock').get(function() {
  return this.stock <= this.lowStockThreshold;
});

// Index for better query performance
productSchema.index({ category: 1 });
productSchema.index({ name: 'text', description: 'text' });
productSchema.index({ price: 1 });

export default mongoose.model('Product', productSchema);
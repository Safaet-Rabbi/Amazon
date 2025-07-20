const express = require('express');
const { body, validationResult } = require('express-validator');
const Customer = require('../models/Customer');
const { auth, adminAuth } = require('../middleware/auth');

const router = express.Router();

// Get all customers
router.get('/', auth, async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '', status = '' } = req.query;
    
    const query = {};
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } }
      ];
    }
    if (status) query.status = status;

    const customers = await Customer.find(query)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const total = await Customer.countDocuments(query);

    res.json({
      customers,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single customer
router.get('/:id', auth, async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }
    res.json(customer);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create customer
router.post('/', [
  auth,
  body('name').trim().notEmpty().withMessage('Customer name is required'),
  body('email').isEmail().withMessage('Please enter a valid email'),
  body('phone').trim().notEmpty().withMessage('Phone number is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, phone, address, status } = req.body;

    // Check if customer already exists
    const existingCustomer = await Customer.findOne({ email });
    if (existingCustomer) {
      return res.status(400).json({ message: 'Customer with this email already exists' });
    }

    const customer = new Customer({
      name,
      email,
      phone,
      address: address || {},
      status: status || 'active'
    });

    await customer.save();
    res.status(201).json({ message: 'Customer created successfully', customer });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update customer
router.put('/:id', [
  auth,
  body('name').optional().trim().notEmpty().withMessage('Customer name cannot be empty'),
  body('email').optional().isEmail().withMessage('Please enter a valid email'),
  body('phone').optional().trim().notEmpty().withMessage('Phone number cannot be empty')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const customer = await Customer.findById(req.params.id);
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    // Check if email is being changed and if it already exists
    if (req.body.email && req.body.email !== customer.email) {
      const existingCustomer = await Customer.findOne({ email: req.body.email });
      if (existingCustomer) {
        return res.status(400).json({ message: 'Customer with this email already exists' });
      }
    }

    const updates = req.body;
    Object.keys(updates).forEach(key => {
      if (key === 'address' && typeof updates[key] === 'object') {
        customer.address = { ...customer.address.toObject(), ...updates[key] };
      } else {
        customer[key] = updates[key];
      }
    });

    await customer.save();
    res.json({ message: 'Customer updated successfully', customer });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete customer
router.delete('/:id', adminAuth, async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    await Customer.findByIdAndDelete(req.params.id);
    res.json({ message: 'Customer deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
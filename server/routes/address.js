const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { check, validationResult } = require('express-validator');
const Address = require('../models/Address');

// Validation rules
const addressValidation = [
  check('firstName', 'First name is required').not().isEmpty(),
  check('lastName', 'Last name is required').not().isEmpty(),
  check('address', 'Address is required').not().isEmpty(),
  check('city', 'City is required').not().isEmpty(),
  check('state', 'State is required').not().isEmpty(),
  check('zip', 'ZIP code is required').not().isEmpty(),
  check('phone', 'Phone number is required').not().isEmpty(),
];

// @route   GET api/address
// @desc    Get all addresses for user
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const addresses = await Address.find({ user: req.user.id })
      .sort('-isDefault createdAt');
    
    // If no default exists and there are addresses, set the first as default
    if (addresses.length > 0 && !addresses.some(addr => addr.isDefault)) {
      addresses[0].isDefault = true;
      await addresses[0].save();
    }

    res.json(addresses);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Server Error' });
  }
});

// @route   POST api/address
// @desc    Add new address
// @access  Private
router.post('/', [auth, ...addressValidation], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { 
    firstName, 
    lastName, 
    address, 
    apartment, 
    city, 
    state, 
    zip, 
    phone, 
    isDefault = false 
  } = req.body;

  try {
    // Limit: max 2 addresses per user
    const addressCount = await Address.countDocuments({ user: req.user.id });
    if (addressCount >= 2) {
      return res.status(400).json({ 
        error: 'Address limit reached', 
        message: 'You can only save up to 2 addresses' 
      });
    }

    // If new address is default, unset others
    if (isDefault) {
      await Address.updateMany({ user: req.user.id }, { isDefault: false });
    }

    const newAddress = new Address({
      user: req.user.id,
      firstName,
      lastName,
      address,
      apartment,
      city,
      state,
      zip,
      phone,
      isDefault
    });

    const savedAddress = await newAddress.save();
    res.status(201).json(savedAddress);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Server Error' });
  }
});

// @route   PUT api/address/:id
// @desc    Update address
// @access  Private
router.put('/:id', [auth, ...addressValidation], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { 
    firstName, 
    lastName, 
    address, 
    apartment, 
    city, 
    state, 
    zip, 
    phone, 
    isDefault 
  } = req.body;

  try {
    let addr = await Address.findById(req.params.id);

    if (!addr) {
      return res.status(404).json({ error: 'Address not found' });
    }

    if (addr.user.toString() !== req.user.id) {
      return res.status(401).json({ error: 'Not authorized' });
    }

    // If setting as default, unset others
    if (isDefault) {
      await Address.updateMany(
        { user: req.user.id, _id: { $ne: req.params.id } }, 
        { isDefault: false }
      );
    }

    // Update fields
    addr.firstName = firstName;
    addr.lastName = lastName;
    addr.address = address;
    addr.apartment = apartment;
    addr.city = city;
    addr.state = state;
    addr.zip = zip;
    addr.phone = phone;
    addr.isDefault = isDefault || addr.isDefault;

    const updatedAddress = await addr.save();
    res.json(updatedAddress);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Server Error' });
  }
});

// @route   PATCH api/address/:id/default
// @desc    Set address as default
// @access  Private
router.patch('/:id/default', auth, async (req, res) => {
  try {
    await Address.updateMany(
      { user: req.user.id, _id: { $ne: req.params.id } },
      { isDefault: false }
    );

    const addr = await Address.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      { isDefault: true },
      { new: true }
    );

    if (!addr) {
      return res.status(404).json({ error: 'Address not found' });
    }

    res.json(addr);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Server Error' });
  }
});

// @route   DELETE api/address/:id
// @desc    Delete address
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const addr = await Address.findOne({ _id: req.params.id, user: req.user.id });

    if (!addr) {
      return res.status(404).json({ error: 'Address not found' });
    }

    // If deleting default → promote oldest other address
    if (addr.isDefault) {
      const fallback = await Address.findOne({ 
        user: req.user.id, 
        _id: { $ne: addr._id } 
      }).sort('createdAt'); // oldest one becomes default

      if (fallback) {
        await Address.findByIdAndUpdate(fallback._id, { isDefault: true });
      }
    }

    await addr.deleteOne();
    res.json({ message: 'Address removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Server Error' });
  }
});

module.exports = router;

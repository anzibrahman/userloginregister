const express = require('express');
const { check, validationResult } = require('express-validator');
const User = require('../models/User');
const auth = require('../middleware/auth');

const router = express.Router();

// Get all users
router.get('/', auth, async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Update user
router.put('/:id', [
  auth,
  check('name', 'Name is required and should be at least 3 characters').isLength({ min: 3 }),
  check('mobileNumber', 'Please include a valid mobile number').isLength({ min: 10, max: 10 }),
  check('password', 'Password should be at least 6 characters').isLength({ min: 6 })
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, mobileNumber, password } = req.body;

  const userFields = {};
  if (name) userFields.name = name;
  if (mobileNumber) userFields.mobileNumber = mobileNumber;
  if (password) {
    const salt = await bcrypt.genSalt(10);
    userFields.password = await bcrypt.hash(password, salt);
  }

  try {
    let user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    user = await User.findByIdAndUpdate(req.params.id, { $set: userFields }, { new: true });

    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});
const updateUser = async (req, res) => {
  const { id } = req.params;
  const { name, mobileNumber, password } = req.body;

  try {
    // Find the user by id
    let user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update the user object with new data
    user.name = name;
    user.mobileNumber = mobileNumber;
    user.password = password; // Handle password securely in your application

    // Save the updated user
    await user.save();

    // Respond with the updated user object
    res.status(200).json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server Error' });
  }
};


// Delete user
router.delete('/:id', auth, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    await User.findByIdAndDelete(req.params.id);

    res.json({ msg: 'User removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
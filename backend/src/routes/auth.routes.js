import express from 'express';
import { login, register, getCurrentUser } from '../controllers/auth.controller.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { User, Admin, SuperAdmin } from '../models/user.model.js';

const router = express.Router();

// Auth routes
router.post('/login', login);
router.post('/register', register);
router.get('/me', getCurrentUser);

// Login route for all roles
router.post('/:role/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const { role } = req.params;

    let user;
    switch (role) {
      case 'user':
        user = await User.findOne({ email });
        break;
      case 'admin':
        user = await Admin.findOne({ email });
        break;
      case 'super-admin':
        user = await SuperAdmin.findOne({ email });
        break;
      default:
        return res.status(400).json({ message: 'Invalid role' });
    }

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({ token, user: { id: user._id, email: user.email, role: user.role } });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get current user
router.get('/me', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    let user;

    switch (decoded.role) {
      case 'user':
        user = await User.findById(decoded.id).select('-password');
        break;
      case 'admin':
        user = await Admin.findById(decoded.id).select('-password');
        break;
      case 'super-admin':
        user = await SuperAdmin.findById(decoded.id).select('-password');
        break;
      default:
        return res.status(400).json({ message: 'Invalid role' });
    }

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router; 
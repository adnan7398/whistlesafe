import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import { User, Admin, SuperAdmin } from '../models/user.model.js'

export const login = async (req, res) => {
  try {
    const { email, password, role } = req.body

    let user
    switch (role) {
      case 'user':
        user = await User.findOne({ email })
        break
      case 'admin':
        user = await Admin.findOne({ email })
        break
      case 'super-admin':
        user = await SuperAdmin.findOne({ email })
        break
      default:
        return res.status(400).json({ message: 'Invalid role' })
    }

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' })
    }

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' })
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    )

    res.json({ token, user: { id: user._id, email: user.email, role: user.role } })
  } catch (error) {
    console.error('Login error:', error)
    res.status(500).json({ message: 'Server error' })
  }
}

export const register = async (req, res) => {
  try {
    const { email, password, name, role } = req.body

    let user
    switch (role) {
      case 'user':
        user = new User({ email, password, name, role })
        break
      case 'admin':
        user = new Admin({ email, password, name, role })
        break
      case 'super-admin':
        user = new SuperAdmin({ email, password, name, role })
        break
      default:
        return res.status(400).json({ message: 'Invalid role' })
    }

    await user.save()
    res.status(201).json({ message: 'User created successfully' })
  } catch (error) {
    console.error('Registration error:', error)
    res.status(500).json({ message: 'Server error' })
  }
}

export const getCurrentUser = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1]
    if (!token) {
      return res.status(401).json({ message: 'No token provided' })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    let user

    switch (decoded.role) {
      case 'user':
        user = await User.findById(decoded.id).select('-password')
        break
      case 'admin':
        user = await Admin.findById(decoded.id).select('-password')
        break
      case 'super-admin':
        user = await SuperAdmin.findById(decoded.id).select('-password')
        break
      default:
        return res.status(400).json({ message: 'Invalid role' })
    }

    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    res.json(user)
  } catch (error) {
    console.error('Get user error:', error)
    res.status(500).json({ message: 'Server error' })
  }
} 
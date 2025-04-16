const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  passwordHash: {
    type: String,
    required: true
  },
  role: {
    type: String,
    default: 'admin'
  },
  assignedCategories: [{
    type: String
  }],
  assignedRegions: [{
    type: String
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  notifications: [{
    reportId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Report'
    },
    message: String,
    seen: {
      type: Boolean,
      default: false
    },
    timestamp: {
      type: Date,
      default: Date.now
    }
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Admin', adminSchema); 
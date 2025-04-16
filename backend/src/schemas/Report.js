const mongoose = require('mongoose');
const { encryptText, decryptText } = require('../utils/encryption');

const reportSchema = new mongoose.Schema({
  reportId: {
    type: String,
    required: true,
    unique: true
  },
  userUUID: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true,
    set: encryptText,
    get: decryptText
  },
  status: {
    type: String,
    enum: ['pending', 'in-review', 'resolved'],
    default: 'pending'
  },
  location: {
    lat: {
      type: Number,
      required: true
    },
    lng: {
      type: Number,
      required: true
    },
    address: {
      type: String,
      set: encryptText,
      get: decryptText
    }
  },
  media: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Media'
  }],
  urgency: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  assignedAdmin: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin'
  },
  metadata: {
    type: Map,
    of: mongoose.Schema.Types.Mixed,
    set: (value) => {
      if (value && typeof value === 'object') {
        const encrypted = {};
        for (const [key, val] of Object.entries(value)) {
          encrypted[key] = encryptText(JSON.stringify(val));
        }
        return encrypted;
      }
      return value;
    },
    get: (value) => {
      if (value && typeof value === 'object') {
        const decrypted = {};
        for (const [key, val] of Object.entries(value)) {
          try {
            decrypted[key] = JSON.parse(decryptText(val));
          } catch (error) {
            decrypted[key] = val;
          }
        }
        return decrypted;
      }
      return value;
    }
  }
}, {
  timestamps: true,
  toJSON: { getters: true },
  toObject: { getters: true }
});

// Indexes for efficient querying
reportSchema.index({ status: 1 });
reportSchema.index({ category: 1 });
reportSchema.index({ assignedAdmin: 1 });
reportSchema.index({ 'location.lat': 1, 'location.lng': 1 });

module.exports = mongoose.model('Report', reportSchema); 
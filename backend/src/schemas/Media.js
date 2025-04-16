const mongoose = require('mongoose');

const mediaSchema = new mongoose.Schema({
  url: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['image', 'video', 'audio'],
    required: true
  },
  tags: [{
    type: String
  }],
  metadata: {
    exif: {
      type: Map,
      of: mongoose.Schema.Types.Mixed
    },
    timestamp: {
      type: Date
    }
  },
  uploadedBy: {
    type: String,
    required: true
  },
  linkedReport: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Report'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Media', mediaSchema); 
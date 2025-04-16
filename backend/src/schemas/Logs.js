const mongoose = require('mongoose');

const logSchema = new mongoose.Schema({
  actorType: {
    type: String,
    enum: ['admin', 'superadmin'],
    required: true
  },
  actorId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  action: {
    type: String,
    required: true
  },
  targetReportId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Report'
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index for faster querying
logSchema.index({ timestamp: -1 });
logSchema.index({ actorType: 1, actorId: 1 });
logSchema.index({ targetReportId: 1 });

module.exports = mongoose.model('Log', logSchema); 
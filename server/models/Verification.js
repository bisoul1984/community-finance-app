const mongoose = require('mongoose');

const verificationSchema = new mongoose.Schema({
  verifier: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  verifiedUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  isVerified: {
    type: Boolean,
    required: true
  },
  notes: {
    type: String,
    default: ''
  },
  date: {
    type: Date,
    default: Date.now
  }
});

// Ensure a user can only verify another user once
verificationSchema.index({ verifier: 1, verifiedUser: 1 }, { unique: true });

module.exports = mongoose.model('Verification', verificationSchema); 
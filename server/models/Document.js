const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  documentType: {
    type: String,
    enum: ['identification', 'income', 'bank_statement', 'utility_bill', 'employment_letter', 'business_plan', 'collateral', 'other'],
    required: true
  },
  filename: { type: String, required: true },
  originalName: { type: String, required: true },
  fileSize: { type: Number, required: true },
  mimeType: { type: String, required: true },
  filePath: { type: String, required: true },
  status: { type: String, enum: ['uploaded', 'verified', 'rejected', 'pending'], default: 'uploaded' },
  verifiedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  verifiedAt: { type: Date },
  verificationNotes: { type: String },
  isRequired: { type: Boolean, default: false }
}, { timestamps: true });

documentSchema.index({ user: 1, documentType: 1 });
documentSchema.index({ status: 1 });
documentSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Document', documentSchema); 
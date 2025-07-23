const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['borrower', 'lender', 'admin'], default: 'borrower' },
  status: { type: String, enum: ['active', 'suspended', 'pending'], default: 'active' },
  reputation: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema); 
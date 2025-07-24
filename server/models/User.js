const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['borrower', 'lender', 'admin'], default: 'borrower' },
  status: { type: String, enum: ['active', 'suspended', 'pending'], default: 'active' },
  reputation: { type: Number, default: 0 },
  emailPreferences: {
    loanUpdates: { type: Boolean, default: true },
    paymentReminders: { type: Boolean, default: true },
    accountAlerts: { type: Boolean, default: true },
    marketingEmails: { type: Boolean, default: false }
  },
  emailVerified: { type: Boolean, default: false },
  verificationCode: { type: String },
  verificationCodeExpires: { type: Date },
  resetPasswordToken: { type: String },
  resetPasswordExpires: { type: Date },
  stripeCustomerId: { type: String },
  paymentHistory: [{
    paymentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Payment' },
    amount: { type: Number },
    date: { type: Date },
    type: { type: String, enum: ['repayment', 'funding', 'fee'] }
  }],
  fundingHistory: [{
    paymentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Payment' },
    loanId: { type: mongoose.Schema.Types.ObjectId, ref: 'Loan' },
    amount: { type: Number },
    date: { type: Date }
  }],
  totalFunded: { type: Number, default: 0 },
  totalRepaid: { type: Number, default: 0 },
  creditScore: { type: Number, default: 650 },
  kycVerified: { type: Boolean, default: false },
  kycDocuments: [{
    type: { type: String, enum: ['id', 'passport', 'utility_bill', 'bank_statement'] },
    url: { type: String },
    verified: { type: Boolean, default: false },
    uploadedAt: { type: Date, default: Date.now }
  }],
  walletBalance: { type: Number, default: 0 },
  walletTransactions: [{
    type: { type: String, enum: ['fund', 'withdraw', 'invest', 'repayment', 'transfer'], required: true },
    amount: { type: Number, required: true },
    date: { type: Date, default: Date.now },
    ref: { type: mongoose.Schema.Types.ObjectId }, // Reference to related entity (e.g., Loan, Payment)
    description: { type: String }
  }]
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema); 
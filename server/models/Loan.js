const mongoose = require('mongoose');

const loanSchema = new mongoose.Schema({
  borrower: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  amount: {
    type: Number,
    required: true,
    min: 1
  },
  purpose: {
    type: String,
    required: true,
    maxlength: 500
  },
  status: {
    type: String,
    enum: ['pending', 'funded', 'active', 'completed', 'defaulted'],
    default: 'pending'
  },
  fundedAmount: {
    type: Number,
    default: 0
  },
  lenders: [{
    lender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    amount: {
      type: Number,
      required: true
    },
    fundedAt: {
      type: Date,
      default: Date.now
    }
  }],
  interestRate: {
    type: Number,
    default: 0, // Interest-free by default
    min: 0,
    max: 100
  },
  term: {
    type: Number,
    required: true,
    min: 1 // Days
  },
  startDate: {
    type: Date
  },
  dueDate: {
    type: Date
  },
  repayments: [{
    amount: {
      type: Number,
      required: true
    },
    date: {
      type: Date,
      default: Date.now
    },
    status: {
      type: String,
      enum: ['pending', 'completed'],
      default: 'pending'
    }
  }],
  totalRepaid: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

module.exports = mongoose.model('Loan', loanSchema); 
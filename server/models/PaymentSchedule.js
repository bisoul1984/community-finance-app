const mongoose = require('mongoose');

const paymentScheduleSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  loanId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Loan',
    required: true
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  frequency: {
    type: String,
    required: true,
    enum: ['weekly', 'biweekly', 'monthly', 'quarterly', 'yearly'],
    default: 'monthly'
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    default: null
  },
  nextPaymentDate: {
    type: Date,
    required: true
  },
  reminderDays: {
    type: Number,
    default: 3,
    min: 0,
    max: 30
  },
  autoPay: {
    type: Boolean,
    default: false
  },
  paymentMethod: {
    type: String,
    required: true,
    enum: ['bank_transfer', 'credit_card', 'debit_card', 'mobile_money', 'cash'],
    default: 'bank_transfer'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastProcessedDate: {
    type: Date,
    default: null
  },
  totalProcessed: {
    type: Number,
    default: 0
  },
  failedAttempts: {
    type: Number,
    default: 0
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  }
}, {
  timestamps: true
});

// Indexes for efficient queries
paymentScheduleSchema.index({ userId: 1, isActive: 1 });
paymentScheduleSchema.index({ nextPaymentDate: 1, isActive: 1 });
paymentScheduleSchema.index({ loanId: 1 });
paymentScheduleSchema.index({ userId: 1, nextPaymentDate: 1 });

// Virtual for calculating remaining payments
paymentScheduleSchema.virtual('remainingPayments').get(function() {
  if (!this.endDate) return null;
  
  const today = new Date();
  const endDate = new Date(this.endDate);
  
  if (today > endDate) return 0;
  
  const monthsDiff = (endDate.getFullYear() - today.getFullYear()) * 12 + 
                     (endDate.getMonth() - today.getMonth());
  
  switch (this.frequency) {
    case 'weekly':
      return Math.ceil((endDate - today) / (7 * 24 * 60 * 60 * 1000));
    case 'biweekly':
      return Math.ceil((endDate - today) / (14 * 24 * 60 * 60 * 1000));
    case 'monthly':
      return monthsDiff;
    case 'quarterly':
      return Math.ceil(monthsDiff / 3);
    case 'yearly':
      return Math.ceil(monthsDiff / 12);
    default:
      return monthsDiff;
  }
});

// Method to calculate next payment date
paymentScheduleSchema.methods.calculateNextPayment = function() {
  const nextDate = new Date(this.nextPaymentDate);
  
  switch (this.frequency) {
    case 'weekly':
      nextDate.setDate(nextDate.getDate() + 7);
      break;
    case 'biweekly':
      nextDate.setDate(nextDate.getDate() + 14);
      break;
    case 'monthly':
      nextDate.setMonth(nextDate.getMonth() + 1);
      break;
    case 'quarterly':
      nextDate.setMonth(nextDate.getMonth() + 3);
      break;
    case 'yearly':
      nextDate.setFullYear(nextDate.getFullYear() + 1);
      break;
    default:
      nextDate.setMonth(nextDate.getMonth() + 1);
  }
  
  return nextDate;
};

// Method to check if schedule should be deactivated
paymentScheduleSchema.methods.shouldDeactivate = function() {
  if (!this.endDate) return false;
  
  const nextPayment = this.calculateNextPayment();
  return nextPayment > this.endDate;
};

// Pre-save middleware to validate dates
paymentScheduleSchema.pre('save', function(next) {
  if (this.endDate && this.startDate >= this.endDate) {
    return next(new Error('End date must be after start date'));
  }
  
  if (this.nextPaymentDate < this.startDate) {
    this.nextPaymentDate = this.startDate;
  }
  
  next();
});

module.exports = mongoose.model('PaymentSchedule', paymentScheduleSchema); 
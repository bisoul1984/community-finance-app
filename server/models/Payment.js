const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
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
  currency: {
    type: String,
    default: 'usd',
    uppercase: true
  },
  paymentType: {
    type: String,
    enum: ['repayment', 'funding', 'fee', 'refund'],
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'processing', 'completed', 'failed', 'cancelled', 'refunded'],
    default: 'pending'
  },
  stripePaymentIntentId: {
    type: String,
    required: true,
    unique: true
  },
  stripeRefundId: {
    type: String
  },
  metadata: {
    type: Map,
    of: String
  },
  failureReason: {
    type: String
  },
  processedAt: {
    type: Date
  },
  refundedAt: {
    type: Date
  }
}, {
  timestamps: true
});

// Indexes for better query performance
paymentSchema.index({ userId: 1, createdAt: -1 });
paymentSchema.index({ loanId: 1, createdAt: -1 });
paymentSchema.index({ status: 1 });
paymentSchema.index({ paymentType: 1 });
paymentSchema.index({ stripePaymentIntentId: 1 }, { unique: true });

// Virtual for formatted amount
paymentSchema.virtual('formattedAmount').get(function() {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: this.currency.toUpperCase()
  }).format(this.amount);
});

// Pre-save middleware to set processedAt when status changes to completed
paymentSchema.pre('save', function(next) {
  if (this.isModified('status') && this.status === 'completed' && !this.processedAt) {
    this.processedAt = new Date();
  }
  next();
});

// Static method to get payment statistics
paymentSchema.statics.getStatistics = async function(userId, startDate, endDate) {
  const matchStage = {
    userId: mongoose.Types.ObjectId(userId),
    status: 'completed'
  };

  if (startDate && endDate) {
    matchStage.createdAt = {
      $gte: new Date(startDate),
      $lte: new Date(endDate)
    };
  }

  return await this.aggregate([
    { $match: matchStage },
    {
      $group: {
        _id: '$paymentType',
        totalAmount: { $sum: '$amount' },
        count: { $sum: 1 }
      }
    }
  ]);
};

// Instance method to refund payment
paymentSchema.methods.refund = async function(reason = 'requested_by_customer') {
  const PaymentService = require('../services/paymentService');
  
  try {
    const refundResult = await PaymentService.createRefund(
      this.stripePaymentIntentId,
      this.amount,
      reason
    );

    if (refundResult.success) {
      this.status = 'refunded';
      this.stripeRefundId = refundResult.refund.id;
      this.refundedAt = new Date();
      await this.save();
      
      return {
        success: true,
        refund: refundResult
      };
    } else {
      return {
        success: false,
        error: refundResult.error
      };
    }
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
};

module.exports = mongoose.model('Payment', paymentSchema); 
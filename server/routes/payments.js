const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const PaymentService = require('../services/paymentService');
const Loan = require('../models/Loan');
const User = require('../models/User');
const Payment = require('../models/Payment');

const Notification = require('../models/Notification');

// Create payment intent for loan repayment
router.post('/create-payment-intent', auth, async (req, res) => {
  try {
    const { amount, loanId, currency = 'usd' } = req.body;
    const userId = req.user.id;

    // Validate amount
    if (!amount || amount <= 0) {
      return res.status(400).json({ message: 'Invalid amount' });
    }

    // Get user and loan details
    const user = await User.findById(userId);
    const loan = await Loan.findById(loanId);

    if (!loan) {
      return res.status(404).json({ message: 'Loan not found' });
    }

    // Check if user is the borrower of this loan
    if (loan.borrower.toString() !== userId) {
      return res.status(403).json({ message: 'Not authorized to repay this loan' });
    }

    // Create or get Stripe customer
    let customerId = user.stripeCustomerId;
    if (!customerId) {
      const customerResult = await PaymentService.createCustomer(user.email, user.name, {
        userId: userId,
        userRole: user.role
      });
      
      if (!customerResult.success) {
        return res.status(500).json({ message: 'Failed to create customer' });
      }
      
      customerId = customerResult.customerId;
      user.stripeCustomerId = customerId;
      await user.save();
    }

    // Create payment intent
    const paymentResult = await PaymentService.createPaymentIntent(amount, currency, {
      userId: userId,
      loanId: loanId,
      paymentType: 'loan_repayment',
      borrowerName: user.name,
      loanTitle: loan.title
    });

    if (!paymentResult.success) {
      return res.status(500).json({ message: paymentResult.error });
    }

    res.json({
      clientSecret: paymentResult.clientSecret,
      paymentIntentId: paymentResult.paymentIntentId,
      amount: paymentResult.amount,
      currency: paymentResult.currency
    });

  } catch (error) {
    console.error('Create payment intent error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Confirm payment and update loan
router.post('/confirm-payment', auth, async (req, res) => {
  try {
    const { paymentIntentId, loanId } = req.body;
    const userId = req.user.id;

    // Confirm payment with Stripe
    const paymentResult = await PaymentService.confirmPayment(paymentIntentId);
    
    if (!paymentResult.success) {
      return res.status(400).json({ message: paymentResult.error });
    }

    // Get loan details
    const loan = await Loan.findById(loanId);
    if (!loan) {
      return res.status(404).json({ message: 'Loan not found' });
    }

    // Create payment record
    const payment = new Payment({
      userId: userId,
      loanId: loanId,
      amount: paymentResult.amount,
      currency: paymentResult.currency,
      stripePaymentIntentId: paymentIntentId,
      status: 'completed',
      paymentType: 'repayment',
      metadata: {
        stripePaymentIntent: paymentResult.paymentIntent.id,
        paymentMethod: paymentResult.paymentIntent.payment_method_types?.[0] || 'card'
      }
    });

    await payment.save();

    // Update loan repayment
    const newRepaidAmount = (loan.repaidAmount || 0) + paymentResult.amount;
    loan.repaidAmount = newRepaidAmount;
    
    // Check if loan is fully repaid
    if (newRepaidAmount >= loan.amount) {
      loan.status = 'repaid';
      loan.repaidAt = new Date();
    } else {
      loan.status = 'active';
    }

    await loan.save();

    // Update user's payment history
    const user = await User.findById(userId);
    if (user) {
      if (!user.paymentHistory) user.paymentHistory = [];
      user.paymentHistory.push({
        paymentId: payment._id,
        amount: paymentResult.amount,
        date: new Date(),
        type: 'repayment'
      });
      await user.save();
    }

    res.json({
      success: true,
      payment: {
        id: payment._id,
        amount: paymentResult.amount,
        currency: paymentResult.currency,
        status: 'completed',
        loanStatus: loan.status
      },
      loan: {
        id: loan._id,
        repaidAmount: loan.repaidAmount,
        status: loan.status
      }
    });

  } catch (error) {
    console.error('Confirm payment error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create payment intent for loan funding
router.post('/create-funding-intent', auth, async (req, res) => {
  try {
    const { amount, loanId, currency = 'usd' } = req.body;
    const userId = req.user.id;

    // Validate amount
    if (!amount || amount <= 0) {
      return res.status(400).json({ message: 'Invalid amount' });
    }

    // Check if user is a lender
    const user = await User.findById(userId);
    if (user.role !== 'lender') {
      return res.status(403).json({ message: 'Only lenders can fund loans' });
    }

    // Get loan details
    const loan = await Loan.findById(loanId);
    if (!loan) {
      return res.status(404).json({ message: 'Loan not found' });
    }

    // Check if loan is still open for funding
    if (loan.status !== 'pending') {
      return res.status(400).json({ message: 'Loan is not open for funding' });
    }

    // Create or get Stripe customer
    let customerId = user.stripeCustomerId;
    if (!customerId) {
      const customerResult = await PaymentService.createCustomer(user.email, user.name, {
        userId: userId,
        userRole: user.role
      });
      
      if (!customerResult.success) {
        return res.status(500).json({ message: 'Failed to create customer' });
      }
      
      customerId = customerResult.customerId;
      user.stripeCustomerId = customerId;
      await user.save();
    }

    // Create payment intent
    const paymentResult = await PaymentService.createPaymentIntent(amount, currency, {
      userId: userId,
      loanId: loanId,
      paymentType: 'loan_funding',
      lenderName: user.name,
      loanTitle: loan.title
    });

    if (!paymentResult.success) {
      return res.status(500).json({ message: paymentResult.error });
    }

    res.json({
      clientSecret: paymentResult.clientSecret,
      paymentIntentId: paymentResult.paymentIntentId,
      amount: paymentResult.amount,
      currency: paymentResult.currency
    });

  } catch (error) {
    console.error('Create funding intent error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Confirm funding payment
router.post('/confirm-funding', auth, async (req, res) => {
  try {
    const { paymentIntentId, loanId } = req.body;
    const userId = req.user.id;

    // Confirm payment with Stripe
    const paymentResult = await PaymentService.confirmPayment(paymentIntentId);
    
    if (!paymentResult.success) {
      return res.status(400).json({ message: paymentResult.error });
    }

    // Get loan details
    const loan = await Loan.findById(loanId);
    if (!loan) {
      return res.status(404).json({ message: 'Loan not found' });
    }

    // Create payment record
    const payment = new Payment({
      userId: userId,
      loanId: loanId,
      amount: paymentResult.amount,
      currency: paymentResult.currency,
      stripePaymentIntentId: paymentIntentId,
      status: 'completed',
      paymentType: 'funding',
      metadata: {
        stripePaymentIntent: paymentResult.paymentIntent.id,
        paymentMethod: paymentResult.paymentIntent.payment_method_types?.[0] || 'card'
      }
    });

    await payment.save();

    // Update loan funding
    const newFundedAmount = (loan.fundedAmount || 0) + paymentResult.amount;
    loan.fundedAmount = newFundedAmount;
    
    // Check if loan is fully funded
    if (newFundedAmount >= loan.amount) {
      loan.status = 'active';
      loan.fundedAt = new Date();
    }

    await loan.save();

    // Update user's funding history
    const user = await User.findById(userId);
    if (user) {
      if (!user.fundingHistory) user.fundingHistory = [];
      user.fundingHistory.push({
        paymentId: payment._id,
        loanId: loanId,
        amount: paymentResult.amount,
        date: new Date()
      });
      await user.save();
    }

    res.json({
      success: true,
      payment: {
        id: payment._id,
        amount: paymentResult.amount,
        currency: paymentResult.currency,
        status: 'completed'
      },
      loan: {
        id: loan._id,
        fundedAmount: loan.fundedAmount,
        status: loan.status
      }
    });

  } catch (error) {
    console.error('Confirm funding error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get payment history for user
router.get('/history', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const { page = 1, limit = 10, type } = req.query;

    const query = { userId };
    if (type) {
      query.paymentType = type;
    }

    const payments = await Payment.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .populate('loanId', 'title amount');

    const total = await Payment.countDocuments(query);

    res.json({
      payments,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });

  } catch (error) {
    console.error('Get payment history error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get payment methods for user
router.get('/payment-methods', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);

    if (!user.stripeCustomerId) {
      return res.json({ paymentMethods: [] });
    }

    const result = await PaymentService.getPaymentMethods(user.stripeCustomerId);
    
    if (!result.success) {
      return res.status(500).json({ message: result.error });
    }

    res.json({ paymentMethods: result.paymentMethods });

  } catch (error) {
    console.error('Get payment methods error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create setup intent for saving payment methods
router.post('/setup-payment-method', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);

    // Create or get Stripe customer
    let customerId = user.stripeCustomerId;
    if (!customerId) {
      const customerResult = await PaymentService.createCustomer(user.email, user.name, {
        userId: userId,
        userRole: user.role
      });
      
      if (!customerResult.success) {
        return res.status(500).json({ message: 'Failed to create customer' });
      }
      
      customerId = customerResult.customerId;
      user.stripeCustomerId = customerId;
      await user.save();
    }

    const result = await PaymentService.createSetupIntent(customerId, {
      userId: userId
    });

    if (!result.success) {
      return res.status(500).json({ message: result.error });
    }

    res.json({
      clientSecret: result.clientSecret,
      setupIntentId: result.setupIntentId
    });

  } catch (error) {
    console.error('Setup payment method error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get payment statistics
router.get('/statistics', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Convert string userId to ObjectId for MongoDB aggregation
    const mongoose = require('mongoose');
    const userObjectId = new mongoose.Types.ObjectId(userId);

    // Get total payments made
    const totalPayments = await Payment.aggregate([
      { $match: { userId: userObjectId, status: 'completed' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);

    // Get total funding provided
    const totalFunding = await Payment.aggregate([
      { $match: { userId: userObjectId, paymentType: 'funding', status: 'completed' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);

    // Get total repayments made
    const totalRepayments = await Payment.aggregate([
      { $match: { userId: userObjectId, paymentType: 'repayment', status: 'completed' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);

    // Get payment count by month (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const monthlyPayments = await Payment.aggregate([
      { $match: { userId: userObjectId, createdAt: { $gte: sixMonthsAgo } } },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          count: { $sum: 1 },
          total: { $sum: '$amount' }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    // Return statistics with default values if no data exists
    res.json({
      totalPayments: totalPayments[0]?.total || 0,
      totalFunding: totalFunding[0]?.total || 0,
      totalRepayments: totalRepayments[0]?.total || 0,
      monthlyPayments: monthlyPayments || []
    });

  } catch (error) {
    console.error('Get payment statistics error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Payment Scheduling Routes

// Get user payment schedules
router.get('/schedules/:userId', auth, async (req, res) => {
  try {
    const { userId } = req.params;

    // Verify user can access this data (admin or own data)
    if (req.user.role !== 'admin' && req.user.id !== userId) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const schedules = await PaymentSchedule.find({ userId })
      .populate('loanId', 'amount status')
      .sort({ createdAt: -1 });

    res.json(schedules);
  } catch (error) {
    console.error('Error fetching payment schedules:', error);
    res.status(500).json({ message: 'Failed to fetch payment schedules' });
  }
});

// Create payment schedule
router.post('/schedules', auth, async (req, res) => {
  try {
    const {
      userId,
      loanId,
      amount,
      frequency,
      startDate,
      endDate,
      reminderDays,
      autoPay,
      paymentMethod
    } = req.body;

    // Verify user can create schedule for this user (admin or own data)
    if (req.user.role !== 'admin' && req.user.id !== userId) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const schedule = new PaymentSchedule({
      userId,
      loanId,
      amount: parseFloat(amount),
      frequency,
      startDate: new Date(startDate),
      endDate: endDate ? new Date(endDate) : null,
      reminderDays: parseInt(reminderDays),
      autoPay,
      paymentMethod,
      isActive: true,
      nextPaymentDate: new Date(startDate)
    });

    await schedule.save();

    // Populate loan info for response
    await schedule.populate('loanId', 'amount status');

    res.status(201).json(schedule);
  } catch (error) {
    console.error('Error creating payment schedule:', error);
    res.status(500).json({ message: 'Failed to create payment schedule' });
  }
});

// Update payment schedule
router.put('/schedules/:scheduleId', auth, async (req, res) => {
  try {
    const { scheduleId } = req.params;
    const updateData = req.body;

    const schedule = await PaymentSchedule.findById(scheduleId);
    
    if (!schedule) {
      return res.status(404).json({ message: 'Payment schedule not found' });
    }

    // Verify user can update this schedule (admin or own data)
    if (req.user.role !== 'admin' && req.user.id !== schedule.userId.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const updatedSchedule = await PaymentSchedule.findByIdAndUpdate(
      scheduleId,
      updateData,
      { new: true, runValidators: true }
    ).populate('loanId', 'amount status');

    res.json(updatedSchedule);
  } catch (error) {
    console.error('Error updating payment schedule:', error);
    res.status(500).json({ message: 'Failed to update payment schedule' });
  }
});

// Delete payment schedule
router.delete('/schedules/:scheduleId', auth, async (req, res) => {
  try {
    const { scheduleId } = req.params;

    const schedule = await PaymentSchedule.findById(scheduleId);
    
    if (!schedule) {
      return res.status(404).json({ message: 'Payment schedule not found' });
    }

    // Verify user can delete this schedule (admin or own data)
    if (req.user.role !== 'admin' && req.user.id !== schedule.userId.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    await PaymentSchedule.findByIdAndDelete(scheduleId);

    res.json({ message: 'Payment schedule deleted successfully' });
  } catch (error) {
    console.error('Error deleting payment schedule:', error);
    res.status(500).json({ message: 'Failed to delete payment schedule' });
  }
});

// Toggle schedule status
router.patch('/schedules/:scheduleId/toggle', auth, async (req, res) => {
  try {
    const { scheduleId } = req.params;
    const { isActive } = req.body;

    const schedule = await PaymentSchedule.findById(scheduleId);
    
    if (!schedule) {
      return res.status(404).json({ message: 'Payment schedule not found' });
    }

    // Verify user can update this schedule (admin or own data)
    if (req.user.role !== 'admin' && req.user.id !== schedule.userId.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    schedule.isActive = isActive;
    await schedule.save();

    await schedule.populate('loanId', 'amount status');

    res.json(schedule);
  } catch (error) {
    console.error('Error toggling schedule status:', error);
    res.status(500).json({ message: 'Failed to toggle schedule status' });
  }
});

// Get upcoming payments
router.get('/upcoming/:userId', auth, async (req, res) => {
  try {
    const { userId } = req.params;
    const { days = 30 } = req.query;

    // Verify user can access this data (admin or own data)
    if (req.user.role !== 'admin' && req.user.id !== userId) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const endDate = new Date();
    endDate.setDate(endDate.getDate() + parseInt(days));

    const upcomingPayments = await PaymentSchedule.find({
      userId,
      isActive: true,
      nextPaymentDate: { $lte: endDate }
    }).populate('loanId', 'amount status');

    res.json(upcomingPayments);
  } catch (error) {
    console.error('Error fetching upcoming payments:', error);
    res.status(500).json({ message: 'Failed to fetch upcoming payments' });
  }
});

// Process scheduled payments (cron job endpoint)
router.post('/process-scheduled', async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const scheduledPayments = await PaymentSchedule.find({
      isActive: true,
      nextPaymentDate: { $lte: today }
    }).populate('loanId userId');

    const processedPayments = [];

    for (const schedule of scheduledPayments) {
      try {
        // Create payment record
        const payment = new Payment({
          userId: schedule.userId._id,
          loanId: schedule.loanId._id,
          amount: schedule.amount,
          method: schedule.paymentMethod,
          status: schedule.autoPay ? 'completed' : 'pending',
          date: today,
          description: `Scheduled payment - ${schedule.frequency}`,
          metadata: {
            scheduleId: schedule._id,
            autoPay: schedule.autoPay
          }
        });

        await payment.save();

        // Update loan balance
        if (schedule.autoPay) {
          const loan = await Loan.findById(schedule.loanId._id);
          if (loan) {
            loan.paidAmount = (loan.paidAmount || 0) + schedule.amount;
            if (loan.paidAmount >= loan.amount) {
              loan.status = 'completed';
            }
            await loan.save();
          }
        }

        // Calculate next payment date
        const nextDate = new Date(schedule.nextPaymentDate);
        switch (schedule.frequency) {
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
          default:
            nextDate.setMonth(nextDate.getMonth() + 1);
        }

        // Update schedule
        schedule.nextPaymentDate = nextDate;
        if (schedule.endDate && nextDate > schedule.endDate) {
          schedule.isActive = false;
        }
        await schedule.save();

        processedPayments.push({
          scheduleId: schedule._id,
          paymentId: payment._id,
          amount: schedule.amount,
          status: payment.status
        });

        // Send notification if not auto-pay
        if (!schedule.autoPay) {
          // Create notification for manual payment
          const notification = new Notification({
            userId: schedule.userId._id,
            type: 'repaymentReminder',
            email: schedule.userId.email,
            subject: 'Payment Due Reminder',
            status: 'pending'
          });
          await notification.save();
        }

      } catch (error) {
        console.error(`Error processing scheduled payment ${schedule._id}:`, error);
      }
    }

    res.json({
      message: `Processed ${processedPayments.length} scheduled payments`,
      processedPayments
    });
  } catch (error) {
    console.error('Error processing scheduled payments:', error);
    res.status(500).json({ message: 'Failed to process scheduled payments' });
  }
});

// Get available payment providers
router.get('/providers', auth, async (req, res) => {
  try {
    const providers = PaymentService.getAvailableProviders();
    res.json({ providers });
  } catch (error) {
    console.error('Get payment providers error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get payment provider fees
router.post('/calculate-fees', auth, async (req, res) => {
  try {
    const { amount, provider = 'stripe', currency = 'usd' } = req.body;
    
    if (!amount || amount <= 0) {
      return res.status(400).json({ message: 'Invalid amount' });
    }

    const fees = PaymentService.getProviderFees(amount, provider, currency);
    res.json({ fees });
  } catch (error) {
    console.error('Calculate fees error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create payment intent with specific provider
router.post('/create-payment-intent/:provider', auth, async (req, res) => {
  try {
    const { provider } = req.params;
    const { amount, loanId, currency = 'usd' } = req.body;
    const userId = req.user.id;

    // Validate amount
    if (!amount || amount <= 0) {
      return res.status(400).json({ message: 'Invalid amount' });
    }

    // Get user and loan details
    const user = await User.findById(userId);
    const loan = await Loan.findById(loanId);

    if (!loan) {
      return res.status(404).json({ message: 'Loan not found' });
    }

    // Check if user is the borrower of this loan
    if (loan.borrower.toString() !== userId) {
      return res.status(403).json({ message: 'Not authorized to repay this loan' });
    }

    // Create payment intent with specified provider
    const paymentResult = await PaymentService.createPaymentIntent(amount, currency, {
      userId: userId,
      loanId: loanId,
      paymentType: 'loan_repayment',
      borrowerName: user.name,
      loanTitle: loan.title
    }, provider);

    if (!paymentResult.success) {
      return res.status(500).json({ message: paymentResult.error });
    }

    res.json({
      ...paymentResult,
      provider
    });

  } catch (error) {
    console.error('Create payment intent error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Confirm payment with specific provider
router.post('/confirm-payment/:provider', auth, async (req, res) => {
  try {
    const { provider } = req.params;
    const { paymentIntentId, loanId } = req.body;
    const userId = req.user.id;

    // Confirm payment with specified provider
    const paymentResult = await PaymentService.confirmPayment(paymentIntentId, provider);
    
    if (!paymentResult.success) {
      return res.status(400).json({ message: paymentResult.error });
    }

    // Get loan details
    const loan = await Loan.findById(loanId);
    if (!loan) {
      return res.status(404).json({ message: 'Loan not found' });
    }

    // Create payment record
    const payment = new Payment({
      userId: userId,
      loanId: loanId,
      amount: paymentResult.amount,
      currency: paymentResult.currency,
      stripePaymentIntentId: paymentIntentId,
      status: 'completed',
      paymentType: 'repayment',
      provider: provider,
      metadata: {
        provider: provider,
        paymentMethod: paymentResult.provider || provider
      }
    });

    await payment.save();

    // Update loan repayment
    const newRepaidAmount = (loan.repaidAmount || 0) + paymentResult.amount;
    loan.repaidAmount = newRepaidAmount;
    
    // Check if loan is fully repaid
    if (newRepaidAmount >= loan.amount) {
      loan.status = 'repaid';
      loan.repaidAt = new Date();
    } else {
      loan.status = 'active';
    }

    await loan.save();

    // Update user's payment history
    const user = await User.findById(userId);
    if (user) {
      if (!user.paymentHistory) user.paymentHistory = [];
      user.paymentHistory.push({
        paymentId: payment._id,
        amount: paymentResult.amount,
        date: new Date(),
        type: 'repayment',
        provider: provider
      });
      await user.save();
    }

    res.json({
      success: true,
      payment: {
        id: payment._id,
        amount: paymentResult.amount,
        currency: paymentResult.currency,
        status: 'completed',
        provider: provider,
        loanStatus: loan.status
      },
      loan: {
        id: loan._id,
        repaidAmount: loan.repaidAmount,
        status: loan.status
      }
    });

  } catch (error) {
    console.error('Confirm payment error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 
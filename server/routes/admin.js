const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');
const Loan = require('../models/Loan');
const NotificationHelper = require('../services/notificationHelper');

// Admin middleware - check if user is admin
const adminAuth = async (req, res, next) => {
  try {
    // First check if user is authenticated
    await auth(req, res, () => {});
    
    // Then check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admin privileges required.' });
    }
    
    next();
  } catch (error) {
    res.status(401).json({ message: 'Authentication required.' });
  }
};

// Apply admin auth to all routes
router.use(adminAuth);

// Get all users
router.get('/users', async (req, res) => {
  try {
    console.log('Admin: Getting all users');
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    console.error('Error getting all users:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all loans
router.get('/loans', async (req, res) => {
  try {
    console.log('Admin: Getting all loans');
    const loans = await Loan.find()
      .populate('borrower', 'name email')
      .populate('lenders.lender', 'name email')
      .sort({ createdAt: -1 });
    res.json(loans);
  } catch (error) {
    console.error('Error getting all loans:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update user status
router.put('/users/:userId/status', async (req, res) => {
  try {
    const { userId } = req.params;
    const { status } = req.body;
    
    console.log(`Admin: Updating user ${userId} status to ${status}`);
    
    const validStatuses = ['active', 'suspended', 'pending'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }
    
    const user = await User.findByIdAndUpdate(
      userId,
      { status },
      { new: true }
    ).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    console.log(`Admin: User ${userId} status updated to ${status}`);
    res.json(user);
  } catch (error) {
    console.error('Error updating user status:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update loan status
router.put('/loans/:loanId/status', async (req, res) => {
  try {
    const { loanId } = req.params;
    const { status } = req.body;
    
    console.log(`Admin: Updating loan ${loanId} status to ${status}`);
    
    const validStatuses = ['pending', 'funded', 'active', 'completed', 'overdue'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }
    
    const loan = await Loan.findByIdAndUpdate(
      loanId,
      { status },
      { new: true }
    ).populate('borrower', 'name email')
     .populate('lenders.lender', 'name email');
    
    if (!loan) {
      return res.status(404).json({ message: 'Loan not found' });
    }
    
    console.log(`Admin: Loan ${loanId} status updated to ${status}`);
    // Real-time notifications for borrower
    if (['funded', 'active', 'completed', 'overdue'].includes(status)) {
      if (status === 'funded' || status === 'active') {
        await NotificationHelper.sendLoanApprovedNotification(
          loan.borrower._id,
          loan.amount,
          loan._id,
          { term: loan.term },
          req.app.get('io')
        );
      } else if (status === 'completed') {
        await NotificationHelper.sendLoanRepaidNotification(
          loan.borrower._id,
          loan._id,
          loan.amount,
          req.app.get('io')
        );
      } else if (status === 'overdue') {
        await NotificationHelper.sendRepaymentReminderNotification(
          loan.borrower._id,
          loan.amount - loan.totalRepaid,
          loan.dueDate,
          loan._id,
          req.app.get('io')
        );
      }
    }
    res.json(loan);
  } catch (error) {
    console.error('Error updating loan status:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get system statistics
router.get('/stats', async (req, res) => {
  try {
    console.log('Admin: Getting system statistics');
    
    const totalUsers = await User.countDocuments();
    const activeUsers = await User.countDocuments({ status: 'active' });
    const totalLoans = await Loan.countDocuments();
    const activeLoans = await Loan.countDocuments({ 
      status: { $in: ['active', 'funded'] } 
    });
    const completedLoans = await Loan.countDocuments({ status: 'completed' });
    const totalAmount = await Loan.aggregate([
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);
    
    const stats = {
      totalUsers,
      activeUsers,
      totalLoans,
      activeLoans,
      completedLoans,
      totalAmount: totalAmount[0]?.total || 0
    };
    
    console.log('Admin: System stats:', stats);
    res.json(stats);
  } catch (error) {
    console.error('Error getting system stats:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 
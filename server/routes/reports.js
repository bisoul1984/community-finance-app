const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Loan = require('../models/Loan');
const Payment = require('../models/Payment');
const User = require('../models/User');

// Get user loan reports
router.get('/user/:userId', auth, async (req, res) => {
  try {
    const { userId } = req.params;
    const { startDate, endDate, type } = req.query;

    // Verify user can access this data (admin or own data)
    if (req.user.role !== 'admin' && req.user.id !== userId) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const filter = { userId };
    if (startDate && endDate) {
      filter.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    const loans = await Loan.find(filter);
    const payments = await Payment.find({ userId });

    // Calculate metrics
    const totalLoans = loans.length;
    const totalAmount = loans.reduce((sum, loan) => sum + loan.amount, 0);
    const activeLoans = loans.filter(loan => loan.status === 'active').length;
    const completedLoans = loans.filter(loan => loan.status === 'completed').length;
    const defaultedLoans = loans.filter(loan => loan.status === 'defaulted').length;
    const totalPayments = payments.reduce((sum, payment) => sum + payment.amount, 0);

    const report = {
      summary: {
        totalLoans,
        totalAmount,
        activeLoans,
        completedLoans,
        defaultedLoans,
        totalPayments,
        defaultRate: totalLoans > 0 ? (defaultedLoans / totalLoans * 100).toFixed(2) : 0
      },
      loans,
      payments
    };

    res.json(report);
  } catch (error) {
    console.error('Error generating user report:', error);
    res.status(500).json({ message: 'Failed to generate report' });
  }
});

// Get admin dashboard reports
router.get('/admin/dashboard', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }

    const { startDate, endDate } = req.query;
    const filter = {};
    
    if (startDate && endDate) {
      filter.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    const loans = await Loan.find(filter);
    const payments = await Payment.find(filter);
    const users = await User.find(filter);

    // Calculate admin metrics
    const totalUsers = users.length;
    const totalLoans = loans.length;
    const totalAmount = loans.reduce((sum, loan) => sum + loan.amount, 0);
    const totalPayments = payments.reduce((sum, payment) => sum + payment.amount, 0);
    const activeLoans = loans.filter(loan => loan.status === 'active').length;
    const pendingLoans = loans.filter(loan => loan.status === 'pending').length;
    const completedLoans = loans.filter(loan => loan.status === 'completed').length;
    const defaultedLoans = loans.filter(loan => loan.status === 'defaulted').length;

    // Monthly trends
    const monthlyData = [];
    const months = 6;
    for (let i = months - 1; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const monthStart = new Date(date.getFullYear(), date.getMonth(), 1);
      const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0);

      const monthLoans = loans.filter(loan => 
        loan.createdAt >= monthStart && loan.createdAt <= monthEnd
      );
      const monthPayments = payments.filter(payment => 
        payment.date >= monthStart && payment.date <= monthEnd
      );

      monthlyData.push({
        month: date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
        loans: monthLoans.length,
        loanAmount: monthLoans.reduce((sum, loan) => sum + loan.amount, 0),
        payments: monthPayments.length,
        paymentAmount: monthPayments.reduce((sum, payment) => sum + payment.amount, 0)
      });
    }

    const report = {
      summary: {
        totalUsers,
        totalLoans,
        totalAmount,
        totalPayments,
        activeLoans,
        pendingLoans,
        completedLoans,
        defaultedLoans,
        defaultRate: totalLoans > 0 ? (defaultedLoans / totalLoans * 100).toFixed(2) : 0,
        averageLoanAmount: totalLoans > 0 ? (totalAmount / totalLoans).toFixed(2) : 0
      },
      monthlyTrends: monthlyData,
      loanStatusDistribution: [
        { status: 'Active', count: activeLoans, percentage: totalLoans > 0 ? (activeLoans / totalLoans * 100).toFixed(1) : 0 },
        { status: 'Pending', count: pendingLoans, percentage: totalLoans > 0 ? (pendingLoans / totalLoans * 100).toFixed(1) : 0 },
        { status: 'Completed', count: completedLoans, percentage: totalLoans > 0 ? (completedLoans / totalLoans * 100).toFixed(1) : 0 },
        { status: 'Defaulted', count: defaultedLoans, percentage: totalLoans > 0 ? (defaultedLoans / totalLoans * 100).toFixed(1) : 0 }
      ]
    };

    res.json(report);
  } catch (error) {
    console.error('Error generating admin report:', error);
    res.status(500).json({ message: 'Failed to generate admin report' });
  }
});

// Get loan performance report
router.get('/loans/performance', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }

    const { startDate, endDate } = req.query;
    const filter = {};
    
    if (startDate && endDate) {
      filter.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    const loans = await Loan.find(filter).populate('userId', 'firstName lastName email');

    // Calculate performance metrics
    const performanceData = loans.map(loan => {
      const totalPayments = loan.payments?.reduce((sum, payment) => sum + payment.amount, 0) || 0;
      const remainingBalance = loan.amount - totalPayments;
      const paymentProgress = (totalPayments / loan.amount * 100).toFixed(2);
      const isOnTrack = loan.status === 'active' && paymentProgress >= 80;
      const isAtRisk = loan.status === 'active' && paymentProgress < 50;

      return {
        loanId: loan._id,
        userId: loan.userId,
        amount: loan.amount,
        status: loan.status,
        totalPayments,
        remainingBalance,
        paymentProgress,
        isOnTrack,
        isAtRisk,
        createdAt: loan.createdAt,
        dueDate: loan.dueDate
      };
    });

    const summary = {
      totalLoans: performanceData.length,
      onTrackLoans: performanceData.filter(loan => loan.isOnTrack).length,
      atRiskLoans: performanceData.filter(loan => loan.isAtRisk).length,
      averagePaymentProgress: performanceData.length > 0 ? 
        (performanceData.reduce((sum, loan) => sum + parseFloat(loan.paymentProgress), 0) / performanceData.length).toFixed(2) : 0
    };

    res.json({
      summary,
      loans: performanceData
    });
  } catch (error) {
    console.error('Error generating loan performance report:', error);
    res.status(500).json({ message: 'Failed to generate performance report' });
  }
});

// Export report as CSV
router.get('/export/:type', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }

    const { type } = req.params;
    const { startDate, endDate } = req.query;

    let data = [];
    let filename = '';

    switch (type) {
      case 'loans':
        const filter = {};
        if (startDate && endDate) {
          filter.createdAt = {
            $gte: new Date(startDate),
            $lte: new Date(endDate)
          };
        }
        
        const loans = await Loan.find(filter).populate('userId', 'firstName lastName email');
        data = loans.map(loan => ({
          'Loan ID': loan._id,
          'User': `${loan.userId.firstName} ${loan.userId.lastName}`,
          'Email': loan.userId.email,
          'Amount': loan.amount,
          'Status': loan.status,
          'Created Date': loan.createdAt.toISOString().split('T')[0],
          'Due Date': loan.dueDate ? loan.dueDate.toISOString().split('T')[0] : ''
        }));
        filename = `loans_${new Date().toISOString().split('T')[0]}.csv`;
        break;

      case 'payments':
        const paymentFilter = {};
        if (startDate && endDate) {
          paymentFilter.date = {
            $gte: new Date(startDate),
            $lte: new Date(endDate)
          };
        }
        
        const payments = await Payment.find(paymentFilter).populate('userId', 'firstName lastName email');
        data = payments.map(payment => ({
          'Payment ID': payment._id,
          'User': `${payment.userId.firstName} ${payment.userId.lastName}`,
          'Email': payment.userId.email,
          'Amount': payment.amount,
          'Method': payment.method,
          'Status': payment.status,
          'Date': payment.date.toISOString().split('T')[0]
        }));
        filename = `payments_${new Date().toISOString().split('T')[0]}.csv`;
        break;

      default:
        return res.status(400).json({ message: 'Invalid export type' });
    }

    // Convert to CSV
    const csvHeaders = Object.keys(data[0] || {});
    const csvContent = [
      csvHeaders.join(','),
      ...data.map(row => csvHeaders.map(header => `"${row[header]}"`).join(','))
    ].join('\n');

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.send(csvContent);

  } catch (error) {
    console.error('Error exporting report:', error);
    res.status(500).json({ message: 'Failed to export report' });
  }
});

module.exports = router; 
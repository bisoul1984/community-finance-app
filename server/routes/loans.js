const express = require('express');
const Loan = require('../models/Loan');
const User = require('../models/User');
const auth = require('../middleware/auth');
const NotificationHelper = require('../services/notificationHelper');
const router = express.Router();

// Apply auth middleware to all routes
router.use(auth);

// Get all loan requests (for lenders to browse)
router.get('/requests', async (req, res) => {
  try {
    const loans = await Loan.find({ status: 'pending' })
      .populate('borrower', 'name email reputation')
      .sort({ createdAt: -1 });
    res.json(loans);
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
});

// Get user's loans (borrower's loans or lender's investments)
router.get('/user/:userId', async (req, res) => {
  try {
    console.log('GET /user/:userId - Request params:', req.params);
    console.log('GET /user/:userId - Authenticated user:', req.user);
    
    const { userId } = req.params;
    const user = await User.findById(userId);
    
    console.log('GET /user/:userId - Found user:', user ? user.name : 'User not found');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    let loans;
    if (user.role === 'borrower') {
      // Get loans where user is the borrower
      console.log('GET /user/:userId - Fetching borrower loans for:', user.name);
      loans = await Loan.find({ borrower: userId })
        .populate('lenders.lender', 'name email')
        .sort({ createdAt: -1 });
    } else {
      // Get loans where user is a lender
      console.log('GET /user/:userId - Fetching lender investments for:', user.name);
      loans = await Loan.find({ 'lenders.lender': userId })
        .populate('borrower', 'name email')
        .sort({ createdAt: -1 });
    }

    console.log('GET /user/:userId - Found loans:', loans.length);
    res.json(loans);
  } catch (err) {
    console.error('Error fetching user loans:', err);
    res.status(500).json({ message: 'Server error.' });
  }
});

// Create a new loan request
router.post('/create', async (req, res) => {
  try {
    const { amount, purpose, term } = req.body;
    const borrowerId = req.user.id; // Use authenticated user's ID
    
    const borrower = await User.findById(borrowerId);
    if (!borrower || borrower.role !== 'borrower') {
      return res.status(400).json({ message: 'Only borrowers can create loan requests.' });
    }

    const loan = new Loan({
      borrower: borrowerId,
      amount,
      purpose,
      term
    });

    await loan.save();
    
    // Send loan submitted notification
    await NotificationHelper.sendLoanSubmittedNotification(
      borrowerId, 
      amount, 
      loan._id
    );
    
    res.status(201).json(loan);
  } catch (err) {
    console.error('Error creating loan:', err);
    res.status(500).json({ message: 'Server error.' });
  }
});

// Fund a loan (lender invests in a loan)
router.post('/fund/:loanId', async (req, res) => {
  try {
    const { loanId } = req.params;
    const { amount } = req.body;
    const lenderId = req.user.id; // Use authenticated user's ID

    const lender = await User.findById(lenderId);
    if (!lender || lender.role !== 'lender') {
      return res.status(400).json({ message: 'Only lenders can fund loans.' });
    }

    const loan = await Loan.findById(loanId);
    if (!loan) {
      return res.status(404).json({ message: 'Loan not found.' });
    }

    if (loan.status !== 'pending') {
      return res.status(400).json({ message: 'Loan is not available for funding.' });
    }

    if (loan.fundedAmount + amount > loan.amount) {
      return res.status(400).json({ message: 'Funding amount exceeds loan amount.' });
    }

    // Add lender to the loan
    loan.lenders.push({
      lender: lenderId,
      amount,
      fundedAt: new Date()
    });

    loan.fundedAmount += amount;

    // Check if loan is fully funded
    if (loan.fundedAmount >= loan.amount) {
      loan.status = 'funded';
      loan.startDate = new Date();
      loan.dueDate = new Date(Date.now() + loan.term * 24 * 60 * 60 * 1000); // Add term days
    }

    await loan.save();
    res.json(loan);
  } catch (err) {
    console.error('Error funding loan:', err);
    res.status(500).json({ message: 'Server error.' });
  }
});

// Make a repayment
router.post('/repay/:loanId', async (req, res) => {
  try {
    const { loanId } = req.params;
    const { amount } = req.body;
    const borrowerId = req.user.id; // Use authenticated user's ID

    const borrower = await User.findById(borrowerId);
    if (!borrower || borrower.role !== 'borrower') {
      return res.status(400).json({ message: 'Only borrowers can make repayments.' });
    }

    const loan = await Loan.findById(loanId);
    if (!loan) {
      return res.status(404).json({ message: 'Loan not found.' });
    }

    if (loan.borrower.toString() !== borrowerId) {
      return res.status(403).json({ message: 'You can only repay your own loans.' });
    }

    if (loan.status !== 'funded' && loan.status !== 'active') {
      return res.status(400).json({ message: 'Loan is not active.' });
    }

    loan.repayments.push({
      amount,
      status: 'completed',
      date: new Date()
    });

    loan.totalRepaid += amount;

    // Check if loan is fully repaid
    if (loan.totalRepaid >= loan.amount) {
      loan.status = 'completed';
    } else {
      loan.status = 'active';
    }

    await loan.save();
    
    // Send payment received notification
    const remainingBalance = loan.amount - loan.totalRepaid;
    await NotificationHelper.sendPaymentReceivedNotification(
      borrowerId,
      amount,
      loan._id,
      remainingBalance
    );
    
    // If loan is fully repaid, send completion notification
    if (loan.status === 'completed') {
      await NotificationHelper.sendLoanRepaidNotification(
        borrowerId,
        loan._id,
        loan.amount
      );
    }
    
    res.json(loan);
  } catch (err) {
    console.error('Error repaying loan:', err);
    res.status(500).json({ message: 'Server error.' });
  }
});

module.exports = router; 
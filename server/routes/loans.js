const express = require('express');
const Loan = require('../models/Loan');
const User = require('../models/User');
const router = express.Router();

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
    const { userId } = req.params;
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    let loans;
    if (user.role === 'borrower') {
      // Get loans where user is the borrower
      loans = await Loan.find({ borrower: userId })
        .populate('lenders.lender', 'name email')
        .sort({ createdAt: -1 });
    } else {
      // Get loans where user is a lender
      loans = await Loan.find({ 'lenders.lender': userId })
        .populate('borrower', 'name email')
        .sort({ createdAt: -1 });
    }

    res.json(loans);
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
});

// Create a new loan request
router.post('/create', async (req, res) => {
  try {
    const { borrowerId, amount, purpose, term } = req.body;
    
    const borrower = await User.findById(borrowerId);
    if (!borrower || borrower.role !== 'borrower') {
      return res.status(400).json({ message: 'Invalid borrower.' });
    }

    const loan = new Loan({
      borrower: borrowerId,
      amount,
      purpose,
      term
    });

    await loan.save();
    res.status(201).json(loan);
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
});

// Fund a loan (lender invests in a loan)
router.post('/fund/:loanId', async (req, res) => {
  try {
    const { loanId } = req.params;
    const { lenderId, amount } = req.body;

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
      amount
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
    res.status(500).json({ message: 'Server error.' });
  }
});

// Make a repayment
router.post('/repay/:loanId', async (req, res) => {
  try {
    const { loanId } = req.params;
    const { amount } = req.body;

    const loan = await Loan.findById(loanId);
    if (!loan) {
      return res.status(404).json({ message: 'Loan not found.' });
    }

    if (loan.status !== 'funded' && loan.status !== 'active') {
      return res.status(400).json({ message: 'Loan is not active.' });
    }

    loan.repayments.push({
      amount,
      status: 'completed'
    });

    loan.totalRepaid += amount;

    // Check if loan is fully repaid
    if (loan.totalRepaid >= loan.amount) {
      loan.status = 'completed';
    } else {
      loan.status = 'active';
    }

    await loan.save();
    res.json(loan);
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
});

module.exports = router; 
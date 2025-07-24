const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

// Get all loan categories
router.get('/', async (req, res) => {
  try {
    const categories = [
      {
        id: 'personal',
        name: 'Personal Loan',
        description: 'Flexible loans for personal expenses, debt consolidation, or emergency funds',
        minAmount: 1000,
        maxAmount: 50000,
        interestRate: 8.5,
        termRange: '12-60 months',
        requirements: [
          'Minimum credit score: 650',
          'Stable employment (6+ months)',
          'Valid government ID',
          'Proof of income'
        ],
        benefits: [
          'No collateral required',
          'Fast approval process',
          'Flexible repayment terms',
          'Competitive interest rates'
        ],
        icon: '👤',
        color: 'blue',
        processingTime: '2-3 business days'
      },
      {
        id: 'business',
        name: 'Business Loan',
        description: 'Funding for business expansion, equipment purchase, or working capital',
        minAmount: 5000,
        maxAmount: 200000,
        interestRate: 10.5,
        termRange: '12-84 months',
        requirements: [
          'Business plan required',
          'Business registration',
          'Financial statements',
          'Collateral may be required'
        ],
        benefits: [
          'Higher loan amounts available',
          'Business growth support',
          'Tax-deductible interest',
          'Flexible business terms'
        ],
        icon: '💼',
        color: 'green',
        processingTime: '5-7 business days'
      },
      {
        id: 'education',
        name: 'Education Loan',
        description: 'Student loans for tuition, books, and educational expenses',
        minAmount: 2000,
        maxAmount: 100000,
        interestRate: 6.5,
        termRange: '24-120 months',
        requirements: [
          'Enrollment verification',
          'Academic progress',
          'Co-signer may be required',
          'School accreditation'
        ],
        benefits: [
          'Lower interest rates',
          'Deferred payments while in school',
          'Grace period after graduation',
          'Income-based repayment options'
        ],
        icon: '🎓',
        color: 'purple',
        processingTime: '3-5 business days'
      },
      {
        id: 'home',
        name: 'Home Improvement Loan',
        description: 'Loans for home renovations, repairs, and improvements',
        minAmount: 3000,
        maxAmount: 150000,
        interestRate: 9.0,
        termRange: '12-120 months',
        requirements: [
          'Home ownership',
          'Property appraisal',
          'Contractor estimates',
          'Home equity may be required'
        ],
        benefits: [
          'Increase property value',
          'Tax-deductible interest',
          'Flexible repayment terms',
          'Competitive rates'
        ],
        icon: '🏠',
        color: 'orange',
        processingTime: '7-10 business days'
      },
      {
        id: 'vehicle',
        name: 'Vehicle Loan',
        description: 'Auto loans for new or used vehicles',
        minAmount: 5000,
        maxAmount: 100000,
        interestRate: 7.5,
        termRange: '12-84 months',
        requirements: [
          'Vehicle information',
          'Insurance proof',
          'Down payment',
          'Good credit history'
        ],
        benefits: [
          'Competitive auto rates',
          'Quick approval process',
          'Flexible terms',
          'Online application'
        ],
        icon: '🚗',
        color: 'red',
        processingTime: '1-2 business days'
      },
      {
        id: 'emergency',
        name: 'Emergency Loan',
        description: 'Quick access to funds for urgent financial needs',
        minAmount: 500,
        maxAmount: 10000,
        interestRate: 12.0,
        termRange: '3-24 months',
        requirements: [
          'Valid ID',
          'Proof of income',
          'Bank account',
          'Emergency documentation'
        ],
        benefits: [
          'Same-day approval',
          'Quick disbursement',
          'Minimal documentation',
          '24/7 application'
        ],
        icon: '🚨',
        color: 'red',
        processingTime: 'Same day'
      }
    ];

    res.json(categories);
  } catch (error) {
    console.error('Error fetching loan categories:', error);
    res.status(500).json({ message: 'Failed to fetch loan categories' });
  }
});

// Get specific category by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const categories = [
      {
        id: 'personal',
        name: 'Personal Loan',
        description: 'Flexible loans for personal expenses, debt consolidation, or emergency funds',
        minAmount: 1000,
        maxAmount: 50000,
        interestRate: 8.5,
        termRange: '12-60 months',
        requirements: [
          'Minimum credit score: 650',
          'Stable employment (6+ months)',
          'Valid government ID',
          'Proof of income'
        ],
        benefits: [
          'No collateral required',
          'Fast approval process',
          'Flexible repayment terms',
          'Competitive interest rates'
        ],
        icon: '👤',
        color: 'blue',
        processingTime: '2-3 business days'
      },
      {
        id: 'business',
        name: 'Business Loan',
        description: 'Funding for business expansion, equipment purchase, or working capital',
        minAmount: 5000,
        maxAmount: 200000,
        interestRate: 10.5,
        termRange: '12-84 months',
        requirements: [
          'Business plan required',
          'Business registration',
          'Financial statements',
          'Collateral may be required'
        ],
        benefits: [
          'Higher loan amounts available',
          'Business growth support',
          'Tax-deductible interest',
          'Flexible business terms'
        ],
        icon: '💼',
        color: 'green',
        processingTime: '5-7 business days'
      },
      {
        id: 'education',
        name: 'Education Loan',
        description: 'Student loans for tuition, books, and educational expenses',
        minAmount: 2000,
        maxAmount: 100000,
        interestRate: 6.5,
        termRange: '24-120 months',
        requirements: [
          'Enrollment verification',
          'Academic progress',
          'Co-signer may be required',
          'School accreditation'
        ],
        benefits: [
          'Lower interest rates',
          'Deferred payments while in school',
          'Grace period after graduation',
          'Income-based repayment options'
        ],
        icon: '🎓',
        color: 'purple',
        processingTime: '3-5 business days'
      },
      {
        id: 'home',
        name: 'Home Improvement Loan',
        description: 'Loans for home renovations, repairs, and improvements',
        minAmount: 3000,
        maxAmount: 150000,
        interestRate: 9.0,
        termRange: '12-120 months',
        requirements: [
          'Home ownership',
          'Property appraisal',
          'Contractor estimates',
          'Home equity may be required'
        ],
        benefits: [
          'Increase property value',
          'Tax-deductible interest',
          'Flexible repayment terms',
          'Competitive rates'
        ],
        icon: '🏠',
        color: 'orange',
        processingTime: '7-10 business days'
      },
      {
        id: 'vehicle',
        name: 'Vehicle Loan',
        description: 'Auto loans for new or used vehicles',
        minAmount: 5000,
        maxAmount: 100000,
        interestRate: 7.5,
        termRange: '12-84 months',
        requirements: [
          'Vehicle information',
          'Insurance proof',
          'Down payment',
          'Good credit history'
        ],
        benefits: [
          'Competitive auto rates',
          'Quick approval process',
          'Flexible terms',
          'Online application'
        ],
        icon: '🚗',
        color: 'red',
        processingTime: '1-2 business days'
      },
      {
        id: 'emergency',
        name: 'Emergency Loan',
        description: 'Quick access to funds for urgent financial needs',
        minAmount: 500,
        maxAmount: 10000,
        interestRate: 12.0,
        termRange: '3-24 months',
        requirements: [
          'Valid ID',
          'Proof of income',
          'Bank account',
          'Emergency documentation'
        ],
        benefits: [
          'Same-day approval',
          'Quick disbursement',
          'Minimal documentation',
          '24/7 application'
        ],
        icon: '🚨',
        color: 'red',
        processingTime: 'Same day'
      }
    ];

    const category = categories.find(cat => cat.id === id);
    
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    res.json(category);
  } catch (error) {
    console.error('Error fetching category:', error);
    res.status(500).json({ message: 'Failed to fetch category' });
  }
});

// Calculate loan terms for a category
router.post('/:id/calculate', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const { amount, term } = req.body;

    if (!amount || !term) {
      return res.status(400).json({ message: 'Amount and term are required' });
    }

    const categories = [
      {
        id: 'personal',
        interestRate: 8.5,
        minAmount: 1000,
        maxAmount: 50000
      },
      {
        id: 'business',
        interestRate: 10.5,
        minAmount: 5000,
        maxAmount: 200000
      },
      {
        id: 'education',
        interestRate: 6.5,
        minAmount: 2000,
        maxAmount: 100000
      },
      {
        id: 'home',
        interestRate: 9.0,
        minAmount: 3000,
        maxAmount: 150000
      },
      {
        id: 'vehicle',
        interestRate: 7.5,
        minAmount: 5000,
        maxAmount: 100000
      },
      {
        id: 'emergency',
        interestRate: 12.0,
        minAmount: 500,
        maxAmount: 10000
      }
    ];

    const category = categories.find(cat => cat.id === id);
    
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    if (amount < category.minAmount || amount > category.maxAmount) {
      return res.status(400).json({ 
        message: `Amount must be between $${category.minAmount} and $${category.maxAmount}` 
      });
    }

    // Calculate loan terms
    const monthlyRate = category.interestRate / 100 / 12;
    const numberOfPayments = term * 12;
    
    const monthlyPayment = amount * 
      (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) / 
      (Math.pow(1 + monthlyRate, numberOfPayments) - 1);
    
    const totalPayment = monthlyPayment * numberOfPayments;
    const totalInterest = totalPayment - amount;

    const calculation = {
      category: id,
      amount: parseFloat(amount),
      term: parseInt(term),
      interestRate: category.interestRate,
      monthlyPayment: parseFloat(monthlyPayment.toFixed(2)),
      totalPayment: parseFloat(totalPayment.toFixed(2)),
      totalInterest: parseFloat(totalInterest.toFixed(2)),
      numberOfPayments
    };

    res.json(calculation);
  } catch (error) {
    console.error('Error calculating loan terms:', error);
    res.status(500).json({ message: 'Failed to calculate loan terms' });
  }
});

module.exports = router; 
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');
const bcrypt = require('bcryptjs');

// Get user profile
router.get('/profile/:userId', auth, async (req, res) => {
  try {
    const { userId } = req.params;

    // Verify user can access this data (admin or own data)
    if (req.user.role !== 'admin' && req.user.id !== userId) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const user = await User.findById(userId).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ message: 'Failed to fetch user profile' });
  }
});

// Update user profile
router.put('/profile/:userId', auth, async (req, res) => {
  try {
    const { userId } = req.params;
    const updateData = req.body;

    // Verify user can update this data (admin or own data)
    if (req.user.role !== 'admin' && req.user.id !== userId) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Remove sensitive fields that shouldn't be updated via this endpoint
    delete updateData.password;
    delete updateData.email; // Email should be updated via separate endpoint
    delete updateData.role;

    const user = await User.findByIdAndUpdate(
      userId,
      updateData,
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error('Error updating user profile:', error);
    res.status(500).json({ message: 'Failed to update user profile' });
  }
});

// Update user preferences
router.put('/preferences/:userId', auth, async (req, res) => {
  try {
    const { userId } = req.params;
    const { preferences } = req.body;

    // Verify user can update this data (admin or own data)
    if (req.user.role !== 'admin' && req.user.id !== userId) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { preferences },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error('Error updating user preferences:', error);
    res.status(500).json({ message: 'Failed to update user preferences' });
  }
});

// Update user password
router.put('/password/:userId', auth, async (req, res) => {
  try {
    const { userId } = req.params;
    const { currentPassword, newPassword } = req.body;

    // Verify user can update this data (admin or own data)
    if (req.user.role !== 'admin' && req.user.id !== userId) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Verify current password (unless admin)
    if (req.user.role !== 'admin') {
      const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
      if (!isPasswordValid) {
        return res.status(400).json({ message: 'Current password is incorrect' });
      }
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    user.password = hashedPassword;
    await user.save();

    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error('Error updating password:', error);
    res.status(500).json({ message: 'Failed to update password' });
  }
});

// Toggle two-factor authentication
router.put('/2fa/:userId', auth, async (req, res) => {
  try {
    const { userId } = req.params;
    const { enabled } = req.body;

    // Verify user can update this data (admin or own data)
    if (req.user.role !== 'admin' && req.user.id !== userId) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { twoFactorEnabled: enabled },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ 
      message: `Two-factor authentication ${enabled ? 'enabled' : 'disabled'} successfully`,
      twoFactorEnabled: user.twoFactorEnabled
    });
  } catch (error) {
    console.error('Error updating 2FA:', error);
    res.status(500).json({ message: 'Failed to update two-factor authentication' });
  }
});

// Get user dashboard data
router.get('/dashboard/:userId', auth, async (req, res) => {
  try {
    const { userId } = req.params;

    // Verify user can access this data (admin or own data)
    if (req.user.role !== 'admin' && req.user.id !== userId) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const user = await User.findById(userId).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Get user's loans and payments
    const Loan = require('../models/Loan');
    const Payment = require('../models/Payment');

    const loans = await Loan.find({ userId });
    const payments = await Payment.find({ userId });

    // Calculate dashboard metrics
    const totalLoans = loans.length;
    const activeLoans = loans.filter(loan => loan.status === 'active').length;
    const totalAmount = loans.reduce((sum, loan) => sum + loan.amount, 0);
    const totalPayments = payments.reduce((sum, payment) => sum + payment.amount, 0);
    const recentPayments = payments
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 5);

    const dashboardData = {
      user,
      summary: {
        totalLoans,
        activeLoans,
        totalAmount,
        totalPayments,
        remainingBalance: totalAmount - totalPayments
      },
      recentPayments,
      loans: loans.slice(0, 5) // Recent loans
    };

    res.json(dashboardData);
  } catch (error) {
    console.error('Error fetching user dashboard:', error);
    res.status(500).json({ message: 'Failed to fetch user dashboard' });
  }
});

// Get all users (admin only)
router.get('/', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }

    const { page = 1, limit = 10, search, status } = req.query;
    const skip = (page - 1) * limit;

    const filter = {};
    if (search) {
      filter.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }
    if (status) {
      filter.status = status;
    }

    const users = await User.find(filter)
      .select('-password')
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    const total = await User.countDocuments(filter);

    res.json({
      users,
      pagination: {
        current: parseInt(page),
        total: Math.ceil(total / limit),
        totalUsers: total
      }
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Failed to fetch users' });
  }
});

// Update user status (admin only)
router.put('/status/:userId', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }

    const { userId } = req.params;
    const { status } = req.body;

    const user = await User.findByIdAndUpdate(
      userId,
      { status },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error('Error updating user status:', error);
    res.status(500).json({ message: 'Failed to update user status' });
  }
});

module.exports = router; 
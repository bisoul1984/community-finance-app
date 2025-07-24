const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Notification = require('../models/Notification');
const emailService = require('../services/emailService');
const User = require('../models/User');

// Get user notifications
router.get('/', auth, async (req, res) => {
  try {
    const notifications = await Notification.find({ userId: req.user.id })
      .sort({ createdAt: -1 })
      .limit(50);

    res.json(notifications);
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({ message: 'Failed to fetch notifications' });
  }
});

// Mark notification as read
router.patch('/:id/read', auth, async (req, res) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      { read: true },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    res.json(notification);
  } catch (error) {
    console.error('Error marking notification as read:', error);
    res.status(500).json({ message: 'Failed to update notification' });
  }
});

// Mark all notifications as read
router.patch('/read-all', auth, async (req, res) => {
  try {
    await Notification.updateMany(
      { userId: req.user.id, read: false },
      { read: true }
    );

    res.json({ message: 'All notifications marked as read' });
  } catch (error) {
    console.error('Error marking all notifications as read:', error);
    res.status(500).json({ message: 'Failed to update notifications' });
  }
});

// Get unread notification count
router.get('/unread-count', auth, async (req, res) => {
  try {
    const count = await Notification.countDocuments({
      userId: req.user.id,
      read: false
    });

    res.json({ count });
  } catch (error) {
    console.error('Error getting unread count:', error);
    res.status(500).json({ message: 'Failed to get unread count' });
  }
});

// Delete notification
router.delete('/:id', auth, async (req, res) => {
  try {
    const notification = await Notification.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id
    });

    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    res.json({ message: 'Notification deleted successfully' });
  } catch (error) {
    console.error('Error deleting notification:', error);
    res.status(500).json({ message: 'Failed to delete notification' });
  }
});

// Test email endpoint (for development)
router.post('/test-email', auth, async (req, res) => {
  try {
    const { emailType, testData } = req.body;
    
    // Get user info
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    let emailResult;
    
    switch (emailType) {
      case 'welcome':
        emailResult = await emailService.sendWelcomeEmail(user.email, user.name);
        break;
      case 'loanSubmitted':
        emailResult = await emailService.sendLoanSubmittedEmail(
          user.email, 
          user.name, 
          testData.amount || 1000, 
          testData.loanId || 'TEST123'
        );
        break;
      case 'loanApproved':
        emailResult = await emailService.sendLoanApprovedEmail(
          user.email,
          user.name,
          testData.amount || 1000,
          testData.loanId || 'TEST123',
          testData.terms || { interestRate: 5, duration: 12, monthlyPayment: 100 }
        );
        break;
      case 'repaymentReminder':
        emailResult = await emailService.sendRepaymentReminderEmail(
          user.email,
          user.name,
          testData.amount || 100,
          testData.dueDate || new Date(),
          testData.loanId || 'TEST123'
        );
        break;
      default:
        return res.status(400).json({ message: 'Invalid email type' });
    }

    // Save notification record
    const notification = new Notification({
      userId: req.user.id,
      type: emailType,
      email: user.email,
      subject: `Test ${emailType} email`,
      status: 'sent',
      sentAt: new Date(),
      metadata: { test: true, ...testData }
    });
    await notification.save();

    res.json({ 
      message: 'Test email sent successfully',
      emailResult,
      notification
    });
  } catch (error) {
    console.error('Error sending test email:', error);
    res.status(500).json({ message: 'Failed to send test email', error: error.message });
  }
});

// Update notification settings
router.put('/settings/:userId', auth, async (req, res) => {
  try {
    const { userId } = req.params;
    const updates = req.body;
    // Only allow the user themselves or an admin to update
    if (req.user.id !== userId && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }
    const user = await User.findByIdAndUpdate(userId, updates, { new: true });
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ message: 'Settings updated', notificationPreferences: user.notificationPreferences || {}, smsNotifications: user.smsNotifications, phone: user.phone, emailNotifications: user.emailNotifications });
  } catch (err) {
    console.error('Error updating notification settings:', err);
    res.status(500).json({ message: 'Failed to update notification settings' });
  }
});

module.exports = router; 
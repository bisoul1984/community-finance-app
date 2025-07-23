const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');
const Verification = require('../models/Verification');

// Get users available for verification (excluding current user and already verified users)
router.get('/users-for-verification', auth, async (req, res) => {
  try {
    console.log('Getting users for verification, current user:', req.user.id);
    
    // Find users that the current user hasn't verified yet
    const verifiedUserIds = await Verification.find({ 
      verifier: req.user.id 
    }).distinct('verifiedUser');
    
    // Get all users except current user and already verified users
    const users = await User.find({
      _id: { 
        $nin: [req.user.id, ...verifiedUserIds] 
      }
    }).select('-password');
    
    console.log(`Found ${users.length} users for verification`);
    
    // Add activity statistics for each user
    const usersWithStats = await Promise.all(users.map(async (user) => {
      const loansRequested = await require('../models/Loan').countDocuments({ borrower: user._id });
      const loansFunded = await require('../models/Loan').countDocuments({ 
        borrower: user._id, 
        status: { $in: ['funded', 'active', 'completed'] } 
      });
      const completedLoans = await require('../models/Loan').countDocuments({ 
        borrower: user._id, 
        status: 'completed' 
      });
      const verificationsReceived = await Verification.countDocuments({ 
        verifiedUser: user._id, 
        isVerified: true 
      });
      
      return {
        ...user.toObject(),
        loansRequested,
        loansFunded,
        completedLoans,
        verificationsReceived
      };
    }));
    
    res.json(usersWithStats);
  } catch (error) {
    console.error('Error getting users for verification:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Verify a user
router.post('/verify/:userId', auth, async (req, res) => {
  try {
    const { userId } = req.params;
    const { isVerified, notes } = req.body;
    
    console.log(`User ${req.user.id} verifying user ${userId} with result:`, isVerified);
    
    // Check if user is trying to verify themselves
    if (userId === req.user.id) {
      return res.status(400).json({ message: 'Cannot verify yourself' });
    }
    
    // Check if user exists
    const userToVerify = await User.findById(userId);
    if (!userToVerify) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Check if already verified by this user
    const existingVerification = await Verification.findOne({
      verifier: req.user.id,
      verifiedUser: userId
    });
    
    if (existingVerification) {
      return res.status(400).json({ message: 'You have already verified this user' });
    }
    
    // Create verification record
    const verification = new Verification({
      verifier: req.user.id,
      verifiedUser: userId,
      isVerified,
      notes: notes || '',
      date: new Date()
    });
    
    await verification.save();
    
    // Update user's reputation if verified
    if (isVerified) {
      const verificationCount = await Verification.countDocuments({
        verifiedUser: userId,
        isVerified: true
      });
      
      // Calculate reputation based on verifications (max 100)
      const reputation = Math.min(verificationCount * 10, 100);
      
      await User.findByIdAndUpdate(userId, { reputation });
    }
    
    console.log(`Verification saved successfully`);
    res.json({ message: 'Verification submitted successfully' });
  } catch (error) {
    console.error('Error verifying user:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user profile with verification details
router.get('/profile/:userId', auth, async (req, res) => {
  try {
    const { userId } = req.params;
    
    const user = await User.findById(userId).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Get verification statistics
    const verificationsReceived = await Verification.countDocuments({
      verifiedUser: userId,
      isVerified: true
    });
    
    const verificationsGiven = await Verification.countDocuments({
      verifier: userId
    });
    
    // Get loan statistics
    const loansRequested = await require('../models/Loan').countDocuments({ borrower: userId });
    const loansFunded = await require('../models/Loan').countDocuments({ 
      borrower: userId, 
      status: { $in: ['funded', 'active', 'completed'] } 
    });
    const completedLoans = await require('../models/Loan').countDocuments({ 
      borrower: userId, 
      status: 'completed' 
    });
    
    const profile = {
      ...user.toObject(),
      verificationsReceived,
      verificationsGiven,
      loansRequested,
      loansFunded,
      completedLoans
    };
    
    res.json(profile);
  } catch (error) {
    console.error('Error getting user profile:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update user profile
router.put('/profile', auth, async (req, res) => {
  try {
    const { name, email, bio } = req.body;
    
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { name, email, bio },
      { new: true }
    ).select('-password');
    
    res.json(updatedUser);
  } catch (error) {
    console.error('Error updating user profile:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 
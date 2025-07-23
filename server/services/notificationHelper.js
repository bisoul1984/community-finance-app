const emailService = require('./emailService');
const Notification = require('../models/Notification');
const User = require('../models/User');

class NotificationHelper {
  // Send loan submitted notification
  static async sendLoanSubmittedNotification(userId, loanAmount, loanId) {
    try {
      const user = await User.findById(userId);
      if (!user || !user.emailPreferences.loanUpdates) return;

      await emailService.sendLoanSubmittedEmail(user.email, user.name, loanAmount, loanId);
      
      // Save notification record
      await new Notification({
        userId,
        type: 'loanSubmitted',
        email: user.email,
        subject: 'Loan Application Submitted Successfully',
        status: 'sent',
        sentAt: new Date(),
        metadata: { loanAmount, loanId }
      }).save();

      console.log(`Loan submitted notification sent to ${user.email}`);
    } catch (error) {
      console.error('Error sending loan submitted notification:', error);
    }
  }

  // Send loan approved notification
  static async sendLoanApprovedNotification(userId, loanAmount, loanId, terms) {
    try {
      const user = await User.findById(userId);
      if (!user || !user.emailPreferences.loanUpdates) return;

      await emailService.sendLoanApprovedEmail(user.email, user.name, loanAmount, loanId, terms);
      
      // Save notification record
      await new Notification({
        userId,
        type: 'loanApproved',
        email: user.email,
        subject: 'Congratulations! Your Loan Has Been Approved',
        status: 'sent',
        sentAt: new Date(),
        metadata: { loanAmount, loanId, terms }
      }).save();

      console.log(`Loan approved notification sent to ${user.email}`);
    } catch (error) {
      console.error('Error sending loan approved notification:', error);
    }
  }

  // Send loan rejected notification
  static async sendLoanRejectedNotification(userId, reason) {
    try {
      const user = await User.findById(userId);
      if (!user || !user.emailPreferences.loanUpdates) return;

      await emailService.sendLoanRejectedEmail(user.email, user.name, reason);
      
      // Save notification record
      await new Notification({
        userId,
        type: 'loanRejected',
        email: user.email,
        subject: 'Loan Application Update',
        status: 'sent',
        sentAt: new Date(),
        metadata: { reason }
      }).save();

      console.log(`Loan rejected notification sent to ${user.email}`);
    } catch (error) {
      console.error('Error sending loan rejected notification:', error);
    }
  }

  // Send repayment reminder notification
  static async sendRepaymentReminderNotification(userId, amount, dueDate, loanId) {
    try {
      const user = await User.findById(userId);
      if (!user || !user.emailPreferences.paymentReminders) return;

      await emailService.sendRepaymentReminderEmail(user.email, user.name, amount, dueDate, loanId);
      
      // Save notification record
      await new Notification({
        userId,
        type: 'repaymentReminder',
        email: user.email,
        subject: 'Payment Reminder - Action Required',
        status: 'sent',
        sentAt: new Date(),
        metadata: { amount, dueDate, loanId }
      }).save();

      console.log(`Repayment reminder sent to ${user.email}`);
    } catch (error) {
      console.error('Error sending repayment reminder:', error);
    }
  }

  // Send payment received notification
  static async sendPaymentReceivedNotification(userId, amount, loanId, remainingBalance) {
    try {
      const user = await User.findById(userId);
      if (!user || !user.emailPreferences.paymentReminders) return;

      await emailService.sendPaymentReceivedEmail(user.email, user.name, amount, loanId, remainingBalance);
      
      // Save notification record
      await new Notification({
        userId,
        type: 'paymentReceived',
        email: user.email,
        subject: 'Payment Received - Thank You!',
        status: 'sent',
        sentAt: new Date(),
        metadata: { amount, loanId, remainingBalance }
      }).save();

      console.log(`Payment received notification sent to ${user.email}`);
    } catch (error) {
      console.error('Error sending payment received notification:', error);
    }
  }

  // Send loan fully repaid notification
  static async sendLoanRepaidNotification(userId, loanId, totalAmount) {
    try {
      const user = await User.findById(userId);
      if (!user || !user.emailPreferences.loanUpdates) return;

      await emailService.sendLoanRepaidEmail(user.email, user.name, loanId, totalAmount);
      
      // Save notification record
      await new Notification({
        userId,
        type: 'loanRepaid',
        email: user.email,
        subject: 'Congratulations! Your Loan is Fully Repaid',
        status: 'sent',
        sentAt: new Date(),
        metadata: { loanId, totalAmount }
      }).save();

      console.log(`Loan repaid notification sent to ${user.email}`);
    } catch (error) {
      console.error('Error sending loan repaid notification:', error);
    }
  }

  // Send welcome email
  static async sendWelcomeEmail(userId) {
    try {
      const user = await User.findById(userId);
      if (!user) return;

      await emailService.sendWelcomeEmail(user.email, user.name);
      
      // Save notification record
      await new Notification({
        userId,
        type: 'welcomeEmail',
        email: user.email,
        subject: 'Welcome to Our Microloan Platform!',
        status: 'sent',
        sentAt: new Date()
      }).save();

      console.log(`Welcome email sent to ${user.email}`);
    } catch (error) {
      console.error('Error sending welcome email:', error);
    }
  }

  // Send account verification email
  static async sendAccountVerificationEmail(userId, verificationCode) {
    try {
      const user = await User.findById(userId);
      if (!user) return;

      await emailService.sendAccountVerificationEmail(user.email, user.name, verificationCode);
      
      // Save notification record
      await new Notification({
        userId,
        type: 'accountVerification',
        email: user.email,
        subject: 'Verify Your Email Address',
        status: 'sent',
        sentAt: new Date(),
        metadata: { verificationCode }
      }).save();

      console.log(`Account verification email sent to ${user.email}`);
    } catch (error) {
      console.error('Error sending account verification email:', error);
    }
  }

  // Send password reset email
  static async sendPasswordResetEmail(userId, resetToken) {
    try {
      const user = await User.findById(userId);
      if (!user) return;

      await emailService.sendPasswordResetEmail(user.email, user.name, resetToken);
      
      // Save notification record
      await new Notification({
        userId,
        type: 'passwordReset',
        email: user.email,
        subject: 'Password Reset Request',
        status: 'sent',
        sentAt: new Date(),
        metadata: { resetToken }
      }).save();

      console.log(`Password reset email sent to ${user.email}`);
    } catch (error) {
      console.error('Error sending password reset email:', error);
    }
  }

  // Bulk send repayment reminders (for scheduled tasks)
  static async sendBulkRepaymentReminders() {
    try {
      const Loan = require('../models/Loan');
      const today = new Date();
      const threeDaysFromNow = new Date(today.getTime() + (3 * 24 * 60 * 60 * 1000));

      // Find loans with payments due in the next 3 days
      const loansDueSoon = await Loan.find({
        status: 'active',
        nextPaymentDate: {
          $gte: today,
          $lte: threeDaysFromNow
        }
      }).populate('borrower');

      for (const loan of loansDueSoon) {
        if (loan.borrower && loan.borrower.emailPreferences.paymentReminders) {
          await this.sendRepaymentReminderNotification(
            loan.borrower._id,
            loan.monthlyPayment,
            loan.nextPaymentDate,
            loan._id
          );
        }
      }

      console.log(`Sent ${loansDueSoon.length} repayment reminders`);
    } catch (error) {
      console.error('Error sending bulk repayment reminders:', error);
    }
  }
}

module.exports = NotificationHelper; 
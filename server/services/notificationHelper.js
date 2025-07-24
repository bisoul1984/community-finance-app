const emailService = require('./emailService');
const Notification = require('../models/Notification');
const User = require('../models/User');
const twilio = require('twilio');
const twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
const TWILIO_FROM = process.env.TWILIO_FROM;

async function sendSMS(to, message) {
  if (!to || !message) return;
  try {
    await twilioClient.messages.create({
      body: message,
      from: TWILIO_FROM,
      to
    });
    console.log('SMS sent to', to);
  } catch (err) {
    console.error('Error sending SMS:', err);
  }
}

class NotificationHelper {
  // Send loan submitted notification
  static async sendLoanSubmittedNotification(userId, loanAmount, loanId, io) {
    try {
      const user = await User.findById(userId);
      if (!user || !user.emailPreferences.loanUpdates) return;

      await emailService.sendLoanSubmittedEmail(user.email, user.name, loanAmount, loanId);
      const notif = await new Notification({
        userId,
        type: 'loanSubmitted',
        email: user.email,
        subject: 'Loan Application Submitted Successfully',
        status: 'sent',
        sentAt: new Date(),
        metadata: { loanAmount, loanId }
      }).save();
      if (!io && global.io) io = global.io;
      if (io) io.to(userId.toString()).emit('notification', notif);
      console.log(`Loan submitted notification sent to ${user.email}`);
      if (user.smsNotifications && user.phone) {
        await sendSMS(user.phone, `Your loan application for $${loanAmount} has been submitted. We will notify you once it is reviewed.`);
      }
    } catch (error) {
      console.error('Error sending loan submitted notification:', error);
    }
  }

  // Send loan approved notification
  static async sendLoanApprovedNotification(userId, loanAmount, loanId, terms, io) {
    try {
      const user = await User.findById(userId);
      if (!user || !user.emailPreferences.loanUpdates) return;

      await emailService.sendLoanApprovedEmail(user.email, user.name, loanAmount, loanId, terms);
      const notif = await new Notification({
        userId,
        type: 'loanApproved',
        email: user.email,
        subject: 'Congratulations! Your Loan Has Been Approved',
        status: 'sent',
        sentAt: new Date(),
        metadata: { loanAmount, loanId, terms }
      }).save();
      if (!io && global.io) io = global.io;
      if (io) io.to(userId.toString()).emit('notification', notif);
      console.log(`Loan approved notification sent to ${user.email}`);
      if (user.smsNotifications && user.phone) {
        await sendSMS(user.phone, `Your loan has been approved! Amount: $${loanAmount}.`);
      }
    } catch (error) {
      console.error('Error sending loan approved notification:', error);
    }
  }

  // Send loan rejected notification
  static async sendLoanRejectedNotification(userId, reason, io) {
    try {
      const user = await User.findById(userId);
      if (!user || !user.emailPreferences.loanUpdates) return;

      await emailService.sendLoanRejectedEmail(user.email, user.name, reason);
      const notif = await new Notification({
        userId,
        type: 'loanRejected',
        email: user.email,
        subject: 'Loan Application Update',
        status: 'sent',
        sentAt: new Date(),
        metadata: { reason }
      }).save();
      if (!io && global.io) io = global.io;
      if (io) io.to(userId.toString()).emit('notification', notif);
      console.log(`Loan rejected notification sent to ${user.email}`);
      if (user.smsNotifications && user.phone) {
        await sendSMS(user.phone, `Your loan application was rejected. Reason: ${reason}`);
      }
    } catch (error) {
      console.error('Error sending loan rejected notification:', error);
    }
  }

  // Send repayment reminder notification
  static async sendRepaymentReminderNotification(userId, amount, dueDate, loanId, io) {
    try {
      const user = await User.findById(userId);
      if (!user || !user.emailPreferences.paymentReminders) return;

      await emailService.sendRepaymentReminderEmail(user.email, user.name, amount, dueDate, loanId);
      const notif = await new Notification({
        userId,
        type: 'repaymentReminder',
        email: user.email,
        subject: 'Payment Reminder - Action Required',
        status: 'sent',
        sentAt: new Date(),
        metadata: { amount, dueDate, loanId }
      }).save();
      if (!io && global.io) io = global.io;
      if (io) io.to(userId.toString()).emit('notification', notif);
      console.log(`Repayment reminder sent to ${user.email}`);
      if (user.smsNotifications && user.phone) {
        await sendSMS(user.phone, `Repayment reminder: $${amount} due on ${new Date(dueDate).toLocaleDateString()}. Loan ID: ${loanId}`);
      }
    } catch (error) {
      console.error('Error sending repayment reminder:', error);
    }
  }

  // Send payment received notification
  static async sendPaymentReceivedNotification(userId, amount, loanId, remainingBalance, io) {
    try {
      const user = await User.findById(userId);
      if (!user || !user.emailPreferences.paymentReminders) return;

      await emailService.sendPaymentReceivedEmail(user.email, user.name, amount, loanId, remainingBalance);
      const notif = await new Notification({
        userId,
        type: 'paymentReceived',
        email: user.email,
        subject: 'Payment Received - Thank You!',
        status: 'sent',
        sentAt: new Date(),
        metadata: { amount, loanId, remainingBalance }
      }).save();
      if (!io && global.io) io = global.io;
      if (io) io.to(userId.toString()).emit('notification', notif);
      console.log(`Payment received notification sent to ${user.email}`);
      if (user.smsNotifications && user.phone) {
        await sendSMS(user.phone, `Payment received: $${amount} for Loan ID: ${loanId}. Remaining balance: $${remainingBalance}`);
      }
    } catch (error) {
      console.error('Error sending payment received notification:', error);
    }
  }

  // Send loan fully repaid notification
  static async sendLoanRepaidNotification(userId, loanId, totalAmount, io) {
    try {
      const user = await User.findById(userId);
      if (!user || !user.emailPreferences.loanUpdates) return;

      await emailService.sendLoanRepaidEmail(user.email, user.name, loanId, totalAmount);
      const notif = await new Notification({
        userId,
        type: 'loanRepaid',
        email: user.email,
        subject: 'Congratulations! Your Loan is Fully Repaid',
        status: 'sent',
        sentAt: new Date(),
        metadata: { loanId, totalAmount }
      }).save();
      if (!io && global.io) io = global.io;
      if (io) io.to(userId.toString()).emit('notification', notif);
      console.log(`Loan repaid notification sent to ${user.email}`);
      if (user.smsNotifications && user.phone) {
        await sendSMS(user.phone, `Congratulations! Your loan (ID: ${loanId}) is fully repaid.`);
      }
    } catch (error) {
      console.error('Error sending loan repaid notification:', error);
    }
  }

  // Send welcome email
  static async sendWelcomeEmail(userId, io) {
    try {
      const user = await User.findById(userId);
      if (!user) return;

      await emailService.sendWelcomeEmail(user.email, user.name);
      const notif = await new Notification({
        userId,
        type: 'welcomeEmail',
        email: user.email,
        subject: 'Welcome to Our Microloan Platform!',
        status: 'sent',
        sentAt: new Date()
      }).save();
      if (!io && global.io) io = global.io;
      if (io) io.to(userId.toString()).emit('notification', notif);
      console.log(`Welcome email sent to ${user.email}`);
    } catch (error) {
      console.error('Error sending welcome email:', error);
    }
  }

  // Send account verification email
  static async sendAccountVerificationEmail(userId, verificationCode, io) {
    try {
      const user = await User.findById(userId);
      if (!user) return;

      await emailService.sendAccountVerificationEmail(user.email, user.name, verificationCode);
      const notif = await new Notification({
        userId,
        type: 'accountVerification',
        email: user.email,
        subject: 'Verify Your Email Address',
        status: 'sent',
        sentAt: new Date(),
        metadata: { verificationCode }
      }).save();
      if (!io && global.io) io = global.io;
      if (io) io.to(userId.toString()).emit('notification', notif);
      console.log(`Account verification email sent to ${user.email}`);
      if (user.smsNotifications && user.phone) {
        await sendSMS(user.phone, `Verify your account using this code: ${verificationCode}`);
      }
    } catch (error) {
      console.error('Error sending account verification email:', error);
    }
  }

  // Send password reset email
  static async sendPasswordResetEmail(userId, resetToken, io) {
    try {
      const user = await User.findById(userId);
      if (!user) return;

      await emailService.sendPasswordResetEmail(user.email, user.name, resetToken);
      const notif = await new Notification({
        userId,
        type: 'passwordReset',
        email: user.email,
        subject: 'Password Reset Request',
        status: 'sent',
        sentAt: new Date(),
        metadata: { resetToken }
      }).save();
      if (!io && global.io) io = global.io;
      if (io) io.to(userId.toString()).emit('notification', notif);
      console.log(`Password reset email sent to ${user.email}`);
      if (user.smsNotifications && user.phone) {
        await sendSMS(user.phone, `Password reset requested. Use this code: ${resetToken}`);
      }
    } catch (error) {
      console.error('Error sending password reset email:', error);
    }
  }

  // Bulk send repayment reminders (for scheduled tasks)
  static async sendBulkRepaymentReminders(io) {
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
            loan._id,
            io
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
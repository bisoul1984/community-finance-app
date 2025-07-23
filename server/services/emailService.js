const nodemailer = require('nodemailer');

// Email configuration
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER || 'your-email@gmail.com',
    pass: process.env.EMAIL_PASSWORD || 'your-app-password'
  }
});

// Email templates
const emailTemplates = {
  // Loan application submitted
  loanSubmitted: (userName, loanAmount, loanId) => ({
    subject: 'Loan Application Submitted Successfully',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2c3e50;">Loan Application Submitted</h2>
        <p>Dear ${userName},</p>
        <p>Your loan application has been submitted successfully!</p>
        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #27ae60; margin-top: 0;">Application Details:</h3>
          <p><strong>Loan Amount:</strong> $${loanAmount}</p>
          <p><strong>Application ID:</strong> ${loanId}</p>
          <p><strong>Status:</strong> Under Review</p>
        </div>
        <p>We will review your application and notify you of the decision within 24-48 hours.</p>
        <p>Thank you for choosing our platform!</p>
        <hr style="margin: 30px 0;">
        <p style="color: #7f8c8d; font-size: 12px;">This is an automated message. Please do not reply to this email.</p>
      </div>
    `
  }),

  // Loan approved
  loanApproved: (userName, loanAmount, loanId, terms) => ({
    subject: 'Congratulations! Your Loan Has Been Approved',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #27ae60;">🎉 Loan Approved!</h2>
        <p>Dear ${userName},</p>
        <p>Great news! Your loan application has been approved.</p>
        <div style="background-color: #e8f5e8; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #27ae60;">
          <h3 style="color: #27ae60; margin-top: 0;">Loan Details:</h3>
          <p><strong>Loan Amount:</strong> $${loanAmount}</p>
          <p><strong>Loan ID:</strong> ${loanId}</p>
          <p><strong>Interest Rate:</strong> ${terms.interestRate}%</p>
          <p><strong>Term:</strong> ${terms.duration} months</p>
          <p><strong>Monthly Payment:</strong> $${terms.monthlyPayment}</p>
        </div>
        <p>Your funds will be transferred to your account within 1-2 business days.</p>
        <p>Please log in to your account to view the complete loan details and repayment schedule.</p>
        <hr style="margin: 30px 0;">
        <p style="color: #7f8c8d; font-size: 12px;">This is an automated message. Please do not reply to this email.</p>
      </div>
    `
  }),

  // Loan rejected
  loanRejected: (userName, reason) => ({
    subject: 'Loan Application Update',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #e74c3c;">Loan Application Update</h2>
        <p>Dear ${userName},</p>
        <p>We regret to inform you that your loan application could not be approved at this time.</p>
        <div style="background-color: #fdf2f2; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #e74c3c;">
          <h3 style="color: #e74c3c; margin-top: 0;">Reason:</h3>
          <p>${reason}</p>
        </div>
        <p>We encourage you to:</p>
        <ul>
          <li>Review your application information</li>
          <li>Improve your credit score if applicable</li>
          <li>Consider applying for a smaller loan amount</li>
          <li>Contact our support team for guidance</li>
        </ul>
        <p>You may reapply after 30 days.</p>
        <hr style="margin: 30px 0;">
        <p style="color: #7f8c8d; font-size: 12px;">This is an automated message. Please do not reply to this email.</p>
      </div>
    `
  }),

  // Repayment reminder
  repaymentReminder: (userName, amount, dueDate, loanId) => ({
    subject: 'Payment Reminder - Action Required',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #f39c12;">Payment Reminder</h2>
        <p>Dear ${userName},</p>
        <p>This is a friendly reminder that your loan payment is due soon.</p>
        <div style="background-color: #fff3cd; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #f39c12;">
          <h3 style="color: #f39c12; margin-top: 0;">Payment Details:</h3>
          <p><strong>Amount Due:</strong> $${amount}</p>
          <p><strong>Due Date:</strong> ${new Date(dueDate).toLocaleDateString()}</p>
          <p><strong>Loan ID:</strong> ${loanId}</p>
        </div>
        <p>Please log in to your account to make the payment before the due date to avoid late fees.</p>
        <p>If you have already made the payment, please disregard this reminder.</p>
        <hr style="margin: 30px 0;">
        <p style="color: #7f8c8d; font-size: 12px;">This is an automated message. Please do not reply to this email.</p>
      </div>
    `
  }),

  // Payment received
  paymentReceived: (userName, amount, loanId, remainingBalance) => ({
    subject: 'Payment Received - Thank You!',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #27ae60;">Payment Received</h2>
        <p>Dear ${userName},</p>
        <p>Thank you! We have received your payment.</p>
        <div style="background-color: #e8f5e8; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #27ae60;">
          <h3 style="color: #27ae60; margin-top: 0;">Payment Details:</h3>
          <p><strong>Amount Paid:</strong> $${amount}</p>
          <p><strong>Loan ID:</strong> ${loanId}</p>
          <p><strong>Remaining Balance:</strong> $${remainingBalance}</p>
          <p><strong>Payment Date:</strong> ${new Date().toLocaleDateString()}</p>
        </div>
        <p>Your payment has been processed successfully. Keep up the great work!</p>
        <hr style="margin: 30px 0;">
        <p style="color: #7f8c8d; font-size: 12px;">This is an automated message. Please do not reply to this email.</p>
      </div>
    `
  }),

  // Loan fully repaid
  loanRepaid: (userName, loanId, totalAmount) => ({
    subject: 'Congratulations! Your Loan is Fully Repaid',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #27ae60;">🎉 Loan Fully Repaid!</h2>
        <p>Dear ${userName},</p>
        <p>Congratulations! You have successfully repaid your loan in full.</p>
        <div style="background-color: #e8f5e8; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #27ae60;">
          <h3 style="color: #27ae60; margin-top: 0;">Loan Summary:</h3>
          <p><strong>Loan ID:</strong> ${loanId}</p>
          <p><strong>Total Amount Repaid:</strong> $${totalAmount}</p>
          <p><strong>Completion Date:</strong> ${new Date().toLocaleDateString()}</p>
        </div>
        <p>Your credit score and reputation have been positively impacted. You're now eligible for future loans with better terms!</p>
        <p>Thank you for being a responsible borrower!</p>
        <hr style="margin: 30px 0;">
        <p style="color: #7f8c8d; font-size: 12px;">This is an automated message. Please do not reply to this email.</p>
      </div>
    `
  }),

  // Account verification
  accountVerification: (userName, verificationCode) => ({
    subject: 'Verify Your Email Address',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #3498db;">Verify Your Email</h2>
        <p>Dear ${userName},</p>
        <p>Please verify your email address to complete your account registration.</p>
        <div style="background-color: #ebf3fd; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #3498db;">
          <h3 style="color: #3498db; margin-top: 0;">Verification Code:</h3>
          <p style="font-size: 24px; font-weight: bold; color: #2c3e50; text-align: center; letter-spacing: 5px;">${verificationCode}</p>
        </div>
        <p>Enter this code in the verification field on our website to activate your account.</p>
        <p>This code will expire in 10 minutes.</p>
        <hr style="margin: 30px 0;">
        <p style="color: #7f8c8d; font-size: 12px;">This is an automated message. Please do not reply to this email.</p>
      </div>
    `
  }),

  // Password reset
  passwordReset: (userName, resetToken) => ({
    subject: 'Password Reset Request',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #e74c3c;">Password Reset</h2>
        <p>Dear ${userName},</p>
        <p>We received a request to reset your password.</p>
        <div style="background-color: #fdf2f2; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #e74c3c;">
          <h3 style="color: #e74c3c; margin-top: 0;">Reset Token:</h3>
          <p style="font-size: 18px; font-weight: bold; color: #2c3e50; text-align: center; letter-spacing: 3px;">${resetToken}</p>
        </div>
        <p>Use this token to reset your password on our website.</p>
        <p>If you didn't request this reset, please ignore this email and your password will remain unchanged.</p>
        <p>This token will expire in 1 hour.</p>
        <hr style="margin: 30px 0;">
        <p style="color: #7f8c8d; font-size: 12px;">This is an automated message. Please do not reply to this email.</p>
      </div>
    `
  }),

  // Welcome email
  welcomeEmail: (userName) => ({
    subject: 'Welcome to Our Microloan Platform!',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2c3e50;">Welcome to Our Community!</h2>
        <p>Dear ${userName},</p>
        <p>Welcome to our microloan and community finance platform! We're excited to have you as part of our community.</p>
        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #2c3e50; margin-top: 0;">Getting Started:</h3>
          <ul>
            <li>Complete your profile information</li>
            <li>Explore loan opportunities</li>
            <li>Connect with the community</li>
            <li>Build your reputation</li>
          </ul>
        </div>
        <p>If you have any questions, our support team is here to help!</p>
        <p>Best regards,<br>The Microloan Team</p>
        <hr style="margin: 30px 0;">
        <p style="color: #7f8c8d; font-size: 12px;">This is an automated message. Please do not reply to this email.</p>
      </div>
    `
  })
};

// Email service class
class EmailService {
  constructor() {
    this.transporter = transporter;
    this.templates = emailTemplates;
  }

  // Send email method
  async sendEmail(to, templateName, templateData) {
    try {
      const template = this.templates[templateName];
      if (!template) {
        throw new Error(`Email template '${templateName}' not found`);
      }

      const emailContent = template(...templateData);
      
      const mailOptions = {
        from: process.env.EMAIL_USER || 'your-email@gmail.com',
        to: to,
        subject: emailContent.subject,
        html: emailContent.html
      };

      const result = await this.transporter.sendMail(mailOptions);
      console.log(`Email sent successfully to ${to}: ${templateName}`);
      return result;
    } catch (error) {
      console.error('Email sending failed:', error);
      throw error;
    }
  }

  // Specific email methods for different events
  async sendLoanSubmittedEmail(userEmail, userName, loanAmount, loanId) {
    return this.sendEmail(userEmail, 'loanSubmitted', [userName, loanAmount, loanId]);
  }

  async sendLoanApprovedEmail(userEmail, userName, loanAmount, loanId, terms) {
    return this.sendEmail(userEmail, 'loanApproved', [userName, loanAmount, loanId, terms]);
  }

  async sendLoanRejectedEmail(userEmail, userName, reason) {
    return this.sendEmail(userEmail, 'loanRejected', [userName, reason]);
  }

  async sendRepaymentReminderEmail(userEmail, userName, amount, dueDate, loanId) {
    return this.sendEmail(userEmail, 'repaymentReminder', [userName, amount, dueDate, loanId]);
  }

  async sendPaymentReceivedEmail(userEmail, userName, amount, loanId, remainingBalance) {
    return this.sendEmail(userEmail, 'paymentReceived', [userName, amount, loanId, remainingBalance]);
  }

  async sendLoanRepaidEmail(userEmail, userName, loanId, totalAmount) {
    return this.sendEmail(userEmail, 'loanRepaid', [userName, loanId, totalAmount]);
  }

  async sendAccountVerificationEmail(userEmail, userName, verificationCode) {
    return this.sendEmail(userEmail, 'accountVerification', [userName, verificationCode]);
  }

  async sendPasswordResetEmail(userEmail, userName, resetToken) {
    return this.sendEmail(userEmail, 'passwordReset', [userName, resetToken]);
  }

  async sendWelcomeEmail(userEmail, userName) {
    return this.sendEmail(userEmail, 'welcomeEmail', [userName]);
  }
}

module.exports = new EmailService(); 
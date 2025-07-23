# Email Notification Setup Guide

This guide will help you configure email notifications for the Microloan & Community Finance application.

## Prerequisites

- Gmail account (recommended for easy setup)
- Node.js application running

## Gmail Setup

### 1. Enable 2-Factor Authentication
1. Go to your Google Account settings
2. Navigate to Security
3. Enable 2-Step Verification

### 2. Generate App Password
1. Go to Google Account settings
2. Navigate to Security
3. Under "2-Step Verification", click on "App passwords"
4. Select "Mail" and "Other (Custom name)"
5. Enter "Microloan App" as the name
6. Copy the generated 16-character password

### 3. Environment Configuration
Create or update your `.env` file in the `server` directory:

```env
# Email Configuration
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-16-character-app-password

# Other configurations...
MONGO_URI=mongodb://localhost:27017/microloan
JWT_SECRET=your-jwt-secret
PORT=5000
```

## Email Templates

The application includes the following email templates:

### Loan Management
- **Loan Submitted**: Confirmation when a loan application is submitted
- **Loan Approved**: Notification when a loan is approved
- **Loan Rejected**: Notification when a loan is rejected with reason
- **Loan Repaid**: Congratulations when a loan is fully repaid

### Payment Notifications
- **Payment Reminder**: Reminder for upcoming payments
- **Payment Received**: Confirmation when a payment is received

### Account Management
- **Welcome Email**: Welcome message for new users
- **Email Verification**: Verification code for account activation
- **Password Reset**: Reset token for password recovery

## Testing Email Notifications

### 1. Test Endpoint
Use the test endpoint to send sample emails:

```bash
POST http://localhost:5000/api/notifications/test-email
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json

{
  "emailType": "welcome",
  "testData": {
    "amount": 1000,
    "loanId": "TEST123"
  }
}
```

### 2. Available Test Types
- `welcome` - Welcome email
- `loanSubmitted` - Loan application submitted
- `loanApproved` - Loan approved
- `repaymentReminder` - Payment reminder

### 3. Frontend Testing
The notification center component will automatically fetch and display notifications.

## Email Preferences

Users can control their email preferences through their account settings:

- **Loan Updates**: Notifications about loan status changes
- **Payment Reminders**: Reminders for upcoming payments
- **Account Alerts**: Important account notifications
- **Marketing Emails**: Promotional content (disabled by default)

## Troubleshooting

### Common Issues

1. **Authentication Failed**
   - Ensure you're using an App Password, not your regular password
   - Verify 2-factor authentication is enabled

2. **Emails Not Sending**
   - Check your `.env` file configuration
   - Verify the email service is running
   - Check server logs for error messages

3. **Emails Going to Spam**
   - Add your email to the recipient's contacts
   - Check spam folder
   - Consider using a dedicated email service for production

### Production Considerations

For production deployment, consider:

1. **Email Service Providers**
   - SendGrid
   - Mailgun
   - Amazon SES
   - Postmark

2. **Email Templates**
   - Customize templates for your brand
   - Add company logo and styling
   - Include unsubscribe links

3. **Rate Limiting**
   - Implement email rate limiting
   - Monitor email sending quotas
   - Set up email delivery monitoring

## Security Best Practices

1. **Environment Variables**
   - Never commit `.env` files to version control
   - Use strong, unique passwords
   - Rotate credentials regularly

2. **Email Security**
   - Use HTTPS for all email communications
   - Implement SPF, DKIM, and DMARC records
   - Monitor for suspicious email activity

3. **User Privacy**
   - Respect user email preferences
   - Provide easy unsubscribe options
   - Comply with email regulations (CAN-SPAM, GDPR)

## Support

If you encounter issues with email setup:

1. Check the server logs for detailed error messages
2. Verify your Gmail App Password is correct
3. Test with the provided test endpoints
4. Ensure your firewall allows SMTP connections

For additional help, refer to the main README.md file or create an issue in the project repository. 
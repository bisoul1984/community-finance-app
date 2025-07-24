const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY || 'sk_test_your_test_key_here');

class PaymentService {
  // Create a payment intent for loan repayment
  async createPaymentIntent(amount, currency = 'usd', metadata = {}) {
    try {
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount * 100), // Convert to cents
        currency,
        metadata,
        automatic_payment_methods: {
          enabled: true,
        },
      });
      
      return {
        success: true,
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id,
        amount: amount,
        currency: currency
      };
    } catch (error) {
      console.error('Payment intent creation error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Process a successful payment
  async confirmPayment(paymentIntentId) {
    try {
      const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
      
      if (paymentIntent.status === 'succeeded') {
        return {
          success: true,
          paymentIntent,
          amount: paymentIntent.amount / 100,
          currency: paymentIntent.currency
        };
      } else {
        return {
          success: false,
          error: `Payment not completed. Status: ${paymentIntent.status}`
        };
      }
    } catch (error) {
      console.error('Payment confirmation error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Create a refund
  async createRefund(paymentIntentId, amount = null, reason = 'requested_by_customer') {
    try {
      const refundData = {
        payment_intent: paymentIntentId,
        reason
      };
      
      if (amount) {
        refundData.amount = Math.round(amount * 100);
      }
      
      const refund = await stripe.refunds.create(refundData);
      
      return {
        success: true,
        refund,
        amount: refund.amount / 100,
        currency: refund.currency
      };
    } catch (error) {
      console.error('Refund creation error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Get payment history for a customer
  async getPaymentHistory(customerId, limit = 10) {
    try {
      const payments = await stripe.paymentIntents.list({
        customer: customerId,
        limit
      });
      
      return {
        success: true,
        payments: payments.data.map(payment => ({
          id: payment.id,
          amount: payment.amount / 100,
          currency: payment.currency,
          status: payment.status,
          created: payment.created,
          metadata: payment.metadata
        }))
      };
    } catch (error) {
      console.error('Payment history error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Create a customer in Stripe
  async createCustomer(email, name, metadata = {}) {
    try {
      const customer = await stripe.customers.create({
        email,
        name,
        metadata
      });
      
      return {
        success: true,
        customerId: customer.id,
        customer
      };
    } catch (error) {
      console.error('Customer creation error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Get customer details
  async getCustomer(customerId) {
    try {
      const customer = await stripe.customers.retrieve(customerId);
      return {
        success: true,
        customer
      };
    } catch (error) {
      console.error('Customer retrieval error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Create a setup intent for saving payment methods
  async createSetupIntent(customerId, metadata = {}) {
    try {
      const setupIntent = await stripe.setupIntents.create({
        customer: customerId,
        payment_method_types: ['card'],
        metadata
      });
      
      return {
        success: true,
        clientSecret: setupIntent.client_secret,
        setupIntentId: setupIntent.id
      };
    } catch (error) {
      console.error('Setup intent creation error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Get payment methods for a customer
  async getPaymentMethods(customerId) {
    try {
      const paymentMethods = await stripe.paymentMethods.list({
        customer: customerId,
        type: 'card'
      });
      
      return {
        success: true,
        paymentMethods: paymentMethods.data
      };
    } catch (error) {
      console.error('Payment methods retrieval error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }
}

module.exports = new PaymentService(); 
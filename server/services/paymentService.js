const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY || 'sk_test_your_test_key_here');
const paypal = require('@paypal/checkout-server-sdk');

// PayPal configuration
const paypalEnvironment = process.env.NODE_ENV === 'production' 
  ? new paypal.core.LiveEnvironment(process.env.PAYPAL_CLIENT_ID, process.env.PAYPAL_CLIENT_SECRET)
  : new paypal.core.SandboxEnvironment(process.env.PAYPAL_CLIENT_ID, process.env.PAYPAL_CLIENT_SECRET);
const paypalClient = new paypal.core.PayPalHttpClient(paypalEnvironment);

// Square configuration (simplified for now)
const squareClient = null;

class PaymentService {
  // Get available payment providers
  getAvailableProviders() {
    return {
      stripe: {
        name: 'Stripe',
        description: 'Credit/Debit Cards, Digital Wallets',
        supportedCurrencies: ['usd', 'eur', 'gbp', 'cad', 'aud'],
        fees: '2.9% + 30¢ per transaction',
        icon: '💳'
      },
      paypal: {
        name: 'PayPal',
        description: 'PayPal Balance, Bank Transfer',
        supportedCurrencies: ['usd', 'eur', 'gbp', 'cad', 'aud', 'jpy'],
        fees: '2.9% + fixed fee per transaction',
        icon: '🅿️'
      },
      square: {
        name: 'Square',
        description: 'Credit/Debit Cards, Contactless',
        supportedCurrencies: ['usd', 'cad', 'gbp', 'aud'],
        fees: '2.6% + 10¢ per transaction',
        icon: '⬜'
      },
      crypto: {
        name: 'Cryptocurrency',
        description: 'Bitcoin, Ethereum, USDC',
        supportedCurrencies: ['btc', 'eth', 'usdc', 'usdt'],
        fees: '1% per transaction',
        icon: '₿'
      }
    };
  }

  // Create a payment intent for loan repayment
  async createPaymentIntent(amount, currency = 'usd', metadata = {}, provider = 'stripe') {
    try {
      switch (provider) {
        case 'stripe':
          return await this.createStripePaymentIntent(amount, currency, metadata);
        case 'paypal':
          return await this.createPayPalOrder(amount, currency, metadata);
        case 'square':
          return await this.createSquarePayment(amount, currency, metadata);
        case 'crypto':
          return await this.createCryptoPayment(amount, currency, metadata);
        default:
          throw new Error('Unsupported payment provider');
      }
    } catch (error) {
      console.error('Payment intent creation error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Stripe payment intent
  async createStripePaymentIntent(amount, currency, metadata) {
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
      currency: currency,
      provider: 'stripe'
    };
  }

  // PayPal order creation
  async createPayPalOrder(amount, currency, metadata) {
    const request = new paypal.orders.OrdersCreateRequest();
    request.prefer("return=representation");
    request.requestBody({
      intent: 'CAPTURE',
      purchase_units: [{
        amount: {
          currency_code: currency.toUpperCase(),
          value: amount.toString()
        },
        custom_id: metadata.loanId || 'loan_repayment',
        description: metadata.paymentType || 'Loan Repayment'
      }],
      application_context: {
        return_url: `${process.env.FRONTEND_URL}/payment/success`,
        cancel_url: `${process.env.FRONTEND_URL}/payment/cancel`
      }
    });

    const order = await paypalClient.execute(request);
    
    return {
      success: true,
      orderId: order.result.id,
      approvalUrl: order.result.links.find(link => link.rel === 'approve').href,
      amount: amount,
      currency: currency,
      provider: 'paypal'
    };
  }

  // Square payment creation
  async createSquarePayment(amount, currency, metadata) {
    // Simplified Square implementation
    return {
      success: true,
      paymentId: `square_${Date.now()}`,
      amount: amount,
      currency: currency,
      provider: 'square'
    };
  }

  // Cryptocurrency payment (simplified - would integrate with actual crypto payment processor)
  async createCryptoPayment(amount, currency, metadata) {
    // This is a simplified implementation
    // In production, you'd integrate with services like Coinbase Commerce, BitPay, etc.
    const cryptoAddresses = {
      btc: 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh',
      eth: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6',
      usdc: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6'
    };

    return {
      success: true,
      cryptoAddress: cryptoAddresses[currency] || cryptoAddresses.usdc,
      amount: amount,
      currency: currency,
      provider: 'crypto',
      qrCode: `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${cryptoAddresses[currency] || cryptoAddresses.usdc}`
    };
  }

  // Process a successful payment
  async confirmPayment(paymentIntentId, provider = 'stripe') {
    try {
      switch (provider) {
        case 'stripe':
          return await this.confirmStripePayment(paymentIntentId);
        case 'paypal':
          return await this.confirmPayPalPayment(paymentIntentId);
        case 'square':
          return await this.confirmSquarePayment(paymentIntentId);
        case 'crypto':
          return await this.confirmCryptoPayment(paymentIntentId);
        default:
          throw new Error('Unsupported payment provider');
      }
    } catch (error) {
      console.error('Payment confirmation error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Confirm Stripe payment
  async confirmStripePayment(paymentIntentId) {
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    
    if (paymentIntent.status === 'succeeded') {
      return {
        success: true,
        paymentIntent,
        amount: paymentIntent.amount / 100,
        currency: paymentIntent.currency,
        provider: 'stripe'
      };
    } else {
      return {
        success: false,
        error: `Payment not completed. Status: ${paymentIntent.status}`
      };
    }
  }

  // Confirm PayPal payment
  async confirmPayPalPayment(orderId) {
    const request = new paypal.orders.OrdersCaptureRequest(orderId);
    const capture = await paypalClient.execute(request);
    
    if (capture.result.status === 'COMPLETED') {
      return {
        success: true,
        capture,
        amount: parseFloat(capture.result.purchase_units[0].amount.value),
        currency: capture.result.purchase_units[0].amount.currency_code.toLowerCase(),
        provider: 'paypal'
      };
    } else {
      return {
        success: false,
        error: `Payment not completed. Status: ${capture.result.status}`
      };
    }
  }

  // Confirm Square payment
  async confirmSquarePayment(paymentId) {
    // Simplified Square confirmation
    return {
      success: true,
      payment: { id: paymentId, status: 'COMPLETED' },
      amount: 0,
      currency: 'usd',
      provider: 'square'
    };
  }

  // Confirm crypto payment (simplified)
  async confirmCryptoPayment(transactionId) {
    // In production, you'd verify the transaction on the blockchain
    // For now, we'll simulate a successful confirmation
    return {
      success: true,
      transactionId,
      amount: 0, // Would be extracted from blockchain transaction
      currency: 'usdc',
      provider: 'crypto'
    };
  }

  // Create a refund
  async createRefund(paymentIntentId, amount = null, reason = 'requested_by_customer', provider = 'stripe') {
    try {
      switch (provider) {
        case 'stripe':
          return await this.createStripeRefund(paymentIntentId, amount, reason);
        case 'paypal':
          return await this.createPayPalRefund(paymentIntentId, amount, reason);
        case 'square':
          return await this.createSquareRefund(paymentIntentId, amount, reason);
        default:
          throw new Error('Unsupported payment provider for refunds');
      }
    } catch (error) {
      console.error('Refund creation error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Stripe refund
  async createStripeRefund(paymentIntentId, amount, reason) {
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
      currency: refund.currency,
      provider: 'stripe'
    };
  }

  // PayPal refund
  async createPayPalRefund(captureId, amount, reason) {
    const request = new paypal.payments.CapturesRefundRequest(captureId);
    request.requestBody({
      amount: {
        value: amount.toString(),
        currency_code: 'USD'
      },
      note_to_payer: reason
    });

    const refund = await paypalClient.execute(request);
    
    return {
      success: true,
      refund,
      amount: parseFloat(refund.result.amount.value),
      currency: refund.result.amount.currency_code.toLowerCase(),
      provider: 'paypal'
    };
  }

  // Square refund
  async createSquareRefund(paymentId, amount, reason) {
    // Simplified Square refund
    return {
      success: true,
      refund: { id: `refund_${Date.now()}`, amount: amount },
      amount: amount,
      currency: 'usd',
      provider: 'square'
    };
  }

  // Get payment history for a customer
  async getPaymentHistory(customerId, limit = 10, provider = 'stripe') {
    try {
      switch (provider) {
        case 'stripe':
          return await this.getStripePaymentHistory(customerId, limit);
        case 'paypal':
          return await this.getPayPalPaymentHistory(customerId, limit);
        case 'square':
          return await this.getSquarePaymentHistory(customerId, limit);
        default:
          throw new Error('Unsupported payment provider');
      }
    } catch (error) {
      console.error('Payment history error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Stripe payment history
  async getStripePaymentHistory(customerId, limit) {
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
        metadata: payment.metadata,
        provider: 'stripe'
      }))
    };
  }

  // PayPal payment history
  async getPayPalPaymentHistory(customerId, limit) {
    const request = new paypal.payments.PaymentsListRequest();
    request.pageSize(limit);
    
    const payments = await paypalClient.execute(request);
    
    return {
      success: true,
      payments: payments.result.payments.map(payment => ({
        id: payment.id,
        amount: parseFloat(payment.amount.value),
        currency: payment.amount.currency,
        status: payment.status,
        created: payment.create_time,
        provider: 'paypal'
      }))
    };
  }

  // Square payment history
  async getSquarePaymentHistory(customerId, limit) {
    // Simplified Square payment history
    return {
      success: true,
      payments: []
    };
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

  // Get payment provider fees
  getProviderFees(amount, provider = 'stripe', currency = 'usd') {
    const fees = {
      stripe: {
        percentage: 0.029,
        fixed: 0.30
      },
      paypal: {
        percentage: 0.029,
        fixed: 0.30
      },
      square: {
        percentage: 0.026,
        fixed: 0.10
      },
      crypto: {
        percentage: 0.01,
        fixed: 0
      }
    };

    const providerFees = fees[provider] || fees.stripe;
    const feeAmount = (amount * providerFees.percentage) + providerFees.fixed;
    
    return {
      amount: feeAmount,
      percentage: providerFees.percentage * 100,
      fixed: providerFees.fixed,
      total: amount + feeAmount
    };
  }
}

module.exports = new PaymentService(); 
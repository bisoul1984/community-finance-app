import React, { useState, useEffect, useCallback } from 'react';



const PaymentForm = ({ 
  amount, 
  loanId, 
  paymentType = 'repayment', 
  onSuccess, 
  onError, 
  onCancel,
  currency = 'USD'
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [clientSecret, setClientSecret] = useState(null);

  // Mock payment intent creation for demo purposes
  const createPaymentIntent = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock client secret for demo
      setClientSecret('mock_client_secret_' + Date.now());
    } catch (err) {
      console.error('Error creating payment intent:', err);
      setError('Failed to create payment intent');
    } finally {
      setLoading(false);
    }
  }, [amount, loanId, paymentType, currency]);

  useEffect(() => {
    createPaymentIntent();
  }, [createPaymentIntent]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!clientSecret) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock successful payment
      const mockPaymentData = {
        id: 'mock_payment_' + Date.now(),
        amount: amount,
        status: 'succeeded',
        paymentType: paymentType,
        loanId: loanId,
        timestamp: new Date().toISOString()
      };
      
      onSuccess(mockPaymentData);
    } catch (err) {
      console.error('Payment error:', err);
      setError('Payment failed');
    } finally {
      setLoading(false);
    }
  };

  const formatAmount = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(amount);
  };

  if (loading && !clientSecret) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-gray-600">Preparing payment...</span>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4">
        <h3 className="text-xl font-bold text-white">
          {paymentType === 'repayment' ? 'Loan Repayment' : 'Fund Loan'}
        </h3>
        <p className="text-blue-100 text-sm mt-1">
          {paymentType === 'repayment' 
            ? 'Complete your loan repayment securely' 
            : 'Support this loan request'
          }
        </p>
      </div>

      <div className="p-6">
        <div className="mb-6">
          <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
            <span className="text-gray-600">Amount:</span>
            <span className="text-2xl font-bold text-gray-900">
              {formatAmount(amount)}
            </span>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Demo Payment
            </label>
            <div className="border border-gray-300 rounded-lg p-3 bg-gray-50">
              <p className="text-sm text-gray-600">
                This is a demo payment system. Click "Pay" to simulate a successful payment.
              </p>
            </div>
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onCancel}
              disabled={loading}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !clientSecret}
              className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Processing...
                </div>
              ) : (
                `Pay ${formatAmount(amount)}`
              )}
            </button>
          </div>
        </form>

        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h4 className="text-sm font-medium text-blue-800">Secure Payment</h4>
              <p className="text-sm text-blue-700 mt-1">
                Your payment is processed securely by Stripe. We never store your card details.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentForm; 
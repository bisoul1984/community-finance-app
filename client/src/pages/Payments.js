import React, { useState } from 'react';
import PaymentHistory from '../components/PaymentHistory';
import PaymentStats from '../components/PaymentStats';
import PaymentModal from '../components/PaymentModal';

const Payments = () => {
  const [activeTab, setActiveTab] = useState('stats');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentData, setPaymentData] = useState(null);

  const handlePaymentSuccess = (data) => {
    console.log('Payment successful:', data);
    // You can add a success notification here
    alert('Payment completed successfully!');
  };

  const handlePaymentError = (error) => {
    console.error('Payment error:', error);
    // You can add an error notification here
    alert('Payment failed. Please try again.');
  };

  const openPaymentModal = (amount, loanId, paymentType = 'repayment') => {
    setPaymentData({ amount, loanId, paymentType });
    setShowPaymentModal(true);
  };

  const closePaymentModal = () => {
    setShowPaymentModal(false);
    setPaymentData(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Payments</h1>
          <p className="mt-2 text-gray-600">
            Manage your loan payments, track funding, and view payment history
          </p>
        </div>

        {/* Quick Actions */}
        <div className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={() => openPaymentModal(100, 'sample-loan-id', 'repayment')}
            className="flex items-center justify-center p-6 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl shadow-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200"
          >
            <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
            </svg>
            <div className="text-left">
              <p className="font-semibold">Make Repayment</p>
              <p className="text-blue-100 text-sm">Pay back your loans</p>
            </div>
          </button>

          <button
            onClick={() => openPaymentModal(500, 'sample-loan-id', 'funding')}
            className="flex items-center justify-center p-6 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl shadow-lg hover:from-green-700 hover:to-green-800 transition-all duration-200"
          >
            <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
            <div className="text-left">
              <p className="font-semibold">Fund a Loan</p>
              <p className="text-green-100 text-sm">Support borrowers</p>
            </div>
          </button>

          <button
            onClick={() => setActiveTab('history')}
            className="flex items-center justify-center p-6 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-xl shadow-lg hover:from-purple-700 hover:to-purple-800 transition-all duration-200"
          >
            <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <div className="text-left">
              <p className="font-semibold">View History</p>
              <p className="text-purple-100 text-sm">Track transactions</p>
            </div>
          </button>
        </div>

        {/* Tabs */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('stats')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'stats'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Statistics
              </button>
              <button
                onClick={() => setActiveTab('history')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'history'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Payment History
              </button>
            </nav>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-6">
          {activeTab === 'stats' && <PaymentStats />}
          {activeTab === 'history' && <PaymentHistory />}
        </div>

        {/* Payment Modal */}
        {showPaymentModal && paymentData && (
          <PaymentModal
            isOpen={showPaymentModal}
            onClose={closePaymentModal}
            amount={paymentData.amount}
            loanId={paymentData.loanId}
            paymentType={paymentData.paymentType}
            onSuccess={handlePaymentSuccess}
            onError={handlePaymentError}
          />
        )}
      </div>
    </div>
  );
};

export default Payments; 
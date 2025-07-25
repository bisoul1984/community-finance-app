import React from 'react';
import PaymentForm from './PaymentForm';

const PaymentModal = ({ 
  isOpen, 
  onClose, 
  amount,
  loanId,
  paymentType,
  onSuccess, 
  onError 
}) => {
  if (!isOpen) {
    return null;
  }

  const handleSuccess = (data) => {
    onSuccess?.(data);
    onClose();
  };

  const handleError = (error) => {
    onError?.(error);
  };

  const handleCancel = () => {
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            {paymentType === 'repayment' ? 'Make Repayment' : 'Fund Loan'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="mb-6">
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">
                  {paymentType === 'repayment' ? 'Repayment Amount:' : 'Funding Amount:'}
                </span>
                <span className="text-2xl font-bold text-gray-900">
                  ${amount.toFixed(2)}
                </span>
              </div>
              {loanId && (
                <div className="mt-2 text-sm text-gray-500">
                  Loan ID: {loanId}
                </div>
              )}
            </div>
          </div>

          {/* Payment Form */}
          <PaymentForm
            amount={amount}
            loanId={loanId}
            paymentType={paymentType}
            onSuccess={handleSuccess}
            onError={handleError}
            onCancel={handleCancel}
          />
        </div>
      </div>
    </div>
  );
};

export default PaymentModal; 
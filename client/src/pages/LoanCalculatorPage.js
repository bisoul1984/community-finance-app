import React from 'react';
import LoanCalculator from '../components/LoanCalculator';

const LoanCalculatorPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 text-center mb-2">
            Loan Calculator
          </h1>
          <p className="text-gray-600 text-center max-w-2xl mx-auto">
            Calculate your loan payments, interest, and total cost. Adjust the parameters 
            to see how different terms affect your payments.
          </p>
        </div>
        
        <LoanCalculator />
        
        <div className="mt-12 max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">
              How to Use the Calculator
            </h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-lg font-semibold text-gray-700 mb-2">
                  Input Fields
                </h4>
                <ul className="space-y-2 text-gray-600">
                  <li><strong>Loan Amount:</strong> Enter the total amount you want to borrow</li>
                  <li><strong>Interest Rate:</strong> Annual percentage rate (APR)</li>
                  <li><strong>Loan Term:</strong> Duration of the loan in years</li>
                  <li><strong>Payment Frequency:</strong> How often you'll make payments</li>
                </ul>
              </div>
              <div>
                <h4 className="text-lg font-semibold text-gray-700 mb-2">
                  Results Explained
                </h4>
                <ul className="space-y-2 text-gray-600">
                  <li><strong>Payment Amount:</strong> Your regular payment amount</li>
                  <li><strong>Total Interest:</strong> Total interest paid over the loan term</li>
                  <li><strong>Total Payment:</strong> Principal + interest</li>
                  <li><strong>Number of Payments:</strong> Total payments over the term</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoanCalculatorPage; 
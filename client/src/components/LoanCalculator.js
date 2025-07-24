import React, { useState, useEffect } from 'react';

const LoanCalculator = () => {
  const [loanAmount, setLoanAmount] = useState(1000);
  const [interestRate, setInterestRate] = useState(10);
  const [loanTerm, setLoanTerm] = useState(12);
  const [paymentFrequency, setPaymentFrequency] = useState('monthly');
  const [results, setResults] = useState(null);

  const calculateLoan = () => {
    const principal = parseFloat(loanAmount);
    const rate = parseFloat(interestRate) / 100;
    const term = parseFloat(loanTerm);
    
    // Convert annual rate to periodic rate based on payment frequency
    let periodicRate;
    let numberOfPayments;
    
    switch (paymentFrequency) {
      case 'weekly':
        periodicRate = rate / 52;
        numberOfPayments = term * 52;
        break;
      case 'biweekly':
        periodicRate = rate / 26;
        numberOfPayments = term * 26;
        break;
      case 'monthly':
        periodicRate = rate / 12;
        numberOfPayments = term * 12;
        break;
      case 'quarterly':
        periodicRate = rate / 4;
        numberOfPayments = term * 4;
        break;
      default:
        periodicRate = rate / 12;
        numberOfPayments = term * 12;
    }

    // Calculate monthly payment using the formula: P = L[c(1 + c)^n]/[(1 + c)^n - 1]
    const monthlyPayment = principal * 
      (periodicRate * Math.pow(1 + periodicRate, numberOfPayments)) / 
      (Math.pow(1 + periodicRate, numberOfPayments) - 1);

    const totalPayment = monthlyPayment * numberOfPayments;
    const totalInterest = totalPayment - principal;

    setResults({
      monthlyPayment: monthlyPayment.toFixed(2),
      totalPayment: totalPayment.toFixed(2),
      totalInterest: totalInterest.toFixed(2),
      numberOfPayments
    });
  };

  useEffect(() => {
    calculateLoan();
  }, [loanAmount, interestRate, loanTerm, paymentFrequency]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
        Loan Calculator
      </h2>
      
      <div className="grid md:grid-cols-2 gap-8">
        {/* Input Section */}
        <div className="space-y-6">
          <h3 className="text-xl font-semibold text-gray-700 mb-4">
            Loan Details
          </h3>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Loan Amount ($)
            </label>
            <input
              type="number"
              value={loanAmount}
              onChange={(e) => setLoanAmount(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              min="100"
              step="100"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Annual Interest Rate (%)
            </label>
            <input
              type="number"
              value={interestRate}
              onChange={(e) => setInterestRate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              min="0.1"
              max="50"
              step="0.1"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Loan Term (Years)
            </label>
            <input
              type="number"
              value={loanTerm}
              onChange={(e) => setLoanTerm(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              min="1"
              max="30"
              step="1"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Payment Frequency
            </label>
            <select
              value={paymentFrequency}
              onChange={(e) => setPaymentFrequency(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="weekly">Weekly</option>
              <option value="biweekly">Bi-weekly</option>
              <option value="monthly">Monthly</option>
              <option value="quarterly">Quarterly</option>
            </select>
          </div>
        </div>

        {/* Results Section */}
        <div className="space-y-6">
          <h3 className="text-xl font-semibold text-gray-700 mb-4">
            Payment Summary
          </h3>
          
          {results && (
            <div className="space-y-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="text-sm text-blue-600 font-medium">
                  {paymentFrequency.charAt(0).toUpperCase() + paymentFrequency.slice(1)} Payment
                </div>
                <div className="text-2xl font-bold text-blue-800">
                  {formatCurrency(results.monthlyPayment)}
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="text-sm text-gray-600">Total Interest</div>
                  <div className="text-lg font-semibold text-gray-800">
                    {formatCurrency(results.totalInterest)}
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="text-sm text-gray-600">Total Payment</div>
                  <div className="text-lg font-semibold text-gray-800">
                    {formatCurrency(results.totalPayment)}
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="text-sm text-gray-600">Number of Payments</div>
                  <div className="text-lg font-semibold text-gray-800">
                    {results.numberOfPayments}
                  </div>
                </div>
              </div>

              {/* Amortization Preview */}
              <div className="mt-6">
                <h4 className="text-lg font-semibold text-gray-700 mb-3">
                  Payment Breakdown
                </h4>
                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="text-sm text-green-600">
                    Principal: {formatCurrency(loanAmount)}
                  </div>
                  <div className="text-sm text-green-600">
                    Interest: {formatCurrency(results.totalInterest)}
                  </div>
                  <div className="text-sm font-semibold text-green-800">
                    Total: {formatCurrency(results.totalPayment)}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Additional Information */}
      <div className="mt-8 p-4 bg-yellow-50 rounded-lg">
        <h4 className="text-lg font-semibold text-yellow-800 mb-2">
          💡 Tips
        </h4>
        <ul className="text-sm text-yellow-700 space-y-1">
          <li>• Lower interest rates result in lower total payments</li>
          <li>• Shorter loan terms mean higher payments but less total interest</li>
          <li>• More frequent payments can reduce total interest paid</li>
          <li>• This calculator provides estimates - actual terms may vary</li>
        </ul>
      </div>
    </div>
  );
};

export default LoanCalculator; 
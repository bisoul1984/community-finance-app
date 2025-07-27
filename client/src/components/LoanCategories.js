import React, { useState, useEffect } from 'react';

const LoanCategories = ({ user, onCategorySelect }) => {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLoanCategories();
  }, []);

  const fetchLoanCategories = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.REACT_APP_API_URL}/loans/categories`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setCategories(data);
      } else {
        // If API doesn't exist yet, use default categories
        setCategories(getDefaultCategories());
      }
    } catch (error) {
      console.error('Error fetching loan categories:', error);
      // Use default categories as fallback
      setCategories(getDefaultCategories());
    } finally {
      setLoading(false);
    }
  };

  const getDefaultCategories = () => [
    {
      id: 'personal',
      name: 'Personal Loan',
      description: 'Flexible loans for personal expenses, debt consolidation, or emergency funds',
      minAmount: 1000,
      maxAmount: 50000,
      interestRate: 8.5,
      termRange: '12-60 months',
      requirements: [
        'Minimum credit score: 650',
        'Stable employment (6+ months)',
        'Valid government ID',
        'Proof of income'
      ],
      benefits: [
        'No collateral required',
        'Fast approval process',
        'Flexible repayment terms',
        'Competitive interest rates'
      ],
      icon: '👤',
      color: 'blue'
    },
    {
      id: 'business',
      name: 'Business Loan',
      description: 'Funding for business expansion, equipment purchase, or working capital',
      minAmount: 5000,
      maxAmount: 200000,
      interestRate: 10.5,
      termRange: '12-84 months',
      requirements: [
        'Business plan required',
        'Business registration',
        'Financial statements',
        'Collateral may be required'
      ],
      benefits: [
        'Higher loan amounts available',
        'Business growth support',
        'Tax-deductible interest',
        'Flexible business terms'
      ],
      icon: '💼',
      color: 'green'
    },
    {
      id: 'education',
      name: 'Education Loan',
      description: 'Student loans for tuition, books, and educational expenses',
      minAmount: 2000,
      maxAmount: 100000,
      interestRate: 6.5,
      termRange: '24-120 months',
      requirements: [
        'Enrollment verification',
        'Academic progress',
        'Co-signer may be required',
        'School accreditation'
      ],
      benefits: [
        'Lower interest rates',
        'Deferred payments while in school',
        'No prepayment penalties',
        'Education investment'
      ],
      icon: '🎓',
      color: 'purple'
    },
    {
      id: 'home',
      name: 'Home Improvement Loan',
      description: 'Loans for home renovations, repairs, and property improvements',
      minAmount: 3000,
      maxAmount: 150000,
      interestRate: 9.0,
      termRange: '12-120 months',
      requirements: [
        'Property ownership',
        'Home equity or collateral',
        'Contractor estimates',
        'Property appraisal'
      ],
      benefits: [
        'Increase property value',
        'Tax benefits possible',
        'Flexible project scope',
        'Competitive rates'
      ],
      icon: '🏠',
      color: 'orange'
    },
    {
      id: 'vehicle',
      name: 'Vehicle Loan',
      description: 'Auto loans for new or used vehicles, motorcycles, and RVs',
      minAmount: 5000,
      maxAmount: 100000,
      interestRate: 7.5,
      termRange: '12-84 months',
      requirements: [
        'Vehicle information',
        'Insurance requirements',
        'Down payment (10-20%)',
        'Good credit history'
      ],
      benefits: [
        'Competitive auto rates',
        'Quick approval process',
        'Flexible terms',
        'Multiple vehicle types'
      ],
      icon: '🚗',
      color: 'red'
    },
    {
      id: 'emergency',
      name: 'Emergency Loan',
      description: 'Quick access to funds for urgent financial needs',
      minAmount: 500,
      maxAmount: 10000,
      interestRate: 12.0,
      termRange: '3-24 months',
      requirements: [
        'Proof of emergency',
        'Basic identification',
        'Income verification',
        'Bank account'
      ],
      benefits: [
        'Fast approval (24-48 hours)',
        'Minimal documentation',
        'Flexible use of funds',
        'Quick disbursement'
      ],
      icon: '🚨',
      color: 'yellow'
    }
  ];

  const getColorClasses = (color) => {
    const colorMap = {
      blue: 'bg-blue-50 border-blue-200 text-blue-800',
      green: 'bg-green-50 border-green-200 text-green-800',
      purple: 'bg-purple-50 border-purple-200 text-purple-800',
      orange: 'bg-orange-50 border-orange-200 text-orange-800',
      red: 'bg-red-50 border-red-200 text-red-800',
      yellow: 'bg-yellow-50 border-yellow-200 text-yellow-800'
    };
    return colorMap[color] || 'bg-gray-50 border-gray-200 text-gray-800';
  };

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    if (onCategorySelect) {
      onCategorySelect(category);
    }
  };

  const calculateMonthlyPayment = (amount, rate, term) => {
    const monthlyRate = rate / 100 / 12;
    const numberOfPayments = term * 12;
    const monthlyPayment = amount * 
      (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) / 
      (Math.pow(1 + monthlyRate, numberOfPayments) - 1);
    return monthlyPayment.toFixed(2);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 bg-gray-50 min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Loan Categories</h1>
        <p className="text-gray-600">
          Explore different types of loans tailored to your specific needs. Each category has unique terms, 
          requirements, and benefits designed to help you achieve your financial goals.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category) => (
          <div
            key={category.id}
            className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
          >
            <div className={`p-6 border-b ${getColorClasses(category.color)}`}>
              <div className="flex items-center justify-between mb-4">
                <span className="text-3xl">{category.icon}</span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getColorClasses(category.color)}`}>
                  {category.interestRate}% APR
                </span>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">{category.name}</h3>
              <p className="text-gray-600 text-sm">{category.description}</p>
            </div>

            <div className="p-6">
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">Loan Details</h4>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-gray-600">Amount:</span>
                      <div className="font-medium">${category.minAmount.toLocaleString()} - ${category.maxAmount.toLocaleString()}</div>
                    </div>
                    <div>
                      <span className="text-gray-600">Term:</span>
                      <div className="font-medium">{category.termRange}</div>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">Requirements</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    {category.requirements.slice(0, 3).map((req, index) => (
                      <li key={index} className="flex items-start">
                        <span className="text-blue-500 mr-2">•</span>
                        {req}
                      </li>
                    ))}
                    {category.requirements.length > 3 && (
                      <li className="text-blue-600 text-xs">
                        +{category.requirements.length - 3} more requirements
                      </li>
                    )}
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">Benefits</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    {category.benefits.slice(0, 3).map((benefit, index) => (
                      <li key={index} className="flex items-start">
                        <span className="text-green-500 mr-2">✓</span>
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-4 border-t">
                  <button
                    onClick={() => handleCategorySelect(category)}
                    className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200 font-medium"
                  >
                    Apply for {category.name}
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Category Comparison */}
      <div className="mt-12 bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Loan Category Comparison</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-semibold text-gray-800">Category</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-800">Min Amount</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-800">Max Amount</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-800">Interest Rate</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-800">Term Range</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-800">Monthly Payment*</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((category) => (
                <tr key={category.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <div className="flex items-center">
                      <span className="text-xl mr-2">{category.icon}</span>
                      <span className="font-medium">{category.name}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">${category.minAmount.toLocaleString()}</td>
                  <td className="py-3 px-4">${category.maxAmount.toLocaleString()}</td>
                  <td className="py-3 px-4 font-medium">{category.interestRate}%</td>
                  <td className="py-3 px-4">{category.termRange}</td>
                  <td className="py-3 px-4">
                    ${calculateMonthlyPayment(category.minAmount, category.interestRate, 12)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="text-xs text-gray-500 mt-4">
            * Monthly payment calculated for minimum loan amount over 12 months
          </p>
        </div>
      </div>

      {/* Help Section */}
      <div className="mt-8 bg-blue-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-blue-800 mb-3">Need Help Choosing?</h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-blue-800 mb-2">Quick Tips:</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Personal loans are best for debt consolidation</li>
              <li>• Business loans require a solid business plan</li>
              <li>• Education loans have the lowest interest rates</li>
              <li>• Emergency loans are fastest but have higher rates</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-blue-800 mb-2">Contact Support:</h4>
            <p className="text-sm text-blue-700 mb-2">
              Our loan specialists can help you choose the right loan category for your needs.
            </p>
            <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">
              Chat with Support →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoanCategories; 
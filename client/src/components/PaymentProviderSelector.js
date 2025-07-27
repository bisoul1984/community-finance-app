import React, { useState, useEffect } from 'react';
import { CreditCard, DollarSign, Shield, Info } from 'lucide-react';

const PaymentProviderSelector = ({ 
  amount, 
  onProviderSelect, 
  selectedProvider = 'stripe',
  showFees = true 
}) => {
  const [providers, setProviders] = useState({});
  const [fees, setFees] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProviders();
  }, []);

  useEffect(() => {
    if (amount > 0 && Object.keys(providers).length > 0) {
      calculateFees();
    }
  }, [amount, providers]);

  const fetchProviders = async () => {
    try {
      const response = await fetch('/api/payments/providers', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      setProviders(data.providers);
    } catch (error) {
      console.error('Error fetching providers:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateFees = async () => {
    try {
      const response = await fetch('/api/payments/calculate-fees', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          amount: amount,
          provider: selectedProvider,
          currency: 'usd'
        })
      });
      const data = await response.json();
      setFees(data.fees);
    } catch (error) {
      console.error('Error calculating fees:', error);
    }
  };

  const handleProviderChange = (provider) => {
    onProviderSelect(provider);
  };

  const getProviderIcon = (providerKey) => {
    const icons = {
      stripe: '💳',
      paypal: '🅿️',
      square: '⬜',
      crypto: '₿'
    };
    return icons[providerKey] || '💳';
  };

  const getProviderColor = (providerKey) => {
    const colors = {
      stripe: 'border-purple-200 bg-purple-50',
      paypal: 'border-blue-200 bg-blue-50',
      square: 'border-green-200 bg-green-50',
      crypto: 'border-orange-200 bg-orange-50'
    };
    return colors[providerKey] || 'border-gray-200 bg-gray-50';
  };

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-16 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <CreditCard className="w-5 h-5 text-gray-600" />
        <h3 className="text-lg font-semibold text-gray-900">Select Payment Method</h3>
      </div>

      <div className="space-y-3">
        {Object.entries(providers).map(([key, provider]) => (
          <div
            key={key}
            className={`relative border-2 rounded-lg p-4 cursor-pointer transition-all duration-200 ${
              selectedProvider === key
                ? 'border-blue-500 bg-blue-50'
                : `${getProviderColor(key)} hover:border-gray-300`
            }`}
            onClick={() => handleProviderChange(key)}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="text-2xl">{getProviderIcon(key)}</div>
                <div>
                  <div className="font-medium text-gray-900">{provider.name}</div>
                  <div className="text-sm text-gray-600">{provider.description}</div>
                  {showFees && (
                    <div className="text-xs text-gray-500 mt-1">
                      Fee: {provider.fees}
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                {selectedProvider === key && (
                  <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                )}
                <Shield className="w-4 h-4 text-gray-400" />
              </div>
            </div>

            {/* Supported Currencies */}
            <div className="mt-2">
              <div className="text-xs text-gray-500">
                Supported: {provider.supportedCurrencies.join(', ').toUpperCase()}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Fee Breakdown */}
      {showFees && amount > 0 && fees.amount !== undefined && (
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center space-x-2 mb-3">
            <DollarSign className="w-4 h-4 text-gray-600" />
            <h4 className="font-medium text-gray-900">Fee Breakdown</h4>
          </div>
          
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Loan Amount:</span>
              <span className="font-medium">${amount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Processing Fee ({fees.percentage}%):</span>
              <span className="font-medium">${fees.amount.toFixed(2)}</span>
            </div>
            {fees.fixed > 0 && (
              <div className="flex justify-between">
                <span className="text-gray-600">Fixed Fee:</span>
                <span className="font-medium">${fees.fixed.toFixed(2)}</span>
              </div>
            )}
            <div className="border-t pt-2 flex justify-between font-semibold">
              <span className="text-gray-900">Total Amount:</span>
              <span className="text-blue-600">${fees.total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      )}

      {/* Security Notice */}
      <div className="flex items-start space-x-2 p-3 bg-blue-50 rounded-lg">
        <Shield className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
        <div className="text-sm text-blue-800">
          <div className="font-medium mb-1">Secure Payment Processing</div>
          <div>All payments are encrypted and processed securely through our trusted payment partners.</div>
        </div>
      </div>
    </div>
  );
};

export default PaymentProviderSelector; 
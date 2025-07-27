import React, { useState, useEffect } from 'react';
import { Star, Shield, TrendingUp, Clock, CheckCircle, AlertCircle, Award, Users, DollarSign, Calendar } from 'lucide-react';

const BorrowerReputation = ({ borrower, showDetails = false, onReputationClick }) => {
  const [expanded, setExpanded] = useState(false);
  const [reputationHistory, setReputationHistory] = useState([]);

  // Mock reputation history data
  useEffect(() => {
    // In a real app, this would fetch from API
    const history = [
      { date: '2024-01-15', score: 75, change: 5, reason: 'On-time repayment' },
      { date: '2024-01-10', score: 70, change: 10, reason: 'Community verification' },
      { date: '2024-01-05', score: 60, change: 15, reason: 'First loan completed' },
      { date: '2024-01-01', score: 45, change: 0, reason: 'Account created' }
    ];
    setReputationHistory(history);
  }, []);

  const getReputationLevel = (score) => {
    if (score >= 90) return { level: 'Excellent', color: 'text-emerald-600', bg: 'bg-emerald-50', icon: Award };
    if (score >= 80) return { level: 'Very Good', color: 'text-green-600', bg: 'bg-green-50', icon: TrendingUp };
    if (score >= 70) return { level: 'Good', color: 'text-blue-600', bg: 'bg-blue-50', icon: CheckCircle };
    if (score >= 60) return { level: 'Fair', color: 'text-yellow-600', bg: 'bg-yellow-50', icon: Clock };
    if (score >= 50) return { level: 'Poor', color: 'text-orange-600', bg: 'bg-orange-50', icon: AlertCircle };
    return { level: 'Very Poor', color: 'text-red-600', bg: 'bg-red-50', icon: AlertCircle };
  };

  const getReputationColor = (score) => {
    if (score >= 80) return 'text-emerald-600';
    if (score >= 60) return 'text-blue-600';
    if (score >= 40) return 'text-yellow-600';
    return 'text-red-600';
  };

  const reputationLevel = getReputationLevel(borrower.reputation || 0);
  const LevelIcon = reputationLevel.icon;

  const reputationMetrics = {
    totalLoans: borrower.totalLoans || 0,
    completedLoans: borrower.completedLoans || 0,
    onTimePayments: borrower.onTimePayments || 0,
    totalPayments: borrower.totalPayments || 0,
    averageRepaymentTime: borrower.averageRepaymentTime || 0,
    communityVerifications: borrower.verificationsReceived || 0,
    memberSince: borrower.createdAt ? new Date(borrower.createdAt).toLocaleDateString() : 'N/A'
  };

  const onTimeRate = reputationMetrics.totalPayments > 0 
    ? (reputationMetrics.onTimePayments / reputationMetrics.totalPayments * 100).toFixed(1)
    : 0;

  const completionRate = reputationMetrics.totalLoans > 0
    ? (reputationMetrics.completedLoans / reputationMetrics.totalLoans * 100).toFixed(1)
    : 0;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      {/* Main Reputation Display */}
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-full ${reputationLevel.bg}`}>
              <LevelIcon className={`w-5 h-5 ${reputationLevel.color}`} />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Borrower Reputation</h3>
              <p className="text-sm text-gray-500">{borrower.name}</p>
            </div>
          </div>
          <div className="text-right">
            <div className={`text-3xl font-bold ${getReputationColor(borrower.reputation || 0)}`}>
              {borrower.reputation || 0}
            </div>
            <div className="text-sm text-gray-500">/ 100</div>
          </div>
        </div>

        {/* Reputation Level Badge */}
        <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${reputationLevel.bg} ${reputationLevel.color} mb-4`}>
          <LevelIcon className="w-4 h-4 mr-1" />
          {reputationLevel.level} Trust Level
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span className="text-sm text-gray-600">On-time Rate</span>
              </div>
              <span className="text-sm font-semibold text-gray-900">{onTimeRate}%</span>
            </div>
          </div>
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Award className="w-4 h-4 text-blue-600" />
                <span className="text-sm text-gray-600">Completion Rate</span>
              </div>
              <span className="text-sm font-semibold text-gray-900">{completionRate}%</span>
            </div>
          </div>
        </div>

        {/* Star Rating */}
        <div className="flex items-center space-x-2 mb-4">
          <div className="flex space-x-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`w-5 h-5 ${
                  star <= Math.ceil((borrower.reputation || 0) / 20)
                    ? 'text-yellow-400 fill-current'
                    : 'text-gray-300'
                }`}
              />
            ))}
          </div>
          <span className="text-sm text-gray-500">
            ({Math.ceil((borrower.reputation || 0) / 20)}.0/5.0)
          </span>
        </div>

        {/* Trust Indicators */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Community Verifications</span>
            <div className="flex items-center space-x-1">
              <Users className="w-4 h-4 text-blue-600" />
              <span className="font-medium">{reputationMetrics.communityVerifications}</span>
            </div>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Member Since</span>
            <div className="flex items-center space-x-1">
              <Calendar className="w-4 h-4 text-gray-600" />
              <span className="font-medium">{reputationMetrics.memberSince}</span>
            </div>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Total Loans</span>
            <div className="flex items-center space-x-1">
              <DollarSign className="w-4 h-4 text-green-600" />
              <span className="font-medium">{reputationMetrics.totalLoans}</span>
            </div>
          </div>
        </div>

        {/* Expandable Details */}
        {showDetails && (
          <div className="border-t pt-4">
            <button
              onClick={() => setExpanded(!expanded)}
              className="flex items-center justify-between w-full text-left text-sm font-medium text-gray-700 hover:text-gray-900"
            >
              <span>View Detailed Metrics</span>
              <TrendingUp className={`w-4 h-4 transition-transform ${expanded ? 'rotate-180' : ''}`} />
            </button>

            {expanded && (
              <div className="mt-4 space-y-4">
                {/* Detailed Metrics */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-blue-50 rounded-lg p-3">
                    <div className="text-xs text-blue-600 font-medium mb-1">Completed Loans</div>
                    <div className="text-lg font-bold text-blue-900">{reputationMetrics.completedLoans}</div>
                  </div>
                  <div className="bg-green-50 rounded-lg p-3">
                    <div className="text-xs text-green-600 font-medium mb-1">On-time Payments</div>
                    <div className="text-lg font-bold text-green-900">{reputationMetrics.onTimePayments}</div>
                  </div>
                  <div className="bg-purple-50 rounded-lg p-3">
                    <div className="text-xs text-purple-600 font-medium mb-1">Avg Repayment Time</div>
                    <div className="text-lg font-bold text-purple-900">{reputationMetrics.averageRepaymentTime} days</div>
                  </div>
                  <div className="bg-orange-50 rounded-lg p-3">
                    <div className="text-xs text-orange-600 font-medium mb-1">Total Payments</div>
                    <div className="text-lg font-bold text-orange-900">{reputationMetrics.totalPayments}</div>
                  </div>
                </div>

                {/* Reputation History */}
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-3">Reputation History</h4>
                  <div className="space-y-2">
                    {reputationHistory.map((entry, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <div className="flex items-center space-x-3">
                          <div className={`w-2 h-2 rounded-full ${
                            entry.change > 0 ? 'bg-green-500' : entry.change < 0 ? 'bg-red-500' : 'bg-gray-400'
                          }`} />
                          <div>
                            <div className="text-sm font-medium text-gray-900">{entry.reason}</div>
                            <div className="text-xs text-gray-500">{entry.date}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium text-gray-900">{entry.score}</div>
                          <div className={`text-xs ${entry.change > 0 ? 'text-green-600' : entry.change < 0 ? 'text-red-600' : 'text-gray-500'}`}>
                            {entry.change > 0 ? '+' : ''}{entry.change}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Trust Badges */}
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-3">Trust Badges</h4>
                  <div className="flex flex-wrap gap-2">
                    {onTimeRate >= 90 && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Punctual Payer
                      </span>
                    )}
                    {reputationMetrics.completedLoans >= 5 && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        <Award className="w-3 h-3 mr-1" />
                        Experienced Borrower
                      </span>
                    )}
                    {reputationMetrics.communityVerifications >= 3 && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                        <Shield className="w-3 h-3 mr-1" />
                        Community Verified
                      </span>
                    )}
                    {reputationMetrics.averageRepaymentTime <= 30 && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                        <Clock className="w-3 h-3 mr-1" />
                        Fast Repayer
                      </span>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Action Button */}
        {onReputationClick && (
          <button
            onClick={() => onReputationClick(borrower)}
            className="w-full mt-4 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
          >
            View Full Profile
          </button>
        )}
      </div>
    </div>
  );
};

export default BorrowerReputation; 
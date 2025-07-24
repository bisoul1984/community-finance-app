import React, { useState, useEffect } from 'react';
import DashboardCharts from '../components/DashboardCharts';

const EnhancedDashboard = ({ user }) => {
  const [loans, setLoans] = useState([]);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    fetchUserData();
  }, [user]);

  const fetchUserData = async () => {
    try {
      // Fetch user loans and payments
      const token = localStorage.getItem('token');
      
      // Fetch loans
      const loansResponse = await fetch(`http://localhost:5000/api/loans/user/${user.id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (loansResponse.ok) {
        const loansData = await loansResponse.json();
        setLoans(loansData);
      }

      // Fetch payments
      const paymentsResponse = await fetch(`http://localhost:5000/api/payments/user/${user.id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (paymentsResponse.ok) {
        const paymentsData = await paymentsResponse.json();
        setPayments(paymentsData);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderOverview = () => (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Welcome back, {user.name}!</h2>
        <p className="text-gray-600">
          Here's your financial overview and recent activity. Use the tabs below to explore different aspects of your account.
        </p>
      </div>

      <DashboardCharts user={user} loans={loans} payments={payments} />
    </div>
  );

  const renderRecentActivity = () => (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Recent Activity</h3>
        
        <div className="space-y-4">
          {loans.slice(0, 5).map((loan, index) => (
            <div key={loan._id || index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-800">Loan #{loan._id?.slice(-6) || index + 1}</p>
                <p className="text-sm text-gray-600">
                  ${loan.amount} • {loan.status} • {new Date(loan.createdAt).toLocaleDateString()}
                </p>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                loan.status === 'active' ? 'bg-green-100 text-green-800' :
                loan.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                loan.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                'bg-red-100 text-red-800'
              }`}>
                {loan.status}
              </span>
            </div>
          ))}
          
          {loans.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <p>No recent loan activity</p>
            </div>
          )}
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Recent Payments</h3>
        
        <div className="space-y-4">
          {payments.slice(0, 5).map((payment, index) => (
            <div key={payment._id || index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-800">Payment #{payment._id?.slice(-6) || index + 1}</p>
                <p className="text-sm text-gray-600">
                  ${payment.amount} • {new Date(payment.date).toLocaleDateString()}
                </p>
              </div>
              <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                Completed
              </span>
            </div>
          ))}
          
          {payments.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <p>No recent payment activity</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderQuickActions = () => (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Quick Actions</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <button className="p-4 bg-blue-50 hover:bg-blue-100 rounded-lg text-left transition-colors">
            <div className="text-blue-600 font-semibold">Request New Loan</div>
            <div className="text-sm text-gray-600">Apply for a new loan</div>
          </button>
          
          <button className="p-4 bg-green-50 hover:bg-green-100 rounded-lg text-left transition-colors">
            <div className="text-green-600 font-semibold">Make Payment</div>
            <div className="text-sm text-gray-600">Pay your loan installments</div>
          </button>
          
          <button className="p-4 bg-purple-50 hover:bg-purple-100 rounded-lg text-left transition-colors">
            <div className="text-purple-600 font-semibold">Upload Documents</div>
            <div className="text-sm text-gray-600">Submit required documents</div>
          </button>
          
          <button className="p-4 bg-orange-50 hover:bg-orange-100 rounded-lg text-left transition-colors">
            <div className="text-orange-600 font-semibold">Loan Calculator</div>
            <div className="text-sm text-gray-600">Calculate loan payments</div>
          </button>
          
          <button className="p-4 bg-indigo-50 hover:bg-indigo-100 rounded-lg text-left transition-colors">
            <div className="text-indigo-600 font-semibold">View History</div>
            <div className="text-sm text-gray-600">Check loan history</div>
          </button>
          
          <button className="p-4 bg-pink-50 hover:bg-pink-100 rounded-lg text-left transition-colors">
            <div className="text-pink-600 font-semibold">Support</div>
            <div className="text-sm text-gray-600">Get help and support</div>
          </button>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Account Summary</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold text-gray-700 mb-3">Loan Information</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Total Loans:</span>
                <span className="font-medium">{loans.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Active Loans:</span>
                <span className="font-medium">{loans.filter(loan => loan.status === 'active').length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Total Borrowed:</span>
                <span className="font-medium">${loans.reduce((sum, loan) => sum + loan.amount, 0).toFixed(2)}</span>
              </div>
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold text-gray-700 mb-3">Payment Information</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Total Payments:</span>
                <span className="font-medium">{payments.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Total Paid:</span>
                <span className="font-medium">${payments.reduce((sum, payment) => sum + payment.amount, 0).toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Reputation Score:</span>
                <span className="font-medium">{user.reputation || 0}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Tab Navigation */}
        <div className="mb-8">
          <div className="flex space-x-1 bg-white p-1 rounded-lg shadow-lg">
            <button
              onClick={() => setActiveTab('overview')}
              className={`flex-1 py-2 px-4 rounded-md font-medium transition-colors ${
                activeTab === 'overview'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('activity')}
              className={`flex-1 py-2 px-4 rounded-md font-medium transition-colors ${
                activeTab === 'activity'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Recent Activity
            </button>
            <button
              onClick={() => setActiveTab('actions')}
              className={`flex-1 py-2 px-4 rounded-md font-medium transition-colors ${
                activeTab === 'actions'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Quick Actions
            </button>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'activity' && renderRecentActivity()}
        {activeTab === 'actions' && renderQuickActions()}
      </div>
    </div>
  );
};

export default EnhancedDashboard; 
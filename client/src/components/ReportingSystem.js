import React, { useState, useEffect } from 'react';

const ReportingSystem = ({ user, isAdmin = false }) => {
  const [reports, setReports] = useState({
    userReport: null,
    adminReport: null,
    performanceReport: null
  });
  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
    reportType: 'user',
    exportFormat: 'json'
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (user) {
      loadReports();
    }
  }, [user, filters]);

  const loadReports = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const baseUrl = 'http://localhost:5000/api/reports';
      
      const queryParams = new URLSearchParams();
      if (filters.startDate) queryParams.append('startDate', filters.startDate);
      if (filters.endDate) queryParams.append('endDate', filters.endDate);

      // Load user report
      if (filters.reportType === 'user' || filters.reportType === 'all') {
        const userResponse = await fetch(`${baseUrl}/user/${user.id}?${queryParams}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (userResponse.ok) {
          const userData = await userResponse.json();
          setReports(prev => ({ ...prev, userReport: userData }));
        }
      }

      // Load admin report (if admin)
      if (isAdmin && (filters.reportType === 'admin' || filters.reportType === 'all')) {
        const adminResponse = await fetch(`${baseUrl}/admin/dashboard?${queryParams}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (adminResponse.ok) {
          const adminData = await adminResponse.json();
          setReports(prev => ({ ...prev, adminReport: adminData }));
        }
      }

      // Load performance report (if admin)
      if (isAdmin && (filters.reportType === 'performance' || filters.reportType === 'all')) {
        const performanceResponse = await fetch(`${baseUrl}/loans/performance?${queryParams}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (performanceResponse.ok) {
          const performanceData = await performanceResponse.json();
          setReports(prev => ({ ...prev, performanceReport: performanceData }));
        }
      }

    } catch (error) {
      console.error('Error loading reports:', error);
      setMessage('Error loading reports');
      setTimeout(() => setMessage(''), 3000);
    } finally {
      setLoading(false);
    }
  };

  const exportReport = async (type) => {
    try {
      const token = localStorage.getItem('token');
      const queryParams = new URLSearchParams();
      if (filters.startDate) queryParams.append('startDate', filters.startDate);
      if (filters.endDate) queryParams.append('endDate', filters.endDate);

      const response = await fetch(`http://localhost:5000/api/reports/export/${type}?${queryParams}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${type}_${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        
        setMessage(`${type} report exported successfully!`);
        setTimeout(() => setMessage(''), 3000);
      }
    } catch (error) {
      console.error('Error exporting report:', error);
      setMessage('Error exporting report');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const renderUserReport = () => {
    if (!reports.userReport) return null;

    const { summary, loans, payments } = reports.userReport;

    return (
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">User Report</h3>
        
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="text-sm font-medium text-blue-600">Total Loans</h4>
            <p className="text-2xl font-bold text-blue-800">{summary.totalLoans}</p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <h4 className="text-sm font-medium text-green-600">Active Loans</h4>
            <p className="text-2xl font-bold text-green-800">{summary.activeLoans}</p>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg">
            <h4 className="text-sm font-medium text-purple-600">Total Amount</h4>
            <p className="text-2xl font-bold text-purple-800">${summary.totalAmount?.toLocaleString()}</p>
          </div>
          <div className="bg-orange-50 p-4 rounded-lg">
            <h4 className="text-sm font-medium text-orange-600">Total Payments</h4>
            <p className="text-2xl font-bold text-orange-800">${summary.totalPayments?.toLocaleString()}</p>
          </div>
        </div>

        {/* Recent Loans */}
        <div className="mb-6">
          <h4 className="text-lg font-semibold text-gray-700 mb-3">Recent Loans</h4>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Created</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Due Date</th>
                </tr>
              </thead>
              <tbody>
                {loans?.slice(0, 5).map((loan, index) => (
                  <tr key={index} className="border-t border-gray-200">
                    <td className="px-4 py-2">${loan.amount?.toLocaleString()}</td>
                    <td className="px-4 py-2">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        loan.status === 'active' ? 'bg-green-100 text-green-800' :
                        loan.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                        loan.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {loan.status}
                      </span>
                    </td>
                    <td className="px-4 py-2">{new Date(loan.createdAt).toLocaleDateString()}</td>
                    <td className="px-4 py-2">{loan.dueDate ? new Date(loan.dueDate).toLocaleDateString() : 'N/A'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Payments */}
        <div>
          <h4 className="text-lg font-semibold text-gray-700 mb-3">Recent Payments</h4>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Method</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                </tr>
              </thead>
              <tbody>
                {payments?.slice(0, 5).map((payment, index) => (
                  <tr key={index} className="border-t border-gray-200">
                    <td className="px-4 py-2">${payment.amount?.toLocaleString()}</td>
                    <td className="px-4 py-2">{payment.method}</td>
                    <td className="px-4 py-2">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        payment.status === 'completed' ? 'bg-green-100 text-green-800' :
                        payment.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {payment.status}
                      </span>
                    </td>
                    <td className="px-4 py-2">{new Date(payment.date).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  const renderAdminReport = () => {
    if (!reports.adminReport || !isAdmin) return null;

    const { summary, monthlyTrends, loanStatusDistribution } = reports.adminReport;

    return (
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Admin Dashboard Report</h3>
        
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="text-sm font-medium text-blue-600">Total Users</h4>
            <p className="text-2xl font-bold text-blue-800">{summary.totalUsers}</p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <h4 className="text-sm font-medium text-green-600">Total Loans</h4>
            <p className="text-2xl font-bold text-green-800">{summary.totalLoans}</p>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg">
            <h4 className="text-sm font-medium text-purple-600">Total Amount</h4>
            <p className="text-2xl font-bold text-purple-800">${summary.totalAmount?.toLocaleString()}</p>
          </div>
          <div className="bg-orange-50 p-4 rounded-lg">
            <h4 className="text-sm font-medium text-orange-600">Default Rate</h4>
            <p className="text-2xl font-bold text-orange-800">{summary.defaultRate}%</p>
          </div>
        </div>

        {/* Loan Status Distribution */}
        <div className="mb-6">
          <h4 className="text-lg font-semibold text-gray-700 mb-3">Loan Status Distribution</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {loanStatusDistribution?.map((item, index) => (
              <div key={index} className="bg-gray-50 p-4 rounded-lg">
                <h5 className="text-sm font-medium text-gray-600">{item.status}</h5>
                <p className="text-xl font-bold text-gray-800">{item.count}</p>
                <p className="text-sm text-gray-500">{item.percentage}%</p>
              </div>
            ))}
          </div>
        </div>

        {/* Monthly Trends */}
        <div>
          <h4 className="text-lg font-semibold text-gray-700 mb-3">Monthly Trends</h4>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Month</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Loans</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Loan Amount</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Payments</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Payment Amount</th>
                </tr>
              </thead>
              <tbody>
                {monthlyTrends?.map((trend, index) => (
                  <tr key={index} className="border-t border-gray-200">
                    <td className="px-4 py-2">{trend.month}</td>
                    <td className="px-4 py-2">{trend.loans}</td>
                    <td className="px-4 py-2">${trend.loanAmount?.toLocaleString()}</td>
                    <td className="px-4 py-2">{trend.payments}</td>
                    <td className="px-4 py-2">${trend.paymentAmount?.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  const renderPerformanceReport = () => {
    if (!reports.performanceReport || !isAdmin) return null;

    const { summary, loans } = reports.performanceReport;

    return (
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Loan Performance Report</h3>
        
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="text-sm font-medium text-blue-600">Total Loans</h4>
            <p className="text-2xl font-bold text-blue-800">{summary.totalLoans}</p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <h4 className="text-sm font-medium text-green-600">On Track</h4>
            <p className="text-2xl font-bold text-green-800">{summary.onTrackLoans}</p>
          </div>
          <div className="bg-red-50 p-4 rounded-lg">
            <h4 className="text-sm font-medium text-red-600">At Risk</h4>
            <p className="text-2xl font-bold text-red-800">{summary.atRiskLoans}</p>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg">
            <h4 className="text-sm font-medium text-purple-600">Avg Progress</h4>
            <p className="text-2xl font-bold text-purple-800">{summary.averagePaymentProgress}%</p>
          </div>
        </div>

        {/* Performance Table */}
        <div>
          <h4 className="text-lg font-semibold text-gray-700 mb-3">Loan Performance Details</h4>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Progress</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Risk Level</th>
                </tr>
              </thead>
              <tbody>
                {loans?.slice(0, 10).map((loan, index) => (
                  <tr key={index} className="border-t border-gray-200">
                    <td className="px-4 py-2">
                      {loan.userId?.firstName} {loan.userId?.lastName}
                    </td>
                    <td className="px-4 py-2">${loan.amount?.toLocaleString()}</td>
                    <td className="px-4 py-2">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        loan.status === 'active' ? 'bg-green-100 text-green-800' :
                        loan.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {loan.status}
                      </span>
                    </td>
                    <td className="px-4 py-2">
                      <div className="flex items-center">
                        <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full" 
                            style={{ width: `${loan.paymentProgress}%` }}
                          ></div>
                        </div>
                        <span className="text-sm">{loan.paymentProgress}%</span>
                      </div>
                    </td>
                    <td className="px-4 py-2">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        loan.isOnTrack ? 'bg-green-100 text-green-800' :
                        loan.isAtRisk ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {loan.isOnTrack ? 'On Track' : loan.isAtRisk ? 'At Risk' : 'Moderate'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Reporting System</h2>
        <p className="text-gray-600">Generate comprehensive reports and analytics for your loan portfolio</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Report Filters</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
            <input
              type="date"
              value={filters.startDate}
              onChange={(e) => setFilters(prev => ({ ...prev, startDate: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
            <input
              type="date"
              value={filters.endDate}
              onChange={(e) => setFilters(prev => ({ ...prev, endDate: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Report Type</label>
            <select
              value={filters.reportType}
              onChange={(e) => setFilters(prev => ({ ...prev, reportType: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="user">User Report</option>
              {isAdmin && <option value="admin">Admin Report</option>}
              {isAdmin && <option value="performance">Performance Report</option>}
              {isAdmin && <option value="all">All Reports</option>}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Export Format</label>
            <select
              value={filters.exportFormat}
              onChange={(e) => setFilters(prev => ({ ...prev, exportFormat: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="json">JSON</option>
              <option value="csv">CSV</option>
            </select>
          </div>
        </div>
      </div>

      {/* Export Buttons */}
      {isAdmin && (
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Export Reports</h3>
          <div className="flex flex-wrap gap-4">
            <button
              onClick={() => exportReport('loans')}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Export Loans
            </button>
            <button
              onClick={() => exportReport('payments')}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              Export Payments
            </button>
          </div>
        </div>
      )}

      {/* Message */}
      {message && (
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-md">
          <p className="text-blue-800">{message}</p>
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="mb-6 p-4 bg-gray-50 border border-gray-200 rounded-md">
          <p className="text-gray-600">Loading reports...</p>
        </div>
      )}

      {/* Reports */}
      {filters.reportType === 'user' || filters.reportType === 'all' ? renderUserReport() : null}
      {filters.reportType === 'admin' || filters.reportType === 'all' ? renderAdminReport() : null}
      {filters.reportType === 'performance' || filters.reportType === 'all' ? renderPerformanceReport() : null}
    </div>
  );
};

export default ReportingSystem; 
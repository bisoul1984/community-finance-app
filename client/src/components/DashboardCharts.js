import React, { useState, useEffect } from 'react';
import { useRef } from 'react';

const DashboardCharts = ({ user, loans, payments }) => {
  const [chartData, setChartData] = useState({
    loanStatus: [],
    paymentHistory: [],
    monthlyTrends: [],
    riskMetrics: {}
  });

  useEffect(() => {
    // Generate sample data for charts
    generateChartData();
  }, [loans, payments]);

  const generateChartData = () => {
    // Loan Status Distribution
    const loanStatusData = [
      { status: 'Active', count: loans?.filter(loan => loan.status === 'active').length || 0, color: '#10b981' },
      { status: 'Pending', count: loans?.filter(loan => loan.status === 'pending').length || 0, color: '#f59e0b' },
      { status: 'Completed', count: loans?.filter(loan => loan.status === 'completed').length || 0, color: '#3b82f6' },
      { status: 'Defaulted', count: loans?.filter(loan => loan.status === 'defaulted').length || 0, color: '#ef4444' }
    ];

    // Payment History (last 6 months)
    const paymentHistoryData = [];
    for (let i = 5; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const monthName = date.toLocaleDateString('en-US', { month: 'short' });
      const monthPayments = payments?.filter(payment => {
        const paymentDate = new Date(payment.date);
        return paymentDate.getMonth() === date.getMonth() && 
               paymentDate.getFullYear() === date.getFullYear();
      }) || [];
      
      paymentHistoryData.push({
        month: monthName,
        amount: monthPayments.reduce((sum, payment) => sum + payment.amount, 0),
        count: monthPayments.length
      });
    }

    // Monthly Trends
    const monthlyTrendsData = [];
    for (let i = 5; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const monthName = date.toLocaleDateString('en-US', { month: 'short' });
      const monthLoans = loans?.filter(loan => {
        const loanDate = new Date(loan.createdAt);
        return loanDate.getMonth() === date.getMonth() && 
               loanDate.getFullYear() === date.getFullYear();
      }) || [];
      
      monthlyTrendsData.push({
        month: monthName,
        loans: monthLoans.length,
        amount: monthLoans.reduce((sum, loan) => sum + loan.amount, 0)
      });
    }

    // Risk Metrics
    const totalLoans = loans?.length || 0;
    const activeLoans = loans?.filter(loan => loan.status === 'active').length || 0;
    const defaultedLoans = loans?.filter(loan => loan.status === 'defaulted').length || 0;
    const defaultRate = totalLoans > 0 ? (defaultedLoans / totalLoans) * 100 : 0;

    setChartData({
      loanStatus: loanStatusData,
      paymentHistory: paymentHistoryData,
      monthlyTrends: monthlyTrendsData,
      riskMetrics: {
        totalLoans,
        activeLoans,
        defaultRate: defaultRate.toFixed(1),
        averageLoanAmount: totalLoans > 0 ? 
          (loans.reduce((sum, loan) => sum + loan.amount, 0) / totalLoans).toFixed(2) : 0
      }
    });
  };

  const renderLoanStatusChart = () => (
    <div className="bg-white p-4 sm:p-6 rounded-lg shadow-lg">
      <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-3 sm:mb-4">Loan Status Distribution</h3>
      <div className="space-y-2 sm:space-y-3">
        {chartData.loanStatus.map((item, index) => (
          <div key={index} className="flex items-center justify-between">
            <div className="flex items-center space-x-2 sm:space-x-3">
              <div 
                className="w-3 h-3 sm:w-4 sm:h-4 rounded-full"
                style={{ backgroundColor: item.color }}
              ></div>
              <span className="text-gray-700 text-sm sm:text-base">{item.status}</span>
            </div>
            <div className="flex items-center space-x-1 sm:space-x-2">
              <span className="font-semibold text-gray-800 text-sm sm:text-base">{item.count}</span>
              <span className="text-xs sm:text-sm text-gray-500">
                ({((item.count / Math.max(1, chartData.loanStatus.reduce((sum, i) => sum + i.count, 0))) * 100).toFixed(1)}%)
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderPaymentHistoryChart = () => (
    <div className="bg-white p-4 sm:p-6 rounded-lg shadow-lg">
      <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-3 sm:mb-4">Payment History (Last 6 Months)</h3>
      <div className="space-y-3 sm:space-y-4">
        {chartData.paymentHistory.map((item, index) => (
          <div key={index} className="flex items-center justify-between">
            <span className="text-gray-700 font-medium text-sm sm:text-base">{item.month}</span>
            <div className="flex items-center space-x-2 sm:space-x-4">
              <span className="text-xs sm:text-sm text-gray-500">{item.count} payments</span>
              <span className="font-semibold text-green-600 text-sm sm:text-base">
                ${item.amount.toFixed(2)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderMonthlyTrendsChart = () => (
    <div className="bg-white p-4 sm:p-6 rounded-lg shadow-lg">
      <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-3 sm:mb-4">Monthly Loan Trends</h3>
      <div className="space-y-3 sm:space-y-4">
        {chartData.monthlyTrends.map((item, index) => (
          <div key={index} className="flex items-center justify-between">
            <span className="text-gray-700 font-medium text-sm sm:text-base">{item.month}</span>
            <div className="flex items-center space-x-2 sm:space-x-4">
              <span className="text-xs sm:text-sm text-gray-500">{item.loans} loans</span>
              <span className="font-semibold text-blue-600 text-sm sm:text-base">
                ${item.amount.toFixed(2)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderRiskMetrics = () => (
    <div className="bg-white p-4 sm:p-6 rounded-lg shadow-lg">
      <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-3 sm:mb-4">Risk & Performance Metrics</h3>
      <div className="grid grid-cols-2 gap-3 sm:gap-4">
        <div className="text-center p-3 sm:p-4 bg-blue-50 rounded-lg">
          <div className="text-xl sm:text-2xl font-bold text-blue-600">
            {chartData.riskMetrics.totalLoans}
          </div>
          <div className="text-xs sm:text-sm text-gray-600">Total Loans</div>
        </div>
        <div className="text-center p-3 sm:p-4 bg-green-50 rounded-lg">
          <div className="text-xl sm:text-2xl font-bold text-green-600">
            {chartData.riskMetrics.activeLoans}
          </div>
          <div className="text-xs sm:text-sm text-gray-600">Active Loans</div>
        </div>
        <div className="text-center p-3 sm:p-4 bg-yellow-50 rounded-lg">
          <div className="text-xl sm:text-2xl font-bold text-yellow-600">
            {chartData.riskMetrics.defaultRate}%
          </div>
          <div className="text-xs sm:text-sm text-gray-600">Default Rate</div>
        </div>
        <div className="text-center p-3 sm:p-4 bg-purple-50 rounded-lg">
          <div className="text-xl sm:text-2xl font-bold text-purple-600">
            ${chartData.riskMetrics.averageLoanAmount}
          </div>
          <div className="text-xs sm:text-sm text-gray-600">Avg Loan Amount</div>
        </div>
      </div>
    </div>
  );

  const renderQuickStats = () => {
    const totalBorrowed = loans?.reduce((sum, loan) => sum + loan.amount, 0) || 0;
    const totalPaid = payments?.reduce((sum, payment) => sum + payment.amount, 0) || 0;
    const outstandingBalance = totalBorrowed - totalPaid;

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-4 sm:p-6 rounded-lg text-white">
          <div className="text-2xl sm:text-3xl font-bold">${totalBorrowed.toFixed(2)}</div>
          <div className="text-blue-100 text-sm sm:text-base">Total Borrowed</div>
        </div>
        <div className="bg-gradient-to-r from-green-500 to-green-600 p-4 sm:p-6 rounded-lg text-white">
          <div className="text-2xl sm:text-3xl font-bold">${totalPaid.toFixed(2)}</div>
          <div className="text-green-100 text-sm sm:text-base">Total Paid</div>
        </div>
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-4 sm:p-6 rounded-lg text-white sm:col-span-2 lg:col-span-1">
          <div className="text-2xl sm:text-3xl font-bold">${outstandingBalance.toFixed(2)}</div>
          <div className="text-orange-100 text-sm sm:text-base">Outstanding Balance</div>
        </div>
      </div>
    );
  };

  const [exportFormat, setExportFormat] = useState('csv');
  const chartRef = useRef();

  // Portfolio Diversification by Category
  const categoryBreakdown = loans.reduce((acc, loan) => {
    if (!loan.category) return acc;
    acc[loan.category] = (acc[loan.category] || 0) + 1;
    return acc;
  }, {});

  // Region Breakdown
  const regionBreakdown = loans.reduce((acc, loan) => {
    if (!loan.borrower?.city) return acc;
    acc[loan.borrower.city] = (acc[loan.borrower.city] || 0) + 1;
    return acc;
  }, {});

  // Risk Over Time (default rate by month)
  const riskOverTime = [];
  for (let i = 5; i >= 0; i--) {
    const date = new Date();
    date.setMonth(date.getMonth() - i);
    const monthName = date.toLocaleDateString('en-US', { month: 'short' });
    const monthLoans = loans.filter(loan => {
      const loanDate = new Date(loan.createdAt);
      return loanDate.getMonth() === date.getMonth() && loanDate.getFullYear() === date.getFullYear();
    });
    const defaulted = monthLoans.filter(l => l.status === 'defaulted').length;
    const rate = monthLoans.length > 0 ? (defaulted / monthLoans.length) * 100 : 0;
    riskOverTime.push({ month: monthName, defaultRate: rate });
  }

  // Export chart data
  const exportChartData = (type) => {
    let data;
    if (type === 'category') data = categoryBreakdown;
    else if (type === 'region') data = regionBreakdown;
    else if (type === 'risk') data = riskOverTime;
    else data = chartData;
    const blob = new Blob([
      exportFormat === 'csv' ?
        Object.entries(data).map(([k, v]) => `${k},${typeof v === 'object' ? JSON.stringify(v) : v}`).join('\n') :
        JSON.stringify(data, null, 2)
    ], { type: exportFormat === 'csv' ? 'text/csv' : 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${type}_chart.${exportFormat}`;
    document.body.appendChild(a);
    a.click();
    URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  return (
    <div className="space-y-6">
      {renderQuickStats()}
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 sm:gap-6">
        {renderLoanStatusChart()}
        {renderPaymentHistoryChart()}
        {renderMonthlyTrendsChart()}
        {renderRiskMetrics()}
        {/* Portfolio Diversification */}
        <div className="bg-white p-4 sm:p-6 rounded-lg shadow-lg">
          <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-3 sm:mb-4">Portfolio Diversification (by Category)</h3>
          <ul className="mb-3 sm:mb-4 space-y-1">
            {Object.entries(categoryBreakdown).map(([cat, count]) => (
              <li key={cat} className="flex justify-between text-sm sm:text-base"><span>{cat}</span><span>{count}</span></li>
            ))}
          </ul>
          <button className="px-2 sm:px-3 py-1 bg-blue-600 text-white rounded text-xs sm:text-sm" onClick={() => exportChartData('category')}>Export</button>
        </div>
        {/* Region Breakdown */}
        <div className="bg-white p-4 sm:p-6 rounded-lg shadow-lg">
          <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-3 sm:mb-4">Region Breakdown</h3>
          <ul className="mb-3 sm:mb-4 space-y-1">
            {Object.entries(regionBreakdown).map(([region, count]) => (
              <li key={region} className="flex justify-between text-sm sm:text-base"><span>{region}</span><span>{count}</span></li>
            ))}
          </ul>
          <button className="px-2 sm:px-3 py-1 bg-blue-600 text-white rounded text-xs sm:text-sm" onClick={() => exportChartData('region')}>Export</button>
        </div>
        {/* Risk Over Time */}
        <div className="bg-white p-4 sm:p-6 rounded-lg shadow-lg col-span-1 md:col-span-2">
          <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-3 sm:mb-4">Risk Over Time (Default Rate by Month)</h3>
          <ul className="mb-3 sm:mb-4 flex flex-wrap gap-2 sm:gap-4">
            {riskOverTime.map((item, idx) => (
              <li key={idx} className="flex flex-col items-center text-xs sm:text-sm"><span className="font-bold">{item.month}</span><span>{item.defaultRate.toFixed(1)}%</span></li>
            ))}
          </ul>
          <button className="px-2 sm:px-3 py-1 bg-blue-600 text-white rounded text-xs sm:text-sm" onClick={() => exportChartData('risk')}>Export</button>
        </div>
      </div>

      {/* Insights Section */}
      <div className="bg-white p-4 sm:p-6 rounded-lg shadow-lg">
        <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-3 sm:mb-4">💡 Insights & Recommendations</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          <div>
            <h4 className="font-semibold text-gray-700 mb-2 text-sm sm:text-base">Performance Highlights</h4>
            <ul className="space-y-1 sm:space-y-2 text-xs sm:text-sm text-gray-600">
              <li>• {chartData.riskMetrics.activeLoans} active loans currently</li>
              <li>• {chartData.riskMetrics.defaultRate}% default rate (industry avg: 5-10%)</li>
              <li>• Average loan amount: ${chartData.riskMetrics.averageLoanAmount}</li>
              <li>• Payment consistency: {payments?.length || 0} total payments</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-gray-700 mb-2 text-sm sm:text-base">Recommendations</h4>
            <ul className="space-y-1 sm:space-y-2 text-xs sm:text-sm text-gray-600">
              <li>• Maintain current payment schedule for better rates</li>
              <li>• Consider consolidating multiple loans if applicable</li>
              <li>• Build credit history with consistent payments</li>
              <li>• Review loan terms for refinancing opportunities</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardCharts; 
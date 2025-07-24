import React, { useState, useEffect } from 'react';
import DashboardCharts from '../components/DashboardCharts';
import { getUserLoans } from '../api/loans';

const ReturnsTracker = ({ user }) => {
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchLoans();
  }, []);

  const fetchLoans = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await getUserLoans(user.id);
      setLoans(data.filter(l => l.status !== 'pending' && l.status !== 'approved'));
    } catch (err) {
      setError('Failed to load returns data.');
    } finally {
      setLoading(false);
    }
  };

  // Summary stats
  const totalInvested = loans.reduce((sum, l) => sum + (l.amount || 0), 0);
  const totalRepaid = loans.reduce((sum, l) => sum + (l.totalRepaid || 0), 0);
  const expectedReturns = loans.reduce((sum, l) => sum + ((l.amount || 0) * (l.interestRate || 0.1)), 0);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50" aria-busy="true" aria-live="polite">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mb-3" role="status" aria-label="Loading"></div>
          <span className="text-slate-600">Loading returns data...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-gray-50 py-10 px-2 md:px-8">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-6 flex items-center gap-2">
          Returns Tracker
        </h2>
        {error ? (
          <div className="text-center py-16 text-rose-600">{error}</div>
        ) : (
          <>
            <div className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-lg shadow p-4 flex flex-col items-center" title="Total Invested" aria-label="Total Invested" tabIndex={0}>
                <span className="text-xs text-slate-500 mb-1">Total Invested</span>
                <span className="text-2xl font-bold text-blue-700">${totalInvested.toLocaleString()}</span>
              </div>
              <div className="bg-white rounded-lg shadow p-4 flex flex-col items-center" title="Total Repaid" aria-label="Total Repaid" tabIndex={0}>
                <span className="text-xs text-slate-500 mb-1">Total Repaid</span>
                <span className="text-2xl font-bold text-emerald-700">${totalRepaid.toLocaleString()}</span>
              </div>
              <div className="bg-white rounded-lg shadow p-4 flex flex-col items-center" title="Expected Returns" aria-label="Expected Returns" tabIndex={0}>
                <span className="text-xs text-slate-500 mb-1">Expected Returns</span>
                <span className="text-2xl font-bold text-yellow-600">${expectedReturns.toLocaleString()}</span>
              </div>
            </div>
            <div className="mb-10">
              <DashboardCharts user={user} loans={loans} payments={[]} title="Returns Over Time" aria-label="Returns Over Time" tabIndex={0} />
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-slate-800 mb-4">Investment Returns Details</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className="bg-slate-100">
                      <th className="px-4 py-2 text-left">Loan</th>
                      <th className="px-4 py-2 text-left">Amount</th>
                      <th className="px-4 py-2 text-left">Interest Rate</th>
                      <th className="px-4 py-2 text-left">Repaid</th>
                      <th className="px-4 py-2 text-left">Expected Return</th>
                      <th className="px-4 py-2 text-left">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loans.map((loan) => (
                      <tr key={loan._id} className="border-b">
                        <td className="px-4 py-2">${loan.amount.toLocaleString()}</td>
                        <td className="px-4 py-2">${loan.amount.toLocaleString()}</td>
                        <td className="px-4 py-2">{((loan.interestRate || 0.1) * 100).toFixed(1)}%</td>
                        <td className="px-4 py-2">${loan.totalRepaid?.toLocaleString() || 0}</td>
                        <td className="px-4 py-2">${(loan.amount * (loan.interestRate || 0.1)).toLocaleString()}</td>
                        <td className="px-4 py-2 capitalize">{loan.status}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ReturnsTracker; 
import React, { useState, useEffect } from 'react';
import { getLoanRequests, fundLoan } from '../api/loans';

const BrowseLoans = ({ user }) => {
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [fundingAmounts, setFundingAmounts] = useState({});

  useEffect(() => {
    fetchLoans();
  }, []);

  const fetchLoans = async () => {
    try {
      const data = await getLoanRequests();
      setLoans(data);
    } catch (err) {
      setError('Failed to load loan requests.');
    } finally {
      setLoading(false);
    }
  };

  const handleFund = async (loanId) => {
    const amount = parseFloat(fundingAmounts[loanId]);
    if (!amount || amount <= 0) {
      setError('Please enter a valid amount.');
      return;
    }

    try {
      await fundLoan(loanId, { amount });
      setError('');
      // Refresh the loans list
      fetchLoans();
      // Clear the funding amount
      setFundingAmounts({ ...fundingAmounts, [loanId]: '' });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fund loan.');
    }
  };

  const handleAmountChange = (loanId, value) => {
    setFundingAmounts({ ...fundingAmounts, [loanId]: value });
  };

  if (loading) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <p>Loading loan requests...</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '2rem', backgroundColor: '#f8fafc', minHeight: '100vh' }}>
      <h2 style={{ color: '#1e40af', marginBottom: '1.5rem' }}>Browse Loan Requests</h2>
      
      {error && (
        <div style={{ 
          backgroundColor: '#fee2e2', 
          color: '#dc2626', 
          padding: '1rem', 
          borderRadius: '0.375rem', 
          marginBottom: '1rem',
          border: '1px solid #fecaca'
        }}>
          {error}
        </div>
      )}

      {loans.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem' }}>
          <p style={{ color: '#6b7280', fontSize: '1.1rem' }}>
            No loan requests available at the moment.
          </p>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '1.5rem' }}>
          {loans.map((loan) => (
            <div key={loan._id} style={{ 
              backgroundColor: 'white', 
              padding: '1.5rem', 
              borderRadius: '0.5rem', 
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
              border: '1px solid #e5e7eb'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                <div>
                  <h3 style={{ color: '#374151', marginBottom: '0.5rem' }}>
                    ${loan.amount.toLocaleString()} Loan Request
                  </h3>
                  <p style={{ color: '#6b7280', marginBottom: '0.5rem' }}>
                    <strong>Borrower:</strong> {loan.borrower.name}
                  </p>
                  <p style={{ color: '#6b7280', marginBottom: '0.5rem' }}>
                    <strong>Purpose:</strong> {loan.purpose}
                  </p>
                  <p style={{ color: '#6b7280', marginBottom: '0.5rem' }}>
                    <strong>Term:</strong> {loan.term} days
                  </p>
                  <p style={{ color: '#6b7280' }}>
                    <strong>Reputation:</strong> {loan.borrower.reputation || 0}
                  </p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ 
                    padding: '0.25rem 0.75rem', 
                    backgroundColor: '#f59e0b', 
                    color: 'white', 
                    borderRadius: '1rem',
                    fontSize: '0.875rem',
                    fontWeight: '500'
                  }}>
                    Pending
                  </span>
                </div>
              </div>

              <div style={{ 
                backgroundColor: '#f3f4f6', 
                padding: '1rem', 
                borderRadius: '0.375rem',
                marginBottom: '1rem'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <span style={{ color: '#374151', fontWeight: '500' }}>Funding Progress</span>
                  <span style={{ color: '#6b7280' }}>
                    ${loan.fundedAmount.toLocaleString()} / ${loan.amount.toLocaleString()}
                  </span>
                </div>
                <div style={{ 
                  width: '100%', 
                  height: '8px', 
                  backgroundColor: '#e5e7eb', 
                  borderRadius: '4px',
                  overflow: 'hidden'
                }}>
                  <div style={{ 
                    width: `${(loan.fundedAmount / loan.amount) * 100}%`,
                    height: '100%',
                    backgroundColor: '#059669',
                    transition: 'width 0.3s ease'
                  }} />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <input
                  type="number"
                  placeholder="Enter amount to fund"
                  value={fundingAmounts[loan._id] || ''}
                  onChange={(e) => handleAmountChange(loan._id, e.target.value)}
                  min="1"
                  max={loan.amount - loan.fundedAmount}
                  style={{ 
                    flex: 1,
                    padding: '0.75rem', 
                    border: '1px solid #d1d5db', 
                    borderRadius: '0.375rem',
                    fontSize: '1rem'
                  }}
                />
                <button 
                  onClick={() => handleFund(loan._id)}
                  disabled={!fundingAmounts[loan._id] || parseFloat(fundingAmounts[loan._id]) <= 0}
                  style={{ 
                    padding: '0.75rem 1.5rem', 
                    backgroundColor: '#2563eb', 
                    color: 'white', 
                    border: 'none',
                    borderRadius: '0.375rem',
                    cursor: 'pointer',
                    fontSize: '1rem',
                    fontWeight: '500',
                    opacity: (!fundingAmounts[loan._id] || parseFloat(fundingAmounts[loan._id]) <= 0) ? 0.5 : 1
                  }}
                >
                  Fund Loan
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BrowseLoans; 
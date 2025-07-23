import React, { useState, useEffect } from 'react';
import { getLoanRequests, fundLoan } from '../api/loans';

const BrowseLoans = ({ user }) => {
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [fundingAmount, setFundingAmount] = useState({});

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
    const amount = parseFloat(fundingAmount[loanId]);
    if (!amount || amount <= 0) {
      alert('Please enter a valid amount.');
      return;
    }

    try {
      await fundLoan(loanId, {
        lenderId: user.id,
        amount
      });
      
      // Refresh loans after funding
      fetchLoans();
      setFundingAmount({ ...fundingAmount, [loanId]: '' });
      alert('Loan funded successfully!');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to fund loan.');
    }
  };

  const getProgressPercentage = (funded, total) => {
    return Math.round((funded / total) * 100);
  };

  if (loading) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <p>Loading loan requests...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center', color: '#dc2626' }}>
        {error}
      </div>
    );
  }

  return (
    <div style={{ padding: '2rem', backgroundColor: '#f8fafc', minHeight: '100vh' }}>
      <h2 style={{ color: '#1e40af', marginBottom: '1.5rem' }}>Available Loan Requests</h2>
      
      {loans.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <p style={{ color: '#6b7280', fontSize: '1.1rem' }}>No loan requests available at the moment.</p>
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
                    <strong>Borrower:</strong> {loan.borrower.name} (Reputation: {loan.borrower.reputation || 0})
                  </p>
                  <p style={{ color: '#6b7280', marginBottom: '0.5rem' }}>
                    <strong>Purpose:</strong> {loan.purpose}
                  </p>
                  <p style={{ color: '#6b7280' }}>
                    <strong>Term:</strong> {loan.term} days
                  </p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ color: '#059669', fontWeight: 'bold' }}>
                    ${loan.fundedAmount.toLocaleString()} / ${loan.amount.toLocaleString()}
                  </p>
                  <p style={{ color: '#6b7280', fontSize: '0.9rem' }}>
                    {getProgressPercentage(loan.fundedAmount, loan.amount)}% funded
                  </p>
                </div>
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <div style={{ 
                  width: '100%', 
                  height: '8px', 
                  backgroundColor: '#e5e7eb', 
                  borderRadius: '4px',
                  overflow: 'hidden'
                }}>
                  <div style={{ 
                    width: `${getProgressPercentage(loan.fundedAmount, loan.amount)}%`,
                    height: '100%',
                    backgroundColor: '#059669',
                    transition: 'width 0.3s ease'
                  }} />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <input
                  type="number"
                  placeholder="Amount to fund"
                  value={fundingAmount[loan._id] || ''}
                  onChange={(e) => setFundingAmount({
                    ...fundingAmount,
                    [loan._id]: e.target.value
                  })}
                  min="1"
                  max={loan.amount - loan.fundedAmount}
                  step="0.01"
                  style={{ 
                    padding: '0.5rem', 
                    border: '1px solid #d1d5db', 
                    borderRadius: '0.375rem',
                    flex: 1
                  }}
                />
                <button
                  onClick={() => handleFund(loan._id)}
                  disabled={loan.fundedAmount >= loan.amount}
                  style={{ 
                    padding: '0.5rem 1rem', 
                    backgroundColor: loan.fundedAmount >= loan.amount ? '#9ca3af' : '#2563eb', 
                    color: 'white', 
                    border: 'none',
                    borderRadius: '0.375rem',
                    cursor: loan.fundedAmount >= loan.amount ? 'not-allowed' : 'pointer'
                  }}
                >
                  {loan.fundedAmount >= loan.amount ? 'Fully Funded' : 'Fund Loan'}
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
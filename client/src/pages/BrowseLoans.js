import React, { useState, useEffect } from 'react';
import { getLoanRequests, fundLoan } from '../api/loans';
import UserProfile from '../components/UserProfile';

const BrowseLoans = ({ user }) => {
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [fundingAmounts, setFundingAmounts] = useState({});
  const [filters, setFilters] = useState({ location: '', trustScore: '', amount: '', category: '' });
  const [showProfile, setShowProfile] = useState(false);
  const [selectedBorrower, setSelectedBorrower] = useState(null);

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

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  const filteredLoans = loans.filter(loan => {
    const matchesLocation = !filters.location || (loan.borrower.city && loan.borrower.city.toLowerCase().includes(filters.location.toLowerCase()));
    const matchesTrust = !filters.trustScore || (loan.borrower.reputation >= Number(filters.trustScore));
    const matchesAmount = !filters.amount || (loan.amount >= Number(filters.amount));
    const matchesCategory = !filters.category || (loan.category && loan.category.toLowerCase().includes(filters.category.toLowerCase()));
    return matchesLocation && matchesTrust && matchesAmount && matchesCategory;
  });

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

      <div style={{ marginBottom: '2rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
        <input name="location" value={filters.location} onChange={handleFilterChange} placeholder="Location" style={{ padding: '0.5rem', borderRadius: '0.375rem', border: '1px solid #d1d5db' }} />
        <input name="trustScore" value={filters.trustScore} onChange={handleFilterChange} placeholder="Min Trust Score" type="number" min="0" max="5" step="0.1" style={{ padding: '0.5rem', borderRadius: '0.375rem', border: '1px solid #d1d5db', width: '8rem' }} />
        <input name="amount" value={filters.amount} onChange={handleFilterChange} placeholder="Min Amount" type="number" min="0" style={{ padding: '0.5rem', borderRadius: '0.375rem', border: '1px solid #d1d5db', width: '8rem' }} />
        <input name="category" value={filters.category} onChange={handleFilterChange} placeholder="Category" style={{ padding: '0.5rem', borderRadius: '0.375rem', border: '1px solid #d1d5db' }} />
      </div>

      {filteredLoans.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem' }}>
          <p style={{ color: '#6b7280', fontSize: '1.1rem' }}>
            No loan requests available at the moment.
          </p>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '1.5rem' }}>
          {filteredLoans.map((loan) => (
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
              <button onClick={() => { setSelectedBorrower(loan.borrower); setShowProfile(true); }} style={{ marginTop: '1rem', background: '#2563eb', color: 'white', border: 'none', borderRadius: '0.375rem', padding: '0.5rem 1rem', fontWeight: '500', cursor: 'pointer' }}>View Profile</button>
            </div>
          ))}
        </div>
      )}
      {showProfile && selectedBorrower && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.4)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: 'white', borderRadius: '1rem', padding: '2rem', maxWidth: '600px', width: '100%', maxHeight: '90vh', overflowY: 'auto', position: 'relative' }}>
            <button onClick={() => setShowProfile(false)} style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'transparent', border: 'none', fontSize: '1.5rem', cursor: 'pointer' }}>&times;</button>
            <UserProfile user={selectedBorrower} readOnly />
          </div>
        </div>
      )}
    </div>
  );
};

export default BrowseLoans; 
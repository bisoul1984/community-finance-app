import React, { useState, useEffect } from 'react';
import { getUserLoans, repayLoan } from '../api/loans';

const RepaymentTracker = ({ user }) => {
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [repaymentAmounts, setRepaymentAmounts] = useState({});
  const [selectedLoan, setSelectedLoan] = useState(null);

  useEffect(() => {
    fetchUserLoans();
  }, []);

  const fetchUserLoans = async () => {
    try {
      const data = await getUserLoans(user.id);
      // Filter only active loans (funded, active, or overdue)
      const activeLoans = data.filter(loan => 
        loan.status === 'funded' || loan.status === 'active' || loan.status === 'overdue'
      );
      setLoans(activeLoans);
    } catch (err) {
      setError('Failed to load your loans.');
    } finally {
      setLoading(false);
    }
  };

  const handleRepayment = async (loanId) => {
    const amount = parseFloat(repaymentAmounts[loanId]);
    if (!amount || amount <= 0) {
      setError('Please enter a valid repayment amount.');
      return;
    }

    try {
      await repayLoan(loanId, amount);
      setError('');
      // Refresh the loans list
      fetchUserLoans();
      // Clear the repayment amount
      setRepaymentAmounts({ ...repaymentAmounts, [loanId]: '' });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to process repayment.');
    }
  };

  const handleAmountChange = (loanId, value) => {
    setRepaymentAmounts({ ...repaymentAmounts, [loanId]: value });
  };

  const getDaysRemaining = (dueDate) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getStatusColor = (status, dueDate) => {
    if (status === 'overdue' || (dueDate && getDaysRemaining(dueDate) < 0)) {
      return '#dc2626'; // Red for overdue
    } else if (status === 'active') {
      return '#2563eb'; // Blue for active
    } else if (status === 'funded') {
      return '#059669'; // Green for funded
    }
    return '#6b7280'; // Gray for default
  };

  const getStatusText = (status, dueDate) => {
    if (status === 'overdue' || (dueDate && getDaysRemaining(dueDate) < 0)) {
      return 'Overdue';
    } else if (status === 'active') {
      return 'Active';
    } else if (status === 'funded') {
      return 'Funded';
    }
    return status;
  };

  if (loading) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <p>Loading your loans...</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '2rem', backgroundColor: '#f8fafc', minHeight: '100vh' }}>
      <h2 style={{ color: '#1e40af', marginBottom: '1.5rem' }}>Repayment Tracker</h2>
      
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
          <p style={{ color: '#6b7280', fontSize: '1.1rem', marginBottom: '1rem' }}>
            No active loans requiring repayment.
          </p>
          <p style={{ color: '#9ca3af' }}>
            All your loans are either pending, completed, or you haven't borrowed yet.
          </p>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '1.5rem' }}>
          {loans.map((loan) => {
            const daysRemaining = loan.dueDate ? getDaysRemaining(loan.dueDate) : null;
            const isOverdue = daysRemaining !== null && daysRemaining < 0;
            const remainingAmount = loan.amount - loan.totalRepaid;
            
            return (
              <div key={loan._id} style={{ 
                backgroundColor: 'white', 
                padding: '1.5rem', 
                borderRadius: '0.5rem', 
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                border: '1px solid #e5e7eb',
                borderLeft: `4px solid ${getStatusColor(loan.status, loan.dueDate)}`
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                  <div>
                    <h3 style={{ color: '#374151', marginBottom: '0.5rem' }}>
                      ${loan.amount.toLocaleString()} Loan
                    </h3>
                    <p style={{ color: '#6b7280', marginBottom: '0.5rem' }}>
                      <strong>Purpose:</strong> {loan.purpose}
                    </p>
                    <p style={{ color: '#6b7280', marginBottom: '0.5rem' }}>
                      <strong>Term:</strong> {loan.term} days
                    </p>
                    <p style={{ color: '#6b7280' }}>
                      <strong>Created:</strong> {new Date(loan.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span style={{ 
                      padding: '0.25rem 0.75rem', 
                      backgroundColor: getStatusColor(loan.status, loan.dueDate), 
                      color: 'white', 
                      borderRadius: '1rem',
                      fontSize: '0.875rem',
                      fontWeight: '500'
                    }}>
                      {getStatusText(loan.status, loan.dueDate)}
                    </span>
                  </div>
                </div>

                {/* Repayment Progress */}
                <div style={{ marginBottom: '1.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <span style={{ color: '#374151', fontWeight: '500' }}>Repayment Progress</span>
                    <span style={{ color: '#6b7280' }}>
                      ${loan.totalRepaid.toLocaleString()} / ${loan.amount.toLocaleString()}
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
                      width: `${(loan.totalRepaid / loan.amount) * 100}%`,
                      height: '100%',
                      backgroundColor: '#2563eb',
                      transition: 'width 0.3s ease'
                    }} />
                  </div>
                </div>

                {/* Due Date and Remaining Amount */}
                <div style={{ 
                  backgroundColor: isOverdue ? '#fee2e2' : '#f3f4f6', 
                  padding: '1rem', 
                  borderRadius: '0.375rem',
                  marginBottom: '1rem',
                  border: isOverdue ? '1px solid #fecaca' : '1px solid #e5e7eb'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <p style={{ 
                        color: isOverdue ? '#dc2626' : '#374151', 
                        fontWeight: '500', 
                        margin: 0 
                      }}>
                        {isOverdue ? 'Overdue by' : 'Due in'} {Math.abs(daysRemaining)} days
                      </p>
                      <p style={{ 
                        color: isOverdue ? '#dc2626' : '#6b7280', 
                        margin: 0, 
                        fontSize: '0.875rem' 
                      }}>
                        Due: {new Date(loan.dueDate).toLocaleDateString()}
                      </p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <p style={{ 
                        color: isOverdue ? '#dc2626' : '#374151', 
                        fontWeight: 'bold', 
                        margin: 0,
                        fontSize: '1.25rem'
                      }}>
                        ${remainingAmount.toLocaleString()}
                      </p>
                      <p style={{ 
                        color: '#6b7280', 
                        margin: 0, 
                        fontSize: '0.875rem' 
                      }}>
                        Remaining
                      </p>
                    </div>
                  </div>
                </div>

                {/* Repayment Form */}
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                  <input
                    type="number"
                    placeholder="Enter repayment amount"
                    value={repaymentAmounts[loan._id] || ''}
                    onChange={(e) => handleAmountChange(loan._id, e.target.value)}
                    min="1"
                    max={remainingAmount}
                    step="0.01"
                    style={{ 
                      flex: 1,
                      padding: '0.75rem', 
                      border: '1px solid #d1d5db', 
                      borderRadius: '0.375rem',
                      fontSize: '1rem'
                    }}
                  />
                  <button 
                    onClick={() => handleRepayment(loan._id)}
                    disabled={!repaymentAmounts[loan._id] || parseFloat(repaymentAmounts[loan._id]) <= 0 || parseFloat(repaymentAmounts[loan._id]) > remainingAmount}
                    style={{ 
                      padding: '0.75rem 1.5rem', 
                      backgroundColor: isOverdue ? '#dc2626' : '#2563eb', 
                      color: 'white', 
                      border: 'none',
                      borderRadius: '0.375rem',
                      cursor: 'pointer',
                      fontSize: '1rem',
                      fontWeight: '500',
                      opacity: (!repaymentAmounts[loan._id] || parseFloat(repaymentAmounts[loan._id]) <= 0 || parseFloat(repaymentAmounts[loan._id]) > remainingAmount) ? 0.5 : 1
                    }}
                  >
                    {isOverdue ? 'Pay Now' : 'Make Payment'}
                  </button>
                </div>

                {/* Recent Repayments */}
                {loan.repayments && loan.repayments.length > 0 && (
                  <div style={{ marginTop: '1rem' }}>
                    <p style={{ color: '#374151', fontWeight: '500', marginBottom: '0.5rem' }}>Recent Payments</p>
                    <div style={{ display: 'grid', gap: '0.5rem' }}>
                      {loan.repayments.slice(-3).map((repayment, index) => (
                        <div key={index} style={{ 
                          backgroundColor: '#f3f4f6', 
                          padding: '0.5rem', 
                          borderRadius: '0.375rem',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center'
                        }}>
                          <span style={{ color: '#374151' }}>
                            ${repayment.amount.toLocaleString()}
                          </span>
                          <span style={{ 
                            color: '#6b7280',
                            fontSize: '0.875rem'
                          }}>
                            {new Date(repayment.date).toLocaleDateString()}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default RepaymentTracker; 
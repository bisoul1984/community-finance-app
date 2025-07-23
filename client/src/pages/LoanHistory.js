import React, { useState, useEffect } from 'react';
import { getUserLoans } from '../api/loans';

const LoanHistory = ({ user }) => {
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchUserLoans();
  }, []);

  const fetchUserLoans = async () => {
    try {
      const data = await getUserLoans(user.id);
      setLoans(data);
    } catch (err) {
      setError('Failed to load loan history.');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return '#f59e0b';
      case 'funded': return '#059669';
      case 'active': return '#2563eb';
      case 'completed': return '#059669';
      case 'defaulted': return '#dc2626';
      default: return '#6b7280';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getProgressPercentage = (repaid, total) => {
    if (total === 0) return 0;
    return Math.round((repaid / total) * 100);
  };

  if (loading) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <p>Loading loan history...</p>
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
      <h2 style={{ color: '#1e40af', marginBottom: '1.5rem' }}>
        {user.role === 'borrower' ? 'My Loan History' : 'My Investment History'}
      </h2>
      
      {loans.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem' }}>
          <p style={{ color: '#6b7280', fontSize: '1.1rem', marginBottom: '1rem' }}>
            {user.role === 'borrower' 
              ? 'You haven\'t requested any loans yet.' 
              : 'You haven\'t funded any loans yet.'
            }
          </p>
          <p style={{ color: '#9ca3af' }}>
            {user.role === 'borrower' 
              ? 'Start by requesting your first loan!' 
              : 'Browse available loan requests to start investing!'
            }
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
                    ${loan.amount.toLocaleString()} Loan
                  </h3>
                  <p style={{ color: '#6b7280', marginBottom: '0.5rem' }}>
                    <strong>Purpose:</strong> {loan.purpose}
                  </p>
                  <p style={{ color: '#6b7280', marginBottom: '0.5rem' }}>
                    <strong>Term:</strong> {loan.term} days
                  </p>
                  <p style={{ color: '#6b7280' }}>
                    <strong>Created:</strong> {formatDate(loan.createdAt)}
                  </p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ 
                    padding: '0.25rem 0.75rem', 
                    backgroundColor: getStatusColor(loan.status), 
                    color: 'white', 
                    borderRadius: '1rem',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    textTransform: 'capitalize'
                  }}>
                    {loan.status}
                  </span>
                </div>
              </div>

              {user.role === 'borrower' && (
                <div style={{ marginBottom: '1rem' }}>
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
                      width: `${getProgressPercentage(loan.fundedAmount, loan.amount)}%`,
                      height: '100%',
                      backgroundColor: '#059669',
                      transition: 'width 0.3s ease'
                    }} />
                  </div>
                </div>
              )}

              {loan.status === 'funded' || loan.status === 'active' || loan.status === 'completed' ? (
                <div style={{ marginBottom: '1rem' }}>
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
                      width: `${getProgressPercentage(loan.totalRepaid, loan.amount)}%`,
                      height: '100%',
                      backgroundColor: '#2563eb',
                      transition: 'width 0.3s ease'
                    }} />
                  </div>
                </div>
              ) : null}

              {user.role === 'lender' && loan.lenders && (
                <div style={{ marginBottom: '1rem' }}>
                  <p style={{ color: '#374151', fontWeight: '500', marginBottom: '0.5rem' }}>Your Investment</p>
                  {loan.lenders.map((lenderInfo, index) => {
                    if (lenderInfo.lender._id === user.id) {
                      return (
                        <div key={index} style={{ 
                          backgroundColor: '#f3f4f6', 
                          padding: '0.75rem', 
                          borderRadius: '0.375rem',
                          marginBottom: '0.5rem'
                        }}>
                          <p style={{ color: '#374151', margin: 0 }}>
                            <strong>Amount:</strong> ${lenderInfo.amount.toLocaleString()}
                          </p>
                          <p style={{ color: '#6b7280', margin: 0, fontSize: '0.875rem' }}>
                            <strong>Funded:</strong> {formatDate(lenderInfo.fundedAt)}
                          </p>
                        </div>
                      );
                    }
                    return null;
                  })}
                </div>
              )}

              {loan.repayments && loan.repayments.length > 0 && (
                <div>
                  <p style={{ color: '#374151', fontWeight: '500', marginBottom: '0.5rem' }}>Recent Repayments</p>
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
                          color: repayment.status === 'completed' ? '#059669' : '#f59e0b',
                          fontSize: '0.875rem',
                          fontWeight: '500'
                        }}>
                          {repayment.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {loan.dueDate && (
                <div style={{ 
                  marginTop: '1rem', 
                  padding: '0.75rem', 
                  backgroundColor: '#fef3c7', 
                  borderRadius: '0.375rem',
                  border: '1px solid #f59e0b'
                }}>
                  <p style={{ color: '#92400e', margin: 0, fontSize: '0.875rem' }}>
                    <strong>Due Date:</strong> {formatDate(loan.dueDate)}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default LoanHistory; 
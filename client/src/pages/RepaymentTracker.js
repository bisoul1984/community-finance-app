import React, { useState, useEffect } from 'react';
import { getUserLoans, repayLoan } from '../api/loans';

function getMonthDays(year, month) {
  const date = new Date(year, month, 1);
  const days = [];
  while (date.getMonth() === month) {
    days.push(new Date(date));
    date.setDate(date.getDate() + 1);
  }
  return days;
}

function getRepaymentStatusForDate(repayments, date) {
  const dStr = date.toISOString().slice(0, 10);
  const rep = repayments.find(r => r.dueDate && r.dueDate.slice(0, 10) === dStr);
  if (!rep) return null;
  if (rep.status === 'completed') return 'paid';
  if (new Date(rep.dueDate) < new Date() && rep.status !== 'completed') return 'late';
  return 'upcoming';
}

const RepaymentCalendar = ({ repayments }) => {
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const days = getMonthDays(currentYear, currentMonth);

  return (
    <div className="bg-white rounded-xl shadow border border-slate-100 p-6 mb-8">
      <div className="flex items-center justify-between mb-4">
        <button onClick={() => setCurrentMonth(m => m === 0 ? 11 : m - 1)} className="p-2 rounded hover:bg-slate-100" title="Previous month" aria-label="Previous month">&lt;</button>
        <h3 className="text-lg font-bold text-slate-800">Repayment Calendar - {today.toLocaleString('default', { month: 'long' })} {currentYear}</h3>
        <button onClick={() => setCurrentMonth(m => m === 11 ? 0 : m + 1)} className="p-2 rounded hover:bg-slate-100" title="Next month" aria-label="Next month">&gt;</button>
      </div>
      <div className="grid grid-cols-7 gap-1 text-center text-xs text-slate-500 mb-2">
        {['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map(d => <div key={d}>{d}</div>)}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {Array(days[0].getDay()).fill(null).map((_, i) => <div key={i}></div>)}
        {days.map(day => {
          const status = getRepaymentStatusForDate(repayments, day);
          let bg = '';
          if (status === 'paid') bg = 'bg-emerald-100 text-emerald-700';
          else if (status === 'late') bg = 'bg-rose-100 text-rose-700';
          else if (status === 'upcoming') bg = 'bg-amber-100 text-amber-700';
          return (
            <div key={day.toISOString()} className={`rounded-full p-2 cursor-pointer ${bg} hover:ring-2 ring-slate-300 transition`} title={`Repayment status for ${day.toLocaleDateString()}`} aria-label={`Repayment status for ${day.toLocaleDateString()}`}>{day.getDate()}</div>
          );
        })}
      </div>
      <div className="flex gap-4 mt-4 text-xs">
        <span className="inline-flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-emerald-100 border border-emerald-300 inline-block"></span> Paid</span>
        <span className="inline-flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-amber-100 border border-amber-300 inline-block"></span> Upcoming</span>
        <span className="inline-flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-rose-100 border border-rose-300 inline-block"></span> Late</span>
      </div>
    </div>
  );
};

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

  // Gather all repayments for the calendar
  const allRepayments = loans.flatMap(loan => loan.repayments || []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50" aria-busy="true" aria-live="polite">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mb-3" role="status" aria-label="Loading"></div>
          <span className="text-slate-600">Loading your loans...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-gray-50 py-10 px-2 md:px-8">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-6 flex items-center gap-2">Repayment Tracker</h2>
        {error && (
          <div className="flex items-center bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-4 gap-2">{error}</div>
        )}
        {/* Repayment Calendar */}
        <RepaymentCalendar repayments={allRepayments} />
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
                      title="Make payment"
                      aria-label="Make payment"
                      tabIndex={0}
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
    </div>
  );
};

export default RepaymentTracker; 
import React, { useState, useEffect } from 'react';
import { getUserLoans } from '../api/loans';
import { Clock, CheckCircle, XCircle, DollarSign, TrendingUp, CalendarCheck, AlertTriangle, BarChart2 } from 'lucide-react';

const STATUS_MAP = {
  pending: { label: 'Pending', color: 'bg-amber-400 text-white', icon: Clock },
  approved: { label: 'Approved', color: 'bg-blue-400 text-white', icon: CheckCircle },
  funded: { label: 'Funded', color: 'bg-emerald-500 text-white', icon: DollarSign },
  active: { label: 'In Repayment', color: 'bg-blue-600 text-white', icon: TrendingUp },
  completed: { label: 'Completed', color: 'bg-emerald-700 text-white', icon: CalendarCheck },
  defaulted: { label: 'Defaulted', color: 'bg-rose-600 text-white', icon: XCircle },
};

const LoanHistory = ({ user }) => {
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    fetchUserLoans();
  }, []);

  const fetchUserLoans = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await getUserLoans(user.id);
      setLoans(data);
    } catch (err) {
      setError(`Failed to load loan history: ${err.response?.data?.message || err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => new Date(dateString).toLocaleDateString();
  const getProgressPercentage = (repaid, total) => (total === 0 ? 0 : Math.round((repaid / total) * 100));

  const filteredLoans = statusFilter === 'all' ? loans : loans.filter(l => l.status === statusFilter);
  const isLender = user.role === 'lender';
  const activeInvestments = isLender ? loans.filter(l => l.status === 'funded' || l.status === 'active') : [];
  const pastInvestments = isLender ? loans.filter(l => l.status === 'completed' || l.status === 'defaulted') : [];
  const totalInvested = activeInvestments.reduce((sum, l) => sum + (l.amount || 0), 0) + pastInvestments.reduce((sum, l) => sum + (l.amount || 0), 0);
  const totalReturns = pastInvestments.reduce((sum, l) => sum + (l.totalRepaid || 0), 0);
  const expectedReturns = activeInvestments.reduce((sum, l) => sum + ((l.amount || 0) * (l.interestRate || 0.1)), 0); // Assume 10% if not present


  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-gray-50 py-10 px-2 md:px-8">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-6 flex items-center gap-2">
          {user.role === 'borrower' ? 'My Loan History' : 'My Investment History'}
        </h2>
        {isLender && (
          <div className="mb-8 grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white rounded-lg shadow p-4 flex flex-col items-center">
              <span className="text-xs text-slate-500 mb-1">Total Invested</span>
              <span className="text-2xl font-bold text-blue-700">${totalInvested.toLocaleString()}</span>
            </div>
            <div className="bg-white rounded-lg shadow p-4 flex flex-col items-center">
              <span className="text-xs text-slate-500 mb-1">Total Returns</span>
              <span className="text-2xl font-bold text-emerald-700">${totalReturns.toLocaleString()}</span>
            </div>
            <div className="bg-white rounded-lg shadow p-4 flex flex-col items-center">
              <span className="text-xs text-slate-500 mb-1">Active Investments</span>
              <span className="text-2xl font-bold text-slate-800">{activeInvestments.length}</span>
            </div>
            <div className="bg-white rounded-lg shadow p-4 flex flex-col items-center">
              <span className="text-xs text-slate-500 mb-1">Past Investments</span>
              <span className="text-2xl font-bold text-slate-800">{pastInvestments.length}</span>
            </div>
          </div>
        )}
        {isLender && (
          <div className="mb-8 flex flex-col items-center">
            <span className="text-xs text-slate-500 mb-2">Portfolio Overview</span>
            <div className="w-full max-w-xs h-32 flex items-end gap-6">
              <div className="flex-1 flex flex-col items-center">
                <div className="h-full flex items-end" style={{height: '100%'}}>
                  <div style={{height: `${Math.max(20, (activeInvestments.length / (activeInvestments.length + pastInvestments.length || 1)) * 100)}%`, width: '32px', background: '#2563eb', borderRadius: '8px 8px 0 0'}}></div>
                </div>
                <span className="text-xs mt-2 text-blue-700">Active</span>
              </div>
              <div className="flex-1 flex flex-col items-center">
                <div className="h-full flex items-end" style={{height: '100%'}}>
                  <div style={{height: `${Math.max(20, (pastInvestments.length / (activeInvestments.length + pastInvestments.length || 1)) * 100)}%`, width: '32px', background: '#64748b', borderRadius: '8px 8px 0 0'}}></div>
                </div>
                <span className="text-xs mt-2 text-slate-700">Past</span>
              </div>
            </div>
          </div>
        )}
        {/* Status Legend */}
        <div className="flex flex-wrap gap-3 mb-6 items-center" aria-label="Status Legend">
          <span className="text-slate-500 text-sm font-medium mr-2">Status Legend:</span>
          {Object.entries(STATUS_MAP).map(([key, { label, color, icon: Icon }]) => (
            <span key={key} className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${color}`} title={label} aria-label={label} tabIndex={0}> <Icon className="w-4 h-4" /> {label} </span>
          ))}
        </div>
        {/* Status Filter */}
        <div className="mb-6 flex flex-wrap gap-2">
          <button onClick={() => setStatusFilter('all')} className={`px-3 py-1 rounded-full text-sm font-medium border ${statusFilter==='all' ? 'bg-slate-800 text-white' : 'bg-white text-slate-700'} transition`} title="Show all statuses" aria-label="Show all statuses">All</button>
          {Object.keys(STATUS_MAP).map(key => (
            <button key={key} onClick={() => setStatusFilter(key)} className={`px-3 py-1 rounded-full text-sm font-medium border ${statusFilter===key ? 'bg-slate-800 text-white' : 'bg-white text-slate-700'} transition`} title={STATUS_MAP[key].label} aria-label={STATUS_MAP[key].label}>{STATUS_MAP[key].label}</button>
          ))}
        </div>
        {loading ? (
          <div className="space-y-6 min-h-[300px]" aria-busy="true" aria-live="polite">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl shadow border border-slate-100 p-6 animate-pulse">
                <div className="h-6 bg-slate-200 rounded w-1/3 mb-4"></div>
                <div className="h-4 bg-slate-100 rounded w-1/2 mb-2"></div>
                <div className="h-4 bg-slate-100 rounded w-1/4 mb-2"></div>
                <div className="h-3 bg-slate-100 rounded w-1/5 mb-2"></div>
                <div className="h-2 bg-slate-100 rounded w-full mb-2"></div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-16 text-rose-600">
            <p>{error}</p>
            <button onClick={fetchUserLoans} className="mt-4 px-4 py-2 bg-slate-800 text-white rounded-md">Retry</button>
          </div>
        ) : filteredLoans.length === 0 ? (
          <div className="text-center py-16 text-slate-400">
            {user.role === 'borrower' ? "You haven't requested any loans yet." : "You haven't funded any loans yet."}
          </div>
        ) : (
          <div className="space-y-6">
            {isLender ? (
              <>
                <div className="mb-10">
                  <h3 className="text-lg font-semibold text-blue-800 mb-4">Active Investments</h3>
                  {activeInvestments.length === 0 ? <div className="text-slate-400">No active investments.</div> : (
                    <div className="space-y-6">
                      {activeInvestments.map((loan) => {
                        const statusInfo = STATUS_MAP[loan.status] || { label: loan.status, color: 'bg-slate-300 text-slate-700', icon: AlertTriangle };
                        return (
                          <div key={loan._id} className="bg-white rounded-xl shadow border border-slate-100 p-6" tabIndex={0} title={`Loan: $${loan.amount.toLocaleString()} - ${loan.purpose}`}>
                            <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-2 gap-2">
                              <div>
                                <h3 className="text-lg font-bold text-slate-800 mb-1">${loan.amount.toLocaleString()} Loan</h3>
                                <div className="text-slate-500 text-sm mb-1"><span className="font-medium">Purpose:</span> {loan.purpose}</div>
                                <div className="text-slate-500 text-sm mb-1"><span className="font-medium">Term:</span> {loan.term} days</div>
                                <div className="text-slate-400 text-xs">Created: {formatDate(loan.createdAt)}</div>
                                {isLender && (
                                  <div className="text-slate-500 text-xs mb-1"><span className="font-medium">Expected Returns:</span> ${(loan.amount * (loan.interestRate || 0.1)).toLocaleString()} ({((loan.interestRate || 0.1) * 100).toFixed(1)}%)</div>
                                )}
                              </div>
                              <div className="flex items-center gap-2">
                                <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${statusInfo.color}`}> <statusInfo.icon className="w-4 h-4" /> {statusInfo.label} </span>
                              </div>
                            </div>
                            {loan.lenders && loan.lenders.length > 0 && (
                              <div className="mb-3">
                                <div className="flex justify-between text-xs text-slate-500 mb-1">
                                  <span>Lenders</span>
                                  <span>Funding Progress: ${loan.fundedAmount.toLocaleString()} / ${loan.amount.toLocaleString()}</span>
                                </div>
                                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden mb-2">
                                  <div className="h-2 bg-emerald-500 rounded-full transition-all" style={{ width: `${getProgressPercentage(loan.fundedAmount, loan.amount)}%` }} />
                                </div>
                                <ul className="text-xs text-blue-700 space-y-1">
                                  {loan.lenders.map((l, idx) => (
                                    <li key={idx} className="flex items-center gap-2">
                                      <span>{l.lender?.name || 'Anonymous'}:</span>
                                      <span className="text-emerald-700 font-semibold">${l.amount.toLocaleString()}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                            {/* Funding Progress */}
                            {user.role === 'borrower' && (
                              <div className="mb-3">
                                <div className="flex justify-between text-xs text-slate-500 mb-1">
                                  <span>Funding Progress</span>
                                  <span>${loan.fundedAmount.toLocaleString()} / ${loan.amount.toLocaleString()}</span>
                                </div>
                                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                                  <div className="h-2 bg-emerald-500 rounded-full transition-all" style={{ width: `${getProgressPercentage(loan.fundedAmount, loan.amount)}%` }} />
                                </div>
                              </div>
                            )}
                            {/* Repayment Progress */}
                            {(loan.status === 'funded' || loan.status === 'active' || loan.status === 'completed') && (
                              <div className="mb-3">
                                <div className="flex justify-between text-xs text-slate-500 mb-1">
                                  <span>Repayment Progress</span>
                                  <span>${loan.totalRepaid.toLocaleString()} / ${loan.amount.toLocaleString()}</span>
                                </div>
                                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                                  <div className="h-2 bg-blue-600 rounded-full transition-all" style={{ width: `${getProgressPercentage(loan.totalRepaid, loan.amount)}%` }} />
                                </div>
                              </div>
                            )}
                            {/* Recent Repayments */}
                            {loan.repayments && loan.repayments.length > 0 && (
                              <div className="mb-3">
                                <div className="text-slate-700 font-medium mb-1 text-sm">Recent Repayments</div>
                                <div className="space-y-1">
                                  {loan.repayments.slice(-3).map((repayment, index) => (
                                    <div key={index} className="flex justify-between items-center bg-slate-50 rounded px-3 py-1 text-xs">
                                      <span className="text-slate-700">${repayment.amount.toLocaleString()}</span>
                                      <span className={repayment.status === 'completed' ? 'text-emerald-600 font-semibold' : 'text-amber-500 font-semibold'}>{repayment.status}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                            {/* Due Date */}
                            {loan.dueDate && (
                              <div className="mt-3 px-3 py-2 bg-amber-50 border border-amber-200 rounded text-amber-700 text-xs">
                                <span className="font-medium">Due Date:</span> {formatDate(loan.dueDate)}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-700 mb-4">Past Investments</h3>
                  {pastInvestments.length === 0 ? <div className="text-slate-400">No past investments.</div> : (
                    <div className="space-y-6">
                      {pastInvestments.map((loan) => {
                        const statusInfo = STATUS_MAP[loan.status] || { label: loan.status, color: 'bg-slate-300 text-slate-700', icon: AlertTriangle };
                        return (
                          <div key={loan._id} className="bg-white rounded-xl shadow border border-slate-100 p-6" tabIndex={0} title={`Loan: $${loan.amount.toLocaleString()} - ${loan.purpose}`}>
                            <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-2 gap-2">
                              <div>
                                <h3 className="text-lg font-bold text-slate-800 mb-1">${loan.amount.toLocaleString()} Loan</h3>
                                <div className="text-slate-500 text-sm mb-1"><span className="font-medium">Purpose:</span> {loan.purpose}</div>
                                <div className="text-slate-500 text-sm mb-1"><span className="font-medium">Term:</span> {loan.term} days</div>
                                <div className="text-slate-400 text-xs">Created: {formatDate(loan.createdAt)}</div>
                                {isLender && (
                                  <div className="text-slate-500 text-xs mb-1"><span className="font-medium">Expected Returns:</span> ${(loan.amount * (loan.interestRate || 0.1)).toLocaleString()} ({((loan.interestRate || 0.1) * 100).toFixed(1)}%)</div>
                                )}
                              </div>
                              <div className="flex items-center gap-2">
                                <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${statusInfo.color}`}> <statusInfo.icon className="w-4 h-4" /> {statusInfo.label} </span>
                              </div>
                            </div>
                            {loan.lenders && loan.lenders.length > 0 && (
                              <div className="mb-3">
                                <div className="flex justify-between text-xs text-slate-500 mb-1">
                                  <span>Lenders</span>
                                  <span>Funding Progress: ${loan.fundedAmount.toLocaleString()} / ${loan.amount.toLocaleString()}</span>
                                </div>
                                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden mb-2">
                                  <div className="h-2 bg-emerald-500 rounded-full transition-all" style={{ width: `${getProgressPercentage(loan.fundedAmount, loan.amount)}%` }} />
                                </div>
                                <ul className="text-xs text-blue-700 space-y-1">
                                  {loan.lenders.map((l, idx) => (
                                    <li key={idx} className="flex items-center gap-2">
                                      <span>{l.lender?.name || 'Anonymous'}:</span>
                                      <span className="text-emerald-700 font-semibold">${l.amount.toLocaleString()}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                            {/* Funding Progress */}
                            {user.role === 'borrower' && (
                              <div className="mb-3">
                                <div className="flex justify-between text-xs text-slate-500 mb-1">
                                  <span>Funding Progress</span>
                                  <span>${loan.fundedAmount.toLocaleString()} / ${loan.amount.toLocaleString()}</span>
                                </div>
                                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                                  <div className="h-2 bg-emerald-500 rounded-full transition-all" style={{ width: `${getProgressPercentage(loan.fundedAmount, loan.amount)}%` }} />
                                </div>
                              </div>
                            )}
                            {/* Repayment Progress */}
                            {(loan.status === 'funded' || loan.status === 'active' || loan.status === 'completed') && (
                              <div className="mb-3">
                                <div className="flex justify-between text-xs text-slate-500 mb-1">
                                  <span>Repayment Progress</span>
                                  <span>${loan.totalRepaid.toLocaleString()} / ${loan.amount.toLocaleString()}</span>
                                </div>
                                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                                  <div className="h-2 bg-blue-600 rounded-full transition-all" style={{ width: `${getProgressPercentage(loan.totalRepaid, loan.amount)}%` }} />
                                </div>
                              </div>
                            )}
                            {/* Recent Repayments */}
                            {loan.repayments && loan.repayments.length > 0 && (
                              <div className="mb-3">
                                <div className="text-slate-700 font-medium mb-1 text-sm">Recent Repayments</div>
                                <div className="space-y-1">
                                  {loan.repayments.slice(-3).map((repayment, index) => (
                                    <div key={index} className="flex justify-between items-center bg-slate-50 rounded px-3 py-1 text-xs">
                                      <span className="text-slate-700">${repayment.amount.toLocaleString()}</span>
                                      <span className={repayment.status === 'completed' ? 'text-emerald-600 font-semibold' : 'text-amber-500 font-semibold'}>{repayment.status}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                            {/* Due Date */}
                            {loan.dueDate && (
                              <div className="mt-3 px-3 py-2 bg-amber-50 border border-amber-200 rounded text-amber-700 text-xs">
                                <span className="font-medium">Due Date:</span> {formatDate(loan.dueDate)}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </>
            ) : (
              filteredLoans.map((loan) => {
                const statusInfo = STATUS_MAP[loan.status] || { label: loan.status, color: 'bg-slate-300 text-slate-700', icon: AlertTriangle };
                return (
                  <div key={loan._id} className="bg-white rounded-xl shadow border border-slate-100 p-6" tabIndex={0} title={`Loan: $${loan.amount.toLocaleString()} - ${loan.purpose}`}>
                    <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-2 gap-2">
                      <div>
                        <h3 className="text-lg font-bold text-slate-800 mb-1">${loan.amount.toLocaleString()} Loan</h3>
                        <div className="text-slate-500 text-sm mb-1"><span className="font-medium">Purpose:</span> {loan.purpose}</div>
                        <div className="text-slate-500 text-sm mb-1"><span className="font-medium">Term:</span> {loan.term} days</div>
                        <div className="text-slate-400 text-xs">Created: {formatDate(loan.createdAt)}</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${statusInfo.color}`}> <statusInfo.icon className="w-4 h-4" /> {statusInfo.label} </span>
                      </div>
                    </div>
                    {loan.lenders && loan.lenders.length > 0 && (
                      <div className="mb-3">
                        <div className="flex justify-between text-xs text-slate-500 mb-1">
                          <span>Lenders</span>
                          <span>Funding Progress: ${loan.fundedAmount.toLocaleString()} / ${loan.amount.toLocaleString()}</span>
                        </div>
                        <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden mb-2">
                          <div className="h-2 bg-emerald-500 rounded-full transition-all" style={{ width: `${getProgressPercentage(loan.fundedAmount, loan.amount)}%` }} />
                        </div>
                        <ul className="text-xs text-blue-700 space-y-1">
                          {loan.lenders.map((l, idx) => (
                            <li key={idx} className="flex items-center gap-2">
                              <span>{l.lender?.name || 'Anonymous'}:</span>
                              <span className="text-emerald-700 font-semibold">${l.amount.toLocaleString()}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {/* Funding Progress */}
                    {user.role === 'borrower' && (
                      <div className="mb-3">
                        <div className="flex justify-between text-xs text-slate-500 mb-1">
                          <span>Funding Progress</span>
                          <span>${loan.fundedAmount.toLocaleString()} / ${loan.amount.toLocaleString()}</span>
                        </div>
                        <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div className="h-2 bg-emerald-500 rounded-full transition-all" style={{ width: `${getProgressPercentage(loan.fundedAmount, loan.amount)}%` }} />
                        </div>
                      </div>
                    )}
                    {/* Repayment Progress */}
                    {(loan.status === 'funded' || loan.status === 'active' || loan.status === 'completed') && (
                      <div className="mb-3">
                        <div className="flex justify-between text-xs text-slate-500 mb-1">
                          <span>Repayment Progress</span>
                          <span>${loan.totalRepaid.toLocaleString()} / ${loan.amount.toLocaleString()}</span>
                        </div>
                        <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div className="h-2 bg-blue-600 rounded-full transition-all" style={{ width: `${getProgressPercentage(loan.totalRepaid, loan.amount)}%` }} />
                        </div>
                      </div>
                    )}
                    {/* Recent Repayments */}
                    {loan.repayments && loan.repayments.length > 0 && (
                      <div className="mb-3">
                        <div className="text-slate-700 font-medium mb-1 text-sm">Recent Repayments</div>
                        <div className="space-y-1">
                          {loan.repayments.slice(-3).map((repayment, index) => (
                            <div key={index} className="flex justify-between items-center bg-slate-50 rounded px-3 py-1 text-xs">
                              <span className="text-slate-700">${repayment.amount.toLocaleString()}</span>
                              <span className={repayment.status === 'completed' ? 'text-emerald-600 font-semibold' : 'text-amber-500 font-semibold'}>{repayment.status}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    {/* Due Date */}
                    {loan.dueDate && (
                      <div className="mt-3 px-3 py-2 bg-amber-50 border border-amber-200 rounded text-amber-700 text-xs">
                        <span className="font-medium">Due Date:</span> {formatDate(loan.dueDate)}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default LoanHistory; 
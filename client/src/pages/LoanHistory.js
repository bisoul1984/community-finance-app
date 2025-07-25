import React, { useState, useEffect } from 'react';
import { getUserLoans } from '../api/loans';
import { 
  Clock, 
  CheckCircle, 
  XCircle, 
  DollarSign, 
  TrendingUp, 
  CalendarCheck, 
  AlertTriangle, 
  BarChart2,
  Search,
  Download,
  Filter,
  Calendar,
  Eye,
  EyeOff,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  PieChart,
  TrendingDown,
  Award,
  Clock3,
  FileText
} from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

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
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('all');
  const [amountFilter, setAmountFilter] = useState('all');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');
  const [showFilters, setShowFilters] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [selectedLoan, setSelectedLoan] = useState(null);
  const [exporting, setExporting] = useState(false);

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

  // Export functionality
  const exportToPDF = async () => {
    setExporting(true);
    try {
      const element = document.getElementById('loan-history-content');
      const canvas = await html2canvas(element, { scale: 2 });
      const imgData = canvas.toDataURL('image/png');
      
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgWidth = 210;
      const pageHeight = 295;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      
      let position = 0;
      
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
      
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }
      
      pdf.save(`${user.role === 'borrower' ? 'loan' : 'investment'}-history-${new Date().toISOString().split('T')[0]}.pdf`);
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setExporting(false);
    }
  };

  const exportToCSV = () => {
    const headers = ['Amount', 'Purpose', 'Status', 'Term', 'Created Date', 'Due Date', 'Funded Amount', 'Total Repaid'];
    const csvContent = [
      headers.join(','),
      ...filteredLoans.map(loan => [
        loan.amount,
        `"${loan.purpose}"`,
        loan.status,
        loan.term,
        formatDate(loan.createdAt),
        loan.dueDate ? formatDate(loan.dueDate) : '',
        loan.fundedAmount || 0,
        loan.totalRepaid || 0
      ].join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${user.role === 'borrower' ? 'loan' : 'investment'}-history-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const clearFilters = () => {
    setStatusFilter('all');
    setSearchTerm('');
    setDateFilter('all');
    setAmountFilter('all');
    setSortBy('createdAt');
    setSortOrder('desc');
  };

  const formatDate = (dateString) => new Date(dateString).toLocaleDateString();
  const getProgressPercentage = (repaid, total) => (total === 0 ? 0 : Math.round((repaid / total) * 100));

  // Enhanced filtering and sorting logic
  const filteredLoans = loans
    .filter(loan => {
      // Status filter
      if (statusFilter !== 'all' && loan.status !== statusFilter) return false;
      
      // Search filter
      if (searchTerm && !loan.purpose.toLowerCase().includes(searchTerm.toLowerCase())) return false;
      
      // Date filter
      if (dateFilter !== 'all') {
        const loanDate = new Date(loan.createdAt);
        const now = new Date();
        const daysDiff = Math.floor((now - loanDate) / (1000 * 60 * 60 * 24));
        
        switch (dateFilter) {
          case 'today': return daysDiff === 0;
          case 'week': return daysDiff <= 7;
          case 'month': return daysDiff <= 30;
          case 'quarter': return daysDiff <= 90;
          case 'year': return daysDiff <= 365;
          default: return true;
        }
      }
      
      // Amount filter
      if (amountFilter !== 'all') {
        const amount = loan.amount;
        switch (amountFilter) {
          case 'small': return amount <= 1000;
          case 'medium': return amount > 1000 && amount <= 5000;
          case 'large': return amount > 5000;
          default: return true;
        }
      }
      
      return true;
    })
    .sort((a, b) => {
      let aValue, bValue;
      
      switch (sortBy) {
        case 'amount':
          aValue = a.amount;
          bValue = b.amount;
          break;
        case 'status':
          aValue = a.status;
          bValue = b.status;
          break;
        case 'dueDate':
          aValue = new Date(a.dueDate || 0);
          bValue = new Date(b.dueDate || 0);
          break;
        case 'createdAt':
        default:
          aValue = new Date(a.createdAt);
          bValue = new Date(b.createdAt);
          break;
      }
      
      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });
  const isLender = user.role === 'lender';
  const activeInvestments = isLender ? loans.filter(l => l.status === 'funded' || l.status === 'active') : [];
  const pastInvestments = isLender ? loans.filter(l => l.status === 'completed' || l.status === 'defaulted') : [];
  const totalInvested = activeInvestments.reduce((sum, l) => sum + (l.amount || 0), 0) + pastInvestments.reduce((sum, l) => sum + (l.amount || 0), 0);
  const totalReturns = pastInvestments.reduce((sum, l) => sum + (l.totalRepaid || 0), 0);
  const expectedReturns = activeInvestments.reduce((sum, l) => sum + ((l.amount || 0) * (l.interestRate || 0.1)), 0); // Assume 10% if not present

  // Enhanced analytics
  const analytics = {
    totalLoans: loans.length,
    totalAmount: loans.reduce((sum, l) => sum + (l.amount || 0), 0),
    averageAmount: loans.length > 0 ? loans.reduce((sum, l) => sum + (l.amount || 0), 0) / loans.length : 0,
    completedLoans: loans.filter(l => l.status === 'completed').length,
    defaultedLoans: loans.filter(l => l.status === 'defaulted').length,
    successRate: loans.length > 0 ? (loans.filter(l => l.status === 'completed').length / loans.length) * 100 : 0,
    totalRepaid: loans.reduce((sum, l) => sum + (l.totalRepaid || 0), 0),
    overdueLoans: loans.filter(l => l.dueDate && new Date(l.dueDate) < new Date() && l.status !== 'completed').length,
    averageRepaymentTime: loans.filter(l => l.status === 'completed' && l.repayments?.length > 0)
      .reduce((sum, l) => {
        const firstRepayment = new Date(l.repayments[0].date);
        const lastRepayment = new Date(l.repayments[l.repayments.length - 1].date);
        return sum + (lastRepayment - firstRepayment) / (1000 * 60 * 60 * 24);
      }, 0) / Math.max(1, loans.filter(l => l.status === 'completed' && l.repayments?.length > 0).length)
  };

  // Status distribution for charts
  const statusDistribution = Object.keys(STATUS_MAP).map(status => ({
    status,
    count: loans.filter(l => l.status === status).length,
    percentage: loans.length > 0 ? (loans.filter(l => l.status === status).length / loans.length) * 100 : 0
  })).filter(item => item.count > 0);

  const renderLoanContent = () => {
    if (isLender) {
      return (
        <div>
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
                          <button
                            onClick={() => setSelectedLoan(selectedLoan === loan._id ? null : loan._id)}
                            className="p-2 text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
                            title={selectedLoan === loan._id ? 'Hide Details' : 'Show Details'}
                          >
                            {selectedLoan === loan._id ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
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
                      
                      {/* Expandable Details */}
                      {selectedLoan === loan._id && (
                        <div className="mt-4 pt-4 border-t border-slate-200">
                          <h4 className="text-sm font-semibold text-slate-700 mb-3">Detailed Information</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                            <div>
                              <div className="mb-2">
                                <span className="font-medium text-slate-600">Interest Rate:</span>
                                <span className="ml-2 text-slate-800">{((loan.interestRate || 0.1) * 100).toFixed(1)}%</span>
                              </div>
                              <div className="mb-2">
                                <span className="font-medium text-slate-600">Monthly Payment:</span>
                                <span className="ml-2 text-slate-800">${((loan.amount || 0) / (loan.term || 30)).toFixed(2)}</span>
                              </div>
                              <div className="mb-2">
                                <span className="font-medium text-slate-600">Total Interest:</span>
                                <span className="ml-2 text-slate-800">${((loan.amount || 0) * (loan.interestRate || 0.1)).toFixed(2)}</span>
                              </div>
                            </div>
                            <div>
                              <div className="mb-2">
                                <span className="font-medium text-slate-600">Days Remaining:</span>
                                <span className="ml-2 text-slate-800">
                                  {loan.dueDate ? Math.max(0, Math.ceil((new Date(loan.dueDate) - new Date()) / (1000 * 60 * 60 * 24))) : 'N/A'}
                                </span>
                              </div>
                              <div className="mb-2">
                                <span className="font-medium text-slate-600">Last Payment:</span>
                                <span className="ml-2 text-slate-800">
                                  {loan.repayments && loan.repayments.length > 0 
                                    ? formatDate(loan.repayments[loan.repayments.length - 1].date)
                                    : 'No payments yet'
                                  }
                                </span>
                              </div>
                              <div className="mb-2">
                                <span className="font-medium text-slate-600">Payment Count:</span>
                                <span className="ml-2 text-slate-800">{loan.repayments ? loan.repayments.length : 0}</span>
                              </div>
                            </div>
                          </div>
                          
                          {/* Full Repayment History */}
                          {loan.repayments && loan.repayments.length > 0 && (
                            <div className="mt-4">
                              <h5 className="text-sm font-semibold text-slate-700 mb-2">Complete Repayment History</h5>
                              <div className="max-h-40 overflow-y-auto space-y-1">
                                {loan.repayments.map((repayment, index) => (
                                  <div key={index} className="flex justify-between items-center bg-slate-50 rounded px-3 py-2 text-xs">
                                    <div className="flex items-center gap-3">
                                      <span className="text-slate-700">${repayment.amount.toLocaleString()}</span>
                                      <span className="text-slate-500">{formatDate(repayment.date)}</span>
                                    </div>
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                      repayment.status === 'completed' 
                                        ? 'bg-emerald-100 text-emerald-700' 
                                        : 'bg-amber-100 text-amber-700'
                                    }`}>
                                      {repayment.status}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
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
        </div>
      );
    } else {
      return (
        <div>
          {filteredLoans.map((loan) => {
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
                    <button
                      onClick={() => setSelectedLoan(selectedLoan === loan._id ? null : loan._id)}
                      className="p-2 text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
                      title={selectedLoan === loan._id ? 'Hide Details' : 'Show Details'}
                    >
                      {selectedLoan === loan._id ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
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
                
                {/* Expandable Details */}
                {selectedLoan === loan._id && (
                  <div className="mt-4 pt-4 border-t border-slate-200">
                    <h4 className="text-sm font-semibold text-slate-700 mb-3">Detailed Information</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <div className="mb-2">
                          <span className="font-medium text-slate-600">Interest Rate:</span>
                          <span className="ml-2 text-slate-800">{((loan.interestRate || 0.1) * 100).toFixed(1)}%</span>
                        </div>
                        <div className="mb-2">
                          <span className="font-medium text-slate-600">Monthly Payment:</span>
                          <span className="ml-2 text-slate-800">${((loan.amount || 0) / (loan.term || 30)).toFixed(2)}</span>
                        </div>
                        <div className="mb-2">
                          <span className="font-medium text-slate-600">Total Interest:</span>
                          <span className="ml-2 text-slate-800">${((loan.amount || 0) * (loan.interestRate || 0.1)).toFixed(2)}</span>
                        </div>
                      </div>
                      <div>
                        <div className="mb-2">
                          <span className="font-medium text-slate-600">Days Remaining:</span>
                          <span className="ml-2 text-slate-800">
                            {loan.dueDate ? Math.max(0, Math.ceil((new Date(loan.dueDate) - new Date()) / (1000 * 60 * 60 * 24))) : 'N/A'}
                          </span>
                        </div>
                        <div className="mb-2">
                          <span className="font-medium text-slate-600">Last Payment:</span>
                          <span className="ml-2 text-slate-800">
                            {loan.repayments && loan.repayments.length > 0 
                              ? formatDate(loan.repayments[loan.repayments.length - 1].date)
                              : 'No payments yet'
                            }
                          </span>
                        </div>
                        <div className="mb-2">
                          <span className="font-medium text-slate-600">Payment Count:</span>
                          <span className="ml-2 text-slate-800">{loan.repayments ? loan.repayments.length : 0}</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Full Repayment History */}
                    {loan.repayments && loan.repayments.length > 0 && (
                      <div className="mt-4">
                        <h5 className="text-sm font-semibold text-slate-700 mb-2">Complete Repayment History</h5>
                        <div className="max-h-40 overflow-y-auto space-y-1">
                          {loan.repayments.map((repayment, index) => (
                            <div key={index} className="flex justify-between items-center bg-slate-50 rounded px-3 py-2 text-xs">
                              <div className="flex items-center gap-3">
                                <span className="text-slate-700">${repayment.amount.toLocaleString()}</span>
                                <span className="text-slate-500">{formatDate(repayment.date)}</span>
                              </div>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                repayment.status === 'completed' 
                                  ? 'bg-emerald-100 text-emerald-700' 
                                  : 'bg-amber-100 text-amber-700'
                              }`}>
                                {repayment.status}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      );
    }
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-gray-50 py-10 px-2 md:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Header with enhanced controls */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 flex items-center gap-2">
              {user.role === 'borrower' ? 'My Loan History' : 'My Investment History'}
              <button
                onClick={fetchUserLoans}
                className="p-2 text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
                title="Refresh data"
              >
                <RefreshCw className="w-5 h-5" />
              </button>
            </h2>
            
            {/* Action buttons */}
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setShowAnalytics(!showAnalytics)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
              >
                <BarChart2 className="w-4 h-4" />
                {showAnalytics ? 'Hide Analytics' : 'Show Analytics'}
              </button>
              
              <div className="relative">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center gap-2 px-4 py-2 bg-slate-600 hover:bg-slate-700 text-white rounded-lg font-medium transition-colors"
                >
                  <Filter className="w-4 h-4" />
                  Filters
                  {showFilters ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
              </div>
              
              <div className="relative">
                <button
                  onClick={exportToPDF}
                  disabled={exporting}
                  className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
                >
                  <Download className="w-4 h-4" />
                  {exporting ? 'Exporting...' : 'Export PDF'}
                </button>
              </div>
              
              <button
                onClick={exportToCSV}
                className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors"
              >
                <FileText className="w-4 h-4" />
                Export CSV
              </button>
            </div>
          </div>
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

          {/* Enhanced Filters Section */}
          {showFilters && (
            <div className="mb-6 bg-white rounded-lg shadow border border-slate-200 p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Search */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Search</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                    <input
                      type="text"
                      placeholder="Search by purpose..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Date Filter */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Date Range</label>
                  <select
                    value={dateFilter}
                    onChange={(e) => setDateFilter(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="all">All Time</option>
                    <option value="today">Today</option>
                    <option value="week">Last 7 Days</option>
                    <option value="month">Last 30 Days</option>
                    <option value="quarter">Last 90 Days</option>
                    <option value="year">Last Year</option>
                  </select>
                </div>

                {/* Amount Filter */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Amount Range</label>
                  <select
                    value={amountFilter}
                    onChange={(e) => setAmountFilter(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="all">All Amounts</option>
                    <option value="small">Small (≤ $1,000)</option>
                    <option value="medium">Medium ($1,000 - $5,000)</option>
                    <option value="large">Large (> $5,000)</option>
                  </select>
                </div>

                {/* Sort */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Sort By</label>
                  <div className="flex gap-2">
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="createdAt">Date Created</option>
                      <option value="amount">Amount</option>
                      <option value="status">Status</option>
                      <option value="dueDate">Due Date</option>
                    </select>
                    <button
                      onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                      className="px-3 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
                      title={sortOrder === 'asc' ? 'Sort Descending' : 'Sort Ascending'}
                    >
                      {sortOrder === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="mt-4 flex justify-between items-center">
                <div className="text-sm text-slate-600">
                  Showing {filteredLoans.length} of {loans.length} {user.role === 'borrower' ? 'loans' : 'investments'}
                </div>
                <button
                  onClick={clearFilters}
                  className="px-4 py-2 text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  Clear All Filters
                </button>
              </div>
            </div>
          )}

          {/* Analytics Section */}
          {showAnalytics && (
            <div className="mb-8 bg-white rounded-lg shadow border border-slate-200 p-6">
              <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
                <PieChart className="w-5 h-5" />
                Analytics Overview
              </h3>
              
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-6">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-700">{analytics.totalLoans}</div>
                  <div className="text-sm text-blue-600">Total {user.role === 'borrower' ? 'Loans' : 'Investments'}</div>
                </div>
                <div className="text-center p-4 bg-emerald-50 rounded-lg">
                  <div className="text-2xl font-bold text-emerald-700">${analytics.totalAmount.toLocaleString()}</div>
                  <div className="text-sm text-emerald-600">Total Amount</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-700">${analytics.averageAmount.toLocaleString()}</div>
                  <div className="text-sm text-purple-600">Average Amount</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-700">{analytics.completedLoans}</div>
                  <div className="text-sm text-green-600">Completed</div>
                </div>
                <div className="text-center p-4 bg-amber-50 rounded-lg">
                  <div className="text-2xl font-bold text-amber-700">{analytics.successRate.toFixed(1)}%</div>
                  <div className="text-sm text-amber-600">Success Rate</div>
                </div>
                <div className="text-center p-4 bg-red-50 rounded-lg">
                  <div className="text-2xl font-bold text-red-700">{analytics.overdueLoans}</div>
                  <div className="text-sm text-red-600">Overdue</div>
                </div>
              </div>

              {/* Status Distribution Chart */}
              <div className="mb-6">
                <h4 className="text-md font-medium text-slate-700 mb-3">Status Distribution</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {statusDistribution.map(({ status, count, percentage }) => (
                    <div key={status} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${STATUS_MAP[status]?.color.replace('bg-', 'bg-').split(' ')[0]}`}></div>
                        <span className="text-sm font-medium text-slate-700">{STATUS_MAP[status]?.label}</span>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-bold text-slate-800">{count}</div>
                        <div className="text-xs text-slate-500">{percentage.toFixed(1)}%</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Additional Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="w-5 h-5 text-blue-600" />
                    <span className="font-medium text-blue-800">Total Repaid</span>
                  </div>
                  <div className="text-2xl font-bold text-blue-900">${analytics.totalRepaid.toLocaleString()}</div>
                </div>
                
                <div className="p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock3 className="w-5 h-5 text-green-600" />
                    <span className="font-medium text-green-800">Avg Repayment Time</span>
                  </div>
                  <div className="text-2xl font-bold text-green-900">{analytics.averageRepaymentTime.toFixed(1)} days</div>
                </div>
                
                <div className="p-4 bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Award className="w-5 h-5 text-purple-600" />
                    <span className="font-medium text-purple-800">Performance Score</span>
                  </div>
                  <div className="text-2xl font-bold text-purple-900">{analytics.successRate.toFixed(0)}/100</div>
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
          {/* Content wrapper for PDF export */}
          <div id="loan-history-content">
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
              {renderLoanContent()}
            </div>
          )}
          </div>
        </div>
      </div>
    </>
  );
};

export default LoanHistory; 
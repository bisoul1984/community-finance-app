import React, { useState, useEffect } from 'react';
import { getUserLoans, repayLoan } from '../api/loans';
import { Clock, DollarSign, TrendingUp, AlertTriangle, CheckCircle, Download, BarChart3, Filter, Search, Eye, EyeOff, Calendar, Plus, Minus } from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

// Calendar helper functions
function getMonthDays(year, month) {
  const date = new Date(year, month, 1);
  const days = [];
  while (date.getMonth() === month) {
    days.push(new Date(date));
    date.setDate(date.getDate() + 1);
  }
  return days;
}

function getRepaymentStatusForDate(loans, date) {
  const dStr = date.toISOString().slice(0, 10);
  
  // Check for due dates
  const dueLoans = loans.filter(loan => {
    if (!loan.dueDate) return false;
    const loanDueDate = new Date(loan.dueDate).toISOString().slice(0, 10);
    return loanDueDate === dStr;
  });
  
  if (dueLoans.length > 0) {
    const overdueLoans = dueLoans.filter(loan => {
      const daysRemaining = Math.ceil((new Date(loan.dueDate) - new Date()) / (1000 * 60 * 60 * 24));
      return daysRemaining < 0;
    });
    
    if (overdueLoans.length > 0) return 'late';
    return 'upcoming';
  }
  
  // Check for actual repayments
  const repayments = loans.flatMap(loan => loan.repayments || []);
  const rep = repayments.find(r => {
    if (!r.date) return false;
    const repDate = new Date(r.date).toISOString().slice(0, 10);
    return repDate === dStr;
  });
  
  if (rep) return 'paid';
  
  return null;
}

// RepaymentCalendar Component
const RepaymentCalendar = ({ loans, onDateClick }) => {
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [selectedDate, setSelectedDate] = useState(null);
  const days = getMonthDays(currentYear, currentMonth);

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  return (
    <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-6 mb-8">
      <div className="flex items-center justify-between mb-6">
        <button 
          onClick={() => {
            if (currentMonth === 0) {
              setCurrentMonth(11);
              setCurrentYear(currentYear - 1);
            } else {
              setCurrentMonth(currentMonth - 1);
            }
          }} 
          className="p-2 rounded-lg hover:bg-slate-100 transition-colors" 
          title="Previous month" 
          aria-label="Previous month"
        >
          <Minus className="w-4 h-4" />
        </button>
        <h3 className="text-xl font-bold text-slate-800">
          {monthNames[currentMonth]} {currentYear}
        </h3>
        <button 
          onClick={() => {
            if (currentMonth === 11) {
              setCurrentMonth(0);
              setCurrentYear(currentYear + 1);
            } else {
              setCurrentMonth(currentMonth + 1);
            }
          }} 
          className="p-2 rounded-lg hover:bg-slate-100 transition-colors" 
          title="Next month" 
          aria-label="Next month"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>
      
      <div className="grid grid-cols-7 gap-1 text-center text-sm font-medium text-slate-600 mb-3">
        {['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map(d => <div key={d}>{d}</div>)}
      </div>
      
      <div className="grid grid-cols-7 gap-1">
        {Array(days[0].getDay()).fill(null).map((_, i) => <div key={i}></div>)}
        {days.map(day => {
          const status = getRepaymentStatusForDate(loans, day);
          let bg = 'bg-slate-50 text-slate-600';
          let border = '';
          
          if (status === 'paid') {
            bg = 'bg-emerald-100 text-emerald-700 border-emerald-300';
            border = 'border-2';
          } else if (status === 'late') {
            bg = 'bg-red-100 text-red-700 border-red-300';
            border = 'border-2';
          } else if (status === 'upcoming') {
            bg = 'bg-amber-100 text-amber-700 border-amber-300';
            border = 'border-2';
          }
          
          const isToday = day.toDateString() === today.toDateString();
          if (isToday) {
            bg = 'bg-blue-100 text-blue-700 border-blue-300';
            border = 'border-2';
          }
          
          return (
            <div 
              key={day.toISOString()} 
              className={`rounded-lg p-2 cursor-pointer ${bg} ${border} hover:ring-2 ring-slate-300 transition-all duration-200 min-h-[40px] flex items-center justify-center`} 
              title={`${day.toLocaleDateString()} - ${status || 'No payments'}`} 
              aria-label={`${day.toLocaleDateString()} - ${status || 'No payments'}`}
              onClick={() => {
                setSelectedDate(day);
                onDateClick && onDateClick(day, status);
              }}
            >
              {day.getDate()}
            </div>
          );
        })}
      </div>
      
      <div className="flex flex-wrap gap-4 mt-6 text-sm">
        <span className="inline-flex items-center gap-2">
          <span className="w-4 h-4 rounded-full bg-emerald-100 border-2 border-emerald-300"></span>
          Paid
        </span>
        <span className="inline-flex items-center gap-2">
          <span className="w-4 h-4 rounded-full bg-amber-100 border-2 border-amber-300"></span>
          Upcoming
        </span>
        <span className="inline-flex items-center gap-2">
          <span className="w-4 h-4 rounded-full bg-red-100 border-2 border-red-300"></span>
          Late
        </span>
        <span className="inline-flex items-center gap-2">
          <span className="w-4 h-4 rounded-full bg-blue-100 border-2 border-blue-300"></span>
          Today
        </span>
      </div>
      
      {/* Selected Date Details */}
      {selectedDate && (
        <div className="mt-6 p-4 bg-slate-50 rounded-lg">
          <h4 className="font-semibold text-slate-800 mb-3">
            {selectedDate.toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </h4>
          
          {(() => {
            const dStr = selectedDate.toISOString().slice(0, 10);
            
            // Find loans due on this date
            const dueLoans = loans.filter(loan => {
              if (!loan.dueDate) return false;
              const loanDueDate = new Date(loan.dueDate).toISOString().slice(0, 10);
              return loanDueDate === dStr;
            });
            
            // Find repayments made on this date
            const repayments = loans.flatMap(loan => 
              (loan.repayments || []).map(rep => ({ ...rep, loanPurpose: loan.purpose }))
            ).filter(rep => {
              if (!rep.date) return false;
              const repDate = new Date(rep.date).toISOString().slice(0, 10);
              return repDate === dStr;
            });
            
            if (dueLoans.length === 0 && repayments.length === 0) {
              return <p className="text-slate-600">No loan activities on this date.</p>;
            }
            
            return (
              <div className="space-y-3">
                {dueLoans.length > 0 && (
                  <div>
                    <h5 className="font-medium text-slate-700 mb-2">Due Payments:</h5>
                    {dueLoans.map((loan, index) => {
                      const daysRemaining = Math.ceil((new Date(loan.dueDate) - new Date()) / (1000 * 60 * 60 * 24));
                      const isOverdue = daysRemaining < 0;
                      return (
                        <div key={index} className="p-2 bg-white rounded border-l-4 border-amber-400">
                          <p className="font-medium">${loan.amount.toLocaleString()} - {loan.purpose}</p>
                          <p className={`text-sm ${isOverdue ? 'text-red-600' : 'text-slate-600'}`}>
                            {isOverdue ? `Overdue by ${Math.abs(daysRemaining)} days` : 'Due today'}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                )}
                
                {repayments.length > 0 && (
                  <div>
                    <h5 className="font-medium text-slate-700 mb-2">Payments Made:</h5>
                    {repayments.map((repayment, index) => (
                      <div key={index} className="p-2 bg-white rounded border-l-4 border-emerald-400">
                        <p className="font-medium">${repayment.amount.toLocaleString()}</p>
                        <p className="text-sm text-slate-600">{repayment.loanPurpose}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })()}
        </div>
      )}
    </div>
  );
};

const RepaymentAnalytics = ({ loans }) => {
  const totalLoans = loans.length;
  const totalAmount = loans.reduce((sum, loan) => sum + loan.amount, 0);
  const totalRepaid = loans.reduce((sum, loan) => sum + loan.totalRepaid, 0);
  const overdueLoans = loans.filter(loan => {
    if (!loan.dueDate) return false;
    const daysRemaining = Math.ceil((new Date(loan.dueDate) - new Date()) / (1000 * 60 * 60 * 24));
    return daysRemaining < 0;
  }).length;

  const repaymentRate = totalAmount > 0 ? (totalRepaid / totalAmount) * 100 : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-600">Total Loans</p>
            <p className="text-2xl font-bold text-slate-900">{totalLoans}</p>
          </div>
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
            <DollarSign className="w-6 h-6 text-blue-600" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-600">Total Amount</p>
            <p className="text-2xl font-bold text-slate-900">${totalAmount.toLocaleString()}</p>
          </div>
          <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
            <TrendingUp className="w-6 h-6 text-emerald-600" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-600">Repayment Rate</p>
            <p className="text-2xl font-bold text-slate-900">{repaymentRate.toFixed(1)}%</p>
          </div>
          <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center">
            <BarChart3 className="w-6 h-6 text-amber-600" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-600">Overdue Loans</p>
            <p className="text-2xl font-bold text-red-600">{overdueLoans}</p>
          </div>
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
            <AlertTriangle className="w-6 h-6 text-red-600" />
          </div>
        </div>
      </div>
    </div>
  );
};

const PaymentScheduler = ({ loans, onSchedulePayment }) => {
  const [amount, setAmount] = useState('');
  const [scheduleDate, setScheduleDate] = useState('');
  const [frequency, setFrequency] = useState('monthly');

  const handleSchedule = () => {
    if (!amount || !scheduleDate) {
      alert('Please fill in all fields');
      return;
    }

    onSchedulePayment({
      amount: parseFloat(amount),
      scheduleDate,
      frequency
    });

    setAmount('');
    setScheduleDate('');
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-6 mb-8">
      <h3 className="text-xl font-bold text-slate-900 mb-4">Schedule Payment</h3>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Amount</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Enter amount"
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Schedule Date</label>
          <input
            type="date"
            value={scheduleDate}
            onChange={(e) => setScheduleDate(e.target.value)}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Frequency</label>
          <select
            value={frequency}
            onChange={(e) => setFrequency(e.target.value)}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="monthly">Monthly</option>
            <option value="weekly">Weekly</option>
            <option value="biweekly">Bi-weekly</option>
          </select>
        </div>
        <div className="flex items-end">
          <button
            onClick={handleSchedule}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
          >
            Schedule
          </button>
        </div>
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
  const [showPassword, setShowPassword] = useState({});
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [scheduledPayments, setScheduledPayments] = useState([]);
  const [exportFormat, setExportFormat] = useState('pdf');
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'calendar'

  useEffect(() => {
    fetchUserLoans();
  }, []);

  const fetchUserLoans = async () => {
    try {
      const data = await getUserLoans(user.id);
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
      fetchUserLoans();
      setRepaymentAmounts({ ...repaymentAmounts, [loanId]: '' });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to process repayment.');
    }
  };

  const handleAmountChange = (loanId, value) => {
    setRepaymentAmounts({ ...repaymentAmounts, [loanId]: value });
  };

  const handleSchedulePayment = (paymentData) => {
    setScheduledPayments([...scheduledPayments, { ...paymentData, id: Date.now() }]);
    alert('Payment scheduled successfully!');
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
      return 'bg-red-100 text-red-700 border-red-300';
    } else if (status === 'active') {
      return 'bg-blue-100 text-blue-700 border-blue-300';
    } else if (status === 'funded') {
      return 'bg-emerald-100 text-emerald-700 border-emerald-300';
    }
    return 'bg-slate-100 text-slate-700 border-slate-300';
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

  const filteredLoans = loans.filter(loan => {
    const matchesSearch = loan.purpose.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         loan.amount.toString().includes(searchTerm);
    
    if (filter === 'all') return matchesSearch;
    if (filter === 'overdue') {
      const daysRemaining = loan.dueDate ? getDaysRemaining(loan.dueDate) : null;
      return matchesSearch && daysRemaining !== null && daysRemaining < 0;
    }
    if (filter === 'upcoming') {
      const daysRemaining = loan.dueDate ? getDaysRemaining(loan.dueDate) : null;
      return matchesSearch && daysRemaining !== null && daysRemaining >= 0 && daysRemaining <= 7;
    }
    return matchesSearch && loan.status === filter;
  });

  const exportData = () => {
    const data = {
      loans: loans.map(loan => ({
        id: loan._id,
        amount: loan.amount,
        purpose: loan.purpose,
        status: loan.status,
        totalRepaid: loan.totalRepaid,
        remaining: loan.amount - loan.totalRepaid,
        dueDate: loan.dueDate,
        createdAt: loan.createdAt
      })),
      summary: {
        totalLoans: loans.length,
        totalAmount: loans.reduce((sum, loan) => sum + loan.amount, 0),
        totalRepaid: loans.reduce((sum, loan) => sum + loan.totalRepaid, 0),
        exportDate: new Date().toISOString()
      }
    };

    if (exportFormat === 'pdf') {
      generatePDF(data);
    } else if (exportFormat === 'csv') {
      generateCSV(data);
    } else if (exportFormat === 'json') {
      generateJSON(data);
    }
  };

  const generatePDF = (data) => {
    const pdf = new jsPDF();
    const margin = 20;
    let yPosition = margin;

    // Title
    pdf.setFontSize(20);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(31, 41, 55);
    pdf.text('Repayment Tracker Report', margin, yPosition);
    yPosition += 15;

    // Summary
    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Summary', margin, yPosition);
    yPosition += 10;

    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(107, 114, 128);
    pdf.text(`Total Loans: ${data.summary.totalLoans}`, margin, yPosition);
    yPosition += 6;
    pdf.text(`Total Amount: $${data.summary.totalAmount.toLocaleString()}`, margin, yPosition);
    yPosition += 6;
    pdf.text(`Total Repaid: $${data.summary.totalRepaid.toLocaleString()}`, margin, yPosition);
    yPosition += 6;
    pdf.text(`Remaining: $${(data.summary.totalAmount - data.summary.totalRepaid).toLocaleString()}`, margin, yPosition);
    yPosition += 15;

    // Loans
    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(31, 41, 55);
    pdf.text('Loan Details', margin, yPosition);
    yPosition += 10;

    const pageHeight = pdf.internal.pageSize.height;

    data.loans.forEach((loan, index) => {
      if (yPosition > pageHeight - 60) {
        pdf.addPage();
        yPosition = margin;
      }
      
      pdf.setFontSize(14);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(31, 41, 55);
      pdf.text(`Loan ${index + 1}: $${loan.amount.toLocaleString()}`, margin, yPosition);
      yPosition += 8;
      
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'normal');
      pdf.setTextColor(107, 114, 128);
      pdf.text(`Purpose: ${loan.purpose}`, margin + 10, yPosition);
      yPosition += 6;
      pdf.text(`Status: ${loan.status}`, margin + 10, yPosition);
      yPosition += 6;
      pdf.text(`Repaid: $${loan.totalRepaid.toLocaleString()}`, margin + 10, yPosition);
      yPosition += 6;
      pdf.text(`Remaining: $${loan.remaining.toLocaleString()}`, margin + 10, yPosition);
      yPosition += 6;
      
      if (loan.dueDate) {
        pdf.text(`Due Date: ${new Date(loan.dueDate).toLocaleDateString()}`, margin + 10, yPosition);
        yPosition += 6;
      }
      
      yPosition += 10;
    });
    
    // Save the PDF
    pdf.save(`repayment-tracker-${new Date().toISOString().split('T')[0]}.pdf`);
  };

  const generateCSV = (data) => {
    const headers = ['ID', 'Amount', 'Purpose', 'Status', 'Total Repaid', 'Remaining', 'Due Date', 'Created At'];
    const csvContent = [
      headers.join(','),
      ...data.loans.map(loan => [
        loan.id,
        loan.amount,
        `"${loan.purpose}"`,
        loan.status,
        loan.totalRepaid,
        loan.remaining,
        loan.dueDate ? new Date(loan.dueDate).toLocaleDateString() : '',
        new Date(loan.createdAt).toLocaleDateString()
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `repayment-tracker-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const generateJSON = (data) => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `repayment-tracker-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
          <span className="text-slate-600 text-lg">Loading your repayment data...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Repayment Tracker</h1>
            <p className="text-slate-600">Monitor and manage your loan repayments</p>
          </div>
          <div className="flex items-center gap-4 mt-4 md:mt-0">
            <button
              onClick={() => setViewMode(viewMode === 'list' ? 'calendar' : 'list')}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
            >
              {viewMode === 'list' ? <Calendar className="w-4 h-4" /> : <BarChart3 className="w-4 h-4" />}
              {viewMode === 'list' ? 'Calendar View' : 'List View'}
            </button>
            <select
              value={exportFormat}
              onChange={(e) => setExportFormat(e.target.value)}
              className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="pdf">PDF</option>
              <option value="csv">CSV</option>
              <option value="json">JSON</option>
            </select>
            <button
              onClick={exportData}
              className="flex items-center gap-2 bg-slate-600 hover:bg-slate-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
            >
              <Download className="w-4 h-4" />
              Export Data
            </button>
          </div>
        </div>

        {error && (
          <div className="flex items-center bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            <AlertTriangle className="w-5 h-5 mr-2" />
            {error}
          </div>
        )}

        {/* Analytics */}
        <RepaymentAnalytics loans={loans} />

        {/* Payment Scheduler */}
        <PaymentScheduler loans={loans} onSchedulePayment={handleSchedulePayment} />

        {/* Filters and Search */}
        <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search loans by purpose or amount..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-slate-400" />
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Loans</option>
                <option value="overdue">Overdue</option>
                <option value="upcoming">Upcoming (7 days)</option>
                <option value="active">Active</option>
                <option value="funded">Funded</option>
              </select>
            </div>
          </div>
        </div>



        {viewMode === 'list' ? (
          filteredLoans.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <DollarSign className="w-8 h-8 text-slate-400" />
              </div>
              <h3 className="text-lg font-medium text-slate-900 mb-2">No loans found</h3>
              <p className="text-slate-600">
                {searchTerm || filter !== 'all' 
                  ? 'Try adjusting your search or filter criteria.'
                  : 'You don\'t have any active loans requiring repayment.'
                }
              </p>
            </div>
          ) : (
            <div className="grid gap-6">
              {filteredLoans.map((loan) => {
                const daysRemaining = loan.dueDate ? getDaysRemaining(loan.dueDate) : null;
                const isOverdue = daysRemaining !== null && daysRemaining < 0;
                const remainingAmount = loan.amount - loan.totalRepaid;
                const repaymentPercentage = (loan.totalRepaid / loan.amount) * 100;
                
                return (
                  <div key={loan._id} className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
                    {/* Header */}
                    <div className="p-6 border-b border-slate-200">
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-xl font-bold text-slate-900">
                              ${loan.amount.toLocaleString()} Loan
                            </h3>
                            <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(loan.status, loan.dueDate)}`}>
                              {getStatusText(loan.status, loan.dueDate)}
                            </span>
                          </div>
                          <p className="text-slate-600 mb-1">
                            <strong>Purpose:</strong> {loan.purpose}
                          </p>
                          <p className="text-slate-600">
                            <strong>Term:</strong> {loan.term} days • <strong>Created:</strong> {new Date(loan.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        
                        {isOverdue && (
                          <div className="flex items-center gap-2 text-red-600">
                            <AlertTriangle className="w-5 h-5" />
                            <span className="font-medium">Overdue by {Math.abs(daysRemaining)} days</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Progress and Stats */}
                    <div className="p-6 border-b border-slate-200">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                          <p className="text-sm font-medium text-slate-600 mb-1">Repayment Progress</p>
                          <div className="flex items-center gap-2">
                            <div className="flex-1 bg-slate-200 rounded-full h-2">
                              <div 
                                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                                style={{ width: `${repaymentPercentage}%` }}
                              ></div>
                            </div>
                            <span className="text-sm font-medium text-slate-700">{repaymentPercentage.toFixed(1)}%</span>
                          </div>
                          <p className="text-xs text-slate-500 mt-1">
                            ${loan.totalRepaid.toLocaleString()} / ${loan.amount.toLocaleString()}
                          </p>
                        </div>
                        
                        <div>
                          <p className="text-sm font-medium text-slate-600 mb-1">Remaining Amount</p>
                          <p className="text-2xl font-bold text-amber-600">${remainingAmount.toLocaleString()}</p>
                        </div>
                        
                        <div>
                          <p className="text-sm font-medium text-slate-600 mb-1">Due Date</p>
                          <p className="text-lg font-semibold text-slate-900">
                            {loan.dueDate ? new Date(loan.dueDate).toLocaleDateString() : 'Not set'}
                          </p>
                          {loan.dueDate && (
                            <p className={`text-sm ${isOverdue ? 'text-red-600' : 'text-slate-500'}`}>
                              {isOverdue 
                                ? `Overdue by ${Math.abs(daysRemaining)} days`
                                : `${daysRemaining} days remaining`
                              }
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Repayment Form */}
                    <div className="p-6 border-b border-slate-200">
                      <h4 className="text-lg font-semibold text-slate-800 mb-4">Make a Payment</h4>
                      <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1 relative">
                          <input
                            type={showPassword[loan._id] ? "text" : "number"}
                            placeholder="Enter repayment amount"
                            value={repaymentAmounts[loan._id] || ''}
                            onChange={(e) => handleAmountChange(loan._id, e.target.value)}
                            min="1"
                            max={remainingAmount}
                            step="0.01"
                            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword({...showPassword, [loan._id]: !showPassword[loan._id]})}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
                          >
                            {showPassword[loan._id] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                        <button 
                          onClick={() => handleRepayment(loan._id)}
                          disabled={!repaymentAmounts[loan._id] || parseFloat(repaymentAmounts[loan._id]) <= 0 || parseFloat(repaymentAmounts[loan._id]) > remainingAmount}
                          className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                            isOverdue 
                              ? 'bg-red-600 hover:bg-red-700 text-white' 
                              : 'bg-blue-600 hover:bg-blue-700 text-white'
                          } disabled:opacity-50 disabled:cursor-not-allowed`}
                        >
                          {isOverdue ? 'Pay Now' : 'Make Payment'}
                        </button>
                      </div>
                    </div>

                    {/* Recent Payments */}
                    {loan.repayments && loan.repayments.length > 0 && (
                      <div className="p-6">
                        <h4 className="text-lg font-semibold text-slate-800 mb-4">Recent Payments</h4>
                        <div className="space-y-3">
                          {loan.repayments.slice(-5).reverse().map((repayment, index) => (
                            <div key={index} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
                                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                                </div>
                                <div>
                                  <p className="font-medium text-slate-900">${repayment.amount.toLocaleString()}</p>
                                  <p className="text-sm text-slate-500">{new Date(repayment.date).toLocaleDateString()}</p>
                                </div>
                              </div>
                              <span className="text-sm text-slate-500">
                                {new Date(repayment.date).toLocaleTimeString()}
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
          )
        ) : (
          <RepaymentCalendar loans={loans} onDateClick={(date, status) => {
            // This function will be implemented in a future edit to show details for the clicked date
            console.log('Clicked date:', date, 'Status:', status);
          }} />
        )}

        {/* Scheduled Payments */}
        {scheduledPayments.length > 0 && (
          <div className="mt-8">
            <h3 className="text-xl font-bold text-slate-900 mb-4">Scheduled Payments</h3>
            <div className="grid gap-4">
              {scheduledPayments.map((payment) => (
                <div key={payment.id} className="bg-white rounded-xl shadow-lg border border-slate-200 p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-slate-900">${payment.amount.toLocaleString()}</p>
                      <p className="text-sm text-slate-500">Scheduled for {new Date(payment.scheduleDate).toLocaleDateString()}</p>
                    </div>
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                      {payment.frequency}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RepaymentTracker; 
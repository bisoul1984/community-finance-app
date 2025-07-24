import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const PaymentReceiptModal = ({ payment, onClose }) => {
  if (!payment) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-xl shadow-lg max-w-md w-full p-6 relative">
        <button onClick={onClose} className="absolute top-2 right-2 text-slate-400 hover:text-slate-700 text-xl">&times;</button>
        <h3 className="text-lg font-bold text-slate-900 mb-2">Payment Receipt</h3>
        <div className="text-sm text-slate-700 space-y-1 mb-4">
          <div><span className="font-medium">Payment ID:</span> {payment._id}</div>
          <div><span className="font-medium">Type:</span> {payment.paymentType}</div>
          <div><span className="font-medium">Amount:</span> {payment.amount} {payment.currency}</div>
          <div><span className="font-medium">Status:</span> {payment.status}</div>
          <div><span className="font-medium">Date:</span> {new Date(payment.createdAt).toLocaleString()}</div>
          {payment.penalty && (
            <div className="text-rose-600 font-semibold">Penalty: {payment.penalty} {payment.currency}</div>
          )}
          {payment.loanId && (
            <div><span className="font-medium">Loan:</span> {payment.loanId.title || payment.loanId._id}</div>
          )}
        </div>
        <button
          onClick={() => window.print()}
          className="w-full bg-slate-800 hover:bg-slate-900 text-white font-semibold py-2 px-4 rounded-md shadow transition-colors"
        >
          Print Receipt
        </button>
      </div>
    </div>
  );
};

const PaymentHistory = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filter, setFilter] = useState('all');
  const [selectedPayment, setSelectedPayment] = useState(null);

  const fetchPayments = useCallback(async () => {
    try {
      setLoading(true);
      const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
      const response = await axios.get(`${API_URL}/payments/history?page=${currentPage}&limit=10&type=${filter}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      setPayments(response.data.payments);
      setTotalPages(response.data.totalPages);
    } catch (err) {
      console.error('Error fetching payments:', err);
      setError('Failed to load payment history');
    } finally {
      setLoading(false);
    }
  }, [currentPage, filter]);

  useEffect(() => {
    fetchPayments();
  }, [fetchPayments]);

  const formatAmount = (amount, currency = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      case 'refunded':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPaymentTypeIcon = (type) => {
    switch (type) {
      case 'repayment':
        return (
          <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
          </svg>
        );
      case 'funding':
        return (
          <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
          </svg>
        );
      default:
        return (
          <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
          </svg>
        );
    }
  };

  if (loading && payments.length === 0) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-gray-600">Loading payment history...</span>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4">
        <h2 className="text-xl font-bold text-white">Payment History</h2>
        <p className="text-blue-100 text-sm mt-1">Track all your payment transactions</p>
      </div>

      <div className="p-6">
        {/* Filter */}
        <div className="mb-6">
          <div className="flex space-x-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === 'all'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilter('repayment')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === 'repayment'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Repayments
            </button>
            <button
              onClick={() => setFilter('funding')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === 'funding'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Funding
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        {payments.length === 0 ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No payments yet</h3>
            <p className="text-gray-500">Your payment history will appear here once you make transactions.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {payments.map((payment) => (
              <div
                key={payment._id}
                className={`border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow ${payment.penalty ? 'border-rose-400 bg-rose-50' : ''}`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0">
                      {getPaymentTypeIcon(payment.paymentType)}
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">
                        {payment.paymentType === 'repayment' ? 'Loan Repayment' : 'Loan Funding'}
                      </h4>
                      <p className="text-xs text-gray-500">
                        {payment.loanId?.title || 'Loan Payment'}
                      </p>
                      <p className="text-xs text-gray-400">
                        {formatDate(payment.createdAt)}
                      </p>
                      {payment.penalty && (
                        <p className="text-xs text-rose-600 font-semibold">Penalty: {formatAmount(payment.penalty, payment.currency)}</p>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-gray-900">
                      {formatAmount(payment.amount, payment.currency)}
                    </p>
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(payment.status)}`}>
                      {payment.status}
                    </span>
                    <button
                      onClick={() => setSelectedPayment(payment)}
                      className="ml-2 px-2 py-1 text-xs bg-slate-100 hover:bg-slate-200 rounded font-medium text-slate-700 border border-slate-200"
                    >
                      View Receipt
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-6 flex justify-center">
            <nav className="flex space-x-2">
              <button
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <span className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </nav>
          </div>
        )}
      </div>
      {/* Receipt Modal */}
      {selectedPayment && <PaymentReceiptModal payment={selectedPayment} onClose={() => setSelectedPayment(null)} />}
    </div>
  );
};

export default PaymentHistory; 
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { API_ENDPOINTS } from '../config/api';

const Wallet = ({ user }) => {
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('fund');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    console.log('Wallet component mounted with user:', user);
    if (user && user.id) {
      fetchWallet();
    } else {
      console.error('User object is missing or has no id:', user);
      setError('User information not available');
    }
    // eslint-disable-next-line
  }, [user]);

  const fetchWallet = async () => {
    try {
      setLoading(true);
      setError('');
      const token = localStorage.getItem('token');
      console.log('Fetching wallet for user:', user.id);
      console.log('API URL:', `${API_ENDPOINTS.USERS}/${user.id}/wallet`);
      console.log('Token:', token ? 'Present' : 'Missing');
      console.log('API_BASE_URL:', process.env.REACT_APP_API_URL || 'http://localhost:5000/api');
      
      const res = await axios.get(`${API_ENDPOINTS.USERS}/${user.id}/wallet`, {
        headers: { Authorization: `Bearer ${token}` },
        timeout: 10000 // 10 second timeout
      });
      console.log('Wallet response:', res.data);
      setBalance(res.data.walletBalance || 0);
      setTransactions((res.data.walletTransactions || []).reverse());
    } catch (err) {
      console.error('Wallet fetch error:', err);
      console.error('Error message:', err.message);
      console.error('Error code:', err.code);
      console.error('Error response:', err.response?.data);
      console.error('Error status:', err.response?.status);
      
      // Provide more specific error messages
      if (err.code === 'ECONNABORTED') {
        setError('Request timed out. Please try again.');
      } else if (!err.response) {
        setError('Network error. Please check your connection.');
      } else if (err.response.status === 401) {
        setError('Authentication failed. Please log in again.');
      } else if (err.response.status === 404) {
        setError('Wallet not found. Please contact support.');
      } else {
        setError(`Failed to load wallet: ${err.response?.data?.message || err.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!amount || isNaN(amount) || Number(amount) <= 0) {
      setError('Enter a valid amount');
      return;
    }
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const token = localStorage.getItem('token');
      const url = `${API_ENDPOINTS.USERS}/${user.id}/wallet/${type}`;
      console.log('Submitting transaction:', { type, amount, url });
      
      const res = await axios.post(url, { amount: Number(amount) }, {
        headers: { Authorization: `Bearer ${token}` },
        timeout: 10000 // 10 second timeout
      });
      console.log('Transaction response:', res.data);
      setSuccess(type === 'fund' ? 'Wallet funded!' : 'Withdrawal successful!');
      setAmount('');
      fetchWallet();
    } catch (err) {
      console.error('Transaction error:', err);
      console.error('Error message:', err.message);
      console.error('Error code:', err.code);
      console.error('Error response:', err.response?.data);
      
      // Provide more specific error messages
      if (err.code === 'ECONNABORTED') {
        setError('Transaction timed out. Please try again.');
      } else if (!err.response) {
        setError('Network error. Please check your connection.');
      } else if (err.response.status === 401) {
        setError('Authentication failed. Please log in again.');
      } else if (err.response.status === 400) {
        setError(err.response?.data?.message || 'Invalid transaction request.');
      } else {
        setError(err.response?.data?.message || 'Transaction failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full mx-auto py-0 px-0 mt-20 sm:mt-0">
      <h2 className="text-sm sm:text-base lg:text-lg font-bold mb-1 text-slate-900 px-1">My Wallet</h2>
      
      {/* Wallet Balance Card */}
      <div className="bg-white rounded-lg shadow p-1 mb-1 flex flex-col items-center w-full">
        <span className="text-slate-500 text-xs mb-1">Wallet Balance</span>
        {loading ? (
          <div className="flex items-center gap-1 mb-1">
            <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-blue-600"></div>
            <span className="text-sm sm:text-lg lg:text-xl font-bold text-blue-700">Loading...</span>
          </div>
        ) : (
          <span className="text-sm sm:text-lg lg:text-xl font-bold text-blue-700 mb-1">${(balance || 0).toLocaleString()}</span>
        )}
        
        {/* Fund/Withdraw Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-1 items-center mt-1 w-full max-w-xs">
          <select 
            value={type} 
            onChange={e => setType(e.target.value)} 
            className="w-full border rounded px-1 py-1 text-xs"
          >
            <option value="fund">Fund Wallet</option>
            <option value="withdraw">Withdraw</option>
          </select>
          <input
            type="number"
            min="1"
            value={amount}
            onChange={e => setAmount(e.target.value)}
            placeholder="Amount"
            className="w-full border rounded px-1 py-1 text-xs"
          />
          <button 
            type="submit" 
            className="w-full bg-blue-600 text-white px-1 py-1 rounded font-semibold text-xs hover:bg-blue-700 transition-colors" 
            disabled={loading}
          >
            {loading ? 'Processing...' : type === 'fund' ? 'Fund' : 'Withdraw'}
          </button>
        </form>
        
        {/* Messages */}
        {error && (
          <div className="text-red-600 mt-1 text-xs text-center">
            <div>{error}</div>
            <button 
              onClick={fetchWallet}
              className="mt-1 px-1 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700 transition-colors"
            >
              Retry
            </button>
          </div>
        )}
        {success && <div className="text-green-600 mt-1 text-xs text-center">{success}</div>}
      </div>
      
      {/* Transaction History */}
      <div className="bg-white rounded-lg shadow p-1 w-full">
        <h3 className="text-xs sm:text-sm lg:text-base font-semibold mb-1 text-slate-800">Transaction History</h3>
        {transactions.length === 0 ? (
          <div className="text-slate-400 text-center py-1 text-xs">No transactions yet.</div>
        ) : (
          <div className="overflow-x-auto">
            {/* Desktop Table */}
            <table className="min-w-full text-xs sm:text-sm hidden sm:table">
              <thead>
                <tr className="bg-slate-100">
                  <th className="px-1 sm:px-2 lg:px-3 py-1 sm:py-2 text-left">Type</th>
                  <th className="px-1 sm:px-2 lg:px-3 py-1 sm:py-2 text-left">Amount</th>
                  <th className="px-1 sm:px-2 lg:px-3 py-1 sm:py-2 text-left">Date</th>
                  <th className="px-1 sm:px-2 lg:px-3 py-1 sm:py-2 text-left">Description</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((tx, i) => (
                  <tr key={i} className="border-b">
                    <td className="px-1 sm:px-2 lg:px-3 py-1 sm:py-2 capitalize">{tx.type}</td>
                    <td className="px-1 sm:px-2 lg:px-3 py-1 sm:py-2">${(tx.amount || 0).toLocaleString()}</td>
                    <td className="px-1 sm:px-2 lg:px-3 py-1 sm:py-2">{new Date(tx.date).toLocaleString()}</td>
                    <td className="px-1 sm:px-2 lg:px-3 py-1 sm:py-2">{tx.description || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {/* Mobile Cards */}
            <div className="space-y-1 sm:hidden">
              {transactions.map((tx, i) => (
                <div key={i} className="border border-gray-200 rounded-lg p-1 bg-gray-50">
                  <div className="flex justify-between items-start mb-1">
                    <span className="font-medium text-xs capitalize text-blue-600">{tx.type}</span>
                    <span className="font-bold text-xs text-green-600">${(tx.amount || 0).toLocaleString()}</span>
                  </div>
                  <div className="text-xs text-gray-600 mb-1">
                    {new Date(tx.date).toLocaleDateString()} {new Date(tx.date).toLocaleTimeString()}
                  </div>
                  <div className="text-xs text-gray-700">
                    {tx.description || 'No description'}
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

export default Wallet; 
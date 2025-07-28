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
      console.log('API URL:', `/api/users/${user.id}/wallet`);
      console.log('Token:', token ? 'Present' : 'Missing');
      
      const res = await axios.get(`${API_ENDPOINTS.USERS}/${user.id}/wallet`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('Wallet response:', res.data);
      setBalance(res.data.walletBalance || 0);
      setTransactions((res.data.walletTransactions || []).reverse());
    } catch (err) {
      console.error('Wallet fetch error:', err);
      console.error('Error response:', err.response?.data);
      setError('Failed to load wallet info');
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
      const res = await axios.post(url, { amount: Number(amount) }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSuccess(type === 'fund' ? 'Wallet funded!' : 'Withdrawal successful!');
      setAmount('');
      fetchWallet();
    } catch (err) {
      setError(err.response?.data?.message || 'Transaction failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto py-2 sm:py-4 lg:py-6 px-2 sm:px-4 lg:px-6">
      <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-slate-900">My Wallet</h2>
      
             {/* Wallet Balance Card */}
       <div className="bg-white rounded-lg shadow p-3 sm:p-4 lg:p-6 mb-4 sm:mb-6 lg:mb-8 flex flex-col items-center w-full">
        <span className="text-slate-500 text-xs sm:text-sm mb-1">Wallet Balance</span>
        <span className="text-2xl sm:text-3xl font-bold text-blue-700 mb-3 sm:mb-2">${(balance || 0).toLocaleString()}</span>
        
        {/* Fund/Withdraw Form */}
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2 sm:gap-3 items-center mt-4 w-full max-w-lg">
          <select 
            value={type} 
            onChange={e => setType(e.target.value)} 
            className="w-full sm:w-auto border rounded px-3 py-2 text-sm sm:text-base"
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
            className="w-full sm:flex-1 border rounded px-3 py-2 text-sm sm:text-base"
          />
          <button 
            type="submit" 
            className="w-full sm:w-auto bg-blue-600 text-white px-4 py-2 rounded font-semibold text-sm sm:text-base hover:bg-blue-700 transition-colors" 
            disabled={loading}
          >
            {loading ? 'Processing...' : type === 'fund' ? 'Fund' : 'Withdraw'}
          </button>
        </form>
        
        {/* Messages */}
        {error && <div className="text-red-600 mt-3 text-sm sm:text-base text-center">{error}</div>}
        {success && <div className="text-green-600 mt-3 text-sm sm:text-base text-center">{success}</div>}
      </div>
      
             {/* Transaction History */}
       <div className="bg-white rounded-lg shadow p-3 sm:p-4 lg:p-6 w-full">
        <h3 className="text-base sm:text-lg font-semibold mb-4 text-slate-800">Transaction History</h3>
        {transactions.length === 0 ? (
          <div className="text-slate-400 text-center py-4 sm:py-8 text-sm sm:text-base">No transactions yet.</div>
        ) : (
          <div className="overflow-x-auto">
            {/* Desktop Table */}
            <table className="min-w-full text-xs sm:text-sm hidden sm:table">
              <thead>
                <tr className="bg-slate-100">
                  <th className="px-3 sm:px-4 py-2 text-left">Type</th>
                  <th className="px-3 sm:px-4 py-2 text-left">Amount</th>
                  <th className="px-3 sm:px-4 py-2 text-left">Date</th>
                  <th className="px-3 sm:px-4 py-2 text-left">Description</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((tx, i) => (
                  <tr key={i} className="border-b">
                    <td className="px-3 sm:px-4 py-2 capitalize">{tx.type}</td>
                    <td className="px-3 sm:px-4 py-2">${(tx.amount || 0).toLocaleString()}</td>
                    <td className="px-3 sm:px-4 py-2">{new Date(tx.date).toLocaleString()}</td>
                    <td className="px-3 sm:px-4 py-2">{tx.description || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {/* Mobile Cards */}
            <div className="space-y-2 sm:hidden">
              {transactions.map((tx, i) => (
                <div key={i} className="border border-gray-200 rounded-lg p-2 sm:p-3 bg-gray-50">
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-medium text-sm capitalize text-blue-600">{tx.type}</span>
                    <span className="font-bold text-sm text-green-600">${(tx.amount || 0).toLocaleString()}</span>
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
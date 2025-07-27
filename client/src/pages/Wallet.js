import React, { useEffect, useState } from 'react';
import axios from 'axios';

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
      
      const res = await axios.get(`/api/users/${user.id}/wallet`, {
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
      const url = `/api/users/${user.id}/wallet/${type}`;
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
    <div className="max-w-2xl mx-auto py-10 px-4">
      <h2 className="text-2xl font-bold mb-6 text-slate-900">My Wallet</h2>
      <div className="bg-white rounded-lg shadow p-6 mb-8 flex flex-col items-center">
        <span className="text-slate-500 text-sm mb-1">Wallet Balance</span>
        <span className="text-3xl font-bold text-blue-700 mb-2">${(balance || 0).toLocaleString()}</span>
        <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-3 items-center mt-4 w-full max-w-md">
          <select value={type} onChange={e => setType(e.target.value)} className="border rounded px-3 py-2">
            <option value="fund">Fund Wallet</option>
            <option value="withdraw">Withdraw</option>
          </select>
          <input
            type="number"
            min="1"
            value={amount}
            onChange={e => setAmount(e.target.value)}
            placeholder="Amount"
            className="border rounded px-3 py-2 flex-1"
          />
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded font-semibold" disabled={loading}>
            {loading ? 'Processing...' : type === 'fund' ? 'Fund' : 'Withdraw'}
          </button>
        </form>
        {error && <div className="text-red-600 mt-2">{error}</div>}
        {success && <div className="text-green-600 mt-2">{success}</div>}
      </div>
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4 text-slate-800">Transaction History</h3>
        {transactions.length === 0 ? (
          <div className="text-slate-400 text-center">No transactions yet.</div>
        ) : (
          <table className="min-w-full text-sm">
            <thead>
              <tr className="bg-slate-100">
                <th className="px-4 py-2 text-left">Type</th>
                <th className="px-4 py-2 text-left">Amount</th>
                <th className="px-4 py-2 text-left">Date</th>
                <th className="px-4 py-2 text-left">Description</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((tx, i) => (
                <tr key={i} className="border-b">
                  <td className="px-4 py-2 capitalize">{tx.type}</td>
                  <td className="px-4 py-2">${(tx.amount || 0).toLocaleString()}</td>
                  <td className="px-4 py-2">{new Date(tx.date).toLocaleString()}</td>
                  <td className="px-4 py-2">{tx.description || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Wallet; 
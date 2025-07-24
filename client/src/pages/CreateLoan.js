import React, { useState } from 'react';
import { createLoan } from '../api/loans';

const CreateLoan = ({ user, onLoanCreated }) => {
  const [form, setForm] = useState({
    amount: '',
    purpose: '',
    term: '',
    repaymentFrequency: '',
    repaymentStart: '',
    idDocument: null,
    incomeProof: null,
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setForm({ ...form, [name]: files[0] });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      // Prepare form data for file upload
      const formData = new FormData();
      Object.entries(form).forEach(([key, value]) => {
        if (value) formData.append(key, value);
      });
      await createLoan(formData, true); // true = multipart
      setSuccess('Loan request created successfully!');
      setTimeout(() => {
        setLoading(false);
        onLoanCreated();
      }, 1500);
    } catch (err) {
      setLoading(false);
      setError(err.response?.data?.message || 'Failed to create loan request.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-gray-50 flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl border border-slate-100 p-8">
        <h2 className="text-2xl font-bold text-slate-900 mb-6">Create Loan Request</h2>
        {error && (
          <div className="flex items-center bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-4 gap-2">
            <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
            <span>{error}</span>
          </div>
        )}
        {success && (
          <div className="flex items-center bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md mb-4 gap-2">
            <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
            <span>{success}</span>
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-5" encType="multipart/form-data">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Loan Amount ($)</label>
            <input
              type="number"
              name="amount"
              value={form.amount}
              onChange={handleChange}
              placeholder="Enter loan amount"
              min="1"
              required
              className="w-full px-4 py-2 border border-slate-300 rounded-md focus:ring-slate-700 focus:border-slate-700 bg-white text-slate-900"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Purpose</label>
            <textarea
              name="purpose"
              value={form.purpose}
              onChange={handleChange}
              placeholder="Describe what you need the loan for..."
              required
              rows="3"
              className="w-full px-4 py-2 border border-slate-300 rounded-md focus:ring-slate-700 focus:border-slate-700 bg-white text-slate-900 resize-vertical"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Term (days)</label>
            <input
              type="number"
              name="term"
              value={form.term}
              onChange={handleChange}
              placeholder="Enter loan term in days"
              min="1"
              max="365"
              required
              className="w-full px-4 py-2 border border-slate-300 rounded-md focus:ring-slate-700 focus:border-slate-700 bg-white text-slate-900"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Repayment Frequency</label>
            <select
              name="repaymentFrequency"
              value={form.repaymentFrequency}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-slate-300 rounded-md focus:ring-slate-700 focus:border-slate-700 bg-white text-slate-900"
            >
              <option value="">Select frequency</option>
              <option value="weekly">Weekly</option>
              <option value="biweekly">Biweekly</option>
              <option value="monthly">Monthly</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Repayment Start Date</label>
            <input
              type="date"
              name="repaymentStart"
              value={form.repaymentStart}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-slate-300 rounded-md focus:ring-slate-700 focus:border-slate-700 bg-white text-slate-900"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Upload ID Document <span className="text-xs text-slate-400">(PDF, JPG, PNG)</span></label>
            <input
              type="file"
              name="idDocument"
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={handleChange}
              required
              className="w-full px-2 py-1 border border-slate-300 rounded-md bg-white text-slate-900"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Upload Proof of Income <span className="text-xs text-slate-400">(PDF, JPG, PNG)</span></label>
            <input
              type="file"
              name="incomeProof"
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={handleChange}
              required
              className="w-full px-2 py-1 border border-slate-300 rounded-md bg-white text-slate-900"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-slate-800 hover:bg-slate-900 text-white font-semibold py-2 px-4 rounded-md shadow transition-colors disabled:opacity-60"
            disabled={loading}
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin h-5 w-5 mr-2 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path></svg>
                Creating...
              </span>
            ) : (
              'Create Loan Request'
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateLoan; 
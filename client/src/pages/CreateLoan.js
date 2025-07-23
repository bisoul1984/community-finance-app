import React, { useState } from 'react';
import { createLoan } from '../api/loans';

const CreateLoan = ({ user, onLoanCreated }) => {
  const [form, setForm] = useState({ amount: '', purpose: '', term: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!form.amount || !form.purpose || !form.term) {
      setError('Please fill in all fields.');
      return;
    }

    try {
      const loanData = {
        borrowerId: user.id,
        amount: parseFloat(form.amount),
        purpose: form.purpose,
        term: parseInt(form.term)
      };

      await createLoan(loanData);
      setSuccess('Loan request created successfully!');
      setForm({ amount: '', purpose: '', term: '' });
      
      if (onLoanCreated) {
        onLoanCreated();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create loan request.');
    }
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      backgroundColor: '#f1f5f9' 
    }}>
      <form onSubmit={handleSubmit} style={{ 
        backgroundColor: 'white', 
        padding: '2rem', 
        borderRadius: '0.5rem', 
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', 
        width: '100%', 
        maxWidth: '500px' 
      }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1.5rem', textAlign: 'center' }}>
          Request New Loan
        </h2>
        
        {error && <div style={{ color: '#dc2626', marginBottom: '1rem', textAlign: 'center' }}>{error}</div>}
        {success && <div style={{ color: '#059669', marginBottom: '1rem', textAlign: 'center' }}>{success}</div>}
        
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
            Loan Amount ($)
          </label>
          <input
            type="number"
            name="amount"
            placeholder="Enter amount"
            value={form.amount}
            onChange={handleChange}
            min="1"
            step="0.01"
            style={{ 
              width: '100%', 
              padding: '0.5rem', 
              border: '1px solid #d1d5db', 
              borderRadius: '0.375rem' 
            }}
            required
          />
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
            Purpose
          </label>
          <textarea
            name="purpose"
            placeholder="Describe what you need the loan for..."
            value={form.purpose}
            onChange={handleChange}
            rows="4"
            style={{ 
              width: '100%', 
              padding: '0.5rem', 
              border: '1px solid #d1d5db', 
              borderRadius: '0.375rem',
              resize: 'vertical'
            }}
            required
          />
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
            Term (days)
          </label>
          <input
            type="number"
            name="term"
            placeholder="Enter term in days"
            value={form.term}
            onChange={handleChange}
            min="1"
            style={{ 
              width: '100%', 
              padding: '0.5rem', 
              border: '1px solid #d1d5db', 
              borderRadius: '0.375rem' 
            }}
            required
          />
        </div>

        <button type="submit" style={{ 
          width: '100%', 
          backgroundColor: '#2563eb', 
          color: 'white', 
          padding: '0.75rem', 
          borderRadius: '0.375rem', 
          border: 'none',
          cursor: 'pointer',
          fontSize: '1rem',
          fontWeight: '500'
        }}>
          Create Loan Request
        </button>
      </form>
    </div>
  );
};

export default CreateLoan; 
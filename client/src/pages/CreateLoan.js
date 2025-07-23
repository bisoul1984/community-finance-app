import React, { useState } from 'react';
import { createLoan } from '../api/loans';

const CreateLoan = ({ user, onLoanCreated }) => {
  const [form, setForm] = useState({
    amount: '',
    purpose: '',
    term: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      await createLoan(form);
      setSuccess('Loan request created successfully!');
      setTimeout(() => {
        onLoanCreated();
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create loan request.');
    }
  };

  return (
    <div style={{ padding: '2rem', backgroundColor: '#f8fafc', minHeight: '100vh' }}>
      <div style={{ maxWidth: '600px', margin: '0 auto' }}>
        <h2 style={{ color: '#1e40af', marginBottom: '1.5rem' }}>Create Loan Request</h2>
        
        {error && (
          <div style={{ 
            backgroundColor: '#fee2e2', 
            color: '#dc2626', 
            padding: '1rem', 
            borderRadius: '0.375rem', 
            marginBottom: '1rem',
            border: '1px solid #fecaca'
          }}>
            {error}
          </div>
        )}
        
        {success && (
          <div style={{ 
            backgroundColor: '#dcfce7', 
            color: '#059669', 
            padding: '1rem', 
            borderRadius: '0.375rem', 
            marginBottom: '1rem',
            border: '1px solid #bbf7d0'
          }}>
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ 
          backgroundColor: 'white', 
          padding: '2rem', 
          borderRadius: '0.5rem', 
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          border: '1px solid #e5e7eb'
        }}>
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: '#374151', fontWeight: '500' }}>
              Loan Amount ($)
            </label>
            <input
              type="number"
              name="amount"
              value={form.amount}
              onChange={handleChange}
              placeholder="Enter loan amount"
              min="1"
              required
              style={{ 
                width: '100%', 
                padding: '0.75rem', 
                border: '1px solid #d1d5db', 
                borderRadius: '0.375rem',
                fontSize: '1rem'
              }}
            />
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: '#374151', fontWeight: '500' }}>
              Purpose
            </label>
            <textarea
              name="purpose"
              value={form.purpose}
              onChange={handleChange}
              placeholder="Describe what you need the loan for..."
              required
              rows="4"
              style={{ 
                width: '100%', 
                padding: '0.75rem', 
                border: '1px solid #d1d5db', 
                borderRadius: '0.375rem',
                fontSize: '1rem',
                resize: 'vertical'
              }}
            />
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: '#374151', fontWeight: '500' }}>
              Term (days)
            </label>
            <input
              type="number"
              name="term"
              value={form.term}
              onChange={handleChange}
              placeholder="Enter loan term in days"
              min="1"
              max="365"
              required
              style={{ 
                width: '100%', 
                padding: '0.75rem', 
                border: '1px solid #d1d5db', 
                borderRadius: '0.375rem',
                fontSize: '1rem'
              }}
            />
          </div>

          <button 
            type="submit" 
            style={{ 
              width: '100%', 
              backgroundColor: '#2563eb', 
              color: 'white', 
              padding: '0.75rem', 
              border: 'none',
              borderRadius: '0.375rem',
              fontSize: '1rem',
              fontWeight: '500',
              cursor: 'pointer'
            }}
          >
            Create Loan Request
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateLoan; 
import React, { useState } from 'react';
import { signup } from '../api/auth';

const Signup = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'borrower' });
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
      await signup(form);
      setSuccess('Signup successful! You can now log in.');
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed.');
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
        maxWidth: '400px' 
      }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1.5rem', textAlign: 'center' }}>Sign Up</h2>
        {error && <div style={{ color: '#dc2626', marginBottom: '1rem', textAlign: 'center' }}>{error}</div>}
        {success && <div style={{ color: '#059669', marginBottom: '1rem', textAlign: 'center' }}>{success}</div>}
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={form.name}
          onChange={handleChange}
          style={{ 
            width: '100%', 
            marginBottom: '1rem', 
            padding: '0.5rem', 
            border: '1px solid #d1d5db', 
            borderRadius: '0.375rem' 
          }}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          style={{ 
            width: '100%', 
            marginBottom: '1rem', 
            padding: '0.5rem', 
            border: '1px solid #d1d5db', 
            borderRadius: '0.375rem' 
          }}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          style={{ 
            width: '100%', 
            marginBottom: '1rem', 
            padding: '0.5rem', 
            border: '1px solid #d1d5db', 
            borderRadius: '0.375rem' 
          }}
          required
        />
        <select
          name="role"
          value={form.role}
          onChange={handleChange}
          style={{ 
            width: '100%', 
            marginBottom: '1rem', 
            padding: '0.5rem', 
            border: '1px solid #d1d5db', 
            borderRadius: '0.375rem' 
          }}
        >
          <option value="borrower">Borrower</option>
          <option value="lender">Lender</option>
        </select>
        <button type="submit" style={{ 
          width: '100%', 
          backgroundColor: '#2563eb', 
          color: 'white', 
          padding: '0.5rem', 
          borderRadius: '0.375rem', 
          border: 'none',
          cursor: 'pointer'
        }}>Sign Up</button>
      </form>
    </div>
  );
};

export default Signup; 